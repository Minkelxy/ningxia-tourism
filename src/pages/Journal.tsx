import { ArrowRight, BookOpenText, FileText, LayoutGrid, MapPin, NotebookPen, Search, Store, Tags, X } from 'lucide-react';
import { useCallback, useMemo, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { publishedJournalEntries } from '../content/journal';
import { filterJournalEntries } from '../content/journal-search';
import { cities, cityName } from '../data/cities';
import useSearchParamsFilter from '../lib/useSearchParamsFilter';
import type { JournalType } from '../types';

type JournalView = 'all' | JournalType;

const tabs: Array<{ type: JournalView; label: string }> = [
  { type: 'all', label: '全部内容' },
  { type: 'travel', label: '个人游记' },
  { type: 'food', label: '探店记录' },
  { type: 'guide', label: '旅行专题' },
];

const typeLabel = (type: JournalType) => type === 'travel' ? '游记' : type === 'food' ? '探店' : '资料专题';
const journalCounts: Record<JournalView, number> = {
  all: publishedJournalEntries.length,
  travel: publishedJournalEntries.filter((entry) => entry.type === 'travel').length,
  food: publishedJournalEntries.filter((entry) => entry.type === 'food').length,
  guide: publishedJournalEntries.filter((entry) => entry.type === 'guide').length,
};

export default function Journal() {
  const { params, setParams, setFilter, clearFilters: clearAll } = useSearchParamsFilter();
  const requestedType = params.get('type');
  const type: JournalView = requestedType === 'travel' || requestedType === 'food' || requestedType === 'guide' ? requestedType : 'all';
  const city = params.get('city') ?? 'all';
  const tag = params.get('tag') ?? 'all';
  const q = params.get('q') ?? '';
  const typeEntries = useMemo(() => type === 'all' ? publishedJournalEntries : publishedJournalEntries.filter((entry) => entry.type === type), [type]);
  const tags = useMemo(() => [...new Set(typeEntries.flatMap((entry) => entry.tags))], [typeEntries]);
  const entries = useMemo(() => filterJournalEntries(typeEntries, { q, city, tag }), [typeEntries, q, city, tag]);
  const hasActiveFilters = Boolean(q.trim()) || city !== 'all' || tag !== 'all';
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  // 清除筛选时保留 type=xx 参数，切换 tab 不导致筛选清空后 tab 跳回全部
  const clearFilters = useCallback(() => clearAll(type !== 'all' ? ['type'] : undefined), [clearAll, type]);
  const switchType = useCallback((value: JournalView) => {
    const next = new URLSearchParams(params);
    if (value === 'all') next.delete('type'); else next.set('type', value);
    next.delete('tag');
    next.delete('city');
    next.delete('q');
    setParams(next, { replace: true });
  }, [params, setParams]);
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
    <SEO title="旅行手记与专题 · 宁夏旅行地图" description="先浏览注明来源和核对日期的宁夏旅行专题；个人游记与探店记录只在真实素材完成后公开。" />
    <header className="journal-hero"><div className="section-shell journal-hero-grid"><div><p className="eyebrow"><NotebookPen aria-hidden="true" /> 旅行手记</p><h1>地图之外，<br />留下走过与查过的细节。</h1><p>亲历游记与探店只记录真实发生的体验；旅行专题则整理公开资料，并明确来源、核对日期和适用边界。两种内容不会混在一起。</p></div><div className="journal-cover-stack" aria-hidden="true"><div className="journal-photo-visual"><ResponsiveImage src="/images/attractions/ningxia-museum.webp" alt="宁夏博物馆建筑实景" width="720" height="480" loading="eager" fetchPriority="high" sizes="(max-width: 768px) 100vw, 32vw" /></div><span className="journal-photo-badge">实景照片 · 来源见景点详情</span><span className="paper-note">亲历与资料<br /><strong>清楚分开</strong></span><span className="date-stamp">宁夏<br />手记</span></div></div></header>
    <div className="section-shell journal-page">
      <div className="journal-tabs" role="tablist" aria-label="内容类型">{tabs.map((tab, index) => <button ref={(element) => { tabRefs.current[index] = element; }} key={tab.type} id={`${tab.type}-tab`} type="button" role="tab" aria-controls="journal-results" aria-selected={type === tab.type} tabIndex={type === tab.type ? 0 : -1} onKeyDown={(event) => handleTabKey(event, index)} onClick={() => switchType(tab.type)}>{tab.type === 'all' ? <LayoutGrid aria-hidden="true" /> : tab.type === 'travel' ? <BookOpenText aria-hidden="true" /> : tab.type === 'food' ? <Store aria-hidden="true" /> : <FileText aria-hidden="true" />}{tab.label}<small>{journalCounts[tab.type]}</small></button>)}</div>
      <section className="journal-filters" aria-label="手记筛选"><label className="journal-search"><Search aria-hidden="true" /><span className="sr-only">搜索旅行内容</span><input type="search" value={q} placeholder="搜索标题、地点、标签或问题" onChange={(event) => setFilter('q', event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) { event.preventDefault(); } }} /></label><label><MapPin aria-hidden="true" /><span>城市</span><select value={city} onChange={(event) => setFilter('city', event.target.value)}><option value="all">全部城市</option>{cities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><Tags aria-hidden="true" /><span>标签</span><select value={tag} onChange={(event) => setFilter('tag', event.target.value)}><option value="all">全部标签</option>{tags.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></section>
      <div id="journal-results" role="tabpanel" aria-labelledby={`${type}-tab`}>
        {typeEntries.length > 0 && <div className="journal-result-bar" aria-live="polite"><p>当前显示 <strong>{entries.length}</strong> 篇{type === 'all' ? '公开内容' : typeLabel(type)}</p>{hasActiveFilters && entries.length > 0 && <button type="button" onClick={clearFilters}><X aria-hidden="true" /> 清空筛选</button>}</div>}
        {entries.length ? <div className="journal-grid">{entries.map((entry) => <article className="journal-card" key={`${entry.type}-${entry.slug}`}><Link to={`/journal/${entry.type}/${entry.slug}`} className="journal-photo"><ResponsiveImage src={entry.cover.src} alt={entry.cover.alt} width="720" height="540" loading="lazy" decoding="async" fetchPriority="low" sizes="(max-width: 768px) calc(100vw - 32px), (max-width: 1200px) calc(50vw - 40px), 560px" /><span className={entry.type}>{typeLabel(entry.type)}</span></Link><div><p className="eyebrow">{entry.updatedAt} · {cityName(entry.cityId)}{entry.featured ? ' · 编辑推荐' : ''}</p><h2>{entry.title}</h2><p>{entry.excerpt}</p><div className="journal-tags">{entry.tags.map((item) => <span key={item}>#{item}</span>)}</div><Link to={`/journal/${entry.type}/${entry.slug}`} className="text-link">阅读全文 <ArrowRight aria-hidden="true" /></Link></div></article>)}</div> : typeEntries.length > 0 && hasActiveFilters ? <section className="journal-filter-empty"><Search aria-hidden="true" /><p className="eyebrow">没有匹配结果</p><h2>换一个关键词，或放宽城市与标签</h2><p>可以搜索“沙湖”“老城”“亲子”“不折返”等目的地与旅行问题。</p><button type="button" className="btn-primary" onClick={clearFilters}><X aria-hidden="true" /> 清空筛选</button></section> : <section className="journal-empty"><div className="empty-ticket"><span>COMING</span><strong>首篇整理中</strong><small>{type === 'travel' ? '一段真实旅程，值得慢慢写完' : type === 'food' ? '一次真实到店，再认真记录' : '一份资料专题，先核对再发布'}</small></div><div><p className="eyebrow">{type === 'guide' ? '每个判断都留下出处' : '不拿模板冒充经历'}</p><h2>{type === 'travel' ? '第一篇游记正在路上' : type === 'food' ? '第一份探店记录还没上桌' : '新的旅行专题正在核对'}</h2><p>{type === 'guide' ? '专题会在来源、适用范围和核对日期完整后公开。' : '页面和记录方法已经准备好。等真实文字与授权照片完成整理后，内容才会出现在这里。'}</p><ul><li>{type === 'guide' ? '优先引用景区和政府直接页面' : '注明实际发生日期'}</li><li>区分事实信息与个人感受</li><li>价格、开放和交通明确时效</li></ul></div></section>}
      </div>
      <section className="journal-principles"><article><strong>01</strong><h2>亲历分开</h2><p>不把路线推荐改写成个人经历，也不编造到店评价。</p></article><article><strong>02</strong><h2>来源可查</h2><p>资料专题列出参考页面、核对日期与适用边界。</p></article><article><strong>03</strong><h2>允许改变</h2><p>商户、价格和交通会变化，文章会提醒出发前再次确认。</p></article></section>
    </div>
  </>;
}
