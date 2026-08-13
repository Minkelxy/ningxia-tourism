import { describe, expect, it } from 'vitest';
import { createAmapMarkerUrl } from './site';

describe('高德外部入口', () => {
  it('使用 WGS84 坐标创建地点链接', () => {
    const url = new URL(createAmapMarkerUrl('沙坡头', { lng: 105.004, lat: 37.471 }));
    expect(url.pathname).toBe('/marker');
    expect(url.searchParams.get('coordinate')).toBe('wgs84');
    expect(url.searchParams.get('callnative')).toBe('1');
    expect(url.searchParams.get('name')).toBe('沙坡头');
  });

  it('缺少坐标时退化为名称搜索', () => {
    const url = new URL(createAmapMarkerUrl('宁夏博物馆'));
    expect(url.pathname).toBe('/search');
    expect(url.searchParams.get('keyword')).toBe('宁夏博物馆');
  });
});
