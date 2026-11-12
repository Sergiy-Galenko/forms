import { FiFileText } from "@react-icons/all-files/fi/FiFileText";
import s from "./EmptyState.module.css";
export default function EmptyState({
  icon: Icon = FiFileText,
  title,
  description,
  children,
}) {
  return (
    <div className={s.empty}>
      <Icon aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
      {children}
    </div>
  );
}
