import type { City, CityId } from '../types';

export const cities: City[] = [
  {
    id: 'yinchuan', name: '银川市', pinyin: 'yinchuan', travelRole: '宁夏首站与西夏文化门户', connectionNote: '河东机场、银川站连接区内外，适合作为环线起点', nickname: '塞上湖城',
    suggestedStay: '2—3 晚', arrivalNote: '优先作为首次入宁的抵达点，机场和铁路衔接相对完整', bestFor: ['首次到访', '历史文化', '环线起点'], planningTip: '西夏陵、镇北堡都在远郊西线，不要按市区景点的交通时间估算。',
    introduction: '宁夏回族自治区首府，贺兰山、黄河与银川平原共同塑造了城市格局，也是探索西夏历史和宁夏博物馆资源的主要落脚点。',
    history: '银川长期是西北交通与文化交流的重要节点。西夏时期都城兴庆府位于今银川一带，留下西夏陵等重要遗产。',
    foods: ['手抓羊肉', '羊杂碎', '辣糊糊', '八宝茶', '酿皮'], bestSeason: '4—10 月', culture: '西夏文化、黄河文化、回族文化',
    image: { src: 'images/attractions/xixia.webp', alt: '贺兰山下的西夏陵遗址', credit: 'BabelStone', license: 'CC BY-SA 3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:XiXia_Tomb_3_gate_tower_(west).jpg' },
  },
  {
    id: 'shizuishan', name: '石嘴山市', pinyin: 'shizuishan', travelRole: '湿地生态、贺兰山北段与工业遗产目的地', connectionNote: '可从银川向北往返；串联沙湖、北武当和工业遗产时建议住大武口一晚', nickname: '沙湖之城',
    suggestedStay: '1 晚', arrivalNote: '只看沙湖可以从银川往返；想把北武当与工业遗址公园也放进行程，建议住大武口一晚', bestFor: ['湿地生态', '工业遗产', '山地与亲子'], planningTip: '沙湖项目受天气影响，北武当受山地开放影响，工业遗址公园的公共区域和内部展馆也可能使用不同开放时段。',
    introduction: '宁夏北部城市，贺兰山与黄河平原在此相接；沙湖、北武当和由老洗煤厂更新而来的工业遗址公园，共同呈现生态修复与工业转型。',
    history: '石嘴山近现代工业发展特色鲜明，如今正在以生态修复、湿地保护和工业遗产推动城市转型。',
    foods: ['沙湖大鱼头', '羊肉臊子面', '酿皮', '羊肉串'], bestSeason: '5—10 月', culture: '湿地生态、工业遗产、黄河文化',
    image: { src: 'images/attractions/shahu.webp', alt: '宁夏平原水域与田野景观', credit: 'GHOSTGHOSTH2O', license: 'CC BY-SA 4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:宁夏平原稻田风光.png' },
  },
  {
    id: 'wuzhong', name: '吴忠市', pinyin: 'wuzhong', travelRole: '黄河文化与城市早茶目的地', connectionNote: '银川向南进入中卫前的自然衔接点', nickname: '黄河金岸',
    suggestedStay: '0—1 晚', arrivalNote: '可从银川南下，经吴忠、青铜峡再前往中卫，适合自驾串联', bestFor: ['黄河文化', '城市早茶', '自驾串联'], planningTip: '中华黄河楼和黄河坛不是同一个地点，导航时务必核对完整名称。',
    introduction: '黄河穿城而过，青铜峡水利工程、黄河文化景观与回族饮食传统共同构成吴忠的旅行特色。',
    history: '吴忠是古丝绸之路北道的重要区域，长期受黄河灌溉滋养，形成了鲜明的农耕、商贸与多民族文化。',
    foods: ['吴忠早茶', '手抓羊肉', '羊肉臊子面', '油香', '八宝茶'], bestSeason: '4—10 月', culture: '黄河文化、回族文化、灌溉文明',
    image: { src: 'images/attractions/qingtongxia.webp', alt: '青铜峡黄河沿线景观', credit: 'AddisWang', license: 'CC BY-SA 3.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:青铜峡黄河铁桥.JPG' },
  },
  {
    id: 'guyuan', name: '固原市', pinyin: 'guyuan', travelRole: '宁南山地、丝路与长征文化中心', connectionNote: '与北部景点距离较远，建议单独安排至少两天', nickname: '丝路古城',
    suggestedStay: '2 晚起', arrivalNote: '适合单独作为宁南段落，至少安排两天；与银川、中卫之间需预留长距离公路时间', bestFor: ['山地避暑', '丝路文化', '红色研学'], planningTip: '隆德长征景区与泾源森林公园分属不同县，不适合压缩在同一个半天；须弥山、六盘山与彭阳梯田相距较远，建议拆成两日安排。',
    introduction: '宁夏南部山地城市，六盘山生态、丝路遗存、红色文化和黄土高原乡村景观彼此交织。',
    history: '古原州是丝绸之路北道重镇。六盘山及周边保存着从古代交通到红军长征的多层历史记忆。',
    foods: ['固原生汆面', '羊肉垫卷子', '洋芋擦擦', '荞面饸饹', '彭阳红梅杏'], bestSeason: '5—9 月', culture: '丝路文化、长征文化、山地生态',
    image: { src: 'images/attractions/liupanshan.webp', alt: '六盘山区域景观', credit: '董辰兴', license: 'CC BY-SA 4.0', sourceUrl: 'https://commons.wikimedia.org/wiki/File:六盘山红军长征纪念馆西眺.jpg' },
  },
  {
    id: 'zhongwei', name: '中卫市', pinyin: 'zhongwei', travelRole: '沙漠与黄河体验核心目的地', connectionNote: '高铁连接银川，适合安排一至两晚', nickname: '沙漠水城',
    suggestedStay: '1—2 晚', arrivalNote: '可由银川乘铁路抵达，沙坡头与中卫市区之间仍需要二次接驳', bestFor: ['沙漠体验', '黄河景观', '亲子摄影'], planningTip: '先查看风力和景区项目公告，再决定沙漠与黄河体验的先后顺序。',
    introduction: '腾格里沙漠与黄河在这里相遇，沙坡头、中卫高庙和老城生活共同组成宁夏最经典的旅行组合。',
    history: '中卫地处河西走廊与宁夏平原之间，长期承担边塞、交通和黄河灌溉节点功能。',
    foods: ['蒿子面', '手抓羊肉', '中宁枸杞', '硒砂瓜', '卤豆腐'], bestSeason: '5—10 月', culture: '沙漠文化、黄河文化、枸杞文化',
    image: { src: 'images/attractions/shapotou.webp', alt: '沙坡头沙漠景观', credit: 'Fred Feng', license: 'Public domain', sourceUrl: 'https://commons.wikimedia.org/wiki/File:Shapotou.jpg' },
  },
];

const citiesById = new Map<string, City>(cities.map((city) => [city.id, city]));
export const getCityById = (cityId?: string) => cityId ? citiesById.get(cityId) : undefined;
export const cityName = (cityId: CityId) => getCityById(cityId)?.name ?? cityId;
