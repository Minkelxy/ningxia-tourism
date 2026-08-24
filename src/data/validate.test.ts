import { describe, expect, it } from 'vitest';
import { attractionAliases, attractions, publishedAttractions, reviewAttractions, verifiedAttractions } from './attractions';
import { journalEntries, journalErrors, publishedJournalEntries } from '../content/journal';
import { cities } from './cities';
import { attractionThemes } from './discovery';
import { routes } from './routes';
import { transportHubs } from './transport';
import type { CityId, TransportHub, TravelJournal } from '../types';
import { siteDateString } from '../lib/site';
import { VERIFICATION_STALE_DAYS, VERIFICATION_REMINDER_DAYS, assertValidContentData, cityAreaCodes, daysUntilStale, getPhoneAreaCode, hasStrictVerificationEvidence, isInReminderWindow, isStale, isTemplatePhone, isValidKebabId, validTransportTypes, validateContentData, validateJournalContent, validateTransportHubPhone } from './validate';

describe('公开内容数据', () => {
  it('通过完整性和引用校验', () => {
    expect(validateContentData(journalEntries, journalErrors)).toEqual([]);
  });

  it('保持当前公开内容数量稳定', () => {
    expect(cities).toHaveLength(5);
    expect(publishedAttractions).toHaveLength(22);
    expect(verifiedAttractions).toHaveLength(20);
    expect(reviewAttractions).toHaveLength(2);
    expect(attractions.filter((item) => item.status === 'draft')).toHaveLength(1);
    expect(routes).toHaveLength(9);
    expect(publishedJournalEntries).toHaveLength(15);
    expect(publishedJournalEntries.every((entry) => entry.type === 'guide' && entry.contentKind === 'editorial')).toBe(true);
    expect(publishedJournalEntries[0].slug).toBe('zhongwei-sand-water-choice');
  });

  it('五个地级市都有公开旅行专题覆盖', () => {
    expect(new Set(publishedJournalEntries.map((entry) => entry.cityId))).toEqual(new Set(cities.map((city) => city.id)));
  });

  it('五城都有可用于横向决策的编辑建议', () => {
    for (const city of cities) {
      expect(city.suggestedStay).not.toBe('');
      expect(city.arrivalNote).not.toBe('');
      expect(city.bestFor.length).toBeGreaterThanOrEqual(2);
      expect(city.planningTip).not.toBe('');
    }
    expect(cities.find((city) => city.id === 'wuzhong')?.planningTip).toContain('不是同一个地点');
    expect(cities.find((city) => city.id === 'guyuan')?.planningTip).toContain('分属不同县');
  });

  it('首页级来源不能通过严格核实', () => {
    const sample = { ...verifiedAttractions[0], images: [{ ...verifiedAttractions[0].images[0], alt: '宁夏区域氛围图' }], sources: [{ label: '政府首页', url: 'https://example.com/', kind: 'official' as const, level: 'homepage' as const, coverage: [], checkedAt: '2026-08-15' }] };
    expect(hasStrictVerificationEvidence(sample)).toBe(false);
  });

  it('说明清楚且许可完整的区域配图不阻止事实核实', () => {
    const sample = { ...verifiedAttractions[0], images: [{ ...verifiedAttractions[0].images[0], alt: '宁夏区域氛围图（非景点实景）' }] };
    expect(hasStrictVerificationEvidence(sample)).toBe(true);
  });

  it('严格核实必须有标明概况和位置的官方直接专页', () => {
    const sample = { ...verifiedAttractions[0], sources: [{ ...verifiedAttractions[0].sources[0], level: 'directory' as const }] };
    expect(hasStrictVerificationEvidence(sample)).toBe(false);
  });

  it('博物馆与高庙具有直接来源和准确图片，可通过严格核实', () => {
    for (const id of ['ningxiamuseum', 'zhongweigaomiao']) {
      const item = publishedAttractions.find((attraction) => attraction.id === id);
      expect(item?.verificationLevel).toBe('verified');
      expect(hasStrictVerificationEvidence(item!)).toBe(true);
      expect(item?.sources.some((source) => source.level === 'direct' && source.coverage.includes('visit'))).toBe(true);
    }
  });

  it('黄河坛和六盘山条目具有明确目的地边界及直接来源', () => {
    for (const id of ['huanghetan', 'liupanshan']) {
      const item = publishedAttractions.find((attraction) => attraction.id === id);
      expect(item?.verificationLevel).toBe('verified');
      expect(hasStrictVerificationEvidence(item!)).toBe(true);
      expect(item?.sources.some((source) => source.level === 'direct' && source.coverage.includes('location'))).toBe(true);
    }

    const liupanshan = publishedAttractions.find((attraction) => attraction.id === 'liupanshan');
    expect(liupanshan?.name).toBe('六盘山红军长征旅游区');
    expect(liupanshan?.locality).toBe('隆德县');
    expect(liupanshan?.summary).toContain('不指泾源县');
  });

  it('新增三处目的地具有直接来源、实景许可和完整实用字段', () => {
    for (const id of ['shuidonggou', 'xumishan', 'huangyeguda']) {
      const item = publishedAttractions.find((attraction) => attraction.id === id);
      expect(item?.verificationLevel).toBe('verified');
      expect(hasStrictVerificationEvidence(item!)).toBe(true);
      expect(item?.images[0].sourceUrl).toContain('commons.wikimedia.org');
      expect(Object.values(item?.visitInfo ?? {}).every(Boolean)).toBe(true);
    }
  });

  it('贺兰山森林公园与鸣翠湖保留旧链接并透明标注区域配图', () => {
    const forest = publishedAttractions.find((attraction) => attraction.id === 'suyukou');
    const wetland = publishedAttractions.find((attraction) => attraction.id === 'mingcuihu');
    expect(forest?.name).toBe('宁夏贺兰山国家森林公园');
    expect(wetland?.name).toBe('鸣翠湖国家湿地公园');
    for (const item of [forest, wetland]) {
      expect(item?.verificationLevel).toBe('verified');
      expect(hasStrictVerificationEvidence(item!)).toBe(true);
      expect(item?.images[0].alt).toContain('非');
      expect(item?.sources.some((source) => source.level === 'direct' && source.coverage.includes('visit'))).toBe(true);
    }
  });

  it('黄沙古渡与金沙岛具有直接来源、区域配图说明和完整实用字段', () => {
    for (const id of ['huangshagudu', 'zhongweijinshadao']) {
      const item = publishedAttractions.find((attraction) => attraction.id === id);
      expect(item?.verificationLevel).toBe('verified');
      expect(hasStrictVerificationEvidence(item!)).toBe(true);
      expect(item?.images[0].alt).toContain('非');
      expect(item?.sources.some((source) => source.level === 'direct' && source.coverage.includes('visit'))).toBe(true);
      expect(Object.values(item?.visitInfo ?? {}).every(Boolean)).toBe(true);
    }
  });

  it('北武当补齐石嘴山城区山地目的地并说明等级与配图边界', () => {
    const beiwudang = publishedAttractions.find((attraction) => attraction.id === 'beiwudang');
    expect(beiwudang?.cityId).toBe('shizuishan');
    expect(beiwudang?.locality).toBe('大武口区');
    expect(beiwudang?.verificationLevel).toBe('verified');
    expect(hasStrictVerificationEvidence(beiwudang!)).toBe(true);
    expect(beiwudang?.verificationNote).toContain('现行 A 级名录确认其为 4A');
    expect(beiwudang?.images[0].alt).toContain('编辑插画');
    expect(beiwudang?.nearbyIds).toContain('shahu');
  });

  it('大武口工业遗址公园与石嘴山两日路线形成城市内容闭环', () => {
    const industrial = publishedAttractions.find((attraction) => attraction.id === 'dawukou-industrial');
    const cityRoute = routes.find((route) => route.id === 'shizuishan-2day');
    expect(industrial?.cityId).toBe('shizuishan');
    expect(industrial?.locality).toBe('大武口区');
    expect(industrial?.verificationLevel).toBe('verified');
    expect(hasStrictVerificationEvidence(industrial!)).toBe(true);
    expect(industrial?.images[0].alt).toContain('非景区实景');
    expect(industrial?.verificationNote).toContain('公共园区和内部展馆');
    expect(cityRoute?.days).toHaveLength(2);
    expect(cityRoute?.days.flatMap((day) => day.stops).filter((stop) => stop.attractionId).map((stop) => stop.attractionId)).toEqual(['shahu', 'beiwudang', 'dawukou-industrial']);
  });

  it('盐池革命历史纪念园使用现行名称并由红色路线直接引用', () => {
    const yanchi = publishedAttractions.find((attraction) => attraction.id === 'yanchilie');
    const redRoute = routes.find((route) => route.id === 'red-culture-3day');
    expect(yanchi?.name).toBe('盐池革命历史纪念园');
    expect(yanchi?.verificationLevel).toBe('verified');
    expect(hasStrictVerificationEvidence(yanchi!)).toBe(true);
    expect(yanchi?.images[0].alt).toContain('非盐池革命历史纪念园实景');
    expect(redRoute?.days.flatMap((day) => day.stops).some((stop) => stop.attractionId === 'yanchilie')).toBe(true);
  });

  it('老城街区正式发布，待复核景点均提供可执行替代方案', () => {
    const oldCity = publishedAttractions.find((attraction) => attraction.id === 'gulou-yuhuangge');
    expect(oldCity?.verificationLevel).toBe('verified');
    expect(hasStrictVerificationEvidence(oldCity!)).toBe(true);
    expect(oldCity?.images[0].alt).toContain('编辑插画');
    expect(reviewAttractions.every((attraction) => Boolean(attraction.fallbackNote))).toBe(true);
  });

  it('重复旧条目并入完整目的地并保留链接映射', () => {
    expect(attractionAliases).toEqual({ yibaisiba: 'huangyeguda', jinjiping: 'pengyangtitian' });
    expect(Object.keys(attractionAliases).every((id) => !attractions.some((item) => item.id === id))).toBe(true);
    expect(Object.values(attractionAliases).every((id) => publishedAttractions.some((item) => item.id === id))).toBe(true);
  });

  it('四组发现主题只引用公开景点', () => {
    const publishedIds = new Set(publishedAttractions.map((item) => item.id));
    expect(attractionThemes).toHaveLength(4);
    expect(attractionThemes.flatMap((theme) => theme.attractionIds).every((id) => publishedIds.has(id))).toBe(true);
  });
});

