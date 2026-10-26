import test from "node:test";
import assert from "node:assert/strict";
import * as THREE from "three";
import { createMatrixField } from "../src/scene/MatrixField.ts";
import {
  COLUMN_SPACING,
  ROW_SPACING,
  shoulder,
} from "../src/scene/matrix-layout.ts";
import {
  overviewBreath,
  overviewRipple,
  OVERVIEW_DURATION,
  OVERVIEW,
  overviewTerrain,
} from "../src/scene/overview.ts";
import {
  placeOverviewLabel,
  overviewLeader,
} from "../src/scene/overview-callouts.ts";

test("home framing returns to the same region after cycling matrix projects and sections", () => {
  withField((field) => {
    const first = field.update(1 / 60, true, false, 1600, 900);
    const relative = field.anchorPoints().map((p) => p.sub(first.aim));
    field.overview(false);
    for (let c = 1; c <= 9; c++) {
      field.select((c % 6) * 4, { axis: "column", direction: 1 });
      field.update(1 / 60, true, false, 1600, 900);
    }
    for (let r = 1; r <= 7; r++) {
      field.select(12 + (r % 4), { axis: "row", direction: 1 });
      field.update(1 / 60, true, false, 1600, 900);
    }
    field.overview(true);
    field.select(12);
    const home = field.update(1 / 60, true, false, 1600, 900);
    field.anchorPoints().forEach((p, i) => {
      assert.ok(p.sub(home.aim).distanceTo(relative[i]) < 1e-9);
    });
    assert.ok(home.direction.distanceTo(first.direction) < 1e-9);
    assert.ok(home.aim.distanceTo(first.aim) < 1e-9);
    assert.equal(home.fov, first.fov);
  });
});

test("A1 and T1 share real anchor, ripple and lift origins before continuous entry", () => {
  for (const [width, height] of [
    [1600, 900],
    [390, 844],
  ]) {
    withField((field, scene) => {
      for (const [category, selected] of [
        [0, 12],
        [1, 20],
      ]) {
        field.overview(true);
        field.select(selected);
        const home = field.update(1 / 60, true, false, width, height);
        const points = field.anchorPoints();
        assert.ok(
          Math.abs((points[0].x + points[1].x) / 2 - home.aim.x) < 1e-9,
        );
        assert.ok(Math.abs(points[1].x - points[0].x - 10.4) < 1e-9);
        field.pulse(selected);
        field.update(1 / 60, false, false, width, height);
        const ring = scene.children[0].children.find(
          (o) => o.geometry?.type === "RingGeometry" && o.visible,
        );
        assert.ok(
          ring.position.distanceTo(field.anchorPoints()[category]) < 1e-9,
        );
        const origin = field.snapshot().position;
        field.update(1 / 60, true, true, width, height);
        const lifted = field.snapshot().position;
        assert.equal(lifted.x, origin.x);
        assert.equal(lifted.z, origin.z);
        assert.ok(lifted.y > origin.y);
        field.overview(false);
        for (let i = 0; i < 160; i++) {
          field.update(1 / 60, false, false, width, height);
          const hero = field.snapshot().position;
          const anchor = field.anchorPoints()[category];
          assert.ok(
            Math.abs(hero.x - anchor.x) < 1e-9,
            "no independent lateral transport",
          );
          assert.ok(Math.abs(hero.z - anchor.z) < 1e-9);
        }
        const end = field.update(1 / 60, true, false, width, height);
        assert.equal(end.overview, 0);
        assert.ok(
          field
            .snapshot()
            .position.distanceTo(new THREE.Vector3(0, -0.18, -2.17)) < 1e-8,
        );
      }
    });
  }
});

