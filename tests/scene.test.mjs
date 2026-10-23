import test from "node:test";
import assert from "node:assert/strict";
import {
  adjacentIndex,
  autoEnable,
  createFrameLoop,
  damp,
  renderRatio,
} from "../src/scene/state.ts";
import { createDisposalScope } from "../src/scene/resources.ts";

test("archive keyboard navigation wraps and starts at the correct endpoint", () => {
  assert.equal(adjacentIndex(null, 1, 5), 0);
  assert.equal(adjacentIndex(null, -1, 5), 4);
  assert.equal(adjacentIndex(4, 1, 5), 0);
  assert.equal(adjacentIndex(0, -1, 5), 4);
});
test("motion is frame-rate independent, reversible and snaps in reduced motion", () => {
  const after = (fps) => {
    let value = 0;
    for (let i = 0; i < fps / 2; i++) value = damp(value, 1, 1 / fps);
    return value;
  };
  assert.ok(Math.abs(after(30) - after(120)) < 0.00001);
  const halfway = damp(0, 1, 0.05);
  assert.ok(damp(halfway, 0, 0.02) < halfway);
  assert.equal(damp(0, 1, 0.01, true), 1);
  assert.equal(damp(1, 0, 0.01, true), 0);
  assert.ok(damp(0, 1, 100) < 1);
  let value = 0;
  for (let i = 0; i < 200; i++) value = damp(value, 1, 1 / 60);
  assert.equal(value, 1);
});
test("pixel ratio honors desktop and mobile buffer budgets", () => {
  for (const compact of [true, false]) {
    for (const [width, height] of [
      [320, 280],
      [1920, 1080],
      [7680, 4320],
    ]) {
      const ratio = renderRatio(width, height, 3, compact);
      assert.ok(ratio <= (compact ? 1 : 1.5));
      assert.ok(
        width * height * ratio ** 2 <= (compact ? 800_000 : 2_100_000) + 1,
      );
    }
  }
});
test("automatic 3D respects light, mobile, reduced-motion and data-saver preferences", () => {
  const desktop = {
    compact: false,
    reduced: false,
    saveData: false,
    preference: null,
  };
  assert.equal(autoEnable(desktop), true);
  for (const change of [
    { compact: true },
    { reduced: true },
    { saveData: true },
    { preference: "light" },
  ]) {
    assert.equal(autoEnable({ ...desktop, ...change }), false);
  }
});
test("demand renderer owns one RAF, sleeps at rest, cancels on pause and cannot restart after disposal", () => {
  const callbacks = new Map();
  let id = 0,
    ticks = 0,
    animate = true;
  const loop = createFrameLoop(
    () => {
      ticks++;
      return animate;
    },
    (fn) => {
      callbacks.set(++id, fn);
      return id;
    },
    (key) => callbacks.delete(key),
  );
  const advance = () => {
    const pending = [...callbacks.values()];
    callbacks.clear();
    pending.forEach((fn) => fn(ticks * 16));
  };
  loop.wake();
  loop.wake();
  loop.wake();
  assert.equal(callbacks.size, 1);
  advance();
  assert.equal(callbacks.size, 1);
  loop.pause(true);
  assert.equal(callbacks.size, 0);
  loop.wake();
  assert.equal(callbacks.size, 0);
  loop.pause(false);
  advance();
  animate = false;
  advance();
  assert.equal(callbacks.size, 0);
  loop.wake();
  assert.equal(callbacks.size, 1);
  loop.dispose();
  loop.dispose();
  loop.pause(false);
  loop.wake();
  assert.equal(callbacks.size, 0);
});
test("resource cleanup is reversed, idempotent and survives a failed disposer", () => {
  const scope = createDisposalScope();
  const released = [];
  scope.defer(() => released.push("renderer"));
  scope.defer(() => {
    throw new Error("dispose failed");
  });
  scope.defer(() => released.push("geometry"));
  assert.equal(scope.dispose().length, 1);
  assert.deepEqual(released, ["geometry", "renderer"]);
  assert.deepEqual(scope.dispose(), []);
  scope.defer(() => released.push("late resource"));
  assert.deepEqual(released, ["geometry", "renderer", "late resource"]);
});
