import { attractions, publishedAttractions } from './attractions';
import { cities } from './cities';
import { routes } from './routes';

export const validateContentData = () => {
  const errors: string[] = [];
  const ids = attractions.map((item) => item.id);
  const idSet = new Set(ids);
  const publishedIds = new Set(publishedAttractions.map((item) => item.id));
  const cityIds = new Set(cities.map((city) => city.id));
  const categories = new Set(['nature', 'history', 'religion', 'experience']);

  if (ids.length !== idSet.size) errors.push('景点 ID 存在重复');
  if (publishedAttractions.length !== 12) errors.push(`正式景点应为 12 个，当前为 ${publishedAttractions.length} 个`);
  if (attractions.filter((item) => item.status === 'draft').length !== 10) errors.push('草稿景点应为 10 个');
  if (cities.length !== 5) errors.push('城市数据应为 5 个');
  if (routes.length !== 7) errors.push('推荐路线应为 7 条');

  for (const item of attractions) {
    if (!cityIds.has(item.cityId)) errors.push(`${item.id}: cityId 无效`);
    if (!categories.has(item.category)) errors.push(`${item.id}: category 无效`);
    if (item.coordinates.lng < 104 || item.coordinates.lng > 108 || item.coordinates.lat < 35 || item.coordinates.lat > 40) errors.push(`${item.id}: 坐标超出宁夏合理范围`);
  }

  for (const item of publishedAttractions) {
    if (!item.summary || item.highlights.length === 0 || item.images.length === 0) errors.push(`${item.id}: 内容或图片不完整`);
    if (!item.verifiedAt || item.sources.filter((source) => source.kind === 'official').length === 0) errors.push(`${item.id}: 缺少核实日期或官方来源`);
    if (item.images.some((image) => !image.alt || !image.credit || !image.license || !image.sourceUrl)) errors.push(`${item.id}: 图片署名或许可不完整`);
    for (const value of Object.values(item.visitInfo)) {
      if (!value || value === '资料核实中') errors.push(`${item.id}: 正式景点实用信息不完整`);
    }
    for (const nearbyId of item.nearbyIds) {
      if (!publishedIds.has(nearbyId)) errors.push(`${item.id}: 周边景点 ${nearbyId} 未发布`);
    }
  }

  const routeIds = new Set<string>();
  for (const route of routes) {
    if (routeIds.has(route.id)) errors.push(`路线 ID 重复: ${route.id}`);
    routeIds.add(route.id);
    if (route.days.length !== route.durationDays) errors.push(`${route.id}: 行程天数与 day 数量不一致`);
    if (!route.verifiedAt || !route.budget.includes('约')) errors.push(`${route.id}: 缺少核实日期或参考预算标识`);
    for (const day of route.days) {
      for (const stop of day.stops) {
        if (stop.attractionId && !publishedIds.has(stop.attractionId)) errors.push(`${route.id}: 引用了未发布景点 ${stop.attractionId}`);
        if (!stop.attractionId && !stop.mapQuery) errors.push(`${route.id}: 普通地点 ${stop.title} 缺少地图查询词`);
      }
    }
  }

  return errors;
};

export const assertValidContentData = () => {
  const errors = validateContentData();
  if (errors.length) throw new Error(`内容数据校验失败：\n- ${errors.join('\n- ')}`);
};
