import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { attractions, publishedAttractions, reviewAttractions, verifiedAttractions } from '../src/data/attractions';
import { cities } from '../src/data/cities';
import { routes } from '../src/data/routes';
import { assertValidContentData } from '../src/data/validate';
import { loadJournalFiles } from './load-journal-files';

// 类型安全削弱检测：扫描 src/types/index.ts，禁止在 export type 联合类型中以
// `| string` 形式放宽枚举，避免运行时混入未定义枚举值。
const typesSource = readFileSync(resolve('src', 'types', 'index.ts'), 'utf8');
const widenedTypePattern = /^export\s+type\s+\w+\s*=.*\|\s*string\b/m;
const widenedMatch = typesSource.match(new RegExp(widenedTypePattern.source, 'gm'));
if (widenedMatch) {
  throw new Error(`类型安全削弱检测：src/types/index.ts 中存在 '\u007C string' 联合类型，请移除：\n${widenedMatch.join('\n')}`);
}

const journal = loadJournalFiles();
assertValidContentData(journal.entries, journal.errors);
const publicFirsthand = journal.entries.filter((item) => item.status === 'published' && item.contentKind === 'firsthand');
const publicEditorial = journal.entries.filter((item) => item.status === 'published' && item.type === 'guide' && item.contentKind === 'editorial');

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
  throw new Error(`检测到 src/data 与 public/data 重复 JSON 双写：\n- ${duplicated.map((name) => basename(name)).join('\n- ')}`);
}

for (const attraction of publishedAttractions) {
  for (const image of attraction.images) {
    const base = image.src.replace(/\.webp$/i, '');
    for (const suffix of ['.webp', '-720.webp', '-1440.webp', '-720.avif', '-1440.avif']) {
      const file = resolve('public', `${base}${suffix}`);
      if (!existsSync(file)) throw new Error(`${attraction.id}: 缺少本地图片 ${file}`);
    }
  }
}
for (const entry of publicFirsthand) {
  for (const image of [entry.cover, ...entry.gallery]) {
    const base = image.src.replace(/\.webp$/i, '');
    for (const suffix of ['.webp', '-720.webp', '-1440.webp', '-720.avif', '-1440.avif']) {
      const file = resolve('public', `${base}${suffix}`);
      if (!existsSync(file)) throw new Error(`${entry.slug}: 缺少本地图片 ${file}`);
    }
  }
}
console.log(`内容数据校验通过：${publishedAttractions.length} 个公开景点（${verifiedAttractions.length} 个已核实、${reviewAttractions.length} 个待复核）、${attractions.filter((item) => item.status === 'draft').length} 个草稿景点、${cities.length} 个城市、${routes.length} 条路线、${publicFirsthand.length} 篇公开亲历、${publicEditorial.length} 篇旅行专题。`);
