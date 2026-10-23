# Phase 2 — Three.js 交互式首页实施报告

完成日期：2026-10-21（Asia/Hong_Kong）。本轮仅本地开发与验证，没有 commit、push、远程仓库操作或部署。

## 已实现

首页改为独立品牌的科研档案终端：暖白、浅灰、炭黑、少量橙金，保留普通导航、语言切换、Skip Intro 和 HTML 档案目录。

| 档案 | 英文目标 | 中文目标 |
| --- | --- | --- |
| Research | `/research/` | `/zh/research/` |
| Publications | `/publications/` | `/zh/publications/` |
| Software | `/projects/` | `/zh/projects/` |
| Profile | `/about/` | `/zh/about/` |
| Contact | `/contact/` | `/zh/contact/` |

这些是五类导航入口，不是五项真实成果。没有提供真实项目资料，因此没有把按钮链接到虚构项目详情；既有科研 / 软件详情模板继续独立存在。

- 桌面默认展示三维阵列：五片可交互档案和十片装饰背板。
- 鼠标悬停：轻微抬升、暖金高亮。点击后档案抽取、放大、转正，镜头平滑跟随。
- 摘要是立即更新的 HTML，含标题、介绍和 OPEN ARCHIVE 原生链接，不等待动画完成。
- 返回阵列、上一项 / 下一项、直接选择均可中断当前运动；始终从当前数值接续，不创建额外归位对象。
- 分类按钮支持 Tab、Enter / Space、方向键、Home / End；Escape 关闭预览并恢复触发按钮焦点。方向键仅在分类按钮组生效。
- Pointer Events 统一鼠标与触屏；超过 7px 的位移不作轻点，pointercancel 取消。Canvas 使用 `touch-action: pan-y`，保留纵向页面滚动。
- Light mode 释放 WebGL，保留摘要操作和链接。Skip Intro 释放场景、跳至 HTML 目录并移动焦点，无冗长片头。
- 窄屏、粗指针、reduced-motion 和 save-data 默认不导入 Three.js；用户可主动启用。减少动态效果下，模型与镜头直接到达目标。
- WebGL2 不可用、初始化异常、动态模块失败 / 超时、上下文丢失时回退二维，可手动重试。
- sessionStorage 仅记录显示偏好和选中分类；存储不可用不影响使用。

## 架构与资源

首页分别使用 `src/pages/index.astro` 和 `src/pages/zh/index.astro`。其余页面仍由 catch-all 枚举；该模块不再导入 Home，避免 Astro 提升条件组件脚本后把加载器带到内容页。

```text
archive.ts 分类与双语文案
        ↓
Home + ArchiveTerminal（静态 HTML、按钮、摘要、真实链接）
        ↓
bootstrap.ts（偏好、选择、键盘、生命周期、异步加载票据）
        ↓ dynamic import
ArchiveScene.ts（原始 Three.js、Raycaster、共享几何、镜头）
        ↓
state.ts（时间差阻尼、像素预算、单 RAF）
resources.ts（LIFO 清理、异常清理、幂等 dispose）
```

几何、标签与图形均为原创程序生成。五片活动档案共享 BoxGeometry、PlaneGeometry 和边框几何，十片背板使用一个 InstancedMesh；没有 GLB、HDR、外部纹理、字体或音频请求。材质通过半透明外壳、高粗糙度和不透明内页模拟磨砂层次，没有昂贵的物理透射、实时阴影或后处理。

按需帧循环在稳定后停止。IntersectionObserver 和 visibilitychange 暂停不可见场景；pagehide 释放资源，BFCache pageshow 可重建。清理包括 RAF、ResizeObserver、监听器、实例缓冲、几何、材质、纹理、renderer 与 WebGL 上下文。初始化到一半失败也进入同一资源清理流程。

动态导入有 8 秒超时和 request ticket。浏览器已发出的 import 请求不能被 AbortController 取消；切回轻量或离开页面后，过时返回结果不会创建场景。首版固定十五片，无无限阵列、自由拖动或自动画质升降。

