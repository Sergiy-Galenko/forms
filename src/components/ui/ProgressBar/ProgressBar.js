import s from "./ProgressBar.module.css";
export default function ProgressBar({ value = 0, label = "Заповнення форми" }) {
  return (
    <div
      className={s.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
    >
      <div
        className={s.fill}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
