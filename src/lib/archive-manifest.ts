import { entriesFor } from "./content";
import { entryPath, pagePath, type Locale } from "./routes";
import type { Portfolio } from "./archive-model";

// Only navigation metadata lives here. All titles, summaries and body content
// originate in the same public collections that generate the static details.
export async function archiveManifest(locale: Locale): Promise<Portfolio[]> {
  const en = locale === "en";
  const portfolios: Portfolio[] = [];
  for (const kind of ["academic", "technical"] as const) {
    const academic = kind === "academic";
    const entries = (
      await entriesFor(academic ? "research" : "software", locale)
    ).sort((a, b) => a.data.archiveId.localeCompare(b.data.archiveId));
    const projects = entries
      .filter((e) =>
        academic
          ? "study" in e.data && e.data.study
          : "caseStudy" in e.data && e.data.caseStudy,
      )
      .map((entry, i) => {
        const href = entryPath(
          entry.collection,
          entry.data.slug,
          entry.data.locale,
        );
        const specs = academic
          ? ([
              [
                "overview",
                "Research Overview",
                "研究概览",
                "OVERVIEW",
                [
                  "overview",
                  "background",
                  "design",
                  ...("study" in entry.data && entry.data.study?.findings.length
                    ? ["findings"]
                    : []),
                ],
              ],
              ["workflow", "Workflow", "工作流程", "WORKFLOW", ["analysis"]],
              [
                "figures",
                "Representative Figures",
                "代表性图表",
                "FIGURES",
                ["figures"],
              ],
              [
                "publications",
                "Related Publications",
                "相关论文",
                "PUBLICATIONS",
                ["publications"],
              ],
            ] as const)
          : ([
              [
                "overview",
                "Project Overview",
                "项目概览",
                "OVERVIEW",
                ["overview", "solution", "stack"],
              ],
              [
                "architecture",
                "System Architecture & Workflow",
                "系统架构与流程",
                "ARCHITECTURE",
                ["architecture", "implementation"],
              ],
              [
                "figures",
                entry.data.archiveId === "T2"
                  ? "UI Gallery"
                  : "Screenshots & Outputs",
                entry.data.archiveId === "T2" ? "界面图库" : "截图与产物",
                "GALLERY",
                ["figures"],
              ],
              [
                "repository",
                entry.data.archiveId === "T2"
                  ? "Repository & Development Log"
                  : "Repository & Documentation",
                entry.data.archiveId === "T2"
                  ? "仓库与开发记录"
                  : "仓库与技术文档",
                "REPOSITORY",
                ["validation", "links"],
              ],
            ] as const);
        return {
          id: entry.data.translationKey,
          index: (academic ? "A" : "T") + (i + 1),
          title: entry.data.title,
          summary: entry.data.summary,
          href,
          sections: specs.map(([id, title, zh, label, contentIds]) => ({
            id,
            title: en ? title : zh,
            label,
            href: href + "#" + contentIds[0],
            contentIds: [...contentIds],
          })),
        };
      });
    if (!projects.length)
      throw new Error("Portfolio has no public projects: " + kind);
    portfolios.push({
      id: kind,
      title: academic
        ? en
          ? "Academic Portfolio"
          : "学术作品集"
        : en
          ? "Technical Portfolio"
          : "技术作品集",
      label: academic ? "ACADEMIC" : "TECHNICAL",
      description: academic
        ? en
          ? "Research projects, workflows, figures and related publications."
          : "研究项目、工作流程、图表与相关论文。"
        : en
          ? "Engineering projects, architecture, outputs and source records."
          : "工程项目、系统架构、产物与源码记录。",
      href: pagePath(kind, locale),
      projects,
    });
  }
  return portfolios;
}
