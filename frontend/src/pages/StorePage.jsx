import { useState, useRef, useEffect } from 'react';
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

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Expanded mock data with categories and filter attributes
const mockItems = [
  {
    id: 1,
    title: 'Персонаж 1',
    category: 'Аватары',
    price: 1000,
    subPrice: 900,
    image: '/avatars/char_127691.jpg',
    ageRating: '0+',
  },
  {
    id: 2,
    title: 'Рамка "Огонь"',
    category: 'Рамки аватара',
    price: 2200,
    subPrice: 1980,
    image: '/avatars/char_14.jpg',
    ageRating: '0+',
  },
  {
    id: 3,
    title: 'Баннер "Космос"',
    category: 'Баннеры',
    price: 3200,
    subPrice: 2880,
    image: '/avatars/char_27.jpg',
    ageRating: '12+',
  },
  {
    id: 4,
    title: 'Персонаж 4',
    category: 'Аватары',
    price: 500,
    image: '/avatars/char_34470.jpg',
    ageRating: '0+',
  },
  {
    id: 5,
    title: 'Персонаж 5 (Скидка)',
    category: 'Аватары',
    price: 2070,
    oldPrice: 2300,
    discount: '10%',
    isSubOnly: true,
    limitedCount: 144,
    image: '/avatars/char_40.jpg',
    ageRating: '16+',
  },
  {
    id: 6,
    title: 'Рамка "Неон"',
    category: 'Рамки аватара',
    price: 3000,
    subPrice: 2700,
    image: '/avatars/char_40881.jpg',
    ageRating: '0+',
  },
  {
    id: 7,
    title: 'Персонаж 7',
    category: 'Аватары',
    price: 600,
    subPrice: 540,
    image: '/avatars/char_40882.jpg',
    ageRating: '0+',
  },
  {
    id: 8,
    title: 'Персонаж 8',
    category: 'Аватары',
    price: 2340,
    oldPrice: 2600,
    discount: '10%',
    isSubOnly: true,
    limitedCount: 382,
    image: '/avatars/char_417.jpg',
    ageRating: '12+',
  },
  {
    id: 9,
    title: 'Обои "Город"',
    category: 'Обои',
    price: 2600,
    subPrice: 2340,
    image: '/avatars/char_422.jpg',
    ageRating: '0+',
  },
  {
    id: 10,
    title: 'Персонаж 10',
    category: 'Аватары',
    price: 2400,
    subPrice: 2160,
    ageRating: '18+',
    image: '/avatars/char_45627.jpg',
  },
  {
    id: 11,
    title: 'Персонаж 11',
    category: 'Аватары',
    price: 1600,
    subPrice: 1440,
    image: '/avatars/char_62.jpg',
    ageRating: '0+',
  },
  {
    id: 12,
    title: 'Стикеры "Мемы"',
    category: 'Наборы стикеров',
    price: 1200,
    subPrice: 1080,
    image: '/avatars/char_71.jpg',
    ageRating: '0+',
  },
  {
    id: 13,
    title: 'Персонаж 13',
    category: 'Аватары',
    price: 1980,
    oldPrice: 2200,
    discount: '10%',
    limitedCount: 848,
    image: '/avatars/char_87275.jpg',
    ageRating: '12+',
  },
  {
    id: 14,
    title: 'Эмодзи "Лисичка"',
    category: 'Наборы эмодзи',
    price: 2200,
    subPrice: 1980,
    image: '/avatars/char_88572.jpg',
    ageRating: '0+',
  },
  {
    id: 15,
    title: 'Персонаж 15',
    category: 'Аватары',
    price: 0,
    isFree: true,
    image: '/avatars/char_89334.jpg',
    ageRating: '0+',
  }
];

