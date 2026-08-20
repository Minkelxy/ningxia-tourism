import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const bomb = (message = '测试崩溃'): { Component: React.FC; spy: ReturnType<typeof vi.fn> } => {
  const spy = vi.fn();
  const Boom: React.FC = () => { spy(); throw new Error(message); };
  return { Component: Boom, spy };
};

function renderBoundary(children: React.ReactNode) {
  return render(<BrowserRouter><ErrorBoundary>{children}</ErrorBoundary></BrowserRouter>);
}

describe('ErrorBoundary', () => {
  it('正常子树时透传渲染并保持 children 原貌', () => {
    renderBoundary(<p data-testid="ok">正常内容</p>);
    expect(screen.getByTestId('ok')).toBeInTheDocument();
  });

  it('子组件抛错时进入错误态并展示可恢复的提示与操作', () => {
    const { Component } = bomb('渲染失败');
    // 抑制控制台噪声（React 18 会向 console.error 打印错误堆栈）
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderBoundary(<Component />);
    expect(screen.getByRole('alert')).toHaveTextContent('页面暂时没有打开');
    expect(screen.getByRole('button', { name: /重新加载/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /返回首页/ })).toBeInTheDocument();
    spy.mockRestore();
  });

  it('捕获错误后调用 componentDidCatch（DEV 下记录错误）', () => {
    const { Component, spy: renderSpy } = bomb('渲染失败');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    renderBoundary(<Component />);
    expect(renderSpy).toHaveBeenCalled();
    // DEV 环境下应至少向 console.error 输出一次错误记录。
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('点击重新加载会刷新当前页面', () => {
    const { Component } = bomb();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload: reloadSpy },
    });
    renderBoundary(<Component />);
    act(() => { screen.getByRole('button', { name: /重新加载/ }).click(); });
    expect(reloadSpy).toHaveBeenCalled();
  });
});
