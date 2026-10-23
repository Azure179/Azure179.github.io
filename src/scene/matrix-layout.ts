/**
 * Adapted from RhineLabUI archive-loop.ts / motion.ts at 12cc5e4.
 * Copyright (c) 2026 LBEILC — MIT; see public/licenses/RhineLabUI-MIT.txt.
 * Generalized to this site's project/section counts; no upstream assets.
 */
export const COLUMN_SPACING = 5.2;
export const ROW_SPACING = 0.62;
export const wrap = (value: number, count: number) =>
  ((value % count) + count) % count;
export function nearestOccurrence(
  value: number,
  center: number,
  period: number,
) {
  return value + Math.floor((center - value + period / 2) / period) * period;
}
export function shoulder(rowDistance: number, columnDistance: number) {
  const height = Math.max(
    -0.42,
    2.15 - 0.17 * (Math.sqrt(rowDistance * rowDistance + 1) - 1),
  );
  const strength = 0.25 + 0.75 * Math.exp(-0.5 * (columnDistance / 0.55) ** 2);
  return height * strength;
}
