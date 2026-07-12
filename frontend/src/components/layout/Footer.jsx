import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="logo">
            <span className="logo__icon">MF</span>
            <span className="logo__text">MangaFlow</span>
          </Link>
          <p>Платформа для чтения манги, манхвы, маньхуа и комиксов на русском языке.</p>
          <div className="footer__socials">
            <a href="#" onClick={(e) => e.preventDefault()} title="Telegram">TG</a>
            <a href="#" onClick={(e) => e.preventDefault()} title="VK">VK</a>
            <a href="#" onClick={(e) => e.preventDefault()} title="Discord">DS</a>
            <a href="#" onClick={(e) => e.preventDefault()} title="YouTube">YT</a>
          </div>
        </div>
        <div className="footer__links">
          <div>
            <h4>Навигация</h4>
            <Link to="/catalog">Каталог</Link>
            <Link to="/tops">Топы</Link>
            <Link to="/new">Новинки</Link>
            <a href="#" onClick={(e) => e.preventDefault()}>Лента глав</a>
          </div>
          <div>
            <h4>Сообщество</h4>
            <Link to="/forum">Форум</Link>
            <a href="#" onClick={(e) => e.preventDefault()}>Рецензии</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Гильдии</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Рейтинг</a>
          </div>
          <div>
            <h4>Информация</h4>
            <a href="#" onClick={(e) => e.preventDefault()}>DMCA</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Авторское право</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Правила</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Контакты</a>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <div className="container">
          <span>© 2025 MangaFlow — дизайн-макет</span>
          <span>v0.1.0</span>
        </div>
      </div>
    </footer>
  );
}
