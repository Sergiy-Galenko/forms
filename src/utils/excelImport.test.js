import { parseExcelRows } from "./excelImport";
const header = [
  "Питання",
  "Тип",
  "Варіанти",
  "Правильна відповідь",
  "Бали",
  "Обов’язкове",
];
test("imports Ukrainian headers, answer indexes, numeric values and points", () => {
  const result = parseExcelRows(
    [
      header,
      ["Столиця?", "single", "Київ | Львів", 1, 2, "так"],
      ["Парні", "multiple", "2 | 3 | 4", "1,3", 3, "так"],
      ["2+2", "number", "", 4, 1, "ні"],
    ],
    "Математика.xlsx",
  );
  expect(result.errors).toEqual([]);
  expect(result.form.title).toBe("Математика");
  expect(result.form.questions.map((q) => q.correctAnswers)).toEqual([
    ["Київ"],
    ["2", "4"],
    ["4"],
  ]);
  expect(result.form.questions[2].required).toBe(false);
});
test("rejects all rows on malformed answer keys and duplicate headers", () => {
  const result = parseExcelRows([
    header,
    ["Столиця?", "single", "Київ | Львів", 3, 1, "так"],
  ]);
  expect(result.form).toBeUndefined();
  expect(result.errors.join(" ")).toMatch(/Рядок 2/);
  expect(
    parseExcelRows([
      ["Question", "Питання"],
      ["One", "Two"],
    ]).errors.join(" "),
  ).toMatch(/повторюється/);
});
test("infers types and ignores notes outside recognized columns", () => {
  const result = parseExcelRows([
    ["Question", "Options", "Correct answer", "Points", "", "Notes"],
    ["Один", "Так | Ні", "Так", 1],
    ["Кілька", "A | B | C", "A | C", 2],
    [null, null, null, null, null, "Інструкція"],
  ]);
  expect(result.errors).toEqual([]);
  expect(result.form.questions.map((q) => q.type)).toEqual([
    "single",
    "multiple",
  ]);
});
test("rejects missing keys, unsupported types and invalid scores", () => {
  const result = parseExcelRows([
    header,
    ["Питання", "unknown", "", "", -1, "можливо"],
  ]);
  expect(result.errors.length).toBeGreaterThanOrEqual(4);
  expect(parseExcelRows([]).form).toBeUndefined();
});
test("imports Excel date cells as ISO date answer keys", () => {
  const result = parseExcelRows([
    header,
    ["Дата", "date", "", new Date("2026-11-12T00:00:00Z"), 1, "так"],
  ]);
  expect(result.errors).toEqual([]);
  expect(result.form.questions[0].correctAnswers).toEqual(["2026-11-12"]);
});
