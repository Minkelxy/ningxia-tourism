import { useState, useEffect } from 'react';

export default function GeoJSONViewer() {
  const [geoData, setGeoData] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        } catch (parseError) {
          console.error('Failed to parse JSON:', text.substring(0, 100));
          throw new Error('Invalid JSON response');
        }
      })
      .then(data => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load map data:', err);
        setError(err.message || '加载地图数据失败');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">错误: {error}</div>
      </div>
    );
  }

  if (!geoData) return null;

  const features = geoData.features;

  // 地理范围
  const minLng = 104.5;
  const maxLng = 107.0;
  const minLat = 35.6;
  const maxLat = 39.4;

  // ViewBox设置
  const width = 800;
  const height = 600;

  // 转换坐标函数
  function transformCoord(lng: number, lat: number) {
    const x = ((lng - minLng) / (maxLng - minLng)) * width;
    const y = height - ((lat - minLat) / (maxLat - minLat)) * height;
    return { x, y };
  }

  // 计算中心点
  function calculateCenter(coords: number[][]) {
    let sumX = 0, sumY = 0;
    coords.forEach(coord => {
      const { x, y } = transformCoord(coord[0], coord[1]);
      sumX += x;
      sumY += y;
    });
    return {
      x: sumX / coords.length,
      y: sumY / coords.length
    };
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">宁夏GeoJSON数据可视化</h1>
        
        {/* 地图显示 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full border">
            {/* 背景 */}
            <rect x="0" y="0" width={width} height={height} fill="#f0f0f0" />
            
            {/* 绘制每个城市的区域 */}
            {features.map((feature: any) => {
              const coords = feature.geometry.coordinates[0];
              const name = feature.properties.NAME;
              const center = calculateCenter(coords);
              
              // 构建SVG路径
              const pathParts = coords.map((coord: number[], index: number) => {
                const { x, y } = transformCoord(coord[0], coord[1]);
                return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
              });
              pathParts.push('Z');
              const pathD = pathParts.join(' ');

              return (
                <g key={name}>
                  <path
                    d={pathD}
                    fill={selectedCity === name ? '#3B82F6' : '#E5E7EB'}
                    stroke="#1F2937"
                    strokeWidth="2"
                    opacity="0.8"
                    onClick={() => setSelectedCity(selectedCity === name ? null : name)}
                    className="cursor-pointer hover:fill-blue-300 transition-colors"
                  />
                  <text
                    x={center.x}
                    y={center.y}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="bold"
                    fill="#1F2937"
                    pointerEvents="none"
                  >
                    {name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* 城市列表 */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">城市列表（点击城市查看详情）</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature: any) => {
              const coords = feature.geometry.coordinates[0];
              const name = feature.properties.NAME;
              const center = calculateCenter(coords);
              
              return (
                <div
                  key={name}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCity === name
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedCity(selectedCity === name ? null : name)}
                >
                  <h3 className="font-bold text-lg mb-2">{name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>坐标点数量: {coords.length}</p>
                    <p>中心点: ({center.x.toFixed(1)}, {center.y.toFixed(1)})</p>
                  </div>
                  
                  {/* 显示部分坐标 */}
                  {selectedCity === name && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500 mb-2">前5个坐标点:</p>
                      <div className="text-xs font-mono bg-gray-100 p-2 rounded max-h-40 overflow-auto">
                        {coords.slice(0, 5).map((coord: number[], i: number) => (
                          <div key={i} className="mb-1">
                            {i + 1}. [{coord[0].toFixed(4)}, {coord[1].toFixed(4)}]
                          </div>
                        ))}
                        {coords.length > 5 && (
                          <div className="text-gray-400">
                            ... 还有 {coords.length - 5} 个坐标点
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* GeoJSON数据预览 */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold mb-4">GeoJSON数据预览</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto max-h-96 font-mono text-xs">
            <pre>{JSON.stringify(geoData, null, 2).substring(0, 5000)}</pre>
            {JSON.stringify(geoData).length > 5000 && (
              <p className="text-yellow-400 mt-2">
                ... 数据过长，已截断（总共 {JSON.stringify(geoData).length} 字符）
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
