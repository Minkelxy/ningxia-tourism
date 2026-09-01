import { ArrowLeft, ExternalLink, MapPin, Navigation, Share2, ShieldCheck, Utensils, UtensilsCrossed } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { cityName } from '../data/cities';
import { foodById } from '../data/foods';
import { createAmapMarkerUrl, formatVerifiedDate, getVerificationFreshness } from '../lib/site';
import useShare from '../lib/useShare';
import type { FoodCategory } from '../types';

const foodCategoryLabels: Record<FoodCategory, string> = {
  mutton: '羊肉', noodle: '面食', snack: '小吃', drink: '饮品', fruit: '瓜果', specialty: '特产', staple: '主食',
};
const sourceLevelLabels = { direct: '直接专页', directory: '专题目录', homepage: '机构首页' } as const;
const sourceCoverageLabels = { overview: '美食概况', visit: '开放预约', location: '地址交通' } as const;

export default function FoodDetail() {
  const { id } = useParams();
  const food = foodById(id ?? '');
  const { handleShare, ShareToast } = useShare(food?.name ?? '', food?.description ?? '');

  if (!food || food.status !== 'published') return (
    <div className="full-state"><SEO title="美食未找到 · 宁夏旅行地图" noIndex /><UtensilsCrossed aria-hidden="true" /><h1>没有找到这道美食</h1><p>链接可能已经变更，回到美食列表继续探索。</p><Link to="/foods" className="btn-primary">浏览全部美食</Link></div>
  );

  const freshness = getVerificationFreshness(food.verifiedAt);

  return (
    <>
      <SEO title={`${food.name} · 宁夏美食 · 宁夏旅行地图`} description={food.description} />
      <div className="detail-page">
        <header className="page-hero compact-hero food-detail-hero">
          <div className="section-shell food-detail-hero-grid">
            <div>
              <Link to="/foods" className="back-link"><ArrowLeft aria-hidden="true" /> 返回美食列表</Link>
              <p className="eyebrow"><UtensilsCrossed aria-hidden="true" /> {foodCategoryLabels[food.category]}</p>
              <h1>{food.name}</h1>
              <p><MapPin aria-hidden="true" /> 产地：{food.origin}{food.verificationLevel === 'verified' ? ' · 已核实' : ' · 待复核'}</p>
              <div className="route-detail-actions"><button type="button" className="btn-quiet" onClick={handleShare}><Share2 aria-hidden="true" /> 分享美食</button></div>
            </div>
            <div className="food-detail-visual">
              <ResponsiveImage src={food.image.src} alt={food.image.alt} width="720" height="480" loading="eager" fetchPriority="high" sizes="(max-width: 768px) 100vw, 42vw" />
              <span>{food.image.credit} · {food.image.license}</span>
            </div>
          </div>
        </header>
        {ShareToast}

        <div className="detail-layout section-shell">
          <article className="detail-main">
            <p className="eyebrow">美食概览</p><h2>这道菜是什么</h2><p className="detail-summary">{food.description}</p>
            <section className="detail-section"><div className="section-heading-inline"><Utensils aria-hidden="true" /><div><p className="eyebrow">出发前必看</p><h2>实用信息</h2></div></div><div className="info-grid">
              {food.bestSeason && <div><Utensils aria-hidden="true" /><span>最佳季节</span><strong>{food.bestSeason}</strong></div>}
              {food.priceRange && <div><Utensils aria-hidden="true" /><span>价格参考</span><strong>{food.priceRange}</strong></div>}
              <div><MapPin aria-hidden="true" /><span>产地</span><strong>{food.origin}</strong></div>
            </div></section>
            {food.restaurants.length > 0 && <section className="detail-section"><p className="eyebrow">推荐餐厅</p><h2>在哪里能吃到</h2><p className="detail-summary">餐厅信息变化快，以下仅为区域和品类建议，不为具体商户背书；出发前请核实营业状态。</p><div className="info-grid">{food.restaurants.map((restaurant) => {
              const mapUrl = restaurant.coordinates ? createAmapMarkerUrl(restaurant.name, restaurant.coordinates) : createAmapMarkerUrl(restaurant.name);
              return <div key={restaurant.name}><MapPin aria-hidden="true" /><span>{cityName(restaurant.cityId)}</span><strong>{restaurant.name}</strong>{restaurant.recommend && <small>推荐：{restaurant.recommend}</small>}{restaurant.coordinates && <a href={mapUrl} target="_blank" rel="noreferrer" className="text-link"><Navigation aria-hidden="true" /> 高德查看 <ExternalLink aria-hidden="true" /></a>}</div>;
            })}</div></section>}
            {food.tips && <section className="detail-section travel-note"><h2>品尝提示</h2><p>{food.tips}</p></section>}
          </article>

          <aside className="detail-sidebar">
            <div className={`source-card verification-card ${food.verificationLevel}`}>
              <ShieldCheck aria-hidden="true" />
              <div><h2>{food.verificationLevel === 'verified' ? '核心资料已核实' : '资料待进一步复核'}</h2><p>{food.verificationLevel === 'verified' ? '本美食有官方直接专页或非遗项目专页支撑。' : '本美食仅有目录级或首页级来源，待进一步补齐直接专页。'}</p></div>
              <div className={`source-freshness ${freshness.status}`}><span>{freshness.label}</span><strong>{formatVerifiedDate(food.verifiedAt)}</strong>{freshness.days !== null && <small>{freshness.days === 0 ? '今天核验' : `${freshness.days} 天前`}</small>}</div>
              <div className="source-list">{food.sources.map((source) => <a className="source-link" key={source.url} href={source.url} target="_blank" rel="noreferrer"><span><strong>{source.label}</strong><small>{sourceLevelLabels[source.level]}{source.coverage.length > 0 ? ` · ${source.coverage.map((item) => sourceCoverageLabels[item]).join('／')}` : ' · 未直接支撑具体字段'} · 核对于 {formatVerifiedDate(source.checkedAt)}</small></span><ExternalLink aria-hidden="true" /></a>)}</div>
              <p className="source-disclaimer">餐厅营业状态、价格和推荐菜品属于易变信息，即使标为"已核实"，出发前也请打开直接来源或致电确认当日安排。</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
