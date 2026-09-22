import { describe, expect, it } from 'vitest';
import { getRouteById, routes } from '../data/routes';
import { MIN_BOUNDS_SPAN, boundsFromCoordinates, buildRoadbookModel, routeSegments } from './roadbook';

describe('路书模型', () => {
  it('全局编号跨天连续，且当天序号从 0 开始', () => {
    for (const route of routes) {
      const model = buildRoadbookModel(route);
      expect(model.nodes.map((node) => node.order)).toEqual(
        Array.from({ length: model.nodes.length }, (_, index) => index + 1),
      );
      for (const day of model.days) {
        expect(day.nodes.map((node) => node.indexInDay)).toEqual(day.nodes.map((_, index) => index));
      }
    }
  });

  it('把停靠点拆成有坐标与仅有查询串两类，覆盖全部 56 个停靠点', () => {
    const models = routes.map(buildRoadbookModel);
    const geocoded = models.flatMap((model) => model.geocodedNodes);
    const queryOnly = models.flatMap((model) => model.queryOnlyNodes);

    // 这两个数字是当前数据的已知事实（41 个可定位景点 + 15 个市区/车站路点）。
    // 若内容增删导致变化，应连同线路图图例的说明一起复核，而不是放宽断言。
    expect(geocoded).toHaveLength(41);
    expect(queryOnly).toHaveLength(15);
    expect(geocoded.length + queryOnly.length).toBe(56);

    for (const node of geocoded) {
      expect(node.isQueryOnly).toBe(false);
      expect(node.coordinates).toBeDefined();
      expect(node.cityId).toBeDefined();
    }
    for (const node of queryOnly) {
      expect(node.isQueryOnly).toBe(true);
      expect(node.coordinates).toBeUndefined();
      expect(node.cityId).toBeUndefined();
    }
  });

  it('无坐标路点只出现在流线图上，不进入地理连线', () => {
    const model = buildRoadbookModel(getRouteById('classic-3day')!);
    expect(model.nodes).toHaveLength(7);
    expect(model.geocodedNodes).toHaveLength(5);
    expect(model.queryOnlyNodes.map((node) => node.title)).toEqual(['怀远观光夜市', '银川前往中卫']);

    for (const segment of routeSegments(model)) {
      expect(segment.nodes.every((node) => node.coordinates)).toBe(true);
    }
  });

  it('按天整理城市、餐食与住宿', () => {
    const model = buildRoadbookModel(getRouteById('classic-3day')!);
    expect(model.days.map((day) => day.cityIds)).toEqual([['yinchuan'], ['yinchuan'], ['zhongwei']]);
    expect(model.days[2].meals).toEqual(['午餐：沙坡头周边', '晚餐：中卫市区']);
    expect(model.days[0].accommodation).toBe('银川市区');
    expect(model.cityIds).toEqual(['yinchuan', 'zhongwei']);
  });

  it('当天只有一个可定位停靠点时仍能安全分段', () => {
    const model = buildRoadbookModel(getRouteById('shizuishan-2day')!);
    const firstDay = model.days[0];
    expect(firstDay.nodes).toHaveLength(3);
    expect(firstDay.nodes.filter((node) => node.coordinates)).toHaveLength(1);

    const segments = routeSegments(model);
    expect(segments[0]).toEqual({ day: 1, nodes: [expect.objectContaining({ title: '沙湖生态旅游区' })] });
    // 单点分段只有点、没有线段，渲染层必须允许 path 退化为空。
    expect(segments[0].nodes).toHaveLength(1);
  });

  it('每条路线的包围盒都不小于最小跨度', () => {
    for (const route of routes) {
      const model = buildRoadbookModel(route);
      expect(model.bounds).not.toBeNull();
      const bounds = model.bounds!;
      expect(bounds.maxLng - bounds.minLng).toBeGreaterThanOrEqual(MIN_BOUNDS_SPAN - 1e-9);
      expect(bounds.maxLat - bounds.minLat).toBeGreaterThanOrEqual(MIN_BOUNDS_SPAN - 1e-9);
      // 包围盒必须真正覆盖所有可定位点。
      for (const node of model.geocodedNodes) {
        expect(node.coordinates!.lng).toBeGreaterThanOrEqual(bounds.minLng);
        expect(node.coordinates!.lng).toBeLessThanOrEqual(bounds.maxLng);
        expect(node.coordinates!.lat).toBeGreaterThanOrEqual(bounds.minLat);
        expect(node.coordinates!.lat).toBeLessThanOrEqual(bounds.maxLat);
      }
    }
  });
});

describe('路书包围盒', () => {
  it('跨度不足时居中扩张，跨度足够时保持原样', () => {
    const tight = boundsFromCoordinates([{ lng: 106.2, lat: 38.5 }, { lng: 106.21, lat: 38.51 }], 0.15)!;
    expect(tight.maxLng - tight.minLng).toBeCloseTo(0.15, 6);
    expect(tight.maxLat - tight.minLat).toBeCloseTo(0.15, 6);
    // 居中：原始中点应保持为扩张后的中点。
    expect((tight.minLng + tight.maxLng) / 2).toBeCloseTo(106.205, 6);

    const wide = boundsFromCoordinates([{ lng: 105.0, lat: 36.0 }, { lng: 106.5, lat: 39.0 }], 0.15)!;
    expect(wide).toEqual({ minLng: 105.0, maxLng: 106.5, minLat: 36.0, maxLat: 39.0 });
  });

  it('没有坐标点时返回 null，交由调用方回退到省界范围', () => {
    expect(boundsFromCoordinates([])).toBeNull();
  });
});
