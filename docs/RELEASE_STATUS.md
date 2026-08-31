# 发布状态与验收记录

更新时间：2026-09-01

## 当前发布快照

项目主线为 `main`，远端仓库为 [Minkelxy/ningxia-tourism](https://github.com/Minkelxy/ningxia-tourism)。站点通过 [GitHub Actions](https://github.com/Minkelxy/ningxia-tourism/actions/workflows/deploy.yml) 构建，并部署到 [GitHub Pages](https://minkelxy.github.io/ningxia-tourism/)。

2026-09-01 线上验收：提交 `945ed72` 的校验与 Pages 部署 job 均为 **success**；全站搜索框、首页路线结果、行前指南天数卡、收藏列表和全站搜索结果统一鼠标悬停与键盘聚焦反馈，美食图层区分纯展示与可交互语义，纯展示点位移除无动作 Tab 焦点，已通过本地与线上构建校验，移动端当前导航语义、首页地图锚点偏移、手记画廊尺寸提示，以及地图预览焦点回退与滚动隔离继续通过回归。

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
