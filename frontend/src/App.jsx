import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Star, User, MessageSquare, X, BookOpenCheck } from 'lucide-react';

const FALLBACK_MANGAS = [
  {
    id: 1,
    title: "One Piece (Fallback)",
    author: "Eiichiro Oda",
    description: "Luffy and his crew sail the seas in search of the legendary One Piece treasure. (Showing local fallback data - backend is offline).",
    cover: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop&q=60",
    genres: ["Action", "Adventure", "Fantasy"],
    rating: 4.9,
    status: "Ongoing",
    chapters: 1110
  },
  {
    id: 2,
    title: "Naruto (Fallback)",
    author: "Masashi Kishimoto",
    description: "The story of Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage.",
    cover: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop&q=60",
    genres: ["Action", "Adventure", "Martial Arts"],
    rating: 4.7,
    status: "Completed",
    chapters: 700
  }
];

export default function App() {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  
  // Modal states
  const [selectedManga, setSelectedManga] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [newReview, setNewReview] = useState({ user: '', rating: '5', text: '' });
  
  const genres = ['All', 'Action', 'Adventure', 'Fantasy', 'Drama', 'Mystery'];

  // Fetch manga list
  useEffect(() => {
    fetchMangaList();
  }, [searchQuery, selectedGenre]);

  const fetchMangaList = async () => {
    setLoading(true);
    try {
      let url = '/api/manga';
      const params = [];
      if (searchQuery) params.push(`search=${encodeURIComponent(searchQuery)}`);
      if (selectedGenre !== 'All') params.push(`genre=${encodeURIComponent(selectedGenre)}`);
      
      if (params.length > 0) {
        url += `?${params.join('&')}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();
      setMangas(data);
      setError(null);
    } catch (err) {
      console.warn("Backend API not reachable. Using fallback mock data. Error:", err.message);
      // Fallback data for smooth presentation
      let filtered = FALLBACK_MANGAS;
      if (searchQuery) {
        filtered = filtered.filter(m => 
          m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          m.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedGenre !== 'All') {
        filtered = filtered.filter(m => m.genres.includes(selectedGenre));
      }
      setMangas(filtered);
      setError("Бэкенд-сервер недоступен. Запустите backend (порт 5000) для работы с живыми данными API.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch reviews for specific manga
  const openMangaDetails = async (manga) => {
    setSelectedManga(manga);
    setReviewLoading(true);
    setNewReview({ user: '', rating: '5', text: '' });
    try {
      const res = await fetch(`/api/manga/${manga.id}/reviews`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      // Mock review fallback
      setReviews([
        { id: 1, user: "OtakuGuest", rating: 5, text: "Классная манга! Очень ждем полноценного запуска бэкенда." }
      ]);
    } finally {
      setReviewLoading(false);
    }
  };

  // Submit review
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.user || !newReview.text) return;

    try {
      const res = await fetch(`/api/manga/${selectedManga.id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      
      if (!res.ok) throw new Error();
      const addedReview = await res.json();
      setReviews([...reviews, addedReview]);
      setNewReview({ user: '', rating: '5', text: '' });
    } catch (err) {
      // Offline review addition simulation
      const offlineReview = {
        id: Date.now(),
        user: newReview.user,
        rating: parseInt(newReview.rating),
        text: newReview.text + " (Локальное сохранение - бэкенд оффлайн)"
      };
      setReviews([...reviews, offlineReview]);
      setNewReview({ user: '', rating: '5', text: '' });
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container nav-container">
          <a href="#" className="logo">
            <BookOpenCheck size={28} />
            <span>MangaWeb</span>
          </a>
          <div className="search-bar">
            <Search size={18} className="text-secondary" />
            <input 
              type="text" 
              placeholder="Поиск по названию или автору..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </nav>

      <div className="container">
        {/* Hero */}
        <header className="hero">
          <h1>Твоя любимая манга в одном месте</h1>
          <p>Исследуй каталог, читай отзывы и делись своим мнением. Это демонстрационный проект бэкенд + фронтенд.</p>
        </header>

        {/* Status indicator / warning */}
        {error && (
          <div className="error-box">
            ⚠️ <strong>Обратите внимание:</strong> {error}
          </div>
        )}

        {/* Genre Filters */}
        <div className="genres-wrapper">
          {genres.map(genre => (
            <button
              key={genre}
              className={`genre-btn ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="loading-box">
            <div className="spinner"></div>
            <p>Загрузка каталога манги...</p>
          </div>
        ) : (
          <>
            {mangas.length === 0 ? (
              <div className="loading-box" style={{ padding: '60px 0' }}>
                <p>Манга не найдена по вашему запросу 🔍</p>
              </div>
            ) : (
              <div className="manga-grid">
                {mangas.map(manga => (
                  <article 
                    key={manga.id} 
                    className="manga-card"
                    onClick={() => openMangaDetails(manga)}
                  >
                    <div className="manga-cover-container">
                      <img src={manga.cover} alt={manga.title} className="manga-cover" />
                    </div>
                    <div className="manga-card-content">
                      <h3 className="manga-title">{manga.title}</h3>
                      <p className="manga-author">{manga.author}</p>
                      <p className="manga-desc-preview">{manga.description}</p>
                      
                      <div className="manga-tags">
                        {manga.genres.map(g => (
                          <span key={g} className="manga-tag">{g}</span>
                        ))}
                      </div>

                      <div className="manga-footer">
                        <span className="rating-badge">
                          <Star size={16} fill="currentColor" />
                          {manga.rating.toFixed(1)}
                        </span>
                        <span className="chapters-badge">
                          {manga.chapters} глав
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Manga Detail Modal */}
      {selectedManga && (
        <div className="modal-overlay" onClick={() => setSelectedManga(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedManga(null)}>
              <X size={20} />
            </button>
            
            <div className="modal-body">
              <div className="modal-layout">
                {/* Left side: Image & Status */}
                <div>
                  <img src={selectedManga.cover} alt={selectedManga.title} className="modal-manga-cover" />
                  <span className={`manga-status-badge ${selectedManga.status === 'Ongoing' ? 'status-ongoing' : 'status-completed'}`}>
                    {selectedManga.status === 'Ongoing' ? 'Выходит' : 'Завершено'}
                  </span>
                </div>

                {/* Right side: details */}
                <div>
                  <h2 className="modal-manga-title">{selectedManga.title}</h2>
                  <p className="modal-manga-author">Автор: {selectedManga.author}</p>
                  
                  <h3 className="section-title">Описание</h3>
                  <p className="modal-manga-desc">{selectedManga.description}</p>

                  {/* Reviews */}
                  <div className="reviews-section">
                    <h3 className="section-title">Отзывы читателей</h3>
                    
                    {reviewLoading ? (
                      <p className="text-secondary" style={{ fontSize: '14px' }}>Загрузка отзывов...</p>
                    ) : (
                      <div className="reviews-list">
                        {reviews.length === 0 ? (
                          <p className="text-muted" style={{ fontSize: '14px' }}>Отзывов пока нет. Будьте первым!</p>
                        ) : (
                          reviews.map(review => (
                            <div key={review.id} className="review-item">
                              <div className="review-header">
                                <span className="review-user">
                                  <User size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                  {review.user}
                                </span>
                                <span className="review-rating">
                                  <Star size={12} fill="currentColor" style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                                  {review.rating}/5
                                </span>
                              </div>
                              <p className="review-text">{review.text}</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {/* Review Form */}
                    <form className="review-form" onSubmit={handleReviewSubmit}>
                      <h4 className="review-form-title">Оставить отзыв</h4>
                      <div className="form-row">
                        <input 
                          type="text" 
                          placeholder="Ваше имя" 
                          style={{ flexGrow: 1 }}
                          value={newReview.user}
                          onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
                          required
                        />
                        <select
                          value={newReview.rating}
                          onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                        >
                          <option value="5">5 звезд</option>
                          <option value="4">4 звезды</option>
                          <option value="3">3 звезды</option>
                          <option value="2">2 звезды</option>
                          <option value="1">1 звезда</option>
                        </select>
                      </div>
                      <textarea 
                        placeholder="Ваш комментарий..." 
                        value={newReview.text}
                        onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                        required
                      ></textarea>
                      <button type="submit" className="submit-btn">Отправить</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
