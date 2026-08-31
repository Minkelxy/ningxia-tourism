# 更新日志（CHANGELOG）

> 记录重要版本里程碑与发布内容。小修小补与日常内容复核见 [`docs/content/CONTENT_AUDIT.md`](./docs/content/CONTENT_AUDIT.md)，本文件只记录影响范围较大、对用户或贡献者可见的变更。

版本号格式：`v主.次.修订`，主版本对齐产品阶段（v0.x = 预览期）。

---

## [v0.3.5] — 2026-09-01

### 主题：链接卡片键盘反馈统一

- 首页路线结果、行前指南天数卡、收藏列表和全站搜索结果在键盘聚焦时与鼠标悬停保持一致的抬升、边框和背景反馈。
- 搜索结果保留分组内的分隔线层次，同时扩大聚焦背景的可读区域。

## [v0.3.4] — 2026-09-01

### 主题：地图图层语义与焦点细节收口

- 美食图层在纯展示模式下不再进入 Tab 顺序，也不显示可点击光标；交互模式继续支持 Enter / Space 激活。
- 美食卡片键盘聚焦时与景点、路线、专题卡片保持一致的图片反馈和边框过渡。
- 新增 FoodLayer 组件级回归测试，覆盖纯展示与交互两种语义。

## [v0.3.3] — 2026-09-01

### 主题：导航与页面加载细节优化

- 移动端导航补充当前页面标记，键盘与读屏用户能明确知道所在位置。
- 首页地图锚点增加吸顶导航偏移，点击“按地图探索”后标题不会被遮挡。
- 旅行手记画廊补齐响应式尺寸提示，减少图片加载时的页面跳动。
- 地图景点预览支持关闭后焦点回到原点位，移动端预览滚动不会把滚动链传给整页。
- 清理已下线视觉画廊的残留样式，保持样式表与当前页面结构一致。
- 统一全站搜索框的标签结构、聚焦反馈与窄屏结果摘要布局。
- 移除政府标记与交通枢纽的无动作键盘焦点，保留地图读屏语义。
- 统一景点、路线、专题卡片与列表筛选框的鼠标悬停和键盘聚焦反馈。

---

## [v0.3.2] — 2026-08-25

### 主题：视觉、文档与发布收口

- **视觉统一**：统一全站色彩令牌、卡片、徽标、页脚、焦点态与响应式布局。
- **图片来源边界**：景点、路线、美食、指南、手记、搜索、关于和 404 页面统一记录网络实拍或官方图片的来源、作者与许可，并标注参考图的使用边界。
- **发布文档**：新增 [`docs/RELEASE_STATUS.md`](./docs/RELEASE_STATUS.md)，同步当前数据规模、本地验收命令和 GitHub Pages 发布入口。
- **合并收口**：纳入远端数据、文档、媒体资源与验证提醒工作流，修正合并后 ESLint 未使用导入问题。

---

## [v0.3.1] — 2026-08-24

### 主题：verifiedAt 180 天阻断前置软提醒机制

#### 🛠️ 工程与 CI/CD
- **新增 `VERIFICATION_REMINDER_DAYS = 170` + `daysUntilStale / isInReminderWindow` 纯函数**（`src/data/validate.ts`），复用 180 天阻断的时间基准，避免重复逻辑；单元测试覆盖 9/10/11/170/179/180/181 天等 8 条临界日。
- **新增脚本 `scripts/check-verification-reminder.ts`**：
  - 扫描 5 类数据（景点 / 美食 / 交通枢纽 / 路线 / 政府标记）的 `verifiedAt`，进入 ≤ 170 天窗口就列告警表格；
  - 支持 `--format=human | json` 两种输出；支持 `--exit-zero`（默认，构建步骤不阻断）与 `--exit-code`（CI schedule 判断「有提醒」）。
  - 在 `GITHUB_ACTIONS=true` 环境下每条提醒同步打 `::warning` 注解（PR 详情页黄条直观可见）。
