import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, ImageDown, Printer, Share2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import RouteRoadbookPoster from '../components/roadbook/RouteRoadbookPoster';
import { loadProvinceFeatures } from '../components/roadbook/province';
import type { GeoFeature } from '../components/map/projection';
import { cityName } from '../data/cities';
import { getRouteById } from '../data/routes';
import { exportSvgToPng } from '../lib/export-svg';
import { buildRoadbookModel } from '../lib/roadbook';
import { formatVerifiedDate } from '../lib/site';
import useShare from '../lib/useShare';

/**
 * 独立路书页：页面本身就是那件可分享的成品 —— 一张竖版海报 + 一份可读的文字版。
 * 海报是静态的（不带入场动画），因为这里展示的就是导出后的样子。
 */
export default function RouteRoadbook() {
  const { routeId } = useParams();
  const route = getRouteById(routeId);
  const model = useMemo(() => (route ? buildRoadbookModel(route) : null), [route]);
  const { showToast, handleShare, ShareToast } = useShare(route ? `${route.name} 路书` : '', route?.summary ?? '');
  // null 表示省界尚未落定；落定为数组（失败时为空数组）后才允许序列化。
  const [features, setFeatures] = useState<GeoFeature[] | null>(null);
  const [exporting, setExporting] = useState(false);
  const posterRef = useRef<SVGSVGElement>(null);

  // 这一页的全部内容就是海报，直接加载省界底图，不需要等视口。
  useEffect(() => {
    let active = true;
    loadProvinceFeatures().then(
      (list) => { if (active) setFeatures(list); },
      () => { if (active) setFeatures([]); /* 省界失败时海报只画路线，不影响导出 */ },
    );
    return () => { active = false; };
  }, []);

  // 海报挂载且省界就绪后才序列化 —— 少任何一样都会导出残缺的图。
  // 与 RouteDetail 的导出逻辑同构：setFeatures 触发的重渲染不会同步反映到 DOM，
  // 因此不能在同一次点击里「先 await 再序列化」，必须等这一轮渲染落地。
  useEffect(() => {
    if (!exporting || !features) return;
    const svg = posterRef.current;
    if (!svg) return;
    let active = true;
    exportSvgToPng(svg, `${route?.name ?? '宁夏路线'}-路书.png`)
      .then((result) => { if (active) showToast(result === 'shared' ? '已打开分享面板' : '路书图片已开始下载'); })
      .catch((error: unknown) => {
        if (!active) return;
        const isCancellation = error instanceof DOMException && error.name === 'AbortError';
        showToast(isCancellation ? '已取消导出' : '图片生成失败，可改用打印路书');
      })
      .finally(() => { if (active) setExporting(false); });
    return () => { active = false; };
  }, [exporting, features, route, showToast]);

  const handleExport = () => {
    if (exporting) return;
    setExporting(true);
    // 省界还没就绪时补一次加载；失败也往下走，没有底图的海报仍然可用。
    if (!features) loadProvinceFeatures().then(setFeatures, () => setFeatures([]));
  };

  if (!route || !model) {
    return <div className="full-state"><SEO title="路书未找到 · 宁夏旅行地图" noIndex /><CalendarDays aria-hidden="true" /><h1>没有找到这条路线</h1><p>回到路线列表，选择一条适合你的行程。</p><Link to="/routes" className="btn-primary">查看全部路线</Link></div>;
  }

  return (
    <>
      <SEO title={`${route.name} 路书 · 宁夏旅行地图`} description={route.summary} />
      <div className="route-roadbook-page">
        <header className="roadbook-page-hero">
          <div className="section-shell">
            <Link to={`/routes/${route.id}`} className="back-link"><ArrowLeft aria-hidden="true" /> 返回路线详情</Link>
            <p className="eyebrow">主题路线路书</p>
            <h1>{route.name} 路书</h1>
            <p>{route.summary}</p>
            <div className="roadbook-page-actions">
              <button type="button" className="btn-primary" onClick={handleExport} disabled={exporting} aria-busy={exporting}>
                <ImageDown aria-hidden="true" /> {exporting ? '正在生成图片…' : '生成图片'}
              </button>
              <button type="button" className="btn-quiet" onClick={() => window.print()}><Printer aria-hidden="true" /> 打印路书</button>
              <button type="button" className="btn-quiet" onClick={handleShare}><Share2 aria-hidden="true" /> 分享链接</button>
            </div>
            <p className="roadbook-page-note">
              {model.days.length} 天 · {model.nodes.length} 个停靠点 · 路线校订 {formatVerifiedDate(route.verifiedAt)}
            </p>
          </div>
        </header>
        {ShareToast}

        <div className="section-shell roadbook-page-body">
          <p className="roadbook-page-poster-hint">手机上可左右滑动查看完整海报</p>
          <figure className="roadbook-page-poster" role="region" aria-label="路书海报" tabIndex={0}>
            <RouteRoadbookPoster model={model} features={features ?? []} svgRef={posterRef} />
          </figure>

          {/* 海报是 role="img"，读屏只能听到一句话，因此这里补一份等价的文字版。 */}
          <section className="roadbook-page-text" aria-labelledby="roadbook-text-title">
            <h2 id="roadbook-text-title">文字版路书</h2>
            <p>编号与海报一致，跨天连续。标注「查询点」的市区或车站类路点没有坐标，不参与地图连线。</p>
            <ol>
              {model.days.map((day) => (
                <li key={day.day}>
                  <h3>第 {day.day} 天：{day.title}</h3>
                  <p>{day.cityIds.length ? day.cityIds.map(cityName).join('、') : '当天无可定位景点'} · {day.nodes.length} 个停靠点</p>
                  <ol>
                    {day.nodes.map((node) => (
                      <li key={node.order}>
                        {node.order}. {node.time} {node.title}
                        {node.isQueryOnly && '（查询点，未参与连线）'}
                      </li>
                    ))}
                  </ol>
                  <p>餐：{day.meals.join(' · ')} · 住：{day.accommodation}</p>
                </li>
              ))}
            </ol>
            <p className="roadbook-page-back"><Link to={`/routes/${route.id}`} className="text-link">查看逐日详细安排 <ArrowRight aria-hidden="true" /></Link></p>
          </section>
        </div>
      </div>
    </>
  );
}
