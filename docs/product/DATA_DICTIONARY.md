# 数据字典（Data Dictionary）

> 当前数据规模与发布验收入口见 [RELEASE_STATUS.md](../RELEASE_STATUS.md)。字段定义以 `src/types/index.ts` 为唯一事实来源；本文用于给贡献者查阅字段含义、枚举与构建门禁。

> 本文档是 [`src/types/index.ts`](../../src/types/index.ts) 的**人类可读速查表**。字段级定义以 TypeScript 源码为准；本字典用于帮助内容维护者与新贡献者快速查找字段含义、枚举值、必填约束与构建校验规则。

---

## 0. 公共枚举速查

| 枚举 | 取值 | 说明 |
|------|------|------|
| `CityId` | `yinchuan`、`shizuishan`、`wuzhong`、`guyuan`、`zhongwei` | 五个固定地级市 ID；作为跨数据关联主键 |
| `ContentStatus` | `published`、`draft` | published 会进入公开页面与站点地图；draft 对访客隐藏 |
| `VerificationLevel` | `verified`、`review` | 核实等级，见 CONTENT_AUDIT.md |
| `SourceKind` | `official`、`image` | 引用类型：官方资料 / 图片来源 |
| `SourceLevel` | `direct`、`directory`、`homepage` | 来源层级（直接专页 > 目录 > 机构首页） |
| `SourceCoverage` | `overview`、`visit`、`location` | 来源覆盖的信息维度 |
| `JournalType` | `travel`、`food`、`guide` | 手记类型：亲历游记 / 探店 / 资料专题 |
| `JournalContentKind` | `firsthand`、`editorial`、`demo` | 内容性质：亲历 / 资料整理 / 演示占位 |
| `AttractionCategory` | `nature`、`history`、`religion`、`experience` | 景点分类：自然 / 历史文化 / 宗教建筑 / 特色体验 |
| `FoodCategory` | `mutton`、`noodle`、`snack`、`drink`、`fruit`、`specialty`、`staple` | 美食分类：羊肉 / 面食 / 小吃 / 饮品 / 水果 / 特产 / 主食 |
| `TransportType` | `airport`、`highspeed_rail`、`railway`、`bus` | 交通枢纽类型 |
| `RouteTheme` | `first-visit`、`weekend`、`panorama`、`culture`、`food` | 路线主题 |
| `RoutePace` | `relaxed`、`balanced`、`intensive` | 路线节奏 |
| `WalkingLevel` | `low`、`medium`、`high` | 步行量画像 |

> **通用校验规则**：
> - 所有 `id` / `slug` 字段必须匹配正则 `/^[a-z0-9]+(-[a-z0-9]+)*$/`（kebab-case ASCII）。
> - 所有 `verifiedAt` / `checkedAt` / `publishedAt` / `updatedAt` 字段格式必须为 `YYYY-MM-DD`，且不能晚于当前日期。
> - 任何 `published` 条目若 `verifiedAt` 距今超过 **180 天**，会阻断构建。
> - 构建期同时存在 **10 天软提醒窗口（170–180 天）**：日志与 GitHub Actions 会显示警告黄条，每周一 GitHub Issue 会自动创建内容复核工单；窗口内不阻断构建。

---

## 1. SourceRef（来源引用）

所有内容共享的引用结构。published 条目**至少需要 1 条 `kind: 'official'` 的来源**。

| 字段 | 类型 | 必填 | 说明 | 校验 |
|------|------|------|------|------|
| `label` | string | ✅ | 来源名称，如「宁夏博物馆官网」 | 非空、非占位 |
| `url` | string | ✅ | 来源 URL（https） | 非空、非占位、合法 URL 结构 |
| `kind` | SourceKind | ✅ | 来源类型：官方资料 / 图片 | 枚举 |
| `level` | SourceLevel | ✅ | 来源层级 | 枚举 |
| `coverage` | SourceCoverage[] | ✅ | 覆盖维度：概览 / 开放信息 / 位置 | 数组非空 |
| `checkedAt` | string | ✅ | 本次核对日期 `YYYY-MM-DD` | 日期格式，不晚于今天 |

---

## 2. Image（图片结构）

景点 / 城市 / 手记封面 / 美食配图共享。

| 字段 | 类型 | 必填 | 说明 | 校验 |
|------|------|------|------|------|
| `src` | string | ✅ | 相对路径，如 `/images/attractions/xxx/01.webp` | published 条目必须对应本地文件存在 `*.webp` + `*.avif`，且提供 720 / 1440 两档 |
| `alt` | string | ✅ | 图片替代文本（无障碍） | 非空、非占位 |
| `credit` | string | ✅ | 作者 / 机构 / 署名 | 非空 |
| `license` | string | ✅ | 授权说明，如 CC-BY-4.0 / 原创 | 非空 |
| `sourceUrl` | string | ❌ | 原始图片来源页 URL | 若填写必须合法 |

