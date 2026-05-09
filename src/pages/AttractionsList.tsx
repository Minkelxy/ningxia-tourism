import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star } from 'lucide-react';
import attractionsData from '../data/attractions.json';

interface Attraction {
  id: string;
  name: string;
  city: string;
  cityPinyin?: string;
  type: string;
  description: string;
  highlights: string[];
  images?: string[];
  rating?: number;
  coordinates?: { x: number; y: number };
}

const typeLabels: Record<string, { label: string; color: string }> = {
  nature: { label: '自然风光', color: 'bg-green-100 text-green-800' },
  history: { label: '历史文化', color: 'bg-amber-100 text-amber-800' },
  religion: { label: '宗教建筑', color: 'bg-purple-100 text-purple-800' },
  experience: { label: '特色体验', color: 'bg-blue-100 text-blue-800' },
};

export default function AttractionsList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const cities = Array.from(new Set(attractionsData.map(a => a.city)));

  const filteredAttractions = attractionsData.filter((attraction: Attraction) => {
    const matchesSearch = attraction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attraction.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || attraction.city === selectedCity;
    const matchesType = selectedType === 'all' || attraction.type === selectedType;
    return matchesSearch && matchesCity && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-serif font-bold text-text-primary mb-8 text-center">
          宁夏景点导览
        </h1>

        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          <div className="bg-white rounded-xl shadow-soft p-4">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="搜索景点名称或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-text-primary placeholder:text-text-secondary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">按城市筛选</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="all">全部城市</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">按类型筛选</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="all">全部类型</option>
                  <option value="nature">自然风光</option>
                  <option value="history">历史文化</option>
                  <option value="religion">宗教建筑</option>
                  <option value="experience">特色体验</option>
                </select>
              </div>
            </div>
          </div>

          <div className="text-center text-text-secondary">
            共找到 <span className="font-bold text-primary">{filteredAttractions.length}</span> 个景点
          </div>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAttractions.map((attraction: Attraction) => (
            <div
              key={attraction.id}
              onClick={() => navigate(`/attraction/${attraction.id}`)}
              className="bg-white rounded-xl shadow-soft overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-serif font-bold text-text-primary">
                    {attraction.name}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeLabels[attraction.type]?.color || 'bg-gray-100 text-gray-800'}`}>
                    {typeLabels[attraction.type]?.label || attraction.type}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{attraction.city}</span>
                </div>

                <p className="text-text-secondary text-sm line-clamp-3 mb-4">
                  {attraction.description}
                </p>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                    <Star className="w-4 h-4 text-primary" />
                    <span>特色亮点</span>
                  </div>
                  <ul className="text-xs text-text-secondary space-y-1 ml-6">
                    {attraction.highlights.slice(0, 3).map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary"></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAttractions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary text-lg">未找到符合条件的景点</p>
          </div>
        )}
      </div>
    </div>
  );
}
