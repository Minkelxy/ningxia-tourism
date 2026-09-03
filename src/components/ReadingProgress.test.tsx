import { act, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import ReadingProgress from './ReadingProgress';

describe('ReadingProgress', () => {
  it('根据页面滚动位置绘制顶部进度墨线', async () => {
    const originalScrollHeight = Object.getOwnPropertyDescriptor(document.documentElement, 'scrollHeight');
    const originalInnerHeight = Object.getOwnPropertyDescriptor(window, 'innerHeight');
    const originalScrollY = Object.getOwnPropertyDescriptor(window, 'scrollY');
    const frame = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) =>
      window.setTimeout(() => callback(performance.now()), 0));
    const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 1200 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 600 });
    Object.defineProperty(window, 'scrollY', { configurable: true, value: 300, writable: true });

    const { container } = render(<MemoryRouter><ReadingProgress /></MemoryRouter>);
    await waitFor(() => expect(container.querySelector('.reading-progress')).toHaveClass('is-started'));
    expect(container.querySelector<HTMLElement>('.reading-progress')?.style.getPropertyValue('--reading-progress')).toBe('0.5');
    expect(container.querySelector('.reading-progress__ink')).toBeInTheDocument();
    expect(container.querySelector('.reading-progress__head')).toBeInTheDocument();

    await act(async () => {
      window.scrollY = 600;
      window.dispatchEvent(new Event('scroll'));
    });
    await waitFor(() => expect(container.querySelector<HTMLElement>('.reading-progress')?.style.getPropertyValue('--reading-progress')).toBe('1'));

    frame.mockRestore();
    cancel.mockRestore();
    if (originalScrollHeight) Object.defineProperty(document.documentElement, 'scrollHeight', originalScrollHeight);
    if (originalInnerHeight) Object.defineProperty(window, 'innerHeight', originalInnerHeight);
    if (originalScrollY) Object.defineProperty(window, 'scrollY', originalScrollY);
  });
});
