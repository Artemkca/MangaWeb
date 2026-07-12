import { useEffect, useRef } from 'react';
import { searchResults, searchTags } from '../../data/mockData';

export default function SearchOverlay({ open, onClose }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !open) {
        e.preventDefault();
        onClose(true);
      }
      if (e.key === 'Escape' && open) onClose(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <div className={`search-overlay${open ? ' search-overlay--open' : ''}`}>
      <div className="search-overlay__backdrop" onClick={() => onClose(false)} />
      <div className="search-overlay__panel">
        <div className="search-overlay__header">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          <input ref={inputRef} type="text" className="search-overlay__input" placeholder="Поиск манги, авторов, тегов..." />
          <button type="button" className="search-overlay__close" onClick={() => onClose(false)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="search-overlay__body">
          <div className="search-overlay__section">
            <h4>Недавние запросы</h4>
            <div className="search-tags">
              {searchTags.map(tag => <span key={tag} className="search-tag">{tag}</span>)}
            </div>
          </div>
          <div className="search-overlay__section">
            <h4>Популярное сейчас</h4>
            <div className="search-results">
              {searchResults.map(item => (
                <div key={item.title} className="search-result">
                  <div className={`search-result__cover cover cover--${item.cover}`} />
                  <div className="search-result__info">
                    <span className="search-result__type">{item.type}</span>
                    <span className="search-result__title">{item.title}</span>
                    <span className="search-result__meta">{item.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
