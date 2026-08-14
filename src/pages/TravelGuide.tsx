import { useEffect, useState } from 'react';
import { ArrowRight, BadgeCheck, CalendarCheck2, Check, CircleHelp, ExternalLink, MapPin, RefreshCcw, Route, ShieldCheck, SunMedium, TrainFront } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { guideSources, guideVerifiedAt, seasonGuides, transportNotes, travelChecklist } from '../data/guide';
import { routes } from '../data/routes';
import { formatVerifiedDate } from '../lib/site';

const checklistStorageKey = 'ningxia-travel-checklist-v1';

const loadChecklist = () => {
  try {
    const stored = window.localStorage.getItem(checklistStorageKey);
    const values = stored ? JSON.parse(stored) : [];
    return Array.isArray(values) ? values.filter((value): value is number => Number.isInteger(value) && value >= 0 && value < travelChecklist.length) : [];
  } catch {
    return [];
  }
};

export default function TravelGuide() {
  const [checkedItems, setCheckedItems] = useState<number[]>(loadChecklist);
  const completed = checkedItems.length;
  const progress = Math.round((completed / travelChecklist.length) * 100);

  useEffect(() => {
    try { window.localStorage.setItem(checklistStorageKey, JSON.stringify(checkedItems)); } catch { /* 清单在禁用本地存储时仍可正常使用。 */ }
  }, [checkedItems]);

  const toggleChecklistItem = (index: number) => {
    setCheckedItems((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  };

  return (
    <>
      <SEO title="宁夏行前指南 · 宁夏旅行地图" description="按季节和天数选择宁夏路线，了解银川、中卫等城市衔接，并用可保存的行前清单完成出发准备。" />
      <header className="guide-hero">
        <div className="section-shell guide-hero-grid">
          <div><p className="eyebrow"><BadgeCheck aria-hidden="true" /> 行前信息核对至 {formatVerifiedDate(guideVerifiedAt)}</p><h1>先解决四件事，<br />再收拾行李。</h1><p>什么时候来、准备几天、城市怎么串、出发前查什么。把这些决定做完，宁夏行程会轻松很多。</p><div className="guide-hero-actions"><a href="#guide-seasons" className="btn-primary"><SunMedium aria-hidden="true" /> 按季节开始</a><Link to="/routes" className="btn-quiet">直接看路线 <ArrowRight aria-hidden="true" /></Link></div></div>
          <dl className="guide-hero-summary"><div><dt>季节建议</dt><dd>4</dd></div><div><dt>路线天数</dt><dd>1—5</dd></div><div><dt>行前事项</dt><dd>{travelChecklist.length}</dd></div></dl>
        </div>
      </header>

      <div className="section-shell guide-page">
        <section id="guide-seasons" className="guide-section" aria-labelledby="guide-seasons-title">
          <div className="section-heading split-heading"><div><p className="eyebrow">01 · 什么时候来</p><h2 id="guide-seasons-title">四季都能走，重点不同</h2></div><p>季节建议来自宁夏文旅与地方政府网络资料；具体花期、天气和活动仍要在出发前再次确认。</p></div>
          <div className="season-grid">{seasonGuides.map((season) => <article key={season.id} className={`season-card season-${season.id}`}><div className="season-card-top"><span>{season.months}</span><SunMedium aria-hidden="true" /></div><h3>{season.title}</h3><p>{season.summary}</p><div className="season-tags">{season.suitableFor.map((item) => <span key={item}>{item}</span>)}</div><div className="season-reminder"><CircleHelp aria-hidden="true" /><p>{season.reminder}</p></div><a href={season.source.url} target="_blank" rel="noreferrer">查看参考资料 <ExternalLink aria-hidden="true" /></a></article>)}</div>
        </section>

        <section className="guide-section" aria-labelledby="guide-duration-title">
          <div className="section-heading split-heading"><div><p className="eyebrow">02 · 准备几天</p><h2 id="guide-duration-title">先用天数压缩选择</h2></div><p>不用一次读完七条路线。选择可支配天数，再比较主题、预算和资料覆盖情况。</p></div>
          <div className="duration-grid">{[1, 2, 3, 4, 5].map((days) => {
            const matchedRoutes = routes.filter((route) => route.durationDays === days);
            return <Link key={days} to={`/routes?duration=${days}`} className="duration-card"><span>0{days}</span><div><strong>{days === 1 ? '一天也能认识宁夏' : `${days} 天行程`}</strong><small>{matchedRoutes.map((route) => route.name).join(' · ')}</small></div><ArrowRight aria-hidden="true" /></Link>;
          })}</div>
        </section>

        <section className="guide-section guide-transit-section" aria-labelledby="guide-transit-title">
          <div className="section-heading split-heading"><div><p className="eyebrow">03 · 城市怎么串</p><h2 id="guide-transit-title">铁路连主城，公路进景区</h2></div><p>不写死车次与分钟数，只给更稳定的衔接原则。出发日仍以购票平台和实时导航为准。</p></div>
          <div className="transit-flow">{transportNotes.map((item, index) => <article key={item.title}><span>{String(index + 1).padStart(2, '0')}</span><div className="transit-icon">{index === 1 ? <TrainFront aria-hidden="true" /> : index === 2 ? <Route aria-hidden="true" /> : <MapPin aria-hidden="true" />}</div><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
        </section>

        <section className="guide-section preparation-grid" aria-labelledby="guide-checklist-title">
          <div className="checklist-card">
            <div className="checklist-heading"><div><p className="eyebrow">04 · 出发前检查</p><h2 id="guide-checklist-title">一份保存在本机的清单</h2></div><div className="checklist-progress" aria-label={`已完成 ${completed} 项，共 ${travelChecklist.length} 项`}><strong>{completed}/{travelChecklist.length}</strong><span><i style={{ width: `${progress}%` }} /></span></div></div>
            <div className="travel-checklist">{travelChecklist.map((item, index) => <label key={item} className={checkedItems.includes(index) ? 'checked' : ''}><input type="checkbox" checked={checkedItems.includes(index)} onChange={() => toggleChecklistItem(index)} /><span><Check aria-hidden="true" /></span><strong>{item}</strong></label>)}</div>
            <button type="button" className="checklist-reset" onClick={() => setCheckedItems([])} disabled={completed === 0}><RefreshCcw aria-hidden="true" /> 重置清单</button>
            <p className="local-note"><ShieldCheck aria-hidden="true" /> 勾选结果只保存在当前浏览器，不会上传或获取你的位置。</p>
          </div>

          <aside className="guide-source-panel"><p className="eyebrow">出发当天再打开</p><h2>动态信息以这些入口为准</h2><div>{guideSources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer"><span><strong>{source.label}</strong><small>核对：{formatVerifiedDate(source.checkedAt)}</small></span><ExternalLink aria-hidden="true" /></a>)}</div><p>本站负责整理顺序和提醒，不替代铁路、气象、景区或文旅部门的当天公告。</p></aside>
        </section>

        <section className="guide-final-cta"><div><p className="eyebrow">准备得差不多了</p><h2>回到地图，或者直接选路线</h2></div><div><Link to="/" className="btn-quiet"><MapPin aria-hidden="true" /> 地图探索</Link><Link to="/routes" className="btn-primary"><CalendarCheck2 aria-hidden="true" /> 查看七条路线</Link></div></section>
      </div>
    </>
  );
}
