# Phase 3.2 — BIOINFORMATICS ARCHIVE 真实项目内容填充（完整 Codex 指令）

你是一名兼具科研传播、英文技术写作、科学可视化、前端工程与软件产品展示经验的开发者。请直接在当前已经完成视觉设计和交互的 `Azure179.github.io` 本地项目中执行 **Phase 3.2：真实内容填充**，不要停留在规划或建议。

## 0. 当前状态与任务边界

- 网站名称：**BIOINFORMATICS ARCHIVE**；目标网站：`https://azure179.github.io`。
- 现有网站的整体视觉效果、Three.js 3D 文件夹、档案阵列、动画和切换逻辑已经达到预期，**不重新设计、不重建工程、不重构稳定的 3D 交互**。
- 首页只有两个 3D 文件夹：`01 Academic Portfolio`、`02 Technical Portfolio`；双击文件夹进入。
- 文件夹内是 RhineLabUI 风格的档案矩阵：**不同项目分列横向切换，同一项目不同 Section 在同列纵向切换**；支持打开文档阅读器、返回及快捷导航。现有右上角 Contact 集中提供 Profile、联系方式、简历等。
- 当前阶段六个项目尚未完成真实内容填充。我尚未将此前的 `CODEX_IMPORT_PROMPT.md` 或六份项目草稿添加到工程。**这份指令本身就是完整的实施依据，不得假设那些文件存在，也不要以找不到它们为由停止实施。**
- 目标：让访问者用约 1 分钟了解各项目核心价值，再花数分钟通过真实图片、示意流程与外部证据深入阅读；**不把简历或论文摘要直接整段复制为网站正文**。

## 1. 实施前的只读审计与保护

1. 先阅读当前工程中的 `AGENTS.md`、`docs/`、Astro 路由、内容集合、Portfolio/Project/Section 数据结构、3D 场景与文档阅读器现有实现，检查 `git status`。
2. 尊重现有目录和内容模型，不要创建与现有页面重名的第二套系统；优先复用组件、样式、图片画廊及内容集合。
3. 不删除现有内容；不覆盖尚未提交的用户修改；有风险的操作先列入报告。必要时建立安全的本地工作分支或建议 checkpoint，不要强制 reset/rebase。
4. 检查当前项目是否有 `package.json` 和可用测试脚本。Windows PowerShell 遇到 `.ps1` 策略限制时用 `npm.cmd` / `npx.cmd`。
5. 只修改作品集仓库。**不得修改** `Azure179/LLM-RNAseq-Platform` 或其他研究项目仓库，不得自行推送 GitHub，不得部署或产生未经许可的第三方 API 费用。

## 2. 内容设计的统一标准

采用 **Why → How → Output → Evidence** 的叙事逻辑，以精炼英文为网站默认正文，同时提供忠实、自然的中文版本供切换与审核。语气专业、克制，避免“世界领先”“革命性”“独立完成所有研究”等未经证实的表述。每个项目有：

- 一句话摘要（英文建议 20–35 词）；
- 1 段面向跨学科访问者的项目背景（英文建议 60–110 词）；
- 关键分析思路或工程设计图，及 2–4 个简短要点；
- 真实、获授权的图片或原创流程示意及逐图说明；
- 关联论文或 GitHub 等可验证链接；
- 研究/工程贡献用事实陈述，不写简历式个人评价或夸大的成果数字。

页面仍严格遵循 `Portfolio → Project → Section → Content` 四层模型，**不要更改档案顺序和横纵切换行为**。所有项目和内容应有稳定 ID、顺序、英文/中文标题、摘要、媒体资源、ALT 文本、caption、source、license/provenance、external links 等结构化字段。优先复用已有字段；如扩展类型，需兼容已有 3D 代码。

原则：一份档案只讲一个主要问题，采用“短文 + 主图/流程图 + 少量说明”，不堆积一页长文字。对长文使用阅读器内滚动或二级展开，但保留图表放大、键盘和移动端访问。

## 3. Academic Portfolio（四个项目，四份档案/项目）

### A1 — Natural Sex Change & Multi-omics（鲷科鱼类自然性逆转多组学）
**展示标题（建议）：** `Epigenetic Remodeling During Natural Sex Change in Black Porgy`
**研究对象：** 黑鲷 *Acanthopagrus schlegelii*；不要将单物种结果泛化为整个鲷科普适机制。