- **新增单元测试 `src/test/check-verification-reminder.test.ts`**：纯函数 5 条 + CLI 退出码 3 条，共 8 条新用例。
- **`package.json` 两条命令**：`npm run validate:data:reminder`（本地排查）；`npm run validate:data:reminder:ci`（CI 读 JSON）。
- **部署流水线新增软提醒步骤**：`.github/workflows/deploy.yml` build job 在 Step 5 Validate data 之后插入 Step 5.1 Verification reminder，warning-only；硬阻断仍由 Step 5 负责。
- **新增每周一自动提醒 workflow**：`.github/workflows/verification-reminder.yml`（`cron: 0 1 * * 1` = 每周一 09:00 CST 左右运行）；若有进入窗口条目：
  - 首次扫描当天自动开 Issue，标签 `content / verification-reminder / weekly`；
  - 标题带日期去重；若下周一仍为同一批条目未处置，不改 Issue 内容只追加一句 comment，不重复建 Issue。

#### 📚 文档同步
- `docs/product/DEPLOYMENT.md`：build job 步骤表插入 Step 5.1；FAQ 新增「CI 黄条含义」和「每周提醒是否重复」两条。
- `docs/product/DATA_DICTIONARY.md`：通用校验规则追加「170–180 天软提醒窗口」说明。
- `CONTRIBUTING.md`：数据校验门禁表新增 ⏰ 软提醒行，标注位置与作用范围。
- `docs/product/DEVELOPMENT_PLAN.md`：v0.3 交付补充；阶段四工程化完成项追加本机制。

---

## [v0.3.0] — 2026-08-18

### 主题：文档整理与工程规范化

#### 📚 文档
- **README.md**：重写；补徽章、核心特性、技术栈、完整命令表、项目树、路由一览、校验门禁表、文档索引、部署摘要与致谢
- **docs/README.md**：新增文档总索引与「你想做什么 → 看哪篇」向导
- **docs/product/DEPLOYMENT.md**：新增；GitHub Actions 流水线 12 步详解、Vite base 规则、SPA 回退、PWA、本地模拟 CI、Netlify / Vercel / Nginx 部署模板、常见问题排查
- **docs/product/DATA_DICTIONARY.md**：新增；TS 类型对应的人类可读字段速查表，含枚举、必填、校验、反糟粕门禁
- **docs/product/宁夏旅游地图技术架构.md**：同步 `/favorites`、`/search`、PWA、统一搜索、LazyInteractiveMap 等当前实现
- **docs/product/DEVELOPMENT_PLAN.md**：版本节奏与里程碑更新
- **docs/product/宁夏旅游地图PRD.md**：补全 `/favorites`、`/search`、收藏、对比、路线打印、统一搜索、图片懒加载等已完成能力

#### 📦 工程规范
- 在 README 与 CONTRIBUTING 中确立「validate:data → check → lint → test → build」5 步自检顺序
- 明确 docs/ 目录产品 / 内容 / 模板三分法与跨文档引用规范
- CHANGELOG.md 首次建立

---

## [v0.2.0] — 2026-08-17

### 主题：7 轮持续优化（美食 / 路线 / 图层 / 门禁 / 文档）

| 轮次 | 方向 | 关键交付 |
|------|------|---------|
| 1 | 美食草稿转正 | 14 道美食全部 `published`（手抓羊肉 / 蒿子面为国家级非遗直接专页 → `verified`，其余 12 道 `review`） |
| 2 | 路线时间槽补齐 | 9 条路线 25 个行程日 `timeSlots` 全覆盖；RouteDetail 在无槽时显示占位提示 |
| 3 | 美食详情页联动 | 新增 `/foods` 列表、`/food/:id` 详情；`FoodLayer` 点击跳转详情；导航加「美食」入口；sitemap 纳入美食 URL；E2E 新用例 |
| 4 | 图层键盘无障碍 | 景点 / 美食图层 `role="button"` + `onKeyDown`；交通 / 政府图层保持 `role="img"` + 可读 `aria-label`；E2E 覆盖键盘跳转与语义 |
| 5 | verifiedAt 周期校验 | `VERIFICATION_STALE_DAYS=180` 过期阻断构建；覆盖 Attraction / Food / TransportHub / RoutePlan / GovernmentMarker 五类；`TransportHub.verifiedAt` 由可选改必填；单元测试临界日用例 |
| 6 | 图层 React.memo 化 | `AttractionLayer / FoodLayer / TransportLayer / GovernmentLayer / MapRegionLayer / MapPreview / MapControls` 全部 `memo`；父组件回调 `useCallback`、投影 `useMemo` 稳定引用 |
| 7 | CONTRIBUTING.md | 新增：贡献流程、ID 规范、状态/核实等级、来源分层、verifiedAt 时效、餐厅无 phone、交通枢纽必填、构建门禁清单、图层 a11y/memo 开发规范、测试要求、Conventional Commits |

