import { memo } from 'react';
import { featureCode, featureName } from './config';
import type { createProjection, GeoFeature } from './projection';

export interface MapLabelLayerProps {
  features: GeoFeature[];
  project: ReturnType<typeof createProjection>;
  /** true = 市级视图，区县标签；false = 省级视图，城市标签 */
  cityDetail: boolean;
  selectedFeatureCode?: string;
  focusedFeatureCode?: string;
}

/** Return the label center [lng, lat] for a feature; prefer centroid, then center. */
const featureLabelCenter = (feature: GeoFeature): [number, number] | null => {
  const c = feature.properties.centroid ?? feature.properties.center;
  if (!c) return null;
  return c;
};

function MapLabelLayer({
  features,
  project,
  cityDetail,
  selectedFeatureCode,
  focusedFeatureCode,
}: MapLabelLayerProps) {
  const variantClass = cityDetail ? 'map-label--district' : 'map-label--city';

  return (
    <g className={`map-label-layer map-label-layer--${cityDetail ? 'district' : 'city'}`}>
      {features.map((feature, index) => {
        const center = featureLabelCenter(feature);
        if (!center) return null;
        const { x, y } = project(center[0], center[1]);
        const code = featureCode(feature) || `label-${index}`;
        const text = featureName(feature);
        if (!text) return null;
        const isSelected = selectedFeatureCode && code === selectedFeatureCode;
        const isFocused = focusedFeatureCode && code === focusedFeatureCode;
        const extraClass = [
          isSelected ? 'is-selected' : '',
          isFocused ? 'is-focused' : '',
        ]
          .filter(Boolean)
          .join(' ');
        const labelId = `map-label-${code}`;
        return (
          <g
            key={code}
            className={`map-label ${variantClass} ${extraClass}`.trim()}
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}
            pointerEvents="none"
            aria-hidden="true"
          >
            {/* Text-shadow-like halo for readability on any background */}
            <text
              className="map-label__halo"
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {text}
            </text>
            <text
              id={labelId}
              className="map-label__text"
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {text}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default memo(MapLabelLayer);
