import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { RouteAnnouncer, RouteFocusManager } from './App';

function QueryChanger() {
  const navigate = useNavigate();
  return <button type="button" onClick={() => navigate('/search?q=沙漠')}>更新搜索条件</button>;
}

function PathChanger() {
  const navigate = useNavigate();
  return <button type="button" onClick={() => navigate('/attractions')}>打开景点页</button>;
}

describe('RouteAnnouncer', () => {
  it('同一路径的搜索参数变化也会重新播报页面标题', async () => {
    document.title = '搜索宁夏旅行内容 · 宁夏旅行地图';
    render(
      <MemoryRouter initialEntries={['/search']}>
        <RouteAnnouncer />
        <QueryChanger />
      </MemoryRouter>,
    );

    const announcer = () => document.querySelector('[aria-live="polite"]');
    await waitFor(() => expect(announcer()).toHaveTextContent(document.title));
    await act(async () => { screen.getByRole('button', { name: '更新搜索条件' }).click(); });
    await waitFor(() => expect(announcer()).toHaveTextContent(document.title));
  });
});

describe('RouteFocusManager', () => {
  it('页面路径变化后聚焦主要内容，但保留移动菜单按钮焦点', async () => {
    render(
      <MemoryRouter initialEntries={['/search']}>
        <RouteFocusManager />
        <main id="main-content" tabIndex={-1}>主要内容</main>
        <PathChanger />
      </MemoryRouter>,
    );

    await act(async () => { screen.getByRole('button', { name: '打开景点页' }).click(); });
    expect(document.activeElement).toBe(document.getElementById('main-content'));

    render(
      <MemoryRouter initialEntries={['/search']}>
        <RouteFocusManager />
        <main id="main-content" tabIndex={-1}>主要内容</main>
        <button className="mobile-menu-button" type="button" onClick={() => {}}>菜单</button>
        <PathChanger />
      </MemoryRouter>,
    );

    const menuButton = document.querySelector<HTMLButtonElement>('.mobile-menu-button');
    menuButton?.focus();
    await act(async () => { screen.getAllByRole('button', { name: '打开景点页' })[1].click(); });
    expect(document.activeElement).toBe(menuButton);
  });
});
