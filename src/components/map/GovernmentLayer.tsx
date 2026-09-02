import { memo, type CSSProperties } from 'react';
import { Building2 } from 'lucide-react';
import type { createProjection } from './projection';
import type { GovernmentMarker } from './config';

interface GovernmentLayerProps {
  markers: GovernmentMarker[];
  project: ReturnType<typeof createProjection>;
}

function GovernmentLayer({ markers, project }: GovernmentLayerProps) {
  return markers.map((marker, index) => {
    const point = project(marker.coordinates.lng, marker.coordinates.lat);
    const isProvince = marker.level === 'province-capital';
    const levelLabel = isProvince ? '省级' : '市级';
    const variant = isProvince ? 'map-government map-government--province' : 'map-government map-government--city';
    return (
      <g key={marker.id} className={variant} style={{ '--map-layer-index': index } as CSSProperties} transform={`translate(${point.x} ${point.y})`} role="img" aria-label={`${marker.name}（${levelLabel}政府标记，仅作地图锚点展示）`}>
        <g className="map-government-glyph">
          <circle r={10} />
          <Building2 aria-hidden="true" x={-7} y={-7} width={14} height={14} />
          <title>{`${marker.name}（${levelLabel}）`}</title>
        </g>
      </g>
    );
  });
}

export default memo(GovernmentLayer);
