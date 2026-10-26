# Phase 3.3.1 — Infinite Archive Home Visual Polish

实施日期：2026-10-24。范围：本地首页增量精修。未执行 commit、push 或部署。

2026-10-25 已按后续反馈继续调整。以下第 1–10 节保留首轮记录；最新参数、简洁模式、联系信息与验证结果见第 11 节。

## 1. 现状与保护范围

开始时仓库已包含未提交的 Phase 3.3 实现。先检查 Git、AGENTS、架构/设计规范、MatrixField、ArchiveScene、OverviewBackdrop、OverviewPulse、bootstrap 和分类标签，在本地预览确认原画面。相关场景/UI 原文件另存于仓库外临时目录作为比对基线；保留全部既有改动及用户的 `test` 文件。

原首页的相机俯角约 44°，远近对比接近；规则阵列容易呈现平铺纹理。分类标题层级较弱，操作提示仅 11px、手机 9px。已有实例化、双世界锚点、局部波纹、单份抽取、连续推进可以复用。

本轮没有修改科研/技术正文、媒体、依赖、路由模型、Document Viewer 或二级矩阵布局。旧二级尺寸、间距、相机终点与导航逻辑保持。

## 2. 摄像机、纵深与光照

| 项目 | Phase 3.3 基线 | 本轮首页 |
| --- | --- | --- |
| 相机距离 | 180 | 174 |
| 归一化前方向 | (-0.58, 0.69, 0.43) | (-0.62, 0.61, 0.49) |
| 俯角 | 约 44° | 约 37.7° |
| 相对目标的垂直高度 | 约 124.3 | 约 106.3，降低约 15% |
| 视野跨度 | max(24, 28/aspect) | 保持 |
| 距离雾 | 无 | 浅米白，near=166 / far=219 |
| 半球光 | 1.35 | 1.17 |
| 主方向光 | 4.4 | 4.5 |
| 填充光 | 1.0 | 0.85 |
| 宽暖光 | 2.8 | 1.5 |
| 曝光 | 1.06 | 1.04 |

降低镜头让立面更易辨认；收敛均匀填充与宽暖光，保留方向性。远景使用深度雾逐渐降低对比，而非覆盖整个画面的白色面板。没有新增光源、后处理、贴图或大型装饰物。

相机变化使用原有 overviewGain 和弹簧追踪，未重写推进轨迹。进入二级后，光照恢复原二级值；雾近端移动至 501，超过相机 far=500，二级可见几何不受雾影响。避免切换 fog 有无导致反复编译材质。

降低视角后自动覆盖测试发现 320×844 最远角不足，已只增加竖屏远景覆盖系数（0.72 → 0.86）。桌面维持原实例覆盖预算；测试涵盖宽屏、窄屏和横屏，不暴露阵列边界。

## 3. 微地形与动态协调

参数集中在 `src/scene/overview.ts` 的 `OVERVIEW`，便于继续微调。

- 低频正弦乘余弦构成静态微地形，幅度 0.075，是档案高度 3.7 的约 2%。
- 两个真实分类锚点分别贡献高斯高度项，幅度 0.055、半径参数 7，平滑衰减；无平台、边界或模型倾斜。
- 保留原呼吸算法，幅度调整为 0.16 / 0.055，周期改为 10.6 / 14.3 秒，空间相位连续。没有另建第二套动画控制器。
- 波纹保持原双环结构和最大半径 3.6；时长 0.9 → 1.15 秒，环宽略增，透明度包络系数 0.55 → 1.05，邻近高度系数 0.075 → 0.12。它仍只响应选中位置，不成为大范围光斑。
- 单份档案抬升阈值与确认机制不变。

近景 CPU 高度合成与远景 GPU 着色器使用同组参数及同一档案世界原点；本体、导轨、索引标签和阴影深度材质同步。所有首页高度项在原 MatrixField 更新路径内乘 overviewGain，进入二级后归零。Reduced Motion 保留静态地形，关闭呼吸和波纹，可停止 RAF。

