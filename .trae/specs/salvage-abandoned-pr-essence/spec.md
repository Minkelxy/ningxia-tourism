# 挽回被弃 PR 精华内容 Spec

## Why

仓库历史共 9 个 PR，其中 PR #8（2026-08-13，+3840/-7192）与 PR #9 是一次以"内容合规化、数据可核实、架构统一"为方向的彻底重写。重写用减法换取了内容可信度（统一来源标注、Wikimedia 授权图、构建期校验、e2e 测试），但**把早期 PR（#2/#3/#5/#6/#7）沉淀下来的一批有价值结构与真实数据连同低质伪造数据一起丢弃了**：

- **美食模块整体消失**：PR #7 引入的 `foods.json`（14 道宁夏美食 + 21 家真实餐厅 + 经纬度 + 价格区间）和 `Food`/`Restaurant` 类型被整体删除，重写后没有任何替代，美食信息退化为 `City.foods: string[]` 菜名字符串列表，探店手记仍为 0 篇。
- **交通枢纽详情全丢**：PR #7 的 `transport-hubs.json`（15 个枢纽含地址/电话/描述/坐标）被压缩为 `transport.ts`（8 个枢纽，丢失地址/电话/描述），且"银川河东机场"被误分为 `highspeed_rail`。
- **地图政府标记删除**：PR #2/#6 的省政府 + 5 市政府标记（含 `province-capital`/`city-capital` 类型与悬停态）在地图重写中移除，丢失导航上下文。
- **README 虚构依赖**（PR #3 自称用 Zustand/D3/TopoJSON，实际从未安装）、**Unsplash 复用库存图**（同一张图被 6 个景点共用）、**重复 JSON 数据双写**（`public/data/attractions.json` 与 `src/data/attractions.json` 内容完全相同）、**模板化电话**（所有铁路站电话均为 `0951-12306`）、**混乱 ID**（`hua jianao`、`làhúhu`）等糟粕已被正确清除，需防止回潮。

本变更以"取其精华、去其糟粕"为原则，**在保留 PR #8/PR #9 内容可信度门禁的前提下**，把被误弃的真实结构与数据以可核实形式重新引入，并新增校验阻止糟粕复现。

## What Changes

- **新增美食目录模块**：重建 `Food`/`Restaurant` 类型与 `src/data/foods.ts`，每条美食带 `sources: SourceRef[]`、`verifiedAt`、`status`（沿用现有 `verified`/`review`/`draft` 分级），餐厅仅保留可核实字段（名称/城市/坐标/推荐菜），**移除电话字段**避免模板化伪造；地图新增可切换的"美食图层"。
- **交通枢纽详情补全**：扩展 `TransportHub` 类型（新增 `description`、`address`、`phone` 可选字段，但 `phone` 必须通过区号校验），补全 8 个枢纽的描述与地址，**修复银川河东机场 `type` 由 `highspeed_rail` 改为 `airport`**，并把 `TransportType` 联合补充 `'airport'`。
- **地图政府标记图层**：新增可切换的"政府标记图层"，标注自治区政府与 5 市政府位置，仅作为导航锚点，不展示未核实运营信息。
- **路线逐日时间槽增强**（轻量）：在 `RouteDay` 增加可选 `timeSlots: { time, location, description, tips? }[]`，允许路线编辑者为关键日程补充时段细节，但不强制所有日程都有精确时间（保留现有模糊时段兼容）。
- **反糟粕数据校验**：在 `scripts/validate-data.ts` 新增校验规则——禁止重复数据双写（同名 JSON 不允许同时存在于 `src/data/` 与 `public/data/`）、禁止模板化电话（`0951-12306` 等占位）、禁止 ID 含空格或非 ASCII 异常字符、禁止 `type` 字段写成 `SomeType | string` 削弱类型安全。
- **文档同步**：更新 `docs/CONTENT_AUDIT.md` 记录美食/交通枢纽的核实状态与待补项；更新 `README.md` 的功能模块表（不再虚构依赖）。

## Impact

- **Affected specs**: 内容可信度分级体系（`verified`/`review`/`draft`）、地图图层体系（区域/景点/交通 + 新增美食/政府）、路线数据模型（`RoutePlan`/`RouteDay`）、数据构建期校验。
- **Affected code**:
  - `src/types/index.ts`（新增 `Food`/`Restaurant`/`FoodCategory`、扩展 `TransportHub`/`TransportType`、扩展 `RouteDay`）
  - `src/data/foods.ts`（新建）、`src/data/transport.ts`（扩展）、`src/data/routes.ts`（可选增强）
  - `src/components/map/FoodLayer.tsx`（新建）、`src/components/map/GovernmentLayer.tsx`（新建）、`src/components/map/MapControls.tsx`（新增图层开关）、`src/components/map/config.ts`（新增政府标记坐标）
  - `src/components/NingxiaInteractiveMap.tsx`（接入新图层）
  - `src/pages/CityOverview.tsx`、`src/pages/RouteDetail.tsx`（展示美食目录引用与时段细节）
  - `scripts/validate-data.ts`（新增反糟粕校验）、`src/data/validate.test.ts`（新增测试）
  - `docs/CONTENT_AUDIT.md`、`README.md`

## ADDED Requirements

### Requirement: 美食目录模块

系统 SHALL 提供一份带来源核实的宁夏美食目录，作为 `City.foods: string[]` 的结构化补充，并通过地图可切换图层与城市/路线页面引用。

