import { Link } from "react-router-dom";
import s from "./Footer.module.css";
export default function Footer() {
  return (
    <footer className={s.footer}>
      <div>
        <span>FormsCraft</span>
        <p>Простір для хороших питань.</p>
      </div>
      <nav aria-label="Посилання у футері">
        <Link to="/about">Про проєкт</Link>
        <Link to="/help">Допомога</Link>
      </nav>
      <small>© {new Date().getFullYear()} FormsCraft</small>
    </footer>
  );
}
