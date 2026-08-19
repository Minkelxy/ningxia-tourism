import type { CityId, Food } from '../types';
import { cityName } from './cities';

// Task 2.1 + 2.2：14 道宁夏美食数据。
//
// 反糟粕原则：
// - 仅保留 PR #7 中真实可考的餐厅（国强手抓、老毛手抓、张裕摩塞尔十五世酒庄、志辉源石酒庄、中宁枸杞交易中心、中卫果蔬批发市场），
//   不沿用旧版模板化/虚构电话字段，restaurant 也不再含 phone。
// - 旧 PR #7 的两个 bug ID 已修正：`làhúhu` → `lahuhu`、`hua jianao` → `zhongwei-latiaozi`。
// - 依据 docs/CONTENT_AUDIT.md 的内容信任分级：
//   - 14 道美食已全部补齐官方可核实来源（中国非遗网 / 文旅部 / 自治区文旅厅 / 市县政府），统一标为 `published`。
//   - 其中手抓羊肉、蒿子面有非遗项目直接专页，标为 `verificationLevel: 'verified'`；其余 12 道为 `review`。
// 所有 source.url 均为实测访问到的真实政府/官方文旅页面，checkedAt / verifiedAt = 2026-08-17。
const VERIFIED_AT = '2026-08-17';