1. `Research Overview`：介绍雄性先熟鱼类自然性逆转的生物学问题、性腺发育阶段及多组学研究价值。可使用基于公开文献的描述：“联合 DNA 甲基化与转录组分析，用于探索性腺转变过程中表观遗传与基因表达的关联”；避免写成已证明因果调控。
2. `Workflow`：制作原创、可编辑的科研流程图：`Gonadal stages (T / OT / O) → Histological characterization → WGBS + RNA-seq → Differential methylation / differential expression → Integrated analysis → Functional interpretation`。lncRNA、miRNA、circRNA 和 ceRNA 可以简述为拓展研究方向，但未公开分析不得与已发表成果混为一谈。
3. `Representative Figures`：优先使用作者有权公开的性腺 H&E 图、阶段概览图、甲基化/表达联合分析图、公开论文中的关键结果图；需要图注说明“展示什么、如何理解”，不公开未发表候选基因/网络或完整样本矩阵。无法确认授权时，改为原创概念流程图和待补素材位。
4. `Related Publications`：搜索/核对已发表论文 `Methylomics and transcriptomics studies reveal epigenetic regulation during the natural sex change of protandrous black porgy (Acanthopagrus schlegelii)`，从出版社/DOI 官方记录确认最终题目、作者、期刊、日期和 DOI；不要猜测作者顺位。

**建议访客可见导语（可润色并翻译）：**
“Natural sex change in black porgy provides a model for investigating how gonadal identity and gene regulation evolve during development. By integrating transcriptomic and DNA methylation profiles across gonadal stages, this project explores molecular changes associated with the transition and highlights pathways for further biological investigation.”

### A2 — Telomere-to-Telomere Fish Genomics（鱼类 T2T 基因组学）
**展示标题（建议）：** `Reference-Quality Genome Resources for Greater Amberjack`
**对象：** 高体鰤（greater amberjack, *Seriola dumerili*）雌雄个体。

1. `Research Overview`：为什么高连续性参考基因组对比较基因组学、性别相关基因组研究和资源构建有意义；客观说明研究建立了雌雄个体的 T2T/高质量基因组资源，以正式论文为准。
2. `Workflow`：原创图：`Long-read sequencing → Assembly and polishing → Hi-C scaffolding / chromosome validation → Gene annotation → Assembly quality assessment → Comparative genomic analyses`。具体方法和顺序必须根据论文核实。
3. `Representative Figures`：重点考虑已获许可的 Hi-C contact maps、Circos/genome landscape、组装连续性或共线性结果、可验证的组装质量指标。指标必须来自论文，标明物种、性别、单位和指标定义，不复制错误数值。
4. `Related Publications`：核对 `Telomere-to-telomere genome assemblies of male and female greater amberjack (Seriola dumerili)` 的正式 DOI、期刊（Scientific Data）、许可和作者记录。

**建议访客可见导语：**
“High-contiguity reference genomes provide the foundation for studying genome organization, evolution, and gene function. This work contributes male and female greater amberjack genome resources and presents assembly validation, annotation, and comparative genomic analyses through a reproducible research workflow.”

### A3 — Fish DNA Methyltransferases & Comparative Epigenomics（鱼类 DNMT 与表观遗传）
**展示标题（建议）：** `Evolution and Expression of DNA Methyltransferases in Fish`

1. `Research Overview`：解释 DNMT 基因家族与 DNA 甲基化的关系，研究目标是比较鱼类 DNMT 的基因组成、演化与表达特征，不将表达相关性直接称为功能验证。
2. `Workflow`：原创图：`Gene identification → Domain validation → Phylogenetic analysis → Synteny / gene duplication → Gene structure → Tissue-expression profiles → Biological interpretation`。
3. `Representative Figures`：系统发育树、共线性、保守结构域/基因结构、组织表达热图，尽量选可读性最强的 3–4 张，不放全套补图。
4. `Related Publications`：核对公开 `Biomolecules` 的鱼类 DNMT 家族研究正式标题、作者、年份、DOI 与开放许可；原有预印、返修等状态不可当已正式发表。

**建议访客可见导语：**
“DNA methyltransferases play central roles in establishing and maintaining DNA methylation patterns. Through comparative gene-family analysis, phylogeny, synteny, and expression profiling, this project examines how DNMT repertoires diversified across fishes and what these patterns may suggest about functional specialization.”

