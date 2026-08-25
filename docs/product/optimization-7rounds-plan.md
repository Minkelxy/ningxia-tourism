# 优化 7 轮自动推进计划

> **已归档（2026-08-25）**：本文记录历史优化计划与当时的初始状态，不代表当前数据规模或未完成项。当前状态以 [RELEASE_STATUS.md](../RELEASE_STATUS.md)、`src/data/` 与构建校验结果为准。

## 摘要

基于上一轮已合并的 PR #10（宁夏美食目录重建与地图功能增强），对代码库进行 7 轮持续优化。每轮聚焦一个方向，独立完成 → 提交 → 推送 → 合并到 main → 进入下一轮，全部 7 项完成后收尾。

## 当前状态分析（Phase 1 探索结论）

### 已实现
- `foods.ts` 14 道美食数据已建，5 道 `published` + 9 道 `draft`
- `FoodLayer`/`GovernmentLayer`/`TransportLayer` 三个图层组件已建，已接入 `NingxiaInteractiveMap`
- `MapControls` 已有交通/美食/政府三个图层开关
- `RouteDetail.tsx` 已支持 `timeSlots` 条件渲染
- `validate-data.ts` 已有 `| string` 检测、JSON 双写检测
- `validate.ts` 已有 kebab ID、模板电话、电话区号等校验

### 未实现（7 个优化点对应现状）
1. **美食草稿转正**：9 道 draft 的 `sources` 全为空、`verificationLevel` 全为 `review`
2. **路线时间槽**：仅 `classic-3day` day1/2 有（共 4 个槽），其余 8 条路线 30+ 天全缺；无 timeSlots 时 RouteDetail 静默
3. **美食详情页联动**：`FoodLayer.onSelect` 接口存在但 `NingxiaInteractiveMap` 第 166 行未传入；无 `/foods/:id` 路由与页面
4. **图层键盘无障碍**：三个图层均 `role="img"` + `tabIndex={0}` 但无 `onKeyDown`（对比 `AttractionLayer` 用 `role="button"` + `activateWithKeyboard`）
5. **verifiedAt 周期校验**：`validate.ts` 仅校验"不晚于今天"；`TransportHub.verifiedAt` 为 optional（types 第 234 行）；`routes` 连日期格式都不校验（validate.ts 第 183 行）
6. **图层 React.memo**：`src/components/map` 下所有图层组件均未使用 memo
7. **CONTRIBUTING.md**：项目根目录及子目录均不存在

### 关键文件路径（来自探索）
- `/workspace/src/data/foods.ts`（VERIFIED_AT='2026-08-17'，第 14 行）
- `/workspace/src/data/routes.ts`（9 条路线，verifiedAt='2026-08-15'，第 3 行）
- `/workspace/src/data/transport.ts`（8 个枢纽，verifiedAt 全为 2026-08-17）
- `/workspace/src/types/index.ts`（TransportHub 第 224-235 行，verifiedAt? 第 234 行）
- `/workspace/src/components/map/FoodLayer.tsx`（onSelect 第 8 行，无 onKeyDown）
- `/workspace/src/components/map/GovernmentLayer.tsx`（无 onKeyDown）
- `/workspace/src/components/map/TransportLayer.tsx`（无 onKeyDown，无 memo）
- `/workspace/src/components/map/MapControls.tsx`（3 个图层开关，第 30-36 行）
- `/workspace/src/components/NingxiaInteractiveMap.tsx`（FoodLayer 使用在第 166 行，未传 onSelect）
- `/workspace/src/pages/RouteDetail.tsx`（timeSlots 渲染第 32 行）
- `/workspace/src/App.tsx`（路由表第 46-59 行，无 /foods/:id）
- `/workspace/src/data/validate.ts`（food 校验第 137 行，route 第 183 行）
- `/workspace/scripts/validate-data.ts`（无周期校验）
- `/workspace/src/pages/`（13 个页面，无 Foods/FoodDetail）

## 多轮执行策略

**通用流程（每轮）**：
1. 在 `trae/agent-yuzNLX` 分支（或新分支）上开发
2. `npm run validate:data && npm run check && npm run lint && npm test` 全绿
3. `npm run build` 通过
4. `git add` 相关文件 + `git commit -m "feat: <方向>"`
5. `git push origin <branch>`
6. 用 `gh pr create` 或复用 PR；用 `gh pr merge <n> --squash --admin` 合并到 main
7. `git checkout main && git pull` 同步本地
8. 进入下一轮

**分支策略**：为避免污染，每轮在 `main` 最新基础上新建 `trae/opt-round-<n>` 分支，独立 PR 合并。

