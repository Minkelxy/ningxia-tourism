import { act, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { RouteAnnouncer } from './App';

function QueryChanger() {
  const navigate = useNavigate();
  return <button type="button" onClick={() => navigate('/search?q=沙漠')}>更新搜索条件</button>;
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
