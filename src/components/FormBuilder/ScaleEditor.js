import Input from "../ui/Input";
import screenStyles from "../../styles/screens.module.css";
const cx = (value) =>
  String(value || "")
    .split(/\s+/)
    .map((name) => screenStyles[name] || name)
    .join(" ");
export default function ScaleEditor({ question, onUpdate }) {
  return (
    <div className={cx("scale-editor")}>
      <div className={cx("scale-inputs")}>
        <Input
          label="Мін"
          type="number"
          value={question.scale?.min || 1}
          onChange={(e) =>
            onUpdate(question.id, {
              scale: {
                ...question.scale,
                min: parseInt(e.target.value) || 1,
              },
            })
          }
          placeholder="Мін"
        />
        <span>до</span>
        <Input
          label="Макс"
          type="number"
          value={question.scale?.max || 5}
          onChange={(e) =>
            onUpdate(question.id, {
              scale: {
                ...question.scale,
                max: parseInt(e.target.value) || 5,
              },
            })
          }
          placeholder="Макс"
        />
      </div>
      <div className={cx("scale-labels")}>
        <Input
          label="Мінімальна підпис"
          value={question.scale?.minLabel || ""}
          onChange={(e) =>
            onUpdate(question.id, {
              scale: {
                ...question.scale,
                minLabel: e.target.value,
              },
            })
          }
          placeholder="Мінімальна підпис"
        />
        <Input
          label="Максимальна підпис"
          value={question.scale?.maxLabel || ""}
          onChange={(e) =>
            onUpdate(question.id, {
              scale: {
                ...question.scale,
                maxLabel: e.target.value,
              },
            })
          }
          placeholder="Максимальна підпис"
        />
      </div>
    </div>
  );
}
