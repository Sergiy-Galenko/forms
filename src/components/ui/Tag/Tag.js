import s from "./Tag.module.css";
export default function Tag({ children, variant = "neutral" }) {
  return (
    <span className={[s.badge, s[variant] || s.neutral].join(" ")}>
      {children}
    </span>
  );
}
