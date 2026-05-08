import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Clock, DollarSign } from 'lucide-react';
import { Attraction } from '../types';

interface AttractionCardProps {
  attraction: Attraction;
  variant?: 'default' | 'compact' | 'featured';
}

export default function AttractionCard({ 
  attraction, 
  variant = 'default' 
}: AttractionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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

  if (variant === 'compact') {
    return (
      <Link
        to={`/attraction/${attraction.id}`}
        className="block bg-white rounded-lg p-3 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex gap-3">
          <img
            src={attraction.images[0]}
            alt={attraction.name}
            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-serif font-bold text-text-primary truncate mb-1">
              {attraction.name}
            </h3>
            <div className="flex items-center gap-1 text-xs text-text-secondary mb-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{attraction.city}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Star className="w-3 h-3 text-primary fill-current" />
              <span className="text-primary font-medium">{attraction.rating}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link
        to={`/attraction/${attraction.id}`}
        className="block group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative overflow-hidden rounded-xl shadow-soft group-hover:shadow-medium transition-all duration-300">
          <img
            src={attraction.images[0]}
            alt={attraction.name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[attraction.type]}`}>
              {typeLabels[attraction.type]}
            </span>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-lg font-serif font-bold text-white mb-1">
              {attraction.name}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-200">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {attraction.city}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-primary fill-current" />
                {attraction.rating}
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={`/attraction/${attraction.id}`}
      className="block bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={attraction.images[0]}
          alt={attraction.name}
          className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${typeColors[attraction.type]}`}>
            {typeLabels[attraction.type]}
          </span>
        </div>
        
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 flex items-center gap-1 shadow-soft">
            <Star className="w-4 h-4 text-primary fill-current" />
            <span className="text-sm font-bold text-primary">{attraction.rating}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-serif font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
          {attraction.name}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{attraction.city}</span>
        </div>

        <p className="text-sm text-text-secondary line-clamp-2 mb-4">
          {attraction.description}
        </p>

        <div className="flex items-center justify-between text-xs text-text-secondary border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="truncate">{attraction.openingHours.split('（')[0]}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span>{attraction.ticketPrice.split('，')[0]}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
