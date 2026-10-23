/** Analytic critically damped motion: continuous velocity on retarget, no overshoot. */
export const spring = (value: number) => ({ value, velocity: 0 });
export function advance(
  s: ReturnType<typeof spring>,
  target: number,
  dt: number,
  reduced = false,
  rate = 9,
) {
  if (reduced) {
    s.value = target;
    s.velocity = 0;
    return false;
  }
  const offset = s.value - target;
  const c = s.velocity + rate * offset;
  const decay = Math.exp(-rate * dt);
  s.value = target + (offset + c * dt) * decay;
  s.velocity = (s.velocity - rate * c * dt) * decay;
  if (Math.abs(s.value - target) < 0.0005 && Math.abs(s.velocity) < 0.002) {
    s.value = target;
    s.velocity = 0;
    return false;
  }
  return true;
}
