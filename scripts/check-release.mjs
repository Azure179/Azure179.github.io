import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";

async function walk(directory) {
  const result = [];
  for (const file of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, file.name);
    if (file.isDirectory()) result.push(...(await walk(path)));
    else result.push(path);
  }
  return result;
}
const publicFiles = await walk("public");
const built = await walk("dist");
const exactPaths = new Set(
  built.map((path) => relative("dist", path).replaceAll("\\", "/")),
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
let bytes = 0;
for (const file of built) {
  const body = await readFile(file);
  bytes += body.length;
  assert.ok(body.length < 100 * 1024 ** 2, `Oversized asset: ${file}`);
  assert.ok(
    !/(?:^|[/\\])(?:\.env(?:\..*)?|node_modules|\.git)(?:[/\\]|$)|\.(?:map|log|pem|key)$/i.test(
      file,
    ),
    `Private/build-only file: ${file}`,
  );
}
for (const file of publicFiles) {
  if (file.endsWith(".gitkeep")) continue;
  const name = relative("public", file).replaceAll("\\", "/");
  assert.ok(exactPaths.has(name), `Static asset case/path mismatch: ${name}`);
  assert.equal(
    hash(await readFile(file)),
    hash(await readFile(join("dist", name))),
    `Asset changed during build: ${name}`,
  );
}
let localReferences = 0;
for (const file of built.filter((path) => path.endsWith(".html"))) {
  const html = await readFile(file, "utf8");
  const name = relative("dist", file).replaceAll("\\", "/");
  for (const [, reference] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const url = new URL(reference, `https://azure179.github.io/${name}`);
    if (url.origin !== "https://azure179.github.io") continue;
    const target =
      decodeURIComponent(url.pathname).slice(1) +
      (url.pathname.endsWith("/") ? "index.html" : "");
    assert.ok(
      exactPaths.has(target),
      `Case-sensitive URL failed: ${name} -> ${reference}`,
    );
    localReferences++;
  }
  if (
    /^(?:zh\/)?(?:research|projects)\/(?!template)[^/]+\/index\.html$/.test(
      name,
    )
  ) {
    assert.ok(
      !/状态与证据|研究记录|本人贡献|问题与动机|Status &amp; evidence|Research record|My Contributions|Problem Statement/.test(
        html,
      ),
      `Removed heading reappeared: ${name}`,
    );
    assert.ok(
      !/资料补齐后|均待正式公开|不构成驱动|原始柱状图未经|原创解释性流程图/.test(
        html,
      ),
      `Editorial copy leaked: ${name}`,
    );
  }
  for (const [, kind, block] of html.matchAll(
    /<figure\s+data-media-kind="([^"]+)"[^>]*>([\s\S]*?)<\/figure>/g,
  )) {
    const caption = block
      .match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim();
    assert.ok(
      caption && caption.length < 60,
      `Verbose/missing figure caption: ${name}`,
    );
    if (kind === "placeholder")
      assert.match(caption, /图片占位|Image placeholder/);
  }
}
assert.ok(bytes < 1024 ** 3, "GitHub Pages artifact exceeds 1 GiB");
const pkg = JSON.parse(await readFile("package.json", "utf8"));
const lock = JSON.parse(await readFile("package-lock.json", "utf8"));
assert.deepEqual(lock.packages[""].dependencies, pkg.dependencies);
assert.deepEqual(lock.packages[""].devDependencies, pkg.devDependencies);
const tracked = execFileSync(
  "git",
  ["ls-files", "--error-unmatch", "package-lock.json"],
  { encoding: "utf8" },
);
assert.equal(
  tracked.trim(),
  "package-lock.json",
  "Lockfile must be in the Git index",
);
assert.ok(
  !(await readFile("astro.config.mjs", "utf8")).includes("base:"),
  "User Pages site must not have a repository subpath",
);
console.log(
  `PASS: ${publicFiles.length} public files; ${localReferences} case-sensitive internal references; ${(bytes / 1024 ** 2).toFixed(2)} MiB artifact.`,
);
console.log(
  "PASS: compact captions, placeholder labels, public copy and tracked dependency lock.",
);
