# BIOINFORMATICS ARCHIVE — 内容计划与数据契约

状态：Phase 3 已接入用户提供的研究范围与公开软件资料。真实履历、论文身份、结果图、贡献与联系方式仍缺失；科研提纲不代表已发表成果。

## Phase 3 当前契约

Phase 3.1 不改正文模型：`archive-manifest.ts` 从同一公开集合生成 Portfolio → Project → Section → Content；导航 ID 沿用 translationKey，A1–A4 / T1–T2 只是当前阵列序号，不覆盖科研 area=A1/A2/A3。A2 领域中的 T2T 和 DNMT 仍是不同项目列。科研四栏目映射现有八个 section；技术四栏目映射现有九个 section。论文仍通过 study.publicationIds 集中解析。添加项目后阵列自动扩展；修改纵向栏目在 manifest 的 specs 中配置，需给出真实静态 href 及 contentIds，并检查双语一致性。

- research / software / publications 三个独立集合继续复用；显式路径 ID 避免双语 slug 覆盖。
- research.study：area=A1/A2/A3，stage=outline/verified-study，overview / background / design / analysis，带 published/unpublished/hypothesis 状态与 evidenceRefs 的 findings，publicationIds。
- outline 禁止结果、论文引用、角色、贡献、研究完成状态和图像；verified=true 在此仅验证公开主题范围。真实成果记录仍需完整角色、状态与贡献。
- software.caseStudy：source-review/local-development，状态、概览、问题、功能、架构、实现、流程、验证和图库说明；不推断个人贡献。
- publications 集中维护 originalTitle / authors / venue / year / publicationStatus / doi / url。研究引用 translationKey，缺失或非公开关联使构建失败。
- figures：src / title / alt / caption / source / sourceUrl? / permission / kind / width / height。科研图、截图、原创示意分别标识；原图链接无 JS 可放大。
- 既有三个发布门槛、翻译修订校验、草稿隔离继续有效。中英文共享 archiveId / translationKey / slug。
- 当前四个研究提纲、两个技术案例，共 12 个语言条目；论文集合保持空状态。待办见 [CONTENT_TODO.md](CONTENT_TODO.md)，来源见 [PHASE3_SOURCES.md](PHASE3_SOURCES.md)。

以下为历史规划与可扩展字段，是否实现以上述契约和源码为准。

Phase 1 已实现 research、software、publications 三个 Markdown 内容集合。实际校验契约见 `src/content.config.ts`；本文件中 dataset、results、资产清单等扩展字段留待真实内容接入。软件公开路由采用 `/projects/`。排版演示与真实记录分离，`src/content/*/starter/en.md` 均为不发布的草稿；页面明确标记的模板不进入 sitemap。`profile` 当前位于 `src/data/profile.ts`，未知事实为 null。

关联：[架构](ARCHITECTURE.md) · [设计](DESIGN_SPEC.md) · [实施任务](IMPLEMENTATION_PLAN.md)。

## 1. 内容服务的两类阅读路径

| 读者 | 优先回答的问题 | 推荐路径 |
| --- | --- | --- |
| 博士导师 / 招生委员 | 研究兴趣是什么？能否提出问题、选择方法并解释结果？个人贡献是否清楚？ | 首页介绍 → Research → 论文与复现证据 → 学术 CV → 联系 |
| 生信 / AI 研发招聘者 | 能否构建可用工具？工程质量如何？对数据、评价与部署限制是否有判断？ | 首页精选 → Software → 代码 / 架构 / 测试 → 求职简历 → 联系 |

首页不将所有内容做成难以阅读的小编号。分类名、项目真实标题、简短贡献和直接链接必须同时出现在 HTML 中。

### 首页五个档案分类

| 分类 ID | 英文标题 | 中文标题 | 内容来源 |
| --- | --- | --- | --- |
| research | Research | 科研项目 | research 集合 |
| software | Software | 软件与 AI 工程 | software 集合 |
| publications | Publications | 论文与预印本 | publications 集合 |
| about | About | 关于我 | profile 与双语页面文案 |
| cv | CV | 简历 | 经核验履历和公开 PDF |

每类都有一个导航入口；只有真实内容才产生 entry 档案。装饰卡片没有论文编号、虚构标题或“已完成”状态，不参与计数。Research / Software 可关联同一个工作的不同侧面，明确区分，不能重复计算为两项研究成果。

## 2. 首版页面内容

### 首页

