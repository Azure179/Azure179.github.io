# Phase 3 来源核查

日期：2026-10-21。上游仅克隆到目标仓库外的临时参考目录；未修改、安装依赖、运行分析、调用 LLM 或复制科研数据。

固定提交：[e83af7f74992bd74af506cb783dbc146e1f1d0d7](https://github.com/Azure179/LLM-RNAseq-Platform/tree/e83af7f74992bd74af506cb783dbc146e1f1d0d7)。

| 固定提交中的来源 | 使用的事实 / 边界 |
| --- | --- |
| README.md | 本地 Streamlit、Phase 7.8 Preview、NOT READY、能力与运行限制 |
| pyproject.toml | 包版本 0.7.0；Python 3.13、Streamlit、Pydantic、httpx 等依赖 |
| docs/phase-0-design.md | 早期目标不能视为实现证据；clusterProfiler / GSEA / API / Docker 规划以当前代码为准 |
| docs/phase-7-4-workflow-executor.md | 串行拓扑执行、绑定、失败传播及 provenance |
| docs/phase-6-5-1-project-manager.md | 本地 Workspace、ProjectManager、元数据 |
| src/bulk_rnaseq/workflow/executor.py | 重新校验、调用 Registry、保存状态与输出 |
| src/bulk_rnaseq/builtin_registry.py | 六个实际分析绑定；GSEA executor 为 None |
| src/bulk_rnaseq/llm/client.py | httpx 调用 DeepSeek chat completions |
| src/bulk_rnaseq/r_scripts/enrichment_common.R | 单侧 Fisher 检验与 BH 校正 |
| PHASE7_E2E_REPORT.md | 2026-10-09–10 上游记录：默认 1191 passed / 96 skipped，真实 R 子集 37 passed，最终 NOT READY |

数字仅为上游报告引用，不是本次复测。README 与报告均保留历史 Workflow DEG 跨聊天复用问题。未将报告中的研究样本数、DEG 数量或生物学结果转移到学术作品集。

源码目录没有可复用的 PNG / JPG / SVG 软件截图。报告中的 outputs 文件未公开。本轮只绘制原创结构示意，不把示意图称为截图。

本站技术案例依据当前 package.json、Astro 配置、内容模型、路由、场景和 Phase 2 本地报告。GitHub Actions 未配置，Pages 未发布。

RhineLabUI 灵感参考提交为 12cc5e4013acb9408f753ff71de6b8492299b7c8；未复制上游代码或受限资产。Three.js MIT 许可证继续分发。

学术范围仅依据本次用户提供的 A1 / A2 / A3 主题。没有论文身份、DOI、结果图或贡献证据，因此发布的是明确标识的研究提纲。
