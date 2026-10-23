export interface ArchiveSection {
  id: string;
  title: string;
  label: string;
  href: string;
  contentIds: string[];
}
export interface ArchiveProject {
  id: string;
  index: string;
  title: string;
  summary: string;
  href: string;
  sections: ArchiveSection[];
}
export interface Portfolio {
  id: string;
  title: string;
  label: string;
  description: string;
  href: string;
  projects: ArchiveProject[];
}
export type ArchiveLevel = "HOME" | "PORTFOLIO_MATRIX" | "DOCUMENT_VIEWER";
export interface NavigationState {
  level: ArchiveLevel;
  folder: number;
  project: number;
  rows: Record<string, number>;
  contact: boolean;
}
export type NavigationAction =
  | { type: "folder"; index: number }
  | { type: "enter" }
  | { type: "column"; direction: number }
  | { type: "row"; direction: number }
  | { type: "select"; project: number; section: number; folder?: number }
  | { type: "open" }
  | { type: "back" }
  | { type: "contact"; open: boolean };
export const initialNavigation = (): NavigationState => ({
  level: "HOME",
  folder: 0,
  project: 0,
  rows: {},
  contact: false,
});
const cycle = (index: number, count: number) =>
  ((index % count) + count) % count;
export function projectColumns(portfolios: Portfolio[]) {
  return portfolios.flatMap((p, folder) =>
    p.projects.map((entry, project) => ({ folder, project, entry })),
  );
}
export function projectColumn(state: NavigationState, portfolios: Portfolio[]) {
  return (
    portfolios
      .slice(0, state.folder)
      .reduce((n, p) => n + p.projects.length, 0) + state.project
  );
}
export function activeRow(state: NavigationState, portfolios: Portfolio[]) {
  const p = portfolios[state.folder]!;
  const project = p.projects[state.project]!;
  return cycle(
    state.rows[p.id + "/" + project.id] ?? 0,
    project.sections.length,
  );
}
export function navigate(
  state: NavigationState,
  action: NavigationAction,
  portfolios: Portfolio[],
): NavigationState {
  if (action.type === "contact") return { ...state, contact: action.open };
  if (action.type === "back")
    return state.contact
      ? { ...state, contact: false }
      : {
          ...state,
          level:
            state.level === "DOCUMENT_VIEWER" ? "PORTFOLIO_MATRIX" : "HOME",
        };
  if (state.contact) return state;
  if (action.type === "folder")
    return state.level === "HOME"
      ? { ...state, folder: cycle(action.index, portfolios.length), project: 0 }
      : state;
  if (action.type === "enter")
    return state.level === "HOME"
      ? { ...state, level: "PORTFOLIO_MATRIX" }
      : state;
  if (state.level === "HOME") return state;
  if (action.type === "column") {
    const columns = projectColumns(portfolios);
    const next =
      columns[
        cycle(
          projectColumn(state, portfolios) + action.direction,
          columns.length,
        )
      ]!;
    return { ...state, folder: next.folder, project: next.project };
  }
  if (action.type === "open") return { ...state, level: "DOCUMENT_VIEWER" };
  const folder =
    action.type === "select" && action.folder !== undefined
      ? cycle(action.folder, portfolios.length)
      : state.folder;
  const p = portfolios[folder]!;
  const col =
    action.type === "select"
      ? cycle(action.project, p.projects.length)
      : state.project;
  const project = p.projects[col]!;
  const row =
    action.type === "select"
      ? action.section
      : activeRow(state, portfolios) + action.direction;
  return {
    ...state,
    folder,
    project: col,
    rows: {
      ...state.rows,
      [p.id + "/" + project.id]: cycle(row, project.sections.length),
    },
  };
}
export function navigationHash(
  state: NavigationState,
  portfolios: Portfolio[],
): string {
  const parts = ["archive"];
  if (state.level !== "HOME") {
    const p = portfolios[state.folder]!,
      project = p.projects[state.project]!;
    parts.push(
      p.id,
      project.id,
      project.sections[activeRow(state, portfolios)]!.id,
    );
    if (state.level === "DOCUMENT_VIEWER") parts.push("read");
  }
  if (state.contact) parts.push("contact");
  return "#" + parts.join("/");
}
export function parseNavigation(
  hash: string,
  portfolios: Portfolio[],
  previous = initialNavigation(),
): NavigationState {
  const parts = hash.replace(/^#/, "").split("/");
  if (parts[0] !== "archive")
    return { ...previous, level: "HOME", contact: false };
  let state = { ...previous, contact: parts.at(-1) === "contact" };
  if (state.contact) parts.pop();
  if (parts.length === 1) return { ...state, level: "HOME" };
  const folder = portfolios.findIndex((p) => p.id === parts[1]);
  if (folder < 0) return initialNavigation();
  const project = portfolios[folder]!.projects.findIndex(
    (p) => p.id === parts[2],
  );
  if (project < 0) return initialNavigation();
  const row = portfolios[folder]!.projects[project]!.sections.findIndex(
    (s) => s.id === parts[3],
  );
  if (row < 0 || parts.length > 5 || (parts[4] && parts[4] !== "read"))
    return initialNavigation();
  state = {
    ...state,
    folder,
    project,
    level: parts[4] === "read" ? "DOCUMENT_VIEWER" : "PORTFOLIO_MATRIX",
    rows: { ...state.rows, [parts[1] + "/" + parts[2]]: row },
  };
  return state;
}
