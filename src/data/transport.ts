import type { TransportHub } from '../types';

export const transportHubs: TransportHub[] = [
  { id: 'yinchuan-station', name: '银川站', cityId: 'yinchuan', type: 'railway', coordinates: { lng: 106.18, lat: 38.49 } },
  { id: 'yinchuan-airport', name: '银川河东国际机场', cityId: 'yinchuan', type: 'highspeed_rail', coordinates: { lng: 106.39, lat: 38.32 } },
  { id: 'shizuishan-station', name: '石嘴山站', cityId: 'shizuishan', type: 'railway', coordinates: { lng: 106.38, lat: 39.04 } },
  { id: 'wuzhong-station', name: '吴忠站', cityId: 'wuzhong', type: 'highspeed_rail', coordinates: { lng: 106.19, lat: 37.94 } },
  { id: 'guyuan-station', name: '固原站', cityId: 'guyuan', type: 'railway', coordinates: { lng: 106.28, lat: 36.0 } },
  { id: 'guyuan-bus', name: '固原汽车站', cityId: 'guyuan', type: 'bus', coordinates: { lng: 106.27, lat: 35.99 } },
  { id: 'zhongwei-station', name: '中卫站', cityId: 'zhongwei', type: 'railway', coordinates: { lng: 105.18, lat: 37.5 } },
  { id: 'zhongwei-south', name: '中卫南站', cityId: 'zhongwei', type: 'highspeed_rail', coordinates: { lng: 105.16, lat: 37.45 } },
];
