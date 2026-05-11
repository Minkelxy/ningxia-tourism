import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { geoToSVG, coordinatesToPath, NINGXIA_BOUNDS } from '@/lib/utils';

interface NingxiaMapProps {
  onCityClick?: (cityName: string, cityPinyin: string) => void;
}

const SVG_WIDTH = 800;
const SVG_HEIGHT = 600;

export default function NingxiaMap({ onCityClick }: NingxiaMapProps) {
  const [geoFeatures, setGeoFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const navigate = useNavigate();

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
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-auto max-w-full"
        style={{ maxHeight: 'calc(100vh - 250px)', minHeight: '300px' }}
      >
        <defs>
          <linearGradient id="sandGradientNew" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8DCC8" />
            <stop offset="100%" stopColor="#C4A35A" />
          </linearGradient>
          
          <linearGradient id="selectedGradientNew" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2D5A4A" />
            <stop offset="100%" stopColor="#3D6B5A" />
          </linearGradient>

          <filter id="shadowNew" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        <rect x="0" y="0" width={SVG_WIDTH} height={SVG_HEIGHT} fill="#F5F2EB" rx="20" />

        <g filter="url(#shadowNew)">
          {geoFeatures.map((feature: any, index: number) => {
            const name = feature.properties?.name || feature.properties?.NAME || '未知';
            const cityId = feature.properties?.pinyin || name.toLowerCase();
            const cityFullName = feature.properties?.fullname || name;
            const center = feature.properties?.center;
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
                  fill={isHovered ? '#D4A857' : 'url(#sandGradientNew)'}
                  stroke={isHovered ? '#2D5A4A' : '#B89B5D'}
                  strokeWidth={isHovered ? 3 : 2}
                  className="cursor-pointer transition-all duration-300 hover:fill-[#D4A857] hover:stroke-[#2D5A4A] hover:stroke-[3px]"
                  onMouseEnter={() => setHoveredCity(cityId)}
                  onMouseLeave={() => setHoveredCity(null)}
                  onClick={() => {
                    if (onCityClick) {
                      onCityClick(cityFullName, cityId);
                    } else {
                      navigate(`/city/${cityId}`);
                    }
                  }}
                />
                
                <text
                  x={svgCenter.x}
                  y={svgCenter.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-serif font-bold pointer-events-none select-none"
                  style={{ 
                    fill: '#1A1A1A',
                    fontSize: '14px',
                    fontWeight: 700,
                    textShadow: '2px 2px 4px rgba(255,255,255,0.9)'
                  }}
                >
                  {cityFullName}
                </text>
              </g>
            );
          })}
        </g>

        <text x="400" y="580" textAnchor="middle" style={{ fill: '#6B6B6B', fontSize: '12px' }}>
          宁夏回族自治区 · 点击城市查看详情
        </text>
      </svg>

      <div className="mt-4 bg-white rounded-lg shadow-md p-3 md:p-4">
        <h3 className="text-xs md:text-sm font-bold mb-2 md:mb-3 text-gray-700">🏙️ 宁夏5个地级市</h3>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-2 text-xs">
          {geoFeatures.map((feature: any) => {
            const name = feature.properties?.fullname || feature.properties?.name;
            const pinyin = feature.properties?.pinyin;
            return (
              <button
                key={pinyin}
                onClick={() => {
                  if (onCityClick) {
                    onCityClick(name, pinyin);
                  } else {
                    navigate(`/city/${pinyin}`);
                  }
                }}
                className="px-2 md:px-3 py-1.5 md:py-2 bg-blue-50 hover:bg-blue-100 rounded transition-colors text-blue-800 font-medium text-xs md:text-sm"
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 md:p-4 shadow-soft max-w-[180px] md:max-w-none">
        <h4 className="text-xs md:text-sm font-serif font-bold mb-1 md:mb-2">图例说明</h4>
        <div className="space-y-1 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-3 rounded bg-primary"></div>
            <span>地级市区域</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary mt-2">
            <span>点击区域查看详情</span>
          </div>
        </div>
      </div>
    </div>
  );
}
