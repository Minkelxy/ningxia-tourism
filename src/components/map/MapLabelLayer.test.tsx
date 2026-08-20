import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import MapLabelLayer from './MapLabelLayer';
import { createProjection, type GeoFeature } from './projection';

const makeFeature = (overrides: Partial<GeoFeature['properties']> = {}): GeoFeature => ({
  type: 'Feature',
  properties: {
    name: '测试区',
    fullname: '测试区域',
    code: '640000',
    adcode: 640000,
    center: [106, 38],
    ...overrides,
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[[105, 37], [107, 37], [107, 39], [105, 39], [105, 37]]],
  },
});

const makeProject = () =>
  createProjection({ minLng: 104, maxLng: 108, minLat: 35, maxLat: 40 }, 720, 920, 20);

describe('MapLabelLayer（Task 2 / TR-2.1 ~ TR-2.3）', () => {
  it('TR-2.1: 传入 5 个省级 feature 渲染出 5 组 <g class="map-label">', () => {
    const features: GeoFeature[] = Array.from({ length: 5 }, (_, i) =>
      makeFeature({
        fullname: ['银川市', '石嘴山市', '吴忠市', '固原市', '中卫市'][i],
        code: `640${i + 1}00`,
        center: [105 + i * 0.5, 36 + i * 0.6],
      }),
    );
    const { container } = render(
      <svg>
        <MapLabelLayer features={features} project={makeProject()} cityDetail={false} />
      </svg>,
    );
    const labels = container.querySelectorAll('g.map-label');
    expect(labels).toHaveLength(5);
    // 每个 label 有 1 份 .map-label__text 主文本（halo 是描边副本不算），共 5 份含"市"
    const mainTexts = container.querySelectorAll('text.map-label__text');
    expect(mainTexts).toHaveLength(5);
    expect([...mainTexts].filter((t) => /市$/.test(t.textContent?.trim() ?? ''))).toHaveLength(5);
  });

  it('TR-2.2: 所有 label 根元素都设置了 pointer-events="none"', () => {
    const features = [
      makeFeature({ fullname: '兴庆区', code: '640104', centroid: [106.28, 38.47] }),
      makeFeature({ fullname: '西夏区', code: '640105', centroid: [106.1, 38.5] }),
    ];
    const { container } = render(
      <svg>
        <MapLabelLayer features={features} project={makeProject()} cityDetail />
      </svg>,
    );
    const labels = container.querySelectorAll('g.map-label');
    expect(labels.length).toBeGreaterThan(0);
    labels.forEach((g) => {
      expect(g.getAttribute('pointer-events')).toBe('none');
    });
  });

  it('TR-2.3: focusedFeatureCode 匹配时，对应 label classList 包含 is-focused', () => {
    const features = [
      makeFeature({ fullname: '兴庆区', code: '640104', centroid: [106.28, 38.47] }),
      makeFeature({ fullname: '西夏区', code: '640105', centroid: [106.1, 38.5] }),
    ];
    const { container, rerender } = render(
      <svg>
        <MapLabelLayer
          features={features}
          project={makeProject()}
          cityDetail
          focusedFeatureCode="640104"
        />
      </svg>,
    );
    const focused = container.querySelector('g.map-label.is-focused');
    expect(focused).not.toBeNull();
    // 文本内容为兴庆区
    expect(focused?.textContent?.trim()).toContain('兴庆区');
    // 另一个不应该有 is-focused
    const other = container.querySelectorAll('g.map-label')[1];
    expect(other.classList.contains('is-focused')).toBe(false);

    // 切换焦点后更新
    rerender(
      <svg>
        <MapLabelLayer
          features={features}
          project={makeProject()}
          cityDetail
          focusedFeatureCode="640105"
        />
      </svg>,
    );
    const labels = container.querySelectorAll('g.map-label');
    expect(labels[0].classList.contains('is-focused')).toBe(false);
    expect(labels[1].classList.contains('is-focused')).toBe(true);
  });
});