test("overview journeys have no world-space recoil and return selection is deferred", () => {
  withField((field) => {
    const update = (reduced = false) =>
      field.update(1 / 60, reduced, false, 1920, 1080);
    const worldAim = (v) =>
      v.aim.clone().add(new THREE.Vector3(v.worldOffset.x, 0, v.worldOffset.z));
    const home = worldAim(update(true));
    field.select(20); // T1 lies to the right of the fixed home midpoint.
    field.overview(false);
    let previous = home.clone();
    let entry;
    for (let i = 0; i < 125; i++) {
      entry = update();
      const point = worldAim(entry);
      assert.ok(
        point.x >= previous.x - 1e-8,
        "entry cannot first recoil away from T1",
      );
      assert.ok(point.x <= 26 - 1.091 + 1e-8);
      previous = point;
    }
    assert.equal(entry.overview, 0);
    // Return after cycling to a non-representative project and section.
    field.select(9);
    const matrix = update(true);
    const pose = field.snapshot().position.clone();
    const start = worldAim(matrix);
    field.overview(true);
    field.select(12); // UI requests A1 immediately, but the visible hero must stay put.
    const immediate = field.update(0, false, false, 1920, 1080);
    assert.ok(worldAim(immediate).distanceTo(start) < 1e-9);
    assert.ok(field.snapshot().position.distanceTo(pose) < 1e-9);
    previous = start;
    for (let i = 0; i < 125; i++) {
      const view = update(),
        point = worldAim(view);
      for (const axis of ["x", "z"]) {
        const sign = Math.sign(home[axis] - start[axis]);
        assert.ok((point[axis] - previous[axis]) * sign >= -1e-8);
        assert.ok((home[axis] - point[axis]) * sign >= -1e-8);
      }
      previous = point;
    }
    assert.ok(previous.distanceTo(home) < 1e-9);
    assert.ok(Math.abs(field.snapshot().position.x - 3 * 5.2) < 1e-9);
  });
});

test("reversing an overview journey preserves its pose and reduced motion settles it", () => {
  withField((field) => {
    field.update(1 / 60, true, false, 1600, 900);
    field.select(20);
    field.overview(false);
    for (let i = 0; i < 30; i++) field.update(1 / 60, false, false, 1600, 900);
    const before = field.update(0, false, false, 1600, 900);
    const pose = field.snapshot().position.clone();
    field.overview(true);
    field.select(12);
    const reversed = field.update(0, false, false, 1600, 900);
    assert.ok(before.aim.distanceTo(reversed.aim) < 1e-9);
    assert.ok(before.direction.distanceTo(reversed.direction) < 1e-9);
    assert.equal(before.fov, reversed.fov);
    assert.ok(field.snapshot().position.distanceTo(pose) < 1e-9);
    const final = field.update(1 / 60, true, false, 1600, 900);
    assert.equal(final.overview, 1);
    assert.equal(final.moving, false);
    assert.deepEqual(final.worldOffset, { x: 0, z: 0 });
  });
});

test("entry and return keep the raised matrix region on A1/T1 instead of sweeping intervening columns", () => {
  for (const column of [3, 5])
    for (const returning of [false, true]) {
      withField((field) => {
        const row = returning ? 2 : 0;
        const selected = column * 4 + row;
        field.select(selected);
        if (returning) field.overview(false);
        field.update(0, true, false, 1600, 900);
        field.overview(!returning ? false : true);
        if (returning) field.select(column * 4);
        const anchors = {
          x: 3 * COLUMN_SPACING,
          y: 0,
          z: 5 * COLUMN_SPACING,
          w: 0,
        };
        let time = 0;
        // Before idle breathing starts, only the existing home breath remains.
        for (let i = 0; i < 110; i++) {
          time += 1 / 60;
          const view = field.update(1 / 60, false, false, 1600, 900);
          const home =
            overviewTerrain(
              column * COLUMN_SPACING,
              row * ROW_SPACING,
              anchors,
            ) +
            overviewBreath(column * COLUMN_SPACING, row * ROW_SPACING, time);
          const expected =
            -2.75 +
            shoulder(0, 0) * (1 - view.overview) +
            home * view.overview +
            view.lift;
          assert.ok(
            Math.abs(field.snapshot().position.y - expected) < 1e-8,
            `${returning ? "return" : "entry"} column ${column}: the raised region must stay on the actual selected document`,
          );
        }
      });
    }
});

