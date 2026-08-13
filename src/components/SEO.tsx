import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { assetUrl } from '../lib/site';

interface SEOProps { title?: string; description?: string; image?: string; noIndex?: boolean }

export default function SEO({
  title = '塞上江南 · 宁夏旅行地图',
  description = '探索宁夏五座城市、十二个已核实景点与七条主题路线。',
  image = 'og.png',
  noIndex = false,
}: SEOProps) {
  const location = useLocation();
  useEffect(() => {
    document.title = title;
    const setMeta = (key: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.appendChild(element); }
      element.content = content;
    };
    const canonicalUrl = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}${location.pathname}`;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;
    setMeta('description', description);
    setMeta('robots', noIndex ? 'noindex,nofollow' : 'index,follow');
    setMeta('og:title', title, true); setMeta('og:description', description, true); setMeta('og:type', 'website', true); setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', `${window.location.origin}${assetUrl(image)}`, true);
    setMeta('twitter:card', 'summary_large_image'); setMeta('twitter:title', title); setMeta('twitter:description', description); setMeta('twitter:image', `${window.location.origin}${assetUrl(image)}`);
  }, [title, description, image, noIndex, location.pathname]);
  return null;
}
