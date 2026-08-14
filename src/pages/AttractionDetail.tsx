import { useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, ExternalLink, ImageOff, Info, MapPin, Navigation, Share2, ShieldCheck, Ticket } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { getAttractionById, publishedAttractions } from '../data/attractions';
import { cityName } from '../data/cities';
import { categoryMeta } from '../data/meta';
import { attractionMapUrl, formatVerifiedDate, sharePage } from '../lib/site';

export default function AttractionDetail() {
  const { id } = useParams();
  const attraction = getAttractionById(id);
  const [imageIndex, setImageIndex] = useState(0);
  const [shareStatus, setShareStatus] = useState('');

  if (!attraction) return (
    <main className="full-state"><SEO title="景点未找到 · 宁夏旅行地图" noIndex /><ImageOff aria-hidden="true" /><h1>没有找到这个景点</h1><p>链接可能已经变更，回到精选景点继续探索。</p><Link to="/attractions" className="btn-primary">浏览精选景点</Link></main>
  );

  if (attraction.status === 'draft') return (
    <main className="full-state"><SEO title={`${attraction.name}资料核实中 · 宁夏旅行地图`} noIndex /><ShieldCheck aria-hidden="true" /><p className="eyebrow">资料核实中</p><h1>{attraction.name}</h1><p>我们正在核对开放安排、交通信息和图片授权。为避免误导，核实完成前不展示旧资料。</p><div className="state-actions"><Link to="/attractions" className="btn-primary">查看已核实景点</Link><Link to="/" className="btn-quiet">返回地图</Link></div></main>
  );

  const category = categoryMeta[attraction.category];
  const currentImage = attraction.images[imageIndex];
  const nearby = publishedAttractions.filter((item) => attraction.nearbyIds.includes(item.id));

  const handleShare = async () => {
    try { setShareStatus(await sharePage(attraction.name, attraction.summary)); }
    catch { setShareStatus('分享已取消'); }
    window.setTimeout(() => setShareStatus(''), 2400);
  };

  return (
    <>
      <SEO title={`${attraction.name}旅行指南 · 宁夏旅行地图`} description={attraction.summary} image={currentImage.src} />
      <main className="detail-page">
        <div className="detail-hero">
          <ResponsiveImage src={currentImage.src} alt={currentImage.alt} width="1600" height="960" sizes="100vw" />
          <div className="detail-overlay" />
          <div className="detail-top-actions"><Link to="/attractions" className="icon-button" aria-label="返回景点列表"><ArrowLeft aria-hidden="true" /></Link><button type="button" className="icon-button" onClick={handleShare} aria-label="分享此景点"><Share2 aria-hidden="true" /></button></div>
          <div className="detail-title"><div className="detail-badges"><span className={`category-badge ${category.className}`}>{category.label}</span><span className={`verification-badge ${attraction.verificationLevel}`}>{attraction.verificationLevel === 'verified' ? '已核实' : '待复核'}</span></div><h1>{attraction.name}</h1><p><MapPin aria-hidden="true" /> {cityName(attraction.cityId)} · {attraction.locality}</p></div>
          {attraction.images.length > 1 && <div className="image-dots" aria-label="选择图片">{attraction.images.map((item, index) => <button type="button" key={item.src} onClick={() => setImageIndex(index)} aria-label={`查看第 ${index + 1} 张图片`} aria-pressed={imageIndex === index} />)}</div>}
        </div>
        {shareStatus && <div className="toast" role="status">{shareStatus}</div>}

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
            <div className={`source-card verification-card ${attraction.verificationLevel}`}><ShieldCheck aria-hidden="true" /><div><h2>{attraction.verificationLevel === 'verified' ? '资料已严格核实' : '资料待进一步复核'}</h2><p>{attraction.verificationLevel === 'verified' ? '核心事实有官方直接页面支撑，图片准确对应并具有清晰许可。' : '目前来源或图片证据尚未同时达到严格标准，信息可供规划，但请优先查看官方最新公告。'} 校订于 {formatVerifiedDate(attraction.verifiedAt)}。</p></div>{attraction.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink aria-hidden="true" /></a>)}</div>
            <div className="image-credit"><span>图片来源</span><a href={currentImage.sourceUrl} target="_blank" rel="noreferrer">{currentImage.credit} · {currentImage.license}<ExternalLink aria-hidden="true" /></a></div>
          </aside>
        </div>
      </main>
    </>
  );
}
