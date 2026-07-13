import React, { useState } from 'react';
import styles from './ReaderSettings.module.css';

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const ReaderChapters = ({ isOpen, onClose }) => {
  const [bookmarkedChapter, setBookmarkedChapter] = useState(null);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Оглавление</h2>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={onClose} title="Закрыть"><CloseIcon /></button>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.settingGroupInner}>
            {Array.from({length: 40}).map((_, i) => {
              const chapterNum = 40 - i;
              const isCurrent = chapterNum === 40;
              const isBookmarked = bookmarkedChapter === chapterNum;
              
              return (
                <div 
                  key={chapterNum} 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px', 
                    background: isCurrent ? 'var(--bg-hover)' : 'var(--bg-tertiary)',
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius-md)',
                    color: isCurrent ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: isCurrent ? '600' : '500'
                  }}
                >
                  <span>Глава {chapterNum}</span>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {isCurrent && (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" title="Текущая глава">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    )}
                    <svg 
                      width="18" height="18" viewBox="0 0 24 24" 
                      fill={isBookmarked ? "var(--accent)" : "none"} 
                      stroke={isBookmarked ? "var(--accent)" : "currentColor"} 
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBookmarkedChapter(isBookmarked ? null : chapterNum);
                      }}
                      style={{ 
                        cursor: 'pointer', 
                        opacity: isBookmarked ? 1 : 0.4,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                      onMouseLeave={e => e.currentTarget.style.opacity = isBookmarked ? '1' : '0.4'}
                      title="Добавить в закладки"
                    >
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ReaderComments = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Комментарии (12)</h2>
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={onClose} title="Закрыть"><CloseIcon /></button>
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.settingGroupInner}>
            <textarea 
              placeholder="Написать комментарий..." 
              style={{
                width: '100%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                minHeight: '80px',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
            <button 
              style={{
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                padding: '10px',
                borderRadius: 'var(--radius-full)',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Отправить
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {[1, 2, 3].map((_, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-hover)', flexShrink: 0 }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>Пользователь {i + 1}</div>
                  <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                    Спасибо за главу! Очень крутой момент в конце, жду проду.
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};
