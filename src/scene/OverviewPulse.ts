import * as THREE from "three";
import { OVERVIEW } from "./overview.ts";
import type { createDisposalScope } from "./resources";

/** Reused pair of world-space rings. Re-selection replaces, never queues, a pulse. */
export function createOverviewPulse(
  parent: THREE.Group,
  resources: ReturnType<typeof createDisposalScope>,
) {
  const geometry = new THREE.RingGeometry(0.982, 1, 80);
  const rings = [0, 1].map(() => {
    const material = new THREE.MeshBasicMaterial({
      color: 0xb88b49,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = -Math.PI / 2;
    ring.renderOrder = 3;
    ring.visible = false;
    parent.add(ring);
    resources.defer(() => {
      parent.remove(ring);
      material.dispose();
    });
    return ring;
  });
  resources.defer(() => geometry.dispose());
  return (position: THREE.Vector3 | null, age: number, enabled: boolean) => {
    rings.forEach((ring, i) => {
      const t = (age - i * 0.14) / (OVERVIEW.rippleDuration - i * 0.14);
      ring.visible = enabled && position !== null && t >= 0 && t < 1;
      if (!ring.visible) return;
      ring.position.copy(position!);
      ring.scale.setScalar(0.3 + (OVERVIEW.rippleRadius - 0.3) * t);
      ring.material.opacity =
        OVERVIEW.ringOpacity * Math.sin(Math.PI * t) * (1 - t);
    });
  };
}
