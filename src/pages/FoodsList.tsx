import { ArrowRight, ChevronDown, ChevronUp, MapPin, Search, SlidersHorizontal, Utensils } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { cities, cityName } from '../data/cities';
import { publishedFoods, reviewFoods, verifiedFoods } from '../data/foods';
import useSearchParamsFilter, { useFiltersWithPanel } from '../lib/useSearchParamsFilter';
import type { CityId, FoodCategory } from '../types';

const foodCategoryLabels: Record<FoodCategory, string> = {
  mutton: '羊肉', noodle: '面食', snack: '小吃', drink: '饮品', fruit: '瓜果', specialty: '特产', staple: '主食',
};

const foodSearchText = new Map(publishedFoods.map((item) => [
  item.id,
  `${item.name}${item.origin}${item.description}${item.restaurants.map((restaurant) => restaurant.name).join('')}`.toLocaleLowerCase('zh-CN'),
]));

export default function FoodsList() {
  const { params, setFilter, clearFilters } = useSearchParamsFilter();
  const query = params.get('q') ?? '';
  const city = params.get('city') ?? 'all';
  const category = params.get('category') ?? 'all';
  const { activeFilterCount, filtersExpanded, setFiltersExpanded, toggleFilters } = useFiltersWithPanel([query.trim(), city !== 'all', category !== 'all']);
  const normalizedQuery = query.trim().toLocaleLowerCase('zh-CN');

  const foods = useMemo(() => publishedFoods.filter((item) => {
    const matchesQuery = !normalizedQuery || foodSearchText.get(item.id)?.includes(normalizedQuery);
    const matchesCity = city === 'all' || item.restaurants.some((r) => r.cityId === city) || item.origin.includes(cityName(city as CityId));
    return matchesQuery && matchesCity && (category === 'all' || item.category === category);
  }), [normalizedQuery, city, category]);

  return (
    <>
      <SEO title="宁夏美食 · 宁夏旅行地图" description="浏览宁夏代表性美食，按城市和类别筛选，查看推荐餐厅与可核实来源。" />
      <header className="page-hero compact-hero">
        <div className="section-shell"><p className="eyebrow">城市味道</p><h1>{publishedFoods.length} 道宁夏美食，按来源分级</h1><p>{verifiedFoods.length} 道有官方直接专页支撑，{reviewFoods.length} 道为目录级来源待复核。餐厅信息变化快，只给区域和品类建议，不为具体商户背书。</p></div>
      </header>
      <div className="section-shell page-content">
        <div className="mobile-filter-bar">
          <button type="button" className="mobile-filter-toggle" aria-expanded={filtersExpanded} aria-controls="food-filters" onClick={toggleFilters}>
            <SlidersHorizontal aria-hidden="true" />
            <span>筛选美食</span>
            {activeFilterCount > 0 && <strong aria-label={`${activeFilterCount} 个筛选条件`}>{activeFilterCount}</strong>}
            {filtersExpanded ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}
          </button>
          <a href="#food-results">{foods.length} 个结果</a>
        </div>

        <section id="food-filters" className={`filter-panel ${filtersExpanded ? 'is-expanded' : 'is-collapsed'}`} aria-label="美食筛选">
          <label className="search-field"><Search aria-hidden="true" /><span className="sr-only">搜索美食</span><input value={query} onChange={(event) => setFilter('q', event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && (event.nativeEvent.isComposing || event.keyCode === 229)) { event.preventDefault(); } }} placeholder="搜索美食、产地或餐厅" /></label>
          <label><span><MapPin aria-hidden="true" /> 城市</span><select value={city} onChange={(event) => setFilter('city', event.target.value)}><option value="all">全部城市</option>{cities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
          <label><span><Utensils aria-hidden="true" /> 类别</span><select value={category} onChange={(event) => setFilter('category', event.target.value)}><option value="all">全部类别</option>{(Object.entries(foodCategoryLabels) as Array<[FoodCategory, string]>).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        </section>

        <div id="food-results" className="result-summary" role="status" aria-live="polite"><strong>{foods.length}</strong> 个符合条件的美食{activeFilterCount > 0 && <button type="button" onClick={() => { clearFilters(); setFiltersExpanded(false); }}>清除筛选</button>}</div>

        {foods.length ? <div className="attraction-grid">{foods.map((item) => (
          <article className="attraction-card" key={item.id}>
            <Link to={`/food/${item.id}`} className="card-image food-card-image"><span className="food-card-icon"><Utensils aria-hidden="true" /></span><span className="category-badge">{foodCategoryLabels[item.category]}</span><span className={`verification-badge ${item.verificationLevel}`}>{item.verificationLevel === 'verified' ? '已核实' : '待复核'}</span></Link>
            <div className="card-content"><p className="card-location"><MapPin aria-hidden="true" /> {item.origin}</p><h2><Link to={`/food/${item.id}`}>{item.name}</Link></h2><p>{item.description}</p><div className="card-meta">{item.priceRange && <span>{item.priceRange}</span>}{item.bestSeason && <span>{item.bestSeason}</span>}</div><Link to={`/food/${item.id}`} className="text-link">查看美食详情 <ArrowRight aria-hidden="true" /></Link></div>
          </article>
        ))}</div> : <div className="empty-state"><Search aria-hidden="true" /><h2>没有找到匹配的美食</h2><p>换一个关键词，或者清除城市与类别筛选再试试。</p><button type="button" className="btn-primary" onClick={() => clearFilters()}>查看全部美食</button></div>}
      </div>
    </>
  );
}
