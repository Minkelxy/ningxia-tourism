import { describe, expect, it } from 'vitest';
import { getRouteById, routes } from '../data/routes';
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

  it('全部路线都有可比较的节奏与体力画像', () => {
    for (const route of routes) {
      expect(['relaxed', 'balanced', 'intensive']).toContain(route.pace);
      expect(['low', 'medium', 'high']).toContain(route.walkingLevel);
      expect(route.transportSummary.length).toBeGreaterThan(8);
    }
  });
});
