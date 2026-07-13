import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mangaDetails } from '../data/mockData';
import Tabs from '../components/ui/Tabs';

export default function MangaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const manga = mangaDetails; // In a real app, fetch by id
  
  const [activeTab, setActiveTab] = useState(0);
  const [bookmarkStatus, setBookmarkStatus] = useState(null);
  const [showBookmarkMenu, setShowBookmarkMenu] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <main className="page page--active manga-page">
      {/* Rating Modal */}
      {showRatingModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }} onClick={() => setShowRatingModal(false)}>
          <div style={{
            background: 'var(--bg-secondary)', padding: '32px', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)', textAlign: 'center', minWidth: '320px'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 24px 0', color: 'var(--text-primary)' }}>Оцените тайтл</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(star => (
                <svg 
                  key={star} width="28" height="28" viewBox="0 0 24 24" 
                  fill={(hoverRating || userRating) >= star ? 'var(--accent)' : 'none'} 
                  stroke={(hoverRating || userRating) >= star ? 'var(--accent)' : 'var(--text-muted)'} 
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ cursor: 'pointer', transition: 'all 0.1s' }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => { setUserRating(star); setTimeout(() => setShowRatingModal(false), 500); }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--accent)', height: '28px' }}>
              {hoverRating || userRating ? `${hoverRating || userRating} / 10` : ''}
            </div>
          </div>
        </div>
      )}
      {/* Background Hero */}
      <div className="manga-hero">
        <div 
          className="manga-hero__bg" 
          style={{ backgroundImage: `url(${manga.bgUrl})` }} 
        />
        <div className="manga-hero__overlay" />
      </div>

      <div className="container">
        <div className="manga-content">
          {/* Left Sidebar (Cover & Actions) */}
          <aside className="manga-sidebar">
            <div 
              className="manga-sidebar__cover" 
              style={{ backgroundImage: `url(${manga.imageUrl})` }}
            />
            <div className="manga-actions">
              <button className="btn btn--primary manga-actions__read" onClick={() => navigate(`/read/${id || 1}`)}>
                Читать 1 главу
              </button>
              <div style={{ position: 'relative', width: '100%' }}>
                <button 
                  className={`btn ${bookmarkStatus ? 'btn--primary' : 'btn--secondary'} manga-actions__bookmark`}
                  style={{ width: '100%' }}
                  onClick={() => setShowBookmarkMenu(!showBookmarkMenu)}
                >
                  {bookmarkStatus || 'В закладки'}
                </button>
                {showBookmarkMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '8px', zIndex: 10,
                    display: 'flex', flexDirection: 'column', gap: '4px'
                  }}>
                    {['Читаю', 'В планах', 'Прочитано', 'Любимое', 'Брошено'].map(status => (
                      <div 
                        key={status}
                        onClick={() => { setBookmarkStatus(status); setShowBookmarkMenu(false); }}
                        style={{
                          padding: '8px 12px', borderRadius: '4px', cursor: 'pointer',
                          background: bookmarkStatus === status ? 'var(--bg-hover)' : 'transparent',
                          color: bookmarkStatus === status ? 'var(--text-primary)' : 'var(--text-secondary)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = bookmarkStatus === status ? 'var(--bg-hover)' : 'transparent'}
                      >
                        {status}
                      </div>
                    ))}
                    {bookmarkStatus && (
                      <div 
                        onClick={() => { setBookmarkStatus(null); setShowBookmarkMenu(false); }}
                        style={{ padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', color: '#e74c3c', marginTop: '4px', borderTop: '1px solid var(--border-light)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(231, 76, 60, 0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        Удалить из закладок
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right Main Info */}
          <div className="manga-main">
            <div className="manga-header">
              <div className="manga-header__titles">
                <h1 className="manga-title">{manga.title}</h1>
                <h2 className="manga-original-title">
                  {manga.year} {manga.type} · {manga.originalTitle}
                </h2>
              </div>
              <div className="manga-header__rating">
                <span className="manga-rating-val">{userRating ? (Math.round((parseFloat(manga.rating) * manga.votes + userRating) / (manga.votes + 1) * 100) / 100).toFixed(2) : manga.rating}</span>
                <span className="manga-rating-count">{manga.votes + (userRating ? 1 : 0)} оценок</span>
                <button className="btn-rate" onClick={() => setShowRatingModal(true)}>
                  {userRating ? 'Изменить оценку' : 'Оценить'}
                </button>
              </div>
            </div>

            <div className="manga-tags">
              <span className="manga-tag manga-tag--age">{manga.ageRating}</span>
              {manga.tags.map(tag => (
                <span key={tag} className="manga-tag">{tag}</span>
              ))}
            </div>

            <div className="manga-description">
              {manga.description.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="manga-stats">
              <div className="manga-stat">
                <span className="manga-stat__label">Статус тайтла</span>
                <strong className="manga-stat__val">{manga.status}</strong>
              </div>
              <div className="manga-stat">
                <span className="manga-stat__label">Главы</span>
                <strong className="manga-stat__val">{manga.chaptersCount}</strong>
              </div>
              <div className="manga-stat">
                <span className="manga-stat__label">Формат</span>
                <strong className="manga-stat__val">{manga.format}</strong>
              </div>
              <div className="manga-stat">
                <span className="manga-stat__label">Просмотры</span>
                <strong className="manga-stat__val">{manga.views}</strong>
              </div>
            </div>

            <div className="manga-tabs-section" style={{ marginTop: '32px' }}>
              <Tabs items={['Главы', 'Комментарии', 'Похожее', 'О тайтле']} activeTab={activeTab} onTabChange={setActiveTab} />
              
              <div className="manga-tabs-content">
                {activeTab === 3 && (
                  <div className="manga-about" style={{ padding: '24px 0' }}>
                    
                    {/* Characters */}
                    <div className="manga-section">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Главные герои</h3>
                        <span style={{ fontSize: '13px', color: 'var(--accent)', cursor: 'pointer' }}>Все герои &gt;</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {[
                          { name: 'Со Джу Хон', img: '/avatar_1_boy_1783958087860.jpg' },
                          { name: 'Айрин', img: '/avatar_2_girl_1783958096727.jpg' },
                        ].map((char, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '120px', flexShrink: 0 }}>
                            <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)', overflow: 'hidden' }}>
                              <img src={char.img} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.2' }}>{char.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Staff */}
                    <div className="manga-section" style={{ marginTop: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Персонал</h3>
                        <span style={{ fontSize: '13px', color: 'var(--accent)', cursor: 'pointer' }}>Все создатели &gt;</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {[...manga.authors, ...manga.translators].map((staff, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '120px', flexShrink: 0 }}>
                            <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '24px', fontWeight: 'bold' }}>
                              {staff.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.2' }}>{staff.name}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>{staff.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {activeTab === 0 && (
                  <div className="manga-chapters">
                    <div className="chapter-search">
                      <input type="text" placeholder="Номер или название главы" />
                    </div>
                    <div className="chapter-list">
                      {Array.from({ length: 50 }).map((_, i) => {
                        const chapterNum = manga.chaptersCount - i;
                        return (
                          <div 
                            key={chapterNum} 
                            className="chapter-row"
                            style={{ cursor: 'pointer' }}
                            onClick={() => navigate(`/read/${id || 1}`)}
                          >
                            <div className="chapter-row__info">
                              <span className="chapter-row__name">Глава {chapterNum}</span>
                            </div>
                            <span className="chapter-row__date">
                              {new Date(Date.now() - i * 86400000).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {activeTab === 1 && (
                  <div className="manga-comments" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 0' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-hover)', flexShrink: 0 }}></div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <textarea 
                          placeholder="Оставьте ваш комментарий..."
                          style={{
                            width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                            color: 'var(--text-primary)', padding: '16px', borderRadius: 'var(--radius-md)',
                            minHeight: '100px', resize: 'vertical', fontFamily: 'inherit'
                          }}
                        />
                        <button className="btn btn--primary" style={{ alignSelf: 'flex-end', padding: '10px 24px' }}>Отправить</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <div key={i} style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-hover)', flexShrink: 0 }}></div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Пользователь {i + 1}</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{i + 1} дн. назад</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                              Это просто шедевр! Рисовка отличная, сюжет затягивает с первых глав. Жду продолжения с нетерпением, рекомендую всем к прочтению.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 2 && (
                  <div className="manga-similar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', padding: '16px 0' }}>
                    {[
                      { title: 'Поднятие уровня в одиночку', img: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=300&auto=format&fit=crop' },
                      { title: 'Всеведущий читатель', img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=300&auto=format&fit=crop' },
                      { title: 'Начало после конца', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&auto=format&fit=crop' },
                      { title: 'Ранкер, который живет второй раз', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop' },
                      { title: 'Возвращение хулигана', img: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=300&auto=format&fit=crop' }
                    ].map((m, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}>
                        <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)', overflow: 'hidden' }}>
                          <img src={m.img} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.3' }}>{m.title}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