新增测试验证浅地形上限与相邻行连续性、Reduced Motion 无漂移、近景所有实例在返回二级后逐元素恢复相同变换、远景/阴影共用 uniforms。开发中修复了新增 GLSL 拼接缺少换行的问题，并增加对应回归断言；最终浏览器加载正常。

## 4. 分类索引、主题与提示

英文主标题为 ACADEMIC ARCHIVE / TECHNICAL ARCHIVE，副标题为 Research portfolio / Engineering portfolio；中文为学术档案 / 技术档案，副标题为科研学术集 / 项目作品集。

保留渐进展开：未选中展示分类名称与副标题；选中后浮出序号、来自 manifest 的项目数与 EXPLORE COLLECTION / 探索档案集按钮。当前自动得到 04 / 02 个项目，没有另行硬编码数量。

主标题增加字重，背景增加小范围柔和径向渐变，仍然悬浮于档案空间。选中标题及 SVG 折线加强金棕色对比；没有不透明卡片、粗框或背景模糊。折线终点继续由真实世界锚点投影，未改为空间无关的固定点。

Logo 下增加主题句：

- EN: Exploring Biology Through Data & Code.
- 中文：以数据理解生命，以代码拓展研究的边界。

桌面附带小号领域说明；手机隐藏辅助行，短屏压缩主题句。底部提示增加到桌面 13px、手机 11px，支持换行：选择一个档案集 · 再次点击或按 Enter 进入。文案符合现有实际交互。

中文 Contact 保持“联系我”。新增 UI 只在 HOME/3D 显示。

## 5. 本轮文件清单

以下是本轮修改范围，不等于所有未提交的历史变更：

| 文件 | 修改 |
| --- | --- |
| `src/scene/overview.ts` | 集中参数、静态地形、共享 GLSL、呼吸/波纹调节 |
| `src/scene/MatrixField.ts` | 地形进入原高度合成、真实分类地形锚点、新首页相机起点 |
| `src/scene/OverviewBackdrop.ts` | 远景与阴影同步地形、保留 reduced 静态高度、竖屏覆盖 |
| `src/scene/OverviewPulse.ts` | 原双环的宽度、透明度、时长调节 |
| `src/scene/ArchiveScene.ts` | 首页光照增量、平滑远景雾 |
| `src/components/archive/ArchiveTerminal.astro` | 双语分类层级、动态数量、主题句和操作提示 |
| `src/styles/overview.css` | 分类可读性、选中线条、手机及短屏样式 |
| `src/scene/bootstrap.ts` | 将现有选中状态同步到 SVG 样式，无导航状态变更 |
| `tests/overview.test.mjs` | 新增 3 项回归测试，更新相机/波纹预期 |
| `AGENTS.md` | 当前阶段边界 |
| `docs/ARCHITECTURE.md`、`docs/DESIGN_SPEC.md` | 增量架构与实际参数 |
| 本报告及 `docs/qa/phase3-3-1/` | 验证记录与真实截图 |

`ContactPanel.astro`、`archive-model.ts`、`types.ts`、导航测试等既有 Phase 3.3 改动保留，本轮没有继续修改。未修改 `src/content/`、`public/media/`、package 文件或 LLM-RNAseq-Platform 原仓库。

## 6. 自动化验证

环境：本机 Windows，Node 24.20.0 / npm 11.19.0；Astro 7.4.1、Three.js 0.186.1。

| 命令 | 最终结果 |
| --- | --- |
| `npm run check` | 73 文件，0 errors / warnings / hints |
| `npm test` | 51 / 51 通过 |
| `npm run format:check` | 通过 |
| `npm run build` | 成功生成 43 个 HTML 页面 |
| `npm run check:site` | 1384 个内部链接/锚点通过；3D 仅首页、草稿过滤、MIT 许可通过 |
| `npm run check:release` | 48 个 public 文件，大小写引用通过；产物 4.58 MiB |

