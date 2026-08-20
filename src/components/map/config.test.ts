import { describe, expect, it } from 'vitest';
import { buildDistrictColorMap, getDistrictColors, hexToHsl, hslToHex } from './config';

describe('HSL 颜色工具', () => {
  it('hexToHsl 与 hslToHex 往返转换不丢失色相信息', () => {
    const hexes = ['#c89d4d', '#6f9b7d', '#d17c58', '#718b69', '#b98656', '#ffffff', '#000000'];
    for (const hex of hexes) {
      expect(hslToHex(hexToHsl(hex))).toBe(hex.toLowerCase());
    }
  });

  it('银川主色 #c89d4d 色相落在棕色区间 [30, 50]', () => {
    const hsl = hexToHsl('#c89d4d');
    expect(hsl.h).toBeGreaterThanOrEqual(30);
    expect(hsl.h).toBeLessThanOrEqual(50);
  });
});

describe('getDistrictColors 区县颜色派生（AC-6 / TR-1.1 ~ TR-1.3）', () => {
  it('连续 100 次调用返回完全一致的结果（确定性）', () => {
    const first = getDistrictColors('yinchuan', 6);
    for (let i = 0; i < 100; i++) {
      expect(getDistrictColors('yinchuan', 6)).toStrictEqual(first);
    }
  });

  it('对 5 个市分别调用，返回数组长度严格等于入参 count', () => {
    (['yinchuan', 'shizuishan', 'wuzhong', 'guyuan', 'zhongwei'] as const).forEach((id) => {
      [1, 2, 3, 4, 5, 6].forEach((count) => {
        expect(getDistrictColors(id, count)).toHaveLength(count);
      });
    });
    expect(getDistrictColors('yinchuan', 0)).toStrictEqual([]);
  });

  it('银川派生的 6 个区县色，HSL 色相全部 ∈ [30, 50]（保持黄棕色系）', () => {
    const colors = getDistrictColors('yinchuan', 6);
    // 确保互不相同
    expect(new Set(colors).size).toBe(6);
    colors.forEach((hex) => {
      const { h } = hexToHsl(hex);
      expect(h).toBeGreaterThanOrEqual(30);
      expect(h).toBeLessThanOrEqual(50);
    });
  });

  it('buildDistrictColorMap 按入参顺序建立 code→颜色映射', () => {
    const map = buildDistrictColorMap('yinchuan', [
      { code: '640104', index: 0 },
      { code: '640105', index: 1 },
      { code: '640106', index: 2 },
    ]);
    expect(Object.keys(map)).toStrictEqual(['640104', '640105', '640106']);
    // 三个颜色互不相同
    expect(new Set(Object.values(map)).size).toBe(3);
  });
});
