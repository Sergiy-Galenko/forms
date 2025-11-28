import React from 'react';
import './Pages.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <h1>Про FormsCraft</h1>

      <div className="help-section">
        <h2>Наша місія</h2>
        <p>
          FormsCraft створений для того, щоб зробити процес створення опитувань та форм
          простим, швидким та приємним. Ми віримо, що кожен повинен мати доступ до
          потужних інструментів без необхідності реєстрації або оплати.
        </p>
      </div>

      <div className="help-section">
        <h2>Переваги FormsCraft</h2>
        <ul>
          <li>Безкоштовно та без реєстрації</li>
          <li>Сучасний та інтуїтивний інтерфейс</li>
          <li>Повна приватність - дані зберігаються локально</li>
          <li>Необмежена кількість форм та відповідей</li>
          <li>Адаптивний дизайн для будь-яких пристроїв</li>
          <li>Темна та світла теми</li>
        </ul>
      </div>

      <div className="help-section">
        <h2>Технології</h2>
        <p>
          FormsCraft побудований з використанням сучасних веб-технологій:
          React, React Router, та LocalStorage API для зберігання даних.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
