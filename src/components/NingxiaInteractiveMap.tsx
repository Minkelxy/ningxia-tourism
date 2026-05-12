import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ZoomIn, ZoomOut, Home as HomeIcon, Loader, RotateCcw } from 'lucide-react';
import { themePresets, cityColors, CityName, getDistrictColor } from '../config/map-config';
import { Attraction, TransportHub } from '../types';
import attractionsData from '../data/attractions.json';
import transportHubsData from '../data/transport-hubs.json';

interface GeoFeature {
  type: string;
  properties: {
    name?: string;
    fullname?: string;
    code?: string;
    pinyin?: string;
    center?: [number, number];
    level?: number;
    filename?: string;
  };
  geometry: {
    type: string;
    coordinates: any;
  };
}

interface NingxiaInteractiveMapProps {
  onCityClick?: (cityName: string, cityPinyin: string) => void;
}

const cityInfo: Record<string, { area: string; population: string; description: string }> = {
  yinchuan: { area: '1.27万平方公里', population: '约285万', description: '宁夏回族自治区首府，塞上湖城' },
  shizuishan: { area: '5310平方公里', population: '约80万', description: '宁夏北部工业城市' },
  wuzhong: { area: '2.14万平方公里', population: '约140万', description: '黄河金岸，回族文化特色鲜明' },
  guyuan: { area: '1.05万平方公里', population: '约125万', description: '红色圣地，生态旅游胜地' },
  zhongwei: { area: '1.74万平方公里', population: '约120万', description: '沙漠水城，沙坡头所在地' }
};

interface MarkerPoint {
  name: string;
  lng: number;
  lat: number;
  type: 'province-capital' | 'city-capital';
}

const governmentMarkers: MarkerPoint[] = [
  { name: '宁夏回族自治区政府', lng: 106.230977, lat: 38.487783, type: 'province-capital' },
  { name: '银川市人民政府', lng: 106.278568, lat: 38.463147, type: 'city-capital' },
  { name: '石嘴山市人民政府', lng: 106.384147, lat: 39.019302, type: 'city-capital' },
  { name: '吴忠市人民政府', lng: 106.198933, lat: 37.997821, type: 'city-capital' },
  { name: '固原市人民政府', lng: 106.246143, lat: 36.016084, type: 'city-capital' },
  { name: '中卫市人民政府', lng: 105.196754, lat: 37.500229, type: 'city-capital' },
];

