import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const Home = lazy(() => import('./pages/Home'));
const AttractionDetail = lazy(() => import('./pages/AttractionDetail'));
const CityOverview = lazy(() => import('./pages/CityOverview'));
const RouteRecommendation = lazy(() => import('./pages/RouteRecommendation'));
const GeoJSONViewer = lazy(() => import('./pages/GeoJSONViewer'));
const GeoJSONEditor = lazy(() => import('./pages/GeoJSONEditor'));
const TopoMapPage = lazy(() => import('./pages/TopoMapPage'));
const GeoJSONMapPage = lazy(() => import('./pages/GeoJSONMapPage'));
const AttractionsList = lazy(() => import('./pages/AttractionsList'));

function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-secondary">加载中...</p>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold text-text-primary mb-8 text-center">
            关于我们
          </h1>
          
          <div className="bg-white rounded-xl p-8 shadow-soft mb-8">
            <h2 className="text-2xl font-serif font-bold text-text-primary mb-4">
              关于宁夏旅游地图
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              宁夏旅游地图是一款专注于宁夏回族自治区旅游景点的交互式地图网站。
              我们致力于为游客提供直观、便捷的旅游目的地探索体验，帮助您发现宁夏的独特魅力。
            </p>
            <p className="text-text-secondary leading-relaxed">
              宁夏，古称"塞上江南"，是中国五个少数民族自治区之一。这里有壮丽的沙漠风光、
              深厚的历史文化、浓郁的民族风情等待您的发现。
            </p>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-8">
            <h3 className="text-xl font-serif font-bold text-text-primary mb-4">
              联系我们
            </h3>
            <p className="text-text-secondary">
              如有任何问题或建议，欢迎通过以下方式联系我们：
            </p>
            <div className="mt-4 space-y-2 text-text-secondary">
              <p>邮箱: contact@ningxia-tourism.com</p>
              <p>电话: 400-888-8888</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
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
              <Route path="/topomap" element={<TopoMapPage />} />
              <Route path="/geojsonmap" element={<GeoJSONMapPage />} />
              <Route path="/attractions" element={<AttractionsList />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
