import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function MobileNav({ onOpenSearch }) {
  const location = useLocation();
  const { session, handleAuthButtonClick } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-nav">
      <Link to="/" className={`mobile-nav__item${isActive('/') ? ' mobile-nav__item--active' : ''}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
        <span>Главная</span>
      </Link>
      <Link to="/catalog" className={`mobile-nav__item${isActive('/catalog') ? ' mobile-nav__item--active' : ''}`}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
        <span>Каталог</span>
      </Link>
      <button type="button" className="mobile-nav__item" onClick={onOpenSearch}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
        <span>Поиск</span>
      </button>
      <button type="button" className="mobile-nav__item" onClick={handleAuthButtonClick}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
        <span>{session ? session.username : 'Войти'}</span>
      </button>
    </nav>
  );
}
