import { useState } from 'react';
import styles from './FriendsPage.module.css';

const SvgIcon = ({ name }) => {
  switch(name) {
    case 'search': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
    case 'msg': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
    case 'more': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>;
    case 'user': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
    case 'users': return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
    case 'star': return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
    case 'game': return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"></rect><path d="M6 12h4"></path><path d="M8 10v4"></path><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line></svg>;
    case 'book': return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
    default: return null;
  }
}

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState('all'); // all, online, pending
  
  const friends = [
    { id: 1, name: 'DarkSlayer', lvl: 42, avatar: '/avatar_3_mysterious_1783958104874.jpg', status: 'online', activityType: 'game', activity: 'Играет в Genshin Impact', banner: '/banner_3_nature_1783958177183.jpg' },
    { id: 2, name: 'AnimeLover99', lvl: 15, avatar: '/avatar_2_girl_1783958096727.jpg', status: 'online', activityType: 'book', activity: 'Читает Solo Leveling (Гл. 110)', banner: '/banner_2_space_1783958166998.jpg' },
    { id: 3, name: 'Куколд-Кукил', lvl: 5, avatar: '/avatar_1_boy_1783958087860.jpg', status: 'offline', activityType: 'none', activity: 'Был(а) в сети 2 часа назад', banner: '/banner_1_city_1783958158072.jpg' },
    { id: 4, name: 'KatoMegumi', lvl: 99, avatar: '/constellations/makima.jpg', status: 'dnd', activityType: 'none', activity: 'Не беспокоить', banner: '/constellations/gojo.jpg' },
  ];

  const onlineCount = friends.filter(f => f.status === 'online').length;

  return (
    <div className={styles.container}>
      
      {/* Sidebar Navigation for Friends */}
      <div className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Друзья</h2>
        <div className={styles.navGroup}>
          <button 
            className={`${styles.navBtn} ${activeTab === 'all' ? styles.activeNav : ''}`}
            onClick={() => setActiveTab('all')}
          >
            <div className={styles.navIcon}><SvgIcon name="users" /></div>
            <span>Все друзья</span>
            <span className={styles.badge}>{friends.length}</span>
          </button>
          
          <button 
            className={`${styles.navBtn} ${activeTab === 'online' ? styles.activeNav : ''}`}
            onClick={() => setActiveTab('online')}
          >
            <div className={styles.navIcon} style={{color: '#10b981'}}><SvgIcon name="user" /></div>
            <span>В сети</span>
            <span className={styles.badge}>{onlineCount}</span>
          </button>
          
          <button 
            className={`${styles.navBtn} ${activeTab === 'pending' ? styles.activeNav : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            <div className={styles.navIcon} style={{color: '#f59e0b'}}><SvgIcon name="user" /></div>
            <span>Заявки</span>
            <span className={styles.badgePending}>2</span>
          </button>
        </div>

        <div className={styles.inviteBlock}>
          <div className={styles.inviteImg}></div>
          <h4>Пригласить друзей</h4>
          <p>Поделись ссылкой с друзьями, чтобы они могли найти тебя.</p>
          <button className={styles.btnCopy}>Скопировать ссылку</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        
        {/* Top Bar */}
        <div className={styles.topBar}>
          <div className={styles.searchBox}>
            <SvgIcon name="search" />
            <input type="text" placeholder="Поиск среди друзей..." />
          </div>
          <button className={styles.btnAddFriend}>Добавить друга</button>
        </div>

        <div className={styles.friendsGrid}>
          {friends.map(friend => (
            <div key={friend.id} className={styles.friendCard}>
              <div className={styles.fcBanner} style={{backgroundImage: `url(${friend.banner})`}}></div>
              
              <div className={styles.fcBody}>
                <div className={styles.fcAvatarWrapper}>
                  <img src={friend.avatar} alt={friend.name} className={styles.fcAvatar} />
                  <div className={`${styles.statusDot} ${styles['status_' + friend.status]}`}></div>
                </div>
                
                <div className={styles.fcInfo}>
                  <div className={styles.fcNameRow}>
                    <h3>{friend.name}</h3>
                    <span className={styles.fcLvl}>Ур. {friend.lvl}</span>
                  </div>
                </div>

                <div className={styles.fcActions}>
                  <button className={styles.btnMsg} title="Написать сообщение"><SvgIcon name="msg" /></button>
                  <button className={styles.btnMore} title="Еще"><SvgIcon name="more" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
