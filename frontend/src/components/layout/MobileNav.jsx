import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

export default function MobileNav({ onOpenSearch }) {
  const location = useLocation();
  const { session, handleAuthButtonClick } = useAuth();

  const [avatarSrc, setAvatarSrc] = useState(() => localStorage.getItem('profileAvatar') || session?.avatar || '/default_avatar.jpg');

  useEffect(() => {
    const handleStorageChange = () => {
      setAvatarSrc(localStorage.getItem('profileAvatar') || session?.avatar || '/default_avatar.jpg');
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profile-updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleStorageChange);
    };
  }, [session]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-nav">
      <Link to="/" className={`mobile-nav__item${isActive('/') ? ' mobile-nav__item--active' : ''}`}>
        <div className="mobile-nav__icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v10H6V11H3l9-8z"/></svg>
        </div>
        <span>Главная</span>
      </Link>
      <Link to="/catalog" className={`mobile-nav__item${isActive('/catalog') ? ' mobile-nav__item--active' : ''}`}>
        <div className="mobile-nav__icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
        </div>
        <span>Каталог</span>
      </Link>
      <Link to="/bookmarks" className={`mobile-nav__item${isActive('/bookmarks') ? ' mobile-nav__item--active' : ''}`}>
        <div className="mobile-nav__icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <span>Моё</span>
      </Link>
      <button type="button" className="mobile-nav__item">
        <div className="mobile-nav__icon-wrapper">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        </div>
        <span>Уведы</span>
      </button>
      {session ? (
        <Link to="/profile" className={`mobile-nav__item${isActive('/profile') ? ' mobile-nav__item--active' : ''}`}>
          <div className="mobile-nav__icon-wrapper">
            <img src={avatarSrc} alt="Profile" style={{ width: 24, height: 24, borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <span>Профиль</span>
        </Link>
      ) : (
        <button type="button" className="mobile-nav__item" onClick={handleAuthButtonClick}>
          <div className="mobile-nav__icon-wrapper">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Guest" alt="Guest" style={{ width: 24, height: 24, borderRadius: '50%' }} />
          </div>
          <span>Войти</span>
        </button>
      )}
    </nav>
  );
}