test("desktop labels stay outside their archive anchors and inside the viewport", () => {
  const a = { x: 700, y: 620 },
    b = { x: 1210, y: 280 };
  const left = placeOverviewLabel(0, 1912, 914, 330, 195, a, 90);
  const right = placeOverviewLabel(1, 1912, 914, 330, 195, b, 90);
  assert.ok(left.x + 330 < a.x);
  assert.ok(right.x > b.x);
  for (const label of [left, right]) {
    assert.ok(label.x >= 24 && label.x + 330 <= 1888);
    assert.ok(label.y >= 158 && label.y + 195 <= 849);
  }
});

test("leader preserves its real endpoint and uses an obtuse diagonal elbow", () => {
  for (const end of [
    { x: 100, y: 120 },
    { x: -100, y: 120 },
  ]) {
    const numbers = overviewLeader({ x: 0, y: 0 }, end)
      .match(/-?\d+(?:\.\d+)?/g)
      .map(Number);
    const [x, y, bx, by, ex, ey] = numbers;
    assert.deepEqual([x, y, ex, ey], [0, 0, end.x, end.y]);
    const dot = (x - bx) * (ex - bx) + (y - by) * (ey - by);
    assert.ok(dot < 0, "internal elbow angle exceeds 90 degrees");
    assert.equal(by, ey, "last segment follows the label baseline");
  }
});

const items = Array.from({ length: 6 }, (_, column) =>
  Array.from({ length: 4 }, (_, row) => ({
    label: `${column}/${row}`,
    column,
    row,
  })),
).flat();
test("narrow callout labels remain separate without changing their projected endpoints", () => {
  for (const width of [320, 390, 650])
    for (const height of [568, 844]) {
      const labelWidth = (width - 60) / 2;
      const a = placeOverviewLabel(0, width, height, labelWidth, 170);
      const b = placeOverviewLabel(1, width, height, labelWidth, 170);
      assert.ok(a.x >= 20 && b.x + labelWidth <= width - 20);
      assert.ok(a.x + labelWidth + 20 <= b.x);
      assert.equal(a.y, b.y);
      assert.ok(a.y >= 166 && a.y + 170 <= height - 80);
    }
});
function withField(run) {
  const previous = globalThis.document;
  globalThis.document = {
    createElement: () => ({
      getContext: () =>
        new Proxy(
          { measureText: (s) => ({ width: s.length * 25 }) },
          { get: (o, k) => o[k] ?? (() => {}) },
        ),
    }),
  };
  const scene = new THREE.Scene();
  const field = createMatrixField(scene, items, false, false, undefined, true);
  field.anchors([12, 20]);
  field.select(12);
  try {
    run(field, scene);
  } finally {
    field.dispose();
    if (previous === undefined) delete globalThis.document;
    else globalThis.document = previous;
  }
}
test("mobile matrix centers the raised archive above the copy after either collection entry", () => {
  for (const [width, height] of [
    [320, 568],
    [390, 844],
    [430, 932],
  ]) {
    withField((field) => {
      field.overview(false);
      for (const selected of [12, 20, 16]) {
        field.select(selected);
        const target = field.update(1 / 60, true, false, width, height);
        const camera = new THREE.PerspectiveCamera(
          target.fov,
          width / height,
          0.5,
          500,
        );
        camera.position
          .copy(target.aim)
          .addScaledVector(target.direction, target.distance);
        camera.lookAt(target.aim);
        camera.updateMatrixWorld();
        const projected = field.snapshot().position.project(camera);
        assert.ok(
          Math.abs(projected.x) < 0.01,
          "cassette stays horizontally centered",
        );
        const y = (1 - projected.y) / 2;
        assert.ok(
          Math.abs(y - Math.max(196 / height, 0.32)) < 0.01,
          "cassette stays in upper viewing area",
        );
      }
    });
  }
});
test("micro terrain is shallow and continuous, including both category anchors", () => {
  const anchors = { x: 0, y: 0, z: 20.8, w: 0 };
  for (let x = -40; x <= 60; x += 0.5)
    for (let z = -30; z <= 30; z += 0.62) {
      const h = overviewTerrain(x, z, anchors);
      assert.ok(
        Math.abs(h) < 0.55,
        "no hills or platforms (cassette height is 3.7)",
      );
      assert.ok(
        Math.abs(h - overviewTerrain(x, z + 0.62, anchors)) < 0.06,
        "neighboring rows stay smooth",
      );
    }
  assert.ok(overviewTerrain(0, 0, anchors) > 0.05);
  assert.ok(overviewTerrain(20.8, 0, anchors) > 0.05);
});
test("reduced motion preserves static terrain without drift; all near parts recover their exact matrix transforms", () =>
  withField((field, scene) => {
    field.update(1 / 60, true, false, 1920, 1080);
    const a = field.snapshot().position.clone();
    field.update(30, true, false, 1920, 1080);
    assert.deepEqual(field.snapshot().position, a);
    assert.ok(
      a.y > -2.75,
      "static local terrain remains visible with motion disabled",
    );
    field.overview(false);
    field.update(1 / 60, true, false, 1920, 1080);
    const meshes = scene.children[0].children.filter((o) => o.isInstancedMesh);
    const before = meshes.map((mesh) => mesh.instanceMatrix.array.slice());
    field.overview(true);
    field.update(0.4, false, false, 1920, 1080);
    field.pulse(0);
    field.update(0.2, false, false, 1920, 1080);
    field.overview(false);
    field.update(1 / 60, true, false, 1920, 1080);
    meshes.forEach((mesh, i) =>
      assert.deepEqual(mesh.instanceMatrix.array, before[i]),
    );
  }));
