# Phase 3 — 内容整合实施报告

完成日期：2026-10-21。本次完成本地可运行结构及有依据的内容整合；科研结果与论文材料仍待用户提供。未 commit、push、创建部署 workflow 或发布网站；未修改 LLM-RNAseq-Platform 原仓库。

## 已完成内容

1. 主导航调整为 Home / Academic / Technical / About / Contact；首页档案前两项为 Academic / Technical，保留 Publications / Profile / Contact、Skip Intro 和真实 HTML 目录。
2. 复用原有 Three.js 几何、动画、键盘、触摸、动态加载、轻量模式及清理逻辑。本轮没有改写 src/scene；保留 research / software 内部档案 ID。
3. Academic 总览按 A1 / A2 / A3 分组，四个独立详情：黑鲷自然性逆转、鱼类 T2T、鱼类 DNMT、罗非鱼 eccDNA。
4. 四项科研均明确标为“研究提纲 / 证据待补充”。仅记录用户提供范围，采用八栏目结构；没有填入未经确认的研究结果、样本量、论文身份或本人贡献。
5. Technical 总览按 T1 / T2 排序。T1 是 LLM-RNAseq-Platform 源码核查案例；T2 是本站本地开发案例，采用九栏目结构。
6. T1 记录实际 Python/R、Streamlit、DeepSeek、Registry、串行 Workflow、Workspace、结果保存及已知限制。保留 Phase 7.8 NOT READY，测试数字注明上游阶段、报告时间与非本次复测。
7. T2 区分已实现 Astro / TypeScript / Tailwind / Three.js 与尚未配置的 GitHub Actions、尚未发布的 Pages；明确 RhineLabUI 灵感来源与授权边界。
8. 科研、软件、论文继续使用独立 Astro 内容集合。科研通过逻辑 publicationIds 关联论文，未知或非公开引用阻止构建。论文题名、作者、期刊、年份、DOI、URL 集中维护。
9. 原创软件结构示意两张，本站真实桌面 / 手机宽度截图两张；图像具有标题、alt、caption、来源、许可和尺寸，支持原图新标签页放大，无额外图库脚本。
10. 全部六项内容均有中英文记录；共享 translationKey、archiveId 与 slug。修复 glob 默认 slug ID 导致的双语覆盖，改用显式文件路径 ID。

## 路由与兼容

以下路由均有 /zh/ 对应页，默认英文无前缀：

| 类型 | 英文 URL |
| --- | --- |
| 学术总览 | /academic/ |
| 技术总览 | /technical/ |
| 黑鲷 | /research/black-porgy-sex-reversal/ |
| T2T | /research/fish-t2t-genome/ |
| DNMT | /research/fish-dnmt-family/ |
| eccDNA | /research/tilapia-eccdna/ |
| RNA-seq 软件 | /projects/llm-rnaseq-platform/ |
| 本站案例 | /projects/bioinformatics-archive/ |

保留 /research/、/projects/ 旧总览，显示新入口提示；详情继续使用既有 research / projects 路径前缀，无需迁移已有深链接。Publications、About、Contact、CV、Credits 与模板路径保留。模板继续 noindex。

## 主要文件

| 文件 / 目录 | 改动 |
| --- | --- |
| src/components/site/Header.astro、src/data/archive.ts、src/i18n/ui.ts | 双作品集导航与双语档案入口 |
| src/lib/routes.ts、src/pages/[...path].astro、src/layouts/DetailLayout.astro | 新总览、统一详情、语言切换、父级入口及本地化状态 |
| src/content.config.ts、src/lib/portfolio-schema.ts | 显式 ID、研究 / 案例结构、证据状态、图像元数据、DOI / URL |
| src/lib/content.ts、src/lib/publication-links.ts | 公开论文关联与缺失引用校验 |
| src/components/portfolio/、src/data/portfolio.ts、src/styles/portfolio.css | 总览、八 / 九栏目详情、流程图及图库 |
| src/content/research/、src/content/software/ | 四个研究提纲与两个案例的 12 个双语记录 |
| public/media/ | 原创架构图、本地开发截图及科研图片目录约定 |
| tests/portfolio.test.mjs、scripts/check-site.mjs | 引用、提纲边界、图像元数据、详情栏目与双语链接检查 |
| README.md、AGENTS.md、四份规划文档 | 当前阶段、内容维护规则与架构说明 |
| docs/CONTENT_TODO.md、docs/PHASE3_SOURCES.md | 材料缺口与固定版本来源核查 |