构建保留原有 Vite 大于 500kB chunk 提示，来源为延迟加载的 Three.js 包，不是构建错误。

关键自动验收包括：世界锚点折线、连续循环/项目部分记忆、精确二级相机和实例终点、动画中断、微地形连续性、Reduced Motion、GPU 资源重复清理、移动像素预算、开屏降级、公开内容过滤。

## 7. 实际浏览器验证

使用本机 Edge 的真实 WebGL2 页面，主预览为 `http://127.0.0.1:4322/`；故障注入仅使用本地 4323 端口，未进入生产产物。

已实际操作/观察：

- 桌面首页及中英文分类，单击选择后数量/按钮浮出，另一分类收起。
- Academic / Technical 选中状态截图，真实锚点与标签引线。
- Enter 打开 Technical：单份抽取 → 连续推进 → overview=0、cameraMoving=false、busy=false 的二级终点。
- ArrowDown 切换 T1 到系统架构；ArrowLeft 到 A4，ArrowRight 回 T1 后保留系统架构部分。
- Enter 打开阅读器，实际中文正文与流程图链接载入；Esc 返回矩阵，再返回首页。
- 浏览器后退恢复首页、前进恢复矩阵；联系我面板打开时 paused=true。
- 中文 320×844、英文 320×568 的实际 3D 页面：分类不重叠、不超出窗口；英文短屏底部提示正常换行。手机宽度初始简洁模式可显式启用 3D。
- 英文 1366×768 笔记本视口：标签处于屏幕内，document 无横向溢出。
- Reduced Motion 注入：显式启用后 moving=false、cameraMoving=false，保留静态地形，能够直接进入二级。
- WebGL 不可用注入：自动退出开屏至简洁模式，点击真实学术作品集链接能打开静态总览。

最终干净的降级/Reduced Motion 3D 浏览器检查未出现应用或 shader 错误。早期调试标签页保留了修复前 shader 日志，不能将其当作最终版本错误。

## 8. 性能与限制

没有新增依赖、纹理下载、逐档案 DOM、独立档案 Mesh 或后处理。保留三个远景 InstancedMesh；桌面覆盖范围不变。新增 CPU 运算在原近景循环内完成，不为每份档案分配几何/材质/数组；远景高度由共享 shader 计算，实例矩阵仅在覆盖范围变化时更新。

桌面 1912×863 实际读数：45 draw calls，352482 triangles，8 geometries / 5 textures，1650056 渲染像素（HOME 空闲采样）。归档抽取阶段可能编译/登记额外几何资源；不把单帧读数等同于泄漏检测。减少动态效果模式场景可停止持续渲染，Contact 暂停路径已验证；自动清理测试通过。

最终 gzip：首页 bootstrap 10418 B，延迟 3D 143181 B，CSS 14640 B，内容页 JS 1345 B。相对本轮开始，延迟 3D 约增加 806 B，CSS 约增加 273 B。只有竖屏为了覆盖降低后的镜头视野增加远景实例数，仍未超出 16000 上限。

未执行稳定前后台条件下的 GPU 帧耗时对照、真机帧率/温度测试或长时间内存压力测试，因此不声称已证明所有设备“无性能回退”。自动化及桌面操作未发现资源数量随每次选择不断增长的机制；仍以长期真机结果为准。

## 9. 真实运行截图

所有图片直接保存自本地浏览器，不是设计稿或生成图。

- [首页全景](qa/phase3-3-1/overview-zh-desktop.png)
- [Academic 选中](qa/phase3-3-1/academic-selected.png)
- [Technical 选中](qa/phase3-3-1/technical-selected.png)
- [二级矩阵](qa/phase3-3-1/matrix-desktop.png)
- [阅读器](qa/phase3-3-1/reader-desktop.png)
- [中文 320px](qa/phase3-3-1/overview-zh-320.png)
- [英文 320×568](qa/phase3-3-1/overview-en-320-short.png)
- [英文笔记本视口](qa/phase3-3-1/overview-en-laptop.png)

