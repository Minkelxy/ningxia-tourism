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