export default function NingxiaInteractiveMap({ onCityClick }: NingxiaInteractiveMapProps) {
  const navigate = useNavigate();
  const [geoFeatures, setGeoFeatures] = useState<GeoFeature[]>([]);
  const [districtFeatures, setDistrictFeatures] = useState<GeoFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);
  const [hoveredAttraction, setHoveredAttraction] = useState<string | null>(null);
  const [hoveredGovernment, setHoveredGovernment] = useState<string | null>(null);
  const [hoveredTransport, setHoveredTransport] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<GeoFeature | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<GeoFeature | null>(null);
  const [viewLevel, setViewLevel] = useState<'province' | 'city' | 'district'>('province');
  const [zoom, setZoom] = useState(1);
  const [viewBoxDimensions, setViewBoxDimensions] = useState({ width: 900, height: 1944 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const svgElementRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    fetch(`${baseUrl}data/ningxia-province.json`)
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

  const getBounds = (feature: GeoFeature) => {
    let minLng = Infinity, maxLng = -Infinity, minLat = Infinity, maxLat = -Infinity;
    
    const processCoords = (coords: any) => {
      if (typeof coords[0] === 'number') {
        minLng = Math.min(minLng, coords[0]);
        maxLng = Math.max(maxLng, coords[0]);
        minLat = Math.min(minLat, coords[1]);
        maxLat = Math.max(maxLat, coords[1]);
      } else if (Array.isArray(coords)) {
        coords.forEach((coord: any) => processCoords(coord));
      }
    };
    
    if (feature.geometry.type === 'Polygon') {
      feature.geometry.coordinates.forEach((ring: any) => processCoords(ring));
    } else if (feature.geometry.type === 'MultiPolygon') {
      feature.geometry.coordinates.forEach((polygon: any) => {
        polygon.forEach((ring: any) => processCoords(ring));
      });
    }
    
    return { minLng, maxLng, minLat, maxLat };
  };

  const geoToSVG = (lng: number, lat: number) => {
    const { width, height } = viewBoxDimensions;
    
    let minLng, maxLng, minLat, maxLat;
    
    if (viewLevel === 'district' && selectedDistrict) {
      const bounds = getBounds(selectedDistrict);
      const pad = 0.05;
      minLng = bounds.minLng - pad;
      maxLng = bounds.maxLng + pad;
      minLat = bounds.minLat - pad;
      maxLat = bounds.maxLat + pad;
    } else if (viewLevel === 'city' && selectedCity) {
      const cityBounds = getBounds(selectedCity);
      const pad = 0.1;
      minLng = cityBounds.minLng - pad;
      maxLng = cityBounds.maxLng + pad;
      minLat = cityBounds.minLat - pad;
      maxLat = cityBounds.maxLat + pad;
    } else {
      minLng = 105.0;
      maxLng = 106.9;
      minLat = 35.3;
      maxLat = 39.4;
    }
    
    const lngRange = maxLng - minLng;
    const latRange = maxLat - minLat;
    const aspectRatio = lngRange / latRange;
    
    let adjustedWidth = width;
    let adjustedHeight = height;
    
    if (lngRange / latRange > width / height) {
      adjustedHeight = Math.round(width / aspectRatio);
    } else {
      adjustedWidth = Math.round(height * aspectRatio);
    }
    
    const actualPaddingX = (width - adjustedWidth) / 2;
    const actualPaddingY = (height - adjustedHeight) / 2;
    
    const x = actualPaddingX + ((lng - minLng) / lngRange) * adjustedWidth;
    const y = height - actualPaddingY - ((lat - minLat) / latRange) * adjustedHeight;
    
    return { x, y };
  };

  const attractionToSVG = (attraction: Attraction) => {
    return geoToSVG(attraction.coordinates.lng, attraction.coordinates.lat);
  };

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

  const loadDistrictData = async (code: string) => {
    setLoadingDistricts(true);
    try {
      const cityPinyinMap: Record<string, string> = {
        '640100': 'yinchuan',
        '640200': 'shizuishan',
        '640300': 'wuzhong',
        '640400': 'guyuan',
        '640500': 'zhongwei',
      };
      
      const cityPinyin = cityPinyinMap[code];
      if (!cityPinyin) {
        console.warn('Unknown city code:', code);
        setDistrictFeatures([]);
        return;
      }
      
      const baseUrl = import.meta.env.BASE_URL || '/';
      const response = await fetch(`${baseUrl}data/ningxia/districts/${cityPinyin}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from server');
      }
      
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error('Failed to parse JSON:', text.substring(0, 100));
        throw new Error('Invalid JSON response from server');
      }
      
      if (data && data.type === 'FeatureCollection' && data.features) {
        setDistrictFeatures(data.features);
      } else {
        console.warn('Invalid GeoJSON format');
        setDistrictFeatures([]);
      }
    } catch (err) {
      console.error('加载区级数据失败:', err);
      setDistrictFeatures([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const updateViewBoxForBounds = (bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number }, containerWidth = 900) => {
    const padding = 0.15;
    const lngRange = (bounds.maxLng - bounds.minLng) * (1 + padding * 2);
    const latRange = (bounds.maxLat - bounds.minLat) * (1 + padding * 2);
    
    const geoAspectRatio = lngRange / latRange;
    const containerAspectRatio = containerWidth / 1944;
    
    let width, height;
    
    if (geoAspectRatio > containerAspectRatio) {
      width = containerWidth;
      height = Math.round(containerWidth / geoAspectRatio);
    } else {
      height = 1944;
      width = Math.round(1944 * geoAspectRatio);
    }
    
    setViewBoxDimensions({ width, height });
  };
  
  const handleCityClick = (feature: GeoFeature) => {
    const cityPinyin = feature.properties?.pinyin || '';
    const cityCode = feature.properties?.code || '';
    const cityName = feature.properties?.fullname || feature.properties?.name || '';
    
    setSelectedCity(feature);
    setSelectedDistrict(null);
    setDistrictFeatures([]);
    setViewLevel('city');
    
    const cityBounds = getBounds(feature);
    updateViewBoxForBounds(cityBounds);
    
    loadDistrictData(cityCode);
    
    if (onCityClick) {
      onCityClick(cityName, cityPinyin);
    }
  };

  const handleDistrictClick = (feature: GeoFeature) => {
    setSelectedDistrict(feature);
    setViewLevel('district');
    
    const districtBounds = getBounds(feature);
    updateViewBoxForBounds(districtBounds);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  };
  
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e.touches));
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance) {
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / lastTouchDistance;
      
      if (scale > 1.1) {
        setZoom(z => Math.min(z * 1.05, 3));
      } else if (scale < 0.9) {
        setZoom(z => Math.max(z / 1.05, 0.5));
      }
      
      setLastTouchDistance(currentDistance);
    }
  };
  
  const handleTouchEnd = () => {
    setLastTouchDistance(null);
  };

  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetPan = () => {
    setPan({ x: 0, y: 0 });
  };

  const handleBackToProvince = () => {
    setSelectedCity(null);
    setSelectedDistrict(null);
    setDistrictFeatures([]);
    setViewLevel('province');
    setViewBoxDimensions({ width: 900, height: 1944 });
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
  };

  const handleBackToCity = () => {
    setSelectedDistrict(null);
    setViewLevel('city');
    setPan({ x: 0, y: 0 });
    setIsDragging(false);
    
    if (selectedCity) {
      const cityBounds = getBounds(selectedCity);
      updateViewBoxForBounds(cityBounds);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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

  const currentCityInfo = selectedCity ? cityInfo[selectedCity.properties?.pinyin || ''] : null;

  return (
    <div className="relative w-full">
      <div className="absolute top-2 md:top-4 right-2 md:right-4 z-20 flex flex-col gap-1 md:gap-2">
        <button
          onClick={() => setZoom(z => Math.min(z * 1.2, 3))}
          className="bg-white/95 backdrop-blur-sm rounded-lg p-1.5 md:p-2 shadow-md hover:bg-gray-50 transition-colors"
          title="放大"
        >
          <ZoomIn className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z / 1.2, 0.5))}
          className="bg-white/95 backdrop-blur-sm rounded-lg p-1.5 md:p-2 shadow-md hover:bg-gray-50 transition-colors"
          title="缩小"
        >
          <ZoomOut className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
        </button>
        {(pan.x !== 0 || pan.y !== 0 || zoom !== 1) && (
          <button
            onClick={resetPan}
            className="bg-white/95 backdrop-blur-sm rounded-lg p-1.5 md:p-2 shadow-md hover:bg-gray-50 transition-colors"
            title="重置视图"
          >
            <HomeIcon className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </button>
        )}
        {viewLevel !== 'province' && (
          <button
            onClick={viewLevel === 'city' ? handleBackToProvince : handleBackToCity}
            className="bg-white/95 backdrop-blur-sm rounded-lg p-1.5 md:p-2 shadow-md hover:bg-gray-50 transition-colors"
            title="返回"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
          </button>
        )}
      </div>

      <div className="absolute top-2 md:top-4 left-2 md:left-4 z-20 flex gap-1 md:gap-2">
        {viewLevel === 'city' && selectedCity && (
          <button
            onClick={handleBackToProvince}
            className="bg-white/95 backdrop-blur-sm rounded-lg px-2 md:px-4 py-1.5 md:py-2 shadow-md hover:bg-gray-50 transition-colors flex items-center gap-1 md:gap-2"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            <span className="font-medium text-gray-700 text-xs md:text-base">返回宁夏全区</span>
          </button>
        )}
        {viewLevel === 'district' && selectedCity && (
          <button
            onClick={handleBackToCity}
            className="bg-white/95 backdrop-blur-sm rounded-lg px-2 md:px-4 py-1.5 md:py-2 shadow-md hover:bg-gray-50 transition-colors flex items-center gap-1 md:gap-2"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-700" />
            <span className="font-medium text-gray-700 text-xs md:text-base">返回{selectedCity.properties?.fullname || selectedCity.properties?.name}</span>
          </button>
        )}
      </div>

      {loadingDistricts && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 bg-white/90 backdrop-blur-sm rounded-lg px-6 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Loader className="w-5 h-5 animate-spin text-primary" />
            <span className="text-gray-700">正在加载区级数据...</span>
          </div>
        </div>
      )}

      <div 
        ref={svgRef}
        className="w-full touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          ref={svgElementRef}
          viewBox={`0 0 ${viewBoxDimensions.width} ${viewBoxDimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-auto max-w-full cursor-grab active:cursor-grabbing"
          style={{ 
            maxHeight: 'calc(100vh - 250px)',
            minHeight: '300px',
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center center'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
        <defs>
          <linearGradient id="sandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={themePresets['default'].colors.gradient.start} />
            <stop offset="100%" stopColor={themePresets['default'].colors.gradient.end} />
          </linearGradient>
          
          <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={themePresets['default'].colors.selectedGradient.start} />
            <stop offset="100%" stopColor={themePresets['default'].colors.selectedGradient.end} />
          </linearGradient>

          <linearGradient id="districtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={themePresets['default'].colors.districtGradient.start} />
            <stop offset="100%" stopColor={themePresets['default'].colors.districtGradient.end} />
          </linearGradient>

          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3"/>
          </filter>
        </defs>

        <rect 
          x="0" 
          y="0" 
          width={viewBoxDimensions.width} 
          height={viewBoxDimensions.height} 
          fill={themePresets['default'].colors.background} 
          rx="12" 
        />

        <g filter="url(#shadow)">
          {viewLevel === 'province' && geoFeatures.map((feature: GeoFeature, index: number) => {
            const name = feature.properties?.name || '未知';
            const cityId = feature.properties?.pinyin || name.toLowerCase();
            const cityFullName = feature.properties?.fullname || name;
            const center = feature.properties?.center;
            const isHovered = hoveredCity === cityId;
            const isSelected = selectedCity?.properties?.pinyin === cityId;
            const colors = cityColors[cityId as CityName] || cityColors.yinchuan;

            const svgCenter = center ? geoToSVG(center[0], center[1]) : { x: 450, y: 350 };

            let pathD = '';
            if (feature.geometry?.type === 'Polygon') {
              pathD = coordinatesToPath(feature.geometry.coordinates);
            } else if (feature.geometry?.type === 'MultiPolygon') {
              feature.geometry.coordinates.forEach((poly: number[][][]) => {
                pathD += coordinatesToPath(poly) + ' ';
              });
            }

            return (
              <g key={`city-${cityId}-${index}`}>
                <path
                  d={pathD}
                  fill={isSelected ? 'url(#selectedGradient)' : isHovered ? colors.fillHover : colors.fill}
                  stroke={isSelected ? themePresets['default'].colors.province.strokeSelected : isHovered ? colors.strokeHover : colors.stroke}
                  strokeWidth={isSelected ? 3 : isHovered ? 2.5 : 2}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setHoveredCity(cityId)}
                  onMouseLeave={() => setHoveredCity(null)}
                  onClick={() => handleCityClick(feature)}
                />
                
                <text
                  x={svgCenter.x}
                  y={svgCenter.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm font-serif font-bold pointer-events-none select-none"
                  style={{ 
                    fill: themePresets['default'].colors.text.primary,
                    fontSize: '14px',
                    fontWeight: 700,
                    textShadow: '2px 2px 4px ' + themePresets['default'].colors.text.shadow
                  }}
                >
                  {cityFullName}
                </text>
              </g>
            );
          })}

          {viewLevel === 'city' && selectedCity && !loadingDistricts && (
            <>
              <path
                d={(() => {
                  let pathD = '';
                  if (selectedCity.geometry?.type === 'Polygon') {
                    pathD = coordinatesToPath(selectedCity.geometry.coordinates);
                  } else if (selectedCity.geometry?.type === 'MultiPolygon') {
                    selectedCity.geometry.coordinates.forEach((poly: number[][][]) => {
                      pathD += coordinatesToPath(poly) + ' ';
                    });
                  }
                  return pathD;
                })()}
                fill="url(#sandGradient)"
                stroke="#B89B5D"
                strokeWidth={2}
              />
              {districtFeatures.length > 0 && districtFeatures.map((feature: GeoFeature, index: number) => {
                const name = feature.properties?.name || feature.properties?.fullname || '未知';
                const districtId = feature.properties?.pinyin || name.toLowerCase();
                const center = feature.properties?.center;
                const isHovered = hoveredDistrict === districtId;
                const isSelected = selectedDistrict?.properties?.pinyin === districtId;
                const colors = getDistrictColor(name);

                const svgCenter = center ? geoToSVG(center[0], center[1]) : { x: 450, y: 350 };

                let pathD = '';
                if (feature.geometry?.type === 'Polygon') {
                  pathD = coordinatesToPath(feature.geometry.coordinates);
                } else if (feature.geometry?.type === 'MultiPolygon') {
                  feature.geometry.coordinates.forEach((poly: number[][][]) => {
                    pathD += coordinatesToPath(poly) + ' ';
                  });
                }

                return (
                  <g key={`district-${districtId}-${index}`}>
                    <path
                      d={pathD}
                      fill={isSelected ? 'url(#selectedGradient)' : isHovered ? colors.fillHover : colors.fill}
                      stroke={isSelected ? themePresets['default'].colors.province.strokeSelected : isHovered ? colors.strokeHover : colors.stroke}
                      strokeWidth={isSelected ? 2 : isHovered ? 1.5 : 1}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredDistrict(districtId)}
                      onMouseLeave={() => setHoveredDistrict(null)}
                      onClick={() => handleDistrictClick(feature)}
                    />
                    
                    <text
                      x={svgCenter.x}
                      y={svgCenter.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-serif font-bold pointer-events-none select-none"
                      style={{ 
                        fill: '#1A1A1A',
                        fontSize: '10px',
                        fontWeight: 600,
                        textShadow: '2px 2px 4px rgba(255,255,255,0.9)'
                      }}
                    >
                      {name}
                    </text>
                  </g>
                );
              })}
            </>
          )}

          {viewLevel === 'district' && selectedDistrict && (
            <>
              <path
                d={(() => {
                  let pathD = '';
                  if (selectedCity?.geometry?.type === 'Polygon') {
                    pathD = coordinatesToPath(selectedCity.geometry.coordinates);
                  } else if (selectedCity?.geometry?.type === 'MultiPolygon') {
                    selectedCity.geometry.coordinates.forEach((poly: number[][][]) => {
                      pathD += coordinatesToPath(poly) + ' ';
                    });
                  }
                  return pathD;
                })()}
                fill="url(#sandGradient)"
                stroke="#B89B5D"
                strokeWidth={1}
                opacity={0.5}
              />
              {districtFeatures.map((feature: GeoFeature, index: number) => {
                const name = feature.properties?.name || feature.properties?.fullname || '未知';
                const districtId = feature.properties?.pinyin || name.toLowerCase();
                const isSelected = selectedDistrict?.properties?.pinyin === districtId;
                const isHovered = hoveredDistrict === districtId;
                const colors = getDistrictColor(name);

                let pathD = '';
                if (feature.geometry?.type === 'Polygon') {
                  pathD = coordinatesToPath(feature.geometry.coordinates);
                } else if (feature.geometry?.type === 'MultiPolygon') {
                  feature.geometry.coordinates.forEach((poly: number[][][]) => {
                    pathD += coordinatesToPath(poly) + ' ';
                  });
                }

                return (
                  <path
                    key={`district-view-${districtId}-${index}`}
                    d={pathD}
                    fill={isSelected ? 'url(#selectedGradient)' : isHovered ? colors.fillHover : colors.fill}
                    stroke={isSelected ? themePresets['default'].colors.province.strokeSelected : isHovered ? colors.strokeHover : colors.stroke}
                    strokeWidth={isSelected ? 3 : isHovered ? 2 : 1}
                    opacity={isSelected || isHovered ? 1 : 0.8}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => setSelectedDistrict(feature)}
                  />
                );
              })}
            </>
          )}
        </g>

        <text x="450" y="680" textAnchor="middle" style={{ fill: '#6B6B6B', fontSize: '12px' }}>
          {viewLevel === 'district' && selectedDistrict 
            ? `${selectedDistrict.properties?.fullname || selectedDistrict.properties?.name} · 点击区级区域查看详情`
            : viewLevel === 'city' && selectedCity 
            ? `${selectedCity.properties?.fullname || selectedCity.properties?.name} · 点击区级进入下一级 · 点击空白处返回全区`
            : '宁夏回族自治区 · 点击城市进入下一级'}
        </text>
        
        {(viewLevel === 'province' || viewLevel === 'city') && (
          <g className="attractions-layer">
            {viewLevel === 'city' && selectedCity && 
              attractionsData
                .filter((attr: Attraction) => attr.city.includes(selectedCity.properties?.name || ''))
                .map((attraction: Attraction) => {
                  const pos = attractionToSVG(attraction);
                  const isHovered = hoveredAttraction === attraction.id;
                  return (
                    <g
                      key={attraction.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredAttraction(attraction.id)}
                      onMouseLeave={() => setHoveredAttraction(null)}
                      onClick={() => navigate(`/attraction/${attraction.id}`)}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isHovered ? 14 : 10}
                        fill="#E85D4C"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        className="transition-all duration-300"
                      />
                      {isHovered && (
                        <g>
                          <rect
                            x={pos.x - 80}
                            y={pos.y - 85}
                            width="160"
                            height="70"
                            rx="8"
                            fill="#FFFFFF"
                            filter="url(#shadow)"
                          />
                          <text
                            x={pos.x}
                            y={pos.y - 60}
                            textAnchor="middle"
                            className="text-sm font-serif font-bold"
                            style={{ fill: '#1A1A1A', fontSize: '12px' }}
                          >
                            {attraction.name}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y - 43}
                            textAnchor="middle"
                            className="text-xs"
                            style={{ fill: '#6B6B6B', fontSize: '9px' }}
                          >
                            {attraction.city}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y - 27}
                            textAnchor="middle"
                            className="text-xs flex items-center justify-center gap-1"
                            style={{ fill: '#C4A35A', fontSize: '10px' }}
                          >
                            ⭐ {attraction.rating}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })
            }
            {viewLevel === 'province' && 
              attractionsData
                .filter((attr: Attraction) => attr.rating >= 4.5)
                .map((attraction: Attraction) => {
                  const pos = attractionToSVG(attraction);
                  const isHovered = hoveredAttraction === attraction.id;
                  return (
                    <g
                      key={attraction.id}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredAttraction(attraction.id)}
                      onMouseLeave={() => setHoveredAttraction(null)}
                      onClick={() => navigate(`/attraction/${attraction.id}`)}
                    >
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isHovered ? 16 : 12}
                        fill="#E85D4C"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                        className="transition-all duration-300"
                      />
                      {isHovered && (
                        <g>
                          <rect
                            x={pos.x - 90}
                            y={pos.y - 95}
                            width="180"
                            height="80"
                            rx="10"
                            fill="#FFFFFF"
                            filter="url(#shadow)"
                          />
                          <text
                            x={pos.x}
                            y={pos.y - 65}
                            textAnchor="middle"
                            className="text-sm font-serif font-bold"
                            style={{ fill: '#1A1A1A', fontSize: '13px' }}
                          >
                            {attraction.name}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y - 45}
                            textAnchor="middle"
                            className="text-xs"
                            style={{ fill: '#6B6B6B', fontSize: '10px' }}
                          >
                            {attraction.city}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y - 27}
                            textAnchor="middle"
                            className="text-xs flex items-center justify-center gap-1"
                            style={{ fill: '#C4A35A', fontSize: '11px' }}
                          >
                            ⭐ {attraction.rating}
                          </text>
                          <text
                            x={pos.x}
                            y={pos.y - 10}
                            textAnchor="middle"
                            className="text-xs"
                            style={{ fill: '#007BFF', fontSize: '9px' }}
                          >
                            点击查看详情 →
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })
            }
          </g>
        )}
        
        <g className="government-markers">
          {governmentMarkers
            .filter(marker => {
              if (viewLevel === 'province') {
                return marker.type === 'province-capital' || marker.type === 'city-capital';
              } else if (viewLevel === 'city' && selectedCity) {
                return marker.type === 'city-capital' && 
                  marker.name.includes(selectedCity.properties?.name || '');
              }
              return false;
            })
            .map((marker) => {
              const pos = geoToSVG(marker.lng, marker.lat);
              const isHovered = hoveredGovernment === marker.name;
              const isProvinceCapital = marker.type === 'province-capital';
              
              return (
                <g
                  key={marker.name}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredGovernment(marker.name)}
                  onMouseLeave={() => setHoveredGovernment(null)}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 18 : 15}
                    fill={isProvinceCapital ? '#2563EB' : '#059669'}
                    stroke="#FFFFFF"
                    strokeWidth="4"
                    className="transition-all duration-300"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 5}
                    textAnchor="middle"
                    style={{ fill: '#FFFFFF', fontSize: '10px', fontWeight: 700 }}
                  >
                    {isProvinceCapital ? '★' : '●'}
                  </text>
                  {isHovered && (
                    <g>
                      <rect
                        x={pos.x - 100}
                        y={pos.y - 90}
                        width="200"
                        height="75"
                        rx="10"
                        fill="#FFFFFF"
                        filter="url(#shadow)"
                      />
                      <text
                        x={pos.x}
                        y={pos.y - 60}
                        textAnchor="middle"
                        className="text-sm font-serif font-bold"
                        style={{ fill: '#1A1A1A', fontSize: '13px' }}
                      >
                        {marker.name}
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y - 38}
                        textAnchor="middle"
                        className="text-xs"
                        style={{ fill: isProvinceCapital ? '#2563EB' : '#059669', fontSize: '11px' }}
                      >
                        {isProvinceCapital ? '🏛️ 省级政府' : '🏢 市级政府'}
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y - 20}
                        textAnchor="middle"
                        className="text-xs"
                        style={{ fill: '#6B6B6B', fontSize: '10px' }}
                      >
                        {marker.lng.toFixed(4)}°E, {marker.lat.toFixed(4)}°N
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
        </g>

        <g className="transport-hubs-layer">
          {transportHubsData
            .filter((hub: TransportHub) => {
              if (viewLevel === 'province') {
                return true;
              } else if (viewLevel === 'city' && selectedCity) {
                return hub.city.includes(selectedCity.properties?.name || '');
              }
              return false;
            })
            .map((hub: TransportHub) => {
              const pos = geoToSVG(hub.coordinates.lng, hub.coordinates.lat);
              const isHovered = hoveredTransport === hub.id;
              
              let hubColor = '#7C3AED';
              let hubIcon = '🚄';
              if (hub.type === 'railway') {
                hubColor = '#059669';
                hubIcon = '🚉';
              } else if (hub.type === 'bus') {
                hubColor = '#F59E0B';
                hubIcon = '🚌';
              }
              
              return (
                <g
                  key={hub.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredTransport(hub.id)}
                  onMouseLeave={() => setHoveredTransport(null)}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? 16 : 12}
                    fill={hubColor}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    className="transition-all duration-300"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    style={{ fontSize: '14px' }}
                  >
                    {hubIcon}
                  </text>
                  {isHovered && (
                    <g>
                      <rect
                        x={pos.x - 100}
                        y={pos.y - 105}
                        width="200"
                        height="90"
                        rx="10"
                        fill="#FFFFFF"
                        filter="url(#shadow)"
                      />
                      <text
                        x={pos.x}
                        y={pos.y - 75}
                        textAnchor="middle"
                        className="text-sm font-serif font-bold"
                        style={{ fill: '#1A1A1A', fontSize: '13px' }}
                      >
                        {hub.name}
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y - 53}
                        textAnchor="middle"
                        className="text-xs"
                        style={{ fill: hubColor, fontSize: '11px' }}
                      >
                        {hub.type === 'highspeed_rail' ? '🚄 高铁站' : hub.type === 'railway' ? '🚉 火车站' : '🚌 汽车站'}
                      </text>
                      <text
                        x={pos.x}
                        y={pos.y - 33}
                        textAnchor="middle"
                        className="text-xs"
                        style={{ fill: '#6B6B6B', fontSize: '10px' }}
                      >
                        {hub.city}
                      </text>
                      {hub.address && (
                        <text
                          x={pos.x}
                          y={pos.y - 15}
                          textAnchor="middle"
                          className="text-xs"
                          style={{ fill: '#6B6B6B', fontSize: '9px' }}
                        >
                          {hub.address}
                        </text>
                      )}
                    </g>
                  )}
                </g>
              );
            })}
        </g>
        </svg>
      </div>
      
      {viewLevel === 'city' && currentCityInfo && (
        <div className="mt-4 bg-white rounded-xl shadow-soft p-4 md:p-6">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-text-primary mb-3 md:mb-4">
            {selectedCity?.properties?.fullname || selectedCity?.properties?.name}
          </h3>
          <div className="grid grid-cols-3 gap-2 md:gap-4 mb-3 md:mb-4">
            <div className="bg-blue-50 rounded-lg p-2 md:p-3">
              <p className="text-xs text-blue-600 mb-1">面积</p>
              <p className="font-bold text-blue-800 text-sm md:text-base">{currentCityInfo.area}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 md:p-3">
              <p className="text-xs text-green-600 mb-1">人口</p>
              <p className="font-bold text-green-800 text-sm md:text-base">{currentCityInfo.population}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-2 md:p-3">
              <p className="text-xs text-purple-600 mb-1">区县级数量</p>
              <p className="font-bold text-purple-800 text-sm md:text-base">{districtFeatures.length} 个</p>
            </div>
          </div>
          <p className="text-text-secondary text-sm md:text-base">{currentCityInfo.description}</p>
          {districtFeatures.length > 0 && (
            <div className="mt-3 md:mt-4">
              <p className="text-xs md:text-sm font-medium text-text-primary mb-2">点击下方区/县进入下一级：</p>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {districtFeatures.map((feature: GeoFeature) => {
                  const name = feature.properties?.name || feature.properties?.fullname || '';
                  return (
                    <button
                      key={feature.properties?.code}
                      onClick={() => handleDistrictClick(feature)}
                      className="px-2 md:px-3 py-1 bg-green-50 hover:bg-green-100 rounded-full text-xs md:text-sm text-green-800 transition-colors"
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {viewLevel === 'district' && selectedDistrict && (
        <div className="mt-4 bg-white rounded-xl shadow-soft p-4 md:p-6">
          <h3 className="text-xl md:text-2xl font-serif font-bold text-text-primary mb-3 md:mb-4">
            {selectedDistrict.properties?.fullname || selectedDistrict.properties?.name}
          </h3>
          <p className="text-text-secondary text-sm md:text-base">
            所属：{selectedCity?.properties?.fullname || selectedCity?.properties?.name}
          </p>
          <p className="text-xs text-text-secondary mt-2">
            行政区划代码：{selectedDistrict.properties?.code}
          </p>
        </div>
      )}

      {viewLevel === 'province' && (
        <div className="mt-4 bg-white rounded-lg shadow-md p-3 md:p-4">
          <h3 className="text-xs md:text-sm font-bold mb-2 md:mb-3 text-gray-700">🏙️ 宁夏5个地级市（点击进入）</h3>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-2 text-xs">
            {geoFeatures.map((feature: GeoFeature) => {
              const name = feature.properties?.fullname || feature.properties?.name;
              const pinyin = feature.properties?.pinyin;
              return (
                <button
                  key={pinyin}
                  onClick={() => handleCityClick(feature)}
                  className="px-2 md:px-3 py-1.5 md:py-2 bg-blue-50 hover:bg-blue-100 rounded transition-colors text-blue-800 font-medium text-xs md:text-sm"
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 md:p-4 shadow-soft max-w-[180px] md:max-w-none">
        <h4 className="text-xs md:text-sm font-serif font-bold mb-1 md:mb-2">地级市</h4>
        <div className="space-y-1 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-3 rounded" style={{ backgroundColor: cityColors.yinchuan.fill }}></div>
            <span>银川市</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-3 rounded" style={{ backgroundColor: cityColors.shizuishan.fill }}></div>
            <span>石嘴山</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-3 rounded" style={{ backgroundColor: cityColors.wuzhong.fill }}></div>
            <span>吴忠市</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-3 rounded" style={{ backgroundColor: cityColors.guyuan.fill }}></div>
            <span>固原市</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-3 rounded" style={{ backgroundColor: cityColors.zhongwei.fill }}></div>
            <span>中卫市</span>
          </div>
        </div>
        <h4 className="text-xs md:text-sm font-serif font-bold mt-2 mb-1">其他</h4>
        <div className="space-y-1 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-3 rounded" style={{ backgroundColor: '#A8D5BA' }}></div>
            <span>区/县级</span>
          </div>
        </div>
        <h4 className="text-xs md:text-sm font-serif font-bold mt-2 mb-1">交通枢纽</h4>
        <div className="space-y-1 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-3 rounded" style={{ backgroundColor: '#7C3AED' }}></div>
            <span>🚄 高铁站</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-3 rounded" style={{ backgroundColor: '#059669' }}></div>
            <span>🚉 火车站</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-3 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
            <span>🚌 汽车站</span>
          </div>
        </div>
      </div>
    </div>
  );
}
