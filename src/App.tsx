import { Suspense, lazy, useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Header from './components/Header';
import Loading from './components/Loading';
import NetworkStatus from './components/NetworkStatus';
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
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return null;
}

function RouteAnnouncer() {
  const location = useLocation();
  const [message, setMessage] = useState('');
  useEffect(() => {
    const timer = window.setTimeout(() => setMessage(document.title), 0);
    return () => window.clearTimeout(timer);
  }, [location.pathname]);
  return <div className="sr-only" aria-live="polite" aria-atomic="true">{message}</div>;
}

function AppRoutes() {
  return (
    <div className="site-frame">
      <a href="#main-content" className="skip-link">跳到主要内容</a>
      <ScrollToTop />
      <RouteAnnouncer />
      <Header />
      <NetworkStatus />
      <main className="site-main" id="main-content" tabIndex={-1}><Suspense fallback={<Loading />}><Routes>
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
      </Routes></Suspense></main>
      <Footer />
    </div>
  );
}

export default function App() {
  return <ErrorBoundary><BrowserRouter basename={import.meta.env.BASE_URL}><FavoritesProvider><AppRoutes /></FavoritesProvider></BrowserRouter></ErrorBoundary>;
}
