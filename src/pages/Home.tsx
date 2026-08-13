import { ArrowDown, ArrowRight, BadgeCheck, CalendarDays, MapPinned } from 'lucide-react';
import { Link } from 'react-router-dom';
import NingxiaInteractiveMap from '../components/NingxiaInteractiveMap';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO />
      <section className="home-hero">
        <div className="hero-orbit hero-orbit-one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><BadgeCheck aria-hidden="true" /> 12 个景点资料已核实</p>
          <h1>沿着黄河，<br /><span>遇见宁夏。</span></h1>
          <p className="hero-lead">从贺兰山下的西夏陵，到腾格里沙漠与黄河相拥的沙坡头。用地图认识五座城市，用路线安排一次真正可执行的宁夏旅行。</p>
          <div className="hero-actions">
            <a href="#explore-map" className="btn-primary"><MapPinned aria-hidden="true" /> 按地图探索</a>
            <Link to="/routes" className="btn-quiet"><CalendarDays aria-hidden="true" /> 查看推荐路线 <ArrowRight aria-hidden="true" /></Link>
          </div>
          <dl className="hero-stats">
            <div><dt>座城市</dt><dd>5</dd></div><div><dt>个精选景点</dt><dd>12</dd></div><div><dt>条主题路线</dt><dd>7</dd></div>
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
          <p>先选择一座城市继续放大，再点选景点查看预览。交通图层可以帮助你理解各地之间的连接。</p>
        </div>
        <NingxiaInteractiveMap />
      </section>

      <section className="home-next section-shell">
        <div className="home-next-copy"><p className="eyebrow">不想从地图开始？</p><h2>按时间选择一条路线</h2><p>从银川一日精华到五日全景，每条路线都标出交通衔接、用餐区域和需要再次确认的信息。</p></div>
        <Link to="/routes" className="route-poster"><span>1—5 天</span><strong>七条路线<br />把宁夏串起来</strong><span className="text-link">开始选择 <ArrowRight aria-hidden="true" /></span></Link>
      </section>
    </>
  );
}
