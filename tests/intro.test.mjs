import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(
  new URL("../src/scene/intro.js", import.meta.url),
  "utf8",
);
function setup({
  reduced = false,
  compact = false,
  saveData = false,
  preference = null,
  storageError = false,
  search = "",
} = {}) {
  let now = 0,
    next = 0,
    removed = false;
  const timers = new Map();
  const document = new EventTarget();
  document.documentElement = { dataset: {} };
  document.querySelector = () => ({
    remove: () => {
      removed = true;
    },
  });
  const window = new EventTarget();
  const media = new EventTarget();
  media.matches = reduced;
  runInNewContext(source, {
    document,
    window,
    location: { search },
    URLSearchParams,
    Event,
    AbortController,
    performance: { now: () => now },
    navigator: { connection: { saveData } },
    matchMedia: (query) =>
      query.includes("reduced") ? media : { matches: compact },
    sessionStorage: {
      getItem() {
        if (storageError) throw new Error("blocked");
        return preference;
      },
    },
    setTimeout: (fn, ms) => {
      timers.set(++next, { fn, at: now + ms });
      return next;
    },
    clearTimeout: (id) => timers.delete(id),
  });
  const tick = (end) => {
    while (true) {
      const entry = [...timers]
        .filter(([, t]) => t.at <= end)
        .sort((a, b) => a[1].at - b[1].at)[0];
      if (!entry) break;
      timers.delete(entry[0]);
      now = entry[1].at;
      entry[1].fn();
    }
    now = end;
  };
  return {
    document,
    window,
    media,
    tick,
    timers,
    get state() {
      return document.documentElement.dataset.archiveIntro;
    },
    get removed() {
      return removed;
    },
    ready(mode) {
      const event = new Event("archive:ready");
      event.detail = mode;
      document.dispatchEvent(event);
    },
  };
}

test("intro masks initial HTML and reveals a ready first frame at 2.4s, finishing at 3s", () => {
  const app = setup();
  assert.equal(app.state, "loading");
  app.tick(300);
  app.ready("3d");
  app.tick(2399);
  assert.equal(app.state, "loading");
  app.tick(2400);
  assert.equal(app.state, "revealing");
  app.tick(3000);
  assert.equal(app.state, undefined);
  assert.equal(app.removed, true);
  assert.equal(app.timers.size, 0);
});

test("explicit 3D return masks loading despite a saved simple preference, while reduced motion stays direct", () => {
  const app = setup({
    preference: "light",
    search: "?view=3d&collection=technical",
  });
  assert.equal(app.state, "loading");
  app.ready("3d");
  app.tick(3000);
  assert.equal(app.state, undefined);
  assert.equal(
    setup({ preference: "light", search: "?view=3d", reduced: true }).state,
    undefined,
  );
});

test("slow downloads wait for a rendered frame rather than showing the static placeholder", () => {
  const app = setup();
  app.tick(4000);
  assert.equal(app.state, "loading");
  app.ready("3d");
  app.tick(4000);
  assert.equal(app.state, "revealing");
  app.tick(4600);
  assert.equal(app.state, undefined);
});

test("WebGL failure and a missing bootstrap both release usable HTML", () => {
  const failed = setup();
  failed.ready("light");
  failed.tick(600);
  assert.equal(failed.state, undefined);
  const missing = setup();
  let cancelled = false;
  missing.document.addEventListener("archive:intro-fallback", () => {
    cancelled = true;
  });
  missing.tick(9100);
  assert.equal(cancelled, true);
  assert.equal(missing.state, undefined);
  assert.equal(
    missing.document.documentElement.dataset.archiveIntroFallback,
    "true",
  );
  missing.ready("3d");
  assert.equal(missing.timers.size, 0);
});

test("simple, reduced motion, mobile and data-saving preferences bypass the opening", () => {
  for (const change of [
    { preference: "light" },
    { reduced: true },
    { compact: true },
    { saveData: true },
  ]) {
    const app = setup(change);
    assert.equal(app.state, undefined);
    assert.equal(app.timers.size, 0);
  }
  assert.equal(setup({ storageError: true }).state, "loading");
});

test("Escape cancels loading and late readiness cannot restart the opening", () => {
  const app = setup();
  const event = new Event("keydown", { cancelable: true });
  event.key = "Escape";
  app.document.dispatchEvent(event);
  app.tick(600);
  assert.equal(event.defaultPrevented, true);
  assert.equal(app.state, undefined);
  app.ready("3d");
  assert.equal(app.timers.size, 0);
});

test("pagehide clears timers and listeners; reduced-motion changes finish immediately", () => {
  const app = setup();
  app.ready("3d");
  app.window.dispatchEvent(new Event("pagehide"));
  assert.equal(app.state, undefined);
  assert.equal(app.timers.size, 0);
  app.ready("3d");
  assert.equal(app.timers.size, 0);
  const changed = setup();
  changed.media.matches = true;
  changed.media.dispatchEvent(new Event("change"));
  assert.equal(changed.state, undefined);
  assert.equal(changed.timers.size, 0);
});
