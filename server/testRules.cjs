const { randomUUID } = require("node:crypto");
const TYPES = [
  "text",
  "textarea",
  "single",
  "multiple",
  "scale",
  "date",
  "email",
  "number",
];
function fail(message, status = 400, code = "invalid_request") {
  throw Object.assign(new Error(message), { status, code });
}
const text = (value, max = 10000) =>
  typeof value === "string"
    ? value.trim().slice(0, max)
    : String(value ?? "")
        .trim()
        .slice(0, max);
function prepareForm(input) {
  if (!input || typeof input !== "object" || Array.isArray(input))
    fail("Передайте тест для публікації.");
  if (!text(input.title, 200)) fail("Додайте назву тесту.");
  if (
    !Array.isArray(input.questions) ||
    !input.questions.length ||
    input.questions.length > 200
  )
    fail("Тест має містити від 1 до 200 питань.");
  const ids = new Set();
  const questions = input.questions.map((q, i) => {
    if (!q || !TYPES.includes(q.type) || !text(q.title, 1000))
      fail(`Перевірте назву й тип питання ${i + 1}.`);
    const id = text(q.id, 100) || randomUUID();
    if (
      !/^[a-zA-Z0-9_-]{1,100}$/.test(id) ||
      ["__proto__", "constructor", "prototype"].includes(id)
    )
      fail("Некоректний ідентифікатор питання.");
    if (ids.has(id)) fail("Ідентифікатори питань мають бути унікальними.");
    ids.add(id);
    const options = Array.isArray(q.options)
      ? q.options.map((o) => ({
          id: text(o.id, 100) || randomUUID(),
          text: text(o.text, 1000),
        }))
      : [];
    const choice = ["single", "multiple"].includes(q.type);
    if (
      choice &&
      (options.length < 2 ||
        options.length > 50 ||
        options.some((o) => !o.text) ||
        new Set(options.map((o) => o.text)).size !== options.length)
    )
      fail(`Питання ${i + 1}: додайте 2–50 різних непорожніх варіантів.`);
    const correctAnswers = Array.isArray(q.correctAnswers)
      ? q.correctAnswers.map((a) => text(a, 1000)).filter(Boolean)
      : [];
    if (new Set(correctAnswers).size !== correctAnswers.length)
      fail(`Питання ${i + 1}: правильні відповіді повторюються.`);
    if (
      choice &&
      correctAnswers.some((a) => !options.some((o) => o.text === a))
    )
      fail(`Питання ${i + 1}: правильна відповідь відсутня серед варіантів.`);
    if (q.type === "single" && correctAnswers.length > 1)
      fail(`Питання ${i + 1}: оберіть одну правильну відповідь.`);
    const points = correctAnswers.length ? Number(q.points ?? 1) : 0;
    if (!Number.isFinite(points) || points < 0 || points > 1000)
      fail(`Питання ${i + 1}: бали мають бути від 0 до 1000.`);
    const question = {
      id,
      title: text(q.title, 1000),
      type: q.type,
      required: !!q.required,
      options,
      correctAnswers,
      points,
    };
    if (q.type === "scale") {
      const min = Number(q.scale?.min ?? 1),
        max = Number(q.scale?.max ?? 5);
      if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max)
        fail(`Перевірте межі шкали питання ${i + 1}.`);
      question.scale = {
        min,
        max,
        minLabel: text(q.scale?.minLabel, 100),
        maxLabel: text(q.scale?.maxLabel, 100),
      };
    }
    return question;
  });
  const s = input.shareSettings || {};
  const maxResponses = s.limitResponsesEnabled ? Number(s.maxResponses) : null;
  if (
    s.limitResponsesEnabled &&
    (!Number.isInteger(maxResponses) || maxResponses < 1 || maxResponses > 5000)
  )
    fail("Ліміт відповідей має бути цілим числом від 1 до 5000.");
  if (s.expiresAt && !Number.isFinite(Date.parse(s.expiresAt)))
    fail("Вкажіть коректну дату закінчення.");
  const expiresAt = s.expiresAt ? new Date(s.expiresAt).toISOString() : "";
  const password = text(s.password, 200);
  if (s.passwordEnabled && !password && !s.keepPassword)
    fail("Введіть пароль доступу.");
  return {
    title: text(input.title, 200),
    description: text(input.description, 5000),
    questions,
    status: input.status === "closed" ? "closed" : "active",
    shareSettings: {
      isPublic: s.isPublic !== false,
      passwordEnabled: !!s.passwordEnabled,
      password,
      keepPassword: !!s.keepPassword,
      limitResponsesEnabled: !!s.limitResponsesEnabled,
      maxResponses,
      expiresAt,
      showResults: !!s.showResults,
      oneResponsePerDevice: !!s.oneResponsePerDevice,
    },
    settings: {
      ...(input.settings || {}),
      isQuiz: questions.some((q) => q.correctAnswers.length > 0),
    },
  };
}
function accessState(record, device) {
  const f = record.form,
    s = f.shareSettings;
  if (f.status !== "active" || !s.isPublic) return "closed";
  if (s.expiresAt && Date.parse(s.expiresAt) <= Date.now()) return "expired";
  if (
    record.responses.length >=
    Math.min(s.limitResponsesEnabled ? s.maxResponses : 5000, 5000)
  )
    return "limited";
  if (
    s.oneResponsePerDevice &&
    record.responses.some((r) => r.device === device)
  )
    return "already_responded";
  return "allowed";
}
function publicForm(record) {
  const f = record.form;
  return {
    id: record.id,
    title: f.title,
    description: f.description,
    questions: f.questions.map(({ correctAnswers, points, ...q }) => q),
    settings: { isQuiz: f.settings.isQuiz },
    shareSettings: {
      showResults: f.shareSettings.showResults,
      oneResponsePerDevice: f.shareSettings.oneResponsePerDevice,
    },
    status: f.status,
  };
}
const normalize = (value) =>
  String(value ?? "")
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("uk");
function validateAndScore(form, answers) {
  if (!answers || typeof answers !== "object" || Array.isArray(answers))
    fail("Перевірте відповіді.");
  const clean = {},
    errors = [];
  let score = 0,
    maxScore = 0;
  for (const q of form.questions) {
    const value = answers[q.id];
    const empty =
      value === undefined ||
      value === null ||
      (typeof value === "string" && !value.trim()) ||
      (Array.isArray(value) && !value.length);
    if (empty) {
      if (q.required) errors.push(q.id);
    } else {
      if (q.type === "multiple") {
        if (
          !Array.isArray(value) ||
          value.length > 50 ||
          new Set(value).size !== value.length ||
          value.some(
            (v) =>
              typeof v !== "string" || !q.options.some((o) => o.text === v),
          )
        )
          errors.push(q.id);
        else clean[q.id] = value;
      } else if (q.type === "scale") {
        const n = Number(value);
        if (
          !Number.isFinite(n) ||
          n < q.scale.min ||
          n > q.scale.max ||
          !Number.isInteger(n)
        )
          errors.push(q.id);
        else clean[q.id] = n;
      } else if (typeof value !== "string" || value.length > 10000)
        errors.push(q.id);
      else if (q.type === "single" && !q.options.some((o) => o.text === value))
        errors.push(q.id);
      else if (q.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        errors.push(q.id);
      else if (q.type === "number" && !Number.isFinite(Number(value)))
        errors.push(q.id);
      else if (q.type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value))
        errors.push(q.id);
      else clean[q.id] = value;
    }
    if (q.correctAnswers.length) {
      maxScore += q.points;
      const normalizeAnswer = ["number", "scale"].includes(q.type)
        ? (value) => String(Number(value))
        : normalize;
      const actual = (Array.isArray(clean[q.id]) ? clean[q.id] : [clean[q.id]])
        .map(normalizeAnswer)
        .sort();
      const expected = q.correctAnswers.map(normalizeAnswer).sort();
      const correct =
        q.type === "multiple"
          ? actual.length === expected.length &&
            actual.every((a, i) => a === expected[i])
          : expected.includes(actual[0]) && !empty;
      if (correct) score += q.points;
    }
  }
  if (errors.length)
    throw Object.assign(
      new Error("Перевірте обов’язкові поля та формат відповідей."),
      { status: 422, code: "validation", fields: [...new Set(errors)] },
    );
  return {
    answers: clean,
    score: Number(score.toFixed(4)),
    maxScore: Number(maxScore.toFixed(4)),
  };
}
module.exports = {
  fail,
  prepareForm,
  accessState,
  publicForm,
  validateAndScore,
};
