import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { figureSchema } from "../src/lib/portfolio-schema.ts";
import { figureDimensions } from "../src/lib/figure-dimensions.ts";

const projects = [
  ["research", "black-porgy-sex-reversal"],
  ["research", "fish-t2t-genome"],
  ["research", "fish-dnmt-family"],
  ["research", "tilapia-eccdna"],
  ["software", "llm-rnaseq-platform"],
  ["software", "bioinformatics-archive"],
];
async function entry(kind, slug, lang) {
  const raw = await readFile(`src/content/${kind}/${slug}/${lang}.md`, "utf8");
  return JSON.parse(raw.split("---")[1].replace(/,\s*([}\]])/g, "$1"));
}
test("six bilingual projects resolve their images, publications and localized diagrams", async () => {
  for (const [kind, slug] of projects) {
    const en = await entry(kind, slug, "en");
    const zh = await entry(kind, slug, "zh");
    assert.equal(en.translationKey, zh.translationKey);
    assert.equal(en.revision, zh.sourceRevision);
    assert.deepEqual(
      en.figures.map((f) => f.id),
      zh.figures.map((f) => f.id),
    );
    assert.deepEqual(en.study?.publicationIds, zh.study?.publicationIds);
    for (const data of [en, zh]) {
      for (const figure of data.figures) {
        assert.ok(
          figureSchema.safeParse(figure).success,
          `${slug}/${figure.id}`,
        );
        assert.ok((await stat("public" + figure.src)).size > 0);
        if (data.locale === "zh" && figure.kind === "diagram") {
          assert.match(figure.src, /-zh\.svg$/);
          const svg = await readFile("public" + figure.src, "utf8");
          assert.match(svg, /<title[^>]*>[^<]*[\u4e00-\u9fff]/);
        }
      }
      for (const id of data.study?.publicationIds ?? []) {
        const paper = await entry("publications", id, data.locale);
        assert.equal(paper.publicationStatus, "published");
        assert.match(paper.doi, /^10\./);
        assert.ok(paper.authors.length > 0);
      }
    }
  }
});
test("unreleased eccDNA contains conceptual assets, no results or paper records", async () => {
  for (const locale of ["en", "zh"]) {
    const data = await entry("research", "tilapia-eccdna", locale);
    assert.equal(data.study.stage, "outline");
    assert.deepEqual(data.study.findings, []);
    assert.deepEqual(data.study.publicationIds, []);
    assert.ok(
      data.figures.every((figure) =>
        ["diagram", "placeholder"].includes(figure.kind),
      ),
    );
    assert.equal(
      data.figures.filter((figure) => figure.kind === "placeholder").length,
      3,
    );
  }
});
test("public media is restricted to intended image assets", async () => {
  async function walk(path) {
    for (const file of await readdir(path, { withFileTypes: true })) {
      const full = `${path}/${file.name}`;
      if (file.isDirectory()) await walk(full);
      else if (file.name !== ".gitkeep")
        assert.match(file.name, /\.(svg|jpg|png|webp|md)$/i, full);
    }
  }
  await walk("public/media");
});

test("owner PNGs retain exact file names and use file dimensions rather than stale metadata", async () => {
  let checked = 0;
  for (const [kind, slug] of projects) {
    const data = await entry(kind, slug, "en");
    for (const figure of data.figures.filter((item) =>
      item.src.endsWith(".png"),
    )) {
      const bytes = await readFile("public" + figure.src);
      const dimensions = await figureDimensions({
        ...figure,
        width: 1,
        height: 1,
      });
      assert.deepEqual(dimensions, {
        width: bytes.readUInt32BE(16),
        height: bytes.readUInt32BE(20),
      });
      checked++;
    }
  }
  assert.equal(checked, 9);
});
