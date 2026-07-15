import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AdminPanel.module.css';

export default function AdminPanel() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    cover: '',
    rating: 0,
    chapters: 0,
    genres: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Protect route
  if (!session) {
    return (
      <div className={styles.container}>
        <h2>Доступ запрещен</h2>
        <p>Пожалуйста, войдите в аккаунт.</p>
        <button className={styles.btn} onClick={() => navigate('/')}>На главную</button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const mangaData = {
        ...formData,
        rating: parseFloat(formData.rating),
        chapters: parseInt(formData.chapters, 10),
        genres: formData.genres.split(',').map(g => g.trim()).filter(Boolean)
      };

      const response = await fetch('/api/manga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mangaData)
      });

      if (!response.ok) {
        throw new Error('Ошибка сервера: ' + response.statusText);
      }

      setSuccess(`Манга "${formData.title}" успешно добавлена!`);
      setFormData({
        title: '',
        author: '',
        description: '',
        cover: '',
        rating: 0,
        chapters: 0,
        genres: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Админ Панель</h1>
      <p className={styles.subtitle}>Добавление новой манги в каталог</p>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Название *</label>
          <input required name="title" value={formData.title} onChange={handleChange} placeholder="Например: One Piece" />
        </div>
        
        <div className={styles.formGroup}>
          <label>Автор *</label>
          <input required name="author" value={formData.author} onChange={handleChange} placeholder="Например: Эйитиро Ода" />
        </div>

        <div className={styles.formGroup}>
          <label>Описание</label>
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Коротко о сюжете..." rows="4" />
        </div>

        <div className={styles.row}>
          <div className={styles.formGroup}>
            <label>Количество глав</label>
            <input type="number" name="chapters" value={formData.chapters} onChange={handleChange} min="0" />
          </div>
          <div className={styles.formGroup}>
            <label>Рейтинг (0-5)</label>
            <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1" />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Жанры (через запятую) *</label>
          <input required name="genres" value={formData.genres} onChange={handleChange} placeholder="Сёнэн, Фэнтези, Приключения" />
        </div>

        <div className={styles.formGroup}>
          <label>URL обложки</label>
          <input name="cover" value={formData.cover} onChange={handleChange} placeholder="https://example.com/cover.jpg" />
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{animation: 'spin 1s linear infinite'}}>
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="4.93" x2="19.07" y2="7.76"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          )}
          {loading ? 'Добавление...' : 'Добавить мангу'}
        </button>
      </form>
    </div>
  );
}
