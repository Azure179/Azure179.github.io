import test from "node:test";
import assert from "node:assert/strict";
import {
  idleWave,
  baselineSelectionWave,
  createArchiveWaves,
} from "../src/scene/archive-waves.ts";
import { createWheelNavigation } from "../src/scene/wheel-navigation.ts";

test("idle displacement is bounded; selection wave propagates and expires", () => {
  for (let t = 0; t < 20; t += 0.1) {
    assert.ok(Math.abs(idleWave(2, 4, t)) <= 0.102);
  }
  assert.equal(baselineSelectionWave(8, -1), 0);
  assert.equal(baselineSelectionWave(8, 3.21), 0);
  assert.ok(baselineSelectionWave(8, 1) > baselineSelectionWave(8, 0.1));
});
test("matrix breathing stops in reduced motion and settles in reader", () => {
  const waves = createArchiveWaves();
  waves.select(2, 1);
  for (let i = 0; i < 300; i++)
    assert.equal(waves.update(1 / 60, false, false), true);
  assert.notEqual(waves.height(3, 1), 0);
  let moving;
  for (let i = 0; i < 600; i++) moving = waves.update(1 / 60, false, true);
  assert.equal(moving, false);
  assert.equal(waves.height(3, 1), 0);
  waves.select(3, 2);
  assert.equal(waves.update(1 / 60, true, false), false);
  assert.equal(waves.height(3, 2), 0);
});
test("wheel handles delta units, burst cooldown and small trackpad deltas", () => {
  const wheel = createWheelNavigation();
  assert.equal(wheel(10, 0, 0, 800), 0);
  assert.equal(wheel(20, 0, 40, 800), 0);
  assert.equal(wheel(20, 0, 80, 800), 1);
  assert.equal(wheel(120, 0, 100, 800), 0);
  assert.equal(wheel(-3, 1, 600, 800), -1);
  assert.equal(wheel(1, 2, 1100, 800), 1);
  assert.equal(wheel(20, 0, 1700, 800), 0);
  assert.equal(wheel(30, 0, 2000, 800), 0);
});
