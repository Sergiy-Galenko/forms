import Button from "../Button/Button";
import s from "./ErrorState.module.css";
export default function ErrorState({
  title = "Не вдалося завантажити",
  description = "Перевірте з’єднання та спробуйте ще раз.",
  onRetry,
}) {
  return (
    <div role="alert" className={s.error}>
      <h2>{title}</h2>
      <p>{description}</p>
      {onRetry && <Button onClick={onRetry}>Спробувати ще раз</Button>}
    </div>
  );
}
