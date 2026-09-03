import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Header from './components/Header';
import Loading from './components/Loading';
import NetworkStatus from './components/NetworkStatus';
import ServiceWorkerUpdate from './components/ServiceWorkerUpdate';
import { FavoritesProvider } from './lib/favorites';

const Home = lazy(() => import('./pages/Home'));
const AttractionDetail = lazy(() => import('./pages/AttractionDetail'));
const AttractionsList = lazy(() => import('./pages/AttractionsList'));
const FoodDetail = lazy(() => import('./pages/FoodDetail'));
const FoodsList = lazy(() => import('./pages/FoodsList'));
const CityOverview = lazy(() => import('./pages/CityOverview'));
const RouteRecommendation = lazy(() => import('./pages/RouteRecommendation'));
const RouteDetail = lazy(() => import('./pages/RouteDetail'));
const Journal = lazy(() => import('./pages/Journal'));
const JournalDetail = lazy(() => import('./pages/JournalDetail'));
const TravelGuide = lazy(() => import('./pages/TravelGuide'));
const About = lazy(() => import('./pages/About'));
const Favorites = lazy(() => import('./pages/Favorites'));
const Search = lazy(() => import('./pages/Search'));
const NotFound = lazy(() => import('./pages/NotFound'));
const GeoJSONViewer = import.meta.env.DEV ? lazy(() => import('./pages/GeoJSONViewer')) : null;
const GeoJSONEditor = import.meta.env.DEV ? lazy(() => import('./pages/GeoJSONEditor')) : null;

function ScrollToTop() {
  const location = useLocation();
  // 仅在 pathname 变化时回到顶部；筛选改变 search 参数时保留滚动位置，
  // 避免列表页调整筛选后页面跳到顶部打断浏览。
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return null;
}

export function RouteFocusManager() {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);

  useEffect(() => {
    if (previousPathRef.current === location.pathname) return;
    previousPathRef.current = location.pathname;

    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement && activeElement.classList.contains('mobile-menu-button')) return;

    document.getElementById('main-content')?.focus({ preventScroll: true });
  }, [location.pathname]);

  return null;
}

export function RouteAnnouncer() {
  const location = useLocation();
  const [message, setMessage] = useState('');
  useEffect(() => {
    // 同一路径切换筛选或搜索参数时，也需要让 aria-live 产生一次新的播报。
    setMessage('');
    const timer = window.setTimeout(() => setMessage(document.title), 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);
  return <div key={`${location.pathname}${location.search}`} className="sr-only" aria-live="polite" aria-atomic="true">{message}</div>;
}

function AppRoutes() {
  const location = useLocation();

  return (
    <div className="site-frame">
      <a href="#main-content" className="skip-link">跳到主要内容</a>
      <ScrollToTop />
      <RouteFocusManager />
      <RouteAnnouncer />
      <Header />
      <NetworkStatus />
      <ServiceWorkerUpdate />
      <main className="site-main" id="main-content" tabIndex={-1}><div key={location.pathname} className="route-transition"><Suspense fallback={<Loading />}><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attractions" element={<AttractionsList />} />
        <Route path="/attraction/:id" element={<AttractionDetail />} />
        <Route path="/foods" element={<FoodsList />} />
        <Route path="/food/:id" element={<FoodDetail />} />
        <Route path="/cities" element={<CityOverview />} />
        <Route path="/city/:name" element={<CityOverview />} />
        <Route path="/routes" element={<RouteRecommendation />} />
        <Route path="/routes/:routeId" element={<RouteDetail />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/journal/:type/:slug" element={<JournalDetail />} />
        <Route path="/guide" element={<TravelGuide />} />
        <Route path="/about" element={<About />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/search" element={<Search />} />
        {GeoJSONViewer && <Route path="/dev/geojson" element={<GeoJSONViewer />} />}
        {GeoJSONEditor && <Route path="/dev/editor" element={<GeoJSONEditor />} />}
        <Route path="*" element={<NotFound />} />
      </Routes></Suspense></div></main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <ErrorBoundary><BrowserRouter basename={import.meta.env.BASE_URL}><FavoritesProvider><AppRoutes /></FavoritesProvider></BrowserRouter></ErrorBoundary>;
}
