import styles from './HistoryPage.module.css';

export default function HistoryPage() {
  const activities = [
    {
      date: 'Сегодня',
      items: [
        {
          id: 1,
          type: 'security',
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>,
          title: 'Вход с нового устройства',
          desc: 'Был выполнен вход с устройства Windows (Google Chrome).',
          time: '14:32'
        },
        {
          id: 2,
          type: 'comment',
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
          title: 'Новый комментарий',
          desc: 'Вы оставили комментарий к манге "Берсерк" (Глава 364).',
          time: '11:15'
        }
      ]
    },
    {
      date: 'Вчера',
      items: [
        {
          id: 3,
          type: 'like',
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>,
          title: 'Оценка',
          desc: 'Вы поставили 10 звезд манге "Поднятие уровня в одиночку".',
          time: '20:45'
        },
        {
          id: 4,
          type: 'settings',
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
          title: 'Настройки изменены',
          desc: 'Вы включили режим "Скрыть контент 18+".',
          time: '19:10'
        }
      ]
    },
    {
      date: '10 Июля',
      items: [
        {
          id: 5,
          type: 'bookmark',
          icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>,
          title: 'Добавлено в закладки',
          desc: 'Манга "Человек-бензопила" добавлена в список "Читаю".',
          time: '09:20'
        },
      ]
    }
  ];

  return (
    <div className={styles.activityContainer}>
      <div className={styles.header}>
        <h1>История активности</h1>
        <p>Список последних действий в вашем аккаунте</p>
      </div>

      <div className={styles.timeline}>
        {activities.map((group, index) => (
          <div key={index} className={styles.timelineGroup}>
            <div className={styles.dateSticky}>{group.date}</div>
            <div className={styles.groupItems}>
              {group.items.map((item) => (
                <div key={item.id} className={styles.activityItem}>
                  <div className={`${styles.iconWrapper} ${styles[item.type]}`}>
                    {item.icon}
                  </div>
                  <div className={styles.activityContent}>
                    <div className={styles.activityHeader}>
                      <h4>{item.title}</h4>
                      <span className={styles.time}>{item.time}</span>
                    </div>
                    <p>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
