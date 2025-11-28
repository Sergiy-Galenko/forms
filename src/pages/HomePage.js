import React from 'react';
import { Link } from 'react-router-dom';
import { FiPlay } from '@react-icons/all-files/fi/FiPlay';
import { FiZap } from '@react-icons/all-files/fi/FiZap';
import { FiShield } from '@react-icons/all-files/fi/FiShield';
import { FiTrendingUp } from '@react-icons/all-files/fi/FiTrendingUp';
import { FiEye } from '@react-icons/all-files/fi/FiEye';
import { FiEdit3 } from '@react-icons/all-files/fi/FiEdit3';
import { FiBarChart2 } from '@react-icons/all-files/fi/FiBarChart2';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import './Pages.css';

const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content animate-fadeInUp">
          <h1 className="hero-title">
            Створюйте форми,<br />
            які <span className="gradient-text">вражають</span>
          </h1>
          <p className="hero-description">
            Потужний конструктор форм та опитувань з сучасним дизайном.
            Створюйте, діліться та аналізуйте відповіді за лічені хвилини.
          </p>
          <div className="hero-actions">
            <Link to="/forms">
              <Button size="lg" icon={FiPlay} iconPosition="right">
                Почати безкоштовно
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline-primary" size="lg" icon={FiEye}>
                Дізнатись більше
              </Button>
            </Link>
          </div>
          <p className="hero-note">
            ✨ Без реєстрації • Необмежені форми • Зберігається локально
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2 className="section-title">Чому FormsCraft?</h2>
          <p className="section-description">
            Все, що потрібно для створення професійних форм
          </p>
        </div>

        <div className="features-grid">
          <Card hoverable glass className="feature-card">
            <div className="feature-icon gradient-bg">
              <FiZap />
            </div>
            <h3 className="feature-title">Швидке створення</h3>
            <p className="feature-description">
              Інтуїтивний конструктор дозволяє створювати форми
              за лічені хвилини. Drag-and-drop, live preview та шаблони.
            </p>
          </Card>

          <Card hoverable glass className="feature-card">
            <div className="feature-icon gradient-bg">
              <FiEdit3 />
            </div>
            <h3 className="feature-title">Потужний редактор</h3>
            <p className="feature-description">
              8 типів питань, умовна логіка, валідація даних,
              налаштування доступу та багато іншого.
            </p>
          </Card>

          <Card hoverable glass className="feature-card">
            <div className="feature-icon gradient-bg">
              <FiBarChart2 />
            </div>
            <h3 className="feature-title">Аналітика</h3>
            <p className="feature-description">
              Відстежуйте відповіді в реальному часі, переглядайте
              статистику та експортуйте дані у CSV або JSON.
            </p>
          </Card>

          <Card hoverable glass className="feature-card">
            <div className="feature-icon gradient-bg">
              <FiShield />
            </div>
            <h3 className="feature-title">Приватність</h3>
            <p className="feature-description">
              Всі дані зберігаються локально у вашому браузері.
              Ніякі дані не передаються на сервери.
            </p>
          </Card>

          <Card hoverable glass className="feature-card">
            <div className="feature-icon gradient-bg">
              <FiTrendingUp />
            </div>
            <h3 className="feature-title">Адаптивний дизайн</h3>
            <p className="feature-description">
              Ваші форми чудово виглядають на будь-яких пристроях -
              від смартфонів до великих моніторів.
            </p>
          </Card>

          <Card hoverable glass className="feature-card">
            <div className="feature-icon gradient-bg">
              <FiEye />
            </div>
            <h3 className="feature-title">Сучасний UI</h3>
            <p className="feature-description">
              Glassmorphism, темна тема, плавні анімації та
              інтуїтивний інтерфейс для найкращого UX.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <Card glass className="cta-card">
          <h2 className="cta-title">Готові почати?</h2>
          <p className="cta-description">
            Приєднуйтесь до тисяч користувачів, які вже створили свої форми
          </p>
          <Link to="/forms">
            <Button size="lg" icon={FiPlay} iconPosition="right">
              Створити першу форму
            </Button>
          </Link>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
