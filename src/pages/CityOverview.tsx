import { useMemo } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Lightbulb, MapPin, Route, Sparkles, TrainFront, UsersRound, Utensils } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { getPublishedAttractionsByCity } from '../data/attractions';
import { cities, getCityById } from '../data/cities';
import { foodsByCity } from '../data/foods';
import { routes } from '../data/routes';
import type { FoodCategory } from '../types';

const foodCategoryLabels: Record<FoodCategory, string> = {
  mutton: '羊肉',
  noodle: '面食',
  snack: '小吃',
  drink: '饮品',
  fruit: '瓜果',
  specialty: '特产',
  staple: '主食',
};

// 五城概览卡片：一次性预计算每个城市的公开景点数，避免在 cities.map 内部重复调用
const cityCardMeta = cities.map((item) => ({ city: item, attractionCount: getPublishedAttractionsByCity(item.id).length }));

export default function CityOverview() {
  const { name } = useParams();
  const city = getCityById(name);
  // Hooks 必须在任何 early return 之前调用；city 为 undefined 时给空数组兜底
  const attractions = useMemo(() => (city ? getPublishedAttractionsByCity(city.id) : []), [city]);
  const attractionIds = useMemo(() => new Set(attractions.map((item) => item.id)), [attractions]);
  const relatedRoutes = useMemo(() => routes.filter((route) => route.days.some((day) => day.stops.some((stop) => stop.attractionId && attractionIds.has(stop.attractionId)))), [attractionIds]);
  const cityFoods = useMemo(() => (city ? foodsByCity(city.id) : []), [city]);

  if (name && !city) return <div className="full-state"><SEO title="城市未找到 · 宁夏旅行地图" noIndex /><MapPin aria-hidden="true" /><h1>没有找到这座城市</h1><p>宁夏旅行地图目前覆盖五个地级市。</p><Link to="/cities" className="btn-primary">查看五城概览</Link></div>;

  if (city) {
    return (
      <>
        <SEO title={`${city.name}旅行指南 · 宁夏旅行地图`} description={city.introduction} image={city.image.src} />
        <div>
          <header className="city-detail-hero"><ResponsiveImage src={city.image.src} alt={city.image.alt} loading="eager" fetchPriority="high" width="1600" height="960" sizes="100vw" /><div className="detail-overlay" /><div className="city-detail-copy"><Link to="/cities" className="back-link"><ArrowLeft aria-hidden="true" /> 五城概览</Link><p className="eyebrow">{city.nickname}</p><h1>{city.name}</h1><p>{city.introduction}</p></div></header>
          <div className="section-shell city-detail-layout">
            <article>
              <section className="city-facts"><div><Clock3 aria-hidden="true" /><span>建议停留</span><strong>{city.suggestedStay}</strong></div><div><MapPin aria-hidden="true" /><span>旅行角色</span><strong>{city.travelRole}</strong></div><div><Route aria-hidden="true" /><span>行程衔接</span><strong>{city.connectionNote}</strong></div><div><CalendarDays aria-hidden="true" /><span>推荐季节</span><strong>{city.bestSeason}</strong></div></section>
              <section className="detail-section"><p className="eyebrow">城市脉络</p><h2>从哪里读懂{city.name.replace('市', '')}</h2><p className="detail-summary">{city.history}</p><div className="culture-note"><Sparkles aria-hidden="true" /><span>关键词</span><strong>{city.culture}</strong></div></section>
              <section className="detail-section"><p className="eyebrow">城市味道</p><h2>值得留意的本地风味</h2>{cityFoods.length ? <div className="source-card"><div className="source-list">{cityFoods.map((food) => <Link key={food.id} to={`/food/${food.id}`}><span><strong>{food.name}</strong><small>{food.description} · {foodCategoryLabels[food.category]}{food.priceRange ? ` · ${food.priceRange}` : ''}</small></span><Utensils aria-hidden="true" /></Link>)}</div></div> : <div className="food-tags">{city.foods.map((food) => <span key={food}><Utensils aria-hidden="true" />{food}</span>)}</div>}<p className="fine-print">餐饮门店变化较快，本站只提供品类参考，请选择证照齐全、明码标价的正规商户。</p></section>
            </article>
            <aside className="city-sidebar">
              <section className="city-decision-card"><p className="eyebrow"><UsersRound aria-hidden="true" /> 编辑建议</p><h2>适不适合放进这趟行程</h2><div className="city-best-for">{city.bestFor.map((item) => <span key={item}>{item}</span>)}</div><p className="city-arrival-note"><TrainFront aria-hidden="true" />{city.arrivalNote}</p><div className="city-planning-tip"><Lightbulb aria-hidden="true" /><p><strong>关键提醒</strong>{city.planningTip}</p></div></section>
              <section className="city-side-note"><p className="eyebrow">资料覆盖</p><h2>{attractions.length ? `${attractions.length} 个公开景点` : '更多内容正在核实'}</h2><p>{attractions.filter((item) => item.verificationLevel === 'verified').length} 个已核实，{attractions.filter((item) => item.verificationLevel === 'review').length} 个待复核。开放、交通与天气仍请出发前确认。</p></section>
            </aside>
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
      <header className="page-hero compact-hero"><div className="section-shell"><p className="eyebrow">五座城市 · 五种旅行气质</p><h1>宁夏不只有沙漠</h1><p>先比较停留时间、适合人群与交通衔接，再选择一座城市，理解它的历史、味道与旅行节奏。</p></div></header>
      <div className="section-shell page-content">
        <section className="city-comparison" aria-labelledby="city-comparison-title"><header><div><p className="eyebrow">先选落脚点</p><h2 id="city-comparison-title">五城放在一起，怎么选</h2></div><p>停留时间和取舍属于编辑建议，帮助比较行程结构；班次、道路和景区项目仍以出发日信息为准。</p></header><p className="city-comparison-hint">手机上可左右滑动查看完整比较</p><div className="city-table-wrap" role="region" aria-label="五城旅行比较表" tabIndex={0}><table><thead><tr><th scope="col">城市</th><th scope="col">建议停留</th><th scope="col">更适合</th><th scope="col">抵达与衔接</th><th scope="col">关键提醒</th><th scope="col"><span className="sr-only">操作</span></th></tr></thead><tbody>{cities.map((item) => <tr key={item.id}><th scope="row"><Link to={`/city/${item.id}`}>{item.name}</Link><small>{item.travelRole}</small></th><td><span className="city-stay-pill">{item.suggestedStay}</span></td><td><div className="city-table-tags">{item.bestFor.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div></td><td>{item.arrivalNote}</td><td>{item.planningTip}</td><td><Link to={`/city/${item.id}`} className="text-link">查看 <ArrowRight aria-hidden="true" /></Link></td></tr>)}</tbody></table></div></section>
        <div className="city-grid">{cityCardMeta.map(({ city: item, attractionCount: count }) => {
        return <article className="city-card" key={item.id}><Link to={`/city/${item.id}`} className="city-card-image"><ResponsiveImage src={item.image.src} alt={item.image.alt} loading="lazy" width="720" height="720" sizes="(max-width: 768px) 100vw, 44vw" /><span>{item.nickname}</span></Link><div><p className="eyebrow"><MapPin aria-hidden="true" /> {count} 个公开景点</p><h2>{item.name}</h2><p>{item.introduction}</p><div className="city-card-meta"><span><Clock3 aria-hidden="true" />{item.suggestedStay}</span>{item.bestFor.slice(0, 2).map((tag) => <span key={tag}>{tag}</span>)}</div><Link to={`/city/${item.id}`} className="text-link">查看城市指南 <ArrowRight aria-hidden="true" /></Link></div></article>;
      })}</div></div>
    </>
  );
}