## 主要变更文件

| 文件 | 作用 |
| --- | --- |
| `src/data/archive.ts` | 五类档案、目标 URL、英中终端文案 |
| `src/components/archive/ArchiveTerminal.astro` | 渲染容器、二维替代、摘要、模式和分类操作 |
| `src/components/views/Home.astro` | 首页布局与永久可用的 HTML 目录 |
| `src/pages/index.astro`、`src/pages/zh/index.astro` | 独立首页脚本入口 |
| `src/pages/[...path].astro` | 移除首页分支，隔离内容页依赖 |
| `src/scene/ArchiveScene.ts` | 几何、程序纹理、拾取、光照、镜头与渲染 |
| `src/scene/bootstrap.ts` | DOM 状态、输入、异步取消和页面生命周期 |
| `src/scene/state.ts`、`resources.ts`、`types.ts` | 运动 / 质量规则、资源所有权、接口 |
| `src/styles/archive.css`、`tokens.css` | 终端响应式及暖灰 / 炭黑 / 橙金色令牌 |
| `src/i18n/ui.ts`、`src/components/views/InfoPage.astro` | 致谢与 Three.js 许可入口 |
| `package.json`、`package-lock.json` | Three.js 0.186.1、@types/three 0.186.0 |
| `public/licenses/three-MIT.txt`、`THIRD_PARTY_NOTICES.md` | 完整 MIT 许可证及实际依赖说明 |
| `tests/scene.test.mjs` | 运动、导航、分辨率、RAF 与清理测试 |
| `scripts/check-site.mjs` | 内容页引擎隔离、体积、许可和测试代码排除检查 |
| `scripts/preview-qa.mjs`、`tests/browser/harness.js` | 不进入 dist 的本地故障注入验证 |
| `README.md`、`AGENTS.md`、架构 / 设计 / 实施计划 | 当前实现、限制与开发方式同步 |

用户原有 `test` 文件保持不变。

## 自动化检查

| 命令 | 最终结果 |
| --- | --- |
| `npm run check` | 35 个文件，0 errors / 0 warnings / 0 hints |
| `npm test` | 13 项通过，0 失败 |
| `npm run build` | 成功，21 个静态 HTML 页面 |
| `npm run check:site` | 573 个内部链接 / 锚点通过 |
| `npm run format:check` | 通过 |

单元测试包括原有七项内容 / 路由测试，以及六项场景测试：首尾导航、帧率无关和可中断的运动、DPR / 像素限制、默认模式偏好、单 RAF 暂停 / 终止、逆序和异常情况下的幂等资源清理。

产物检查验证所有内容页不引用场景加载器，首页不提前 modulepreload 引擎；完整许可与安装包文本一致。草稿过滤、模板 noindex、sitemap 和 HTML 基础导航继续有效。本地 QA 注入代码未进入产物。

构建仍有一条 Vite 提示：延迟加载的 Three.js chunk 压缩后原始文件大于 500 kB。该提示没有被调高阈值隐藏；模块已经动态加载，gzip 体积符合 220 KiB 预算。它不是类型错误或构建失败。

## 浏览器验证

环境为 Windows Edge、本地生产产物、未加 CPU / 网络节流；不是手机真机性能测量。

