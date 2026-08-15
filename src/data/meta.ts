import { Compass, Landmark, Mountain, Sparkles } from 'lucide-react';
import type { AttractionCategory, RoutePace, RouteTheme, RouteWalkingLevel } from '../types';

export const categoryMeta: Record<AttractionCategory, { label: string; className: string; icon: typeof Mountain }> = {
  nature: { label: '自然风光', className: 'category-nature', icon: Mountain },
  history: { label: '历史文化', className: 'category-history', icon: Landmark },
  religion: { label: '宗教建筑', className: 'category-religion', icon: Sparkles },
  experience: { label: '特色体验', className: 'category-experience', icon: Compass },
};

export const routeThemeLabels: Record<RouteTheme, string> = {
  'first-visit': '初次到访', weekend: '周末短途', panorama: '全景路线', culture: '文化主题', food: '城市味道',
};

export const routePaceMeta: Record<RoutePace, { label: string; note: string }> = {
  relaxed: { label: '舒缓', note: '每天一个主主题，留有较多机动时间' },
  balanced: { label: '适中', note: '游览与跨城并重，通常每天两至三个停靠' },
  intensive: { label: '紧凑', note: '远郊或跨城较多，需要早出并控制停留时间' },
};

export const routeWalkingMeta: Record<RouteWalkingLevel, { label: string; note: string }> = {
  low: { label: '较少', note: '以城市漫游和短距离步行为主' },
  medium: { label: '适中', note: '包含景区步行，建议穿舒适鞋履' },
  high: { label: '较多', note: '连续景区步行或户外停留时间较长' },
};
