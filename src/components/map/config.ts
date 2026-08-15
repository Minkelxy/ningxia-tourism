import type { KeyboardEvent } from 'react';
import type { CityId } from '../../types';
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
