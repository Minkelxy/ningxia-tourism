import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Bus, ChevronLeft, Home, Layers3, LocateFixed, Minus, Plus, RotateCcw, TrainFront } from 'lucide-react';
import { Link } from 'react-router-dom';
import { publishedAttractions } from '../data/attractions';
import { getCityById } from '../data/cities';
import { transportHubs } from '../data/transport';
import type { Attraction, CityId } from '../types';
import MapPreview from './map/MapPreview';
import {
  containsCoordinates,
  createProjection,
  geometryToPath,
  getFeatureBounds,
  mergeFeatureBounds,
  type GeoBounds,
  type GeoFeature,
} from './map/projection';

const viewWidth = 720;
const viewHeight = 920;
const cityColors: Record<CityId, string> = {
  yinchuan: '#c89d4d', shizuishan: '#6f9b7d', wuzhong: '#d17c58', guyuan: '#718b69', zhongwei: '#b98656',
};

const districtFile: Record<string, CityId> = {
  '640100': 'yinchuan', '640200': 'shizuishan', '640300': 'wuzhong', '640400': 'guyuan', '640500': 'zhongwei',
};

const cityIdFromFeature = (feature?: GeoFeature | null) => feature?.properties.pinyin as CityId | undefined;
const featureName = (feature?: GeoFeature | null) => feature?.properties.fullname || feature?.properties.name || '';

