import { Link } from 'react-router-dom';
import { Home, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full mx-auto mb-8 flex items-center justify-center">
          <MapPin className="w-12 h-12 text-primary" />
        </div>
        
        <h1 className="text-6xl font-serif font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-serif font-semibold text-text-primary mb-4">
          页面未找到
        </h2>
        <p className="text-text-secondary mb-8">
          您访问的页面不存在或已被移除，请返回首页继续探索宁夏美景。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-sand-dark transition-colors"
          >
            <Home className="w-5 h-5" />
            返回首页
          </Link>
          
          <Link
            to="/attractions"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-oasis transition-colors"
          >
            <MapPin className="w-5 h-5" />
            浏览景点
          </Link>
        </div>
      </div>
    </div>
  );
}
