import { ArrowRight, Compass, MapPin, Search as SearchIcon, Sparkles, UtensilsCrossed } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { publishedAttractions } from '../data/attractions';
import { cities, cityName } from '../data/cities';
import { foods } from '../data/foods';
import { routes } from '../data/routes';
import { publishedJournalEntries } from '../content/journal';

const normalize = (value: string) => value.trim().toLocaleLowerCase('zh-CN');
type SearchIndexEntry<T> = { item: T; text: string };
const createSearchIndex = <T,>(items: T[], getText: (item: T) => string): SearchIndexEntry<T>[] => items.map((item) => ({ item, text: normalize(getText(item)) }));

const attractionSearchIndex = createSearchIndex(publishedAttractions, (item) => `${item.name}${cityName(item.cityId)}${item.locality}${item.summary}${item.highlights.join('')}`);
const foodSearchIndex = createSearchIndex(foods.filter((item) => item.status === 'published'), (item) => `${item.name}${item.description}${item.origin}${item.category}${item.tips ?? ''}`);
const routeSearchIndex = createSearchIndex(routes, (item) => `${item.name}${item.summary}${item.themeLabel}${item.audience}${item.highlights.join('')}`);
const journalSearchIndex = createSearchIndex(publishedJournalEntries, (item) => `${item.title}${item.excerpt}${item.cityId}${item.locality}${item.tags.join('')}${item.body}`);
const citySearchIndex = createSearchIndex(cities, (item) => `${item.name}${item.nickname}${item.travelRole}${item.introduction}${item.bestFor.join('')}${item.foods.join('')}`);

export default function Search() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const [input, setInput] = useState(query);
  // URL 变化（如浏览器前进/后退、外部链接带 q 参数）时同步输入框，
  // 保证输入框与查询结果始终一致；用户手动输入不影响此处。
  useEffect(() => { setInput(query); }, [query]);
  const term = normalize(query);
  const matches = useMemo(() => {
    if (!term) return { attractions: [], foods: [], routes: [], journals: [], cities: [] };
    return {
      attractions: attractionSearchIndex.filter(({ text }) => text.includes(term)).map(({ item }) => item),
      foods: foodSearchIndex.filter(({ text }) => text.includes(term)).map(({ item }) => item),
      routes: routeSearchIndex.filter(({ text }) => text.includes(term)).map(({ item }) => item),
      journals: journalSearchIndex.filter(({ text }) => text.includes(term)).map(({ item }) => item),
      cities: citySearchIndex.filter(({ text }) => text.includes(term)).map(({ item }) => item),
    };
  }, [term]);
  const total = Object.values(matches).reduce((sum, items) => sum + items.length, 0);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = input.trim();
    setParams(next ? { q: next } : {});
  };

  return <><SEO title={query ? `搜索“${query}” · 宁夏旅行地图` : '搜索 · 宁夏旅行地图'} description="搜索宁夏景点、美食、旅行路线、城市和旅行专题。" noIndex /><header className="search-hero"><div className="section-shell"><p className="eyebrow"><SearchIcon aria-hidden="true" /> 全站搜索</p><h1>从一个关键词，<br />找到下一站。</h1><form className="site-search-form" onSubmit={submit}><label><SearchIcon aria-hidden="true" /><span className="sr-only">搜索宁夏旅行内容</span><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="试试：沙漠、早茶、三天、六盘山" autoFocus /></label><button type="submit" className="btn-primary">搜索 <ArrowRight aria-hidden="true" /></button></form><p className="search-hint">可搜索景点、美食、路线、城市名、旅行专题和标签。</p></div></header><main className="section-shell page-content search-page">{term ? <><div className="search-result-summary" role="status" aria-live="polite"><strong>{total}</strong> 个结果<span>关键词：{query}</span></div>{total ? <div className="search-groups"><SearchGroup title="景点" icon={<MapPin aria-hidden="true" />} items={matches.attractions} render={(item) => <Link to={`/attraction/${item.id}`} className="search-result"><span><strong>{item.name}</strong><small>{cityName(item.cityId)} · {item.summary}</small></span><ArrowRight aria-hidden="true" /></Link>} /><SearchGroup title="美食" icon={<UtensilsCrossed aria-hidden="true" />} items={matches.foods} render={(item) => <Link to={`/food/${item.id}`} className="search-result"><span><strong>{item.name}</strong><small>{item.origin} · {item.description}</small></span><ArrowRight aria-hidden="true" /></Link>} /><SearchGroup title="路线" icon={<Compass aria-hidden="true" />} items={matches.routes} render={(item) => <Link to={`/routes/${item.id}`} className="search-result"><span><strong>{item.name}</strong><small>{item.durationLabel} · {item.summary}</small></span><ArrowRight aria-hidden="true" /></Link>} /><SearchGroup title="城市" icon={<MapPin aria-hidden="true" />} items={matches.cities} render={(item) => <Link to={`/city/${item.id}`} className="search-result"><span><strong>{item.name} · {item.nickname}</strong><small>{item.travelRole} · {item.bestFor.join('、')}</small></span><ArrowRight aria-hidden="true" /></Link>} /><SearchGroup title="旅行专题" icon={<Sparkles aria-hidden="true" />} items={matches.journals} render={(item) => <Link to={`/journal/${item.type}/${item.slug}`} className="search-result"><span><strong>{item.title}</strong><small>{cityName(item.cityId)} · {item.excerpt}</small></span><ArrowRight aria-hidden="true" /></Link>} /></div> : <div className="search-empty"><SearchIcon aria-hidden="true" /><h2>没有找到“{query}”</h2><p>换个更短的关键词，或试试“沙漠”“银川”“路线”“早茶”。</p></div>}</> : <div className="search-start"><SearchIcon aria-hidden="true" /><h2>先输入一个关键词</h2><p>从目的地名称、旅行天数或一道宁夏味道开始。</p><div className="search-suggestions">{['沙漠', '银川', '三天', '早茶', '六盘山'].map((item) => <button type="button" key={item} onClick={() => { setInput(item); setParams({ q: item }); }}>{item}</button>)}</div></div>}</main></>;
}

function SearchGroup<T extends { id?: string; slug?: string; title?: string }>({ title, icon, items, render }: { title: string; icon: React.ReactNode; items: T[]; render: (item: T) => React.ReactNode }) {
  if (!items.length) return null;
  return <section className="search-group" aria-labelledby={`search-${title}`}><header><div><p className="eyebrow">{icon} 搜索结果</p><h2 id={`search-${title}`}>{title}</h2></div><span>{items.length} 项</span></header><div>{items.slice(0, 6).map((item, index) => <span key={item.id ?? item.slug ?? item.title ?? index}>{render(item)}</span>)}</div>{items.length > 6 && <small className="search-more">仅显示前 6 项</small>}</section>;
}
