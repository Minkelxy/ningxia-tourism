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
    expect(verifiedAttractions).toHaveLength(2);
    expect(reviewAttractions).toHaveLength(9);
    expect(attractions.filter((item) => item.status === 'draft')).toHaveLength(11);
    expect(routes).toHaveLength(7);
    expect(publishedJournalEntries).toHaveLength(0);
  });

  it('区域氛围图和首页级来源不能通过严格核实', () => {
    const sample = { ...verifiedAttractions[0], images: [{ ...verifiedAttractions[0].images[0], alt: '宁夏区域氛围图' }], sources: [{ label: '政府首页', url: 'https://example.com/', kind: 'official' as const }] };
    expect(hasStrictVerificationEvidence(sample)).toBe(false);
  });
});