test("distant geometry and shadow shaders share terrain parameters and valid preprocessor boundaries", () =>
  withField((field, scene) => {
    field.update(1 / 60, true, false, 1920, 1080);
    const far = scene.children[0].children.find(
      (o) => o.isGroup && o.children[0]?.isInstancedMesh,
    );
    const materials = [
      ...far.children.map((mesh) => mesh.material),
      far.children[0].customDepthMaterial,
    ];
    let sharedAnchors;
    materials.forEach((material) => {
      const shader = {
        uniforms: {},
        vertexShader: "#define STANDARD\n#include <begin_vertex>",
      };
      material.onBeforeCompile(shader);
      assert.match(shader.vertexShader, /}\s*\n#define STANDARD/);
      assert.match(shader.vertexShader, /overviewHeight\(cell\)/);
      assert.equal(shader.uniforms.overviewMotion.value, 0);
      assert.equal(shader.uniforms.overviewAmplitude.value, 1);
      sharedAnchors ??= shader.uniforms.overviewAnchors;
      assert.equal(shader.uniforms.overviewAnchors, sharedAnchors);
      assert.deepEqual(sharedAnchors.value.toArray(), [3 * 5.2, 0, 26, 0]);
    });
  }));
test("overview breathing and selection ripple have bounded height, radius and lifetime", () => {
  for (let t = 0; t < 30; t += 0.1)
    for (let x = -20; x < 20; x += 0.5) {
      assert.ok(Math.abs(overviewBreath(x, 3, t)) <= 0.24001);
      assert.ok(
        Math.abs(overviewRipple(Math.abs(x), t)) <= OVERVIEW.rippleHeight,
      );
    }
  assert.equal(overviewRipple(3.61, 0.4), 0);
  assert.equal(overviewRipple(0, OVERVIEW.rippleDuration), 0);
  assert.equal(overviewRipple(0, -1), 0);
});
test("one field selects locally, lifts one real document and reaches the unchanged matrix camera", () =>
  withField((field, scene) => {
    const update = (reduced = false, open = false) =>
      field.update(1 / 60, reduced, open, 1920, 1080);
    const first = update(true);
    assert.ok(first.direction.y > 0.54 && first.direction.y < 0.57);
    assert.equal(first.distance, OVERVIEW.distance);
    const before = field.anchorPoints().map((p) => p.clone());
    field.select(20);
    field.pulse(20);
    for (let i = 0; i < 45; i++) update();
    const after = field.anchorPoints();
    assert.equal(
      before[0].x,
      after[0].x,
      "selecting a category does not pan the world",
    );
    assert.equal(before[1].z, after[1].z);
    for (let i = 0; i < 45; i++) update(false, true);
    assert.ok(update(false, true).lift > 0.66);
    field.overview(false);
    let last = 1;
    for (let i = 0; i < Math.ceil(OVERVIEW_DURATION * 60) + 2; i++) {
      const view = update();
      assert.ok(view.overview <= last);
      last = view.overview;
    }
    assert.equal(last, 0);
    const matrix = update(true);
    assert.equal(matrix.distance, 140);
    assert.ok(
      matrix.aim.distanceTo(new THREE.Vector3(-1.091, -0.045, 0.481)) < 1e-10,
    );
    assert.ok(
      matrix.direction.distanceTo(
        new THREE.Vector3(-0.815, 0.326, 0.478).normalize(),
      ) < 1e-10,
    );
    assert.ok(
      Math.abs(
        matrix.fov - THREE.MathUtils.radToDeg(2 * Math.atan(7.33 / 280)),
      ) < 1e-10,
    );
    assert.ok(
      field.snapshot().position.distanceTo(new THREE.Vector3(0, -0.18, -2.17)) <
        1e-8,
    );
    const group = scene.children[0];
    field.overview(true);
    update();
    field.overview(false);
    update();
    field.overview(true);
    assert.equal(update(true).overview, 1);
    assert.equal(scene.children[0], group, "enter/back reuses the scene graph");
    assert.equal(update(true).moving, false, "reduced motion can sleep");
  }));
