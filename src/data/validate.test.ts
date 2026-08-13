import { describe, expect, it } from 'vitest';
import { attractions, publishedAttractions } from './attractions';
import { cities } from './cities';
import { routes } from './routes';
import { validateContentData } from './validate';

describe('公开内容数据', () => {
  it('通过完整性和引用校验', () => {
    expect(validateContentData()).toEqual([]);
  });

  it('保持首期公开内容数量稳定', () => {
    expect(cities).toHaveLength(5);
    expect(publishedAttractions).toHaveLength(12);
    expect(attractions.filter((item) => item.status === 'draft')).toHaveLength(10);
    expect(routes).toHaveLength(7);
  });
});