## 各轮详细计划

### 轮次 1：美食草稿转正（方向 1）

**目标**：将 9 道 `draft` 美食补全真实来源后转为 `published`。

**变更文件**：
- `/workspace/src/data/foods.ts`
  - 为 9 道 draft 美食（shouzhua-yangrou、yangzasui、yangrou-saozimian、lahuhu、haozi-mian、youxiang、sanzha、xiang-cai、zhongwei-latiaozi）补 `sources` 字段
  - 来源优先级：`direct` > `directory` > `homepage`；至少 1 条可核实来源
  - 来源类型：官方文旅目录、地方志、品牌官网、权威百科（避免自媒体）
  - 将 9 道 `status: 'draft'` 改为 `status: 'published'`
  - `verificationLevel` 保持 `'review'`（除非有直接官方专页可升 `'verified'`）
- `/workspace/docs/content/CONTENT_AUDIT.md`
  - 更新美食章节：14 道全部 published，统计 review/verified 数量
  - 更新复核日期

**验证**：
- `npm run validate:data` 通过（sources 非空、ID kebab、无模板电话）
- `npm run check` 通过
- `npm test` 通过（validate.test.ts 中 sources 校验用例）
- 手动核对每条来源 URL 真实可达（至少域名真实）

**提交信息**：`feat: 美食草稿转正，补全 9 道美食可核实来源`

---

### 轮次 2：路线时间槽补齐（方向 2）

**目标**：为其余 8 条路线补 timeSlots，并在 RouteDetail 无 timeSlots 时加占位提示。

**变更文件**：
- `/workspace/src/data/routes.ts`
  - 为以下路线每天补 2-3 个 timeSlots（基于现有 stops 的 attractionId/mapQuery 推算合理时段）：
    - quick-1day（1 天）
    - weekend-2day（2 天）
    - shizuishan-2day（2 天）
    - classic-3day day3（补全第 3 天）
    - in-depth-4day（4 天）
    - panorama-5day（5 天）
    - red-culture-3day（3 天）
    - guyuan-2day（2 天）
    - food-3day（3 天）
  - 时段格式参考 classic-3day：`{ time: '09:00', location: '...', description: '...', tips?: '...' }`
  - 时段与当天 stops 对应，不引入新景点
- `/workspace/src/pages/RouteDetail.tsx`
  - 第 32 行渲染逻辑补充：当 `day.timeSlots` 为空或不存在时，渲染轻量占位提示"当日时段细节整理中"，避免用户误判为 bug
  - 不破坏现有 `day.timeSlots && day.timeSlots.length > 0` 条件
- `/workspace/docs/content/CONTENT_AUDIT.md`
  - 路线章节补充 timeSlots 覆盖说明

**验证**：
- `npm run validate:data` 通过
- `npm run check` 通过
- `npm test` 通过
- E2E：现有 tourism.spec.ts 路线相关用例不回归

**提交信息**：`feat: 补齐 8 条路线时间槽并优化无槽日程展示`

---

### 轮次 3：美食图层联动详情页（方向 3）

**目标**：新建 `/foods/:id` 详情页，FoodLayer 点击跳转。

**变更文件**：
- `/workspace/src/pages/FoodDetail.tsx`（新建）
  - 通过 `foodById(id)` 取数据；不存在时重定向到 NotFound
  - 渲染：名称、分类、描述、产地、最佳季节、价格区间、餐厅列表（含坐标提示）、tips、sources
  - 复用 AttractionDetail.tsx 的 sources 渲染模式（`.source-list`）
  - 含面包屑、SEO meta
- `/workspace/src/pages/Foods.tsx`（新建，列表页）
  - 通过 `publishedFoods` + `foodsByCity` 渲染分类/城市筛选
  - 卡片链接到 `/foods/:id`
  - 复用 AttractionsList.tsx 的筛选交互模式
- `/workspace/src/App.tsx`
  - 第 46-59 行路由表新增 `/foods` 与 `/foods/:id`
  - 第 8-20 行 lazy 导入 Foods/FoodDetail
- `/workspace/src/components/NingxiaInteractiveMap.tsx`
  - 第 166 行 FoodLayer 传入 `onSelect={(food) => navigate(`/foods/${food.id}`)}`
  - 引入 `useNavigate`
- `/workspace/src/components/map/FoodLayer.tsx`
  - 第 25-27 行 `role="img"` 改为 `role="button"`，加 `onKeyDown`（用 `activateWithKeyboard`，与 AttractionLayer 一致）
