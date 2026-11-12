const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLocaleLowerCase("uk")
    .replace(/[’'\s_-]/g, "");
const aliases = {
  title: ["питання", "запитання", "question", "title"],
  type: ["тип", "типпитання", "type"],
  options: ["варіанти", "варіантивідповідей", "options", "choices"],
  correct: [
    "правильнавідповідь",
    "правильнівідповіді",
    "correctanswer",
    "correctanswers",
    "answer",
  ],
  points: ["бали", "бал", "points", "score"],
  required: ["обовязкове", "обовязково", "required"],
};
const types = {
  text: "text",
  текст: "text",
  короткавідповідь: "text",
  textarea: "textarea",
  довгавідповідь: "textarea",
  single: "single",
  один: "single",
  вибіродного: "single",
  multiple: "multiple",
  кілька: "multiple",
  вибіркількох: "multiple",
  scale: "scale",
  шкала: "scale",
  date: "date",
  дата: "date",
  email: "email",
  number: "number",
  число: "number",
};
const list = (value) =>
  String(value ?? "")
    .split(/\r?\n|\|/)
    .map((x) => x.trim())
    .filter(Boolean);
export function parseExcelRows(rows, fileName = "Новий тест") {
  const errors = [];
  if (Array.isArray(rows) && rows.length > 5000)
    return { errors: ["У файлі забагато рядків. Залиште до 200 питань."] };
  if (!Array.isArray(rows) || rows.length < 2)
    return {
      errors: [
        "Файл порожній. Додайте рядок заголовків і хоча б одне питання.",
      ],
    };
  const headerIndex = rows.findIndex((row) =>
    row?.some((v) => aliases.title.includes(normalize(v))),
  );
  if (headerIndex < 0)
    return {
      errors: ["Не знайдено колонку «Питання». Скористайтеся шаблоном."],
    };
  const headers = rows[headerIndex].map(normalize),
    columns = {};
  for (const [key, names] of Object.entries(aliases)) {
    const positions = headers
      .map((h, i) => (names.includes(h) ? i : -1))
      .filter((i) => i >= 0);
    if (positions.length > 1)
      errors.push(`Колонка «${rows[headerIndex][positions[0]]}» повторюється.`);
    columns[key] = positions[0] ?? -1;
  }
  const questions = [];
  for (let i = headerIndex + 1; i < rows.length; i++) {
    const row = rows[i] || [];
    if (
      Object.values(columns)
        .filter((column) => column >= 0)
        .every(
          (column) =>
            row[column] === null ||
            row[column] === undefined ||
            String(row[column]).trim() === "",
        )
    )
      continue;
    const get = (key) => (columns[key] < 0 ? "" : (row[columns[key]] ?? ""));
    const title = String(get("title")).trim(),
      options = list(get("options"));
    const correctCell = get("correct");
    const rawCorrect =
      correctCell instanceof Date
        ? correctCell.toISOString().slice(0, 10)
        : String(correctCell).trim();
    const answers = list(rawCorrect);
    let correctAnswers = answers;
    if (options.length && /^\d+(\s*[,;]\s*\d+)*$/.test(rawCorrect)) {
      correctAnswers = rawCorrect
        .split(/[,;]/)
        .map((v) => options[Number(v.trim()) - 1]);
      if (correctAnswers.some((v) => !v))
        errors.push(
          `Рядок ${i + 1}: номер правильної відповіді виходить за межі варіантів.`,
        );
    }
    const rawType = normalize(get("type"));
    const type = rawType
      ? types[rawType]
      : options.length
        ? correctAnswers.length > 1
          ? "multiple"
          : "single"
        : "text";
    const rawPoints = get("points");
    const points =
      String(rawPoints).trim() === ""
        ? 1
        : Number(String(rawPoints).replace(",", "."));
    const required = normalize(get("required"));
    if (
      required &&
      !["так", "ні", "yes", "no", "true", "false", "1", "0"].includes(required)
    )
      errors.push(`Рядок ${i + 1}: «Обов’язкове» має бути «так» або «ні».`);
    if (!title || title.length > 1000)
      errors.push(`Рядок ${i + 1}: заповніть питання (до 1000 символів).`);
    if (!type) errors.push(`Рядок ${i + 1}: невідомий тип питання.`);
    if (!correctAnswers.length || correctAnswers.some((v) => !v))
      errors.push(
        `Рядок ${i + 1}: вкажіть правильну відповідь для автоматичного оцінювання.`,
      );
    if (["single", "multiple"].includes(type)) {
      if (
        options.length < 2 ||
        options.length > 50 ||
        new Set(options).size !== options.length
      )
        errors.push(`Рядок ${i + 1}: потрібно 2–50 різних варіантів.`);
      if (correctAnswers.some((a) => !options.includes(a)))
        errors.push(
          `Рядок ${i + 1}: правильна відповідь не збігається з варіантами.`,
        );
      if (type === "single" && correctAnswers.length !== 1)
        errors.push(
          `Рядок ${i + 1}: для вибору одного потрібна одна правильна відповідь.`,
        );
    }
    if (!Number.isFinite(points) || points <= 0 || points > 1000)
      errors.push(
        `Рядок ${i + 1}: бали мають бути більші за 0 і не перевищувати 1000.`,
      );
    questions.push({
      id: `import-${i}-${Math.random().toString(36).slice(2, 10)}`,
      title,
      type,
      required: !["ні", "no", "false", "0"].includes(required),
      options: options.map((text, j) => ({ id: `option-${i}-${j}`, text })),
      correctAnswers: correctAnswers.filter(Boolean),
      points,
      placeholder: "",
      ...(type === "scale"
        ? { scale: { min: 1, max: 5, minLabel: "", maxLabel: "" } }
        : {}),
    });
  }
  if (!questions.length) errors.push("Немає питань для імпорту.");
  if (questions.length > 200)
    errors.push("За один раз можна імпортувати не більше 200 питань.");
  return errors.length
    ? { errors }
    : {
        errors: [],
        form: {
          title: fileName.replace(/\.xlsx$/i, ""),
          description: "",
          questions,
          settings: { isQuiz: true, showProgress: true, allowAnonymous: true },
          shareSettings: { isPublic: true, showResults: true },
        },
      };
}
export async function readExcelTest(file) {
  if (!/\.xlsx$/i.test(file.name))
    throw new Error(
      "Оберіть Excel-файл .xlsx. Старий .xls збережіть у форматі .xlsx.",
    );
  if (file.size > 2 * 1024 * 1024)
    throw new Error("Розмір файлу має бути до 2 МБ.");
  const { readSheet } = await import("read-excel-file/browser");
  let rows;
  try {
    rows = await readSheet(file);
  } catch {
    throw new Error(
      "Не вдалося прочитати Excel-файл. Перевірте, що він не пошкоджений і не захищений паролем.",
    );
  }
  return parseExcelRows(rows, file.name);
}
