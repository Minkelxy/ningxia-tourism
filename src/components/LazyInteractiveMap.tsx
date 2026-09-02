import { lazy, Suspense, useEffect, useRef, useState } from 'react';

const InteractiveMap = lazy(() => import('./NingxiaInteractiveMap'));

function MapPlaceholder({ label = '地图将在接近此处时加载' }: { label?: string }) {
  return <div className="map-state map-lazy-placeholder" role="status"><span className="map-loader" aria-hidden="true" /><span className="map-placeholder-label">{label}</span></div>;
}

export default function LazyInteractiveMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: '320px 0px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="lazy-map-container">
      {shouldLoad ? <Suspense fallback={<MapPlaceholder label="正在铺开宁夏地图…" />}><InteractiveMap /></Suspense> : <MapPlaceholder />}
    </div>
  );
}