describe('反糟粕数据校验', () => {
  it('ID 必须符合 kebab-case ASCII 规范', () => {
    expect(isValidKebabId('hua jianao')).toBe(false);
    expect(isValidKebabId('làhúhu')).toBe(false);
    expect(isValidKebabId('shouzhua-yangrou')).toBe(true);
    expect(isValidKebabId('zhongwei-latiaozi')).toBe(true);
    expect(isValidKebabId('NingxiaMuseum')).toBe(false);
    expect(isValidKebabId('shahu')).toBe(true);
  });

  it('识别模板化电话号码', () => {
    expect(isTemplatePhone('0951-12306')).toBe(true);
    expect(isTemplatePhone('12306')).toBe(true);
    expect(isTemplatePhone('服务电话 12306')).toBe(true);
    expect(isTemplatePhone('0951-6123456')).toBe(false);
    expect(isTemplatePhone('0953-2024567')).toBe(false);
  });

  it('提取电话区号前缀', () => {
    expect(getPhoneAreaCode('0951-6123456')).toBe('0951');
    expect(getPhoneAreaCode('0951-12306')).toBe('0951');
    expect(getPhoneAreaCode('12306')).toBe('');
    expect(getPhoneAreaCode('客服电话')).toBe('');
  });

  it('宁夏五市电话区号映射正确', () => {
    expect(cityAreaCodes).toEqual({
      yinchuan: '0951',
      shizuishan: '0952',
      wuzhong: '0953',
      guyuan: '0954',
      zhongwei: '0955',
    });
  });

  it('交通枢纽电话区号必须与所在城市匹配', () => {
    const mismatched: TransportHub = {
      id: 'wuzhong-test', name: '吴忠测试枢纽', cityId: 'wuzhong', type: 'railway',
      coordinates: { lng: 106.19, lat: 37.94 }, phone: '0951-6123456', verifiedAt: '2026-08-17',
    };
    const errors = validateTransportHubPhone(mismatched);
    expect(errors.some((message) => message.includes('电话区号') && message.includes('0951'))).toBe(true);
  });

  it('交通枢纽模板化电话同时被区号规则捕获', () => {
    const templated: TransportHub = {
      id: 'wuzhong-test', name: '吴忠测试枢纽', cityId: 'wuzhong', type: 'railway',
      coordinates: { lng: 106.19, lat: 37.94 }, phone: '0951-12306', verifiedAt: '2026-08-17',
    };
    const errors = validateTransportHubPhone(templated);
    expect(errors.some((message) => message.includes('检测到模板化电话'))).toBe(true);
  });

  it('合法交通枢纽电话不会被误报', () => {
    const ok: TransportHub = {
      id: 'wuzhong-test', name: '吴忠测试枢纽', cityId: 'wuzhong', type: 'railway',
      coordinates: { lng: 106.19, lat: 37.94 }, phone: '0953-2024567', verifiedAt: '2026-08-17',
    };
    expect(validateTransportHubPhone(ok)).toEqual([]);
  });

  it('无电话字段的交通枢纽不会被误报', () => {
    const hub = transportHubs.find((item) => item.id === 'yinchuan-airport')!;
    expect(hub.type).toBe('airport');
    expect(validateTransportHubPhone(hub)).toEqual([]);
  });

  it('现有交通枢纽均为合法 kebab-case ID', () => {
    expect(transportHubs.every((hub) => isValidKebabId(hub.id))).toBe(true);
  });

  it('交通枢纽类型枚举拒绝未定义值（如 teleport）', () => {
    expect(validTransportTypes.has('teleport')).toBe(false);
    expect(validTransportTypes.has('airport')).toBe(true);
    expect(validTransportTypes.has('highspeed_rail')).toBe(true);
    expect(validTransportTypes.has('railway')).toBe(true);
    expect(validTransportTypes.has('bus')).toBe(true);
  });

  it('现有交通枢纽类型均在合法枚举范围内', () => {
    expect(transportHubs.every((hub) => validTransportTypes.has(hub.type))).toBe(true);
  });

  it('现有数据集通过反糟粕整体校验', () => {
    expect(validateContentData(journalEntries, journalErrors)).toEqual([]);
  });
});

