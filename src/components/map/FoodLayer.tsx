import { UtensilsCrossed } from 'lucide-react';
import type { Food } from '../../types';
import type { createProjection } from './projection';

interface FoodLayerProps {
  foods: Food[];
  project: ReturnType<typeof createProjection>;
  onSelect?: (food: Food) => void;
}

// 美食图层：仅渲染第一个含坐标的餐厅点位，颜色采用 PRD 枸杞红 #E85D4C。
// 与 TransportLayer 一致使用 role="img" + tabIndex=0，方便屏幕阅读器与键盘聚焦；
// onSelect 可选，存在时点击会向上层回传当前 food。
export default function FoodLayer({ foods, project, onSelect }: FoodLayerProps) {
  const visible = foods.filter((food) => food.restaurants.some((restaurant) => restaurant.coordinates));
  return visible.map((food) => {
    const restaurant = food.restaurants.find((item) => item.coordinates)!;
    const point = project(restaurant.coordinates!.lng, restaurant.coordinates!.lat);
    const handleSelect = onSelect ? () => onSelect(food) : undefined;
    return (
      <g
        key={food.id}
        className="map-food"
        transform={`translate(${point.x} ${point.y})`}
        tabIndex={0}
        role="img"
        aria-label={`${food.name}，宁夏美食`}
        onClick={handleSelect ? (event) => { event.stopPropagation(); handleSelect(); } : undefined}
      >
        <circle r="11" fill="#E85D4C" stroke="#fff" strokeWidth={2} />
        <UtensilsCrossed aria-hidden="true" x={-7} y={-7} width={14} height={14} />
        <title>{food.name}</title>
      </g>
    );
  });
}
