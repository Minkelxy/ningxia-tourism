import sharp from 'sharp';
import { mkdirSync, readdirSync } from 'node:fs';
import { dirname, extname, relative, resolve, sep } from 'node:path';

// 从一张源图生成站点所需的 5 个图片变体:
//   <base>.webp / <base>-720.webp / <base>-1440.webp / <base>-720.avif / <base>-1440.avif
// 用法:
//   npx tsx scripts/process-images.ts <源图> <输出基础路径，不含扩展名>
//   npx tsx scripts/process-images.ts --batch <源图目录> <输出目录>
// 例:   npx tsx scripts/process-images.ts /tmp/huoshizhai.jpg public/images/attractions/huoshizhai

const args = process.argv.slice(2);
const isBatch = args[0] === '--batch';
const [source, basePath] = isBatch ? args.slice(1) : args;
if (!source || !basePath || (isBatch && args.length !== 3) || (!isBatch && args.length !== 2)) {
  console.error('用法: npx tsx scripts/process-images.ts <源图> <输出基础路径，不含扩展名>');
  console.error('或:   npx tsx scripts/process-images.ts --batch <源图目录> <输出目录>');
  process.exit(1);
}

const variants = [
  { width: 1440, webp: '.webp', avif: null }, // base 用 1440 宽，只出 webp（校验不要求 base.avif）
  { width: 1440, webp: '-1440.webp', avif: '-1440.avif' },
  { width: 720, webp: '-720.webp', avif: '-720.avif' },
];

async function processImage(sourcePath: string, outputBase: string) {
  mkdirSync(dirname(outputBase), { recursive: true });
  for (const { width, webp, avif } of variants) {
    const img = sharp(sourcePath).resize({ width, withoutEnlargement: true });
    await img.clone().webp({ quality: 82 }).toFile(`${outputBase}${webp}`);
    if (avif) await img.clone().avif({ quality: 60 }).toFile(`${outputBase}${avif}`);
  }
  console.log(`✓ ${sourcePath} → ${outputBase}（${variants.length} 组变体）`);
}

if (!isBatch) {
  await processImage(resolve(source), resolve(process.cwd(), basePath));
  process.exit(0);
}

const sourceDir = resolve(source);
const outputDir = resolve(process.cwd(), basePath);
const supported = new Set(['.jpg', '.jpeg', '.png', '.tif', '.tiff']);

function findSourceImages(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return findSourceImages(path);
    return supported.has(extname(entry.name).toLowerCase()) ? [path] : [];
  });
}

const sources = findSourceImages(sourceDir);
if (sources.length === 0) {
  console.error(`批量目录中没有找到支持的源图（${[...supported].join(', ')}）：${sourceDir}`);
  process.exit(1);
}

for (const sourcePath of sources) {
  const relativePath = relative(sourceDir, sourcePath).replaceAll(sep, '/');
  const outputRelative = relativePath.replace(/\.[^.]+$/i, '');
  await processImage(sourcePath, resolve(outputDir, outputRelative));
}

console.log(`完成：${sources.length} 张源图，共生成 ${sources.length * variants.length} 组变体。`);
