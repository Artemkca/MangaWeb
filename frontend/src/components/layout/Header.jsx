import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserMenu from './UserMenu';

const LoginIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" y1="12" x2="3" y2="12" />
  </svg>
);

export default function Header({ onOpenSearch }) {
  const location = useLocation();
  const { session, handleAuthButtonClick } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="logo">MangaFlow</Link>

        <nav className="nav nav--desktop">
          <button type="button" className="nav__btn" onClick={onOpenSearch}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            Поиск
          </button>
          <Link to="/catalog" className={`nav__btn${isActive('/catalog') ? ' nav__btn--active' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
            Каталог
          </Link>
          <button type="button" className="nav__btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
            Ещё
          </button>
          {session && (
            <Link to="/admin" className={`nav__btn${isActive('/admin') ? ' nav__btn--active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              Админ
            </Link>
          )}
        </nav>

        <div className="header__actions">
          {session ? (
            <UserMenu />
          ) : (
            <button
              type="button"
              className="btn btn--login"
              title="Войти"
              onClick={handleAuthButtonClick}
            >
              <LoginIcon />
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
