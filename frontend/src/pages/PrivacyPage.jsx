import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="layout">
      <main className="content" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '24px', fontSize: '32px' }}>Политика конфиденциальности</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <p>
            На MangaWeb мы серьезно относимся к защите ваших личных данных. В этой политике описывается, какую информацию мы собираем и как мы ее используем.
          </p>
          
          <h2 style={{ color: 'var(--text-primary)', marginTop: '16px', fontSize: '20px' }}>1. Сбор информации</h2>
          <p>
            При регистрации на сайте мы собираем следующие данные:
          </p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Ваше имя пользователя (логин);</li>
            <li>Адрес электронной почты;</li>
            <li>Зашифрованный пароль (мы не храним пароли в открытом виде).</li>
          </ul>
          <p>
            Также мы можем собирать анонимную статистику использования сайта для улучшения его работы.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '16px', fontSize: '20px' }}>2. Использование данных</h2>
          <p>
            Ваши данные используются исключительно для:
          </p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Обеспечения доступа к вашему аккаунту (авторизация);</li>
            <li>Сохранения ваших закладок, истории чтения и настроек;</li>
            <li>Связи с вами (отправка уведомлений и кодов верификации).</li>
          </ul>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '16px', fontSize: '20px' }}>3. Защита информации</h2>
          <p>
            Мы принимаем все необходимые технические меры для защиты ваших данных от несанкционированного доступа. Мы не передаем вашу личную информацию третьим лицам без вашего явного согласия, за исключением случаев, предусмотренных законодательством.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '16px', fontSize: '20px' }}>4. Файлы Cookie</h2>
          <p>
            Сайт использует файлы cookie для хранения вашей сессии и пользовательских настроек (например, темной темы). Вы можете отключить использование cookie в настройках вашего браузера, однако это может повлиять на работоспособность некоторых функций сайта.
          </p>

          <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
      </main>
    </div>
  );
}
