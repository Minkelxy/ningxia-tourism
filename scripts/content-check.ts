import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { publishedAttractions } from '../src/data/attractions';
import { validateContentData } from '../src/data/validate';
import { loadJournalFiles } from './load-journal-files';

// 收集全部内容校验错误（收集式，不中途抛出）。
// content-lint 与 validate-data 共用此逻辑：前者分组输出供作者一次看全，
// 后者发现任一错误即 throw 令构建期 fail-fast。错误信息保持单行以便分组与汇总。
export const collectContentErrors = (): string[] => {
  const errors: string[] = [];

  // 类型安全削弱检测：扫描 src/types/index.ts，禁止在 export type 联合类型中以
  // `| string` 形式放宽枚举，避免运行时混入未定义枚举值。
  const typesSource = readFileSync(resolve('src', 'types', 'index.ts'), 'utf8');
  const widenedTypePattern = /^export\s+type\s+\w+\s*=.*\|\s*string\b/m;
  const widenedMatch = typesSource.match(new RegExp(widenedTypePattern.source, 'gm'));
  if (widenedMatch) {
    errors.push(`类型安全削弱检测：src/types/index.ts 中存在 '| string' 联合类型，请移除：${widenedMatch.join('；')}`);
  }

  // 手记解析 + 内容/景点/城市/路线等全量校验（收集式，不中途抛出）。
  const journal = loadJournalFiles();
  errors.push(...validateContentData(journal.entries, journal.errors));

  const publicFirsthand = journal.entries.filter((item) => item.status === 'published' && item.contentKind === 'firsthand');

  // 反糟粕检查：检测 src/data/ 与 public/data/ 是否存在同名 JSON 双写（重复维护同一份数据）。
  const srcDataDir = resolve('src', 'data');
  const publicDataDir = resolve('public', 'data');
  const collectJsonBasenames = (dir: string): Set<string> => {
    if (!existsSync(dir)) return new Set();
    const result = new Set<string>();
    const walk = (current: string) => {
      for (const entry of readdirSync(current, { withFileTypes: true })) {
        const fullPath = resolve(current, entry.name);
        if (entry.isDirectory()) walk(fullPath);
        else if (entry.isFile() && entry.name.endsWith('.json')) result.add(entry.name);
      }
    };
    walk(dir);
    return result;
  };
  const srcJsonNames = collectJsonBasenames(srcDataDir);
  const publicJsonNames = collectJsonBasenames(publicDataDir);
  const duplicated = [...srcJsonNames].filter((name) => publicJsonNames.has(name));
  if (duplicated.length) {
    errors.push(`检测到 src/data 与 public/data 重复 JSON 双写：${duplicated.join('、')}`);
  }

  // 图片变体存在性检查：每张图片需具备 .webp/-720.webp/-1440.webp/-720.avif/-1440.avif 变体。
  for (const attraction of publishedAttractions) {
    for (const image of attraction.images) {
      const base = image.src.replace(/\.webp$/i, '');
      for (const suffix of ['.webp', '-720.webp', '-1440.webp', '-720.avif', '-1440.avif']) {
        const file = resolve('public', `${base}${suffix}`);
        if (!existsSync(file)) errors.push(`${attraction.id}: 缺少本地图片 ${file}`);
      }
    }
  }
  for (const entry of publicFirsthand) {
    for (const image of [entry.cover, ...entry.gallery]) {
      const base = image.src.replace(/\.webp$/i, '');
      for (const suffix of ['.webp', '-720.webp', '-1440.webp', '-720.avif', '-1440.avif']) {
        const file = resolve('public', `${base}${suffix}`);
        if (!existsSync(file)) errors.push(`${entry.slug}: 缺少本地图片 ${file}`);
      }
    }
  }

  return errors;
};
