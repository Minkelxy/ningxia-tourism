import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface NingxiaMapProps {
  onCityClick?: (cityName: string, cityPinyin: string) => void;
}

export default function NingxiaMap({ onCityClick }: NingxiaMapProps) {
  const [geoFeatures, setGeoFeatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/src/data/ningxia-geojson.json')
      .then(res => res.json())
      .then((data: any) => {
        if (data.type === 'FeatureCollection' && data.features) {
          setGeoFeatures(data.features);
        } else {
          setError('无效的GeoJSON格式');
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
    
    if (coords[0]) {
      processRing(coords[0]);
    }
    
    for (let i = 1; i < coords.length; i++) {
      if (coords[i]) {
        processRing(coords[i]);
      }
    }
    
    return pathParts.join(' ');
  };

  const geoToSVG = (lng: number, lat: number) => {
    const width = 800;
    const height = 600;
    
    const x = ((lng - 105.0) / (1.9)) * width;
    const y = height - ((lat - 35.3) / (4.1)) * height;
    
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
    <div className="relative w-full">
      <svg
        viewBox="0 0 800 600"
        className="w-full h-auto"
        style={{ maxHeight: 'calc(100vh - 250px)' }}
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

        <rect x="0" y="0" width="800" height="600" fill="#F5F2EB" rx="20" />

        <g filter="url(#shadowNew)">
          {geoFeatures.map((feature: any, index: number) => {
            const name = feature.properties?.name || feature.properties?.NAME || '未知';
            const cityId = feature.properties?.pinyin || name.toLowerCase();
            const cityFullName = feature.properties?.fullname || name;
            const center = feature.properties?.center;
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

      <div className="mt-4 bg-white rounded-lg shadow-md p-4">
        <h3 className="text-sm font-bold mb-3 text-gray-700">🏙️ 宁夏5个地级市</h3>
        <div className="grid grid-cols-5 gap-2 text-xs">
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
                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 rounded transition-colors text-blue-800 font-medium"
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-soft">
        <h4 className="text-sm font-serif font-bold mb-2">图例说明</h4>
        <div className="space-y-1 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 rounded bg-primary"></div>
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
