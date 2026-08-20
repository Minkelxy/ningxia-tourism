import { memo, type CSSProperties } from 'react';
import type { CityId } from '../../types';
import {
  activateWithKeyboard,
  cityColors,
  cityIdFromFeature,
  featureCode,
  featureName,
} from './config';
import type { createProjection, GeoFeature } from './projection';
import { geometryToPath } from './projection';

interface MapRegionLayerProps {
  features: GeoFeature[];
  project: ReturnType<typeof createProjection>;
  activeCityId?: CityId;
  selectedDistrictCode?: string;
  /** 当前聚焦的 feature code，用于追加 is-focused class */
  focusedFeatureCode?: string;
  cityDetail: boolean;
  /** districtCode -> 填充色；仅当 cityDetail=true 时使用 */
  districtColorMap?: Record<string, string>;
  onOpenCity: (feature: GeoFeature) => void;
  onOpenDistrict: (feature: GeoFeature) => void;
  /** 焦点进入某区域时回调，传给父组件追踪 label 联动 */
  onRegionFocus?: (feature: GeoFeature | null) => void;
}

function MapRegionLayer({
  features,
  project,
  activeCityId,
  selectedDistrictCode,
  focusedFeatureCode,
  cityDetail,
  districtColorMap,
  onOpenCity,
  onOpenDistrict,
  onRegionFocus,
}: MapRegionLayerProps) {
  return (
    <g filter="url(#mapShadow)" className="map-region-layer">
      {features.map((feature, index) => {
        const cityId = cityIdFromFeature(feature) ?? activeCityId ?? 'yinchuan';
        const code = featureCode(feature);
        const selected = Boolean(selectedDistrictCode) && selectedDistrictCode === code;
        const focused = focusedFeatureCode ? focusedFeatureCode === code : false;
        const action = () => (cityDetail ? onOpenDistrict(feature) : onOpenCity(feature));

        let regionColor: string;
        if (cityDetail) {
          regionColor = districtColorMap?.[code] ?? '#9eb89f';
        } else {
          regionColor = cityColors[cityId];
        }

        const classNames = ['map-region'];
        if (selected) classNames.push('is-selected');
        if (focused) classNames.push('is-focused');

        return (
          <path
            key={code || `${featureName(feature)}-${index}`}
            d={geometryToPath(feature, project)}
            className={classNames.join(' ')}
            style={{ '--region-color': regionColor } as CSSProperties}
            tabIndex={0}
            role="button"
            aria-label={`${featureName(feature)}，按回车进入`}
            onClick={(event) => {
              event.stopPropagation();
              action();
            }}
            onKeyDown={(event) => activateWithKeyboard(event, action)}
            onFocus={() => onRegionFocus?.(feature)}
            onBlur={() => onRegionFocus?.(null)}
          />
        );
      })}
    </g>
  );
}

export default memo(MapRegionLayer);
