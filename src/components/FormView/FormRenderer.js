import { useState, useMemo } from "react";
import Button from "../ui/Button";
import ProgressBar from "../ui/ProgressBar/ProgressBar";
import QuestionAnswer from "./QuestionAnswer";
import styles from "../../styles/screens.module.css";
const isEmptyAnswer = (value) =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && !value.trim()) ||
  (Array.isArray(value) && value.length === 0);
export default function FormRenderer({ currentForm, onSubmit, guidedMode }) {
  const [answers, setAnswers] = useState({});
  const [touched, setTouched] = useState({});
  const [summary, setSummary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState({});
  const handleAnswer = (id, value) => {
    setServerErrors((prev) => ({ ...prev, [id]: null }));
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };
  const handleBlur = (id) => setTouched((prev) => ({ ...prev, [id]: true }));
  const missingAnswer = (question) => isEmptyAnswer(answers[question.id]);
  const progress = useMemo(() => {
    if (!currentForm.questions.length) return 0;
    const count = currentForm.questions.filter((q) => {
      const answer = answers[q.id];
      return !isEmptyAnswer(answer);
    }).length;
    return Math.round((count / currentForm.questions.length) * 100);
  }, [currentForm.questions, answers]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = currentForm.questions.filter(
      (q) => q.required && missingAnswer(q),
    );
    if (missing.length) {
      setTouched((prev) => ({
        ...prev,
        ...Object.fromEntries(missing.map((q) => [q.id, true])),
      }));
      setSummary("Будь ласка, заповніть усі обов’язкові питання.");
      document
        .getElementById(`question-${missing[0].id}`)
        ?.querySelector("input,textarea,select")
        ?.focus();
      return;
    }
    setSummary("");
    setSubmitting(true);
    try {
      await onSubmit(answers);
    } catch (error) {
      if (error.fields?.length) {
        setServerErrors(
          Object.fromEntries(
            error.fields.map((id) => [id, "Перевірте відповідь у цьому полі."]),
          ),
        );
        setTouched((prev) => ({
          ...prev,
          ...Object.fromEntries(error.fields.map((id) => [id, true])),
        }));
        document
          .getElementById(`question-${error.fields[0]}`)
          ?.querySelector("input,textarea,select")
          ?.focus();
      }
      setSummary(
        error.message || "Не вдалося відправити відповідь. Спробуйте ще раз.",
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className={styles["form-view"]}>
      <div className={styles["form-container"]}>
        <ProgressBar value={progress} />
        {guidedMode && (
          <div className={styles["form-hint"]}>
            <p className={styles["hint-title"]}>Як пройти опитування</p>
            <ul>
              <li>Позначені поля потребують обов’язкової відповіді.</li>
              <li>Відповіді можна виправити до відправлення.</li>
              <li>Натисніть «Відправити» після заповнення всіх полів.</li>
            </ul>
          </div>
        )}
        <div className={styles["form-header"]}>
          <h1>{currentForm.title}</h1>
          {currentForm.description && <p>{currentForm.description}</p>}
        </div>
        <p role="status" aria-live="polite">
          {summary}
        </p>
        <form onSubmit={handleSubmit} className={styles["form-content"]}>
          {currentForm.questions.map((question, index) => {
            const error =
              serverErrors[question.id] ||
              (touched[question.id] &&
              question.required &&
              missingAnswer(question)
                ? "Це поле є обов’язковим"
                : null);
            return (
              <fieldset
                id={`question-${question.id}`}
                key={question.id}
                className={styles["question-block"]}
              >
                <legend className={styles["question-label"]}>
                  {index + 1}. {question.title}
                  {question.required && (
                    <span className={styles.required}> (обов’язково)</span>
                  )}
                </legend>
                <QuestionAnswer
                  question={question}
                  answer={answers[question.id]}
                  onAnswer={handleAnswer}
                  onBlur={handleBlur}
                  error={error}
                />
              </fieldset>
            );
          })}
          <div className={styles["form-footer"]}>
            <Button isLoading={submitting} type="submit" fullWidth>
              Відправити
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
