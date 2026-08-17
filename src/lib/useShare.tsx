import { useCallback, useRef, useState } from 'react';
import { sharePage } from './site';

const TOAST_TIMEOUT_MS = 2400;

/**
 * 统一详情页的分享逻辑：调用 sharePage（系统分享优先，否则剪贴板），
 * 捕获异常并显示 2.4 秒状态提示（toast）。
 * 返回 { shareStatus, handleShare, ShareToast }，详情页只需一次解构即可。
 */
export default function useShare(title: string, text: string) {
  const [shareStatus, setShareStatus] = useState('');
  const timeoutId = useRef<number | null>(null);

  const clearToast = useCallback(() => {
    if (timeoutId.current !== null) {
      window.clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, []);

  const handleShare = useCallback(async () => {
    clearToast();
    try { setShareStatus(await sharePage(title, text)); }
    catch { setShareStatus('分享已取消'); }
    timeoutId.current = window.setTimeout(() => setShareStatus(''), TOAST_TIMEOUT_MS);
  }, [title, text, clearToast]);

  const ShareToast = shareStatus ? <div className="toast" role="status">{shareStatus}</div> : null;

  return { shareStatus, handleShare, ShareToast };
}
