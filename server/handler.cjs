const {
  randomUUID,
  randomBytes,
  createHash,
  createHmac,
  timingSafeEqual,
  scryptSync,
} = require("node:crypto");
const {
  fail,
  prepareForm,
  accessState,
  publicForm,
  validateAndScore,
} = require("./testRules.cjs");
const { getStore } = require("./store.cjs");
const hash = (value) =>
  createHash("sha256").update(String(value)).digest("hex");
function equal(a, b) {
  const x = Buffer.from(a || ""),
    y = Buffer.from(b || "");
  return x.length === y.length && timingSafeEqual(x, y);
}
function passwordHash(password, salt) {
  return scryptSync(password, salt, 32).toString("hex");
}
function sign(record, device) {
  const payload = Buffer.from(
    JSON.stringify({
      id: record.id,
      revision: record.revision,
      device,
      startedAt: Date.now(),
      expires: Date.now() + 86400000,
    }),
  ).toString("base64url");
  return `${payload}.${createHmac("sha256", record.secret).update(payload).digest("base64url")}`;
}
function session(record, token, device) {
  const [data, signature, ...extra] = String(token || "").split(".");
  if (
    !data ||
    !signature ||
    extra.length ||
    !equal(
      signature,
      createHmac("sha256", record.secret).update(data).digest("base64url"),
    )
  )
    fail("Відкрийте тест ще раз.", 401, "session");
  let result;
  try {
    result = JSON.parse(Buffer.from(data, "base64url"));
  } catch {
    fail("Відкрийте тест ще раз.", 401, "session");
  }
  if (
    result.id !== record.id ||
    result.device !== device ||
    result.revision !== record.revision ||
    result.expires < Date.now()
  )
    fail(
      "Тест оновлено або сеанс закінчився. Відкрийте його ще раз.",
      401,
      "session",
    );
  return result;
}
function stats(record) {
  return {
    totalViews: record.views || 0,
    totalResponses: record.responses.length,
    completionRate: record.views
      ? Math.min(
          100,
          Math.round((record.responses.length / record.views) * 100),
        )
      : 0,
    averageTime: record.responses.length
      ? Math.round(
          record.responses.reduce((n, r) => n + (r.duration || 0), 0) /
            record.responses.length,
        )
      : 0,
  };
}
function ownerData(record) {
  return {
    responses: record.responses.map(({ device, attempt, ...r }) => r),
    stats: stats(record),
    status: record.form.status,
  };
}
function resultFor(record, response) {
  return {
    submitted: true,
    isQuiz: record.form.settings.isQuiz,
    ...(record.form.shareSettings.showResults && record.form.settings.isQuiz
      ? { score: response.score, maxScore: response.maxScore }
      : {}),
    showResults: record.form.shareSettings.showResults,
  };
}
async function mutate(store, id, operation) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const current = await store.get(id);
    if (!current) fail("Тест не знайдено.", 404, "not_found");
    const next = structuredClone(current);
    const result = await operation(next);
    next.version = current.version + 1;
    if (Buffer.byteLength(JSON.stringify(next)) > 4 * 1024 * 1024)
      fail("Сховище цього тесту заповнене. Зверніться до автора.", 507, "full");
    if (await store.cas(id, current.version, next)) return result;
  }
  fail("Забагато одночасних відповідей. Спробуйте ще раз.", 409, "busy");
}
function createHandler(injectedStore) {
  return async function handler(req, res) {
    const send = (status, body) => {
      res.statusCode = status;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.end(JSON.stringify(body));
    };
    try {
      if (!["GET", "POST", "PUT", "DELETE"].includes(req.method)) {
        res.setHeader("Allow", "GET, POST, PUT, DELETE");
        return send(405, { error: "Метод не підтримується." });
      }
      if (req.method !== "GET") {
        if (
          !String(req.headers["content-type"] || "").startsWith(
            "application/json",
          )
        )
          fail("Очікується JSON.", 415);
        const origin = req.headers.origin;
        if (origin && new URL(origin).host !== req.headers.host)
          fail("Запит з іншого сайту заборонено.", 403);
      }
      const store = injectedStore || getStore();
      const url = new URL(req.url, "http://localhost");
      const id = url.searchParams.get("id");
      const action = url.searchParams.get("action") || "";
      if (id && !/^pub_[a-f0-9-]{36}$/.test(id))
        fail("Тест не знайдено.", 404, "not_found");
      let body = req.body || {};
      if (Buffer.isBuffer(body) || typeof body === "string") {
        if (Buffer.byteLength(body) > 256000) fail("Запит завеликий.", 413);
        try {
          body = JSON.parse(body.toString());
        } catch {
          fail("Некоректний JSON.");
        }
      }
      if (
        !body ||
        typeof body !== "object" ||
        Array.isArray(body) ||
        Buffer.byteLength(JSON.stringify(body)) > 256000
      )
        fail("Некоректний або завеликий запит.", 413);
      const ip = hash(
        String(
          req.headers["x-forwarded-for"] ||
            req.socket?.remoteAddress ||
            "unknown",
        ).split(",")[0],
      );
      if (
        req.method !== "GET" &&
        !(await store.rate(
          `${ip}:${action || req.method}`,
          action === "publish" ? 20 : 60,
          action === "publish" ? 3600 : 60,
        ))
      )
        fail("Забагато спроб. Спробуйте трохи пізніше.", 429, "rate_limit");
      if (req.method === "POST" && !id && action === "publish") {
        const form = prepareForm(body.form);
        const newId = `pub_${randomUUID()}`,
          ownerToken = randomBytes(32).toString("base64url"),
          salt = randomBytes(16).toString("hex");
        const password = form.shareSettings.password;
        delete form.shareSettings.password;
        delete form.shareSettings.keepPassword;
        const record = {
          id: newId,
          version: 1,
          revision: 1,
          ownerHash: hash(ownerToken),
          secret: randomBytes(32).toString("hex"),
          salt,
          passwordHash: password ? passwordHash(password, salt) : "",
          form,
          responses: [],
          views: 0,
          viewIds: [],
        };
        if (!(await store.cas(newId, null, record)))
          fail("Не вдалося створити тест. Спробуйте ще раз.", 409);
        return send(201, { id: newId, ownerToken });
      }
      if (!id) fail("Вкажіть тест.", 400);
      const record = await store.get(id);
      if (!record) fail("Тест не знайдено.", 404, "not_found");
      const bearer = String(req.headers.authorization || "").replace(
        /^Bearer /,
        "",
      );
      if (
        action === "owner" ||
        req.method === "PUT" ||
        req.method === "DELETE"
      ) {
        if (!equal(hash(bearer), record.ownerHash))
          fail("Немає доступу до керування тестом.", 403, "owner");
        if (req.method === "GET") return send(200, ownerData(record));
        if (req.method === "DELETE") {
          await mutate(store, id, (next) => {
            next.form.status = "closed";
            next.form.shareSettings.isPublic = false;
            next.revision++;
            return null;
          });
          return send(200, { closed: true });
        }
        if (req.method !== "PUT") fail("Метод не підтримується.", 405);
        const form = prepareForm(body.form);
        await mutate(store, id, (next) => {
          const replacement = structuredClone(form);
          const { password, keepPassword } = replacement.shareSettings;
          if (
            form.shareSettings.passwordEnabled &&
            !password &&
            (!keepPassword || !next.passwordHash)
          )
            fail("Введіть пароль доступу.");
          if (password) next.passwordHash = passwordHash(password, next.salt);
          if (!form.shareSettings.passwordEnabled) next.passwordHash = "";
          delete replacement.shareSettings.password;
          delete replacement.shareSettings.keepPassword;
          next.form = replacement;
          next.revision++;
          return null;
        });
        return send(200, { updated: true });
      }
      const cookies = String(req.headers.cookie || "")
        .split(";")
        .map((x) => x.trim().split("="));
      let deviceCookie = cookies.find(([key]) => key === "fc_device_v1")?.[1];
      if (!/^[a-f0-9]{64}$/.test(deviceCookie || "")) {
        deviceCookie = randomBytes(32).toString("hex");
        res.setHeader(
          "Set-Cookie",
          `fc_device_v1=${deviceCookie}; Path=/api/tests; HttpOnly; SameSite=Lax; Max-Age=31536000${process.env.NODE_ENV === "production" ? "; Secure" : ""}`,
        );
      }
      const device = hash(`${id}:${deviceCookie}`);
      const state = accessState(record, device);
      if (req.method === "GET")
        return send(200, {
          accessState:
            state === "allowed" && record.form.shareSettings.passwordEnabled
              ? "password"
              : state,
          form:
            state === "allowed" && !record.form.shareSettings.passwordEnabled
              ? publicForm(record)
              : {
                  id,
                  title: record.form.title,
                  description: record.form.description,
                },
        });
      if (req.method === "POST" && action === "access") {
        if (state !== "allowed")
          fail("Цей тест зараз недоступний.", 403, state);
        if (
          record.form.shareSettings.passwordEnabled &&
          !equal(
            passwordHash(
              String(body.password || "").slice(0, 200),
              record.salt,
            ),
            record.passwordHash,
          )
        )
          fail("Неправильний пароль.", 403, "password");
        const viewId = hash(
          `${device}:${String(body.viewId || "").slice(0, 100)}`,
        );
        await mutate(store, id, (next) => {
          if (!next.viewIds.includes(viewId)) {
            next.views++;
            next.viewIds = [...next.viewIds.slice(-9999), viewId];
          }
          return null;
        });
        return send(200, {
          form: publicForm(record),
          sessionToken: sign(record, device),
        });
      }
      if (req.method === "POST" && action === "submit") {
        const access = session(record, body.sessionToken, device);
        if (!/^[a-zA-Z0-9_-]{16,100}$/.test(body.attemptId || ""))
          fail("Некоректний ідентифікатор відповіді.");
        const attempt = hash(`${device}:${body.attemptId}`);
        const result = await mutate(store, id, (next) => {
          const previous = next.responses.find((r) => r.attempt === attempt);
          if (previous) return resultFor(next, previous);
          session(next, body.sessionToken, device);
          const stateNow = accessState(next, device);
          if (stateNow !== "allowed")
            fail("Цей тест більше недоступний.", 403, stateNow);
          const scored = validateAndScore(next.form, body.answers);
          const response = {
            id: randomUUID(),
            ...scored,
            device,
            attempt,
            submittedAt: new Date().toISOString(),
            duration: Math.max(
              0,
              Math.round((Date.now() - access.startedAt) / 1000),
            ),
          };
          next.responses.push(response);
          return resultFor(next, response);
        });
        return send(200, result);
      }
      fail("Дію не знайдено.", 404);
    } catch (error) {
      const status = error.status || 503;
      return send(status, {
        error: error.status
          ? error.message
          : "Не вдалося зв’язатися зі сховищем. Спробуйте ще раз.",
        code: error.code || "unavailable",
        ...(error.fields ? { fields: error.fields } : {}),
      });
    }
  };
}
module.exports = { createHandler };
