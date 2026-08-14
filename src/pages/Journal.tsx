import { ArrowRight, BookOpenText, FileText, MapPin, NotebookPen, Store, Tags } from 'lucide-react';
import { useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { publishedJournalEntries } from '../content/journal';
import { cities, cityName } from '../data/cities';
import type { JournalType } from '../types';

const tabs: Array<{ type: JournalType; label: string }> = [
  { type: 'travel', label: '个人游记' },
  { type: 'food', label: '探店记录' },
  { type: 'guide', label: '旅行专题' },
];

const typeLabel = (type: JournalType) => type === 'travel' ? '游记' : type === 'food' ? '探店' : '资料专题';

export default function Journal() {
  const [params, setParams] = useSearchParams();
  const requestedType = params.get('type');
  const type: JournalType = requestedType === 'food' || requestedType === 'guide' ? requestedType : 'travel';
  const city = params.get('city') ?? 'all';
  const tag = params.get('tag') ?? 'all';
  const typeEntries = publishedJournalEntries.filter((entry) => entry.type === type);
  const tags = [...new Set(typeEntries.flatMap((entry) => entry.tags))];
  const entries = typeEntries.filter((entry) => (city === 'all' || entry.cityId === city) && (tag === 'all' || entry.tags.includes(tag)));
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const setFilter = (key: string, value: string) => { const next = new URLSearchParams(params); if (value === 'all') next.delete(key); else next.set(key, value); setParams(next, { replace: true }); };
  const switchType = (value: JournalType) => { const next = new URLSearchParams(params); next.set('type', value); next.delete('tag'); setParams(next, { replace: true }); };
  const handleTabKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    switchType(tabs[nextIndex].type);
    tabRefs.current[nextIndex]?.focus();
  };

  return <>
    <SEO title="旅行手记与专题 · 宁夏旅行地图" description="记录真实宁夏旅程与到店体验，也提供注明来源和核对日期的旅行专题。" />
    <header className="journal-hero"><div className="section-shell journal-hero-grid"><div><p className="eyebrow"><NotebookPen aria-hidden="true" /> 旅行手记</p><h1>地图之外，<br />留下走过与查过的细节。</h1><p>亲历游记与探店只记录真实发生的体验；旅行专题则整理公开资料，并明确来源、核对日期和适用边界。两种内容不会混在一起。</p></div><div className="journal-cover-stack" aria-hidden="true"><span className="paper-note">亲历与资料<br /><strong>清楚分开</strong></span><span className="date-stamp">宁夏<br />手记</span></div></div></header>
    <div className="section-shell journal-page">
      <div className="journal-tabs" role="tablist" aria-label="内容类型">{tabs.map((tab, index) => <button ref={(element) => { tabRefs.current[index] = element; }} key={tab.type} id={`${tab.type}-tab`} type="button" role="tab" aria-controls="journal-results" aria-selected={type === tab.type} tabIndex={type === tab.type ? 0 : -1} onKeyDown={(event) => handleTabKey(event, index)} onClick={() => switchType(tab.type)}>{tab.type === 'travel' ? <BookOpenText aria-hidden="true" /> : tab.type === 'food' ? <Store aria-hidden="true" /> : <FileText aria-hidden="true" />}{tab.label}</button>)}</div>
      <section className="journal-filters" aria-label="手记筛选"><label><MapPin aria-hidden="true" /><span>城市</span><select value={city} onChange={(event) => setFilter('city', event.target.value)}><option value="all">全部城市</option>{cities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><Tags aria-hidden="true" /><span>标签</span><select value={tag} onChange={(event) => setFilter('tag', event.target.value)}><option value="all">全部标签</option>{tags.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></section>
      <div id="journal-results" role="tabpanel" aria-labelledby={`${type}-tab`}>
        {entries.length ? <div className="journal-grid">{entries.map((entry) => <article className="journal-card" key={`${entry.type}-${entry.slug}`}><Link to={`/journal/${entry.type}/${entry.slug}`} className="journal-photo"><ResponsiveImage src={entry.cover.src} alt={entry.cover.alt} width="720" height="540" loading="lazy" /><span className={entry.type}>{typeLabel(entry.type)}</span></Link><div><p className="eyebrow">{entry.publishedAt} · {cityName(entry.cityId)}</p><h2>{entry.title}</h2><p>{entry.excerpt}</p><div className="journal-tags">{entry.tags.map((item) => <span key={item}>#{item}</span>)}</div><Link to={`/journal/${entry.type}/${entry.slug}`} className="text-link">阅读全文 <ArrowRight aria-hidden="true" /></Link></div></article>)}</div> : <section className="journal-empty"><div className="empty-ticket"><span>COMING</span><strong>首篇整理中</strong><small>{type === 'travel' ? '一段真实旅程，值得慢慢写完' : type === 'food' ? '一次真实到店，再认真记录' : '一份资料专题，先核对再发布'}</small></div><div><p className="eyebrow">{type === 'guide' ? '每个判断都留下出处' : '不拿模板冒充经历'}</p><h2>{type === 'travel' ? '第一篇游记正在路上' : type === 'food' ? '第一份探店记录还没上桌' : '新的旅行专题正在核对'}</h2><p>{type === 'guide' ? '专题会在来源、适用范围和核对日期完整后公开。' : '页面和记录方法已经准备好。等真实文字与授权照片完成整理后，内容才会出现在这里。'}</p><ul><li>{type === 'guide' ? '优先引用景区和政府直接页面' : '注明实际发生日期'}</li><li>区分事实信息与个人感受</li><li>价格、开放和交通明确时效</li></ul></div></section>}
      </div>
      <section className="journal-principles"><article><strong>01</strong><h2>亲历分开</h2><p>不把路线推荐改写成个人经历，也不编造到店评价。</p></article><article><strong>02</strong><h2>来源可查</h2><p>资料专题列出参考页面、核对日期与适用边界。</p></article><article><strong>03</strong><h2>允许改变</h2><p>商户、价格和交通会变化，文章会提醒出发前再次确认。</p></article></section>
    </div>
  </>;
}
