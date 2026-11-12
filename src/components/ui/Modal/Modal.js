import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "@react-icons/all-files/fi/FiX";
import s from "./Modal.module.css";
export default function Modal({
  isOpen,
  onClose,
  title = "Діалог",
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  showCloseButton = true,
  className = "",
}) {
  const ref = useRef(null);
  const close = useRef(onClose);
  close.current = onClose;
  const id = useId();
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = ref.current;
    const elements = () =>
      Array.from(
        dialog.querySelectorAll(
          'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]',
        ),
      ).filter((el) => !el.hidden);
    (elements()[0] || dialog).focus();
    const key = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close.current();
      }
      if (e.key === "Tab") {
        const items = elements(),
          first = items[0],
          last = items[items.length - 1];
        if (!first) {
          e.preventDefault();
          dialog.focus();
        } else if (
          e.shiftKey &&
          (document.activeElement === first ||
            document.activeElement === dialog)
        ) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    const focus = (e) => {
      if (!dialog.contains(e.target)) (elements()[0] || dialog).focus();
    };
    document.addEventListener("keydown", key);
    document.addEventListener("focusin", focus);
    return () => {
      document.removeEventListener("keydown", key);
      document.removeEventListener("focusin", focus);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return createPortal(
    <div
      className={s.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget && closeOnBackdrop) onClose();
      }}
    >
      <section
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={id}
        className={[s.dialog, s[size], className].join(" ")}
      >
        <header className={s.header}>
          <h2 id={id}>{title}</h2>
          {showCloseButton && (
            <button
              type="button"
              className={s.close}
              onClick={onClose}
              aria-label="Закрити"
            >
              <FiX aria-hidden="true" />
            </button>
          )}
        </header>
        <div className={s.body}>{children}</div>
        {footer && <footer className={s.footer}>{footer}</footer>}
      </section>
    </div>,
    document.body,
  );
}
