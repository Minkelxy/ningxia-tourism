import type { GeoFeature } from '../map/projection';

/** 缩略图用移动端精简版省界（约 50KB），路线页与路书海报共用。 */
export const PROVINCE_MOBILE_URL = `${import.meta.env.BASE_URL}data/ningxia-province-mobile.json`;

let pending: Promise<GeoFeature[]> | null = null;

/**
 * 省界底图在「详情页缩略图」与「导出海报」之间共享同一次请求。
 * 两者都会等到真正需要时才调用本函数，所以首屏不会被 GeoJSON 拖累。
 */
export function loadProvinceFeatures(): Promise<GeoFeature[]> {
  pending ??= fetch(PROVINCE_MOBILE_URL)
    .then((response) => {
      if (!response.ok) throw new Error('地图数据请求失败');
      return response.json() as Promise<{ type: string; features?: GeoFeature[] }>;
    })
    .then((data) => {
      if (data.type !== 'FeatureCollection' || !data.features?.length) throw new Error('地图数据格式不正确');
      return data.features;
    })
    .catch((error: unknown) => {
      // 失败不缓存：下次进入视口或再次导出时仍可重试。
      pending = null;
      throw error;
    });
  return pending;
}
