import type { Locale } from "../lib/routes";

export function templateSections(
  kind: "research" | "software",
  locale: Locale,
) {
  const headings = {
    research: {
      en: [
        "Research question",
        "My contribution",
        "Data & methods",
        "Results",
        "Limitations",
        "Reproducibility",
      ],
      zh: [
        "研究问题",
        "本人贡献",
        "数据与方法",
        "研究结果",
        "局限性",
        "可复现性",
      ],
    },
    software: {
      en: [
        "The problem",
        "My contribution",
        "System architecture",
        "Usage",
        "Validation",
        "Limitations & resources",
      ],
      zh: [
        "解决的问题",
        "本人贡献",
        "系统架构",
        "使用方式",
        "验证与测试",
        "限制与资源",
      ],
    },
  };
  const bodies = {
    research: {
      en: [
        "[Describe the research question and its context. Link to relevant sources.]",
        "[Describe your specific responsibilities. Separate your work from the team's contribution.]",
        "[Document data sources, access conditions, preprocessing and evaluation design.]",
        "[Add supported observations and results. Do not invent metrics or sample sizes.]",
        "[Explain limitations, uncertainty and the scope of the conclusions.]",
        "[Link to public code, environment specifications and permitted supporting materials.]",
      ],
      zh: [
        "[说明研究问题与背景，并链接相关来源。]",
        "[说明本人具体职责，区分个人工作与团队贡献。]",
        "[记录数据来源、访问条件、预处理与评价设计。]",
        "[补充有证据支持的观察和结果，不填写虚构指标或样本量。]",
        "[说明局限、不确定性与结论的适用范围。]",
        "[链接公开代码、环境说明及允许公开的支持材料。]",
      ],
    },
    software: {
      en: [
        "[Explain the problem, intended users and actual project status.]",
        "[Describe the components you designed, implemented or maintained.]",
        "[Explain the system boundaries, data flow and key technical decisions.]",
        "[Provide verified installation instructions and clearly labelled example inputs.]",
        "[Document tests and measured performance, including hardware and methodology.]",
        "[Explain known limitations. Add confirmed repository, release and license links.]",
      ],
      zh: [
        "[说明问题、目标用户与项目实际状态。]",
        "[说明本人设计、实现或维护的部分。]",
        "[说明系统边界、数据流与关键技术决策。]",
        "[提供经过验证的安装说明，以及明确标注的示例输入。]",
        "[记录测试与性能测量，包括硬件条件和测量方法。]",
        "[说明已知限制，补充经过确认的仓库、版本和许可链接。]",
      ],
    },
  };
  return headings[kind][locale].map((heading, i) => ({
    id: `section-${i + 1}`,
    heading,
    text: bodies[kind][locale][i],
  }));
}
