import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import MobileNav from './components/layout/MobileNav';
import SearchOverlay from './components/search/SearchOverlay';
import AuthModal from './components/auth/AuthModal';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <Header onOpenSearch={() => setIsSearchOpen(true)} />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
      </Routes>

      <Footer />
      <MobileNav onOpenSearch={() => setIsSearchOpen(true)} />
      
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <AuthModal />
    </>
  );
}

export default App;
