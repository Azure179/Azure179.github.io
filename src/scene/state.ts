export function adjacentIndex(
  current: number | null,
  direction: number,
  count: number,
) {
  return ((current ?? (direction > 0 ? -1 : 0)) + direction + count) % count;
}

export function damp(
  current: number,
  target: number,
  dt: number,
  reduced = false,
  rate = 12,
) {
  if (reduced || Math.abs(target - current) < 0.001) return target;
  const next =
    target +
    (current - target) * Math.exp(-rate * Math.max(0, Math.min(dt, 0.1)));
  return Math.abs(next - target) < 0.001 ? target : next;
}

export function renderRatio(
  width: number,
  height: number,
  dpr: number,
  compact: boolean,
) {
  const maxPixels = compact ? 800_000 : 2_100_000;
  return Math.min(
    compact ? 1 : 1.5,
    Math.max(1, dpr),
    Math.sqrt(maxPixels / Math.max(1, width * height)),
  );
}

export function autoEnable(options: {
  compact: boolean;
  reduced: boolean;
  saveData: boolean;
  preference: string | null;
}) {
  // An explicit light preference wins; capability changes never override it.
  return (
    options.preference !== "light" &&
    !options.compact &&
    !options.reduced &&
    !options.saveData
  );
}

/** One owned RAF. Input can invalidate a still frame; pausing cancels pending work. */
export function createFrameLoop(
  step: (time: number) => boolean,
  request: (callback: FrameRequestCallback) => number,
  cancel: (id: number) => void,
) {
  let frame: number | null = null;
  let paused = false;
  let disposed = false;
  const wake = () => {
    if (disposed || paused || frame !== null) return;
    frame = request((time) => {
      frame = null;
      if (!disposed && !paused && step(time)) wake();
    });
  };
  const stop = () => {
    if (frame !== null) cancel(frame);
    frame = null;
  };
  return {
    wake,
    pause(value: boolean) {
      paused = value;
      if (value) stop();
      else wake();
    },
    dispose() {
      disposed = true;
      stop();
    },
  };
}
