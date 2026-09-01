import { ArrowRight, Heart, MapPin, Route as RouteIcon, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import FavoriteButton from '../components/FavoriteButton';
import { getAttractionById } from '../data/attractions';
import { cityName } from '../data/cities';
import { getRouteById } from '../data/routes';
import { useFavorites } from '../lib/favorites';

export default function Favorites() {
  const { favorites, count, clearFavorites } = useFavorites();
  const attractions = favorites.attraction.flatMap((id) => {
    const item = getAttractionById(id);
    return item?.status === 'published' ? [item] : [];
  });
  const favoriteRoutes = favorites.route.flatMap((id) => {
    const item = getRouteById(id);
    return item ? [item] : [];
  });
  return <><SEO title="我的收藏 · 宁夏旅行地图" description="查看你收藏的宁夏景点与旅行路线。收藏内容只保存在当前浏览器。" noIndex /><header className="page-hero compact-hero favorites-hero"><div className="section-shell"><p className="eyebrow"><Heart aria-hidden="true" /> 我的规划夹</p><h1>把想去的地方，<br />留给下一次决定。</h1><p>{count ? `当前收藏 ${count} 项。内容只保存在这台设备的浏览器中，不需要登录。` : '把景点和路线先收藏起来，比较之后再决定，不必重复寻找。'}</p></div></header><div className="section-shell page-content favorites-page">{count > 0 && <div className="favorites-toolbar"><span>{count} 项收藏</span><button type="button" className="text-button" onClick={clearFavorites}><Trash2 aria-hidden="true" /> 清空收藏</button></div>}<section className="favorites-section" aria-labelledby="favorite-attractions-title"><header className="split-heading"><div><p className="eyebrow"><MapPin aria-hidden="true" /> 目的地</p><h2 id="favorite-attractions-title">收藏的景点</h2></div><span>{attractions.length} 项</span></header>{attractions.length ? <div className="favorites-list">{attractions.map((item) => <article className="favorite-row" key={item.id}><Link to={`/attraction/${item.id}`} className="favorite-row-link"><ResponsiveImage src={item.images[0].src} alt="" width="70" height="58" sizes="70px" loading="lazy" pictureClassName="favorite-row-image" /><span><strong>{item.name}</strong><small>{cityName(item.cityId)} · {item.visitInfo.duration}</small></span><ArrowRight aria-hidden="true" /></Link><FavoriteButton kind="attraction" id={item.id} label={item.name} /></article>)}</div> : <div className="favorites-empty"><Heart aria-hidden="true" /><p>还没有收藏景点</p><Link to="/attractions" className="text-link">浏览精选景点 <ArrowRight aria-hidden="true" /></Link></div>}</section><section className="favorites-section" aria-labelledby="favorite-routes-title"><header className="split-heading"><div><p className="eyebrow"><RouteIcon aria-hidden="true" /> 行程</p><h2 id="favorite-routes-title">收藏的路线</h2></div><span>{favoriteRoutes.length} 项</span></header>{favoriteRoutes.length ? <div className="favorites-route-list">{favoriteRoutes.map((item) => <article className="favorite-route-row" key={item.id}><Link to={`/routes/${item.id}`} className="favorite-route-link"><span><small>{item.durationLabel} · {item.themeLabel}</small><strong>{item.name}</strong><em>{item.summary}</em></span><ArrowRight aria-hidden="true" /></Link><FavoriteButton kind="route" id={item.id} label={item.name} /></article>)}</div> : <div className="favorites-empty"><RouteIcon aria-hidden="true" /><p>还没有收藏路线</p><Link to="/routes" className="text-link">比较推荐路线 <ArrowRight aria-hidden="true" /></Link></div>}</section></div></>;
}
