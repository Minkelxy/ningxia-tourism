import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import Header from './components/Header';
import Loading from './components/Loading';

const Home = lazy(() => import('./pages/Home'));
const AttractionDetail = lazy(() => import('./pages/AttractionDetail'));
const AttractionsList = lazy(() => import('./pages/AttractionsList'));
const CityOverview = lazy(() => import('./pages/CityOverview'));
const RouteRecommendation = lazy(() => import('./pages/RouteRecommendation'));
const RouteDetail = lazy(() => import('./pages/RouteDetail'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'));
const GeoJSONViewer = import.meta.env.DEV ? lazy(() => import('./pages/GeoJSONViewer')) : null;
const GeoJSONEditor = import.meta.env.DEV ? lazy(() => import('./pages/GeoJSONEditor')) : null;

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
  return null;
}

function AppRoutes() {
  return (
    <div className="site-frame">
      <ScrollToTop />
      <Header />
      <div className="site-main"><Suspense fallback={<Loading />}><Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attractions" element={<AttractionsList />} />
        <Route path="/attraction/:id" element={<AttractionDetail />} />
        <Route path="/cities" element={<CityOverview />} />
        <Route path="/city/:name" element={<CityOverview />} />
        <Route path="/routes" element={<RouteRecommendation />} />
        <Route path="/routes/:routeId" element={<RouteDetail />} />
        <Route path="/about" element={<About />} />
        {GeoJSONViewer && <Route path="/dev/geojson" element={<GeoJSONViewer />} />}
        {GeoJSONEditor && <Route path="/dev/editor" element={<GeoJSONEditor />} />}
        <Route path="*" element={<NotFound />} />
      </Routes></Suspense></div>
      <Footer />
    </div>
  );
}

export default function App() {
  return <ErrorBoundary><BrowserRouter basename={import.meta.env.BASE_URL}><AppRoutes /></BrowserRouter></ErrorBoundary>;
}
