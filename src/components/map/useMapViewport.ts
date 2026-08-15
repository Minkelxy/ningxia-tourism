import { useRef, useState, type PointerEvent } from 'react';

const panLimit = 180;

export default function useMapViewport() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);

  const resetViewport = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest('[role="button"]')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const nextX = Math.max(-panLimit, Math.min(panLimit, drag.current.panX + event.clientX - drag.current.x));
    const nextY = Math.max(-panLimit, Math.min(panLimit, drag.current.panY + event.clientY - drag.current.y));
    setPan({ x: nextX, y: nextY });
  };

  const stopDrag = () => { drag.current = null; };

  return {
    zoom,
    pan,
    zoomIn: () => setZoom((value) => Math.min(2.4, value + 0.25)),
    zoomOut: () => setZoom((value) => Math.max(1, value - 0.25)),
    resetViewport,
    viewportHandlers: { onPointerDown, onPointerMove, onPointerUp: stopDrag, onPointerCancel: stopDrag },
  };
}