### A4 — eccDNA & Muscle-Associated Transcriptomics in Tilapia（罗非鱼 eccDNA）
**展示标题（建议）：** `Exploring eccDNA and Muscle-Associated Transcription in Tilapia`

1. `Research Overview`：以尼罗罗非鱼 *Oreochromis niloticus* 为模型，在不同饲喂条件下研究肌肉品质相关分子特征，探索 eccDNA 分布与转录变化之间的联系；不暗示 eccDNA 直接导致肉质变化。
2. `Workflow`：原创示意 `Experimental groups → Skeletal muscle sampling → eccDNA enrichment / sequencing + RNA-seq → eccDNA detection and annotation → Differential expression → Integrated interpretation`。只展示确定采用的分析思路。
3. `Representative Figures`：如论文尚未正式公开或没有明确公开授权，**仅放原创 eccDNA 生物学示意、分析工作流、使用明确合成数据的示例图**。禁止上传完整 eccDNA 坐标、未发表候选关联、原始样本数据、未发表显著性统计或内部实验细节。
4. `Related Publications`：论文只有在正式公开、能够核对 DOI 或授权后才添加链接。否则显示 `Manuscript in progress` 也必须经过用户确认；默认采用 `Publication details to be added after public release` 或隐藏该子部分中的具体论文条目，绝不伪造 DOI。

**建议访客可见导语：**
“This project investigates extrachromosomal circular DNA and transcriptional variation in tilapia skeletal muscle under different dietary conditions. Integrating eccDNA detection with transcriptome analysis provides a framework for exploring potential relationships between genome-derived circular DNA and muscle-associated molecular processes.”

## 4. Technical Portfolio（两个项目，四份档案/项目）

### T1 — LLM-RNAseq-Platform（旗舰技术项目）
**展示标题：** `LLM-driven RNA-seq Analysis Platform`
**链接：** `https://github.com/Azure179/LLM-RNAseq-Platform`
**副标题：** `Natural-language workflows for reproducible bulk RNA-seq analysis`

**定位：按完整产品的目标使用路径介绍，不按 Phase 7/8/9 开发日志叙述。** 但只有已实际实现、可验证的功能才能写为已完成；尚未实现的可作为 `Planned / Concept` 的简短补充，不能伪装成真实运行成果。

T1 的四份档案：

1. `Project Overview`
   - 痛点：Bulk RNA-seq 数据导入、统计分析、可视化、重复绘图涉及多个工具和大量参数配置。
   - 方案：将可理解的自然语言请求与受约束的 RNA-seq 分析工具、项目工作区和结果查看整合起来。
   - 展示一张真实 UI 总览大截图（如可获取），下面用 4–6 个图文功能卡片展示：Project Workspace / Data Import、DEG & PCA、Volcano & Heatmap、GO & KEGG、Multi-step Workflow、Result Review & Customization。
   - 避免描述为“自动发现生物学机制”“自由运行任意 R/Python 代码”“全自动智能体自主完成研究”。

2. `System Architecture & Workflow`
   - 绘制原创、可编辑的 SVG/HTML 流程图：
     `Research question + project inputs → LLM intent interpretation / planning → Local schema, input, dependency and provenance validation → Skill Registry → R / Python analysis → Saved results and visualizations → Grounded summary / result browser / supported customization`。
   - 再单独展示一个真实适用的 DAG 示例：`DEG → {Volcano, KEGG(up)}`，解释下游使用哪份已确认的结果，明确 LLM 负责规划、确定性工具负责统计。
   - 使用已实现的实际架构，不凭空加 FastAPI、云服务、数据库、自动重试、多用户或未经核实的 Docker 部署。

