import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loading from './Loading';

describe('Loading', () => {
  it('使用统一品牌印章并提供加载状态语义', () => {
    render(<Loading />);

    expect(screen.getByRole('status', { name: '页面加载中' })).toHaveTextContent('正在整理下一段旅程');
    expect(document.querySelector('.loading-mark')).toBeInTheDocument();
    expect(screen.getByRole('status')).toContainElement(document.querySelector('.loading-mark'));
  });
});
