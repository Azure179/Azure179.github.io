/** Adapted from RhineLabUI src/motion.ts, commit 12cc5e4013acb9408f753ff71de6b8492299b7c8.
 * Copyright (c) 2026 LBEILC. MIT: public/licenses/RhineLabUI-MIT.txt.
 * Original idleWave and signed baselineSelectionWave equations; bounded lifecycle below.
 */
const smooth = (t: number) => {
  t = Math.max(0, Math.min(1, t));
  return t * t * t * (10 + t * (-15 + 6 * t));
};
export function baselineSelectionWave(distance: number, age: number) {
  if (age < 0 || age > 3.2) return 0;
  return (
    0.8 *
    smooth(age / 0.2) *
    Math.exp(-age * 1.15) *
    Math.cos((distance - age * 8) * 0.58) *
    Math.exp(-0.5 * ((distance - age * 8) / 3.4) ** 2)
  );
}
export function idleWave(row: number, lane: number, time: number) {
  return (
    0.075 * Math.sin((time * Math.PI * 2) / 8 + row * 0.3 - lane * 0.45) +
    0.027 * Math.sin((time * Math.PI * 2) / 13 - row * 0.17 + lane * 0.3)
  );
}
export function createArchiveWaves() {
  let time = 0,
    lastInteraction = 0,
    idleGain = 0,
    pulseGain = 1;
  let pulses: { row: number; lane: number; time: number }[] = [];
  return {
    select(row: number, lane: number) {
      lastInteraction = time;
      pulses.push({ row, lane, time });
      pulses = pulses.slice(-6);
    },
    update(dt: number, reduced: boolean, expanded: boolean) {
      time += dt;
      pulses = reduced ? [] : pulses.filter((p) => time - p.time < 3.2);
      const idle = !expanded && !reduced && time - lastInteraction > 2.5;
      idleGain = reduced
        ? 0
        : idleGain +
          ((idle ? 1 : 0) - idleGain) * (1 - Math.exp(-dt * (idle ? 0.8 : 4)));
      pulseGain = reduced
        ? 0
        : pulseGain +
          ((expanded ? 0 : 1) - pulseGain) * (1 - Math.exp(-dt * 8));
      if (idleGain < 0.0001) idleGain = 0;
      // Visible matrix keeps a quiet breathing loop; the reader can settle.
      return !reduced && (!expanded || idleGain > 0 || pulses.length > 0);
    },
    height(row: number, lane: number) {
      const ripple = pulses.reduce(
        (sum, p) =>
          sum +
          baselineSelectionWave(
            Math.hypot(row - p.row, (lane - p.lane) * 2.2),
            time - p.time,
          ),
        0,
      );
      return (
        idleWave(row, lane, time) * idleGain +
        Math.max(-0.6, Math.min(0.6, ripple)) * pulseGain
      );
    },
  };
}