- 站名：BIOINFORMATICS ARCHIVE。
- 用户姓名 / 公开称呼：待提供，不用 GitHub 用户名推断真实姓名。
- 一句话研究定位：待用户确认，不能由“想申请博士”推断当前学位或任职。
- 真实研究兴趣：最多 3–5 项，区分已有经验与未来兴趣。
- 精选研究与软件：建议各 1–3 项；不足时如实减少，不为填满布局编造。
- CV 与联系入口：文件 / 地址存在且确认可公开才启用。
- 英文为主、中文对应；内容语言缺失按架构中的回退规则处理。

### Research 详情

1. 研究问题和背景：问题为何值得研究，引用确切来源。
2. 项目区间、类型、团队 / 合作背景：只展示经确认可公开的信息。
3. 本人贡献：具体到任务、方法、代码、实验与分析；区分导师、合作者和本人工作。
4. 数据来源：公开 accession / 数据集版本 / 使用限制；不公开个体级敏感数据。
5. 方法：输入、预处理、模型或统计分析、对照与评价设置。
6. 结果：必须附适用数据划分、样本量、指标定义和证据；没有结果则说明状态。
7. 局限与下一步：混杂、偏差、泛化范围、复现难点等与项目相关的真实限制。
8. 复现：代码版本、环境、命令、可公开材料链接。
9. 关联论文 / 软件：只链接核验过的条目。

“单细胞”“多组学”“蛋白质语言模型”等只能作为待讨论的内容方向，不能默认写成用户经历。禁止自动填入性能提升、统计显著性、样本量、合作实验室或论文状态。

### Software 详情

1. 解决的问题与目标用户。
2. 可运行范围与项目状态：原型、维护中、归档等真实状态。
3. 本人职责与团队边界。
4. 系统架构、数据流和关键技术决策。
5. 安装 / 使用方式、输入输出示例；演示输入明确为合成或公开样例。
6. 测试、错误处理、可重复环境和依赖。
7. 性能数据：硬件、数据规模、版本、测量方法与基线；没有测量不写“高性能”数字。
8. 仓库、Release、文档、演示链接与许可证。
9. 限制、维护范围和未来计划。

站点只描述工具，不在 GitHub Pages 上伪装运行需要服务器或 GPU 的模型。演示可为本地预计算结果、静态图片或外部可公开链接，且说明性质。

### Publications

- 保存原始论文标题、作者顺序、发表 / 预印本 / 投稿状态与真实日期。
- 标记用户作者位置仅在身份确认后生成；共同一作 / 通讯作者须有依据。
- DOI / PMID / arXiv 等标识按实际来源填写，可缺省，不伪造。
- `preprint`、`submitted`、`accepted`、`published` 严格区分；未公开投稿需本人确认可公开。
- 论文 PDF 必须有再分发权；仅能链接时链接出版社或合法开放版本。
- 中文介绍可以翻译摘要，但不能把译名替代正式引用题名。
- 未提供已核验条目时显示诚实空状态，不用“coming soon”制造已发表暗示。

### About / CV / Contact

- About：真实教育与经历、研究兴趣、实践方式；可包含未来目标但明确其为目标。
- CV：HTML 为可访问主版本；学术 CV 与 industry résumé 如均提供，可分别下载，显示语言、更新日期及文件大小。
- Contact：只用用户确认的专业邮箱及个人主页；mailto 不需要后端。不增加提交后无人处理的联系表单。
- 暂缺真实联系方式时可保留说明性页面，但隐藏邮件按钮。不要编造 `name@example.com` 为可用联系方式。
- 社交 / ORCID / Scholar / GitHub 链接必须核验归属，不根据同名搜索自动认领。

## 3. 内容组织与公共字段

建议路径：

```text
src/content/research/<translationKey>/en.md
src/content/research/<translationKey>/zh.md
src/content/software/<translationKey>/en.md
src/content/software/<translationKey>/zh.md
src/content/publications/<translationKey>/en.md
src/content/publications/<translationKey>/zh.md
```

`translationKey` 表示同一内容实体；不直接依赖 loader 自动生成的文件 ID 作为 URL。显式 `slug` 生成页面地址，显式 `archiveId` 用于场景与返回恢复。

### 通用 frontmatter

