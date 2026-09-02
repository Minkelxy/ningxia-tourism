import { memo } from 'react';
import { LocateFixed } from 'lucide-react';
import type { Attraction } from '../../types';
import { activateWithKeyboard } from './config';
import type { createProjection } from './projection';

interface AttractionLayerProps {
  attractions: Attraction[];
  project: ReturnType<typeof createProjection>;
  selectedAttractionId?: string;
  onSelect: (attraction: Attraction) => void;
}

function AttractionLayer({ attractions, project, selectedAttractionId, onSelect }: AttractionLayerProps) {
  return attractions.map((attraction) => {
    const point = project(attraction.coordinates.lng, attraction.coordinates.lat);
    const selected = selectedAttractionId === attraction.id;
    const select = () => onSelect(attraction);
    return (
      <g key={attraction.id} data-attraction-id={attraction.id} className={`map-attraction ${selected ? 'is-selected' : ''}`} transform={`translate(${point.x} ${point.y})`} tabIndex={0} role="button" aria-label={`${attraction.name}，打开预览`} onClick={(event) => { event.stopPropagation(); select(); }} onKeyDown={(event) => activateWithKeyboard(event, select)}>
        <circle className="marker-hit" r="38" />
        <circle className="marker-dot" r={selected ? 16 : 12} />
        <LocateFixed aria-hidden="true" x={-8} y={-8} width={16} height={16} />
        <title>{attraction.name}</title>
      </g>
    );
  });
}

export default memo(AttractionLayer);
