import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSun } from '@react-icons/all-files/fi/FiSun';
import { FiMoon } from '@react-icons/all-files/fi/FiMoon';
import { FiMenu } from '@react-icons/all-files/fi/FiMenu';
import { FiX } from '@react-icons/all-files/fi/FiX';
import { FiFileText } from '@react-icons/all-files/fi/FiFileText';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="header glass">
      <div className="header-container">
        <Link to="/" className="header-logo" onClick={closeMobileMenu}>
          <FiFileText className="logo-icon" />
          <span className="logo-text gradient-text">FormsCraft</span>
        </Link>

        <nav className={`header-nav ${mobileMenuOpen ? 'header-nav-open' : ''}`}>
          <Link
            to="/forms"
            className={`nav-link ${isActive('/forms') ? 'nav-link-active' : ''}`}
            onClick={closeMobileMenu}
          >
            Мої форми
          </Link>
          <Link
            to="/about"
            className={`nav-link ${isActive('/about') ? 'nav-link-active' : ''}`}
            onClick={closeMobileMenu}
          >
            Про нас
          </Link>
          <Link
            to="/help"
            className={`nav-link ${isActive('/help') ? 'nav-link-active' : ''}`}
            onClick={closeMobileMenu}
          >
            Допомога
          </Link>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
