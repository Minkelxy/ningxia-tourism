import { ArrowLeftRight, ArrowRight, ChevronDown, ChevronUp, Clock3, Compass, MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { publishedAttractions, reviewAttractions, verifiedAttractions } from '../data/attractions';
import { cities, cityName } from '../data/cities';
import { attractionThemes, getAttractionThemeById } from '../data/discovery';
import { categoryMeta } from '../data/meta';
import useSearchParamsFilter, { useFiltersWithPanel } from '../lib/useSearchParamsFilter';
import type { AttractionCategory, CityId } from '../types';
import FavoriteButton from '../components/FavoriteButton';

const attractionSearchText = new Map(publishedAttractions.map((item) => [
  item.id,
  `${item.name}${cityName(item.cityId)}${item.locality}${item.summary}${item.highlights.join('')}`.toLocaleLowerCase('zh-CN'),
]));

export default function AttractionsList() {
  const { params, setFilter, clearFilters } = useSearchParamsFilter();
  const query = params.get('q') ?? '';
  const city = params.get('city') ?? 'all';
  const category = params.get('category') ?? 'all';
  const theme = params.get('theme') ?? '';
  const activeTheme = getAttractionThemeById(theme);
  const { activeFilterCount, filtersExpanded, setFiltersExpanded, toggleFilters } = useFiltersWithPanel([query.trim(), city !== 'all', category !== 'all', Boolean(activeTheme)]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const normalizedQuery = query.trim().toLocaleLowerCase('zh-CN');

  const attractions = useMemo(() => publishedAttractions.filter((item) => {
    const matchesQuery = !normalizedQuery || attractionSearchText.get(item.id)?.includes(normalizedQuery);
    const matchesTheme = !activeTheme || activeTheme.attractionIds.includes(item.id);
    return matchesQuery && matchesTheme && (city === 'all' || item.cityId === city) && (category === 'all' || item.category === category);
  }), [normalizedQuery, city, category, activeTheme]);
  const compareIdSet = useMemo(() => new Set(compareIds), [compareIds]);
  const compareAttractions = useMemo(() => {
    return publishedAttractions.filter((item) => compareIdSet.has(item.id));
  }, [compareIdSet]);
  const toggleCompare = (id: string) => setCompareIds((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);

  return (
    <>
      <SEO title="精选景点 · 宁夏旅行地图" description="浏览分级核实的宁夏代表性景点，按城市和主题筛选实用旅行信息。" />
      <header className="page-hero compact-hero collection-hero">
        <div className="section-shell collection-hero-grid">
          <div>
            <p className="eyebrow">精选目的地</p><h1>{publishedAttractions.length} 个公开景点，按证据清晰分级</h1><p>{verifiedAttractions.length} 个核心资料已核实，{reviewAttractions.length} 个待复核。区域配图会明确说明；开放、票价与交通仍请在出发前查看最新网络与官方公告。</p>
          </div>
          <div className="collection-hero-visual">
            <ResponsiveImage src="/images/attractions/shapotou.webp" alt="沙坡头沙漠与黄河实景" width="720" height="480" loading="eager" fetchPriority="high" sizes="(max-width: 768px) 100vw, 42vw" />
            <span>实景照片 · 来源见景点详情</span>
          </div>
        </div>
      </header>
      <div className="section-shell page-content">
        <div className="mobile-filter-bar">
          <button type="button" className="mobile-filter-toggle" aria-expanded={filtersExpanded} aria-controls="attraction-filters" onClick={toggleFilters}>
            <SlidersHorizontal aria-hidden="true" />
            <span>筛选景点</span>
            {activeFilterCount > 0 && <strong aria-label={`${activeFilterCount} 个筛选条件`}>{activeFilterCount}</strong>}
            {filtersExpanded ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
          </button>
          <a href="#attraction-results">{attractions.length} 个结果</a>
        </div>

        <section id="attraction-filters" className={`filter-panel ${filtersExpanded ? 'is-expanded' : 'is-collapsed'}`} aria-label="景点筛选">
          <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">搜索景点</span><input value={query} onChange={(event) => setFilter('q', event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) { event.preventDefault(); } }} placeholder="搜索景点、城市或亮点" /></label>
          <label><span><MapPin aria-hidden="true" /> 城市</span><select value={city} onChange={(event) => setFilter('city', event.target.value)}><option value="all">全部城市</option>{cities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label><span><SlidersHorizontal aria-hidden="true" /> 类型</span><select value={category} onChange={(event) => setFilter('category', event.target.value)}><option value="all">全部类型</option>{Object.entries(categoryMeta).map(([value, meta]) => <option key={value} value={value}>{meta.label}</option>)}</select></label>
        </section>

        <div id="attraction-results" className="result-summary" role="status" aria-live="polite"><strong>{attractions.length}</strong> 个符合条件的景点{activeTheme && <span className="active-filter-note">主题：{activeTheme.label}</span>}{activeFilterCount > 0 && <button type="button" onClick={() => { clearFilters(); setFiltersExpanded(false); }}>清除筛选</button>}</div>
        {compareAttractions.length > 0 && <div className="compare-dock" role="status" aria-live="polite"><span><ArrowLeftRight aria-hidden="true" /><strong>已选 {compareAttractions.length}/3</strong><small>{compareAttractions.map((item) => item.name).join('、')}</small></span><a href="#attraction-comparison" className="btn-primary">查看对比</a></div>}

        <section className="attraction-themes" aria-labelledby="attraction-themes-title">
          <header><div><p className="eyebrow"><Sparkles aria-hidden="true" /> 按旅行兴趣</p><h2 id="attraction-themes-title">不知道选哪一处，先选一种走法</h2></div><p>这些组合不是固定行程，只帮你从不同兴趣快速缩小范围；还可以继续叠加城市、类型和关键词。</p></header>
          <div className="attraction-theme-grid">
            {attractionThemes.map((item) => (
              <button type="button" key={item.id} className={`attraction-theme-card tone-${item.tone}`} aria-pressed={theme === item.id} onClick={() => setFilter('theme', theme === item.id ? 'all' : item.id)}>
                <span><Compass aria-hidden="true" /> {item.label}</span>
                <strong>{item.title}</strong>
                <small>{item.description}</small>
                <em>{item.attractionIds.length} 处目的地</em>
              </button>
            ))}
          </div>
        </section>

        {attractions.length ? <div className="attraction-grid">{attractions.map((item) => {
          const meta = categoryMeta[item.category as AttractionCategory];
          const cover = item.images[0];
          return (
            <article className="attraction-card" key={item.id}>
              <Link to={`/attraction/${item.id}`} className="card-image"><ResponsiveImage src={cover.src} alt={cover.alt} loading="lazy" width="720" height="450" sizes="(max-width: 768px) calc(100vw - 32px), (max-width: 1024px) 50vw, 390px" /><span className={`category-badge ${meta.className}`}>{meta.label}</span><span className={`verification-badge ${item.verificationLevel}`}>{item.verificationLevel === 'verified' ? '已核实' : '待复核'}</span></Link>
              <div className="card-content"><div className="card-heading-row"><p className="card-location"><MapPin aria-hidden="true" /> {cityName(item.cityId as CityId)} · {item.locality}</p><FavoriteButton kind="attraction" id={item.id} label={item.name} /></div><h2><Link to={`/attraction/${item.id}`}>{item.name}</Link></h2><p>{item.summary}</p><div className="card-meta"><span><Clock3 aria-hidden="true" /> {item.visitInfo.duration}</span><span>{item.visitInfo.bestSeason}</span></div><div className="card-actions"><button type="button" className={`compare-toggle ${compareIdSet.has(item.id) ? 'is-active' : ''}`} aria-pressed={compareIdSet.has(item.id)} disabled={!compareIdSet.has(item.id) && compareIds.length >= 3} onClick={() => toggleCompare(item.id)}><ArrowLeftRight aria-hidden="true" /> {compareIdSet.has(item.id) ? '已加入对比' : '加入对比'}</button><Link to={`/attraction/${item.id}`} className="text-link">查看出行信息 <ArrowRight aria-hidden="true" /></Link></div></div>
            </article>
          );
        })}</div> : <div className="empty-state"><Search aria-hidden="true" /><h2>没有找到匹配的景点</h2><p>换一个关键词，或者清除城市与类型筛选再试试。</p><button type="button" className="btn-primary" onClick={() => clearFilters()}>查看全部景点</button></div>}
        {compareAttractions.length > 0 && <section id="attraction-comparison" className="comparison-panel" aria-labelledby="attraction-comparison-title"><header><div><p className="eyebrow"><ArrowLeftRight aria-hidden="true" /> 横向比较</p><h2 id="attraction-comparison-title">把差异放在一张表里</h2></div><button type="button" className="text-button" onClick={() => setCompareIds([])}><X aria-hidden="true" /> 清空对比</button></header><div className="comparison-table-wrap" role="region" aria-label="景点横向比较表" tabIndex={0}><table><thead><tr><th scope="col">项目</th>{compareAttractions.map((item) => <th scope="col" key={item.id}>{item.name}<small>{cityName(item.cityId)}</small></th>)}</tr></thead><tbody><CompareRow label="类型" values={compareAttractions.map((item) => categoryMeta[item.category].label)} /><CompareRow label="建议时长" values={compareAttractions.map((item) => item.visitInfo.duration)} /><CompareRow label="最佳季节" values={compareAttractions.map((item) => item.visitInfo.bestSeason)} /><CompareRow label="票价参考" values={compareAttractions.map((item) => item.visitInfo.ticketPrice)} /><CompareRow label="预约提示" values={compareAttractions.map((item) => item.visitInfo.reservation)} /><CompareRow label="到达方式" values={compareAttractions.map((item) => item.visitInfo.transportation)} /><CompareRow label="资料状态" values={compareAttractions.map((item) => item.verificationLevel === 'verified' ? '核心资料已核实' : '资料待进一步复核')} /></tbody></table></div><p className="comparison-note">对比内容用于行程筛选；票价、预约、开放和交通属于易变信息，出发前请查看景区或机构最新公告。</p></section>}
      </div>
    </>
  );
}

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return <tr><th scope="row">{label}</th>{values.map((value, index) => <td key={`${label}-${index}`}>{value}</td>)}</tr>;
}
