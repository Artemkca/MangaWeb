import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import SearchOverlay from './components/search/SearchOverlay';
import AuthModal from './components/auth/AuthModal';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import MangaPage from './pages/MangaPage';
import SettingsPage from './pages/SettingsPage';
import AdminPanel from './pages/AdminPanel';
import HistoryPage from './pages/HistoryPage';
import MessagesPage from './pages/MessagesPage';
import ProfilePage from './pages/ProfilePage';
import FriendsPage from './pages/FriendsPage';
import LibraryPage from './pages/LibraryPage';
import ReaderPage from './pages/ReaderPage';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const isReader = location.pathname.startsWith('/read');

  return (
    <>
      {!isReader && <Header onOpenSearch={() => setIsSearchOpen(true)} />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/manga/:id" element={<MangaPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/read/:id" element={<ReaderPage />} />
      </Routes>

      {!isReader && <Footer />}
      {!isReader && <MobileNav onOpenSearch={() => setIsSearchOpen(true)} />}
      
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
    </>
  );
}

export default App;
