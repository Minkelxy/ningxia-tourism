#!/usr/bin/env python3
"""
GeoJSON 地图可视化脚本
用于显示宁夏旅游项目的 GeoJSON 地图数据
"""

import json
import sys
import os
from pathlib import Path

# 设置无界面后端（在服务器环境使用）
if os.environ.get('DISPLAY') is None or '--no-display' in sys.argv:
    import matplotlib
    matplotlib.use('Agg')  # 使用 Agg 后端，不需要图形界面

import matplotlib.pyplot as plt
from matplotlib.patches import Polygon as MplPolygon
import matplotlib.font_manager as fm
import numpy as np

# 加载中文字体
chinese_font = None
font_paths = [
    '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc',
    '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc',
    '/usr/share/fonts/truetype/noto/NotoSansCJK-Regular.ttc',
    '/usr/share/fonts/opentype/noto/NotoSerifCJK-Regular.ttc',
]

for font_path in font_paths:
    if os.path.exists(font_path):
        try:
            chinese_font = fm.FontProperties(fname=font_path)
            print(f"✅ 已加载中文字体: {font_path}")
            break
        except Exception as e:
            continue

if chinese_font is None:
    print("⚠️ 警告: 未找到中文字体，将使用默认字体")
    chinese_font = fm.FontProperties()


