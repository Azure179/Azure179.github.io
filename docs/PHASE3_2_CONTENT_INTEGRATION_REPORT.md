# Phase 3.2 真实内容整合报告

完成日期：2026-10-23。本阶段完成可公开核验的内容及素材接入；缺少原图、个人贡献或实时演示证据的部分保留明确占位，未将其报告为完成。没有 push、部署、付费 LLM 调用或修改 T1 原仓库。

## 1. 六个项目的交付状态

所有项目维持既有四份档案及顺序，中英文使用相同稳定 ID。共 6 项目 × 4 档案 × 2 语言 = 48 个阅读器内容入口。

| 项目 | 四份档案与证据 | 图像交付 | 未完成素材 |
| --- | --- | --- | --- |
| A1 黑鲷性逆转 | 背景、T/OT/O 设计、WGBS/RNA-seq 整合、正式论文；ncRNA/ceRNA 扩展不混写为已发表成果 | 双语原创工作流程与概念图 | 获许可的原始论文图、个人职责 |
| A2 高体鰤 T2T | 雌雄参考资源、已核查组装和质量指标、独立 DOI 与 Figshare 链接 | 双语原创流程与概念图 | 原图使用确认、个人职责 |
| A3 鱼类 DNMT | 31 种鱼 / 242 个 Dnmt、方法、表达关联边界、正式论文和共同贡献说明 | 双语流程图；官方 PMC 的真实图 2、3、7，CC BY 4.0 | 可选高清矢量图，无必要内容缺口 |
| A4 罗非鱼 eccDNA | 公开问题范围与分析思路；论文档案明确“正式公开后补充” | 双语概念图和流程图 | 公开授权、正式论文与真实结果图；不发布未发表坐标或统计 |
| T1 RNA-seq 平台 | 按产品使用路径描述工作区、六类工具、验证、编排、结果复用与来源 | 双语架构与 DAG 图；5 张真实合成数据应用截图 | 真实 LLM / 定制交互截图，可选 GO 与 DAG 详情截图 |
| T2 本网站 | 真实 Astro / 内容 / Three.js 分离架构、功能、来源与开发里程碑 | 双语架构图；4 张真实浏览器截图 | 真机截图及将来实际部署证据（非本阶段任务） |

A1 DOI 的 Crossref 编目为 Aquaculture 626 (2027)，2026-10 核查时已有公开条目；页面保留年份差异说明。A2 的 CC BY-NC-ND 原图没有被擅自复制或裁改。A3 原图保留原始英文标注并配中文图注，本站原创示意全部有中文版本。

## 2. 素材、内容模型与组件

- 10 套原创图示，每套英文 / 中文各一份，共 20 个可编辑 SVG。中文内容显式引用 `-zh.svg`，不是只翻译外围标题。
- 3 张 A3 正式结果图，5 张 T1 真实截图，4 张 T2 实拍浏览器截图。科研结果、原创示意、应用截图在图注和 `kind` 中明确区分。
- `figures.placement` 将图放到 overview / analysis / architecture / implementation / figures；避免全部挤进第三份档案。
- `mediaSlots` 保存缺图文字占位，不生成失效图片。新增 `published-review` 用于有论文证据、但个人角色尚未全部确认的内容；未公开 `outline` 仍禁止结果和论文关联，只允许原创示意。
- Publications 集合新增三篇论文的中英文记录；研究通过 `publicationIds` 引用。`citationNote` 解释日期或译名边界。
- 公共 `FigureLightbox` 使用原生 dialog，支持点击放大、Esc、焦点返回；图片链接保留无 JS / 新标签打开能力。事件委托兼容阅读器动态载入的正文。
- 仅调整内容组件与内容样式：修复 320px 下 DOI / 来源长字符串溢出。没有改变 3D 首页、阵列布局、横纵导航、动画及模型。

## 3. T1 实际验证及边界

只读检查用户指定最新本地工作树，基准提交 `ac69487846b308ee2657519341d1d91dde981397`，包含未提交和新增代码；不能称为该提交的干净复现。157 个源代码文件的前后 SHA-256 未变。运行在仓库外隔离副本，未复制 `.env`、私有 workspace 或真实数据。

本次使用 30 个合成基因、6 个合成样本，以及明确合成的 GO / KEGG 映射，调用真实 API / Registry / R：

- DEG、PCA、Volcano、Heatmap、GO、KEGG 六个技能均返回 HTTP 200 和 succeeded。
- 显式 `DEG → {Volcano, KEGG(up)}` 三步 DAG 完成。计划由测试脚本明确提供，不冒充 LLM 生成。
- LLM 网络请求在演示脚本中禁止，UI 使用空 key；未发起聊天请求。
- 富集阈值 1.0 只用于展示产物，截图不代表生物学显著性。实际 R 警告保留，没有改 UI 掩盖警告。Heatmap 可用 18 个基因，不伪称 20 个都可用。
- 页面另有上游 2026-10-20 的 Windows 1536 passed / 126 skipped / 2 warnings 和 Linux 选定 191 passed / 1 skipped 报告摘要；明确为上游结果，不计入本次复测。本次未重跑完整上游套件或 Docker 构建。

