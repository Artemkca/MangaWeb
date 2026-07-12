import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  clearSession,
  decodeGoogleJwt,
  getSession,
  loginUser,
  registerUser,
  saveSession,
  signInWithGoogleProfile,
} from '../services/authService';

const AuthContext = createContext(null);

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [authMessage, setAuthMessage] = useState({ text: '', type: 'info' });
  const googleIdentityReady = useRef(false);

  const refreshSession = useCallback(() => {
    setSession(getSession());
  }, []);

  const openAuth = useCallback((tab = 'login') => {
    if (getSession()) return;
    setAuthTab(tab);
    setAuthMessage({ text: '', type: 'info' });
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setAuthMessage({ text: '', type: 'info' });
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setAuthMessage({ text: '', type: 'info' });
  }, []);

  const handleAuthButtonClick = useCallback(() => {
    if (getSession()) {
      logout();
      return;
    }
    openAuth('login');
  }, [logout, openAuth]);

  const finishAuth = useCallback((user, message = 'Готово, вы вошли в аккаунт.') => {
    saveSession(user, true);
    setSession(getSession());
    setAuthMessage({ text: message, type: 'success' });
    setTimeout(closeAuth, 700);
  }, [closeAuth]);

  const handleRegister = useCallback(async (data) => {
    const user = await registerUser(data);
    finishAuth(user, 'Аккаунт создан. Добро пожаловать!');
  }, [finishAuth]);

  const handleLogin = useCallback(async (data) => {
    const user = await loginUser(data);
    setSession(getSession());
    setAuthMessage({ text: 'Вы вошли в аккаунт.', type: 'success' });
    setTimeout(closeAuth, 700);
    return user;
  }, [closeAuth]);

  const handleGoogleCredential = useCallback((response) => {
    try {
      if (!response?.credential) {
        setAuthMessage({ text: 'Google не вернул токен входа.', type: 'error' });
        return;
      }
      const user = signInWithGoogleProfile(decodeGoogleJwt(response.credential));
      finishAuth(user, 'Вход через Google выполнен.');
    } catch {
      setAuthMessage({ text: 'Не получилось прочитать ответ Google.', type: 'error' });
    }
  }, [finishAuth]);

  const initGoogleIdentity = useCallback(() => {
    if (!googleClientId) return;
    if (!window.google?.accounts?.id) return;
    if (googleIdentityReady.current) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    googleIdentityReady.current = true;
  }, [handleGoogleCredential]);

  const handleGoogleClick = useCallback(() => {
    if (!googleClientId) {
      setAuthMessage({ text: 'Сначала укажите VITE_GOOGLE_CLIENT_ID в .env.', type: 'error' });
      return;
    }
    if (!window.google?.accounts?.id) {
      setAuthMessage({ text: 'Google SDK ещё загружается. Попробуйте через пару секунд.', type: 'info' });
      return;
    }
    initGoogleIdentity();
  }, [initGoogleIdentity]);

  const handleSocialStub = useCallback((provider) => {
    const names = { apple: 'Apple', yandex: 'Яндекс', vk: 'ВК', telegram: 'Telegram' };
    setAuthMessage({ text: `Вход через ${names[provider] || 'сервис'} пока только в дизайне.`, type: 'info' });
  }, []);

  useEffect(() => {
    if (!googleClientId) return undefined;
    if (window.google?.accounts?.id) {
      initGoogleIdentity();
      return undefined;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client?hl=ru';
    script.async = true;
    script.defer = true;
    script.onload = initGoogleIdentity;
    document.head.appendChild(script);
    return () => script.remove();
  }, [initGoogleIdentity]);

  const value = useMemo(() => ({
    session,
    authOpen,
    authTab,
    authMessage,
    setAuthTab,
    setAuthMessage,
    openAuth,
    closeAuth,
    logout,
    handleAuthButtonClick,
    handleRegister,
    handleLogin,
    handleGoogleClick,
    handleSocialStub,
    refreshSession,
  }), [
    session, authOpen, authTab, authMessage, openAuth, closeAuth, logout,
    handleAuthButtonClick, handleRegister, handleLogin, handleGoogleClick,
    handleSocialStub, refreshSession,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
