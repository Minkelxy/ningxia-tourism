import { Mail, Phone, MapPin } from 'lucide-react';

export default function About() {
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
            <p className="text-text-secondary mb-6">
              如有任何问题或建议，欢迎通过以下方式联系我们：
            </p>
            <div className="mt-4 space-y-4 text-text-secondary">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <p>邮箱: contact@ningxia-tourism.com</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <p>电话: 400-888-8888</p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <p>地址: 宁夏回族自治区银川市</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
