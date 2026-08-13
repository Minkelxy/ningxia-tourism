import type { Attraction, Coordinates } from '../types';

export const assetUrl = (path: string) => {
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
};

export const createAmapMarkerUrl = (name: string, coordinates?: Coordinates) => {
  const params = new URLSearchParams({ src: 'ningxia-tourism', callnative: '1' });
  if (coordinates) {
    params.set('position', `${coordinates.lng},${coordinates.lat}`);
    params.set('name', name);
    params.set('coordinate', 'wgs84');
    return `https://uri.amap.com/marker?${params.toString()}`;
  }
  params.set('keyword', name);
  params.set('view', 'map');
  return `https://uri.amap.com/search?${params.toString()}`;
};

export const attractionMapUrl = (attraction: Attraction) => createAmapMarkerUrl(attraction.name, attraction.coordinates);

export const sharePage = async (title: string, text: string) => {
  const url = window.location.href;
  if (navigator.share) {
    await navigator.share({ title, text, url });
    return '已打开系统分享';
  }
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(url);
    return '链接已复制';
  }
  return '请复制浏览器地址分享';
};

export const formatVerifiedDate = (date: string) => date ? date.replace(/-/g, '.') : '核实中';
