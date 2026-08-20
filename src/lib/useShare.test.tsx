import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import useShare from './useShare';

vi.mock('./site', () => ({
  sharePage: vi.fn(),
}));

// 在测试文件内动态导入，确保拿到被 mock 的模块实例。
import { sharePage } from './site';
const mockSharePage = vi.mocked(sharePage);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});

function Harness() {
  const { shareStatus, handleShare, ShareToast } = useShare('测试标题', '测试文案');
  return (
    <>
      <span data-testid="status">{shareStatus}</span>
      <div data-testid="toast-host">{ShareToast}</div>
      <button type="button" onClick={handleShare}>分享</button>
    </>
  );
}

describe('useShare', () => {
  it('成功分享时展示 sharePage 返回的成功信息', async () => {
    mockSharePage.mockResolvedValue('链接已复制');
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: '分享' }));
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('链接已复制'));
    expect(screen.getByRole('status')).toHaveTextContent('链接已复制');
  });

  it('用户取消分享（AbortError）提示已取消', async () => {
    mockSharePage.mockRejectedValue(new DOMException('user cancelled', 'AbortError'));
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: '分享' }));
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('分享已取消'));
  });

  it('非取消类异常提示分享失败，避免误导为已取消', async () => {
    mockSharePage.mockRejectedValue(new DOMException('not allowed', 'NotAllowedError'));
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: '分享' }));
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('分享失败，请稍后重试'));
  });

  it('Toast 在超时后自动清空', async () => {
    vi.useFakeTimers();
    mockSharePage.mockResolvedValue('链接已复制');
    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: '分享' }));

    await act(async () => {
      // 让微任务（mockSharePage 的 Promise）落地。
      await Promise.resolve();
    });
    expect(screen.getByTestId('status').textContent).toBe('链接已复制');

    act(() => {
      vi.advanceTimersByTime(2400);
    });
    expect(screen.getByTestId('status').textContent).toBe('');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('连续调用分享会重置上一次的清空计时', async () => {
    vi.useFakeTimers();
    mockSharePage.mockResolvedValueOnce('链接已复制');
    mockSharePage.mockResolvedValueOnce('已打开系统分享');
    render(<Harness />);

    fireEvent.click(screen.getByRole('button', { name: '分享' }));
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByTestId('status').textContent).toBe('链接已复制');

    act(() => { vi.advanceTimersByTime(2000); });
    // 还未到 2400ms，但再次触发分享，应取消上一次计时并展示新状态。
    fireEvent.click(screen.getByRole('button', { name: '分享' }));
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByTestId('status').textContent).toBe('已打开系统分享');

    // 再走 2000ms（共 4000ms 距上次首次、2000ms 距第二次）不应清空。
    act(() => { vi.advanceTimersByTime(2000); });
    expect(screen.getByTestId('status').textContent).toBe('已打开系统分享');

    // 第二次计时满 2400ms 后清空。
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.getByTestId('status').textContent).toBe('');
  });
});