## 10. 待人工视觉验收

1. 在常用显示器上确认雾化强弱、暖色层次与微地形是否符合个人审美；本轮刻意控制幅度，没有塑造明显山丘。
2. 实际手机的触屏命中、横竖屏旋转、Safari / iOS、低功耗 Android 性能。当前手机记录是桌面浏览器 CSS 视口，不是真机认证。
3. 连续观察呼吸、局部波纹与推进的节奏，并进行长时间前后台切换/资源压力检查；截图无法证明时间上的流畅度。
4. 本轮未重新进行真实屏幕阅读器、所有浏览器 200% 缩放或真实关闭 JavaScript 的完整人工验收。相关静态入口及自动降级测试保留。

本地预览：`npm run build` 后运行 `npm run preview -- --port 4322`，打开 `/` 或 `/zh/`。当前预览服务已在该端口运行，无需重复启动。

## 11. 2026-10-25 后续反馈落实

### 首页地形

静态低频幅度 0.075 → 0.16；分类局部高度 0.055 → 0.38；高斯半径参数 7 → 5.5。两个真实锚点周围的立面和层次更加明显，连续衰减至原阵列，无整片平台或额外模型。沿用同一高度合成和 CPU/GPU 参数，二级时 overviewGain 归零；没有改变相机终点、呼吸和波纹算法。测试继续检查高度上限、相邻行连续性及全部近景实例恢复。

后续按“再把镜头放低一点”调整首页方向为 normalize(-0.62, 0.52, 0.49)，距离 174 不变。俯角约 37.7° → 33.3°，相对目标高度再降约 10%；二级终点不变。初次覆盖测试发现 320×844 远角越界，竖屏远景覆盖系数改为 0.98 后，所有视口覆盖及 16000 实例上限检查通过。桌面覆盖预算、FOV 跨度、地形与灯光未改动。

本次镜头调整已重新通过 52 项测试、类型检查、构建、1245 链接检查及改动文件格式检查。Edge 实际首页确认两分类完整可见，档案立面更明显；[降低镜头后的实际截图](qa/phase3-3-1/overview-lower-camera.png)。窄屏边界本轮通过自动覆盖测试，未重复手机真机验证。

随后用户明确要求“左右约 6 列档案”：将桌面视野改为按六个列间距及当前斜向投影计算，集中参数为 `OVERVIEW.visibleColumns=6`；保留 33.3° 俯角与距离 174，桌面目标高度 -0.5。这里只收紧首页取景，不裁剪档案世界或修改二级模型。窄竖屏仍采用原宽视野，保证双分类可见。修改 `overview.ts`、`MatrixField.ts` 和设计文档；52 项测试、类型检查、构建及链接检查通过，最终目标高度调整后再次通过 9 项场景测试与构建。实际桌面截图见 [六列取景](qa/phase3-3-1/overview-six-columns.png)。透视与屏幕比例会让边缘出现部分列，不将“约六列”解释成硬裁剪六列模型。

最新标签反馈已落实：`overview-callouts.ts` 不再接收磁盘投影坐标来定位文字；桌面在视口中心左右对称、标题同高，手机改为更宽的居中上下布局。`bootstrap.ts` 只把空间投影用于引线和圆点，标签始终可见；引线连接靠近锚点的一侧，减少穿过标题。`overview.css` 调整窄屏宽度；已有窄屏测试适配新函数签名。未修改场景、镜头或科研内容。52 项测试、74 文件类型检查及构建通过；浏览器实际检查中文桌面与英文 320×568，选中信息可见且不重叠。截图：[对称标签](qa/phase3-3-1/overview-balanced-labels.png)。

### 固定比例短引线与一致首页（最新）

