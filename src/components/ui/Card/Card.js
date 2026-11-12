import s from "./Card.module.css";
export default function Card({
  children,
  header,
  footer,
  variant = "outlined",
  glass,
  hoverable,
  padding = "md",
  className = "",
  ...props
}) {
  return (
    <div
      className={[
        s.card,
        s[variant],
        s[padding],
        hoverable ? s.hoverable : "",
        className,
      ].join(" ")}
      {...props}
    >
      {header && <div className={s.header}>{header}</div>}
      {children}
      {footer && <div className={s.footer}>{footer}</div>}
    </div>
  );
}
export { Card };
