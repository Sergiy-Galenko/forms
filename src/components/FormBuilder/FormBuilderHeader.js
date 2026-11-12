import screenStyles from "../../styles/screens.module.css";
import React from "react";
import { Button } from "../ui/Button";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const FormBuilderHeader = ({
  saved,
  onBack,
  onSave,
  onPublish,
  readiness = 0,
  checklist = [],
}) => {
  return (
    <div className={cx("builder-header")}>
      <h1 className={cx("builder-title")}>Редактор форми</h1>
      <div className={cx("builder-header-left")}>
        <Button variant="secondary" onClick={onBack}>
          ← Назад
        </Button>
        <div className={cx("builder-status")}>
          <p className={cx("eyebrow")}>Готовність форми</p>
          <div className={cx("builder-progress")}>
            <div
              className={cx("builder-progress-bar")}
              style={{
                width: `${Math.max(readiness, 8)}%`,
              }}
            />
          </div>
          <div className={cx("builder-checklist")}>
            {checklist.map((item) => (
              <span
                key={item.label}
                className={cx(`builder-chip ${item.done ? "is-done" : ""}`)}
              >
                {item.done ? "✓" : "•"} {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={cx("builder-actions")}>
        <span role="status" aria-live="polite">
          {saved ? "Збережено" : "Зміни зберігаються кнопкою"}
        </span>
        <Button variant="secondary" onClick={onSave}>
          Зберегти
        </Button>
        <Button variant="primary" onClick={onPublish}>
          Опублікувати
        </Button>
      </div>
    </div>
  );
};
export default FormBuilderHeader;
