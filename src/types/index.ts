export type CityId = 'yinchuan' | 'shizuishan' | 'wuzhong' | 'guyuan' | 'zhongwei';

export type AttractionCategory = 'nature' | 'history' | 'religion' | 'experience';

export type ContentStatus = 'published' | 'draft';
export type VerificationLevel = 'verified' | 'review';

export interface Coordinates {
  lng: number;
  lat: number;
}

export type SourceLevel = 'direct' | 'directory' | 'homepage';
export type SourceCoverage = 'overview' | 'visit' | 'location';

export interface SourceRef {
  label: string;
  url: string;
  kind: 'official' | 'image';
  level: SourceLevel;
  coverage: SourceCoverage[];
  checkedAt: string;
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
  verificationLevel: VerificationLevel;
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
  verificationNote: string;
}

export interface City {
  id: CityId;
  name: string;
  pinyin: CityId;
  travelRole: string;
  connectionNote: string;
  nickname: string;
  introduction: string;
  history: string;
  foods: string[];
  bestSeason: string;
  culture: string;
  image: AttractionImage;
}

export type JournalType = 'travel' | 'food' | 'guide';
export type JournalContentKind = 'firsthand' | 'editorial' | 'demo';

export interface JournalReference {
  label: string;
  url: string;
  checkedAt: string;
}

export interface JournalCommon {
  slug: string;
  type: JournalType;
  status: ContentStatus;
  contentKind: JournalContentKind;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  cityId: CityId;
  locality: string;
  tags: string[];
  cover: AttractionImage;
  gallery: AttractionImage[];
  relatedAttractionIds: string[];
  relatedRouteIds: string[];
  body: string;
}

export interface TravelJournal extends JournalCommon {
  type: 'travel';
  tripDate: string;
  duration: string;
  transport: string;
  budgetNote: string;
  highlights: string[];
}

export interface FoodJournal extends JournalCommon {
  type: 'food';
  visitedAt: string;
  venueName: string;
  cuisine: string;
  address: string;
  mapQuery: string;
  pricePerPerson: string;
  dishes: string[];
  queueNote: string;
  suitableFor: string;
  revisitNote: string;
}

export interface EditorialJournal extends JournalCommon {
  type: 'guide';
  reviewedAt: string;
  scopeNote: string;
  keyPoints: string[];
  references: JournalReference[];
}

export type JournalEntry = TravelJournal | FoodJournal | EditorialJournal;

export type RouteTheme = 'first-visit' | 'weekend' | 'panorama' | 'culture' | 'food';
export type RoutePace = 'relaxed' | 'balanced' | 'intensive';
export type RouteWalkingLevel = 'low' | 'medium' | 'high';

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
  pace: RoutePace;
  walkingLevel: RouteWalkingLevel;
  transportSummary: string;
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
