# Archive visual & reading polish

日期：2026-10-22。范围：用户在 Phase 3.1 后提出的五项模型、动画、阅读排版和首页精简要求。本地实现；未 commit、push 或部署。没有修改 LLM-RNAseq-Platform 原仓库。

## 实现结果

| 用户反馈 | 本轮实现 |
| --- | --- |
| 首页文件夹简单、与内部模型不协调 | 首页与阵列共用原创 CassetteKit：圆角金属壳、深色接缝、边轨、螺钉、透明盖、内页层叠、细小橙金标记；活动模型加入立体登记模块。使用程序化环境照明，无外部 GLB / HDR 资产。 |
| 一级进入二级缺乏逻辑过渡 | 文件夹盖抬起、内页展开、镜头靠近，切换时传递选中模型的世界位置与旋转；阵列从下方进入，共用相机继续运动。返回首页也交接模型姿态。 |
| 项目切换僵硬 | 位置、选择抬升、镜头方向 / 目标 / 视野使用解析阻尼弹簧。改变方向保留当前速度；原选中卡匣逐渐归位，避免突然消失。 |
| 内容用弹窗、缺少抽取聚焦 | 先抽取档案并转向阅读构图，再显示非模态右侧正文。桌面左模型右内容，窄屏上模型下内容；正文复用原静态页面，可独立滚动，保留原图与论文链接。 |
| 主次不清、不能跨作品集导航 | 项目名称成为卡面、第二级摘要和阅读区的主标题；栏目名缩小为辅助标签。六个项目形成连续横向循环 A1→A2→A3→A4→T1→T2→A1，纵向仍为当前项目的四个栏目，并保留每项目位置。 |
| 首页文字目录重复 | 3D 首页全视口显示两个模型及操作控件，隐藏重复品牌目录、静态链接树和页脚。轻量 / 无 JS 模式继续显示真实目录，不影响内容访问。 |

## 状态、内容与资源

- 保留 Portfolio → Project → Section → Content 和稳定 translationKey / hash。`projectColumns()` 只建立全局列映射，不更改内容归属、静态路由或 Publications 引用。
- `HOME`、`PORTFOLIO_MATRIX`、`DOCUMENT_VIEWER` 继续互斥；Contact 仍保存进入前状态。阅读器开放行列切换；正文区域方向键保留正常滚动，场景方向键和明确控件负责档案导航。Esc 逐级返回。
- 阵列读取全部 24 个栏目。跨 Academic / Technical 只更新选中项，不重建场景。当前项目详情从原静态页面读取，保留取消过时请求和六页缓存。
- 打开文件夹等待 720ms，打开档案等待 900ms，让模型先完成主要动作；阅读区使用 440ms 轻微揭示。返回 / 历史 / Contact 可取消待完成的打开操作。减少动态效果和轻量模式跳过等待。
- 共享几何和材质，桌面 324 / 紧凑模式 120 个循环槽位、14 组 InstancedMesh；远处重复卡匣减少边轨细分，活动档案保留完整倒角、独立文字纹理和额外细节。桌面矩阵单帧渲染统计由 1,227,954 降至 170,418 triangles，紧凑模式为 53,646；这是渲染器计数，不是 FPS。无重型后处理。窄屏默认轻量，启用 3D 后关闭阴影。
- 阅读器打开后仍允许完成抽取动画，模型和相机稳定后停止 RAF；隐藏页面、Contact、离屏暂停，离页 / 切轻量模式清理资源。PMREM 环境生成器即时释放，只保留生成的环境贴图。

## 已执行的自动检查

环境：Windows、Node 24.20.0、npm 11.19.0；依赖版本及 package-lock 未变更。

| 检查 | 结果 |
| --- | --- |
| `npm run check` | 55 个文件，0 error / warning / hint |
| `npm test` | 26 项通过；包括跨作品集循环、独立栏目记忆、分享 hash、弹簧帧率独立性和改向速度连续性 |
| `npm run build` | 37 个静态页面成功生成；仍有 Vite 的异步引擎 chunk 大小提示，构建成功 |
| `npm run check:site` | 37 页、1167 个内部链接与锚点通过；草稿隔离、许可证、sitemap、首页专用 Three.js 检查通过 |
| `npm run format:check` | 通过 |

gzip 产物检查：首页 bootstrap 7215 B、内容页 JS 194 B、异步 3D chunk 140255 B、CSS 12382 B、最大 HTML 5929 B。它们是压缩产物体积，不是网络加载速度或 FPS 测量。

## 浏览器验证

验证使用本地生产构建和 Edge；故障注入工具仅运行在 4323，不进入 dist。窄屏使用 320px iframe，不能代替手机真机。

