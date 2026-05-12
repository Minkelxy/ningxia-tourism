import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, DollarSign, Sparkles, Calendar, Mountain, Landmark, Sun,
  Utensils, Home, Bus, Star, ChevronRight, Info, Coffee, Camera
} from 'lucide-react';
import attractionsData from '../data/attractions.json';
import { Attraction } from '../types';

interface DayPlan {
  day: number;
  title: string;
  activities: {
    time: string;
    location: string;
    description: string;
    tips?: string;
  }[];
  accommodation?: string;
  meals?: string[];
}

interface RouteDisplay {
  id: string;
  name: string;
  theme: string;
  duration: string;
  durationDays: number;
  budget: string;
  description: string;
  attractions: string[];
  highlights: string[];
  dayPlans: DayPlan[];
  icon: any;
  gradient: string;
  bestSeason: string;
}

const routes: RouteDisplay[] = [
  {
    id: 'quick-1day',
    name: '银川精华一日游',
    theme: '精华速览',
    duration: '1天',
    durationDays: 1,
    budget: '500-800元/人',
    description: '适合时间紧迫的商务人士或中转游客，涵盖银川最精华的历史文化景点',
    attractions: ['ningxiamuseum', 'xixiawangling', 'zhenbeibu'],
    highlights: ['宁夏博物馆', '西夏王陵', '镇北堡影城'],
    bestSeason: '全年适宜',
    icon: Sun,
    gradient: 'from-amber-400 to-orange-500',
    dayPlans: [
      {
        day: 1,
        title: '银川精华一日',
        activities: [
          { time: '08:00-10:30', location: '宁夏博物馆', description: '了解宁夏历史文化，免费参观', tips: '建议先看博物馆了解背景知识' },
          { time: '11:00-14:00', location: '西夏王陵', description: '东方金字塔，探索西夏王朝历史', tips: '门票85元+电瓶车20元，建议请讲解员' },
          { time: '14:30-18:30', location: '镇北堡西部影城', description: '大话西游取景地，体验影视文化', tips: '穿古装拍照更出片，门票80元' },
          { time: '19:00', location: '怀远观光夜市', description: '品尝辣糊糊、羊杂碎等银川美食', tips: '晚上逛夜市，体验当地烟火气' }
        ],
        meals: ['早餐: 酒店', '午餐: 西夏王陵附近', '晚餐: 怀远夜市'],
        accommodation: '银川市区'
      }
    ]
  },
  {
    id: 'weekend-2day',
    name: '塞上江南周末游',
    theme: '精华周末',
    duration: '2天',
    durationDays: 2,
    budget: '1000-1500元/人',
    description: '周末短途旅行，兼顾历史文化与自然风光，感受塞上江南的独特魅力',
    attractions: ['xixiawangling', 'zhenbeibu', 'shahu', 'ningxiamuseum'],
    highlights: ['西夏王陵', '镇北堡影城', '沙湖', '宁夏博物馆'],
    bestSeason: '4-10月最佳',
    icon: Calendar,
    gradient: 'from-blue-400 to-cyan-500',
    dayPlans: [
      {
        day: 1,
        title: '西夏文化探秘',
        activities: [
          { time: '08:00-11:00', location: '西夏王陵', description: '东方金字塔，探索神秘西夏王朝', tips: '建议先参观博物馆了解历史' },
          { time: '11:30-14:00', location: '镇北堡西部影城', description: '体验影视文化，大话西游取景地', tips: '清城+明城+老银川街，建议4小时' },
          { time: '15:00-17:00', location: '贺兰山岩画', description: '远古艺术画廊，太阳神岩画', tips: '距市区约50公里，请讲解员' },
          { time: '18:30', location: '银川市区', description: '入住酒店，逛怀远夜市', tips: '推荐辣糊糊、羊杂碎' }
        ],
        meals: ['早餐: 酒店', '午餐: 影城附近', '晚餐: 怀远夜市'],
        accommodation: '银川市区'
      },
      {
        day: 2,
        title: '沙湖生态之旅',
        activities: [
          { time: '08:00-10:00', location: '出发前往沙湖', description: '车程约1小时', tips: '建议早出发避开人流' },
          { time: '10:00-15:00', location: '沙湖景区', description: '沙漠与湖泊共存，乘船游湖、骑骆驼、观鸟', tips: '门票+船票120元，建议5小时' },
          { time: '15:30-17:30', location: '宁夏博物馆', description: '馆藏文物，回族文化', tips: '免费预约，4点停止入馆' },
          { time: '18:00', location: '返程', description: '结束行程', tips: '根据返程时间安排' }
        ],
        meals: ['早餐: 酒店', '午餐: 沙湖景区', '晚餐: 银川市区'],
        accommodation: '无住宿'
      }
    ]
  },
  {
    id: 'classic-3day',
    name: '经典3日全景游',
    theme: '经典全景',
    duration: '3天',
    durationDays: 3,
    budget: '2000-3000元/人',
    description: '银川+中卫黄金组合，沙漠、黄河、西夏文化全覆盖，经典宁夏之旅',
    attractions: ['xixiawangling', 'zhenbeibu', 'shapotou', 'zhongweigaomiao'],
    highlights: ['西夏王陵', '镇北堡影城', '沙坡头', '中卫高庙'],
    bestSeason: '5-10月最佳',
    icon: Mountain,
    gradient: 'from-emerald-500 to-teal-500',
    dayPlans: [
      {
        day: 1,
        title: '银川历史文化',
        activities: [
          { time: '08:00-11:00', location: '西夏王陵', description: '东方金字塔，西夏王朝皇家陵寝', tips: '门票85元+电瓶车20元' },
          { time: '11:30-15:30', location: '镇北堡西部影城', description: '中国西部影视城，大话西游拍摄地', tips: '门票80元，建议4小时' },
          { time: '16:00-18:00', location: '宁夏博物馆', description: '回族文化，历史文物', tips: '免费，需预约' },
          { time: '19:00', location: '怀远夜市', description: '银川美食天堂', tips: '辣糊糊必吃' }
        ],
        meals: ['早餐: 酒店', '午餐: 影城附近', '晚餐: 怀远夜市'],
        accommodation: '银川市区'
      },
      {
        day: 2,
        title: '沙坡头沙漠奇观',
        activities: [
          { time: '07:00-09:00', location: '银川-中卫', description: '高铁1.5小时或包车2.5小时', tips: '建议早出发' },
          { time: '09:30-15:30', location: '沙坡头景区', description: '沙漠与黄河交织，骑骆驼、飞索、羊皮筏子', tips: '门票80元+项目套票约280元，建议6小时' },
          { time: '16:00-17:30', location: '中卫高庙', description: '保安寺，古建筑群', tips: '免费参观' },
          { time: '18:00', location: '中卫市区/沙漠营地', description: '入住酒店或沙漠帐篷', tips: '沙漠露营可看星空' }
        ],
        meals: ['早餐: 酒店', '午餐: 沙坡头', '晚餐: 中卫市区'],
        accommodation: '中卫市区或沙漠帐篷'
      },
      {
        day: 3,
        title: '黄河文化与返程',
        activities: [
          { time: '08:00-10:00', location: '金沙海/66号公路', description: '沙漠火车酒店，网红打卡', tips: '适合拍照' },
          { time: '10:30-13:00', location: '中卫市区', description: '鼓楼，高庙保安寺', tips: '自由活动购物' },
          { time: '13:00-15:00', location: '返程', description: '中卫-银川高铁', tips: '下午返回银川' }
        ],
        meals: ['早餐: 酒店', '午餐: 中卫市区', '晚餐: 银川'],
        accommodation: '无住宿'
      }
    ]
  },
  {
    id: 'in-depth-4day',
    name: '深度4日全景游',
    theme: '深度全景',
    duration: '4天',
    durationDays: 4,
    budget: '3000-4000元/人',
    description: '银川+中卫+青铜峡全景覆盖，沙漠、黄河、西夏文化、回族风情全收录',
    attractions: ['xixiawangling', 'zhenbeibu', 'shahu', 'shapotou', 'huanghetan'],
    highlights: ['西夏王陵', '沙湖', '沙坡头', '黄河坛', '一百零八塔'],
    bestSeason: '5-10月最佳',
    icon: Landmark,
    gradient: 'from-purple-500 to-pink-500',
    dayPlans: [
      {
        day: 1,
        title: '银川初印象',
        activities: [
          { time: '全天', location: '银川市区', description: '抵达银川，休整适应', tips: '可逛南关清真寺、玉皇阁' },
          { time: '18:00', location: '怀远夜市', description: '银川美食初体验', tips: '辣糊糊、羊杂碎必吃' }
        ],
        meals: ['早餐: 自理', '午餐: 银川', '晚餐: 怀远夜市'],
        accommodation: '银川市区'
      },
      {
        day: 2,
        title: '西夏文化之旅',
        activities: [
          { time: '08:00-11:00', location: '西夏王陵', description: '东方金字塔，9座帝陵', tips: '建议请讲解员' },
          { time: '11:30-15:30', location: '镇北堡西部影城', description: '大话西游取景地', tips: '穿古装拍照' },
          { time: '16:00-18:00', location: '贺兰山岩画', description: '太阳神岩画', tips: '距市区50公里' }
        ],
        meals: ['早餐: 酒店', '午餐: 影城附近', '晚餐: 银川'],
        accommodation: '银川市区'
      },
      {
        day: 3,
        title: '沙湖与青铜峡',
        activities: [
          { time: '08:00-10:00', location: '沙湖景区', description: '沙漠湖泊，乘船、骑骆驼、观鸟', tips: '建议早出发' },
          { time: '11:00-14:00', location: '黄河坛', description: '黄河文化展示', tips: '了解黄河文明' },
          { time: '14:30-17:00', location: '一百零八塔', description: '古塔群，黄河风光', tips: '游船游览更佳' },
          { time: '17:30', location: '前往中卫', description: '银川-中卫高铁', tips: '1.5小时' }
        ],
        meals: ['早餐: 酒店', '午餐: 青铜峡', '晚餐: 中卫市区'],
        accommodation: '中卫市区'
      },
      {
        day: 4,
        title: '沙坡头沙漠狂欢',
        activities: [
          { time: '全天', location: '沙坡头景区', description: '沙漠项目全覆盖', tips: '门票80元+项目套票约280元' },
          { time: '下午', location: '返程', description: '返回银川/中卫', tips: '根据行程安排' }
        ],
        meals: ['早餐: 酒店', '午餐: 沙坡头', '晚餐: 自理'],
        accommodation: '无住宿'
      }
    ]
  },
  {
    id: 'luxury-5day',
    name: '5日全景深度游',
    theme: '全景深度',
    duration: '5天',
    durationDays: 5,
    budget: '4000-6000元/人',
    description: '银川+中卫+吴忠全景深度，精选景点搭配特色美食，体验最完整的宁夏',
    attractions: ['xixiawangling', 'zhenbeibu', 'shahu', 'shapotou', 'huanghetan', 'zhonghuahuanghelou'],
    highlights: ['西夏王陵', '沙湖', '沙坡头', '黄河坛', '中华黄河楼', '一百零八塔'],
    bestSeason: '5-10月最佳',
    icon: Star,
    gradient: 'from-rose-500 to-red-500',
    dayPlans: [
      {
        day: 1,
        title: '抵达银川',
        activities: [
          { time: '全天', location: '银川市区', description: '抵达银川，入住酒店', tips: '可逛南关清真寺' },
          { time: '18:00', location: '怀远夜市', description: '美食初体验' }
        ],
        meals: ['早餐: 自理', '午餐: 自理', '晚餐: 怀远夜市'],
        accommodation: '银川市区'
      },
      {
        day: 2,
        title: '西夏文化深度',
        activities: [
          { time: '08:00-11:00', location: '西夏王陵', description: '东方金字塔', tips: '建议请讲解' },
          { time: '11:30-15:30', location: '镇北堡西部影城', description: '影视文化', tips: '4小时' },
          { time: '16:00-18:00', location: '宁夏博物馆', description: '历史文化' }
        ],
        meals: ['早餐: 酒店', '午餐: 影城', '晚餐: 银川'],
        accommodation: '银川市区'
      },
      {
        day: 3,
        title: '沙湖与青铜峡',
        activities: [
          { time: '08:00-12:00', location: '沙湖景区', description: '沙漠湖泊', tips: '5小时' },
          { time: '13:00-17:00', location: '黄河坛+一百零八塔', description: '黄河文化' },
          { time: '17:30', location: '前往中卫', description: '高铁' }
        ],
        meals: ['早餐: 酒店', '午餐: 青铜峡', '晚餐: 中卫'],
        accommodation: '中卫市区'
      },
      {
        day: 4,
        title: '沙坡头全天',
        activities: [
          { time: '全天', location: '沙坡头', description: '沙漠项目', tips: '6小时' },
          { time: '晚上', location: '沙漠营地', description: '星空露营', tips: '篝火晚会' }
        ],
        meals: ['早餐: 酒店', '午餐: 沙坡头', '晚餐: 沙漠营地'],
        accommodation: '沙漠帐篷'
      },
      {
        day: 5,
        title: '吴忠美食之旅',
        activities: [
          { time: '08:00-10:00', location: '中卫-吴忠', description: '高铁40分钟' },
          { time: '10:30-13:00', location: '中华黄河楼', description: '黄河金岸标志' },
          { time: '13:00-15:00', location: '吴忠早茶', description: '手抓羊肉+八宝茶', tips: '国强手抓' },
          { time: '下午', location: '返程', description: '吴忠-银川' }
        ],
        meals: ['早餐: 酒店', '午餐: 吴忠早茶', '晚餐: 自理'],
        accommodation: '无住宿'
      }
    ]
  },
  {
    id: 'red-culture',
    name: '红色文化之旅',
    theme: '红色旅游',
    duration: '2-3天',
    durationDays: 3,
    budget: '1000-1500元/人',
    description: '沿着红军长征的足迹，重温革命历史，接受爱国主义教育',
    attractions: ['liupanshan', 'pengyangtitian', 'yanchilie'],
    highlights: ['六盘山', '彭阳梯田', '盐池革命烈士纪念园'],
    bestSeason: '4-10月最佳',
    icon: Camera,
    gradient: 'from-red-600 to-rose-600',
    dayPlans: [
      {
        day: 1,
        title: '六盘山长征之路',
        activities: [
          { time: '全天', location: '银川/固原', description: '出发前往固原' },
          { time: '下午', location: '六盘山国家森林公园', description: '红军长征纪念馆，小南川', tips: '门票65元，建议4小时' }
        ],
        meals: ['早餐: 酒店', '午餐: 固原', '晚餐: 固原'],
        accommodation: '固原市区'
      },
      {
        day: 2,
        title: '彭阳梯田风光',
        activities: [
          { time: '全天', location: '彭阳县', description: '金鸡坪梯田，层层叠叠的彩色田野', tips: '摄影胜地' }
        ],
        meals: ['早餐: 酒店', '午餐: 彭阳', '晚餐: 彭阳/固原'],
        accommodation: '固原市区'
      },
      {
        day: 3,
        title: '盐池红色记忆',
        activities: [
          { time: '上午', location: '盐池县', description: '革命烈士纪念园', tips: '全国红色旅游经典景区' },
          { time: '下午', location: '返程', description: '返回银川' }
        ],
        meals: ['早餐: 酒店', '午餐: 盐池', '晚餐: 自理'],
        accommodation: '无住宿'
      }
    ]
  },
  {
    id: 'foodie-3day',
    name: '宁夏美食之旅',
    theme: '美食探索',
    duration: '3天',
    durationDays: 3,
    budget: '1500-2500元/人',
    description: '以美食为主线，串联宁夏各地特色美食，体验回族饮食文化',
    attractions: ['ningxiamuseum', 'zhonghuahuanghelou', 'nanguan'],
    highlights: ['手抓羊肉', '辣糊糊', '八宝茶', '羊杂碎', '油香'],
    bestSeason: '全年适宜',
    icon: Utensils,
    gradient: 'from-yellow-500 to-orange-500',
    dayPlans: [
      {
        day: 1,
        title: '银川美食探秘',
        activities: [
          { time: '上午', location: '宁夏博物馆', description: '了解宁夏历史文化' },
          { time: '午餐', location: '手抓羊肉', description: '推荐老毛手抓/国强手抓', tips: '必吃盐池滩羊' },
          { time: '下午', location: '南关清真寺', description: '伊斯兰建筑' },
          { time: '晚餐', location: '怀远夜市', description: '辣糊糊、羊杂碎、蒿子面', tips: '银川夜市必吃' }
        ],
        meals: ['早餐: 酒店', '午餐: 手抓羊肉', '晚餐: 怀远夜市'],
        accommodation: '银川市区'
      },
      {
        day: 2,
        title: '中卫风味',
        activities: [
          { time: '上午', location: '前往中卫', description: '高铁或包车' },
          { time: '午餐', location: '中卫蒿子面', description: '非遗美食', tips: '细如发丝的面条' },
          { time: '下午', location: '沙坡头', description: '沙漠体验' },
          { time: '晚餐', location: '中卫夜市', description: '烧烤、砂锅' }
        ],
        meals: ['早餐: 酒店', '午餐: 蒿子面', '晚餐: 中卫夜市'],
        accommodation: '中卫市区'
      },
      {
        day: 3,
        title: '吴忠早茶文化',
        activities: [
          { time: '上午', location: '中卫-吴忠', description: '高铁40分钟' },
          { time: '早茶', location: '吴忠早茶', description: '手抓+八宝茶+油香+馓子', tips: '国强手抓旗舰店' },
          { time: '下午', location: '中华黄河楼', description: '黄河金岸标志' },
          { time: '傍晚', location: '返程', description: '返回银川' }
        ],
        meals: ['早餐: 酒店', '午餐: 吴忠早茶', '晚餐: 自理'],
        accommodation: '无住宿'
      }
    ]
  }
];