test("overview overscan covers the projected viewport on desktop and narrow portrait", () =>
  withField((field, scene) => {
    for (const [w, h] of [
      [1920, 1080],
      [2560, 1080],
      [320, 844],
      [390, 844],
      [844, 390],
    ]) {
      const target = field.update(1 / 60, true, false, w, h);
      const camera = new THREE.PerspectiveCamera(target.fov, w / h, 0.5, 500);
      camera.position
        .copy(target.aim)
        .addScaledVector(target.direction, target.distance);
      camera.lookAt(target.aim);
      camera.updateMatrixWorld();
      const far = scene.children[0].children.find(
        (o) => o.isGroup && o.children[0]?.isInstancedMesh,
      );
      const body = far.children[0];
      assert.ok(body.count < 16000, "overscan must not truncate the pool");
      const matrix = new THREE.Matrix4(),
        bounds = new THREE.Box3();
      for (let i = 0; i < body.count; i++) {
        body.getMatrixAt(i, matrix);
        bounds.expandByPoint(
          new THREE.Vector3().setFromMatrixPosition(matrix).add(far.position),
        );
      }
      for (const x of [-1, 0, 1])
        for (const y of [-1, 0, 1]) {
          const ray = new THREE.Raycaster();
          ray.setFromCamera(new THREE.Vector2(x, y), camera);
          const hit = ray.ray.intersectPlane(
            new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.9),
            new THREE.Vector3(),
          );
          assert.ok(
            hit &&
              hit.x > bounds.min.x &&
              hit.x < bounds.max.x &&
              hit.z > bounds.min.z &&
              hit.z < bounds.max.z,
            `${w}×${h} corner ${x}/${y} must remain inside archive coverage`,
          );
        }
    }
  }));
test("overview resources are released once, including distant LOD and pulse rings", () =>
  withField((field, scene) => {
    field.update(1 / 60, false, false, 1920, 1080);
    const owned = new Set();
    let releases = 0;
    scene.traverse((o) => {
      if (o.geometry) owned.add(o.geometry);
      if (o.material) owned.add(o.material);
      if (o.customDepthMaterial) owned.add(o.customDepthMaterial);
    });
    owned.forEach((r) => r.addEventListener("dispose", () => releases++));
    field.dispose();
    assert.equal(scene.children.length, 0);
    assert.equal(releases, owned.size);
    field.dispose();
    assert.equal(releases, owned.size);
  }));
