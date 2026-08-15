import { Bus, TrainFront } from 'lucide-react';
import type { TransportHub } from '../../types';
import type { createProjection } from './projection';

interface TransportLayerProps {
  hubs: TransportHub[];
  project: ReturnType<typeof createProjection>;
}

export default function TransportLayer({ hubs, project }: TransportLayerProps) {
  return hubs.map((hub) => {
    const point = project(hub.coordinates.lng, hub.coordinates.lat);
    return <g key={hub.id} className="map-hub" transform={`translate(${point.x} ${point.y})`} tabIndex={0} role="img" aria-label={`${hub.name}，交通枢纽`}><circle r="11" />{hub.type === 'bus' ? <Bus x={-7} y={-7} width={14} height={14} /> : <TrainFront x={-7} y={-7} width={14} height={14} />}<title>{hub.name}</title></g>;
  });
}
