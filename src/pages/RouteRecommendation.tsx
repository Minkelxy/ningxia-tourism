import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Sparkles, Calendar, Mountain, Landmark, Sun } from 'lucide-react';
import attractionsData from '../data/attractions.json';
import { Attraction } from '../types';

interface Route {
  id: string;
  name: string;
  theme: string;
  duration: string;
  budget: string;
  description: string;
  attractions: string[];
  highlights: string[];
  icon: any;
  gradient: string;
}

const routes: Route[] = [
  {
    id: 'desert-adventure',
    name: '沙漠探险之旅',
    theme: '沙漠体验',
    duration: '3-4天',
    budget: '2000-3000元/人',
    description: '深入腾格里沙漠，体验沙坡头的刺激项目，感受沙漠与黄河交织的壮丽景观',
    attractions: ['shapatou', 'zhongwei-gaomiao', 'hetaotan'],
    highlights: ['沙漠越野冲浪', '羊皮筏子漂流', '骑骆驼穿越沙海', '沙漠露营观星'],
    icon: Sun,
    gradient: 'from-orange-400 to-amber-500',
  },
  {
    id: 'culture-history',
    name: '西夏文化探秘',
    theme: '历史文化',
    duration: '2-3天',
    budget: '1500-2500元/人',
    description: '探索神秘的西夏王朝，从王陵到影城，穿越千年时光',
    attractions: ['xixia-wangling', 'zhenbeibu', 'suyukou', 'nanguan'],
    highlights: ['西夏王陵考古', '影视城角色扮演', '苏峪口森林氧吧', '清真寺建筑欣赏'],
    icon: Landmark,
    gradient: 'from-amber-500 to-yellow-500',
  },
  {
    id: 'nature-scenery',
    name: '塞上风光揽胜',
    theme: '自然生态',
    duration: '4-5天',
    budget: '3000-4000元/人',
    description: '从沙湖的沙漠碧波到六盘山的绿色林海，感受宁夏多样的自然风光',
    attractions: ['sah驴', 'mingcuihu', 'liupan', 'huangshagudu'],
    highlights: ['沙湖芦苇荡', '城市湿地公园', '六盘山红军路', '黄河古渡口'],
    icon: Mountain,
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'red-tourism',
    name: '红色记忆之旅',
    theme: '红色旅游',
    duration: '2-3天',
    budget: '1000-1500元/人',
    description: '沿着红军长征的足迹，重温革命历史，传承红色精神',
    attractions: ['liupan'],
    highlights: ['六盘山长征纪念馆', '红军小道徒步', '云海观景台', '生态屏障探秘'],
    icon: Calendar,
    gradient: 'from-red-500 to-rose-500',
  },
];

export default function RouteRecommendation() {
  const navigate = useNavigate();
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

  const getAttractionById = (id: string): Attraction | undefined => {
    return attractionsData.find(a => a.id === id) as Attraction | undefined;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4">
              精选路线推荐
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              根据不同主题和时长，为您精心规划宁夏之旅，发现最适合您的行程
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {routes.map((route, index) => {
              const IconComponent = route.icon;
              const routeAttractions = route.attractions.map(id => getAttractionById(id)).filter(Boolean) as Attraction[];
              
              return (
                <div
                  key={route.id}
                  className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className={`bg-gradient-to-r ${route.gradient} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-serif font-bold">{route.name}</h3>
                          <p className="text-white/80 text-sm">{route.theme}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{route.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{route.budget}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-text-secondary mb-4">{route.description}</p>

                    <div className="mb-4">
                      <h4 className="text-sm font-serif font-bold text-text-primary mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        路线亮点
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {route.highlights.map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-sm font-serif font-bold text-text-primary mb-3">
                        途经景点
                      </h4>
                      <div className="space-y-2">
                        {routeAttractions.map((attraction) => (
                          <div
                            key={attraction.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                            onClick={() => navigate(`/attraction/${attraction.id}`)}
                          >
                            <img
                              src={attraction.images[0]}
                              alt={attraction.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-text-primary mb-1">
                                {attraction.name}
                              </h5>
                              <p className="text-xs text-text-secondary line-clamp-1">
                                {attraction.description}
                              </p>
                            </div>
                            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedRoute(selectedRoute?.id === route.id ? null : route)}
                      className="w-full py-3 bg-primary text-white font-medium rounded-lg hover:bg-sand-dark transition-colors"
                    >
                      {selectedRoute?.id === route.id ? '收起详情' : '查看详细行程'}
                    </button>

                    {selectedRoute?.id === route.id && (
                      <div className="mt-4 p-4 bg-primary/5 rounded-lg animate-slide-up">
                        <h4 className="text-sm font-serif font-bold text-text-primary mb-3">
                          推荐行程安排
                        </h4>
                        <div className="space-y-2 text-sm text-text-secondary">
                          <p><strong>Day 1:</strong> 抵达银川，休整并适应环境</p>
                          <p><strong>Day 2:</strong> 前往{routeAttractions[0]?.city || '首站'}，游览{routeAttractions[0]?.name}</p>
                          {routeAttractions[1] && (
                            <p><strong>Day 3:</strong> 探索{routeAttractions[1]?.name}，深入体验</p>
                          )}
                          {routeAttractions[2] && (
                            <p><strong>Day 4:</strong> 前往{routeAttractions[2]?.name}，结束行程</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 bg-gradient-to-r from-secondary to-oasis rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">
              需要定制专属路线？
            </h2>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              根据您的偏好和时间，为您量身打造专属的宁夏之旅
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-white text-secondary font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              开始规划行程
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
