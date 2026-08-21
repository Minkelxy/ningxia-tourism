import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, BadgeCheck, CalendarDays, CircleDollarSign, Clock3, ExternalLink, Footprints, Gauge, MapPin, MapPinned, Navigation, Printer, Share2, Sparkles, TrainFront, Utensils } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { getAttractionById } from '../data/attractions';
import { cityName } from '../data/cities';
import { routePaceMeta, routeWalkingMeta } from '../data/meta';
import { getRouteById } from '../data/routes';
import { getRouteEvidenceSummary, type RouteEvidenceSummary } from '../lib/route';
import { assetUrl, createAmapMarkerUrl, formatVerifiedDate } from '../lib/site';
import useShare from '../lib/useShare';
import FavoriteButton from '../components/FavoriteButton';

const EMPTY_EVIDENCE: RouteEvidenceSummary = { totalStops: 0, verifiedStops: 0, reviewStops: 0, ordinaryStops: 0, cityIds: [] };

export default function RouteDetail() {
  const { routeId } = useParams();
  const route = getRouteById(routeId);
  // Hooks 必须在任何 early return 之前调用，参数使用空字符串/安全兜底
  const evidence = useMemo(() => (route ? getRouteEvidenceSummary(route) : EMPTY_EVIDENCE), [route]);
  const { handleShare, ShareToast } = useShare(route?.name ?? '', route?.summary ?? '');
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    if (!route || route.days.length < 2 || typeof IntersectionObserver === 'undefined') return;
    const sections = route.days
      .map((day) => document.getElementById(`route-day-${day.day}`))
      .filter((section): section is HTMLElement => Boolean(section));
    if (!sections.length) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveDay(Number(visible.target.id.replace('route-day-', '')));
    }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.6] });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [route]);

  if (!route) return <div className="full-state"><SEO title="路线未找到 · 宁夏旅行地图" noIndex /><CalendarDays aria-hidden="true" /><h1>没有找到这条路线</h1><p>回到路线列表，选择一条适合你的行程。</p><Link to="/routes" className="btn-primary">查看全部路线</Link></div>;
  return (
    <>
      <SEO title={`${route.name} · 宁夏旅行地图`} description={route.summary} />
      <div className="route-detail-page">
        <header className="route-detail-hero"><div className="section-shell"><Link to="/routes" className="back-link"><ArrowLeft aria-hidden="true" /> 返回路线列表</Link><p className="eyebrow"><Sparkles aria-hidden="true" /> {route.themeLabel}</p><h1>{route.name}</h1><p>{route.summary}</p><div className="route-detail-facts"><span><Clock3 aria-hidden="true" /> {route.durationLabel}</span><span><Gauge aria-hidden="true" /> {routePaceMeta[route.pace].label}节奏</span><span><Footprints aria-hidden="true" /> 步行{routeWalkingMeta[route.walkingLevel].label}</span><span><CircleDollarSign aria-hidden="true" /> {route.budget}</span><span><CalendarDays aria-hidden="true" /> {route.bestSeason}</span></div><div className="route-detail-actions"><button type="button" className="btn-primary" onClick={() => window.print()}><Printer aria-hidden="true" /> 打印行程</button><button type="button" className="btn-quiet" onClick={handleShare}><Share2 aria-hidden="true" /> 分享路线</button><FavoriteButton kind="route" id={route.id} label={route.name} /></div></div></header>
        <div className="detail-hero-image"><img src={assetUrl(route.image.src)} alt={route.image.alt} width="1440" height="960" loading="eager" decoding="async" fetchPriority="high" /><p className="detail-image-credit">{route.image.credit} · 路线封面仅作展示参考</p></div>
        {ShareToast}
        {route.days.length > 1 && <nav className="route-day-nav" aria-label="按天快速跳转"><div className="section-shell"><span>按天快速跳转</span><div>{route.days.map((day) => <a key={day.day} href={`#route-day-${day.day}`} className={activeDay === day.day ? 'active' : undefined} aria-current={activeDay === day.day ? 'location' : undefined}><strong>D{String(day.day).padStart(2, '0')}</strong><small>{day.title}</small></a>)}</div></div></nav>}
        <div className="section-shell route-detail-layout">
          <article className="timeline"><div className="route-audience"><span>适合人群</span><strong>{route.audience}</strong></div>{route.days.map((day) => <section key={day.day} id={`route-day-${day.day}`} className="route-day" aria-labelledby={`route-day-${day.day}-title`}><div className="day-marker"><span>DAY</span><strong>{String(day.day).padStart(2, '0')}</strong></div><div className="day-content"><header><h2 id={`route-day-${day.day}-title`}>{day.title}</h2><p>{day.summary}</p></header><div className="route-stops">{day.stops.map((stop, index) => {
            const attraction = getAttractionById(stop.attractionId);
            const mapUrl = attraction ? createAmapMarkerUrl(attraction.name, attraction.coordinates) : createAmapMarkerUrl(stop.mapQuery || stop.title);
            return <div className="route-stop" key={`${day.day}-${stop.time}-${stop.title}`}><div className="stop-time">{stop.time}</div><div className="stop-body"><span className="stop-number">{index + 1}</span><h3>{attraction ? <Link to={`/attraction/${attraction.id}`}>{stop.title}</Link> : stop.title}{attraction && <span className={`stop-verification ${attraction.verificationLevel}`}>{attraction.verificationLevel === 'verified' ? '已核实' : '待复核'}</span>}</h3><p>{stop.description}</p>{stop.transport && <p className="stop-note"><TrainFront aria-hidden="true" />{stop.transport}</p>}{stop.tips && <p className="stop-note"><Sparkles aria-hidden="true" />{stop.tips}</p>}<a href={mapUrl} target="_blank" rel="noreferrer" className="text-link"><Navigation aria-hidden="true" /> 高德查看 <ExternalLink aria-hidden="true" /></a></div></div>;
          })}</div>{day.timeSlots && day.timeSlots.length > 0 ? <div className="route-timeslots"><p className="eyebrow"><Clock3 aria-hidden="true" /> 时段细节</p>{day.timeSlots.map((slot) => <div className="route-stop" key={`slot-${day.day}-${slot.time}-${slot.location}`}><div className="stop-time">{slot.time}</div><div className="stop-body"><h3>{slot.location}</h3><p>{slot.description}</p>{slot.tips && <p className="stop-note"><Sparkles aria-hidden="true" />{slot.tips}</p>}</div></div>)}</div> : <p className="route-timeslots-empty">当日时段细节整理中，请参考上方停靠点时间安排。</p>}<footer className="day-footer"><div><Utensils aria-hidden="true" /><span>{day.meals.join(' · ')}</span></div><div><MapPin aria-hidden="true" /><span>住宿：{day.accommodation}</span></div></footer></div></section>)}</article>
          <aside className="route-sidebar"><div className="route-summary-card"><p className="eyebrow">行程摘要</p><h2>{route.durationLabel} · {evidence.totalStops} 个停靠点</h2><p className="route-city-line"><MapPin aria-hidden="true" />涉及 {evidence.cityIds.map(cityName).join('、')}</p><div>{route.highlights.map((item) => <span key={item}>{item}</span>)}</div></div><div className="route-profile-card"><p className="eyebrow">体力与交通</p><h2>先判断这条路线是否适合你</h2><dl><div><Gauge aria-hidden="true" /><dt>节奏</dt><dd><strong>{routePaceMeta[route.pace].label}</strong><small>{routePaceMeta[route.pace].note}</small></dd></div><div><Footprints aria-hidden="true" /><dt>步行</dt><dd><strong>{routeWalkingMeta[route.walkingLevel].label}</strong><small>{routeWalkingMeta[route.walkingLevel].note}</small></dd></div><div><TrainFront aria-hidden="true" /><dt>交通</dt><dd><strong>{route.transportSummary}</strong><small>班次与道路耗时请在出发日确认</small></dd></div></dl></div><div className="route-evidence-card"><p className="eyebrow">资料覆盖</p><h2>路线事实一眼看懂</h2><dl><div className="verified"><BadgeCheck aria-hidden="true" /><dt>已核实景点</dt><dd>{evidence.verifiedStops}</dd></div><div className="review"><BadgeCheck aria-hidden="true" /><dt>待复核景点</dt><dd>{evidence.reviewStops}</dd></div><div><MapPinned aria-hidden="true" /><dt>普通地点</dt><dd>{evidence.ordinaryStops}</dd></div></dl><p>普通地点指夜市、车站等地图查询点，不作为已核实景点评级。</p></div><div className="route-notice"><h2>预算与时间说明</h2><p>预算不含抵达宁夏的大交通。景区票价、铁路班次、道路耗时和商户营业安排都可能变化。</p><strong>路线校订：{formatVerifiedDate(route.verifiedAt)}</strong></div></aside>
        </div>
      </div>
    </>
  );
}
