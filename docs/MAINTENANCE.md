# 内容维护说明

1. 只在 `src/data/attractions.ts`、`cities.ts` 和 `routes.ts` 中维护公开内容，不再复制 JSON 副本。
2. 新景点先以 `draft` 加入，完成字段、来源和图片许可核对后再改为 `published`。
3. 坐标统一使用 WGS84；县区写入 `locality`，地级市只能使用五个固定 `cityId`。
4. 路线中的正式景点必须引用现有 `attractionId`；夜市、酒店等普通地点必须填写 `mapQuery`。
5. 每次修改后先运行 `npm run validate:data`，再运行 `npm run check && npm test && npm run build`。
6. 票价、开放时间、预算和交通时间属于易变信息，更新时同步修改 `verifiedAt`，并保留官方来源链接。
7. 图片必须是原创、公共领域或明确的 Creative Commons 授权文件；详情页需要展示作者、许可和原始页面。
