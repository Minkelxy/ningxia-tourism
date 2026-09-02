# 发布状态与验收记录

更新时间：2026-09-02

## 当前发布快照

2026-09-02 文档一致性补充：提交 [`418bc9a`](https://github.com/Minkelxy/ningxia-tourism/commit/418bc9af3576da718e0506334d725dd8e633a422) 已将 PRD 与技术架构的当前实现快照同步到 v0.3.73；对应的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33599493774)为 **success**，远端 `main` 与该提交一致。

2026-09-02 v0.3.73 发布复核：代码提交 [`c285114`](https://github.com/Minkelxy/ningxia-tourism/commit/c285114248d3656021626bb9494296e4b80a23a0) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33598011908)为 **success**；179 条单元测试、106 条 E2E 通过、6 条按端型跳过，地图懒加载占位沿用正式地图的沙纸渐变、点状纹理与抽象轮廓，保留 `role="status"` 和明确加载文案；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，线上手机菜单导航、地图点位 44px 热区与景点预览已复核通过。

2026-09-02 v0.3.72 发布复核：代码提交 [`82b9801`](https://github.com/Minkelxy/ningxia-tourism/commit/82b9801a48a4f45062f06f22b492b3624d540f57) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33596260998)为 **success**；179 条单元测试、104 条 E2E 通过、6 条按端型跳过，景点与美食地图点位在缩放后保持至少 44px 实际触控热区，相邻点位由画布按最近距离分发；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。

2026-09-02 v0.3.71 发布复核：代码提交 [`2614c59`](https://github.com/Minkelxy/ningxia-tourism/commit/2614c591f0ecd68214333823b987db57771542d3) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33592954537)为 **success**；179 条单元测试、102 条 E2E 通过、6 条按端型跳过，桌面端路径切换后焦点交给新的主要内容区域，移动端菜单跳转继续回收到菜单按钮；生产构建、sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。

2026-09-02 v0.3.70 发布复核：代码提交 [`ec1e0c2`](https://github.com/Minkelxy/ningxia-tourism/commit/ec1e0c28ac6410bfa8d5ffa10c70f50eb4a4f6a9) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33591191419)为 **success**；178 条单元测试、101 条 E2E 通过、5 条按端型跳过，地图美食点位已补齐透明触控热区并统一键盘聚焦反馈，Lighthouse、深链回退与 Pages 部署均通过，Pages 状态为 built。

2026-09-02 v0.3.69 发布复核：代码提交 [`9d574e0`](https://github.com/Minkelxy/ningxia-tourism/commit/9d574e0d5500d4eab3a69b7042c69fe244126fd4) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33590234576)为 **success**；178 条单元测试、98 条 E2E 通过、4 条按端型跳过，移动端菜单入口会立即收起并将焦点回收到菜单按钮，Lighthouse 与深链回退均通过，Pages 状态为 built。

2026-09-02 v0.3.68 门禁稳定性复核：测试提交 [`42902e0`](https://github.com/Minkelxy/ningxia-tourism/commit/42902e0b8c15649c9aa3219e52242b4f62aec405) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33589046745)为 **success**；177 条单元测试、98 条 E2E 全部通过、4 条按端型跳过，首页键盘聚焦回归不再出现 flaky 标记，Pages 状态为 built。

2026-09-02 v0.3.68 发布复核：代码提交 [`b7b523d`](https://github.com/Minkelxy/ningxia-tourism/commit/b7b523df54f705ef5387fe265a6ba11f436729dd) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33588198460)为 **success**；177 条单元测试、98 条 E2E 通过、4 条按端型跳过，美食详情页分享按钮已恢复浅色详情操作层级，Pages 状态为 built。

2026-09-02 v0.3.67 发布复核：代码提交 [`8068d62`](https://github.com/Minkelxy/ningxia-tourism/commit/8068d626508352fee7e2a00c483a0fc850c56e87) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33587066453)为 **success**；177 条单元测试通过，97 条 E2E 通过、1 条桌面 E2E 首次波动后重试通过、4 条按端型跳过，路线详情深色头图操作区已统一为半透明深色按钮层级，Pages 状态为 built。

2026-09-02 v0.3.66 发布复核：代码提交 [`634e250`](https://github.com/Minkelxy/ningxia-tourism/commit/634e250ec8fe90303447e1655925abfdfe17a88c) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33584919565)为 **success**；177 条单元测试、98 条 E2E 通过、4 条按端型跳过，关于页内容审计入口已修正为实际 GitHub 文档路径，Pages 状态为 built。

2026-09-02 v0.3.65 发布复核：代码提交 [`c51cb1a`](https://github.com/Minkelxy/ningxia-tourism/commit/c51cb1ab0646f189273a3a4d47bc0a57cac118f0) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33583948148)为 **success**；177 条单元测试、96 条 E2E 通过、4 条按端型跳过，旅行手记栏目在 320px 等窄屏下可横向浏览，Pages 状态为 built。

2026-09-02 v0.3.64 发布复核：代码提交 [`7ad1c78`](https://github.com/Minkelxy/ningxia-tourism/commit/7ad1c78496d04930ed4696df955ac3aa458d34d3) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33582358926)为 **success**；177 条单元测试、94 条 E2E 通过、4 条按端型跳过，五城与路线比较表的“查看”操作入口统一保持至少 44×44px，Pages 状态为 built。

2026-09-02 v0.3.63 发布复核：代码提交 [`ba312cd`](https://github.com/Minkelxy/ningxia-tourism/commit/ba312cdb2dde970405673b0e4c62dd7f1f9a5a67) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33581270355)为 **success**；177 条单元测试、94 条 E2E 通过、4 条按端型跳过，路线详情时间线中的停靠点名称入口统一保持至少 44px 触控高度，Pages 状态为 built。

2026-09-02 v0.3.62 发布复核：代码提交 [`1bc6470`](https://github.com/Minkelxy/ningxia-tourism/commit/1bc64708f1c54bb85da5bbcbe8b69ba18c1bc059) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33580281629)为 **success**；177 条单元测试、92 条 E2E 通过、4 条按端型跳过，城市与路线比较表名称入口统一保持至少 44px 触控高度，Pages 状态为 built。

2026-09-02 v0.3.61 发布复核：代码提交 [`ad5b803`](https://github.com/Minkelxy/ningxia-tourism/commit/ad5b80361680ca7fa716cf61a0e9987c0c8452c0) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33579166495)为 **success**；177 条单元测试、90 条 E2E 通过、4 条按端型跳过，景点、美食与首页旅行专题卡片标题入口统一保持至少 44px 触控高度，Pages 状态为 built。

2026-09-02 v0.3.60 发布复核：代码提交 [`4c78058`](https://github.com/Minkelxy/ningxia-tourism/commit/4c7805852a80fe101f8eac7c1ce2e93e2bc1e2ca) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33577932966)为 **success**；177 条单元测试、88 条 E2E 通过、4 条按端型跳过，页脚当前内容入口与顶部/移动导航统一使用路径匹配，当前页同步提供金色选中态与 `aria-current="page"`，Pages 状态为 built。

2026-09-02 v0.3.59 发布复核：代码提交 [`5aa587b`](https://github.com/Minkelxy/ningxia-tourism/commit/5aa587b0897bf937681d3cf8113c6ada45f7e5e0) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33577172046)为 **success**；176 条单元测试、86 条 E2E 通过、4 条按端型跳过，顶部桌面导航、移动菜单与页脚“继续探索”统一读取 `src/lib/site-navigation.ts`，线上入口名称与路径保持一致，Pages 状态为 built。

2026-09-02 v0.3.58 发布复核：代码提交 [`72bc684`](https://github.com/Minkelxy/ningxia-tourism/commit/72bc68479b25f3f92c921a3c541f47ec0ea5a8f6) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33575667033)为 **success**；176 条单元测试、84 条 E2E 通过、4 条按端型跳过，页脚“继续探索”已与顶部导航补齐六类内容入口，并将内容与资料链接分组为可识别导航区域，Pages 状态为 built。

2026-09-02 v0.3.57 发布复核：代码提交 [`883fbee`](https://github.com/Minkelxy/ningxia-tourism/commit/883fbeee55cb3d4de1ccc7c15f65eb3a28cb71c8) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33574577942)为 **success**；174 条单元测试、84 条 E2E 通过、4 条按端型跳过，320px 城市页的比较表保留容器内横向滚动，页面根 `scrollWidth` 恢复与视口一致，Pages 状态为 built。

2026-09-02 v0.3.56 发布复核：代码提交 [`519e7d9`](https://github.com/Minkelxy/ningxia-tourism/commit/519e7d98f4ea0b274f61b569474a3a21814ddd31) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33573571768)为 **success**；174 条单元测试、84 条 E2E 通过、4 条按端型跳过，移动端展开菜单未选中项补齐与桌面导航一致的白底、胡杨绿文字和轻量阴影反馈，Pages 状态为 built。

2026-09-02 v0.3.55 发布复核：代码提交 [`540e22c`](https://github.com/Minkelxy/ningxia-tourism/commit/540e22c44546687ac47f17427c495be88506a2fa) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33572144305)为 **success**；174 条单元测试、83 条 E2E 通过、3 条按端型跳过，320px 窄屏品牌主名保持单行，360px 以下隐藏重复副标题但保留完整无障碍品牌名称，页面无横向溢出，Pages 状态为 built。

2026-09-02 v0.3.54 发布复核：代码提交 [`ce4960c`](https://github.com/Minkelxy/ningxia-tourism/commit/ce4960cc350b7d78c2a493d67ebcbb36c53a14ad) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33570664829)为 **success**；174 条单元测试、81 条 E2E 通过、3 条按端型跳过，移动端收藏页英雄区底部内边距从遗留的 300px 收口为 76px，桌面端保留 58px，主要收藏内容更早进入首屏，Pages 状态为 built。

2026-09-02 v0.3.53 发布复核：代码提交 [`db7b08c`](https://github.com/Minkelxy/ningxia-tourism/commit/db7b08c2d16dffab875d5814a80e5c9f75381cd3) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33569640553)为 **success**；174 条单元测试、79 条 E2E 通过、3 条按端型跳过，收藏反馈、PWA 更新提示和景点对比停靠条统一使用 `env(safe-area-inset-bottom, 0px)` 预留移动端底部手势安全区，Pages 状态为 built。

2026-09-02 v0.3.52 发布复核：代码提交 [`5a46ec1`](https://github.com/Minkelxy/ningxia-tourism/commit/5a46ec18327de69bb70fc897068bd8b00a98c8d9) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33568458275)为 **success**；174 条单元测试、77 条 E2E 通过、3 条按端型跳过，路由懒加载使用与站点标志一致的地图印章加载态，并提供 `role="status"` 与可访问名称，Pages 状态为 built。

2026-09-02 v0.3.51 发布复核：代码提交 [`2087157`](https://github.com/Minkelxy/ningxia-tourism/commit/2087157aeef9d446a152bdb5726062f796fc70e7) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33567359007)为 **success**；173 条单元测试、77 条 E2E 通过、3 条按端型跳过，桌面端与移动端的地图景点预览统一使用 `map-preview-in` 轻量入场动效，移动端继续使用底部面板把手与安全区，Pages 状态为 built。

2026-09-02 v0.3.50 发布复核：代码提交 [`e9b715a`](https://github.com/Minkelxy/ningxia-tourism/commit/e9b715a2641f2cf2f1eb0f925ed4a17efb0f9daf) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33565747585)为 **success**；173 条单元测试、76 条 E2E 通过、4 条按端型跳过，移动端地图景点预览增加可见面板把手与 `map-preview-in` 轻量上滑入场动效，Pages 状态为 built。

2026-09-02 v0.3.49 发布复核：代码提交 [`fd5fd6d`](https://github.com/Minkelxy/ningxia-tourism/commit/fd5fd6da3b8a36709712ba179dea432b169d12a0) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33564250620)为 **success**；173 条单元测试、75 条 E2E 通过、3 条按端型跳过，移动端导航使用实色悬浮面板、菜单外遮罩与背景虚化，点击遮罩、关闭、Escape 和路由切换均可退出，Pages 状态为 built。

2026-09-02 v0.3.48 发布复核：代码提交 [`bda04a2`](https://github.com/Minkelxy/ningxia-tourism/commit/bda04a23bee4b0ce37154d7fb0e5b9dd8cafb3d7) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33562109504)为 **success**；172 条单元测试、75 条 E2E 通过、3 条按端型跳过，移动端导航以悬浮面板打开并锁定背景滚动，关闭、Escape 和路由切换后恢复原有设置，Pages 状态为 built。

2026-09-02 v0.3.47 发布复核：代码提交 [`ee9129f`](https://github.com/Minkelxy/ningxia-tourism/commit/ee9129f13e1f3a1644e7af4bee6365e625fba50a) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33560985885)为 **success**；171 条单元测试、74 条 E2E 通过、2 条按端型跳过，路线详情的站点头部、按天导航、日程锚点与 DAY 标记已统一响应式吸顶安全区，Pages 状态为 built。

2026-09-02 v0.3.46 发布复核：代码提交 [`7c2a183`](https://github.com/Minkelxy/ningxia-tourism/commit/7c2a18303053381cdfcf3992854fc7f71af7bf11) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33558742282)为 **success**；171 条单元测试、74 条 E2E 通过、2 条按端型跳过，路线详情 `#route-day-N` 深链接在桌面端与移动端均能定位到对应日程，Pages 状态为 built。

2026-09-02 v0.3.45 发布复核：最终代码提交 [`239c180`](https://github.com/Minkelxy/ningxia-tourism/commit/239c18066e0004a309dd0e9b78b43f6e1d9309f7) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33556953258)为 **success**；171 条单元测试、72 条 E2E 通过、2 条按端型跳过，查询参数变化会重新触发页面状态播报，中文产品文档路径已校正，Pages 状态为 built。

2026-09-02 v0.3.44 发布复核：代码提交 [`0c70a71`](https://github.com/Minkelxy/ningxia-tourism/commit/0c70a71b7e56745a7e9f19c4ceae2b8388af4a48) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33555057927)为 **success**；72 条 E2E 通过、2 条按端型跳过，线上资源已包含桌面端条件聚焦逻辑，移动端不再默认唤起系统键盘。

2026-09-02 v0.3.43 发布复核：代码提交 [`e8b0ba6`](https://github.com/Minkelxy/ningxia-tourism/commit/e8b0ba6e0b1bcebaae82f63b31d1e00a2a00e85d) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33553630519)为 **success**；72 条 E2E 通过、2 条按端型跳过，线上移动端搜索页与收藏页均只保留一个主内容区域，页面标题、导航与空状态正常。

2026-09-02 v0.3.42 发布复核：代码提交 [`4e08799`](https://github.com/Minkelxy/ningxia-tourism/commit/4e087997f85653cfda35bcb7ad2640d4ea7e9444) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33551418610)为 **success**；移动端 E2E 为 70 条通过、2 条按端型跳过，线上美食页首图为约 269px 高、4:3 视觉节奏，首页与深层链接继续正常。

2026-09-02 v0.3.41 发布复核：代码提交 [`614c371`](https://github.com/Minkelxy/ningxia-tourism/commit/614c371ed58e21305b397e33211c215a8a02ff5e) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33548816422)为 **success**；GitHub Pages 发布源已切换为 `workflow`，构建新增 `dist/404.html` 深层链接回退门禁。线上首页 HTTP 200，直接访问 [`/attractions`](https://minkelxy.github.io/ningxia-tourism/attractions) 已正常进入“精选景点 · 宁夏旅行地图”，不再返回 GitHub 默认 404。

2026-09-02 v0.3.40 验收补充：代码提交 `413929f` 的[主校验与 Pages 部署工作流](https://github.com/minkelxy/ningxia-tourism/actions/runs/33546625948)与[独立 Pages 构建部署](https://github.com/minkelxy/ningxia-tourism/actions/runs/33546625286)均为 **success**；结果区“清除筛选”已统一至少 44px 触控高度。线上首页返回 HTTP 200，页面标题与站点一致。

项目主线为 `main`，远端仓库为 [Minkelxy/ningxia-tourism](https://github.com/Minkelxy/ningxia-tourism)。站点通过 [GitHub Actions](https://github.com/Minkelxy/ningxia-tourism/actions/workflows/deploy.yml) 构建，并部署到 [GitHub Pages](https://minkelxy.github.io/ningxia-tourism/)。

2026-09-02 线上验收：代码提交 `f60e2bd` 的 [主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33545164584) 与 [独立 Pages 构建部署](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33545163859) 均为 **success**；品牌首页入口保持至少 44px 触控高度，移动端导航收藏入口在隐藏文字与数量后仍保持至少 44×44px 触控热区，与搜索和菜单入口对齐。既有景点卡片、路线卡片、详情页与收藏夹收藏入口、导航搜索入口、首页内容方法入口、搜索清空按钮、资料来源入口、详情返回入口、景点兴趣筛选选中态、地图图层选中态、搜索、筛选、卡片、详情页操作、深色头图按钮、文字链接、移动端菜单入口、清除/重置类文字操作及纯展示图层语义继续通过回归；构建依赖安全审计为 0 vulnerabilities，已通过本地类型、规范、单元、内容、端到端、生产构建与 Lighthouse 校验；线上首页 HTTP 200，页面标题与站点一致。

当前公开数据规模：

| 内容 | 数量 | 说明 |
| --- | ---: | --- |
| 城市 | 5 | 宁夏五个地级市 |
| 景点 | 22 | 20 个 `verified`、2 个 `review`；另有 1 个 `draft` |
| 路线 | 9 | 覆盖 1—5 天，含逐日停靠点与时间槽 |
| 美食 | 14 | 2 个 `verified`、12 个 `review` |
| 资料专题 | 15 | `editorial` 资料型内容 |
| 公开亲历游记 / 探店 | 0 | 模板与草稿不进入发布内容 |

## 本地验收清单

提交或合并前执行：

```bash
npm ci
npm run audit
npm run validate:data
npm run validate:data:reminder
npm run check
npm run lint
npm test
npm run test:e2e
VITE_BASE_URL=/ningxia-tourism/ npm run build
```

其中 `validate:data:reminder` 是 170—180 天窗口的软提醒，不会替代 180 天硬校验；`build` 会生成生产产物和 sitemap。

## 视觉与图片边界

- 景点、路线、城市、专题和美食页面优先使用有原始页面和许可记录的网络实拍照片。
- 照片与文字描述不完全对应时，替代文本会写明“参考图”，不把图片当作景区、菜品或商户证据。
- 图片数据保留来源页面、作者、许可和处理后的响应式文件关系。

完整说明见：[图片来源记录](content/IMAGE_PROVENANCE.md)、[内容审计](content/CONTENT_AUDIT.md) 和 [部署指南](product/DEPLOYMENT.md)。
