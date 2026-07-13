import React, { useState } from 'react';
import styles from './LibraryPage.module.css';

const MOCK_MANGA = [
  { id: 1, title: 'Solo Leveling', image: '/media__1783796032530.png', status: 'Читаю' },
  { id: 2, title: 'Chainsaw Man', image: '/media__1783795765299.png', status: 'В планах' },
  { id: 3, title: 'Jujutsu Kaisen', image: '/media__1783795520581.png', status: 'Прочитано' },
  { id: 4, title: 'Demon Slayer', image: '/media__1783795501132.png', status: 'Читаю' },
  { id: 5, title: 'Attack on Titan', image: '/media__1783795397433.png', status: 'Перечитываю' },
  { id: 6, title: 'One Piece', image: '/media__1783795303604.png', status: 'Отложено' },
  { id: 7, title: 'Naruto', image: '/media__1783795204213.png', status: 'Брошено' },
  { id: 8, title: 'Bleach', image: '/media__1783795086729.png', status: 'Читаю' },
];

const TABS = ['Все', 'Читаю', 'В планах', 'Прочитано', 'Перечитываю', 'Отложено', 'Брошено'];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredManga = MOCK_MANGA.filter(m => {
    const matchesTab = activeTab === 'Все' || m.status === activeTab;
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className={styles.libraryContainer}>
      <div className={styles.header}>
        <h1>Вся манга</h1>
        <p>Управление вашей библиотекой</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.tabs}>
          {TABS.map(tab => (
            <button
              key={tab}
              className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <input 
            type="text" 
            placeholder="Поиск по библиотеке..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredManga.length > 0 ? (
        <div className={styles.mangaGrid}>
          {filteredManga.map(manga => (
            <div key={manga.id} className={styles.mangaCard}>
              <div className={styles.mangaImageWrapper}>
                <img src={manga.image} alt={manga.title} />
                <div className={styles.statusBadge}>{manga.status}</div>
              </div>
              <h3 className={styles.mangaTitle}>{manga.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <p>Ничего не найдено</p>
        </div>
      )}
    </div>
  );
}