- 自动浏览器交互回归通过：选择 / 打开、行列分离、A4→T1→A4 与栏目记忆、真实静态正文读取、非模态阅读区、连续五次释放 / 重建、页面隐藏暂停、WebGL context loss 降级与重试、Esc 中断与两次触摸打开。早期回归的等待上限在浏览器后台 / 冷 GPU 绘制时超时，改用 60 秒稳态上限后完成；不能据此声称达到特定 FPS。
- 最终构建在背景模型减面和窄屏控件修正后再次完整通过，日志为 [lifecycle-final.txt](qa/archive-polish/lifecycle-final.txt)。日志末尾刚执行返回首页，`moving: true` 是尚在进行的归位动画；此前已有明确的稳态停止与资源数量恢复断言。保留减面前通过日志供区分版本。
- 桌面实际检查：T2T 主标题、模型抽取和右侧正文；阅读关闭、浏览器后退恢复阅读状态、前进恢复矩阵、Esc 返回首页；语言切换、Contact 内容、Skip Intro 恢复静态目录。
- 320px 中文实际检查：默认轻量、启用 3D、进入矩阵、T2T 阅读区、阅读期间 A4→T1。文档 clientWidth / scrollWidth 均为 320，无横向溢出。修正了旧矩阵样式优先级导致的重复控件；阅读时仅保留面板内四向控件。
- 降级检查：模拟 WebGL 不可用后为 0 canvas / 0 context，仍能进入矩阵导航和读取真实正文；模拟 reduced-motion 后默认轻量，Three.js 引擎请求为 0；移除脚本的无 JS 页面仍显示两作品集真实链接与静态目录。它们是故障注入检查，不等于覆盖所有不支持 WebGL 的真实设备。
- 控制台：生命周期捕获的应用 error / unhandledrejection 为零。一个长期使用的生产预览标签页出现一次 `Could not establish connection. Receiving end does not exist.` 连接错误；没有对应应用异常栈，不将它隐去或作为应用代码无误的证明。

截图：[首页](qa/archive-polish/home-desktop.jpg)、[桌面矩阵](qa/archive-polish/matrix-desktop.jpg)、[桌面阅读](qa/archive-polish/reader-desktop.jpg)、[320px 矩阵](qa/archive-polish/matrix-320px.jpg)、[320px 阅读](qa/archive-polish/reader-320px.jpg)。均为本地网站实际渲染，不是生成的功能截图。

## 文件清单与内容保护

开始前仓库均为未跟踪文件。通过仓库外的本轮前置 ZIP 逐文件 SHA-256 对比确认：没有删除基线文件，科研 / 论文 / 两个技术项目正文和原详情组件未改写，用户 `test` 保留。未添加依赖。

| 范围 | 文件 |
| --- | --- |
| 新模型与运动 | 新增 `src/scene/CassetteKit.ts`、`FolderField.ts`、`motion.ts`；修改 `ArchiveScene.ts`、`MatrixField.ts`、`types.ts` |
| 导航与阅读 | `src/lib/archive-model.ts`、`src/scene/bootstrap.ts`、`src/scene/reader.ts` |
| 页面与样式 | `src/components/archive/ArchiveTerminal.astro`、`src/components/views/Home.astro`；新增 `src/styles/reading-layout.css` |
| 测试 | `tests/archive-navigation.test.mjs`、`tests/browser/harness.js`；新增 `tests/motion.test.mjs` |
| 文档 | `AGENTS.md`、`README.md`、`THIRD_PARTY_NOTICES.md`、`docs/ARCHITECTURE.md`、`docs/DESIGN_SPEC.md`、`docs/IMPLEMENTATION_PLAN.md`、本报告、`docs/qa/archive-polish/` |

## 参考与待人工验收

继续参考 [RhineLabUI](https://github.com/LBEILC/RhineLabUI) 固定提交 `12cc5e4013acb9408f753ff71de6b8492299b7c8` 的循环阵列、肩部起伏、镜头和运动逻辑；已保留改编代码的 MIT 许可和版权信息。本轮模型和文字纹理为原创程序几何，没有引入游戏标志、模型、图片或音效。Three.js addons 依照现有 MIT 许可使用。

仍需用户确认最终材质与镜头节奏的美术偏好，以及 iOS Safari / Android 真机、Firefox、屏幕阅读器、200% 缩放、低端 GPU 长时间性能。没有将主观相似度、浏览器窄屏模拟或预算写为实测百分比 / 真机验收。

## 本地预览

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm.cmd run dev
```

打开终端显示的地址，中文为 `/zh/`。生产预览使用 `npm.cmd run build` 后 `npm.cmd run preview`。第二级示例 `/#archive/academic/fish-t2t-genome/overview`；末尾加 `/read` 可直接分享阅读状态。
