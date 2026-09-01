# 文档索引

`docs/` 目录收录项目的**发布、产品、技术、内容与贡献**相关文档，按主题分为三个子目录；当前发布快照与验收记录位于根部的 `RELEASE_STATUS.md`。

当前交互与发布复核版本为 v0.3.45；涉及页面结构的改动以应用外壳的唯一主内容区域为准，移动端输入框默认不主动唤起系统键盘，同一路径的搜索与筛选参数变化也会重新播报页面状态。

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
