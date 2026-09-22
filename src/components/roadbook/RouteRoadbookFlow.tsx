import { memo, type CSSProperties } from 'react';
import { cityName } from '../../data/cities';
import type { RoadbookModel } from '../../lib/roadbook';

interface RouteRoadbookFlowProps {
  model: RoadbookModel;
}

/**
 * 按天流线：把整条路线读成一条连续编号的链。
 * 编号使用跨天连续的全局序号（1..N），与详情页时间线每日从 1 重排的 .stop-number
 * 有意不同——这里要的是一口气读完的路线顺序，不是每天各自的小节。
 */
function RouteRoadbookFlow({ model }: RouteRoadbookFlowProps) {
  return (
    <ol className="roadbook-flow">
      {model.days.map((day, index) => (
        <li key={day.day} className="roadbook-flow__day" style={{ '--roadbook-day-index': index } as CSSProperties}>
          <div className="roadbook-flow__head">
            <span className="roadbook-flow__stamp" aria-hidden="true">D{String(day.day).padStart(2, '0')}</span>
            <div>
              <h3>
                <span className="sr-only">第 {day.day} 天：</span>
                {day.title}
              </h3>
              <p className="roadbook-flow__cities">
                {day.cityIds.length ? day.cityIds.map(cityName).join('、') : '当天无可定位景点'}
                <span aria-hidden="true"> · {day.nodes.length} 个停靠点</span>
              </p>
            </div>
          </div>

          <ol className="roadbook-flow__nodes">
            {day.nodes.map((node) => (
              <li
                key={node.order}
                className={`roadbook-flow__node${node.isQueryOnly ? ' is-query-only' : ''}`}
                style={{ '--roadbook-node-index': node.indexInDay } as CSSProperties}
              >
                <span className="roadbook-flow__num" aria-hidden="true">{node.order}</span>
                <span className="roadbook-flow__time">{node.time}</span>
                <span className="roadbook-flow__title">
                  {node.title}
                  {node.isQueryOnly && <span className="roadbook-flow__tag">查询点</span>}
                </span>
                {node.isQueryOnly && <span className="sr-only">，市区或车站类查询点，没有坐标，不参与线路连线</span>}
              </li>
            ))}
          </ol>

          <p className="roadbook-flow__foot">
            <span>餐：{day.meals.join(' · ')}</span>
            <span>住：{day.accommodation}</span>
          </p>
        </li>
      ))}
    </ol>
  );
}

export default memo(RouteRoadbookFlow);
