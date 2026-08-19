import { Heart } from 'lucide-react';
import { useFavorites, type FavoriteKind } from '../lib/favorites';

export default function FavoriteButton({ kind, id, label }: { kind: FavoriteKind; id: string; label: string }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(kind, id);
  return <button type="button" className={`favorite-button ${active ? 'is-active' : ''}`} aria-pressed={active} aria-label={active ? `取消收藏${label}` : `收藏${label}`} title={active ? '取消收藏' : '收藏'} onClick={(event) => { event.preventDefault(); event.stopPropagation(); toggleFavorite(kind, id); }}><Heart aria-hidden="true" fill={active ? 'currentColor' : 'none'} /><span>{active ? '已收藏' : '收藏'}</span></button>;
}
