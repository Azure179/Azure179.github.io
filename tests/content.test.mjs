import test from "node:test";
import assert from "node:assert/strict";
import {
  isPublishable,
  localizedRecords,
  validateRecords,
} from "../src/lib/content-policy.ts";
import { pagePath, entryPath } from "../src/lib/routes.ts";

const record = (overrides = {}) => ({
  data: {
    translationKey: "unit-test-record",
    archiveId: "unit-test-record",
    locale: "en",
    slug: "unit-test-record",
    revision: "v1",
    draft: false,
    verified: true,
    visibility: "public",
    ...overrides,
  },
});

test("all three publication gates must pass", () => {
  for (const draft of [false, true]) {
    for (const verified of [false, true]) {
      for (const visibility of ["public", "private"]) {
        assert.equal(
          isPublishable({ draft, verified, visibility }),
          !draft && verified && visibility === "public",
        );
      }
    }
  }
});
test("English is unprefixed; Chinese and software use the declared routes", () => {
  assert.equal(pagePath("home", "en"), "/");
  assert.equal(pagePath("home", "zh"), "/zh/");
  assert.equal(
    entryPath("software", "real-project", "zh"),
    "/zh/projects/real-project/",
  );
  assert.equal(
    entryPath("research", "real-project", "en"),
    "/research/real-project/",
  );
  assert.throws(
    () => entryPath("research", "../private", "en"),
    /Invalid slug/,
  );
});
test("missing translations expose the real English URL record", () => {
  const english = record();
  assert.deepEqual(localizedRecords([english], "zh"), [english]);
  assert.deepEqual(localizedRecords([record({ draft: true })], "zh"), []);
});
test("published translation is preferred without duplicating the original", () => {
  const english = record();
  const chinese = record({ locale: "zh", sourceRevision: "v1" });
  assert.deepEqual(localizedRecords([english, chinese], "zh"), [chinese]);
  assert.deepEqual(localizedRecords([english, chinese], "en"), [english]);
  assert.doesNotThrow(() => validateRecords([english, chinese]));
});
test("duplicate route and reserved template route are rejected", () => {
  assert.throws(() => validateRecords([record(), record()]), /Duplicate/);
  assert.throws(
    () => validateRecords([record({ slug: "template" })]),
    /reserved/,
  );
});
test("mismatched translation IDs and stale translations are rejected", () => {
  assert.throws(
    () =>
      validateRecords([record(), record({ locale: "zh", archiveId: "other" })]),
    /mismatch/,
  );
  assert.throws(
    () =>
      validateRecords([
        record(),
        record({ locale: "zh", sourceRevision: "v0" }),
      ]),
    /stale/,
  );
});
test("unverified translations cannot shadow the published English entry", () => {
  const english = record();
  assert.deepEqual(
    localizedRecords(
      [english, record({ locale: "zh", verified: false })],
      "zh",
    ),
    [english],
  );
});
