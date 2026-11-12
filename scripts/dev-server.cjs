const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
process.env.FORMS_STORAGE = process.env.FORMS_STORAGE || "file";
const handler = require("../api/tests");
const root = path.resolve("build");
http
  .createServer(async (req, res) => {
    try {
      if (req.url.split("?")[0] === "/api/tests") {
        let body = "";
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 256000) {
            res.writeHead(413);
            res.end();
            return;
          }
        }
        req.body = body || undefined;
        return handler(req, res);
      }
      const request = decodeURIComponent(req.url.split("?")[0]);
      let file = path.resolve(root, "." + request);
      if (!file.startsWith(root + path.sep))
        file = path.join(root, "index.html");
      let data;
      try {
        data = await fs.readFile(file);
      } catch {
        file = path.join(root, "index.html");
        data = await fs.readFile(file);
      }
      const types = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
        ".json": "application/json",
        ".xlsx":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".png": "image/png",
      };
      res.setHeader(
        "Content-Type",
        types[path.extname(file)] || "application/octet-stream",
      );
      res.end(data);
    } catch {
      res.writeHead(500);
      res.end("Build the app first: npm run build");
    }
  })
  .listen(process.env.PORT || 4177, "127.0.0.1", () =>
    process.stdout.write(
      "Forms: http://127.0.0.1:" + (process.env.PORT || 4177) + "\n",
    ),
  );