#### Scenario: 美食条目带可核实来源
- **WHEN** 开发者在 `src/data/foods.ts` 新增一条美食
- **THEN** 该条目 MUST 包含 `id`（kebab-case ASCII）、`name`、`category`、`description`、`origin`、`sources: SourceRef[]`、`verifiedAt`、`status` 字段；`status` 取值为 `verified`/`review`/`draft` 之一
- **AND** `draft` 状态的美食 MUST NOT 出现在公开地图图层与城市页美食目录中

#### Scenario: 餐厅字段仅保留可核实信息
- **WHEN** 一条美食包含 `restaurants[]`
- **THEN** 每家餐厅 MUST 仅含 `name`、`city`、`coordinates?`、`recommend?` 字段
- **AND** MUST NOT 包含 `phone` 字段（避免模板化伪造，电话信息改由探店手记 `FoodJournal` 承载）

#### Scenario: 地图美食图层可切换
- **WHEN** 用户在地图工具栏点击"美食"开关
- **THEN** 地图 SHALL 显示所有 `verified`/`review` 状态美食的代表餐厅坐标点
- **AND** `draft` 状态美食 MUST NOT 渲染

### Requirement: 交通枢纽详情补全与机场类型修正

系统 SHALL 为现有 8 个交通枢纽补全可核实的描述与地址，并修正机场类型错误。

#### Scenario: 机场类型正确
- **WHEN** 读取 `transport.ts` 中"银川河东国际机场"条目
- **THEN** 其 `type` MUST 为 `'airport'`
- **AND** `TransportType` 联合类型 MUST 包含 `'airport'` 字面量

#### Scenario: 枢纽详情可选字段
- **WHEN** 开发者为一个交通枢纽补充详情
- **THEN** `description` 与 `address` 字段 MUST 附带 `sources` 与 `verifiedAt` 才能标记为 `verified`
- **AND** `phone` 字段若存在 MUST 通过区号校验（区号须匹配枢纽所在城市，禁止 `0951-12306` 这类跨城模板值）

### Requirement: 地图政府标记图层

系统 SHALL 提供可切换的政府标记图层，标注自治区政府与 5 市政府作为导航锚点。

#### Scenario: 政府标记作为可切换图层
- **WHEN** 用户在地图工具栏点击"政府标记"开关
- **THEN** 地图 SHALL 显示自治区政府与 5 市政府坐标点
- **AND** 标记 MUST NOT 展示未核实的运营信息（仅显示名称与行政级别）

### Requirement: 反糟粕数据校验门禁

系统 SHALL 在构建期校验数据，阻止已识别的糟粕模式回潮。

#### Scenario: 禁止重复数据双写
- **WHEN** 构建期运行 `npm run validate:data`
- **THEN** 校验 MUST 检测 `src/data/` 与 `public/data/` 下是否存在同名数据文件
- **AND** 若存在 MUST 报错阻止构建

#### Scenario: 禁止模板化电话
- **WHEN** 校验发现任何 `phone` 字段值为 `XXXX-12306` 模式或与城市区号不匹配
- **THEN** MUST 报错阻止构建

#### Scenario: 禁止异常 ID
- **WHEN** 校验发现任何实体 `id` 含空格、非 ASCII 字符或不符合 kebab-case
- **THEN** MUST 报错阻止构建

#### Scenario: 禁止类型安全削弱
- **WHEN** 校验发现 `types/index.ts` 中联合字面量类型被写成 `SomeType | string`
- **THEN** MUST 报错提示移除 `| string`

## MODIFIED Requirements

### Requirement: 路线逐日行程（RouteDay）

现有 `RouteDay` 含 `stops`/`meals`/`accommodation`。本变更增加可选 `timeSlots` 字段，允许关键日程补充精确时段，但保留模糊时段兼容。

#### Scenario: 时间槽可选
- **WHEN** 编辑者为某个 `RouteDay` 补充 `timeSlots`
- **THEN** 每个 timeSlot MUST 含 `time`、`location`、`description`，可选 `tips`
- **AND** 未提供 `timeSlots` 的 `RouteDay` MUST 继续正常渲染（向后兼容）

### Requirement: 地图图层体系

现有地图支持区域/景点/交通三层（交通默认隐藏）。本变更新增美食图层与政府标记图层，均默认隐藏、可切换。

#### Scenario: 新图层默认隐藏
- **WHEN** 用户首次加载地图
- **THEN** 美食图层与政府标记图层 MUST 默认关闭
- **AND** 工具栏 MUST 提供独立开关

## REMOVED Requirements

### Requirement: 早期 PR 的低质数据模式

**Reason**: PR #8 已正确清除以下糟粕，本变更通过校验门禁使其永久不可回潮。
- README 虚构依赖（Zustand/D3/TopoJSON 声明但未安装）
- Unsplash 复用库存图（同一张图被多个景点共用）
- 重复 JSON 数据双写（`public/data/` 与 `src/data/` 同名文件）
- 模板化电话（所有铁路站 `0951-12306`）
- 混乱 ID（`hua jianao`、`làhúhu`）
- 类型安全削弱（`FoodCategory | string`、`TransportType | string`）

**Migration**: 通过 `scripts/validate-data.ts` 新增校验规则实现，构建期阻止；现有代码已无这些模式，无需迁移。
