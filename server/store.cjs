const fs = require("node:fs/promises");
const path = require("node:path");
const CAS = `local current=redis.call('GET',KEYS[1]); if ARGV[1]=='NEW' then if current then return 0 end else if not current or cjson.decode(current).version~=tonumber(ARGV[1]) then return 0 end end; redis.call('SET',KEYS[1],ARGV[2]); return 1`;
const RATE = `local n=redis.call('INCR',KEYS[1]);if n==1 then redis.call('EXPIRE',KEYS[1],ARGV[1]) end;return n`;
class RedisStore {
  async command(args) {
    const url = process.env.UPSTASH_REDIS_REST_URL,
      token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token)
      throw Object.assign(
        new Error(
          "Спільне сховище ще не підключено. Зверніться до адміністратора сайту.",
        ),
        { status: 503, code: "storage_unavailable" },
      );
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Сховище тимчасово недоступне");
    const data = await response.json();
    if (data.error) throw new Error("Помилка операції зі сховищем");
    return data.result;
  }
  async get(id) {
    const raw = await this.command(["GET", `forms:test:${id}`]);
    return raw ? JSON.parse(raw) : null;
  }
  async cas(id, version, value) {
    return (
      Number(
        await this.command([
          "EVAL",
          CAS,
          1,
          `forms:test:${id}`,
          version === null ? "NEW" : String(version),
          JSON.stringify(value),
        ]),
      ) === 1
    );
  }
  async rate(key, limit, seconds) {
    return (
      Number(
        await this.command(["EVAL", RATE, 1, `forms:rate:${key}`, seconds]),
      ) <= limit
    );
  }
}
class FileStore {
  constructor(directory = path.join(process.cwd(), ".local-data")) {
    this.directory = directory;
    this.queue = Promise.resolve();
    this.rates = new Map();
  }
  file(id) {
    return path.join(this.directory, `${id}.json`);
  }
  async get(id) {
    try {
      return JSON.parse(await fs.readFile(this.file(id), "utf8"));
    } catch (e) {
      if (e.code === "ENOENT") return null;
      throw e;
    }
  }
  async cas(id, version, value) {
    const task = this.queue.then(async () => {
      const current = await this.get(id);
      if (
        version === null ? !!current : !current || current.version !== version
      )
        return false;
      await fs.mkdir(this.directory, { recursive: true });
      const target = this.file(id),
        temporary = target + ".tmp";
      await fs.writeFile(temporary, JSON.stringify(value), { mode: 0o600 });
      await fs.rename(temporary, target);
      return true;
    });
    this.queue = task.catch(() => {});
    return task;
  }
  async rate(key, limit, seconds) {
    const now = Date.now();
    const old = this.rates.get(key);
    const value =
      !old || old.until < now ? { count: 0, until: now + seconds * 1000 } : old;
    value.count++;
    this.rates.set(key, value);
    return value.count <= limit;
  }
}
let store;
function getStore() {
  if (!store)
    store =
      process.env.FORMS_STORAGE === "file" &&
      process.env.NODE_ENV !== "production"
        ? new FileStore()
        : new RedisStore();
  return store;
}
module.exports = { getStore, FileStore, RedisStore };
