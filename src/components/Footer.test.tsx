import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import Footer from './Footer';

afterEach(cleanup);

describe('Footer 导航', () => {
  it('继续探索与主导航保持一致并包含宁夏美食入口', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);

    const exploreNav = screen.getByRole('navigation', { name: '继续探索' });
    expect(within(exploreNav).getByRole('link', { name: '精选景点' })).toHaveAttribute('href', '/attractions');
    expect(within(exploreNav).getByRole('link', { name: '宁夏美食' })).toHaveAttribute('href', '/foods');
    expect(within(exploreNav).getByRole('link', { name: '五城概览' })).toHaveAttribute('href', '/cities');
  });

  it('资料说明保留方法页与建议入口', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);

    const resourceNav = screen.getByRole('navigation', { name: '资料说明' });
    expect(within(resourceNav).getByRole('link', { name: /数据方法与免责声明/ })).toHaveAttribute('href', '/about');
    expect(within(resourceNav).getByRole('link', { name: /提交建议/ })).toHaveAttribute('href', 'https://github.com/Minkelxy/ningxia-tourism/issues');
  });
});
