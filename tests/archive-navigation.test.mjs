import test from "node:test";
import assert from "node:assert/strict";
import {
  initialNavigation,
  activeRow,
  navigate,
  parseNavigation,
  navigationHash,
  projectColumns,
  projectColumn,
} from "../src/lib/archive-model.ts";

// Unequal dimensions ensure the two axes cannot accidentally share a modulus.
const data = [4, 2].map((count, folder) => ({
  id: folder ? "technical" : "academic",
  projects: Array.from({ length: count }, (_, col) => ({
    id: "project-" + col,
    sections: Array.from({ length: col === 1 ? 3 : 4 }, (_, row) => ({
      id: "section-" + row,
    })),
  })),
}));
const step = (state, action) => navigate(state, action, data);
const matrix = () => step(initialNavigation(), { type: "enter" });

test("overview keeps history but entering always starts at A1 or T1", () => {
  let s = step(matrix(), { type: "select", project: 3, section: 2 });
  s = step(s, { type: "back" });
  assert.equal(s.overviewSelected, false);
  s = step(s, { type: "folder", index: 1 });
  assert.equal(s.overviewSelected, true);
  s = step(s, { type: "enter" });
  s = step(s, { type: "select", project: 1, section: 1 });
  const hash = navigationHash(s, data);
  s = step(s, { type: "back" });
  s = step(s, { type: "folder", index: 0 });
  assert.equal(s.project, 3);
  assert.equal(activeRow(s, data), 2);
  s = parseNavigation(hash, data, s);
  assert.equal(s.project, 1);
  assert.equal(activeRow(s, data), 1);
  s = step(s, { type: "back" });
  s = step(s, { type: "folder", index: 0 });
  assert.equal(s.project, 3);
  assert.equal(activeRow(s, data), 2);
  s = step(s, { type: "enter" });
  assert.equal(s.project, 0);
  assert.equal(activeRow(s, data), 0);
});
test("visual column order is A4 A3 A2 A1 T2 T1 without changing IDs or source order", () => {
  const order = projectColumns(data);
  assert.deepEqual(
    order.map((c) => [c.folder, c.project]),
    [
      [0, 3],
      [0, 2],
      [0, 1],
      [0, 0],
      [1, 1],
      [1, 0],
    ],
  );
  assert.equal(projectColumn(initialNavigation(), data), 3);
  assert.equal(projectColumn({ ...initialNavigation(), folder: 1 }, data), 5);
  assert.equal(data[0].projects[0].id, "project-0");
  let s = step(matrix(), { type: "select", project: 3, section: 2 });
  for (const c of [...order.slice(1), order[0]]) {
    s = step(s, { type: "column", direction: 1 });
    assert.equal(s.folder, c.folder);
    assert.equal(s.project, c.project);
  }
  assert.equal(activeRow(s, data), 2);
});
test("selection is separate from opening; reader supports project and section navigation", () => {
  let s = step(initialNavigation(), { type: "folder", index: 1 });
  assert.equal(s.level, "HOME");
  s = step(s, { type: "enter" });
  assert.equal(s.level, "PORTFOLIO_MATRIX");
  s = step(s, { type: "open" });
  assert.equal(s.level, "DOCUMENT_VIEWER");
  assert.equal(step(s, { type: "column", direction: 1 }).project, 3);
  assert.equal(step(s, { type: "column", direction: 1 }).folder, 0);
  assert.equal(step(s, { type: "row", direction: 1 }).level, "DOCUMENT_VIEWER");
  assert.equal(activeRow(step(s, { type: "row", direction: 1 }), data), 1);
});
test("horizontal columns and vertical rows cycle independently with per-project memory", () => {
  let s = step(matrix(), { type: "row", direction: -1 });
  assert.equal(activeRow(s, data), 3);
  assert.equal(s.project, 0);
  s = step(s, { type: "column", direction: -1 });
  assert.equal(activeRow(s, data), 0);
  s = step(s, { type: "row", direction: -1 });
  assert.equal(activeRow(s, data), 2);
  s = step(s, { type: "column", direction: 1 });
  assert.equal(activeRow(s, data), 3);
  s = step(s, { type: "column", direction: 1 });
  assert.equal(s.folder, 1);
  assert.equal(s.project, 1);
  s = step(s, { type: "column", direction: -1 });
  assert.equal(s.project, 0);
  assert.equal(s.folder, 0);
  assert.equal(activeRow(s, data), 3);
});
test("academic and technical form one continuous project ring with independent row memory", () => {
  let s = step(matrix(), { type: "select", project: 0, section: 2 });
  s = step(s, { type: "column", direction: 1 });
  assert.equal(s.folder, 1);
  assert.equal(s.project, 1);
  s = step(s, { type: "row", direction: 1 });
  s = step(s, { type: "column", direction: -1 });
  assert.equal(s.folder, 0);
  assert.equal(s.project, 0);
  assert.equal(activeRow(s, data), 2);
  s = step(s, { type: "column", direction: 1 });
  assert.equal(activeRow(s, data), 1);
  assert.equal(parseNavigation(navigationHash(s, data), data).folder, 1);
});
test("Escape closes contact, then reader, then matrix without losing row memory", () => {
  let s = step(matrix(), { type: "select", project: 2, section: 2 });
  s = step(s, { type: "open" });
  s = step(s, { type: "contact", open: true });
  assert.deepEqual(step(s, { type: "column", direction: 1 }), s);
  s = step(s, { type: "back" });
  assert.equal(s.contact, false);
  assert.equal(s.level, "DOCUMENT_VIEWER");
  s = step(s, { type: "back" });
  assert.equal(s.level, "PORTFOLIO_MATRIX");
  assert.equal(activeRow(s, data), 2);
  s = step(s, { type: "back" });
  assert.equal(s.level, "HOME");
});
test("shareable hashes restore both language manifests and selected content", () => {
  let s = step(matrix(), { type: "select", project: 1, section: 2 });
  s = step(s, { type: "open" });
  const hash = navigationHash(s, data);
  assert.equal(hash, "#archive/academic/project-1/section-2/read");
  assert.deepEqual(parseNavigation(hash, data), s);
  const zh = data.map((p) => ({
    ...p,
    title: "中文",
    projects: p.projects.map((project) => ({ ...project, title: "中文项目" })),
  }));
  assert.deepEqual(parseNavigation(hash, zh), s);
  s = step(s, { type: "contact", open: true });
  assert.deepEqual(parseNavigation(navigationHash(s, data), data), s);
});
test("malformed or obsolete deep links cannot produce out-of-range selection", () => {
  for (const hash of [
    "#archive/missing/project-0/section-0",
    "#archive/academic/no/section-0",
    "#archive/academic/project-0/no",
    "#archive/academic/project-0/section-0/invalid",
    "#archive/academic/project-0/section-0/read/extra",
  ])
    assert.equal(parseNavigation(hash, data).level, "HOME");
  assert.equal(parseNavigation("#archive-index", data, matrix()).level, "HOME");
});