- `/workspace/src/components/layout/`（导航菜单）
  - 主导航加"美食"入口（指向 `/foods`）
- `/workspace/scripts/generate-sitemap.ts`
  - 把 publishedFoods 的 `/foods/:id` 纳入 sitemap
- `/workspace/tests/e2e/tourism.spec.ts`
  - 新增：首页 → 地图 → 点美食点位 → 跳转详情页 → 看到餐厅列表
  - 新增：`/foods` 列表页筛选

**验证**：
- `npm run validate:data && npm run check && npm run lint && npm test` 全绿
- `npm run build` 通过（含 sitemap 生成）
- E2E 新用例通过

**提交信息**：`feat: 新增美食详情页与列表页，地图图层点击联动`

---

### 轮次 4：图层键盘无障碍（方向 4）

**目标**：给三个图层补 onKeyDown，统一 role=button。

**变更文件**：
- `/workspace/src/components/map/GovernmentLayer.tsx`
  - `role="img"` → `role="button"`
  - 加 `onKeyDown={(event) => activateWithKeyboard(event, () => {/* 无操作或显示 tooltip */})}`
  - 引入 `activateWithKeyboard`（来自 `../../utils/keyboard` 或现有工具，参考 MapRegionLayer.tsx 第 25 行）
  - 若无可激活动作，保持 `role="img"` 但移除 `tabIndex`（避免伪焦点）
- `/workspace/src/components/map/TransportLayer.tsx`
  - 同上处理：tooltip 已有，键盘 Enter 可触发 `<title>` 显示（浏览器原生）或自定义 popover
- `/workspace/src/components/map/FoodLayer.tsx`
  - 第 3 轮已改 role=button + onKeyDown，本轮复核
- `/workspace/tests/e2e/tourism.spec.ts`
  - 新增：键盘 Tab 到美食点位 → Enter → 跳转详情页（依赖轮次 3）
  - 新增：键盘 Tab 到政府标记 → 有可识别的 aria-label

**验证**：
- `npm run check && npm run lint && npm test` 全绿
- `npm run build` 通过
- E2E 键盘用例通过

**提交信息**：`feat: 地图图层键盘无障碍统一，补 onKeyDown 与 role=button`

---

### 轮次 5：verifiedAt 周期校验（方向 5）

**目标**：validate.ts 加过期降级规则，TransportHub.verifiedAt 必填化。

**变更文件**：
- `/workspace/src/types/index.ts`
  - 第 234 行 `verifiedAt?: string` → `verifiedAt: string`（必填）
- `/workspace/src/data/transport.ts`
  - 确认 8 个枢纽已全部显式赋值（探索确认均为 2026-08-17，无需改数据）
- `/workspace/src/data/validate.ts`
  - 新增常量 `VERIFICATION_STALE_DAYS = 180`（半年）
  - 新增辅助函数 `isStale(verifiedAt: string): boolean`：`today - verifiedAt > VERIFICATION_STALE_DAYS`
  - food（第 137 行附近）：published 状态下若 `isStale` 则报错"美食 {id} 已超 180 天未复核"
  - publishedAttractions（第 149 行附近）：同上
  - transportHubs（第 141-146 行）：新增 verifiedAt 必填与格式校验 + 过期校验
  - routes（第 183 行）：新增 verifiedAt 日期格式校验 + 过期校验
  - 政府标记（config.ts governmentMarkers）：纳入校验
- `/workspace/src/data/validate.test.ts`
  - 新增：verifiedAt 超 180 天 → 报错
  - 新增：TransportHub 缺 verifiedAt → 报错
  - 新增：route verifiedAt 格式非法 → 报错
- `/workspace/scripts/validate-data.ts`
  - 复核 assertValidContentData 输出包含新规则
- `/workspace/docs/content/CONTENT_AUDIT.md`
  - 说明周期校验阈值与降级策略

**验证**：
- `npm run validate:data` 通过（当前所有 verifiedAt 在 2026-08，未过期）
- `npm test` 通过（含新用例）
- 临时把某条 verifiedAt 改 2025-01-01 验证报错，再改回

**提交信息**：`feat: verifiedAt 周期校验门禁，TransportHub.verifiedAt 必填化`

---

### 轮次 6：图层 React.memo 性能优化（方向 6）

**目标**：map 目录下所有图层组件包 React.memo，减少不必要重渲染。

**变更文件**：
- `/workspace/src/components/map/FoodLayer.tsx`
- `/workspace/src/components/map/GovernmentLayer.tsx`
- `/workspace/src/components/map/TransportLayer.tsx`
- `/workspace/src/components/map/AttractionLayer.tsx`
- `/workspace/src/components/map/MapRegionLayer.tsx`
- `/workspace/src/components/map/MapPreview.tsx`
- `/workspace/src/components/map/MapControls.tsx`