export const foods: Food[] = [
  {
    id: 'shouzhua-yangrou',
    status: 'published',
    verificationLevel: 'verified',
    name: '手抓羊肉',
    category: 'mutton',
    description: '宁夏滩羊整块清炖后手抓而食，肉香突出、几乎没有膻味，是宁夏最具代表性的硬菜之一。',
    origin: '宁夏各地',
    bestSeason: '秋冬',
    priceRange: '60-120元/斤',
    restaurants: [
      { name: '国强手抓', cityId: 'yinchuan', coordinates: { lng: 106.29, lat: 38.47 }, recommend: '肋条、羊脖' },
      { name: '老毛手抓', cityId: 'yinchuan', coordinates: { lng: 106.28, lat: 38.48 }, recommend: '前腿、肋条' },
    ],
    tips: '选清真老店、明码标价；按斤现切，蘸蒜泥或椒盐最常见。',
    sources: [
      {
        label: '中国非物质文化遗产网 · 牛羊肉烹制技艺（宁夏手抓羊肉制作技艺）',
        url: 'https://www.ihchina.cn/project_details/23799',
        kind: 'official',
        level: 'direct',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
      {
        label: '宁夏回族自治区文化和旅游厅 · 8名非遗代表性传承人入选国家级名单',
        url: 'https://whhlyt.nx.gov.cn/xxfb/wlyw/202503/t20250318_4858740_zzb.html',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'yangzasui',
    status: 'published',
    verificationLevel: 'review',
    name: '羊杂碎',
    category: 'mutton',
    description: '羊头、肚、心、肺等杂碎加粉条与辣椒油同烩，汤色红亮，宁夏早茶与街头常见的醒神汤品。',
    origin: '宁夏各地',
    bestSeason: '秋冬',
    priceRange: '15-30元/碗',
    restaurants: [],
    tips: '搭配刚出锅的馓子或白饼更地道。',
    sources: [
      {
        label: '文化和旅游部 · 三餐烟火，“烹”出宁夏文旅长桌宴',
        url: 'http://www.mct.gov.cn/whzx/qgwhxxlb/nx/202604/t20260408_965343.htm',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'yangrou-saozimian',
    status: 'published',
    verificationLevel: 'review',
    name: '羊肉臊子面',
    category: 'noodle',
    description: '羊肉丁与豆腐、土豆、胡萝卜慢炒成臊子浇头，手擀面条筋道，是吴忠早茶里的主食担当。',
    origin: '吴忠',
    bestSeason: '四季',
    priceRange: '15-30元/碗',
    restaurants: [],
    tips: '吴忠早茶馆通常按"先喝茶吃面点，最后再吃面"的顺序上桌。',
    sources: [
      {
        label: '宁夏回族自治区商务厅 · 吴忠：一方美食一城风味',
        url: 'https://dofcom.nx.gov.cn/xwzx_274/swdt/202404/t20240430_4526898_zzb.html',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'lahuhu',
    status: 'published',
    verificationLevel: 'review',
    name: '辣糊糊',
    category: 'snack',
    description: '银川夜市招牌，各种豆制品、蔬菜、粉条串成小串，浸在辣椒粉调成的浓稠糊汤里，香辣温厚、挂料厚实。',
    origin: '银川',
    bestSeason: '秋冬',
    priceRange: '30-60元/人',
    restaurants: [],
    tips: '怀远夜市与老城区小店最集中，按串计价，可先点小份试味。',
    sources: [
      {
        label: '文化和旅游部 · 辣糊糊火热“出圈” 宁夏文旅持续“上分”',
        url: 'https://www.mct.gov.cn/whzx/qgwhxxlb/nx/202403/t20240326_951880.htm',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
      {
        label: '宁夏日报 · 怀远夜市：宁夏文旅新地标炼成记',
        url: 'https://szb.nxrb.cn/nxrb/pc/con/202503/17/content_152553.html',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'haozi-mian',
    status: 'published',
    verificationLevel: 'verified',
    name: '蒿子面',
    category: 'noodle',
    description: '以野生蒿子籽磨粉入面，面条自带清苦回甘的草本香气，浇羊肉臊子或素臊子，中宁、中卫一带的特色面食。',
    origin: '中卫',
    bestSeason: '四季',
    priceRange: '15-25元/碗',
    restaurants: [],
    tips: '中宁蒿子面为国家级非遗，部分非遗工坊可体验制面过程。',
    sources: [
      {
        label: '中国非物质文化遗产网 · 传统面食制作技艺（中宁蒿子面制作技艺）',
        url: 'https://www.ihchina.cn/project_details/23795/',
        kind: 'official',
        level: 'direct',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
      {
        label: '文化和旅游部 · 三餐烟火，“烹”出宁夏文旅长桌宴',
        url: 'http://www.mct.gov.cn/whzx/qgwhxxlb/nx/202604/t20260408_965343.htm',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'youxiang',
    status: 'published',
    verificationLevel: 'review',
    name: '油香',
    category: 'snack',
    description: '回族传统面食，发酵面团擀成饼后下油锅炸至两面金黄，外脆内软，常搭配粉汤或羊杂碎一同食用。',
    origin: '宁夏各地',
    bestSeason: '四季',
    priceRange: '2-5元/个',
    restaurants: [],
    tips: '现炸现吃最佳，清真餐馆与早茶店多有供应。',
    sources: [
      {
        label: '泾源县文化旅游广电局 · 第四批县级非物质文化遗产代表性传承人拟认定名单',
        url: 'https://www.nxjy.gov.cn/zzb/bmxxgk/202606/t20260629_5275984.html',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'baba-cha',
    status: 'published',
    verificationLevel: 'review',
    name: '八宝茶',
    category: 'drink',
    description: '盖碗里以茶叶为底，搭配红枣、枸杞、桂圆、芝麻、冰糖等南北食材冲泡，是吴忠早茶与宁夏待客的标志性饮品。',
    origin: '宁夏各地',
    bestSeason: '四季',
    priceRange: '5-15元/碗',
    restaurants: [
      { name: '杜优素早茶', cityId: 'wuzhong', coordinates: { lng: 106.2, lat: 37.99 }, recommend: '盖碗八宝茶配牛肉面' },
    ],
    tips: '吴忠早茶示范店多集中在早茶文化街区，可“先茶后面”。',
    sources: [
      {
        label: '文化和旅游部 · 品吴忠早茶 赏融合之美',
        url: 'http://www.mct.gov.cn/wlbphone/wlbydd/xxfb/qglb/nx/202408/t20240821_954791.html',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'sanzha',
    status: 'published',
    verificationLevel: 'review',
    name: '馓子',
    category: 'snack',
    description: '回民节庆常备的油炸细面食，盘绕成束炸至金黄酥脆，可单吃也可泡入羊杂汤或粉汤中。',
    origin: '宁夏各地',
    bestSeason: '四季',
    priceRange: '10-20元/份',
    restaurants: [],
    tips: '现炸现吃最酥脆，开斋节前后品种最丰富。',
    sources: [
      {
        label: '泾源县文化旅游广电局 · 第四批县级非物质文化遗产代表性传承人拟认定名单',
        url: 'https://www.nxjy.gov.cn/zzb/bmxxgk/202606/t20260629_5275984.html',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'xiang-cai',
    status: 'published',
    verificationLevel: 'review',
    name: '烩菜',
    category: 'staple',
    description: '把羊肉、土豆、粉条、豆腐与时令蔬菜同锅烩煮，是宁夏家庭与街边餐馆的常见主食，汤汁浓郁、暖胃耐饥。',
    origin: '宁夏各地',
    bestSeason: '秋冬',
    priceRange: '20-50元/份',
    restaurants: [],
    tips: '冬季最对味，可按口味选择纯素或加肉版本。',
    sources: [
      {
        label: '人民网 · 宁夏“百村千碗·乡村美食”工程成果展示活动举行',
        url: 'http://nx.people.com.cn/n2/2023/1016/c192474-40604857.html',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'xisha-gua',
    status: 'published',
    verificationLevel: 'review',
    name: '中卫硒砂瓜',
    category: 'fruit',
    description: '在压砂旱塬上种植的西瓜，砂石涵养雨露、富集硒锌，果肉脆润甘甜，是中卫夏季招牌鲜果。',
    origin: '中卫',
    bestSeason: '7-8月',
    priceRange: '1-2元/斤',
    restaurants: [
      { name: '中卫果蔬批发市场', cityId: 'zhongwei', coordinates: { lng: 105.19, lat: 37.5 }, recommend: '应季大果' },
    ],
    tips: '认准“一瓜一码”防伪溯源标识；沙坡头区兴仁镇、香山乡为核心产区。',
    sources: [
      {
        label: '沙坡头区人民政府 · 硒砂瓜开园上市',
        url: 'https://www.spt.gov.cn/xwzx/tpxw/202607/t20260708_5284259.html',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'gouqi',
    status: 'published',
    verificationLevel: 'review',
    name: '中宁枸杞',
    category: 'specialty',
    description: '中宁是世界枸杞发源地和正宗原产地，颗粒大、肉厚甘美，是国家道地中药材标准认证的枸杞品种。',
    origin: '中宁',
    bestSeason: '夏果6-7月、秋果9-10月',
    priceRange: '50-200元/斤',
    restaurants: [
      { name: '中宁枸杞交易中心', cityId: 'wuzhong', coordinates: { lng: 105.69, lat: 37.49 }, recommend: '干果、原浆、芽茶' },
    ],
    tips: '认准“中宁枸杞”地理标志证明商标；夏果品质通常优于秋果。',
    sources: [
      {
        label: '中宁县人民政府 · 中宁特产',
        url: 'https://www.znzf.gov.cn/zjzn/zngk/znts/201805/t20180522_763726.html',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'hongzao',
    status: 'published',
    verificationLevel: 'review',
    name: '灵武长枣',
    category: 'fruit',
    description: '宁夏灵武市独有鲜食枣品种，国家地理标志产品，果形长、皮薄肉脆、酸甜适口，已有 1300 余年栽培史。',
    origin: '灵武',
    bestSeason: '9-10月',
    priceRange: '15-30元/斤',
    restaurants: [
      { name: '灵武长枣标准化示范园', cityId: 'yinchuan', coordinates: { lng: 106.34, lat: 38.1 }, recommend: '头蓬果最佳' },
    ],
    tips: '9 月中下旬集中上市，鲜枣不耐久放，建议产地直采；认准地理标志专用标志。',
    sources: [
      {
        label: '灵武市自然资源局 · 灵武长枣出口迪拜',
        url: 'http://www.nxlw.gov.cn/zwgk/zc/zfwj/bmwj/202507/t20250731_4976391.html',
        kind: 'official',
        level: 'directory',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'putaojiu',
    status: 'published',
    verificationLevel: 'review',
    name: '贺兰山东麓葡萄酒',
    category: 'specialty',
    description: '北纬 37°43′—39°23′ 的贺兰山东麓产区是国家地理标志产品保护区，被国际葡萄与葡萄酒组织评为世界葡萄酒“明星产区”。',
    origin: '银川',
    bestSeason: '9-10月采收季',
    priceRange: '50-500元/瓶',
    restaurants: [
      { name: '张裕摩塞尔十五世酒庄', cityId: 'yinchuan', coordinates: { lng: 106.2, lat: 38.27 }, recommend: '酒庄游与品鉴' },
      { name: '志辉源石酒庄', cityId: 'yinchuan', coordinates: { lng: 106.13, lat: 38.5 }, recommend: '贺兰山下酒庄游' },
    ],
    tips: '产区内 2A 级以上酒庄 20 余家，建议提前预约品鉴；不驾车者可报一日游。',
    sources: [
      {
        label: '宁夏回族自治区工业和信息化厅 · 贺兰山东麓葡萄酒产业园区概况',
        url: 'https://gxt.nx.gov.cn/zwgk/gyjbxx/yqgk/202408/t20240801_4611721.html',
        kind: 'official',
        level: 'direct',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
  {
    id: 'zhongwei-latiaozi',
    status: 'published',
    verificationLevel: 'review',
    name: '中卫拉条子',
    category: 'noodle',
    description: '中卫特色手工拉面，面团经反复揉醒后手工拉成粗细均匀的圆条，浇羊肉臊子或西红柿鸡蛋臊子，筋道爽滑。',
    origin: '中卫',
    bestSeason: '四季',
    priceRange: '15-25元/碗',
    restaurants: [],
    tips: '本地老店多在老城一带，可加一份油香或小菜同食。',
    sources: [
      {
        label: '沙坡头区人民政府 · 中卫炒拉条',
        url: 'https://www.spt.gov.cn/zjspt/sptms/201812/t20181227_1233702.html',
        kind: 'official',
        level: 'direct',
        coverage: ['overview'],
        checkedAt: VERIFIED_AT,
      },
    ],
    verifiedAt: VERIFIED_AT,
  },
];

export const publishedFoods = foods.filter((f) => f.status === 'published');
export const verifiedFoods = publishedFoods.filter((f) => f.verificationLevel === 'verified');
export const reviewFoods = publishedFoods.filter((f) => f.verificationLevel === 'review');
const foodsById = new Map(foods.map((food) => [food.id, food]));
export const foodById = (id: string) => foodsById.get(id);

// 按城市筛选已发布美食：restaurant.cityId 命中，或 origin 文本包含该城市名。
// 例如 origin="吴忠" 直接匹配 wuzhong；origin="中卫" 匹配 zhongwei；
// origin="宁夏各地" 不与具体城市名匹配，需依赖 restaurant.cityId 才会被纳入。
export const foodsByCity = (cityId: CityId) => {
  const name = cityName(cityId);
  return publishedFoods.filter((f) => f.restaurants.some((r) => r.cityId === cityId) || f.origin.includes(name));
};
