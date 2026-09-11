import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../content/journal', async () => {
  const actual = await vi.importActual<typeof import('../content/journal')>('../content/journal');
  const source = actual.publishedJournalEntries.find((entry) => entry.type === 'guide');
  if (!source) throw new Error('测试需要至少一篇公开旅行专题');
  return {
    ...actual,
    getJournalEntry: () => ({
      ...source,
      gallery: [
        { src: 'images/attractions/shahu.webp', alt: '画廊第一张图', credit: '测试来源', license: 'CC BY 4.0', sourceUrl: 'https://example.com/one' },
        { src: 'images/attractions/xixia.webp', alt: '画廊第二张图', credit: '测试来源', license: 'CC BY 4.0', sourceUrl: 'https://example.com/two' },
      ],
    }),
    isPublishedJournalEntry: () => true,
  };
});

import JournalDetail from './JournalDetail';

afterEach(() => cleanup());

describe('JournalDetail 图片画廊', () => {
  it('为画廊卡片写入交错落笔顺序与轻微手账倾角', () => {
    render(
      <MemoryRouter initialEntries={['/journal/guide/gallery-motion']}>
        <Routes><Route path="/journal/:type/:slug" element={<JournalDetail />} /></Routes>
      </MemoryRouter>,
    );

    const figures = document.querySelectorAll<HTMLElement>('.journal-gallery figure');
    expect(figures).toHaveLength(2);
    expect(screen.getByRole('img', { name: '画廊第一张图' })).toBeInTheDocument();
    expect(figures[0].style.getPropertyValue('--journal-gallery-index')).toBe('0');
    expect(figures[0].style.getPropertyValue('--journal-gallery-tilt')).toBe('-1deg');
    expect(figures[1].style.getPropertyValue('--journal-gallery-index')).toBe('1');
    expect(figures[1].style.getPropertyValue('--journal-gallery-tilt')).toBe('1deg');
  });
});