def load_geojson(filepath):
    """加载 GeoJSON 文件"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def extract_coordinates(geometry):
    """从 geometry 中提取坐标"""
    coords = []
    geom_type = geometry.get('type', '')

    if geom_type == 'Polygon':
        # Polygon: coordinates[0] 是外环
        for ring in geometry['coordinates']:
            coords.append([(p[0], p[1]) for p in ring])
    elif geom_type == 'MultiPolygon':
        # MultiPolygon: coordinates 是多层嵌套
        for polygon in geometry['coordinates']:
            for ring in polygon:
                coords.append([(p[0], p[1]) for p in ring])
    elif geom_type == 'Point':
        # Point: 直接返回坐标
        p = geometry['coordinates']
        coords.append([(p[0], p[1])])
    elif geom_type == 'MultiPoint':
        # MultiPoint: 多个点
        for p in geometry['coordinates']:
            coords.append([(p[0], p[1])])

    return coords


def plot_geojson(data, title="GeoJSON Map", show_labels=True, save_path=None):
    """
    绘制 GeoJSON 地图

    Args:
        data: GeoJSON 数据字典
        title: 图表标题
        show_labels: 是否显示标签
        save_path: 保存图片的路径
    """
    fig, ax = plt.subplots(figsize=(14, 10))

    # 颜色映射
    colors = plt.cm.Set3.colors + plt.cm.Pastel1.colors

    # 存储所有坐标用于计算边界
    all_coords = []

    # 检查 GeoJSON 类型
    if data.get('type') == 'FeatureCollection':
        features = data.get('features', [])
    elif data.get('type') == 'Feature':
        features = [data]
    else:
        features = [{'geometry': data, 'properties': {}}]

    for idx, feature in enumerate(features):
        geometry = feature.get('geometry', {})
        properties = feature.get('properties', {})

        if not geometry:
            continue

        # 获取名称
        name = properties.get('NAME') or properties.get('name') or \
               properties.get('fullname') or properties.get('pinyin') or f'Region {idx+1}'

        # 提取坐标
        coord_groups = extract_coordinates(geometry)

        for coords in coord_groups:
            if len(coords) < 3:
                continue

            all_coords.extend(coords)

            # 创建多边形
            polygon = MplPolygon(coords, closed=True,
                                facecolor=colors[idx % len(colors)],
                                edgecolor='#333333',
                                linewidth=1.5,
                                alpha=0.7)
            ax.add_patch(polygon)

            # 计算中心点用于标注
            if show_labels and len(coords) > 0:
                center_x = sum(p[0] for p in coords) / len(coords)
                center_y = sum(p[1] for p in coords) / len(coords)
                ax.annotate(name, (center_x, center_y),
                           ha='center', va='center',
                           fontproperties=chinese_font,
                           fontsize=12,
                           fontweight='bold',
                           color='#333333',
                           bbox=dict(boxstyle='round,pad=0.3',
                                   facecolor='white',
                                   edgecolor='none',
                                   alpha=0.8))

    # 设置坐标轴
    if all_coords:
        x_coords = [p[0] for p in all_coords]
        y_coords = [p[1] for p in all_coords]

        margin_x = (max(x_coords) - min(x_coords)) * 0.05
        margin_y = (max(y_coords) - min(y_coords)) * 0.05

        ax.set_xlim(min(x_coords) - margin_x, max(x_coords) + margin_x)
        ax.set_ylim(min(y_coords) - margin_y, max(y_coords) + margin_y)

    ax.set_aspect('equal')
    ax.set_xlabel('经度', fontproperties=chinese_font, fontsize=11)
    ax.set_ylabel('纬度', fontproperties=chinese_font, fontsize=11)
    ax.set_title(title, fontproperties=chinese_font, fontsize=16, fontweight='bold', pad=15)

    # 添加网格
    ax.grid(True, linestyle='--', alpha=0.5)

    # 移除顶部和右侧边框
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)

    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        print(f"✅ 图片已保存到: {save_path}")

    # 只有在有图形界面时才显示
    if os.environ.get('DISPLAY') is not None and '--no-display' not in sys.argv:
        plt.show()
    else:
        plt.close()


def main():
    """主函数"""
    # 项目目录
    project_dir = Path(__file__).parent

    # 默认的 GeoJSON 文件路径
    default_files = {
        '1': project_dir / 'public' / 'data' / 'ningxia.geojson',
        '2': project_dir / 'public' / 'data' / 'yinchuan.geojson',
        '3': project_dir / 'public' / 'data' / 'shizuishan.geojson',
        '4': project_dir / 'public' / 'data' / 'wuzhong.geojson',
        '5': project_dir / 'public' / 'data' / 'guyuan.geojson',
        '6': project_dir / 'public' / 'data' / 'zhongwei.geojson',
    }

    # 检查命令行参数
    auto_save = '--save' in sys.argv
    no_display = '--no-display' in sys.argv

    # 获取文件参数
    args = [a for a in sys.argv[1:] if not a.startswith('--')]

    if len(args) > 0:
        input_path = args[0]

        # 检查是否是预设选项
        if input_path in default_files:
            filepath = default_files[input_path]
        else:
            filepath = Path(input_path)
    else:
        # 显示菜单
        print("=" * 50)
        print("  GeoJSON 地图可视化工具")
        print("=" * 50)
        print("\n可用的地图文件:")
        print("  1. 宁夏全区 (ningxia.geojson)")
        print("  2. 银川市 (yinchuan.geojson)")
        print("  3. 石嘴山市 (shizuishan.geojson)")
        print("  4. 吴忠市 (wuzhong.geojson)")
        print("  5. 固原市 (guyuan.geojson)")
        print("  6. 中卫市 (zhongwei.geojson)")
        print("\n使用方法:")
        print("  python show_geojson.py <选项编号>")
        print("  python show_geojson.py <文件路径>")
        print("  python show_geojson.py 1 --save       # 直接保存图片")
        print("  python show_geojson.py 1 --no-display # 无图形界面模式")
        print("\n示例:")
        print("  python show_geojson.py 1")
        print("  python show_geojson.py ./data/ningxia.geojson")
        print("=" * 50)

        choice = input("\n请选择要显示的地图 (1-6) 或输入文件路径: ").strip()

        if choice in default_files:
            filepath = default_files[choice]
        else:
            filepath = Path(choice)

        # 询问是否保存
        if not auto_save:
            save_choice = input("是否保存为图片? (y/n, 默认n): ").strip().lower()
            auto_save = save_choice == 'y'

    # 检查文件是否存在
    if not filepath.exists():
        print(f"❌ 错误: 文件不存在 - {filepath}")
        sys.exit(1)

    # 加载并显示
    try:
        print(f"\n正在加载: {filepath}")
        data = load_geojson(filepath)

        # 获取标题
        title = f"GeoJSON 地图 - {filepath.stem}"

        # 确定保存路径
        save_path = None
        if auto_save or no_display:
            save_path = filepath.parent / f"{filepath.stem}_map.png"

        print("正在绘制地图...")
        plot_geojson(data, title=title, save_path=save_path)

        if not save_path:
            print("✅ 地图绘制完成")

    except json.JSONDecodeError as e:
        print(f"❌ 错误: 无法解析 JSON 文件 - {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ 错误: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
