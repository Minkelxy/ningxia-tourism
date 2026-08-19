import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type FavoriteKind = 'attraction' | 'route';
type FavoriteState = Record<FavoriteKind, string[]>;
const STORAGE_KEY = 'ningxia-tourism-favorites';
const emptyState: FavoriteState = { attraction: [], route: [] };

function readFavorites(): FavoriteState {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}') as Partial<FavoriteState>;
    return { attraction: Array.isArray(value.attraction) ? value.attraction : [], route: Array.isArray(value.route) ? value.route : [] };
  } catch { return emptyState; }
}

const FavoritesContext = createContext<{
  favorites: FavoriteState;
  count: number;
  isFavorite: (kind: FavoriteKind, id: string) => boolean;
  toggleFavorite: (kind: FavoriteKind, id: string) => void;
  clearFavorites: () => void;
} | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteState>(() => readFavorites());
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => { if (event.key === STORAGE_KEY) setFavorites(readFavorites()); };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  const value = useMemo(() => ({
    favorites,
    count: favorites.attraction.length + favorites.route.length,
    isFavorite: (kind: FavoriteKind, id: string) => favorites[kind].includes(id),
    toggleFavorite: (kind: FavoriteKind, id: string) => setFavorites((current) => {
      const ids = current[kind].includes(id) ? current[kind].filter((item) => item !== id) : [...current[kind], id];
      const next = { ...current, [kind]: ids };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    }),
    clearFavorites: () => { window.localStorage.removeItem(STORAGE_KEY); setFavorites(emptyState); },
  }), [favorites]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

// The hook intentionally lives beside its provider so the browser-only storage contract stays local.
// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider');
  return context;
}
