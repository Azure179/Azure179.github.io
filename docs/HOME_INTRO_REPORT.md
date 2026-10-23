# 首页开屏与选中文件夹反馈

日期：2026-10-24。

## 完成内容

- 修复静态备用首页先露出、随后切换 3D 布局的闪现：首屏 head 内联控制器与关键样式，先显示暖白 / 橙金开屏。本站字标、细圆弧与细线依次显现，无新增图片、字体、模型、声音或动画库。
- 正常加载为 2.4 秒展示 + 0.6 秒淡入；只有真实 3D 首帧就绪才揭示。慢网继续等待，最迟 8.5 秒开始退出到静态内容。开屏内简洁模式与 Esc 可提前退出；迟到的模块不强制切回 3D。
- 减少动态效果、小屏 / 粗指针、省流量、已选简洁模式直接显示内容。无 JS 不启用遮罩；内容详情页没有开屏代码。
- 已选中文件夹增加暖金选择指示；移入时额外抬起、向前、轻微倾斜及玻璃前盖微提，移出平滑复位。未选中模型保持原有单纯轻抬；选择切换渐变，打开时退出悬停姿态。单击后的鼠标位置保留，避免选中模型必须重新移动鼠标才恢复响应。
- 保留已有 3D 场景、项目内容、双击打开、两级矩阵与阅读器；没有改科研素材。

参考：[RhineLabUI boot.ts](https://github.com/LBEILC/RhineLabUI/blob/main/src/boot.ts)、[startup.ts](https://github.com/LBEILC/RhineLabUI/blob/main/src/startup.ts)。借鉴分阶段 DOM / SVG 揭示与就绪门控思路，本轮实现独立编写，未复制其品牌资产或开场代码。既有 MIT 许可保持。

## 文件

- 新增 `src/components/archive/ArchiveIntroHead.astro`、`ArchiveIntro.astro`、`src/styles/intro.css`、`src/scene/intro.js`。
- 修改 `src/layouts/BaseLayout.astro`：仅首页输出开屏；`src/scene/bootstrap.ts`：首帧 / 降级通知与取消；`ArchiveScene.ts`、`FolderField.ts`：选中悬停反馈。
- 新增 `tests/intro.test.mjs`、`tests/folder-feedback.test.mjs`；扩展本地专用 `tests/browser/harness.js` 记录真实时序。
- 同步 `AGENTS.md`、`docs/ARCHITECTURE.md`、`docs/DESIGN_SPEC.md`；证据位于 `docs/qa/home-intro/`。

## 自动检查

| 检查 | 结果 |
| --- | --- |
| `npm run check` | 68 个文件，0 error / warning / hint |
| `npm test` | 41 通过，0 失败 |
| `npm run format:check` | 通过 |
| `npm run build` | 43 页成功；仍有原有 Three.js 分块大于 500 kB 的提醒 |
| `npm run check:site` | 1,384 个内部链接 / 锚点通过，3D 引擎仅首页 |
| `npm run check:release` | 48 个 public 资源通过，产物 4.56 MiB |

开屏测试执行实际内联脚本，覆盖正常 3 秒时序、慢加载、WebGL 失败、bootstrap 缺失、Esc、减少动态效果、存储不可用、pagehide 清理和迟到消息。模型测试执行实际 Three.js 几何与 Raycaster，模拟 Canvas 文字测量，不依赖 GPU；验证选中与未选中反馈差异、复位、切换中断、减少动态效果和资源重复释放。

## 浏览器验证与边界

Windows Edge，1912 × 914 CSS 像素，本地生产构建：

- 正常中英文开屏及第一级显现已目视检查。
- 本地注入 4 秒动态模块延迟：第 2 ms 启用遮罩；第 4482 ms，frames=1 后开始揭示；第 5083 ms 完成退出。见 `slow-load.json`。这是故障注入，不是线上实际网络测速。
- 模拟无 WebGL：恢复简洁内容，0 canvas / GPU context；无 JS 时真实 HTML 目录可用。
- 模拟 reduced-motion：无开屏、无 3D 请求；页面错误捕获列表为空。
- 中文第一级模型双击进入 Academic 矩阵，Esc 返回成功。
- 浏览器悬停测试中存在按 10 秒判断收敛的超时，不能记为通过。实际截图能看到已选中模型响应；模型状态与清理的确定性测试通过。动画顺滑度及真实手机还需要人工目视验收，未宣称帧率达标。
- 浏览器工具日志出现扩展连接提示 `Could not establish connection`；页面级 error / unhandledrejection 捕获未发现应用错误。没有把扩展消息当作站点异常，也未声称浏览器日志绝对为空。

本地预览：`npm run preview -- --port 4322`，访问 `http://127.0.0.1:4322/zh/`。显示模式保存在 sessionStorage；先选择 3D 再刷新即可检查开场。开屏帧截图：`docs/qa/home-intro/opening.png`。