3. `Screenshots & Outputs`
   - **优先实际试运行最新本地版本**，使用仓库内公开的合成示例数据或者新生成且明显标注为 `Synthetic demonstration data` 的示例数据。
   - 理想的连续故事：① 创建工作区并导入 Counts/Metadata/Annotation → ② 指定分组 → ③ 输入自然语言请求 → ④ 展示被验证的 Workflow → ⑤ 查看 DEG/PCA/Volcano/Heatmap/GO/KEGG 中真实成功生成的结果 → ⑥ 对已生成图表进行允许的参数定制、查看或导出。
   - 拍摄 4–6 张真实应用截图，提供简短英文标题和双语说明。应截到真实 Streamlit UI、实际绘图及真实状态反馈。优先使用同一份合成数据贯穿故事；功能因环境或数据未成功时不要伪造成功截图。
   - **不得将设计稿、AI 生成图片、静态伪 UI 当成真实试运行截图。** 如只能展示 UI 概念图，必须显著标 `Concept illustration`。
   - 运行测试与截图流程不可泄漏 API key、本机真实路径、用户名、科研数据、私有 Workspace 或聊天敏感信息。调用真实 DeepSeek API 会产生费用，**未经用户明确授权不得发起付费 API 请求**；无授权时先采用已有真实、可核查的运行截图和离线示例，并把需要实时 API 的步骤列入待补。

4. `Repository & Documentation`
   - 用简洁方式展示 Python/R、DESeq2、Streamlit、受约束的 LLM API、工作流编排、自动化测试、项目级 provenance 等技术实现。
   - 页面可展示来源明确的测试摘要，但不必列出每个 Phase 的日志。测试通过数、跳过数、Docker 完成状态、真实 API/R 测试状态必须来自同一个确定版本的真实报告，并注明适用范围。
   - 本地最新版本可能明显领先公开 `README.md`（其公开版本曾记录较早 preview/NOT READY）。**先检查最新本地源码和报告，不要用过时 README 覆盖经过验证的新状态，也不能自行认定稳定正式发布**。如果本地源码不可访问，依据公开仓库写可核实的基本功能，并将新功能与测试状态标为待验证。
   - 提供 GitHub Repository 和经过核实的正式文档链接；`Live Demo` 只有部署成功且公开可访问时才出现。

**英文导语种子（可润色并翻译）：**
“Bulk RNA-seq analysis often requires researchers to move between data preparation, command-line tools, statistical workflows, and visualization scripts. This project brings these steps into a project-based workspace where natural-language requests are translated into structured, validated tasks executed by predefined R and Python tools. The design emphasizes traceable results and controlled computation instead of unrestricted AI-generated analysis code.”

### T2 — Personal Portfolio Website（当前网站本身）
**展示标题：** `BIOINFORMATICS ARCHIVE — Interactive Research Portfolio`
**仓库：** `https://github.com/Azure179/Azure179.github.io`

1. `Project Overview`：为什么建设独立网站——将科研成果和 AI/软件工程作品组织为跨学科访客易于浏览的档案，而不是重复在线简历。简短提及 RhineLabUI 是视觉/交互参考（应有准确开源署名）。
2. `System Architecture & Workflow`：根据当前真实工程绘制 `Astro content/routes → 3D Homepage (Three.js) / Static Detail Pages → GitHub Actions → GitHub Pages`，解释为何将 Three.js 控制在首页、用结构化内容维护研究资料、支持直接访问的静态页面。技术栈只列实际安装并使用的技术。
3. `UI Gallery`：通过真实浏览器截图展示双文件夹首页、横列项目/纵向档案、展开文档阅读器、移动端/降级视图；建议有一张流程图解释 `Home → Portfolio Folder → Project Column → Section → Document Viewer`。不使用概念渲染冒充实装 UI。
4. `Repository & Development Log`：展示 GitHub 链接、设计取舍、响应式与可访问性；用 3–5 条里程碑概括开发过程，无需技术日志全文。

**英文导语种子：**
“BIOINFORMATICS ARCHIVE reimagines a personal research website as a navigable digital archive. A lightweight 3D entry experience groups academic research and software projects, while structured content pages keep publications, scientific figures, implementation details, and source links readable and easy to share.”

## 5. 图片与图表交付规范

