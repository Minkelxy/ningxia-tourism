import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useMapViewport from './useMapViewport';

describe('useMapViewport', () => {
  it('初始状态 zoom=1, pan={x:0,y:0}', () => {
    const { result } = renderHook(() => useMapViewport());
    expect(result.current.zoom).toBe(1);
    expect(result.current.pan).toEqual({ x: 0, y: 0 });
    expect(result.current.isDragging).toBe(false);
  });

  it('拖拽期间标记即时跟手状态，结束后恢复过渡状态', () => {
    const { result } = renderHook(() => useMapViewport());
    const target = { setPointerCapture: vi.fn() } as unknown as SVGSVGElement;
    const down = { button: 0, pointerId: 7, clientX: 10, clientY: 20, currentTarget: target, target } as unknown as React.PointerEvent<SVGSVGElement>;
    act(() => result.current.viewportHandlers.onPointerDown(down));
    expect(result.current.isDragging).toBe(true);
    act(() => result.current.viewportHandlers.onPointerUp());
    expect(result.current.isDragging).toBe(false);
  });

  it('zoomIn 递增并上限 2.4', () => {
    const { result } = renderHook(() => useMapViewport());
    act(() => result.current.zoomIn());
    expect(result.current.zoom).toBe(1.25);
    // 连续放大到上限
    act(() => { result.current.zoomIn(); result.current.zoomIn(); result.current.zoomIn(); result.current.zoomIn(); result.current.zoomIn(); });
    expect(result.current.zoom).toBe(2.4);
  });

  it('zoomOut 递减并下限 1', () => {
    const { result } = renderHook(() => useMapViewport());
    act(() => result.current.zoomIn());
    act(() => result.current.zoomOut());
    expect(result.current.zoom).toBe(1);
    // 不能低于 1
    act(() => result.current.zoomOut());
    expect(result.current.zoom).toBe(1);
  });

  it('resetViewport 恢复初始值', () => {
    const { result } = renderHook(() => useMapViewport());
    act(() => { result.current.zoomIn(); });
    act(() => { result.current.resetViewport(); });
    expect(result.current.zoom).toBe(1);
    expect(result.current.pan).toEqual({ x: 0, y: 0 });
  });

  it('onKeyDown + 键放大地图', () => {
    const { result } = renderHook(() => useMapViewport());
    const handler = result.current.viewportHandlers.onKeyDown;
    const preventDefault = vi.fn();
    // 模拟焦点不在按钮上
    const event = { key: '+', preventDefault, target: document.createElement('div') } as unknown as React.KeyboardEvent<SVGSVGElement>;
    act(() => handler(event));
    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.zoom).toBe(1.25);
  });

  it('onKeyDown - 键缩小地图', () => {
    const { result } = renderHook(() => useMapViewport());
    act(() => result.current.zoomIn());
    const handler = result.current.viewportHandlers.onKeyDown;
    const preventDefault = vi.fn();
    const event = { key: '-', preventDefault, target: document.createElement('div') } as unknown as React.KeyboardEvent<SVGSVGElement>;
    act(() => handler(event));
    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.zoom).toBe(1);
  });

  it('onKeyDown 0 键重置视口', () => {
    const { result } = renderHook(() => useMapViewport());
    act(() => result.current.zoomIn());
    const handler = result.current.viewportHandlers.onKeyDown;
    const preventDefault = vi.fn();
    const event = { key: '0', preventDefault, target: document.createElement('div') } as unknown as React.KeyboardEvent<SVGSVGElement>;
    act(() => handler(event));
    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.zoom).toBe(1);
  });

  it('onKeyDown 在焦点位于按钮上时不响应', () => {
    const { result } = renderHook(() => useMapViewport());
    const handler = result.current.viewportHandlers.onKeyDown;
    // 模拟焦点在按钮内
    const button = document.createElement('button');
    button.setAttribute('role', 'button');
    document.body.appendChild(button);
    const event = { key: '+', preventDefault: vi.fn(), target: button } as unknown as React.KeyboardEvent<SVGSVGElement>;
    act(() => handler(event));
    expect(result.current.zoom).toBe(1);
    document.body.removeChild(button);
  });

  it('普通滚轮交给页面，不缩放地图', () => {
    const { result } = renderHook(() => useMapViewport());
    const handler = result.current.viewportHandlers.onWheel;
    const preventDefault = vi.fn();
    const scrollUp = { deltaY: -100, preventDefault, target: document.createElement('div') } as unknown as React.WheelEvent<SVGSVGElement>;
    act(() => handler(scrollUp));
    expect(preventDefault).not.toHaveBeenCalled();
    expect(result.current.zoom).toBe(1);
  });

  it('Ctrl/Cmd + 滚轮缩放地图并阻止页面滚动', () => {
    const { result } = renderHook(() => useMapViewport());
    const handler = result.current.viewportHandlers.onWheel;
    const preventDefault = vi.fn();
    const scrollUp = { deltaY: -100, ctrlKey: true, metaKey: false, preventDefault, target: document.createElement('div') } as unknown as React.WheelEvent<SVGSVGElement>;
    act(() => handler(scrollUp));
    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.zoom).toBeGreaterThan(1);

    const scrollDown = { deltaY: 100, ctrlKey: true, metaKey: false, preventDefault: vi.fn(), target: document.createElement('div') } as unknown as React.WheelEvent<SVGSVGElement>;
    act(() => handler(scrollDown));
    expect(result.current.zoom).toBeLessThanOrEqual(result.current.zoom);
  });

  it('onWheel 缩放限制在 [1, 2.4] 范围内', () => {
    const { result } = renderHook(() => useMapViewport());
    const handler = result.current.viewportHandlers.onWheel;
    // 大幅度向下滚
    for (let i = 0; i < 50; i++) {
      const event = { deltaY: 1000, ctrlKey: true, metaKey: false, preventDefault: vi.fn(), target: document.createElement('div') } as unknown as React.WheelEvent<SVGSVGElement>;
      act(() => handler(event));
    }
    expect(result.current.zoom).toBe(1);
    // 大幅度向上滚
    for (let i = 0; i < 50; i++) {
      const event = { deltaY: -1000, ctrlKey: true, metaKey: false, preventDefault: vi.fn(), target: document.createElement('div') } as unknown as React.WheelEvent<SVGSVGElement>;
      act(() => handler(event));
    }
    expect(result.current.zoom).toBe(2.4);
  });
});
