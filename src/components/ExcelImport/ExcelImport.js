import { useState } from "react";
import Modal from "../ui/Modal/Modal";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useForms } from "../../context/FormsContext";
import { readExcelTest } from "../../utils/excelImport";
import s from "./ExcelImport.module.css";
export default function ExcelImport({ onClose }) {
  const { createForm, setCurrentForm, setView } = useForms();
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = async (e) => {
    const file = e.target.files?.[0];
    setPreview(null);
    setErrors([]);
    if (!file) return;
    setLoading(true);
    try {
      const result = await readExcelTest(file);
      setErrors(result.errors);
      if (result.form) setPreview(result.form);
    } catch (error) {
      setErrors([error.message]);
    } finally {
      setLoading(false);
    }
  };
  const create = () => {
    const form = createForm(preview);
    setCurrentForm(form);
    setView("edit");
    onClose();
  };
  return (
    <Modal isOpen onClose={onClose} title="Створити тест з Excel" size="lg">
      <div className={s.content}>
        <p>
          Один рядок — одне питання. Завантажте шаблон, замініть приклади своїми
          питаннями й оберіть файл.
        </p>
        <a href="/templates/test-template.xlsx" download>
          Завантажити Excel-шаблон
        </a>
        <Input
          label="Excel-файл (.xlsx)"
          type="file"
          accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={load}
          disabled={loading}
          hint="До 2 МБ та 200 питань. Читається перший аркуш; файл не завантажується на сервер."
        />
        <p className={s.help}>
          Колонки: Питання, Тип, Варіанти, Правильна відповідь, Бали,
          Обов’язкове. Розділяйте варіанти символом |. Правильні відповіді —
          текстом або номерами, наприклад 1,3.
        </p>
        {loading && <p role="status">Читаємо файл…</p>}
        {errors.length > 0 && (
          <div role="alert" className={s.errors}>
            <h3>Перевірте файл</h3>
            <ul>
              {errors.slice(0, 20).map((error, i) => (
                <li key={i}>{error}</li>
              ))}
            </ul>
            {errors.length > 20 && <p>Ще помилок: {errors.length - 20}</p>}
          </div>
        )}
        {preview && (
          <>
            <Input
              label="Назва тесту"
              value={preview.title}
              onChange={(e) =>
                setPreview({ ...preview, title: e.target.value })
              }
              maxLength={200}
              required
            />
            <p role="status">
              Знайдено питань: {preview.questions.length}. Максимум балів:{" "}
              {preview.questions.reduce((n, q) => n + q.points, 0)}.
            </p>
            <div className={s.table}>
              <table>
                <caption>
                  Попередній перегляд перших{" "}
                  {Math.min(10, preview.questions.length)} питань
                </caption>
                <thead>
                  <tr>
                    <th>Питання</th>
                    <th>Правильна відповідь</th>
                    <th>Бали</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.questions.slice(0, 10).map((q) => (
                    <tr key={q.id}>
                      <td>{q.title}</td>
                      <td>{q.correctAnswers.join("; ")}</td>
                      <td>{q.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button onClick={create} disabled={!preview.title.trim()}>
              Створити тест
            </Button>
            <p className={s.help}>
              Після створення перевірте питання в редакторі й натисніть
              «Опублікувати», щоб отримати спільне посилання.
            </p>
          </>
        )}
      </div>
    </Modal>
  );
}
