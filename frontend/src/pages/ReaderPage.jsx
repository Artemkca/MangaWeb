import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ReaderPage.module.css';
import ReaderSettings from './ReaderSettings';
import { ReaderChapters, ReaderComments } from './ReaderSidePanels';

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

const ExpandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

const ListIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="6" width="16" height="2.5" rx="1" />
    <rect x="4" y="11" width="16" height="2.5" rx="1" />
    <rect x="4" y="16" width="16" height="2.5" rx="1" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
);

const CommentIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const AutoscrollIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const CloseReaderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function ReaderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showUI, setShowUI] = useState(true);
  const [activePanel, setActivePanel] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageRefs = useRef([]);
  
  const defaultSettings = {
    continuousReading: true,
    fullscreen: false,
    showPageNumbers: true,
    theme: 'dark',
    imageFit: 'height',
    containerWidth: 800,
    brightness: 100,
    pageGap: 0,
    readingMode: 'vertical',
    grayscale: false,
    invert: false,
    autoScrollSpeed: 0,
    smoothScroll: true,
    hotkeysEnabled: true,
  };
  const [settings, setSettings] = useState(defaultSettings);

  const updateSetting = (key, value) => setSettings(prev => ({ ...prev, [key]: value }));
  const resetSettings = () => setSettings(defaultSettings);

  const toggleUI = () => setShowUI(prev => !prev);

  // Fullscreen effect
  useEffect(() => {
    if (settings.fullscreen) {
      document.documentElement.requestFullscreen().catch(e => console.log('Fullscreen error', e));
    } else if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.log('Exit fullscreen error', e));
    }
  }, [settings.fullscreen]);

  useEffect(() => {
    let timeout;
    
    const resetTimer = () => {
      clearTimeout(timeout);
      if (showUI) {
        timeout = setTimeout(() => {
          setShowUI(false);
        }, 5000);
      }
    };

    if (showUI) {
      window.addEventListener('mousemove', resetTimer);
      resetTimer(); // Start timer immediately when UI shows
    }

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      clearTimeout(timeout);
    };
  }, [showUI]);

  const pages = [
    'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1200&auto=format&fit=crop'
  ];

  // Track current page in vertical mode
  useEffect(() => {
    if (settings.readingMode === 'horizontal') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = pageRefs.current.findIndex(el => el === entry.target);
            if (index !== -1) setCurrentPage(index);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    pageRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [settings.readingMode, pages.length]);

  const handlePageClick = (e) => {
    if (settings.readingMode === 'vertical') {
      if (showUI) setShowUI(false);
      return;
    }

    const { clientX } = e;
    const { innerWidth } = window;
    
    if (clientX < innerWidth * 0.3) {
      setCurrentPage(prev => Math.max(0, prev - 1));
    } else if (clientX > innerWidth * 0.7) {
      setCurrentPage(prev => Math.min(pages.length - 1, prev + 1));
    } else {
      if (showUI) setShowUI(false);
    }
  };

  // Autoscroll
  useEffect(() => {
    if (settings.autoScrollSpeed > 0 && settings.readingMode === 'vertical') {
      const interval = setInterval(() => {
        const scrollContainer = document.querySelector(`.${styles.pagesScroll}`);
        if (scrollContainer) {
          scrollContainer.scrollBy({ top: settings.autoScrollSpeed / 10, behavior: settings.smoothScroll ? 'smooth' : 'auto' });
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [settings.autoScrollSpeed, settings.readingMode, settings.smoothScroll]);

  // Hotkeys
  useEffect(() => {
    if (!settings.hotkeysEnabled) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
         if (settings.readingMode === 'horizontal') {
           setCurrentPage(p => Math.min(pages.length - 1, p + 1));
         }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
         if (settings.readingMode === 'horizontal') {
           setCurrentPage(p => Math.max(0, p - 1));
         }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.hotkeysEnabled, settings.readingMode, pages.length]);

  // Wheel event for showing/hiding UI (more reliable than onScroll)
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY < -10) { // Scrolling up
        setShowUI(true);
      } else if (e.deltaY > 10) { // Scrolling down
        setShowUI(false);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const handleScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    if (currentScrollY < 50) {
      setShowUI(true);
    }
  };

  return (
    <div className={styles.readerContainer}>
      
      {/* Top Header */}
      <div className={`${styles.topBar} ${showUI ? styles.uiVisible : styles.uiHidden}`}>
        
        <div className={styles.topLeft}>
          <button className={styles.iconBtn} onClick={() => navigate(-1)}>
            <ChevronLeft />
          </button>
          <span className={styles.mangaTitle}>Расхититель гробниц</span>
        </div>

        <div className={styles.topCenter}>
          <button className={styles.iconBtn}><ChevronLeft /></button>
          <span className={styles.chapterTitle}>Том 1 Глава 43</span>
          <button className={styles.iconBtn}><ChevronRight /></button>
        </div>

        <div className={styles.topRight}>
          <button className={styles.iconBtn}><ExpandIcon /></button>
          <button className={styles.iconBtn}><InfoIcon /></button>
        </div>
        <div className={styles.readingProgress} style={{ width: '15%' }} />
      </div>

      {/* Pages Container */}
      <div className={styles.pagesScroll} onClick={handlePageClick} onScroll={handleScroll}>
        <div 
          className={styles.pagesWrapper} 
          style={{ 
            gap: `${settings.pageGap}px`,
            flexDirection: settings.readingMode === 'horizontal' ? 'row' : 'column',
            overflowX: 'hidden'
          }}
        >
          {settings.readingMode === 'horizontal' ? (
            <div className={styles.pageImageWrapper} style={{ maxWidth: settings.imageFit === 'width' ? '100%' : `${settings.containerWidth}px`, margin: '0 auto' }}>
              <img 
                src={pages[currentPage]} 
                alt={`Страница ${currentPage+1}`} 
                className={styles.pageImage} 
                style={{ 
                  filter: `brightness(${settings.brightness}%) ${settings.grayscale ? 'grayscale(100%)' : ''} ${settings.invert ? 'invert(100%)' : ''}`,
                  maxHeight: settings.imageFit === 'height' ? '100vh' : 'none',
                  width: settings.imageFit === 'height' ? 'auto' : '100%',
                  objectFit: settings.imageFit === 'height' ? 'contain' : 'cover'
                }} 
              />
              {settings.showPageNumbers && (
                <div className={styles.pageNumberOverlay}>{currentPage + 1} / {pages.length}</div>
              )}
            </div>
          ) : (
            pages.map((url, i) => (
              <div 
                key={i} 
                className={styles.pageImageWrapper}
                ref={el => pageRefs.current[i] = el}
                style={{ maxWidth: settings.imageFit === 'width' ? '100%' : `${settings.containerWidth}px`, margin: '0 auto' }}
              >
                <img 
                  src={url} 
                  alt={`Страница ${i+1}`} 
                  className={styles.pageImage} 
                  style={{ 
                    filter: `brightness(${settings.brightness}%) ${settings.grayscale ? 'grayscale(100%)' : ''} ${settings.invert ? 'invert(100%)' : ''}`,
                    maxHeight: settings.imageFit === 'height' ? '100vh' : 'none',
                    width: settings.imageFit === 'height' ? 'auto' : '100%',
                    objectFit: settings.imageFit === 'height' ? 'contain' : 'cover'
                  }} 
                />
                {settings.showPageNumbers && (
                  <div className={styles.pageNumberOverlay}>{i + 1} / {pages.length}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Floating Sidebar */}
      <div className={`${styles.rightSidebar} ${showUI ? styles.uiVisible : styles.uiHidden}`}>
        <div className={styles.sidebarHandle} onClick={(e) => { e.stopPropagation(); setShowUI(true); }}>
          <ChevronLeft />
        </div>
        
        <div className={styles.pageCounter}>{currentPage + 1}/{pages.length}</div>
        
        <button className={styles.sideBtn} title="Оглавление" onClick={(e) => { e.stopPropagation(); setActivePanel('chapters'); setShowUI(false); }}><ListIcon /></button>
        <button className={styles.sideBtn} title="Настройки" onClick={(e) => { e.stopPropagation(); setActivePanel('settings'); setShowUI(false); }}><SettingsIcon /></button>
        <button className={styles.sideBtn} title="Комментарии" onClick={(e) => { e.stopPropagation(); setActivePanel('comments'); setShowUI(false); }}>
          <div className={styles.commentBadge}>12</div>
          <CommentIcon />
        </button>
        <button className={`${styles.sideBtn} ${settings.autoScrollSpeed > 0 ? styles.sideBtnActive : ''}`} title="Автоскролл" onClick={(e) => { 
          e.stopPropagation(); 
          setSettings(s => ({...s, autoScrollSpeed: s.autoScrollSpeed > 0 ? 0 : 30}));
        }}>
          <AutoscrollIcon />
        </button>
        <button className={styles.sideBtn} title="Закрыть читалку" onClick={(e) => { e.stopPropagation(); navigate(`/manga/${id || 1}`); }}><CloseReaderIcon /></button>
      </div>

      <ReaderSettings 
        isOpen={activePanel === 'settings'} 
        onClose={() => setActivePanel(null)} 
        settings={settings} 
        updateSetting={updateSetting}
        resetSettings={() => setSettings(defaultSettings)}
      />
      <ReaderChapters isOpen={activePanel === 'chapters'} onClose={() => setActivePanel(null)} />
      <ReaderComments isOpen={activePanel === 'comments'} onClose={() => setActivePanel(null)} />
    </div>
  );
}