- **优先级**：本人有权使用的真实论文图 / 真实应用截图 > 使用已公开事实原创绘制的流程图与概念图 > 经明确标注的合成数据示例。不要抓取随机网络图片填充“研究成果”。
- 每个 Academic 项目尽量有 1 张核心 Workflow 图和 2–4 张已获授权的 Representative Figures；每个 Technical 项目尽量有 1 张架构图和 4–6 张真实截图。**数量是设计目标，不是编造图片的理由。**
- 对外图片必须有可读 caption、描述性 alt、来源与版权/许可字段；允许用户点击放大，适当压缩/延迟加载，避免大图阻塞 Three.js 首屏。
- 优先使用可编辑、可维护的 SVG 或 HTML/CSS 组件制作流程图；若不符合性能或可访问性要求则输出 SVG/PNG 静态版本。所有图示须在 caption 中注明是 `Conceptual workflow` 还是 `Actual application screenshot` / `Published figure`。
- 已发表论文的原图版权**逐篇核查**，不能因为能在线阅读就默认可以修改并再发布。无清晰授权时可用简短文字与 DOI 链接或自行原创概念图代替。
- 不上传未公开实验室数据、真实测序矩阵、样本标识、内部路径、原始软件日志、真实 API key、未经清理的截图或尚未发表的核心结果。
- 缺少的素材放入 `docs/CONTENT_ASSET_TODO.md`，填写所属项目、目标位置、建议内容、所需来源、授权状态和优先级。不要用虚构内容蒙混过关。

## 6. 内容呈现与网页实现

- 保留现有 3D 档案矩阵：横向 A1/A2/A3/A4 或 T1/T2；纵向 Section 顺序不变。
- 默认英文，中文版本语义一致，不翻译 DOI、链接、软件名和基因符号。
- `Representative Figures` / `Screenshots & Outputs` 使用适配现有阅读器的主图、缩略图或图片画廊，并支持点击放大、键盘关闭和移动端阅读。
- 科学方法/软件流程图尽量使用短标签和方向清晰的连接线；不要堆砌大量小字。
- 项目数据与三维渲染解耦，图文更新不需要改 Three.js 逻辑；若已有 Content Collections，请复用现有 schema 并合理扩展。
- 没有真实 URL 的论文/视频/下载按钮应隐藏或禁用，不能做没有作用的按钮。链接使用明确说明，如 `View publication`、`View source`、`Read documentation`。
- 首页 Contact/Profile 导航不变。只在内容区修改，不重做视觉系统。

## 7. 分阶段执行与验收

请**直接实施**，但按小批次提交本地修改、运行检查：

1. **Audit**：盘点现有六个项目的内容缺口、已存在的图片、论文信息和可获取的 T1/T2 真实源码。生成 `docs/CONTENT_SOURCE_REGISTER.md`，记录证据和信息是否公开。
2. **Content modeling**：按现有架构建立六项目、四 Section 的中英文内容；每个 Section 不能只有一个标题。不得捏造数字、DOI、作者/排名或图表。
3. **Diagrams**：为 A1–A4 制作原创科学流程示意；为 T1/T2 制作软件架构或交互流程图。先处理所有能够安全生成的 SVG/HTML 图。
4. **Technical media**：优先完善 T1 为完整产品故事、T2 为网页案例。安全条件允许时用合成数据真实运行 T1 并采集真实截图；无法运行时整理明确缺口而不是模拟造假。
5. **Published academic assets**：核对 A1/A2/A3 正式发表论文及许可，使用已有且具权限的科研图，A4 保持公开保守边界。
6. **Review & QA**：检查六项目均能从各自 3D 档案列打开四个 Section；英文/中文、图片说明、外部链接、无失效图片、响应式和暗色/浅色（如现有）正常。

执行 `npm.cmd run build`（或项目已设置的等效脚本）、可用的类型检查和测试；如果有浏览器自动化条件，再做主要交互 smoke test。**必须区分通过的自动测试与未人工核验的视觉/移动端事项**。

完成后生成：
- `docs/PHASE3_2_CONTENT_INTEGRATION_REPORT.md`：已完成的页面、图表、截图、事实来源、实际测试与遗留问题。
- `docs/CONTENT_ASSET_TODO.md`：需要用户补充的科研图片、真实截图和许可证确认。
- `docs/CONTENT_SOURCE_REGISTER.md`：论文 DOI/官方来源、技术仓库报告路径及内容事实证据。

最终汇报按 A1/A2/A3/A4/T1/T2 分别说明：四份档案是否完成、哪些图是真实来源/原创流程图/合成演示、哪些待补。**禁止未经许可执行 `git push`、部署、修改其他仓库或付费 API 调用。**

现在先检查本地网站现状，然后尽可能完整地执行本阶段。不必等待我先上传六份旧草稿；缺少不可替代的真实素材时保留结构并在报告中列出，继续完成可安全实施的其余内容。
