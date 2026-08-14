import { describe, expect, it } from 'vitest';
import { createAmapMarkerUrl, getVerificationFreshness } from './site';

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

describe('内容核验新鲜度', () => {
  const now = new Date('2026-08-15T12:00:00Z');
  it('90 天内标记为近期核验', () => expect(getVerificationFreshness('2026-08-12', now)).toMatchObject({ status: 'current', days: 3 }));
  it('91 至 180 天提示复查', () => expect(getVerificationFreshness('2026-04-01', now).status).toBe('attention'));
  it('超过 180 天提示可能过期', () => expect(getVerificationFreshness('2025-01-01', now).status).toBe('stale'));
});