证据：`docs/qa/phase32/t1-source-hashes.json`、`t1-synthetic-validation.json`。实际应用截图保留了旧 UI 版本标签，其不代表本次快照的全部代码版本。

## 4. 验收结果

| 检查 | 结果及范围 |
| --- | --- |
| `npm.cmd run check` | 通过；0 errors / 0 warnings / 0 hints |
| `npm.cmd test` | 33 项通过，0 失败；内容、双语图示、论文关联、未公开边界及既有导航测试 |
| `npm.cmd run build` | 43 个静态页面构建成功 |
| `npm.cmd run check:site` | 43 页、1439 个内部链接 / 锚点通过；发布过滤、sitemap、许可证、内容页隔离 Three.js 检查通过 |
| `npm.cmd run format:check` | 通过；全部受检查文件符合 Prettier 格式 |
| 浏览器脚本检查 | 48 个双语档案入口均加载正确内容，无 reader 错误；结果见 `docs/qa/phase32/reader-checks.json` |
| 浏览器内容交互 | 静态页和 3D 阅读器内图片放大、Esc、焦点返回通过；关闭图片不退出阅读器 |
| 窄屏检查 | 桌面浏览器模拟 390px / 320px；T1、A3 正文无水平溢出（320px 视口下内容 clientWidth / scrollWidth 均为 305） |
| 控制台 | 本次 QA 标签页未发现 error 级日志 |
| 原实现保护 | 13 个 `src/scene/` 文件与本阶段前备份哈希一致；原 T1 157 个源码文件未变 |

构建仍有 Vite 大于 500 kB 的既有 Three.js 分块提示；它仅在首页按需加载，gzip 约 140.7 kB，不是构建失败。没有为内容填充改动渲染引擎。

浏览器操作和截图是本地桌面 Edge 检查；不等于真实手机、屏幕阅读器或所有浏览器组合验收。本次未做真实移动设备、正式无障碍审计、线上 GitHub Pages 或实时 LLM 验证，也未重新进行全部 GPU 泄漏压力测试。原 3D 交互未改动。

## 5. 修改文件清单

- 内容：`src/content/research/{black-porgy-sex-reversal,fish-t2t-genome,fish-dnmt-family,tilapia-eccdna}/{en,zh}.md`；`src/content/software/{llm-rnaseq-platform,bioinformatics-archive}/{en,zh}.md`。
- 论文：`src/content/publications/{black-porgy-methylomics,amberjack-t2t,fish-dnmt}/{en,zh}.md`。
- 类型：`src/content.config.ts`、`src/lib/portfolio-schema.ts`。
- 展示：`src/components/portfolio/{ResearchDetail,TechnicalDetail,PortfolioOverview,FigureGallery,FigureLightbox,MediaSlots}.astro`、`src/components/views/InfoPage.astro`、`src/layouts/BaseLayout.astro`、`src/pages/[...path].astro`、`src/styles/portfolio.css`。
- 素材：`public/media/diagrams/` 的 20 个图示；`public/media/research/fish-dnmt-family/figure-{2,3,7}.jpg`；T1 的 `workspace.jpg`、`pca.jpg`、`volcano.jpg`、`heatmap.jpg`、`kegg.jpg`；T2 的 `home-desktop.jpg`、`matrix-desktop.jpg`、`reader-desktop.jpg`、`reading-mobile.jpg`。
- 测试：新增 `tests/content-assets.test.mjs`，更新 `tests/portfolio.test.mjs`。
- 文档：`AGENTS.md`、`README.md`、`THIRD_PARTY_NOTICES.md`、`docs/ARCHITECTURE.md`、`docs/CONTENT_PLAN.md`、本报告、`docs/CONTENT_SOURCE_REGISTER.md`、`docs/CONTENT_ASSET_TODO.md`、`docs/qa/phase32/` 核查记录。

初始工作树整体未跟踪，未用 git diff 假装获得提交差异；保留本阶段前仓库外备份，并按文件核对。未执行 commit / reset，用户的 `test` 文件保留。

## 6. 后续填写与预览

详细缺口、**各内容文件准确行号、放图目录、双语填写示例、论文关联和占位移除方法**见 [CONTENT_ASSET_TODO.md](CONTENT_ASSET_TODO.md)。来源、许可与事实依据见 [CONTENT_SOURCE_REGISTER.md](CONTENT_SOURCE_REGISTER.md)。

本地运行 `npm.cmd run dev`，打开终端输出的地址（默认 `http://127.0.0.1:4321`）；检查生产产物可运行 `npm.cmd run preview`。本阶段未新增 GitHub Actions 部署流程，也没有宣称网站已经上线。
