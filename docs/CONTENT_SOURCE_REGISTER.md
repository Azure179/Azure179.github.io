# Phase 3.2 内容来源登记

核查：2026-10-22—23。仅在作品集仓库写入公开内容；T1 原工作树只读。原始科研数据、私人工作区、凭据及本机路径未复制到公开目录。

## 发布准备更新（2026-10-23，优先于下文历史素材缺口）

用户随后提供并要求加入 9 张 PNG：A1 `Fig 5.png` / `Fig 6.png` / `Fig 9.png`，A2 `Fig 1.png` / `Fig 2.png`，A4 `Fig 1.png` / `Fig 2.png` / `Fig 3.png`，T1 `Fig1.png`。文件均保持原样；A1、A2 分别关联本登记中的正式 DOI。A4 三张为白色占位文件，类型为 placeholder，不计作发表成果。T1 新截图是用户提供的真实助手界面；没有把它计入此前合成数据复测，也未为它调用 API。

新图的提供和纳入指令来自本次用户消息；并未据此向访客授予新的图片再使用许可。详细出处与必要许可保留于 Credits 和 THIRD_PARTY_NOTICES.md；逐图下方仅显示简短类别。新增图片 SHA-256、尺寸及引用路径见 `docs/qa/release/assets.json`。研究语句改为面向访客的介绍，事实来源不变。

## A1：黑鲷自然性逆转

