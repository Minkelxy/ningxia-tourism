import type { KeyboardEvent } from 'react';
import type { CityId, Coordinates, SourceRef } from '../../types';
import type { GeoFeature } from './projection';

export const mapView = { width: 720, height: 920 } as const;

export const cityColors: Record<CityId, string> = {
  yinchuan: '#c89d4d',
  shizuishan: '#6f9b7d',
  wuzhong: '#d17c58',
  guyuan: '#718b69',
  zhongwei: '#b98656',
};

interface HSL {
  h: number; // 0-360
  s: number; // 0-1
  l: number; // 0-1
}

export const hexToHsl = (hex: string): HSL => {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }
  return { h, s, l };
};

export const hslToHex = ({ h, s, l }: HSL): string => {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }
  const to255 = (v: number) => Math.max(0, Math.min(255, Math.round((v + m) * 255)));
  return `#${[to255(r), to255(g), to255(b)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
};

/**
 * Deterministically derive `count` distinct district colors from `cityId`'s base color.
 *
 * The algorithm alternates lightness around the base (down first, then up) while
 * slightly nudging hue/saturation so that small `count` values (2-6) still yield
 * visually separable swatches while staying within the same city palette.
 */
export const getDistrictColors = (cityId: CityId, count: number): string[] => {
  if (count <= 0) return [];
  const base = hexToHsl(cityColors[cityId]);
  // Hue offsets (degrees) – kept small (≤ ±8) so Yinchuan (~39°) family
  // never leaves the [30, 50] brown corridor (per AC-2).
  const hueOffsets = [0, -3, 5, -6, 7, -8, 6, -4];
  // Lightness offsets – alternate darker/brighter around base for contrast.
  const lightnessOffsets = [-0.14, 0.12, -0.08, 0.1, -0.17, 0.16, -0.04, 0.2];
  // Saturation offsets – complement lightness changes to keep colors rich.
  const satOffsets = [0.05, -0.06, 0.03, -0.03, 0.09, -0.07, 0.01, 0.05];

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const results: string[] = [];
  for (let i = 0; i < count; i++) {
    const h = clamp(base.h + (hueOffsets[i] ?? 0), 0, 360);
    const s = clamp(base.s + (satOffsets[i] ?? 0), 0.18, 0.78);
    const l = clamp(base.l + (lightnessOffsets[i] ?? 0), 0.3, 0.78);
    results.push(hslToHex({ h, s, l }));
  }
  return results;
};

/**
 * Build a stable featureCode -> color map for a given city's district feature list.
 * Order in the returned map matches `districts` order for deterministic display.
 */
export const buildDistrictColorMap = (
  cityId: CityId,
  districts: Array<{ code: string; index: number }>,
): Record<string, string> => {
  const palette = getDistrictColors(cityId, districts.length);
  const map: Record<string, string> = {};
  districts.forEach((d, i) => {
    map[d.code] = palette[i] ?? palette[0];
  });
  return map;
};

export const districtFileByCode: Record<string, CityId> = {
  '640100': 'yinchuan',
  '640200': 'shizuishan',
  '640300': 'wuzhong',
  '640400': 'guyuan',
  '640500': 'zhongwei',
};

export const cityIdFromFeature = (feature?: GeoFeature | null) => feature?.properties.pinyin as CityId | undefined;
export const featureName = (feature?: GeoFeature | null) => feature?.properties.fullname || feature?.properties.name || '';
export const featureCode = (feature?: GeoFeature | null) => String(feature?.properties.code ?? feature?.properties.adcode ?? '');

export const activateWithKeyboard = (event: KeyboardEvent<SVGElement>, action: () => void) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  action();
};

export interface GovernmentMarker {
  id: string;
  name: string;
  level: 'province-capital' | 'city-capital';
  cityId?: CityId;
  coordinates: Coordinates;
  sources: SourceRef[];
  verifiedAt: string;
}

export const governmentMarkers: GovernmentMarker[] = [
  {
    id: 'ningxia-government',
    name: '宁夏回族自治区人民政府',
    level: 'province-capital',
    coordinates: { lng: 106.23, lat: 38.487 },
    sources: [
      {
        label: '宁夏回族自治区人民政府门户网站',
        url: 'https://www.nx.gov.cn',
        kind: 'official',
        level: 'homepage',
        coverage: ['location'],
        checkedAt: '2026-08-17',
      },
    ],
    verifiedAt: '2026-08-17',
  },
  {
    id: 'yinchuan-government',
    name: '银川市人民政府',
    level: 'city-capital',
    cityId: 'yinchuan',
    coordinates: { lng: 106.23, lat: 38.487 },
    sources: [
      {
        label: '银川市人民政府门户网站',
        url: 'https://www.yinchuan.gov.cn',
        kind: 'official',
        level: 'homepage',
        coverage: ['location'],
        checkedAt: '2026-08-17',
      },
    ],
    verifiedAt: '2026-08-17',
  },
  {
    id: 'shizuishan-government',
    name: '石嘴山市人民政府',
    level: 'city-capital',
    cityId: 'shizuishan',
    coordinates: { lng: 106.376, lat: 39.019 },
    sources: [
      {
        label: '石嘴山市人民政府门户网站',
        url: 'https://www.shizuishan.gov.cn',
        kind: 'official',
        level: 'homepage',
        coverage: ['location'],
        checkedAt: '2026-08-17',
      },
    ],
    verifiedAt: '2026-08-17',
  },
  {
    id: 'wuzhong-government',
    name: '吴忠市人民政府',
    level: 'city-capital',
    cityId: 'wuzhong',
    coordinates: { lng: 106.199, lat: 37.986 },
    sources: [
      {
        label: '吴忠市人民政府门户网站',
        url: 'https://www.wuzhong.gov.cn',
        kind: 'official',
        level: 'homepage',
        coverage: ['location'],
        checkedAt: '2026-08-17',
      },
    ],
    verifiedAt: '2026-08-17',
  },
  {
    id: 'guyuan-government',
    name: '固原市人民政府',
    level: 'city-capital',
    cityId: 'guyuan',
    coordinates: { lng: 106.243, lat: 36.016 },
    sources: [
      {
        label: '固原市人民政府门户网站',
        url: 'https://www.guyuan.gov.cn',
        kind: 'official',
        level: 'homepage',
        coverage: ['location'],
        checkedAt: '2026-08-17',
      },
    ],
    verifiedAt: '2026-08-17',
  },
  {
    id: 'zhongwei-government',
    name: '中卫市人民政府',
    level: 'city-capital',
    cityId: 'zhongwei',
    coordinates: { lng: 105.196, lat: 37.498 },
    sources: [
      {
        label: '中卫市人民政府门户网站',
        url: 'https://www.zhongwei.gov.cn',
        kind: 'official',
        level: 'homepage',
        coverage: ['location'],
        checkedAt: '2026-08-17',
      },
    ],
    verifiedAt: '2026-08-17',
  },
];
