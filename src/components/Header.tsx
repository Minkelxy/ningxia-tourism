import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Map, Menu, Search, X } from 'lucide-react';
import { useFavorites } from '../lib/favorites';

const navLinks = [
  { path: '/', label: '地图探索' },
  { path: '/attractions', label: '精选景点' },
  { path: '/foods', label: '宁夏美食' },
  { path: '/routes', label: '推荐路线' },
  { path: '/guide', label: '行前指南' },
  { path: '/journal', label: '旅行手记' },
  { path: '/cities', label: '五城概览' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const { count } = useFavorites();
  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const nav = mobileNavRef.current;
    if (!nav) return;
    const firstLink = nav.querySelector<HTMLAnchorElement>('a');
    firstLink?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = nav.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('keydown', trapFocus);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('keydown', trapFocus);
    };
  }, [open]);
  const active = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/attractions') return location.pathname.startsWith('/attraction');
    if (path === '/foods') return location.pathname.startsWith('/food');
    if (path === '/cities') return location.pathname === '/cities' || location.pathname.startsWith('/city/');
    return location.pathname.startsWith(path);
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark"><Map aria-hidden="true" /></span>
          <span><strong>塞上江南</strong><small>宁夏旅行地图</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="主导航">
          {navLinks.map((link) => <Link key={link.path} to={link.path} className={active(link.path) ? 'active' : ''} aria-current={active(link.path) ? 'page' : undefined}>{link.label}</Link>)}
        </nav>
        <Link to="/search" className={`search-nav-link ${active('/search') ? 'active' : ''}`} aria-label="全站搜索" title="全站搜索"><Search aria-hidden="true" /></Link>
        <Link to="/favorites" className={`favorites-nav-link ${active('/favorites') ? 'active' : ''}`} aria-label={`我的收藏${count ? `，${count} 项` : ''}`}><Heart aria-hidden="true" fill={count ? 'currentColor' : 'none'} /><span>收藏</span>{count > 0 && <small>{count}</small>}</Link>
        <button ref={menuButtonRef} type="button" className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? '关闭导航菜单' : '打开导航菜单'}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && <nav ref={mobileNavRef} id="mobile-navigation" className="mobile-nav" aria-label="移动端导航"><Link to="/search" className={active('/search') ? 'active' : ''}>全站搜索</Link>{navLinks.map((link) => <Link key={link.path} to={link.path} className={active(link.path) ? 'active' : ''}>{link.label}</Link>)}<Link to="/favorites" className={active('/favorites') ? 'active' : ''}>我的收藏{count > 0 ? `（${count}）` : ''}</Link></nav>}
    </header>
  );
}