根据后续反馈进一步取消引线和圆点的磁盘绑定。`overviewGuide` 使用标签宽度的 24% 水平伸展、18% 垂直高度（上限 60px），左右镜像、窄屏保留 12px 安全边距。线条不读取场景投影，选择和呼吸不改变路径。

首页布局中心与微地形中心使用固定分类区域；`bootstrap.ts` 在 HOME 选择固定代表位置，进入时才根据已有项目/章节记忆选择实际目标。`MatrixField.ts` 返回首页时归零循环偏移、恢复首页实例池中心，避免横纵切换后总览取景迁移。沿用既有连续过渡、二级终点和阅读器，不修改内容数据。

本轮修改 `overview-callouts.ts`、`bootstrap.ts`、`MatrixField.ts`、`tests/overview.test.mjs`，同步 AGENTS、架构与设计文档。新增短线镜像/边界检查，以及连续跨 9 列、7 行后恢复首页相对锚点与相机参数的回归测试。54 项测试、74 文件类型检查、构建、1245 链接检查与格式检查通过。截图：[固定短引线](qa/phase3-3-1/overview-fixed-guides.png)。未推送或部署。

实际 Edge 操作：进入学术 A1 → 下一项目 A2 → 工作流程 → 返回总览，进入前后的两条 SVG 路径逐字一致。首页相机及世界跟踪位移一起平滑恢复原点，避免灯光相对位置因二级选择而改变；回归测试同时比较返回前后的绝对相机目标。自主呼吸仍保留，因此不要求不同时间截图像素完全一致。

## 12. 2026-10-26：短折线、涟漪与抽取起点对齐

原因：上轮只固定了 SVG 引线，但涟漪与英雄档案仍使用历史分类代表位置，造成视觉脱节。本轮用固定圆点的屏幕坐标作为输入，选择/进入时反投影到实际档案表面。圆环中心与空间波传播共用该命中点；从圆点下的档案槽位抬起，再通过已有 overviewGain 平滑衔接到记忆中的项目/章节。引线本身保持固定；未改变二级镜头终点或内容。

近景与远景实例同步让出抽取位置，避免重复叠放；没有新建场景、几何或动画控制器。射线计算仅响应操作；返回首页清除临时抽取点并恢复相同布局。Reduced Motion 仍直接定位，不强制播放动画。

修改文件：`src/scene/bootstrap.ts`、`ArchiveScene.ts`、`MatrixField.ts`、`OverviewBackdrop.ts`、`types.ts`、`tests/overview.test.mjs`、AGENTS 与架构/本报告。

验证：55 项测试通过；74 文件类型检查零诊断；构建、1245 内部链接检查及格式检查通过。新增场景回归测试覆盖 1600×900、390×844：圆环中心重新投影后与 UI 圆点偏差小于 0.01px；被抽取槽位包含命中点，切换记忆章节不改变起始槽位；二级相机和档案终点恢复原值。该误差来自数学/模型测试，不是浏览器图像识别测量。

实际 Edge 已检查两分类选择、进入技术 T1、切到系统架构及返回首页；再次进入技术分类正确恢复到 02/04 系统架构与流程，未观察到应用控制台错误。[返回后重新选择技术分类的实际截图](qa/phase3-3-1/guide-aligned-home.png) 展示固定引线布局，不作为瞬态波纹的图像测量证据。真实动画节奏仍建议在常用设备上确认，自动截图不能代替全程观感验收。本次未推送或部署。

### 简洁模式与联系

