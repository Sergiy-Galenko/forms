const test = require("node:test");
const assert = require("node:assert/strict");
const { createHandler } = require("./handler.cjs");
const { FileStore, RedisStore } = require("./store.cjs");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
class MemoryStore {
  constructor() {
    this.data = new Map();
  }
  async get(id) {
    return this.data.has(id) ? structuredClone(this.data.get(id)) : null;
  }
  async cas(id, version, value) {
    const current = this.data.get(id);
    if (version === null ? !!current : current?.version !== version)
      return false;
    this.data.set(id, structuredClone(value));
    return true;
  }
  async rate() {
    return true;
  }
}
const fixture = (settings = {}) => ({
  title: "Тест",
  status: "active",
  questions: [
    {
      id: "one",
      title: "Столиця?",
      type: "single",
      required: true,
      options: [
        { id: "a", text: "Київ" },
        { id: "b", text: "Львів" },
      ],
      correctAnswers: ["Київ"],
      points: 2,
    },
    {
      id: "two",
      title: "Парні",
      type: "multiple",
      required: true,
      options: [
        { id: "a", text: "2" },
        { id: "b", text: "3" },
        { id: "c", text: "4" },
      ],
      correctAnswers: ["2", "4"],
      points: 3,
    },
  ],
  shareSettings: { isPublic: true, showResults: true, ...settings },
});
function client(handler) {
  let cookie = "";
  return async function call(method, url, body, ownerToken) {
    let data;
    const headers = {};
    const req = {
      method,
      url,
      body,
      headers: {
        host: "localhost",
        "content-type": "application/json",
        cookie,
        ...(ownerToken ? { authorization: `Bearer ${ownerToken}` } : {}),
      },
      socket: { remoteAddress: "127.0.0.1" },
    };
    const res = {
      setHeader(k, v) {
        headers[k] = v;
      },
      end(raw) {
        data = JSON.parse(raw);
      },
    };
    await handler(req, res);
    if (headers["Set-Cookie"]) cookie = headers["Set-Cookie"].split(";")[0];
    return { status: res.statusCode, data, headers };
  };
}
async function published(settings = {}, store = new MemoryStore()) {
  const handler = createHandler(store),
    author = client(handler);
  const publish = await author("POST", "/api/tests?action=publish", {
    form: fixture(settings),
  });
  assert.equal(publish.status, 201);
  return {
    handler,
    author,
    id: publish.data.id,
    ownerToken: publish.data.ownerToken,
    store,
  };
}
async function access(call, id, password = "") {
  const r = await call("POST", `/api/tests?id=${id}&action=access`, {
    password,
    viewId: "view-one",
  });
  assert.equal(r.status, 200);
  return r.data;
}
const attempt = "attempt_12345678901234567890";
const answers = { one: "Київ", two: ["4", "2"] };
test("different device receives questions without keys, submits, and owner sees server scores", async () => {
  const { handler, author, id, ownerToken } = await published();
  const participant = client(handler);
  const read = await participant("GET", `/api/tests?id=${id}`);
  assert.equal(read.status, 200);
  assert.equal(JSON.stringify(read.data).includes("correctAnswers"), false);
  assert.equal(JSON.stringify(read.data).includes("ownerToken"), false);
  const opened = await access(participant, id);
  const body = {
    sessionToken: opened.sessionToken,
    attemptId: attempt,
    answers,
    score: 999,
  };
  const submit = await participant(
    "POST",
    `/api/tests?id=${id}&action=submit`,
    body,
  );
  assert.equal(submit.data.score, 5);
  assert.equal(submit.data.maxScore, 5);
  assert.equal(JSON.stringify(submit.data).includes("correctAnswers"), false);
  await participant("POST", `/api/tests?id=${id}&action=submit`, body);
  const result = await author(
    "GET",
    `/api/tests?id=${id}&action=owner`,
    undefined,
    ownerToken,
  );
  assert.equal(result.data.responses.length, 1);
  assert.equal(result.data.responses[0].score, 5);
  assert.equal(JSON.stringify(result.data).includes("device"), false);
  assert.equal(
    (await participant("GET", `/api/tests?id=${id}&action=owner`)).status,
    403,
  );
});
test("password is server-enforced and never returned in public payload", async () => {
  const { handler, id } = await published({
    passwordEnabled: true,
    password: "secret-password",
  });
  const participant = client(handler);
  const r = await participant("GET", `/api/tests?id=${id}`);
  assert.equal(r.data.accessState, "password");
  assert.equal(r.data.form.questions, undefined);
  const bad = await participant("POST", `/api/tests?id=${id}&action=access`, {
    password: "wrong",
  });
  assert.equal(bad.data.code, "password");
  const good = await access(participant, id, "secret-password");
  assert.equal(JSON.stringify(good).includes("secret-password"), false);
});
test("global response limit is atomic across concurrent devices", async () => {
  const { handler, id, author, ownerToken } = await published({
    limitResponsesEnabled: true,
    maxResponses: 1,
  });
  const people = [client(handler), client(handler), client(handler)];
  const sessions = await Promise.all(people.map((p) => access(p, id)));
  const results = await Promise.all(
    people.map((p, i) =>
      p("POST", `/api/tests?id=${id}&action=submit`, {
        answers,
        sessionToken: sessions[i].sessionToken,
        attemptId: attempt,
      }),
    ),
  );
  assert.equal(results.filter((r) => r.status === 200).length, 1);
  assert.equal(results.filter((r) => r.data.code === "limited").length, 2);
  const owner = await author(
    "GET",
    `/api/tests?id=${id}&action=owner`,
    undefined,
    ownerToken,
  );
  assert.equal(owner.data.responses.length, 1);
});
test("one browser attempt, exact multi-select grading, and hidden scores", async () => {
  const { handler, id } = await published({
    oneResponsePerDevice: true,
    showResults: false,
  });
  const p = client(handler);
  const session = await access(p, id);
  const r = await p("POST", `/api/tests?id=${id}&action=submit`, {
    sessionToken: session.sessionToken,
    attemptId: attempt,
    answers: { one: "Київ", two: ["2"] },
  });
  assert.equal(r.status, 200);
  assert.equal(r.data.score, undefined);
  const blocked = await p("POST", `/api/tests?id=${id}&action=access`, {});
  assert.equal(blocked.data.code, "already_responded");
  const replay = await p("POST", `/api/tests?id=${id}&action=submit`, {
    sessionToken: session.sessionToken,
    attemptId: attempt,
    answers,
  });
  assert.equal(replay.status, 200);
});
test("expired, closed, bad session and required answers reject server-side", async () => {
  for (const [settings, code] of [
    [{ expiresAt: "2000-01-01T00:00:00Z" }, "expired"],
    [{ isPublic: false }, "closed"],
  ]) {
    const { handler, id } = await published(settings);
    assert.equal(
      (await client(handler)("POST", `/api/tests?id=${id}&action=access`, {}))
        .data.code,
      code,
    );
  }
  const { handler, id } = await published();
  const p = client(handler);
  const session = await access(p, id);
  assert.equal(
    (
      await p("POST", `/api/tests?id=${id}&action=submit`, {
        sessionToken: "forged",
        attemptId: attempt,
        answers,
      })
    ).status,
    401,
  );
  const empty = await p("POST", `/api/tests?id=${id}&action=submit`, {
    sessionToken: session.sessionToken,
    attemptId: attempt,
    answers: {},
  });
  assert.equal(empty.status, 422);
  assert.deepEqual(empty.data.fields, ["one", "two"]);
});
test("owner updates every access setting, invalidates old sessions and closes links", async () => {
  const { handler, author, id, ownerToken } = await published();
  const p = client(handler);
  const opened = await access(p, id);
  const changed = fixture({
    passwordEnabled: true,
    password: "new-secret",
    oneResponsePerDevice: true,
    showResults: false,
    expiresAt: "2099-01-01T00:00:00Z",
    limitResponsesEnabled: true,
    maxResponses: 10,
  });
  assert.equal(
    (await author("PUT", `/api/tests?id=${id}`, { form: changed }, ownerToken))
      .status,
    200,
  );
  const stale = await p("POST", `/api/tests?id=${id}&action=submit`, {
    sessionToken: opened.sessionToken,
    attemptId: attempt,
    answers,
  });
  assert.equal(stale.status, 401);
  assert.equal(
    (await p("GET", `/api/tests?id=${id}`)).data.accessState,
    "password",
  );
  assert.equal(
    (await author("DELETE", `/api/tests?id=${id}`, {}, ownerToken)).status,
    200,
  );
  assert.equal(
    (await p("GET", `/api/tests?id=${id}`)).data.accessState,
    "closed",
  );
});
test("local file store survives fresh server instance and CAS rejects stale writes", async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "forms-tests-"));
  try {
    const store = new FileStore(dir);
    const { id } = await published({}, store);
    const fresh = new FileStore(dir);
    assert.equal((await fresh.get(id)).form.title, "Тест");
    const value = await fresh.get(id);
    assert.equal(await fresh.cas(id, 99, value), false);
    assert.equal(await fresh.cas(id, 1, { ...value, version: 2 }), true);
  } finally {
    await fs.rm(dir, { recursive: true, force: true });
  }
});
test("production Redis adapter fails clearly without server credentials", async () => {
  const oldUrl = process.env.UPSTASH_REDIS_REST_URL,
    oldToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  try {
    await assert.rejects(
      () => new RedisStore().get("test"),
      (e) => e.status === 503 && e.code === "storage_unavailable",
    );
  } finally {
    if (oldUrl) process.env.UPSTASH_REDIS_REST_URL = oldUrl;
    if (oldToken) process.env.UPSTASH_REDIS_REST_TOKEN = oldToken;
  }
});
test("numeric answers compare as numbers, text ignores case, and partial multi-select earns no points", () => {
  const { prepareForm, validateAndScore } = require("./testRules.cjs");
  const form = prepareForm({
    title: "Числа",
    questions: [
      {
        id: "n",
        title: "Число",
        type: "number",
        required: true,
        correctAnswers: ["4"],
        points: 0.1,
      },
      {
        id: "t",
        title: "Текст",
        type: "text",
        correctAnswers: ["Київ"],
        points: 0.2,
      },
    ],
    shareSettings: { isPublic: true },
  });
  const result = validateAndScore(form, { n: "04", t: "  КИЇВ  " });
  assert.equal(result.score, 0.3);
  assert.equal(result.maxScore, 0.3);
  assert.throws(
    () => validateAndScore(form, { n: "   " }),
    (e) => e.status === 422,
  );
  const multiple = prepareForm(fixture());
  assert.equal(
    validateAndScore(multiple, { one: "Київ", two: ["2"] }).score,
    2,
  );
});
test("owner password updates remain valid when an optimistic write retries", async () => {
  const store = new MemoryStore();
  const { handler, id, ownerToken, author } = await published({}, store);
  const original = store.cas.bind(store);
  let conflict = true;
  store.cas = async (id, version, value) => {
    if (conflict) {
      conflict = false;
      return false;
    }
    return original(id, version, value);
  };
  const changed = fixture({ passwordEnabled: true, password: "retry-safe" });
  assert.equal(
    (await author("PUT", `/api/tests?id=${id}`, { form: changed }, ownerToken))
      .status,
    200,
  );
  const p = client(handler);
  assert.equal(
    (await p("GET", `/api/tests?id=${id}`)).data.accessState,
    "password",
  );
  await access(p, id, "retry-safe");
});
