import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ResponsiveImage from './ResponsiveImage';

describe('ResponsiveImage', () => {
  it('默认延迟加载并提供响应式图片源', () => {
    const { container } = render(<ResponsiveImage src="images/attractions/shahu.webp" alt="沙湖" />);
    const image = screen.getByRole('img', { name: '沙湖' });
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(image.closest('picture')).toContainElement(image);
    expect(container.querySelector('source[type="image/avif"]')).toBeInTheDocument();
  });

  it('允许首屏主图覆盖为立即加载', () => {
    render(<ResponsiveImage src="images/attractions/shahu.webp" alt="沙湖主图" loading="eager" fetchPriority="high" />);
    const image = screen.getByRole('img', { name: '沙湖主图' });
    expect(image).toHaveAttribute('loading', 'eager');
    expect(image).toHaveAttribute('fetchpriority', 'high');
  });
});
