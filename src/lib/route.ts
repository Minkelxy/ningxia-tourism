import type { CityId, RoutePlan } from '../types';
import { getAttractionById } from '../data/attractions';

export interface RouteEvidenceSummary {
  totalStops: number;
  verifiedStops: number;
  reviewStops: number;
  ordinaryStops: number;
  cityIds: CityId[];
}

export const getRouteEvidenceSummary = (route: RoutePlan): RouteEvidenceSummary => {
  const summary: RouteEvidenceSummary = {
    totalStops: 0,
    verifiedStops: 0,
    reviewStops: 0,
    ordinaryStops: 0,
    cityIds: [],
  };
  const cityIds = new Set<CityId>();

  for (const day of route.days) {
    for (const stop of day.stops) {
      summary.totalStops += 1;
      const attraction = getAttractionById(stop.attractionId);
      if (!attraction || attraction.status !== 'published') {
        summary.ordinaryStops += 1;
        continue;
      }
      cityIds.add(attraction.cityId);
      if (attraction.verificationLevel === 'verified') summary.verifiedStops += 1;
      else summary.reviewStops += 1;
    }
  }

  summary.cityIds = [...cityIds];
  return summary;
};
