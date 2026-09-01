import { useMemo } from 'react';
import { ArrowLeft, CalendarDays, CircleDollarSign, Clock3, ExternalLink, MapPin, Navigation, NotebookPen, Share2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { getJournalEntry, isPublishedJournalEntry } from '../content/journal';
import { getAttractionById } from '../data/attractions';
import { cityName } from '../data/cities';
import { getRouteById } from '../data/routes';
import { createAmapMarkerUrl } from '../lib/site';
import useShare from '../lib/useShare';

const headingId = (value: string) => value.trim().replace(/\s+/g, '-');

export default function JournalDetail() {
  const { type, slug } = useParams();
  const entry = getJournalEntry(type, slug);
  // Hooks 必须在任何 early return 之前调用，参数使用空字符串兜底
  const { handleShare, ShareToast } = useShare(entry?.title ?? '', entry?.excerpt ?? '');
  const headings = useMemo(() => (entry?.body ?? '').split('\n').flatMap((line) => { const match = line.match(/^(##|###)\s+(.+)$/); return match ? [{ level: match[1].length, text: match[2], id: headingId(match[2]) }] : []; }), [entry?.body]);
  if (!entry || !isPublishedJournalEntry(entry)) return <div className="full-state journal-missing"><SEO title="内容整理中 · 宁夏旅行地图" noIndex /><NotebookPen aria-hidden="true" /><p className="eyebrow">内容整理中</p><h1>这篇内容还没有公开</h1><p>亲历手记会先核对真实经历与照片，旅行专题会先补齐资料来源。完成前不会进入公开列表。</p><Link to="/journal" className="btn-primary">返回旅行手记</Link></div>;
  const food = entry.type === 'food' ? entry : null;
  const travel = entry.type === 'travel' ? entry : null;
  const guide = entry.type === 'guide' ? entry : null;
  const mapUrl = food ? createAmapMarkerUrl(food.mapQuery) : createAmapMarkerUrl(`${cityName(entry.cityId)} ${entry.locality}`);
  const contentLabel = travel ? '个人游记' : food ? '探店记录' : '旅行专题 · 资料整理';
  const contentDate = travel?.tripDate || food?.visitedAt || guide?.reviewedAt;
  return <>
    <SEO title={`${entry.title} · ${guide ? '旅行专题' : '旅行手记'}`} description={entry.excerpt} image={entry.cover.src} type="article" publishedAt={entry.publishedAt} updatedAt={entry.updatedAt} author={entry.author} />
    <div className="journal-detail"><header className="journal-detail-hero"><ResponsiveImage src={entry.cover.src} alt={entry.cover.alt} loading="eager" fetchPriority="high" width="1600" height="960" sizes="100vw" /><div className="detail-overlay" /><div className="section-shell journal-detail-title"><Link to={`/journal?type=${entry.type}`} className="back-link"><ArrowLeft aria-hidden="true" />旅行手记</Link><p className="eyebrow">{contentLabel} · {entry.author}</p><h1>{entry.title}</h1><p>{entry.excerpt}</p><button type="button" className="icon-button" onClick={handleShare} aria-label="分享内容"><Share2 aria-hidden="true" /></button></div></header>
      {ShareToast}
      <div className="section-shell journal-detail-layout"><article className="journal-article"><div className="journal-fact-strip"><span><CalendarDays aria-hidden="true" />{guide ? `资料核对 ${contentDate}` : contentDate}</span><span><MapPin aria-hidden="true" />{cityName(entry.cityId)} · {entry.locality}</span>{travel && <span><Clock3 aria-hidden="true" />{travel.duration}</span>}{food && <span><CircleDollarSign aria-hidden="true" />{food.pricePerPerson}</span>}</div>
        {travel && <section className="receipt-card"><span>TRIP NOTE</span><dl><div><dt>交通</dt><dd>{travel.transport}</dd></div><div><dt>花费复盘</dt><dd>{travel.budgetNote}</dd></div><div><dt>这次记住</dt><dd>{travel.highlights.join(' · ')}</dd></div></dl></section>}
        {food && <section className="receipt-card"><span>FOOD NOTE</span><h2>{food.venueName}</h2><dl><div><dt>菜系</dt><dd>{food.cuisine}</dd></div><div><dt>地址</dt><dd>{food.address}</dd></div><div><dt>点单</dt><dd>{food.dishes.join(' · ')}</dd></div><div><dt>排队</dt><dd>{food.queueNote}</dd></div><div><dt>适合</dt><dd>{food.suitableFor}</dd></div><div><dt>再访</dt><dd>{food.revisitNote}</dd></div></dl></section>}
        {guide && <section className="receipt-card editorial-note"><span>EDITORIAL NOTE</span><h2>这是一篇资料型专题</h2><dl><div><dt>适用范围</dt><dd>{guide.scopeNote}</dd></div><div><dt>关键判断</dt><dd>{guide.keyPoints.join(' · ')}</dd></div><div><dt>资料核对</dt><dd>{guide.reviewedAt}</dd></div></dl></section>}
        <div className="markdown-body"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ h2: ({ children }) => <h2 id={headingId(String(children))}>{children}</h2>, h3: ({ children }) => <h3 id={headingId(String(children))}>{children}</h3> }}>{entry.body}</ReactMarkdown></div>
        {entry.gallery.length > 0 && <section className="journal-gallery">{entry.gallery.map((image) => <figure key={image.src}><ResponsiveImage src={image.src} alt={image.alt} width="720" height="540" loading="lazy" sizes="(max-width: 768px) calc(100vw - 32px), 560px" /><figcaption>{image.credit} · {image.license}</figcaption></figure>)}</section>}
      </article><aside className="journal-sidebar"><div className="date-stamp">{entry.publishedAt.slice(0, 7).replace('-', '.')}<br />宁夏</div>{headings.length > 0 && <nav className="journal-toc" aria-label="正文目录"><h2>这篇写了什么</h2>{headings.map((heading) => <a key={`${heading.level}-${heading.id}`} className={heading.level === 3 ? 'sub' : ''} href={`#${heading.id}`}>{heading.text}</a>)}</nav>}<a className="btn-quiet journal-map-link" href={mapUrl} target="_blank" rel="noreferrer"><Navigation aria-hidden="true" />高德查看地点</a><div className="journal-change-note"><h2>关于时效</h2><p>{guide ? '这篇专题基于列出的公开资料整理，不是亲历记录。开放、票价、交通和活动仍需在出发前确认。' : food ? '这是一次到店当日的个人体验，不代表商户当前价格、营业时间或长期水平。' : '交通、开放和消费信息会变化，文章只代表当次旅行条件。'}</p></div>{guide && <div className="journal-sources"><h2>资料来源</h2>{guide.references.map((source) => <a className="source-link" key={source.url} href={source.url} target="_blank" rel="noreferrer"><span>{source.label}</span><small>核对 {source.checkedAt}</small><ExternalLink aria-hidden="true" /></a>)}</div>}{entry.relatedAttractionIds.length > 0 && <div className="related-notes"><h2>相关景点</h2>{entry.relatedAttractionIds.map((id) => { const item = getAttractionById(id); return item && <Link key={id} to={`/attraction/${id}`}>{item.name}</Link>; })}</div>}{entry.relatedRouteIds.length > 0 && <div className="related-notes"><h2>相关路线</h2>{entry.relatedRouteIds.map((id) => { const route = getRouteById(id); return route && <Link key={id} to={`/routes/${id}`}>{route.name}</Link>; })}</div>}<div className="image-credit"><span>封面图片</span><a href={entry.cover.sourceUrl} target="_blank" rel="noreferrer">{entry.cover.credit} · {entry.cover.license}</a></div></aside></div>
    </div>
  </>;
}
