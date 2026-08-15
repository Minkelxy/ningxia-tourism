import { ChevronLeft, Home, Layers3, Minus, Plus, RotateCcw } from 'lucide-react';
import type { GeoFeature } from './projection';
import { featureName } from './config';

interface MapControlsProps {
  levelLabel: string;
  selectedCity: GeoFeature | null;
  selectedDistrict: GeoFeature | null;
  showTransport: boolean;
  onBackToProvince: () => void;
  onBackToCity: () => void;
  onToggleTransport: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetViewport: () => void;
}

export default function MapControls({ levelLabel, selectedCity, selectedDistrict, showTransport, onBackToProvince, onBackToCity, onToggleTransport, onZoomIn, onZoomOut, onResetViewport }: MapControlsProps) {
  return (
    <div className="map-toolbar">
      <div className="map-breadcrumb" aria-label="地图层级">
        {selectedCity && <button type="button" onClick={onBackToProvince}><Home aria-hidden="true" /> 全区</button>}
        {selectedDistrict && <button type="button" onClick={onBackToCity}><ChevronLeft aria-hidden="true" /> {featureName(selectedCity)}</button>}
        <span>{levelLabel}</span>
      </div>
      <div className="map-actions" aria-label="地图控制">
        <button type="button" onClick={onToggleTransport} aria-pressed={showTransport}><Layers3 aria-hidden="true" /> 交通</button>
        <button type="button" onClick={onZoomIn} aria-label="放大地图"><Plus aria-hidden="true" /></button>
        <button type="button" onClick={onZoomOut} aria-label="缩小地图"><Minus aria-hidden="true" /></button>
        <button type="button" onClick={onResetViewport} aria-label="重置地图"><RotateCcw aria-hidden="true" /></button>
      </div>
    </div>
  );
}
