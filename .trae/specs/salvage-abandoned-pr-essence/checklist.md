# Checklist

## 类型与校验基础
- [x] `src/types/index.ts` 新增 `Food`/`Restaurant`/`FoodCategory`，`Food` 含 `sources`/`verifiedAt`/`status` 字段
- [x] `Restaurant` 类型仅含 `name`/`city`/`coordinates?`/`recommend?`，**不含 `phone`**
- [x] `TransportType` 联合新增 `'airport'` 字面量，未写成 `TransportType | string`
- [x] `TransportHub` 新增可选 `description`/`address`/`phone`
- [x] `RouteDay` 新增可选 `timeSlots`，向后兼容（无 timeSlots 的日程正常渲染）
- [x] `scripts/validate-data.ts` 实现重复数据双写检测、模板化电话检测、异常 ID 检测、`| string` 类型削弱检测
- [x] `validate.test.ts` 为每条新校验规则提供通过/失败用例

## 美食目录模块
- [x] `src/data/foods.ts` 存在，导出 `publishedFoods`/`verifiedFoods`/`reviewFoods`
- [x] 美食条目 `id` 全部为 kebab-case ASCII（无 `hua jianao`/`làhúhu` 等异常 ID）
- [x] 餐厅条目均无 `phone` 字段
- [x] `draft` 状态美食不出现在公开地图图层与城市页
- [x] `src/components/map/FoodLayer.tsx` 实现，悬停有 tooltip
- [x] `MapControls.tsx` 新增"美食"开关，默认关闭
- [x] `NingxiaInteractiveMap.tsx` 接入 FoodLayer
- [x] `CityOverview.tsx` "城市味道"区块引用 `foods.ts` 结构化数据

## 交通枢纽详情
- [x] "银川河东国际机场" `type` 为 `'airport'`，不再是 `highspeed_rail`
- [x] 8 个枢纽含 `description`（基于真实铁路线路）与 `address`，附 `sources`/`verifiedAt`
- [x] 所有 `0951-12306` 模板电话已删除
- [x] `TransportLayer.tsx` 支持 `'airport'` 类型图标（Plane）
- [x] 枢纽 tooltip 展示 `description`/`address`（仅 verified/review）

## 政府标记图层
- [x] `config.ts` 含 `governmentMarkers`（自治区政府 + 5 市政府）坐标，附 `sources`/`verifiedAt`
- [x] `GovernmentLayer.tsx` 实现，区分 `province-capital`/`city-capital`
- [x] 悬停仅显示名称与行政级别，无未核实运营信息
- [x] `MapControls.tsx` 新增"政府标记"开关，默认关闭
- [x] `NingxiaInteractiveMap.tsx` 接入 GovernmentLayer

## 路线时间槽
- [x] `RouteDetail.tsx` 渲染 `timeSlots`（若存在）
- [x] 无 `timeSlots` 的 `RouteDay` 仍正常渲染（向后兼容）
- [x] 至少 1 条经典路线补充 `timeSlots` 示例

## 反糟粕门禁
- [x] `npm run validate:data` 检测到重复数据双写时阻止构建
- [x] `npm run validate:data` 检测到 `XXXX-12306` 模板电话时阻止构建
- [x] `npm run validate:data` 检测到异常 ID（含空格/非 ASCII/非 kebab-case）时阻止构建
- [x] `npm run validate:data` 检测到 `| string` 类型削弱时报错
- [x] README 中无虚构依赖声明（Zustand/D3/TopoJSON）

## 全量验证
- [x] `npm run validate:data` 通过
- [x] `npm run check`（tsc --noEmit）通过
- [x] `npm run lint` 通过
- [x] `npm test`（Vitest）全部通过
- [x] `npm run test:e2e`（Playwright）桌面与手机端全部通过
- [x] `npm run build` 生产构建成功
- [x] 新增图层（美食/政府/机场类型）有对应 e2e 用例
- [x] `docs/CONTENT_AUDIT.md` 记录美食与交通枢纽核实状态
