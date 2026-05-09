import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  DollarSign, 
  Car, 
  Calendar,
  Share2,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import attractionsData from '../data/attractions.json';
import { Attraction } from '../types';

export default function AttractionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const attraction = attractionsData.find(a => a.id === id) as Attraction | undefined;

  if (!attraction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold text-text-primary mb-4">
            景点未找到
          </h1>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const nearbyAttractions = attractionsData.filter(a => 
    attraction.nearbyAttractions.includes(a.id)
  );

  const typeLabels = {
    nature: '自然风光',
    history: '历史文化',
    religion: '宗教建筑',
    experience: '特色体验',
  };

  const typeColors = {
    nature: 'bg-green-100 text-green-700',
    history: 'bg-amber-100 text-amber-700',
    religion: 'bg-purple-100 text-purple-700',
    experience: 'bg-blue-100 text-blue-700',
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === attraction.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? attraction.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative">
        <div 
          className="h-[50vh] md:h-[60vh] relative cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img
            src={attraction.images[currentImageIndex]}
            alt={attraction.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('/');
            }}
            className="absolute top-6 left-4 md:left-8 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors shadow-soft z-10"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>

          <div className="absolute top-6 right-4 md:right-8 flex gap-2 z-10">
            <button className="bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white transition-colors shadow-soft">
              <Share2 className="w-5 h-5 text-text-primary" />
            </button>
          </div>

          <div className="absolute bottom-8 left-4 md:left-8 right-4 md:right-8">
            <div className="flex items-center gap-3 mb-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${typeColors[attraction.type]}`}>
                {typeLabels[attraction.type]}
              </span>
              <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1.5">
                <Star className="w-5 h-5 text-primary fill-current" />
                <span className="text-lg font-bold text-primary">{attraction.rating}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2">
              {attraction.name}
            </h1>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{attraction.city}</span>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 flex gap-2 z-10">
            <button
              onClick={prevImage}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-soft"
            >
              <ChevronLeft className="w-5 h-5 text-text-primary" />
            </button>
            <button
              onClick={nextImage}
              className="bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors shadow-soft"
            >
              <ChevronRight className="w-5 h-5 text-text-primary" />
            </button>
          </div>
        </div>

        {isLightboxOpen && (
          <div 
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            <img
              src={attraction.images[currentImageIndex]}
              alt={attraction.name}
              className="max-w-[90vw] max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
            
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
              {attraction.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-2xl font-serif font-bold text-text-primary mb-4">
                景点介绍
              </h2>
              <p className="text-text-secondary leading-relaxed text-base">
                {attraction.description}
              </p>
            </section>

            <section className="bg-white rounded-xl p-6 shadow-soft">
              <h2 className="text-2xl font-serif font-bold text-text-primary mb-4">
                游览亮点
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {attraction.highlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-primary/5 to-transparent rounded-lg"
                  >
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-text-secondary">{highlight}</p>
                  </div>
                ))}
              </div>
            </section>

            {nearbyAttractions.length > 0 && (
              <section className="bg-white rounded-xl p-6 shadow-soft">
                <h2 className="text-2xl font-serif font-bold text-text-primary mb-4">
                  周边推荐
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {nearbyAttractions.map((nearby) => (
                    <div 
                      key={nearby.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => navigate(`/attraction/${nearby.id}`)}
                    >
                      <img
                        src={nearby.images[0]}
                        alt={nearby.name}
                        className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif font-bold text-text-primary mb-1">
                          {nearby.name}
                        </h3>
                        <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                          {nearby.description}
                        </p>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="w-4 h-4 text-primary fill-current" />
                          <span className="text-primary font-medium">{nearby.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-soft">
                <h3 className="text-lg font-serif font-bold text-text-primary mb-4">
                  实用信息
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-1">开放时间</p>
                      <p className="text-text-primary font-medium">{attraction.openingHours}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-1">门票价格</p>
                      <p className="text-text-primary font-medium">{attraction.ticketPrice}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-1">最佳季节</p>
                      <p className="text-text-primary font-medium">{attraction.bestSeason}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Car className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-text-secondary mb-1">交通指南</p>
                      <p className="text-text-primary font-medium">{attraction.transportation}</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/')}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <MapPin className="w-5 h-5" />
                查看更多景点
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
