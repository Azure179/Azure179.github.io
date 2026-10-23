/** Normalize wheel mice / trackpads; one navigation step per short gesture. */
export function createWheelNavigation() {
  let sum = 0,
    last = -Infinity,
    accepted = -Infinity;
  return (delta: number, mode: number, time: number, pageHeight: number) => {
    const pixels = delta * (mode === 1 ? 16 : mode === 2 ? pageHeight : 1);
    if (time - last > 180 || Math.sign(pixels) !== Math.sign(sum)) sum = 0;
    last = time;
    if (time - accepted < 420) {
      sum = 0;
      return 0;
    }
    sum += pixels;
    if (Math.abs(sum) < 48) return 0;
    const direction = Math.sign(sum);
    sum = 0;
    accepted = time;
    return direction;
  };
}
