import { memo, useMemo, type CSSProperties } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import type { Food } from '../../types';
import { activateWithKeyboard } from './config';
import type { createProjection } from './projection';

interface FoodLayerProps {
  foods: Food[];
  project: ReturnType<typeof createProjection>;
  onSelect?: (food: Food) => void;
}

// 美食图层：仅渲染第一个含坐标的餐厅点位，颜色采用 PRD 枸杞红 #E85D4C。
// onSelect 存在时使用 role="button" + onKeyDown 支持键盘跳转详情页；
// 不存在时退回 role="img"，仅作展示且不进入 Tab 顺序。
function FoodLayer({ foods, project, onSelect }: FoodLayerProps) {
  const visible = useMemo(() => foods.flatMap((food) => {
    const restaurant = food.restaurants.find((item) => item.coordinates);
    return restaurant?.coordinates ? [{ food, coordinates: restaurant.coordinates }] : [];
  }), [foods]);
  return visible.map(({ food, coordinates }, index) => {
    const point = project(coordinates.lng, coordinates.lat);
    const handleSelect = onSelect ? () => onSelect(food) : undefined;
    return (
      <g
        key={food.id}
        data-food-id={food.id}
        className={`map-food${handleSelect ? ' map-food--interactive' : ''}`}
        style={{ '--map-layer-index': index } as CSSProperties}
        transform={`translate(${point.x} ${point.y})`}
        tabIndex={handleSelect ? 0 : undefined}
        role={handleSelect ? 'button' : 'img'}
        aria-label={handleSelect ? `${food.name}，按回车查看详情` : `${food.name}，宁夏美食`}
        onClick={handleSelect ? (event) => { event.stopPropagation(); handleSelect(); } : undefined}
        onKeyDown={handleSelect ? (event) => activateWithKeyboard(event, handleSelect) : undefined}
      >
        {handleSelect && <circle className="marker-hit" r="38" />}
        <g className="map-food-glyph">
          <circle r="11" fill="#E85D4C" stroke="#fff" strokeWidth={2} />
          <UtensilsCrossed aria-hidden="true" x={-7} y={-7} width={14} height={14} />
          <title>{food.name}</title>
        </g>
      </g>
    );
  });
}

export default memo(FoodLayer);
