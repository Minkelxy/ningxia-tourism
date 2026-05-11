import { useState, useEffect } from 'react';
import { Attraction } from '../types';
import { geoToSVG, coordinatesToPath, NINGXIA_BOUNDS } from '@/lib/utils';
import attractionsData from '../data/attractions.json';

interface NingxiaGeoJSONMapProps {
  onAttractionClick?: (attraction: Attraction) => void;
  selectedCity?: string | null;
  onCityClick?: (cityName: string) => void;
  filterType?: string;
}

const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;

export default function NingxiaGeoJSONMap({
  onAttractionClick,
  selectedCity,
  onCityClick,
  filterType = 'all'
}: NingxiaGeoJSONMapProps) {
  const [geoFeatures, setGeoFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredAttraction, setHoveredAttraction] = useState<string | null>(null);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    fetch(`${baseUrl}data/ningxia.geojson`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.text();
      })
      .then(text => {
        if (!text || text.trim().length === 0) {
          throw new Error('Empty response from server');
        }
        try {
          return JSON.parse(text);
        } catch {
          console.error('Failed to parse JSON:', text.substring(0, 100));
          throw new Error('Invalid JSON response');
        }
      })
      .then((data: any) => {
        if (data.type === 'FeatureCollection' && data.features) {
          setGeoFeatures(data.features);
        } else {
          setError('无效的GeoJSON格式');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load map data:', err);
        setError(err.message || '加载地图数据失败');
        setLoading(false);
      });
  }, []);

  const filteredAttractions = filterType === 'all' 
    ? attractionsData 
    : attractionsData.filter(a => a.type === filterType);

  const toSVG = (lng: number, lat: number) =>
    geoToSVG(lng, lat, NINGXIA_BOUNDS, SVG_WIDTH, SVG_HEIGHT);

  const toPath = (coords: number[][][]) =>
    coordinatesToPath(coords, NINGXIA_BOUNDS, SVG_WIDTH, SVG_HEIGHT);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载地图数据...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-600 text-center">
          <p className="text-xl font-bold mb-2">加载失败</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto max-w-full"
        style={{ maxHeight: 'calc(100vh - 200px)', minHeight: '300px' }}
      >
        <defs>
          <linearGradient id="sandGradientGeo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8DCC8" />
            <stop offset="100%" stopColor="#C4A35A" />
          </linearGradient>
          
          <linearGradient id="selectedGradientGeo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D5A4A" />
            <stop offset="100%" stopColor="#3D6B5A" />
          </linearGradient>

          <filter id="shadowGeo" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>

          <filter id="glowGeo">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="#F5F2EB" rx="20" />

        <g filter="url(#shadowGeo)">
          {geoFeatures.map((feature: any, index: number) => {
            const name = feature.properties?.name || feature.properties?.NAME || '未知';
            const cityId = feature.properties?.pinyin || name.toLowerCase();
            const cityFullName = feature.properties?.fullname || name;
            const center = feature.properties?.center;
            const isSelected = selectedCity === cityId;
            const isHovered = hoveredCity === cityId;

            const svgCenter = center ? toSVG(center[0], center[1]) : { x: 400, y: 300 };

            let pathD = '';
            if (feature.geometry?.type === 'Polygon') {
              pathD = toPath(feature.geometry.coordinates);
            } else if (feature.geometry?.type === 'MultiPolygon') {
              feature.geometry.coordinates.forEach((poly: number[][][]) => {
                pathD += toPath(poly) + ' ';
              });
            }

            return (
              <g key={`${cityId}-${index}`}>
                <path
                  d={pathD}
                  fill={isSelected ? 'url(#selectedGradientGeo)' : isHovered ? '#D4A857' : 'url(#sandGradientGeo)'}
                  stroke={isSelected ? '#2D5A4A' : '#B89B5D'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredCity(cityId)}
                  onMouseLeave={() => setHoveredCity(null)}
                  onClick={() => onCityClick?.(cityFullName)}
                />
                
                <text
                  x={svgCenter.x}
                  y={svgCenter.y}
                  textAnchor="middle"
                  className="text-sm font-serif font-bold fill-current pointer-events-none"
                  style={{ 
                    fill: isSelected ? '#FFFFFF' : '#1A1A1A',
                    fontSize: '13px',
                    fontWeight: 600,
                    textShadow: '1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  {cityFullName}
                </text>
              </g>
            );
          })}
        </g>

        {filteredAttractions.map((attraction, index) => {
          const isHovered = hoveredAttraction === attraction.id;
          const pos = toSVG(attraction.coordinates.lng, attraction.coordinates.lat);
          
          return (
            <g
              key={attraction.id}
              className="cursor-pointer"
              style={{ animation: `markerBounce 0.6s ease-out ${index * 100}ms` }}
              onMouseEnter={() => setHoveredAttraction(attraction.id)}
              onMouseLeave={() => setHoveredAttraction(null)}
              onClick={() => onAttractionClick?.(attraction as Attraction)}
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered ? 16 : 12}
                fill="#E85D4C"
                stroke="#FFFFFF"
                strokeWidth="3"
                filter={isHovered ? 'url(#glowGeo)' : undefined}
                className="transition-all duration-300"
              />
              
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                style={{ fill: '#FFFFFF', fontSize: '8px', fontWeight: 600 }}
              >
                •
              </text>

              {isHovered && (
                <g>
                  <rect
                    x={pos.x - 75}
                    y={pos.y - 80}
                    width="150"
                    height="70"
                    rx="8"
                    fill="#FFFFFF"
                    filter="url(#shadowGeo)"
                  />
                  
                  <text
                    x={pos.x}
                    y={pos.y - 55}
                    textAnchor="middle"
                    className="text-sm font-serif font-bold"
                    style={{ fill: '#1A1A1A', fontSize: '12px' }}
                  >
                    {attraction.name}
                  </text>
                  
                  <text
                    x={pos.x}
                    y={pos.y - 38}
                    textAnchor="middle"
                    className="text-xs"
                    style={{ fill: '#6B6B6B', fontSize: '9px' }}
                  >
                    {attraction.city}
                  </text>
                  
                  <text
                    x={pos.x}
                    y={pos.y - 22}
                    textAnchor="middle"
                    style={{ fill: '#C4A35A', fontSize: '10px' }}
                  >
                    ⭐ {attraction.rating}
                  </text>
                  
                  <text
                    x={pos.x}
                    y={pos.y - 8}
                    textAnchor="middle"
                    className="text-xs"
                    style={{ fill: '#6B6B6B', fontSize: '8px' }}
                  >
                    点击查看详情 →
                  </text>
                </g>
              )}
            </g>
          );
        })}

        <text x="400" y="585" textAnchor="middle" style={{ fill: '#6B6B6B', fontSize: '11px' }}>
          宁夏回族自治区 (GeoJSON) · 点击城市或景点探索
        </text>
      </svg>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 md:p-4 shadow-soft max-w-[200px] md:max-w-none">
        <h4 className="text-xs md:text-sm font-serif font-bold mb-2">图例说明</h4>
        <div className="space-y-1 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span>地级市区域</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent"></div>
            <span>景点位置</span>
          </div>
        </div>
      </div>
    </div>
  );
}
