import * as THREE from "three";
import { createCassetteKit } from "./CassetteKit";
import { spring, advance } from "./motion";
import { createArchiveWaves } from "./archive-waves";
import { createDisposalScope } from "./resources";
import {
  COLUMN_SPACING,
  ROW_SPACING,
  nearestOccurrence,
  shoulder,
  wrap,
} from "./matrix-layout";
import type { SceneItem, SceneNavigation, ScenePose } from "./types";

/** Original cassette geometry. Camera calculation adapted from RhineLabUI
 * scene.ts / viewport-layout.ts at 12cc5e4, Copyright (c) 2026 LBEILC (MIT).
 * Full license: public/licenses/RhineLabUI-MIT.txt. No upstream models/textures.
 */
export function createMatrixField(
  scene: THREE.Scene,
  items: SceneItem[],
  compact: boolean,
  entering = false,
  entryPose?: ScenePose,
) {
  const resources = createDisposalScope();
  try {
    return buildMatrixField(
      scene,
      items,
      compact,
      resources,
      entering,
      entryPose,
    );
  } catch (error) {
    resources.dispose();
    throw error;
  }
}
function buildMatrixField(
  scene: THREE.Scene,
  items: SceneItem[],
  compact: boolean,
  resources: ReturnType<typeof createDisposalScope>,
  entering: boolean,
  entryPose?: ScenePose,
) {
  const group = new THREE.Group();
  scene.add(group);
  resources.defer(() => {
    scene.remove(group);
    group.clear();
  });
  const columns = Math.max(...items.map((item) => item.column)) + 1;
  const rows = Array.from(
    { length: columns },
    (_, col) => items.filter((item) => item.column === col).length,
  );
  const poolColumns = compact ? 5 : 9,
    poolRows = compact ? 24 : 36;
  const capacity = poolColumns * poolRows;
  const kit = createCassetteKit(resources);
  const parts = kit.instanceParts().map((p, i) => {
    const mesh = new THREE.InstancedMesh(p.geometry, p.material, capacity);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.frustumCulled = false;
    mesh.castShadow = i === 0;
    mesh.receiveShadow = i === 0;
    group.add(mesh);
    resources.defer(() => mesh.dispose());
    return { mesh, offset: p.offset, scale: p.scale };
  });
  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xebe9e2,
    roughness: 0.9,
  });
  resources.defer(() => {
    floorGeometry.dispose();
    floorMaterial.dispose();
  });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -4.65;
  floor.receiveShadow = true;
  group.add(floor);
  const hero = kit.create(items[0]!);
  const active = hero.group;
  group.add(active);
  const drawLabel = (index: number) => hero.updateLabel(items[index]!);
  const sx = spring(0),
    sz = spring(0),
    sl = spring(0),
    sd = spring(0),
    arrival = spring(entering ? 1 : 0);
  const returning: {
    lane: number;
    row: number;
    lift: ReturnType<typeof spring>;
  }[] = [];
  let index = 0,
    lane = 0,
    row = 0,
    x = 0,
    z = 0,
    focusLane = 0,
    focusRow = 0,
    lift = 0.4,
    detail = 0;
  let hovered: { lane: number; row: number } | null = null;
  let cells: { lane: number; row: number; index: number }[] = [];
  let clicked: { lane: number; row: number; index: number } | null = null;
  let initial = true;
  const transform = new THREE.Object3D();
  const waves = createArchiveWaves();
  function select(next: number, navigation?: SceneNavigation) {
    const item = items[next];
    if (!item) return;
    if (!initial && next !== index) {
      returning.push({ lane, row, lift: spring(sl.value) });
      if (returning.length > 8) returning.shift();
      sl.value = 0;
      sl.velocity = 0;
    }
    const hit = clicked;
    clicked = null;
    if (!navigation && hit?.index === next) {
      lane = hit.lane;
      row = hit.row;
    } else {
      lane =
        navigation?.axis === "column"
          ? lane + navigation.direction
          : nearestOccurrence(item.column, lane, columns);
      row =
        navigation?.axis === "row"
          ? row + navigation.direction
          : nearestOccurrence(item.row, row, rows[item.column]!);
    }
    if (!initial && index !== next) waves.select(row, lane);
    if (index !== next || initial) drawLabel(next);
    index = next;
    if (initial) {
      x = lane * COLUMN_SPACING;
      z = row * ROW_SPACING;
      focusLane = lane;
      focusRow = row;
      sx.value = x;
      sz.value = z;
    }
  }
  select(0);
  return {
    snapshot() {
      return {
        position: active.position.clone(),
        rotation: active.quaternion.clone(),
      };
    },
    select,
    hit(raycaster: THREE.Raycaster, click = false) {
      const hit = raycaster.intersectObjects(
        [active, ...parts.map((p) => p.mesh)],
        true,
      )[0];
      if (!hit) {
        hovered = null;
        return null;
      }
      const cell =
        hit.instanceId === undefined
          ? { lane, row, index }
          : cells[hit.instanceId];
      if (!cell) return null;
      if (click) clicked = cell;
      else hovered = cell;
      return cell.index;
    },
    clearHover() {
      hovered = null;
    },
    update(
      dt: number,
      reduced: boolean,
      expanded: boolean,
      width: number,
      height: number,
    ) {
      initial = false;
      let moving = advance(sx, lane * COLUMN_SPACING, dt, reduced, 7);
      moving = advance(sz, row * ROW_SPACING, dt, reduced, 8) || moving;
      moving = advance(sl, expanded ? 4.15 : 0.42, dt, reduced, 8) || moving;
      moving = advance(sd, expanded ? 1 : 0, dt, reduced, 7) || moving;
      moving = advance(arrival, 0, dt, reduced, 8) || moving;
      moving = waves.update(dt, reduced, expanded) || moving;
      for (let i = returning.length - 1; i >= 0; i--) {
        if (!advance(returning[i]!.lift, 0, dt, reduced, 9))
          returning.splice(i, 1);
        else moving = true;
      }
      x = sx.value;
      z = sz.value;
      lift = sl.value;
      detail = sd.value;
      focusLane = x / COLUMN_SPACING;
      focusRow = z / ROW_SPACING;
      cells = [];
      const centerLane = Math.round(x / COLUMN_SPACING),
        centerRow = Math.round(z / ROW_SPACING);
      for (let c = 0; c < poolColumns; c++)
        for (let r = 0; r < poolRows; r++) {
          const physicalLane = centerLane + c - Math.floor(poolColumns / 2),
            physicalRow = centerRow + r - Math.floor(poolRows / 2);
          const logicalColumn = wrap(physicalLane, columns),
            logicalRow = wrap(physicalRow, rows[logicalColumn]!);
          const logicalIndex = items.findIndex(
            (item) => item.column === logicalColumn && item.row === logicalRow,
          );
          const slot = c * poolRows + r;
          cells.push({
            lane: physicalLane,
            row: physicalRow,
            index: logicalIndex,
          });
          const hidden = physicalLane === lane && physicalRow === row;
          const hover =
            !reduced &&
            hovered?.lane === physicalLane &&
            hovered?.row === physicalRow
              ? 0.13
              : 0;
          const y =
            -2.75 +
            shoulder(physicalRow - focusRow, physicalLane - focusLane) +
            waves.height(physicalRow, physicalLane) +
            hover +
            (returning.find(
              (p) => p.lane === physicalLane && p.row === physicalRow,
            )?.lift.value ?? 0) -
            arrival.value * 5;
          for (const p of parts) {
            transform.position
              .set(
                physicalLane * COLUMN_SPACING - x,
                y,
                physicalRow * ROW_SPACING - z - 2.17,
              )
              .add(p.offset);
            transform.scale.copy(p.scale).multiplyScalar(hidden ? 0 : 1);
            transform.updateMatrix();
            p.mesh.setMatrixAt(slot, transform.matrix);
          }
        }
      for (const p of parts) p.mesh.instanceMatrix.needsUpdate = true;
      active.position.set(
        lane * COLUMN_SPACING - x,
        -2.75 +
          shoulder(row - focusRow, lane - focusLane) +
          waves.height(row, lane) +
          lift,
        row * ROW_SPACING - z - 2.17,
      );
      active.rotation.set(0, -0.06 * detail, 0);
      hero.cover.position.z = detail * 0.28;
      if (entryPose && arrival.value > 0) {
        active.position.lerp(entryPose.position, arrival.value);
        active.quaternion.slerp(entryPose.rotation, arrival.value);
        hero.cover.position.z += arrival.value * 0.55;
      }
      const aspect = width / height,
        portrait = aspect < 1.05;
      const distance = 140 - 68 * detail;
      const span = portrait
        ? Math.max(7.33, 8.4 / aspect)
        : Math.max(7.33, (7.33 * (16 / 9)) / aspect);
      const viewSpan =
        span + (Math.max(5.9, portrait ? 6.3 / aspect : 5.9) - span) * detail;
      const direction = new THREE.Vector3(-0.815, 0.326, 0.478)
        .lerp(new THREE.Vector3(-0.277, 0.238, 0.931), detail)
        .normalize();
      const aim = new THREE.Vector3(-1.091, -0.045, 0.481);
      if (portrait) aim.set(0, 1.0, -2.17);
      const detailAim = active.position.clone();
      const right = new THREE.Vector3()
        .crossVectors(new THREE.Vector3(0, 1, 0), direction)
        .normalize();
      detailAim.addScaledVector(
        right,
        portrait ? 0 : viewSpan * aspect * 0.265,
      );
      if (portrait) detailAim.y -= viewSpan * 0.27;
      aim.lerp(detailAim, detail);
      return {
        moving,
        aim,
        direction,
        distance,
        fov: THREE.MathUtils.radToDeg(2 * Math.atan(viewSpan / (2 * distance))),
      };
    },
    dispose() {
      resources.dispose();
    },
  };
}
