import { useCallback, useEffect, useState } from 'react';
import MangaCard from '../components/manga/MangaCard';
import CatalogSidebar from '../components/catalog/CatalogSidebar';
import { catalogInitial, extraManga } from '../data/mockData';

const MAX_PAGES = 8;
const BATCH_SIZE = 24;

export default function CatalogPage() {
  const [safeMode, setSafeMode] = useState(() => localStorage.getItem('site_safeMode') !== 'false');
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('site_compactMode') === 'true');
  
  const filteredCatalogInitial = safeMode ? catalogInitial.filter(m => !m.is18) : catalogInitial;
  const [items, setItems] = useState(filteredCatalogInitial);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const hasMore = page < MAX_PAGES;

  // Listen for changes from other tabs
  useEffect(() => {
    const handleSettingsUpdate = () => {
      const newSafeMode = localStorage.getItem('site_safeMode') !== 'false';
      const newCompactMode = localStorage.getItem('site_compactMode') === 'true';
      setSafeMode(newSafeMode);
      setCompactMode(newCompactMode);
      setItems(newSafeMode ? catalogInitial.filter(m => !m.is18) : catalogInitial);
      setPage(1); // Reset page on settings change to keep it simple
    };
    window.addEventListener('site-settings-updated', handleSettingsUpdate);
    return () => window.removeEventListener('site-settings-updated', handleSettingsUpdate);
  }, []);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setTimeout(() => {
      const extraSource = safeMode ? extraManga.filter(m => !m.is18) : extraManga;
      const batch = Array.from({ length: BATCH_SIZE }, (_, i) => {
        const source = extraSource[i % extraSource.length];
        return { ...source, cover: ((page * BATCH_SIZE + i) % 25) + 1 };
      });
      setItems(prev => [...prev, ...batch]);
      setPage(p => p + 1);
      setLoading(false);
    }, 600);
  }, [loading, hasMore, page, safeMode]);

  useEffect(() => {
    const onScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      if (scrollBottom >= document.body.offsetHeight - 400) loadMore();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loadMore]);

  return (
    <main className="page page--active">
      <div className="container container--wide">
        <div className="catalog-layout">
          <div className="catalog-main">
            <h1 className="catalog-title">Библиотека манги</h1>
            <div className="catalog-toolbar">
              <button type="button" className="catalog-sort">
                По популярности
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
              </button>
              <button type="button" className="catalog-sort">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 16 4 4 4-4M7 20V4M21 8l-4-4-4 4M17 4v16" /></svg>
                Показать сначала
              </button>
              <button type="button" className="catalog-filters-btn" onClick={() => setFiltersOpen(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" /></svg>
                Фильтры
              </button>
            </div>
            <div className={`manga-grid manga-grid--catalog ${compactMode ? 'manga-grid--compact' : ''}`}>
              {items.map(item => (
                <MangaCard key={`${item.title}-${item.cover}`} {...item} variant="catalog" />
              ))}
            </div>
            {hasMore && (
              <div className={`catalog-loader${loading ? ' catalog-loader--visible' : ''}`}>
                <span className="catalog-loader__spinner" />
                <span>Загрузка...</span>
              </div>
            )}
          </div>
          <CatalogSidebar open={filtersOpen} onClose={() => setFiltersOpen(false)} />
        </div>
      </div>
    </main>
  );
}
