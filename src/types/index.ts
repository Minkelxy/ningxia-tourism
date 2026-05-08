export type AttractionType = 'nature' | 'history' | 'religion' | 'experience';

export interface Coordinates {
  x: number;
  y: number;
}

export interface Attraction {
  id: string;
  name: string;
  nameEn?: string;
  city: string;
  type: AttractionType;
  coordinates: Coordinates;
  rating: number;
  description: string;
  images: string[];
  openingHours: string;
  ticketPrice: string;
  bestSeason: string;
  transportation: string;
  highlights: string[];
  nearbyAttractions: string[];
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
