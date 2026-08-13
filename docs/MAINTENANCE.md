# 内容维护说明

1. 景点、城市和路线只在 `src/data/attractions.ts`、`cities.ts` 和 `routes.ts` 中维护，不再复制 JSON 副本。
2. 新景点先以 `draft` 加入，完成字段、来源和图片许可核对后再改为 `published`。
3. 坐标统一使用 WGS84；县区写入 `locality`，地级市只能使用五个固定 `cityId`。
4. 路线中的正式景点必须引用现有 `attractionId`；夜市、酒店等普通地点必须填写 `mapQuery`。
5. 每次修改后先运行 `npm run validate:data`，再运行 `npm run check && npm test && npm run build`。
6. 票价、开放时间、预算和交通时间属于易变信息，更新时同步修改 `verifiedAt`，并保留官方来源链接。
7. 图片必须是原创、公共领域或明确的 Creative Commons 授权文件；详情页需要展示作者、许可和原始页面。
8. 游记与探店使用 `docs/templates/` 中的模板，完成后复制到 `src/content/journal/`；只有 `status: published` 才会公开。
9. 公开手记必须使用真实素材，封面与图集放在 `public/images/journal/` 并生成 WebP/AVIF 多尺寸版本。草稿不会进入列表、详情或站点地图。
10. 探店的人均、排队、地址和营业信息必须绑定 `visitedAt`；个人体验不使用星级或数字评分。
11. 证据等级变更后同步更新 `docs/CONTENT_AUDIT.md`。区域氛围图、政府首页级来源或事实缺口不能标为 `verified`。
