import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { renderArticleTemplate, validateArticleArgs } from '../src/content/article-templates';

const JOURNAL_DIR = resolve(process.cwd(), 'src/content/journal');

const printUsage = () => {
  console.log(
    [
      '用法: npx tsx scripts/new-article.ts <type> <slug> [cityId]',
      '',
      '参数:',
      '  type    文章类型，必填：travel | food | guide',
      '  slug    文件名 slug，必填：小写字母数字与短横线，2-63 字符（如 liangshan-weekend）',
      '  cityId  城市 id，选填：yinchuan | shizuishan | wuzhong | guyuan | zhongwei（默认 yinchuan）',
      '',
      '示例:',
      '  npx tsx scripts/new-article.ts travel liangshan-weekend guyuan',
      '  npx tsx scripts/new-article.ts food yinchuan-noodle',
    ].join('\n'),
  );
};

// 参数校验失败时打印错误并退出，避免裸抛栈轨迹。process.exit 返回 never，调用方拿到的总是合法值。
const validateOrExit = (type: string, slug: string, cityId?: string) => {
  try {
    return validateArticleArgs(type, slug, cityId);
  } catch (error) {
    console.error(`✗ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};

const main = () => {
  const [, , typeArg, slugArg, cityIdArg] = process.argv;
  if (!typeArg || !slugArg) {
    printUsage();
    process.exit(1);
  }

  const { type, slug, cityId, cityIdDefaulted } = validateOrExit(typeArg, slugArg, cityIdArg);
  if (cityIdDefaulted) console.log(`ℹ 未提供 cityId，默认使用 ${cityId}。`);

  const targetPath = resolve(JOURNAL_DIR, `${slug}.md`);
  if (existsSync(targetPath)) {
    console.error(`✗ 文件已存在，拒绝覆盖: ${targetPath}`);
    process.exit(1);
  }

  writeFileSync(targetPath, renderArticleTemplate(type, slug, cityId), 'utf8');

  console.log(`✓ 已生成 src/content/journal/${slug}.md（type=${type}, status=draft）`);
  console.log(
    [
      '下一步：',
      '  1. 填写 frontmatter 必填字段（title/excerpt 等）与正文 body；',
      `  2. 放图到 public/images/journal/${slug}/（封面用 cover.webp）；`,
      '  3. 跑 npx tsx scripts/process-images.ts 生成多分辨率变体；',
      '  4. 再 npm run content:lint 校验。',
    ].join('\n'),
  );
};

main();
