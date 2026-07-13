import { useState } from 'react';
import styles from './MessagesPage.module.css';

export default function MessagesPage() {
  const [search, setSearch] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  return (
    <div className={styles.messagesContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>Чаты</h2>
          <button className={styles.newChatBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
        </div>
        
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Поиск" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.chatList}>
          <div className={styles.emptyList}>
            Здесь пока нет переписок
          </div>
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.toggleWrapper}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"/></svg>
            <span>ТОЛЬКО НЕПРОЧИТАННЫЕ</span>
            <label className={styles.toggleSwitch}>
              <input type="checkbox" checked={unreadOnly} onChange={() => setUnreadOnly(!unreadOnly)} />
              <span className={styles.toggleSlider}></span>
            </label>
          </div>
        </div>
      </aside>

      <main className={styles.mainArea}>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          </div>
          <h2>Выберите диалог для переписки</h2>
        </div>
      </main>
    </div>
  );
}