#### 其它
- 银川河东国际机场类型 `highspeed_rail → airport`，交通图层应用飞机图标与专用样式
- 餐厅 `phone` 字段从数据模型与界面移除；旧模板号码 `0951-12306` 全部清除
- 8 个交通枢纽补齐 description / address / sources
- 6 个政府标记（1 自治区 + 5 市）作为导航锚点，全部带来源与 180 天核实日期
- 首页路线按 1—5 天即时匹配；最近 3 篇资料型专题同步展示

---

## [v0.1.0] — 2026-08-15

### 主题：基础框架与核心功能首次可用

- ✅ **技术栈**：React 18.3 + TypeScript 5.8 + Vite 6 + Tailwind 3.4 + React Router DOM 7
- ✅ **自研 SVG 地图**：基于宁夏省级 GeoJSON + 五市区县边界，WGS84 投影、缩放（1–2.4x）、拖拽平移（Pointer Events）、区域高亮
- ✅ **5 个图层**：行政区域 / 景点 / 美食 / 交通枢纽 / 政府标记
- ✅ **22 个 published 景点**（20 verified + 2 review），每景点附图片（WebP + AVIF 两档）、开放信息、参考票价、预约、时长、季节、交通、WGS84 坐标、来源、核对日期、图片许可
- ✅ **5 个地级市页**：旅行角色、建议停留、适合人群、抵达方式、行程提醒，含「黄河坛 vs 中华黄河楼」「隆德长征景区 vs 泾源森林公园」等决策提示
- ✅ **9 条主题路线**：覆盖 1—5 天，逐日停靠点、节奏/步行量/交通画像；路线页按天数 / 城市筛选
- ✅ **资料型旅行专题**：15 篇 `editorial`，覆盖五市；支持标题 / 地点 / 标签 / 旅行问题搜索，筛选同步到 URL；`featured` 专题首页展示
- ✅ **构建期数据门禁**：ID 格式、模板电话、类型安全、占位文本、跨数据引用、图片多格式完整性
- ✅ **行前指南**：四季建议、跨城原则、清单、网络来源与核对日期
- ✅ **收藏 / 对比 / 统一搜索**：`/favorites` 基于 localStorage；景点最多 3 个横向对比；`/search` 统一检索景点 / 美食 / 城市 / 路线 / 专题
- ✅ **性能与 PWA**：路由级 lazy 代码分割、图片 eager/lazy、首屏地图近视口加载、移动端简化边界；Service Worker + manifest；移动端 Lighthouse ≥ 0.9 门禁
- ✅ **测试体系**：Vitest（数据校验、投影、工具、组件）；Playwright E2E 桌面 + 移动双 viewport
- ✅ **CI/CD**：GitHub Actions 12 步流水线（含 Lighthouse 门禁）→ GitHub Pages；`public/404.html` SPA 深层链接回退
- ✅ **GeoJSON 开发工具**：`/dev/geojson` 边界查看器、`/dev/editor` 编辑器（仅开发环境注册）

---

## [未发布 / 规划中]

- v0.4 主题：内容补全（亲历游记 ≥ 5 篇，探店手记 ≥ 3 篇，南关清真大寺 / 中华黄河楼补直接来源升 verified，草稿景点中华回乡文化园转正）
- v0.5 主题：功能增强收尾（路线打印样式、移动端体验细节打磨、视觉回归测试）
- v0.6 主题：性能与工程化（CI 缓存优化、React 19 / Vite 7 评估、国际化 i18n 评估、CMS/API 化评估）

详细规划参见 [docs/product/DEVELOPMENT_PLAN.md](./docs/product/DEVELOPMENT_PLAN.md)。
