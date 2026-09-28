# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

「塞上江南 · 宁夏旅行地图」：面向国内游客的**纯静态**旅行规划站。React SPA + 自研 SVG 交互地图，无后端、无第三方地图 SDK。

核心约束是**内容可核实性**：每个景点 / 美食 / 交通枢纽都带 `verificationLevel`、官方来源与 `verifiedAt` 核实日期，并由构建期门禁强制校验（过期即阻断构建）。仓库的文档、注释、提交信息、内容全部使用中文。

- 站点内容规模：5 个地级市、22 个已发布景点、9 条主题路线、14 道美食、8 个交通枢纽、26 篇手记 Markdown（15 篇 `published`，11 篇 `draft`；其中 3 篇 `demo` 保留为示例）
- 当前版本 `v0.3.139`，发布快照见 `docs/RELEASE_STATUS.md`

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | Vite 开发服务器（默认 `http://localhost:5173`） |
| `npm run build` | `validate:data` → `tsc -b` → `vite build` → 生成 sitemap |
| `npm run check` | 仅类型检查（`tsc -b --noEmit`） |
| `npm run lint` | ESLint 全量 |
| `npm test` | Vitest 单次运行 |
| `npm run test:watch` | Vitest watch |
| `npm run test:e2e` | Playwright（自动先 `build` + `preview` 到 4173） |
| `npm run validate:data` | 数据完整性 + 反糟粕门禁（**阻断构建**） |
| `npm run validate:data:reminder` | 170—180 天核实周期软提醒（warning-only，不阻断） |
| `npm run content:lint` | 手记 Markdown / Frontmatter lint |
| `npm run new:article` | 基于模板新建手记 Markdown |
| `npm run verify:pages-fallback` | 校验 Pages 深层链接回退产物 |
| `npm run quality:lighthouse` | 移动端 Lighthouse 门禁（性能 ≥ 0.9） |
| `npm run process:images` | 批量生成 WebP/AVIF 多尺寸图片 |
| `npm run simplify:map` | 简化 GeoJSON 边界坐标 |

### 运行单个测试

```bash
npx vitest run src/data/validate.test.ts     # 按文件
npx vitest run -t "kebab"                    # 按用例名
npx playwright test -g "地图"                 # 按用例名
npx playwright test --project=chromium-mobile  # 仅移动端 viewport
npx playwright test --config=playwright.local.config.ts # 本机复用 Puppeteer Chromium
```

E2E 首次需 `npx playwright install chromium`。本机若无 Playwright 自带浏览器，仓库工作区里有未纳入版本控制的 `playwright.local.config.ts`（复用 Puppeteer 下载的 Chromium），用法见该文件顶部注释。

已知既有 flake：`旅行手记栏目切换保持轻量反馈` 在 `chromium-mobile` 上会间歇失败（`toHaveCSS('background-color', ...)` 停在过渡中间值）。该用例在未改动的 HEAD 上也复现，与本机负载有关，不要当成新引入的回归去查；CI 上未出现。

### 提交前自检（全绿才算完成）

```bash
npm run validate:data && npm run check && npm run lint && npm test && npm run build
```

涉及 UI / 交互变更时额外跑 `npm run test:e2e`（桌面 + 移动两个 viewport 都必须通过）。

## 架构

### 数据层：TypeScript 模块即唯一数据源

内容数据**不是 JSON**，而是 `src/data/*.ts` 下的 TS 模块（`attractions.ts` / `cities.ts` / `routes.ts` / `foods.ts` / `transport.ts` / `guide.ts` / `discovery.ts` / `meta.ts`），类型定义集中在 `src/types/index.ts`。

