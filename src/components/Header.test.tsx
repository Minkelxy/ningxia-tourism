import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesProvider } from '../lib/favorites';
import Header from './Header';

afterEach(() => window.localStorage.clear());

const renderHeader = () => render(
  <MemoryRouter>
    <FavoritesProvider><Header /></FavoritesProvider>
  </MemoryRouter>,
);

describe('Header 移动端菜单', () => {
  it('打开后聚焦首个菜单项，并可用 Escape 关闭并恢复焦点', async () => {
    renderHeader();
    const menuButton = screen.getByRole('button', { name: '打开导航菜单' });

    fireEvent.click(menuButton);
    const mobileNav = screen.getByRole('navigation', { name: '移动端导航' });
    const firstLink = mobileNav.querySelector('a');
    await waitFor(() => expect(document.activeElement).toBe(firstLink));

    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.getByRole('button', { name: '打开导航菜单' })).toHaveFocus());
    expect(screen.queryByRole('navigation', { name: '移动端导航' })).not.toBeInTheDocument();
  });
});
