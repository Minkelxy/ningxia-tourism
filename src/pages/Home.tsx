import { ArrowDown, ArrowRight, BadgeCheck, CalendarCheck2, CalendarDays, MapPinned, NotebookPen, ShieldAlert, TrainFront } from 'lucide-react';
import { Link } from 'react-router-dom';
import NingxiaInteractiveMap from '../components/NingxiaInteractiveMap';
import SEO from '../components/SEO';
import { reviewAttractions, verifiedAttractions } from '../data/attractions';
import { cities } from '../data/cities';
import { routes } from '../data/routes';

export default function Home() {
  return (
    <>
      <SEO />
      <section className="home-hero">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><BadgeCheck aria-hidden="true" /> {verifiedAttractions.length} 个已核实 · {reviewAttractions.length} 个待复核</p>
          <h1>沿着黄河，<br /><span>遇见宁夏。</span></h1>
          <p className="hero-lead">从贺兰山下的西夏陵，到腾格里沙漠与黄河相拥的沙坡头。用地图认识五座城市，用路线安排行程，也用真实手记保留旅途细节。</p>
          <div className="hero-actions">
            <a href="#explore-map" className="btn-primary"><MapPinned aria-hidden="true" /> 按地图探索</a>
            <Link to="/routes" className="btn-quiet"><CalendarDays aria-hidden="true" /> 查看推荐路线 <ArrowRight aria-hidden="true" /></Link>
            <Link to="/journal" className="btn-quiet"><NotebookPen aria-hidden="true" /> 旅行手记</Link>
          </div>
          <dl className="hero-stats">
            <div><dt>座城市</dt><dd>{cities.length}</dd></div><div><dt>个已核实景点</dt><dd>{verifiedAttractions.length}</dd></div><div><dt>个待复核景点</dt><dd>{reviewAttractions.length}</dd></div><div><dt>条主题路线</dt><dd>{routes.length}</dd></div>
          </dl>
        </div>
        <div className="hero-landscape" aria-label="宁夏山河主题图形">
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
        <NingxiaInteractiveMap />
      </section>

      <section className="home-next section-shell">
        <div className="home-next-copy"><p className="eyebrow">不想从地图开始？</p><h2>按时间选择一条路线</h2><p>从银川一日精华到五日全景，每条路线都标出交通衔接、用餐区域和需要再次确认的信息。</p></div>
        <Link to="/routes" className="route-poster"><span>1—5 天</span><strong>七条路线<br />把宁夏串起来</strong><span className="text-link">开始选择 <ArrowRight aria-hidden="true" /></span></Link>
      </section>

      <section className="home-guide-teaser section-shell">
        <div><p className="eyebrow"><CalendarCheck2 aria-hidden="true" /> 出发前先看</p><h2>季节、天数、跨城交通，<br />一次理清。</h2><p>四季怎么选、银川和中卫怎么串、包车与铁路如何分工，再用一份保存在本机的清单完成最后检查。</p><Link to="/guide" className="btn-primary">打开行前指南 <ArrowRight aria-hidden="true" /></Link></div>
        <div className="home-guide-points"><article><span>01</span><strong>按季节</strong><small>花期、避暑、秋色与淡季节奏</small></article><article><span>02</span><strong>按天数</strong><small>从 1 天到 5 天直接进入匹配路线</small></article><article><TrainFront aria-hidden="true" /><strong>看衔接</strong><small>铁路连主城，公路进入分散景区</small></article></div>
      </section>

      <section className="home-journal section-shell">
        <div className="journal-home-card"><span className="date-stamp">宁夏<br />手记</span><p className="eyebrow"><NotebookPen aria-hidden="true" /> 旅行手记</p><h2>攻略解决“怎么走”，手记回答“走过以后怎么想”。</h2><p>只记录真实发生的旅程与到店体验。首篇内容仍在整理中，模板不会冒充经历，价格和排队信息也会绑定到店日期。</p><Link to="/journal" className="btn-primary">看看记录原则 <ArrowRight aria-hidden="true" /></Link></div>
        <aside className="verification-note"><ShieldAlert aria-hidden="true" /><div><strong>信息有出处，配图有说明</strong><p>核心事实由直接来源支撑；区域氛围图会明确标注，不会被当成景点实景。</p><Link to="/about" className="text-link">了解内容方法</Link></div></aside>
      </section>
    </>
  );
}
