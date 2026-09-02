# 文档索引

`docs/` 目录收录项目的**发布、产品、技术、内容与贡献**相关文档，按主题分为三个子目录；当前发布快照与验收记录位于根部的 `RELEASE_STATUS.md`。

- 当前交互与发布复核版本为 v0.3.67；涉及页面结构的改动以应用外壳的唯一主内容区域为准，顶部导航、移动菜单与页脚“继续探索”共用同一组景点、美食、路线、指南、手记和五城内容入口，页脚分组提供明确的导航语义，三处入口共享当前页面路径匹配并统一暴露选中态与 `aria-current="page"`，景点、美食与首页专题卡片标题入口、城市/路线比较表名称入口、比较表“查看”操作入口以及路线详情停靠点名称入口保持至少 44px 触控热区，比较表操作入口同时保持至少 44px 宽，移动端输入框默认不主动唤起系统键盘，极窄屏品牌栏保持单行，手记栏目在 320px 等窄屏下可横向浏览，关于页 GitHub 内容审计记录入口指向实际文档路径并可访问，移动端导航以实色悬浮面板和背景遮罩打开并锁定背景滚动，未选中菜单项悬停反馈与桌面导航统一，城市比较表仅在自身容器内横向滚动且不撑宽页面，地图景点预览在桌面端与移动端统一使用轻量入场动效，路由懒加载使用与品牌标志一致的地图印章加载态，收藏页移动首屏保持紧凑节奏，收藏反馈、PWA 更新提示和景点对比停靠条统一预留底部手势安全区，移动端额外以带把手的底部面板呈现，同一路径的搜索与筛选参数变化也会重新播报页面状态，路线日程深链接会在内容加载后定位到对应天数，并使用响应式吸顶安全区；路线详情深色头图中的打印、分享与收藏操作保持同一套半透明按钮层级。

```
docs/
├── README.md                 ← 本文档：目录与使用指引
├── RELEASE_STATUS.md         ← 当前数据规模、验收命令与图片边界
├── product/                  产品与工程（工程向必读）
│   ├── 宁夏旅游地图PRD.md          产品需求文档：用户、功能、UI、内容全景
│   ├── 宁夏旅游地图技术架构.md     技术架构文档：分层、组件、路由、数据模型、测试、部署
│   ├── DEVELOPMENT_PLAN.md        开发里程碑、已完成阶段、后续规划与技术债务
│   ├── DEPLOYMENT.md              部署与 CI/CD：GitHub Actions 流水线与本地部署指南
│   ├── DATA_DICTIONARY.md         数据字典：TS 数据模块全字段速查表
│   └── optimization-7rounds-plan.md  历史 7 轮优化计划（已归档，供溯源）
│
├── content/                  内容与资产（内容维护向必读）
│   ├── CONTENT_AUDIT.md           内容审计：景点 / 美食 / 枢纽 / 手记的分级与复核记录
│   ├── IMAGE_PROVENANCE.md        图片来源：实拍/官方图片、许可与处理记录
│   ├── MAINTENANCE.md             维护手册：日常新增 / 复核 / 发布操作准则
│   └── attraction-template.json   新增景点数据 JSON 模板（参考字段清单）
│
└── templates/                内容模板（不参与站点构建）
    ├── editorial-topic.md         资料型旅行专题（editorial + type: guide）
    ├── travel-journal.md          亲历游记（firsthand + type: travel）
    ├── food-journal.md            探店手记（firsthand + type: food）
    └── route-template.md          路线规划模板（供数据录入参考）
```

## 如何使用文档

| 你想做什么 | 应该先看 |
|-----------|---------|
| 快速跑起来项目 | 根目录 [README.md](../README.md) |
| 查看当前发布状态与验收结果 | [RELEASE_STATUS.md](RELEASE_STATUS.md) |
| 提交数据 / 代码 PR | 根目录 [CONTRIBUTING.md](../CONTRIBUTING.md) + [content/MAINTENANCE.md](content/MAINTENANCE.md) |
| 理解**产品为什么做这些功能** | [product/宁夏旅游地图PRD.md](product/宁夏旅游地图PRD.md) |
| 理解**代码怎么组织、技术选型原因** | [product/宁夏旅游地图技术架构.md](product/宁夏旅游地图技术架构.md) |
| 查看 / 添加一条数据，不清楚字段含义 | [product/DATA_DICTIONARY.md](product/DATA_DICTIONARY.md) |
| 部署到自己的 Pages / 静态托管 | [product/DEPLOYMENT.md](product/DEPLOYMENT.md) |
| 判断一条内容应该标 verified / review | [content/CONTENT_AUDIT.md](content/CONTENT_AUDIT.md) |
| 新增手记 / 探店 | [templates/](templates/) 下对应模板 + [content/MAINTENANCE.md](content/MAINTENANCE.md) |
| 查看版本变化与重要更新 | 根目录 [CHANGELOG.md](../CHANGELOG.md) |

## 文档维护原则

1. **单一事实来源（SSOT）**：
   - 字段级定义以 `src/types/index.ts` 为准；`DATA_DICTIONARY.md` 是其人类可读镜像，字段变更时同步更新。
   - 数据级记录以 `src/data/*.ts` 和 `src/content/journal/*.md` 为准；`CONTENT_AUDIT.md` 记录分级与复核历史。
2. **日期必须同步**：任何内容核实后，`verifiedAt`、`sources[].checkedAt`、`CONTENT_AUDIT.md` 顶部日期三处一起更新。
3. **归档不删除**：历史计划（如 `optimization-7rounds-plan.md`）保留作溯源，但会在标题或顶部标注「已归档」。
4. **跨文档引用**：README 中只给出链接，不重复粘贴正文内容。
