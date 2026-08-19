import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import NetworkStatus from './NetworkStatus';

const originalOnline = navigator.onLine;

afterEach(() => {
  Object.defineProperty(navigator, 'onLine', { configurable: true, value: originalOnline });
});

describe('NetworkStatus', () => {
  it('在线时不占用页面空间', () => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: true });
    render(<NetworkStatus />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('离线时提示缓存内容的适用边界', () => {
    Object.defineProperty(navigator, 'onLine', { configurable: true, value: false });
    render(<NetworkStatus />);
    expect(screen.getByRole('status')).toHaveTextContent('当前处于离线状态');
    expect(screen.getByRole('status')).toHaveTextContent('票价、班次和开放安排');
  });
});
