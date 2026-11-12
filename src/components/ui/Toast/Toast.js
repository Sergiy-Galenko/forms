import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { FiX } from "@react-icons/all-files/fi/FiX";
import { FiInfo } from "@react-icons/all-files/fi/FiInfo";
import s from "./Toast.module.css";
const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());
  const removeToast = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  useEffect(() => {
    const current = timers.current;
    return () => {
      current.forEach(clearTimeout);
      current.clear();
    };
  }, []);
  const addToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0)
        timers.current.set(
          id,
          setTimeout(() => removeToast(id), duration),
        );
      return id;
    },
    [removeToast],
  );
  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        success: (m, d) => addToast(m, "success", d),
        error: (m, d) => addToast(m, "error", d),
        info: (m, d) => addToast(m, "info", d),
        warning: (m, d) => addToast(m, "warning", d),
      }}
    >
      {children}
      <div
        className={s["toast-container"]}
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`${s.toast} ${s[`toast-${t.type}`] || ""}`}
          >
            <div className={s["toast-content"]}>
              <FiInfo aria-hidden="true" />
              <span>{t.message}</span>
            </div>
            <button
              type="button"
              className={s["toast-close"]}
              onClick={() => removeToast(t.id)}
              aria-label="Закрити сповіщення"
            >
              <FiX aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
export default ToastProvider;
