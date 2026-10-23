# BIOINFORMATICS ARCHIVE 发布前检查报告

日期：2026-10-23。已完成用户要求的内容精简、PNG 接入及 GitHub Pages 发布准备，未执行 commit / push 或线上部署。

## 本次完成

- 删除技术详情的「问题与动机」「状态与证据」，删除研究记录提示和本人贡献展示，保持四份档案与稳定路由。研究资料仍存于结构化内容和来源登记，不再向访客展示编辑说明。
- 清理科研正文的内部审阅措辞，用背景、分析步骤和关联性发现直接表达研究内容。A4 保留研究问题与流程，不补造结果或论文。
- 图片下方只保留类别：应用内截图 / 已发表科研图片 / 概念与流程示意；A4 三张显式标为图片占位。详细出处和许可保留在 Credits 与文档。
- 9 张用户 PNG 全部接入：A1 3 张、A2 2 张、A4 3 张占位、T1 1 张助手截图。保持文件名与路径，构建时自动读取 PNG 尺寸。T2 阅读器与窄屏截图已更新。
- 双语 SVG 清理重复的“原创”标签、编辑说明和冗余边界提醒；技术架构图同步反映新增 Actions 配置。
- About / Contact / CV 隐藏未提供的个人字段与空下载入口，保留真实 GitHub。没有编造个人履历。旧 template URL 仍存在，改为简洁作品集入口且保持 noindex。
- 建立 `.github/workflows/deploy.yml`，main 更新后执行检查、静态构建及 Pages 部署；site 不含 base 子路径。
- package-lock.json 已纳入 Git 索引（A），未提交；未将其他未提交文件擅自纳入提交。初始仓库没有本地提交。

## 实际验证

| 项目 | 结果 |
| --- | --- |
| Node / npm | 本地 v24.20.0 / 11.19.0，与 CI 配置一致 |
| 类型检查 | `npm run check`：0 errors / 0 warnings / 0 hints |
| 单元测试 | `npm test`：34 项通过；包含 PNG 同名替换后的实际尺寸读取 |
| 格式 | `npm run format:check` 与 deploy.yml 的 Prettier 校验通过 |
| 构建 | `npm run build` 成功，43 个静态页面 |
| 链接与栏目 | `npm run check:site`：1384 个内部链接 / 锚点通过；manifest 所指内容栏目全部存在 |
| 发布资源 | `npm run check:release`：48 个 public 文件，1384 个大小写敏感引用通过；产物约 4.54 MiB；静态资源与原文件哈希相同 |
| 干净依赖安装 | 仓库外新目录 `npm ci` 安装 302 个包成功，使用该目录依赖独立 build / check:site 成功 |
| 双语浏览器阅读器 | 48 / 48 个项目档案入口通过，QA 标签无 error 日志 |
| 图片交互 | 新 PNG 实际加载、静态页图片放大与关闭通过；3D reader 正常显示 PNG 与简短图注 |
| 窄屏 | 桌面 Edge 模拟 390px 的 T1、320px 的 A4 无横向溢出；A4 三个占位路径正确 |
| 原场景保护 | src/scene 中 13 个文件与修改前备份完全相同 |

仍有原有 Three.js 大于 500 kB 的压缩前 chunk 提示；仅首页动态加载，gzip 140671 B，内容页 JS 474 B，未引入新渲染资源或场景改动。

本次不是实际 GitHub Actions 运行或 Linux runner 实测。大小写检查在本地显式模拟 Linux 路径要求；完整 CI、Pages URL、线上网络与真实手机需要首次发布后验证。未重新执行全部 GPU 压力测试，也没有调用 LLM API 或修改 T1 原仓库。

## 可复查记录

- `docs/qa/release/reader-checks.json`：48 个双语阅读器入口。
- `docs/qa/release/assets.json`：9 张新 PNG 的路径、尺寸、SHA-256、占位状态。
- `docs/qa/release/scene-preservation.json`：13 个场景文件前后比对。
- `docs/qa/release/reader-png.jpg`、`mobile-content.jpg`：本轮实际界面截图。
- `docs/RELEASE_CHANGED_FILES.md`：相对本轮修改前备份的文件清单。

## GitHub 配置与后续操作

workflow 使用官方 checkout / setup-node / upload-pages-artifact / deploy-pages，显式 `npm ci` 和发布前检查，不上传源码目录作为 Pages 产物。Pages 只接收 dist；仓库仍需提交源码及 lockfile。

GitHub 网页上选择 **Settings → Pages → Source: GitHub Actions**，确认 Actions 策略允许运行，再上传 main。若空仓库首次 push 时还未选择 Source，可配置后重新运行工作流。完整命令、权限、分支和上线检查见 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)。

本轮参照 [Astro 官方 GitHub Pages 文档](https://docs.astro.build/en/guides/deploy/github/)，并采用显式安装与构建步骤保证锁文件和现有检查可控。不能将本报告的“本地通过”解释为网站已上线。

图片替换方法见 [CONTENT_ASSET_TODO.md](CONTENT_ASSET_TODO.md)。A4 占位是用户明确保留项；邮箱 / CV / Scholar 未提供时保持隐藏，不阻塞站点技术发布。
