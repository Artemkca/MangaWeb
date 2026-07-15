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
    title: 'Человек-паук Нуар',
    price: 1000,
    subPrice: 900,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: 2,
    title: 'Ножки Давида',
    price: 2200,
    subPrice: 1980,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=12',
  },
  {
    id: 3,
    title: 'Резе',
    price: 3200,
    subPrice: 2880,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=13',
  },
  {
    id: 4,
    title: 'Сенкодору',
    price: 0,
    subPrice: null,
    hasSubText: null,
    image: 'https://i.pravatar.cc/150?img=14',
  },
  {
    id: 5,
    title: 'Безумие',
    price: 2070,
    oldPrice: 2300,
    discount: '10%',
    subPrice: null,
    hasSubText: 'Только с подпиской',
    badgeLeft: '10%',
    badgeRight: '144 шт осталось',
    image: 'https://i.pravatar.cc/150?img=15',
  },
  {
    id: 6,
    title: 'Вайс-чан',
    price: 3000,
    subPrice: 2700,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=16',
  },
  {
    id: 7,
    title: 'Доктор Ливси',
    price: 600,
    subPrice: 540,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=17',
    isSoldOut: true,
  },
  {
    id: 8,
    title: 'Кита Икуё',
    price: 2340,
    oldPrice: 2600,
    discount: '10%',
    subPrice: null,
    hasSubText: 'Только с подпиской',
    badgeLeft: '10%',
    badgeRight: '382 шт осталось',
    image: 'https://i.pravatar.cc/150?img=18',
  },
  {
    id: 9,
    title: 'Смущённая Мита',
    price: 2600,
    subPrice: 2340,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=19',
  },
  {
    id: 10,
    title: 'Два хвоста',
    price: 2400,
    subPrice: 2160,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=20',
    badgeLeft: '18+',
  },
  {
    id: 11,
    title: 'EricaZehnt',
    price: 1600,
    subPrice: 1440,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=21',
  },
  {
    id: 12,
    title: 'Хорошее настроение',
    price: 1200,
    subPrice: 1080,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=22',
  },
  {
    id: 13,
    title: 'Голодная девушка-дракон',
    price: 1980,
    oldPrice: 2200,
    discount: '10%',
    subPrice: null,
    hasSubText: 'Только с подпиской',
    badgeLeft: '10% — до 19 июл.',
    badgeRight: '848 шт осталось',
    image: 'https://i.pravatar.cc/150?img=23',
  },
  {
    id: 14,
    title: 'Коварная лисица',
    price: 2200,
    subPrice: 1980,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=24',
  },
  {
    id: 15,
    title: 'Куда Изуна',
    price: 1800,
    subPrice: 1620,
    hasSubText: 'с подпиской',
    image: 'https://i.pravatar.cc/150?img=25',
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
          <div key={item.id} className={styles.card} style={{ opacity: item.isSoldOut ? 0.5 : 1 }}>
            <div className={styles.imageWrap}>
              {item.badgeLeft && <span className={styles.badgeTopLeft}>{item.badgeLeft}</span>}
              <img src={item.image} alt={item.title} className={styles.avatar} />
              {item.isSoldOut ? (
                <span className={styles.badgeSoldOut}>Распродано</span>
              ) : item.badgeRight ? (
                <span className={styles.badgeBottomCenter}>{item.badgeRight}</span>
              ) : null}
            </div>
            
            <h3 className={styles.cardTitle}>{item.title}</h3>
            
            {item.price > 0 || item.oldPrice ? (
              <div className={styles.priceRow}>
                <StarIcon /> {item.price}
                {item.oldPrice && (
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '12px', marginLeft: '4px' }}>
                    {item.oldPrice}
                  </span>
                )}
              </div>
            ) : null}

            {(item.subPrice || item.hasSubText) && (
              <div className={`${styles.subPriceRow} ${item.hasSubText === 'Только с подпиской' ? styles.disabled : ''}`}>
                <EyeIcon /> 
                {item.subPrice ? `${item.subPrice} ${item.hasSubText}` : item.hasSubText}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
