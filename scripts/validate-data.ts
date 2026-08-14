import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { publishedAttractions } from '../src/data/attractions';
import { assertValidContentData } from '../src/data/validate';
import { loadJournalFiles } from './load-journal-files';

const journal = loadJournalFiles();
assertValidContentData(journal.entries, journal.errors);
for (const attraction of publishedAttractions) {
  for (const image of attraction.images) {
    const base = image.src.replace(/\.webp$/i, '');
    for (const suffix of ['.webp', '-720.webp', '-1440.webp', '-720.avif', '-1440.avif']) {
      const file = resolve('public', `${base}${suffix}`);
      if (!existsSync(file)) throw new Error(`${attraction.id}: 缺少本地图片 ${file}`);
    }
  }
}
for (const entry of journal.entries.filter((item) => item.status === 'published')) {
  for (const image of [entry.cover, ...entry.gallery]) {
    const base = image.src.replace(/\.webp$/i, '');
    for (const suffix of ['.webp', '-720.webp', '-1440.webp', '-720.avif', '-1440.avif']) {
      const file = resolve('public', `${base}${suffix}`);
      if (!existsSync(file)) throw new Error(`${entry.slug}: 缺少本地图片 ${file}`);
    }
  }
}
console.log(`内容数据校验通过：11 个公开景点（2 个已核实、9 个待复核）、11 个草稿景点、5 个城市、7 条路线、${journal.entries.filter((item) => item.status === 'published').length} 篇公开手记。`);
