import { Link } from 'react-router-dom';
import { MapPin, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-serif font-bold">塞上江南·神奇宁夏</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              探索宁夏之美，体验塞上江南的独特魅力。这里有壮丽的沙漠风光、
              深厚的历史文化、浓郁的民族风情，等待您的发现。
            </p>
          </div>

          <div>
            <h4 className="text-lg font-serif font-bold mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">首页地图</Link>
              </li>
              <li>
                <Link to="/cities" className="hover:text-primary transition-colors">城市概览</Link>
              </li>
              <li>
                <Link to="/routes" className="hover:text-primary transition-colors">路线推荐</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">关于我们</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-serif font-bold mb-4">热门景点</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>沙坡头 - 沙漠探险胜地</li>
              <li>西夏王陵 - 东方金字塔</li>
              <li>沙湖 - 沙漠碧波奇观</li>
              <li>六盘山 - 红色旅游圣地</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2024-2025 宁夏旅游地图. 探索塞上江南，发现神奇宁夏。
          </p>
          <p className="text-sm text-gray-400 flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-accent fill-current" /> in Ningxia
          </p>
        </div>
      </div>
    </footer>
  );
}
