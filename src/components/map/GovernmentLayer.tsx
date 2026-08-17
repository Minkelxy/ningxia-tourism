import { Building2 } from 'lucide-react';
import type { createProjection } from './projection';
import type { GovernmentMarker } from './config';

interface GovernmentLayerProps {
  markers: GovernmentMarker[];
  project: ReturnType<typeof createProjection>;
}

const PROVINCE_COLOR = '#2D5A4A';
const CITY_COLOR = '#C4A35A';

export default function GovernmentLayer({ markers, project }: GovernmentLayerProps) {
  return markers.map((marker) => {
    const point = project(marker.coordinates.lng, marker.coordinates.lat);
    const isProvince = marker.level === 'province-capital';
    const levelLabel = isProvince ? '省级' : '市级';
    const variant = isProvince ? 'map-government--province' : 'map-government--city';
    return (
      <g key={marker.id} transform={`translate(${point.x} ${point.y})`} tabIndex={0} role="img" aria-label={`${marker.name}（${levelLabel}政府标记，仅作地图锚点展示）`}>
        <circle className={`map-government ${variant}`} r={10} fill={isProvince ? PROVINCE_COLOR : CITY_COLOR} stroke="#fff" strokeWidth={2} />
        <Building2 aria-hidden="true" x={-7} y={-7} width={14} height={14} />
        <title>{`${marker.name}（${levelLabel}）`}</title>
      </g>
    );
  });
}
