export type CityId = 'yinchuan' | 'shizuishan' | 'wuzhong' | 'guyuan' | 'zhongwei';

export type AttractionCategory = 'nature' | 'history' | 'religion' | 'experience';

export type ContentStatus = 'published' | 'draft';

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface SourceRef {
  label: string;
  url: string;
  kind: 'official' | 'image';
}

export interface AttractionImage {
  src: string;
  alt: string;
  credit: string;
  license: string;
  sourceUrl: string;
}

export interface VisitInfo {
  openingHours: string;
  ticketPrice: string;
  reservation: string;
  duration: string;
  bestSeason: string;
  transportation: string;
  address: string;
}

export interface Attraction {
  id: string;
  status: ContentStatus;
  name: string;
  cityId: CityId;
  locality: string;
  category: AttractionCategory;
  coordinates: Coordinates;
  summary: string;
  highlights: string[];
  visitInfo: VisitInfo;
  images: AttractionImage[];
  nearbyIds: string[];
  sources: SourceRef[];
  verifiedAt: string;
}

export interface City {
  id: CityId;
  name: string;
  pinyin: CityId;
  population: string;
  area: string;
  nickname: string;
  introduction: string;
  history: string;
  foods: string[];
  bestSeason: string;
  culture: string;
  image: AttractionImage;
}

export type RouteTheme = 'first-visit' | 'weekend' | 'panorama' | 'culture' | 'food';

export interface RouteStop {
  time: string;
  title: string;
  description: string;
  attractionId?: string;
  mapQuery?: string;
  transport?: string;
  tips?: string;
}

export interface RouteDay {
  day: number;
  title: string;
  summary: string;
  stops: RouteStop[];
  meals: string[];
  accommodation: string;
}

export interface RoutePlan {
  id: string;
  name: string;
  theme: RouteTheme;
  themeLabel: string;
  durationDays: number;
  durationLabel: string;
  audience: string;
  budget: string;
  bestSeason: string;
  summary: string;
  highlights: string[];
  days: RouteDay[];
  verifiedAt: string;
}

export type TransportType = 'highspeed_rail' | 'railway' | 'bus';

export interface TransportHub {
  id: string;
  name: string;
  cityId: CityId;
  type: TransportType;
  coordinates: Coordinates;
}
