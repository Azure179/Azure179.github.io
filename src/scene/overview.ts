import { COLUMN_SPACING } from "./matrix-layout.ts";
/** Home-only motion and camera tuning; the existing matrix pose is unchanged. */
export const OVERVIEW_DURATION = 2;
export const OVERVIEW_BASE = -2.75;
/** All increments fade with overviewGain; matrix endpoints remain independent. */
export const OVERVIEW = {
  distance: 174,
  visibleColumns: 6,
  aimHeight: -0.5,
  overscan: 0.72,
  portraitOverscan: 0.98,
  direction: [-0.62, 0.52, 0.49] as const,
  terrainAmplitude: 0.16,
  collectionAmplitude: 0.38,
  terrainRadius: 5.5,
  breathAmplitude: [0.16, 0.055] as const,
  breathPeriod: [10.6, 14.3] as const,
  rippleDuration: 1.15,
  rippleRadius: 3.6,
  rippleHeight: 0.12,
  ringOpacity: 1.05,
  fogNear: 166,
  fogFar: 219,
  hemisphereDelta: -0.18,
  keyDelta: 0.9,
  fillDelta: 0.05,
  warmFill: 1.5,
  exposureDelta: 0.1,
};
export type OverviewAnchors = { x: number; y: number; z: number; w: number };
export function overviewTerrain(
  x: number,
  z: number,
  anchors: OverviewAnchors,
) {
  const ax = x - anchors.x,
    az = z - anchors.y;
  const bx = x - anchors.z,
    bz = z - anchors.w;
  const radiusSquared = OVERVIEW.terrainRadius ** 2;
  return (
    OVERVIEW.terrainAmplitude *
      Math.sin(x * 0.09 + z * 0.11) *
      Math.cos(z * 0.07 - x * 0.04) +
    OVERVIEW.collectionAmplitude *
      (Math.exp(-(ax * ax + az * az) / radiusSquared) +
        Math.exp(-(bx * bx + bz * bz) / radiusSquared))
  );
}
export function overviewSpan(aspect: number) {
  // Keep both collection anchors reachable on portrait screens. On desktop,
  // fit six column pitches across the oblique ground footprint (not six rows).
  if (aspect < 1.05) return 28 / Math.max(0.25, aspect);
  const [x, y, z] = OVERVIEW.direction;
  const horizontal = Math.hypot(x, z);
  const elevation = y / Math.hypot(x, y, z);
  const rightX = Math.abs(z) / horizontal;
  const depthX = Math.abs(x) / horizontal / elevation;
  return (
    (OVERVIEW.visibleColumns * COLUMN_SPACING) / (aspect * rightX + depthX)
  );
}
export function overviewBreath(x: number, z: number, time: number) {
  return (
    OVERVIEW.breathAmplitude[0] *
      Math.sin(
        (time * Math.PI * 2) / OVERVIEW.breathPeriod[0] + x * 0.12 + z * 0.22,
      ) +
    OVERVIEW.breathAmplitude[1] *
      Math.sin(
        (time * Math.PI * 2) / OVERVIEW.breathPeriod[1] - x * 0.16 + z * 0.13,
      )
  );
}
export function overviewRipple(distance: number, age: number) {
  if (
    age < 0 ||
    age >= OVERVIEW.rippleDuration ||
    distance > OVERVIEW.rippleRadius
  )
    return 0;
  const edge = Math.max(0, 1 - distance / OVERVIEW.rippleRadius);
  return (
    OVERVIEW.rippleHeight *
    Math.sin((Math.PI * age) / OVERVIEW.rippleDuration) *
    edge *
    Math.exp(
      -(
        ((distance - (age * OVERVIEW.rippleRadius) / OVERVIEW.rippleDuration) /
          0.7) **
        2
      ),
    )
  );
}

// Same tuning and cassette-origin coordinates for distant bodies, tabs and shadow depth.
export const overviewHeightGLSL = `
uniform vec4 overviewAnchors;
uniform float overviewMotion;
float overviewHeight(vec2 cell) {
  vec2 a = cell - overviewAnchors.xy, b = cell - overviewAnchors.zw;
  float terrain = ${OVERVIEW.terrainAmplitude} * sin(cell.x * .09 + cell.y * .11) * cos(cell.y * .07 - cell.x * .04)
    + ${OVERVIEW.collectionAmplitude} * (exp(-dot(a,a) / ${(OVERVIEW.terrainRadius ** 2).toFixed(6)}) + exp(-dot(b,b) / ${(OVERVIEW.terrainRadius ** 2).toFixed(6)}));
  float breath = ${OVERVIEW.breathAmplitude[0]} * sin(overviewClock * 6.28318530718 / ${OVERVIEW.breathPeriod[0]} + cell.x * .12 + cell.y * .22)
    + ${OVERVIEW.breathAmplitude[1]} * sin(overviewClock * 6.28318530718 / ${OVERVIEW.breathPeriod[1]} - cell.x * .16 + cell.y * .13);
  return terrain + overviewMotion * breath;
}`;
export function overviewEase(t: number) {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (10 + t * (-15 + 6 * t));
}
