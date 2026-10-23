# BIOINFORMATICS ARCHIVE — 参考研究与设计规范

状态：Phase 3.1 继续使用暖白、炭黑、橙金和科研终端视觉。2026-10-22 的以下规范优先于历史记录。

## 当前视觉规范：统一卡匣与侧边阅读

- 最新截图反馈优先：右侧摘要无底板、无磨砂大卡片，只保留作品集标签、醒目的“ A02 项目名称”、次级“01/04 部分名称”与打开动作。底部左侧部分导航、右侧项目导航分离，保留总数、全部项目目录及前后项名称。
- 统一左上 Logo 下方返回；右上恢复 3D / 简洁模式双段滑动指示。箭头、栏目编号、打开与返回按钮背景透明，悬停下划线/暖金色强调，键盘焦点可见。仅主动展开的目录与悬停说明使用小面积可读底色。
- 色温使用暖米色环境和暖色方向主光，降低环境亮度与曝光以保留壳体接缝和投影；移动端仍关闭实时阴影。矩阵使用上游两正弦待机起伏与切换扩散波，reduced-motion 禁用。
- 鼠标滚轮在矩阵切换部分，触控板防连跳；正文保留原生滚动。悬停档案显示项目编号/名称与部分位置/名称。窄屏底部纵向排布两个导航轴，极矮屏可滚动；右侧正文阅读器保持原有布局。

- 两个首页模型与内部档案使用同一金属卡匣语言：圆角壳、深色接缝、细边轨、螺钉、半透明盖、内页厚度和少量橙金登记标记。首页文件夹通过层叠内页区分；禁止用虚构科研图作为装饰。
- 首页去掉重复的“01—02 / BIOINFORMATICS ARCHIVE”文字目录。保留两模型、当前选择摘要、操作控件、Contact 与语言切换；真实目录只在轻量或无 JS 模式显示。
- 文件夹开启时前盖抬起、内页轻微展开、镜头靠近；进入矩阵沿用模型姿态与相机，从连续运动中过渡到档案阵列。返回时反向交接。项目与栏目切换采用保留速度的阻尼运动，旧选中模型逐渐落回阵列。
- 第二级和第三级的最大文字必须是项目名称；研究概览 / 工作流程等栏目名作为次级标签。卡匣封面也使用真实项目标题，栏目用小字号。
- 桌面第三级采用“左侧抽取模型 + 右侧正文”布局，无模态遮罩。正文在模型抽取后出现，可独立滚动；窄屏保留上方模型和下方阅读区，面板内有四向控件。联系面板继续作为独立覆盖层。
- 横向六项目连续循环，可从 Academic A4 进入 Technical T1；纵向仍仅切换同一项目的四份档案。视觉循环不能改变真实项目 ID、论文归属或静态链接。
- reduced-motion 取消弹簧与面板揭示动画；小屏默认轻量，启用 3D 后关闭阴影并降低实例数。截图与人工验收边界见 [ARCHIVE_POLISH_REPORT.md](ARCHIVE_POLISH_REPORT.md)。

## 首页开屏与选中反馈（2026-10-24）

- 首页以暖白底、本站三块式标记、细线圆弧和 BIOINFORMATICS ARCHIVE 字标开启；标记与短文案渐入，横向细线展开。无音效、闪烁或虚构加载百分比。
- 正常情况为 2.4 秒开场 + 0.6 秒交叉淡入；必须等 3D 真正完成首帧。慢网可以延长等待，8.5 秒总看门狗保证恢复 HTML；开屏期间可点简洁模式或按 Esc。正式界面的 3D / 简洁模式保持原样。
- 减少动态效果、小屏 / 粗指针、省流量、已选简洁模式跳过开屏；无 JS 时不显示遮罩。内容详情页不包含开屏。
- 已选中文件夹常驻较高位置并带暖金选择指示；悬停时额外轻抬、向前、倾斜及微提玻璃盖。未选中模型只保留原有轻抬。移出复位、改变选择渐变，动画结束后停止渲染。
- 参考上游 `src/boot.ts` 的 DOM / SVG 分阶段揭示及 `src/startup.ts` 的就绪门控思路；本次独立编写简化实现，没有复制上游开场代码、Logo、字体轮廓或音效。既有 MIT 说明继续保留。

