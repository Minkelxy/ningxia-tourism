import { useState } from 'react';
import { ArrowLeft, CalendarDays, CircleDollarSign, Clock3, ExternalLink, MapPin, Navigation, Printer, Share2, Sparkles, TrainFront, Utensils } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { getAttractionById } from '../data/attractions';
import { getRouteById } from '../data/routes';
import { createAmapMarkerUrl, formatVerifiedDate, sharePage } from '../lib/site';

export default function RouteDetail() {
  const { routeId } = useParams();
  const route = getRouteById(routeId);
  const [shareStatus, setShareStatus] = useState('');
  if (!route) return <main className="full-state"><SEO title="路线未找到 · 宁夏旅行地图" noIndex /><CalendarDays aria-hidden="true" /><h1>没有找到这条路线</h1><p>回到路线列表，选择一条适合你的行程。</p><Link to="/routes" className="btn-primary">查看全部路线</Link></main>;

  const handleShare = async () => { try { setShareStatus(await sharePage(route.name, route.summary)); } catch { setShareStatus('分享已取消'); } window.setTimeout(() => setShareStatus(''), 2400); };
  return (
    <>
      <SEO title={`${route.name} · 宁夏旅行地图`} description={route.summary} />
      <main className="route-detail-page">
        <header className="route-detail-hero"><div className="section-shell"><Link to="/routes" className="back-link"><ArrowLeft aria-hidden="true" /> 返回路线列表</Link><p className="eyebrow"><Sparkles aria-hidden="true" /> {route.themeLabel}</p><h1>{route.name}</h1><p>{route.summary}</p><div className="route-detail-facts"><span><Clock3 aria-hidden="true" /> {route.durationLabel}</span><span><CircleDollarSign aria-hidden="true" /> {route.budget}</span><span><CalendarDays aria-hidden="true" /> {route.bestSeason}</span></div><div className="route-detail-actions"><button type="button" className="btn-primary" onClick={() => window.print()}><Printer aria-hidden="true" /> 打印行程</button><button type="button" className="btn-quiet" onClick={handleShare}><Share2 aria-hidden="true" /> 分享路线</button></div></div></header>
        {shareStatus && <div className="toast" role="status">{shareStatus}</div>}
        <div className="section-shell route-detail-layout">
          <article className="timeline"><div className="route-audience"><span>适合人群</span><strong>{route.audience}</strong></div>{route.days.map((day) => <section key={day.day} className="route-day"><div className="day-marker"><span>DAY</span><strong>{String(day.day).padStart(2, '0')}</strong></div><div className="day-content"><header><h2>{day.title}</h2><p>{day.summary}</p></header><div className="route-stops">{day.stops.map((stop, index) => {
            const attraction = getAttractionById(stop.attractionId);
            const mapUrl = attraction ? createAmapMarkerUrl(attraction.name, attraction.coordinates) : createAmapMarkerUrl(stop.mapQuery || stop.title);
            return <div className="route-stop" key={`${day.day}-${stop.time}-${stop.title}`}><div className="stop-time">{stop.time}</div><div className="stop-body"><span className="stop-number">{index + 1}</span><h3>{attraction ? <Link to={`/attraction/${attraction.id}`}>{stop.title}</Link> : stop.title}</h3><p>{stop.description}</p>{stop.transport && <p className="stop-note"><TrainFront aria-hidden="true" />{stop.transport}</p>}{stop.tips && <p className="stop-note"><Sparkles aria-hidden="true" />{stop.tips}</p>}<a href={mapUrl} target="_blank" rel="noreferrer" className="text-link"><Navigation aria-hidden="true" /> 高德查看 <ExternalLink aria-hidden="true" /></a></div></div>;
          })}</div><footer className="day-footer"><div><Utensils aria-hidden="true" /><span>{day.meals.join(' · ')}</span></div><div><MapPin aria-hidden="true" /><span>住宿：{day.accommodation}</span></div></footer></div></section>)}</article>
          <aside className="route-sidebar"><div className="route-summary-card"><p className="eyebrow">行程摘要</p><h2>{route.durationLabel} · {route.days.reduce((total, day) => total + day.stops.length, 0)} 个停靠点</h2><div>{route.highlights.map((item) => <span key={item}>{item}</span>)}</div></div><div className="route-notice"><h2>预算与时间说明</h2><p>预算不含抵达宁夏的大交通。景区票价、铁路班次、道路耗时和商户营业安排都可能变化。</p><strong>路线校订：{formatVerifiedDate(route.verifiedAt)}</strong></div></aside>
        </div>
      </main>
    </>
  );
}
