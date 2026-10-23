// Local-only fault injection server. Never copied into dist or deployed.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
const root = resolve("dist");
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
};
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, "http://127.0.0.1:4323");
    if (url.pathname === "/responsive-qa/") {
      const width = url.searchParams.get("width") === "320" ? 320 : 390;
      response.writeHead(200, { "Content-Type": mime[".html"] });
      response.end(
        `<html lang="en"><head><title>LOCAL QA responsive frame</title></head><body style="background:#ddd;font:14px sans-serif"><h1>LOCAL QA — ${width}px CSS viewport (not a real phone)</h1><iframe title="Responsive archive" width="${width}" height="844" style="border:1px solid #999" src="${url.searchParams.has("clean") ? "http://127.0.0.1:4322/zh/" : "/zh/?qa=normal"}"></iframe></body></html>`,
      );
      return;
    }
    if (url.pathname === "/qa-harness.js") {
      response.writeHead(200, { "Content-Type": mime[".js"] });
      response.end(await readFile("tests/browser/harness.js"));
      return;
    }
    const file = resolve(
      root,
      `.${decodeURIComponent(url.pathname)}`,
      url.pathname.endsWith("/") ? "index.html" : "",
    );
    if (!file.startsWith(root + sep)) throw new Error("Invalid path");
    let body = await readFile(file);
    if (file.endsWith(".html")) {
      let html = body.toString("utf8");
      if (url.searchParams.get("qa") === "nojs") {
        html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
      } else {
        html = html.replace(
          "<head>",
          '<head><script src="/qa-harness.js"></script>',
        );
      }
      body = Buffer.from(html);
    }
    // Delay the genuine dynamic module to exercise stale-load cancellation.
    if (file.includes("ArchiveScene.")) {
      await new Promise((done) => setTimeout(done, 4000));
    }
    response.writeHead(200, {
      "Content-Type": mime[extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(4323, "127.0.0.1", () =>
  console.log(
    "Local fault-injection preview: http://127.0.0.1:4323/?qa=normal",
  ),
);