## 优化前的 Phase 3.1 记录

首页两文件夹带背板、封面、铰接封面轴、书脊、三层内页与顶部标签，均由共享 Box / Plane 几何独立制作。悬停轻微位移；单击选择抬起，双击 / Enter / OPEN FOLDER 打开，封面转动并推进镜头。没有开场阻塞、游戏标志或受限素材。

内部使用同一密集立式卡匣阵列：项目沿横轴分列，同一项目栏目沿纵深排列。共享实例池重复映射真实栏目，形成连续档案海；当前档案形成抬起的波峰，打开时继续抽取并推进镜头。采用参考站的长焦斜俯视、左侧主体 / 右侧标题、暖灰白材质、磨砂面板和底部索引布局。第二级全视口显示，首页原有布局保持。窄屏将阅读操作置于下部磨砂面板，保留四向触控；默认轻量，可主动启用 3D。

首页右上角 Contact 统一承载个人资料与联系方式，长内容链接原 About 页；不存在的邮箱、简历不制造可点击假链接。研究图库及论文未核验时，阅读器继续显示真实的空状态。普通静态页的八 / 九栏目排版不改写。

按用户后续视觉反馈，已将最初稀疏阵列替换为循环实例阵列。改编固定上游提交的 `archive-loop.ts` 循环映射、运动肩部曲线及 `scene.ts` 相机构图，保留 MIT 版权说明；程序化卡匣、标签和个人品牌独立制作。没有复制原作 GLB、标志、声音、商业字体，也没有引入景深等重后处理。相似度没有客观百分比测量，不能将“95%”写为已验收事实；实际截图与待验项见 [PHASE3_1_ARCHIVE_REFACTOR_REPORT.md](PHASE3_1_ARCHIVE_REFACTOR_REPORT.md)。

当前档案前两项突出 Academic Portfolio / Technical Portfolio；卡面缩写 ACADEMIC / TECHNICAL，保留 Publications / Profile / Contact。普通导航与 HTML 目录同步。

作品集总览采用有明确状态的项目卡片，学术页按三个研究领域分组。科研详情固定八个栏目，技术详情固定九个栏目；共用既有 DetailLayout、侧目录和响应式排版。未核验材料使用明确状态说明，不用假图填充。

图库将真实截图、科研结果及原创示意分开标记，支持原图链接放大，包含标题、替代文本、图注、来源和许可。移动端单列；不引入额外图库 JS 或动画。以下保留前期研究记录。

Phase 2 根据用户新要求改为暖白、浅灰、炭黑与少量橙金；首页使用原创程序化三维档案，支持选择即抽取、相机跟随、即时 DOM 摘要与 OPEN ARCHIVE 原生链接。小屏默认轻量，可主动启用 280px 高场景。Software 指向 Projects / 项目页，Profile 指向 About，Contact 替换首版装饰中的 CV；CV 仍通过普通导航入口访问。科研 / 软件详情占位模板仍不是实际成果。

实际玻璃外壳使用半透明高粗糙度材质模拟磨砂，无物理折射、多层透射或后处理。每片封面为原创 CanvasTexture，不包含真实实验图、指标或模型。五片可交互档案和十片装饰背板均是分类导航，不声称存在十五项成果。具体实现和验证见 [PHASE_2_REPORT.md](PHASE_2_REPORT.md)。

本文分清“上游已实现”与“新站计划”，不把参考站的演示档案或历史性能记录当成本站事实。

## 1. 研究来源与证据边界

参考站：<https://rhine.lubeiluchen.cc/>。

