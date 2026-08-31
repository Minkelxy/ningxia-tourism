import { fireEvent, render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Food } from '../../types';
import FoodLayer from './FoodLayer';
import { createProjection } from './projection';

const project = createProjection({ minLng: 104, maxLng: 108, minLat: 35, maxLat: 40 }, 720, 920, 20);

const food: Food = {
  id: 'test-food',
  status: 'published',
  verificationLevel: 'review',
  name: '测试美食',
  category: 'snack',
  description: '用于测试地图图层语义。',
  origin: '宁夏',
  restaurants: [{ name: '测试餐厅', cityId: 'yinchuan', coordinates: { lng: 106, lat: 38 } }],
  image: { src: 'images/foods/test.webp', alt: '测试美食参考图', credit: '测试', license: '测试', sourceUrl: 'https://example.com' },
  sources: [],
  verifiedAt: '2026-08-17',
};

describe('FoodLayer', () => {
  it('纯展示模式不进入 Tab 顺序，也不伪装成可点击点位', () => {
    const { container } = render(<svg><FoodLayer foods={[food]} project={project} /></svg>);
    const marker = container.querySelector('.map-food');
    expect(marker).toHaveAttribute('role', 'img');
    expect(marker).not.toHaveAttribute('tabindex');
    expect(marker).not.toHaveClass('map-food--interactive');
  });

  it('交互模式保留按钮语义并支持键盘激活', () => {
    const onSelect = vi.fn();
    const { container } = render(<svg><FoodLayer foods={[food]} project={project} onSelect={onSelect} /></svg>);
    const marker = container.querySelector('.map-food');
    expect(marker).toHaveAttribute('role', 'button');
    expect(marker).toHaveAttribute('tabindex', '0');
    expect(marker).toHaveClass('map-food--interactive');

    fireEvent.keyDown(marker!, { key: 'Enter' });
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
