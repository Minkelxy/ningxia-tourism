import { ArrowRight, BadgeCheck, CalendarDays, CircleDollarSign, Compass, MapPinned, Sparkles } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { routeThemeLabels } from '../data/meta';
import { routes } from '../data/routes';
import { getRouteEvidenceSummary } from '../lib/route';

export default function RouteRecommendation() {
  const [params, setParams] = useSearchParams();
  const duration = params.get('duration') ?? 'all';
  const theme = params.get('theme') ?? 'all';
  const filtered = routes.filter((route) => (duration === 'all' || (duration === '4+' ? route.durationDays >= 4 : route.durationDays === Number(duration))) && (theme === 'all' || route.theme === theme));
  const setFilter = (key: string, value: string) => { const next = new URLSearchParams(params); if (value === 'all') next.delete(key); else next.set(key, value); setParams(next, { replace: true }); };

  return (
    <>
      <SEO title="宁夏推荐路线 · 宁夏旅行地图" description="七条经过整理的宁夏一至五日路线，包含交通衔接、住宿区域和参考预算。" />
      <header className="route-hero"><div className="section-shell"><p className="eyebrow"><Sparkles aria-hidden="true" /> 七条经过整理的主题路线</p><h1>先决定有几天，<br />再决定怎么认识宁夏。</h1><p>路线不是必须照抄的清单，而是一套减少折返、保留弹性的地理顺序。票价、班次和营业安排请在出发前再次确认。</p></div></header>
      <div className="section-shell page-content">
        <section className="route-filter" aria-label="路线筛选"><div><span>行程天数</span>{['all', '1', '2', '3', '4+'].map((value) => <button type="button" key={value} aria-pressed={duration === value} className={duration === value ? 'active' : ''} onClick={() => setFilter('duration', value)}>{value === 'all' ? '全部' : value === '4+' ? '4 天以上' : `${value} 天`}</button>)}</div><div><span>旅行主题</span><button type="button" aria-pressed={theme === 'all'} className={theme === 'all' ? 'active' : ''} onClick={() => setFilter('theme', 'all')}>全部</button>{Object.entries(routeThemeLabels).map(([value, label]) => <button type="button" key={value} aria-pressed={theme === value} className={theme === value ? 'active' : ''} onClick={() => setFilter('theme', value)}>{label}</button>)}</div></section>
        <div className="result-summary" role="status" aria-live="polite"><strong>{filtered.length}</strong> 条路线</div>
        <div className="route-grid">{filtered.map((route, index) => {
          const evidence = getRouteEvidenceSummary(route);
          return <article className={`route-card route-tone-${index % 4}`} key={route.id}><div className="route-card-top"><span>{route.themeLabel}</span><strong>{route.durationLabel}</strong></div><h2>{route.name}</h2><p>{route.summary}</p><div className="route-highlights">{route.highlights.map((item) => <span key={item}>{item}</span>)}</div><div className="route-evidence-summary" aria-label="路线内容核实概览"><span className="verified"><BadgeCheck aria-hidden="true" />{evidence.verifiedStops} 个已核实停靠</span><span className="review"><BadgeCheck aria-hidden="true" />{evidence.reviewStops} 个待复核停靠</span><span><MapPinned aria-hidden="true" />{evidence.ordinaryStops} 个普通地点</span></div><dl><div><CalendarDays aria-hidden="true" /><dt>适合</dt><dd>{route.audience}</dd></div><div><CircleDollarSign aria-hidden="true" /><dt>预算</dt><dd>{route.budget}</dd></div><div><Compass aria-hidden="true" /><dt>季节</dt><dd>{route.bestSeason}</dd></div></dl><Link to={`/routes/${route.id}`} className="text-link">查看逐日安排 <ArrowRight aria-hidden="true" /></Link></article>;
        })}</div>
        {!filtered.length && <div className="empty-state"><Compass aria-hidden="true" /><h2>没有匹配的路线</h2><p>清除筛选，看看其他天数或主题。</p><button type="button" className="btn-primary" onClick={() => setParams({})}>查看全部路线</button></div>}
      </div>
    </>
  );
}
