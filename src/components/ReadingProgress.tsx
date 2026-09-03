import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';

const getScrollProgress = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return 0;
  const documentElement = document.documentElement;
  const scrollableHeight = Math.max(
    documentElement.scrollHeight,
    document.body?.scrollHeight ?? 0,
  ) - window.innerHeight;
  if (scrollableHeight <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollableHeight));
};

export default function ReadingProgress() {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        setProgress(getScrollProgress());
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
    };
  }, [location.pathname, location.search]);

  return (
    <div
      className={`reading-progress${progress > 0.005 ? ' is-started' : ''}`}
      aria-hidden="true"
      style={{
        '--reading-progress': progress,
        '--reading-progress-percent': `${progress * 100}%`,
      } as CSSProperties}
    >
      <span className="reading-progress__ink" />
      <span className="reading-progress__head" />
    </div>
  );
}
