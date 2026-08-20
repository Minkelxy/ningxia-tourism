import { memo, useEffect, useRef } from 'react';
import { ArrowRight, MapPin, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Attraction } from '../../types';
import { cityName } from '../../data/cities';
import ResponsiveImage from '../ResponsiveImage';

interface MapPreviewProps {
  attraction: Attraction;
  onClose: () => void;
}

function MapPreview({ attraction, onClose }: MapPreviewProps) {
  const cover = attraction.images[0];
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  return (
    <aside className="map-preview" aria-label={`${attraction.name}预览`}>
      <button ref={closeButtonRef} type="button" className="map-preview-close" onClick={onClose} aria-label="关闭景点预览">
        <X aria-hidden="true" />
      </button>
      {cover && <ResponsiveImage src={cover.src} alt={cover.alt} width="720" height="420" sizes="(max-width: 768px) 100vw, 360px" />}
      <div className="map-preview-content">
        <p className="eyebrow"><MapPin aria-hidden="true" /> {cityName(attraction.cityId)} · {attraction.locality}</p>
        <h3>{attraction.name}</h3>
        <p>{attraction.summary}</p>
        <Link to={`/attraction/${attraction.id}`} className="text-link">
          查看实用信息 <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}

export default memo(MapPreview);
