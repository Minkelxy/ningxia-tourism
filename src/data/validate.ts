import type { CityId, JournalEntry, TransportHub } from '../types';
import { attractionAliases, attractions, publishedAttractions } from './attractions';
import { cities } from './cities';
import { attractionThemes } from './discovery';
import { foods } from './foods';
import { routes } from './routes';
import { transportHubs } from './transport';
import { governmentMarkers } from '../components/map/config';
import { siteDateString } from '../lib/site';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const validImage = (image?: JournalEntry['cover']) => Boolean(image?.src && image.alt && image.credit && image.license && image.sourceUrl);
const validDate = (value: string) => datePattern.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const today = siteDateString();
const placeholderPattern = /(示例|演示用|示例店名|示例地址|待填写|example\.com)/i;

// 周期校验：verifiedAt 超过半年（180 天）视为过期，需重新复核。
// 在真正到期 10 天前（170 天阈值）进入软提醒窗口：日志 / CI 发 warning + 每周自动开 Issue，但不阻断构建。
export const VERIFICATION_STALE_DAYS = 180;
export const VERIFICATION_REMINDER_DAYS = 170;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const todayMs = Date.parse(`${today}T00:00:00Z`);
export const isStale = (verifiedAt: string): boolean => {
  if (!validDate(verifiedAt)) return true;
  const verifiedMs = Date.parse(`${verifiedAt}T00:00:00Z`);
  return (todayMs - verifiedMs) / MS_PER_DAY > VERIFICATION_STALE_DAYS;
};

/**
 * 返回距离「过期（>180 天）」还剩几天；基于 Asia/Shanghai 今日 00:00 计算。
 * - 无效日期 → null；
 * - 未过期 → ≥ 0（今天录入 = 180；第 180 天当天 = 0）；
 * - 已过期 → < 0（例如第 181 天 = -1）。
 * 这个纯函数供 180 天前置提醒脚本复用，避免同一份时间差分逻辑重复实现。
 */
export const daysUntilStale = (verifiedAt: string, referenceToday = today): number | null => {
  if (!validDate(verifiedAt)) return null;
  const referenceMs = Date.parse(`${referenceToday}T00:00:00Z`);
  const verifiedMs = Date.parse(`${verifiedAt}T00:00:00Z`);
  const diffDays = (referenceMs - verifiedMs) / MS_PER_DAY;
  return Math.round(VERIFICATION_STALE_DAYS - diffDays);
};

/** 是否进入了「10 天软提醒窗口（170–180 天）」；无效日期视为 true 以避免漏提醒。 */
export const isInReminderWindow = (verifiedAt: string, referenceToday = today): boolean => {
  const remaining = daysUntilStale(verifiedAt, referenceToday);
  if (remaining === null) return true;
  return remaining <= VERIFICATION_REMINDER_DAYS;
};

// 反糟粕校验所需的纯函数 helper（导出以便单元测试直接调用，不依赖文件系统）。
const kebabIdPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const templatePhonePattern = /^\d{4}-12306$/;

export const cityAreaCodes: Record<CityId, string> = {
  yinchuan: '0951',
  shizuishan: '0952',
  wuzhong: '0953',
  guyuan: '0954',
  zhongwei: '0955',
};

// 交通枢纽类型枚举（导出以便单元测试直接断言，避免运行时混入未定义枚举值）。
export const validTransportTypes = new Set(['highspeed_rail', 'railway', 'bus', 'airport']);

export const isValidKebabId = (id: string): boolean => kebabIdPattern.test(id);

export const isTemplatePhone = (phone: string): boolean => templatePhonePattern.test(phone) || phone.includes('12306');

export const getPhoneAreaCode = (phone: string): string => {
  // 中国大陆固定电话区号均为 4 位且以 0 开头（如 0951）。
  // 12306 这类全国统一服务号不以 0 开头，不视为区号。
  const match = phone.match(/^(0\d{3})/);
  return match ? match[1] : '';
};

