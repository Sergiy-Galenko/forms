import s from "./Badge.module.css";
export default function Badge({ children, variant = "neutral" }) {
  return (
    <span className={[s.badge, s[variant] || s.neutral].join(" ")}>
      {children}
    </span>
  );
}
