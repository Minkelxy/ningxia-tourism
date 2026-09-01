# 贡献指南

感谢参与宁夏旅行地图的维护。本指南说明数据贡献流程、数据规范、构建期门禁和开发约定，帮助你在提 PR 前自检。

当前发布快照、数据规模和完整验收命令见 [docs/RELEASE_STATUS.md](docs/RELEASE_STATUS.md)。

## 快速开始

需要 Node.js 22 或更新版本。

```bash
git clone <your-fork>
cd ningxia-tourism
npm install
npm run dev
```

本地开发服务器启动后，修改 `src/data/` 下的数据文件即可热更新。

## 贡献流程

1. **Fork 并创建分支**：从 `main` 切出 `feat/your-topic` 或 `fix/your-topic`。
2. **修改数据或代码**：编辑 `src/data/*.ts` 中的数据文件或 `src/` 下的组件。
3. **本地自检（必须全绿）**：
   ```bash
   npm run validate:data   # 数据完整性 + 反糟粕门禁
   npm run validate:data:reminder # 170—180 天核实周期软提醒
   npm run check           # TypeScript 类型检查
   npm run lint            # ESLint
   npm test                # Vitest 单元测试
   npm run build           # 生产构建 + sitemap 生成
   npm run verify:pages-fallback # GitHub Pages 深层链接回退产物
   ```
4. **E2E 测试（涉及 UI 变更时）**：
   ```bash
   npx playwright install chromium   # 首次需要
   npm run test:e2e
   ```
5. **提交并发起 PR**：使用 Conventional Commits 格式（见下文），PR 标题与提交信息保持一致。

涉及页面结构时，请保持应用外壳提供的唯一 `<main id="main-content">`；页面组件内部使用 `<div>` 或语义化 section，不要再嵌套第二个 `<main>`。涉及搜索、收藏、错误状态或开发工具页时，至少补一条“页面仅有一个主内容区域”的端到端回归。带输入框的页面可为桌面端提供自动聚焦，但移动端应避免进入页面即唤起系统键盘，并分别覆盖两种端型的焦点状态。搜索词或筛选参数变化时，也要保留页面状态播报；同一路径参数更新不得依赖整页跳转才能被辅助技术感知。

## 数据规范

所有内容数据位于 `src/data/` 下，以 TypeScript 模块形式维护（非 JSON），类型定义在 `src/types/index.ts`。

### ID 规范

所有 `id` 字段必须符合 kebab-case ASCII：

```
/^[a-z0-9]+(-[a-z0-9]+)*$/
```

- 合法：`shizuishan-station`、`yinchuan-airport`、`baba-cha`
- 非法：`làhúhu`（含非 ASCII）、`Yinchuan_Station`（大写 + 下划线）、`123 456`（含空格）

### 状态与核实等级

| 字段 | 可选值 | 含义 |
| --- | --- | --- |
| `status` | `published` / `draft` | `published` 进入地图、列表和站点地图；`draft` 隐藏，不公开 |
| `verificationLevel` | `verified` / `review` | `verified` 需要官方直接专页 + 准确实景图片；`review` 有来源但不足直接专页级 |

### 来源（sources）

`published` 状态的内容至少需要 1 条 `kind: 'official'` 来源。来源层级优先级：

| SourceLevel | 含义 | 例子 |
| --- | --- | --- |
| `direct` | 景点/项目的官方直接专页 | 景区官网、非遗项目专页 |
| `directory` | 目录级页面，列出但不专述 | 文旅厅景区列表 |
| `homepage` | 机构首页，仅证明机构存在 | 政府门户网站首页 |

每条来源必须包含 `label`、`url`、`kind`、`level`、`coverage` 和 `checkedAt`（`YYYY-MM-DD`）。

### 小红书素材候选池 (UGC 线索级来源)

对于「亲历游记 / 探店手记 / 专题 editorial」类的 review 级内容，项目维护一条
独立 sister 仓库作为 UGC 线索候选池：

