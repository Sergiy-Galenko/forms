import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import './Header.css';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="site-header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          <span className="logo-mark" aria-hidden="true">≡</span>
          <span className="logo-text">Ясні Форми</span>
        </NavLink>
        <nav aria-label="Головна навігація">
          <ul className="nav-list">
            <li><NavLink to="/" end>Головна</NavLink></li>
            <li><NavLink to="/forms">Опитування</NavLink></li>
            <li><NavLink to="/about">Про нас</NavLink></li>
            <li><NavLink to="/help">Допомога</NavLink></li>
          </ul>
        </nav>
        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? 'Темна тема' : 'Світла тема'}
        </button>
      </div>
    </header>
  );
};

export default Header;
