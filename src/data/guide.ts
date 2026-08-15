export interface GuideSource {
  label: string;
  url: string;
  checkedAt: string;
}

export interface SeasonGuide {
  id: 'spring' | 'summer' | 'autumn' | 'winter';
  months: string;
  title: string;
  summary: string;
  suitableFor: string[];
  reminder: string;
  source: GuideSource;
}

export const guideVerifiedAt = '2026-08-15';

export const seasonGuides: SeasonGuide[] = [
  {
    id: 'spring', months: '3—5 月', title: '山花、梯田与城市慢游',
    summary: '彭阳山花通常在 3 月下旬至 4 月中旬形成春季看点，银川城市文化和博物馆也适合与户外行程交替安排。',
    suitableFor: ['彭阳梯田花海', '银川城市文化', '乡村自驾'],
    reminder: '花期受气温影响明显，出发前一周再看县政府与当地文旅发布。',
    source: { label: '宁夏文旅厅 · 春季乡村旅游推介', url: 'https://whhlyt.nx.gov.cn/xxfb/wlyw/202503/t20250327_4867779.html', checkedAt: guideVerifiedAt },
  },
  {
    id: 'summer', months: '6—8 月', title: '六盘山避暑，沙漠错峰',
    summary: '固原、泾源和隆德更适合安排清凉山地行程；沙漠景区把主要户外活动放在早晚，并依据当天风力和项目公告调整。',
    suitableFor: ['隆德长征文化', '泾源森林避暑', '沙漠日出日落'],
    reminder: '隆德的六盘山红军长征旅游区与泾源的六盘山国家森林公园是两个目的地；北部与南部体感差异也较大，轻薄防晒和可叠穿外套都值得带上。',
    source: { label: '宁夏文旅厅 · 固原暑期避暑线路', url: 'https://whhlyt.nx.gov.cn/xxfb/wlyw/202507/t20250710_4957704_zzb.html', checkedAt: guideVerifiedAt },
  },
  {
    id: 'autumn', months: '9—10 月', title: '沙水、黄河与金色田野',
    summary: '秋季适合把沙湖、黄河沿线、沙坡头和南部山地串联起来；官方秋游线路也将沙漠、候鸟和沿黄景观作为重点。',
    suitableFor: ['沙湖与候鸟', '黄河沿线', '沙坡头与乡村秋色'],
    reminder: '国庆前后客流集中，住宿和跨城车票应尽量提前确认。',
    source: { label: '宁夏文旅厅 · 金秋精华旅游线路', url: 'https://whhlyt.nx.gov.cn/xxfb/wlyw/202309/t20230927_4289641.html', checkedAt: guideVerifiedAt },
  },
  {
    id: 'winter', months: '11—2 月', title: '博物馆、老城与低密度旅行',
    summary: '把宁夏博物馆、城市街区和室内展陈放在主线，户外景点减少连续停留时间，适合偏爱安静节奏的旅行者。',
    suitableFor: ['宁夏博物馆', '银川与中卫老城', '人少慢游'],
    reminder: '部分景区项目和公共交通可能进入淡季安排，务必逐一查看当天公告。',
    source: { label: '金凤区政府 · 宁夏博物馆开放信息', url: 'https://www.ycjinfeng.gov.cn/xxgk/zfxxgkml/zdlygk/ggwhfw_59349/gzxx_59352/202512/t20251218_5112483.html', checkedAt: guideVerifiedAt },
  },
];

export const transportNotes = [
  { title: '先确定抵达城市', text: '多数全景路线从银川开始；若重点只在沙坡头，也可以直接抵达中卫，减少一次跨城折返。' },
  { title: '银川与中卫优先看铁路', text: '两城已有城际铁路衔接，具体班次和耗时只以出发日的 12306 查询结果为准。' },
  { title: '西线、吴忠与乡村点位留给公路', text: '西夏陵、镇北堡、青铜峡和彭阳梯田等组合更适合包车或自驾；每天保留一段机动时间。' },
];

export const travelChecklist = [
  '核对身份证件、往返车票与入住日期',
  '打开核心景点来源，确认当天开放与预约',
  '博物馆行程避开常规周一闭馆时段',
  '沙漠项目查看天气、风力与停运公告',
  '下载离线地图并保存酒店中文地址',
  '准备防晒、补水用品和可叠穿外套',
  '进入宗教场所前确认衣着与参观礼仪',
  '跨城日预留至少半天机动，不排满返程前一晚',
];

export const guideSources: GuideSource[] = [
  ...seasonGuides.map((item) => item.source),
  { label: '宁夏政府网 · 五市概况与交通', url: 'https://www.nx.gov.cn/ssjn/wap.html', checkedAt: guideVerifiedAt },
  { label: '中国铁路 12306', url: 'https://www.12306.cn/', checkedAt: guideVerifiedAt },
  { label: '中国气象局公共气象服务', url: 'https://weather.cma.cn/', checkedAt: guideVerifiedAt },
];
