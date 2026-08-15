export interface GeoFeature {
  type: 'Feature';
  properties: {
    name?: string;
    fullname?: string;
    code?: string;
    adcode?: string | number;
    pinyin?: string;
    center?: [number, number];
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoBounds {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

const walkCoordinates = (coordinates: unknown, visit: (lng: number, lat: number) => void) => {
  if (!Array.isArray(coordinates)) return;
  if (typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
    visit(coordinates[0], coordinates[1]);
    return;
  }
  coordinates.forEach((coordinate) => walkCoordinates(coordinate, visit));
};

export const getFeatureBounds = (feature: GeoFeature): GeoBounds => {
  const bounds: GeoBounds = { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity };
  walkCoordinates(feature.geometry.coordinates, (lng, lat) => {
    bounds.minLng = Math.min(bounds.minLng, lng);
    bounds.maxLng = Math.max(bounds.maxLng, lng);
    bounds.minLat = Math.min(bounds.minLat, lat);
    bounds.maxLat = Math.max(bounds.maxLat, lat);
  });
  return bounds;
};

export const mergeFeatureBounds = (features: GeoFeature[]) => features.reduce<GeoBounds>((merged, feature) => {
  const bounds = getFeatureBounds(feature);
  return {
    minLng: Math.min(merged.minLng, bounds.minLng), maxLng: Math.max(merged.maxLng, bounds.maxLng),
    minLat: Math.min(merged.minLat, bounds.minLat), maxLat: Math.max(merged.maxLat, bounds.maxLat),
  };
}, { minLng: Infinity, maxLng: -Infinity, minLat: Infinity, maxLat: -Infinity });

export const createProjection = (bounds: GeoBounds, width: number, height: number, padding = 54) => {
  const lngSpan = Math.max(bounds.maxLng - bounds.minLng, 0.01);
  const latSpan = Math.max(bounds.maxLat - bounds.minLat, 0.01);
  const scale = Math.min((width - padding * 2) / lngSpan, (height - padding * 2) / latSpan);
  const drawnWidth = lngSpan * scale;
  const drawnHeight = latSpan * scale;
  const offsetX = (width - drawnWidth) / 2;
  const offsetY = (height - drawnHeight) / 2;

  return (lng: number, lat: number) => ({
    x: offsetX + (lng - bounds.minLng) * scale,
    y: height - offsetY - (lat - bounds.minLat) * scale,
  });
};

export const geometryToPath = (feature: GeoFeature, project: ReturnType<typeof createProjection>) => {
  const polygons = feature.geometry.type === 'Polygon'
    ? [feature.geometry.coordinates as number[][][]]
    : feature.geometry.coordinates as number[][][][];

  return polygons.flatMap((polygon) => polygon.map((ring) => {
    if (!ring.length) return '';
    const points = ring.map(([lng, lat]) => project(lng, lat));
    return `${points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ')} Z`;
  })).join(' ');
};

export const containsCoordinates = (bounds: GeoBounds, lng: number, lat: number) => (
  lng >= bounds.minLng && lng <= bounds.maxLng && lat >= bounds.minLat && lat <= bounds.maxLat
);
