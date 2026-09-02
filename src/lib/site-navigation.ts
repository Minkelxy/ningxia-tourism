export const mainNavLinks = [
  { path: '/', label: '地图探索' },
  { path: '/attractions', label: '精选景点' },
  { path: '/foods', label: '宁夏美食' },
  { path: '/routes', label: '推荐路线' },
  { path: '/guide', label: '行前指南' },
  { path: '/journal', label: '旅行手记' },
  { path: '/cities', label: '五城概览' },
] as const;

export function isNavigationPathActive(pathname: string, path: string) {
  if (path === '/') return pathname === '/';
  if (path === '/attractions') return pathname.startsWith('/attraction');
  if (path === '/foods') return pathname.startsWith('/food');
  if (path === '/cities') return pathname === '/cities' || pathname.startsWith('/city/');
  return pathname.startsWith(path);
}