| 字段 | 类型 / 约束 | 规则 |
| --- | --- | --- |
| `translationKey` | string，集合内稳定唯一实体标识 | 英中共享 |
| `archiveId` | string，全站稳定 ID | 同一实体英中相同，不用数组下标 |
| `locale` | `en` / `zh` | 与文件名、正文语言一致 |
| `slug` | `[a-z0-9]+(-[a-z0-9]+)*` | 跨语言一致，改动需重定向方案 |
| `title` | 非空 string | 真实项目 / 论文名称 |
| `summary` | 非空 string | 英文建议 30–60 词，中文约 60–120 字 |
| `draft` | boolean，默认 true | 草稿不进入公开产物 |
| `verified` | boolean，默认 false | 由内容核验流程设置，不自动变 true |
| `visibility` | `public` / `private`，默认 private | 只有 public 可发布；私密内容不应存入公开 Git |
| `updatedAt` | ISO 日期 | 最近真实内容更新 |
| `tags` | string[]，受控词表 | 不自动等价于用户技能 |
| `featuredOrder` | 非负 integer，可选 | 不重复；缺省不精选 |
| `sourceRevision` | string，可选 | 翻译绑定到原文内容 hash / revision |
| `verifiedAt` | ISO 日期，可选 | verified=true 时必须 |
| `evidenceRefs` | 已登记证据 ID[] | 发布条目需要可追溯依据 |
| `cover` | 可选图像描述对象 | path、alt、caption、assetId |
| `links` | 结构化 URL 对象 | 只允许实际存在且可公开的链接 |

生产纳入条件统一为：

```text
draft === false AND verified === true AND visibility === "public"
```

这是共享函数的责任，必须同时控制静态路径、列表、首页 manifest、sitemap、RSS（若后续有）、搜索索引（若后续有）和结构化数据，不能只在列表中隐藏。

### 各集合额外字段

| 集合 | 必要字段 | 可选字段与约束 |
| --- | --- | --- |
| research | `researchStatus`、`role`、`contributions[]`、`methods[]` | period、datasets、results、relatedSoftware、relatedPublications |
| software | `projectStatus`、`role`、`contributions[]`、`stack[]` | repository、release、license、demo、benchmarks、relatedResearch |
| publications | `publicationStatus`、`originalTitle`、`authors[]`、可公开依据 | venue、year、DOI、PMID、arXiv、openAccessUrl、relatedResearch |

状态枚举：

```ts
type ResearchStatus = "ongoing" | "completed" | "paused";
type ProjectStatus = "prototype" | "maintained" | "archived";
type PublicationStatus = "preprint" | "submitted" | "accepted" | "published";
```

`draft` 是站点发布流程状态，不等于研究或论文状态。例如完成的研究仍可为本站草稿；公开预印本不能因为网站发布而变成期刊已发表。

`period` 使用 `{ start?: string, end?: string }`，只有确切年份时允许 `YYYY`，不能补造月日。`published` / `accepted` 的 venue、日期等字段在对应情形下要求填写；提交中不得生成 DOI 或发表期刊事实。

### 证据、数据集和结果

```ts
type EvidenceRef = {
  id: string;
  kind: "public-url" | "owner-confirmation";
  url?: string;                  // 仅公开依据可存公开仓库
  note?: string;                 // 不包含私密文档内容
  checkedAt: string;
};

type DatasetRef = {
  label: string;
  accession?: string;
  version?: string;
  publicUrl?: string;
  access: "open" | "restricted" | "not-redistributed";
  license?: string;
};

type ResultClaim = {
  description: string;
  evidenceIds: string[];
  metric?: string;
  value?: number;
  unit?: string;
  evaluation?: string;           // 数据划分、样本范围、方法等
  baseline?: string;
  limitation?: string;
};
```

定量结果需 `metric/value/unit/evaluation` 与证据，比较提升还必须有 baseline 和比较条件。非定量成果可仅描述事实与证据，不强迫每个项目填数字。证据记录只帮助校验，不能由脚本证明学术事实真实。

公开数据集不等于所有附带材料可再分发；站内以来源说明和链接为主。涉及保密研究，仅公开本人明确批准的概述，不放患者、样本个体标识、受限原始数据、访问令牌或未授权材料。

## 4. Profile 与资产登记

### Profile

建议经 schema 校验的 `src/data/profile.json`：

- `displayName`、`headline.en/zh`、`bio.en/zh`、`researchInterests.en/zh`。
- `education[]`、`experience[]`：真实机构、角色、时间、说明。
- `professionalLinks[]`：类型、标签、URL、是否已核验。
- `contactEmail`：可选，确认可公开才写入。
- `cvDownloads[]`：语言、用途、路径、真实更新时间、文件大小。
- `verified`、`verifiedAt`：控制公开展示；未知字段留缺省，不用虚构填充。

