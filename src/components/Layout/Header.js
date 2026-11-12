import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiFileText } from "@react-icons/all-files/fi/FiFileText";
import { FiMoon } from "@react-icons/all-files/fi/FiMoon";
import { FiSun } from "@react-icons/all-files/fi/FiSun";
import { FiMenu } from "@react-icons/all-files/fi/FiMenu";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../ui/Modal/Modal";
import s from "./Header.module.css";
const links = [
  ["/forms", "Мої форми"],
  ["/about", "Про нас"],
  ["/help", "Допомога"],
];
function Navigation({ close }) {
  return (
    <nav aria-label="Основна навігація" className={s.nav}>
      {links.map(([url, label]) => (
        <NavLink
          to={url}
          key={url}
          onClick={close}
          className={({ isActive }) => (isActive ? s.active : undefined)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  return (
    <header className={s.header}>
      <div className={s.container}>
        <Link to="/" className={s.logo}>
          <span>
            <FiFileText aria-hidden="true" />
          </span>
          FormsCraft<span className={s.wordmark}>/</span>
        </Link>
        <div className={s.desktop}>
          <Navigation />
        </div>
        <div className={s.actions}>
          <button
            type="button"
            className={s.icon}
            onClick={toggleTheme}
            aria-label={
              theme === "light"
                ? "Увімкнути темну тему"
                : "Увімкнути світлу тему"
            }
          >
            {theme === "light" ? (
              <FiMoon aria-hidden="true" />
            ) : (
              <FiSun aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className={`${s.icon} ${s.menu}`}
            onClick={() => setOpen(true)}
            aria-label="Відкрити меню"
            aria-expanded={open}
            aria-haspopup="dialog"
          >
            <FiMenu aria-hidden="true" />
          </button>
        </div>
      </div>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Навігація"
        size="sm"
      >
        <Navigation close={() => setOpen(false)} />
      </Modal>
    </header>
  );
}
