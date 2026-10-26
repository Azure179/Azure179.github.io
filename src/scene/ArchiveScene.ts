import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { createFrameLoop, renderRatio } from "./state";
import { createDisposalScope } from "./resources";
import { createMatrixField } from "./MatrixField";
import { spring, advance } from "./motion";
import { OVERVIEW } from "./overview";
import type { ArchiveScene, SceneOptions, SceneItem } from "./types";

/** Shared renderer, lighting and continuous camera rig across both archive levels. */
export function createArchiveScene(options: SceneOptions): ArchiveScene {
  const resources = createDisposalScope();
  try {
    return buildScene(options, resources);
  } catch (error) {
    resources.dispose();
    throw error;
  }
}
function buildScene(
  options: SceneOptions,
  resources: ReturnType<typeof createDisposalScope>,
): ArchiveScene {
  const { host } = options;
  let kind = options.kind;
  let overviewCamera = kind === "overview";
  let field: ReturnType<typeof createMatrixField> | null = null;
  resources.defer(() => field?.dispose());
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.touchAction = "pan-y";
  resources.defer(() => canvas.remove());
  const context = canvas.getContext("webgl2", {
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  if (!context) throw new Error("WebGL2 unavailable");
  resources.defer(() =>
    context.getExtension("WEBGL_lose_context")?.loseContext(),
  );
  const renderer = new THREE.WebGLRenderer({
    canvas,
    context,
    alpha: true,
    antialias: true,
  });
  resources.defer(() => renderer.dispose());
  renderer.setClearColor(0xf2f0eb, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.94;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  // Beyond the far clipping plane at matrix gain=0: no matrix haze or shader churn.
  const overviewFog = new THREE.Fog(0xf2f0eb, 501, 650);
  scene.fog = overviewFog;
  const room = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentSetup = createDisposalScope();
  resources.defer(() => environmentSetup.dispose());
  environmentSetup.defer(() => pmrem.dispose());
  environmentSetup.defer(() => room.dispose());
  const environment = pmrem.fromScene(room, 0.04, 0.1, 100, { size: 128 });
  resources.defer(() => environment.dispose());
  environmentSetup.dispose();
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.55;
  const hemisphere = new THREE.HemisphereLight(0xfff1da, 0x706250, 1.35);
  scene.add(hemisphere);
  const key = new THREE.DirectionalLight(0xffd3a0, 3.6);
  key.position.set(-12, 22, 16);
  key.shadow.mapSize.set(1536, 1536);
  Object.assign(key.shadow.camera, {
    left: -28,
    right: 28,
    top: 24,
    bottom: -24,
    near: 1,
    far: 100,
  });
  key.shadow.bias = -0.0003;
  key.shadow.normalBias = 0.035;
  resources.defer(() => key.shadow.map?.dispose());
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xf1e9dd, 0.8);
  fill.position.set(8, 4, -6);
  scene.add(fill);
  // A broad warm pool breaks the flat aerial illumination; it fades out fully
  // on descent, leaving the established matrix lighting untouched.
  const overviewLight = new THREE.SpotLight(0xffe2b3, 0, 0, 0.65, 0.85, 0);
  overviewLight.position.set(-18, 24, 10);
  overviewLight.target.position.set(8, -2, 0);
  scene.add(overviewLight, overviewLight.target);
  const camera = new THREE.PerspectiveCamera(10, 1, 0.5, 500);
  const cameraAim = [spring(0), spring(0), spring(0)];
  const cameraDirection = [spring(0), spring(0), spring(1)];
  const cameraDistance = spring(85),
    cameraSpan = spring(10);
  const aim = new THREE.Vector3(),
    direction = new THREE.Vector3();
  const raycaster = new THREE.Raycaster(),
    cursor = new THREE.Vector2();
  const events = new AbortController(),
    signal = events.signal;
  resources.defer(() => events.abort());
  let expanded = false,
    reduced = options.reduced,
    disposed = false,
    paused = false;
  let frames = 0,
    last = 0,
    width = 1,
    height = 1;
  let pointer: { x: number; y: number } | null = null;
  let pointerPosition: { x: number; y: number } | null = null;
  let down: { x: number; y: number; id: number } | null = null;
  let hovered: number | null = null;
  function configure(items: SceneItem[], layout: "overview" | "matrix") {
    if (kind !== layout || layout === "overview") overviewCamera = true;
    kind = layout;
    expanded = false;
    const compact =
      host.clientWidth < 650 || matchMedia("(pointer: coarse)").matches;
    renderer.shadowMap.enabled = !compact;
    key.castShadow = !compact;
    if (compact && key.shadow.map) {
      key.shadow.map.dispose();
      key.shadow.map = null;
    }
    if (!field)
      field = createMatrixField(
        scene,
        items,
        compact,
        false,
        undefined,
        layout === "overview",
      );
    field.overview(layout === "overview");
    field.anchors(options.anchors);
  }
  configure(options.items, kind);
  host.append(canvas);
  function pick(x: number, y: number, click = false) {
    const rect = canvas.getBoundingClientRect();
    cursor.set(
      ((x - rect.left) / rect.width) * 2 - 1,
      (-(y - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(cursor, camera);
    return field?.hit(raycaster, click) ?? null;
  }
  function frame(time: number) {
    if (disposed || paused || !field) return false;
    const dt = last ? Math.min((time - last) / 1000, 0.06) : 1 / 60;
    last = time;
    if (pointer) {
      hovered = pick(pointer.x, pointer.y);
      canvas.style.cursor = hovered === null ? "default" : "pointer";
      options.onHover(hovered, pointer.x, pointer.y);
      pointer = null;
    }
    const target = field.update(dt, reduced, expanded, width, height);
    const lightGain = target.overview;
    key.position.set(
      -12 - 16 * lightGain,
      22 - 6 * lightGain,
      16 - 8 * lightGain,
    );
    hemisphere.intensity = 1.35 + OVERVIEW.hemisphereDelta * lightGain;
    key.intensity = 3.6 + OVERVIEW.keyDelta * lightGain;
    fill.intensity = 0.8 + OVERVIEW.fillDelta * lightGain;
    overviewLight.intensity = OVERVIEW.warmFill * lightGain;
    renderer.toneMappingExposure = 0.94 + OVERVIEW.exposureDelta * lightGain;
    overviewFog.near = THREE.MathUtils.lerp(501, OVERVIEW.fogNear, lightGain);
    overviewFog.far = THREE.MathUtils.lerp(650, OVERVIEW.fogFar, lightGain);
    let moving = false;
    // Overview poses already have a quintic ease shared with the world rig.
    // Filtering them again makes the camera lag behind the recentered archives.
    const snap = reduced || frames === 0 || target.journey;
    const cameraRate = overviewCamera ? 16 : 8;
    for (const [i, axis] of (["x", "y", "z"] as const).entries()) {
      moving =
        advance(
          cameraAim[i]!,
          target.aim[axis],
          dt,
          snap,
          overviewCamera ? 18 : 9,
        ) || moving;
      moving =
        advance(
          cameraDirection[i]!,
          target.direction[axis],
          dt,
          snap,
          cameraRate,
        ) || moving;
      aim[axis] = cameraAim[i]!.value;
      direction[axis] = cameraDirection[i]!.value;
    }
    const span =
      2 * target.distance * Math.tan(THREE.MathUtils.degToRad(target.fov / 2));
    moving =
      advance(cameraDistance, target.distance, dt, snap, cameraRate) || moving;
    moving = advance(cameraSpan, span, dt, snap, cameraRate) || moving;
    camera.position
      .copy(aim)
      .addScaledVector(direction.normalize(), cameraDistance.value);
    camera.fov = THREE.MathUtils.radToDeg(
      2 * Math.atan(cameraSpan.value / (2 * cameraDistance.value)),
    );
    camera.updateProjectionMatrix();
    camera.lookAt(aim);
    camera.updateMatrixWorld();
    const cameraMoving = moving;
    if (target.overview === 0 && !cameraMoving) overviewCamera = false;
    moving = moving || target.moving;
    scene.updateMatrixWorld();
    if (target.overview > 0)
      options.onAnchors(
        field.anchorPoints().map((point) => {
          point.project(camera);
          return {
            x: ((point.x + 1) * width) / 2,
            y: ((1 - point.y) * height) / 2,
            visible:
              Math.abs(point.x) < 1 &&
              Math.abs(point.y) < 1 &&
              point.z > -1 &&
              point.z < 1,
          };
        }),
      );
    try {
      renderer.render(scene, camera);
    } catch {
      queueMicrotask(options.onFailure);
      return false;
    }
    frames++;
    options.onStats({
      frames,
      calls: renderer.info.render.calls,
      triangles: renderer.info.render.triangles,
      geometries: renderer.info.memory.geometries,
      textures: renderer.info.memory.textures,
      pixels: canvas.width * canvas.height,
      moving,
      overview: target.overview,
      cameraMoving,
      lift: target.lift,
    });
    return moving;
  }
  const loop = createFrameLoop(
    frame,
    requestAnimationFrame,
    cancelAnimationFrame,
  );
  resources.defer(() => loop.dispose());
  function resize() {
    if (disposed) return;
    width = Math.max(1, host.clientWidth);
    height = Math.max(1, host.clientHeight);
    const compact = width < 650 || matchMedia("(pointer: coarse)").matches;
    renderer.setPixelRatio(
      renderRatio(width, height, devicePixelRatio, compact),
    );
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    loop.wake();
  }
  const observer = new ResizeObserver(resize);
  resources.defer(() => observer.disconnect());
  observer.observe(host);
  canvas.addEventListener(
    "pointermove",
    (event) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      pointerPosition = pointer;
      loop.wake();
    },
    { signal },
  );
  canvas.addEventListener(
    "pointerleave",
    () => {
      pointer = null;
      pointerPosition = null;
      hovered = null;
      options.onHover(null);
      field?.clearHover();
      loop.wake();
    },
    { signal },
  );
  canvas.addEventListener(
    "pointerdown",
    (event) => {
      if (!event.isPrimary || event.button !== 0) {
        down = null;
        return;
      }
      down = { x: event.clientX, y: event.clientY, id: event.pointerId };
    },
    { signal },
  );
  canvas.addEventListener(
    "pointercancel",
    () => {
      down = null;
      tap = null;
    },
    { signal },
  );
  canvas.addEventListener(
    "pointerup",
    (event) => {
      if (!down || down.id !== event.pointerId) return;
      const start = down;
      down = null;
      if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 7) {
        tap = null;
        return;
      }
      const index = pick(event.clientX, event.clientY, true);
      if (index !== null) {
        options.onSelect(index);
        if (event.pointerType !== "mouse") {
          const now = performance.now();
          if (tap?.index === index && now - tap.time < 380) {
            tap = null;
            options.onOpen(index);
          } else tap = { index, time: now };
        }
      }
    },
    { signal },
  );
  let tap: { index: number; time: number } | null = null;
  canvas.addEventListener(
    "dblclick",
    (event) => {
      const index = pick(event.clientX, event.clientY, true);
      if (index !== null) options.onOpen(index);
    },
    { signal },
  );
  canvas.addEventListener(
    "webglcontextlost",
    (event) => {
      event.preventDefault();
      loop.dispose();
      queueMicrotask(options.onFailure);
    },
    { signal },
  );
  resize();
  return {
    anchors(indices) {
      field?.anchors(indices);
      loop.wake();
    },
    pulse(index) {
      field?.pulse(index);
      loop.wake();
    },
    configure(items, layout) {
      configure(items, layout);
      loop.wake();
    },
    select(index, open = false, navigation) {
      if (index !== null) field?.select(index, navigation);
      expanded = open;
      pointer = kind === "overview" ? pointerPosition : null;
      field?.clearHover();
      options.onHover(null);
      loop.wake();
    },
    hover() {
      loop.wake();
    },
    reduce(value) {
      reduced = value;
      loop.wake();
    },
    pause(value) {
      paused = value;
      if (value) options.onHover(null);
      last = 0;
      loop.pause(value);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      scene.clear();
      resources.dispose();
    },
  };
}
