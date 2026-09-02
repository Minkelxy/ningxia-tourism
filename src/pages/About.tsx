import { ExternalLink, FileCheck2, Image, MapPinned, NotebookPen, RefreshCcw, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import ResponsiveImage from '../components/ResponsiveImage';
import { routes } from '../data/routes';

export default function About() {
  return (
    <>
      <SEO title="关于本站 · 宁夏旅行地图" description="了解宁夏旅行地图的证据分级、个人手记、资料专题、图片许可、修订方式和使用边界。" />
      <header className="page-hero compact-hero collection-hero"><div className="section-shell collection-hero-grid"><div><p className="eyebrow">关于本站</p><h1>让漂亮的旅行网站，<br />也对信息负责。</h1><p>这是一个开源、非官方的宁夏旅行规划项目。我们区分官方事实、规划建议与个人体验，也明确告诉你哪些信息仍需在出发前确认。</p></div><div className="collection-hero-visual"><ResponsiveImage src="/images/attractions/ningxia-museum.webp" alt="宁夏博物馆建筑实景" width="720" height="480" loading="eager" fetchPriority="high" sizes="(max-width: 768px) 100vw, 42vw" /><span>实景照片 · 来源见景点详情</span></div></div></header>
      <div className="section-shell about-layout">
        <section className="about-intro"><p className="eyebrow">我们在做什么</p><h2>用地图建立地理感，用路线减少决策成本</h2><p>宁夏景点分布跨度大，城市之间的顺序会直接影响体验。本站将五座城市、公开景点、{routes.length} 条主题路线与旅行手记放进同一套可校验的数据中。</p></section>
        <section className="method-grid">
          <article><FileCheck2 aria-hidden="true" /><h2>证据分级</h2><p>官方直接页面能支撑景点概况与位置时，才标为“已核实”；开放、票价等易变信息仍会单独提示出发前确认。</p></article>
          <article><Image aria-hidden="true" /><h2>图片说明</h2><p>图片保留作者、许可与原始页面。景点、路线和美食优先使用可追溯的实景照片；照片与文字描述不完全对应时，会在替代文本中说明参考范围。</p></article>
          <article><MapPinned aria-hidden="true" /><h2>地图位置</h2><p>站内使用 WGS84 坐标绘制 SVG。外部查看通过高德 URI 打开，本站不嵌入高德底图，也不获取用户位置。</p></article>
          <article><NotebookPen aria-hidden="true" /><h2>个人手记</h2><p>游记与探店只记录真实发生的经历。个人感受不包装成官方推荐；价格、排队和营业状态必须绑定到店日期。</p></article>
          <article><ShieldCheck aria-hidden="true" /><h2>资料专题</h2><p>专题从公开来源整理旅行选择，必须展示核对日期和适用范围，并明确标注“资料整理、非亲历”。</p></article>
          <article><RefreshCcw aria-hidden="true" /><h2>修订流程</h2><p>收到勘误后核对网络与官方资料，更新字段、来源和复核日期；文字证据不足时降级或退回草稿，图片说明不准确时单独修正。</p></article>
        </section>
        <section className="source-directory"><div><p className="eyebrow">资料与反馈</p><h2>继续核对最新信息</h2></div><div><a className="source-link" href="https://whhlyt.nx.gov.cn/" target="_blank" rel="noreferrer">宁夏回族自治区文化和旅游厅 <ExternalLink aria-hidden="true" /></a><a className="source-link" href="https://www.shapotou.com/index.html" target="_blank" rel="noreferrer">沙坡头旅游官方网站 <ExternalLink aria-hidden="true" /></a><a className="source-link" href="https://github.com/Minkelxy/ningxia-tourism/blob/main/docs/content/CONTENT_AUDIT.md" target="_blank" rel="noreferrer">查看内容审计记录 <ExternalLink aria-hidden="true" /></a><a className="source-link" href="https://github.com/Minkelxy/ningxia-tourism/issues" target="_blank" rel="noreferrer">在 GitHub 提交勘误 <ExternalLink aria-hidden="true" /></a></div></section>
      </div>
    </>
  );
}
