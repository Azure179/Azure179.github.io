// Inlined in the home page head: no dependency download before the first paint.
(() => {
  const html = document.documentElement;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let preference;
  const explicit3D = new URLSearchParams(location.search).get("view") === "3d";
  try {
    preference = sessionStorage.getItem("bioarchive-display");
  } catch {
    // Storage is optional, including in private browsing.
  }
  if (
    reduced.matches ||
    matchMedia("(max-width: 767px), (pointer: coarse)").matches ||
    navigator.connection?.saveData ||
    (preference === "light" && !explicit3D)
  )
    return;

  const started = performance.now();
  const events = new AbortController();
  const options = { signal: events.signal };
  let timer, watchdog, cleanup;
  let ending = false;
  html.dataset.archiveIntro = "loading";

  function finish() {
    clearTimeout(timer);
    clearTimeout(watchdog);
    clearTimeout(cleanup);
    events.abort();
    delete html.dataset.archiveIntro;
    document.querySelector("[data-archive-intro]")?.remove();
  }
  function reveal(immediate = false) {
    if (ending) return;
    ending = true;
    clearTimeout(timer);
    clearTimeout(watchdog);
    if (immediate || reduced.matches) return finish();
    html.dataset.archiveIntro = "revealing";
    cleanup = setTimeout(finish, 600);
  }
  function fallback() {
    // Persist only on this document so a late module cannot surprise the reader.
    html.dataset.archiveIntroFallback = "true";
    document.dispatchEvent(new Event("archive:intro-fallback"));
    reveal();
  }
  document.addEventListener(
    "archive:ready",
    (event) => {
      clearTimeout(timer);
      if (event.detail !== "3d") return reveal();
      timer = setTimeout(
        reveal,
        Math.max(0, 2400 - (performance.now() - started)),
      );
    },
    options,
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && !ending) {
        event.preventDefault();
        fallback();
      }
    },
    options,
  );
  document.addEventListener(
    "click",
    (event) => {
      if (event.target.closest?.("[data-intro-simple]")) fallback();
    },
    options,
  );
  reduced.addEventListener("change", () => reveal(true), options);
  window.addEventListener("pagehide", finish, options);
  // Also releases the HTML when the bootstrap itself fails to download.
  watchdog = setTimeout(fallback, 8500);
})();
