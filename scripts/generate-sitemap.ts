import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { publishedAttractions } from '../src/data/attractions';
import { cities } from '../src/data/cities';
import { publishedFoods } from '../src/data/foods';
import { routes } from '../src/data/routes';
import { guideVerifiedAt } from '../src/data/guide';
import { loadJournalFiles } from './load-journal-files';

const base = 'https://minkelxy.github.io/ningxia-tourism';
const journal = loadJournalFiles();
if (journal.errors.length) throw new Error(journal.errors.join('\n'));
const articles = journal.entries.filter((item) => item.status === 'published'
  && ((item.type === 'guide' && item.contentKind === 'editorial') || (item.type !== 'guide' && item.contentKind === 'firsthand')));
const latest = (dates: string[]) => dates.filter(Boolean).sort().at(-1);
const attractionDate = latest(publishedAttractions.map((item) => item.verifiedAt));
const routeDate = latest(routes.map((item) => item.verifiedAt));
const foodDate = latest(publishedFoods.map((item) => item.verifiedAt));
const journalDate = latest(articles.map((item) => item.updatedAt));
const allDate = latest([attractionDate, routeDate, foodDate, journalDate].filter(Boolean) as string[]);

const urls: Array<{ path: string; lastmod?: string }> = [
  { path: '/', lastmod: allDate },
  { path: '/attractions', lastmod: attractionDate },
  { path: '/foods', lastmod: foodDate },
  { path: '/routes', lastmod: routeDate },
  { path: '/cities', lastmod: attractionDate },
  { path: '/journal', lastmod: journalDate },
  { path: '/guide', lastmod: guideVerifiedAt },
  { path: '/about', lastmod: allDate },
  ...publishedAttractions.map((item) => ({ path: `/attraction/${item.id}`, lastmod: item.verifiedAt })),
  ...publishedFoods.map((item) => ({ path: `/food/${item.id}`, lastmod: item.verifiedAt })),
  ...cities.map((city) => ({ path: `/city/${city.id}`, lastmod: latest(publishedAttractions.filter((item) => item.cityId === city.id).map((item) => item.verifiedAt)) })),
  ...routes.map((item) => ({ path: `/routes/${item.id}`, lastmod: item.verifiedAt })),
  ...articles.map((item) => ({ path: `/journal/${item.type}/${item.slug}`, lastmod: item.updatedAt })),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((item) => `  <url><loc>${base}${item.path}</loc>${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
mkdirSync(resolve('dist'), { recursive: true });
writeFileSync(resolve('dist/sitemap.xml'), xml, 'utf8');
console.log(`已生成 sitemap.xml，共 ${urls.length} 个公开页面。`);
