import type { Locale } from "../lib/routes";
export const researchAreas = [
  {
    id: "A1",
    en: "Natural sex reversal & multi-omics",
    zh: "自然性逆转与多组学",
    description: {
      en: "Sparid fish, with a focus on black porgy.",
      zh: "以黑鲷为代表的鲷科鱼类研究。",
    },
  },
  {
    id: "A2",
    en: "Fish genomics & epigenetics",
    zh: "鱼类基因组学与表观遗传",
    description: {
      en: "Two independent archives: T2T genomes and the DNMT gene family.",
      zh: "高质量参考基因组与 DNA 甲基转移酶家族研究。",
    },
  },
  {
    id: "A3",
    en: "Tilapia eccDNA",
    zh: "罗非鱼 eccDNA",
    description: {
      en: "Extrachromosomal circular DNA and transcriptomics in Nile tilapia.",
      zh: "尼罗罗非鱼的染色体外环状 DNA 与转录组研究。",
    },
  },
] as const;
const research = [
  ["overview", "Research Overview", "研究概览"],
  ["background", "Background & Research Questions", "背景与科学问题"],
  ["design", "Experimental Design", "实验设计"],
  ["analysis", "Methods & Analysis Workflow", "方法与分析流程"],
  ["findings", "Key Findings", "主要发现"],
  ["figures", "Representative Figures", "代表性图表"],
  ["publications", "Related Publications", "相关论文"],
] as const;
const technical = [
  ["overview", "Project Overview", "项目概览"],
  ["solution", "Solution & Key Features", "解决方案与功能"],
  ["stack", "Tech Stack", "技术栈"],
  ["architecture", "System Architecture", "系统架构"],
  ["implementation", "Workflow & Implementation", "工作流程与实现"],
  ["figures", "Screenshots & Outputs", "截图与产物"],
  ["validation", "Testing / Project Status", "测试与项目状态"],
  ["links", "GitHub & Demo Links", "代码与演示链接"],
] as const;
export const portfolioHeadings = (
  kind: "research" | "software",
  locale: Locale,
) =>
  (kind === "research" ? research : technical).map(([id, en, zh]) => ({
    id,
    text: locale === "en" ? en : zh,
  }));
