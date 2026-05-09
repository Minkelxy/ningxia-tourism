# 宁夏旅游网站维护指南

本文档提供网站后期维护的详细指南，包括添加景点、修改地图样式等常见操作。

## 目录

- [项目结构](#项目结构)
- [添加新景点](#添加新景点)
- [修改地图颜色](#修改地图颜色)
- [使用主题预设](#使用主题预设)
- [创建自定义主题](#创建自定义主题)
- [常见问题](#常见问题)

---

## 项目结构

```
src/
├── config/
│   └── map-config.ts          # 地图配置和主题定义
├── data/
│   ├── attractions.json        # 景点数据
│   ├── cities.json             # 城市数据
│   └── ningxia-province.json   # 地图地理数据
├── components/
│   └── NingxiaInteractiveMap.tsx  # 交互式地图组件
└── types/
    └── index.ts                # TypeScript 类型定义
```

---

## 添加新景点

### 步骤 1：编辑景点数据

打开 [`src/data/attractions.json`](file:///workspace/src/data/attractions.json)，添加新的景点对象：

```json
{
  "id": "your-attraction-id",
  "name": "景点名称",
  "city": "所属城市",
  "type": "nature|history|religion|experience",
  "coordinates": { "x": 500, "y": 200 },
  "rating": 4.5,
  "description": "景点描述",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "openingHours": "08:00-18:00",
  "ticketPrice": "门票价格",
  "bestSeason": "最佳季节",
  "transportation": "交通信息",
  "highlights": [
    "亮点1",
    "亮点2"
  ],
  "nearbyAttractions": ["nearby-id-1", "nearby-id-2"]
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识符，使用英文小写和连字符 |
| `name` | string | ✅ | 景点中文名称 |
| `city` | string | ✅ | 所属城市名称 |
| `type` | string | ✅ | 景点类型：`nature`(自然风光)、`history`(历史文化)、`religion`(宗教建筑)、`experience`(特色体验) |
| `coordinates` | object | ✅ | 在地图上的位置坐标 `{x, y}` |
| `rating` | number | ✅ | 评分，1-5之间的数字 |
| `description` | string | ✅ | 景点详细介绍 |
| `images` | array | ✅ | 图片URL数组，建议使用 Unsplash 或图床 |
| `highlights` | array | ✅ | 景点亮点列表 |
| `nearbyAttractions` | array | ❌ | 附近景点ID数组 |

### 步骤 2：设置地图坐标

地图坐标系统基于 SVG viewBox (900x1944)：

- `x` 范围：0-900（从左到右）
- `y` 范围：0-1944（从上到下）

参考现有景点的坐标来放置新景点：
- 石嘴山（沙湖）：x=680, y=60
- 银川（西夏王陵）：x=550, y=140
- 中卫（沙坡头）：x=180, y=320
- 固原（六盘山）：x=560, y=480

---

## 修改地图颜色

### 方法一：使用预设主题（推荐）

在 [`src/config/map-config.ts`](file:///workspace/src/config/map-config.ts) 中有 5 个预设主题：

| 主题名称 | 说明 |
|----------|------|
| `default` | 塞上江南（默认）- 沙漠与绿洲色调 |
| `desert` | 金色沙漠 - 浓郁的沙漠色调 |
| `forest` | 森林绿洲 - 清新的绿色主题 |
| `ocean` | 蓝色海洋 - 清凉的蓝色调 |
| `sunset` | 夕阳西下 - 温暖的晚霞色调 |

要更换主题，修改 [`NingxiaInteractiveMap.tsx`](file:///workspace/src/components/NingxiaInteractiveMap.tsx) 中的引用：

```typescript
// 将 'default' 改为其他主题名称
themePresets['default'].colors.gradient.start
// 改为
themePresets['desert'].colors.gradient.start
```

### 方法二：直接修改颜色值

在 [`map-config.ts`](file:///workspace/src/config/map-config.ts) 中找到 `defaultMapColors` 对象，修改颜色值：

```typescript
export const defaultMapColors: MapColors = {
  background: '#F5F2EB',           // 地图背景色
  province: {
    fill: '#E8DCC8',               // 地级市填充色
    fillHover: '#D4A857',           // 悬停时填充色
    fillSelected: '#2D5A4A',         // 选中时填充色
    stroke: '#B89B5D',              // 描边色
    strokeHover: '#2D5A4A',         // 悬停时描边色
    strokeSelected: '#1A3A2A',       // 选中时描边色
  },
  // ... 更多颜色配置
};
```

### 颜色值说明

| 颜色变量 | 说明 | 示例值 |
|----------|------|--------|
| `background` | 地图背景色 | `#F5F2EB` |
| `province.fill` | 地级市区域默认填充色 | `#E8DCC8` |
| `province.fillHover` | 鼠标悬停时的填充色 | `#D4A857` |
| `province.fillSelected` | 选中城市的填充色 | `#2D5A4A` |
| `gradient.start/end` | 渐变色起止 | `#E8DCC8` / `#C4A35A` |
| `district.fill` | 区/县级区域填充色 | `#A8D5BA` |

---

## 创建自定义主题

在 [`map-config.ts`](file:///workspace/src/config/map-config.ts) 中添加新主题：

```typescript
export const themePresets: Record<ThemeName, ThemePreset> = {
  // ... 现有主题
  custom: {
    name: '自定义主题',
    description: '你的主题描述',
    colors: {
      background: '#FFFFFF',
      province: {
        fill: '#CCCCCC',
        fillHover: '#AAAAAA',
        fillSelected: '#888888',
        stroke: '#999999',
        strokeHover: '#666666',
        strokeSelected: '#333333',
      },
      district: {
        fill: '#DDDDDD',
        fillHover: '#BBBBBB',
        fillSelected: '#777777',
        stroke: '#AAAAAA',
      },
      gradient: {
        start: '#CCCCCC',
        end: '#AAAAAA',
      },
      selectedGradient: {
        start: '#888888',
        end: '#666666',
      },
      districtGradient: {
        start: '#DDDDDD',
        end: '#BBBBBB',
      },
      text: {
        primary: '#333333',
        shadow: 'rgba(255,255,255,0.9)',
      },
    },
  },
};
```

然后在 `ThemeName` 类型中添加 `'custom'`。

---

## 更新路线推荐

打开 [`src/pages/RouteRecommendation.tsx`](file:///workspace/src/pages/RouteRecommendation.tsx)，在 `routes` 数组中添加新路线：

```typescript
{
  id: 'new-route',
  name: '新路线名称',
  theme: '路线主题',
  duration: '行程天数',
  budget: '预算范围',
  description: '路线描述',
  attractions: ['attraction-id-1', 'attraction-id-2'],
  highlights: ['亮点1', '亮点2'],
  icon: Sun,  // 从 lucide-react 导入图标
  gradient: 'from-orange-400 to-amber-500',  // Tailwind 渐变类
}
```

---

## 常见问题

### Q: 如何获取景点图片？
A: 建议使用 [Unsplash](https://unsplash.com/) 的免费图片，或使用图床上传自己的图片。图片URL需要是可直接访问的链接。

### Q: 景点坐标如何确定？
A: 参考现有景点位置，宁夏地图大致分布：
- 北部（石嘴山）：x=600-750, y=0-100
- 中部（银川、吴忠）：x=400-600, y=100-300
- 南部（固原）：x=450-600, y=400-600

### Q: 如何调试地图显示问题？
A:
1. 打开浏览器开发者工具 (F12)
2. 检查 Console 中的错误信息
3. 使用 React DevTools 检查组件状态
4. 确认 GeoJSON 数据加载成功

### Q: 如何添加新城市？
A: 需要同时修改：
1. [`ningxia-province.json`](file:///workspace/src/data/ningxia-province.json) - 添加城市边界数据
2. [`cities.json`](file:///workspace/src/data/cities.json) - 添加城市基本信息
3. [`map-config.ts`](file:///workspace/src/config/map-config.ts) 中的 `cityInfo` 对象 - 添加城市描述

---

## 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS
- **路由**: React Router
- **图标**: Lucide React
- **地图**: 自定义 SVG 渲染

---

## 联系方式

如有问题，请提交 Issue 或联系项目维护者。
