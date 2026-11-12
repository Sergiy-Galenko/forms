import s from "./Spinner.module.css";
export default function Spinner({ label = "Завантаження" }) {
  return <span role="status" aria-label={label} className={s.spinner} />;
}