已知且无需推断的信息仅为站名、目标域名、用户指定用途和技术栈。上述 personal 字段尚待提供。

### 资产来源清单

`src/data/assets.json` 在实际引入资产时建立，每项包含：

| 字段 | 用途 |
| --- | --- |
| id / localPath | 唯一标识与实际文件 |
| creator / sourceUrl | 作者与来源，原创资产写创作方式 |
| license / licensePath | 许可类型及随站保留的文本 |
| permissionEvidence | 必要授权的记录位置；私有证明不进入公开仓库 |
| modifications | 裁剪、改色、适配、子集化等修改 |
| allowedUse | 是否允许网站、缩略图、下载 / 再分发 |
| reviewedAt | 最近检查日期 |

科研图像必须说明是实验结果、方法示意还是合成示例。原创装饰点阵不被描述为真实基因表达或模型预测。

## 5. 文档模板（仅写作说明）

以下模板只展示结构；不是用户项目，不创建公开 fixture，不填写假论文、假数据或看似可信的虚构指标。

```yaml
---
translationKey: replace-with-real-project-key
archiveId: research-replace-with-real-id
locale: en
slug: replace-with-real-slug
title: "[TODO: verified project title]"
summary: "[TODO: problem, personal contribution, supported outcome]"
draft: true
verified: false
visibility: private
researchStatus: ongoing
role: "[TODO: confirm actual role]"
contributions: []
methods: []
tags: []
evidenceRefs: []
# updatedAt / verifiedAt 由实际编辑与核验日期填写
---
```

模板中的 `ongoing` 只是 schema 枚举演示，复制时必须确认实际状态。缺少必要字段的模板本来就不应发布。

Research 正文提纲：

```markdown
## Research question
[为什么研究这个问题；本人实际参与的范围]

## My contribution
[具体职责，避免把团队全部成果写成个人成果]

## Data and methods
[来源、使用条件、方法与评价设计]

## Results
[只写有证据的观察；没有完成结果则说明项目状态]

## Limitations
[与本项目有关的限制]

## Reproducibility and resources
[已公开代码、版本、运行说明及材料]
```

软件项目对应使用 Problem、My contribution、Architecture、Usage、Validation、Limitations、Resources。MDX 仅在确需复用图表、公式或提示组件时引入，优先 Markdown；不得在内容文件运行远程脚本。

## 6. 国际化编辑规则

- 英文内容作为首版主稿，中文通过同一 translationKey 关联；英文优先不表示可以杜撰英文信息。
- 首版主导航、分类、空状态、错误提示、2D / 3D 控制、CV / Contact 页面框架必须双语。
- 真实项目可以先发英文，再逐条完成中文。缺失译文时中文索引显式标记“英文内容”，不生成假中文详情。
- 原文更新后以 `sourceRevision` 检查译文；过期译文标为待更新，生产构建阻止其以最新译文身份发布。可暂时排除中文版本并回退到英文链接。
- 不按标题相似度自动配对翻译。术语表统一 gene expression、single-cell、benchmark 等确实在内容中出现的术语。
- 论文正式标题、软件名称、作者姓名和 DOI 不做擅自翻译或改写；解释性段落可以翻译。
- UI 字典使用类型约束一致的键；禁止在 Three.js 模块内硬编码英文 / 中文长文案。

## 7. 内容核验与构建检查

### 编辑流程

```text
收集本人材料 → 草稿 → 核对事实与公开权限 → 英文定稿
→ 中文翻译及对应检查 → verified 标记 → 本地预览 → 发布检查
```

用户确认与公开来源均可成为事实依据。缺乏依据的字段不发布，不把润色生成的文字当成新的证据。

### 自动检查

- 必填字段、日期、状态枚举、URL 协议、locale / 文件名一致。
- `(collection, translationKey, locale)`、路由和 archiveId 的唯一性；同一实体跨语言 archiveId 一致。
- 无不存在的关联条目、图像、许可证或 CV 文件。
- 生产候选条目不得含 `[TODO]`、示例域名、测试标识或未核验 claim。
- 草稿 / 私有条目不出现在 `dist/` 页面、嵌入 JSON、sitemap 或客户端脚本中。
- 本地 fixture 位于测试目录，不纳入生产 loader；构建检查明确扫描其测试标识。
- 缺译文的链接指向真实英文页，互设 hreflang 的目标必须存在。
- 只允许 `https` 等明确允许的外链；禁止 `javascript:`，mailto 仅来自已确认邮箱字段。
- Markdown 原始 HTML 默认避免使用；MDX 只接受仓库内可信作者内容。

