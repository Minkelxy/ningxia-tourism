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