上游仓库：[LBEILC/RhineLabUI](https://github.com/LBEILC/RhineLabUI)，本次锁定提交：
`12cc5e4013acb9408f753ff71de6b8492299b7c8`。

已阅读 README、DESIGN、LICENSE、package.json，检查场景、循环映射、拖动、响应式、UI 过渡、质量配置、实例更新与资源管理相关源码；并查看作者提供的首页截图。Git 直连克隆失败后改为从 GitHub 获取源码文件和源码压缩包，均保存在仓库外：

```text
C:\Users\ASUS\AppData\Local\Temp\bioarchive-reference-62010ba88cf949c3b15853a72d5bce89\
```

关键文档与场景 / 输入 / 布局模块已按上述提交重新获取；`scene.ts` 固定提交版本与最初 main 快照的 SHA-256 一致：
`C1E304B6D19807D8E52E4B9BF3E060383BD2EAEF11B49F6DE2B8948F7F1657FE`。

本次浏览器交互连接超时，因此未完成参考站实时操作、真机响应式或性能复测。以下行为结论来自源码与上游文档；截图仅用于静态构图观察，上游自报验证结果不视为本次实测。

### 核心来源索引

以下链接固定到研究提交；行号为此次阅读位置提示，后续上游变更不自动改变本站设计。

| 来源 | 本次用途 |
| --- | --- |
| [README.md](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/README.md) | 产品结构、操作方式、资源与授权边界 |
| [DESIGN.md](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/DESIGN.md) | 镜头、运动与响应式历史；新版覆盖旧方案 |
| [LICENSE](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/LICENSE) | MIT 全文与作者版权署名 |
| [package.json](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/package.json) | Vite + 原生 TS + Three.js，运行与构建依赖 |
| [scene.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/scene.ts) | `load`、`select`、`pickCell`、帧更新和资源释放 |
| [archive-loop.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/archive-loop.ts) | 逻辑内容与物理单元映射 |
| [archive-visibility.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/archive-visibility.ts) | 视锥、高度区间、动态覆盖窗口 |
| [archive-drag.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/archive-drag.ts) / [motion.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/motion.ts) | 二维轨道投影、惯性、阻尼、升降与波纹 |
| [main.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/main.ts) / [ui-transitions.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/ui-transitions.ts) | DOM UI、模式切换、可取消过渡 |
| [viewport-layout.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/viewport-layout.ts) / [responsive.css](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/responsive.css) | 实际布局判断、取景和触控尺寸 |
| [style.css](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/style.css) / [fonts.css](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/fonts.css) | 配色、排版和字体分片 |
| [render-quality.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/render-quality.ts) / [quality-renderer.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/quality-renderer.ts) | 画质档位、缓冲上限与透射分辨率 |
| [instance-updates.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/instance-updates.ts) / [render-state.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/render-state.ts) | 局部 GPU 上传与静止画面复用 |
| [shared-depth.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/shared-depth.ts) / [three-resources.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/three-resources.ts) | AO / 景深复用和 GPU 资源生命周期 |
| [boot.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/boot.ts) / [boot-motion.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/boot-motion.ts) | DOM / SVG 开场时间轴 |
| [decryption.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/decryption.ts) / [document-decryption.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/document-decryption.ts) | 模型与正文同步揭示 |
| [model-viewer.ts](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/src/model-viewer.ts) | 独立查看器与异步资源取消 |
| [音频来源](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/public/audio/README.md) / [Rolling Number 许可](https://github.com/LBEILC/RhineLabUI/blob/12cc5e4013acb9408f753ff71de6b8492299b7c8/public/licenses/rolling-number.txt) | 第三方与原创资源的区别 |

## 2. 上游：档案阵列如何实现

### 2.1 内容和空间解耦

`archive-loop.ts` 的 `wrap`、`nearestOccurrence`、`selectionCell` 将五类、每类八份内容映射到可连续移动的 `lane / row` 物理坐标。跨最后一项时仍沿原方向运动，而非突然反向跳回。切列保存各列选择记忆。

文件中保留 `LOOP_COLUMNS=9`、`LOOP_ROWS=32`，`scene.load()` 初始创建 288 个容量位置；原片固定时间轴用 160 个位置。但**当前交互绘制不是恒定 288 张**：帧更新调用 `ArchiveVisibility.update()`，将实际插值后的相机视锥与阵列高度区间求交，枚举候选格，再紧凑写入实例缓冲；容量不足时增长。默认屏幕方向余量 1.18 倍，额外覆盖为 1.5 倍，并受雾远端约束。

几何参考尺寸为宽 5、高 3.7，列间距 5.2、行间距 0.62 世界单位。逻辑坐标绝对值超过 2048 时，按内容周期重新归零，保持相对位置、速度与波纹相位，避免长期运行的坐标精度问题。

### 2.2 共享几何与独立活动对象

`scene.ts` 约 341–480 行加载 GLB，遍历子 Mesh，将原始世界变换烘焙到 geometry。按外壳、边缘、紧固件、标签嵌件和内部基板等表面建立多个 `InstancedMesh`；多个批次共享 `instanceMatrix`，阵列不渲染全部内部精细结构。

抽取卡片使用单独的完整模型。选中原槽位及正在归位的旧卡片从实例映射中排除；旧卡片拥有独立材质和标签状态，归位后释放。这样既能批量绘制阵列，又可独立改变选中模型的磨砂、透射和内部结构。

实例化只能减少重复几何的 draw calls，无法消除透射、多 pass、阴影和复杂材质开销。上游的物理透明层与精细 GLB 并非新站必需。

## 3. 上游：悬停、选择、抽取与镜头

| 行为 | 当前源码机制 | 对本站的启发 |
| --- | --- | --- |
| 悬停 | 指针按 canvas rect 转 NDC，Raycaster 检测首个实例表面、活动卡片和归位副本；`instanceId → drawnCells` 与实际绘制映射一致 | 拾取映射必须与压缩后的实例顺序同步 |
| 悬停运动 | 独立 `hoverLifts`，目标 0.28，指数插值速率 14；不改变选中或镜头进度 | hover 与 selected 状态分离 |
| 选中 | 预览抬升 0.4；轨道、肩部、列焦点使用保留速度的阻尼；选中与传播波同时开始 | 连续输入从当前位置接续 |
| 抽取 | 交互 `INSPECTION_LIFT=4.05`；原片时间轴 3.35 属不同模式；卡片仅升高，构图由相机改变 | 不靠横移模型伪造抽取 |
| 归位 | 有旋转时先保持高度转正，再下降；旧对象独立归位，避免和新选中穿插 | 对取消和快速切换显式建模 |
| 取景 | 远距、小 FOV 的透视压缩；相机位置 / aim / FOV 连续变化；雾距离跟随实际相机 | 使用相机锚点和实际姿态，避免提前雾化 |
| 正文揭示 | `DecryptionController` 与 `DocumentDecryption` 共用进度，盖板清晰与 DOM 遮罩同步 | 动画可共享时钟，但新站不遮挡科研正文 |
| 查看器 | 独立 renderer / OrbitControls、平滑镜头和拆解；主场景暂停绘制，异步 request ticket 拒绝过时加载 | 学习资源生命周期，不引入无业务价值的拆解 |

当前手势已经不是 DESIGN 早期的 36px 单轴 swipe：`ArchiveDrag` 用两个屏幕投影轨道形成的 2×2 矩阵求逆，把拖动分解到列和行；7px 后不再视为轻点，10px 开始拖动，松手保留实际采样速度并共同减速、最终吸附。多指 / pointercancel 取消当前单指操作。新站首版保留按钮与点选，不复制复杂的全平面惯性拖动。

## 4. 上游：视觉和动画节奏

### 布局与配色

首页截图呈现全屏斜向档案平面，品牌在左上、工具在右上、当前档案说明靠右中、刻度与列导航靠底部。DOM UI 叠在 WebGL 场景上，细线和编号承担主要信息层级；详情采用左模型、右正文。

浅色基础为暖灰 `#e8e5e1`、近黑 `#080a08`、辅助灰 `#77756d`，暖棕 / 杏金用于选中。后续暗色配置使用 `#11181b` 背景、`#e0e3dc` 正文及 `#c5a16b` 强调。色彩切换改变独立材质，不是全屏反色。

### 字体核验

主体为 MiSans，当前 `fonts.css` 使用 `misans-webfont-4.3.1` 分片、`unicode-range` 和 `font-display: swap`。README 保留“四份字体共约 19.7MB”的说明，不能直接推断当前首屏下载量。DESIGN 后续记载开场部分采用 Novecento，授权 Webfont 独立存放且排除公开 Git，部分轮廓作为后备；不能将字体轮廓当作无许可替代品。

### 动画节奏

- 原作驱动的长开场由 DOM / SVG 与可定位时间轴实现，不是 CSS 无限循环。
- 标题和编号使用 `@kitlangton/rolling-number`，共享约 460ms 配置，快速输入追踪最新目标。
- `SurfaceTransition` 默认进入 300ms / 退出 200ms，位移 12px / 8px；通过 revision 防止过期完成回调。
- 详情层约 180ms，页签正文约 150ms；查看器复位在设计中为 560ms。
- 原片式解密在交互中约 3.63s；这适合演示，但会拖慢申请审阅，因此本站取消正文解密和等待。
- 上游保留历史波浪实验，当前默认有正负波谷的 baseline；不能只看到 `selectionWave` 的正值裁切就认为生产行为无负向波动。

## 5. 上游：响应式和性能

### 响应式

`viewportLayout()` 以宽高比 `<1.05` 判定 portrait；portrait、宽度 `<1100` 或粗指针且高度 `<600` 进入 compact。桌面以 1080 逻辑高度缩放并延展宽度；compact / portrait 使用真实 CSS 像素，避免文字整体缩小。原片比较模式才固定 1920×1080。

`archiveFraming()` 调整垂直取景范围与模型屏幕锚点，不拉伸模型。窄横屏保持左右分区，竖屏正文从约 54% 高度开始，模型居上。CSS 使用安全区域、正文独立滚动、主要控件 44px 高度；软键盘只调整弹窗可用高度。现有 Canvas `touch-action: none` 服务全场景手势，本项目常规滚动首页不照搬。

### 性能机制及边界

| 机制 | 源码证据 | 采用判断 |
| --- | --- | --- |
| 实例化 / 共享矩阵 | `scene.load()` | 首版采用简化实现 |
| 视锥与覆盖裁剪 | `ArchiveVisibility`、`ArchiveDrawCoverage`、独立阴影覆盖 | 首版有限阵列先限制数量，测量后再优化 |
| 局部上传 | `InstanceUpdates` 比较 Float32 值，提交连续改变区间 | 值得借鉴，先用简单脏标记验证收益 |
| 静止画面复用 | `RenderState` 比较矩阵、材质、纹理版本等，相同则跳过绘制 | 首版更直接地在稳态停 RAF |
| 阴影缓存 | `shadowMap.autoUpdate=false`，投射者 / 灯变化时更新 | 首版可选静态阴影，默认成本更低 |
| AO / 景深深度共享 | `SharedDepthAO` / `SharedDepthBokeh`，部分依赖 Three 私有方法 | 不复用，版本耦合高 |
| 多档质量 | DPR、scale、阴影、AO、SMAA、DOF、透射分辨率 | 首版只暴露 2D / 3D，内部自动降档 |
| 像素上限 | 通常 8,294,400；超级性能模式 921,600 | 本站采用更低预算 |
| 超级性能模式 | 跳过 composer，阵列去折射 / 清漆 / 小螺丝，活动模型低分辨率透射 | 学习“画质与运动分离” |
| 页面隐藏 | `main.frame()` 隐藏时跳过更新 / 绘制，但仍安排 RAF | 不误写为已彻底取消 RAF |
| 字体按字符加载 | unicode-range 与启动字符预载 | 本站首版用系统字体，零字体下载 |
| 资源释放 | dispose、事件中止、纹理 / pass 清理、过时异步结果释放 | 必须设计，不等到内存泄漏再补 |

`package.json` 显示上游运行依赖 Three.js `^0.183.0`、Rolling Number `0.4.1`，开发依赖 Vite `^7.3.1`、TypeScript `^5.9.3` 等；构建还包含档案导出、字体准备、PWA 脚本。其 `main.ts` 同时承载多个产品模式，并非可直接嵌入 Astro 的独立首页组件。

## 6. 代码与素材复用边界

这里记录可执行的工程使用规则，依据上游 LICENSE、README 和资源说明；不把“代码公开”视作素材授权。

| 对象 | 上游说明 / 限制 | 本项目决定 |
| --- | --- | --- |
| 作者有权授权的程序代码 | MIT，Copyright (c) 2026 LBEILC | 可选择性适配通用算法，保留完整许可和版权 |
| `archive-loop` / 阻尼 / 输入 / 资源管理 | 通用机制中可能嵌入五列八档、品牌或时间轴假设 | 先独立实现；确需复制时逐函数登记来源和改动 |
| `scene.ts` / `main.ts` 整体 | 混合模型名、品牌、原作语义、宿主模式和复杂效果 | 不整文件搬运，不复制整个项目 |
| 作者制作的 GLB / Blender 工程 | 作者授权其原创部分，但不授权其中原作相关权利 | 不引入任何上游模型，程序生成原创档案几何 |
| 原作名称、标志、设定、PV、视觉元素与演示文字 | 明确不属于上游可代授权范围 | 不用作本站品牌、装饰、正文或背景 |
| 原作逐字音频 | 3 个约 38ms 采样及衍生片段被明确排除 | 不复制 `typing-samples.ts`、WAV 或提取结果 |
| 原创配乐和音效 | 上游称原创部分 MIT | 首版无音频，避免无关依赖 |
| MiSans | 独立字体许可及版权 | 首版不分发；若未来引入，单独检查授权与字体文件 |
| Novecento / 转曲字形 | 商业字体相关权利，授权包不在公开仓库 | 不复制 Webfont 或轮廓 SVG |
| Rolling Number | 独立 MIT 许可 | 首版不引入；后续采用须保留其作者的许可 |
| Three.js 等依赖 | 各自许可证 | 随锁定依赖进行许可清单与分发检查 |
| 上游截图 / GIF | 可包含原作标志、模型和文字 | 仅在仓库外研究，不成为本站图片、OG 图或作品成果 |

若将来发生实际代码复用，必须同一变更完成：

1. 在 `public/licenses/rhinelabui-MIT.txt` 保留上游完整 MIT 文本及 `Copyright (c) 2026 LBEILC`；构建后确认该文件仍存在。
2. 根目录 `THIRD_PARTY_NOTICES.md` 登记上游 URL、固定提交、原文件 / 函数、本站对应文件、修改说明和许可路径。
3. 改写文件头注明来源与适配范围；不要删除原作者必要声明。
4. `/credits/` 提供来源与许可证链接。页面致谢不替代分发完整许可。
5. 对代码内嵌字符串、SVG、base64 音频、纹理、字体轮廓与模型路径一并检查。

Phase 1 已实现原创静态页面与 CSS 档案构图，未复制上游实现或素材，因此不生成声称已复用的版权清单；也不替用户决定整个新仓库的开源许可证。实际依赖由 package.json 与锁文件记录，各依赖遵循自身许可。

## 7. 新站视觉语言

名称固定为 **BIOINFORMATICS ARCHIVE**，中文辅助名“生物信息学档案”。使用普通文字字标；可用原创网格 / 索引点作为辅助图形，不模仿原作 Logo、双环装置或机构身份。

目标气质：清晰、克制、可检索的科研档案。保留浅色空间、斜向阵列、细分隔线和层次抬升的通用设计语言，重新设计构图与几何。不要伪造“机密权限”“身份认证”“实验室隶属”等状态。

### 设计令牌

| 令牌 | 建议值 | 用途 |
| --- | --- | --- |
| `--color-bg` | `#F4F3EF` | 暖纸灰页面 |
| `--color-surface` | `#FFFFFF` | 阅读与预览面板 |
| `--color-text` | `#292925` | 炭黑正文、主标题；实际变量名为 `--color-ink` |
| `--color-muted` | `#66645C` | 辅助信息 |
| `--color-accent` | `#855B29` | 棕金链接、选中、焦点 |
| `--color-accent-soft` | `#EEE5D5` | 轻选中底色；实际变量名为 `--accent-soft` |
| `--color-line` | `#D4D0C6` | 仅装饰分隔线 |
| `--color-control-border` | `#898376` | 需辨识的控件边界；实际变量名为 `--control-border` |
| `--color-signal` | `#9A6425` | 少量编号 / 状态信号，不单靠颜色 |
| `--space` | 4、8、12、16、24、32、48、64px | 统一布局节奏 |
| `--radius` | 2px / 6px | 按钮 / 阅读面板 |
| `--content-width` | 72rem | 常规页面最大宽度 |
| `--prose-width` | 68ch | 英文正文宽度；中文约 38–42 字 |

颜色是待验证令牌；普通文字目标对比度 ≥4.5:1，大字及关键非文本控件 ≥3:1。装饰线不承担唯一边界信息。

### 字体与字号

- 正文：`system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif`。
- 编号 / 技术标签：`ui-monospace, SFMono-Regular, Consolas, monospace`，数字等宽。
- 首版无外部字体请求、不分发字体文件；未来需要统一字体时再选择可自托管的明确许可字体。
- 主标题：`clamp(2rem, 4vw, 4rem)`，允许自然换行；不把长站名硬塞成一行。
- 正文桌面 18px / 1.7，移动 16px / 1.7；元信息 13–14px，不用极小字号制造“终端感”。
- 英文短标签少量全大写，中文正文不额外拉大字距；代码块允许局部横向滚动。

## 8. 新站布局

### 桌面 ≥1024 CSS px

```text
┌ 文字字标 ─── Research / Software / Publications / About ─ EN 中文 ┐
│ 个人介绍与研究方向（真实内容）           CV · Contact              │
├────────────────────────────────────────────────────────────────┤
│                                           当前档案摘要           │
│          原创 3D 档案阵列                  贡献 / 方法 / 标签      │
│          斜向纵深，保留空间                [展开预览] [阅读详情]    │
│                                                                │
│ 分类选择    上一项 / 下一项                  [二维视图]            │
├────────────────────────────────────────────────────────────────┤
│ Featured research / Selected software：普通 HTML 列表            │
│ Publications 快速入口 · CV · Contact · Credits                    │
└────────────────────────────────────────────────────────────────┘
```

主视觉区域约占 65–75svh，最大约 820px，导航和介绍始终可见；页面允许正常滚动，不锁定整页为桌面程序。摘要面板使用足够实底确保文字对比，不能让卡片纹理穿过正文。

### 平板 768–1023px

减少阵列数量，场景与摘要上下排列。分类使用可换行按钮组；保留完整主导航，可收为原生可访问菜单。粗指针设备初始 2D，可显式启用 3D。

### 手机 <768px 或短横屏

默认二维档案索引：站名与介绍 → CV / Contact → 分类 → 真实项目摘要卡。场景不占据长屏顶部，不让审阅者先滑过空画布。

主动启用 3D 后使用独立的约 260–360px 高区域，限制最多 18 个实体；下方摘要仍在正常文档流。点击和按钮足够完成操作，Canvas 使用允许纵向滚动的触摸策略；首版不提供会与页面滚动冲突的纵向拖动。安全区域使用 `env(safe-area-inset-*)`。

### 常规详情页

面包屑 → 标题 / 类型 / 日期 / 本人角色 → 3–5 行概述 → 公开成果入口 → 正文和图表 → 局限 / 复现 → 相关项目 → 联系。

宽屏可有右侧锚点目录，窄屏折叠为正文前的 `<details>`。不展示 3D 背景、正文扫描遮罩或模拟终端加载。Research 与 Software 共享排版，但使用不同内容字段。

## 9. 新站 3D 视觉与运动规范

### 几何和相机

- 初始薄板尺寸建议宽 1.6、高 2.2、厚 0.10 世界单位，列距约 2.0、前后间距约 0.40；全部为新设计初值，需原型确认。
- 卡面使用原创的三列抽象点阵 / 数据条及侧边标签，禁止仿制原作双环内构、螺钉组合和特征轮廓。
- 基础片使用共享几何与 `MeshStandardMaterial`；背板略暖灰，青绿索引条承担分类状态。首版不加载模型、环境 HDR 或外部纹理。
- 一个柔和方向光加环境 / 半球光；可用原创平面阴影模拟接触，不为所有卡片开启实时阴影。
- `PerspectiveCamera` 起始 FOV 约 30°、方位角约 35°、俯角约 22°；根据包围盒及 DOM 安全区计算距离，不能照搬上游近远裁剪范围。
- 选中对象抽取后落在画布左中区域，右侧留给 DOM 摘要；小屏锚点回到画布中心。窗口旋转只改变取景，不改变 selectedId。
- near / far 根据场景实际范围收紧并验证，标签与表面避免共面；文本真实语义仍在 DOM。

### 运动参数（目标区间，待原型验证）

| 动作 | 正常模式 | 减少动态效果 |
| --- | --- | --- |
| 首帧增强 | 180–240ms 淡入，不遮挡导航 | 直接替换 |
| hover / focus 提示 | 120–160ms；抬升约 0.06 | 边框 / 颜色即刻反馈 |
| 选中 | 200–280ms；抬升约 0.18 | 直接设置选中 |
| 展开预览 | 抬升至约 1.6–2.0，按净空校准；镜头与卡片约 400–550ms | 无空间运动，更新摘要 |
| 关闭预览 | 250–400ms 归位，可被新输入接管 | 直接恢复 |
| 摘要信息变化 | 120–160ms；文本立即可读 | 即时 |
| 阅读详情 | 原生链接立即导航 | 相同 |

不用长开场、自动旋转、永久呼吸、正文解密、频闪、自动播放音频。可选短波纹放在后续阶段，且不改变选择对象含义。

所有运动按时间差驱动；帧间隔过大时 clamp / reset，不依赖“每帧加固定值”。相机和卡片有各自状态但统一控制时间，取消时从当前值接续。

## 10. 交互与可访问性验收

| 输入 / 状态 | 预期结果 |
| --- | --- |
| 鼠标 hover | 仅提示所指项目；不能自动跳转 |
| 点击场景卡片 | 更新选中、DOM 摘要和按钮状态 |
| 点击“展开预览” | 抽取并重新取景，保持真实阅读链接可用 |
| 点击“阅读详情” | 立即访问真实静态 URL，支持 Ctrl / Cmd / 中键 |
| Tab / Shift+Tab | 所有分类、选择、展开和阅读操作可达，焦点清楚 |
| 选择按钮组方向键 | 仅组内移动选择；文本输入、正文方向键不被拦截 |
| Esc | 关闭当前预览；焦点回触发按钮，不触发额外导航 |
| 手机轻点 | 与点击等价；不要求 hover、双击或精确拖拽 |
| JavaScript 禁用 | 可读介绍、索引、详情和可用 CV |
| WebGL 不可用 / 加载失败 | 保持 2D，提示简短且可重试，无全屏错误遮罩 |
| 200% 缩放 / 长中文标题 | 导航换行，正文回流，动作不被裁掉 |
| 返回首页 | 能恢复选中时恢复；存储不可用也能正常浏览 |

首版预览是非模态侧栏 / 文档流区域，不实施全页焦点陷阱。若未来新增真正模态对话框，需独立实现 inert、焦点循环、Esc 和关闭后焦点恢复。
