import { useRef, useState, useEffect } from 'react';

const heroItems = [
  {
    id: 1,
    title: 'Поднятие уровня в одиночку',
    desc: '10 лет назад, после того как открылись «Врата», связавшие реальный мир с миром монстров, некоторые из людей получили способность охотиться на монстров внутри Врат.',
    badge: 'Новая глава',
    meta: 'Манхва • 200 глав',
    cover: 1,
    featured: true,
  },
  { id: 2, title: 'Магическая битва', cover: 2 },
  { id: 3, title: 'Человек-бензопила', cover: 3 },
  { id: 4, title: 'Ванпанчмен', cover: 4 },
  { id: 5, title: 'Берсерк', cover: 5 },
  { id: 6, title: 'Истребитель демонов', cover: 6 },
  { id: 7, title: 'Наруто', cover: 7 },
  { id: 8, title: 'Блич', cover: 8 },
];

export default function Hero() {
  const trackRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    if (trackRef.current) {
      const amount = 400;
      trackRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <button 
        className="hero__arrow hero__arrow--prev" 
        onClick={() => scroll('left')}
        disabled={!canScrollLeft}
        aria-label="Previous"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      
      <div className="hero__track" ref={trackRef} onScroll={checkScroll}>
        {heroItems.map(item => {
          if (item.featured) {
            return (
              <div key={item.id} className="hero-card hero-card--featured">
                <div className={`hero-card__cover cover cover--${item.cover}`} />
                <div className="hero-card__info">
                  <span className="hero-card__badge">{item.badge}</span>
                  <h2 className="hero-card__title">{item.title}</h2>
                  <p className="hero-card__desc">{item.desc}</p>
                  <div className="hero-card__meta">{item.meta}</div>
                </div>
              </div>
            );
          }
          return (
            <div key={item.id} className="hero-card">
              <div className={`hero-card__cover cover cover--${item.cover}`} />
              <div className="hero-card__overlay">
                <h3>{item.title}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        className="hero__arrow hero__arrow--next" 
        onClick={() => scroll('right')}
        disabled={!canScrollRight}
        aria-label="Next"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </section>
  );
}