| 验证 | 观察结果 |
| --- | --- |
| 鼠标点击实际 3D Software 档案 | Raycaster 选择正确，抽取和摘要同步 |
| 键盘连续切换 | 最后一次选择生效；Escape 回阵列并恢复分类按钮焦点 |
| OPEN ARCHIVE | 导航实际 Research / Contact 页面 |
| 内容页隔离 | Contact 页实测 engineRequests 为 0；全产物静态检查通过 |
| 320px 中文 / 390px 手机视口 | 操作与文本回流；320px 页面 scrollWidth 为 305px（扣除滚动条），无横向溢出 |
| 小屏初始模式 | 无 canvas，无引擎请求；可手动开启三维 |
| Skip Intro | 跳到 archive-index，焦点落在目录，canvas 数量归零 |
| 稳态停帧 | 采样等待期间 frames 未增长 |
| 连续五次轻量 / 三维切换 | 每次关闭后 0 canvas / 0 活动上下文，重建后只有 1 个上下文，资源计数稳定 |
| document.hidden 注入 | 暂停时 frames 不变，恢复后可继续运动 |
| WEBGL_lose_context 扩展 | 自动回退二维，保留五个链接，显式重试后恢复一个上下文 |
| 强制 getContext 返回 null | 展示失败说明与二维 UI，无未捕获异常 |
| reduced-motion 注入 | 默认引擎请求为 0；主动开启后状态直接到位 |
| sessionStorage 抛错注入 | 页面与选择继续工作，无未捕获异常 |
| 动态模块延迟 4 秒 | 加载中切换轻量；返回后没有创建上下文或画布 |
| 移除全部生产 script | 0 scripts / 0 canvas，五个 HTML 分类链接保留，原生移动菜单可展开 |
| 合成触屏 Pointer Events | 轻点选中；40px 位移和 pointercancel 不误选 |
| 控制台 | 正常预览无捕获到的 error / warn；生命周期 harness 无 error / unhandledrejection |

最终生命周期日志输出 `LIFECYCLE PASS`。故障验证由本地 QA 服务注入，正常生产代码没有测试开关。测试场景不应当作真实移动设备、真实后台切换或完整的禁用 JavaScript 浏览器配置。

## 体积与渲染测量

| 指标 | 本次测量 |
| --- | --- |
| 首页基础 JS gzip | 2,892 B |
| 内容页 JS gzip | 194 B |
| 延迟 3D JS gzip | 135,838 B，约 132.7 KiB |
| 全部 CSS gzip | 8,921 B |
| 最大 HTML gzip | 3,199 B |
| 桌面场景 | 17 draw calls，190 个三角形，4 个几何缓冲、6 个纹理计数 |
| 320px 主动启用、Software 选中 | 12 draw calls，190 个三角形，3 个几何缓冲、6 个纹理计数，74,200 像素 |
| 桌面实测绘图缓冲 | 649,800 像素 |

绘制调用与资源计数来自 renderer.info；纹理计数包含 renderer 内部资源，不等于六张外部图片。背板和活动片共享资源，移动端不绘制边框。DPR 上限为桌面 1.5、移动 1，并分别限制 2.1M / 0.8M 像素。资源计数在五次重建中稳定、关闭时上下文释放，未发现明显积累；没有进行长时 GPU / JS 堆分析，因此不声称已经证明所有情况下零泄漏。

gzip 是构建文件测量，不是 GitHub Pages 线上传输测量。没有运行线上 LCP / CLS / INP、交互 p95 帧时间、真机发热或电池测试，不宣称已达到这些预算。浏览器 200% 缩放快捷键未产生可确认的缩放变化，因此此项仍未验收；320px 回流不能替代真实缩放、读屏或全量 WCAG 检查。

## 本地运行与后续

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm.cmd run dev
```

打开终端输出地址；默认 `http://127.0.0.1:4321/`，中文为 `/zh/`。如果端口被占用，Astro 会显示下一个可用端口。本轮生产预览使用 4322，故障验证服务使用 4323。

生产预览使用 `npm.cmd run build` 后 `npm.cmd run preview`；本地故障验证使用 `node scripts/preview-qa.mjs`，方式见 README。

剩余验证：真实 iOS / Android、Safari / Firefox、读屏、200% 浏览器缩放、长时间资源分析及交互帧时间。真实资料接入、更多成果映射与 GitHub Pages 发布继续留待后续阶段。

参考研究仍固定为 RhineLabUI 提交 `12cc5e4013acb9408f753ff71de6b8492299b7c8`，主要复核了 scene.ts 的 Raycaster、hover、相机阻尼和资源生命周期；实现为独立编写，没有复制上游源码或受限素材。通用渲染接口参考 [Three.js 官方文档](https://threejs.org/docs/)，研究来源详见 [DESIGN_SPEC.md](DESIGN_SPEC.md)。
