import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Menu, X } from 'lucide-react';

const navLinks = [
  { path: '/', label: '地图探索' },
  { path: '/attractions', label: '精选景点' },
  { path: '/routes', label: '推荐路线' },
  { path: '/journal', label: '旅行手记' },
  { path: '/cities', label: '五城概览' },
  { path: '/about', label: '关于本站' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  const active = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/attractions') return location.pathname.startsWith('/attraction');
    if (path === '/cities') return location.pathname === '/cities' || location.pathname.startsWith('/city/');
    return location.pathname.startsWith(path);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand" aria-label="塞上江南宁夏旅行首页">
          <span className="brand-mark"><Map aria-hidden="true" /></span>
          <span><strong>塞上江南</strong><small>宁夏旅行地图</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="主导航">
          {navLinks.map((link) => <Link key={link.path} to={link.path} className={active(link.path) ? 'active' : ''} aria-current={active(link.path) ? 'page' : undefined}>{link.label}</Link>)}
        </nav>
        <button type="button" className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? '关闭导航菜单' : '打开导航菜单'}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="移动端导航">{navLinks.map((link) => <Link key={link.path} to={link.path} className={active(link.path) ? 'active' : ''}>{link.label}</Link>)}</nav>}
    </header>
  );
}