**统一改法**：
- 把 `export default function Foo(props) { ... }` 改为 `function Foo(props) { ... }` + `export default memo(Foo)`
- 引入 `import { memo } from 'react'`
- 不改变 props 接口与渲染逻辑
- 对接受回调 props 的组件（如 FoodLayer 的 onSelect），确保父组件用 useCallback 稳定引用，否则 memo 失效

**附加**：
- `/workspace/src/components/NingxiaInteractiveMap.tsx`
  - 检查传给图层的回调是否需要 `useCallback` 包裹（如 onSelect、project）
  - project 函数若每次渲染重建，需用 useMemo

**验证**：
- `npm run check && npm run lint && npm test` 全绿
- `npm run build` 通过
- E2E 不回归
- 可选：用 React DevTools Profiler 确认图层不再无意义重渲染（本地手动）

**提交信息**：`perf: 地图图层组件 React.memo 化，稳定回调引用`

---

### 轮次 7：CONTRIBUTING.md（方向 7）

**目标**：补数据贡献指南，降低后续维护成本。

**变更文件**：
- `/workspace/CONTRIBUTING.md`（新建）
  - 章节：
    1. 数据贡献流程（fork → 改 data/*.ts → 跑 validate:data → PR）
    2. 数据规范：
       - `id` 必须 kebab-case ASCII
       - `status` 与 `verificationLevel` 含义
       - `sources` 至少 1 条可核实来源，SourceLevel 优先级
       - `verifiedAt` 格式 YYYY-MM-DD，半年内有效
       - 餐厅 `Restaurant` 不含 phone
       - `TransportHub` 必填 verifiedAt
    3. 反糟粕门禁清单（重复双写、模板电话、`| string`、异常 ID）
    4. 图层开发规范（role=button + onKeyDown + memo）
    5. 测试要求（vitest + playwright）
    6. 提交信息规范（conventional commits）
- `/workspace/README.md`
  - 在"贡献"或"维护"章节加链接到 CONTRIBUTING.md

**验证**：
- `npm run build` 通过（README 改动不影响构建）
- `npm run validate:data` 通过
- 手动核对指南中的命令与字段名与代码一致

**提交信息**：`docs: 新增 CONTRIBUTING.md 数据贡献与开发规范`

---

## 假设与决策

1. **分支策略**：每轮新建 `trae/opt-round-<n>` 分支，独立 PR，`gh pr merge --squash --admin` 合并。避免长生命周期分支。
2. **来源真实性**：轮次 1 的美食来源由我基于公开文旅资料补全；若某条无法找到可核实来源，保持 draft 并在 CONTENT_AUDIT.md 标注原因，不强行转正。
3. **timeSlots 时段合理性**：轮次 2 的时段基于现有 stops 推算，不引入新景点；时段与景点开放时间常识一致（如博物馆 09:00-17:00）。
4. **VERIFICATION_STALE_DAYS = 180**：半年阈值，与 CONTENT_AUDIT.md 复核周期对齐。可后续调整。
5. **React.memo 回调稳定**：轮次 6 必须配合 useCallback/useMemo，否则 memo 无效；此为必要附加工作。
6. **E2E 浏览器**：探索阶段已知 Playwright 浏览器下载受限；E2E 用例仍写，但若本地无法跑通，以单元测试 + 构建校验 + browser 子代理验证替代，与上一轮策略一致。
7. **每轮收尾**：合并到 main 后本地 `git checkout main && git pull`，再开下一轮分支。
8. **不越界**：每轮只做该方向相关改动，不顺手重构无关代码。

## 验证步骤（每轮通用）

1. `npm run validate:data` — 数据校验门禁
2. `npm run check` — TypeScript 类型检查
3. `npm run lint` — ESLint
4. `npm test` — Vitest 单元测试
5. `npm run build` — 生产构建（含 sitemap）
6. `npm run test:e2e` — Playwright（若浏览器可用；否则用 browser 子代理）
7. `git diff` 自审 + 提交 + 推送 + 合并 main

## 全部 7 轮完成后的最终交付

- 7 个独立 PR 全部合并到 main
- 每轮提交信息清晰、可追溯
- CONTENT_AUDIT.md 与 CONTRIBUTING.md 反映最终状态
- 代码库：美食模块全量发布 + 详情页闭环、路线时间槽全覆盖、图层无障碍 + memo 化、数据周期校验门禁、贡献文档齐备
