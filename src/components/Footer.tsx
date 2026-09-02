import { ExternalLink, Map, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { isNavigationPathActive, mainNavLinks } from '../lib/site-navigation';

export default function Footer() {
  const location = useLocation();

  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div><div className="footer-brand"><Map aria-hidden="true" /><strong>塞上江南 · 宁夏旅行地图</strong></div><p>用地图、路线、旅行手记与资料专题，整理一趟更有依据的宁夏旅行。</p></div>
        <nav aria-label="继续探索"><h2>继续探索</h2>{mainNavLinks.filter((link) => link.path !== '/').map((link) => <Link key={link.path} to={link.path} className={isNavigationPathActive(location.pathname, link.path) ? 'active' : ''} aria-current={isNavigationPathActive(location.pathname, link.path) ? 'page' : undefined}>{link.label}</Link>)}</nav>
        <nav aria-label="资料说明"><h2>资料说明</h2><Link to="/about"><ShieldCheck aria-hidden="true" /> 数据方法与免责声明</Link><a className="source-link" href="https://github.com/Minkelxy/ningxia-tourism/issues" target="_blank" rel="noreferrer">提交建议 <ExternalLink aria-hidden="true" /></a></nav>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} 宁夏旅行地图</span><span>实用信息会变化，出发前请再次查看官方公告</span></div>
    </footer>
  );
}
