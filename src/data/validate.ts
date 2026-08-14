import type { JournalEntry } from '../types';
import { attractions, publishedAttractions } from './attractions';
import { cities } from './cities';
import { routes } from './routes';
import { siteDateString } from '../lib/site';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const validImage = (image?: JournalEntry['cover']) => Boolean(image?.src && image.alt && image.credit && image.license && image.sourceUrl);
const validDate = (value: string) => datePattern.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const today = siteDateString();
const placeholderPattern = /(示例|演示用|示例店名|示例地址|待填写|example\.com)/i;

export const hasStrictVerificationEvidence = (item: (typeof attractions)[number]) => {
  const transparentImages = item.images.length > 0 && item.images.every((image) => image.alt && image.credit && image.license && image.sourceUrl);
  const directOfficialSource = item.sources.some((source) => source.kind === 'official'
    && source.level === 'direct'
    && source.coverage.includes('overview')
    && source.coverage.includes('location'));
  return transparentImages && directOfficialSource;
};

export const validateJournalContent = (entries: JournalEntry[], parseErrors: string[] = []) => {
  const errors = [...parseErrors];
  const slugs = new Set<string>();
  const cityIds = new Set(cities.map((city) => city.id));
  const publishedIds = new Set(publishedAttractions.map((item) => item.id));
  const routeIds = new Set(routes.map((route) => route.id));
  for (const entry of entries) {
    const key = `${entry.type}:${entry.slug}`;
    if (slugs.has(entry.slug)) errors.push(`手记 slug 重复: ${entry.slug}`);
    slugs.add(entry.slug);
    if (!cityIds.has(entry.cityId)) errors.push(`${key}: cityId 无效`);
    if (!validImage(entry.cover) || entry.gallery.some((image) => !validImage(image))) errors.push(`${key}: 图片署名或许可不完整`);
    for (const id of entry.relatedAttractionIds) if (!publishedIds.has(id)) errors.push(`${key}: 引用了未发布景点 ${id}`);
    for (const id of entry.relatedRouteIds) if (!routeIds.has(id)) errors.push(`${key}: 引用了无效路线 ${id}`);
    if (entry.status !== 'published') continue;
    const validContentKind = entry.type === 'guide' ? entry.contentKind === 'editorial' : entry.contentKind === 'firsthand';
    if (entry.contentKind === 'demo') errors.push(`${key}: 演示内容不能发布`);
    else if (!validContentKind) errors.push(`${key}: 内容类型与发布栏目不匹配`);
    if (placeholderPattern.test(JSON.stringify(entry))) errors.push(`${key}: 正式内容包含示例或占位文本`);
    if (!validDate(entry.publishedAt) || entry.publishedAt > today) errors.push(`${key}: 发布日期无效或晚于当前日期`);
    if (!validDate(entry.updatedAt) || entry.updatedAt < entry.publishedAt || entry.updatedAt > today) errors.push(`${key}: 更新日期无效`);
    if (entry.contentKind === 'firsthand') {
      const expectedImagePrefix = `images/journal/${entry.slug}/`;
      if ([entry.cover, ...entry.gallery].some((image) => !image.src.startsWith(expectedImagePrefix))) errors.push(`${key}: 正式手记图片必须位于 ${expectedImagePrefix}`);
    }
    if (entry.type === 'travel') {
      if (!validDate(entry.tripDate) || entry.tripDate > entry.publishedAt || !entry.duration || !entry.transport || !entry.budgetNote || !entry.highlights.length) errors.push(`${key}: 游记字段不完整或日期顺序错误`);
    } else if (entry.type === 'food' && (!validDate(entry.visitedAt) || entry.visitedAt > entry.publishedAt || !entry.venueName || !entry.cuisine || !entry.address || !entry.mapQuery || !entry.pricePerPerson || !entry.dishes.length || !entry.queueNote || !entry.suitableFor || !entry.revisitNote)) {
      errors.push(`${key}: 探店字段不完整`);
    } else if (entry.type === 'guide') {
      if (!validDate(entry.reviewedAt) || entry.reviewedAt > entry.updatedAt || !entry.scopeNote || !entry.keyPoints.length || entry.references.length < 2) errors.push(`${key}: 旅行专题字段不完整`);
      for (const source of entry.references) {
        if (!source.label || !validDate(source.checkedAt) || source.checkedAt > entry.reviewedAt) errors.push(`${key}: 专题来源信息不完整`);
        try { new URL(source.url); } catch { errors.push(`${key}: 专题来源链接无效`); }
      }
    }
  }
  return errors;
};

