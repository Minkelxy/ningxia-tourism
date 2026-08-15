import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

// 从一张源图生成站点所需的 5 个图片变体:
//   <base>.webp / <base>-720.webp / <base>-1440.webp / <base>-720.avif / <base>-1440.avif
// 用法: npx tsx scripts/process-images.ts <源图> <输出基础路径，不含扩展名>
// 例:   npx tsx scripts/process-images.ts /tmp/huoshizhai.jpg public/images/attractions/huoshizhai

const [source, basePath] = process.argv.slice(2);
if (!source || !basePath) {
  console.error('用法: npx tsx scripts/process-images.ts <源图> <输出基础路径，不含扩展名>');
  process.exit(1);
}

const out = (path: string) => resolve(process.cwd(), `${basePath}${path}`);
mkdirSync(dirname(out('.webp')), { recursive: true });

const variants = [
  { width: 1440, webp: '.webp', avif: null }, // base 用 1440 宽，只出 webp（校验不要求 base.avif）
  { width: 1440, webp: '-1440.webp', avif: '-1440.avif' },
  { width: 720, webp: '-720.webp', avif: '-720.avif' },
];

for (const { width, webp, avif } of variants) {
  const img = sharp(source).resize({ width, withoutEnlargement: true });
  await img.clone().webp({ quality: 82 }).toFile(out(webp));
  if (avif) await img.clone().avif({ quality: 60 }).toFile(out(avif));
  console.log(`✓ ${webp}${avif ? ` + ${avif}` : ''}（宽 ${width}px）`);
}
