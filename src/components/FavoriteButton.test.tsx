import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import FavoriteButton from './FavoriteButton';
import { FavoritesProvider } from '../lib/favorites';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

function renderButton(kind: 'attraction' | 'route' = 'attraction', id = 'shahu', label = '沙湖') {
  return render(<FavoritesProvider><FavoriteButton kind={kind} id={id} label={label} /></FavoritesProvider>);
}

describe('FavoriteButton', () => {
  it('未收藏时显示收藏态并暴露 aria-pressed=false', () => {
    renderButton();
    const button = screen.getByRole('button', { name: '收藏沙湖' });
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveTextContent('收藏');
  });

  it('点击后切换为已收藏态，aria-pressed 与 aria-label 同步更新', () => {
    renderButton();
    const button = screen.getByRole('button', { name: '收藏沙湖' });
    fireEvent.click(button);
    const active = screen.getByRole('button', { name: '取消收藏沙湖' });
    expect(active).toHaveAttribute('aria-pressed', 'true');
    expect(active).toHaveTextContent('已收藏');
  });

  it('再次点击取消收藏并回退状态与标签', () => {
    renderButton();
    const button = screen.getByRole('button', { name: '收藏沙湖' });
    fireEvent.click(button); // 收藏
    fireEvent.click(screen.getByRole('button', { name: '取消收藏沙湖' })); // 取消
    expect(screen.getByRole('button', { name: '收藏沙湖' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: '收藏沙湖' })).toHaveTextContent('收藏');
  });

  it('收藏状态持久化到本地存储', () => {
    renderButton('route', 'classic-3day', '经典三日');
    fireEvent.click(screen.getByRole('button', { name: '收藏经典三日' }));
    const stored = JSON.parse(window.localStorage.getItem('ningxia-tourism-favorites') || '{}');
    expect(stored.route).toContain('classic-3day');
  });

  it('预设收藏状态下渲染为已收藏', () => {
    window.localStorage.setItem('ningxia-tourism-favorites', JSON.stringify({ attraction: ['shahu'], route: [] }));
    renderButton();
    expect(screen.getByRole('button', { name: '取消收藏沙湖' })).toHaveAttribute('aria-pressed', 'true');
  });
});