未添加依赖。用户原有 test 文件保持 0 字节和原修改时间。仓库现有文件仍未被擅自提交。

## 验证结果

环境：Windows、Node 24.20.0、npm 11.19.0；已安装 Astro 7.4.1 / Three.js 0.186.1。生产构建后在本地 Edge 验证，未做线上或真机测试。

| 检查 | 结果 |
| --- | --- |
| npm run check | 43 个文件，0 errors / warnings / hints |
| npm test | 16 / 16 通过，含原有内容与场景测试 |
| npm run build | 37 个静态 HTML 页面成功生成 |
| npm run check:site | 1157 个内部链接 / 锚点通过；全部六项双语详情及固定栏目、语言切换通过 |
| npm run format:check | 通过 |
| 内容隔离 | 草稿、private starter、QA harness 不进入产物；模板 noindex；MIT 许可证存在 |
| 3D 隔离 | 内容页不导入场景及控制器；浏览器进入 Technical 时 canvas 数为 0 |

gzip 实测：首页 bootstrap 2892 B、内容页 JS 194 B、按需 3D 135838 B（约 133 KiB）、CSS 8966 B、最大 HTML 5928 B。Vite 仍提示 Three.js 压缩前分块超过 500 kB；未屏蔽该提示，按需 gzip 体积在原预算内。

浏览器检查：

- 桌面：学术档案展开、方向键切换技术档案、OPEN ARCHIVE 导航、返回、关闭按钮及 Escape 关闭成功。
- 轻量模式：0 canvas，五个 HTML 入口保留。
- 故障注入模拟 WebGL 不可用：回退轻量，0 canvas / active contexts，仍可访问双作品集。
- 移除首页全部脚本：0 script / canvas，五个 HTML 链接存在，可进入 Academic，显示四张研究卡片。
- 中文黑鲷详情的八栏目与对应语言链接正常；中文 RNA-seq 详情九栏目完整。
- 390px 中文总览、320px 中文长标题技术详情无横向溢出；移动菜单可展开。
- 原图链接实际打开新的图片标签页，图库渲染正常。本站图库新标签页控制台无 warning / error。
- 返回导航时曾捕获一条“Could not establish connection. Receiving end does not exist.”消息；未定位到本站代码来源，新建图库标签页未复现。不将本轮报告写为所有浏览器日志绝对为零。

未重新执行 Phase 2 的完整五轮 GPU 生命周期矩阵，本次保留原场景单元测试并复查轻量清理与 WebGL 回退。未验证真实手机、200% 浏览器缩放、正式读屏或线上 Pages；不以桌面窄屏代替真机。

## 尚缺材料

完整清单见 [CONTENT_TODO.md](CONTENT_TODO.md)：论文 PDF / DOI / 完整作者与发表状态；实验设计及方法；科研原图、图注与使用权限；实际个人贡献；RNA-seq 真实截图和输出版本；公开身份、CV 和联系方式。

T1 依据 [固定提交](https://github.com/Azure179/LLM-RNAseq-Platform/tree/e83af7f74992bd74af506cb783dbc146e1f1d0d7)，来源明细见 [PHASE3_SOURCES.md](PHASE3_SOURCES.md)。不将未提供的截图或未发表敏感结果带入站点。

## 本地预览

```sh
npm run build
npm run preview -- --port 4322
```

打开 http://127.0.0.1:4322/academic/ 或 /technical/，中文加 /zh/。开发时使用 npm run dev。若 PowerShell 找不到 npm，按 README 临时将 C:\Program Files\nodejs 加入当前终端 PATH。

本轮验证用的预览进程在收尾时停止；未停止用户其他端口的服务。后续发布仍需用户明确授权。