- 每个数据模块导出全量数组与 `publishedXxx` 派生数组；`status: 'draft'` 的条目不进地图、列表与 sitemap
- `src/data/validate.ts` 是纯函数校验层（可被单元测试直接调用，不依赖文件系统），`scripts/validate-data.ts` 在其上补充需要文件系统 / 跨文件的检查（JSON 双写、图片多格式完整性、类型安全削弱）
- `public/data/` 只放 GeoJSON 地图边界（唯一源），**不得**与 `src/data/` 出现同名 JSON
- 例外：`GovernmentMarker` 定义在 `src/components/map/config.ts` 而非 `src/data/`，但同样受 180 天核实周期校验

`src/lib/site.ts` 提供跨层工具：`assetUrl()`（补 `import.meta.env.BASE_URL` 前缀）、`siteDateString()`（按 `Asia/Shanghai` 取今日，校验层的时间基准）、`getVerificationFreshness()`（90/180 天分档）。

**图片路径约定**：页面里给 `<ResponsiveImage src="/images/foo/bar.webp">` 传以 `.webp` 结尾的路径，组件内部会剥掉扩展名并拼出 `bar-720.webp` / `bar-1440.webp` / 同名 `.avif` 四档，再逐个经 `assetUrl()` 补前缀。因此新增图片必须按 `<name>-720.webp`、`<name>-1440.webp`、`<name>-720.avif`、`<name>-1440.avif` 命名（用 `npm run process:images` 生成），否则图片完整性门禁会阻断构建。

### 手记内容管线：Markdown → Vite 虚拟模块

手记是唯一以 Markdown 承载的内容类型，走构建期解析而非运行时 fetch：

```
src/content/journal/*.md
  → scripts/load-journal-files.ts       读取目录（Node 侧）
  → src/content/journal-parser.ts       解析 YAML Frontmatter + 正文，校验必填字段
  → vite.config.ts 的 journalContentPlugin  暴露为虚拟模块 virtual:journal-content
  → src/content/journal.ts              应用侧唯一入口：journalEntries / publishedJournalEntries / getJournalEntry
```

该插件同时处理 HMR：只有 `src/content/journal/**/*.md` 的变更会失效虚拟模块。手记 Frontmatter 按 `type`（`travel` / `food` / `guide`）分化出不同必填字段，缺失字段会一次性聚合抛出。

注意 `src/content/journal.ts` 里的 `isPublishedJournalEntry`：即使 `status: published`，也要求 `guide` 类型必须是 `contentKind: editorial`、其余类型必须是 `firsthand` 才会真正公开（`demo` 一律不上线）。`publishedJournalEntries` 按 featured → updatedAt → publishedAt → 标题排序。

### 地图模块（`src/components/map/`）

自研 SVG 地图，`NingxiaInteractiveMap.tsx` 是根组件，负责数据加载与状态编排：

- **投影**：`projection.ts` 做 WGS84 → SVG 投影（`mapView = { width: 720, height: 920 }`），提供 `createProjection` / `getFeatureBounds` / `containsCoordinates`
- **视口**：`useMapViewport.ts` 用 Pointer Events 实现缩放 / 平移，对外暴露 `zoom` / `pan` / `viewportHandlers`
- **数据加载**：省界按 `window.matchMedia('(max-width: 768px)')` 选择 `ningxia-province.json` 或 `ningxia-province-mobile.json`；进入城市时按需拉取区县文件，用 `AbortController` + `Map` 缓存去重
- **图层**：`MapRegionLayer` / `AttractionLayer` / `FoodLayer` / `TransportLayer` / `GovernmentLayer` / `MapLabelLayer` 各自独立；`config.ts` 持有 `cityColors`、`governmentMarkers`、`districtFileByCode` 等配置与键盘工具
- **性能约定**：所有图层组件用 `React.memo` 包裹（`export default memo(Foo)`）；父组件传入的回调必须 `useCallback` 稳定、计算数组必须 `useMemo`，否则 memo 失效；`project` 投影函数用 `useMemo` 缓存
- **无障碍约定**：可交互图层（景点、有 `onSelect` 的美食）用 `role="button"` + `onKeyDown`（经 `activateWithKeyboard` 支持 Enter/Space）；纯展示图层（政府标记、交通枢纽、无 `onSelect` 的美食）用 `role="img"` + 可读 `aria-label`，不进 Tab 顺序、不加透明热区

