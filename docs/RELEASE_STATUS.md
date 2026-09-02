# 发布状态与验收记录

更新时间：2026-09-03

## 当前发布快照

2026-09-03 v0.3.117 发布复核：待 GitHub Actions 完成后回填代码提交、工作流编号与最终测试统计。地图区县图例使用 `map-legend-in`、`map-legend-title-in`、`map-legend-item-in` 和 `map-legend-swatch-in` 完成面板、标题、条目与色块的错峰渐进绘图；切换城市时重新铺开图例，减少动效设置下恢复静态图例，图例键盘聚焦、区域高亮和地图层级行为不变。

2026-09-03 v0.3.116 发布复核：代码提交 [`f64e13a`](https://github.com/Minkelxy/ningxia-tourism/commit/f64e13a4fdc6e93bed84a13ad6cba61971954e7a) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33678968492)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、177 条 E2E 通过、15 条按端型跳过，Lighthouse 质量门禁通过：地图工具栏使用 `map-toolbar-in`、`map-breadcrumb-in`、`map-control-in`、`map-control-pressed`、`map-level-label-in` 和 `map-level-ink` 完成工具栏、层级、控制按钮和图层启用的渐进绘图；减少动效设置下恢复静态工具栏与墨线，地图缩放、重置、层级切换、交通/美食/政府图层和键盘行为不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.115 发布复核：代码提交 [`b589020`](https://github.com/Minkelxy/ningxia-tourism/commit/b58902041fdaa0ac2dcb6c0932291df5c51271d2) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33677212200)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、175 条 E2E 通过、15 条按端型跳过，Lighthouse 质量门禁通过：全站固定头部使用 `site-header-in`、`site-brand-mark-stamp` 和 `site-nav-ink` 完成整体入场、品牌标识落印与当前导航墨线；减少动效设置下恢复静态头部与当前导航墨线，导航、收藏、搜索、移动端菜单和焦点行为不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.114 发布复核：代码提交 [`d71f95b`](https://github.com/Minkelxy/ningxia-tourism/commit/d71f95bb64c71be0f5a0708517b03354e6e22a8e) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33675469825)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、173 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过：首页路线查找、专题卡片、行前指南入口、旅行手记入口和资料提示使用 `home-section-in`、`home-copy-in`、`home-control-in`、`home-card-in`、`home-action-in`、`home-note-in` 和 `home-section-title-ink` 按区块、标题墨线与内容顺序渐进绘图；减少动效设置下恢复静态内容与墨线，筛选、链接与资料说明行为不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.113 发布复核：代码提交 [`4759af1`](https://github.com/Minkelxy/ningxia-tourism/commit/4759af10e70785dc189da3338d0ce6ceacabb7e0) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33673638629)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、169 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。空结果、404/未找到、加载提示、分享提示、更新提示和离线提示统一使用 `state-shell-in`、`state-icon-in`、`state-copy-in`、`state-title-ink`、`state-action-in`、`state-visual-in`、`toast-in` 和 `notice-in` 按反馈层级渐进绘图；减少动效设置下恢复静态内容与墨线，原有状态语义和操作行为不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.112 发布复核：代码提交 [`4d96753`](https://github.com/Minkelxy/ningxia-tourism/commit/4d967535358ce79d228b86d308672af53c22757c) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33671670594)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、165 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。景点主题、筛选面板、路线/五城比较区域、结果表格、路线卡片和关于本站方法卡片使用 `collection-panel-in`、`collection-ink-line`、`collection-theme-in`、`collection-filter-in`、`collection-comparison-in`、`collection-table-row-in`、`collection-card-in`、`collection-chip-in`、`about-intro-in`、`about-method-in`、`about-source-in` 和 `about-source-link-in` 按内容层级渐进绘图；减少动效设置下恢复静态内容与墨线，筛选、收藏、对比、横向浏览和链接行为不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.111 发布复核：代码提交 [`773cfaf`](https://github.com/Minkelxy/ningxia-tourism/commit/773cfaf73b63a1d48be775920b9f1688a3e4ed94) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33669947482)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、161 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。收藏页与全站搜索页使用 `utility-copy-in`、`utility-title-ink`、`utility-visual-in`、`utility-form-in`、`utility-summary-in`、`utility-group-in`、`utility-row-in` 和 `utility-result-in` 按内容层级渐进绘图；减少动效设置下恢复静态内容与墨线，收藏清空、搜索提交、建议词、清空输入、键盘焦点和空状态行为不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.110 发布复核：代码提交 [`d08f28f`](https://github.com/Minkelxy/ningxia-tourism/commit/d08f28fa9b05709bca510eafc70aa968a364cfa0) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33667905913)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、157 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。路线详情首屏、标题、事实信息、操作入口、日程导航、DAY 标记和资料侧栏按阅读顺序分层入场，DAY 标记增加与地图节点统一的轻量手绘环线；减少动效设置下恢复静态内容、层级与墨线，路线跳转、打印、分享、收藏和时间线行为不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.109 发布复核：代码提交 [`f63acdd`](https://github.com/Minkelxy/ningxia-tourism/commit/f63acdd68f0f676d4ffbc7bf78ad056259df3575) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33666055331)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、153 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。景点、美食与城市详情使用 `detail-hero-photo-in`、`detail-copy-in`、`detail-title-ink`、`detail-info-in` 和 `detail-side-in` 分层入场；景点/美食/五城列表卡片使用 `collection-card-in` 按阅读顺序错峰淡入，集合页视觉使用对应 hero 入场动画；减少动效设置下恢复静态内容、层级与墨线，内容、筛选、收藏、来源和链接行为不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.108 发布复核：代码提交 [`cf4ff89`](https://github.com/Minkelxy/ningxia-tourism/commit/cf4ff897b9161d2108f5d2555c1c8ff04aa158ac) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33664139066)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、149 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。旅行手记列表使用 `--journal-card-delay` 触发 `journal-card-in` 错峰入场，标题使用 `journal-card-title-ink` 展开墨线；文章详情使用 `journal-detail-photo-in`、`journal-detail-title-in`、`journal-detail-block-in`、`journal-detail-body-in` 和 `journal-sidebar-in` 分层入场；减少动效设置下恢复静态阅读层级与墨线，目录、来源、关联内容和链接行为不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.107 发布复核：代码提交 [`d6cf76c`](https://github.com/Minkelxy/ningxia-tourism/commit/d6cf76c134471284675a567c63b3b9aa0a19650b) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33662136395)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、145 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。行前指南首屏、四季/天数卡片和交通流程按阅读层级使用 `guide-card-in`、`guide-card-title-ink`、`guide-transit-line-draw` 与 `guide-flow-icon-stamp` 错峰绘图，清单勾选使用 `guide-check-draw`；减少动效设置下恢复静态，行前信息、链接和清单逻辑不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.106 发布复核：代码提交 [`4495c74`](https://github.com/Minkelxy/ningxia-tourism/commit/4495c746ce0a5fb06ee50bedaa5b1a3496c5fe2d) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33659979956)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、141 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过：首页按天数筛选路线结果使用 `--home-route-index` 触发 `home-route-match-in` 错峰入场，标题使用 `home-route-title-ink` 展开墨线；减少动效设置下恢复静态，筛选、键盘单选和路线链接行为不变。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.105 发布复核：代码提交 [`aa11e32`](https://github.com/Minkelxy/ningxia-tourism/commit/aa11e32d2e1fa6523a5eadcd21432e67894cf486) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33658308466)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、139 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。选中景点使用独立 `marker-ink-ring` SVG 装饰环，按 `pathLength="1"` 与 `marker-ink-ring-draw` 绘制，不改变点位热区、键盘语义或预览行为；减少动效设置下恢复静态高亮。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.104 发布复核：代码提交 [`cb4ac5d`](https://github.com/Minkelxy/ningxia-tourism/commit/cb4ac5d9115a2b10cbfd35bd17f9f07708b11ef0) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33657060481)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、139 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。路线详情时间线的停靠点使用 `stop-number::after` 与 `route-stop-ink-ring` 按阅读顺序错峰落印，时段细节使用 `stop-number--slot` 补齐连续节点；装饰不改变路线链接、语义或打印版布局，减少动效设置下恢复静态。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.103 发布复核：代码提交 [`6c89707`](https://github.com/Minkelxy/ningxia-tourism/commit/6c8970711f26286fa44e3500b6f39998b5138902) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33655323893)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、139 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。地图区域在键盘聚焦、区县图例联动和选中区县时使用 `map-region-emphasis` 装饰路径沿边界展开 `map-region-emphasis-draw` 高亮墨线，装饰线不参与交互；减少动效设置下恢复静态高亮。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.102 发布复核：代码提交 [`249f22b`](https://github.com/Minkelxy/ningxia-tourism/commit/249f22b9c32dd213503e459d2d2c3f039cff309a) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33653924834)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、139 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。首页远景山体、近景山体、印章和探索提示使用 `hero-mountain-back-in`、`hero-mountain-front-in`、`hero-seal-stamp` 与 `hero-scroll-cue-in` 按层级依次入场，稳定断言等待图形挂载后再核对动画顺序；减少动效设置下恢复静态绘图。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-03 v0.3.101 发布复核：代码提交 [`27ed465`](https://github.com/Minkelxy/ningxia-tourism/commit/27ed465f3d119c6369a1fd6f16a9a97d83f29620) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33651902556)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、139 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。城市/区县标签、景点、美食、政府和交通点位统一使用 `map-layer-pop-in` 轻量弹入绘图，区域描边完成后信息层级按顺序出现；固定透明触控热区保持至少 44px，减少动效设置下恢复静态图形。生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-02 v0.3.100 发布复核：代码提交 [`cbd6fb2`](https://github.com/Minkelxy/ningxia-tourism/commit/cbd6fb261dac35e7c981d7f3cb84770735da1cc6) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33649942121)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、139 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。路线详情时间线增加渐进绘制的路线轨道与停靠点错峰入场，320px 窄屏调整轨道位置，减少动效设置下恢复静态轨道与内容；生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-02 v0.3.99 发布复核：代码提交 [`4f8b933`](https://github.com/Minkelxy/ningxia-tourism/commit/4f8b933e0340be54cdcdc0affda95e6bb06c0634) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33647391633)为 **success**，build 与 deploy 两个 job 均成功；180 条单元测试、137 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。地图缩放、重置与城市/区县切换使用平滑视口过渡，拖拽期间关闭过渡保持即时跟手，减少动效设置下同时关闭视口过渡；线上已确认 `.map-viewport` 使用 `transform`、`0.36s` 过渡，地图区域使用 `map-region-draw` 与 `pathLength="1"`；生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200，页面宽度未超过视口。

2026-09-02 v0.3.98 发布复核：代码提交 [`0520d22`](https://github.com/Minkelxy/ningxia-tourism/commit/0520d2207fc257ff40006db7c3d8147db44236bf) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33644793878)为 **success**，build 与 deploy 两个 job 均成功；179 条单元测试、137 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。首页太阳、河流、轨道图形分别使用 `sun-breathe`、`river-shimmer`、`orbit-drift-*`，地图区域使用递进 `map-region-draw` 描边入场，减少动效设置下恢复静态绘图；线上地图区域已确认 `pathLength="1"` 与递进延迟，页面根宽度与视口一致；生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-02 v0.3.97 发布复核：代码提交 [`5065795`](https://github.com/Minkelxy/ningxia-tourism/commit/5065795c0181f1fe6d33ace999944af57aab42fe) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33642990078)为 **success**，build 与 deploy 两个 job 均成功；179 条单元测试、135 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。景点筛选搜索输入在 320px、390px、1280px 下实际高度均为 44px，页面根宽度与视口一致；生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-02 v0.3.96 发布复核：代码提交 [`f9ca2b4`](https://github.com/Minkelxy/ningxia-tourism/commit/f9ca2b4288678dd3456ca3c786a0186999d48760) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33639479592)为 **success**，build 与 deploy 两个 job 均成功；179 条单元测试、133 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。首页、全屏状态页和离线提示统一使用响应式站点头部高度变量，线上状态页在 320px、390px、1280px 下分别保持 64px、64px、72px 变量对应的高度关系，页面根宽度与视口一致；生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200。

2026-09-02 v0.3.95 发布复核：代码提交 [`a0d9f17`](https://github.com/Minkelxy/ningxia-tourism/commit/a0d9f176e853121e6e4cb7a5ee1d1d54d2a30335) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33636903857)为 **success**，build 与 deploy 两个 job 均成功；179 条单元测试、131 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。全站搜索输入控件本体在 320px、390px、1280px 下均为 44px 高，页面根宽度与视口一致；生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200，线上搜索页已复核三档视口的输入高度。

2026-09-02 v0.3.94 发布复核：代码提交 [`ffc9caa`](https://github.com/Minkelxy/ningxia-tourism/commit/ffc9caae82726e022fe36ae3ae8305dcc20a5f4c) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33635449244)为 **success**，build 与 deploy 两个 job 均成功；179 条单元测试、131 条 E2E 通过、13 条按端型跳过，Lighthouse 质量门禁通过。窄屏地图控制区在 320px、390px 下均为三列两行，六个控制项保持 44px 以上触控热区且页面根宽度与视口一致；生产构建、73 个页面 sitemap、深链回退与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200，线上地图控制区已复核 320px、390px 两档布局。

2026-09-02 v0.3.93 发布复核：代码提交 [`d3504f2`](https://github.com/Minkelxy/ningxia-tourism/commit/d3504f23b516ee80301b4105f9864906c2a2b126) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33633482009)为 **success**，build 与 deploy 两个 job 均成功；179 条单元测试、131 条 E2E 通过、11 条按端型跳过。收藏列表在 320px—480px 下统一收束景点标题/副标题与路线摘要，320px—360px 使用 44×44 图标收藏操作，390px—480px 保留文字按钮但条目高度保持 80–84px；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200，收藏页在 320px、390px、480px 下页面宽度与视口一致。

2026-09-02 v0.3.92 发布复核：代码提交 [`c3374c0`](https://github.com/Minkelxy/ningxia-tourism/commit/c3374c0a213dcd678b20ed7d8e91827ac5bcdecd) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33631862223)为 **success**，build 与 deploy 两个 job 均成功；179 条单元测试、131 条 E2E 通过、11 条按端型跳过。收藏列表在 320px—360px 下将收藏操作收束为 44×44 图标热区，景点标题与路线摘要做极窄屏省略，四条已填充收藏均保持约 80px 紧凑行高；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200，收藏页在 320px、360px 下页面宽度与视口一致。

2026-09-02 v0.3.91 发布复核：代码提交 [`451af10`](https://github.com/Minkelxy/ningxia-tourism/commit/451af10f626393849286fb8d2909ff770f255bd3) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33629977095)为 **success**，build 与 deploy 两个 job 均成功；179 条单元测试、129 条 E2E 通过、11 条按端型跳过。景点卡片在移动断点保持“加入对比”和“查看出行信息”同一行，与美食、路线卡片行动入口统一，生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上根路径 HTTP 200，景点列表深链按 GitHub Pages 预期返回 404 并由 SPA 回退正常渲染；320px、360px、390px 下已加入对比状态均保持 44px 高、同排且页面宽度不溢出。

2026-09-02 v0.3.90 发布复核：代码提交 [`37453d7`](https://github.com/Minkelxy/ningxia-tourism/commit/37453d73f533a8767a5187459c549919befee85e) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33628244621)为 **success**；179 条单元测试、127 条 E2E 通过、11 条按端型跳过，行前指南首屏在 320px、360px 极窄屏下将两个主要入口保持等宽同排，并与路线详情操作区共享收口规则；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核行前指南在 320px、360px、390px 下操作区同排、触控高度和页面宽度。

2026-09-02 v0.3.89 发布复核：代码提交 [`ba3bdd9`](https://github.com/Minkelxy/ningxia-tourism/commit/ba3bdd943399e6d948aa0e7ee9d7664e0da88dcc) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33626706613)为 **success**；179 条单元测试、125 条 E2E 通过、11 条按端型跳过，行前指南首屏在 320px、360px 极窄屏下将“按季节开始”和“直接看路线”保持等宽同排，并与路线详情操作区共享收口规则；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核行前指南在 320px、360px、390px 下操作区同排、触控高度和页面宽度。

2026-09-02 v0.3.88 发布复核：代码提交 [`e213f5d`](https://github.com/Minkelxy/ningxia-tourism/commit/e213f5d59f2b1184e7ec99faaddae65cd81bd2e1) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33625348854)为 **success**；179 条单元测试、123 条 E2E 通过、11 条按端型跳过，路线详情在 320px、360px 极窄屏下将打印、分享、收藏入口保持同一行，保留 390px 与桌面端原有操作层级；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核路线详情在 320px、360px、390px 下操作区同排、触控高度和页面宽度。

2026-09-02 v0.3.87 发布复核：代码提交 [`a750efe`](https://github.com/Minkelxy/ningxia-tourism/commit/a750efe96e3d18b478526b35b50572acb9cf3f4f) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33623756781)为 **success**；179 条单元测试、121 条 E2E 通过、11 条按端型跳过，路线详情在 320px、360px 极窄屏下将打印、分享、收藏入口保持同一行，保留 390px 与桌面端原有操作层级；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核路线详情在 320px、360px、390px 下操作区同排、触控高度和页面宽度。

2026-09-02 v0.3.86 发布复核：代码提交 [`b8e5735`](https://github.com/Minkelxy/ningxia-tourism/commit/b8e5735907764affa461639ff42b7d4a5a15082d) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33622237711)为 **success**；179 条单元测试、119 条 E2E 通过、11 条按端型跳过，详情页“周边推荐”和搜索结果末端箭头统一使用胡杨绿与轻量右移反馈，并保持卡片整体反馈独立；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核景点详情关联入口与搜索结果在桌面端、移动端的箭头颜色和悬停反馈。

2026-09-02 v0.3.85 发布复核：代码提交 [`b3db7cc`](https://github.com/Minkelxy/ningxia-tourism/commit/b3db7ccf810cca906abc046f4d87769a49044c91) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33620816592)为 **success**；179 条单元测试、117 条 E2E 通过、11 条按端型跳过，城市详情“精选目的地”卡片在移动端同步图片与内容列宽，避免 320px、390px 窄屏裁切并保持页面宽度约束；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核银川城市详情关联卡片在桌面端与 390px/320px 移动端的图片列宽和页面宽度。

2026-09-02 v0.3.84 发布复核：代码提交 [`9534c5e`](https://github.com/Minkelxy/ningxia-tourism/commit/9534c5eab916fd433b3aea283d24e894904244d2) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33619309979)为 **success**；179 条单元测试、115 条 E2E 通过、11 条按端型跳过，五城概览卡片内容区使用纵向弹性布局，桌面双列按行保持城市指南入口底部对齐，移动端保留图片自适应与页面宽度约束；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核五城概览桌面卡片按行对齐，以及 320px/390px 移动端图片与页面宽度。

2026-09-02 v0.3.83 发布复核：代码提交 [`d597530`](https://github.com/Minkelxy/ningxia-tourism/commit/d597530163a9b901341b8c4daf362db68f6442de) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33617914324)为 **success**；179 条单元测试、114 条 E2E 通过、10 条按端型跳过，五城概览卡片内容区使用纵向弹性布局，桌面双列按行保持城市指南入口底部对齐，移动端保留图片自适应与页面宽度约束；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核五城概览桌面卡片按行对齐，以及 320px/390px 移动端图片与页面宽度。

2026-09-02 v0.3.82 发布复核：代码提交 [`e8a5c7b`](https://github.com/Minkelxy/ningxia-tourism/commit/e8a5c7b7aabad172d5d23a6da3189461f4fa3612) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33616299998)为 **success**；179 条单元测试、113 条 E2E 通过、9 条按端型跳过，旅行手记列表卡片使用纵向弹性布局，桌面双列按行保持行动入口底部对齐，移动端保持单列且页面不横向溢出；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核旅行手记页桌面卡片按行对齐，以及 390px 移动端卡片单列和页面宽度。

2026-09-02 v0.3.81 发布复核：代码提交 [`1b6cd10`](https://github.com/Minkelxy/ningxia-tourism/commit/1b6cd1094caf77d099f50ebf499d62cfbd1f4049) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33614574076)为 **success**；179 条单元测试、111 条 E2E 通过、7 条按端型跳过，首页旅行专题卡片与景点、美食、推荐路线卡片均使用纵向弹性布局，桌面端行动入口底部对齐，中屏保留组合卡片，移动端保持单列布局；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核首页专题卡片行动入口对齐，以及 390px 页面无横向溢出。

2026-09-02 v0.3.80 发布复核：代码提交 [`961922a`](https://github.com/Minkelxy/ningxia-tourism/commit/961922aa58df7a178052c568550418df33239f7f) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33612891741)为 **success**；179 条单元测试、110 条 E2E 通过、6 条按端型跳过，景点、美食与推荐路线卡片均使用纵向弹性布局，桌面端行动入口底部对齐，移动端保持原有单列/响应式布局；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上已复核 1440px 路线页首两张卡片行动入口底部坐标一致，以及 390px 景点页、美食页无横向溢出。

2026-09-02 v0.3.79 发布复核：代码提交 [`4776f2e`](https://github.com/Minkelxy/ningxia-tourism/commit/4776f2ee10db62241650ccd90b297cfc40b2cbae) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33611597733)为 **success**；179 条单元测试、110 条 E2E 通过、6 条按端型跳过，推荐路线卡片使用纵向弹性布局，桌面端行动入口底部对齐，移动端保持单列布局；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上 1440px 已复核首两张路线卡片行动入口底部坐标一致，页面无横向溢出。

2026-09-02 v0.3.78 发布复核：代码提交 [`3239fcb`](https://github.com/Minkelxy/ningxia-tourism/commit/3239fcb61af63b65a37148e143131e15052d1e71) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33610326555)为 **success**；179 条单元测试、110 条 E2E 通过、6 条按端型跳过，路线卡片核实概览与景点详情多图选择器补充带名称的语义分组；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。随后提交 [`cdcf48b`](https://github.com/Minkelxy/ningxia-tourism/commit/cdcf48b2c26bec7545b41b554bd1cb367b960082) 收口 Playwright 浏览器缓存，避免应用修订号变化触发不必要的冷启动。

2026-09-02 v0.3.77 发布复核：代码提交 [`12a8565`](https://github.com/Minkelxy/ningxia-tourism/commit/12a856587d3b93f1d222562ac149c781b04fcc22) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33607908687)为 **success**；179 条单元测试、110 条 E2E 通过、6 条按端型跳过，首页山河主题图形使用 `role="img"` 与可访问名称，行前清单进度使用 `role="progressbar"` 并随勾选实时更新；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上 390px 已复核首页图形语义、行前清单进度数值变化与页面宽度无横向溢出。

2026-09-02 v0.3.76 发布复核：代码提交 [`7624a43`](https://github.com/Minkelxy/ningxia-tourism/commit/7624a43a817b172eaa41b27b7a7f72a24de3b31c) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33606110027)为 **success**；179 条单元测试、110 条 E2E 通过、6 条按端型跳过，五城概览城市卡片图片在 320px 下已按卡片宽度自适应且不撑宽页面；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上移动端已复核城市卡片布局与页面宽度。

2026-09-02 v0.3.75 发布复核：代码提交 [`46398f7`](https://github.com/Minkelxy/ningxia-tourism/commit/46398f7d2de24a685256385c530be7f9c43e9ad7) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33604185894)为 **success**；179 条单元测试、108 条 E2E 通过、6 条按端型跳过，地图层级与地图控制区补充分组语义，区县图例的指针反馈与按钮行为统一；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。线上 390px 移动端已复核地图控制分组、银川区县图例和兴庆区键盘高亮，页面宽度无横向溢出。

2026-09-02 v0.3.74 交互补充复核：代码提交 [`2866f49`](https://github.com/Minkelxy/ningxia-tourism/commit/2866f492d04f4c6c8befc46205c1d00590d949c0) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33602876159)为 **success**；179 条单元测试、108 条 E2E 通过、6 条按端型跳过，区县颜色图例已支持键盘聚焦联动地图区域高亮，并在失去焦点后清除临时高亮；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，线上移动端图例按钮与地图高亮已复核通过。

2026-09-02 v0.3.74 发布复核：代码提交 [`4945159`](https://github.com/Minkelxy/ningxia-tourism/commit/49451596ce201f7230607efe501c233d56e8abfb) 的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33601537199)为 **success**；179 条单元测试、106 条 E2E 通过、6 条按端型跳过，路线筛选四组条件补充独立语义分组且桌面与移动端回归通过；生产构建、73 个页面 sitemap、深链回退、Lighthouse 与 Pages 部署均通过，Pages 状态为 built。

2026-09-02 文档一致性补充：提交 [`418bc9a`](https://github.com/Minkelxy/ningxia-tourism/commit/418bc9af3576da718e0506334d725dd8e633a422) 已将 PRD 与技术架构的当前实现快照同步到 v0.3.73；对应的[主校验与 Pages 部署工作流](https://github.com/Minkelxy/ningxia-tourism/actions/runs/33599493774)为 **success**，远端 `main` 与该提交一致。

2026-09-02 工程元数据补充：`package.json` 与 `package-lock.json` 的项目版本已同步为 v0.3.73，与当前发布文档、测试基线和 Pages 构建基线保持一致。

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
