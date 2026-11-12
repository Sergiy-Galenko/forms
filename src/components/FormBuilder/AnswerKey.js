import { useState } from "react";
import Input from "../ui/Input";
import s from "./AnswerKey.module.css";
export default function AnswerKey({ question, onUpdate }) {
  const answers = question.correctAnswers || [];
  const choice = ["single", "multiple"].includes(question.type);
  const [draft, setDraft] = useState(answers.join(" | "));
  const update = (correctAnswers) =>
    onUpdate(question.id, { correctAnswers, points: question.points ?? 1 });
  return (
    <fieldset className={s.key}>
      <legend>Оцінювання</legend>
      <p>
        Правильні відповіді бачить лише автор. Без правильної відповіді питання
        не додає балів.
      </p>
      {choice ? (
        <div>
          {question.options?.map((option) => (
            <label key={option.id} className={s.option}>
              <input
                type={question.type === "multiple" ? "checkbox" : "radio"}
                name={`key-${question.id}`}
                checked={answers.includes(option.text)}
                disabled={!option.text.trim()}
                onChange={(e) =>
                  update(
                    question.type === "multiple"
                      ? e.target.checked
                        ? [...answers, option.text]
                        : answers.filter((a) => a !== option.text)
                      : [option.text],
                  )
                }
              />
              <span>{option.text || "Спочатку заповніть варіант"}</span>
            </label>
          ))}
        </div>
      ) : (
        <Input
          label="Правильна відповідь"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            update(
              e.target.value
                .split("|")
                .map((a) => a.trim())
                .filter(Boolean),
            );
          }}
          hint="Для тексту регістр і пробіли на краях не враховуються. Альтернативні правильні відповіді розділяйте |."
        />
      )}
      <Input
        label="Бали за правильну відповідь"
        type="number"
        min="0"
        max="1000"
        step="0.5"
        value={question.points ?? 1}
        onChange={(e) =>
          onUpdate(question.id, {
            points: e.target.value === "" ? "" : Number(e.target.value),
          })
        }
      />
      {answers.length > 0 && (
        <button
          type="button"
          className={s.clear}
          onClick={() => {
            update([]);
            setDraft("");
          }}
        >
          Не оцінювати це питання
        </button>
      )}
    </fieldset>
  );
}
