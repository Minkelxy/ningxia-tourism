import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface FilterPanelState {
  filtersExpanded: boolean;
  setFiltersExpanded: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleFilters: () => void;
}

/**
 * 统一列表页筛选逻辑：URLSearchParams 的增删、清除筛选与筛选面板折叠态。
 * 对应 AttractionsList / FoodsList / RouteRecommendation / Journal 四处重复模式。
 */
export default function useSearchParamsFilter() {
  const [params, setParams] = useSearchParams();

  const setFilter = useCallback((name: string, value: string) => {
    const next = new URLSearchParams(params);
    if (!value || value === 'all') next.delete(name); else next.set(name, value);
    setParams(next, { replace: true });
  }, [params, setParams]);

  /** 重置为全部筛选，可通过 preserveKeys 保留一些参数（如 Journal 页面保留 type=xx） */
  const clearFilters = useCallback((preserveKeys?: string[]) => {
    const next = new URLSearchParams();
    if (preserveKeys) {
      for (const key of preserveKeys) {
        const value = params.get(key);
        if (value) next.set(key, value);
      }
    }
    setParams(next, { replace: true });
  }, [params, setParams]);

  return { params, setParams, setFilter, clearFilters };
}

/**
 * 筛选面板折叠态：初始展开规则为"激活筛选数 > 0"。
 */
export function useFilterPanel(activeFilterCount: number): FilterPanelState {
  const [filtersExpanded, setFiltersExpanded] = useState(() => activeFilterCount > 0);
  const toggleFilters = useCallback(() => setFiltersExpanded((current) => !current), []);
  return { filtersExpanded, setFiltersExpanded, toggleFilters };
}

/**
 * 工具：从一组条件（非空字符串 / boolean）统计激活筛选数。
 */
export function countActiveFilters(conditions: Array<string | boolean | undefined | null>): number {
  return conditions.filter((value) => typeof value === 'string' ? Boolean(value.trim()) : Boolean(value)).length;
}

/**
 * 组合：计算激活筛选数 + 初始化面板折叠态，返回两者。
 */
export function useFiltersWithPanel(conditions: Array<string | boolean | undefined | null>): { activeFilterCount: number } & FilterPanelState {
  const activeFilterCount = useMemo(() => countActiveFilters(conditions), [conditions]);
  const panel = useFilterPanel(activeFilterCount);
  return { activeFilterCount, ...panel };
}