export const validateTransportHubPhone = (hub: TransportHub): string[] => {
  const errors: string[] = [];
  if (!hub.phone) return errors;
  if (isTemplatePhone(hub.phone)) errors.push(`${hub.id}: 检测到模板化电话 ${hub.phone}`);
  const areaCode = getPhoneAreaCode(hub.phone);
  const expected = cityAreaCodes[hub.cityId];
  if (areaCode && expected && areaCode !== expected) errors.push(`${hub.id}: 电话区号 ${areaCode} 与城市 ${hub.cityId} 期望 ${expected} 不匹配`);
  return errors;
};

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
  const routePaces = new Set(['relaxed', 'balanced', 'intensive']);
  const walkingLevels = new Set(['low', 'medium', 'high']);
  if (ids.length !== idSet.size) errors.push('景点 ID 存在重复');
  if (publishedAttractions.length !== 22) errors.push(`公开景点应为 22 个，当前为 ${publishedAttractions.length} 个`);
  if (attractions.filter((item) => item.status === 'draft').length !== 1) errors.push('草稿景点应为 1 个');
  if (cities.length !== 5) errors.push('城市数据应为 5 个');
  if (routes.length !== 9) errors.push('推荐路线应为 9 条');
  for (const city of cities) {
    if (!city.suggestedStay || !city.arrivalNote || !city.planningTip || city.bestFor.length < 2) errors.push(`${city.id}: 缺少停留、抵达、适合人群或行程提醒`);
    if (city.bestFor.some((item) => !item.trim())) errors.push(`${city.id}: 适合人群标签不能为空`);
  }
  for (const item of attractions) {
    if (!isValidKebabId(item.id)) errors.push(`${item.id}: ID 不符合 kebab-case ASCII 规范`);
    if (!cityIds.has(item.cityId)) errors.push(`${item.id}: cityId 无效`);
    if (!categories.has(item.category)) errors.push(`${item.id}: category 无效`);
    if (!verificationLevels.has(item.verificationLevel)) errors.push(`${item.id}: verificationLevel 无效`);
    if (item.coordinates.lng < 104 || item.coordinates.lng > 108 || item.coordinates.lat < 35 || item.coordinates.lat > 40) errors.push(`${item.id}: 坐标超出宁夏合理范围`);
  }
  const contentStatuses = new Set(['published', 'draft']);
  const foodCategories = new Set(['mutton', 'noodle', 'snack', 'drink', 'fruit', 'specialty', 'staple']);
  for (const food of foods) {
    if (!isValidKebabId(food.id)) errors.push(`${food.id}: ID 不符合 kebab-case ASCII 规范`);
    if (!verificationLevels.has(food.verificationLevel)) errors.push(`${food.id}: verificationLevel 无效`);
    if (!contentStatuses.has(food.status)) errors.push(`${food.id}: status 无效`);
    if (!foodCategories.has(food.category)) errors.push(`${food.id}: category 无效`);
    if (food.status === 'published') {
      if (!validDate(food.verifiedAt) || food.verifiedAt > today) errors.push(`${food.id}: verifiedAt 无效或晚于当前日期`);
      if (isStale(food.verifiedAt)) errors.push(`${food.id}: verifiedAt 已超 ${VERIFICATION_STALE_DAYS} 天未复核，需重新核对`);
      if (food.sources.filter((source) => source.kind === 'official').length === 0) errors.push(`${food.id}: 缺少官方来源`);
    }
  }
  for (const hub of transportHubs) {
    if (!isValidKebabId(hub.id)) errors.push(`${hub.id}: ID 不符合 kebab-case ASCII 规范`);
    if (!cityIds.has(hub.cityId)) errors.push(`${hub.id}: cityId 无效`);
    if (!validTransportTypes.has(hub.type)) errors.push(`${hub.id}: type 无效 (${hub.type})`);
    if (!validDate(hub.verifiedAt) || hub.verifiedAt > today) errors.push(`${hub.id}: verifiedAt 缺失、无效或晚于当前日期`);
    if (isStale(hub.verifiedAt)) errors.push(`${hub.id}: verifiedAt 已超 ${VERIFICATION_STALE_DAYS} 天未复核，需重新核对`);
    errors.push(...validateTransportHubPhone(hub));
  }
  for (const item of publishedAttractions) {
    if (!item.summary || item.highlights.length === 0 || item.images.length === 0) errors.push(`${item.id}: 内容或图片不完整`);
    if (!validDate(item.verifiedAt) || item.verifiedAt > today || item.sources.filter((source) => source.kind === 'official').length === 0) errors.push(`${item.id}: 缺少有效核实日期或官方来源`);
    if (isStale(item.verifiedAt)) errors.push(`${item.id}: verifiedAt 已超 ${VERIFICATION_STALE_DAYS} 天未复核，需重新核对`);
    if (!item.verificationNote) errors.push(`${item.id}: 缺少证据说明`);
    if (item.verificationLevel === 'review' && !item.fallbackNote) errors.push(`${item.id}: 待复核景点缺少现场变化替代方案`);
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
  for (const [legacyId, targetId] of Object.entries(attractionAliases)) {
    if (idSet.has(legacyId)) errors.push(`旧景点链接 ${legacyId} 与现有景点 ID 冲突`);
    if (!publishedIds.has(targetId)) errors.push(`旧景点链接 ${legacyId} 指向未发布景点 ${targetId}`);
  }
  const themeIds = new Set<string>();
  for (const theme of attractionThemes) {
    if (themeIds.has(theme.id)) errors.push(`景点主题 ID 重复: ${theme.id}`);
    themeIds.add(theme.id);
    if (!theme.label || !theme.title || !theme.description || theme.attractionIds.length < 3) errors.push(`${theme.id}: 景点主题内容不完整`);
    if (new Set(theme.attractionIds).size !== theme.attractionIds.length) errors.push(`${theme.id}: 景点主题引用重复`);
    for (const attractionId of theme.attractionIds) if (!publishedIds.has(attractionId)) errors.push(`${theme.id}: 引用了未发布景点 ${attractionId}`);
  }
  const routeIds = new Set<string>();
  for (const route of routes) {
    if (routeIds.has(route.id)) errors.push(`路线 ID 重复: ${route.id}`);
    routeIds.add(route.id);
    if (route.days.length !== route.durationDays) errors.push(`${route.id}: 行程天数与 day 数量不一致`);
    if (!route.verifiedAt || !route.budget.includes('约')) errors.push(`${route.id}: 缺少核实日期或参考预算标识`);
    if (!validDate(route.verifiedAt) || route.verifiedAt > today) errors.push(`${route.id}: verifiedAt 格式无效或晚于当前日期`);
    if (isStale(route.verifiedAt)) errors.push(`${route.id}: verifiedAt 已超 ${VERIFICATION_STALE_DAYS} 天未复核，需重新核对`);
    if (!routePaces.has(route.pace) || !walkingLevels.has(route.walkingLevel) || !route.transportSummary) errors.push(`${route.id}: 缺少有效的节奏、步行量或交通画像`);
    for (const day of route.days) for (const stop of day.stops) {
      if (stop.attractionId && !publishedIds.has(stop.attractionId)) errors.push(`${route.id}: 引用了未发布景点 ${stop.attractionId}`);
      if (!stop.attractionId && !stop.mapQuery) errors.push(`${route.id}: 普通地点 ${stop.title} 缺少地图查询词`);
    }
  }
  for (const marker of governmentMarkers) {
    if (!isValidKebabId(marker.id)) errors.push(`政府标记 ${marker.id}: ID 不符合 kebab-case ASCII 规范`);
    if (!validDate(marker.verifiedAt) || marker.verifiedAt > today) errors.push(`政府标记 ${marker.id}: verifiedAt 无效或晚于当前日期`);
    if (isStale(marker.verifiedAt)) errors.push(`政府标记 ${marker.id}: verifiedAt 已超 ${VERIFICATION_STALE_DAYS} 天未复核，需重新核对`);
  }
  errors.push(...validateJournalContent(journalEntries, journalErrors));
  return errors;
};

export const assertValidContentData = (journalEntries: JournalEntry[] = [], journalErrors: string[] = []) => {
  const errors = validateContentData(journalEntries, journalErrors);
  if (errors.length) throw new Error(`内容数据校验失败：\n- ${errors.join('\n- ')}`);
};
