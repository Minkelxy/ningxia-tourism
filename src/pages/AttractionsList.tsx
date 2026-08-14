import { ArrowRight, Clock3, MapPin, Search, SlidersHorizontal } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { publishedAttractions, reviewAttractions, verifiedAttractions } from '../data/attractions';
import { cities, cityName } from '../data/cities';
import { categoryMeta } from '../data/meta';
import type { AttractionCategory, CityId } from '../types';

export default function AttractionsList() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const city = params.get('city') ?? 'all';
  const category = params.get('category') ?? 'all';

  const setFilter = (name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(name); else next.set(name, value);
    setParams(next, { replace: true });
  };

  const attractions = publishedAttractions.filter((item) => {
    const normalized = query.trim().toLocaleLowerCase('zh-CN');
    const matchesQuery = !normalized || `${item.name}${item.locality}${item.summary}${item.highlights.join('')}`.toLocaleLowerCase('zh-CN').includes(normalized);
    return matchesQuery && (city === 'all' || item.cityId === city) && (category === 'all' || item.category === category);
  });

  return (
    <>
      <SEO title="精选景点 · 宁夏旅行地图" description="浏览分级核实的宁夏代表性景点，按城市和主题筛选实用旅行信息。" />
      <header className="page-hero compact-hero">
        <div className="section-shell"><p className="eyebrow">精选目的地</p><h1>{publishedAttractions.length} 个公开景点，按证据清晰分级</h1><p>{verifiedAttractions.length} 个已严格核实，{reviewAttractions.length} 个待复核。待复核内容可以阅读，但不会计入已核实数量；开放、票价与交通仍请在出发前查看官方公告。</p></div>
      </header>
      <main className="section-shell page-content">
        <section className="filter-panel" aria-label="景点筛选">
          <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">搜索景点</span><input value={query} onChange={(event) => setFilter('q', event.target.value)} placeholder="搜索景点、城市或亮点" /></label>
          <label><span><MapPin aria-hidden="true" /> 城市</span><select value={city} onChange={(event) => setFilter('city', event.target.value)}><option value="all">全部城市</option>{cities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label><span><SlidersHorizontal aria-hidden="true" /> 类型</span><select value={category} onChange={(event) => setFilter('category', event.target.value)}><option value="all">全部类型</option>{Object.entries(categoryMeta).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}</select></label>
        </section>

        <div className="result-summary"><strong>{attractions.length}</strong> 个符合条件的景点{(query || city !== 'all' || category !== 'all') && <button type="button" onClick={() => setParams({})}>清除筛选</button>}</div>

        {attractions.length ? <div className="attraction-grid">{attractions.map((item) => {
          const meta = categoryMeta[item.category as AttractionCategory];
          const cover = item.images[0];
          return (
            <article className="attraction-card" key={item.id}>
              <Link to={`/attraction/${item.id}`} className="card-image"><ResponsiveImage src={cover.src} alt={cover.alt} loading="lazy" width="720" height="450" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 390px" /><span className={`category-badge ${meta.className}`}>{meta.label}</span><span className={`verification-badge ${item.verificationLevel}`}>{item.verificationLevel === 'verified' ? '已核实' : '待复核'}</span></Link>
              <div className="card-content"><p className="card-location"><MapPin aria-hidden="true" /> {cityName(item.cityId as CityId)} · {item.locality}</p><h2><Link to={`/attraction/${item.id}`}>{item.name}</Link></h2><p>{item.summary}</p><div className="card-meta"><span><Clock3 aria-hidden="true" /> {item.visitInfo.duration}</span><span>{item.visitInfo.bestSeason}</span></div><Link to={`/attraction/${item.id}`} className="text-link">查看出行信息 <ArrowRight aria-hidden="true" /></Link></div>
            </article>
          );
        })}</div> : <div className="empty-state"><Search aria-hidden="true" /><h2>没有找到匹配的景点</h2><p>换一个关键词，或者清除城市与类型筛选再试试。</p><button type="button" className="btn-primary" onClick={() => setParams({})}>查看全部景点</button></div>}
      </main>
    </>
  );
}
