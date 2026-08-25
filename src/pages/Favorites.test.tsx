import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Favorites from './Favorites';
import { FavoritesProvider } from '../lib/favorites';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('Favorites', () => {
  it('按用户收藏顺序展示景点和路线', () => {
    window.localStorage.setItem('ningxia-tourism-favorites', JSON.stringify({
      attraction: ['shahu', 'xixiawangling'],
      route: ['food-3day', 'classic-3day'],
    }));
    render(<MemoryRouter><FavoritesProvider><Favorites /></FavoritesProvider></MemoryRouter>);

    const attractionLinks = screen.getAllByRole('link').filter((link) => link.className === 'favorite-row-link');
    const routeLinks = screen.getAllByRole('link').filter((link) => link.className === 'favorite-route-link');
    expect(attractionLinks.map((link) => link.getAttribute('href'))).toEqual(['/attraction/shahu', '/attraction/xixiawangling']);
    expect(routeLinks.map((link) => link.getAttribute('href'))).toEqual(['/routes/food-3day', '/routes/classic-3day']);
  });

  it('可直接从列表移除单个景点或路线', () => {
    window.localStorage.setItem('ningxia-tourism-favorites', JSON.stringify({
      attraction: ['shahu'],
      route: ['classic-3day'],
    }));
    render(<MemoryRouter><FavoritesProvider><Favorites /></FavoritesProvider></MemoryRouter>);

    fireEvent.click(screen.getByRole('button', { name: '取消收藏沙湖生态旅游区' }));
    expect(screen.queryByRole('link', { name: /沙湖生态旅游区/ })).not.toBeInTheDocument();
    expect(screen.getByText('还没有收藏景点')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '取消收藏经典三日全景游' }));
    expect(screen.getByText('还没有收藏路线')).toBeInTheDocument();
    expect(screen.getAllByText('0 项')).toHaveLength(2);
  });
});
