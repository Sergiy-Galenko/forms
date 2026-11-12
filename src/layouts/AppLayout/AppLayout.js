import screens from "../../styles/screens.module.css";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import s from "./AppLayout.module.css";
export default function AppLayout({ children }) {
  const location = useLocation();
  const first = useRef(true);
  const main = useRef(null);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    main.current?.focus();
  }, [location.pathname]);
  return (
    <div className={`${s.site} ${screens.shell}`}>
      <a href="#main" className={s.skip}>
        Перейти до вмісту
      </a>
      <Header />
      <main id="main" tabIndex={-1} ref={main} className={s.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
