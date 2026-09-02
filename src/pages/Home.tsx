import { useMemo, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, BadgeCheck, CalendarCheck2, CalendarDays, Footprints, Gauge, MapPin, MapPinned, NotebookPen, ShieldAlert, TrainFront } from 'lucide-react';
import { Link } from 'react-router-dom';
import LazyInteractiveMap from '../components/LazyInteractiveMap';
import ResponsiveImage from '../components/ResponsiveImage';
import SEO from '../components/SEO';
import { publishedJournalEntries } from '../content/journal';
import { reviewAttractions, verifiedAttractions } from '../data/attractions';
import { cities, cityName } from '../data/cities';
import { routePaceMeta, routeWalkingMeta } from '../data/meta';
import { routes } from '../data/routes';

export default function Home() {
  const [selectedDays, setSelectedDays] = useState(3);
  const matchedRoutes = useMemo(() => routes.filter((route) => route.durationDays === selectedDays), [selectedDays]);
  const latestTopics = useMemo(() => publishedJournalEntries.filter((entry) => entry.type === 'guide').slice(0, 3), []);

  return (
    <>
      <SEO />
      <section className="home-hero">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><BadgeCheck aria-hidden="true" /> {verifiedAttractions.length} 个已核实 · {reviewAttractions.length} 个待复核</p>
          <h1>沿着黄河，<br /><span>遇见宁夏。</span></h1>
          <p className="hero-lead">从贺兰山下的西夏陵，到腾格里沙漠与黄河相拥的沙坡头。用地图认识五座城市，用路线安排行程，再用来源清晰的专题理顺旅途细节。</p>
          <div className="hero-actions">
            <a href="#explore-map" className="btn-primary"><MapPinned aria-hidden="true" /> 按地图探索</a>
            <Link to="/routes" className="btn-quiet"><CalendarDays aria-hidden="true" /> 查看推荐路线 <ArrowRight aria-hidden="true" /></Link>
            <Link to="/journal" className="btn-quiet"><NotebookPen aria-hidden="true" /> 旅行手记</Link>
          </div>
          <dl className="hero-stats">
            <div><dt>座城市</dt><dd>{cities.length}</dd></div><div><dt>个已核实景点</dt><dd>{verifiedAttractions.length}</dd></div><div><dt>个待复核景点</dt><dd>{reviewAttractions.length}</dd></div><div><dt>条主题路线</dt><dd>{routes.length}</dd></div>
          </dl>
        </div>
        <div className="hero-landscape" role="img" aria-label="宁夏山河主题图形">
          <div className="sun-disc" /><div className="mountain mountain-back" /><div className="mountain mountain-front" /><div className="river-ribbon" />
          <div className="hero-seal"><span>塞上</span><strong>江南</strong></div>
          <a href="#explore-map" className="scroll-cue"><ArrowDown aria-hidden="true" /> 向下探索</a>
        </div>
      </section>

      <section id="explore-map" className="map-section section-shell">
        <div className="section-heading split-heading">
          <div><p className="eyebrow">一图读懂宁夏</p><h2>从城市边界，到旅行目的地</h2></div>
          <p>先选择一座城市继续放大，再点选景点查看预览。公开景点均有来源；“待复核”表示核心文字事实仍缺少直接、可追溯的页面。</p>
        </div>
        <LazyInteractiveMap />
      </section>

      <section className="home-route-finder section-shell" aria-labelledby="home-route-finder-title">
        <header className="split-heading"><div><p className="eyebrow">不想从地图开始？</p><h2 id="home-route-finder-title">你有几天，先把范围缩小</h2></div><p>按完整可用天数选择，再比较节奏、步行量和主要交通。预算不含抵达宁夏的大交通。</p></header>
        <div className="home-day-picker" role="radiogroup" aria-label="选择旅行天数" onKeyDown={(event) => {
          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
          event.preventDefault();
          const days = [1, 2, 3, 4, 5];
          const currentIndex = days.indexOf(selectedDays);
          const nextIndex = event.key === 'ArrowLeft'
            ? (currentIndex <= 0 ? days.length - 1 : currentIndex - 1)
            : (currentIndex >= days.length - 1 ? 0 : currentIndex + 1);
          setSelectedDays(days[nextIndex]);
          (event.currentTarget.querySelectorAll<HTMLButtonElement>('button')[nextIndex])?.focus();
        }}>{[1, 2, 3, 4, 5].map((days) => <button type="button" key={days} role="radio" aria-checked={selectedDays === days} tabIndex={selectedDays === days ? 0 : -1} className={selectedDays === days ? 'active' : ''} onClick={() => setSelectedDays(days)}><strong>{days}</strong><span>天</span></button>)}</div>
        <div className="home-route-results" aria-live="polite"><div className="home-route-result-heading"><p><strong>{matchedRoutes.length}</strong> 条 {selectedDays} 天路线</p><Link to={`/routes?duration=${selectedDays}`} className="text-link">打开完整筛选 <ArrowRight aria-hidden="true" /></Link></div><div className="home-route-matches">{matchedRoutes.map((route, index) => <Link to={`/routes/${route.id}`} className={`home-route-match route-tone-${index % 4}`} style={{ '--home-route-index': index } as CSSProperties} key={route.id}><div><span>{route.themeLabel}</span><small>{route.durationLabel}</small></div><h3>{route.name}</h3><p>{route.summary}</p><dl><div><Gauge aria-hidden="true" /><dt>节奏</dt><dd>{routePaceMeta[route.pace].label}</dd></div><div><Footprints aria-hidden="true" /><dt>步行</dt><dd>{routeWalkingMeta[route.walkingLevel].label}</dd></div><div><TrainFront aria-hidden="true" /><dt>交通</dt><dd>{route.transportSummary}</dd></div></dl><span className="home-route-cta">查看逐日安排 <ArrowRight aria-hidden="true" /></span></Link>)}</div></div>
      </section>

      <section className="home-guide-teaser section-shell">
        <div><p className="eyebrow"><CalendarCheck2 aria-hidden="true" /> 出发前先看</p><h2>季节、天数、跨城交通，<br />一次理清。</h2><p>四季怎么选、银川和中卫怎么串、包车与铁路如何分工，再用一份保存在本机的清单完成最后检查。</p><Link to="/guide" className="btn-primary">打开行前指南 <ArrowRight aria-hidden="true" /></Link></div>
        <div className="home-guide-points"><article><span>01</span><strong>按季节</strong><small>花期、避暑、秋色与淡季节奏</small></article><article><span>02</span><strong>按天数</strong><small>从 1 天到 5 天直接进入匹配路线</small></article><article><TrainFront aria-hidden="true" /><strong>看衔接</strong><small>铁路连主城，公路进入分散景区</small></article></div>
      </section>

      <section className="home-topics section-shell" aria-labelledby="home-topics-title">
        <header className="split-heading"><div><p className="eyebrow"><NotebookPen aria-hidden="true" /> 最近整理</p><h2 id="home-topics-title">先读专题，再决定怎么走</h2></div><p>这些内容来自公开资料整理，会注明核对日期、适用范围和仍需现场确认的部分。</p></header>
        <div className="home-topic-grid">{latestTopics.map((entry) => <article className="home-topic-card" key={entry.slug}><Link to={`/journal/${entry.type}/${entry.slug}`} className="home-topic-image"><ResponsiveImage src={entry.cover.src} alt={entry.cover.alt} width="720" height="450" loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" /><span>旅行专题</span></Link><div><p className="eyebrow"><MapPin aria-hidden="true" /> {cityName(entry.cityId)} · {entry.reviewedAt} 核对</p><h3><Link to={`/journal/${entry.type}/${entry.slug}`}>{entry.title}</Link></h3><p>{entry.excerpt}</p><div className="journal-tags">{entry.tags.slice(0, 3).map((tag) => <span key={tag}>#{tag}</span>)}</div><Link to={`/journal/${entry.type}/${entry.slug}`} className="text-link">阅读全文 <ArrowRight aria-hidden="true" /></Link></div></article>)}</div>
        <div className="home-topics-footer"><Link to="/journal?type=guide" className="btn-secondary">查看全部旅行专题 <ArrowRight aria-hidden="true" /></Link></div>
      </section>

      <section className="home-journal section-shell">
        <div className="journal-home-card"><span className="date-stamp">宁夏<br />手记</span><p className="eyebrow"><NotebookPen aria-hidden="true" /> 旅行手记与专题</p><h2>亲历讲感受，专题帮你先把选择想清楚。</h2><p>个人游记与探店坚持真实发生；资料专题则从公开来源整理常见决策，并展示核对日期和适用边界。</p><Link to="/journal?type=guide" className="btn-primary">阅读旅行专题 <ArrowRight aria-hidden="true" /></Link></div>
        <aside className="verification-note"><ShieldAlert aria-hidden="true" /><div><strong>信息有出处，配图有说明</strong><p>核心事实由直接来源支撑；区域氛围图会明确标注，不会被当成景点实景。</p><Link to="/about" className="text-link">了解内容方法 <ArrowRight aria-hidden="true" /></Link></div></aside>
      </section>
    </>
  );
}
