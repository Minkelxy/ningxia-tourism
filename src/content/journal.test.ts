import { describe, expect, it } from 'vitest';
import { loadJournalEntries, parseJournalSource } from './journal-parser';
import { validateJournalContent } from '../data/validate';

const base = `---\nslug: sample\ntype: travel\nstatus: draft\ncontentKind: demo\ntitle: 测试游记\nexcerpt: 摘要\ncityId: yinchuan\nlocality: 兴庆区\ntags: [测试]\npublishedAt: ''\nupdatedAt: ''\ncover:\n  src: images/attractions/xixia.webp\n  alt: 测试\n  credit: 作者\n  license: CC BY\n  sourceUrl: https://example.com\ngallery: []\nrelatedAttractionIds: []\nrelatedRouteIds: []\ntripDate: ''\nduration: 待填写\ntransport: 待填写\nbudgetNote: 待填写\nhighlights: []\n---\n\n## 正文`;
const editorial = `---\nslug: editorial-sample\ntype: guide\nstatus: published\ncontentKind: editorial\ntitle: 测试专题\nexcerpt: 资料摘要\nauthor: 站点编辑\npublishedAt: 2026-08-15\nupdatedAt: 2026-08-15\nreviewedAt: 2026-08-15\ncityId: guyuan\nlocality: 隆德县\ntags: [资料]\ncover:\n  src: images/attractions/liupanshan.webp\n  alt: 六盘山纪念场景\n  credit: 作者\n  license: CC BY-SA 4.0\n  sourceUrl: https://commons.wikimedia.org/example\ngallery: []\nrelatedAttractionIds: [liupanshan]\nrelatedRouteIds: [red-culture-3day]\nscopeNote: 资料整理，不代表实时开放。\nkeyPoints: [目的地边界, 出发前复核]\nreferences:\n  - label: 官方来源一\n    url: https://whhlyt.nx.gov.cn/one\n    checkedAt: 2026-08-15\n  - label: 官方来源二\n    url: https://whhlyt.nx.gov.cn/two\n    checkedAt: 2026-08-15\n---\n\n## 正文`;

describe('旅行手记 Markdown', () => {
  it('解析类型并补充默认作者', () => { const entry = parseJournalSource(base); expect(entry.type).toBe('travel'); expect(entry.author).toBe('站主手记'); expect(entry.featured).toBe(false); });
  it('阻止重复 slug 发布', () => { const result = loadJournalEntries({ a: base, b: base }); expect(validateJournalContent(result.entries)).toContain('手记 slug 重复: sample'); });
  it('草稿不会出现在公开列表', () => { const result = loadJournalEntries({ a: base }); expect(result.entries.filter((entry) => entry.status === 'published')).toHaveLength(0); });
  it('阻止演示内容误发布', () => { const entry = parseJournalSource(base.replace('status: draft', 'status: published')); expect(validateJournalContent([entry])).toContain('travel:sample: 演示内容不能发布'); });
  it('阻止事件日期晚于发布日期', () => { const entry = parseJournalSource(base.replace('status: draft', 'status: published').replace('contentKind: demo', 'contentKind: firsthand').replace("publishedAt: ''", 'publishedAt: 2026-08-14').replace("updatedAt: ''", 'updatedAt: 2026-08-14').replace("tripDate: ''", 'tripDate: 2026-08-15')); expect(validateJournalContent([entry]).join(' ')).toContain('日期顺序错误'); });
  it('阻止无效景点引用', () => { const entry = parseJournalSource(base.replace('relatedAttractionIds: []', 'relatedAttractionIds: [missing]')); expect(validateJournalContent([entry]).join(' ')).toContain('未发布景点 missing'); });
  it('拒绝缺少 Frontmatter 的内容', () => { expect(() => parseJournalSource('# 普通文本')).toThrow(/Frontmatter/); });
  it('拒绝缺少内容性质声明', () => { expect(() => parseJournalSource(base.replace('contentKind: demo\n', ''))).toThrow(/contentKind/); });
  it('解析并校验资料型旅行专题', () => {
    const entry = parseJournalSource(editorial);
    expect(entry.type).toBe('guide');
    expect(entry.contentKind).toBe('editorial');
    expect(entry.author).toBe('站点编辑');
    expect(entry.featured).toBe(false);
    expect(validateJournalContent([entry])).toEqual([]);
  });
  it('解析首页推荐标记', () => {
    const entry = parseJournalSource(editorial.replace('contentKind: editorial', 'contentKind: editorial\nfeatured: true'));
    expect(entry.featured).toBe(true);
  });
  it('阻止缺少多个来源的旅行专题发布', () => {
    const entry = parseJournalSource(editorial.replace(/\n {2}- label: 官方来源二[\s\S]*?checkedAt: 2026-08-15\n---/, '\n---'));
    expect(validateJournalContent([entry]).join(' ')).toContain('旅行专题字段不完整');
  });
});

describe('手记字段校验具名报错', () => {
  it('缺单个字段时指明 excerpt', () => {
    expect(() => parseJournalSource(base.replace('excerpt: 摘要', 'excerpt: '))).toThrow(/excerpt/);
  });

  it('缺多个字段时一次性列出 slug 与 excerpt', () => {
    const src = base.replace('slug: sample', 'slug: ').replace('excerpt: 摘要', 'excerpt: ');
    expect(() => parseJournalSource(src)).toThrow(/slug/);
    expect(() => parseJournalSource(src)).toThrow(/excerpt/);
  });

  it('contentKind 非法时报错含字段名与当前值', () => {
    expect(() => parseJournalSource(base.replace('contentKind: demo', 'contentKind: blog'))).toThrow(/contentKind.*blog/);
  });

  it('status 非法时报错含字段名与当前值', () => {
    expect(() => parseJournalSource(base.replace('status: draft', 'status: archived'))).toThrow(/status.*archived/);
  });
});