### 人工检查

- 本人角色、作者顺序、机构名称、时间、论文状态与来源一致。
- 结果叙述是否超出证据，是否混淆相关性与因果或内部测试与外部泛化。
- 每幅图的意义、数据来源、替代文字和版权。
- 公开 PDF 中是否包含不希望公开的住址、电话、签名或其他私密信息。
- 中英文含义一致，未把兴趣变成经验、把计划变成成果。

## 8. 待用户提供的材料

以下不是当前架构阶段的阻塞项，但会影响后续公开内容完整度：

| 优先级 | 材料 | 最低可用信息 |
| --- | --- | --- |
| P0 | 公开姓名 / 称呼与简介 | 中英文、真实教育 / 当前角色、公开范围 |
| P0 | 研究方向 | 已有经验与申请兴趣分别说明 |
| P0 | 至少一项代表研究或软件项目 | 问题、本人贡献、方法、当前状态、可公开证据 |
| P0 | 联系方式 | 确认可公开的专业邮箱或已有专业主页 |
| P0 | CV / 简历 | 现有文件或真实结构化履历；是否需要学术 / 求职两个版本 |
| P1 | 其他精选项目 | 真实仓库链接、截图、复现或测试材料 |
| P1 | 论文清单 | 若有，提供题名、作者、状态、正式来源；没有则保持空列表 |
| P1 | 图像与图表 | 来源、许可、可公开范围、替代文字说明 |
| P1 | 中文译文 | 已确认英文内容对应翻译 |
| P2 | 个人照片、长期文章、额外演示 | 可选，不影响基础上线能力 |

没有论文不会阻塞可信的个人站点；没有真实项目内容时可以开发和验收技术框架，但不得宣称已完成面向申请 / 求职的内容交付。

## Phase 3.2 补充规则（2026-10-23，优先于早期阶段说明）

- 已接入四个科研、两个软件项目的双语正文及三个正式论文双语记录；历史缺口清单不再代表这些内容全部缺失。
- `study.stage: published-review` 必须有正式论文关联与全部标为 published 的 findings；可以缺少尚未确认的个人角色。`verified-study` 保留更完整的职责、证据要求；不能仅因论文存在就推断个人贡献。
- `outline` 可包含明确标注的原创 `diagram`，但不允许科研结果、真实成果截图、论文关联或暗示完成的个人职责。A4 使用此边界。
- `figures` 包含稳定 id、src、title、alt、caption、source、permission、kind、width、height；可选 sourceUrl。placement 为 overview / analysis / architecture / implementation / figures，默认 figures。
- `mediaSlots: [{id, title, description}]` 是显式缺图位，只展示文字。不得通过虚假文件、假结果或空链接填满页面。
- 原创概念图与流程图必须分别提供英文 SVG 和 `-zh.svg`；中文条目引用中文文件，正式论文图保留原始标注并翻译外围说明。
- Publications 的 `citationNote` 用于日期与译名说明；研究仅维护 publicationIds，不重复作者元数据。
- 完整来源登记见 `CONTENT_SOURCE_REGISTER.md`；新增素材的精确文件、行号、图注及中英文示例见 `CONTENT_ASSET_TODO.md`；本次实际验证见 `PHASE3_2_CONTENT_INTEGRATION_REPORT.md`。

# 发布准备内容规则（2026-10-23）

访客正文删除技术 problem / statusNote 展示以及研究记录 / 贡献栏目的编辑性提示；科研贡献证据可继续留在来源数据。没有结果的研究隐藏 findings，manifest 同步跳过。来源 / 许可 metadata 保留，但图下注释仅显示分类，完整署名集中在 Credits。

figure.kind 新增 placeholder，供用户指定的罗非鱼 Fig 1–3；它不是 research-result。src 支持受限本地 PNG 文件名中的大小写及空格，禁止路径越级。PNG 实际尺寸在构建时读取，英文 / 中文共用同一文件；概念与流程 SVG 仍使用各自语言资源。

当前插图入口及替换步骤以 `CONTENT_ASSET_TODO.md` 为准；下文旧阶段行文保留作架构历史。
