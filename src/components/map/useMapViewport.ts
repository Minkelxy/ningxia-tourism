import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type WheelEvent } from 'react';

const panLimit = 180;

export default function useMapViewport() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
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
    setIsDragging(true);
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const nextX = Math.max(-panLimit, Math.min(panLimit, drag.current.panX + event.clientX - drag.current.x));
    const nextY = Math.max(-panLimit, Math.min(panLimit, drag.current.panY + event.clientY - drag.current.y));
    setPan({ x: nextX, y: nextY });
  };

  const stopDrag = () => {
    drag.current = null;
    setIsDragging(false);
  };

  const onWheel = (event: WheelEvent<SVGSVGElement>) => {
    // 普通滚轮交给页面，只有 Ctrl/Cmd + 滚轮才缩放地图，避免地图吞掉整页滚动。
    if (!event.ctrlKey && !event.metaKey) return;
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
    isDragging,
    viewportHandlers: { onPointerDown, onPointerMove, onPointerUp: stopDrag, onPointerCancel: stopDrag, onWheel, onKeyDown },
  };
}