- **仓库**：[Minkelxy/ningxia-scraper](https://github.com/Minkelxy/ningxia-scraper)
  - 当前支持小红书，未来将整合微博 / 携程等平台
- **对接手册**：[`XHS-SCRAPER-REFERENCE.md`](./XHS-SCRAPER-REFERENCE.md)
- **使用规则**：
  1. UGC 素材仅作「线索」；产出的 journal `verificationLevel` **必须**为 `review`，不得标 `verified`。
  2. 正文必须通过 sister 仓库 `scripts/xhs-to-content-kit.ts` 转换器生成，确保与原文相似度 <30%、连续汉字段 <20 字。
  3. 每条转换后的 journal 必须保留 `source_xhs_noteId` 和 `source_xhs_url`，以便溯源与下架联动。
  4. 素材库侧作者若提交下架申请，主项目需在 24–48 小时内同步把对应 journal 置 draft。
- **贡献线索**：不要直接贴正文到主项目 PR；前往 sister 仓库按 README「半人工投喂」流程
  发 PR 提交 HTML 快照即可。

### verifiedAt 时效性

- 格式：`YYYY-MM-DD`（如 `2026-08-17`）
- 不能晚于当前日期
- 有效期：**180 天**（`VERIFICATION_STALE_DAYS`）。超过 180 天未复核的条目会阻断构建，需重新核对后更新日期
- `TransportHub.verifiedAt` 为**必填字段**（不可选），类型层面杜绝无核实日期的枢纽进入数据集

### 美食与餐厅

- `Food` 数据位于 `src/data/foods.ts`
- `Restaurant` 接口**不含 `phone` 字段**：具体门店电话、营业时间等运营信息由探店手记（`FoodJournal`）在真实到店核实后承载，不在数据层固化未经证实的联系方式
- 已发布美食进入地图美食图层与城市页"城市味道"区块

### 交通枢纽

- `TransportHub` 数据位于 `src/data/transport.ts`
- `verifiedAt` 必填
- `phone` 字段仅在有可核实官方来源时保留（如固原汽车站），铁路车站与机场站不展示电话
- `type` 必须在合法枚举范围内：`airport` / `highspeed_rail` / `railway` / `bus`

### 政府标记

- `GovernmentMarker` 定义在 `src/components/map/config.ts`
- 作为地图导航锚点，不展示运营、开放或票价信息
- `verifiedAt` 必填，同样受 180 天周期校验

## 构建期门禁清单

`npm run validate:data` 会在构建期执行以下校验，任一失败都会阻断构建：

| 门禁 | 检测内容 | 位置 |
| --- | --- | --- |
| **重复 JSON 双写** | `src/data/` 与 `public/data/` 不允许同名 JSON 文件 | `scripts/validate-data.ts` |
| **模板化电话** | 拒绝 `0951-12306` 等模板填充电话（`/^\d{4}-12306$/`） | `src/data/validate.ts` |
| **类型安全削弱** | `src/types/index.ts` 中 `export type` 联合类型禁止出现 `| string` | `scripts/validate-data.ts` |
| **异常 ID** | 所有 `id` 必须符合 kebab-case ASCII | `src/data/validate.ts` |
| **电话区号匹配** | 交通枢纽电话区号必须与所在城市一致 | `src/data/validate.ts` |
| **verifiedAt 过期** | 超过 180 天未复核的条目阻断构建 | `src/data/validate.ts` |
| **⏰ verifiedAt 10 天预警窗口（170–180 天）** | 输出日志 warning、GitHub Actions 黄条、每周一自动开 Issue；**不阻断构建** | `scripts/check-verification-reminder.ts` + `.github/workflows/verification-reminder.yml` |
| **占位文本** | 拒绝"示例""演示用""待填写""example.com"等占位内容 | `src/data/validate.ts` |
| **跨数据引用** | 路线停靠点只能引用已发布景点；兴趣组合只能引用已公开景点 | `src/data/validate.ts` |
| **图片完整性** | 已发布景点和手记的图片必须有本地多格式文件（webp + avif） | `scripts/validate-data.ts` |

## 地图图层开发规范

地图组件位于 `src/components/map/`，遵循以下约定：

### 无障碍

- **可交互图层**（景点、美食）：使用 `role="button"` + `onKeyDown`（通过 `activateWithKeyboard` 支持 Enter/Space 激活）
- **纯展示图层**（政府标记、交通枢纽，以及无 `onSelect` 的美食图层）：使用 `role="img"` + 可读 `aria-label`，不加入键盘 Tab 顺序；屏幕阅读器可朗读但无伪激活动作
- 图层开关使用 `aria-pressed` 标记激活状态；选中态需保持主题色、文字对比与阴影层次，悬停时不得覆盖状态识别

### 性能

- 所有图层组件使用 `React.memo` 包裹（`export default memo(Foo)`）
- 父组件 `NingxiaInteractiveMap` 传入的回调必须用 `useCallback` 稳定引用，计算数组用 `useMemo`，否则 memo 失效
- `project` 投影函数用 `useMemo` 缓存

## 测试要求

### 单元测试（Vitest）

- 数据校验纯函数测试：`src/data/validate.test.ts`
- 工具函数测试：`src/lib/*.test.ts`
- 组件测试：`src/components/*.test.tsx`
- 运行：`npm test`

### 端到端测试（Playwright）

- 位于 `tests/e2e/tourism.spec.ts`
- 覆盖地图交互、图层切换、键盘无障碍、路线筛选等场景
- 运行：`npm run test:e2e`（首次需 `npx playwright install chromium`）
- 桌面端和移动端两个 viewport 均需通过

新增功能或 UI 变更时，应同步补充对应测试用例。路线详情的日程锚点支持直接访问；调整路由初始化、懒加载或滚动逻辑时，需回归 `#route-day-N` 深链接在桌面端与移动端的定位，并确认目标标题位于站点头部与按天吸顶导航之下。

### 导航语义

- 当前页面的主导航、搜索和收藏入口需同时保持视觉选中态与 `aria-current="page"` 语义。
- 景点兴趣筛选卡使用 `aria-pressed` 表示选中状态；选中态悬停时应保持主题色与状态层次，不覆盖选中反馈。
- 次级行动按钮使用沙金色层级；悬停和键盘聚焦需保留颜色层级，并提供与主按钮一致的轻量抬升与阴影过渡。
- 安静按钮用于低强调操作；浅色页面保留轻量阴影与抬升反馈，深色头图需改用深色环境阴影，同时保持文字和边框对比度。
- 通用文字链接用于低占位阅读入口；悬停和键盘聚焦需保留主题色变化，并仅移动末端箭头图标 2px 以内，保持整条链接热区稳定且不改变正文阅读层级。
- 资料来源入口使用 `source-link`；悬停和键盘聚焦只移动末端外链图标 2px 以内，不整体移动来源链接热区。
- 清除/重置类文字按钮用于低强调操作；悬停和键盘聚焦只改变主题色，不整体位移，保持 44px 触控高度与稳定热区。
- 景点、路线与美食结果区的“清除筛选”属于清除/重置类文字按钮，必须继承至少 44px 触控高度与稳定热区规范。
- 搜索清空按钮保持 44px 圆形触控热区；悬停和键盘聚焦只改变背景、颜色与阴影，不整体位移。
- 搜索页快捷关键词保持至少 44px 触控热区；悬停和键盘聚焦保留胡杨绿边框、底色与轻量抬升反馈。
- 比较结果栏“查看对比”、旅行手记正文目录与相关内容入口保持至少 44px 触控热区；悬停和键盘聚焦保留统一的底色与主题色反馈。
- PWA 更新提示的刷新和关闭入口保持 44px 触控热区；深色提示条中继续保持清晰的前景与聚焦对比。
- 导航搜索入口保持 44px 圆形触控热区；悬停和键盘聚焦保留胡杨绿状态，不改变当前页 `aria-current` 语义。
- 收藏入口保持至少 44×44px 触控热区；移动端隐藏文字与数量后仍需保持 44px 宽，悬停和键盘聚焦保留收藏状态颜色与轻量抬升反馈，`aria-pressed` 语义不变。
- 品牌首页入口保持至少 44px 触控高度；桌面与移动端 logo 可按布局缩放，但不得让首页链接热区随 logo 缩小。
- 路线详情的站点头部、按天导航、日程锚点和 DAY 标记必须使用同一套响应式高度变量；修改任一吸顶层高度时，需同步检查 375—480px 手机宽度的跳转安全区。
- 详情页返回入口保留 44px 触控高度；悬停和键盘聚焦只移动左侧箭头，不整体移动链接热区。
- 移动端菜单按钮保持 44px 触控尺寸；悬停和键盘聚焦需使用胡杨绿、轻量抬升与阴影反馈，与搜索和收藏入口节奏一致。
- 移动端菜单打开时应使用悬浮面板，不得推移页面首屏；背景滚动需锁定，关闭、Escape 或路由切换后必须恢复原有设置，同时保留菜单内焦点循环与点击外部关闭。
- 内容页首图在移动端使用统一 4:3 视觉框并通过 `object-fit: cover` 裁切；图片来源说明与 alt 文本必须保持，不得用比例调整掩盖素材边界。

## 提交信息规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>: <描述>
```

常用 type：

| type | 用途 |
| --- | --- |
| `feat` | 新功能或新内容 |
| `fix` | Bug 修复 |
| `perf` | 性能优化 |
| `refactor` | 重构（不改变行为） |
| `docs` | 文档变更 |
| `test` | 测试用例变更 |
| `chore` | 构建、依赖等杂项 |

示例：
- `feat: 新增沙湖生态旅游区，补齐直接来源与实景图`
- `fix: 政府标记图层 className 移至 g 元素，修复 E2E 断言`
- `perf: 地图图层组件 React.memo 化，稳定回调引用`

## 相关文档

- [文档总索引](docs/README.md)：所有文档入口与使用向导
- [产品需求文档](docs/product/宁夏旅游地图PRD.md)：PRD
- [技术架构文档](docs/product/宁夏旅游地图技术架构.md)：架构说明
- [开发计划与里程碑](docs/product/DEVELOPMENT_PLAN.md)：阶段目标、后续规划、技术债务
- [部署指南](docs/product/DEPLOYMENT.md)：CI/CD 流水线、Vite base、SPA 回退、PWA、其它平台部署
- [数据字典](docs/product/DATA_DICTIONARY.md)：字段速查、枚举、必填、校验说明
- [内容审计记录](docs/content/CONTENT_AUDIT.md)：分级标准、复核日期与历史变更
- [图片来源记录](docs/content/IMAGE_PROVENANCE.md)：编辑插画生成方式与提示词
- [内容维护说明](docs/content/MAINTENANCE.md)：数据与内容维护准则
- [更新日志](./CHANGELOG.md)：重要版本里程碑
- [行前指南模板](docs/templates/)：手记与探店模板（不参与发布）
