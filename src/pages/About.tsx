import { ExternalLink, FileCheck2, Image, MapPinned, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO title="关于本站 · 宁夏旅行地图" description="了解宁夏旅行地图的资料来源、图片许可、更新方式和使用边界。" />
      <header className="page-hero compact-hero"><div className="section-shell"><p className="eyebrow">关于本站</p><h1>让漂亮的旅行网站，<br />也对信息负责。</h1><p>这是一个开源、非官方的宁夏旅行规划项目。我们优先展示能够追溯来源的内容，并明确告诉你哪些信息仍需在出发前确认。</p></div></header>
      <main className="section-shell about-layout">
        <section className="about-intro"><p className="eyebrow">我们在做什么</p><h2>用地图建立地理感，用路线减少决策成本</h2><p>宁夏景点分布跨度大，城市之间的交通顺序会直接影响旅行体验。本站将五座城市、十二个首期景点与七条主题路线放到同一套数据中，避免页面之间互相矛盾。</p></section>
        <section className="method-grid">
          <article><FileCheck2 aria-hidden="true" /><h2>事实资料</h2><p>优先参考宁夏回族自治区文化和旅游厅、地方政府、景区和场馆官方页面。每个景点都保留来源与校订日期。</p></article>
          <article><Image aria-hidden="true" /><h2>图片许可</h2><p>首期图片来自 Wikimedia Commons 的公共领域或 Creative Commons 授权文件，并在详情页展示作者、许可和原始页面。</p></article>
          <article><MapPinned aria-hidden="true" /><h2>地图位置</h2><p>站内使用 WGS84 坐标绘制 SVG。外部查看通过高德 URI API 打开，本站不嵌入高德底图，也不获取用户位置。</p></article>
          <article><ShieldCheck aria-hidden="true" /><h2>内容边界</h2><p>票价、开放时间、预约和交通班次变化频繁。本站提供规划参考，不代替景区公告、购票平台或现场管理要求。</p></article>
        </section>
        <section className="source-directory"><div><p className="eyebrow">主要资料入口</p><h2>继续核对最新信息</h2></div><div><a href="https://whhlyt.nx.gov.cn/" target="_blank" rel="noreferrer">宁夏回族自治区文化和旅游厅 <ExternalLink aria-hidden="true" /></a><a href="https://www.nxshahu.com/" target="_blank" rel="noreferrer">宁夏沙湖旅游官方网站 <ExternalLink aria-hidden="true" /></a><a href="https://www.shapotou.com/index.html" target="_blank" rel="noreferrer">沙坡头旅游官方网站 <ExternalLink aria-hidden="true" /></a><a href="https://github.com/Minkelxy/ningxia-tourism/issues" target="_blank" rel="noreferrer">在 GitHub 提交勘误 <ExternalLink aria-hidden="true" /></a></div></section>
      </main>
    </>
  );
}
