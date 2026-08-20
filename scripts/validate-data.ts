import { attractions, publishedAttractions, reviewAttractions, verifiedAttractions } from '../src/data/attractions';
import { cities } from '../src/data/cities';
import { routes } from '../src/data/routes';
import { loadJournalFiles } from './load-journal-files';
import { collectContentErrors } from './content-check';

// 复用 content-lint 的收集式校验逻辑：发现任一错误即 throw，保持构建期 fail-fast。
const errors = collectContentErrors();
if (errors.length) throw new Error(`内容数据校验失败：\n- ${errors.join('\n- ')}`);

const journal = loadJournalFiles();
const publicFirsthand = journal.entries.filter((item) => item.status === 'published' && item.contentKind === 'firsthand');
const publicEditorial = journal.entries.filter((item) => item.status === 'published' && item.type === 'guide' && item.contentKind === 'editorial');

console.log(`内容数据校验通过：${publishedAttractions.length} 个公开景点（${verifiedAttractions.length} 个已核实、${reviewAttractions.length} 个待复核）、${attractions.filter((item) => item.status === 'draft').length} 个草稿景点、${cities.length} 个城市、${routes.length} 条路线、${publicFirsthand.length} 篇公开亲历、${publicEditorial.length} 篇旅行专题。`);
