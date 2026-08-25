import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';

export default function NotFound() {
  return <div className="full-state not-found-state"><SEO title="页面未找到 · 宁夏旅行地图" noIndex /><div className="not-found-layout"><div className="not-found-copy"><Compass aria-hidden="true" /><p className="eyebrow">404 · 走到地图之外了</p><h1>这条路暂时没有内容</h1><p>返回地图，或者从公开景点、推荐路线与旅行手记中重新选择。</p><div className="state-actions"><Link to="/" className="btn-primary">返回地图</Link><Link to="/attractions" className="btn-quiet">浏览景点</Link></div></div><div className="not-found-visual"><ResponsiveImage src="/images/attractions/shapotou.webp" alt="沙坡头沙漠与黄河实景" width="720" height="480" loading="eager" fetchPriority="high" sizes="(max-width: 768px) 100vw, 42vw" /><span>实景照片 · 来源见景点详情</span></div></div></div>;
}
