# Phase 3 资料清单

当前只展示用户提供的研究范围、可核查的软件行为与本地网站实现。以下缺失项不以示例或推断补齐。请勿提供 API Key、私人目录、敏感原始数据或未经授权的全文。

## 通用信息

- 可公开姓名、英文署名、教育与任职信息、简历、邮箱、ORCID；About / Contact / CV 继续明确留缺。
- 各项目起止时间、完成状态、本人角色、具体贡献与合作者职责边界。
- 研究成果逐项区分：已发表、未发表但允许公开、待验证假说。敏感未发表内容不进入公开仓库。

## 科研项目与论文

每篇论文请提供题名、完整作者顺序、期刊、年份、发表状态、DOI、出版社 URL 和项目对应关系。PDF 可供核查；上传全文至公开网站另需分发许可。当前没有可发布的论文记录，不按主题或姓名猜测论文归属。

| 独立档案 | 待提供资料 |
| --- | --- |
| A1-01 黑鲷自然性逆转 | 论文 / DOI；组织与性别阶段、分组、重复、组学配对；RNA-seq / WGBS / lncRNA / miRNA / circRNA / ceRNA 分析记录；联合分析方法、确认结果与本人贡献 |
| A2-01 鱼类 T2T 基因组 | 物种、样本、测序设计、版本 / 登录号；完整性、污染、缺口、端粒及着丝粒证据；结构 / 功能注释、比较结果、独立论文与贡献 |
| A2-02 鱼类 DNMT | 物种与参考版本；家族鉴定、系统发育、共线性、结构及表达记录；独立论文与贡献 |
| A3-01 罗非鱼 eccDNA | 肌肉品质表型、分组与重复；eccDNA / RNA-seq 样本对应关系；识别、质控、注释、差异表达与联合分析；独立论文与贡献 |

科研图片需提供原图、所属项目、图题、图注、替代文本、出处与使用权限。附比较方向、版本、单位、阈值及必要统计说明。eccDNA 图表、PCA、火山图、富集图只能来自确认后的实际分析；工作流程可依据确认方法重新绘制。

## T1 — LLM-RNAseq-Platform

- 已只读核查公开提交 e83af7f74992bd74af506cb783dbc146e1f1d0d7；更新需新提交 / 版本及对应报告。
- 本人贡献与协作署名待确认，不能根据仓库归属推断独立完成全部代码。
- 需实际输入 / 分组 / 聊天 / Workflow / Results 截图，以及 PCA、Volcano、Heatmap、GO / KEGG 输出。
- 每张图附软件版本、数据性质（合成演示或允许公开的科研数据）、图注与公开许可。
- 报告提到的 pca_browser.jpg、restored_volcano.jpg 不在公开源码中；本地 artifact 路径不等于可下载资源。
- 历史 Workflow DEG 跨聊天复用问题仍未解决，须新证据才可改状态。
- 未核实公开部署，不显示 Live Demo；本地启动不代表在线服务。

## T2 — 本站

- 本轮采集的页面截图注明为本地开发构建。
- GitHub Actions / Pages 发布未执行。真实手机、正式读屏和线上验证留待后续。

## 收录规则

Phase 3.1 Contact 面板新增 `education`、`researchInterests`、`technicalSkills`、`professionalResumePath`、`scholarUrl` 字段，当前均未提供。GitHub 使用已确认的 Azure179 账户链接。请补充可公开的中英文个人简介、教育经历 / 研究兴趣 / 技术技能、邮箱、Academic CV 和 Professional Resume；Google Scholar 仅在有真实地址时显示。所有既有科研结果、论文与图像 TODO 继续有效，新增导航不代表资料已核实。

- 科研图片：public/media/research/<project-id>/；软件截图：public/media/software/<project-id>/；原创示意：public/media/diagrams/。
- figures 必填 title、alt、caption、source、permission、kind、width、height。原图链接支持无 JavaScript 放大。
- 论文集中维护于 src/content/publications/，科研通过 study.publicationIds 引用 translationKey。
- 资料核验后将 study.stage 从 outline 改为 verified-study，并补全角色、状态、贡献、日期与证据，不能仅切换状态规避校验。
- 中英文共享 translationKey / archiveId / slug；英文 revision 更新后中文 sourceRevision 同步。
