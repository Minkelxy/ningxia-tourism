import type { RoutePlan } from '../types';

const verifiedAt = '2026-08-15';

export const routes: RoutePlan[] = [
  {
    id: 'quick-1day', name: '银川精华一日游', theme: 'first-visit', themeLabel: '初见宁夏', durationDays: 1, durationLabel: '1 天',
    audience: '首次到访、在银川停留时间有限的游客', budget: '约 500—800 元/人，不含往返大交通', bestSeason: '全年，夏季注意防晒', pace: 'intensive', walkingLevel: 'high', transportSummary: '包车或自驾串联市区与银川西线',
    summary: '用博物馆建立背景，再到西夏陵和镇北堡感受宁夏最鲜明的历史与影像气质。景点较多，建议包车或自驾。',
    highlights: ['宁夏博物馆', '西夏陵', '镇北堡西部影城'], verifiedAt,
    days: [{ day: 1, title: '从西夏文明到西部电影', summary: '市区出发，全天向银川西线移动。', accommodation: '银川市区', meals: ['午餐：西夏区简餐', '晚餐：怀远观光夜市'], stops: [
      { time: '09:00', title: '宁夏博物馆', attractionId: 'ningxiamuseum', description: '先了解宁夏历史、西夏文化与丝路背景。', transport: '市区公交或打车', tips: '提前确认预约和闭馆安排。' },
      { time: '11:30', title: '西夏陵', attractionId: 'xixiawangling', description: '参观遗址区和博物馆，建议使用讲解服务。', transport: '车程约 40—60 分钟，以实时路况为准' },
      { time: '15:30', title: '镇北堡西部影城', attractionId: 'zhenbeibu', description: '在明清城堡和电影场景间慢慢步行拍摄。', transport: '景区间车程以实时导航为准' },
      { time: '19:30', title: '怀远观光夜市', mapQuery: '银川怀远观光夜市', description: '以小份多样的方式尝试辣糊糊、羊杂碎等本地小吃。', tips: '节假日人流集中，保管好随身物品。' },
    ], timeSlots: [
      { time: '09:00-11:00', location: '宁夏博物馆', description: '通过通史与西夏文物展陈建立宁夏历史与地理背景。', tips: '提前确认闭馆日与停止入馆时间。' },
      { time: '11:30-14:30', location: '西夏陵', description: '遗址区与博物馆连贯参观，含市区至景区往返与午餐。', tips: '建议使用讲解服务，预留车程弹性。' },
      { time: '15:30-18:30', location: '镇北堡西部影城', description: '在明清城堡与电影场景间步行拍摄，下午光线更适合街景。' },
      { time: '19:30-21:30', location: '怀远观光夜市', description: '分食辣糊糊、羊杂碎等本地小吃，体验银川夜间烟火气。', tips: '节假日人流集中，看管好随身物品。' },
    ] }],
  },
  {
    id: 'weekend-2day', name: '塞上江南周末游', theme: 'weekend', themeLabel: '周末短途', durationDays: 2, durationLabel: '2 天',
    audience: '周末从周边城市抵达银川的游客', budget: '约 1,000—1,600 元/人，不含往返大交通', bestSeason: '5—10 月', pace: 'balanced', walkingLevel: 'medium', transportSummary: '银川住宿，包车、自驾或旅游交通往返远郊',
    summary: '一天看贺兰山下的历史文化，一天去沙湖看沙水相依，节奏适中，适合第一次来宁夏。',
    highlights: ['西夏陵', '镇北堡西部影城', '沙湖生态旅游区', '宁夏博物馆'], verifiedAt,
    days: [
      { day: 1, title: '贺兰山下的历史与电影', summary: '银川西线组合，减少折返。', accommodation: '银川市区', meals: ['午餐：镇北堡周边', '晚餐：银川老城'], stops: [
        { time: '08:30', title: '西夏陵', attractionId: 'xixiawangling', description: '把更多精力留给遗址区与博物馆。', transport: '建议包车或自驾' },
        { time: '13:30', title: '镇北堡西部影城', attractionId: 'zhenbeibu', description: '下午光线更适合古堡与街景拍摄。', transport: '景区间按实时导航行驶' },
      ], timeSlots: [
        { time: '08:30-12:00', location: '西夏陵', description: '遗址区与博物馆连贯参观，建议使用讲解服务。' },
        { time: '13:30-17:00', location: '镇北堡西部影城', description: '在明清城堡与电影场景间步行拍摄，下午光线更适合街景。', tips: '景区间按实时导航行驶。' },
      ] },
      { day: 2, title: '沙湖与宁夏全景', summary: '上午前往沙湖，返程后用博物馆收束旅程。', accommodation: '无', meals: ['午餐：沙湖景区或平罗县城', '晚餐：银川市区'], stops: [
        { time: '08:00', title: '前往沙湖', mapQuery: '宁夏沙湖生态旅游区', description: '尽量早到，先确认游船和沙漠项目开放情况。', transport: '旅游交通、包车或自驾' },
        { time: '09:30', title: '沙湖生态旅游区', attractionId: 'shahu', description: '游览湖泊、芦苇与沙丘区域。' },
        { time: '16:00', title: '宁夏博物馆', attractionId: 'ningxiamuseum', description: '如返程时间允许，在市区完成文化补课。', tips: '注意停止入馆时间。' },
      ], timeSlots: [
        { time: '08:00-09:30', location: '前往沙湖', description: '银川至沙湖的公路移动，尽量早到以确认游船与沙漠项目。' },
        { time: '09:30-15:00', location: '沙湖生态旅游区', description: '游览湖泊、芦苇与沙丘区域，按天气与项目开放情况取舍。', tips: '返程和午餐时间保留弹性。' },
        { time: '16:00-17:30', location: '宁夏博物馆', description: '返程后如时间允许，在市区完成文化补课。', tips: '注意停止入馆时间。' },
      ] },
    ],
  },
  {
    id: 'shizuishan-2day', name: '山湖与工业石嘴山两日游', theme: 'weekend', themeLabel: '山湖工业', durationDays: 2, durationLabel: '2 天',
    audience: '想把沙湖之外的石嘴山也看完整、可接受公路接驳的游客', budget: '约 900—1,500 元/人，不含抵达宁夏的大交通，按 2026-08 行程结构估算', bestSeason: '5—10 月；冬季优先确认沙湖项目和山地开放范围', pace: 'balanced', walkingLevel: 'medium', transportSummary: '银川与石嘴山之间走公路，市域内建议自驾、包车或分段打车',
    summary: '第一天在沙湖看沙水相依，第二天从贺兰山北段走进大武口的工业记忆。建议住一晚大武口，避免两天都从银川往返。',
    highlights: ['沙湖生态旅游区', '北武当生态旅游区', '大武口工业遗址公园'], verifiedAt,
    days: [
      { day: 1, title: '先看沙湖，再住进大武口', summary: '把受天气影响较大的沙湖放在第一天，并给游船、沙漠项目留出弹性。', accommodation: '大武口城区', meals: ['午餐：沙湖景区或平罗县城', '晚餐：大武口城区'], stops: [
        { time: '上午', title: '抵达沙湖', mapQuery: '宁夏沙湖生态旅游区', description: '到达后先查看游船、观鸟与沙漠体验的当日开放情况。', transport: '从银川或石嘴山方向自驾、包车或使用当日可查询到的旅游交通' },
        { time: '全天', title: '沙湖生态旅游区', attractionId: 'shahu', description: '按天气和同行者体力，在湖泊、芦苇、沙丘与体验项目之间取舍。', tips: '不必为了打卡把所有收费项目排满，返程和入住时间保留弹性。' },
        { time: '傍晚', title: '大武口城区', mapQuery: '石嘴山市大武口区人民路', description: '入住后安排轻量城市步行和晚餐，为第二天的山地与工业路线蓄力。', transport: '沙湖至大武口按实时导航安排，夜间避免临时寻找偏远住宿' },
      ], timeSlots: [
        { time: '09:00-10:30', location: '抵达沙湖', description: '到达后先查看游船、观鸟与沙漠体验的当日开放情况。', tips: '从银川或石嘴山方向自驾、包车或使用当日可查询到的旅游交通。' },
        { time: '10:30-16:30', location: '沙湖生态旅游区', description: '按天气和同行者体力，在湖泊、芦苇、沙丘与体验项目之间取舍。', tips: '不必为了打卡把所有收费项目排满，返程和入住时间保留弹性。' },
        { time: '17:30-19:30', location: '大武口城区', description: '入住后安排轻量城市步行和晚餐，为第二天的山地与工业路线蓄力。', tips: '夜间避免临时寻找偏远住宿。' },
      ] },
      { day: 2, title: '贺兰山北段与煤城记忆', summary: '上午安排山地生态，下午回到城区看工业遗产活化，体力和返程都更容易控制。', accommodation: '无或按返程安排续住大武口', meals: ['午餐：大武口城区', '晚餐：返程城市'], stops: [
        { time: '上午', title: '北武当生态旅游区', attractionId: 'beiwudang', description: '根据防火期、天气和游线开放情况选择登高、森林公园或文化参观。', transport: '从大武口城区自驾、包车或打车，提前确认返程方式', tips: '山地游线临时关闭时，不向未开放沟谷继续深入。' },
        { time: '下午', title: '大武口工业遗址公园', attractionId: 'dawukou-industrial', description: '从保留的洗煤厂建筑、输送设施和铁路空间理解石嘴山“因煤而兴”后的城市转型。', transport: '返回大武口城区后按景区全名导航', tips: '公共园区和内部展馆开放时段不同，先看当天公告，再决定参观顺序。' },
        { time: '傍晚', title: '石嘴山站或大武口城区返程', mapQuery: '石嘴山站', description: '根据当日铁路和公路信息返回银川或继续下一段行程，不使用路线中的时间作为班次承诺。', transport: '铁路、城际客运或自驾均以出发日查询为准' },
      ], timeSlots: [
        { time: '08:30-12:00', location: '北武当生态旅游区', description: '根据防火期、天气和游线开放情况选择登高、森林公园或文化参观。', tips: '山地游线临时关闭时，不向未开放沟谷继续深入。' },
        { time: '13:30-16:30', location: '大武口工业遗址公园', description: '从保留的洗煤厂建筑、输送设施和铁路空间理解石嘴山“因煤而兴”后的城市转型。', tips: '公共园区和内部展馆开放时段不同，先看当天公告。' },
        { time: '17:00-19:00', location: '石嘴山站或大武口城区返程', description: '根据当日铁路和公路信息返回银川或继续下一段行程。', tips: '班次以出发日查询为准，路线时间不作承诺。' },
      ] },
    ],
  },
  {
    id: 'classic-3day', name: '经典三日全景游', theme: 'panorama', themeLabel: '银川＋中卫', durationDays: 3, durationLabel: '3 天',
    audience: '希望一次覆盖宁夏最经典目的地的游客', budget: '约 2,000—3,200 元/人，不含往返大交通', bestSeason: '5—10 月', pace: 'balanced', walkingLevel: 'medium', transportSummary: '银川至中卫优先铁路，远郊景区使用包车或自驾',
    summary: '银川历史文化与中卫沙漠黄河的黄金组合，利用铁路连接两城，减少长距离自驾压力。',
    highlights: ['宁夏博物馆', '西夏陵', '沙坡头', '中卫高庙'], verifiedAt,
    days: [
      { day: 1, title: '抵达银川，认识宁夏', summary: '以市区为主，给抵达留出弹性。', accommodation: '银川市区', meals: ['晚餐：怀远观光夜市'], stops: [
        { time: '14:00', title: '宁夏博物馆', attractionId: 'ningxiamuseum', description: '建立宁夏历史与地理背景。' },
        { time: '18:30', title: '怀远观光夜市', mapQuery: '银川怀远观光夜市', description: '体验银川夜间烟火气。' },
      ], timeSlots: [
        { time: '14:00-16:30', location: '宁夏博物馆', description: '通过通史与西夏文物展陈建立宁夏历史与地理背景。', tips: '提前确认闭馆日与停止入馆时间。' },
        { time: '18:30-21:00', location: '怀远观光夜市', description: '在夜市分食辣糊糊、羊杂碎等本地小吃，体验银川夜间烟火气。', tips: '节假日人流集中，看管好随身物品。' },
      ] },
      { day: 2, title: '西夏陵与镇北堡', summary: '全天游览银川西线。', accommodation: '银川市区', meals: ['午餐：西夏区', '晚餐：银川市区'], stops: [
        { time: '08:30', title: '西夏陵', attractionId: 'xixiawangling', description: '遗址区与博物馆连贯参观。', transport: '包车或自驾' },
        { time: '14:00', title: '镇北堡西部影城', attractionId: 'zhenbeibu', description: '预留至少三小时步行与拍摄。' },
      ], timeSlots: [
        { time: '08:30-12:30', location: '西夏陵', description: '遗址区与博物馆连贯参观，建议使用讲解服务。' },
        { time: '14:00-17:30', location: '镇北堡西部影城', description: '在明清城堡与电影场景间步行拍摄，至少预留三小时。', tips: '下午光线更适合古堡与街景拍摄。' },
      ] },
      { day: 3, title: '沙坡头与中卫老城', summary: '早班铁路前往中卫，晚间可从中卫返程。', accommodation: '无或中卫市区', meals: ['午餐：沙坡头周边', '晚餐：中卫市区'], stops: [
        { time: '08:00', title: '银川前往中卫', mapQuery: '中卫站', description: '优先选择铁路，班次与耗时以购票平台为准。', transport: '火车／动车' },
        { time: '10:30', title: '沙坡头旅游景区', attractionId: 'shapotou', description: '根据天气选择黄河区与沙漠区项目。' },
        { time: '17:00', title: '中卫高庙', attractionId: 'zhongweigaomiao', description: '回到市区后安排短时参观。', tips: '先确认当日开放时间。' },
      ], timeSlots: [
        { time: '08:00-10:30', location: '银川前往中卫', description: '优先选择铁路，班次与耗时以购票平台为准。', tips: '到达后可寄存行李再前往沙坡头。' },
        { time: '10:30-16:00', location: '沙坡头旅游景区', description: '根据天气选择黄河区与沙漠区项目，分时游览两个区域。', tips: '大风或高温天气减少高强度项目。' },
        { time: '17:00-18:30', location: '中卫高庙', description: '回到市区后安排短时参观。', tips: '先确认当日开放时间。' },
      ] },
    ],
  },
  {
    id: 'in-depth-4day', name: '深度四日全景游', theme: 'panorama', themeLabel: '黄河与沙漠', durationDays: 4, durationLabel: '4 天',
    audience: '时间充裕、希望覆盖银川、吴忠和中卫的游客', budget: '约 3,000—4,500 元/人，不含往返大交通', bestSeason: '5—10 月', pace: 'balanced', walkingLevel: 'medium', transportSummary: '跨城公路为主，吴忠至中卫按住宿安排衔接',
    summary: '在经典银川与中卫之间加入吴忠黄河金岸，文化、城市、河谷与沙漠层次更完整。',
    highlights: ['宁夏博物馆', '西夏陵', '黄河金岸', '沙坡头'], verifiedAt,
    days: [
      { day: 1, title: '银川城市文化', summary: '市区慢游，为后续行程补充背景。', accommodation: '银川市区', meals: ['午餐：银川市区', '晚餐：老城'], stops: [
        { time: '09:30', title: '宁夏博物馆', attractionId: 'ningxiamuseum', description: '从博物馆开始认识宁夏。' },
        { time: '15:00', title: '鼓楼—玉皇阁历史文化街区', attractionId: 'gulou-yuhuangge', description: '从鼓楼、玉皇阁到周边街巷慢慢步行；南关清真大寺只在现场允许时顺路看外观。', tips: '宗教活动场所不保证游客进入，不拍摄礼拜活动。' },
      ], timeSlots: [
        { time: '09:30-12:30', location: '宁夏博物馆', description: '从博物馆开始认识宁夏历史、西夏文化与丝路背景。', tips: '提前确认闭馆日与停止入馆时间。' },
        { time: '15:00-18:00', location: '鼓楼—玉皇阁历史文化街区', description: '沿鼓楼、玉皇阁与周边街巷步行，南关清真大寺仅作现场允许时的外观顺路点。', tips: '宗教活动场所不保证游客进入，不拍摄礼拜活动。' },
      ] },
      { day: 2, title: '贺兰山文化走廊', summary: '银川西线一日。', accommodation: '银川市区', meals: ['午餐：西夏区', '晚餐：银川'], stops: [
        { time: '08:30', title: '西夏陵', attractionId: 'xixiawangling', description: '重点参观遗址与展馆。', transport: '包车或自驾' },
        { time: '14:00', title: '镇北堡西部影城', attractionId: 'zhenbeibu', description: '下午体验西部电影场景。' },
      ], timeSlots: [
        { time: '08:30-12:30', location: '西夏陵', description: '重点参观遗址与展馆，建议使用讲解服务。', tips: '包车或自驾，预留车程弹性。' },
        { time: '14:00-17:30', location: '镇北堡西部影城', description: '在明清城堡与电影场景间步行拍摄，体验西部电影场景。', tips: '下午光线更适合古堡与街景拍摄。' },
      ] },
      { day: 3, title: '吴忠黄河金岸', summary: '银川出发，沿黄河向吴忠和青铜峡移动。', accommodation: '吴忠或中卫', meals: ['午餐：吴忠早茶／手抓', '晚餐：中卫'], stops: [
        { time: '09:30', title: '中华黄河楼', attractionId: 'zhonghuahuanghelou', description: '如当天开放，可参观黄河文化主题建筑与展陈；未开放则保留为黄河沿线机动时段。', tips: '旧 4A 等级已于 2023 年取消，出发前确认当前开放与入口。' },
        { time: '14:00', title: '黄河坛旅游区', attractionId: 'huanghetan', description: '沿黄河坛建筑轴线参观大牌楼、碑林大道与黄河文化景观。', transport: '包车或自驾', tips: '与中华黄河楼不是同一地点，导航时核对完整名称和地址。' },
        { time: '18:00', title: '前往中卫', mapQuery: '中卫市', description: '到达后休息，为次日沙漠行程保存体力。' },
      ], timeSlots: [
        { time: '09:30-12:00', location: '中华黄河楼', description: '如当天开放，参观黄河文化主题建筑与展陈；未开放则保留为黄河沿线机动时段。', tips: '旧 4A 等级已于 2023 年取消，出发前确认当前开放与入口。' },
        { time: '14:00-17:00', location: '黄河坛旅游区', description: '沿黄河坛建筑轴线参观大牌楼、碑林大道与黄河文化景观。', tips: '与中华黄河楼不是同一地点，导航时核对完整名称和地址。' },
        { time: '18:00-20:00', location: '前往中卫', description: '到达后休息，为次日沙漠行程保存体力。', tips: '跨城公路移动，按实时导航预留时间。' },
      ] },
      { day: 4, title: '沙坡头全天', summary: '根据天气和兴趣选择体验项目。', accommodation: '无', meals: ['午餐：景区周边', '晚餐：中卫市区'], stops: [
        { time: '09:00', title: '沙坡头旅游景区', attractionId: 'shapotou', description: '将黄河区和沙漠区分时游览。', tips: '大风或高温天气减少高强度项目。' },
        { time: '17:30', title: '中卫高庙', attractionId: 'zhongweigaomiao', description: '时间允许时在返程前参观。' },
      ], timeSlots: [
        { time: '09:00-16:00', location: '沙坡头旅游景区', description: '将黄河区和沙漠区分时游览，按天气和兴趣选择体验项目。', tips: '大风或高温天气减少高强度项目。' },
        { time: '17:30-19:00', location: '中卫高庙', description: '时间允许时在返程前参观。', tips: '先确认当日开放时间。' },
      ] },
    ],
  },
  {
    id: 'panorama-5day', name: '五日全景深度游', theme: 'panorama', themeLabel: '五城精华', durationDays: 5, durationLabel: '5 天',
    audience: '第一次来宁夏且希望放慢节奏的游客', budget: '约 4,000—6,500 元/人，不含往返大交通', bestSeason: '5—10 月', pace: 'relaxed', walkingLevel: 'medium', transportSummary: '包车或自驾完成跨城，住宿随路线向南移动',
    summary: '把银川、沙湖、吴忠和中卫按地理顺序串联，每天只保留一个主主题，降低赶路感。',
    highlights: ['银川历史', '沙湖湿地', '吴忠黄河与早茶', '中卫沙漠'], verifiedAt,
    days: [
      { day: 1, title: '抵达银川', summary: '市区适应与文化入门。', accommodation: '银川市区', meals: ['晚餐：银川老城'], stops: [
        { time: '14:30', title: '宁夏博物馆', attractionId: 'ningxiamuseum', description: '抵达后先建立区域认知。' },
        { time: '18:00', title: '鼓楼—玉皇阁历史文化街区', attractionId: 'gulou-yuhuangge', description: '用老城步行适应城市节奏，展览和光影活动以当天公告为准。' },
      ], timeSlots: [
        { time: '14:30-17:00', location: '宁夏博物馆', description: '抵达后先建立区域认知，了解宁夏历史与地理背景。', tips: '提前确认闭馆日与停止入馆时间。' },
        { time: '18:00-20:30', location: '鼓楼—玉皇阁历史文化街区', description: '用老城步行适应城市节奏，展览和光影活动以当天公告为准。' },
      ] },
      { day: 2, title: '西夏文化与西部电影', summary: '银川西线。', accommodation: '银川市区', meals: ['午餐：西夏区', '晚餐：怀远观光夜市'], stops: [
        { time: '08:30', title: '西夏陵', attractionId: 'xixiawangling', description: '完整参观遗址与博物馆。' },
        { time: '14:00', title: '镇北堡西部影城', attractionId: 'zhenbeibu', description: '慢行拍摄，不再叠加其他远郊景点。' },
      ], timeSlots: [
        { time: '08:30-12:30', location: '西夏陵', description: '完整参观遗址与博物馆，建议使用讲解服务。' },
        { time: '14:00-17:30', location: '镇北堡西部影城', description: '慢行拍摄，不再叠加其他远郊景点，预留充足步行时间。', tips: '下午光线更适合古堡与街景拍摄。' },
      ] },
      { day: 3, title: '沙湖生态日', summary: '银川往返沙湖。', accommodation: '银川市区', meals: ['午餐：平罗或景区', '晚餐：银川'], stops: [
        { time: '09:30', title: '沙湖生态旅游区', attractionId: 'shahu', description: '把一整天交给沙水与湿地景观。', transport: '旅游交通、包车或自驾' },
      ], timeSlots: [
        { time: '09:30-16:00', location: '沙湖生态旅游区', description: '把一整天交给沙水与湿地景观，按天气与项目开放情况取舍。', tips: '返程和午餐时间保留弹性。' },
      ] },
      { day: 4, title: '吴忠黄河与早茶', summary: '上午体验吴忠饮食，下午沿黄河前往中卫。', accommodation: '中卫市区', meals: ['早餐／早午餐：吴忠早茶', '晚餐：中卫'], stops: [
        { time: '09:00', title: '吴忠早茶', mapQuery: '吴忠早茶文化体验街', description: '选择正规门店，按人数少量多样点餐。' },
        { time: '12:30', title: '中华黄河楼', attractionId: 'zhonghuahuanghelou', description: '确认开放后再参观黄河主题建筑与展陈；否则改为黄河沿线短停。', tips: '不要沿用旧 4A 景区攻略中的开放与票价信息。' },
        { time: '15:00', title: '黄河坛旅游区', attractionId: 'huanghetan', description: '继续前往青铜峡峡谷入口，沿建筑轴线了解黄河文化。', transport: '包车或自驾', tips: '与中华黄河楼之间仍有公路移动，出发前按实时导航预留时间。' },
      ], timeSlots: [
        { time: '09:00-11:30', location: '吴忠早茶', description: '选择正规门店，按人数少量多样点餐，尝试八宝茶、牛肉面与羊杂等组合。', tips: '门店高峰期排队，选择明码标价的正规商户。' },
        { time: '12:30-14:30', location: '中华黄河楼', description: '确认开放后再参观黄河主题建筑与展陈；否则改为黄河沿线短停。', tips: '不要沿用旧 4A 景区攻略中的开放与票价信息。' },
        { time: '15:00-18:00', location: '黄河坛旅游区', description: '继续前往青铜峡峡谷入口，沿建筑轴线了解黄河文化。', tips: '与中华黄河楼之间仍有公路移动，出发前按实时导航预留时间。' },
      ] },
      { day: 5, title: '中卫沙漠与老城', summary: '沙坡头为主，市区古建为辅。', accommodation: '无', meals: ['午餐：沙坡头周边', '晚餐：中卫市区'], stops: [
        { time: '09:00', title: '沙坡头旅游景区', attractionId: 'shapotou', description: '根据天气选择体验项目。' },
        { time: '17:00', title: '中卫高庙', attractionId: 'zhongweigaomiao', description: '返程前完成老城短游。' },
      ], timeSlots: [
        { time: '09:00-16:00', location: '沙坡头旅游景区', description: '根据天气选择体验项目，分时游览黄河区与沙漠区。', tips: '大风或高温天气减少高强度项目。' },
        { time: '17:00-18:30', location: '中卫高庙', description: '返程前完成老城短游。', tips: '先确认当日开放时间。' },
      ] },
    ],
  },
  {
    id: 'red-culture-3day', name: '红色文化之旅', theme: 'culture', themeLabel: '红色文化', durationDays: 3, durationLabel: '3 天',
    audience: '关注革命历史、团队研学和宁南人文的游客', budget: '约 1,800—3,000 元/人，不含往返大交通', bestSeason: '5—9 月', pace: 'intensive', walkingLevel: 'medium', transportSummary: '长距离包车或自驾，建议熟悉宁夏道路的司机',
    summary: '从盐池到六盘山跨度较大，建议包车或自驾并配备熟悉宁夏道路的司机，不与普通观光路线混排。',
    highlights: ['盐池革命历史', '六盘山长征文化', '宁南山地生态'], verifiedAt,
    days: [
      { day: 1, title: '银川集结与历史导入', summary: '用博物馆展陈理解宁夏近现代历史。', accommodation: '银川市区', meals: ['晚餐：银川市区'], stops: [
        { time: '14:00', title: '宁夏博物馆', attractionId: 'ningxiamuseum', description: '关注近现代史与宁夏地方历史展陈。' },
      ], timeSlots: [
        { time: '14:00-17:00', location: '宁夏博物馆', description: '关注近现代史与宁夏地方历史展陈，建立宁夏革命历史背景。', tips: '提前确认闭馆日与停止入馆时间。' },
      ] },
      { day: 2, title: '盐池红色记忆', summary: '早出发前往盐池，当晚视体力住盐池或固原。', accommodation: '盐池县或固原市区', meals: ['午餐：盐池县城', '晚餐：住宿地'], stops: [
        { time: '10:30', title: '盐池革命历史纪念园', attractionId: 'yanchilie', description: '参观革命历史展陈、解放广场、纪念碑与红军陵，建立盐池红色历史的整体脉络。', transport: '包车或自驾', tips: '常规开放信息已核实；团队讲解和教育活动仍建议提前确认。' },
        { time: '15:00', title: '盐池县城人文走读', mapQuery: '盐池县', description: '结合县城历史与长城文化安排，具体点位以当地开放情况为准。' },
      ], timeSlots: [
        { time: '10:30-12:30', location: '盐池革命历史纪念园', description: '参观革命历史展陈、解放广场、纪念碑与红军陵，建立盐池红色历史的整体脉络。', tips: '常规开放信息已核实；团队讲解和教育活动仍建议提前确认。' },
        { time: '15:00-17:30', location: '盐池县城人文走读', description: '结合县城历史与长城文化安排，具体点位以当地开放情况为准。' },
      ] },
      { day: 3, title: '六盘山长征文化', summary: '本日目的地在隆德县，不与泾源县六盘山国家森林公园混排。山地天气变化快，行程不要排得过满。', accommodation: '无', meals: ['午餐：隆德县城或景区简餐', '晚餐：固原市区'], stops: [
        { time: '09:30', title: '六盘山红军长征旅游区', attractionId: 'liupanshan', description: '参观纪念馆、纪念碑，并按体力体验 2.5 公里红军小道。', transport: '包车或自驾前往隆德县', tips: '团队讲解应提前预约；不要误导航至泾源县六盘山国家森林公园。' },
      ], timeSlots: [
        { time: '09:30-13:00', location: '六盘山红军长征旅游区', description: '参观纪念馆、纪念碑，并按体力体验 2.5 公里红军小道。', tips: '团队讲解应提前预约；不要误导航至泾源县六盘山国家森林公园。' },
      ] },
    ],
  },
  {
    id: 'guyuan-2day', name: '固原两日：须弥山与六盘山', theme: 'panorama', themeLabel: '宁南山水', durationDays: 2, durationLabel: '2 天',
    audience: '想在银川之外专门留两天，走宁南山地与丝路石窟的游客', budget: '约 1,200—2,000 元/人，不含往返宁夏的大交通，按 2026-08 行程结构估算', bestSeason: '5—10 月；山地天气多变，出发前关注预报', pace: 'balanced', walkingLevel: 'high', transportSummary: '固原区域内以自驾或包车接驳，城市段可用城际客运或打车',
    summary: '第一天在固原市区与须弥山感受丝路石窟文化，第二天翻越六盘山看长征文化与山地生态。若时间允许，彭阳梯田可作季节合适的半天延伸。',
    highlights: ['须弥山石窟', '六盘山红军长征旅游区', '固原市区人文'], verifiedAt,
    days: [
      { day: 1, title: '须弥山与固原山城', summary: '以固原市区为落点，上午走读城市人文，下午前往原州区的须弥山石窟。', accommodation: '固原市区', meals: ['午餐：固原市区', '晚餐：固原市区'], stops: [
        { time: '上午', title: '固原市区人文走读', mapQuery: '固原市原州区', description: '在固原老城与博物馆区域慢慢步行，具体点位和开放情况以当天为准。' },
        { time: '14:00', title: '须弥山旅游区', attractionId: 'xumishan', description: '沿大佛楼、圆光寺等区域参观红色砂岩上的北魏至明清石窟群。', transport: '从固原市区自驾或包车前往', tips: '石窟区台阶与坡道较多，按体力安排参观顺序。' },
      ], timeSlots: [
        { time: '09:30-12:00', location: '固原市区人文走读', description: '在固原老城与博物馆区域慢慢步行，具体点位和开放情况以当天为准。' },
        { time: '14:00-17:30', location: '须弥山旅游区', description: '沿大佛楼、圆光寺等区域参观红色砂岩上的北魏至明清石窟群。', tips: '石窟区台阶与坡道较多，按体力安排参观顺序。' },
      ] },
      { day: 2, title: '六盘山：长征文化与山地生态', summary: '早出发前往隆德县六盘山红军长征旅游区，走完纪念馆与红军小道后返程。彭阳梯田适合在季节合适时另加半天。', accommodation: '无或固原市区', meals: ['午餐：隆德县城或景区简餐', '晚餐：固原市区或返程城市'], stops: [
        { time: '09:30', title: '六盘山红军长征旅游区', attractionId: 'liupanshan', description: '参观纪念馆、纪念碑，并按体力体验 2.5 公里红军小道，感受长征文化与山地生态。', transport: '自驾或包车前往隆德县', tips: '不要误导航至泾源县六盘山国家森林公园；山地天气变化快，行程勿排满。' },
        { time: '傍晚', title: '返回固原或继续行程', mapQuery: '固原市', description: '根据当日班次和体力返回银川或续住固原，不使用路线时间作班次承诺。', transport: '铁路、城际客运或自驾均以出发日查询为准' },
      ], timeSlots: [
        { time: '09:30-13:30', location: '六盘山红军长征旅游区', description: '参观纪念馆、纪念碑，并按体力体验 2.5 公里红军小道，感受长征文化与山地生态。', tips: '不要误导航至泾源县六盘山国家森林公园；山地天气变化快，行程勿排满。' },
        { time: '17:00-19:00', location: '返回固原或继续行程', description: '根据当日班次和体力返回银川或续住固原。', tips: '班次以出发日查询为准，路线时间不作承诺。' },
      ] },
    ],
  },
  {
    id: 'food-3day', name: '宁夏美食之旅', theme: 'food', themeLabel: '城市味道', durationDays: 3, durationLabel: '3 天',
    audience: '把地方饮食与城市漫游放在首位的游客', budget: '约 1,500—2,800 元/人，不含往返大交通', bestSeason: '全年', pace: 'relaxed', walkingLevel: 'low', transportSummary: '城市间铁路或公路，市内以步行和打车为主',
    summary: '以银川、吴忠和中卫三城为主线，餐饮信息变化快，路线只给区域和品类建议，不为具体商户背书。',
    highlights: ['银川夜市', '吴忠早茶', '中卫蒿子面与枸杞'], verifiedAt,
    days: [
      { day: 1, title: '银川：从博物馆到夜市', summary: '白天看城市文化，晚上集中尝小吃。', accommodation: '银川市区', meals: ['午餐：手抓羊肉', '晚餐：怀远观光夜市'], stops: [
        { time: '10:00', title: '宁夏博物馆', attractionId: 'ningxiamuseum', description: '先了解宁夏农牧、丝路和民族文化。' },
        { time: '16:00', title: '鼓楼—玉皇阁历史文化街区', attractionId: 'gulou-yuhuangge', description: '沿鼓楼、玉皇阁与周边街巷步行，南关清真大寺只作为现场允许时的外观顺路点。', tips: '公共街区可以弹性停留，宗教场所须服从现场管理。' },
        { time: '19:00', title: '怀远观光夜市', mapQuery: '银川怀远观光夜市', description: '分食多种小吃，避免一次点得过多。' },
      ], timeSlots: [
        { time: '10:00-12:30', location: '宁夏博物馆', description: '先了解宁夏农牧、丝路和民族文化，建立饮食文化背景。', tips: '提前确认闭馆日与停止入馆时间。' },
        { time: '16:00-18:30', location: '鼓楼—玉皇阁历史文化街区', description: '沿鼓楼、玉皇阁与周边街巷步行，南关清真大寺只作为现场允许时的外观顺路点。', tips: '宗教场所须服从现场管理。' },
        { time: '19:00-21:30', location: '怀远观光夜市', description: '分食多种小吃，避免一次点得过多。', tips: '节假日人流集中，看管好随身物品。' },
      ] },
      { day: 2, title: '吴忠：把早茶吃成一顿正餐', summary: '早出发，保留充足用餐时间。', accommodation: '吴忠或中卫', meals: ['早午餐：吴忠早茶', '晚餐：吴忠手抓或前往中卫'], stops: [
        { time: '09:00', title: '吴忠早茶文化体验', mapQuery: '吴忠早茶文化体验街', description: '尝试八宝茶、牛肉面、面点与羊杂等组合。', tips: '门店高峰期排队，选择明码标价的正规商户。' },
        { time: '14:00', title: '中华黄河楼', attractionId: 'zhonghuahuanghelou', description: '餐后沿黄河金岸活动；确认开放后再决定是否进入黄河楼。', tips: '当前运营信息待复核，可随时改为沿河散步或城市休息。' },
      ], timeSlots: [
        { time: '09:00-11:30', location: '吴忠早茶文化体验', description: '尝试八宝茶、牛肉面、面点与羊杂等组合，把早茶吃成一顿正餐。', tips: '门店高峰期排队，选择明码标价的正规商户。' },
        { time: '14:00-16:30', location: '中华黄河楼', description: '餐后沿黄河金岸活动；确认开放后再决定是否进入黄河楼。', tips: '当前运营信息待复核，可随时改为沿河散步或城市休息。' },
      ] },
      { day: 3, title: '中卫：沙漠城市的日常味道', summary: '市区慢游后返程。', accommodation: '无', meals: ['午餐：蒿子面', '伴手礼：正规渠道购买枸杞'], stops: [
        { time: '09:30', title: '中卫高庙与老城', attractionId: 'zhongweigaomiao', description: '从市区古建开始步行。' },
        { time: '12:00', title: '中卫市区午餐', mapQuery: '中卫市 蒿子面', description: '选择明厨亮灶、评价稳定的正规商户。' },
      ], timeSlots: [
        { time: '09:30-11:30', location: '中卫高庙与老城', description: '从市区古建开始步行，体验中卫老城日常。', tips: '先确认当日开放时间。' },
        { time: '12:00-14:00', location: '中卫市区午餐', description: '选择明厨亮灶、评价稳定的正规商户品尝蒿子面。', tips: '伴手礼枸杞请到正规渠道购买。' },
      ] },
    ],
  },
];

const routesById = new Map(routes.map((route) => [route.id, route]));
export const getRouteById = (id?: string) => id ? routesById.get(id) : undefined;
