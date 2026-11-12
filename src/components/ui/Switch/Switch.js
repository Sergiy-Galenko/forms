import { forwardRef, useId } from "react";
import s from "./Switch.module.css";
export default forwardRef(function Switch(
  { label, hint, error, id: provided, ...props },
  ref,
) {
  const auto = useId();
  const id = provided || auto;
  return (
    <div>
      <label className={s.label} htmlFor={id}>
        <input
          {...props}
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
        />
        <span>{label}</span>
      </label>
      {hint && (
        <p className={s.hint} id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className={s.error} id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});
