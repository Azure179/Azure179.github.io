import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, relative, join } from "node:path";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";

const root = resolve("dist");
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory()
        ? walk(join(directory, entry.name))
        : join(directory, entry.name),
    ),
  );
  return nested.flat();
}
const files = await walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const required = [
  "",
  "about",
  "academic",
  "technical",
  "research/black-porgy-sex-reversal",
  "research/fish-t2t-genome",
  "research/fish-dnmt-family",
  "research/tilapia-eccdna",
  "projects/llm-rnaseq-platform",
  "projects/bioinformatics-archive",
  "research",
  "publications",
  "projects",
  "contact",
  "cv",
  "credits",
  "research/template",
  "projects/template",
];
for (const prefix of ["", "zh/"]) {
  for (const route of required)
    await stat(join(root, prefix, route, "index.html"));
}
await stat(join(root, "404.html"));
let checkedLinks = 0;
let largestHtml = 0;
let largestInlineScript = 0;
let homeJsBytes = 0;
let detailJsBytes = 0;
const referencedScripts = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const name = relative(root, file).replaceAll("\\", "/");
  const isHome = name === "index.html" || name === "zh/index.html";
  if (name === "about/index.html" || name === "zh/about/index.html") {
    const target = name.startsWith("zh/") ? "/zh/contact/" : "/contact/";
    assert.match(
      html,
      /http-equiv="refresh"/i,
      "Retired About URL must redirect",
    );
    assert.ok(html.includes(target));
    assert.ok(!html.includes("ArchiveScene"));
    continue;
  }
  assert.ok(
    !/href="\/(?:zh\/)?about\/"/.test(html),
    `Retired About link: ${name}`,
  );
  if (/^(?:zh\/)?(?:academic|technical)\/index.html$/.test(name)) {
    assert.ok(html.includes("data-return-3d"), `Missing 3D return: ${name}`);
    const href = html.match(/data-return-3d[^>]*href="([^"]+)"/)?.[1];
    assert.ok(href, `Missing 3D URL: ${name}`);
    const url = new URL(
      href.replaceAll("&amp;", "&"),
      "https://azure179.github.io",
    );
    assert.equal(url.searchParams.get("view"), "3d");
    assert.equal(
      url.searchParams.get("collection"),
      name.includes("technical") ? "technical" : "academic",
    );
    assert.equal(url.pathname, name.startsWith("zh/") ? "/zh/" : "/");
  }
  if (isHome || /^(?:zh\/)?contact\/index.html$/.test(name))
    assert.ok(
      html.includes('href="mailto:duanbw.sz@qq.com"'),
      `Missing public email: ${name}`,
    );
  const isResearchDetail =
    /(?:^|\/)research\/(?:black-porgy-sex-reversal|fish-t2t-genome|fish-dnmt-family|tilapia-eccdna)\//.test(
      name,
    );
  const isTechnicalDetail =
    /(?:^|\/)projects\/(?:llm-rnaseq-platform|bioinformatics-archive)\//.test(
      name,
    );
  if (isResearchDetail || isTechnicalDetail) {
    const sections = isResearchDetail
      ? [
          "overview",
          "background",
          "design",
          "analysis",
          ...(name.includes("tilapia-eccdna") ? [] : ["findings"]),
          "figures",
          "publications",
        ]
      : [
          "overview",
          "solution",
          "stack",
          "architecture",
          "implementation",
          "figures",
          "validation",
          "links",
        ];
    for (const section of sections)
      assert.ok(
        html.includes(`id="${section}"`),
        `Missing portfolio section ${section}: ${name}`,
      );
    const opposite = name.startsWith("zh/")
      ? "/" + name.slice(3).replace(/index\.html$/, "")
      : "/zh/" + name.replace(/index\.html$/, "");
    assert.ok(
      html.includes(`href="${opposite}"`),
      `Wrong language-switch target: ${name}`,
    );
  }
  for (const [, attributes] of html.matchAll(/<img\b([^>]*)>/g)) {
    for (const key of ["alt", "width", "height"])
      assert.match(
        attributes,
        new RegExp(`${key}="[^"]+"`),
        `Missing image ${key}: ${name}`,
      );
  }
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) ?? []).length,
    1,
    `Expected one H1: ${name}`,
  );
  assert.match(
    html,
    name.startsWith("zh/") ? /<html lang="zh-CN"/ : /<html lang="en"/,
  );
  assert.ok(
    !/DRAFT_ONLY_SENTINEL|research-starter|software-starter|publication-starter/.test(
      html,
    ),
    `Draft leak: ${name}`,
  );
  assert.ok(!/localhost|127\.0\.0\.1/.test(html), `Local URL leaked: ${name}`);
  assert.ok(!/qa-harness|LOCAL QA/.test(html), `Test harness leaked: ${name}`);
  assert.match(html, /rel="canonical" href="https:\/\/azure179\.github\.io\//);
  assert.match(html, /id="main-content"/);
  if (name.includes("/template/"))
    assert.match(html, /name="robots" content="noindex, follow"/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size, `Duplicate IDs: ${name}`);
  largestHtml = Math.max(largestHtml, gzipSync(html).length);
  const inlineScripts = [
    ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g),
  ]
    .filter((match) => !/\bsrc=|application\/ld\+json/.test(match[1]))
    .map((match) => match[2])
    .join("\n");
  largestInlineScript = Math.max(
    largestInlineScript,
    inlineScripts ? gzipSync(inlineScripts).length : 0,
  );
  let pageJsBytes = inlineScripts ? gzipSync(inlineScripts).length : 0;
  for (const [, script] of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/g)) {
    const scriptPath = resolve(root, `.${script}`);
    const body = await readFile(scriptPath, "utf8");
    referencedScripts.add(scriptPath);
    pageJsBytes += gzipSync(body).length;
    // Static pages must not import even the scene bootstrap, directly or indirectly.
    if (!isHome) {
      assert.ok(
        !/ArchiveScene|data-archive-terminal|WebGLRenderer|three\.module/.test(
          body,
        ),
        `3D loader leaked onto content page: ${name}`,
      );
      assert.ok(
        !/\bimport\s*(?:\(|.*from)/.test(body),
        `Review new content-page module dependencies: ${name}`,
      );
    }
  }
  if (isHome) {
    const manifestText = html.match(
      /<script[^>]*data-manifest[^>]*>([\s\S]*?)<\/script>/,
    )?.[1];
    assert.ok(manifestText, `Missing archive manifest: ${name}`);
    const manifest = JSON.parse(manifestText);
    assert.deepEqual(
      manifest.map((p) => p.id),
      ["academic", "technical"],
    );
    assert.deepEqual(
      manifest.map((p) => p.projects.length),
      [4, 2],
    );
    assert.deepEqual(
      manifest[0].projects.map((p) => p.id),
      [
        "black-porgy-sex-reversal",
        "fish-t2t-genome",
        "fish-dnmt-family",
        "tilapia-eccdna",
      ],
    );
    for (const portfolio of manifest)
      for (const project of portfolio.projects) {
        assert.equal(project.sections.length, 4);
        const detail = await readFile(
          join(root, project.href, "index.html"),
          "utf8",
        );
        for (const section of project.sections)
          for (const id of section.contentIds) {
            assert.ok(
              detail.includes(`id="${id}"`),
              `Reader target missing: ${project.id}/${section.id}/${id}`,
            );
          }
      }
    assert.ok(
      html.includes("data-contact-panel"),
      "Home contact/profile panel missing",
    );
    homeJsBytes = Math.max(homeJsBytes, pageJsBytes);
    assert.ok(
      !/<link[^>]+modulepreload[^>]+ArchiveScene/.test(html),
      "3D loaded eagerly",
    );
    for (const route of ["academic", "publications", "technical", "contact"]) {
      const prefix = name.startsWith("zh/") ? "/zh/" : "/";
      assert.ok(
        html.includes(`href="${prefix}${route}/"`),
        `Missing HTML fallback: ${route}`,
      );
    }
  } else detailJsBytes = Math.max(detailJsBytes, pageJsBytes);
  for (const [, target] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|data:)/.test(target)) {
      if (!target.startsWith("https://azure179.github.io/")) continue;
    }
    const base = `https://azure179.github.io/${name.replace(/index\.html$/, "")}`;
    const url = new URL(target, base);
    if (url.origin !== "https://azure179.github.io") continue;
    const path = decodeURIComponent(url.pathname);
    const destination = resolve(
      root,
      `.${path}`,
      path.endsWith("/") ? "index.html" : "",
    );
    assert.ok(destination.startsWith(root), "Invalid internal path");
    await stat(destination).catch(() => {
      throw new Error(`Broken link ${name} -> ${target}`);
    });
    if (url.hash) {
      const destinationHtml =
        destination === file ? html : await readFile(destination, "utf8");
      assert.ok(
        destinationHtml.includes(
          `id="${decodeURIComponent(url.hash.slice(1))}"`,
        ),
        `Missing anchor ${name} -> ${target}`,
      );
    }
    checkedLinks++;
  }
}
const sitemapFiles = files.filter((file) => /sitemap.*\.xml$/.test(file));
for (const file of sitemapFiles) {
  const xml = await readFile(file, "utf8");
  assert.ok(
    !/\/template\/|starter/.test(xml),
    "Non-content route leaked into sitemap",
  );
}
const jsFiles = files.filter((file) => file.endsWith(".js"));
const cssFiles = files.filter((file) => file.endsWith(".css"));
let jsBytes = 0;
let cssBytes = 0;
let sceneBytes = 0;
for (const file of jsFiles) {
  const body = await readFile(file);
  jsBytes += gzipSync(body).length;
  if (!referencedScripts.has(file)) sceneBytes += gzipSync(body).length;
}
for (const file of cssFiles) cssBytes += gzipSync(await readFile(file)).length;
assert.ok(
  detailJsBytes <= 15 * 1024 && homeJsBytes <= 35 * 1024,
  "Page bootstrap exceeds static JS budget",
);
assert.ok(
  sceneBytes > 0 && sceneBytes <= 220 * 1024,
  "3D chunk missing or exceeds budget",
);
await stat(join(root, "licenses", "three-MIT.txt"));
assert.match(
  await readFile(join(root, "licenses", "RhineLabUI-MIT.txt"), "utf8"),
  /Copyright \(c\) 2026 LBEILC/,
);
assert.equal(
  (await readFile(join(root, "licenses", "three-MIT.txt"), "utf8"))
    .replaceAll("\r", "")
    .trim(),
  (await readFile("node_modules/three/LICENSE", "utf8"))
    .replaceAll("\r", "")
    .trim(),
  "Distributed Three.js license differs from installed package",
);
assert.ok(
  largestHtml + cssBytes + jsBytes <= 350 * 1024,
  "Base document budget exceeded",
);
console.log(
  `PASS: ${htmlFiles.length} HTML pages; ${checkedLinks} internal links and anchors.`,
);
console.log(
  `PASS: drafts excluded; template noindex; sitemap clean; Three.js isolated to home; MIT license present.`,
);
console.log(
  `gzip: home bootstrap ${homeJsBytes} B; content page JS ${detailJsBytes} B; lazy 3D ${sceneBytes} B; CSS ${cssBytes} B; largest HTML ${largestHtml} B.`,
);
