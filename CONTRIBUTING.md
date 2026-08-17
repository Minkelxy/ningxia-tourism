# 贡献指南

感谢参与宁夏旅行地图的维护。本指南说明数据贡献流程、数据规范、构建期门禁和开发约定，帮助你在提 PR 前自检。

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
   npm run check           # TypeScript 类型检查
   npm run lint            # ESLint
   npm test                # Vitest 单元测试
   npm run build           # 生产构建 + sitemap 生成
   ```
4. **E2E 测试（涉及 UI 变更时）**：
   ```bash
   npx playwright install chromium   # 首次需要
   npm run test:e2e
   ```
5. **提交并发起 PR**：使用 Conventional Commits 格式（见下文），PR 标题与提交信息保持一致。

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
| **占位文本** | 拒绝"示例""演示用""待填写""example.com"等占位内容 | `src/data/validate.ts` |
| **跨数据引用** | 路线停靠点只能引用已发布景点；兴趣组合只能引用已公开景点 | `src/data/validate.ts` |
| **图片完整性** | 已发布景点和手记的图片必须有本地多格式文件（webp + avif） | `scripts/validate-data.ts` |

## 地图图层开发规范

地图组件位于 `src/components/map/`，遵循以下约定：

### 无障碍

- **可交互图层**（景点、美食）：使用 `role="button"` + `onKeyDown`（通过 `activateWithKeyboard` 支持 Enter/Space 激活）
- **纯展示图层**（政府标记、交通枢纽）：使用 `role="img"` + `tabIndex={0}` + 可读 `aria-label`，屏幕阅读器可朗读但无伪激活动作
- 图层开关使用 `aria-pressed` 标记激活状态

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

新增功能或 UI 变更时，应同步补充对应测试用例。

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

- [内容审计记录](docs/CONTENT_AUDIT.md)：分级标准、复核日期与历史变更
- [图片来源记录](docs/IMAGE_PROVENANCE.md)：编辑插画生成方式与提示词
- [行前指南模板](docs/templates/)：手记与探店模板（不参与发布）
