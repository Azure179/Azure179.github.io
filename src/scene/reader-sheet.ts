/** Mobile bottom sheet: intercept only the boundary gesture, not body scrolling. */
export function sheetGesture(
  expanded: boolean,
  startedAtTop: boolean,
  dx: number,
  dy: number,
) {
  if (Math.abs(dx) > Math.abs(dy) || Math.abs(dy) < 10) return null;
  if (!expanded && dy < 0) return "expand";
  if (expanded && startedAtTop && dy > 0) return "collapse";
  return null;
}

export function createReaderSheet(dialog: HTMLElement, chinese: boolean) {
  const button = dialog.querySelector<HTMLButtonElement>(
    "[data-sheet-toggle]",
  )!;
  const media = matchMedia("(max-width: 767px)");
  const events = new AbortController();
  const { signal } = events;
  let expanded = false;
  let gesture: {
    x: number;
    y: number;
    atTop: boolean;
    consumed: boolean;
  } | null = null;
  function set(next: boolean) {
    expanded = next;
    dialog.dataset.sheet = next ? "expanded" : "collapsed";
    button.setAttribute("aria-expanded", String(next));
    button.querySelector("[data-sheet-label]")!.textContent = chinese
      ? next
        ? "收起阅读区"
        : "展开阅读区"
      : next
        ? "Show archive"
        : "Expand reading area";
    if (!next) dialog.scrollTop = 0;
  }
  button.addEventListener("click", () => set(!expanded), { signal });
  dialog.addEventListener(
    "touchstart",
    (event) => {
      if (!media.matches || event.touches.length !== 1) {
        gesture = null;
        return;
      }
      const touch = event.touches[0]!;
      gesture = {
        x: touch.clientX,
        y: touch.clientY,
        atTop: dialog.scrollTop <= 1,
        consumed: false,
      };
    },
    { signal, passive: true },
  );
  dialog.addEventListener(
    "touchmove",
    (event) => {
      if (!gesture || !media.matches || event.touches.length !== 1) {
        gesture = null;
        return;
      }
      const touch = event.touches[0]!;
      const dx = touch.clientX - gesture.x,
        dy = touch.clientY - gesture.y;
      if (gesture.consumed) {
        event.preventDefault();
        return;
      }
      const action = sheetGesture(expanded, gesture.atTop, dx, dy);
      if (!action) return;
      event.preventDefault();
      if (Math.abs(dy) >= 32) {
        set(action === "expand");
        gesture.consumed = true;
      }
    },
    { signal, passive: false },
  );
  for (const type of ["touchend", "touchcancel"] as const)
    dialog.addEventListener(
      type,
      () => {
        gesture = null;
      },
      { signal },
    );
  dialog.addEventListener(
    "wheel",
    (event) => {
      if (
        !media.matches ||
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      if (!expanded && event.deltaY > 0) {
        event.preventDefault();
        set(true);
      } else if (expanded && dialog.scrollTop <= 1 && event.deltaY < 0) {
        event.preventDefault();
        set(false);
      }
    },
    { signal, passive: false },
  );
  media.addEventListener(
    "change",
    () => {
      gesture = null;
      set(false);
    },
    { signal },
  );
  set(false);
  return {
    reset() {
      gesture = null;
      set(false);
    },
    dispose() {
      gesture = null;
      events.abort();
    },
  };
}
