import { describe, expect, it } from 'vitest';
import { guideSources, guideVerifiedAt, seasonGuides, travelChecklist, transportNotes } from './guide';

describe('行前指南数据', () => {
  it('覆盖四季、交通和完整清单', () => {
    expect(seasonGuides.map((item) => item.id)).toEqual(['spring', 'summer', 'autumn', 'winter']);
    expect(transportNotes).toHaveLength(3);
    expect(travelChecklist.length).toBeGreaterThanOrEqual(8);
  });

  it('所有网络来源可追溯且核对日期一致', () => {
    for (const source of guideSources) {
      expect(new URL(source.url).protocol).toBe('https:');
      expect(source.checkedAt).toBe(guideVerifiedAt);
    }
  });
});
