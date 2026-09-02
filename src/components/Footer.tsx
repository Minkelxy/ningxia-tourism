import { ExternalLink, Map, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><div className="footer-brand"><Map aria-hidden="true" /><strong>塞上江南 · 宁夏旅行地图</strong></div><p>用地图、路线、旅行手记与资料专题，整理一趟更有依据的宁夏旅行。</p></div>
        <nav aria-label="继续探索"><h2>继续探索</h2><Link to="/attractions">精选景点</Link><Link to="/foods">宁夏美食</Link><Link to="/routes">推荐路线</Link><Link to="/guide">行前指南</Link><Link to="/journal">旅行手记</Link><Link to="/cities">五城概览</Link></nav>
        <nav aria-label="资料说明"><h2>资料说明</h2><Link to="/about"><ShieldCheck aria-hidden="true" /> 数据方法与免责声明</Link><a className="source-link" href="https://github.com/Minkelxy/ningxia-tourism/issues" target="_blank" rel="noreferrer">提交建议 <ExternalLink aria-hidden="true" /></a></nav>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} 宁夏旅行地图</span><span>实用信息会变化，出发前请再次查看官方公告</span></div>
    </footer>
  );
}