- 简洁模式直接导航到当前分类的 `/academic/` 或 `/technical/`，中文对应 `/zh/`。沿用实际研究领域、软件案例及卡片组件，取消旧简洁首页的假档案展示。
- 总览右上方增加 3D / 简洁模式双段切换。3D 链接包含 `view=3d&collection=...`，返回首页并选中同一分类；可覆盖已保存的简洁偏好和小屏默认设置，仍遵守 reduced-motion。
- 切换前取消过渡、释放场景；自动降级使用 replace，用户切换使用 assign；BFCache 返回恢复用户离开前的 3D 选择。无 JS 首页复用真实学术总览，并提供技术与论文链接。
- 移除 About 独立内容路由、菜单及面板入口。旧 `/about/` 与 `/zh/about/` 静态重定向到同语言 Contact，避免旧链接失效；重定向不进入 sitemap。
- 联系面板和联系页使用确认邮箱 `duanbw.sz@qq.com`，点击为 mailto 链接。科研与技术项目正文、图片、论文数据均未修改。
- 后续修复：页头 Logo、桌面及移动菜单的 Home / 首页统一指向对应语言的 `?view=3d` 首页，明确覆盖已保存的简洁偏好，避免点击后又自动回到总览页。总览模式滑块仍保留对应分类选择。
  - 修复后重新运行 build、check（74 文件，零诊断）及 check:site（1245 链接）通过。Edge 中实际执行 3D → 简洁总览 → 点击“首页”，确认返回 HOME/3D；[实际返回截图](qa/phase3-3-1/home-link-return.png)。页头文件已按 Prettier 格式化。

### 本次增量文件清单

- `src/scene/overview.ts`、`tests/overview.test.mjs`：增强地形及连续性验证。
- 新增 `src/components/portfolio/PortfolioModeSwitch.astro`；修改 `PortfolioOverview.astro`、`src/components/views/Home.astro`、`src/styles/overview.css`：真实简洁总览与双语切换。
- `src/scene/bootstrap.ts`、`src/scene/intro.js`、`tests/intro.test.mjs`：模式路由、显式返回、开屏偏好及回归测试。
- `src/data/profile.ts`、`src/components/site/ContactPanel.astro`、`Header.astro`：邮箱与导航精简。
- `src/lib/routes.ts`、`src/pages/[...path].astro`、`astro.config.mjs`、`scripts/check-site.mjs`：About 兼容重定向、静态路由和切换链接检查。
- `AGENTS.md`、`docs/ARCHITECTURE.md`、`docs/DESIGN_SPEC.md`、本报告及下列截图：同步约束和实现记录。

### 最新自动验证

| 检查 | 结果 |
| --- | --- |
| `npm run check` | 74 文件，0 errors / warnings / hints |
| `npm test` | 52 / 52 通过 |
| `npm run build` | 成功；41 内容页与 2 兼容重定向，共 43 HTML |
| `npm run format:check` | 通过 |
| `npm run check:site` | 1245 内部链接/锚点通过；模式链接、邮箱、About 重定向、Three.js 首页隔离通过 |
| `npm run check:release` | 48 public 文件，1249 大小写敏感引用，4.60 MiB 产物 |
| `git diff --check` | 通过；仅 Windows CRLF 提示 |

最终 gzip：首页 bootstrap 10630 B、静态内容 JS 1397 B、延迟 3D 143183 B、CSS 14701 B。没有新增依赖或模型；构建仍有既有 Three.js 大 chunk 提示。未进行新的帧率基准或长时间 GPU 压力测试。

### 最新实际浏览器验证

使用本机 Edge 与 4322 本地构建预览，实际点击确认中文技术 3D → 技术总览 → 3D 同分类选中；英文 Academic 总览 → 3D；中文学术 390×844 视口显示完整模式切换并可主动进入 3D。该窄屏验证为桌面 CSS 视口，非手机真机。About 中文旧地址实际转到 Contact，联系面板/联系页显示正确邮箱。

增强地形后再次从英文学术首页进入二级，overview=0；打开 A1 研究概览阅读器，模型抽取和真实正文正常显示，再从阅读器切换 Simple，实际进入英文 Academic 总览。普通预览未观察到新增应用/shader 错误；故障注入页跳转时曾出现一次浏览器扩展连接日志及控制连接超时，恢复后可继续检查，未将其误报为应用测试通过或应用错误。

