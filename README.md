# 塞上江南 · 宁夏旅行地图

一个面向国内游客的宁夏静态旅行规划站。网站用自研 SVG 地图串起 5 个地级市、分级核实的公开景点、7 条主题路线与真实旅行手记，并保留来源、核实日期与图片许可信息。

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
```

端到端测试首次运行前需要安装 Chromium：`npx playwright install chromium`。

## 内容结构

- `src/data/attractions.ts`：景点唯一数据源。正式内容使用 `published`，未核实内容使用 `draft`。
- `src/data/cities.ts`：五城资料，以固定 `cityId` 关联景点。
- `src/data/routes.ts`：七条路线及逐日停靠点。
- `src/data/validate.ts`：构建期校验，检查字段、ID、坐标和跨数据引用。
- `src/content/journal/`：公开或草稿手记 Markdown；维护模板位于 `docs/templates/`，不会参与发布。
- `public/images/attractions/`：授权图片及站内资源。

正式景点必须补齐开放信息、参考票价、预约、时长、季节、交通、WGS84 坐标、来源、核实日期和图片许可。只有来源与图片同时达到严格标准才标为 `verified`；其余公开内容标为 `review`，资料不足时保留为 `draft`。

## 路由与部署

公开路由包括 `/`、`/attractions`、`/attraction/:id`、`/cities`、`/city/:slug`、`/routes`、`/routes/:routeId`、`/journal`、`/journal/travel/:slug`、`/journal/food/:slug` 和 `/about`。GeoJSON 工具只在开发环境注册。

GitHub Actions 会依次执行数据校验、类型检查、代码检查、单元测试、端到端测试和生产构建；`public/404.html` 为 GitHub Pages 提供 SPA 深层链接回退。

## 信息边界

本站是开源、非官方项目，不提供预订或实时票价。景区开放、预约、交通班次和道路耗时可能随时变化，出发前请再次查看景区、场馆或文旅部门官方公告。