describe('verifiedAt 周期校验', () => {
  it('VERIFICATION_STALE_DAYS 配置为 180 天', () => {
    expect(VERIFICATION_STALE_DAYS).toBe(180);
  });

  it('无效或格式错误的 verifiedAt 视为过期', () => {
    expect(isStale('')).toBe(true);
    expect(isStale('not-a-date')).toBe(true);
    expect(isStale('2026/08/17')).toBe(true);
  });

  it('今天的 verifiedAt 未过期', () => {
    expect(isStale(siteDateString())).toBe(false);
  });

  it('179 天前的 verifiedAt 未过期', () => {
    const recent = new Date(Date.parse(`${siteDateString()}T00:00:00Z`) - 179 * 24 * 60 * 60 * 1000);
    const recentStr = recent.toISOString().slice(0, 10);
    expect(isStale(recentStr)).toBe(false);
  });

  it('181 天前的 verifiedAt 视为过期', () => {
    const old = new Date(Date.parse(`${siteDateString()}T00:00:00Z`) - 181 * 24 * 60 * 60 * 1000);
    const oldStr = old.toISOString().slice(0, 10);
    expect(isStale(oldStr)).toBe(true);
  });

  it('当前公开数据集均未过期', () => {
    const allVerifiedAt = [
      ...publishedAttractions.map((item) => item.verifiedAt),
      ...transportHubs.map((hub) => hub.verifiedAt),
      ...routes.map((route) => route.verifiedAt),
    ];
    expect(allVerifiedAt.every((value) => !isStale(value))).toBe(true);
  });
});

