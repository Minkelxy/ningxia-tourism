import type { Ref } from 'react';
import { cityName } from '../../data/cities';
import { routePaceMeta, routeWalkingMeta } from '../../data/meta';
import { createProjection, geometryToPath, mergeFeatureBounds, type GeoFeature } from '../map/projection';
import { routeSegments, wrapText, type RoadbookModel } from '../../lib/roadbook';
import { formatVerifiedDate } from '../../lib/site';

/**
 * 可导出的竖版路书海报。
 *
 * 三条硬约束（改动前请先读，破坏任意一条都会让「生成图片」失效）：
 * 1. 所有样式必须内联为 SVG 表现属性或 style —— 序列化后的 SVG 独立渲染，
 *    CSS 类、CSS 变量、外部样式表都不会生效。
 * 2. 不含任何位图照片 —— `<image href>` 指向跨域资源会污染 canvas，toBlob 会失败。
 * 3. 静态终态、不挂任何动画 —— 墨线动画初态是 stroke-dashoffset: 1（不可见），
 *    导出若截到动画中途会得到缺线的图。入场动画只加在详情页的内嵌组件上。
 */

const POSTER_WIDTH = 900;
const PAD = 56;
const CONTENT_WIDTH = POSTER_WIDTH - PAD * 2;
/** 海报里的缩略图面板：比详情页的方形缩略图更宽，铺满整幅。 */
const PANEL_HEIGHT = 380;
const PANEL_PADDING = 26;
/** 每天内容列的起点：印章宽度 + 间距。 */
const DAY_INDENT = 58;
const NODE_ROW_HEIGHT = 30;
const NODE_TITLE_X = DAY_INDENT + 104;

const COLOR = {
  paper: '#f7f3ea',
  card: '#fffdf8',
  panel: '#f2ead8',
  panelDeep: '#e4d7b6',
  province: '#ded0ab',
  provinceLine: 'rgba(120,88,44,.5)',
  ink: '#24231f',
  muted: '#68645b',
  line: '#d9d1c1',
  green: '#315f4f',
  greenDark: '#21463b',
  red: '#a94535',
  sand: '#b9873c',
  sandDark: '#875e24',
} as const;

const SERIF = '"Songti SC", "STSong", "Noto Serif CJK SC", Georgia, serif';
const SANS = '"PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", system-ui, sans-serif';

interface RouteRoadbookPosterProps {
  model: RoadbookModel;
  /** 省界要素；缺省时只画路线本身，海报仍然可用。 */
  features?: GeoFeature[];
  svgRef?: Ref<SVGSVGElement>;
}

interface DayLayout {
  day: number;
  y: number;
  height: number;
}

