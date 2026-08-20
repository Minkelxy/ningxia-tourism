import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SEO from './SEO';

const ORIGIN = window.location.origin;
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const siteUrl = (path: string) => `${ORIGIN}${BASE}${path}`;

afterEach(() => {
  cleanup();
  document.head.querySelectorAll('[data-seo-test]').forEach((element) => element.remove());
  // 清理 SEO 注入的元素，保证测试间隔离。
  ['#site-structured-data', 'link[rel="canonical"]'].forEach((sel) => document.head.querySelector(sel)?.remove());
  ['description', 'robots', 'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt'].forEach((name) => document.head.querySelector(`meta[name="${name}"]`)?.remove());
  ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'og:image:alt', 'article:published_time', 'article:modified_time', 'article:author'].forEach((prop) => document.head.querySelector(`meta[property="${prop}"]`)?.remove());
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

  it('默认参数写入文档标题、canonical、description 与 og/twitter 元数据', async () => {
    render(<MemoryRouter initialEntries={['/attractions']}><SEO /></MemoryRouter>);
    await waitFor(() => expect(document.title).toBe('塞上江南 · 宁夏旅行地图'));
    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute('content', expect.stringContaining('宁夏'));
    expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute('content', 'index,follow');
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    expect(canonical?.href).toBe(siteUrl('/attractions'));
    // og:*
    expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute('content', '塞上江南 · 宁夏旅行地图');
    expect(document.head.querySelector('meta[property="og:url"]')).toHaveAttribute('content', siteUrl('/attractions'));
    expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute('content', siteUrl('/og.jpg'));
    // twitter:*
    expect(document.head.querySelector('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    expect(document.head.querySelector('meta[name="twitter:title"]')).toHaveAttribute('content', '塞上江南 · 宁夏旅行地图');
  });

  it('自定义图片与图片替代文字覆盖默认 og/twitter 引用', async () => {
    render(
      <MemoryRouter initialEntries={['/attraction/shahu']}>
        <SEO title="沙湖" description="沙漠与湖水" image="attractions/shahu.webp" imageAlt="沙湖生态旅游区" />
      </MemoryRouter>,
    );
    await waitFor(() => expect(document.title).toBe('沙湖'));
    expect(document.head.querySelector('meta[property="og:image"]')).toHaveAttribute('content', siteUrl('/attractions/shahu.webp'));
    expect(document.head.querySelector('meta[property="og:image:alt"]')).toHaveAttribute('content', '沙湖生态旅游区');
    expect(document.head.querySelector('meta[name="twitter:image"]')).toHaveAttribute('content', siteUrl('/attractions/shahu.webp'));
  });

  it('从文章切换为普通网页时清除 article:* 元数据与结构化数据', async () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={['/journal/travel/real-note']}>
        <SEO title="真实" description="d" type="article" publishedAt="2026-08-10" updatedAt="2026-08-11" author="站主" />
      </MemoryRouter>,
    );
    await waitFor(() => expect(document.head.querySelector('#site-structured-data')).not.toBeNull());
    expect(document.head.querySelector('meta[property="article:published_time"]')).not.toBeNull();

    rerender(
      <MemoryRouter initialEntries={['/']}>
        <SEO title="首页" description="d" />
      </MemoryRouter>,
    );
    await waitFor(() => expect(document.title).toBe('首页'));
    expect(document.head.querySelector('#site-structured-data')).toBeNull();
    expect(document.head.querySelector('meta[property="article:published_time"]')).toBeNull();
    expect(document.head.querySelector('meta[property="article:author"]')).toBeNull();
  });
});
