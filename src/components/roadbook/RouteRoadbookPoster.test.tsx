import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getRouteById } from '../../data/routes';
import { buildRoadbookModel, wrapText } from '../../lib/roadbook';
import RouteRoadbookPoster from './RouteRoadbookPoster';

const classic = buildRoadbookModel(getRouteById('classic-3day')!);
const panorama = buildRoadbookModel(getRouteById('panorama-5day')!);

const viewBoxHeight = (container: HTMLElement) => {
  const viewBox = container.querySelector('svg')?.getAttribute('viewBox') ?? '';
  return Number(viewBox.split(/\s+/)[3]);
};

describe('路书海报', () => {
  it('画出路线标题、每天标题与全部停靠点编号', () => {
    const { container } = render(<RouteRoadbookPoster model={classic} />);
    const text = container.textContent ?? '';
    expect(text).toContain('经典三日全景游');
    for (const day of classic.days) expect(text).toContain(day.title);
    for (const node of classic.nodes) expect(text).toContain(node.title);
    expect(text).toContain('路线校订：');
    expect(text).toContain('D01');
    expect(text).toContain('D03');
  });

  it('不包含任何位图，避免污染 canvas 导致导出失败', () => {
    const { container } = render(<RouteRoadbookPoster model={classic} />);
    expect(container.querySelectorAll('image')).toHaveLength(0);
    expect(container.querySelectorAll('foreignObject')).toHaveLength(0);
  });

  it('不挂任何 CSS 类或动画，保证序列化后样式不丢、线条不被截断', () => {
    const { container } = render(<RouteRoadbookPoster model={classic} />);
    // 序列化后的 SVG 独立渲染，类名与 CSS 变量都不会生效，因此海报里不该出现 class。
    expect(container.querySelectorAll('[class]')).toHaveLength(0);
    expect(container.querySelectorAll('[style*="animation"]')).toHaveLength(0);
    expect(container.querySelectorAll('[stroke-dashoffset]')).toHaveLength(0);
  });

  it('高度随天数增长，长路线不会被裁掉', () => {
    const short = render(<RouteRoadbookPoster model={classic} />);
    const long = render(<RouteRoadbookPoster model={panorama} />);
    expect(viewBoxHeight(long.container)).toBeGreaterThan(viewBoxHeight(short.container));
  });

  it('无省界要素时只画路线本身，海报仍然可用', () => {
    const { container } = render(<RouteRoadbookPoster model={classic} features={[]} />);
    // classic-3day 只有两天各有 2 个可定位点，能连成线；第一天是单点，只画点。
    expect(container.querySelectorAll('path')).toHaveLength(2);
    const mapPanel = container.querySelector('[clip-path]');
    expect(mapPanel?.querySelectorAll('circle')).toHaveLength(classic.geocodedNodes.length);
  });
});

describe('海报折行', () => {
  it('按字宽切分中英混排，且不丢字', () => {
    const lines = wrapText('贺兰山与黄河之间的三日环线，含沙坡头与西夏陵。', 8);
    expect(lines.length).toBeGreaterThan(1);
    expect(lines.every((line) => line.length <= 8)).toBe(true);
    expect(lines.join('')).toBe('贺兰山与黄河之间的三日环线，含沙坡头与西夏陵。');
  });

  it('西文数字按半个字宽计算，短文本保持单行', () => {
    expect(wrapText('classic-3day', 20)).toEqual(['classic-3day']);
    expect(wrapText('', 10)).toEqual(['']);
  });
});
