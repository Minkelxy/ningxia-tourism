import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return <main className="full-state"><SEO title="页面未找到 · 宁夏旅行地图" noIndex /><Compass aria-hidden="true" /><p className="eyebrow">404 · 走到地图之外了</p><h1>这条路暂时没有内容</h1><p>返回地图，或者从十二个已核实景点中重新选择。</p><div className="state-actions"><Link to="/" className="btn-primary">返回地图</Link><Link to="/attractions" className="btn-quiet">浏览景点</Link></div></main>;
}
