import { memo, type CSSProperties } from 'react';
import type { CityId } from '../../types';
import { activateWithKeyboard, cityColors, cityIdFromFeature, featureCode, featureName } from './config';
import type { createProjection, GeoFeature } from './projection';
import { geometryToPath } from './projection';

interface MapRegionLayerProps {
  features: GeoFeature[];
  project: ReturnType<typeof createProjection>;
  activeCityId?: CityId;
  selectedDistrictCode?: string;
  cityDetail: boolean;
  onOpenCity: (feature: GeoFeature) => void;
  onOpenDistrict: (feature: GeoFeature) => void;
}

function MapRegionLayer({ features, project, activeCityId, selectedDistrictCode, cityDetail, onOpenCity, onOpenDistrict }: MapRegionLayerProps) {
  return (
    <g filter="url(#mapShadow)">
      {features.map((feature, index) => {
        const cityId = cityIdFromFeature(feature) ?? activeCityId ?? 'yinchuan';
        const code = featureCode(feature);
        const selected = Boolean(selectedDistrictCode) && selectedDistrictCode === code;
        const action = () => cityDetail ? onOpenDistrict(feature) : onOpenCity(feature);
        return <path key={code || `${featureName(feature)}-${index}`} d={geometryToPath(feature, project)} className={`map-region ${selected ? 'is-selected' : ''}`} style={{ '--region-color': cityDetail ? '#9eb89f' : cityColors[cityId] } as CSSProperties} tabIndex={0} role="button" aria-label={`${featureName(feature)}，按回车进入`} onClick={(event) => { event.stopPropagation(); action(); }} onKeyDown={(event) => activateWithKeyboard(event, action)} />;
      })}
    </g>
  );
}

export default memo(MapRegionLayer);
