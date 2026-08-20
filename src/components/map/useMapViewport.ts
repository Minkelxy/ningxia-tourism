import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type WheelEvent } from 'react';

const panLimit = 180;

export default function useMapViewport() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);

  const resetViewport = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const zoomIn = useCallback(() => setZoom((value) => Math.min(2.4, value + 0.25)), []);
  const zoomOut = useCallback(() => setZoom((value) => Math.max(1, value - 0.25)), []);

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

  const onWheel = (event: WheelEvent<SVGSVGElement>) => {
    // 阻止页面滚动，在地图上使用滚轮缩放
    event.preventDefault();
    const delta = -event.deltaY * 0.0015;
    setZoom((value) => Math.max(1, Math.min(2.4, value + delta)));
  };

  const onKeyDown = (event: KeyboardEvent<SVGSVGElement>) => {
    // 仅当焦点在 SVG 画布本身（非子元素按钮）时响应
    if (event.target instanceof Element && event.target.closest('[role="button"]')) return;
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      zoomIn();
    } else if (event.key === '-' || event.key === '_') {
      event.preventDefault();
      zoomOut();
    } else if (event.key === '0') {
      event.preventDefault();
      resetViewport();
    }
  };

  return {
    zoom,
    pan,
    zoomIn,
    zoomOut,
    resetViewport,
    viewportHandlers: { onPointerDown, onPointerMove, onPointerUp: stopDrag, onPointerCancel: stopDrag, onWheel, onKeyDown },
  };
}
