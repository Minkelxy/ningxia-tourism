import { ExternalLink, FileCheck2, Image, MapPinned, NotebookPen, RefreshCcw, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  return (
    <>
      <SEO title="关于本站 · 宁夏旅行地图" description="了解宁夏旅行地图的证据分级、个人手记、图片许可、修订方式和使用边界。" />
      <header className="page-hero compact-hero"><div className="section-shell"><p className="eyebrow">关于本站</p><h1>让漂亮的旅行网站，<br />也对信息负责。</h1><p>这是一个开源、非官方的宁夏旅行规划项目。我们区分官方事实、规划建议与个人体验，也明确告诉你哪些信息仍需在出发前确认。</p></div></header>
      <div className="section-shell about-layout">
        <section className="about-intro"><p className="eyebrow">我们在做什么</p><h2>用地图建立地理感，用路线减少决策成本</h2><p>宁夏景点分布跨度大，城市之间的顺序会直接影响体验。本站将五座城市、公开景点、七条主题路线与旅行手记放进同一套可校验的数据中。</p></section>
        <section className="method-grid">
          <article><FileCheck2 aria-hidden="true" /><h2>证据分级</h2><p>只有官方直接页面能支撑核心事实，且图片准确对应、许可清晰，才标为“已核实”；其余公开内容标为“待复核”。</p></article>
          <article><Image aria-hidden="true" /><h2>图片许可</h2><p>公开图片必须保留作者、许可与原始页面。区域氛围图不能被当作具体景点实景，也不能通过严格核实。</p></article>
          <article><MapPinned aria-hidden="true" /><h2>地图位置</h2><p>站内使用 WGS84 坐标绘制 SVG。外部查看通过高德 URI 打开，本站不嵌入高德底图，也不获取用户位置。</p></article>
          <article><NotebookPen aria-hidden="true" /><h2>个人手记</h2><p>游记与探店只记录真实发生的经历。个人感受不包装成官方推荐；价格、排队和营业状态必须绑定到店日期。</p></article>
          <article><ShieldCheck aria-hidden="true" /><h2>事实与建议</h2><p>来源支持的内容属于事实资料；路线节奏、值得与不值得属于编辑或个人判断。两者会在页面语气与来源区分开。</p></article>
          <article><RefreshCcw aria-hidden="true" /><h2>修订流程</h2><p>收到勘误后先核对官方直接来源与图片许可，再更新字段、复核日期和内容审计；证据不足时降级或退回草稿。</p></article>
        </section>
        <section className="source-directory"><div><p className="eyebrow">资料与反馈</p><h2>继续核对最新信息</h2></div><div><a href="https://whhlyt.nx.gov.cn/" target="_blank" rel="noreferrer">宁夏回族自治区文化和旅游厅 <ExternalLink aria-hidden="true" /></a><a href="https://www.shapotou.com/index.html" target="_blank" rel="noreferrer">沙坡头旅游官方网站 <ExternalLink aria-hidden="true" /></a><a href="https://github.com/Minkelxy/ningxia-tourism/blob/agent/ningxia-site-upgrade/docs/CONTENT_AUDIT.md" target="_blank" rel="noreferrer">查看内容审计记录 <ExternalLink aria-hidden="true" /></a><a href="https://github.com/Minkelxy/ningxia-tourism/issues" target="_blank" rel="noreferrer">在 GitHub 提交勘误 <ExternalLink aria-hidden="true" /></a></div></section>
      </div>
    </>
  );
}
