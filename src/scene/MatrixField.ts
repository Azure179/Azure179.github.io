import * as THREE from "three";
import { createCassetteKit } from "./CassetteKit.ts";
import { spring, advance } from "./motion.ts";
import { createArchiveWaves } from "./archive-waves.ts";
import { createDisposalScope } from "./resources.ts";
import { createOverviewBackdrop } from "./OverviewBackdrop.ts";
import { createOverviewPulse } from "./OverviewPulse.ts";
import {
  overviewSpan,
  overviewBreath,
  overviewRipple,
  overviewEase,
  OVERVIEW_DURATION,
  OVERVIEW,
  overviewTerrain,
} from "./overview.ts";
import {
  COLUMN_SPACING,
  ROW_SPACING,
  nearestOccurrence,
  shoulder,
  wrap,
} from "./matrix-layout.ts";
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
  overview = false,
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
      overview,
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
  overview = false,
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
  let overviewWanted = overview;
  let overviewTime = overview ? 1 : 0;
  let overviewGain = overviewTime;
  let overviewClock = 0;
  let homeLaneOffset = 0,
    homeRowOffset = 0;
  let anchorIndices: number[] = [];
  let pulse: { index: number; start: number } | null = null;
  let backdrop: ReturnType<typeof createOverviewBackdrop> | undefined;
  const drawPulse = createOverviewPulse(group, resources);
  const pulsePosition = new THREE.Vector3();
  const terrainAnchors = new THREE.Vector4();
  let anchorHeights: number[] = [];
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
  // Freeze the matrix-side world reference for the whole overview journey.
  // World recentering and the camera use the same eased progress, not two springs.
  let overviewRig: { x: number; z: number } | null = null;
  let pendingHomeSelection: number | null = null;
  const transform = new THREE.Object3D();
  const waves = createArchiveWaves();
  function select(next: number, navigation?: SceneNavigation) {
    const item = items[next];
    if (!item) return;
    if (overviewWanted && overviewGain < 1 && !initial) {
      pendingHomeSelection = next;
      return;
    }
    if (!initial && next !== index && !overviewWanted) {
      returning.push({ lane, row, lift: spring(sl.value) });
      if (returning.length > 8) returning.shift();
      sl.value = 0;
      sl.velocity = 0;
    }
    const hit = clicked;
    clicked = null;
    if (overviewWanted) {
      lane = item.column + homeLaneOffset;
      row = item.row + homeRowOffset;
    } else if (!navigation && hit?.index === next) {
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
    if (!initial && index !== next && !overviewWanted) waves.select(row, lane);
    if (index !== next || initial) drawLabel(next);
    index = next;
    if (!overviewWanted && overviewGain === 1)
      overviewRig = { x: lane * COLUMN_SPACING, z: row * ROW_SPACING };
    if (initial) {
      x = overviewWanted ? 0 : lane * COLUMN_SPACING;
      z = overviewWanted ? 0 : row * ROW_SPACING;
      focusLane = x / COLUMN_SPACING;
      focusRow = z / ROW_SPACING;
      sx.value = x;
      sz.value = z;
    }
  }
  select(0);
  return {
    overview(value: boolean) {
      if (value !== overviewWanted) {
        if (overviewGain === 0) overviewRig = { x, z };
        else if (overviewGain === 1)
          overviewRig = { x: lane * COLUMN_SPACING, z: row * ROW_SPACING };
        if (!value) pendingHomeSelection = null;
      }
      if (value && !overviewWanted) {
        homeLaneOffset = 0;
        homeRowOffset = 0;
        pulse = null;
      }
      overviewWanted = value;
      clicked = null;
      hovered = null;
    },
    anchors(indices: number[]) {
      anchorIndices = indices;
    },
    pulse(next: number) {
      pulse = {
        index: next,
        start: overviewClock,
      };
    },
    anchorPoints() {
      return anchorIndices.map((i) => {
        const item = items[i]!;
        return new THREE.Vector3(
          (item.column + homeLaneOffset) * COLUMN_SPACING - x,
          anchorHeights[anchorIndices.indexOf(i)] ?? -0.82,
          (item.row + homeRowOffset) * ROW_SPACING - z - 2.17,
        );
      });
    },
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
      if (click && !overviewWanted) clicked = cell;
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
      overviewClock += dt;
      overviewTime = reduced
        ? Number(overviewWanted)
        : THREE.MathUtils.clamp(
            overviewTime + ((overviewWanted ? 1 : -1) * dt) / OVERVIEW_DURATION,
            0,
            1,
          );
      overviewGain = overviewEase(overviewTime);
      const og = overviewGain;
      const journey = overviewRig !== null;
      if (og === 1 && pendingHomeSelection !== null) {
        const next = pendingHomeSelection;
        pendingHomeSelection = null;
        select(next);
      }
      // Category selection never moves home. Return also restores the world rig,
      // so fixed lights and the camera see the same region after matrix browsing.
      let moving = false;
      if (overviewRig) {
        sx.value = overviewRig.x * (1 - og);
        sz.value = overviewRig.z * (1 - og);
        sx.velocity = sz.velocity = 0;
      } else {
        moving = advance(
          sx,
          overviewWanted ? 0 : lane * COLUMN_SPACING,
          dt,
          reduced,
          7,
        );
        moving =
          advance(sz, overviewWanted ? 0 : row * ROW_SPACING, dt, reduced, 8) ||
          moving;
      }
      moving =
        advance(
          sl,
          overviewWanted ? (expanded ? 0.75 : 0) : expanded ? 4.15 : 0.42,
          dt,
          reduced,
          8,
        ) || moving;
      moving =
        advance(sd, expanded && !overviewWanted ? 1 : 0, dt, reduced, 7) ||
        moving;
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
      // Recentring the render coordinates is not a project/section selection.
      // Keep the raised region at the matrix endpoint throughout the journey;
      // only its gain fades, otherwise it sweeps across every intervening column.
      focusLane = (overviewRig?.x ?? x) / COLUMN_SPACING;
      focusRow = (overviewRig?.z ?? z) / ROW_SPACING;
      cells = [];
      const anchorCenter =
        homeLaneOffset +
        (anchorIndices.length
          ? anchorIndices.reduce((sum, i) => sum + items[i]!.column, 0) /
            anchorIndices.length
          : 0);
      const centerLane = Math.round(
          THREE.MathUtils.lerp(x / COLUMN_SPACING, anchorCenter, og),
        ),
        centerRow = Math.round(
          THREE.MathUtils.lerp(z / ROW_SPACING, homeRowOffset, og),
        );
      if (og > 0 && !backdrop)
        backdrop = createOverviewBackdrop(group, resources);
      const anchorA = items[anchorIndices[0] ?? 0]!,
        anchorB = items[anchorIndices[1] ?? 0]!;
      terrainAnchors.set(
        (anchorA.column + homeLaneOffset) * COLUMN_SPACING,
        (anchorA.row + homeRowOffset) * ROW_SPACING,
        (anchorB.column + homeLaneOffset) * COLUMN_SPACING,
        (anchorB.row + homeRowOffset) * ROW_SPACING,
      );
      backdrop?.update(
        og,
        x,
        z,
        centerLane,
        centerRow,
        poolColumns,
        poolRows,
        width / height,
        reduced ? 0 : overviewClock,
        reduced,
        terrainAnchors,
      );
      const homeHeight = (col: number, r: number) => {
        if (og === 0) return 0;
        const terrain = overviewTerrain(
          col * COLUMN_SPACING,
          r * ROW_SPACING,
          terrainAnchors,
        );
        if (reduced) return terrain;
        const p = pulse && items[pulse.index];
        return (
          terrain +
          overviewBreath(col * COLUMN_SPACING, r * ROW_SPACING, overviewClock) +
          (p
            ? overviewRipple(
                Math.hypot(
                  col * COLUMN_SPACING -
                    (p.column + homeLaneOffset) * COLUMN_SPACING,
                  r * ROW_SPACING - (p.row + homeRowOffset) * ROW_SPACING,
                ),
                overviewClock - pulse!.start,
              )
            : 0)
        );
      };
      const pulseItem = pulse && items[pulse.index];
      if (pulseItem)
        pulsePosition.set(
          (pulseItem.column + homeLaneOffset) * COLUMN_SPACING - x,
          -0.89 +
            homeHeight(
              pulseItem.column + homeLaneOffset,
              pulseItem.row + homeRowOffset,
            ) +
            (pulse!.index === index ? lift : 0),
          (pulseItem.row + homeRowOffset) * ROW_SPACING - z - 2.17,
        );
      drawPulse(
        pulseItem ? pulsePosition : null,
        pulse ? overviewClock - pulse.start : 1,
        !reduced && overviewWanted,
      );
      anchorHeights = anchorIndices.map((i) => {
        const item = items[i]!;
        return (
          -0.89 +
          homeHeight(item.column + homeLaneOffset, item.row + homeRowOffset) +
          (i === index ? lift : 0)
        );
      });
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
          const visibility =
            physicalLane === lane && physicalRow === row ? 0 : 1;
          const hover =
            !reduced &&
            hovered?.lane === physicalLane &&
            hovered?.row === physicalRow
              ? 0.13
              : 0;
          const y =
            -2.75 +
            (shoulder(physicalRow - focusRow, physicalLane - focusLane) +
              waves.height(physicalRow, physicalLane)) *
              (1 - og) +
            homeHeight(physicalLane, physicalRow) * og +
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
            transform.scale.copy(p.scale).multiplyScalar(visibility);
            transform.updateMatrix();
            p.mesh.setMatrixAt(slot, transform.matrix);
          }
        }
      for (const p of parts) p.mesh.instanceMatrix.needsUpdate = true;
      active.position.set(
        lane * COLUMN_SPACING - x,
        -2.75 +
          (shoulder(row - focusRow, lane - focusLane) +
            waves.height(row, lane)) *
            (1 - og) +
          homeHeight(lane, row) * og +
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
      // Convert the matrix endpoint into the currently recentered local frame.
      // In world space this endpoint stays fixed throughout entry and return.
      if (overviewRig) {
        aim.x += overviewRig.x - x;
        aim.z += overviewRig.z - z;
      }
      const matrixFov = THREE.MathUtils.radToDeg(
        2 * Math.atan(viewSpan / (2 * distance)),
      );
      const overviewAim = new THREE.Vector3(
        anchorCenter * COLUMN_SPACING - x,
        portrait ? -1.3 : OVERVIEW.aimHeight,
        homeRowOffset * ROW_SPACING - z - 2.17,
      );
      const finalDistance = THREE.MathUtils.lerp(
        distance,
        OVERVIEW.distance,
        og,
      );
      const finalSpan = THREE.MathUtils.lerp(
        viewSpan,
        overviewSpan(aspect),
        og,
      );
      aim.lerp(overviewAim, og);
      direction
        .lerp(new THREE.Vector3(...OVERVIEW.direction).normalize(), og)
        .normalize();
      if ((overviewWanted && og === 1) || (!overviewWanted && og === 0))
        overviewRig = null;
      return {
        moving: moving || (og > 0 && !reduced),
        overview: og,
        lift,
        journey,
        worldOffset: { x, z },
        aim,
        direction,
        distance: finalDistance,
        fov:
          og === 0
            ? matrixFov
            : THREE.MathUtils.radToDeg(
                2 * Math.atan(finalSpan / (2 * finalDistance)),
              ),
      };
    },
    dispose() {
      resources.dispose();
    },
  };
}
