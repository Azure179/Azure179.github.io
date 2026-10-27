import type { ArchiveProject, ArchiveSection } from "../lib/archive-model";
import { createReaderSheet } from "./reader-sheet";

/** Fetch existing public detail sections; never maintain a second copy of content. */
export function createReader(
  dialog: HTMLElement,
  chinese: boolean,
  focusBack: () => void,
) {
  const content = dialog.querySelector<HTMLElement>("[data-viewer-content]")!;
  const status = dialog.querySelector<HTMLElement>("[data-viewer-status]")!;
  const cache = new Map<string, Document>();
  const sheet = createReaderSheet(dialog, chinese);
  let request: AbortController | null = null;
  let key = "";
  function close() {
    key = "";
    request?.abort();
    request = null;
    dialog.hidden = true;
    sheet.reset();
    content.replaceChildren();
  }
  return {
    close,
    async open(project: ArchiveProject, section: ArchiveSection) {
      if (key === section.href && !dialog.hidden) return;
      request?.abort();
      const controller = new AbortController();
      request = controller;
      key = section.href;
      dialog.querySelector("[data-viewer-project]")!.textContent =
        project.index + " / " + section.title;
      dialog.querySelector("#viewer-title")!.textContent = project.title;
      content.replaceChildren();
      status.textContent = chinese ? "正在读取档案…" : "Loading archive…";
      const opening = dialog.hidden;
      if (opening) sheet.reset();
      dialog.hidden = false;
      dialog.scrollTop = 0;
      if (opening) focusBack();
      try {
        const url = new URL(section.href, location.href);
        url.hash = "";
        if (url.origin !== location.origin) throw new Error("External content");
        let page = cache.get(url.href);
        if (!page) {
          const response = await fetch(url, { signal: controller.signal });
          if (!response.ok) throw new Error("Document unavailable");
          page = new DOMParser().parseFromString(
            await response.text(),
            "text/html",
          );
          if (controller.signal.aborted) return;
          cache.set(url.href, page);
          if (cache.size > 6) cache.delete(cache.keys().next().value!);
        }
        const fragment = document.createDocumentFragment();
        const notice = page.querySelector("article > .evidence-notice");
        if (notice) fragment.append(notice.cloneNode(true));
        for (const id of section.contentIds) {
          const source = page.querySelector(`article section[id="${id}"]`);
          if (!source) throw new Error("Missing section");
          const block = source.cloneNode(true) as HTMLElement;
          block
            .querySelectorAll("script,iframe,object,form")
            .forEach((node) => node.remove());
          [block, ...block.querySelectorAll<HTMLElement>("*")].forEach(
            (node) => {
              for (const attr of [...node.attributes])
                if (attr.name.startsWith("on")) node.removeAttribute(attr.name);
              if (node.id) node.id = "reader-" + node.id;
            },
          );
          block
            .querySelectorAll<HTMLAnchorElement>("a[href]")
            .forEach((link) => {
              link.href = new URL(link.getAttribute("href")!, url).href;
              if (
                link.origin !== location.origin ||
                link.querySelector("img")
              ) {
                link.target = "_blank";
                link.rel = "noopener noreferrer";
              }
            });
          block
            .querySelectorAll<HTMLImageElement>("img[src]")
            .forEach((img) => {
              img.src = new URL(img.getAttribute("src")!, url).href;
            });
          fragment.append(block);
        }
        if (!controller.signal.aborted) {
          content.replaceChildren(fragment);
          status.textContent = "";
        }
      } catch {
        if (!controller.signal.aborted) {
          status.textContent = chinese
            ? "档案暂未载入。"
            : "The archive could not load. ";
          const fallback = document.createElement("a");
          fallback.href = section.href;
          fallback.textContent = chinese
            ? "阅读原始页面 ↗"
            : "Read the source page ↗";
          status.append(fallback);
        }
      }
    },
    dispose() {
      close();
      sheet.dispose();
      cache.clear();
    },
  };
}
