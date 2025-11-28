import { Link } from 'react-router-dom';
import './Pages.css';

const HomePage = () => {
  return (
    <div className="page">
      <section className="page-card hero">
        <div>
          <p className="eyebrow">Просто і зрозуміло</p>
          <h1>Ясні Форми: опитування, які легко створити та пройти</h1>
          <p className="page-lede">
            Великі кнопки, читабельний текст і мінімум кроків. Без жодних зайвих жартів чи контактних форм.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/forms">Перейти до опитувань</Link>
            <Link className="btn btn-secondary" to="/about">Дізнатися більше</Link>
          </div>
        </div>
      </section>

      <section className="page-grid">
        <div className="page-card">
          <h2>Для будь-якого віку</h2>
          <p>Великі шрифти, чіткі поля та прості підказки. Не потрібно навчання чи інструкцій.</p>
        </div>
        <div className="page-card">
          <h2>Швидкий старт</h2>
          <p>Створіть опитування за хвилини: назва, кілька питань і публікація одним кліком.</p>
        </div>
        <div className="page-card">
          <h2>Прозорі відповіді</h2>
          <p>Переглядайте результати одразу після надсилання. Без складних налаштувань.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