4323 本地故障注入确认 WebGL 不可用时自动转到中文 Technical 总览；显式开启 3D 且 reduced-motion 时进入 HOME，诊断为 moving=false、cameraMoving=false，保留静态地形。未运行旧 QA 面板中假定“简洁模式留在首页”的 lifecycle 按钮套件；以上为实际页面操作与诊断，不将旧套件计为通过。

真实运行截图：

- [增强后的地形与技术分类](qa/phase3-3-1/overview-stronger-terrain.png)
- [技术简洁总览](qa/phase3-3-1/simple-technical.png)
- [390px 学术简洁总览](qa/phase3-3-1/simple-academic-mobile.png)

仍需用户在常用显示器上确认隆起强度是否符合预期，以及真实 iOS/Android 触屏、帧率和长期资源表现。未执行 commit、push 或正式部署。

## 13. 2026-10-26 最新方案：回退补偿动画，重排真实项目列

本节取代第 12 节及固定屏幕引线方案。用户撤销了“抽出后平移”和随后试做的淡入淡出，要求恢复真实锚点及连续镜头，再以列顺序解决两分类距离过远的问题。本地仅有 10 月 23–24 日 Git 提交，VS Code History 无此仓库文件快照，无法精确恢复 Sunday 2:16 PM 的整个工作区；本次按用户明确描述恢复对应行为，保留内容、简洁模式、邮箱及无关本地修改，没有执行 git reset。

- 二级列顺序：A4 → A3 → A2 → A1 → T2 → T1。只反转每个作品集的视觉映射，内容原始数组、编号、URL 及静态总览保持原样；列表、前后按钮、方向键和 Raycaster 共用该列映射。
- 首页 A1/T1 锚点为视觉列 3/5，其间只有 T2；相机以列 4 为中心。保留已降低的 33.3° 俯角、距离 174 和六列投影视野，并非裁掉其他列。
- 引线圆点恢复实际档案投影；标签放在锚点外侧，避免折线穿越标题；窄屏沿用上下堆叠标签。删除屏幕反投影、临时槽位遮挡和英雄档案横向插值补偿。
- 波纹、抽取和引线使用同一真实 A1/T1 首节位置；首页进入从对应代表档案首节起步，通过原有相机推进进入二级。其他项目的栏目记忆及直接分享链接仍正常。
- 返回首页归零循环偏移、恢复固定中心，不随二级选中的项目或栏目改变。呼吸仍存在，不以逐像素完全一致作为验收标准。
- 撤销未交付的 entry-cut 淡出/淡入实现；没有新增依赖、几何模型或科研内容。

修改文件：src/lib/archive-model.ts、src/scene/bootstrap.ts、ArchiveScene.ts、MatrixField.ts、OverviewBackdrop.ts、overview-callouts.ts、types.ts；tests/archive-navigation.test.mjs、tests/overview.test.mjs；AGENTS.md、ARCHITECTURE.md、DESIGN_SPEC.md、本报告。删除的 entry-cut.ts 为本轮临时新文件，未在正式版本中存在。

最终自动验证：56/56 测试通过；Astro check 74 文件、0 errors/warnings/hints；build 成功；check:site 43 HTML、1245 内部链接通过；format:check 通过。Three.js 既有大 chunk 提示仍存在。回归测试覆盖列次序与环边界、各项目栏目记忆、A1/T1 中心及波纹位置、取消独立横移、二级终点不变，以及跨 9 列/7 行后首页姿态恢复。桌面和窄屏视野覆盖、reduced-motion 与资源清理继续通过。

实际 Edge 本地预览验证：学术入口进入 A1，向右依次进入 T2、T1；切换 T1 栏目后返回首页。以下补充实际截图和最终窄屏检查记录。未执行 commit、push 或部署。

