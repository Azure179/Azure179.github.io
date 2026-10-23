import test from "node:test";
import assert from "node:assert/strict";
import { spring, advance } from "../src/scene/motion.ts";
test("spring is frame-rate independent, starts gently and preserves velocity on retarget", () => {
  const a = spring(0),
    b = spring(0);
  advance(a, 10, 1 / 60);
  assert.ok(a.value > 0 && a.value < 0.15);
  for (let i = 1; i < 60; i++) advance(a, 10, 1 / 60);
  for (let i = 0; i < 120; i++) advance(b, 10, 1 / 120);
  assert.ok(Math.abs(a.value - b.value) < 1e-10);
  const before = a.value;
  advance(a, -10, 1 / 120);
  assert.ok(Math.abs(a.value - before) < 0.1);
  for (let i = 0; i < 240; i++) advance(a, -10, 1 / 60);
  assert.equal(a.value, -10);
  assert.equal(a.velocity, 0);
});
test("reduced motion immediately settles with no residual velocity", () => {
  const s = spring(0);
  advance(s, 5, 0.1);
  advance(s, -2, 0.016, true);
  assert.deepEqual(s, { value: -2, velocity: 0 });
});
