import { describe, expect, it } from 'vitest';
import { districtFileByCode, featureCode } from './config';
import {
  containsCoordinates,
  createProjection,
  geometryToPath,
  getFeatureBounds,
  mergeFeatureBounds,
  type GeoFeature,
} from './projection';

const polygon: GeoFeature = {
  type: 'Feature',
  properties: { name: '测试区域', code: '640100', pinyin: 'yinchuan' },
  geometry: {
    type: 'Polygon',
    coordinates: [[[105, 36], [106, 36], [106, 37], [105, 37], [105, 36]]],
  },
};

describe('地图投影工具', () => {
  it('计算单个和多个区域的经纬度范围', () => {
    expect(getFeatureBounds(polygon)).toEqual({ minLng: 105, maxLng: 106, minLat: 36, maxLat: 37 });
    expect(mergeFeatureBounds([polygon, {
      ...polygon,
      geometry: { type: 'Polygon', coordinates: [[[106, 35], [107, 35], [107, 36], [106, 35]]] },
    }])).toEqual({ minLng: 105, maxLng: 107, minLat: 35, maxLat: 37 });
  });

  it('把地理坐标稳定投影到画布并生成闭合路径', () => {
    const project = createProjection(getFeatureBounds(polygon), 200, 200, 20);
    expect(project(105, 36)).toEqual({ x: 20, y: 180 });
    expect(project(106, 37)).toEqual({ x: 180, y: 20 });
    expect(geometryToPath(polygon, project)).toMatch(/^M 20\.00 180\.00 L .+ Z$/);
  });

  it('按当前视图范围筛选坐标', () => {
    const bounds = getFeatureBounds(polygon);
    expect(containsCoordinates(bounds, 105.5, 36.5)).toBe(true);
    expect(containsCoordinates(bounds, 107, 36.5)).toBe(false);
  });

  it('为宁夏五个地级市保留唯一的区县数据入口', () => {
    expect(Object.keys(districtFileByCode)).toEqual(['640100', '640200', '640300', '640400', '640500']);
    expect(new Set(Object.values(districtFileByCode)).size).toBe(5);
    expect(featureCode({ ...polygon, properties: { name: '兴庆区', adcode: 640104 } })).toBe('640104');
  });
});

describe('地图投影边界情况', () => {
  const multiPolygon: GeoFeature = {
    type: 'Feature',
    properties: { name: '多片区域', code: '640100' },
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [[[105, 36], [106, 36], [106, 37], [105, 37], [105, 36]]],
        [[[107, 35], [108, 35], [108, 36], [107, 36], [107, 35]]],
      ],
    },
  };

  it('MultiPolygon 的边界跨越所有子多边形', () => {
    expect(getFeatureBounds(multiPolygon)).toEqual({ minLng: 105, maxLng: 108, minLat: 35, maxLat: 37 });
  });

  it('MultiPolygon 的 geometryToPath 生成两段闭合路径', () => {
    const project = createProjection(getFeatureBounds(multiPolygon), 200, 200, 10);
    const path = geometryToPath(multiPolygon, project);
    // 两段路径意味着出现两次 M 命令（起点）。
    expect(path.match(/M/g)?.length).toBe(2);
    // 每段都以 Z 闭合。
    expect(path.match(/Z/g)?.length).toBe(2);
  });

  it('空 ring 不会破坏路径生成（生成空段）', () => {
    const emptyRingFeature: GeoFeature = {
      type: 'Feature',
      properties: { name: '空环' },
      geometry: { type: 'Polygon', coordinates: [[]] },
    };
    const project = createProjection({ minLng: 105, maxLng: 106, minLat: 36, maxLat: 37 }, 100, 100, 0);
    expect(geometryToPath(emptyRingFeature, project)).toBe('');
  });

  it('零宽/零高视图不会因除零崩溃，仍返回投影函数', () => {
    const project = createProjection({ minLng: 105, maxLng: 105, minLat: 36, maxLat: 36 }, 100, 100, 0);
    expect(typeof project).toBe('function');
    // 退化场景下坐标应被 clamp 到有限数值，不产生 NaN/Infinity。
    const point = project(105, 36);
    expect(Number.isFinite(point.x)).toBe(true);
    expect(Number.isFinite(point.y)).toBe(true);
  });

  it('mergeFeatureBounds 对空数组返回未定义（Infinity）边界', () => {
    const merged = mergeFeatureBounds([]);
    expect(merged.minLng).toBe(Infinity);
    expect(merged.maxLng).toBe(-Infinity);
  });

  it('containsCoordinates 在边界上视为包含（闭区间）', () => {
    const bounds = { minLng: 105, maxLng: 106, minLat: 36, maxLat: 37 };
    expect(containsCoordinates(bounds, 105, 36)).toBe(true);
    expect(containsCoordinates(bounds, 106, 37)).toBe(true);
    expect(containsCoordinates(bounds, 104.999, 36.5)).toBe(false);
    expect(containsCoordinates(bounds, 105.5, 37.001)).toBe(false);
  });
});
