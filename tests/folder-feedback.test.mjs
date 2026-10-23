import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createFolderField } from "../src/scene/FolderField.ts";

test("actual folder models distinguish selected hover, return, settle, and dispose", () => {
  const previous = globalThis.document;
  // Text rasterization is irrelevant here; exercise real Three geometries,
  // raycasting, field transitions and disposal without a GPU.
  globalThis.document = {
    createElement: () => ({
      getContext: () =>
        new Proxy(
          { measureText: (s) => ({ width: s.length * 25 }) },
          {
            get: (target, key) => target[key] ?? (() => {}),
          },
        ),
    }),
  };
  const scene = new THREE.Scene();
  let field;
  try {
    field = createFolderField(
      scene,
      [
        { label: "ACADEMIC", title: "Academic", column: 0, row: 0 },
        { label: "TECHNICAL", title: "Technical", column: 1, row: 0 },
      ],
      false,
    );
    const [left, right] = scene.children[0].children;
    const settle = (reduced = false, expanded = false) => {
      let steps = 0;
      while (
        field.update(1 / 60, reduced, expanded, 1920, 1080).moving &&
        steps++ < 600
      ) {}
      assert.ok(steps < 600, "animation must settle");
      scene.updateMatrixWorld(true);
    };
    const hover = (index, object) => {
      const origin = object.position.clone().add(new THREE.Vector3(0, 0, 10));
      assert.equal(
        field.hit(new THREE.Raycaster(origin, new THREE.Vector3(0, 0, -1))),
        index,
      );
      settle();
    };
    settle();
    const leftPosition = left.position.clone(),
      leftRotation = left.rotation.x;
    hover(0, left);
    assert.ok(left.position.y > leftPosition.y);
    assert.ok(left.position.z > leftPosition.z);
    assert.ok(left.rotation.x < leftRotation);
    assert.ok(
      left.children[0].children[0].position.z > 0,
      "selected cover lifts",
    );
    field.clearHover();
    settle();
    assert.ok(left.position.distanceTo(leftPosition) < 0.0001);
    assert.equal(left.rotation.x, leftRotation);
    const rightPosition = right.position.clone(),
      rightRotation = right.rotation.x;
    hover(1, right);
    assert.ok(right.position.y > rightPosition.y);
    assert.equal(
      right.rotation.x,
      rightRotation,
      "unselected hover only lifts",
    );
    assert.equal(right.position.z, rightPosition.z);
    field.select(1);
    settle();
    assert.ok(
      right.rotation.x < rightRotation,
      "hover remains responsive after selection",
    );
    assert.ok(left.position.y < leftPosition.y, "previous selection lowers");
    // Changing targets and opening while moving must converge without stale hover.
    field.select(0);
    field.update(1 / 60, false, false, 1920, 1080);
    field.select(1);
    settle(false, true);
    field.clearHover();
    settle();
    assert.equal(field.update(1 / 60, false, false, 1920, 1080).moving, false);
    field.select(0);
    settle(true);
    assert.equal(field.update(1 / 60, true, false, 1920, 1080).moving, false);
    let releases = 0;
    const resources = new Set();
    scene.traverse((o) => {
      if (o.geometry) resources.add(o.geometry);
      if (o.material) resources.add(o.material);
    });
    resources.forEach((r) => r.addEventListener("dispose", () => releases++));
    field.dispose();
    assert.equal(scene.children.length, 0);
    assert.equal(releases, resources.size);
    field.dispose();
    assert.equal(releases, resources.size);
  } finally {
    field?.dispose();
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
});
