import { useState } from "react";
import Tabs from "../ui/Tabs/Tabs";
import useMediaQuery from "../../hooks/useMediaQuery";
import screenStyles from "../../styles/screens.module.css";
import React from "react";
import QuestionEditor from "./QuestionEditor";
import { Input, TextArea } from "../ui/Input";
import { Button } from "../ui/Button";
import { QUESTION_TYPES } from "../../types";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
const FormBuilderCanvas = ({
  formData,
  setFormData,
  updateQuestion,
  deleteQuestion,
  moveQuestion,
  addQuestion,
  guidedMode,
}) => {
  const mobile = useMediaQuery("(max-width: 767px)");
  const [tab, setTab] = useState("questions");
  const settings = (
    <div className={cx("form-settings")}>
      <Input
        label="Назва опитування"
        value={formData.title}
        onChange={(e) =>
          setFormData({
            ...formData,
            title: e.target.value,
          })
        }
        placeholder="Назва опитування"
        className={cx("form-title-input-wrapper")}
      />
      <TextArea
        label="Опис опитування (необов'язково)"
        value={formData.description}
        onChange={(e) =>
          setFormData({
            ...formData,
            description: e.target.value,
          })
        }
        placeholder="Опис опитування (необов'язково)"
        rows={2}
      />
    </div>
  );
  const overview = (
    <div className={cx("builder-overview")}>
      <div className={cx("overview-item")}>
        <span className={cx("overview-label")}>Питань</span>
        <strong className={cx("overview-value")}>
          {formData.questions.length}
        </strong>
      </div>
      <div className={cx("overview-item")}>
        <span className={cx("overview-label")}>Обов’язкових</span>
        <strong className={cx("overview-value")}>
          {formData.questions.filter((q) => q.required).length}
        </strong>
      </div>
      <div className={cx("overview-item")}>
        <span className={cx("overview-label")}>Типів</span>
        <strong className={cx("overview-value")}>
          {new Set(formData.questions.map((q) => q.type)).size || 0}
        </strong>
      </div>
    </div>
  );
  const palette = (
    <div className={cx("builder-quick-add")}>
      <div>
        <p className={cx("quick-title")}>Додати питання одним кліком</p>
        {guidedMode && (
          <p className={cx("quick-helper")}>
            Оберіть заготовку: ми автоматично підставимо базові варіанти
            відповіді.
          </p>
        )}
      </div>
      <div className={cx("quick-buttons")}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => addQuestion(QUESTION_TYPES.TEXT)}
        >
          Коротка відповідь
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => addQuestion(QUESTION_TYPES.SINGLE_CHOICE)}
        >
          Вибір одного
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => addQuestion(QUESTION_TYPES.MULTIPLE_CHOICE)}
        >
          Вибір кількох
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => addQuestion(QUESTION_TYPES.SCALE)}
        >
          Шкала 1–5
        </Button>
      </div>
    </div>
  );
  const questions = (
    <div className={cx("questions-list")}>
      {formData.questions.map((question, index) => (
        <QuestionEditor
          key={question.id}
          question={question}
          index={index}
          total={formData.questions.length}
          onUpdate={updateQuestion}
          onDelete={deleteQuestion}
          onMove={moveQuestion}
        />
      ))}
    </div>
  );
  const add = (
    <Button
      variant="ghost"
      className={cx("btn-add-question")}
      onClick={() => addQuestion(QUESTION_TYPES.TEXT)}
      fullWidth
    >
      + Додати питання
    </Button>
  );
  return mobile ? (
    <Tabs
      value={tab}
      onChange={setTab}
      items={[
        {
          id: "questions",
          label: "Питання",
          content: (
            <div className={screenStyles["mobile-panel"]}>
              {palette}
              {questions}
              {add}
            </div>
          ),
        },
        {
          id: "settings",
          label: "Налаштування",
          content: (
            <div className={screenStyles["mobile-panel"]}>
              {settings}
              {overview}
            </div>
          ),
        },
      ]}
    />
  ) : (
    <div className={cx("builder-content")}>
      {settings}
      {overview}
      {palette}
      {questions}
      {add}
    </div>
  );
};
export default FormBuilderCanvas;
