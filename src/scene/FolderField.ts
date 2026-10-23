import * as THREE from "three";
import { createDisposalScope } from "./resources";
import { createCassetteKit } from "./CassetteKit";
import { spring, advance } from "./motion";
import type { SceneItem, SceneNavigation, ScenePose } from "./types";

/** The same cassette enclosure, assembled into two collection folios. */
export function createFolderField(
  scene: THREE.Scene,
  items: SceneItem[],
  _compact: boolean,
  entryPose?: ScenePose,
) {
  const resources = createDisposalScope();
  const group = new THREE.Group();
  scene.add(group);
  resources.defer(() => {
    scene.remove(group);
    group.clear();
  });
  try {
    const kit = createCassetteKit(resources);
    const files = items.map((item, i) => {
      const folio = new THREE.Group();
      const hero = kit.create(item);
      folio.add(hero.group);
      // Recessed stacked leaves reuse the enclosure, not a second material system.
      const leaves = [0, 1].map((n) => {
        const leaf = new THREE.Mesh(
          kit.parts[0]!.geometry,
          kit.parts[0]!.material,
        );
        leaf.position.set(0.045 * (n + 1), -0.035 * (n + 1), -0.3 * (n + 1));
        leaf.castShadow = true;
        folio.add(leaf);
        return leaf;
      });
      folio.traverse((o) => {
        o.userData.index = i;
      });
      group.add(folio);
      return {
        folio,
        hero,
        leaves,
        lift: spring(0),
        open: spring(0),
        base: (i - (items.length - 1) / 2) * 5.9,
      };
    });
    const floorGeometry = new THREE.PlaneGeometry(200, 200);
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xe9e7df,
      roughness: 0.9,
    });
    resources.defer(() => {
      floorGeometry.dispose();
      floorMaterial.dispose();
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.25;
    floor.receiveShadow = true;
    group.add(floor);
    let index = 0,
      hovered: number | null = null;
    const opening = spring(0);
    const arrival = spring(entryPose ? 1 : 0);
    return {
      snapshot() {
        const file = files[index]!.folio;
        return {
          position: file.position.clone(),
          rotation: file.quaternion.clone(),
        };
      },
      select(next: number, _navigation?: SceneNavigation) {
        index = next;
      },
      hit(ray: THREE.Raycaster, _click = false) {
        const h = ray.intersectObjects(
          files.map((f) => f.folio),
          true,
        )[0];
        hovered = h ? (h.object.userData.index as number) : null;
        return hovered;
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
        let moving = advance(opening, expanded ? 1 : 0, dt, reduced, 8);
        moving = advance(arrival, 0, dt, reduced, 8) || moving;
        const t = opening.value;
        for (const [i, f] of files.entries()) {
          moving =
            advance(
              f.lift,
              i === index ? 0.32 : hovered === i ? 0.15 : 0,
              dt,
              reduced,
              10,
            ) || moving;
          moving =
            advance(f.open, expanded && i === index ? 1 : 0, dt, reduced, 8) ||
            moving;
          const o = f.open.value;
          f.folio.position.set(
            f.base * (1 - o * 0.82),
            -0.1 + f.lift.value + o * 0.9,
            -i * 0.7 + o * 1.2,
          );
          f.folio.rotation.set(
            -0.28 + o * 0.28,
            -0.12 * (i ? -1 : 1),
            -0.035 * (i ? -1 : 1),
          );
          f.hero.cover.position.z = o * 0.55;
          f.leaves.forEach((leaf, n) => {
            leaf.position.x = 0.045 * (n + 1) - o * 0.2 * (n + 1);
          });
          f.folio.scale.setScalar(1 - (expanded && i !== index ? t * 0.18 : 0));
        }
        const aspect = width / height;
        const portrait = aspect < 1.05;
        if (portrait) {
          files.forEach((f, i) => {
            f.folio.position.x *= 0.5;
            f.folio.position.y += (i ? -1.8 : 1.1) * (1 - t);
          });
        }
        if (entryPose && arrival.value > 0) {
          const selected = files[index]!;
          selected.folio.position.lerp(entryPose.position, arrival.value);
          selected.folio.quaternion.slerp(entryPose.rotation, arrival.value);
          selected.hero.cover.position.z += arrival.value * 0.28;
          files.forEach((f, i) => {
            if (i !== index) f.folio.scale.multiplyScalar(1 - arrival.value);
          });
        }
        const span =
          Math.max(portrait ? 12 : 8.8, (portrait ? 9.5 : 18.5) / aspect) -
          t * 1.1;
        return {
          moving,
          aim: new THREE.Vector3(0, portrait ? -0.7 : -0.1, 0),
          direction: new THREE.Vector3(-0.35 - t * 0.25, 0.26, 1).normalize(),
          distance: 85,
          fov: THREE.MathUtils.radToDeg(2 * Math.atan(span / 170)),
        };
      },
      dispose() {
        resources.dispose();
      },
    };
  } catch (error) {
    resources.dispose();
    throw error;
  }
}
