import { ArrowRight, BookOpenText, MapPin, NotebookPen, Store, Tags } from 'lucide-react';
import { useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { publishedJournalEntries } from '../content/journal';
import { cities, cityName } from '../data/cities';

export default function Journal() {
  const [params, setParams] = useSearchParams();
  const type = params.get('type') === 'food' ? 'food' : 'travel';
  const city = params.get('city') ?? 'all';
  const tag = params.get('tag') ?? 'all';
  const tags = [...new Set(publishedJournalEntries.flatMap((entry) => entry.tags))];
  const entries = publishedJournalEntries.filter((entry) => entry.type === type && (city === 'all' || entry.cityId === city) && (tag === 'all' || entry.tags.includes(tag)));
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const setFilter = (key: string, value: string) => { const next = new URLSearchParams(params); if (value === 'all') next.delete(key); else next.set(key, value); setParams(next, { replace: true }); };
  const switchType = (value: string) => { const next = new URLSearchParams(params); next.set('type', value); setParams(next, { replace: true }); };
  const handleTabKey = (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
    const tabs = ['travel', 'food'] as const;
    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    switchType(tabs[nextIndex]);
    tabRefs.current[nextIndex]?.focus();
  };

  return <>
    <SEO title="旅行手记 · 宁夏旅行地图" description="记录真实宁夏旅程与到店体验，保留发生时间、条件和个人判断。" />
    <header className="journal-hero"><div className="section-shell journal-hero-grid"><div><p className="eyebrow"><NotebookPen aria-hidden="true" /> 旅行手记</p><h1>地图之外，<br />留下走过的细节。</h1><p>这里收录站主亲历的旅行复盘与探店记录。没有真实经历就不发布；价格、排队和营业状态都以到访当天为准。</p></div><div className="journal-cover-stack" aria-hidden="true"><span className="paper-note">真实日期<br /><strong>真实感受</strong></span><span className="date-stamp">宁夏<br />手记</span></div></div></header>
    <div className="section-shell journal-page">
      <div className="journal-tabs" role="tablist" aria-label="手记类型"><button ref={(element) => { tabRefs.current[0] = element; }} id="travel-tab" type="button" role="tab" aria-controls="journal-results" aria-selected={type === 'travel'} tabIndex={type === 'travel' ? 0 : -1} onKeyDown={(event) => handleTabKey(event, 0)} onClick={() => switchType('travel')}><BookOpenText aria-hidden="true" />个人游记</button><button ref={(element) => { tabRefs.current[1] = element; }} id="food-tab" type="button" role="tab" aria-controls="journal-results" aria-selected={type === 'food'} tabIndex={type === 'food' ? 0 : -1} onKeyDown={(event) => handleTabKey(event, 1)} onClick={() => switchType('food')}><Store aria-hidden="true" />探店记录</button></div>
      <section className="journal-filters" aria-label="手记筛选"><label><MapPin aria-hidden="true" /><span>城市</span><select value={city} onChange={(event) => setFilter('city', event.target.value)}><option value="all">全部城市</option>{cities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label><Tags aria-hidden="true" /><span>标签</span><select value={tag} onChange={(event) => setFilter('tag', event.target.value)}><option value="all">全部标签</option>{tags.map((item) => <option key={item} value={item}>{item}</option>)}</select></label></section>
      <div id="journal-results" role="tabpanel" aria-labelledby={`${type}-tab`}>
        {entries.length ? <div className="journal-grid">{entries.map((entry) => <article className="journal-card" key={`${entry.type}-${entry.slug}`}><Link to={`/journal/${entry.type}/${entry.slug}`} className="journal-photo"><ResponsiveImage src={entry.cover.src} alt={entry.cover.alt} width="720" height="540" loading="lazy" /><span>{entry.type === 'travel' ? '游记' : '探店'}</span></Link><div><p className="eyebrow">{entry.publishedAt} · {cityName(entry.cityId)}</p><h2>{entry.title}</h2><p>{entry.excerpt}</p><div className="journal-tags">{entry.tags.map((item) => <span key={item}>#{item}</span>)}</div><Link to={`/journal/${entry.type}/${entry.slug}`} className="text-link">阅读全文 <ArrowRight aria-hidden="true" /></Link></div></article>)}</div> : <section className="journal-empty"><div className="empty-ticket"><span>COMING</span><strong>首篇整理中</strong><small>{type === 'travel' ? '一段真实旅程，值得慢慢写完' : '一次真实到店，再认真记录'}</small></div><div><p className="eyebrow">不拿模板冒充经历</p><h2>{type === 'travel' ? '第一篇游记正在路上' : '第一份探店记录还没上桌'}</h2><p>页面和记录方法已经准备好。等真实文字与授权照片完成整理后，内容才会出现在这里。</p><ul><li>注明实际发生日期</li><li>区分事实信息与个人感受</li><li>价格和营业状态明确时效</li></ul></div></section>}
      </div>
      <section className="journal-principles"><article><strong>01</strong><h2>真实发生</h2><p>不把路线推荐改写成个人经历，也不编造到店评价。</p></article><article><strong>02</strong><h2>保留条件</h2><p>记录季节、同行者和时间，避免把一次体验说成永久结论。</p></article><article><strong>03</strong><h2>允许改变</h2><p>商户、价格和交通会变化，文章显示发生日期并提醒再次确认。</p></article></section>
    </div>
  </>;
}
