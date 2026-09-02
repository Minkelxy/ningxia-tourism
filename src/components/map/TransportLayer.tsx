import { memo, type CSSProperties } from 'react';
import { Bus, Plane, TrainFront } from 'lucide-react';
import type { TransportHub } from '../../types';
import type { createProjection } from './projection';

interface TransportLayerProps {
  hubs: TransportHub[];
  project: ReturnType<typeof createProjection>;
}

function TransportLayer({ hubs, project }: TransportLayerProps) {
  return hubs.map((hub, index) => {
    const point = project(hub.coordinates.lng, hub.coordinates.lat);
    const Icon = hub.type === 'airport' ? Plane : hub.type === 'bus' ? Bus : TrainFront;
    const hubClassName = hub.type === 'airport' ? 'map-hub map-hub--airport' : 'map-hub';
    const tooltip = hub.description && hub.address ? `${hub.name}：${hub.description}（${hub.address}）` : hub.name;
    return <g key={hub.id} className={hubClassName} style={{ '--map-layer-index': index } as CSSProperties} transform={`translate(${point.x} ${point.y})`} role="img" aria-label={`${hub.name}，${hub.type === 'airport' ? '机场' : hub.type === 'bus' ? '客运站' : '火车站'}交通枢纽`}><g className="map-hub-glyph"><circle r="11" /><Icon x={-7} y={-7} width={14} height={14} /><title>{tooltip}</title></g></g>;
  });
}

export default memo(TransportLayer);
