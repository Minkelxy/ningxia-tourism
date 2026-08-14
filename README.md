# 塞上江南 · 宁夏旅行地图

一个面向国内游客的宁夏静态旅行规划站。网站用自研 SVG 地图串起 5 个地级市、分级核实的公开景点、7 条主题路线、旅行手记与资料专题，并保留来源、核实日期与图片许可信息。

在线访问：[https://minkelxy.github.io/ningxia-tourism/](https://minkelxy.github.io/ningxia-tourism/)

## 本地运行

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev
```

常用检查：

```bash
npm run validate:data
npm run check
npm run lint
npm test
npm run test:e2e
npm run build
npm run audit
npm run quality:lighthouse
```

端到端测试首次运行前需要安装 Chromium：`npx playwright install chromium`。

## 内容结构

- `src/data/attractions.ts`：景点唯一数据源。正式内容使用 `published`，未核实内容使用 `draft`。
- `src/data/cities.ts`：五城资料，以固定 `cityId` 关联景点，并维护建议停留、适合人群、抵达方式和行程提醒。
- `src/data/routes.ts`：七条路线、逐日停靠点，以及节奏、步行量和主要交通画像。
- `src/data/validate.ts`：构建期校验，检查字段、ID、坐标和跨数据引用。
- `src/content/journal/`：公开或草稿的手记、探店与旅行专题 Markdown；内容在构建时解析，不把解析器和 YAML 运行时发送给访客。维护模板位于 `docs/templates/`，不会参与发布。
- `src/data/guide.ts`：行前指南的四季建议、跨城原则、清单和网络来源。
- `src/data/discovery.ts`：景点页的旅行兴趣组合，只能引用已公开景点。
- `src/components/map/`：地图投影、视口控制、区域、景点、交通和预览等独立模块。
- `public/data/ningxia-province.json` 与 `public/data/ningxia/districts/`：正式地图唯一边界数据，首页地图和开发查看器共同读取。
- `public/images/attractions/`：授权图片及站内资源。

正式景点必须补齐开放信息、参考票价、预约、时长、季节、交通、WGS84 坐标、来源、核实日期和图片许可。只有来源与图片同时达到严格标准才标为 `verified`；其余公开内容标为 `review`，资料不足时保留为 `draft`。当前公开 20 个景点，其中 18 个已核实、2 个待复核；待复核详情必须提供现场变化时的可执行替代方案。景点页支持按“第一次来、时间深处、沿黄河走、少折腾”四种旅行兴趣快速缩小范围，并继续叠加城市与类型筛选。手机端兴趣卡使用横向滑动，避免在内容列表之前形成过长的卡片堆叠。旧的一百零八塔与金鸡坪梯田链接会分别跳转到青铜峡黄河大峡谷旅游区和彭阳梯田，避免重复维护同一目的地。

个人游记与探店只有同时标记为 `status: published` 与 `contentKind: firsthand` 才会公开；资料型旅行专题使用 `type: guide` 与 `contentKind: editorial`，必须包含来源、核对日期和适用范围。演示模板、占位字段、未来日期或越界引用会让构建失败。

`/journal` 默认展示全部公开内容，并给出各栏目数量；当前公开 9 篇资料型旅行专题，已覆盖五个地级市，亲历游记与探店仍为 0 篇。页面支持通过 `?q=&city=&tag=&type=` 搜索标题、地点、标签与旅行问题，筛选可以一键清空。需要首页优先展示的专题可以设置 `featured: true`，其余内容按更新日期排序。专题允许使用明确标注的项目编辑插画，生成方式和提示词记录在 `docs/IMAGE_PROVENANCE.md`。

## 路由与部署

公开路由包括 `/`、`/attractions`、`/attraction/:id`、`/cities`、`/city/:slug`、`/routes`、`/routes/:routeId`、`/guide`、`/journal`、`/journal/travel/:slug`、`/journal/food/:slug` 和 `/about`。GeoJSON 工具只在开发环境注册。

GitHub Actions 会依次执行依赖安全审计、数据校验、类型检查、代码检查、单元测试、端到端测试、生产构建和移动端 Lighthouse 门禁；`public/404.html` 为 GitHub Pages 提供 SPA 深层链接回退。

## 信息边界

本站是开源、非官方项目，不提供预订或实时票价。景区开放、预约、交通班次和道路耗时可能随时变化，出发前请再次查看景区、场馆或文旅部门官方公告。

首页支持按 1—5 天直接缩小路线范围，并展示对应路线的节奏、步行量和主要交通；最近核对的旅行专题会同步出现在首页，但个人游记与探店仍只在真实素材发布后展示。
