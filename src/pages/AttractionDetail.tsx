import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, ExternalLink, ImageOff, Info, MapPin, Navigation, RefreshCcw, Share2, ShieldCheck, Ticket } from 'lucide-react';
import { Link, Navigate, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { attractionAliases, getAttractionById, publishedAttractions } from '../data/attractions';
import { cityName } from '../data/cities';
import { categoryMeta } from '../data/meta';
import { attractionMapUrl, formatVerifiedDate, getVerificationFreshness } from '../lib/site';
import useShare from '../lib/useShare';
import FavoriteButton from '../components/FavoriteButton';

const sourceLevelLabels = { direct: '直接专页', directory: '专题目录', homepage: '机构首页' } as const;
const sourceCoverageLabels = { overview: '景点概况', visit: '开放预约', location: '地址交通' } as const;

export default function AttractionDetail() {
  const { id } = useParams();
  const attraction = getAttractionById(id);
  const replacementId = id ? attractionAliases[id] : undefined;
  const [imageIndex, setImageIndex] = useState(0);
  // Hooks 必须在任何 early return 之前调用，参数使用空字符串兜底
  const { handleShare, ShareToast } = useShare(attraction?.name ?? '', attraction?.summary ?? '');
  const nearby = useMemo(() => {
    if (!attraction) return [];
    const nearbyIds = new Set(attraction.nearbyIds);
    return publishedAttractions.filter((item) => nearbyIds.has(item.id));
  }, [attraction]);

  if (replacementId) return <Navigate to={`/attraction/${replacementId}`} replace />;

  if (!attraction) return (
    <div className="full-state"><SEO title="景点未找到 · 宁夏旅行地图" noIndex /><ImageOff aria-hidden="true" /><h1>没有找到这个景点</h1><p>链接可能已经变更，回到精选景点继续探索。</p><Link to="/attractions" className="btn-primary">浏览精选景点</Link></div>
  );

  if (attraction.status === 'draft') return (
    <div className="full-state"><SEO title={`${attraction.name}资料核实中 · 宁夏旅行地图`} noIndex /><ShieldCheck aria-hidden="true" /><p className="eyebrow">资料核实中</p><h1>{attraction.name}</h1><p>{attraction.verificationNote || '我们正在核对开放安排、交通信息和图片授权。为避免误导，核实完成前不展示旧资料。'}</p><div className="state-actions"><Link to="/attractions" className="btn-primary">查看已核实景点</Link><Link to="/" className="btn-quiet">返回地图</Link></div></div>
  );

  const category = categoryMeta[attraction.category];
  const currentImage = attraction.images[imageIndex];
  const freshness = getVerificationFreshness(attraction.verifiedAt);

  return (
    <>
      <SEO title={`${attraction.name}旅行指南 · 宁夏旅行地图`} description={attraction.summary} image={currentImage.src} />
      <div className="detail-page">
        <div className="detail-hero">
          <ResponsiveImage src={currentImage.src} alt={currentImage.alt} loading="eager" fetchPriority="high" width="1600" height="960" sizes="100vw" />
          <div className="detail-overlay" />
          <div className="detail-top-actions"><Link to="/attractions" className="icon-button" aria-label="返回景点列表"><ArrowLeft aria-hidden="true" /></Link><button type="button" className="icon-button" onClick={handleShare} aria-label="分享此景点"><Share2 aria-hidden="true" /></button><FavoriteButton kind="attraction" id={attraction.id} label={attraction.name} /></div>
          <div className="detail-title"><div className="detail-badges"><span className={`category-badge ${category.className}`}>{category.label}</span><span className={`verification-badge ${attraction.verificationLevel}`}>{attraction.verificationLevel === 'verified' ? '已核实' : '待复核'}</span><span className="detail-photo-badge">实景资料</span></div><h1>{attraction.name}</h1><p><MapPin aria-hidden="true" /> {cityName(attraction.cityId)} · {attraction.locality}</p></div>
          {attraction.images.length > 1 && <div className="image-dots" role="group" aria-label={`选择${attraction.name}图片`}>{attraction.images.map((item, index) => <button type="button" key={item.src} onClick={() => setImageIndex(index)} aria-label={`查看第 ${index + 1} 张图片`} aria-pressed={imageIndex === index} />)}</div>}
        </div>
        {ShareToast}

        <div className="detail-layout section-shell">
          <article className="detail-main">
            <p className="eyebrow">目的地概览</p><h2>为什么值得去</h2><p className="detail-summary">{attraction.summary}</p>
            <ul className="highlight-list">{attraction.highlights.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul>
            <section className="detail-section"><div className="section-heading-inline"><Info aria-hidden="true" /><div><p className="eyebrow">出发前必看</p><h2>实用信息</h2></div></div><div className="info-grid">
              <div><Clock3 aria-hidden="true" /><span>开放时间</span><strong>{attraction.visitInfo.openingHours}</strong></div>
              <div><Ticket aria-hidden="true" /><span>票价参考</span><strong>{attraction.visitInfo.ticketPrice}</strong></div>
              <div><CalendarDays aria-hidden="true" /><span>建议时长／季节</span><strong>{attraction.visitInfo.duration} · {attraction.visitInfo.bestSeason}</strong></div>
              <div><MapPin aria-hidden="true" /><span>地址</span><strong>{attraction.visitInfo.address}</strong></div>
            </div></section>
            <section className="detail-section travel-note"><h2>预约与交通</h2><div><strong>预约提示</strong><p>{attraction.visitInfo.reservation}</p></div><div><strong>到达方式</strong><p>{attraction.visitInfo.transportation}</p></div></section>
            {nearby.length > 0 && <section className="detail-section"><p className="eyebrow">顺路看看</p><h2>周边推荐</h2><div className="nearby-grid">{nearby.map((item) => <Link key={item.id} to={`/attraction/${item.id}`}><ResponsiveImage src={item.images[0].src} alt={item.images[0].alt} loading="lazy" width="180" height="180" sizes="90px" /><span><strong>{item.name}</strong><small>{item.visitInfo.duration}</small></span><ArrowRight aria-hidden="true" /></Link>)}</div></section>}
          </article>

          <aside className="detail-sidebar">
            <div className="planning-card"><p className="eyebrow">准备出发</p><h2>在地图中查看位置</h2><p>使用高德 URI 打开地点页面。本站不会获取或保存你的位置。</p><a href={attractionMapUrl(attraction)} target="_blank" rel="noreferrer" className="btn-primary"><Navigation aria-hidden="true" /> 高德查看／导航</a></div>
            {attraction.verificationLevel === 'review' && attraction.fallbackNote && <div className="review-fallback"><RefreshCcw aria-hidden="true" /><div><p className="eyebrow">现场有变化时</p><h2>不用原地等，直接切换 Plan B</h2><p>{attraction.fallbackNote}</p><Link to={`/attractions?city=${attraction.cityId}`} className="text-link">查看同城其他景点 <ArrowRight aria-hidden="true" /></Link></div></div>}
            <div className={`source-card verification-card ${attraction.verificationLevel}`}>
              <ShieldCheck aria-hidden="true" />
              <div><h2>{attraction.verificationLevel === 'verified' ? '核心资料已核实' : '资料待进一步复核'}</h2><p>{attraction.verificationNote}</p></div>
              <div className={`source-freshness ${freshness.status}`}><span>{freshness.label}</span><strong>{formatVerifiedDate(attraction.verifiedAt)}</strong>{freshness.days !== null && <small>{freshness.days === 0 ? '今天核验' : `${freshness.days} 天前`}</small>}</div>
              <div className="source-list">{attraction.sources.map((source) => <a className="source-link" key={source.url} href={source.url} target="_blank" rel="noreferrer"><span><strong>{source.label}</strong><small>{sourceLevelLabels[source.level]}{source.coverage.length > 0 ? ` · ${source.coverage.map((item) => sourceCoverageLabels[item]).join('／')}` : ' · 未直接支撑具体字段'} · 核对于 {formatVerifiedDate(source.checkedAt)}</small></span><ExternalLink aria-hidden="true" /></a>)}</div>
              <p className="source-disclaimer">开放时间、票价、预约和交通属于易变信息，即使标为“已核实”，出发前也请打开直接来源确认当日安排。</p>
            </div>
            <div className="image-credit"><span>图片说明</span><strong>{currentImage.alt}</strong><a className="source-link" href={currentImage.sourceUrl} target="_blank" rel="noreferrer">{currentImage.credit} · {currentImage.license}<ExternalLink aria-hidden="true" /></a></div>
          </aside>
        </div>
      </div>
    </>
  );
}