describe('提醒窗口 daysUntilStale / VERIFICATION_REMINDER_DAYS', () => {
  it('VERIFICATION_REMINDER_DAYS 配置为 170，且严格早于硬阻断阈值', () => {
    expect(VERIFICATION_REMINDER_DAYS).toBe(170);
    expect(VERIFICATION_REMINDER_DAYS).toBeLessThan(VERIFICATION_STALE_DAYS);
  });

  it('无效日期返回 null，并会被视为进入提醒窗口（避免漏提醒）', () => {
    expect(daysUntilStale('')).toBe(null);
    expect(daysUntilStale('not-a-date')).toBe(null);
    expect(daysUntilStale('2026/08/17')).toBe(null);
    expect(isInReminderWindow('')).toBe(true);
    expect(isInReminderWindow('2026/08/17')).toBe(true);
  });

  it('今天录入的 verifiedAt 距过期正好 180 天，未进入 170 天窗口', () => {
    const today = siteDateString();
    expect(daysUntilStale(today, today)).toBe(VERIFICATION_STALE_DAYS);
    expect(isInReminderWindow(today, today)).toBe(false);
  });

  it('10 天前录入距过期 170 天，正好进入提醒窗口边界', () => {
    const today = siteDateString();
    const tenDaysAgo = new Date(Date.parse(`${today}T00:00:00Z`) - 10 * 24 * 60 * 60 * 1000);
    const tenDaysAgoStr = tenDaysAgo.toISOString().slice(0, 10);
    expect(daysUntilStale(tenDaysAgoStr, today)).toBe(VERIFICATION_REMINDER_DAYS);
    expect(isInReminderWindow(tenDaysAgoStr, today)).toBe(true);
  });

  it('11 天前录入距过期 169 天，仍在窗口内；9 天前录入距过期 171 天，未进入窗口', () => {
    const today = siteDateString();
    const makeN = (n: number) => {
      const d = new Date(Date.parse(`${today}T00:00:00Z`) - n * 24 * 60 * 60 * 1000);
      return d.toISOString().slice(0, 10);
    };
    expect(daysUntilStale(makeN(11), today)).toBe(169);
    expect(isInReminderWindow(makeN(11), today)).toBe(true);
    expect(daysUntilStale(makeN(9), today)).toBe(171);
    expect(isInReminderWindow(makeN(9), today)).toBe(false);
  });

  it('179 天前距过期 1 天，仍未触发硬阻断但已在窗口；180 天当天剩 0 天；181 天前已过期返回 -1', () => {
    const today = siteDateString();
    const makeN = (n: number) => {
      const d = new Date(Date.parse(`${today}T00:00:00Z`) - n * 24 * 60 * 60 * 1000);
      return d.toISOString().slice(0, 10);
    };
    expect(daysUntilStale(makeN(179), today)).toBe(1);
    expect(isStale(makeN(179))).toBe(false);
    expect(isInReminderWindow(makeN(179), today)).toBe(true);

    expect(daysUntilStale(makeN(180), today)).toBe(0);
    expect(isStale(makeN(180))).toBe(false); // 严格 >180 才阻断

    expect(daysUntilStale(makeN(181), today)).toBe(-1);
    expect(isStale(makeN(181))).toBe(true);
    expect(isInReminderWindow(makeN(181), today)).toBe(true); // 过期仍然需要提醒处理
  });
});

