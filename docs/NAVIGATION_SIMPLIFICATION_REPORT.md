# 档案界面导航、暖光与波浪更新

日期：2026-10-22。仅本地实现，没有 commit / push / 部署。

本次包含导航减法及用户随后提供的参考截图修正；最终方案以本报告为准，早期“只显示一个模式按钮 / 大面积右侧摘要卡片”方案已撤回。

## 最终交互与排版

- 移除 Skip Intro、常驻“打开静态页面”和重复阅读关闭按钮。唯一返回操作在左上 Logo 下方，阅读器 → 项目阵列 → 首页。
- 恢复始终可见的 **3D / 简洁模式** 双段切换，选中段以滑动下划线标记。切换简洁模式保留当前项目/部分，取消未完成的打开动作并释放 renderer。
- 二级右侧无大底板、无模糊遮罩；显示作品集、醒目项目编号/名称、次级部分位置/名称及打开操作。
- 左下控制项目内部分，右下控制跨作品集的项目；总数来自 manifest。按钮下方显示真实相邻目标。目录按需展开，项目原有行位置记忆保留。
- 箭头、打开、返回与部分编号常态透明；悬停暖金色/下划线，键盘焦点可见。局部悬停说明显示 `A02 项目名称` 与 `01/04 部分名称`，指针移出、导航、暂停或阅读时清除。
- 滚轮仅作用于正常 3D 矩阵区域；归一化像素/行/页单位，48px 阈值、420ms 冷却避免连续误跳；横向手势、Ctrl 缩放和正文滚动不拦截。

## 光影与运动

- 降低曝光、环境光强度，改用暖色主光和暖米色半球光，保留已有实时投影、接缝及金属层次。移动端继续关闭实时阴影，使用小实例池。
- `archive-waves.ts` 使用上游 RhineLabUI 固定提交 `12cc5e4013acb9408f753ff71de6b8492299b7c8` 的 MIT 波形；来源、改编范围、完整许可证路径见 `THIRD_PARTY_NOTICES.md`。
- 待机：8s 和 13s 两个相位错开的正弦波，最大位移 0.102；切换后 2.5s 渐入。
- 切换：选中格向外传播有正负起伏的波包，行/列距离比 2.2，最多同时 6 个波包、3.2s 过期、叠加限幅 ±0.6。项目和部分切换共用这一逻辑。
- 活动档案与池中实例使用同一高度场，叠加已有连续弹簧和抽取逻辑。阅读时淡出，reduced-motion 立即清除波浪。可见矩阵为了待机动画持续渲染，隐藏/离屏/Contact 暂停；首页和阅读器静止后停止 RAF。

## 内容与资源

没有改写科研正文、论文记录、软件资料、静态路由或第三方原仓库；没有新增外部模型/纹理/音频。静态目录及读取失败时的原始页面恢复链接仍然可用。

## 修改文件

- `src/components/archive/ArchiveTerminal.astro`：两轴导航结构、双段切换、悬停说明、统一返回。
- `src/styles/navigation-layout.css`：透明 HUD、底部布局、窄屏适配及交互状态。
- `src/scene/bootstrap.ts`：动态目录/目标名称、模式生命周期、滚轮与悬停文案。
- `src/scene/reader.ts`：统一返回焦点，读取失败提供原页面恢复链接。
- `src/scene/ArchiveScene.ts`、`types.ts`：暖光、Raycaster 悬停通知与清理。
- `src/scene/MatrixField.ts`、新增 `archive-waves.ts`：待机与切换高度场。
- 新增 `src/scene/wheel-navigation.ts`、`tests/archive-waves.test.mjs`；更新 `tests/browser/harness.js`。
- `AGENTS.md`、`docs/ARCHITECTURE.md`、`docs/DESIGN_SPEC.md`、`THIRD_PARTY_NOTICES.md`、`README.md` 及本报告同步维护。

## 验证记录

- `npm run check`：58 文件，0 errors / warnings / hints。
- `npm test`：29 项通过；含波形幅度/传播/生命周期及滚轮单位/冷却测试。
- `npm run build`：37 页成功。Vite 仍提示动态 Three.js chunk 压缩前超过 500kB，非构建错误；未抬高阈值隐藏提示。
- `npm run check:site`：1163 内部链接与锚点通过；内容页面不加载 Three.js；MIT 许可在产物中。
- gzip：首页 bootstrap 7797B、动态 3D 140671B、内容页 JS 194B、CSS 13674B。
- `npm run format:check`：通过。

- Edge 桌面浏览器：25 项导航/滚轮/悬停专项断言全部通过，39 项完整生命周期回归断言通过（含五次 renderer 销毁/重建、上下文丢失降级、实际正文读取、退出取消和触屏事件模拟），没有捕获未处理的应用错误。
- 320px CSS iframe：部分切换及打开正文正常，无横向溢出；修正旧样式残留 bottom 导致的编号点击区覆盖，编号按钮保持至少 44px。此项是桌面浏览器窄屏验证。

- 实际浏览器滚轮：A02 从研究概览切换到工作流程，项目保持不变。
- 模拟 reduced-motion：手动启用 3D 后停在 2 帧，moving=false；两次读取帧数一致。模拟无 WebGL：0 canvas / 0 context，仍能切换并打开真实工作流程正文。分别记录于 `reduced-motion.json` / `no-webgl.json`。

浏览器专项记录及最终截图见 `docs/qa/warm-archive/`。真实手机触控、不同 GPU 的帧率和长期运行仍需实机验收；桌面窄窗口/iframe 并非真实手机测试。

## 本地预览

`npm run dev`；或 `npm run build` 后 `npm run preview`。英文 `/`、中文 `/zh/`。已开启的开发服务可能需要刷新以读取新 CSS 和场景代码。
