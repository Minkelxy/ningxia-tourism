import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { attractions, publishedAttractions, reviewAttractions, verifiedAttractions } from '../src/data/attractions';
import { cities } from '../src/data/cities';
import { routes } from '../src/data/routes';
import { assertValidContentData } from '../src/data/validate';
import { loadJournalFiles } from './load-journal-files';

const journal = loadJournalFiles();
assertValidContentData(journal.entries, journal.errors);
const publicFirsthand = journal.entries.filter((item) => item.status === 'published' && item.contentKind === 'firsthand');
const publicEditorial = journal.entries.filter((item) => item.status === 'published' && item.type === 'guide' && item.contentKind === 'editorial');
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
