import { useEffect, useMemo, useState } from 'react';
import { featureCode, featureName } from '../components/map/config';
import {
  createProjection,
  geometryToPath,
  getFeatureBounds,
  mergeFeatureBounds,
  type GeoFeature,
} from '../components/map/projection';

interface GeoCollection {
  type: 'FeatureCollection';
  features: GeoFeature[];
}

const collectPoints = (coordinates: unknown, points: [number, number][] = []) => {
  if (!Array.isArray(coordinates)) return points;
  if (typeof coordinates[0] === 'number' && typeof coordinates[1] === 'number') {
    points.push([coordinates[0], coordinates[1]]);
    return points;
  }
  coordinates.forEach((coordinate) => collectPoints(coordinate, points));
  return points;
};

export default function GeoJSONViewer() {
  const [geoData, setGeoData] = useState<GeoCollection | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const loadMap = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/ningxia-province.json`, { signal: controller.signal });
        if (!response.ok) throw new Error(`地图数据请求失败（${response.status}）`);
        const data = await response.json() as GeoCollection;
        if (data.type !== 'FeatureCollection' || !data.features?.length) throw new Error('地图数据格式不正确');
        setGeoData(data);
      } catch (reason) {
        if (reason instanceof DOMException && reason.name === 'AbortError') return;
        setError(reason instanceof Error ? reason.message : '加载地图数据失败');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void loadMap();
    return () => controller.abort();
  }, []);

  const features = useMemo(() => geoData?.features ?? [], [geoData]);
  const projection = useMemo(() => createProjection(
    features.length ? mergeFeatureBounds(features) : { minLng: 105, maxLng: 107.1, minLat: 35.2, maxLat: 39.5 },
    800,
    660,
    40,
  ), [features]);

  if (loading) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-xl">加载中…</div></div>;
  if (error) return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><div className="text-xl text-red-600">错误：{error}</div></div>;
  if (!geoData) return null;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2">宁夏正式地图数据查看器</h1>
        <p className="text-center text-gray-600 mb-8">开发环境专用，与旅游地图读取同一份省级边界数据。</p>

        <section className="bg-white rounded-lg shadow-lg p-6 mb-8" aria-label="宁夏行政区地图">
          <svg viewBox="0 0 800 660" className="w-full border" role="img" aria-label="宁夏五个地级市边界">
            <rect width="800" height="660" fill="#f5f1e8" />
            {features.map((feature) => {
              const name = featureName(feature) || '未知区域';
              const code = featureCode(feature) || name;
              const bounds = getFeatureBounds(feature);
              const center = feature.properties.center
                ? projection(...feature.properties.center)
                : projection((bounds.minLng + bounds.maxLng) / 2, (bounds.minLat + bounds.maxLat) / 2);
              const selected = selectedCode === code;
              return (
                <g key={code}>
                  <path
                    d={geometryToPath(feature, projection)}
                    fill={selected ? '#c89d4d' : '#dfe8df'}
                    stroke="#455a4a"
                    strokeWidth="2"
                    tabIndex={0}
                    role="button"
                    aria-label={`${name}，${collectPoints(feature.geometry.coordinates).length} 个坐标点`}
                    onClick={() => setSelectedCode(selected ? null : code)}
                    onKeyDown={(event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return;
                      event.preventDefault();
                      setSelectedCode(selected ? null : code);
                    }}
                    className="cursor-pointer transition-colors focus:outline-none"
                  />
                  <text x={center.x} y={center.y} textAnchor="middle" fontSize="13" fontWeight="700" fill="#27372b" pointerEvents="none">{name}</text>
                </g>
              );
            })}
          </svg>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">区域与数据概况</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const name = featureName(feature) || '未知区域';
              const code = featureCode(feature) || name;
              const pointCount = collectPoints(feature.geometry.coordinates).length;
              const selected = selectedCode === code;
              return (
                <button
                  type="button"
                  key={code}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${selected ? 'border-amber-600 bg-amber-50' : 'border-gray-200 hover:border-amber-400'}`}
                  onClick={() => setSelectedCode(selected ? null : code)}
                >
                  <strong className="block text-lg mb-2">{name}</strong>
                  <span className="block text-sm text-gray-600">行政代码：{featureCode(feature) || '未提供'}</span>
                  <span className="block text-sm text-gray-600">坐标点数量：{pointCount}</span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
