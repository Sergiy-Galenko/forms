import { forwardRef } from "react";
import { Link } from "react-router-dom";
import s from "./Button.module.css";
const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    icon: Icon,
    iconPosition = "left",
    iconLeft,
    iconRight,
    isLoading = false,
    loading = isLoading,
    disabled = false,
    fullWidth = false,
    className = "",
    to,
    type = "button",
    ...props
  },
  ref,
) {
  const content = (
    <>
      <span className={loading ? s.hidden : s.content}>
        {iconLeft ||
          (Icon && iconPosition === "left" && <Icon aria-hidden="true" />)}
        {children}
        {iconRight ||
          (Icon && iconPosition === "right" && <Icon aria-hidden="true" />)}
      </span>
      {loading && <span className={s.loader} aria-hidden="true" />}
    </>
  );
  const classes = [
    s.button,
    s[variant] || s.secondary,
    s[size],
    fullWidth ? s.full : "",
    className,
  ].join(" ");
  return to ? (
    <Link
      ref={ref}
      to={to}
      className={classes}
      aria-disabled={disabled || loading}
      onClick={disabled || loading ? (e) => e.preventDefault() : props.onClick}
      {...Object.fromEntries(
        Object.entries(props).filter(([k]) => k !== "onClick"),
      )}
    >
      {content}
    </Link>
  ) : (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={props["aria-label"] || (!children ? props.title : undefined)}
      {...props}
    >
      {content}
    </button>
  );
});
export { Button };
export default Button;
