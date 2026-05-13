import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

export default function SEO({
  title = '塞上江南·神奇宁夏 - 宁夏旅游地图',
  description = '探索宁夏回族自治区的独特魅力，发现壮丽的沙漠风光、深厚的历史文化和浓郁的民族风情',
  keywords = '宁夏旅游,塞上江南,沙坡头,西夏王陵,宁夏景点,银川旅游,中卫旅游',
  ogImage,
  ogType = 'website',
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    document.title = title;
    
    const updateMeta = (name: string, content: string, isProperty = false) => {
      let element = document.querySelector(`${isProperty ? 'meta[property="' : 'meta[name="'}${name}${isProperty ? '"]' : '"]'}`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(isProperty ? 'property' : 'name', name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('keywords', keywords);
    
    const canonicalUrl = window.location.origin + location.pathname;
    let canonicalElement = document.querySelector('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement('link');
      canonicalElement.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.setAttribute('href', canonicalUrl);
    
    updateMeta('og:title', title, true);
    updateMeta('og:description', description, true);
    updateMeta('og:type', ogType, true);
    updateMeta('og:url', canonicalUrl, true);
    if (ogImage) {
      updateMeta('og:image', ogImage, true);
    }
    updateMeta('og:locale', 'zh_CN', true);
    
    updateMeta('twitter:card', 'summary_large_image');
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', description);
    
    return () => {
    };
  }, [title, description, keywords, ogImage, ogType, location.pathname]);

  return null;
}
