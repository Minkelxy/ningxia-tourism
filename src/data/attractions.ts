import type { Attraction, AttractionImage, CityId, VisitInfo } from '../types';

const verifiedAt = '2026-08-12';
const cultureTourismSource = {
  label: '宁夏回族自治区文化和旅游厅 · 景区景点',
  url: 'https://whhlyt.nx.gov.cn/jqjd/',
  kind: 'official' as const,
};

const image = (
  src: string,
  alt: string,
  credit: string,
  license: string,
  sourceUrl: string,
): AttractionImage => ({ src, alt, credit, license, sourceUrl });

const pendingVisitInfo: VisitInfo = {
  openingHours: '资料核实中',
  ticketPrice: '资料核实中',
  reservation: '资料核实中',
  duration: '资料核实中',
  bestSeason: '资料核实中',
  transportation: '资料核实中',
  address: '资料核实中',
};

const published: Attraction[] = [
  {
    id: 'ningxiamuseum', status: 'published', verificationLevel: 'review', name: '宁夏博物馆', cityId: 'yinchuan', locality: '金凤区', category: 'history',
    coordinates: { lng: 106.2307, lat: 38.4845 },
    summary: '从西夏文物、丝路遗珍到宁夏近现代历史，一站建立宁夏旅行的文化坐标。适合作为抵达银川后的第一站。',
    highlights: ['国家一级博物馆', '西夏与丝路主题展陈', '室内参观，四季适宜'],
    visitInfo: {
      openingHours: '常态为周二至周日 09:00—17:00，停止入馆时间及节假日安排以官方公告为准',
      ticketPrice: '基本陈列免费开放，特展政策以馆方公告为准',
      reservation: '建议通过官方渠道提前确认实名预约要求',
      duration: '2—3 小时', bestSeason: '全年',
      transportation: '银川市区公交、出租车或网约车均可到达',
      address: '银川市金凤区人民广场东街 6 号',
    },
    images: [image('images/attractions/ningxia-museum.webp', '宁夏博物馆建筑外观', 'David Stanley', 'CC BY 2.0', 'https://commons.wikimedia.org/wiki/File:Ningxia_Provincial_Museum,_Yinchuan.jpg')],
    nearbyIds: ['xixiawangling', 'zhenbeibu', 'nanguan'],
    sources: [cultureTourismSource, { label: '宁夏博物馆开放信息', url: 'https://whhlyt.nx.gov.cn/', kind: 'official' }], verifiedAt,
  },
  {
    id: 'xixiawangling', status: 'published', verificationLevel: 'verified', name: '西夏陵', cityId: 'yinchuan', locality: '西夏区', category: 'history',
    coordinates: { lng: 105.9877, lat: 38.4335 },
    summary: '贺兰山东麓的西夏皇家陵寝遗址，以宏阔山水格局、帝陵与陪葬墓群呈现西夏文明的独特面貌。',
    highlights: ['世界文化遗产', '西夏博物馆与遗址区', '贺兰山下开阔景观'],
    visitInfo: {
      openingHours: '开放时段随淡旺季调整，请在出发前查看景区最新公告',
      ticketPrice: '门票、观光车及讲解服务分项计价，以官方购票页为准',
      reservation: '旺季建议提前预约购票并预留安检时间',
      duration: '3—4 小时', bestSeason: '4—10 月，夏季注意防晒',
      transportation: '距银川市区较远，建议旅游专线、包车或自驾',
      address: '银川市西夏区贺兰山东麓',
    },
    images: [image('images/attractions/xixia.webp', '贺兰山下的西夏陵遗址', 'BabelStone', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:XiXia_Tomb_3_gate_tower_(west).jpg')],
    nearbyIds: ['zhenbeibu', 'ningxiamuseum'],
    sources: [{ label: '银川市人民政府 · 西夏陵', url: 'https://www.yinchuan.gov.cn/sshc/lyjd/zdwbcs/202511/t20251125_5090985.html', kind: 'official' }, cultureTourismSource], verifiedAt,
  },
  {
    id: 'zhenbeibu', status: 'published', verificationLevel: 'review', name: '镇北堡西部影城', cityId: 'yinchuan', locality: '西夏区', category: 'experience',
    coordinates: { lng: 106.0683, lat: 38.6147 },
    summary: '由古堡遗址发展而来的西部影视拍摄基地，可在明城、清城和老银川街体验粗粝鲜明的西北影像美学。',
    highlights: ['经典影视取景地', '西北古堡与街景', '适合人像与主题摄影'],
    visitInfo: {
      openingHours: '开放时段随季节调整，以景区当日公告为准',
      ticketPrice: '以官方售票渠道实时价格为准', reservation: '节假日建议提前购票',
      duration: '3—4 小时', bestSeason: '4—10 月',
      transportation: '可从银川市区乘旅游专线、出租车或自驾前往',
      address: '银川市西夏区镇北堡镇',
    },
    images: [image('images/attractions/zhenbeibu.webp', '镇北堡西部影城街景', 'Yanxutong1215', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:镇北堡西部影城.jpg')],
    nearbyIds: ['xixiawangling', 'ningxiamuseum'], sources: [cultureTourismSource, { label: '银川市人民政府旅游信息', url: 'https://www.yinchuan.gov.cn/sshc/lyjd/', kind: 'official' }], verifiedAt,
  },
  {
    id: 'nanguan', status: 'published', verificationLevel: 'review', name: '南关清真大寺', cityId: 'yinchuan', locality: '兴庆区', category: 'religion',
    coordinates: { lng: 106.2758, lat: 38.4549 },
    summary: '银川市区具有代表性的清真寺。参观时应尊重宗教礼仪、礼拜秩序和现场开放安排。',
    highlights: ['银川回族文化地标', '城市中心易于到达', '适合与老城步行串联'],
    visitInfo: {
      openingHours: '宗教活动场所开放安排可能临时调整，请服从现场管理',
      ticketPrice: '以现场公示为准', reservation: '团队参观建议提前确认',
      duration: '30—60 分钟', bestSeason: '全年',
      transportation: '位于银川老城区，可乘公交、步行或打车前往',
      address: '银川市兴庆区玉皇阁南街一带',
    },
    images: [image('images/attractions/nanguan.webp', '银川南关清真大寺外观', 'HMGiovanniV', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Nanguan_Great_Mosque,_Xingqing,_Yinchuan_in_January_2020.jpg')],
    nearbyIds: ['ningxiamuseum'], sources: [cultureTourismSource, { label: '银川市人民政府', url: 'https://www.yinchuan.gov.cn/', kind: 'official' }], verifiedAt,
  },
  {
    id: 'shahu', status: 'published', verificationLevel: 'review', name: '沙湖生态旅游区', cityId: 'shizuishan', locality: '平罗县', category: 'nature',
    coordinates: { lng: 106.377, lat: 38.808 },
    summary: '湖泊、芦苇、候鸟与沙丘相邻共生，是宁夏最具辨识度的沙水景观之一。游船和沙漠项目受天气影响较大。',
    highlights: ['沙水相依的复合景观', '湿地观鸟与科普', '游船及沙漠体验'],
    visitInfo: {
      openingHours: '开放及游船时段随季节、天气调整，以景区公告为准',
      ticketPrice: '门票、船票和体验项目分别计价，以官方购票页为准',
      reservation: '旺季建议提前购票并确认当日项目开放情况',
      duration: '4—6 小时', bestSeason: '5—10 月',
      transportation: '从银川或石嘴山出发可乘旅游交通、包车或自驾',
      address: '石嘴山市平罗县境内',
    },
    images: [image('images/attractions/shahu.webp', '宁夏平原水域与田野景观，作为沙湖区域氛围配图', 'GHOSTGHOSTH2O', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:宁夏平原稻田风光.png')],
    nearbyIds: [], sources: [{ label: '宁夏沙湖旅游官方网站', url: 'https://www.nxshahu.com/', kind: 'official' }, { label: '宁夏文旅厅 · 沙湖生态旅游区', url: 'https://whhlyt.nx.gov.cn/jqjd/szss_66574/nxshstlyq/', kind: 'official' }], verifiedAt,
  },
  {
    id: 'shapotou', status: 'published', verificationLevel: 'verified', name: '沙坡头旅游景区', cityId: 'zhongwei', locality: '沙坡头区', category: 'experience',
    coordinates: { lng: 104.9933, lat: 37.4641 },
    summary: '腾格里沙漠在这里与黄河交汇，可在同一天体验沙漠景观、黄河项目与治沙文化。',
    highlights: ['腾格里沙漠与黄河交汇', '滑沙、骆驼等体验项目', '治沙工程与包兰铁路'],
    visitInfo: {
      openingHours: '开放及项目运营受季节和天气影响，以景区公告为准',
      ticketPrice: '基础门票与体验项目分开计价，以官方购票页为准',
      reservation: '旺季建议提前购票；大风天气先确认项目开放状态',
      duration: '5—7 小时', bestSeason: '5—10 月，避开正午高温',
      transportation: '中卫市区出发可乘旅游交通、出租车或自驾',
      address: '中卫市沙坡头区腾格里沙漠东南缘',
    },
    images: [image('images/attractions/shapotou.webp', '沙坡头沙漠景观', 'Fred Feng', 'Public domain', 'https://commons.wikimedia.org/wiki/File:Shapotou.jpg')],
    nearbyIds: ['zhongweigaomiao'], sources: [{ label: '沙坡头旅游官方网站', url: 'https://www.shapotou.com/index.html', kind: 'official' }, cultureTourismSource], verifiedAt,
  },
  {
    id: 'zhongweigaomiao', status: 'published', verificationLevel: 'review', name: '中卫高庙', cityId: 'zhongwei', locality: '沙坡头区', category: 'religion',
    coordinates: { lng: 105.1852, lat: 37.518 },
    summary: '位于中卫老城的古建筑群，以紧凑高耸、层层叠叠的空间组织见长，可与鼓楼和老城街区一起游览。',
    highlights: ['全国重点文物保护单位', '多层楼阁古建筑群', '中卫市区步行可达'],
    visitInfo: {
      openingHours: '开放安排以文物管理部门和现场公告为准', ticketPrice: '以现场公示为准',
      reservation: '一般无需长时间预留，团队参观建议提前确认', duration: '1—1.5 小时', bestSeason: '全年',
      transportation: '位于中卫市区，可步行、公交或打车到达', address: '中卫市沙坡头区高庙路一带',
    },
    images: [image('images/attractions/gaomiao.webp', '中卫高庙古建筑群', 'W0zny', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:Zhongwei_Temple_Gaomiao_IGP4694.jpg')],
    nearbyIds: ['shapotou'], sources: [cultureTourismSource, { label: '中卫市人民政府', url: 'https://www.nxzw.gov.cn/', kind: 'official' }], verifiedAt,
  },
  {
    id: 'huanghetan', status: 'published', verificationLevel: 'review', name: '黄河坛景区', cityId: 'wuzhong', locality: '青铜峡市', category: 'history',
    coordinates: { lng: 105.93, lat: 37.83 },
    summary: '依托青铜峡黄河河谷展开的黄河文化主题景区，适合与一百零八塔、黄河大峡谷组合成一日行程。',
    highlights: ['黄河文化主题景观', '青铜峡河谷视野', '适合串联吴忠周边景点'],
    visitInfo: {
      openingHours: '以景区最新公告为准', ticketPrice: '以官方及现场公示为准', reservation: '节假日建议提前确认',
      duration: '2—3 小时', bestSeason: '4—10 月', transportation: '建议从吴忠市区包车或自驾前往', address: '吴忠市青铜峡市黄河沿线',
    },
    images: [image('images/attractions/qingtongxia.webp', '青铜峡黄河沿线景观', 'AddisWang', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:青铜峡黄河铁桥.JPG')],
    nearbyIds: ['zhonghuahuanghelou'], sources: [cultureTourismSource, { label: '吴忠市人民政府', url: 'https://www.wuzhong.gov.cn/', kind: 'official' }], verifiedAt,
  },
  {
    id: 'zhonghuahuanghelou', status: 'published', verificationLevel: 'review', name: '中华黄河楼', cityId: 'wuzhong', locality: '青铜峡市', category: 'history',
    coordinates: { lng: 106.12, lat: 38.0 },
    summary: '吴忠黄河金岸的标志性文化建筑，通过展陈与登高视野了解黄河文明和宁夏引黄灌溉文化。',
    highlights: ['黄河金岸地标', '黄河文化展陈', '登高眺望河谷'],
    visitInfo: {
      openingHours: '以景区最新公告为准', ticketPrice: '以官方及现场公示为准', reservation: '节假日建议提前确认',
      duration: '1.5—2.5 小时', bestSeason: '4—10 月，傍晚光线较佳', transportation: '吴忠市区打车或自驾较方便', address: '吴忠市青铜峡市黄河路与滨河大道附近',
    },
    images: [image('images/attractions/huanghelou.webp', '吴忠黄河沿线区域景观', 'AddisWang', 'CC BY-SA 3.0', 'https://commons.wikimedia.org/wiki/File:青铜峡黄河铁桥.JPG')],
    nearbyIds: ['huanghetan'], sources: [cultureTourismSource, { label: '吴忠市人民政府', url: 'https://www.wuzhong.gov.cn/', kind: 'official' }], verifiedAt,
  },
  {
    id: 'liupanshan', status: 'published', verificationLevel: 'review', name: '六盘山', cityId: 'guyuan', locality: '泾源县／隆德县', category: 'nature',
    coordinates: { lng: 106.2, lat: 35.6 },
    summary: '宁夏南部重要山地与生态屏障，森林、峡谷和红色文化资源集中，具体游览点之间距离较远。',
    highlights: ['宁南山地生态', '红军长征文化', '夏季避暑与森林步道'],
    visitInfo: {
      openingHours: '各景区、纪念场馆开放安排不同，请按具体目的地查询', ticketPrice: '各游览点分别公示',
      reservation: '纪念场馆和团队参观建议提前确认', duration: '半天至 1 天', bestSeason: '5—9 月',
      transportation: '从固原市区出发建议包车或自驾，并预留山路时间', address: '固原市六盘山区域',
    },
    images: [image('images/attractions/liupanshan.webp', '六盘山红军长征纪念馆区域景观', '董辰兴', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:六盘山红军长征纪念馆西眺.jpg')],
    nearbyIds: ['pengyangtitian'], sources: [cultureTourismSource, { label: '固原市人民政府', url: 'https://www.nxgy.gov.cn/', kind: 'official' }], verifiedAt,
  },
  {
    id: 'pengyangtitian', status: 'published', verificationLevel: 'review', name: '彭阳梯田', cityId: 'guyuan', locality: '彭阳县', category: 'nature',
    coordinates: { lng: 106.4, lat: 36.0 },
    summary: '黄土高原坡地经过长期治理形成的层叠田野，季节、作物和天气决定观景效果，适合慢节奏乡村摄影。',
    highlights: ['黄土高原梯田', '生态治理景观', '乡村摄影与自驾'],
    visitInfo: {
      openingHours: '开放式乡村景观，出行前关注道路与天气', ticketPrice: '多数观景点无统一门票，以现场公示为准',
      reservation: '无需统一预约', duration: '2—4 小时', bestSeason: '5—10 月，不同季节色彩各异',
      transportation: '建议从彭阳县城自驾或包车，避免夜间进入陌生乡村道路', address: '固原市彭阳县境内',
    },
    images: [image('images/attractions/pengyang.webp', '宁夏平原田野景观，作为彭阳梯田主题配图', 'GHOSTGHOSTH2O', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:宁夏平原稻田风光.png')],
    nearbyIds: ['liupanshan'], sources: [cultureTourismSource, { label: '彭阳县人民政府', url: 'https://www.pengyang.gov.cn/', kind: 'official' }], verifiedAt,
  },
  {
    id: 'yanchilie', status: 'draft', verificationLevel: 'review', name: '盐池革命烈士纪念园', cityId: 'wuzhong', locality: '盐池县', category: 'history',
    coordinates: { lng: 107.04, lat: 37.78 },
    summary: '盐池红色文化的重要纪念空间，适合与盐池县城历史、人文和长城遗迹主题结合参观。',
    highlights: ['红色历史教育', '纪念展陈与园区参观', '盐池县城人文线路'],
    visitInfo: {
      openingHours: '以纪念园现场和主管部门公告为准', ticketPrice: '以现场公示为准',
      reservation: '团队教育活动建议提前联系确认', duration: '1—2 小时', bestSeason: '全年',
      transportation: '到达盐池县城后可打车或自驾前往', address: '吴忠市盐池县',
    },
    images: [image('images/attractions/yanchi.webp', '宁夏红色文化主题区域景观', '董辰兴', 'CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:六盘山红军长征纪念馆西眺.jpg')],
    nearbyIds: [], sources: [cultureTourismSource, { label: '盐池县人民政府', url: 'https://www.yanchi.gov.cn/', kind: 'official' }], verifiedAt,
  },
];

const draftSeed: Array<Pick<Attraction, 'id' | 'name' | 'cityId' | 'locality' | 'category' | 'coordinates' | 'summary'>> = [
  { id: 'suyukou', name: '苏峪口', cityId: 'yinchuan', locality: '贺兰县', category: 'nature', coordinates: { lng: 106.08, lat: 38.56 }, summary: '贺兰山山地生态景观，资料正在核实。' },
  { id: 'mingcuihu', name: '鸣翠湖', cityId: 'yinchuan', locality: '兴庆区', category: 'nature', coordinates: { lng: 106.22, lat: 38.27 }, summary: '银川湿地生态景观，资料正在核实。' },
  { id: 'shuidonggou', name: '水洞沟', cityId: 'yinchuan', locality: '灵武市', category: 'history', coordinates: { lng: 106.52, lat: 38.29 }, summary: '史前文化遗址，资料正在核实。' },
  { id: 'xumishan', name: '须弥山石窟', cityId: 'guyuan', locality: '原州区', category: 'history', coordinates: { lng: 106.16, lat: 36.27 }, summary: '丝绸之路石窟遗存，资料正在核实。' },
  { id: 'yibaisiba', name: '一百零八塔', cityId: 'wuzhong', locality: '青铜峡市', category: 'religion', coordinates: { lng: 105.97, lat: 37.87 }, summary: '黄河岸边古塔群，资料正在核实。' },
  { id: 'huixiang', name: '中华回乡文化园', cityId: 'yinchuan', locality: '永宁县', category: 'experience', coordinates: { lng: 106.24, lat: 38.29 }, summary: '文化主题园区，资料正在核实。' },
  { id: 'zhongweijinshadao', name: '中卫金沙岛', cityId: 'zhongwei', locality: '沙坡头区', category: 'nature', coordinates: { lng: 105.11, lat: 37.54 }, summary: '沙漠湿地度假区，资料正在核实。' },
  { id: 'huangyeguda', name: '青铜峡黄河大峡谷', cityId: 'wuzhong', locality: '青铜峡市', category: 'nature', coordinates: { lng: 105.93, lat: 37.89 }, summary: '黄河峡谷景观，资料正在核实。' },
  { id: 'huangshagudu', name: '黄沙古渡', cityId: 'yinchuan', locality: '兴庆区', category: 'experience', coordinates: { lng: 106.55, lat: 38.57 }, summary: '黄河古渡主题景区，资料正在核实。' },
  { id: 'jinjiping', name: '金鸡坪梯田', cityId: 'guyuan', locality: '彭阳县', category: 'nature', coordinates: { lng: 106.63, lat: 36.15 }, summary: '彭阳梯田观景点，资料正在核实。' },
];

const drafts: Attraction[] = draftSeed.map((item) => ({
  ...item,
  status: 'draft',
  verificationLevel: 'review',
  highlights: ['资料正在核实'],
  visitInfo: pendingVisitInfo,
  images: [],
  nearbyIds: [],
  sources: [cultureTourismSource],
  verifiedAt: '',
}));

export const attractions: Attraction[] = [...published, ...drafts];
export const publishedAttractions = attractions.filter((item) => item.status === 'published');
export const verifiedAttractions = publishedAttractions.filter((item) => item.verificationLevel === 'verified');
export const reviewAttractions = publishedAttractions.filter((item) => item.verificationLevel === 'review');
export const getAttractionById = (id?: string) => attractions.find((item) => item.id === id);
export const getPublishedAttractionsByCity = (cityId: CityId) => publishedAttractions.filter((item) => item.cityId === cityId);
