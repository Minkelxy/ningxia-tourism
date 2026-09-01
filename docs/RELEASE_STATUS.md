# 发布状态与验收记录

更新时间：2026-09-02

## 当前发布快照

2026-09-02 v0.3.42 发布记录：移动端内容页首图统一为 4:3 视觉框，减少竖幅素材造成的首屏高度波动；本地 E2E 新增回归，代码与文档待本轮 GitHub Actions 发布后补入最终提交与线上验收链接。

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
