import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';

const Home = lazy(() => import('./pages/Home'));
const AttractionDetail = lazy(() => import('./pages/AttractionDetail'));
const CityOverview = lazy(() => import('./pages/CityOverview'));
const RouteRecommendation = lazy(() => import('./pages/RouteRecommendation'));
const GeoJSONViewer = lazy(() => import('./pages/GeoJSONViewer'));
const GeoJSONEditor = lazy(() => import('./pages/GeoJSONEditor'));
const AttractionsList = lazy(() => import('./pages/AttractionsList'));
const NotFound = lazy(() => import('./pages/NotFound'));
const About = lazy(() => import('./pages/About'));

function App() {
  const basename = import.meta.env.BASE_URL || '/';
  
  return (
    <ErrorBoundary>
      <Router basename={basename}>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          <main className="flex-1 pt-16">
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/attraction/:id" element={<AttractionDetail />} />
                <Route path="/cities" element={<CityOverview />} />
                <Route path="/city/:name" element={<CityOverview />} />
                <Route path="/routes" element={<RouteRecommendation />} />
                <Route path="/about" element={<About />} />
                <Route path="/geojson" element={<GeoJSONViewer />} />
                <Route path="/editor" element={<GeoJSONEditor />} />
                <Route path="/attractions" element={<AttractionsList />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
