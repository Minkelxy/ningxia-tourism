import { useState, useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
  lng?: number;
  lat?: number;
}

interface GeoJSONEditorProps {
  initialData?: any;
  onSave?: (data: any) => void;
}

export default function GeoJSONEditor({ initialData, onSave }: GeoJSONEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [viewBox, setViewBox] = useState({
    minLng: 104.5,
    maxLng: 107.0,
    minLat: 35.6,
    maxLat: 39.4
  });

  // 地理范围设置
  const geoBounds = {
    minLng: 104.5,
    maxLng: 107.0,
    minLat: 35.6,
    maxLat: 39.4
  };

  // 将地理坐标转换为画布坐标
  const geoToCanvas = (lng: number, lat: number, width: number, height: number) => {
    const x = ((lng - geoBounds.minLng) / (geoBounds.maxLng - geoBounds.minLng)) * width;
    const y = height - ((lat - geoBounds.minLat) / (geoBounds.maxLat - geoBounds.minLat)) * height;
    return { x, y };
  };

  // 将画布坐标转换为地理坐标
  const canvasToGeo = (x: number, y: number, width: number, height: number) => {
    const lng = (x / width) * (geoBounds.maxLng - geoBounds.minLng) + geoBounds.minLng;
    const lat = ((height - y) / height) * (geoBounds.maxLat - geoBounds.minLat) + geoBounds.minLat;
    return { lng, lat };
  };

  // 绘制画布
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 清空画布
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 0, width, height);

    // 绘制网格
    if (showGrid) {
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 0.5;
      
      // 经线
      for (let i = 0; i <= 10; i++) {
        const lng = geoBounds.minLng + (i / 10) * (geoBounds.maxLng - geoBounds.minLng);
        const x = geoToCanvas(lng, geoBounds.minLat, width, height).x;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        
        // 经度标签
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(`${lng.toFixed(1)}°E`, x + 2, 10);
      }
      
      // 纬线
      for (let i = 0; i <= 10; i++) {
        const lat = geoBounds.minLat + (i / 10) * (geoBounds.maxLat - geoBounds.minLat);
        const y = geoToCanvas(geoBounds.minLng, lat, width, height).y;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
        
        // 纬度标签
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(`${lat.toFixed(1)}°N`, 2, y - 2);
      }
    }

    // 绘制多边形
    if (points.length > 0) {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
      
      ctx.beginPath();
      const firstPoint = geoToCanvas(points[0].lng || 0, points[0].lat || 0, width, height);
      ctx.moveTo(firstPoint.x, firstPoint.y);
      
      for (let i = 1; i < points.length; i++) {
        const point = geoToCanvas(points[i].lng || 0, points[i].lat || 0, width, height);
        ctx.lineTo(point.x, point.y);
      }
      
      if (points.length > 2) {
        ctx.closePath();
        ctx.fill();
      }
      ctx.stroke();
    }

    // 绘制点
    points.forEach((point, index) => {
      const canvasPos = geoToCanvas(point.lng || 0, point.lat || 0, width, height);
      
      // 选择状态
      if (selectedPoint === index) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(canvasPos.x, canvasPos.y, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(canvasPos.x, canvasPos.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // 点编号
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText(`${index + 1}`, canvasPos.x + 8, canvasPos.y - 8);
      
      // 显示坐标
      if (showCoordinates) {
        ctx.fillStyle = '#64748b';
        ctx.font = '9px monospace';
        ctx.fillText(
          `[${(point.lng || 0).toFixed(4)}, ${(point.lat || 0).toFixed(4)}]`,
          canvasPos.x + 8,
          canvasPos.y + 12
        );
      }
    });

  }, [points, selectedPoint, showGrid, showCoordinates]);

  // 处理画布点击
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const geoPos = canvasToGeo(x, y, canvas.width, canvas.height);
    
    // 检查是否点击了现有点
    const clickedPointIndex = points.findIndex((point) => {
      const pointPos = geoToCanvas(point.lng || 0, point.lat || 0, canvas.width, canvas.height);
      const distance = Math.sqrt(Math.pow(pointPos.x - x, 2) + Math.pow(pointPos.y - y, 2));
      return distance < 15;
    });

    if (clickedPointIndex !== -1) {
      setSelectedPoint(clickedPointIndex);
    } else {
      // 添加新点
      const newPoint: Point = {
        x,
        y,
        lng: geoPos.lng,
        lat: geoPos.lat
      };
      setPoints([...points, newPoint]);
      setSelectedPoint(points.length);
    }
  };

  // 处理拖动
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    // 检查是否点击了现有点
    const clickedPointIndex = points.findIndex((point) => {
      const pointPos = geoToCanvas(point.lng || 0, point.lat || 0, canvas.width, canvas.height);
      const distance = Math.sqrt(Math.pow(pointPos.x - x, 2) + Math.pow(pointPos.y - y, 2));
      return distance < 15;
    });

    if (clickedPointIndex !== -1) {
      setSelectedPoint(clickedPointIndex);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedPoint === null) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const geoPos = canvasToGeo(x, y, canvas.width, canvas.height);
    
    const newPoints = [...points];
    newPoints[selectedPoint] = {
      ...newPoints[selectedPoint],
      lng: geoPos.lng,
      lat: geoPos.lat
    };
    setPoints(newPoints);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 删除选中的点
  const deleteSelectedPoint = () => {
    if (selectedPoint !== null) {
      const newPoints = points.filter((_, index) => index !== selectedPoint);
      setPoints(newPoints);
      setSelectedPoint(null);
    }
  };

  // 更新选中点的坐标
  const updateSelectedPoint = (lng: number, lat: number) => {
    if (selectedPoint !== null) {
      const newPoints = [...points];
      newPoints[selectedPoint] = {
        ...newPoints[selectedPoint],
        lng,
        lat
      };
      setPoints(newPoints);
    }
  };

  // 导出GeoJSON
  const exportGeoJSON = () => {
    if (points.length < 3) {
      alert('至少需要3个点来形成多边形');
      return;
    }

    const coordinates = points.map(p => [p.lng, p.lat]);
    coordinates.push(coordinates[0]); // 闭合多边形

    const geojson = {
      type: 'Feature',
      properties: {
        name: '编辑的区域'
      },
      geometry: {
        type: 'Polygon',
        coordinates: [coordinates]
      }
    };

    const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited-region.geojson';
    a.click();
    URL.revokeObjectURL(url);

    if (onSave) {
      onSave(geojson);
    }
  };

  // 导入GeoJSON
  const importGeoJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.geometry && data.geometry.coordinates) {
          const coords = data.geometry.coordinates[0];
          // 移除重复的最后一个点
          const importPoints = coords.slice(0, -1).map((coord: number[]) => ({
            lng: coord[0],
            lat: coord[1]
          }));
          setPoints(importPoints);
        }
      } catch (error) {
        alert('无效的GeoJSON文件');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 工具栏 */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-bold text-gray-800">🗺️ GeoJSON 编辑器</h1>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showGrid ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              网格 {showGrid ? '✓' : ''}
            </button>
            
            <button
              onClick={() => setShowCoordinates(!showCoordinates)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showCoordinates ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              坐标 {showCoordinates ? '✓' : ''}
            </button>
            
            <button
              onClick={deleteSelectedPoint}
              disabled={selectedPoint === null}
              className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              删除选中点
            </button>
            
            <label className="px-4 py-2 rounded-lg font-medium bg-purple-500 text-white cursor-pointer hover:bg-purple-600 transition-colors">
              导入 GeoJSON
              <input
                type="file"
                accept=".json,.geojson"
                onChange={importGeoJSON}
                className="hidden"
              />
            </label>
            
            <button
              onClick={exportGeoJSON}
              className="px-4 py-2 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              导出 GeoJSON
            </button>
            
            <button
              onClick={() => {
                if (confirm('确定要清空所有点吗？')) {
                  setPoints([]);
                  setSelectedPoint(null);
                }
              }}
              className="px-4 py-2 rounded-lg font-medium bg-gray-500 text-white hover:bg-gray-600 transition-colors"
            >
              清空
            </button>
          </div>
        </div>
      </div>

      {/* 主编辑区 */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 画布 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <canvas
                ref={canvasRef}
                width={1200}
                height={800}
                onClick={handleCanvasClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full border-2 border-gray-300 rounded-lg cursor-crosshair"
                style={{ maxWidth: '100%', height: 'auto' }}
              />
              
              <div className="mt-4 text-sm text-gray-600">
                <p>💡 <strong>使用提示：</strong></p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>点击画布添加新的坐标点</li>
                  <li>拖动现有的点可以移动其位置</li>
                  <li>点击点可以选中它，然后在右侧面板编辑坐标</li>
                  <li>导出GeoJSON后可以在其他工具中使用</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 选中点编辑 */}
            {selectedPoint !== null && points[selectedPoint] && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                  📍 编辑点 #{selectedPoint + 1}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      经度 (Longitude)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={points[selectedPoint].lng?.toFixed(4) || ''}
                      onChange={(e) => {
                        const lng = parseFloat(e.target.value);
                        if (!isNaN(lng)) {
                          updateSelectedPoint(lng, points[selectedPoint].lat || 0);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      纬度 (Latitude)
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={points[selectedPoint].lat?.toFixed(4) || ''}
                      onChange={(e) => {
                        const lat = parseFloat(e.target.value);
                        if (!isNaN(lat)) {
                          updateSelectedPoint(points[selectedPoint].lng || 0, lat);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    onClick={deleteSelectedPoint}
                    className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    删除此点
                  </button>
                </div>
              </div>
            )}

            {/* 点列表 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                📋 点列表 ({points.length})
              </h3>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {points.map((point, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPoint(index)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPoint === index
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium text-gray-800">点 #{index + 1}</div>
                    <div className="text-xs text-gray-600 font-mono mt-1">
                      Lng: {point.lng?.toFixed(4)}<br />
                      Lat: {point.lat?.toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>
              
              {points.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  点击画布添加第一个点
                </p>
              )}
            </div>

            {/* 地理范围设置 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                🌍 地理范围
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-gray-600">经度范围</div>
                  <div className="font-mono">{geoBounds.minLng}°E - {geoBounds.maxLng}°E</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-gray-600">纬度范围</div>
                  <div className="font-mono">{geoBounds.minLat}°N - {geoBounds.maxLat}°N</div>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-500">
                <p>当前范围适合宁夏地区使用</p>
                <p className="mt-1">经度跨度: {(geoBounds.maxLng - geoBounds.minLng).toFixed(1)}°</p>
                <p>纬度跨度: {(geoBounds.maxLat - geoBounds.minLat).toFixed(1)}°</p>
              </div>
            </div>

            {/* 快捷操作 */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                ⚡ 快捷操作
              </h3>
              
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // 添加一些示例点
                    const examplePoints = [
                      { lng: 106.2, lat: 38.5, x: 0, y: 0 },
                      { lng: 106.5, lat: 38.3, x: 0, y: 0 },
                      { lng: 106.8, lat: 38.4, x: 0, y: 0 },
                      { lng: 106.7, lat: 38.7, x: 0, y: 0 },
                      { lng: 106.3, lat: 38.8, x: 0, y: 0 }
                    ];
                    setPoints(examplePoints);
                  }}
                  className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  添加示例点
                </button>
                
                <button
                  onClick={() => {
                    // 创建圆形点阵列
                    const centerLng = 106.2;
                    const centerLat = 38.5;
                    const radius = 0.3;
                    const numPoints = 12;
                    const circlePoints = [];
                    
                    for (let i = 0; i < numPoints; i++) {
                      const angle = (i / numPoints) * Math.PI * 2;
                      circlePoints.push({
                        lng: centerLng + radius * Math.cos(angle),
                        lat: centerLat + radius * Math.sin(angle) * 0.7,
                        x: 0,
                        y: 0
                      });
                    }
                    
                    setPoints(circlePoints);
                  }}
                  className="w-full px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
                >
                  创建测试圆形
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
