import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { publishedAttractions } from '../src/data/attractions';
import { cities } from '../src/data/cities';
import { routes } from '../src/data/routes';
import { loadJournalFiles } from './load-journal-files';

const base = 'https://minkelxy.github.io/ningxia-tourism';
const journal = loadJournalFiles();
if (journal.errors.length) throw new Error(journal.errors.join('\n'));
const paths = [
  '/', '/attractions', '/routes', '/cities', '/journal', '/about',
  ...publishedAttractions.map((item) => `/attraction/${item.id}`),
  ...cities.map((item) => `/city/${item.id}`),
  ...routes.map((item) => `/routes/${item.id}`),
  ...journal.entries.filter((item) => item.status === 'published').map((item) => `/journal/${item.type}/${item.slug}`),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${base}${path}</loc></url>`).join('\n')}\n</urlset>\n`;
mkdirSync(resolve('dist'), { recursive: true });
writeFileSync(resolve('dist/sitemap.xml'), xml, 'utf8');
console.log(`已生成 sitemap.xml，共 ${paths.length} 个公开页面。`);
