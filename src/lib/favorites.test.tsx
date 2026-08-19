import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FavoritesProvider, useFavorites } from './favorites';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
});

function Harness() {
  const { favorites, count, toggleFavorite } = useFavorites();
  return <><output data-testid="count">{count}</output><output data-testid="ids">{favorites.attraction.join(',')}</output><button type="button" onClick={() => toggleFavorite('attraction', 'shahu')}>toggle</button></>;
}

describe('FavoritesProvider', () => {
  it('规范化本地收藏 ID 并保留首次出现顺序', () => {
    window.localStorage.setItem('ningxia-tourism-favorites', JSON.stringify({ attraction: ['shahu', 42, 'shahu', ''], route: [null, 'classic-3day'] }));
    render(<FavoritesProvider><Harness /></FavoritesProvider>);

    expect(screen.getByTestId('count')).toHaveTextContent('2');
    expect(screen.getByTestId('ids')).toHaveTextContent('shahu');
  });

  it('本地存储写入失败时仍更新当前页面状态', async () => {
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(() => { throw new Error('storage disabled'); });
    render(<FavoritesProvider><Harness /></FavoritesProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('1'));
  });
});