export default function NingxiaInteractiveMap() {
  const [features, setFeatures] = useState<GeoFeature[]>([]);
  const [districts, setDistricts] = useState<GeoFeature[]>([]);
  const [selectedCity, setSelectedCity] = useState<GeoFeature | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<GeoFeature | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [showTransport, setShowTransport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ pointerId: number; x: number; y: number; panX: number; panY: number } | null>(null);

  const loadProvince = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/ningxia-province.json`);
      if (!response.ok) throw new Error('地图数据请求失败');
      const data = await response.json() as { type: string; features?: GeoFeature[] };
      if (data.type !== 'FeatureCollection' || !data.features?.length) throw new Error('地图数据格式不正确');
      setFeatures(data.features);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '地图暂时无法加载');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadProvince(); }, [loadProvince, reloadKey]);

  const resetViewport = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const openCity = async (feature: GeoFeature) => {
    setSelectedCity(feature);
    setSelectedDistrict(null);
    setSelectedAttraction(null);
    setDistricts([]);
    resetViewport();
    const file = districtFile[feature.properties.code || ''];
    if (!file) return;
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/ningxia/districts/${file}.json`);
      if (!response.ok) throw new Error('区县数据加载失败');
      const data = await response.json() as { features?: GeoFeature[] };
      setDistricts(data.features ?? []);
    } catch {
      setDistricts([]);
    }
  };

  const openDistrict = (feature: GeoFeature) => {
    setSelectedDistrict(feature);
    setSelectedAttraction(null);
    resetViewport();
  };

  const activeBounds = useMemo<GeoBounds>(() => {
    if (selectedDistrict) return getFeatureBounds(selectedDistrict);
    if (selectedCity) return getFeatureBounds(selectedCity);
    if (features.length) return mergeFeatureBounds(features);
    return { minLng: 105, maxLng: 107.1, minLat: 35.2, maxLat: 39.5 };
  }, [features, selectedCity, selectedDistrict]);

  const project = useMemo(() => createProjection(activeBounds, viewWidth, viewHeight, selectedDistrict ? 90 : 54), [activeBounds, selectedDistrict]);
  const activeCityId = cityIdFromFeature(selectedCity);
  const visibleAttractions = publishedAttractions.filter((item) => {
    if (selectedDistrict) return containsCoordinates(activeBounds, item.coordinates.lng, item.coordinates.lat);
    if (activeCityId) return item.cityId === activeCityId;
    return true;
  });
  const visibleHubs = transportHubs.filter((hub) => !activeCityId || hub.cityId === activeCityId);
  const mapFeatures = selectedCity ? (districts.length ? districts : [selectedCity]) : features;
  const levelLabel = selectedDistrict ? featureName(selectedDistrict) : selectedCity ? featureName(selectedCity) : '宁夏全区';

  const keyActivate = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); action(); }
  };

  const onPointerDown = (event: React.PointerEvent<SVGSVGElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
  };
  const onPointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    const nextX = Math.max(-180, Math.min(180, drag.current.panX + event.clientX - drag.current.x));
    const nextY = Math.max(-180, Math.min(180, drag.current.panY + event.clientY - drag.current.y));
    setPan({ x: nextX, y: nextY });
  };
  const stopDrag = () => { drag.current = null; };

  if (loading) return <div className="map-state" role="status"><span className="map-loader" />正在铺开宁夏地图…</div>;
  if (error) return (
    <div className="map-state map-error" role="alert">
      <strong>地图暂时没有加载出来</strong><p>{error}</p>
      <div className="map-state-actions"><button type="button" className="btn-primary" onClick={() => setReloadKey((value) => value + 1)}>重新加载</button><Link to="/attractions" className="btn-secondary">改用景点列表</Link></div>
    </div>
  );

  return (
    <section className="interactive-map" aria-label="宁夏交互式旅游地图">
      <div className="map-toolbar">
        <div className="map-breadcrumb" aria-label="地图层级">
          {selectedCity && <button type="button" onClick={() => { setSelectedCity(null); setSelectedDistrict(null); setDistricts([]); setSelectedAttraction(null); resetViewport(); }}><Home aria-hidden="true" /> 全区</button>}
          {selectedDistrict && <button type="button" onClick={() => { setSelectedDistrict(null); setSelectedAttraction(null); resetViewport(); }}><ChevronLeft aria-hidden="true" /> {featureName(selectedCity)}</button>}
          <span>{levelLabel}</span>
        </div>
        <div className="map-actions" aria-label="地图控制">
          <button type="button" onClick={() => setShowTransport((value) => !value)} aria-pressed={showTransport}><Layers3 aria-hidden="true" /> 交通</button>
          <button type="button" onClick={() => setZoom((value) => Math.min(2.4, value + 0.25))} aria-label="放大地图"><Plus aria-hidden="true" /></button>
          <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.25))} aria-label="缩小地图"><Minus aria-hidden="true" /></button>
          <button type="button" onClick={resetViewport} aria-label="重置地图"><RotateCcw aria-hidden="true" /></button>
        </div>
      </div>

      <div className="map-canvas-wrap">
        <svg
          viewBox={`0 0 ${viewWidth} ${viewHeight}`}
          className="map-canvas"
          aria-label={`${levelLabel}旅游地图，可用键盘选择城市和景点`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
        >
          <defs>
            <filter id="mapShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#3a2f21" floodOpacity=".16" /></filter>
            <pattern id="mapGrain" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="3" cy="5" r=".7" fill="#7b633e" opacity=".12" /><circle cx="15" cy="13" r=".5" fill="#7b633e" opacity=".1" /></pattern>
          </defs>
          <rect width={viewWidth} height={viewHeight} rx="30" fill="#efe7d8" />
          <rect width={viewWidth} height={viewHeight} rx="30" fill="url(#mapGrain)" />
          <g transform={`translate(${viewWidth / 2 + pan.x} ${viewHeight / 2 + pan.y}) scale(${zoom}) translate(${-viewWidth / 2} ${-viewHeight / 2})`}>
            <g filter="url(#mapShadow)">
              {mapFeatures.map((feature, index) => {
                const cityId = cityIdFromFeature(feature) ?? activeCityId ?? 'yinchuan';
                const selected = selectedDistrict?.properties.code === feature.properties.code;
                const action = selectedCity ? () => openDistrict(feature) : () => void openCity(feature);
                return <path key={feature.properties.code || `${featureName(feature)}-${index}`} d={geometryToPath(feature, project)} className={`map-region ${selected ? 'is-selected' : ''}`} style={{ '--region-color': selectedCity ? '#9eb89f' : cityColors[cityId] } as React.CSSProperties} tabIndex={0} role="button" aria-label={`${featureName(feature)}，按回车进入`} onClick={(event) => { event.stopPropagation(); action(); }} onKeyDown={(event) => keyActivate(event, action)} />;
              })}
            </g>

            {visibleAttractions.map((attraction) => {
              const point = project(attraction.coordinates.lng, attraction.coordinates.lat);
              const selected = selectedAttraction?.id === attraction.id;
              return (
                <g key={attraction.id} className={`map-attraction ${selected ? 'is-selected' : ''}`} transform={`translate(${point.x} ${point.y})`} tabIndex={0} role="button" aria-label={`${attraction.name}，打开预览`} onClick={(event) => { event.stopPropagation(); setSelectedAttraction(attraction); }} onKeyDown={(event) => keyActivate(event, () => setSelectedAttraction(attraction))}>
                  <circle className="marker-hit" r="22" />
                  <circle className="marker-dot" r={selected ? 16 : 12} />
                  <LocateFixed aria-hidden="true" x={-8} y={-8} width={16} height={16} />
                  <title>{attraction.name}</title>
                </g>
              );
            })}

            {showTransport && visibleHubs.map((hub) => {
              const point = project(hub.coordinates.lng, hub.coordinates.lat);
              return <g key={hub.id} className="map-hub" transform={`translate(${point.x} ${point.y})`} tabIndex={0} role="img" aria-label={`${hub.name}，交通枢纽`}><circle r="11" />{hub.type === 'bus' ? <Bus x={-7} y={-7} width={14} height={14} /> : <TrainFront x={-7} y={-7} width={14} height={14} />}<title>{hub.name}</title></g>;
            })}
          </g>
        </svg>

        {selectedAttraction && <MapPreview attraction={selectedAttraction} onClose={() => setSelectedAttraction(null)} />}
      </div>

      <div className="map-caption">
        <p><strong>{visibleAttractions.length}</strong> 个已核实景点</p>
        <p>{selectedCity ? '选择区县继续放大，或点选景点查看信息' : '选择城市进入下一级，地图支持拖动和缩放'}</p>
        {activeCityId && <Link to={`/city/${activeCityId}`} className="text-link">查看{getCityById(activeCityId)?.name}完整介绍</Link>}
      </div>
    </section>
  );
}
