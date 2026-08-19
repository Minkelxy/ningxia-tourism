import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPublishedAttractionsByCity, publishedAttractions } from '../data/attractions';
import { getCityById } from '../data/cities';
import { publishedFoods } from '../data/foods';
import { transportHubs } from '../data/transport';
import type { Attraction } from '../types';
import AttractionLayer from './map/AttractionLayer';
import FoodLayer from './map/FoodLayer';
import GovernmentLayer from './map/GovernmentLayer';
import MapControls from './map/MapControls';
import MapPreview from './map/MapPreview';
import MapRegionLayer from './map/MapRegionLayer';
import TransportLayer from './map/TransportLayer';
import { cityIdFromFeature, districtFileByCode, featureCode, featureName, governmentMarkers, mapView } from './map/config';
import {
  containsCoordinates,
  createProjection,
  getFeatureBounds,
  mergeFeatureBounds,
  type GeoBounds,
  type GeoFeature,
} from './map/projection';
import useMapViewport from './map/useMapViewport';

export default function NingxiaInteractiveMap() {
  const navigate = useNavigate();
  const [features, setFeatures] = useState<GeoFeature[]>([]);
  const [districts, setDistricts] = useState<GeoFeature[]>([]);
  const [selectedCity, setSelectedCity] = useState<GeoFeature | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<GeoFeature | null>(null);
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [showTransport, setShowTransport] = useState(false);
  const [showFood, setShowFood] = useState(false);
  const [showGovernment, setShowGovernment] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const { zoom, pan, zoomIn, zoomOut, resetViewport, viewportHandlers } = useMapViewport();

  const loadProvince = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const mobileMap = typeof window !== 'undefined' && window.matchMedia?.('(max-width: 768px)').matches;
      const file = mobileMap ? 'ningxia-province-mobile.json' : 'ningxia-province.json';
      const response = await fetch(`${import.meta.env.BASE_URL}data/${file}`);
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

  const openCity = useCallback(async (feature: GeoFeature) => {
    setSelectedCity(feature);
    setSelectedDistrict(null);
    setSelectedAttraction(null);
    setDistricts([]);
    resetViewport();
    const file = districtFileByCode[feature.properties.code || ''];
    if (!file) return;
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/ningxia/districts/${file}.json`);
      if (!response.ok) throw new Error('区县数据加载失败');
      const data = await response.json() as { features?: GeoFeature[] };
      setDistricts(data.features ?? []);
    } catch {
      setDistricts([]);
    }
  }, [resetViewport]);

  const openDistrict = useCallback((feature: GeoFeature) => {
    setSelectedDistrict(feature);
    setSelectedAttraction(null);
    resetViewport();
  }, [resetViewport]);

  const backToProvince = useCallback(() => {
    setSelectedCity(null);
    setSelectedDistrict(null);
    setDistricts([]);
    setSelectedAttraction(null);
    resetViewport();
  }, [resetViewport]);

  const backToCity = useCallback(() => {
    setSelectedDistrict(null);
    setSelectedAttraction(null);
    resetViewport();
  }, [resetViewport]);

  const toggleTransport = useCallback(() => setShowTransport((value) => !value), []);
  const toggleFood = useCallback(() => setShowFood((value) => !value), []);
  const toggleGovernment = useCallback(() => setShowGovernment((value) => !value), []);
  const handleOpenCity = useCallback((feature: GeoFeature) => { void openCity(feature); }, [openCity]);
  const handleFoodSelect = useCallback((food: { id: string }) => navigate(`/food/${food.id}`), [navigate]);
  const handleClosePreview = useCallback(() => setSelectedAttraction(null), []);

  const activeBounds = useMemo<GeoBounds>(() => {
    if (selectedDistrict) return getFeatureBounds(selectedDistrict);
    if (selectedCity) return getFeatureBounds(selectedCity);
    if (features.length) return mergeFeatureBounds(features);
    return { minLng: 105, maxLng: 107.1, minLat: 35.2, maxLat: 39.5 };
  }, [features, selectedCity, selectedDistrict]);

  const project = useMemo(() => createProjection(activeBounds, mapView.width, mapView.height, selectedDistrict ? 90 : 54), [activeBounds, selectedDistrict]);
  const activeCityId = cityIdFromFeature(selectedCity);
  const visibleAttractions = useMemo(() => {
    if (selectedDistrict) return publishedAttractions.filter((item) => containsCoordinates(activeBounds, item.coordinates.lng, item.coordinates.lat));
    if (activeCityId) return getPublishedAttractionsByCity(activeCityId);
    return publishedAttractions;
  }, [activeBounds, selectedDistrict, activeCityId]);
  const visibleHubs = useMemo(() => transportHubs.filter((hub) => !activeCityId || hub.cityId === activeCityId), [activeCityId]);
  const mapFeatures = useMemo(() => selectedCity ? (districts.length ? districts : [selectedCity]) : features, [selectedCity, districts, features]);
  const levelLabel = selectedDistrict ? featureName(selectedDistrict) : selectedCity ? featureName(selectedCity) : '宁夏全区';

  if (loading) return <div className="map-state" role="status"><span className="map-loader" />正在铺开宁夏地图…</div>;
  if (error) return (
    <div className="map-state map-error" role="alert">
      <strong>地图暂时没有加载出来</strong><p>{error}</p>
      <div className="map-state-actions"><button type="button" className="btn-primary" onClick={() => setReloadKey((value) => value + 1)}>重新加载</button><Link to="/attractions" className="btn-secondary">改用景点列表</Link></div>
    </div>
  );

  return (
    <section className="interactive-map" aria-label="宁夏交互式旅游地图">
      <MapControls
        levelLabel={levelLabel}
        selectedCity={selectedCity}
        selectedDistrict={selectedDistrict}
        showTransport={showTransport}
        showFood={showFood}
        showGovernment={showGovernment}
        onBackToProvince={backToProvince}
        onBackToCity={backToCity}
        onToggleTransport={toggleTransport}
        onToggleFood={toggleFood}
        onToggleGovernment={toggleGovernment}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetViewport={resetViewport}
      />

      <div className="map-canvas-wrap">
        <svg
          viewBox={`0 0 ${mapView.width} ${mapView.height}`}
          className="map-canvas"
          aria-label={`${levelLabel}旅游地图，可用键盘选择城市和景点`}
          {...viewportHandlers}
        >
          <defs>
            <filter id="mapShadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#3a2f21" floodOpacity=".16" /></filter>
            <pattern id="mapGrain" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="3" cy="5" r=".7" fill="#7b633e" opacity=".12" /><circle cx="15" cy="13" r=".5" fill="#7b633e" opacity=".1" /></pattern>
          </defs>
          <rect width={mapView.width} height={mapView.height} rx="30" fill="#efe7d8" />
          <rect width={mapView.width} height={mapView.height} rx="30" fill="url(#mapGrain)" />
          <g transform={`translate(${mapView.width / 2 + pan.x} ${mapView.height / 2 + pan.y}) scale(${zoom}) translate(${-mapView.width / 2} ${-mapView.height / 2})`}>
            <MapRegionLayer
              features={mapFeatures}
              project={project}
              activeCityId={activeCityId}
              selectedDistrictCode={featureCode(selectedDistrict)}
              cityDetail={Boolean(selectedCity)}
              onOpenCity={handleOpenCity}
              onOpenDistrict={openDistrict}
            />
            <AttractionLayer attractions={visibleAttractions} project={project} selectedAttractionId={selectedAttraction?.id} onSelect={setSelectedAttraction} />
            {showGovernment && <GovernmentLayer markers={governmentMarkers} project={project} />}
            {showFood && <FoodLayer foods={publishedFoods} project={project} onSelect={handleFoodSelect} />}
            {showTransport && <TransportLayer hubs={visibleHubs} project={project} />}
          </g>
        </svg>

        {selectedAttraction && <MapPreview attraction={selectedAttraction} onClose={handleClosePreview} />}
      </div>

      <div className="map-caption">
        <p><strong>{visibleAttractions.length}</strong> 个公开景点</p>
        <p>{selectedCity ? '选择区县继续放大，或点选景点查看信息' : '选择城市进入下一级，地图支持拖动和缩放'}</p>
        {activeCityId && <Link to={`/city/${activeCityId}`} className="text-link">查看{getCityById(activeCityId)?.name}完整介绍</Link>}
      </div>
    </section>
  );
}
