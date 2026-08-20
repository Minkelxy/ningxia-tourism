import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';

/**
 * 监听 Service Worker 控制权变更：当新版本 SW 接管（sw.js 中 install 时
 * 已调用 skipWaiting）后，提示用户刷新以加载最新资源。仅在浏览器支持
 * SW 且当前已有 controller 时启用监听，避免开发环境误触发。
 */
export default function ServiceWorkerUpdate() {
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let refreshing = false;
    const onControllerChange = () => {
      if (refreshing) return;
      // 首次注册不会触发提示（controller 由 null 变为有值时跳过）。
      if (!navigator.serviceWorker.controller) return;
      refreshing = true;
      setUpdated(true);
    };
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'sw-updated') setUpdated(true);
    };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    navigator.serviceWorker.addEventListener('message', onMessage);
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      navigator.serviceWorker.removeEventListener('message', onMessage);
    };
  }, []);

  if (!updated) return null;
  return (
    <div className="sw-update-toast" role="status" aria-live="polite">
      <span>站点已更新到最新版本，刷新以加载新内容。</span>
      <div className="sw-update-actions">
        <button type="button" className="sw-update-refresh" onClick={() => window.location.reload()}>
          <RefreshCw aria-hidden="true" />刷新
        </button>
        <button type="button" className="sw-update-dismiss" aria-label="关闭更新提示" onClick={() => setUpdated(false)}>
          <X aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