---

## 3. Attraction（景点）

数据源：`src/data/attractions.ts`

| 字段 | 类型 | 必填 | 说明 | 校验 |
|------|------|------|------|------|
| `id` | string | ✅ | 唯一 ID，kebab-case | 全局唯一、正则通过 |
| `status` | ContentStatus | ✅ | 公开 / 草稿 | — |
| `verificationLevel` | VerificationLevel | ✅ | 核实等级 | — |
| `name` | string | ✅ | 景点名称 | 非空、非占位 |
| `cityId` | CityId | ✅ | 所属地级市 | 枚举五选一 |
| `locality` | string | ✅ | 所在县区（如 兴庆区） | 非空 |
| `category` | AttractionCategory | ✅ | 分类 | 枚举 |
| `coordinates` | `{ lng: number; lat: number }` | ✅ | WGS84 经纬度 | 合法数值范围 |
| `summary` | string | ✅ | 概述，80–200 字 | 非空、非占位 |
| `highlights` | string[] | ✅ | 亮点列表 | 数组长度 ≥ 1 |
| `visitInfo.openingHours` | string | ✅ | 开放时间，如 09:00–17:00 | 非空、非占位 |
| `visitInfo.ticketPrice` | string | ✅ | 参考票价，标注「参考」口径 | 非空 |
| `visitInfo.reservation` | string | ✅ | 是否预约，如「公众号预约」 | 非空 |
| `visitInfo.duration` | string | ✅ | 建议游览时长，如 2–3 小时 | 非空 |
| `visitInfo.bestSeason` | string | ✅ | 最佳季节 | 非空 |
| `visitInfo.transportation` | string | ✅ | 交通指南 | 非空 |
| `visitInfo.address` | string | ✅ | 详细地址 | 非空 |
| `images` | Image[] | ✅ | 景点图库（通常 ≥ 1） | published 时 webp+avif 两档文件齐全 |
| `nearbyIds` | string[] | ❌ | 周边景点 ID 列表 | 必须引用已 published 的景点 |
| `sources` | SourceRef[] | ✅ | 引用来源 | ≥ 1 条 official；结构合法 |
| `verifiedAt` | string | ✅ | 最近核实日期 | 180 天有效 |
| `verificationNote` | string | ✅ | 核实说明：已核对 / 待补项 | 非空 |
| `fallbackNote` | string | ❌ | 待复核景点的可执行替代方案 | `review` 级建议填写 |

---

## 4. City（城市）

数据源：`src/data/cities.ts`，共 5 条。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | CityId | ✅ | 固定五选一 |
| `name` | string | ✅ | 中文名 |
| `pinyin` | CityId | ✅ | 拼音，等同 id，用于路由 `/city/:name` |
| `nickname` | string | ✅ | 城市别称 |
| `travelRole` | string | ✅ | 旅行角色定位（一句话） |
| `connectionNote` | string | ✅ | 跨城交通衔接说明 |
| `suggestedStay` | string | ✅ | 建议停留，如「1.5–2 天」 |
| `arrivalNote` | string | ✅ | 抵达方式（机场 / 高铁 / 长途） |
| `bestFor` | string[] | ✅ | 适合人群标签，≥ 1 条 |
| `planningTip` | string | ✅ | 行程提醒（易错点） |
| `introduction` | string | ✅ | 城市简介正文 |
| `history` | string | ✅ | 历史沿革概述 |
| `foods` | string[] | ✅ | 代表性美食 ID，引用 foods.ts |
| `bestSeason` | string | ✅ | 最佳游览季节 |
| `culture` | string | ✅ | 特色文化介绍 |
| `image` | Image | ✅ | 城市封面图 |

---

## 5. RoutePlan & RouteDay（路线）

数据源：`src/data/routes.ts`。

### 5.1 RoutePlan

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一 ID，kebab-case |
| `name` | string | ✅ | 路线名称 |
| `theme` | RouteTheme | ✅ | 主题枚举 |
| `themeLabel` | string | ✅ | 主题中文展示 |
| `durationDays` | number | ✅ | 天数，1–5 |
| `durationLabel` | string | ✅ | 天数展示，如「3 天 2 晚」 |
| `audience` | string | ✅ | 适合人群说明 |
| `budget` | string | ✅ | 预算区间（参考口径 + 日期） |
| `bestSeason` | string | ✅ | 最佳旅行季节 |
| `pace` | RoutePace | ✅ | relaxed / balanced / intensive |
| `walkingLevel` | WalkingLevel | ✅ | low / medium / high |
| `transportSummary` | string | ✅ | 主要交通画像 |
| `summary` | string | ✅ | 路线概览 |
| `highlights` | string[] | ✅ | 亮点，≥ 3 条 |
| `days` | RouteDay[] | ✅ | 逐日行程 |
| `verifiedAt` | string | ✅ | 最近核实日期，180 天有效 |

