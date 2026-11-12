import { useId } from "react";
import s from "./Field.module.css";
export default function Field({
  id: provided,
  label,
  hint,
  error,
  required,
  children,
}) {
  const auto = useId();
  const id = provided || auto;
  return (
    <div className={s.field}>
      {label && (
        <label htmlFor={id} className={s.label}>
          {label}
          {required && <span> (обов’язково)</span>}
        </label>
      )}
      {typeof children === "function"
        ? children({
            id,
            "aria-invalid": error ? true : undefined,
            "aria-describedby":
              [hint && `${id}-hint`, error && `${id}-error`]
                .filter(Boolean)
                .join(" ") || undefined,
          })
        : children}
      {hint && (
        <p id={`${id}-hint`} className={s.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={s.error}>
          {error}
        </p>
      )}
    </div>
  );
}
