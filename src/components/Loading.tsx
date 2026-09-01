import { Map } from 'lucide-react';

export default function Loading() {
  return <div className="full-state loading-state" role="status" aria-label="页面加载中"><span className="loading-mark"><Map aria-hidden="true" /></span><p>正在整理下一段旅程…</p></div>;
}
