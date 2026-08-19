import { cleanup, render, screen } from '@testing-library/react';
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

    const attractionLinks = screen.getAllByRole('link').filter((link) => link.className === 'favorite-row');
    const routeLinks = screen.getAllByRole('link').filter((link) => link.className === 'favorite-route-row');
    expect(attractionLinks.map((link) => link.getAttribute('href'))).toEqual(['/attraction/shahu', '/attraction/xixiawangling']);
    expect(routeLinks.map((link) => link.getAttribute('href'))).toEqual(['/routes/food-3day', '/routes/classic-3day']);
  });
});