### 5.2 RouteDay

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `day` | number | ✅ | 第几天（从 1 起） |
| `title` | string | ✅ | 当日主题 |
| `summary` | string | ✅ | 当日概述 |
| `stops` | RouteStop[] | ✅ | 停靠点列表 |
| `meals` | string[] | ✅ | 餐饮建议，≥ 2 条 |
| `accommodation` | string | ✅ | 住宿建议城市 / 片区 |
| `timeSlots` | RouteTimeSlot[] | ❌ | 当日时段槽；全部路线已补齐 |

### 5.3 RouteStop

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | `'attraction' \| 'point'` | ✅ | 类型 |
| `attractionId` | string | ❌ | type=attraction 时必填；**必须引用 published 景点**（构建校验） |
| `mapQuery` | string | ❌ | type=point 时必填，夜市/酒店/餐饮等无 ID 点位的导航查询词 |
| `duration` | string | ✅ | 建议停留 |
| `notes` | string | ❌ | 停靠说明 |

### 5.4 RouteTimeSlot

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `time` | string | ✅ | 如 `09:00` |
| `location` | string | ✅ | 地点说明 |
| `description` | string | ✅ | 时段内容 |
| `tips` | string | ❌ | 贴士 |

---

## 6. Food & Restaurant（美食与餐厅）

数据源：`src/data/foods.ts`。

### 6.1 Food

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一 ID，kebab-case |
| `status` | ContentStatus | ✅ | 公开 / 草稿 |
| `verificationLevel` | VerificationLevel | ✅ | 核实等级 |
| `name` | string | ✅ | 美食名称 |
| `category` | FoodCategory | ✅ | 分类枚举 |
| `description` | string | ✅ | 介绍正文 |
| `origin` | string | ✅ | 起源 / 代表性城市 |
| `bestSeason` | string | ❌ | 最佳食用季节 |
| `priceRange` | string | ❌ | 人均价格区间（参考口径 + 日期） |
| `restaurants` | Restaurant[] | ✅ | 推荐餐厅列表 |
| `tips` | string | ❌ | 食用贴士 |
| `sources` | SourceRef[] | ✅ | 来源，≥ 1 条 official |
| `verifiedAt` | string | ✅ | 180 天有效期 |

### 6.2 Restaurant

> ⚠️ **不含 phone 字段**：运营信息由探店手记（FoodJournal）真实到店后承载。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 餐厅名 |
| `cityId` | CityId | ✅ | 所在城市 |
| `coordinates` | `{ lng; lat }` | ❌ | WGS84 坐标 |
| `recommend` | string | ❌ | 推荐理由 / 必点菜 |

---

## 7. TransportHub（交通枢纽）

数据源：`src/data/transport.ts`。

| 字段 | 类型 | 必填 | 说明 | 校验 |
|------|------|------|------|------|
| `id` | string | ✅ | 唯一 ID | kebab-case |
| `name` | string | ✅ | 枢纽名称 | — |
| `cityId` | CityId | ✅ | 所属城市 | — |
| `type` | TransportType | ✅ | airport/highspeed_rail/railway/bus | — |
| `coordinates` | `{ lng; lat }` | ✅ | WGS84 | — |
| `description` | string | ❌ | 定位说明（如「地级市主要普铁站」） | — |
| `address` | string | ❌ | 地址 | — |
| `phone` | string | ❌ | 联系电话 | **仅当有可核实官方来源时保留**；区号须匹配所在城市；禁止 `0951-12306` 模板 |
| `sources` | SourceRef[] | ❌ | 来源 | 建议 ≥ 1 条 |
| `verifiedAt` | string | ✅ | 必填，180 天有效 | **类型层面强制必填**（不可选） |

---

## 8. GovernmentMarker（政府标记）

数据源：`src/components/map/config.ts`（**不在** `src/data/`）。仅作为地图导航锚点，不展示运营 / 开放 / 票价信息。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一 ID，如 `ningxia-government` / `yinchuan-government` |
| `name` | string | ✅ | 名称 |
| `level` | `'province-capital' \| 'city-capital'` | ✅ | 省级 / 市级 |
| `cityId` | CityId | ❌ | 仅市级填写 |
| `coordinates` | `{ lng; lat }` | ✅ | WGS84 |
| `sources` | SourceRef[] | ✅ | 来源（均为 homepage 级政府门户网站首页） |
| `verifiedAt` | string | ✅ | 180 天有效期 |

---

