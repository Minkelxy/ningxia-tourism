import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SEO from './SEO';

afterEach(() => {
  cleanup();
  document.head.querySelectorAll('[data-seo-test]').forEach((element) => element.remove());
});

describe('SEO', () => {
  it('为公开文章生成时间元数据和 Article 结构化数据', async () => {
    render(
      <MemoryRouter initialEntries={['/journal/travel/real-note']}>
        <SEO
          title="一次真实旅行"
          description="真实记录"
          type="article"
          publishedAt="2026-08-10"
          updatedAt="2026-08-12"
          author="站主手记"
        />
      </MemoryRouter>,
    );

    await waitFor(() => expect(document.head.querySelector('#site-structured-data')).not.toBeNull());
    expect(document.head.querySelector('meta[property="article:published_time"]')).toHaveAttribute('content', '2026-08-10');
    expect(JSON.parse(document.head.querySelector('#site-structured-data')?.textContent || '{}')).toMatchObject({
      '@type': 'Article',
      headline: '一次真实旅行',
      dateModified: '2026-08-12',
    });
  });

  it('不会为 noindex 页面保留文章结构化数据', async () => {
    render(
      <MemoryRouter initialEntries={['/journal/travel/draft']}>
        <SEO title="整理中" description="尚未发布" type="article" publishedAt="2026-08-10" updatedAt="2026-08-10" noIndex />
      </MemoryRouter>,
    );

    await waitFor(() => expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'noindex,nofollow'));
    expect(document.head.querySelector('#site-structured-data')).toBeNull();
  });
});
