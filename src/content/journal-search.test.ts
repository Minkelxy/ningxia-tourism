import { describe, expect, it } from 'vitest';
import type { EditorialJournal } from '../types';
import { filterJournalEntries } from './journal-search';

const entry = (overrides: Partial<EditorialJournal> = {}): EditorialJournal => ({
  slug: 'shahu-day', type: 'guide', status: 'published', contentKind: 'editorial', featured: false,
  title: '沙湖半日还是一日', excerpt: '先按观鸟和沙水项目选择', author: '站点编辑',
  publishedAt: '2026-08-15', updatedAt: '2026-08-15', cityId: 'shizuishan', locality: '平罗县',
  tags: ['沙湖', '亲子'], cover: { src: 'cover.webp', alt: '沙湖', credit: '作者', license: 'CC', sourceUrl: 'https://example.com' },
  gallery: [], relatedAttractionIds: ['shahu'], relatedRouteIds: [], body: '正文', reviewedAt: '2026-08-15',
  scopeNote: '不承诺游船开放', keyPoints: ['大风天减少水上项目'], references: [], ...overrides,
});

describe('旅行手记搜索', () => {
  const entries = [entry(), entry({ slug: 'guyuan', title: '固原两日历史线', excerpt: '石窟与长征主题分开安排', cityId: 'guyuan', locality: '隆德县', tags: ['石窟', '红色文化'], keyPoints: ['须弥山与六盘山分日安排'] })];

  it('可搜索标题、地点、标签与专题要点', () => {
    expect(filterJournalEntries(entries, { q: '沙湖', city: 'all', tag: 'all' })).toHaveLength(1);
    expect(filterJournalEntries(entries, { q: '隆德', city: 'all', tag: 'all' })[0].slug).toBe('guyuan');
    expect(filterJournalEntries(entries, { q: '分日安排', city: 'all', tag: 'all' })[0].slug).toBe('guyuan');
  });

  it('组合城市、标签与关键词筛选', () => {
    expect(filterJournalEntries(entries, { q: '观鸟', city: 'shizuishan', tag: '亲子' })).toHaveLength(1);
    expect(filterJournalEntries(entries, { q: '观鸟', city: 'guyuan', tag: 'all' })).toHaveLength(0);
  });
});
