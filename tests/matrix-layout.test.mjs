import test from "node:test";
import assert from "node:assert/strict";
import {
  wrap,
  nearestOccurrence,
  shoulder,
} from "../src/scene/matrix-layout.ts";
test("physical looping cells retain logical identity across both seams", () => {
  for (const count of [2, 4, 7])
    for (let cell = -100; cell < 100; cell++) {
      const id = wrap(cell, count);
      assert.ok(id >= 0 && id < count);
      assert.equal(nearestOccurrence(id, cell, count), cell);
      assert.equal(
        wrap(nearestOccurrence(id, cell + count * 50, count), count),
        id,
      );
    }
  assert.equal(nearestOccurrence(0, 3, 4), 4);
  assert.equal(nearestOccurrence(3, 0, 4), -1);
});
test("selection shoulder is symmetric, bounded, and stronger in the selected column", () => {
  assert.equal(shoulder(0, 0), 2.15);
  for (let distance = 0; distance < 100; distance++) {
    assert.equal(shoulder(distance, 0), shoulder(-distance, 0));
    assert.ok(shoulder(distance, 0) >= -0.42 && shoulder(distance, 0) <= 2.15);
  }
  assert.ok(shoulder(0, 0) > shoulder(0, 1));
});