## 9. 手记系列（Journal）

源文件：`src/content/journal/*.md`，通过 `src/content/journal-parser.ts` 解析 Frontmatter + Markdown 正文。

### 9.1 JournalCommon（公共字段）

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `slug` | string | ✅ | URL 片段，kebab-case，2–63 字符 |
| `type` | JournalType | ✅ | travel / food / guide |
| `status` | ContentStatus | ✅ | published / draft |
| `contentKind` | JournalContentKind | ✅ | firsthand / editorial / demo；**`demo` 必须保持 draft** |
| `featured` | boolean | ✅ | 是否在首页优先展示 |
| `title` | string | ✅ | 标题 |
| `excerpt` | string | ✅ | 摘要（列表页展示） |
| `author` | string | ✅ | 默认「站点编辑」 |
| `publishedAt` | string | ✅ | 发布日期 |
| `updatedAt` | string | ✅ | 最近更新日期；**不得早于实际行程 / 到店日期** |
| `cityId` | CityId | ✅ | 主要涉及城市 |
| `locality` | string | ✅ | 主要涉及县区 |
| `tags` | string[] | ✅ | 标签数组 |
| `cover` | Image | ✅ | 封面 |
| `gallery` | Image[] | ✅ | 图集（可为空数组） |
| `relatedAttractionIds` | string[] | ✅ | 关联景点 ID（可空数组） |
| `relatedRouteIds` | string[] | ✅ | 关联路线 ID（可空数组） |
| `body` | string | ✅ | Markdown 正文（由解析器从 MD 文件内容生成） |

### 9.2 TravelJournal（亲历游记，type=travel + contentKind=firsthand）

| 字段 | 类型 | 必填 |
|------|------|------|
| `tripDate` | string | ✅ 实际出行日期 |
| `duration` | string | ✅ 实际时长 |
| `transport` | string | ✅ 实际交通方式 |
| `budgetNote` | string | ✅ 预算记录（真实发生口径 + 日期） |
| `highlights` | string[] | ✅ 亲历亮点 |

### 9.3 FoodJournal（探店手记，type=food + contentKind=firsthand）

| 字段 | 类型 | 必填 |
|------|------|------|
| `visitedAt` | string | ✅ 到店日期 |
| `venueName` | string | ✅ 店名 |
| `cuisine` | string | ✅ 菜系 / 品类 |
| `address` | string | ✅ 地址 |
| `mapQuery` | string | ✅ 地图搜索查询词 |
| `pricePerPerson` | string | ✅ 人均（真实发生口径 + 日期） |
| `dishes` | string[] | ✅ 实际点单菜品 |
| `queueNote` | string | ✅ 排队情况（真实体验） |
| `suitableFor` | string | ✅ 适合场景 |
| `revisitNote` | string | ✅ 是否复购 / 复访原因 |

> 体验类字段**不使用星级或数字评分**，改用文字描述。

### 9.4 EditorialJournal（资料专题，type=guide + contentKind=editorial）

| 字段 | 类型 | 必填 |
|------|------|------|
| `reviewedAt` | string | ✅ 资料复核日期 |
| `scopeNote` | string | ✅ 适用范围（人群 / 目的地边界 / 不含哪些实时信息） |
| `keyPoints` | string[] | ✅ 关键判断数组，≥ 2 条 |
| `references` | `{ label; url; checkedAt }[]` | ✅ 可访问来源，≥ 2 条 |

> 资料专题**不得写成亲历口吻**，不得冒充游记 / 探店。

---

## 10. Discovery（旅行兴趣组合）

数据源：`src/data/discovery.ts`，用于景点页顶部的四组兴趣入口。

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 枚举：`first-visit` / `time-depth` / `along-yellow-river` / `less-hustle` |
| `title` | string | ✅ | 标题，如「第一次来宁夏」 |
| `subtitle` | string | ✅ | 副标题（一句话解释入口价值） |
| `attractionIds` | string[] | ✅ | **≥ 3 条**，且必须全部是已 published 的景点（构建校验） |

---

## 11. 反糟粕门禁关键字段速查

| 门禁 | 规则 | 影响类型 |
|------|------|---------|
| 模板电话 | 禁止 `^\d{4}-12306$` 号码 | TransportHub.phone |
| `\| string` 放宽 | `src/types/index.ts` 的联合类型禁止 `\| string` 兜底 | 所有类型定义 |
| 占位文本 | 禁止出现「示例」「演示用」「待填写」「example.com」等 | 所有字符串字段 |
| 未来日期 | `publishedAt` 不能晚于今天；手记日期不能晚于实际到店/行程日期 | 手记 |
| 重复 JSON 双写 | `src/data/` 与 `public/data/` 不能同时存在同名 JSON | 文件层 |
