import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { assetUrl } from '../lib/site';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
}

export default function SEO({
  title = '塞上江南 · 宁夏旅行地图',
  description = '探索宁夏五座城市、分级核实的景点、七条主题路线、旅行手记与资料专题。',
  image = 'og.jpg',
  imageAlt = '宁夏旅行地图：地图、路线与旅行手记',
  noIndex = false,
  type = 'website',
  publishedAt,
  updatedAt,
  author,
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
    const removeMeta = (key: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
    };
    const canonicalUrl = `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, '')}${location.pathname}`;
    const imageUrl = `${window.location.origin}${assetUrl(image)}`;
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;
    setMeta('description', description);
    setMeta('robots', noIndex ? 'noindex,nofollow' : 'index,follow');
    setMeta('og:title', title, true); setMeta('og:description', description, true); setMeta('og:type', type, true); setMeta('og:url', canonicalUrl, true);
    setMeta('og:image', imageUrl, true); setMeta('og:image:alt', imageAlt, true);
    setMeta('twitter:card', 'summary_large_image'); setMeta('twitter:title', title); setMeta('twitter:description', description); setMeta('twitter:image', imageUrl); setMeta('twitter:image:alt', imageAlt);
    if (type === 'article' && publishedAt && updatedAt) {
      setMeta('article:published_time', publishedAt, true);
      setMeta('article:modified_time', updatedAt, true);
      if (author) setMeta('article:author', author, true);
    } else {
      removeMeta('article:published_time', true); removeMeta('article:modified_time', true); removeMeta('article:author', true);
    }
    let structuredData = document.head.querySelector<HTMLScriptElement>('#site-structured-data');
    if (type === 'article' && publishedAt && updatedAt && !noIndex) {
      if (!structuredData) { structuredData = document.createElement('script'); structuredData.id = 'site-structured-data'; structuredData.type = 'application/ld+json'; document.head.appendChild(structuredData); }
      structuredData.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: title, description, image: imageUrl, datePublished: publishedAt, dateModified: updatedAt, author: { '@type': 'Person', name: author || '站主手记' }, mainEntityOfPage: canonicalUrl });
    } else structuredData?.remove();
  }, [title, description, image, imageAlt, noIndex, type, publishedAt, updatedAt, author, location.pathname]);
  return null;
}
