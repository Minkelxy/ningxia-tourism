import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface GeoBounds {
  minLng: number;
  maxLng: number;
  minLat: number;
  maxLat: number;
}

export interface SVGPoint {
  x: number;
  y: number;
}

export function geoToSVG(
  lng: number,
  lat: number,
  bounds: GeoBounds,
  width: number,
  height: number
): SVGPoint {
  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width;
  const y = height - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * height;
  return { x, y };
}

export function coordinatesToPath(
  coords: number[][][],
  bounds: GeoBounds,
  width: number,
  height: number
): string {
  if (!coords || !coords[0]) return '';

  const pathParts: string[] = [];

  const processRing = (ring: number[][]) => {
    if (!ring || ring.length === 0) return;

    const transformed = ring.map(coord =>
      geoToSVG(coord[0], coord[1], bounds, width, height)
    );

    pathParts.push(`M ${transformed[0].x} ${transformed[0].y}`);
    for (let i = 1; i < transformed.length; i++) {
      pathParts.push(`L ${transformed[i].x} ${transformed[i].y}`);
    }
    pathParts.push('Z');
  };

  if (coords[0]) {
    processRing(coords[0]);
  }

  for (let i = 1; i < coords.length; i++) {
    if (coords[i]) {
      processRing(coords[i]);
    }
  }

  return pathParts.join(' ');
}

export const NINGXIA_BOUNDS: GeoBounds = {
  minLng: 105.0,
  maxLng: 106.9,
  minLat: 35.3,
  maxLat: 39.4,
};
