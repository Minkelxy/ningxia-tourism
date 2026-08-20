import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import useSearchParamsFilter, { countActiveFilters, useFilterPanel, useFiltersWithPanel } from './useSearchParamsFilter';

afterEach(cleanup);

function Harness() {
  const { params, setFilter, clearFilters } = useSearchParamsFilter();
  return (
    <>
      <output data-testid="params">{params.toString()}</output>
      <button type="button" onClick={() => setFilter('duration', '3')}>set-duration-3</button>
      <button type="button" onClick={() => setFilter('duration', 'all')}>set-duration-all</button>
      <button type="button" onClick={() => setFilter('theme', '')}>set-theme-empty</button>
      <button type="button" onClick={() => clearFilters()}>clear-all</button>
      <button type="button" onClick={() => clearFilters(['city'])}>clear-keep-city</button>
    </>
  );
}

function renderWith(initialPath: string) {
  return render(<MemoryRouter initialEntries={[initialPath]}><Harness /></MemoryRouter>);
}

describe('useSearchParamsFilter', () => {
  it('读取并展示当前 URL 筛选参数', () => {
    renderWith('/list?city=yinchuan&theme=desert');
    const params = new URLSearchParams(screen.getByTestId('params').textContent ?? '');
    expect(params.get('city')).toBe('yinchuan');
    expect(params.get('theme')).toBe('desert');
  });

  it('setFilter 增设参数并保留既有参数', () => {
    renderWith('/list?city=yinchuan');
    fireEvent.click(screen.getByRole('button', { name: 'set-duration-3' }));
    const params = new URLSearchParams(screen.getByTestId('params').textContent ?? '');
    expect(params.get('city')).toBe('yinchuan');
    expect(params.get('duration')).toBe('3');
  });

  it('setFilter 传入 all 或空字符串时删除该参数', () => {
    renderWith('/list?theme=desert&duration=3');
    fireEvent.click(screen.getByRole('button', { name: 'set-duration-all' }));
    let params = new URLSearchParams(screen.getByTestId('params').textContent ?? '');
    expect(params.has('duration')).toBe(false);
    expect(params.get('theme')).toBe('desert');

    fireEvent.click(screen.getByRole('button', { name: 'set-theme-empty' }));
    params = new URLSearchParams(screen.getByTestId('params').textContent ?? '');
    expect(params.has('theme')).toBe(false);
  });

  it('clearFilters 清空全部筛选参数', () => {
    renderWith('/list?city=yinchuan&theme=desert');
    fireEvent.click(screen.getByRole('button', { name: 'clear-all' }));
    expect(screen.getByTestId('params').textContent).toBe('');
  });

  it('clearFilters 通过 preserveKeys 保留指定参数', () => {
    renderWith('/list?city=yinchuan&theme=desert&duration=3');
    fireEvent.click(screen.getByRole('button', { name: 'clear-keep-city' }));
    const params = new URLSearchParams(screen.getByTestId('params').textContent ?? '');
    expect(params.get('city')).toBe('yinchuan');
    expect(params.has('theme')).toBe(false);
    expect(params.has('duration')).toBe(false);
  });
});

describe('countActiveFilters', () => {
  it('统计非空字符串与真值条件', () => {
    expect(countActiveFilters(['yinchuan', '', undefined, null, false, true])).toBe(2);
    expect(countActiveFilters(['  ', 'desert'])).toBe(1);
    expect(countActiveFilters([])).toBe(0);
  });
});

function PanelHarness({ count }: { count: number }) {
  const { filtersExpanded, toggleFilters } = useFilterPanel(count);
  return (
    <>
      <output data-testid="expanded">{String(filtersExpanded)}</output>
      <button type="button" onClick={toggleFilters}>toggle</button>
    </>
  );
}

describe('useFilterPanel', () => {
  it('激活筛选数大于 0 时初始展开', () => {
    render(<PanelHarness count={2} />);
    expect(screen.getByTestId('expanded').textContent).toBe('true');
  });

  it('激活筛选数为 0 时初始收起，点击切换', () => {
    render(<PanelHarness count={0} />);
    expect(screen.getByTestId('expanded').textContent).toBe('false');
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByTestId('expanded').textContent).toBe('true');
  });
});

function ComboHarness({ conditions }: { conditions: Array<string | boolean | undefined | null> }) {
  const { activeFilterCount, filtersExpanded } = useFiltersWithPanel(conditions);
  return (
    <>
      <output data-testid="count">{activeFilterCount}</output>
      <output data-testid="expanded">{String(filtersExpanded)}</output>
    </>
  );
}

describe('useFiltersWithPanel', () => {
  it('组合计算激活数并据此初始化面板', () => {
    const { rerender } = render(<ComboHarness conditions={['yinchuan', false, 'desert']} />);
    expect(screen.getByTestId('count').textContent).toBe('2');
    expect(screen.getByTestId('expanded').textContent).toBe('true');
    rerender(<ComboHarness conditions={[]} />);
    // 面板初始态在挂载时锁定，后续 conditions 变化不重置展开态
    expect(screen.getByTestId('count').textContent).toBe('0');
  });
});
