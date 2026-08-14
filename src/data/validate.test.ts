import { describe, expect, it } from 'vitest';
import { attractions, publishedAttractions, reviewAttractions, verifiedAttractions } from './attractions';
import { journalEntries, journalErrors, publishedJournalEntries } from '../content/journal';
import { cities } from './cities';
import { routes } from './routes';
import { hasStrictVerificationEvidence, validateContentData } from './validate';

describe('公开内容数据', () => {
  it('通过完整性和引用校验', () => {
    expect(validateContentData(journalEntries, journalErrors)).toEqual([]);
  });

  it('保持首期公开内容数量稳定', () => {
    expect(cities).toHaveLength(5);
    expect(publishedAttractions).toHaveLength(11);
    expect(verifiedAttractions).toHaveLength(9);
    expect(reviewAttractions).toHaveLength(2);
    expect(attractions.filter((item) => item.status === 'draft')).toHaveLength(11);
    expect(routes).toHaveLength(7);
    expect(publishedJournalEntries).toHaveLength(4);
    expect(publishedJournalEntries.every((entry) => entry.type === 'guide' && entry.contentKind === 'editorial')).toBe(true);
  });

  it('五城都有可用于横向决策的编辑建议', () => {
    for (const city of cities) {
      expect(city.suggestedStay).not.toBe('');
      expect(city.arrivalNote).not.toBe('');
      expect(city.bestFor.length).toBeGreaterThanOrEqual(2);
      expect(city.planningTip).not.toBe('');
    }
    expect(cities.find((city) => city.id === 'wuzhong')?.planningTip).toContain('不是同一个地点');
    expect(cities.find((city) => city.id === 'guyuan')?.planningTip).toContain('分属不同县');
  });

  it('首页级来源不能通过严格核实', () => {
    const sample = { ...verifiedAttractions[0], images: [{ ...verifiedAttractions[0].images[0], alt: '宁夏区域氛围图' }], sources: [{ label: '政府首页', url: 'https://example.com/', kind: 'official' as const, level: 'homepage' as const, coverage: [], checkedAt: '2026-08-15' }] };
    expect(hasStrictVerificationEvidence(sample)).toBe(false);
  });

  it('说明清楚且许可完整的区域配图不阻止事实核实', () => {
    const sample = { ...verifiedAttractions[0], images: [{ ...verifiedAttractions[0].images[0], alt: '宁夏区域氛围图（非景点实景）' }] };
    expect(hasStrictVerificationEvidence(sample)).toBe(true);
  });

  it('严格核实必须有标明概况和位置的官方直接专页', () => {
    const sample = { ...verifiedAttractions[0], sources: [{ ...verifiedAttractions[0].sources[0], level: 'directory' as const }] };
    expect(hasStrictVerificationEvidence(sample)).toBe(false);
  });

  it('博物馆与高庙具有直接来源和准确图片，可通过严格核实', () => {
    for (const id of ['ningxiamuseum', 'zhongweigaomiao']) {
      const item = publishedAttractions.find((attraction) => attraction.id === id);
      expect(item?.verificationLevel).toBe('verified');
      expect(hasStrictVerificationEvidence(item!)).toBe(true);
      expect(item?.sources.some((source) => source.level === 'direct' && source.coverage.includes('visit'))).toBe(true);
    }
  });

  it('黄河坛和六盘山条目具有明确目的地边界及直接来源', () => {
    for (const id of ['huanghetan', 'liupanshan']) {
      const item = publishedAttractions.find((attraction) => attraction.id === id);
      expect(item?.verificationLevel).toBe('verified');
      expect(hasStrictVerificationEvidence(item!)).toBe(true);
      expect(item?.sources.some((source) => source.level === 'direct' && source.coverage.includes('location'))).toBe(true);
    }

    const liupanshan = publishedAttractions.find((attraction) => attraction.id === 'liupanshan');
    expect(liupanshan?.name).toBe('六盘山红军长征旅游区');
    expect(liupanshan?.locality).toBe('隆德县');
    expect(liupanshan?.summary).toContain('不指泾源县');
  });
});
