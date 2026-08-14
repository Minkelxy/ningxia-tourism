import { describe, expect, it } from 'vitest';
import { loadJournalEntries, parseJournalSource } from './journal-parser';
import { validateJournalContent } from '../data/validate';

const base = `---\nslug: sample\ntype: travel\nstatus: draft\ntitle: 测试游记\nexcerpt: 摘要\ncityId: yinchuan\nlocality: 兴庆区\ntags: [测试]\ncover:\n  src: images/attractions/xixia.webp\n  alt: 测试\n  credit: 作者\n  license: CC BY\n  sourceUrl: https://example.com\ngallery: []\nrelatedAttractionIds: []\nrelatedRouteIds: []\ntripDate: ''\nduration: 待填写\ntransport: 待填写\nbudgetNote: 待填写\nhighlights: []\n---\n\n## 正文`;

describe('旅行手记 Markdown', () => {
  it('解析类型并补充默认作者', () => { const entry = parseJournalSource(base); expect(entry.type).toBe('travel'); expect(entry.author).toBe('站主手记'); });
  it('阻止重复 slug 发布', () => { const result = loadJournalEntries({ a: base, b: base }); expect(validateJournalContent(result.entries)).toContain('手记 slug 重复: sample'); });
  it('草稿不会出现在公开列表', () => { const result = loadJournalEntries({ a: base }); expect(result.entries.filter((entry) => entry.status === 'published')).toHaveLength(0); });
  it('阻止无效景点引用', () => { const entry = parseJournalSource(base.replace('relatedAttractionIds: []', 'relatedAttractionIds: [missing]')); expect(validateJournalContent([entry]).join(' ')).toContain('未发布景点 missing'); });
  it('拒绝缺少 Frontmatter 的内容', () => { expect(() => parseJournalSource('# 普通文本')).toThrow(/Frontmatter/); });
});