export default function StorePage() {
  const [activeTab, setActiveTab] = useState('Аватары');
  const tabs = ['Аватары', 'Рамки аватара', 'Баннеры', 'Обои', 'Наборы эмодзи', 'Наборы стикеров'];

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  
  const [discountFilter, setDiscountFilter] = useState('all'); // 'all', 'discount', 'free'
  const [ageFilter, setAgeFilter] = useState('all'); // 'all', '0+', '12+', '16+', '18+'
  const [limitedFilter, setLimitedFilter] = useState(false);
  const [subOnlyFilter, setSubOnlyFilter] = useState(false);
  const [excludeBought, setExcludeBought] = useState(false);

  // Close filter dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetFilters = () => {
    setDiscountFilter('all');
    setAgeFilter('all');
    setLimitedFilter(false);
    setSubOnlyFilter(false);
    setExcludeBought(false);
  };

  // Apply filters
  const filteredItems = mockItems.filter(item => {
    // 1. Tab Match
    if (item.category !== activeTab) return false;

    // 2. Discount Match
    if (discountFilter === 'discount' && !item.discount) return false;
    if (discountFilter === 'free' && item.price > 0 && !item.isFree) return false;

    // 3. Age Match
    if (ageFilter !== 'all' && item.ageRating !== ageFilter) return false;

    // 4. Other Toggles
    if (limitedFilter && !item.limitedCount) return false;
    if (subOnlyFilter && !item.isSubOnly) return false;

    return true;
  });

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

        <div className={styles.filtersBar} ref={filterRef}>
          <button 
            className={`${styles.filterBtn} ${isFilterOpen ? styles.filterBtnActive : ''}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FilterIcon /> Фильтр
          </button>
          <button className={styles.filterClear} onClick={resetFilters}>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>×</span> Моя рамка
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className={styles.filterDropdown}>
              <div className={styles.dropdownHeader}>
                <h3 className={styles.dropdownTitle}>Фильтр</h3>
                <div className={styles.dropdownActions}>
                  <button className={styles.dropdownIconBtn} onClick={resetFilters} title="Сбросить фильтры">
                    <RefreshIcon />
                  </button>
                  <button className={styles.dropdownIconBtn} onClick={() => setIsFilterOpen(false)} title="Закрыть">
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionTitle}>Со скидкой или бесплатно</div>
                <label className={styles.radioLabel}>
                  <input type="radio" name="discount" className={styles.radioInput} checked={discountFilter === 'all'} onChange={() => setDiscountFilter('all')} />
                  <div className={styles.radioCustom}></div>
                  <span>Все</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="discount" className={styles.radioInput} checked={discountFilter === 'discount'} onChange={() => setDiscountFilter('discount')} />
                  <div className={styles.radioCustom}></div>
                  <span>Только со скидкой</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="discount" className={styles.radioInput} checked={discountFilter === 'free'} onChange={() => setDiscountFilter('free')} />
                  <div className={styles.radioCustom}></div>
                  <span>Бесплатно</span>
                </label>
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionTitle}>Возрастной рейтинг</div>
                <label className={styles.radioLabel}>
                  <input type="radio" name="age" className={styles.radioInput} checked={ageFilter === 'all'} onChange={() => setAgeFilter('all')} />
                  <div className={styles.radioCustom}></div>
                  <span>Все возраста</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="age" className={styles.radioInput} checked={ageFilter === '0+'} onChange={() => setAgeFilter('0+')} />
                  <div className={styles.radioCustom}></div>
                  <span>Безопасный 0+</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="age" className={styles.radioInput} checked={ageFilter === '12+'} onChange={() => setAgeFilter('12+')} />
                  <div className={styles.radioCustom}></div>
                  <span>Сомнительный 12+</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="age" className={styles.radioInput} checked={ageFilter === '16+'} onChange={() => setAgeFilter('16+')} />
                  <div className={styles.radioCustom}></div>
                  <span>Спорный 16+</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="age" className={styles.radioInput} checked={ageFilter === '18+'} onChange={() => setAgeFilter('18+')} />
                  <div className={styles.radioCustom}></div>
                  <span>Откровенный 18+</span>
                </label>
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionTitle}>Другое</div>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" className={styles.toggleInput} checked={limitedFilter} onChange={(e) => setLimitedFilter(e.target.checked)} />
                  <div className={styles.toggleCustom}></div>
                  <span>Ограниченное количество</span>
                </label>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" className={styles.toggleInput} checked={subOnlyFilter} onChange={(e) => setSubOnlyFilter(e.target.checked)} />
                  <div className={styles.toggleCustom}></div>
                  <span>Только с подпиской</span>
                </label>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" className={styles.toggleInput} checked={excludeBought} onChange={(e) => setExcludeBought(e.target.checked)} />
                  <div className={styles.toggleCustom}></div>
                  <span>Исключать купленное</span>
                </label>
              </div>

            </div>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredItems.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center' }}>
            Ничего не найдено по вашим фильтрам.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageWrap}>
                {item.discount && <span className={styles.badgeTopLeft}>{item.discount}</span>}
                {item.ageRating === '18+' && <span className={styles.badgeTopLeft} style={{ background: '#3b82f6' }}>18+</span>}
                <img src={item.image} alt={item.title} className={styles.avatar} />
                {item.limitedCount && <span className={styles.badgeBottomCenter}>{item.limitedCount} шт осталось</span>}
              </div>
              
              <h3 className={styles.cardTitle}>{item.title}</h3>
              
              {item.price > 0 || item.oldPrice ? (
                <div className={styles.priceRow}>
                  <StarIcon /> {item.price}
                  {item.oldPrice && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '12px', marginLeft: '4px', fontWeight: 'normal' }}>
                      {item.oldPrice}
                    </span>
                  )}
                </div>
              ) : (
                <div className={styles.priceRow}>Бесплатно</div>
              )}

              {/* Show either subscription price or "only with subscription" text */}
              {(item.subPrice || item.isSubOnly) && (
                <div className={`${styles.subPriceRow} ${item.isSubOnly ? styles.disabled : ''}`}>
                  <EyeIcon /> 
                  {item.isSubOnly ? 'Только с подпиской' : `${item.subPrice} с подпиской`}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
