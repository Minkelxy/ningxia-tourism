import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Expand, Utensils, Calendar, Sparkles } from 'lucide-react';
import citiesData from '../data/cities.json';
import attractionsData from '../data/attractions.json';
import { City } from '../types';

export default function CityOverview() {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const getCityAttractions = (cityName: string) => {
    return attractionsData.filter(a => a.city.includes(cityName));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-text-primary mb-4">
              塞上江南·城市概览
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              探索宁夏五座城市的独特魅力，感受塞上江南的多彩风情
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {citiesData.map((city, index) => {
              const attractions = getCityAttractions(city.name);
              const isSelected = selectedCity?.id === city.id;
              
              return (
                <div
                  key={city.id}
                  className={`bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedCity(isSelected ? null : city as City)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-serif font-bold text-white mb-1">
                        {city.name}
                      </h3>
                      <p className="text-white/90 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {city.nickname}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{city.population}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-secondary">
                        <Expand className="w-4 h-4 text-primary" />
                        <span>{city.area}</span>
                      </div>
                    </div>

                    <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                      {city.introduction}
                    </p>

                    {isSelected && (
                      <div className="space-y-4 animate-slide-up">
                        <div>
                          <h4 className="text-sm font-serif font-bold text-text-primary mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            特色文化
                          </h4>
                          <p className="text-sm text-text-secondary">{city.culture}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-serif font-bold text-text-primary mb-2 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            最佳季节
                          </h4>
                          <p className="text-sm text-text-secondary">{city.bestSeason}</p>
                        </div>

                        <div>
                          <h4 className="text-sm font-serif font-bold text-text-primary mb-2 flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-primary" />
                            代表美食
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {city.foods.slice(0, 3).map((food, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full"
                              >
                                {food}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-serif font-bold text-text-primary mb-2">
                            热门景点 ({attractions.length})
                          </h4>
                          <div className="space-y-2">
                            {attractions.slice(0, 3).map((attraction) => (
                              <div
                                key={attraction.id}
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/attraction/${attraction.id}`);
                                }}
                              >
                                <img
                                  src={attraction.images[0]}
                                  alt={attraction.name}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-text-primary truncate">
                                    {attraction.name}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      className="w-full mt-4 py-2 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/city/${city.pinyin}`);
                      }}
                    >
                      查看完整介绍 →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-secondary to-oasis rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">
              开启您的宁夏之旅
            </h2>
            <p className="text-white/90 mb-8">
              无论是探索历史文化、体验沙漠风情，还是感受回族文化，宁夏都能满足您的期待
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 bg-white text-secondary font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              探索交互式地图
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