function RouteRoadbookPoster({ model, features = [], svgRef }: RouteRoadbookPosterProps) {
  const { route } = model;

  const titleLines = wrapText(route.name, Math.floor(CONTENT_WIDTH / 46));
  const summaryLines = wrapText(route.summary, Math.floor(CONTENT_WIDTH / 18));

  // ── 版式计算：先量出每一块的高度，再加总成 viewBox 高度 ──
  const headTop = PAD;
  const titleTop = headTop + 40 + 40;
  const titleBlockHeight = titleLines.length * 58;
  const summaryTop = titleTop + titleBlockHeight + 34;
  const factsTop = summaryTop + summaryLines.length * 30 + 30;
  const budgetTop = factsTop + 74;
  const panelTop = budgetTop + 40;
  const daysTop = panelTop + PANEL_HEIGHT + 56;

  const dayLayouts: DayLayout[] = [];
  let cursor = daysTop;
  for (const day of model.days) {
    const height = 62 + day.nodes.length * NODE_ROW_HEIGHT + 40;
    dayLayouts.push({ day: day.day, y: cursor, height });
    cursor += height + 22;
  }
  const footerTop = cursor + 22;
  const posterHeight = Math.round(footerTop + 92 + PAD);

  // ── 地图面板 ──
  const provinceBounds = features.length ? mergeFeatureBounds(features) : null;
  const framingBounds = model.bounds ?? provinceBounds;
  const project = framingBounds
    ? createProjection(framingBounds, CONTENT_WIDTH, PANEL_HEIGHT, PANEL_PADDING)
    : null;
  const segments = routeSegments(model);
  const provincePaths = features.length && project
    ? features.map((feature) => geometryToPath(feature, project))
    : [];

  // 预算串长度随路线差别很大，塞进等分栏会被挤爆，单独占一行更稳。
  const facts = [
    { label: '行程', value: route.durationLabel },
    { label: '节奏', value: routePaceMeta[route.pace].label },
    { label: '步行', value: routeWalkingMeta[route.walkingLevel].label },
    { label: '最佳季节', value: route.bestSeason },
  ];
  const factWidth = CONTENT_WIDTH / facts.length;

  return (
    <svg
      ref={svgRef}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${POSTER_WIDTH} ${posterHeight}`}
      width={POSTER_WIDTH}
      height={posterHeight}
      role="img"
      aria-label={`${route.name}路书海报：共 ${model.days.length} 天、${model.nodes.length} 个停靠点`}
      style={{ fontFamily: SANS, backgroundColor: COLOR.paper }}
    >
      <defs>
        <radialGradient id="posterMapBg" cx="50%" cy="40%" r="76%">
          <stop offset="0%" stopColor="#fbf7ee" />
          <stop offset="100%" stopColor="#ece0c8" />
        </radialGradient>
        <linearGradient id="posterTitleInk" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(169,69,53,.62)" />
          <stop offset="100%" stopColor="rgba(200,157,77,.14)" />
        </linearGradient>
      </defs>

      <rect width={POSTER_WIDTH} height={posterHeight} fill={COLOR.paper} />
      <rect x="18" y="18" width={POSTER_WIDTH - 36} height={posterHeight - 36} rx="20" fill="none" stroke={COLOR.line} strokeWidth="1.5" />

      {/* 品牌行 */}
      <text x={PAD} y={headTop + 16} fill={COLOR.green} fontSize="15" fontWeight="800" letterSpacing="2">
        宁夏旅行地图
      </text>
      <text x={PAD + 122} y={headTop + 16} fill={COLOR.muted} fontSize="15">
        · 主题路线路书
      </text>
      <g transform={`translate(${POSTER_WIDTH - PAD - 46} ${headTop - 12}) rotate(-6)`}>
        <rect width="46" height="46" rx="8" fill={COLOR.red} />
        <text x="23" y="20" fill="#fff" fontSize="17" fontFamily={SERIF} fontWeight="800" textAnchor="middle">宁</text>
        <text x="23" y="39" fill="#fff" fontSize="17" fontFamily={SERIF} fontWeight="800" textAnchor="middle">夏</text>
      </g>

      {/* 标题块 */}
      <text x={PAD} y={titleTop} fill={COLOR.sandDark} fontSize="14" fontWeight="800" letterSpacing="1.6">
        {route.themeLabel}
      </text>
      {titleLines.map((line, index) => (
        <text
          key={`title-${line}`}
          x={PAD}
          y={titleTop + 34 + index * 58 + 32}
          fill={COLOR.ink}
          fontSize="46"
          fontFamily={SERIF}
          fontWeight="800"
        >
          {line}
        </text>
      ))}
      <rect x={PAD} y={titleTop + 34 + titleBlockHeight + 8} width={Math.min(300, CONTENT_WIDTH * 0.38)} height="4" rx="2" fill="url(#posterTitleInk)" />
      {summaryLines.map((line, index) => (
        <text key={`summary-${line}`} x={PAD} y={summaryTop + index * 30 + 20} fill={COLOR.muted} fontSize="18">
          {line}
        </text>
      ))}

      {/* 事实条 */}
      <g>
        <rect x={PAD} y={factsTop} width={CONTENT_WIDTH} height="74" rx="14" fill={COLOR.card} stroke={COLOR.line} />
        {facts.map((fact, index) => (
          <g key={fact.label}>
            <text x={PAD + 22 + index * factWidth} y={factsTop + 28} fill={COLOR.muted} fontSize="13" fontWeight="700">
              {fact.label}
            </text>
            <text x={PAD + 22 + index * factWidth} y={factsTop + 54} fill={COLOR.greenDark} fontSize="17" fontWeight="800">
              {fact.value}
            </text>
            {index > 0 && (
              <line x1={PAD + index * factWidth} y1={factsTop + 14} x2={PAD + index * factWidth} y2={factsTop + 60} stroke={COLOR.line} />
            )}
          </g>
        ))}
      </g>
      <text x={PAD} y={budgetTop + 24} fill={COLOR.muted} fontSize="15">
        <tspan fontWeight="700">预算</tspan>
        <tspan dx="10">{route.budget}</tspan>
      </text>

      {/* 地理面板 */}
      <g>
        <clipPath id="posterMapClip">
          <rect x={PAD} y={panelTop} width={CONTENT_WIDTH} height={PANEL_HEIGHT} rx="16" />
        </clipPath>
        <rect x={PAD} y={panelTop} width={CONTENT_WIDTH} height={PANEL_HEIGHT} rx="16" fill="url(#posterMapBg)" stroke={COLOR.line} />
        <g clipPath="url(#posterMapClip)">
          <g transform={`translate(${PAD} ${panelTop})`}>
            {project && provincePaths.map((d, index) => (
              <path key={`province-${index}`} d={d} fill={COLOR.province} stroke={COLOR.provinceLine} strokeWidth="1.1" />
            ))}
            {project && segments.map((segment) => {
              const points = segment.nodes.map((node) => project(node.coordinates!.lng, node.coordinates!.lat));
              const head = points[0];
              return (
                <g key={`segment-${segment.day}`}>
                  {points.length >= 2 && (
                    <path
                      d={points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ')}
                      fill="none"
                      stroke={COLOR.green}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity="0.92"
                    />
                  )}
                  <text
                    x={head.x}
                    y={head.y - 14}
                    fill={COLOR.greenDark}
                    fontSize="12"
                    fontWeight="800"
                    textAnchor="middle"
                    stroke="rgba(251,247,238,.9)"
                    strokeWidth="3"
                    paintOrder="stroke"
                  >
                    D{segment.day}
                  </text>
                  {points.map((point, index) => {
                    const node = segment.nodes[index];
                    return (
                      <g key={`node-${node.order}`}>
                        <circle cx={point.x} cy={point.y} r="8.5" fill={COLOR.card} stroke={COLOR.green} strokeWidth="2.2" />
                        <text x={point.x} y={point.y} fill={COLOR.greenDark} fontSize="10" fontWeight="800" textAnchor="middle" dominantBaseline="central">
                          {node.order}
                        </text>
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        </g>
      </g>
      {/* 图例放在面板外：画在面板里会压到路线点位上。 */}
      <text x={PAD} y={panelTop + PANEL_HEIGHT + 26} fill={COLOR.muted} fontSize="13">
        {model.geocodedNodes.length} 个可定位停靠点按天连线
        {model.queryOnlyNodes.length ? `，另有 ${model.queryOnlyNodes.length} 个市区／车站类查询点无坐标，仅在下方流线图列出` : ''}
      </text>

      {/* 按天流线 */}
      {model.days.map((day, dayIndex) => {
        const layout = dayLayouts[dayIndex];
        const cities = day.cityIds.map(cityName).join('、');
        return (
          <g key={`day-${day.day}`}>
            <rect x={PAD} y={layout.y} width={CONTENT_WIDTH} height={layout.height} rx="14" fill={COLOR.card} stroke={COLOR.line} />
            <rect x={PAD} y={layout.y} width="44" height="44" rx="12" fill={COLOR.red} />
            <text x={PAD + 22} y={layout.y + 28} fill="#fff" fontSize="17" fontFamily={SERIF} fontWeight="800" textAnchor="middle">
              D{String(day.day).padStart(2, '0')}
            </text>
            <text x={PAD + DAY_INDENT} y={layout.y + 24} fill={COLOR.ink} fontSize="21" fontFamily={SERIF} fontWeight="800">
              {day.title}
            </text>
            <text x={PAD + DAY_INDENT} y={layout.y + 44} fill={COLOR.muted} fontSize="13">
              {cities || '当天无可定位景点'} · {day.nodes.length} 个停靠点
            </text>
            <line x1={PAD + 18} y1={layout.y + 62} x2={PAD + CONTENT_WIDTH - 18} y2={layout.y + 62} stroke={COLOR.line} strokeDasharray="4 5" />

            {day.nodes.map((node, nodeIndex) => {
              const rowY = layout.y + 62 + nodeIndex * NODE_ROW_HEIGHT + NODE_ROW_HEIGHT / 2;
              return (
                <g key={`node-row-${node.order}`}>
                  <circle
                    cx={PAD + DAY_INDENT + 9}
                    cy={rowY}
                    r="9"
                    fill={node.isQueryOnly ? 'none' : COLOR.green}
                    stroke={node.isQueryOnly ? COLOR.muted : COLOR.green}
                    strokeWidth="1.8"
                    strokeDasharray={node.isQueryOnly ? '3 3' : undefined}
                  />
                  <text
                    x={PAD + DAY_INDENT + 9}
                    y={rowY}
                    fill={node.isQueryOnly ? COLOR.muted : '#fff'}
                    fontSize="11"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {node.order}
                  </text>
                  <text x={PAD + DAY_INDENT + 26} y={rowY} fill={COLOR.muted} fontSize="13" textAnchor="start" dominantBaseline="central">
                    {node.time}
                  </text>
                  <text x={PAD + NODE_TITLE_X} y={rowY} fill={COLOR.ink} fontSize="16" fontWeight="650" dominantBaseline="central">
                    {node.title}
                    {node.isQueryOnly && (
                      <tspan fill={COLOR.muted} fontSize="12"> · 查询点</tspan>
                    )}
                  </text>
                </g>
              );
            })}

            <line x1={PAD + 18} y1={layout.y + layout.height - 40} x2={PAD + CONTENT_WIDTH - 18} y2={layout.y + layout.height - 40} stroke={COLOR.line} strokeDasharray="4 5" />
            <text x={PAD + DAY_INDENT} y={layout.y + layout.height - 16} fill={COLOR.muted} fontSize="13">
              餐：{day.meals.join(' · ')}<tspan dx="18">住：{day.accommodation}</tspan>
            </text>
          </g>
        );
      })}

      {/* 页脚 */}
      <line x1={PAD} y1={footerTop} x2={PAD + CONTENT_WIDTH} y2={footerTop} stroke={COLOR.ink} strokeWidth="2" />
      <text x={PAD} y={footerTop + 30} fill={COLOR.muted} fontSize="13">
        资料分级：已核实景点 {model.evidence.verifiedStops} 个 · 待复核景点 {model.evidence.reviewStops} 个 · 普通地点 {model.evidence.ordinaryStops} 个
      </text>
      <text x={PAD} y={footerTop + 54} fill={COLOR.muted} fontSize="13">
        路线校订：{formatVerifiedDate(route.verifiedAt)} · 票价、班次与营业安排可能变化，出发前请再确认
      </text>
      <text x={PAD + CONTENT_WIDTH} y={footerTop + 54} fill={COLOR.sandDark} fontSize="13" fontWeight="800" textAnchor="end">
        宁夏旅行地图
      </text>
    </svg>
  );
}

export default RouteRoadbookPoster;
