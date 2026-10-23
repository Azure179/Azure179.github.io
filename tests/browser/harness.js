// Injected only by scripts/preview-qa.mjs, before the real production bundle.
const mode = new URLSearchParams(location.search).get("qa");
const originalContext = HTMLCanvasElement.prototype.getContext;
const contexts = new Set();
HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
  if (mode === "nogl" && /webgl/.test(kind)) return null;
  const context = originalContext.call(this, kind, ...args);
  if (context && /webgl/.test(kind)) {
    contexts.add(context);
    this.addEventListener("webglcontextlost", () => contexts.delete(context), {
      once: true,
    });
  }
  return context;
};
if (mode === "reduced") {
  const originalMatch = window.matchMedia.bind(window);
  window.matchMedia = (query) => {
    const result = originalMatch(query);
    if (query.includes("prefers-reduced-motion"))
      Object.defineProperty(result, "matches", { value: true });
    return result;
  };
}
if (mode === "storage") {
  Object.defineProperty(window, "sessionStorage", {
    get() {
      throw new DOMException("QA storage unavailable", "SecurityError");
    },
  });
}
try {
  sessionStorage.removeItem("bioarchive-display");
  sessionStorage.removeItem("bioarchive-selection");
} catch {
  /* Storage-blocked case is intentional. */
}
const errors = [];
window.addEventListener("error", (event) => errors.push(event.message));
window.addEventListener("unhandledrejection", (event) =>
  errors.push(String(event.reason)),
);
const delay = (ms) => new Promise((done) => setTimeout(done, ms));
async function until(predicate, timeout = 8000) {
  for (let i = 0; i < timeout / 50; i++) {
    if (predicate()) return;
    await delay(50);
  }
  throw new Error("Timed out");
}
window.addEventListener("DOMContentLoaded", () => {
  const box = document.createElement("aside");
  box.style.cssText =
    "position:fixed;bottom:8px;right:8px;z-index:10000;background:#fff;border:2px solid #b88036;padding:12px;max-width:400px;font:12px monospace;max-height:40vh;overflow:auto";
  box.innerHTML =
    '<strong>LOCAL QA · not shipped</strong><br><button id="qa-run">Run lifecycle checks</button> <button id="qa-navigation">Check navigation layout</button> <button id="qa-audit">Read diagnostics</button><pre id="qa-output" style="white-space:pre-wrap"></pre>';
  document.body.append(box);
  const output = box.querySelector("#qa-output");
  const root = document.querySelector("[data-archive-terminal]");
  const snapshot = () => ({
    mode: root?.dataset.mode,
    level: root?.dataset.level,
    folder: root?.dataset.folder,
    project: root?.dataset.project,
    section: root?.dataset.section,
    canvases: document.querySelectorAll("[data-canvas] canvas").length,
    activeContexts: contexts.size,
    geometries: root?.dataset.geometries,
    textures: root?.dataset.textures,
    frames: root?.dataset.frames,
    moving: root?.dataset.moving,
    paused: root?.dataset.paused,
    pixels: root?.dataset.pixels,
    width: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    errors,
    engineRequests: performance
      .getEntriesByType("resource")
      .filter((entry) => entry.name.includes("ArchiveScene.")).length,
  });
  box.querySelector("#qa-audit").addEventListener("click", () => {
    output.textContent = JSON.stringify(snapshot(), null, 2);
  });
  box
    .querySelector("#qa-navigation")
    .addEventListener("click", async (event) => {
      event.target.disabled = true;
      output.textContent = "";
      const check = (condition, message) => {
        if (!condition) throw new Error(message);
        output.textContent += "PASS " + message + "\n";
      };
      const click = (selector) => root.querySelector(selector).click();
      const visible = (el) => !!el.getClientRects().length;
      try {
        click("[data-enable]");
        await until(() => root.dataset.mode === "3d", 60000);
        check(
          !root.querySelector(
            "[data-skip], [data-static-link], [data-viewer-link], [data-viewer-close]",
          ),
          "duplicate exit and close controls removed",
        );
        check(
          visible(root.querySelector("[data-light]")) &&
            visible(root.querySelector("[data-enable]")),
          "both segments of the display switch are visible in 3D",
        );
        click('[data-select="0"]');
        click("[data-open]");
        await until(() => root.dataset.level === "PORTFOLIO_MATRIX");
        check(
          root
            .querySelector("[data-project-progress]")
            .textContent.includes("1 / 6") &&
            root
              .querySelector("[data-section-progress]")
              .textContent.includes("1 / 4"),
          "project and section totals are explicit",
        );
        check(
          !root.querySelector(".archive-inspector [data-matrix-controls]") &&
            getComputedStyle(root.querySelector(".archive-inspector"))
              .backgroundImage === "none",
          "matrix summary is transparent and navigation is outside it",
        );
        const stage = root.querySelector("[data-stage]");
        const beforeWheelProject = root.dataset.project;
        const wheel = (deltaY, ctrlKey = false) =>
          stage.dispatchEvent(
            new WheelEvent("wheel", {
              deltaY,
              ctrlKey,
              bubbles: true,
              cancelable: true,
            }),
          );
        wheel(120);
        check(
          root.dataset.section === "workflow" &&
            root.dataset.project === beforeWheelProject,
          "wheel changes only the section",
        );
        wheel(120);
        check(
          root.dataset.section === "workflow",
          "wheel burst does not skip multiple sections",
        );
        await delay(450);
        wheel(-120);
        check(
          root.dataset.section === "overview",
          "reverse wheel returns to previous section",
        );
        wheel(120, true);
        check(
          root.dataset.section === "overview",
          "pinch zoom is not intercepted",
        );
        const canvas = root.querySelector("canvas");
        const rect = canvas.getBoundingClientRect();
        // Entry camera still moves; re-send the pointer as a user would while
        // exploring the array rather than requiring a hit in its first frame.
        for (
          let i = 0;
          i < 60 && root.querySelector("[data-hover]").hidden;
          i++
        ) {
          canvas.dispatchEvent(
            new PointerEvent("pointermove", {
              pointerType: "mouse",
              clientX: rect.left + rect.width * (0.25 + (i % 3) * 0.08),
              clientY: rect.top + rect.height * 0.6,
              bubbles: true,
            }),
          );
          await delay(250);
        }
        check(
          !root.querySelector("[data-hover]").hidden,
          "moving pointer hits the visible array",
        );
        check(
          /^[AT]0[1-4] /.test(
            root.querySelector("[data-hover-title]").textContent,
          ) &&
            /^0[1-4]\/04 /.test(
              root.querySelector("[data-hover-section]").textContent,
            ),
          "raycast hover identifies project and section",
        );
        canvas.dispatchEvent(
          new PointerEvent("pointerleave", { pointerType: "mouse" }),
        );
        check(
          root.querySelector("[data-hover]").hidden,
          "hover caption clears when leaving the scene",
        );
        await delay(3000);
        const breathingFrames = Number(root.dataset.frames);
        await delay(450);
        check(
          Number(root.dataset.frames) > breathingFrames,
          "visible matrix keeps its ambient wave active",
        );
        Object.defineProperty(document, "hidden", {
          configurable: true,
          value: true,
        });
        document.dispatchEvent(new Event("visibilitychange"));
        const hiddenFrames = root.dataset.frames;
        await delay(450);
        check(
          root.dataset.frames === hiddenFrames,
          "ambient wave stops on hidden page",
        );
        delete document.hidden;
        document.dispatchEvent(new Event("visibilitychange"));
        const nextProject = root.querySelector(
          '.archive-navigator [data-column="1"] [data-target]',
        );
        check(
          nextProject.textContent.includes("T2T"),
          "next project preview names the actual destination",
        );
        const targetTitle = nextProject.textContent;
        click('.archive-navigator [data-column="1"]');
        check(
          root.querySelector("[data-title]").textContent.endsWith(targetTitle),
          "next project opens the named target",
        );
        click('[data-select="3"]');
        check(
          nextProject.textContent === "LLM-RNAseq-Platform",
          "A4 preview identifies the cross-portfolio destination",
        );
        click('.archive-navigator [data-column="1"]');
        check(
          root.dataset.folder === "technical",
          "cross-portfolio navigation is retained",
        );
        const nextSection = root.querySelector(
          '.archive-navigator [data-row="1"] [data-target]',
        ).textContent;
        click('.archive-navigator [data-row="1"]');
        check(
          root
            .querySelector("[data-description]")
            .textContent.endsWith(nextSection),
          "next section preview matches the selected section",
        );
        click("[data-open]");
        await until(() => root.dataset.level === "DOCUMENT_VIEWER");
        await until(() => root.querySelector("[data-viewer-content] section"));
        const back = root.querySelector("[data-back]");
        const backRect = back.getBoundingClientRect();
        check(
          backRect.left < innerWidth * 0.1 &&
            backRect.top < 150 &&
            visible(back),
          "one return control stays below the upper-left logo",
        );
        check(
          visible(root.querySelector("[data-light]")),
          "Light mode remains available while reading",
        );
        click("[data-light]");
        check(
          root.dataset.mode === "light" &&
            root.dataset.level === "DOCUMENT_VIEWER" &&
            !root.querySelector("canvas"),
          "Light mode preserves the reading location and releases the renderer",
        );
        click("[data-back]");
        check(
          root.dataset.level === "PORTFOLIO_MATRIX",
          "shared return goes from reader to matrix",
        );
        click("[data-back]");
        check(
          root.dataset.level === "HOME",
          "shared return goes from matrix to home",
        );
        check(
          visible(root.querySelector("[data-light]")) &&
            visible(root.querySelector("[data-enable]")),
          "both display segments remain visible in simple mode",
        );
        check(errors.length === 0, "no uncaught application errors");
        output.textContent += "NAVIGATION PASS\n";
      } catch (error) {
        output.textContent +=
          "FAIL " + error.message + "\n" + JSON.stringify(snapshot(), null, 2);
      } finally {
        event.target.disabled = false;
      }
    });
  if (mode === "slow") {
    void (async () => {
      await until(() => root.dataset.mode === "loading");
      root.querySelector("[data-light]").click();
      output.textContent = "Cancelled while loading; awaiting delayed import…";
      await delay(5000);
      output.textContent = JSON.stringify(
        {
          cancelledDuringLoading: true,
          pass:
            root.dataset.mode === "light" &&
            contexts.size === 0 &&
            !root.querySelector("canvas"),
          ...snapshot(),
        },
        null,
        2,
      );
    })();
  }
  box.querySelector("#qa-run").addEventListener("click", async (event) => {
    event.target.disabled = true;
    const log = (message) => {
      output.textContent += message + "\n";
    };
    const check = (condition, message) => {
      if (!condition) throw new Error(message);
      log("PASS " + message);
    };
    const click = (selector) => root.querySelector(selector).click();
    const ready = () =>
      until(
        () =>
          root.dataset.mode === "3d" &&
          Number(root.dataset.frames) > 0 &&
          root.dataset.moving === "false",
        60000, // Cold GPU contexts / background automation can throttle RAF heavily.
      );
    output.textContent = "";
    try {
      root.scrollIntoView({ block: "start", behavior: "instant" });
      await delay(100);
      click("[data-enable]");
      await ready();
      const first = snapshot();
      await delay(600);
      check(first.frames === root.dataset.frames, "steady state stops frames");
      for (let i = 0; i < 6; i++) click(`[data-select="${i % 2}"]`);
      await delay(50);
      await ready();
      check(
        root.dataset.selected === "1",
        "rapid switching keeps latest selection",
      );
      for (let i = 0; i < 5; i++) {
        click("[data-light]");
        await delay(70);
        check(
          contexts.size === 0 && !root.querySelector("canvas"),
          `dispose cycle ${i + 1}`,
        );
        click("[data-enable]");
        await ready();
        check(
          root.dataset.geometries === first.geometries &&
            root.dataset.textures === first.textures &&
            contexts.size === 1,
          `stable resources cycle ${i + 1}`,
        );
      }
      click('[data-select="1"]');
      Object.defineProperty(document, "hidden", {
        configurable: true,
        value: true,
      });
      document.dispatchEvent(new Event("visibilitychange"));
      const frames = root.dataset.frames;
      await delay(400);
      check(
        root.dataset.frames === frames && root.dataset.paused === "true",
        "hidden page stops rendering",
      );
      delete document.hidden;
      document.dispatchEvent(new Event("visibilitychange"));
      await ready();
      check(root.dataset.paused === "false", "visible page resumes");
      const context = [...contexts][0];
      context.getExtension("WEBGL_lose_context").loseContext();
      await until(() => root.dataset.mode === "light");
      check(!root.querySelector("canvas"), "context loss falls back to HTML");
      check(
        document.querySelectorAll("#archive-index nav a").length === 2,
        "both portfolio HTML links survive",
      );
      click("[data-enable]");
      await ready();
      check(contexts.size === 1, "explicit retry rebuilds one context");
      click('[data-select="0"]');
      click("[data-open]");
      await until(() => root.dataset.level === "PORTFOLIO_MATRIX");
      check(
        root.querySelectorAll("[data-select]").length === 6,
        "one continuous matrix contains four academic and two technical columns",
      );
      const key = (value) =>
        root
          .querySelector("[data-stage]")
          .dispatchEvent(
            new KeyboardEvent("keydown", { key: value, bubbles: true }),
          );
      key("ArrowUp");
      check(
        root.dataset.section === "publications",
        "up wraps to related publications",
      );
      key("ArrowRight");
      check(
        root.dataset.project === "fish-t2t-genome" &&
          root.dataset.section === "overview",
        "right changes project, not section",
      );
      key("ArrowDown");
      key("ArrowLeft");
      check(root.dataset.section === "publications", "column memory restored");
      click("[data-open]");
      await until(() => root.dataset.level === "DOCUMENT_VIEWER");
      await until(() => root.querySelector("[data-viewer-content] section"));
      check(
        root
          .querySelector("[data-viewer-content]")
          .textContent.includes("No publication") ||
          root
            .querySelector("[data-viewer-content]")
            .textContent.includes("暂未关联"),
        "real publication empty state read from static detail",
      );
      check(
        !root.querySelector("dialog") &&
          !root.querySelector("[data-viewer]").hidden,
        "reader is an inline content region, not a modal dialog",
      );
      check(
        root
          .querySelector("#viewer-title")
          .textContent.includes("Natural sex reversal"),
        "reader foregrounds the project title",
      );
      await ready();
      const readerFrames = root.dataset.frames;
      await delay(400);
      check(
        root.dataset.frames === readerFrames,
        "extracted reader settles and stops rendering",
      );
      click("[data-back]");
      check(
        root.dataset.level === "PORTFOLIO_MATRIX",
        "reader returns to matrix",
      );
      click('[data-select="3"]');
      key("ArrowDown");
      key("ArrowRight");
      check(
        root.dataset.folder === "technical" &&
          root.dataset.project === "llm-rnaseq-platform",
        "academic A4 crosses directly to technical T1",
      );
      key("ArrowLeft");
      check(
        root.dataset.folder === "academic" &&
          root.dataset.project === "tilapia-eccdna" &&
          root.dataset.section === "workflow",
        "cross-portfolio return restores project row memory",
      );
      key("Escape");
      check(root.dataset.level === "HOME", "matrix returns home");
      click('[data-select="1"]');
      click("[data-open]");
      await until(() => root.dataset.level === "PORTFOLIO_MATRIX");
      check(
        root.querySelectorAll("[data-select]").length === 6 &&
          root.querySelectorAll("[data-section-controls] button").length === 4,
        "technical uses the same six-column matrix and four sections",
      );
      key("ArrowRight");
      key("ArrowDown");
      check(
        root.dataset.project === "bioinformatics-archive" &&
          root.dataset.section === "architecture",
        "technical project and section axes remain independent",
      );
      click("[data-open]");
      await until(() =>
        root.querySelector("[data-viewer-content] #reader-architecture"),
      );
      check(
        root.querySelectorAll("[data-viewer-content] section").length === 2,
        "architecture and workflow reuse real sections",
      );
      click("[data-back]");
      key("Escape");
      await ready();
      check(
        root.dataset.geometries === first.geometries &&
          root.dataset.textures === first.textures,
        "matrix and shadow resources released on return home",
      );
      click("[data-open]");
      await until(() => root.dataset.level === "PORTFOLIO_MATRIX");
      click("[data-open]");
      click("[data-open]");
      key("Escape");
      await delay(1100);
      check(
        root.dataset.level === "HOME" &&
          root.querySelector("[data-viewer]").hidden,
        "escape cancels pending reader and repeated open",
      );
      click('[data-select="0"]');
      await delay(50);
      await ready();
      const canvas = root.querySelector("canvas");
      const rect = canvas.getBoundingClientRect();
      const touch = (type, dx = 0) =>
        canvas.dispatchEvent(
          new PointerEvent(type, {
            pointerId: 91,
            pointerType: "touch",
            isPrimary: true,
            button: 0,
            bubbles: true,
            clientX: rect.left + rect.width * 0.64 + dx,
            clientY: rect.top + rect.height / 2,
          }),
        );
      const beforeTouch = root.dataset.selected;
      touch("pointerdown");
      touch("pointerup", 40);
      check(
        root.dataset.selected === beforeTouch,
        "scroll-sized touch movement does not select",
      );
      touch("pointerdown");
      touch("pointercancel");
      touch("pointerup");
      check(
        root.dataset.selected === beforeTouch,
        "cancelled touch does not select",
      );
      touch("pointerdown");
      touch("pointerup");
      check(
        root.dataset.selected === "1" && root.dataset.level === "HOME",
        "raycast touch selects technical without opening",
      );
      touch("pointerdown");
      touch("pointerup");
      await until(() => root.dataset.level === "PORTFOLIO_MATRIX");
      check(
        root.dataset.folder === "technical",
        "second touch opens selected folder",
      );
      key("Escape");
      check(errors.length === 0, "no uncaught application errors");
      log(JSON.stringify(snapshot(), null, 2));
      log("LIFECYCLE PASS");
    } catch (error) {
      log("FAIL " + error.message);
      log(JSON.stringify(snapshot(), null, 2));
    } finally {
      event.target.disabled = false;
    }
  });
});
