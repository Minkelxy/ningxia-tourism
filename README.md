# 宁夏旅游地图 - 塞上江南·神奇宁夏

一款专注于宁夏回族自治区旅游景点的交互式地图网站，融合现代设计美学与地域文化特色，为游客提供直观、便捷的旅游目的地探索体验。

[在线访问](https://ningxia-map.example.com) | [产品需求文档](./.trae/documents/宁夏旅游地图PRD.md) | [技术架构文档](./.trae/documents/宁夏旅游地图技术架构.md)

---

## ✨ 核心特性

- **交互式 SVG 地图** - 基于宁夏行政区划的精美矢量地图，支持缩放、平移和区域高亮
- **景点标记系统** - 动态图标展示景点位置，支持悬停放大效果和点击导航
- **触摸手势支持** - 移动端双指缩放，优化的触控体验
- **动态视图框计算** - 根据缩放级别自动调整地图视野范围
- **多层级导航** - 支持省/市/区三级地图导航交互
- **景点详情页** - 高清图库、详细描述、实用信息和周边推荐
- **响应式设计** - 适配桌面端、平板端和移动端

---

## 🗺️ 功能模块

### 地图系统

| 功能 | 描述 |
|------|------|
| 省份视图 | 展示宁夏五个地级市全貌，省会和市政府标记 |
| 城市视图 | 放大查看单个城市，景点标记（评分≥4.5） |
| 区县视图 | 深入区县级行政区划 |
| 景点标记 | 动态图标展示景点位置，悬停显示预览 |
| 政府标记 | 标注省会和市政府所在地 |
| 触摸缩放 | 双指捏合缩放地图 |
| 边界自适应 | 自动调整视图框适应选中区域 |

### 页面模块

| 页面 | 路由 | 功能描述 |
|------|------|----------|
| 首页地图 | `/` | 全屏交互式地图为主体 |
| 景点详情 | `/attraction/:id` | 景点图片、文字介绍、实用信息 |
| 景点列表 | `/attractions` | 分类浏览所有景点 |
| 城市概览 | `/city/:name` | 城市介绍、特色美食、最佳时间 |
| 路线推荐 | `/routes` | 精选路线、时间规划、预算参考 |
| GeoJSON 编辑器 | `/geojson-editor` | 编辑和预览 GeoJSON 数据 |
| GeoJSON 查看器 | `/geojson-viewer` | 查看地图 GeoJSON 格式数据 |

---

## 🛠️ 技术栈

### 前端框架

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.3.x | UI 框架 |
| TypeScript | 5.8.x | 类型安全 |
| Vite | 6.3.x | 构建工具 |
| React Router | 7.3.x | 路由管理 |

### UI 与样式

| 技术 | 版本 | 用途 |
|------|------|------|
| Tailwind CSS | 3.4.x | 原子化 CSS |
| Lucide React | 0.511.x | 图标库 |
| CSS 变量 | - | 主题配置 |

### 地图与数据

| 技术 | 版本 | 用途 |
|------|------|------|
| Custom SVG | - | 交互式地图渲染 |
| TopoJSON | 3.1.x | 地理数据格式 |
| D3.js | 7.9.x | 数据可视化 |
| 静态 GeoJSON | - | 行政区划边界 |

### 状态管理

| 技术 | 版本 | 用途 |
|------|------|------|
| React Context | 内置 | 主题状态管理 |
| Zustand | 5.0.x | 全局状态管理 |

---

## 📁 项目结构

```
ningxia-tourism-map/
├── public/                          # 静态公共资源
│   └── data/
│       ├── attractions.json         # 景点数据
│       ├── attractions-list.json    # 景点列表
│       ├── cities.json              # 城市基础数据
│       ├── ningxia-province.json    # 省级 GeoJSON
│       ├── ningxia.geojson          # 全区 GeoJSON
│       └── ningxia-cities/          # 市级 GeoJSON
│           ├── yinchuan.json
│           ├── yinchuan-districts.json
│           ├── wuzhong.json
│           ├── wuzhong-districts.json
│           ├── guyuan.geojson
│           ├── shizuishan.geojson
│           └── zhongwei.geojson
│
├── src/                             # 源代码目录
│   ├── components/                  # React 组件
│   │   ├── Header.tsx              # 顶部导航栏
│   │   ├── Footer.tsx              # 底部页脚
│   │   ├── Empty.tsx               # 空状态组件
│   │   ├── AttractionCard.tsx      # 景点卡片
│   │   ├── NingxiaMap.tsx          # 经典地图组件
│   │   ├── NingxiaMapNew.tsx       # 新版地图组件
│   │   ├── NingxiaGeoJSONMap.tsx   # GeoJSON 地图
│   │   └── NingxiaInteractiveMap.tsx # 交互式地图（核心组件）
│   │
│   ├── config/                      # 配置文件
│   │   └── map-config.ts           # 地图配色和配置
│   │
│   ├── pages/                       # 页面组件
│   │   ├── Home.tsx                # 首页（地图）
│   │   ├── AttractionDetail.tsx    # 景点详情页
│   │   ├── AttractionsList.tsx     # 景点列表页
│   │   ├── CityOverview.tsx        # 城市概览页
│   │   ├── RouteRecommendation.tsx # 路线推荐页
│   │   ├── GeoJSONEditor.tsx       # GeoJSON 编辑器
│   │   └── GeoJSONViewer.tsx       # GeoJSON 查看器
│   │
│   ├── data/                        # 前端数据
│   │   └── (与 public/data 结构相同，用于开发环境)
│   │
│   ├── hooks/                       # 自定义 Hooks
│   │   └── useTheme.ts             # 主题切换 Hook
│   │
│   ├── lib/                         # 工具函数
│   │   └── utils.ts                # 通用工具
│   │
│   ├── types/                       # TypeScript 类型
│   │   ├── index.ts                # 入口类型
│   │   └── geojson.d.ts            # GeoJSON 类型声明
│   │
│   ├── App.tsx                     # 应用根组件
│   ├── main.tsx                    # 入口文件
│   └── index.css                   # 全局样式
│
├── scripts/                          # 构建脚本
│   └── converted-cities.ts          # 城市路径转换
│
├── docs/                             # 文档目录
│   ├── MAINTENANCE.md              # 维护文档
│   └── attraction-template.json    # 景点数据模板
│
├── .github/workflows/                # GitHub Actions
│   └── deploy.yml                  # 部署配置
│
├── index.html                      # HTML 入口
├── package.json                    # 依赖配置
├── tsconfig.json                   # TypeScript 配置
├── vite.config.ts                  # Vite 配置
├── tailwind.config.js              # Tailwind 配置
├── postcss.config.js               # PostCSS 配置
└── eslint.config.js               # ESLint 配置
```

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 pnpm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

启动本地开发服务器：

```bash
npm run dev
```

访问 http://localhost:5173 查看应用。

### 类型检查

```bash
npm run check
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

---

## 📊 数据结构

### 景点数据

```typescript
interface Attraction {
  id: string;                    // 唯一标识
  name: string;                  // 景点名称
  nameEn?: string;               // 英文名称
  city: string;                  // 所属城市
  type: 'nature' | 'history' | 'religion' | 'experience' | 'culture';
  coordinates: {
    x: number;                   // SVG 地图 X 坐标
    y: number;                   // SVG 地图 Y 坐标
  };
  rating: number;               // 评分 (1-5)
  description: string;          // 简介
  images: string[];             // 图片 URL 数组
  openingHours: string;         // 开放时间
  ticketPrice: string;          // 门票价格
  bestSeason: string;           // 最佳季节
  transportation: string;       // 交通指南
  highlights: string[];         // 游览亮点
  nearbyAttractions: string[];  // 周边景点 ID
}
```

### 景点类型分类

| 类型 | 标识 | 代表景点 |
|------|------|----------|
| 自然风光 | `nature` | 沙湖、苏峪口国家森林公园、六盘山 |
| 历史文化 | `history` | 西夏王陵、镇北堡西部影城、宁夏博物馆 |
| 宗教建筑 | `religion` | 中卫高庙、南关清真寺 |
| 特色体验 | `experience` | 沙坡头、黄河坛、鸣翠湖 |
| 民俗文化 | `culture` | 中华回乡文化园、黄河楼 |

---

## 🎨 设计系统

### 色彩方案

| 用途 | 颜色 | 十六进制 | 说明 |
|------|------|----------|------|
| 主色调 | 沙金色 | `#C4A35A` | 代表沙漠与丰收 |
| 辅助色 | 胡杨绿 | `#2D5A4A` | 代表绿洲与生态 |
| 强调色 | 枸杞红 | `#E85D4C` | 代表宁夏特产 |
| 背景色 | 暖白色 | `#F5F2EB` | 干净的阅读体验 |
| 深色文字 | 近黑色 | `#1A1A1A` | 高对比度 |
| 浅色文字 | 灰色 | `#6B6B6B` | 次要信息 |

### 字体配置

| 用途 | 字体 | 说明 |
|------|------|------|
| 标题字体 | Noto Serif SC | 思源宋体，典雅大气 |
| 正文字体 | Noto Sans SC | 思源黑体，清晰易读 |
| 装饰字体 | Ma Shan Zheng | 马善政楷体，文化特色 |

### 地图主题

支持多套地图配色方案，可在 `src/config/map-config.ts` 中配置：

- **default** - 默认沙金色主题
- **blue** - 蓝色系主题
- **green** - 绿色系主题

---

## 🧩 核心组件

### NingxiaInteractiveMap

交互式地图核心组件，支持触摸手势和动态视图框。

**Props:**
```typescript
interface NingxiaInteractiveMapProps {
  onCityClick?: (feature: GeoFeature) => void;
}
```

**功能特性:**
- 省/市/区三级导航
- 景点标记层（评分≥4.5）
- 政府标记层（省会和市政府）
- 触摸手势缩放（双指捏合）
- 动态视图框计算
- 悬停提示信息

### AttractionCard

景点卡片组件，支持多种展示变体。

**Props:**
```typescript
interface AttractionCardProps {
  attraction: Attraction;
  variant?: 'default' | 'preview' | 'featured';
}
```

**变体:**
- `default` - 完整卡片，包含图片和详细信息
- `preview` - 紧凑预览卡片
- `featured` - 精选推荐卡片

---

## 🌐 地图数据

### GeoJSON 数据源

地图使用 GeoJSON 格式存储行政区划边界：

| 文件 | 描述 | 层级 |
|------|------|------|
| `ningxia.geojson` | 宁夏全区边界 | 省级 |
| `yinchuan.json` | 银川市边界 | 市级 |
| `yinchuan-districts.json` | 银川市辖区边界 | 区级 |
| `wuzhong.json` | 吴忠市边界 | 市级 |
| `wuzhong-districts.json` | 吴忠市辖区边界 | 区级 |
| `guyuan.geojson` | 固原市边界 | 市级 |
| `shizuishan.geojson` | 石嘴山市边界 | 市级 |
| `zhongwei.geojson` | 中卫市边界 | 市级 |

### 数据加载

地图数据通过 Vite 的 `import()` 动态导入：

```typescript
const geoData = await import('../data/ningxia-province.json');
```

---

## 📱 响应式设计

| 断点 | 设备 | 布局特点 |
|------|------|----------|
| < 640px | 手机竖屏 | 地图全屏，底部弹出面板展示信息 |
| 640-1024px | 平板/手机横屏 | 地图为主，侧边卡片覆盖 |
| > 1024px | 桌面端 | 全功能布局，充分利用屏幕空间 |

---

## 🔧 开发指南

### 添加新景点

1. 在 `public/data/attractions.json` 中添加景点数据
2. 使用 `docs/attraction-template.json` 作为模板
3. 确保图片资源已上传到 `public/images/attractions/`

### 自定义地图配色

编辑 `src/config/map-config.ts` 中的配色方案：

```typescript
export const themePresets = {
  default: {
    colors: {
      primary: '#C4A35A',
      secondary: '#2D5A4A',
      accent: '#E85D4C',
      background: '#F5F2EB',
    },
  },
};
```

### 添加新城市

1. 在 `public/data/` 添加城市的 GeoJSON 文件
2. 更新 `src/data/` 中的对应文件
3. 在地图组件中添加城市信息

---

## 📄 许可证

本项目仅供学习交流使用。

---

## 🙏 致谢

- [Vite](https://vitejs.dev/) - 快速构建工具
- [React](https://react.dev/) - UI 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide](https://lucide.dev/) - 精美图标
- [GeoJSON](https://geojson.org/) - 地理数据格式

---

**塞上江南，神奇宁夏 | 探索西北之美**
