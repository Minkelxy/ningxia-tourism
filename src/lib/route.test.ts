import { describe, expect, it } from 'vitest';
import { getRouteById } from '../data/routes';
import { getRouteEvidenceSummary } from './route';

describe('路线证据覆盖', () => {
  it('区分已核实、待复核与普通地点停靠', () => {
    const route = getRouteById('classic-3day');
    expect(route).toBeDefined();
    expect(getRouteEvidenceSummary(route!)).toEqual({
      totalStops: 7,
      verifiedStops: 3,
      reviewStops: 2,
      ordinaryStops: 2,
      cityIds: ['yinchuan', 'zhongwei'],
    });
  });
});
