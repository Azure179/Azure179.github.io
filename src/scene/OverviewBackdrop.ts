import * as THREE from "three";
import { COLUMN_SPACING, ROW_SPACING } from "./matrix-layout.ts";
import {
  overviewSpan,
  OVERVIEW,
  overviewHeightGLSL,
  type OverviewAnchors,
} from "./overview.ts";
import type { createDisposalScope } from "./resources";

/** Three draw calls for distant silhouettes, rails and registration tabs; no fake records. */
export function createOverviewBackdrop(
  scene: THREE.Group,
  resources: ReturnType<typeof createDisposalScope>,
) {
  const group = new THREE.Group();
  scene.add(group);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const materials = [
    new THREE.MeshStandardMaterial({
      color: 0xc9c8c0,
      roughness: 0.42,
      metalness: 0.36,
      envMapIntensity: 0.7,
    }),
    new THREE.MeshStandardMaterial({
      color: 0xe6e4da,
      roughness: 0.26,
      metalness: 0.65,
      envMapIntensity: 0.7,
    }),
    new THREE.MeshStandardMaterial({
      color: 0x9c7640,
      roughness: 0.32,
      metalness: 0.68,
      envMapIntensity: 0.7,
    }),
  ];
  const clock = { value: 0 },
    amplitude = { value: 0 };
  const anchors = { value: new THREE.Vector4() },
    motion = { value: 1 };
  const depth = new THREE.MeshDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
  });
  [...materials, depth].forEach((material, index) => {
    material.onBeforeCompile = (shader) => {
      shader.uniforms.overviewClock = clock;
      shader.uniforms.overviewAmplitude = amplitude;
      shader.uniforms.overviewAnchors = anchors;
      shader.uniforms.overviewMotion = motion;
      // Every piece follows its cassette origin, including the inset body and
      // offset registration tab; otherwise enlarged breathing separates parts.
      shader.uniforms.overviewOffset = {
        value:
          index === 1
            ? new THREE.Vector2(0, -0.09)
            : index === 2
              ? new THREE.Vector2(1.8, -0.02)
              : new THREE.Vector2(0, 0.12),
      };
      shader.vertexShader =
        "uniform float overviewClock; uniform float overviewAmplitude; uniform vec2 overviewOffset;\n" +
        overviewHeightGLSL +
        "\n" +
        shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        vec2 cell = instanceMatrix[3].xz + overviewOffset;
        cell.y += 2.17;
        transformed.y += overviewAmplitude * overviewHeight(cell) / instanceMatrix[1][1];`,
      );
    };
    material.customProgramCacheKey = () => "overview-terrain-v3";
  });
  const meshes = materials.map((m) => new THREE.InstancedMesh(box, m, 16000));
  meshes[0]!.castShadow = true;
  meshes[0]!.receiveShadow = true;
  meshes[0]!.customDepthMaterial = depth;
  for (const mesh of meshes) {
    mesh.frustumCulled = false;
    group.add(mesh);
  }
  resources.defer(() => {
    meshes.forEach((m) => m.dispose());
    materials.forEach((m) => m.dispose());
    depth.dispose();
    box.dispose();
    scene.remove(group);
  });
  let key = "";
  const object = new THREE.Object3D();
  return {
    update(
      gain: number,
      x: number,
      z: number,
      centerLane: number,
      centerRow: number,
      nearColumns: number,
      nearRows: number,
      aspect: number,
      time: number,
      reduced: boolean,
      terrainAnchors: OverviewAnchors,
    ) {
      clock.value = time;
      amplitude.value = gain;
      motion.value = reduced ? 0 : 1;
      anchors.value.copy(terrainAnchors);
      group.visible = gain > 0.0001;
      if (!group.visible) return;
      group.position.set(-x, 0, -z);
      // Overscan includes the oblique ground footprint, perspective expansion and camera travel.
      const span = overviewSpan(aspect);
      const coverage =
        aspect < 1 ? OVERVIEW.portraitOverscan : OVERVIEW.overscan;
      const lanes = Math.ceil(
        (span * (aspect * 0.64 + 0.8) * coverage + 14) / COLUMN_SPACING,
      );
      const rows = Math.ceil(
        (span * (aspect * 0.77 + 0.66) * coverage + 14) / ROW_SPACING,
      );
      const next = `${centerLane}/${centerRow}/${lanes}/${rows}/${nearColumns}/${nearRows}`;
      if (next === key) return;
      key = next;
      let slot = 0;
      for (let c = -lanes; c <= lanes; c++)
        for (let r = -rows; r <= rows; r++) {
          if (
            c >= -Math.floor(nearColumns / 2) &&
            c < Math.ceil(nearColumns / 2) &&
            r >= -Math.floor(nearRows / 2) &&
            r < Math.ceil(nearRows / 2)
          )
            continue;
          if (slot >= 16000) continue;
          const px = (c + centerLane) * COLUMN_SPACING,
            pz = (r + centerRow) * ROW_SPACING - 2.17;
          object.position.set(px, -2.75, pz - 0.12);
          object.scale.set(5, 3.7, 0.28);
          object.updateMatrix();
          meshes[0]!.setMatrixAt(slot, object.matrix);
          object.position.set(px, -0.97, pz + 0.09);
          object.scale.set(4.98, 0.14, 0.38);
          object.updateMatrix();
          meshes[1]!.setMatrixAt(slot, object.matrix);
          object.position.set(px - 1.8, -0.89, pz + 0.02);
          object.scale.set(0.24, 0.045, 0.2);
          object.updateMatrix();
          meshes[2]!.setMatrixAt(slot, object.matrix);
          slot++;
        }
      for (const mesh of meshes) {
        mesh.count = slot;
        mesh.instanceMatrix.needsUpdate = true;
      }
    },
  };
}
