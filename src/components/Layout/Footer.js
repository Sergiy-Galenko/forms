import React from 'react';
import { FiGithub } from '@react-icons/all-files/fi/FiGithub';
import { FiTwitter } from '@react-icons/all-files/fi/FiTwitter';
import { FiMail } from '@react-icons/all-files/fi/FiMail';
import { FiHeart } from '@react-icons/all-files/fi/FiHeart';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">FormsCraft</h3>
            <p className="footer-description">
              Створюйте приголомшливі форми та опитування за лічені хвилини.
              Простий, потужний і безкоштовний інструмент для кожного.
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Швидкі посилання</h4>
            <ul className="footer-links">
              <li><a href="/forms">Мої форми</a></li>
              <li><a href="/about">Про нас</a></li>
              <li><a href="/help">Допомога</a></li>
              <li><a href="/privacy">Приватність</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-heading">Зв'яжіться з нами</h4>
            <div className="footer-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <FiGithub />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FiTwitter />
              </a>
              <a href="mailto:hello@formscraft.com" aria-label="Email">
                <FiMail />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} FormsCraft. Зроблено з <FiHeart className="heart-icon" /> в Україні
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
