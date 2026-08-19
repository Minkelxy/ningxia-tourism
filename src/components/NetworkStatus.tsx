import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export default function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (isOnline) return null;
  return <div className="offline-notice" role="status" aria-live="polite"><WifiOff aria-hidden="true" /><span>当前处于离线状态，显示已缓存内容。票价、班次和开放安排请联网后再次确认。</span></div>;
}