### 路书模块（`src/lib/roadbook.ts` + `src/components/roadbook/`）

路线详情页内嵌路线地图与按天流线，`/routes/:routeId/roadbook` 提供可打印、可分享的独立竖版路书。`buildRoadbookModel()` 将 `RoutePlan.days[].stops` 转为跨天连续编号：只有能解析到**已发布景点**的停靠点才带坐标并参与按天地图连线；市区 / 车站等只有 `mapQuery` 的停靠点保留在文字流线中并标为 `queryOnly`。`RouteRoadbookMap` 进入视口后才懒加载省界 GeoJSON，`RouteRoadbookPoster` 则生成自包含静态 SVG。

修改导出海报时必须保持三条约束：样式内联、禁止跨域位图、禁止入场动画；`src/lib/export-svg.ts` 会把 SVG 序列化后以 2 倍尺寸栅格化为 PNG，并优先调用 `navigator.share({ files })`，不支持时下载文件。独立路书页必须等省界数据和海报重渲染完成后再序列化，否则会导出缺少底图的残缺图片。海报的 `features` 加载失败可以回退为空数组，路线文字版仍必须可用。

### 应用外壳与路由

`src/App.tsx` 是唯一的应用外壳，承载所有横切关注点，新增页面时不要重复实现：

- `basename={import.meta.env.BASE_URL}`；页面全部 `React.lazy` 懒加载
- 全局唯一 `<main id="main-content" tabIndex={-1}>`——页面组件内部只能用 `<div>` 或语义化 section，**不得**再嵌套第二个 `<main>`
- `RouteFocusManager` 在 pathname 变化后把焦点交给 `#main-content`（移动端菜单按钮例外，保留其焦点）；`RouteAnnouncer` 用 `aria-live` 播报新标题（pathname + search 都触发）
- `ScrollToTop` 只在 pathname 变化时回顶，search 参数变化保留滚动位置
- `/dev/geojson`、`/dev/editor` 仅在 `import.meta.env.DEV` 下注册
- 导航入口列表统一维护在 `src/lib/site-navigation.ts`，顶部导航 / 移动菜单 / 页脚三处共用同一份定义与路径匹配
- 列表页筛选统一走 `src/lib/useSearchParamsFilter.ts`（URLSearchParams 同步 + 面板折叠态）

### 构建期门禁

`npm run validate:data` 任一失败都会阻断发布（`npm run build` 第一步就执行它）：

| 门禁 | 内容 |
| --- | --- |
| 重复 JSON 双写 | `src/data/` 与 `public/data/` 不允许同名 JSON |
| 模板化电话 | 拒绝 `0951-12306` 等模板号码 |
| 类型安全削弱 | `src/types/index.ts` 的联合类型禁止出现 `\| string` 放宽 |
| 异常 ID | 所有 `id` 必须匹配 `/^[a-z0-9]+(-[a-z0-9]+)*$/` |
| 电话区号匹配 | 交通枢纽电话区号须与所在城市一致 |
| verifiedAt 过期 | 超过 **180 天**未复核即阻断 |
| 占位文本 | 拒绝「示例」「演示用」「待填写」「example.com」等 |
| 跨数据引用 | 路线 / 兴趣组合只能引用已发布景点 |
| 图片完整性 | 已发布景点与手记图片必须具备 WebP + AVIF 两档本地文件 |

## 必须遵守的约定

以下几条是这个仓库里最容易踩、且 E2E 会直接断言的约定：

