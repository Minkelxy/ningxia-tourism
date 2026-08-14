import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Route, Sparkles, Utensils } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { getPublishedAttractionsByCity } from '../data/attractions';
import { cities, getCityById } from '../data/cities';
import { routes } from '../data/routes';

export default function CityOverview() {
  const { name } = useParams();
  const city = getCityById(name);

  if (name && !city) return <div className="full-state"><SEO title="城市未找到 · 宁夏旅行地图" noIndex /><MapPin aria-hidden="true" /><h1>没有找到这座城市</h1><p>宁夏旅行地图目前覆盖五个地级市。</p><Link to="/cities" className="btn-primary">查看五城概览</Link></div>;

  if (city) {
    const attractions = getPublishedAttractionsByCity(city.id);
    const attractionIds = new Set(attractions.map((item) => item.id));
    const relatedRoutes = routes.filter((route) => route.days.some((day) => day.stops.some((stop) => stop.attractionId && attractionIds.has(stop.attractionId))));
    return (
      <>
        <SEO title={`${city.name}旅行指南 · 宁夏旅行地图`} description={city.introduction} image={city.image.src} />
        <div>
          <header className="city-detail-hero"><ResponsiveImage src={city.image.src} alt={city.image.alt} width="1600" height="960" sizes="100vw" /><div className="detail-overlay" /><div className="city-detail-copy"><Link to="/cities" className="back-link"><ArrowLeft aria-hidden="true" /> 五城概览</Link><p className="eyebrow">{city.nickname}</p><h1>{city.name}</h1><p>{city.introduction}</p></div></header>
          <div className="section-shell city-detail-layout">
            <article>
              <section className="city-facts"><div><MapPin aria-hidden="true" /><span>旅行角色</span><strong>{city.travelRole}</strong></div><div><Route aria-hidden="true" /><span>行程衔接</span><strong>{city.connectionNote}</strong></div><div><CalendarDays aria-hidden="true" /><span>推荐季节</span><strong>{city.bestSeason}</strong></div></section>
              <section className="detail-section"><p className="eyebrow">城市脉络</p><h2>从哪里读懂{city.name.replace('市', '')}</h2><p className="detail-summary">{city.history}</p><div className="culture-note"><Sparkles aria-hidden="true" /><span>关键词</span><strong>{city.culture}</strong></div></section>
              <section className="detail-section"><p className="eyebrow">城市味道</p><h2>值得留意的本地风味</h2><div className="food-tags">{city.foods.map((food) => <span key={food}><Utensils aria-hidden="true" />{food}</span>)}</div><p className="fine-print">餐饮门店变化较快，本站只提供品类参考，请选择证照齐全、明码标价的正规商户。</p></section>
            </article>
            <aside className="city-side-note"><p className="eyebrow">旅行节奏</p><h2>{attractions.length ? `${attractions.length} 个公开景点` : '更多内容正在核实'}</h2><p>{attractions.filter((item) => item.verificationLevel === 'verified').length} 个已核实，{attractions.filter((item) => item.verificationLevel === 'review').length} 个待复核。跨城交通请留出弹性。</p></aside>
          </div>
          <section className="section-shell detail-section"><div className="split-heading section-heading"><div><p className="eyebrow">精选目的地</p><h2>{city.name}从这里开始</h2></div><Link to={`/attractions?city=${city.id}`} className="text-link">查看全部 <ArrowRight aria-hidden="true" /></Link></div>{attractions.length ? <div className="city-attraction-row">{attractions.map((item) => <Link key={item.id} to={`/attraction/${item.id}`}><ResponsiveImage src={item.images[0].src} alt={item.images[0].alt} loading="lazy" width="240" height="180" sizes="120px" /><span><strong>{item.name}</strong><small>{item.visitInfo.duration}</small></span></Link>)}</div> : <div className="empty-state compact"><p>该城市的正式内容正在逐条核实。</p></div>}</section>
          <section className="city-routes"><div className="section-shell"><p className="eyebrow">把城市放进行程</p><h2>包含{city.name}的推荐路线</h2><div className="route-mini-grid">{relatedRoutes.slice(0, 3).map((route) => <Link key={route.id} to={`/routes/${route.id}`}><span>{route.durationLabel}</span><strong>{route.name}</strong><ArrowRight aria-hidden="true" /></Link>)}</div></div></section>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="宁夏五城概览 · 宁夏旅行地图" description="认识银川、石嘴山、吴忠、固原和中卫五座城市的旅行气质。" />
      <header className="page-hero compact-hero"><div className="section-shell"><p className="eyebrow">五座城市 · 五种旅行气质</p><h1>宁夏不只有沙漠</h1><p>黄河自南向北穿过平原，贺兰山守住西侧，六盘山抬起南部。选择一座城市，开始理解它的历史、味道与旅行节奏。</p></div></header>
      <div className="section-shell page-content"><div className="city-grid">{cities.map((item) => {
        const count = getPublishedAttractionsByCity(item.id).length;
        return <article className="city-card" key={item.id}><Link to={`/city/${item.id}`} className="city-card-image"><ResponsiveImage src={item.image.src} alt={item.image.alt} loading="lazy" width="720" height="720" sizes="(max-width: 768px) 100vw, 44vw" /><span>{item.nickname}</span></Link><div><p className="eyebrow"><MapPin aria-hidden="true" /> {count} 个公开景点</p><h2>{item.name}</h2><p>{item.introduction}</p><div className="city-card-meta"><span>{item.bestSeason}</span><span>{item.culture.split('、')[0]}</span></div><Link to={`/city/${item.id}`} className="text-link">查看城市指南 <ArrowRight aria-hidden="true" /></Link></div></article>;
      })}</div></div>
    </>
  );
}
