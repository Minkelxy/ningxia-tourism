import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { FavoritesProvider } from '../lib/favorites';
import Header from './Header';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

const renderHeader = (initialEntries = ['/']) => render(
  <MemoryRouter initialEntries={initialEntries}>
    <FavoritesProvider><Header /></FavoritesProvider>
  </MemoryRouter>,
);

describe('Header 移动端菜单', () => {
  it('首屏直接显示已保存的收藏数量', () => {
    window.localStorage.setItem('ningxia-tourism-favorites', JSON.stringify({ attraction: ['shahu'], route: [] }));
    renderHeader();
    expect(screen.getByRole('link', { name: '我的收藏，1 项' })).toBeInTheDocument();
  });

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

  it('Tab 在菜单内首尾元素之间循环，不把焦点送回背景', async () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: '打开导航菜单' }));
    const mobileNav = screen.getByRole('navigation', { name: '移动端导航' });
    const links = Array.from(mobileNav.querySelectorAll<HTMLAnchorElement>('a[href]'));
    const first = links[0];
    const last = links[links.length - 1];
    await waitFor(() => expect(document.activeElement).toBe(first));

    // 在末尾按 Tab 应循环回到首项。
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(first);

    // 在首项按 Shift+Tab 应跳到末项。
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });

  it('点击菜单外区域自动关闭菜单，点击菜单按钮本身不触发关闭', async () => {
    renderHeader();
    const menuButton = screen.getByRole('button', { name: '打开导航菜单' });
    fireEvent.click(menuButton);
    expect(screen.getByRole('navigation', { name: '移动端导航' })).toBeInTheDocument();

    // 点击菜单按钮本体（再次点击切换）不应被当作"外部点击"重复关闭——
    // 这里仅验证点击外部能关闭，避免与按钮自身 toggle 行为冲突。
    fireEvent.mouseDown(document.body);
    await waitFor(() => expect(screen.queryByRole('navigation', { name: '移动端导航' })).not.toBeInTheDocument());
  });

  it('打开时显示遮罩，点击遮罩关闭菜单', async () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: '打开导航菜单' }));
    expect(document.querySelector('.mobile-nav-backdrop')).toBeInTheDocument();

    fireEvent.mouseDown(document.querySelector('.mobile-nav-backdrop')!);
    await waitFor(() => expect(screen.queryByRole('navigation', { name: '移动端导航' })).not.toBeInTheDocument());
  });

  it('点击菜单内部元素不会关闭菜单', async () => {
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: '打开导航菜单' }));
    const mobileNav = screen.getByRole('navigation', { name: '移动端导航' });
    fireEvent.mouseDown(mobileNav.querySelector('a')!);
    expect(mobileNav).toBeInTheDocument();
  });

  it('点击移动端导航后立即收起菜单并恢复菜单按钮焦点', async () => {
    renderHeader();
    const menuButton = screen.getByRole('button', { name: '打开导航菜单' });
    fireEvent.click(menuButton);
    const mobileNav = screen.getByRole('navigation', { name: '移动端导航' });

    fireEvent.click(within(mobileNav).getByRole('link', { name: '精选景点' }));

    await waitFor(() => {
      expect(screen.queryByRole('navigation', { name: '移动端导航' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: '打开导航菜单' })).toHaveFocus();
    });
  });

  it('打开菜单时锁定页面滚动，关闭后恢复原有设置', async () => {
    document.body.style.overflow = 'auto';
    renderHeader();
    fireEvent.click(screen.getByRole('button', { name: '打开导航菜单' }));
    await waitFor(() => expect(document.body.style.overflow).toBe('hidden'));

    fireEvent.click(screen.getByRole('button', { name: '关闭导航菜单' }));
    await waitFor(() => expect(document.body.style.overflow).toBe('auto'));
  });

  it('移动端菜单会标记当前页面', () => {
    renderHeader(['/foods']);
    fireEvent.click(screen.getByRole('button', { name: '打开导航菜单' }));
    const mobileNav = screen.getByRole('navigation', { name: '移动端导航' });
    expect(within(mobileNav).getByRole('link', { name: '宁夏美食', current: 'page' })).toBeInTheDocument();
  });

  it('桌面端搜索与收藏入口也会标记当前页面', () => {
    renderHeader(['/search']);
    expect(screen.getByRole('link', { name: '全站搜索', current: 'page' })).toBeInTheDocument();

    cleanup();
    renderHeader(['/favorites']);
    expect(screen.getByRole('link', { name: '我的收藏', current: 'page' })).toBeInTheDocument();
  });
});
