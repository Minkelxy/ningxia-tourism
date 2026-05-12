export type AttractionType = 'nature' | 'history' | 'religion' | 'experience';

export type TransportType = 'highspeed_rail' | 'railway' | 'bus';

export type FoodCategory = '羊肉类' | '面食类' | '特色小吃' | '饮品' | '家常菜' | '水果' | '特产';

export interface Coordinates {
  lng: number;
  lat: number;
}

export interface Restaurant {
  name: string;
  city: string;
  address?: string;
  coordinates?: Coordinates;
  recommend?: string;
}

export interface Food {
  id: string;
  name: string;
  nameEn?: string;
  category: FoodCategory | string;
  description: string;
  origin: string;
  bestSeason?: string;
  priceRange?: string;
  restaurants: Restaurant[];
  tips?: string;
}

export interface Attraction {
  id: string;
  name: string;
  nameEn?: string;
  city: string;
  cityPinyin?: string;
  type: AttractionType | string;
  description: string;
  highlights: string[];
  images?: string[];
  rating: number;
  coordinates: Coordinates;
  openingHours?: string;
  ticketPrice?: string;
  bestSeason?: string;
  transportation?: string;
  nearbyAttractions?: string[];
}

export interface TransportHub {
  id: string;
  name: string;
  city: string;
  cityPinyin: string;
  type: TransportType | string;
  description: string;
  coordinates: Coordinates;
  address?: string;
  phone?: string;
}

export interface City {
  id: string;
  name: string;
  pinyin: string;
  population: string;
  area: string;
  nickname: string;
  introduction: string;
  history: string;
  foods: string[];
  bestSeason: string;
  culture: string;
  image: string;
}

export interface Route {
  id: string;
  name: string;
  theme: string;
  duration: string;
  budget: string;
  description: string;
  attractions: string[];
  highlights: string[];
}

export interface MapPath {
  id: string;
  name: string;
  path: string;
  labelPosition: Coordinates;
}

export interface AppState {
  selectedAttraction: Attraction | null;
  selectedCity: string | null;
  filterType: AttractionType | 'all';
  zoomLevel: number;
  isMapLoaded: boolean;
}