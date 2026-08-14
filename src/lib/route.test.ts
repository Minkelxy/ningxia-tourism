import { describe, expect, it } from 'vitest';
import { getRouteById } from '../data/routes';
import { getRouteEvidenceSummary } from './route';

describe('路线证据覆盖', () => {
  it('区分已核实、待复核与普通地点停靠', () => {
    const route = getRouteById('classic-3day');
    expect(route).toBeDefined();
    expect(getRouteEvidenceSummary(route!)).toEqual({
      totalStops: 7,
      verifiedStops: 5,
      reviewStops: 0,
      ordinaryStops: 2,
      cityIds: ['yinchuan', 'zhongwei'],
    });
  });

  it('七条路线都有可比较的节奏与体力画像', () => {
    for (const route of ['quick-1day', 'weekend-2day', 'classic-3day', 'in-depth-4day', 'panorama-5day', 'red-culture-3day', 'food-3day'].map((id) => getRouteById(id)!)) {
      expect(['relaxed', 'balanced', 'intensive']).toContain(route.pace);
      expect(['low', 'medium', 'high']).toContain(route.walkingLevel);
      expect(route.transportSummary.length).toBeGreaterThan(8);
    }
  });
});
