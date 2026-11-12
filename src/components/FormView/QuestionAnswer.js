import { QUESTION_TYPES } from "../../types";
import Input, { TextArea } from "../ui/Input";
import styles from "../../styles/screens.module.css";
export default function QuestionAnswer({
  question,
  answer,
  onAnswer,
  onBlur,
  error,
}) {
  const common = {
    label: "Ваша відповідь",
    "aria-label": question.title,
    "aria-required": question.required,
    value: answer ?? "",
    onChange: (e) => onAnswer(question.id, e.target.value),
    onBlur: () => onBlur(question.id),
    error,
  };
  const choice =
    question.type === QUESTION_TYPES.SINGLE_CHOICE ||
    question.type === QUESTION_TYPES.MULTIPLE_CHOICE;
  if (choice) {
    const multiple = question.type === QUESTION_TYPES.MULTIPLE_CHOICE;
    return (
      <div
        className={styles["options-list"]}
        role="group"
        aria-label={question.title}
        aria-describedby={error ? `error-${question.id}` : undefined}
      >
        {question.options?.map((option) => (
          <label
            key={option.id}
            className={styles[multiple ? "checkbox-option" : "radio-option"]}
          >
            <input
              type={multiple ? "checkbox" : "radio"}
              name={question.id}
              value={option.text}
              checked={
                multiple
                  ? (answer || []).includes(option.text)
                  : answer === option.text
              }
              onChange={(e) => {
                if (multiple) {
                  const current = answer || [];
                  onAnswer(
                    question.id,
                    e.target.checked
                      ? [...current, option.text]
                      : current.filter((v) => v !== option.text),
                  );
                } else onAnswer(question.id, e.target.value);
              }}
              onBlur={() => onBlur(question.id)}
            />
            <span>{option.text}</span>
          </label>
        ))}
        {error && (
          <p id={`error-${question.id}`} className={styles["error-message"]}>
            {error}
          </p>
        )}
      </div>
    );
  }
  if (question.type === QUESTION_TYPES.SCALE)
    return (
      <div className={styles["scale-input"]}>
        <div className={styles["scale-labels"]}>
          <span>{question.scale?.minLabel}</span>
          <span>{question.scale?.maxLabel}</span>
        </div>
        <label htmlFor={`answer-${question.id}`}>Ваша оцінка</label>
        <input
          id={`answer-${question.id}`}
          aria-label={question.title}
          aria-describedby={error ? `error-${question.id}` : undefined}
          aria-invalid={error ? true : undefined}
          type="range"
          min={question.scale?.min ?? 1}
          max={question.scale?.max ?? 5}
          value={answer ?? question.scale?.min ?? 1}
          onChange={(e) => onAnswer(question.id, parseInt(e.target.value))}
          onBlur={() => onBlur(question.id)}
          className={styles["scale-slider"]}
        />
        <div className={styles["scale-value"]}>
          {answer ?? question.scale?.min ?? 1}
        </div>
        {error && (
          <p id={`error-${question.id}`} className={styles["error-message"]}>
            {error}
          </p>
        )}
      </div>
    );
  if (question.type === QUESTION_TYPES.TEXTAREA)
    return <TextArea {...common} rows={4} />;
  if (
    [
      QUESTION_TYPES.TEXT,
      QUESTION_TYPES.EMAIL,
      QUESTION_TYPES.NUMBER,
      QUESTION_TYPES.DATE,
    ].includes(question.type)
  )
    return <Input {...common} type={question.type} />;
  return null;
}
