import { useState, useEffect } from 'react';
import * as topojson from 'topojson-client';
import { Star } from 'lucide-react';
import { Attraction } from '../types';
import attractionsData from '../data/attractions.json';

interface NingxiaTopoMapProps {
  onAttractionClick?: (attraction: Attraction) => void;
  selectedCity?: string | null;
  onCityClick?: (cityName: string) => void;
  filterType?: string;
}

export default function NingxiaTopoMap({
  onAttractionClick,
  selectedCity,
  onCityClick,
  filterType = 'all'
}: NingxiaTopoMapProps) {
  const [topoData, setTopoData] = useState<any>(null);
  const [geoFeatures, setGeoFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredAttraction, setHoveredAttraction] = useState<string | null>(null);

  useEffect(() => {
    fetch('/src/data/ningxia-full.topo.json')
      .then(res => res.json())
      .then((data: any) => {
        setTopoData(data);
        
        // 将TopoJSON转换为GeoJSON Features
        const object = data.objects.default;
        const features: any = topojson.feature(data, object);
        
        // features可能是Feature或FeatureCollection
        if (features.type === 'FeatureCollection') {
          setGeoFeatures(features.features || []);
        } else if (features.type === 'Feature') {
          setGeoFeatures([features]);
        } else {
          setGeoFeatures([]);
        }
        
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredAttractions = filterType === 'all' 
    ? attractionsData 
    : attractionsData.filter(a => a.type === filterType);

  // 将GeoJSON坐标转换为SVG路径
  const coordinatesToPath = (coords: number[][][]) => {
    if (!coords || !coords[0]) return '';
    
    const pathParts: string[] = [];
    
    const processRing = (ring: number[][]) => {
      if (!ring || ring.length === 0) return;
      
      const transformed = ring.map(coord => 
        geoToSVG(coord[0], coord[1])
      );
      
      pathParts.push(`M ${transformed[0].x} ${transformed[0].y}`);
      for (let i = 1; i < transformed.length; i++) {
        pathParts.push(`L ${transformed[i].x} ${transformed[i].y}`);
      }
      pathParts.push('Z');
    };
    
    // 处理外环
    if (coords[0]) {
      processRing(coords[0]);
    }
    
    // 处理内环（如果有）
    for (let i = 1; i < coords.length; i++) {
      if (coords[i]) {
        processRing(coords[i]);
      }
    }
    
    return pathParts.join(' ');
  };

  // 经纬度转SVG坐标
  const geoToSVG = (lng: number, lat: number) => {
    const minLng = 105.0;
    const maxLng = 106.9;
    const minLat = 35.3;
    const maxLat = 39.4;
    
    const width = 800;
    const height = 600;
    
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
    
    return { x, y };
  };

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
    <div className="relative w-full h-full">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-auto"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <defs>
          <linearGradient id="sandGradientTopo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8DCC8" />
            <stop offset="100%" stopColor="#C4A35A" />
          </linearGradient>
          
          <linearGradient id="selectedGradientTopo" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D5A4A" />
            <stop offset="100%" stopColor="#3D6B5A" />
          </linearGradient>

          <filter id="shadowTopo" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>

          <filter id="glowTopo">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect x="0" y="0" width="800" height="600" fill="#F5F2EB" rx="20" />

        <g filter="url(#shadowTopo)">
          {geoFeatures.map((feature: any) => {
            const name = feature.properties?.name || feature.properties?.NAME || '未知';
            const cityId = feature.properties?.pinyin || name.toLowerCase();
            const cityFullName = feature.properties?.fullname || name;
            const center = feature.properties?.center;
            const isSelected = selectedCity === cityId;
            const isHovered = hoveredCity === cityId;

            const svgCenter = center ? geoToSVG(center[0], center[1]) : { x: 400, y: 300 };

            let pathD = '';
            if (feature.geometry?.type === 'Polygon') {
              pathD = coordinatesToPath(feature.geometry.coordinates);
            } else if (feature.geometry?.type === 'MultiPolygon') {
              feature.geometry.coordinates.forEach((poly: number[][][]) => {
                pathD += coordinatesToPath(poly) + ' ';
              });
            }

            return (
              <g key={cityId}>
                <path
                  d={pathD}
                  fill={isSelected ? 'url(#selectedGradientTopo)' : isHovered ? '#D4A857' : 'url(#sandGradientTopo)'}
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
          const pos = geoToSVG(
            attraction.coordinates.x / 100 + 105.0, 
            attraction.coordinates.y / 100 + 35.3
          );
          
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
                filter={isHovered ? 'url(#glowTopo)' : undefined}
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
                    filter="url(#shadowTopo)"
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
                    className="text-xs flex items-center justify-center gap-1"
                    style={{ fill: '#C4A35A', fontSize: '10px' }}
                  >
                    <Star className="w-3 h-3 fill-current" />
                    {attraction.rating}
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
          宁夏回族自治区 (TopoJSON) · 点击城市或景点探索
        </text>
      </svg>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-soft">
        <h4 className="text-sm font-serif font-bold mb-2">图例说明</h4>
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
