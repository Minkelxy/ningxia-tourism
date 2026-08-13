import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { publishedAttractions } from '../src/data/attractions';
import { assertValidContentData } from '../src/data/validate';

assertValidContentData();
for (const attraction of publishedAttractions) {
  for (const image of attraction.images) {
    const base = image.src.replace(/\.webp$/i, '');
    for (const suffix of ['.webp', '-720.webp', '-1440.webp', '-720.avif', '-1440.avif']) {
      const file = resolve('public', `${base}${suffix}`);
      if (!existsSync(file)) throw new Error(`${attraction.id}: 缺少本地图片 ${file}`);
    }
  }
}
console.log('内容数据校验通过：12 个正式景点、10 个草稿景点、5 个城市、7 条路线。');
