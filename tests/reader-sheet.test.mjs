import test from "node:test";
import assert from "node:assert/strict";
import { sheetGesture, createReaderSheet } from "../src/scene/reader-sheet.ts";

test("sheet takes only vertical boundary gestures, preserving normal reading and horizontal movement", () => {
  assert.equal(sheetGesture(false, true, 0, -40), "expand");
  assert.equal(sheetGesture(true, true, 0, 40), "collapse");
  assert.equal(sheetGesture(true, false, 0, 100), null);
  assert.equal(sheetGesture(true, true, 0, -40), null);
  assert.equal(sheetGesture(false, true, 50, -30), null);
  assert.equal(sheetGesture(false, true, 0, -5), null);
});

test("sheet toggles, resets, respects scroll boundaries and releases its listeners", () => {
  const prior = globalThis.matchMedia;
  const media = new EventTarget();
  media.matches = true;
  globalThis.matchMedia = () => media;
  const button = new EventTarget();
  const label = { textContent: "" };
  const attrs = {};
  button.setAttribute = (key, value) => {
    attrs[key] = value;
  };
  button.querySelector = () => label;
  const dialog = new EventTarget();
  dialog.dataset = {};
  dialog.scrollTop = 0;
  dialog.querySelector = () => button;
  const touch = (type, y, count = 1) => {
    const event = new Event(type, { cancelable: true });
    event.touches = Array.from({ length: count }, () => ({
      clientX: 20,
      clientY: y,
    }));
    dialog.dispatchEvent(event);
    return event.defaultPrevented;
  };
  try {
    const sheet = createReaderSheet(dialog, true);
    assert.equal(attrs["aria-expanded"], "false");
    touch("touchstart", 100);
    assert.equal(touch("touchmove", 60), true);
    assert.equal(dialog.dataset.sheet, "expanded");
    // One gesture cannot expand then immediately collapse or scroll the body.
    touch("touchmove", 160);
    assert.equal(dialog.dataset.sheet, "expanded");
    touch("touchend", 160, 0);
    dialog.scrollTop = 80;
    touch("touchstart", 100);
    assert.equal(touch("touchmove", 150), false);
    assert.equal(dialog.dataset.sheet, "expanded");
    touch("touchend", 150, 0);
    dialog.scrollTop = 0;
    touch("touchstart", 100);
    touch("touchmove", 150);
    assert.equal(dialog.dataset.sheet, "collapsed");
    touch("touchstart", 100, 2);
    assert.equal(touch("touchmove", 50, 2), false);
    button.dispatchEvent(new Event("click"));
    assert.equal(label.textContent, "收起阅读区");
    sheet.reset();
    assert.equal(attrs["aria-expanded"], "false");
    sheet.dispose();
    button.dispatchEvent(new Event("click"));
    assert.equal(dialog.dataset.sheet, "collapsed");
  } finally {
    if (prior === undefined) delete globalThis.matchMedia;
    else globalThis.matchMedia = prior;
  }
});