export default function RouteRecommendation() {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [durationFilter, setDurationFilter] = useState<string>('all');

  const getAttractionById = (id: string): Attraction | undefined => {
    return attractionsData.find(a => a.id === id) as Attraction | undefined;
  };

  const filteredRoutes = routes.filter(route => {
    const durationMatch = durationFilter === 'all' || 
      (durationFilter === '1day' && route.durationDays === 1) ||
      (durationFilter === '2day' && route.durationDays === 2) ||
      (durationFilter === '3day' && route.durationDays === 3) ||
      (durationFilter === '4day' && route.durationDays >= 4);
    return durationMatch;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-text-primary mb-3 md:mb-4">
              精选路线推荐
            </h1>
            <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto px-2">
              根据不同主题和时长，为您精心规划宁夏之旅，发现最适合您的行程
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6 md:mb-8">
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => setDurationFilter('all')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  durationFilter === 'all'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary hover:bg-primary/10'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setDurationFilter('1day')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  durationFilter === '1day'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary hover:bg-primary/10'
                }`}
              >
                1日
              </button>
              <button
                onClick={() => setDurationFilter('2day')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  durationFilter === '2day'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary hover:bg-primary/10'
                }`}
              >
                2日
              </button>
              <button
                onClick={() => setDurationFilter('3day')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  durationFilter === '3day'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary hover:bg-primary/10'
                }`}
              >
                3日
              </button>
              <button
                onClick={() => setDurationFilter('4day')}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  durationFilter === '4day'
                    ? 'bg-primary text-white'
                    : 'bg-white text-text-secondary hover:bg-primary/10'
                }`}
              >
                4日+
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
            {filteredRoutes.map((route, index) => {
              const IconComponent = route.icon;
              const routeAttractions = route.attractions.map(id => getAttractionById(id)).filter(Boolean) as Attraction[];
              const isExpanded = selectedRoute === route.id;
              
              return (
                <div
                  key={route.id}
                  className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`bg-gradient-to-r ${route.gradient} p-4 md:p-6 text-white`}>
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm rounded-lg md:rounded-xl flex items-center justify-center">
                          <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-serif font-bold">{route.name}</h3>
                          <p className="text-white/80 text-xs md:text-sm">{route.theme}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 md:px-3 md:py-1 bg-white/20 rounded-full text-xs md:text-sm">
                        {route.duration}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 md:gap-3 text-xs md:text-sm">
                      <div className="flex items-center gap-1 md:gap-2">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{route.duration}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="truncate text-xs">{route.budget.split('/')[0]}</span>
                      </div>
                      <div className="flex items-center gap-1 md:gap-2">
                        <Sun className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{route.bestSeason}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <p className="text-text-secondary text-sm mb-3 md:mb-4 line-clamp-2">{route.description}</p>

                    <div className="mb-3 md:mb-4">
                      <h4 className="text-xs md:text-sm font-serif font-bold text-text-primary mb-2 flex items-center gap-2">
                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                        途经景点
                      </h4>
                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {routeAttractions.slice(0, 3).map((attraction) => (
                          <span
                            key={attraction.id}
                            onClick={() => navigate(`/attraction/${attraction.id}`)}
                            className="px-2 py-1 md:px-3 md:py-1 bg-primary/10 text-primary text-xs rounded-full cursor-pointer hover:bg-primary/20 transition-colors"
                          >
                            {attraction.name}
                          </span>
                        ))}
                        {routeAttractions.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{routeAttractions.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedRoute(isExpanded ? null : route.id)}
                      className="w-full py-2.5 md:py-3 bg-primary text-white font-medium rounded-lg hover:bg-sand-dark transition-colors flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                      {isExpanded ? '收起详情' : '查看详细行程'}
                      <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-3 md:space-y-4 animate-slide-up">
                        {route.dayPlans.map((dayPlan) => (
                          <div key={dayPlan.day} className="border border-gray-100 rounded-lg p-3 md:p-4">
                            <div className="flex items-center gap-2 mb-2 md:mb-3">
                              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-primary font-bold text-xs md:text-sm">D{dayPlan.day}</span>
                              </div>
                              <h5 className="font-serif font-bold text-sm md:text-base text-text-primary">{dayPlan.title}</h5>
                            </div>
                            
                            <div className="space-y-2 md:space-y-3 mb-2 md:mb-3">
                              {dayPlan.activities.map((activity, idx) => (
                                <div key={idx} className="flex gap-2 md:gap-3">
                                  <div className="flex-shrink-0 w-16 md:w-20 text-xs text-primary font-medium">
                                    {activity.time}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs md:text-sm font-medium text-text-primary truncate">{activity.location}</p>
                                    <p className="text-xs text-text-secondary line-clamp-2">{activity.description}</p>
                                    {activity.tips && (
                                      <p className="text-xs text-amber-600 mt-0.5 md:mt-1">💡 {activity.tips}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {dayPlan.meals && (
                              <div className="flex items-center gap-1.5 md:gap-2 text-xs text-text-secondary mb-1.5 md:mb-2">
                                <Utensils className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                <span className="truncate">{dayPlan.meals.join(' → ')}</span>
                              </div>
                            )}

                            {dayPlan.accommodation && dayPlan.day < route.durationDays && (
                              <div className="flex items-center gap-1.5 md:gap-2 text-xs text-text-secondary">
                                <Home className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                                <span>住宿: {dayPlan.accommodation}</span>
                              </div>
                            )}
                          </div>
                        ))}

                        <button
                          onClick={() => navigate(`/attraction/${routeAttractions[0]?.id}`)}
                          className="w-full py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors text-xs md:text-sm"
                        >
                          从{routeAttractions[0]?.name}开始规划
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 md:mt-16 bg-gradient-to-r from-secondary to-oasis rounded-xl md:rounded-2xl p-6 md:p-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-xl md:text-3xl font-serif font-bold mb-3 md:mb-4">
                需要定制专属路线？
              </h2>
              <p className="text-white/90 mb-4 md:mb-6 text-sm md:text-base">
                根据您的偏好和时间，为您量身打造专属的宁夏之旅
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 md:px-6 md:py-3 bg-white text-secondary font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg text-sm md:text-base"
                >
                  查看景点地图
                </button>
                <button
                  onClick={() => navigate('/attractions')}
                  className="px-4 py-2 md:px-6 md:py-3 bg-white/20 backdrop-blur-sm text-white font-bold rounded-lg hover:bg-white/30 transition-colors border border-white/30 text-sm md:text-base"
                >
                  浏览全部景点
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 bg-white rounded-xl p-4 md:p-6 shadow-soft">
            <h3 className="text-base md:text-lg font-serif font-bold text-text-primary mb-3 md:mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              旅行小贴士
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Sun className="w-4 h-4 md:w-5 md:h-5 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-1 text-sm md:text-base">最佳时间</h4>
                  <p className="text-xs md:text-sm text-text-secondary">5-6月天气凉爽，9-10月秋高气爽</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Bus className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-1 text-sm md:text-base">交通建议</h4>
                  <p className="text-xs md:text-sm text-text-secondary">区内高铁便捷，银川到中卫约1.5小时</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-text-primary mb-1 text-sm md:text-base">美食推荐</h4>
                  <p className="text-xs md:text-sm text-text-secondary">盐池滩羊、辣糊糊、羊杂碎</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
