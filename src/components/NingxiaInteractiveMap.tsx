import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
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
import MapLabelLayer from './map/MapLabelLayer';
import MapPreview from './map/MapPreview';
import MapRegionLayer from './map/MapRegionLayer';
import TransportLayer from './map/TransportLayer';
import {
  buildDistrictColorMap,
  cityColors,
  cityIdFromFeature,
  districtFileByCode,
  featureCode,
  featureName,
  governmentMarkers,
  mapView,
} from './map/config';
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
  const [focusedFeatureCode, setFocusedFeatureCode] = useState<string | undefined>(undefined);
  const [legendHighlightCode, setLegendHighlightCode] = useState<string | undefined>(undefined);
  const districtRequestRef = useRef<AbortController | null>(null);
  const districtCacheRef = useRef<Map<string, GeoFeature[]>>(new Map());
  const { zoom, pan, zoomIn, zoomOut, resetViewport, viewportHandlers } = useMapViewport();

  const loadProvince = useCallback(async (signal: AbortSignal) => {
    setLoading(true);
    setError('');
    try {
      const mobileMap =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(max-width: 768px)').matches;
      const file = mobileMap ? 'ningxia-province-mobile.json' : 'ningxia-province.json';
      const response = await fetch(`${import.meta.env.BASE_URL}data/${file}`, { signal });
      if (!response.ok) throw new Error('地图数据请求失败');
      const data = (await response.json()) as { type: string; features?: GeoFeature[] };
      if (data.type !== 'FeatureCollection' || !data.features?.length)
        throw new Error('地图数据格式不正确');
      if (signal.aborted) return;
      setFeatures(data.features);
    } catch (reason) {
      if (signal.aborted) return;
      setError(reason instanceof Error ? reason.message : '地图暂时无法加载');
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadProvince(controller.signal);
    return () => controller.abort();
  }, [loadProvince, reloadKey]);
  useEffect(() => () => districtRequestRef.current?.abort(), []);

  const openCity = useCallback(
    async (feature: GeoFeature) => {
      districtRequestRef.current?.abort();
      const controller = new AbortController();
      districtRequestRef.current = controller;
      setSelectedCity(feature);
      setSelectedDistrict(null);
      setSelectedAttraction(null);
      setDistricts([]);
      setFocusedFeatureCode(undefined);
      setLegendHighlightCode(undefined);
      resetViewport();
      const file = districtFileByCode[feature.properties.code || ''];
      if (!file) return;
      const cachedDistricts = districtCacheRef.current.get(file);
      if (cachedDistricts) {
        setDistricts(cachedDistricts);
        return;
      }
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/ningxia/districts/${file}.json`,
          { signal: controller.signal },
        );
        if (!response.ok) throw new Error('区县数据加载失败');
        const data = (await response.json()) as { features?: GeoFeature[] };
        if (controller.signal.aborted) return;
        const nextDistricts = data.features ?? [];
        districtCacheRef.current.set(file, nextDistricts);
        setDistricts(nextDistricts);
      } catch {
        if (!controller.signal.aborted) setDistricts([]);
      }
    },
    [resetViewport],
  );

  const openDistrict = useCallback(
    (feature: GeoFeature) => {
      setSelectedDistrict(feature);
      setSelectedAttraction(null);
      resetViewport();
    },
    [resetViewport],
  );

  const backToProvince = useCallback(() => {
    districtRequestRef.current?.abort();
    setSelectedCity(null);
    setSelectedDistrict(null);
    setDistricts([]);
    setSelectedAttraction(null);
    setFocusedFeatureCode(undefined);
    setLegendHighlightCode(undefined);
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
  const handleOpenCity = useCallback(
    (feature: GeoFeature) => {
      void openCity(feature);
    },
    [openCity],
  );
  const handleFoodSelect = useCallback(
    (food: { id: string }) => navigate(`/food/${food.id}`),
    [navigate],
  );
  const handleClosePreview = useCallback(() => setSelectedAttraction(null), []);
  const handleRegionFocus = useCallback((feature: GeoFeature | null) => {
    setFocusedFeatureCode(feature ? featureCode(feature) : undefined);
  }, []);

  const activeBounds = useMemo<GeoBounds>(() => {
    if (selectedDistrict) return getFeatureBounds(selectedDistrict);
    if (selectedCity) return getFeatureBounds(selectedCity);
    if (features.length) return mergeFeatureBounds(features);
    return { minLng: 105, maxLng: 107.1, minLat: 35.2, maxLat: 39.5 };
  }, [features, selectedCity, selectedDistrict]);

  const project = useMemo(
    () =>
      createProjection(
        activeBounds,
        mapView.width,
        mapView.height,
        selectedDistrict ? 90 : 54,
      ),
    [activeBounds, selectedDistrict],
  );
  const activeCityId = cityIdFromFeature(selectedCity);
  const visibleAttractions = useMemo(() => {
    if (selectedDistrict)
      return publishedAttractions.filter((item) =>
        containsCoordinates(activeBounds, item.coordinates.lng, item.coordinates.lat),
      );
    if (activeCityId) return getPublishedAttractionsByCity(activeCityId);
    return publishedAttractions;
  }, [activeBounds, selectedDistrict, activeCityId]);
  const handleMarkerPointer = useCallback((event: ReactMouseEvent<SVGSVGElement> | ReactPointerEvent<SVGSVGElement>) => {
    const candidates = [...event.currentTarget.querySelectorAll<SVGCircleElement>('.marker-hit')]
      .map((hit) => {
        const marker = hit.closest<SVGGElement>('[data-attraction-id], [data-food-id]');
        if (!marker) return null;
        const rect = hit.getBoundingClientRect();
        const distance = Math.hypot(event.clientX - (rect.left + rect.width / 2), event.clientY - (rect.top + rect.height / 2));
        return { marker, distance, radius: Math.min(rect.width, rect.height) / 2 };
      })
      .filter((item): item is { marker: SVGGElement; distance: number; radius: number } => Boolean(item && item.distance <= item.radius))
      .sort((left, right) => left.distance - right.distance);
    const nearest = candidates[0];
    if (!nearest) return;

    event.preventDefault();
    event.stopPropagation();
    const attractionId = nearest.marker.dataset.attractionId;
    if (attractionId) {
      const attraction = visibleAttractions.find((item) => item.id === attractionId);
      if (attraction) setSelectedAttraction(attraction);
      return;
    }
    const foodId = nearest.marker.dataset.foodId;
    if (foodId) navigate(`/food/${foodId}`);
  }, [navigate, visibleAttractions]);
  const visibleHubs = useMemo(
    () => transportHubs.filter((hub) => !activeCityId || hub.cityId === activeCityId),
    [activeCityId],
  );
  const mapFeatures = useMemo(
    () => (selectedCity ? (districts.length ? districts : [selectedCity]) : features),
    [selectedCity, districts, features],
  );
  const labelFeatures = useMemo(
    () => (selectedCity ? districts : features),
    [selectedCity, districts, features],
  );
  const levelLabel = selectedDistrict
    ? featureName(selectedDistrict)
    : selectedCity
      ? featureName(selectedCity)
      : '宁夏全区';

  // Task 4: 区县颜色映射（仅市级视图）
  const districtColorMap = useMemo(() => {
    if (!selectedCity || !activeCityId) return undefined;
    const districtsWithIndex = districts.map((d, i) => ({
      code: featureCode(d),
      index: i,
    }));
    return buildDistrictColorMap(activeCityId, districtsWithIndex);
  }, [selectedCity, activeCityId, districts]);

  // 图例悬停高亮需要同步到 focusedFeatureCode
  useEffect(() => {
    if (legendHighlightCode && focusedFeatureCode !== legendHighlightCode) {
      setFocusedFeatureCode(legendHighlightCode);
    } else if (!legendHighlightCode && focusedFeatureCode) {
      // 只有当当前聚焦来自图例（没有真的键盘聚焦）时才清
    }
  }, [legendHighlightCode, focusedFeatureCode]);

  const legendEntries = useMemo(() => {
    if (!selectedCity || !activeCityId) return [];
    return districts.map((d) => ({
      code: featureCode(d),
      name: featureName(d),
      color: districtColorMap?.[featureCode(d)] ?? cityColors[activeCityId],
    }));
  }, [selectedCity, activeCityId, districts, districtColorMap]);

  const effectiveFocusedCode = legendHighlightCode ?? focusedFeatureCode;
  const selectedFeatureCode = featureCode(selectedDistrict) || undefined;

  if (loading)
    return (
      <div className="map-state" role="status">
        <span className="map-loader" />
        正在铺开宁夏地图…
      </div>
    );
  if (error)
    return (
      <div className="map-state map-error" role="alert">
        <strong>地图暂时没有加载出来</strong>
        <p>{error}</p>
        <div className="map-state-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => setReloadKey((value) => value + 1)}
          >
            重新加载
          </button>
          <Link to="/attractions" className="btn-secondary">
            改用景点列表
          </Link>
        </div>
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
          onPointerDownCapture={handleMarkerPointer}
          onClickCapture={handleMarkerPointer}
          {...viewportHandlers}
        >
          <defs>
            {/* —— Task 5: 升级 defs，新增渐变/滤镜 —— */}
            <radialGradient id="mapBgGradient" cx="50%" cy="42%" r="78%">
              <stop offset="0%" stopColor="#f7efdd" />
              <stop offset="60%" stopColor="#ecdfc6" />
              <stop offset="100%" stopColor="#d9c9ab" />
            </radialGradient>

            <filter
              id="mapShadow"
              x="-30%"
              y="-30%"
              width="160%"
              height="160%"
            >
              <feDropShadow
                dx="0"
                dy="5"
                stdDeviation="7"
                floodColor="#3a2f21"
                floodOpacity=".16"
              />
            </filter>

            {/* 柔和外发光（羊皮纸轮廓感）—— 包裹整个 MapRegionLayer 组 */}
            <filter id="mapGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
              <feFlood floodColor="#c89d4d" floodOpacity="0.18" result="glowColor" />
              <feComposite in="glowColor" in2="blur" operator="in" result="softGlow" />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* 内阴影滤镜：模拟区域内描边+微立体 */}
            <filter
              id="mapRegionInnerShadow"
              x="-10%"
              y="-10%"
              width="120%"
              height="120%"
            >
              <feOffset dx="0" dy="1.5" in="SourceAlpha" result="off" />
              <feGaussianBlur stdDeviation="1.6" in="off" result="shadowBlur" />
              <feComposite
                operator="out"
                in="shadowBlur"
                in2="SourceAlpha"
                result="innerOnly"
              />
              <feFlood floodColor="#2a1f11" floodOpacity="0.35" result="shade" />
              <feComposite operator="in" in="shade" in2="innerOnly" result="innerShade" />
              <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="innerShade" />
              </feMerge>
            </filter>

            <pattern
              id="mapGrain"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="3" cy="5" r=".7" fill="#7b633e" opacity=".12" />
              <circle cx="15" cy="13" r=".5" fill="#7b633e" opacity=".1" />
            </pattern>
          </defs>

          {/* 背景：径向渐变替代纯色，保留颗粒纹理 */}
          <rect
            width={mapView.width}
            height={mapView.height}
            rx="30"
            fill="url(#mapBgGradient)"
          />
          <rect
            width={mapView.width}
            height={mapView.height}
            rx="30"
            fill="url(#mapGrain)"
          />

          <g
            transform={`translate(${mapView.width / 2 + pan.x} ${mapView.height / 2 + pan.y}) scale(${zoom}) translate(${-mapView.width / 2} ${-mapView.height / 2})`}
          >
            <g filter="url(#mapGlow)">
              <MapRegionLayer
                features={mapFeatures}
                project={project}
                activeCityId={activeCityId}
                selectedDistrictCode={selectedFeatureCode}
                focusedFeatureCode={effectiveFocusedCode}
                cityDetail={Boolean(selectedCity)}
                districtColorMap={districtColorMap}
                onOpenCity={handleOpenCity}
                onOpenDistrict={openDistrict}
                onRegionFocus={handleRegionFocus}
              />
            </g>

            {/* —— Task 4: 标签层 —— */}
            <MapLabelLayer
              features={labelFeatures}
              project={project}
              cityDetail={Boolean(selectedCity)}
              selectedFeatureCode={selectedFeatureCode}
              focusedFeatureCode={effectiveFocusedCode}
            />

            <AttractionLayer
              attractions={visibleAttractions}
              project={project}
              selectedAttractionId={selectedAttraction?.id}
              onSelect={setSelectedAttraction}
            />
            {showGovernment && (
              <GovernmentLayer markers={governmentMarkers} project={project} />
            )}
            {showFood && (
              <FoodLayer foods={publishedFoods} project={project} onSelect={handleFoodSelect} />
            )}
            {showTransport && <TransportLayer hubs={visibleHubs} project={project} />}
          </g>
        </svg>

        {selectedAttraction && (
          <MapPreview attraction={selectedAttraction} onClose={handleClosePreview} />
        )}

        {/* —— Task 4 (AC-10): 市级视图分区图例 —— */}
        {legendEntries.length > 0 && (
          <div className="map-legend" role="list" aria-label={`${featureName(selectedCity)}区县颜色图例`}>
            <div className="map-legend__title">区县图例</div>
            <ul>
              {legendEntries.map((entry) => {
                const active = effectiveFocusedCode === entry.code || selectedFeatureCode === entry.code;
                return (
                  <li
                    key={entry.code}
                    role="listitem"
                    className={`map-legend__item ${active ? 'is-active' : ''}`}
                    onMouseEnter={() => setLegendHighlightCode(entry.code)}
                    onMouseLeave={() =>
                      setLegendHighlightCode((prev) => (prev === entry.code ? undefined : prev))
                    }
                  >
                    <span
                      className="map-legend__swatch"
                      style={{ backgroundColor: entry.color }}
                      aria-hidden="true"
                    />
                    <span className="map-legend__name">{entry.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="map-caption">
        <p>
          <strong>{visibleAttractions.length}</strong> 个公开景点
        </p>
        <p>
          {selectedCity
            ? '选择区县继续放大，或点选景点查看信息'
            : '选择城市进入下一级；普通滚轮滚页面，Ctrl/Cmd + 滚轮缩放地图'}
        </p>
        {activeCityId && (
          <Link to={`/city/${activeCityId}`} className="text-link">
            查看{getCityById(activeCityId)?.name}完整介绍
          </Link>
        )}
      </div>
    </section>
  );
}