export const validateContentData = (journalEntries: JournalEntry[] = [], journalErrors: string[] = []) => {
  const errors: string[] = [];
  const ids = attractions.map((item) => item.id);
  const idSet = new Set(ids);
  const publishedIds = new Set(publishedAttractions.map((item) => item.id));
  const cityIds = new Set(cities.map((city) => city.id));
  const categories = new Set(['nature', 'history', 'religion', 'experience']);
  const verificationLevels = new Set(['verified', 'review']);
  const sourceLevels = new Set(['direct', 'directory', 'homepage']);
  const sourceCoverage = new Set(['overview', 'visit', 'location']);
  if (ids.length !== idSet.size) errors.push('景点 ID 存在重复');
  if (publishedAttractions.length !== 11) errors.push(`公开景点应为 11 个，当前为 ${publishedAttractions.length} 个`);
  if (attractions.filter((item) => item.status === 'draft').length !== 11) errors.push('草稿景点应为 11 个');
  if (cities.length !== 5) errors.push('城市数据应为 5 个');
  if (routes.length !== 7) errors.push('推荐路线应为 7 条');
  for (const item of attractions) {
    if (!cityIds.has(item.cityId)) errors.push(`${item.id}: cityId 无效`);
    if (!categories.has(item.category)) errors.push(`${item.id}: category 无效`);
    if (!verificationLevels.has(item.verificationLevel)) errors.push(`${item.id}: verificationLevel 无效`);
    if (item.coordinates.lng < 104 || item.coordinates.lng > 108 || item.coordinates.lat < 35 || item.coordinates.lat > 40) errors.push(`${item.id}: 坐标超出宁夏合理范围`);
  }
  for (const item of publishedAttractions) {
    if (!item.summary || item.highlights.length === 0 || item.images.length === 0) errors.push(`${item.id}: 内容或图片不完整`);
    if (!validDate(item.verifiedAt) || item.verifiedAt > today || item.sources.filter((source) => source.kind === 'official').length === 0) errors.push(`${item.id}: 缺少有效核实日期或官方来源`);
    if (!item.verificationNote) errors.push(`${item.id}: 缺少证据说明`);
    for (const source of item.sources) {
      if (!sourceLevels.has(source.level)) errors.push(`${item.id}: 来源层级无效`);
      if (!validDate(source.checkedAt) || source.checkedAt > item.verifiedAt) errors.push(`${item.id}: 来源核对日期无效`);
      if (source.coverage.some((coverage) => !sourceCoverage.has(coverage))) errors.push(`${item.id}: 来源支持范围无效`);
      if (source.level === 'direct' && source.coverage.length === 0) errors.push(`${item.id}: 直接来源未标明支持范围`);
      try { new URL(source.url); } catch { errors.push(`${item.id}: 来源链接无效`); }
    }
    if (item.images.some((image) => !image.alt || !image.credit || !image.license || !image.sourceUrl)) errors.push(`${item.id}: 图片署名或许可不完整`);
    if (item.verificationLevel === 'verified') {
      if (!hasStrictVerificationEvidence(item)) errors.push(`${item.id}: 缺少可追溯图片或支持概况与位置的官方直接来源`);
    }
    for (const value of Object.values(item.visitInfo)) if (!value || value === '资料核实中') errors.push(`${item.id}: 正式景点实用信息不完整`);
    for (const nearbyId of item.nearbyIds) if (!publishedIds.has(nearbyId)) errors.push(`${item.id}: 周边景点 ${nearbyId} 未发布`);
  }
  const routeIds = new Set<string>();
  for (const route of routes) {
    if (routeIds.has(route.id)) errors.push(`路线 ID 重复: ${route.id}`);
    routeIds.add(route.id);
    if (route.days.length !== route.durationDays) errors.push(`${route.id}: 行程天数与 day 数量不一致`);
    if (!route.verifiedAt || !route.budget.includes('约')) errors.push(`${route.id}: 缺少核实日期或参考预算标识`);
    for (const day of route.days) for (const stop of day.stops) {
      if (stop.attractionId && !publishedIds.has(stop.attractionId)) errors.push(`${route.id}: 引用了未发布景点 ${stop.attractionId}`);
      if (!stop.attractionId && !stop.mapQuery) errors.push(`${route.id}: 普通地点 ${stop.title} 缺少地图查询词`);
    }
  }
  errors.push(...validateJournalContent(journalEntries, journalErrors));
  return errors;
};

export const assertValidContentData = (journalEntries: JournalEntry[] = [], journalErrors: string[] = []) => {
  const errors = validateContentData(journalEntries, journalErrors);
  if (errors.length) throw new Error(`内容数据校验失败：\n- ${errors.join('\n- ')}`);
};
