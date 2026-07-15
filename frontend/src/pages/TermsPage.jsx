import React from 'react';

export default function TermsPage() {
  return (
    <div className="layout">
      <main className="content" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '24px', fontSize: '32px' }}>Правила сайта</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          <p>
            Добро пожаловать на MangaWeb. Используя наш сайт, вы соглашаетесь с данными правилами. Пожалуйста, внимательно ознакомьтесь с ними.
          </p>
          
          <h2 style={{ color: 'var(--text-primary)', marginTop: '16px', fontSize: '20px' }}>1. Общие положения</h2>
          <p>
            MangaWeb предоставляет платформу для чтения и обсуждения манги, маньхуа и манхвы. Мы не претендуем на авторские права на размещенные материалы. Все права принадлежат их законным правообладателям.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '16px', fontSize: '20px' }}>2. Поведение пользователей</h2>
          <p>
            При общении в комментариях и на форуме запрещается:
          </p>
          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>Оскорбления других пользователей, переход на личности;</li>
            <li>Публикация спама, рекламы сторонних ресурсов;</li>
            <li>Разжигание межнациональной, религиозной или любой другой розни;</li>
            <li>Публикация спойлеров без специального тега или предупреждения.</li>
          </ul>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '16px', fontSize: '20px' }}>3. Ответственность</h2>
          <p>
            Администрация сайта не несет ответственности за материалы, добавленные пользователями, однако оставляет за собой право модерировать и удалять любой контент, нарушающий данные правила.
          </p>

          <h2 style={{ color: 'var(--text-primary)', marginTop: '16px', fontSize: '20px' }}>4. Изменение правил</h2>
          <p>
            Мы оставляем за собой право изменять данные правила в любое время без предварительного уведомления. Продолжение использования сайта после внесения изменений означает ваше согласие с новыми правилами.
          </p>

          <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
            Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
          </p>
        </div>
      </main>
    </div>
  );
}
