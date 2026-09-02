import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Map, Menu, Search, X } from 'lucide-react';
import { useFavorites } from '../lib/favorites';
import { mainNavLinks } from '../lib/site-navigation';

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
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const firstLink = nav.querySelector<HTMLAnchorElement>('a');
    firstLink?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };
    // Tab 在菜单内首尾元素之间循环，避免焦点跳到背景内容。
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
    // 点击菜单外区域关闭菜单，避免移动端用户必须点开/关按钮才能离开。
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (nav.contains(event.target as Node)) return;
      if (menuButtonRef.current?.contains(event.target as Node)) return;
      setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('keydown', trapFocus);
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('keydown', trapFocus);
      document.removeEventListener('mousedown', closeOnOutsideClick);
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
    <>
      <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand" aria-label="塞上江南宁夏旅行地图">
          <span className="brand-mark"><Map aria-hidden="true" /></span>
          <span><strong>塞上江南</strong><small>宁夏旅行地图</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="主导航">
          {mainNavLinks.map((link) => <Link key={link.path} to={link.path} className={active(link.path) ? 'active' : ''} aria-current={active(link.path) ? 'page' : undefined}>{link.label}</Link>)}
        </nav>
        <Link to="/search" className={`search-nav-link ${active('/search') ? 'active' : ''}`} aria-current={active('/search') ? 'page' : undefined} aria-label="全站搜索" title="全站搜索"><Search aria-hidden="true" /></Link>
        <Link to="/favorites" className={`favorites-nav-link ${active('/favorites') ? 'active' : ''}`} aria-current={active('/favorites') ? 'page' : undefined} aria-label={`我的收藏${count ? `，${count} 项` : ''}`}><Heart aria-hidden="true" fill={count ? 'currentColor' : 'none'} /><span>收藏</span>{count > 0 && <small>{count}</small>}</Link>
        <button ref={menuButtonRef} type="button" className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? '关闭导航菜单' : '打开导航菜单'}>
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && <nav ref={mobileNavRef} id="mobile-navigation" className="mobile-nav" aria-label="移动端导航"><Link to="/search" className={active('/search') ? 'active' : ''} aria-current={active('/search') ? 'page' : undefined}>全站搜索</Link>{mainNavLinks.map((link) => <Link key={link.path} to={link.path} className={active(link.path) ? 'active' : ''} aria-current={active(link.path) ? 'page' : undefined}>{link.label}</Link>)}<Link to="/favorites" className={active('/favorites') ? 'active' : ''} aria-current={active('/favorites') ? 'page' : undefined}>我的收藏{count > 0 ? `（${count}）` : ''}</Link></nav>}
      </header>
      {open && <div className="mobile-nav-backdrop" aria-hidden="true" />}
    </>
  );
}
