import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Search from './Search';

afterEach(() => cleanup());

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

function renderSearch(initialEntry = '/search') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <LocationProbe />
      <Search />
    </MemoryRouter>,
  );
}

describe('Search', () => {
  it('输入关键词并提交后同步 URL，清空按钮可恢复空搜索', () => {
    renderSearch('/search?q=沙漠');
    const input = screen.getByRole('textbox', { name: '搜索宁夏旅行内容' });

    expect(input).toHaveValue('沙漠');
    expect(input).toHaveAttribute('id', 'site-search-input');
    expect(document.querySelector('label[for="site-search-input"]')).toBeInTheDocument();
    fireEvent.change(input, { target: { value: '银川' } });
    fireEvent.submit(input.closest('form')!);
    expect(screen.getByTestId('location')).toHaveTextContent('/search?q=');
    expect(input).toHaveValue('银川');
    expect(screen.getByRole('button', { name: '清空搜索内容' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '清空搜索内容' }));
    expect(input).toHaveValue('');
    expect(screen.getByTestId('location')).toHaveTextContent('/search');
    expect(screen.queryByRole('button', { name: '清空搜索内容' })).not.toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  it('无关键词时不显示清空按钮', () => {
    renderSearch();
    expect(screen.queryByRole('button', { name: '清空搜索内容' })).not.toBeInTheDocument();
  });
});
