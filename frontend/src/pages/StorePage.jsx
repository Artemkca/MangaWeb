import { useState } from 'react';
import styles from './StorePage.module.css';

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.starIcon}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.eyeIcon}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const mockItems = [
  {
    id: 1,
    title: 'Персонаж 1',
    price: 1000,
    image: '/avatars/char_127691.jpg',
  },
  {
    id: 2,
    title: 'Персонаж 2',
    price: 2200,
    image: '/avatars/char_14.jpg',
  },
  {
    id: 3,
    title: 'Персонаж 3',
    price: 3200,
    image: '/avatars/char_27.jpg',
  },
  {
    id: 4,
    title: 'Персонаж 4',
    price: 500,
    image: '/avatars/char_34470.jpg',
  },
  {
    id: 5,
    title: 'Персонаж 5',
    price: 2070,
    image: '/avatars/char_40.jpg',
  },
  {
    id: 6,
    title: 'Персонаж 6',
    price: 3000,
    image: '/avatars/char_40881.jpg',
  },
  {
    id: 7,
    title: 'Персонаж 7',
    price: 600,
    image: '/avatars/char_40882.jpg',
  },
  {
    id: 8,
    title: 'Персонаж 8',
    price: 2340,
    image: '/avatars/char_417.jpg',
  },
  {
    id: 9,
    title: 'Персонаж 9',
    price: 2600,
    image: '/avatars/char_422.jpg',
  },
  {
    id: 10,
    title: 'Персонаж 10',
    price: 2400,
    image: '/avatars/char_45627.jpg',
  },
  {
    id: 11,
    title: 'Персонаж 11',
    price: 1600,
    image: '/avatars/char_62.jpg',
  },
  {
    id: 12,
    title: 'Персонаж 12',
    price: 1200,
    image: '/avatars/char_71.jpg',
  },
  {
    id: 13,
    title: 'Персонаж 13',
    price: 1980,
    image: '/avatars/char_87275.jpg',
  },
  {
    id: 14,
    title: 'Персонаж 14',
    price: 2200,
    image: '/avatars/char_88572.jpg',
  },
  {
    id: 15,
    title: 'Персонаж 15',
    price: 1800,
    image: '/avatars/char_89334.jpg',
  }
];

export default function StorePage() {
  const [activeTab, setActiveTab] = useState('Аватары');
  const tabs = ['Аватары', 'Рамки аватара', 'Баннеры', 'Обои', 'Наборы эмодзи', 'Наборы стикеров'];

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Магазин украшений</h1>
          
          <div className={styles.balanceBlock}>
            <a href="#" className={styles.earnLink} onClick={(e) => e.preventDefault()}>
              Как зарабатывать <InfoIcon />
            </a>
            <div className={styles.balance}>
              Баланс: <StarIcon /> 17 203
            </div>
          </div>
        </div>

        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.filtersBar}>
          <button className={styles.filterBtn}>
            <FilterIcon /> Фильтр
          </button>
          <button className={`${styles.filterBtn} ${styles.filterClear}`}>
            <span style={{ fontSize: '16px', lineHeight: 1 }}>×</span> Моя рамка
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {mockItems.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={item.image} alt={item.title} className={styles.avatar} />
            </div>
            
            <h3 className={styles.cardTitle}>{item.title}</h3>
            
            <div className={styles.priceRow}>
              <StarIcon /> {item.price}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
