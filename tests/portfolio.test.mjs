import test from "node:test";
import assert from "node:assert/strict";
import { resolvePublications } from "../src/lib/publication-links.ts";
import { studySchema, figureSchema } from "../src/lib/portfolio-schema.ts";

test("publication references prefer the selected locale and use a real English fallback", () => {
  const en = {
    collection: "publications",
    data: { translationKey: "paper", locale: "en" },
  };
  const zh = {
    collection: "publications",
    data: { translationKey: "paper", locale: "zh" },
  };
  const unrelated = { collection: "research", data: en.data };
  assert.deepEqual(resolvePublications([en, zh, unrelated], ["paper"], "zh"), [
    zh,
  ]);
  assert.deepEqual(resolvePublications([en], ["paper"], "zh"), [en]);
  assert.throws(
    () => resolvePublications([unrelated], ["paper"], "en"),
    /Missing public publication/,
  );
  assert.throws(
    () => resolvePublications([en], ["paper", "paper"], "en"),
    /Duplicate/,
  );
});
test("scope-only outlines cannot be used to publish findings or paper associations", () => {
  const outline = {
    stage: "outline",
    area: "A1",
    overview: ["Scope only"],
    background: ["Question pending"],
    design: ["Pending"],
    analysis: ["Coverage only"],
  };
  assert.equal(studySchema.safeParse(outline).success, true);
  assert.equal(
    studySchema.safeParse({ ...outline, publicationIds: ["unverified-paper"] })
      .success,
    false,
  );
  assert.equal(
    studySchema.safeParse({
      ...outline,
      findings: [
        {
          status: "published",
          text: "Unsupported result",
          evidenceRefs: ["fixture"],
        },
      ],
    }).success,
    false,
  );
  assert.equal(
    studySchema.safeParse({
      ...outline,
      stage: "verified-study",
      findings: [
        { status: "hypothesis", text: "Testable question", evidenceRefs: [] },
      ],
    }).success,
    false,
  );
});
test("figure metadata requires provenance, permission and a safe local asset path", () => {
  const figure = {
    id: "workflow",
    src: "/media/diagrams/workflow.svg",
    title: "Workflow",
    alt: "Step A to B",
    caption: "Implementation diagram",
    source: "Reviewed source",
    permission: "Original",
    kind: "diagram",
    width: 1200,
    height: 760,
  };
  assert.equal(figureSchema.safeParse(figure).success, true);
  for (const invalid of [
    { alt: "" },
    { source: "" },
    { permission: "" },
    { src: "/media/diagrams/../../secret.svg" },
    { src: "https://example.org/unverified.jpg" },
    { height: 0 },
  ])
    assert.equal(
      figureSchema.safeParse({ ...figure, ...invalid }).success,
      false,
    );
});

test("published reviews require published evidence and resolved paper identifiers", () => {
  const review = {
    stage: "published-review",
    area: "A1",
    overview: ["Summary"],
    background: ["Question"],
    design: ["Published design"],
    analysis: ["Published method"],
    publicationIds: ["paper"],
    findings: [
      {
        status: "published",
        text: "Reported observation",
        evidenceRefs: ["https://doi.org/10.1234/example"],
      },
    ],
  };
  assert.equal(studySchema.safeParse(review).success, true);
  assert.equal(
    studySchema.safeParse({ ...review, publicationIds: [] }).success,
    false,
  );
  assert.equal(
    studySchema.safeParse({ ...review, findings: [] }).success,
    false,
  );
  assert.equal(
    studySchema.safeParse({
      ...review,
      findings: [{ ...review.findings[0], status: "hypothesis" }],
    }).success,
    false,
  );
});