describe('assertValidContentData 收集式报错', () => {
  // 构造一份合法的草稿游记：status=draft 使发布期校验全部跳过，仅保留前置校验路径，
  // 便于通过 Partial 覆盖单点制造错误，验证聚合 throw 行为。
  const draftTravel = (overrides: Partial<TravelJournal> = {}): TravelJournal => ({
    slug: 'test-entry',
    type: 'travel',
    status: 'draft',
    contentKind: 'demo',
    featured: false,
    title: '测试',
    excerpt: '摘要',
    author: '站主手记',
    publishedAt: '',
    updatedAt: '',
    cityId: 'yinchuan',
    locality: '兴庆区',
    tags: [],
    cover: { src: 'images/x.webp', alt: '测试图', credit: '作者', license: 'CC BY', sourceUrl: 'https://example.com' },
    gallery: [],
    relatedAttractionIds: [],
    relatedRouteIds: [],
    body: '正文',
    tripDate: '',
    duration: '',
    transport: '',
    budgetNote: '',
    highlights: [],
    ...overrides,
  });

  const captureError = (action: () => void): string => {
    try { action(); } catch (error) { return error instanceof Error ? error.message : String(error); }
    return '';
  };

  it('合法草稿条目不触发聚合报错', () => {
    expect(() => assertValidContentData([draftTravel()])).not.toThrow();
  });

  it('dangling relatedAttractionIds 在聚合错误中具名', () => {
    const entry = draftTravel({ slug: 'test-dangling', relatedAttractionIds: ['nonexistent-xyz-attraction'] });
    expect(() => assertValidContentData([entry])).toThrow();
    const message = captureError(() => assertValidContentData([entry]));
    expect(message).toContain('未发布景点');
    expect(message).toContain('nonexistent-xyz-attraction');
  });

  it('图片署名字段缺失在聚合错误中具名', () => {
    const entry = draftTravel({ slug: 'test-image', cover: { src: 'images/x.webp', alt: '', credit: '', license: '', sourceUrl: '' } });
    const message = captureError(() => assertValidContentData([entry]));
    expect(message).toContain('图片署名或许可不完整');
  });

  it('多个问题一次性收集到同一条聚合错误', () => {
    const entry = draftTravel({
      slug: 'test-multi',
      cityId: 'nonexistent-city' as CityId,
      cover: { src: 'images/x.webp', alt: '', credit: '', license: '', sourceUrl: '' },
      relatedAttractionIds: ['nonexistent-xyz-attraction'],
    });
    const message = captureError(() => assertValidContentData([entry]));
    expect(message).toContain('cityId 无效');
    expect(message).toContain('图片署名或许可不完整');
    expect(message).toContain('未发布景点');
  });

  it('聚合错误以单条 Error 抛出而非逐条抛出', () => {
    const entry = draftTravel({ slug: 'test-multi-throw', cityId: 'nonexistent-city' as CityId, relatedAttractionIds: ['nonexistent-xyz-attraction'] });
    const message = captureError(() => assertValidContentData([entry]));
    expect(message.startsWith('内容数据校验失败')).toBe(true);
    expect(message.split('未发布景点').length).toBe(2);
    expect(message.split('cityId 无效').length).toBe(2);
  });

  it('validateJournalContent 同样收集而非首错即停', () => {
    const entry = draftTravel({ slug: 'test-collect', cityId: 'nonexistent-city' as CityId, relatedAttractionIds: ['nonexistent-xyz-attraction'] });
    const errors = validateJournalContent([entry]);
    expect(errors.some((message) => message.includes('cityId 无效'))).toBe(true);
    expect(errors.some((message) => message.includes('未发布景点'))).toBe(true);
  });
});
