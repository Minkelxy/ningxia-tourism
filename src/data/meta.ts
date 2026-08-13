import { Compass, Landmark, Mountain, Sparkles } from 'lucide-react';
import type { AttractionCategory, RouteTheme } from '../types';

export const categoryMeta: Record<AttractionCategory, { label: string; className: string; icon: typeof Mountain }> = {
  nature: { label: '自然风光', className: 'category-nature', icon: Mountain },
  history: { label: '历史文化', className: 'category-history', icon: Landmark },
  religion: { label: '宗教建筑', className: 'category-religion', icon: Sparkles },
  experience: { label: '特色体验', className: 'category-experience', icon: Compass },
};

export const routeThemeLabels: Record<RouteTheme, string> = {
  'first-visit': '初次到访', weekend: '周末短途', panorama: '全景路线', culture: '文化主题', food: '城市味道',
};