- 正式题名、作者顺序、期刊、卷号、文章号：Crossref 官方元数据，DOI [10.1016/j.aquaculture.2026.744391](https://doi.org/10.1016/j.aquaculture.2026.744391)。元数据摘录保存在 `docs/qa/phase32/publication-metadata.json`。
- 公开出版商条目：[Aquaculture article](https://www.sciencedirect.com/science/article/abs/pii/S004484862600774X)。研究范围采用公开摘要与用户本阶段需求中确认的 T / OT / O、WGBS / RNA-seq；未复制全文或未核验的位点级结论。
- 日期边界：Crossref `published-print` 为 2027-01，卷 626、文章 744391；2026-10 核查时条目已公开。页面采用编目年份 2027 并解释该差异，没有推测精确 online 日期。
- 图片：原创双语流程与背景示意；不包含测量数据。未取得明确再分发权限的 Elsevier 原图不复制，预留待补位置。个人职责尚未独立核实。
- ncRNA / ceRNA 仅说明独立扩展方向；没有公开网络或未发表结果。

## A2：高体鰤参考基因组

- [Scientific Data 原文](https://www.nature.com/articles/s41597-026-07505-8)，DOI `10.1038/s41597-026-07505-8`，2026-05-29，13:1226；作者顺序以官方记录为准。
- 正文支持：雌雄各一个个体；HiFi、超长 ONT、短读长、Hi-C；hifiasm / Verkko、组装整合、补洞、抛光、HapHiC、注释；各 24 条染色体，雌 685.5 Mb / 雄 683.2 Mb，**基因组** BUSCO 99.4% / 99.3%。没有混用 annotation BUSCO，也未将两个个体解释为群体性别差异证据。
- 公开数据项目：PRJCA047743、PRJNA1443653；[注释文件 Figshare](https://doi.org/10.6084/m9.figshare.30334594.v1)。页面不声称已重新下载或分析原始测序数据。
- 官方许可记录为 **CC BY-NC-ND 4.0**。本次只使用事实重新绘制原创概念流程，不复制、裁改或重发论文图。公开可读或截图不自动解除许可条件；单独数据库资源需要单独核对。
- 个人分析职责保留待确认，不依据第一作者身份推断具体贡献。

## A3：鱼类 DNMT

- [Biomolecules 原文](https://www.mdpi.com/2218-273X/15/6/896)，DOI `10.3390/biom15060896`，2025-06-18，15(6):896。
- 全文与图注通过 [Europe PMC 官方 JATS 接口](https://www.ebi.ac.uk/europepmc/webservices/rest/PMC12191198/fullTextXML) 核查；公开数据库条目 [PMC12191198](https://pmc.ncbi.nlm.nih.gov/articles/PMC12191198/)。完整 XML 仅缓存于仓库外临时目录。
- 证据：31 种鱼、242 个 Dnmt；黑鲷 5 个家族成员；MAFFT / IQ-TREE、共线性、结构域与表达分析。Fig.7 是 qRT-PCR / RNA-seq 柱状图，不是热图；不将表达关联写作因果验证。
- CRediT 明确将 B.D. 与合作者列入 formal analysis、validation、visualization。页面保留共同贡献措辞，不写独立完成。
- 图片按 **© 2025 the authors, CC BY 4.0** 再分发，保留原图、原作者、论文链接及图号。没有改图或重新计算结果：
  - `public/media/research/fish-dnmt-family/figure-2.jpg` — [官方 CDN 原图](https://cdn.ncbi.nlm.nih.gov/pmc/blobs/937f/12191198/b936dfbe5485/biomolecules-15-00896-g002.jpg)：系统树。
  - `figure-3.jpg` — [官方 CDN 原图](https://cdn.ncbi.nlm.nih.gov/pmc/blobs/937f/12191198/b12c1bf11662/biomolecules-15-00896-g003.jpg)：共线性。
  - `figure-7.jpg` — [官方 CDN 原图](https://cdn.ncbi.nlm.nih.gov/pmc/blobs/937f/12191198/92a27bba794a/biomolecules-15-00896-g007.jpg)：性腺表达。
- 原论文图保持英文标注，双语标题和说明由本站提供；**本站原创概念与流程图另外提供中文 SVG**。

## A4：罗非鱼 eccDNA

来源为用户确认的公开主题范围与本阶段正式需求。只展示研究问题、原创 eccDNA 概念及流程，不发布样本、分组细节、坐标、候选关联、统计图或完成状态。论文位置显示“正式公开后补充”，不造 DOI，也不推断稿件进度。

## T1：LLM-RNAseq-Platform

- 用户指定最新本地工作树；基于 `ac69487846b308ee2657519341d1d91dde981397`，**含未提交及新增代码，不能视为该提交的干净复现**；包版本 0.7.0。
- 只读检查 `src/bulk_rnaseq/{api,workflow,workspace,llm,manifests,skills}/`、`app/`、`config/`、`pyproject.toml`。
- `docs/qa/phase32/t1-source-hashes.json` 保存源代码相对路径及 SHA-256，不包含用户目录、密钥或真实数据路径。公开 GitHub README 可能落后，页面不再用旧 e83af7f 的 NOT READY 状态覆盖新实现。
- `PHASE9_RUNTIME_REPORT.md`、`PHASE9_DOCKER_INTEGRATION_VALIDATION.md`、`PHASE9_WORKSPACE_CONFIG_REPORT.md` 的 2026-10-20 更新支持：Windows 1536 passed / 126 skipped / 2 warnings；Linux 选定 191 passed / 1 skipped，含 22 个真实 R 用例；Docker 非 root 运行、重启与跨平台持久化验证。这些是**上游报告**，没有作为本次新跑的测试数字。旧历史 NOT READY 段落不代表最新结论；也未把这些通过描述为生产认证。
- 源码确认当前 GO / KEGG 使用 `clusterProfiler::enricher` + 用户映射、合适背景与 BH 校正；无隐式在线注释。Streamlit 与 FastAPI 复用后端服务；没有虚构 UI 必须调用 HTTP API、数据库、队列或生产认证。
- 隔离副本只复制程序、配置、公开示例和测试；没有复制 `.env`、原 workspace、真实测序数据或 outputs。使用既有 Python / R 环境，禁写 Python bytecode，未安装或更新原仓库依赖。
- 本次真实运行：公开 synthetic counts（30 genes / 6 samples）+ 新建 synthetic GO / KEGG associations；DEG、PCA、Volcano、Heatmap、GO、KEGG 以及显式 `DEG → {Volcano, KEGG(up)}` DAG。通过 `TestClient` 调用真实 API / Registry / R，不伪造分析输出；手写明确计划不冒充 LLM 生成。
- DeepSeek 请求函数被演示脚本禁止调用；UI 进程使用空 API key，未输入聊天请求。没有付费调用。宽松富集演示阈值 `pvalue_threshold=padj_threshold=1.0` 只用于展示产物，**不构成显著性或生物学证据**。
- `docs/qa/phase32/t1-synthetic-validation.json` 是脱敏验证摘要；原始日志、输入和结果 JSON 留在隔离副本。运行中真实 R 警告未被伪装消失，UI 可能显示 `Inspect r_stderr.log`。界面旧版 Phase 6.5.3 / One request · One Skill 标签保留原样，不能据此推断快照实际代码版本。
- 实际浏览器截图记录当前隔离 Streamlit UI；项目名显式标识合成演示。尚未制作实时付费 LLM 与定制过程截图，已预留位置。

## T2：本网站

来源为当前工作树的 Astro 路由、内容 schema、共享 reader、Three.js 入口与资源清理代码、`astro.config.mjs`、既有验证报告。使用实际本地浏览器截图，不是概念渲染。

GitHub Pages 是托管目标；没有已授权部署 workflow，本阶段未新增 Actions、未部署、未 push。RhineLabUI MIT 改编的范围与版权继续以 `THIRD_PARTY_NOTICES.md` 和 `public/licenses/RhineLabUI-MIT.txt` 为准。

## 原创图与语言

`public/media/diagrams/*.svg` 为英文版，`*-zh.svg` 为中文版；各语言内容记录明确指向对应资源，不依赖浏览器自动翻译。科学符号、DOI、软件名不翻译。结构化 metadata 中的 `kind` 区分原创 diagram、真实 screenshot、已发表 research-result；`placement` 决定图位于哪个档案内容区。

缺失素材登记与手动添加步骤见 `CONTENT_ASSET_TODO.md`；占位只包含文字，不生成失效图片或虚假结果。
