import { createWheelNavigation } from "./wheel-navigation";
import { placeOverviewLabel, overviewLeader } from "./overview-callouts";
import { autoEnable } from "./state";
import {
  activeRow,
  projectColumns,
  projectColumn,
  navigate,
  parseNavigation,
  navigationHash,
  type NavigationAction,
  type Portfolio,
} from "../lib/archive-model";
import { createReader } from "./reader";
import type { ArchiveScene, SceneItem, SceneNavigation } from "./types";

export function mountArchive(root: HTMLElement) {
  const get = <T extends HTMLElement>(selector: string) =>
    root.querySelector<T>(selector)!;
  const portfolios: Portfolio[] = JSON.parse(
    get("[data-manifest]").textContent!,
  );
  const chinese = root.dataset.locale === "zh";
  const words = (en: string, zh: string) => (chinese ? zh : en);
  const host = get("[data-canvas]"),
    status = get("[data-status]"),
    stage = get("[data-stage]");
  const enable = get<HTMLButtonElement>("[data-enable]"),
    light = get<HTMLButtonElement>("[data-light]");
  const dialog = get<HTMLElement>("[data-viewer]");
  const contact = document.querySelector<HTMLDetailsElement>(
    "[data-contact-panel]",
  );
  const reader = createReader(dialog, chinese, () =>
    get("[data-back]").focus({ preventScroll: true }),
  );
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const compact = matchMedia("(max-width: 767px), (pointer: coarse)");
  const events = new AbortController(),
    signal = events.signal;
  let state = parseNavigation(location.hash, portfolios);
  // Explicit return links work even on compact/reduced-motion devices and when
  // optional session storage is unavailable. Reduced motion still controls animation.
  const displayQuery = new URLSearchParams(location.search);
  const explicit3D = displayQuery.get("view") === "3d";
  const requestedCollection = portfolios.findIndex(
    (p) => p.id === displayQuery.get("collection"),
  );
  if (explicit3D && state.level === "HOME" && requestedCollection >= 0)
    state = navigate(
      state,
      { type: "folder", index: requestedCollection },
      portfolios,
    );
  let scene: ArchiveScene | null = null;
  let layoutKey = "",
    request = 0,
    inView = false,
    pageActive = true,
    wants3D = false,
    started = false,
    disposed = false;
  let loadTimer: ReturnType<typeof setTimeout> | undefined;
  let transition: ReturnType<typeof setTimeout> | undefined;
  let busy = false;
  let sceneNavigation: SceneNavigation | undefined;
  let introReady = false;
  let resume3DOnReturn = false;
  function ready(mode: "3d" | "light") {
    if (introReady && mode === "3d") return;
    introReady = true;
    document.dispatchEvent(new CustomEvent("archive:ready", { detail: mode }));
  }
  const preferenceKey = "bioarchive-display";
  function read() {
    try {
      return sessionStorage.getItem(preferenceKey);
    } catch {
      return null;
    }
  }
  function write(value: string) {
    try {
      sessionStorage.setItem(preferenceKey, value);
    } catch {
      /* Optional preference. */
    }
  }
  function openSimple(replace = false) {
    resume3DOnReturn = !replace && scene !== null;
    write("light");
    cancelTransition();
    deactivate();
    const href = portfolios[state.folder]!.href;
    if (replace) location.replace(href);
    else location.assign(href);
  }
  const folder = () => portfolios[state.folder]!;
  const project = () => folder().projects[state.project]!;
  const row = () => activeRow(state, portfolios);
  const section = () => project().sections[row()]!;
  const home = () => state.level === "HOME";
  const columns = projectColumns(portfolios);
  function items(): SceneItem[] {
    return columns.flatMap(({ entry: p, folder }, column) =>
      p.sections.map((s, row) => ({
        label: p.index + " / " + String(row + 1).padStart(2, "0"),
        title: p.title,
        section: s.title,
        column,
        row,
        portfolio: folder,
      })),
    );
  }
  function selectedIndex() {
    return (
      columns
        .slice(0, projectColumn(state, portfolios))
        .reduce((sum, p) => sum + p.entry.sections.length, 0) + row()
    );
  }
  function anchors() {
    // Home composition is canonical; project/section memory only applies on entry.
    return portfolios.map((_, folder) => {
      const column = columns.findIndex(
        (c) => c.folder === folder && c.project === 0,
      );
      return items().findIndex(
        (item) => item.column === column && item.row === 0,
      );
    });
  }
  function syncScene() {
    const key = home() ? "home" : "matrix";
    if (key !== layoutKey && scene) {
      try {
        scene.configure(items(), home() ? "overview" : "matrix");
      } catch {
        wants3D = false;
        deactivate(root.dataset.failure);
        return;
      }
      layoutKey = key;
    }
    scene?.anchors(anchors());
    scene?.select(
      home() ? anchors()[state.folder]! : selectedIndex(),
      state.level === "DOCUMENT_VIEWER",
      sceneNavigation,
    );
    sceneNavigation = undefined;
  }
  function button(label: string, selected: boolean, action: () => void) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.setAttribute("aria-pressed", String(selected));
    b.addEventListener("click", action);
    return b;
  }
  function render() {
    get("[data-hover]").hidden = true;
    root.dataset.level = state.contact ? "CONTACT_PANEL" : state.level;
    root.dataset.view = state.level;
    document.body.classList.toggle("archive-immersive", !home());
    for (const sibling of root.parentElement?.children ?? []) {
      if (sibling !== root && sibling instanceof HTMLElement)
        sibling.inert = !home();
    }
    const footer = document.querySelector<HTMLElement>(".site-footer");
    if (footer) footer.inert = !home();
    root.dataset.folder = folder().id;
    root.dataset.project = project().id;
    root.dataset.section = section().id;
    root.dataset.selected = String(selectedIndex());
    root
      .querySelectorAll<HTMLButtonElement>("[data-overview-select]")
      .forEach((button, i) => {
        const selected = state.overviewSelected && state.folder === i;
        button.setAttribute(
          "aria-pressed",
          String(state.overviewSelected && state.folder === i),
        );
        button.closest<HTMLElement>("[data-overview-label]")!.dataset.selected =
          String(state.overviewSelected && state.folder === i);
        button.setAttribute("aria-expanded", String(selected));
        root
          .querySelectorAll<SVGElement>(
            `[data-overview-path="${i}"], [data-overview-dot="${i}"]`,
          )
          .forEach((element) => {
            element.dataset.selected = String(selected);
          });
        button
          .closest<HTMLElement>("[data-overview-label]")!
          .querySelector<HTMLElement>("[data-overview-details]")!.hidden =
          !selected;
      });
    const languageLink =
      document.querySelector<HTMLAnchorElement>(".language-link");
    if (languageLink) {
      const url = new URL(languageLink.href);
      if (explicit3D) {
        url.searchParams.set("view", "3d");
        url.searchParams.set("collection", folder().id);
      }
      url.hash = navigationHash(state, portfolios);
      languageLink.href = url.href;
    }
    get("[data-breadcrumb]").textContent = home()
      ? "BA / 01—02"
      : `BA / ${folder().label} / ${project().index}`;
    get("[data-index]").textContent = home()
      ? `0${state.folder + 1} / PORTFOLIO`
      : folder().title;
    get("[data-title]").textContent = home()
      ? folder().title
      : `${project().index.replace(/(\d+)/, (n) => n.padStart(2, "0"))} ${project().title}`;
    get("[data-description]").textContent = home()
      ? folder().description
      : `${String(row() + 1).padStart(2, "0")}/${String(project().sections.length).padStart(2, "0")} ${section().title}`;
    get("[data-project-summary]").textContent = home() ? "" : project().summary;
    get("[data-open]").textContent = home()
      ? words("OPEN FOLDER →", "打开文件夹 →")
      : words("OPEN DOCUMENT →", "打开档案 →");
    get("[data-back]").hidden = home();
    get("[data-back]").textContent =
      state.level === "DOCUMENT_VIEWER"
        ? words("← Back to projects", "← 返回项目阵列")
        : words("← Back to overview", "← 返回总览");
    get("[data-matrix-controls]").hidden = home();
    const column = projectColumn(state, portfolios);
    const projectProgress = words(
      `Project ${column + 1} / ${columns.length}`,
      `项目 ${column + 1} / ${columns.length}`,
    );
    const sectionProgress = words(
      `Section ${row() + 1} / ${project().sections.length}`,
      `部分 ${row() + 1} / ${project().sections.length}`,
    );
    get("[data-project-progress]").textContent = projectProgress;
    get("[data-section-progress]").textContent = sectionProgress;
    get("[data-reader-progress]").textContent =
      projectProgress + " · " + sectionProgress;
    get("[data-collection-counts]").textContent = portfolios
      .map((p) => `${p.title} ${p.projects.length}`)
      .join(" · ");
    root
      .querySelectorAll<HTMLElement>("[data-column], [data-row]")
      .forEach((el) => {
        const d = Number(el.dataset.column ?? el.dataset.row);
        const target = el.dataset.column
          ? columns[(column + d + columns.length) % columns.length]!.entry
          : project().sections[
              (row() + d + project().sections.length) %
                project().sections.length
            ]!;
        el.querySelector("[data-target]")!.textContent = target.title;
      });
    const active = document.activeElement as HTMLElement | null;
    const focusKey = root.contains(active)
      ? active?.dataset.focusKey
      : undefined;
    const columnButtons = home()
      ? portfolios.map((p, i) =>
          button(`0${i + 1} / ${p.title}`, state.folder === i, () =>
            dispatch({ type: "folder", index: i }),
          ),
        )
      : columns.map(({ entry: p }, i) =>
          button(
            `${p.index} / ${p.title}`,
            projectColumn(state, portfolios) === i,
            () =>
              dispatch({
                type: "column",
                direction: i - projectColumn(state, portfolios),
              }),
          ),
        );
    columnButtons.forEach((b, i) => {
      b.dataset.focusKey = "column-" + i;
      b.dataset.select = String(i);
    });
    get("[data-selectors]").replaceChildren(...columnButtons);
    get(home() ? "[data-home-selectors]" : "[data-project-list]").append(
      get("[data-selectors]"),
    );
    const rows = home()
      ? []
      : project().sections.map((s, i) => {
          const b = button(`0${i + 1} / ${s.title}`, row() === i, () =>
            dispatch({ type: "select", project: state.project, section: i }),
          );
          b.title = s.title;
          b.setAttribute("aria-label", `0${i + 1} / ${s.title}`);
          b.textContent = String(i + 1).padStart(2, "0");
          b.dataset.focusKey = "row-" + i;
          return b;
        });
    get("[data-section-controls]").replaceChildren(...rows);
    if (focusKey)
      root
        .querySelector<HTMLElement>(`[data-focus-key="${focusKey}"]`)
        ?.focus({ preventScroll: true });
    if (contact && contact.open !== state.contact) contact.open = state.contact;
    if (state.level === "DOCUMENT_VIEWER" && !state.contact)
      void reader.open(project(), section());
    else reader.close();
    syncScene();
    pause();
    status.textContent = home()
      ? folder().title
      : project().title + " / " + section().title;
  }
  function cancelTransition() {
    clearTimeout(transition);
    transition = undefined;
    busy = false;
    root.dataset.busy = "false";
    delete root.dataset.transition;
  }
  function commit(action: NavigationAction) {
    sceneNavigation =
      action.type === "column" || action.type === "row"
        ? { axis: action.type, direction: action.direction }
        : undefined;
    state = navigate(state, action, portfolios);
    const hash = navigationHash(state, portfolios);
    if (location.hash !== hash)
      history[
        ["folder", "column", "row", "select"].includes(action.type)
          ? "replaceState"
          : "pushState"
      ](null, "", hash);
    render();
  }
  function dispatch(action: NavigationAction) {
    if (busy && action.type !== "back" && action.type !== "contact") return;
    const returning =
      action.type === "back" &&
      state.level === "PORTFOLIO_MATRIX" &&
      !state.contact;
    if (action.type === "back" || action.type === "contact") cancelTransition();
    commit(action);
    if (returning && scene && !reduced.matches) {
      busy = true;
      root.dataset.busy = "true";
      root.dataset.transition = "overview-return";
    }
    if (action.type === "folder") {
      scene?.pulse(anchors()[state.folder]!);
    }
    if (action.type === "back") stage.focus({ preventScroll: true });
  }
  function open() {
    if (busy || state.contact || state.level === "DOCUMENT_VIEWER") return;
    const action: NavigationAction = { type: home() ? "enter" : "open" };
    if (!scene || reduced.matches) {
      dispatch(action);
      if (action.type === "enter") stage.focus({ preventScroll: true });
      return;
    }
    busy = true;
    root.dataset.busy = "true";
    const entering = home();
    root.dataset.transition = entering ? "overview-lift" : "extract";
    get("[data-back]").hidden = false;
    scene.select(entering ? anchors()[state.folder]! : selectedIndex(), true);
    // Travel begins after the actual A1/T1 representative has visibly lifted.
    if (entering) return;
    transition = setTimeout(() => {
      cancelTransition();
      commit(action);
    }, 900);
  }
  function choosePortfolio(index: number, confirm = false) {
    if (busy || !home() || state.contact) return;
    if (confirm || (state.overviewSelected && state.folder === index)) {
      dispatch({ type: "folder", index });
      open();
    } else {
      dispatch({ type: "folder", index });
    }
  }
  function selectScene(index: number) {
    if (busy || state.contact || state.level === "DOCUMENT_VIEWER") return;
    if (home()) choosePortfolio(items()[index]!.portfolio!);
    else {
      const item = items()[index];
      const col = item && columns[item.column];
      if (item && col)
        dispatch({
          type: "select",
          folder: col.folder,
          project: col.project,
          section: item.row,
        });
    }
  }
  function cancelPending() {
    request++;
    clearTimeout(loadTimer);
    loadTimer = undefined;
  }
  function deactivate(message = root.dataset.fallback!) {
    cancelTransition();
    cancelPending();
    get("[data-hover]").hidden = true;
    scene?.dispose();
    scene = null;
    layoutKey = "";
    host.replaceChildren();
    root.dataset.mode = "light";
    document.body.classList.remove("archive-3d");
    root.dataset.moving = "false";
    root.dataset.paused = "true";
    for (const key of ["frames", "geometries", "textures"])
      root.dataset[key] = "0";
    enable.setAttribute("aria-pressed", "false");
    light.setAttribute("aria-pressed", "true");
    status.textContent = message;
    ready("light");
  }
  function pause() {
    const value = !inView || document.hidden || !pageActive || state.contact;
    scene?.pause(value);
    root.dataset.paused = String(value);
  }
  async function activate() {
    if (disposed || scene || !pageActive || document.hidden || !inView) return;
    cancelPending();
    const ticket = request;
    root.dataset.mode = "loading";
    status.textContent = root.dataset.loading!;
    enable.setAttribute("aria-pressed", "true");
    light.setAttribute("aria-pressed", "false");
    const fail = () => {
      if (ticket !== request || disposed) return;
      wants3D = false;
      deactivate(root.dataset.failure);
      openSimple(true);
    };
    loadTimer = setTimeout(fail, 8000);
    try {
      const { createArchiveScene } = await import("./ArchiveScene");
      if (
        ticket !== request ||
        disposed ||
        !wants3D ||
        !pageActive ||
        document.hidden ||
        !inView
      )
        return;
      scene = createArchiveScene({
        host,
        items: items(),
        kind: home() ? "overview" : "matrix",
        reduced: reduced.matches,
        anchors: anchors(),
        onAnchors: (points) => {
          const width = host.clientWidth,
            height = host.clientHeight;
          const svg = get<HTMLElement>("[data-overview-lines]");
          svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
          portfolios.forEach((_, i) => {
            const label = root.querySelector<HTMLElement>(
              `[data-overview-label="${i}"]`,
            )!;
            const path = svg.querySelector<SVGPathElement>(
              `[data-overview-path="${i}"]`,
            )!;
            const dot = svg.querySelector<SVGCircleElement>(
              `[data-overview-dot="${i}"]`,
            )!;
            // Labels stay readable; the dot follows the canonical A1/T1 archive.
            const w = label.offsetWidth || 220,
              h = Math.max(
                label.offsetHeight,
                width <= 650 ? 170 : chinese ? 195 : 230,
              );
            const point = points[i]!;
            const titleHeight = label.querySelector<HTMLElement>(
              "[data-overview-select]",
            )!.offsetHeight;
            const { x, y } = placeOverviewLabel(
              i,
              width,
              height,
              w,
              h,
              point,
              titleHeight,
            );
            label.style.transform = `translate(${x}px, ${y}px)`;
            label.style.visibility = "visible";
            const end = {
              x: point.x < x + w / 2 ? x : x + w,
              y: y + titleHeight,
            };
            path.setAttribute("d", overviewLeader(point, end));
            dot.setAttribute("cx", String(point.x));
            dot.setAttribute("cy", String(point.y));
            path.style.visibility = dot.style.visibility = point.visible
              ? "visible"
              : "hidden";
          });
        },
        onSelect: selectScene,
        onHover: (index, x = 0, y = 0) => {
          const hint = get("[data-hover]");
          hint.hidden =
            index === null ||
            home() ||
            state.level !== "PORTFOLIO_MATRIX" ||
            busy ||
            state.contact;
          if (hint.hidden || index === null) return;
          const item = items()[index]!;
          const p = columns[item.column]!.entry;
          get("[data-hover-title]").textContent =
            `${p.index.replace(/(\d+)/, (n) => n.padStart(2, "0"))} ${p.title}`;
          get("[data-hover-section]").textContent =
            `${String(item.row + 1).padStart(2, "0")}/${String(p.sections.length).padStart(2, "0")} ${p.sections[item.row]!.title}`;
          hint.style.left = `${Math.max(12, Math.min(x + 20, innerWidth - hint.offsetWidth - 12))}px`;
          hint.style.top = `${Math.max(12, Math.min(y + 24, innerHeight - hint.offsetHeight - 12))}px`;
        },
        onOpen: (index) => {
          if (home()) {
            choosePortfolio(items()[index]!.portfolio!, true);
            return;
          }
          selectScene(index);
          open();
        },
        onFailure: fail,
        onStats: (stats) => {
          if (
            root.dataset.transition === "overview-lift" &&
            home() &&
            stats.lift >= 0.66
          ) {
            root.dataset.transition = "overview-travel";
            commit({ type: "enter" });
            stage.focus({ preventScroll: true });
          }
          if (
            root.dataset.transition === "overview-travel" &&
            stats.overview === 0 &&
            !stats.cameraMoving
          )
            cancelTransition();
          if (
            root.dataset.transition === "overview-return" &&
            stats.overview === 1 &&
            !stats.cameraMoving
          )
            cancelTransition();
          if (stats.frames > 0) ready("3d");
          Object.entries(stats).forEach(([key, value]) => {
            root.dataset[key] = String(value);
          });
        },
      });
      layoutKey = home() ? "home" : "matrix";
      syncScene();
      pause();
      root.dataset.mode = "3d";
      document.body.classList.add("archive-3d");
      status.textContent = root.dataset.ready!;
    } catch {
      fail();
    } finally {
      if (ticket === request) {
        clearTimeout(loadTimer);
        loadTimer = undefined;
      }
    }
  }
  root.querySelectorAll<HTMLElement>("[data-enhanced]").forEach((el) => {
    el.hidden = false;
  });
  get("[data-open]").addEventListener("click", open, { signal });
  const readerNavigationToggle = get("[data-reader-navigation-toggle]");
  readerNavigationToggle.addEventListener(
    "click",
    () => {
      const expanded =
        readerNavigationToggle.getAttribute("aria-expanded") !== "true";
      readerNavigationToggle.setAttribute("aria-expanded", String(expanded));
      root.dataset.readerNavigation = expanded ? "expanded" : "collapsed";
    },
    { signal },
  );
  root
    .querySelectorAll<HTMLElement>(
      "[data-overview-select], [data-overview-enter]",
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () =>
          choosePortfolio(
            Number(
              button.dataset.overviewSelect ?? button.dataset.overviewEnter,
            ),
            button.hasAttribute("data-overview-enter"),
          ),
        { signal },
      );
      button.addEventListener(
        "dblclick",
        () =>
          choosePortfolio(
            Number(
              button.dataset.overviewSelect ?? button.dataset.overviewEnter,
            ),
            true,
          ),
        { signal },
      );
    });
  get("[data-back]").addEventListener(
    "click",
    () => dispatch({ type: "back" }),
    { signal },
  );
  root
    .querySelectorAll<HTMLElement>("[data-column], [data-row]")
    .forEach((el) =>
      el.addEventListener(
        "click",
        () => {
          dispatch(
            el.dataset.column
              ? { type: "column", direction: Number(el.dataset.column) }
              : { type: "row", direction: Number(el.dataset.row) },
          );
        },
        { signal },
      ),
    );
  root.addEventListener(
    "keydown",
    (event) => {
      if (state.contact) return;
      const target = event.target as HTMLElement;
      if (event.key === "Escape") {
        event.preventDefault();
        dispatch({ type: "back" });
        return;
      }
      if (target.closest("[data-viewer]")) return;
      if (target.closest("a, input, textarea, select")) return;
      const overviewButton = target.closest<HTMLElement>(
        "[data-overview-select], [data-overview-enter]",
      );
      if (event.key === "Enter" && overviewButton) {
        event.preventDefault();
        if (!event.repeat)
          choosePortfolio(
            Number(
              overviewButton.dataset.overviewSelect ??
                overviewButton.dataset.overviewEnter,
            ),
            true,
          );
        return;
      }
      let action: NavigationAction | undefined;
      if (event.key === "Escape") action = { type: "back" };
      else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const direction = event.key === "ArrowLeft" ? -1 : 1;
        action = home()
          ? { type: "folder", index: state.folder + direction }
          : { type: "column", direction };
      } else if (
        !home() &&
        (event.key === "ArrowUp" || event.key === "ArrowDown")
      )
        action = { type: "row", direction: event.key === "ArrowUp" ? -1 : 1 };
      else if (
        event.key === "Enter" &&
        (target === stage ||
          target.closest("[data-selectors], [data-section-controls]"))
      ) {
        event.preventDefault();
        if (!event.repeat) open();
        return;
      }
      if (action) {
        event.preventDefault();
        dispatch(action);
      }
    },
    { signal },
  );
  const wheelStep = createWheelNavigation();
  stage.addEventListener(
    "wheel",
    (event) => {
      if (
        root.dataset.mode !== "3d" ||
        state.level !== "PORTFOLIO_MATRIX" ||
        state.contact ||
        event.ctrlKey ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      )
        return;
      event.preventDefault();
      if (busy) return;
      const direction = wheelStep(
        event.deltaY,
        event.deltaMode,
        performance.now(),
        stage.clientHeight,
      );
      if (direction) dispatch({ type: "row", direction });
    },
    { signal, passive: false },
  );
  contact?.addEventListener(
    "toggle",
    () => {
      if (contact.open !== state.contact)
        dispatch({ type: "contact", open: contact.open });
    },
    { signal },
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && state.contact) {
        event.preventDefault();
        dispatch({ type: "back" });
        contact?.querySelector("summary")?.focus();
      }
    },
    { signal },
  );
  function restore() {
    cancelTransition();
    state = parseNavigation(location.hash, portfolios, state);
    render();
  }
  window.addEventListener("popstate", restore, { signal });
  window.addEventListener("hashchange", restore, { signal });
  enable.addEventListener(
    "click",
    () => {
      wants3D = true;
      write("3d");
      void activate();
    },
    { signal },
  );
  light.addEventListener(
    "click",
    () => {
      wants3D = false;
      openSimple();
    },
    { signal },
  );
  document.addEventListener(
    "archive:intro-fallback",
    () => {
      wants3D = false;
      openSimple(true);
    },
    { signal },
  );
  reduced.addEventListener("change", () => scene?.reduce(reduced.matches), {
    signal,
  });
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden && !scene) {
        cancelPending();
        root.dataset.mode = "light";
      } else if (wants3D && !scene) void activate();
      pause();
    },
    { signal },
  );
  window.addEventListener(
    "pagehide",
    (event) => {
      pageActive = false;
      cancelTransition();
      reader.close();
      deactivate();
      if (!event.persisted) {
        disposed = true;
        observer.disconnect();
        reader.dispose();
        events.abort();
      }
    },
    { signal },
  );
  window.addEventListener(
    "pageshow",
    (event) => {
      if (event.persisted) {
        pageActive = true;
        if (resume3DOnReturn) {
          wants3D = true;
          write("3d");
        }
        render();
        if (wants3D) void activate();
      }
    },
    { signal },
  );
  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      if (!started) {
        started = true;
        const connection = (
          navigator as Navigator & { connection?: { saveData?: boolean } }
        ).connection;
        wants3D =
          !document.documentElement.dataset.archiveIntroFallback &&
          (explicit3D ||
            autoEnable({
              compact: compact.matches,
              reduced: reduced.matches,
              saveData: connection?.saveData ?? false,
              preference: read(),
            }));
        if (wants3D && explicit3D) write("3d");
        if (!wants3D) {
          ready("light");
          openSimple(true);
          return;
        }
      }
      if (!inView && !scene) {
        cancelPending();
        root.dataset.mode = "light";
      }
      if (inView && wants3D && !scene) void activate();
      pause();
    },
    { threshold: 0.01 },
  );
  render();
  observer.observe(root);
}
