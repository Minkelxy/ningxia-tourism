import { describe, expect, it } from 'vitest';
import {
  DEFAULT_ARTICLE_CITY_ID,
  renderArticleTemplate,
  validateArticleArgs,
} from './article-templates';

describe('renderArticleTemplate', () => {
  it('travel 模板含 firsthand 与全部 travel 必填字段', () => {
    const out = renderArticleTemplate('travel', 'liangshan-weekend', 'guyuan');
    expect(out).toContain('type: travel');
    expect(out).toContain('status: draft');
    expect(out).toContain('contentKind: firsthand');
    expect(out).toContain('slug: liangshan-weekend');
    expect(out).toContain('cityId: guyuan');
    expect(out).toContain('tripDate:');
    expect(out).toContain('duration:');
    expect(out).toContain('transport:');
    expect(out).toContain('budgetNote:');
    expect(out).toContain('highlights:');
    expect(out).toContain('images/journal/liangshan-weekend/cover.webp');
    expect(out).toContain('## 出发前');
  });

  it('food 模板含 firsthand 与全部 food 必填字段', () => {
    const out = renderArticleTemplate('food', 'yinchuan-noodle', 'yinchuan');
    expect(out).toContain('type: food');
    expect(out).toContain('contentKind: firsthand');
    expect(out).toContain('visitedAt:');
    expect(out).toContain('venueName:');
    expect(out).toContain('cuisine:');
    expect(out).toContain('address:');
    expect(out).toContain('mapQuery:');
    expect(out).toContain('pricePerPerson:');
    expect(out).toContain('dishes:');
    expect(out).toContain('queueNote:');
    expect(out).toContain('suitableFor:');
    expect(out).toContain('revisitNote:');
    expect(out).toContain('## 为什么去');
  });

  it('guide 模板含 editorial 与全部 guide 必填字段', () => {
    const out = renderArticleTemplate('guide', 'ningxia-transport', 'zhongwei');
    expect(out).toContain('type: guide');
    expect(out).toContain('contentKind: editorial');
    expect(out).toContain('reviewedAt:');
    expect(out).toContain('scopeNote:');
    expect(out).toContain('keyPoints:');
    expect(out).toContain('references:');
    expect(out).toContain('## 先看结论');
  });

  it('三套模板均含公共字段与 cover 五要素', () => {
    for (const type of ['travel', 'food', 'guide'] as const) {
      const out = renderArticleTemplate(type, 'common-slug', 'yinchuan');
      expect(out).toContain('status: draft');
      expect(out).toContain('title:');
      expect(out).toContain('excerpt:');
      expect(out).toContain('cover:');
      expect(out).toContain('  src:');
      expect(out).toContain('  alt:');
      expect(out).toContain('  credit:');
      expect(out).toContain('  license:');
      expect(out).toContain('  sourceUrl:');
      expect(out).toContain('gallery:');
      expect(out).toContain('relatedAttractionIds:');
      expect(out).toContain('relatedRouteIds:');
      expect(out).toContain('images/journal/common-slug/cover.webp');
    }
  });
});

describe('validateArticleArgs', () => {
  it('合法参数返回归一化结果', () => {
    expect(validateArticleArgs('travel', 'liangshan-weekend', 'guyuan')).toEqual({
      type: 'travel',
      slug: 'liangshan-weekend',
      cityId: 'guyuan',
      cityIdDefaulted: false,
    });
  });

  it('缺省 cityId 默认 yinchuan 并标记 defaulted', () => {
    expect(validateArticleArgs('food', 'good-slug')).toEqual({
      type: 'food',
      slug: 'good-slug',
      cityId: DEFAULT_ARTICLE_CITY_ID,
      cityIdDefaulted: true,
    });
  });

  it('非法 type 抛错且信息含全部合法值', () => {
    expect(() => validateArticleArgs('blog', 'good-slug', 'yinchuan')).toThrow(/type 非法.*travel.*food.*guide/);
  });

  it('非法 cityId 抛错且信息含全部合法值', () => {
    expect(() => validateArticleArgs('travel', 'good-slug', 'beijing')).toThrow(/cityId 非法.*yinchuan.*shizuishan.*wuzhong.*guyuan.*zhongwei/);
  });

  it('非法 slug 抛错（含大小写、空格、长度不足、前置短横线）', () => {
    expect(() => validateArticleArgs('travel', 'Bad Slug', 'yinchuan')).toThrow(/slug 非法/);
    expect(() => validateArticleArgs('travel', 'a', 'yinchuan')).toThrow(/slug 非法/);
    expect(() => validateArticleArgs('travel', '-leading-dash', 'yinchuan')).toThrow(/slug 非法/);
  });
});
