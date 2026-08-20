# 路线模板（RoutePlan）

本模板字段严格对齐 `src/types/index.ts` 的 `RoutePlan`。路线数据以 TypeScript 对象形式维护在路线数据文件（如 `src/data/routes.ts`）中，不是独立 md 文件；因此本模板以 `ts` 代码块给出可直接复制的对象字面量，下方附字段说明（必填 / 枚举）。

## 完整示例

```ts
// 复制到路线数据文件的 routes 数组中；如文件顶部尚未导入类型，补充：
// import type { RoutePlan } from '../types';
const route: RoutePlan = {
  id: 'yinchuan-first-visit',
  name: '银川初访一日路线',
  theme: 'first-visit',
  themeLabel: '初次到访',
  durationDays: 1,
  durationLabel: '1 天',
  audience: '初次到访银川、希望覆盖标志性景点的游客',
  budget: '人均约 300 元（不含往返大交通）',
  bestSeason: '5-10 月',
  pace: 'balanced',
  walkingLevel: 'medium',
  transportSummary: '市内公交与出租车为主，景点间单程 20-40 分钟',
  summary: '用一天串起银川最具代表性的博物馆与历史地标，节奏均衡。',
  highlights: ['宁夏博物馆通史展', '鼓楼历史街区'],
  days: [
    {
      day: 1,
      title: '城市脉络与博物馆',
      summary: '以宁夏博物馆为核心，串联周边历史街区。',
      stops: [
        {
          time: '09:30',
          title: '宁夏博物馆',
          description: '通史展与贺兰山岩画专题展，建议 2 小时。',
          attractionId: 'ningxiamuseum',
          transport: '公交 1 路至博物馆站',
          tips: '周一闭馆，需提前公众号预约',
        },
        {
          time: '14:00',
          title: '鼓楼周边历史街区',
          description: '步行浏览鼓楼与周边老街，无需门票。',
          mapQuery: '银川 鼓楼',
          transport: '博物馆步行 15 分钟',
        },
      ],
      meals: ['午餐：博物馆附近手抓羊肉', '晚餐：鼓楼夜市小吃'],
      accommodation: '兴庆区鼓楼附近酒店',
    },
  ],
  verifiedAt: '2026-01-01',
};
```

> 多日路线：在 `days` 数组中追加更多 `RouteDay`，并保持 `durationDays` 与 `days.length` 一致、`durationLabel` 同步更新。每个 `RouteStop` 的 `attractionId`（引用 `Attraction.id`）与 `mapQuery`（无景点数据时的地图检索词）二选一。

## 字段说明

### 顶层字段（RoutePlan）

| 字段 | 必填 | 说明 / 枚举 |
| --- | --- | --- |
| `id` | 是 | 路线唯一 id，小写字母 / 数字 / 短横线 |
| `name` | 是 | 路线名称 |
| `theme` | 是 | 枚举：`first-visit` / `weekend` / `panorama` / `culture` / `food` |
| `themeLabel` | 是 | theme 的中文展示名 |
| `durationDays` | 是 | 天数，正整数，需与 `days.length` 一致 |
| `durationLabel` | 是 | 时长展示文案，如 `2 天 1 夜` |
| `audience` | 是 | 适用人群 |
| `budget` | 是 | 预算口径 |
| `bestSeason` | 是 | 最佳季节 |
| `pace` | 是 | 枚举：`relaxed` / `balanced` / `intensive` |
| `walkingLevel` | 是 | 枚举：`low` / `medium` / `high` |
| `transportSummary` | 是 | 交通方式概述 |
| `summary` | 是 | 路线概述 |
| `highlights` | 是 | 亮点数组 |
| `days` | 是 | `RouteDay[]`，每天一项 |
| `verifiedAt` | 是 | 本次核实日期 `YYYY-MM-DD` |

### RouteDay

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `day` | 是 | 第几天，从 1 开始 |
| `title` | 是 | 当日主题标题 |
| `summary` | 是 | 当日概述 |
| `stops` | 是 | `RouteStop[]` |
| `meals` | 是 | 餐饮数组 |
| `accommodation` | 是 | 住宿说明 |
| `timeSlots` | 否 | `RouteTimeSlot[]`，可选时段细分 |

### RouteStop

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `time` | 是 | 时间，如 `09:30` |
| `title` | 是 | 站点标题 |
| `description` | 是 | 站点说明 |
| `attractionId` | 否 | 关联景点 id（引用 `Attraction.id`）；与 `mapQuery` 二选一 |
| `mapQuery` | 否 | 地图检索词（无景点数据时使用） |
| `transport` | 否 | 到达交通 |
| `tips` | 否 | 注意事项 |

### RouteTimeSlot（可选）

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `time` | 是 | 时段 |
| `location` | 是 | 地点 |
| `description` | 是 | 说明 |
| `tips` | 否 | 注意事项 |
