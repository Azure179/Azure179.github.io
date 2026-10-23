import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import type { createDisposalScope } from "./resources";
import type { SceneItem } from "./types";

/** Shared, independently authored anodized archive enclosure. No external assets. */
export function createCassetteKit(
  resources: ReturnType<typeof createDisposalScope>,
) {
  const own = <T extends { dispose(): void }>(value: T): T => {
    resources.defer(() => value.dispose());
    return value;
  };
  const shell = own(new RoundedBoxGeometry(5, 3.7, 0.28, 3, 0.07));
  const box = own(new RoundedBoxGeometry(1, 1, 1, 2, 0.06));
  const plane = own(new THREE.PlaneGeometry(1, 1));
  const screw = own(new THREE.CylinderGeometry(0.045, 0.045, 0.035, 12));
  screw.rotateX(Math.PI / 2);
  const metal = (color: number, roughness: number, metalness: number) =>
    own(
      new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness,
        envMapIntensity: 0.7,
      }),
    );
  const ceramic = metal(0xc9c8c0, 0.42, 0.36);
  const rail = metal(0xe6e4da, 0.26, 0.65);
  const graphite = metal(0x434842, 0.48, 0.56);
  const inset = metal(0xdddcd3, 0.78, 0.12);
  const accent = metal(0x9c7640, 0.32, 0.68);
  const glass = own(
    new THREE.MeshPhysicalMaterial({
      color: 0xf2f3e9,
      roughness: 0.21,
      metalness: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.13,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      envMapIntensity: 0.8,
    }),
  );
  const parts: {
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    offset: THREE.Vector3;
    scale: THREE.Vector3;
    cover?: boolean;
  }[] = [];
  const add = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    offset: number[],
    scale = [1, 1, 1],
    cover = false,
  ) =>
    parts.push({
      geometry,
      material,
      offset: new THREE.Vector3(...offset),
      scale: new THREE.Vector3(...scale),
      cover,
    });
  add(shell, ceramic, [0, 0, -0.12]);
  add(box, graphite, [0, 0, 0.035], [4.78, 3.48, 0.12]);
  add(box, inset, [0, 0, 0.11], [4.55, 3.23, 0.08]);
  add(box, rail, [0, 1.78, 0.09], [4.98, 0.14, 0.38]);
  add(box, rail, [0, -1.78, 0.09], [4.98, 0.14, 0.38]);
  add(box, rail, [-2.42, 0, 0.09], [0.14, 3.5, 0.38]);
  add(box, rail, [2.42, 0, 0.09], [0.14, 3.5, 0.38]);
  for (const x of [-2.25, 2.25])
    for (const y of [-1.56, 1.56]) add(screw, graphite, [x, y, 0.3]);
  add(box, accent, [-1.8, 1.86, 0.02], [0.24, 0.045, 0.2]);
  add(box, graphite, [1.77, -1.45, 0.23], [0.44, 0.2, 0.08]);
  add(plane, glass, [0, 0, 0.31], [4.6, 3.26, 1], true);

  function create(item: SceneItem) {
    const group = new THREE.Group();
    const cover = new THREE.Group();
    group.add(cover);
    for (const [i, part] of parts.entries()) {
      const mesh = new THREE.Mesh(part.geometry, part.material);
      mesh.position.copy(part.offset);
      mesh.scale.copy(part.scale);
      mesh.castShadow = i === 0;
      mesh.receiveShadow = i === 0;
      (part.cover ? cover : group).add(mesh);
    }
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 720;
    const pen = canvas.getContext("2d");
    if (!pen) throw new Error("Canvas label unavailable");
    const texture = own(new THREE.CanvasTexture(canvas));
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    const label = new THREE.Mesh(
      plane,
      own(
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
        }),
      ),
    );
    label.scale.set(4.35, 3.05, 1);
    label.position.z = 0.21;
    group.add(label);
    // Small recessed registration modules add depth under the glass. They are
    // enclosure details, not representations of scientific measurements.
    for (let i = 0; i < 3; i++) {
      const x = -1.4 + i * 1.4;
      const tray = new THREE.Mesh(box, graphite);
      tray.scale.set(1.06, 0.38, 0.045);
      tray.position.set(x, -0.8, 0.22);
      group.add(tray);
      const insert = new THREE.Mesh(box, rail);
      insert.scale.set(0.95, 0.27, 0.055);
      insert.position.set(x, -0.79, 0.25);
      group.add(insert);
      const register = new THREE.Mesh(box, accent);
      register.scale.set(0.28, 0.035, 0.028);
      register.position.set(x - 0.23, -0.79, 0.29);
      group.add(register);
    }
    function updateLabel(value: SceneItem) {
      const p = pen!;
      p.clearRect(0, 0, 1024, 720);
      p.fillStyle = "#5f655c";
      p.font = "19px monospace";
      p.fillText("BIOINFORMATICS  /  ARCHIVE", 24, 43);
      p.fillStyle = "#8e6a39";
      p.fillRect(24, 75, 70, 4);
      p.font = "24px monospace";
      p.fillText(value.label, 24, 128);
      p.fillStyle = "#222a26";
      p.font = "500 54px sans-serif";
      // Real project titles, wrapped rather than horizontally squeezed.
      const chars = Array.from(value.title ?? value.label);
      let line = "",
        y = 213;
      for (const char of chars) {
        if (p.measureText(line + char).width > 930 && line) {
          p.fillText(line, 24, y);
          line = "";
          y += 65;
        }
        line += char;
      }
      p.fillText(line, 24, y);
      p.fillStyle = "#697068";
      p.font = "25px sans-serif";
      p.fillText(
        value.section ?? "COLLECTION / PROJECT INDEX",
        24,
        y + 60,
        930,
      );
      p.strokeStyle = "#91988a";
      p.lineWidth = 1.5;
      p.beginPath();
      p.moveTo(24, 415);
      p.lineTo(970, 415);
      p.stroke();
      p.fillStyle = "#5f655c";
      p.font = "17px monospace";
      p.fillText("CURATED RECORD / OPEN ACCESS INDEX", 24, 655);
      for (let i = 0; i < 38; i++)
        p.fillRect(745 + i * 5, 626, i % 3 ? 1 : 2, 30);
      texture.needsUpdate = true;
    }
    updateLabel(item);
    return { group, cover, updateLabel };
  }
  function instanceParts() {
    // Distant repeated cassettes retain the silhouette, without paying for
    // sub-pixel rail bevels. The selected enclosure keeps its full detail.
    const shellLOD = own(new RoundedBoxGeometry(5, 3.7, 0.28, 1, 0.07));
    const railLOD = own(new THREE.BoxGeometry(1, 1, 1));
    return parts.map((part) => ({
      ...part,
      geometry:
        part.geometry === shell
          ? shellLOD
          : part.geometry === box
            ? railLOD
            : part.geometry,
    }));
  }
  return { parts, create, instanceParts };
}
