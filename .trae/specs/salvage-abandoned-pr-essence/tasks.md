# Tasks

- [x] Task 1: 扩展类型定义与反糟粕校验基础
  - [x] SubTask 1.1: 在 `src/types/index.ts` 新增 `Food`/`Restaurant`/`FoodCategory` 类型（`Food` 含 `sources`/`verifiedAt`/`status` 字段，`Restaurant` 仅含 `name`/`city`/`coordinates?`/`recommend?`，移除 `phone`）
  - [x] SubTask 1.2: 扩展 `TransportHub`（新增可选 `description`/`address`/`phone`）与 `TransportType`（新增 `'airport'` 字面量，不写成 `| string`）
  - [x] SubTask 1.3: 扩展 `RouteDay`（新增可选 `timeSlots: { time, location, description, tips? }[]`）
  - [x] SubTask 1.4: 在 `scripts/validate-data.ts` 新增反糟粕校验：重复数据双写检测、模板化电话检测（`XXXX-12306` + 区号匹配）、异常 ID 检测（kebab-case ASCII）、`| string` 类型削弱检测
  - [x] SubTask 1.5: 在 `src/data/validate.test.ts` 为每条新校验规则补充通过/失败用例

- [x] Task 2: 重建美食目录数据与图层
  - [x] SubTask 2.1: 新建 `src/data/foods.ts`，从 PR #7 的 14 道美食中筛选可核实条目录入，每条带 `sources`/`verifiedAt`/`status`；修正异常 ID（`hua jianao`→`zhongwei-latiaozi`、`làhúhu`→`lahuhu`）；餐厅移除 `phone` 字段；无法核实的条目标记为 `draft`
  - [x] SubTask 2.2: 导出 `publishedFoods`/`verifiedFoods`/`reviewFoods` 辅助函数（沿用 attractions 模式）
  - [x] SubTask 2.3: 新建 `src/components/map/FoodLayer.tsx`，渲染 `verified`/`review` 状态美食的代表餐厅坐标点，支持悬停 tooltip
  - [x] SubTask 2.4: 在 `src/components/map/MapControls.tsx` 新增"美食"图层开关，默认关闭（Task 4.5 集成完成）
  - [x] SubTask 2.5: 在 `src/components/NingxiaInteractiveMap.tsx` 接入 `FoodLayer`（Task 4.5 集成完成）
  - [x] SubTask 2.6: 在 `src/pages/CityOverview.tsx` 把"城市味道"区块从 `city.foods` 字符串升级为引用 `foods.ts` 的结构化卡片（仅展示 published 美食）

- [x] Task 3: 交通枢纽详情补全与机场类型修正
  - [x] SubTask 3.1: 在 `src/data/transport.ts` 把"银川河东国际机场"的 `type` 由 `'highspeed_rail'` 改为 `'airport'`（Task 1 已完成）
  - [x] SubTask 3.2: 为 8 个枢纽补全 `description`（基于真实铁路线路：包兰/太中银/宝中/银西/银兰）与 `address`，附 `sources`/`verifiedAt`；`phone` 字段仅保留真实汽车站号码（0954-2031155），删除所有 `0951-12306` 模板值
  - [x] SubTask 3.3: 在 `src/components/map/TransportLayer.tsx` 增加 `'airport'` 类型的图标与配色（Plane 图标）
  - [x] SubTask 3.4: 在枢纽悬停 tooltip 展示 `description` 与 `address`

- [x] Task 4: 地图政府标记图层
  - [x] SubTask 4.1: 在 `src/components/map/config.ts` 新增 `governmentMarkers` 坐标数据（自治区政府 + 5 市政府，附 `sources`/`verifiedAt`）
  - [x] SubTask 4.2: 新建 `src/components/map/GovernmentLayer.tsx`，渲染政府标记点（`province-capital`/`city-capital` 区分），悬停仅显示名称与行政级别
  - [x] SubTask 4.3: 在 `src/components/map/MapControls.tsx` 新增"政府标记"图层开关，默认关闭（Task 4.5 集成完成）
  - [x] SubTask 4.4: 在 `src/components/NingxiaInteractiveMap.tsx` 接入 `GovernmentLayer`（Task 4.5 集成完成）

- [x] Task 5: 路线时间槽增强（轻量）
  - [x] SubTask 5.1: 在 `src/pages/RouteDetail.tsx` 渲染 `RouteDay.timeSlots`（若存在），按时间槽展示地点/描述/贴士
  - [x] SubTask 5.2: 为 `classic-3day` 路线补充 Day 1 与 Day 2 的 `timeSlots` 作为示例

- [x] Task 6: 文档与测试同步
  - [x] SubTask 6.1: 更新 `docs/CONTENT_AUDIT.md`，新增美食目录与交通枢纽详情的核实状态表，记录待补项
  - [x] SubTask 6.2: 更新 `README.md` 功能模块表，新增美食目录/政府标记图层，移除任何虚构依赖声明
  - [x] SubTask 6.3: 运行 `npm run validate:data`、`npm run check`、`npm run lint`、`npm test`、`npm run build` 全部通过（e2e 受沙箱浏览器下载限制未能执行，测试文件已通过 tsc 编译且 Playwright 可发现全部 38 个用例）
  - [x] SubTask 6.4: 为美食图层、政府标记图层、交通机场类型补充 Playwright e2e 用例

- [x] Task 7 (验证补全): 实现 `| string` 类型削弱运行时检测
  - [x] SubTask 7.1: 在 `scripts/validate-data.ts` 增加源码扫描，读取 `src/types/index.ts`，用正则检测 `TransportType`/`FoodCategory`/`ContentStatus`/`VerificationLevel` 等联合类型声明行是否包含 `| string`，若命中则抛错阻止构建
  - [x] SubTask 7.2: 在 `src/data/validate.ts` 增加 `transportHubs` 的 `hub.type` 枚举值校验（参考 attractions category 校验模式），并在 `validate.test.ts` 补一个失败用例

# Task Dependencies

- Task 2 / Task 3 / Task 4 依赖 Task 1（类型与校验基础）
- Task 5 依赖 Task 1（RouteDay 类型扩展）
- Task 6 依赖 Task 2 / Task 3 / Task 4 / Task 5 全部完成
- Task 2 / Task 3 / Task 4 / Task 5 在 Task 1 完成后可并行