1. **内容来源分级**：`published` 条目至少需要 1 条 `kind: 'official'` 来源，每条来源必须含 `label` / `url` / `kind` / `level` / `coverage` / `checkedAt`。`verificationLevel` 为 `verified` 需要官方直接专页 + 准确实景图，否则只能标 `review`。
2. **UGC 素材**：来自 sister 仓库（`Minkelxy/ningxia-scraper`，对接手册见 `XHS-SCRAPER-REFERENCE.md`）的素材只能作线索，产出 journal **必须**是 `review` 级，必须经 `xhs-to-content-kit.ts` 转换（相似度 < 30%、连续汉字段 < 20 字），并保留 `source_xhs_noteId` / `source_xhs_url` 以便下架联动。不要直接把正文贴进主项目 PR。
3. **无障碍与触控**：`CONTRIBUTING.md` 的「测试要求 / 导航语义」两节是全站规范细则（44px 触控热区、`aria-current="page"`、`aria-pressed`、焦点回收、悬停只做主题色变化而不整体位移等）。E2E 会断言这些样式，改样式前先读该节。
4. **减少动效**：任何新增动画都必须提供 `prefers-reduced-motion` 下的静态回退（通常恢复静态墨线 / 圆环 / 内容），这是本项目逐版本反复强调的硬约束。
5. **提交信息**：Conventional Commits（`feat:` / `fix:` / `docs:` / `perf:` / `refactor:` / `test:` / `chore:`），描述用中文。

## 发布流程

版本号格式 `v主.次.修订`。一次发布通常拆成两个提交，按此顺序：

1. `feat: ...` —— 代码改动，同时把 `package.json` 的 `version` 递增
2. `docs: record vX.Y.Z ...` —— 同步更新以下文档：
   - `CHANGELOG.md`（新增版本段落，含「主题」与要点）
   - `docs/RELEASE_STATUS.md`（记录最终提交哈希、CI 工作流链接与通过状态、单测 / E2E 条数、sitemap 页数）
   - `docs/README.md` 顶部的版本更新说明
   - `README.md` 中引用的当前发布快照版本
   - `docs/content/CONTENT_AUDIT.md` 顶部的复核日期与本轮说明
   - `docs/product/DEPLOYMENT.md`、`docs/product/DEVELOPMENT_PLAN.md`、「当前发布快照 / 当前版本」与新增版本条目
   - `docs/product/宁夏旅游地图PRD.md` 与 `宁夏旅游地图技术架构.md` 的「发布补充」与「当前实现快照」

`docs/RELEASE_STATUS.md` 里的单测 / E2E 条数与 Lighthouse 分数必须取自 push 后真实 CI 运行日志，不得凭本地结果或估计填写。版本号也可能已被远端占用（他人或其他会话先发布了同一版本号）：递增前先 `git fetch` 确认，冲突时同时改 `package.json` 与 `package-lock.json` 并顺延到下一个版本号。

## 部署

GitHub Actions（`.github/workflows/deploy.yml`）在 push/PR 到 `main` 时依次执行：`npm ci` → `npm audit` → `validate:data` → 提醒脚本 → `tsc` → ESLint → Vitest → Playwright E2E → `build` → Pages 回退校验 → Lighthouse → 部署 GitHub Pages。

Vite `base` 在 `vite.config.ts`：`GITHUB_ACTIONS` 环境下强制 `/ningxia-tourism/`，本地默认 `/`，可用 `VITE_BASE_URL` 覆盖：

```bash
VITE_BASE_URL=/ningxia-tourism/ npm run dev
VITE_BASE_URL=/ningxia-tourism/ npm run build && npm run preview
```

`public/404.html` 是 GitHub Pages 的 SPA 深层链接回退，`npm run verify:pages-fallback` 校验该产物。`public/sw.js` 提供 PWA 离线缓存。

## 更多文档

`docs/README.md` 是文档总索引。按需查阅：`docs/product/宁夏旅游地图技术架构.md`（架构）、`docs/product/DATA_DICTIONARY.md`（字段字典）、`docs/product/DEPLOYMENT.md`（部署细节）、`docs/content/CONTENT_AUDIT.md`（内容分级审计与复核日期）、`docs/content/MAINTENANCE.md`（内容维护准则）、`docs/templates/`（手记 / 路线模板，不参与发布）。