补充实际浏览器结果：390×844 桌面模拟视口中两分类、项目数和进入按钮均可访问，技术入口落在 T1/01 项目概览；已恢复默认视口。实际截图：[重排后首页](qa/phase3-3-1/reordered-home.png)、[窄屏技术分类](qa/phase3-3-1/reordered-home-mobile.png)。这些是页面实拍，不作为全程动画录像。控制台记录了一次“Could not establish connection. Receiving end does not exist.”连接错误，没有提供应用调用栈；未据此声称控制台完全零错误。未做真实手机 GPU/帧率基准，连续动画的主观节奏仍需用户设备确认。

## 14. 2026-10-26：项目按钮方向和进出首页回摆修复

- 两处项目导航（矩阵、阅读器）均把 data-column=-1 改标为“↓ 下一项目 / ↓ Next project”，+1 改为“↑ 上一项目 / ↑ Previous project”。下方项目名仍由同一列映射计算，不交换点击方向，不修改栏目上下键或鼠标滚轮行为。
- 原抽动原因：阵列独立弹簧先归位、两秒镜头目标再插值、相机二次追赶；返回时当前英雄档案又立即换为 A1/T1。现在固定矩阵侧世界参照，共用一个 overviewGain，返回选择延后到首页终点。撤销过渡期间的重复相机滤波，正常二级导航和阅读器保持原弹簧。
- 修改：ArchiveTerminal.astro、MatrixField.ts、ArchiveScene.ts、tests/overview.test.mjs、AGENTS.md、ARCHITECTURE.md、本报告。
- 自动验证：58/58 测试通过；74 文件类型检查零诊断；build、1245 内部链接检查、格式检查通过。新增世界空间单调轨迹测试检查进入 T1 无反向回摆、从非代表项目/章节返回无越界、返回起点英雄档案不跳换；另覆盖中途反向姿态连续及 reduced-motion 收敛。既有二级终点和资源清理测试保留。
- 构建仍有既有大 chunk 提示。相对上一版延迟 3D gzip 增加约 183 B，没有新增模型或渲染通道。没有执行真实设备帧率基准；数值轨迹测试不等同于动画全程视频验收。未推送或部署。

浏览器实际验证补充：Edge / 4322 本地构建预览完成 HOME → T1 → 点击“↓ 下一项目”进入 T2 → 第二部分 → 返回 HOME；二级终点 overview=0、返回终点 overview=1，busy=false、cameraMoving=false，当前测试标签页无 warn/error 日志。新按钮及其实际目标见 [二级导航实拍](qa/phase3-3-1/project-direction-controls.png)。这验证了真实交互和终点状态；动画全程的帧间轨迹由新增数值测试覆盖，未声称截图能证明所有设备的主观流畅度。

## 15. 2026-10-26：消除进出总览时逐列升降

用户观察到学术约两波、技术约四波，返回时也出现。原因是上一轮相机同步之后，shoulder 选中隆起仍把世界坐标归位 x/z 当作选中中心，使隆起顺序扫过中间列。此次只修正 MatrixField 的 focusLane/focusRow：过渡期间取冻结的 overviewRig，完成后继续原二级选中跟踪；隆起权重仍按既有 overviewGain 连续变化，不新增动画、不修改镜头终点、列顺序、呼吸或点击涟漪。

新增测试覆盖 A1/T1、进入/返回（含第二级第三部分），逐帧对照目标档案的预期高度；修复前复现失败，修复后通过。这是对实际模型位置的数值回归，不将其表述为逐帧浏览器录像验证。修改文件：MatrixField.ts、tests/overview.test.mjs、AGENTS.md、ARCHITECTURE.md、本报告。

本轮最终验证：59/59 自动测试通过；74 文件类型检查 0 errors/warnings/hints；build、1245 内部链接及 format:check 通过。未重新进行浏览器全程录像或手机真机测试，仍有原有 Three.js 大 chunk 提示。未提交、推送或部署。
