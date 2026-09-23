import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { cityName } from '../../data/cities';
import { createProjection, geometryToPath, mergeFeatureBounds, type GeoFeature } from '../map/projection';
import { routeSegments, type RoadbookModel } from '../../lib/roadbook';
import { loadProvinceFeatures } from './province';

/** 缩略图画布：比主地图小得多，只表达「这条路线怎么走」。 */
export const ROADBOOK_MAP_WIDTH = 360;
export const ROADBOOK_MAP_HEIGHT = 300;
const MAP_PADDING = 30;

interface RouteRoadbookMapProps {
  model: RoadbookModel;
}

function RouteRoadbookMap({ model }: RouteRoadbookMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [features, setFeatures] = useState<GeoFeature[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [shouldLoad, setShouldLoad] = useState(false);

  // 省界数据进入视口后再取，避免拖累路线详情页首屏。
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setShouldLoad(true);
      observer.disconnect();
    }, { rootMargin: '240px 0px' });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    let active = true;
    setStatus('loading');
    loadProvinceFeatures()
      .then((list) => {
        if (!active) return;
        setFeatures(list);
        setStatus('ready');
      })
      .catch(() => {
        if (!active) return;
        setStatus('error');
      });
    return () => { active = false; };
  }, [shouldLoad]);

  const provinceBounds = useMemo(() => (features.length ? mergeFeatureBounds(features) : null), [features]);
  // 以路线自身范围取景，让这条路线填满画布；省界作为语境一起被画出来（超出画布的部分自然裁掉）。
  const framingBounds = model.bounds ?? provinceBounds;
  const project = useMemo(
    () => (framingBounds ? createProjection(framingBounds, ROADBOOK_MAP_WIDTH, ROADBOOK_MAP_HEIGHT, MAP_PADDING) : null),
    [framingBounds],
  );

  const segments = useMemo(() => routeSegments(model), [model]);
  const provincePaths = useMemo(
    () => (features.length && project
      ? features.map((feature) => ({ key: feature.properties.code ?? feature.properties.name ?? 'province', d: geometryToPath(feature, project) }))
      : []),
    [features, project],
  );

  const cities = model.cityIds.map(cityName).join('、');
  const label = `${model.route.name}线路示意：共 ${model.days.length} 天、${model.nodes.length} 个停靠点，其中 ${model.geocodedNodes.length} 个可定位已连线`
    + (cities ? `，涉及${cities}` : '')
    + (model.queryOnlyNodes.length ? `；另有 ${model.queryOnlyNodes.length} 个市区或车站类查询点不参与连线。` : '。');

  return (
    <div ref={containerRef} className="roadbook-map">
      {status === 'error' ? (
        <p className="roadbook-map__state" role="status">线路示意图暂时无法加载，下方流线图仍可查看完整顺序。</p>
      ) : (
        <svg
          viewBox={`0 0 ${ROADBOOK_MAP_WIDTH} ${ROADBOOK_MAP_HEIGHT}`}
          className="roadbook-map__canvas"
          role="img"
          aria-label={label}
        >
          <defs>
            <radialGradient id="roadbookMapBg" cx="50%" cy="42%" r="72%">
              <stop offset="0%" stopColor="#fbf7ee" />
              <stop offset="100%" stopColor="#ece0c8" />
            </radialGradient>
            <pattern id="roadbookMapGrain" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="5" r=".6" fill="#7b633e" opacity=".13" />
              <circle cx="12" cy="11" r=".45" fill="#7b633e" opacity=".1" />
            </pattern>
          </defs>
          <rect width={ROADBOOK_MAP_WIDTH} height={ROADBOOK_MAP_HEIGHT} rx="18" fill="url(#roadbookMapBg)" />
          <rect width={ROADBOOK_MAP_WIDTH} height={ROADBOOK_MAP_HEIGHT} rx="18" fill="url(#roadbookMapGrain)" />

          {project && (
            <>
              <g className="roadbook-map__province" aria-hidden="true">
                {provincePaths.map((item) => <path key={item.key} d={item.d} pathLength={1} />)}
              </g>
              <g aria-hidden="true">
                {segments.map((segment, index) => {
                  const points = segment.nodes.map((node) => {
                    const { x, y } = project(node.coordinates!.lng, node.coordinates!.lat);
                    return { x, y };
                  });
                  const head = points[0];
                  return (
                    // 墨线颜色由 CSS 的 .roadbook-map__segment 提供，这里只传错峰用的分段序号。
                    <g key={segment.day} className="roadbook-map__segment"
                      style={{ '--roadbook-segment-index': index } as CSSProperties}>
                      {/* 单点分段只有点、没有线段，画 path 会得到空 d。 */}
                      {points.length >= 2 && (
                        <path
                          className="roadbook-route-ink"
                          d={points.map((point, pointIndex) => `${pointIndex === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' ')}
                          pathLength={1}
                        />
                      )}
                      {/* 当天首个可定位点的上方挂一枚 D 标，让「哪段属于哪一天」在图上一眼可读。 */}
                      <text
                        x={head.x}
                        y={head.y - 13}
                        textAnchor="middle"
                        className="roadbook-map__day-tag"
                      >
                        D{segment.day}
                      </text>
                      {points.map((point, pointIndex) => {
                        const node = segment.nodes[pointIndex];
                        return (
                          <g key={node.order} className="roadbook-node" style={{ '--roadbook-node-index': node.order - 1 } as CSSProperties}>
                            <circle cx={point.x} cy={point.y} r="6.5" className="roadbook-node__dot" />
                            <text x={point.x} y={point.y} className="roadbook-node__num" textAnchor="middle" dominantBaseline="central">{node.order}</text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })}
              </g>
            </>
          )}
          {status !== 'ready' && (
            <text x={ROADBOOK_MAP_WIDTH / 2} y={ROADBOOK_MAP_HEIGHT / 2} textAnchor="middle" dominantBaseline="central" className="roadbook-map__hint">
              {status === 'idle' ? '线路示意图将在接近此处时加载' : '正在铺开省界底图…'}
            </text>
          )}
        </svg>
      )}
      <p className="roadbook-map__legend">
        <span><i className="roadbook-map__swatch" aria-hidden="true" />实心编号点：已核实景点，按天分段连线</span>
        {model.queryOnlyNodes.length > 0 && (
          <span><i className="roadbook-map__swatch roadbook-map__swatch--hollow" aria-hidden="true" />{model.queryOnlyNodes.length} 个市区／车站类查询点无坐标，只在下方流线图出现</span>
        )}
      </p>
    </div>
  );
}

export default memo(RouteRoadbookMap);
