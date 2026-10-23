# Phase 1 实施与验收记录

日期：2026-10-20。范围以用户本轮实施要求为准：完成本地静态网站基础及双语页面，不实现复杂 Three.js，不推送 GitHub。

## 交付结果

- Astro 静态生成、strict TypeScript、Tailwind CSS 4 官方 Vite 集成。
- `site: "https://azure179.github.io"`，未设置 `base`，目录式 HTML 输出至 `dist/`。
- 默认英文根路径，中文 `/zh/`；公共导航、页脚、语言切换、移动菜单、跳至正文链接、焦点与减少动态效果样式。
- 暖纸灰、深青绿、档案索引和细线构成统一视觉；首页采用原创 HTML/CSS 档案叠层，移动端收起装饰。
- 首页、About、Research、Publications、Projects、Contact，以及 CV、Credits、404。
- 科研 / 软件详情的共享布局、元信息、正文、目录与资源区；另有明确标记的双语占位模板。
- Markdown 内容集合管理 research、software、publications。`software` 公开路径为 `/projects/`。
- 发布过滤、翻译回退、翻译版本与身份一致性检查；未提供的真实内容不生成成果条目。
- canonical、hreflang、sitemap、robots.txt、`.nojekyll`。模板 `noindex` 且不进入 sitemap。

实际生成 **21 个 HTML 页面**：8 类页面 × 2 种语言、2 类详情模板 × 2 种语言、1 个 404。真实条目详情按通过发布校验的内容生成，目前没有已核验条目。

## 主要文件

| 文件 / 目录 | 作用 |
| --- | --- |
| `package.json`、`package-lock.json`、`.nvmrc` | 精确依赖、可复现安装与检查命令 |
| `astro.config.mjs`、`tsconfig.json` | 静态站点、双语、sitemap、Tailwind 与严格类型配置 |
| `.gitignore`、`.prettierrc.json`、`.prettierignore` | 排除产物和本地缓存，统一格式 |
| `src/pages/[...path].astro`、`src/pages/404.astro` | 枚举静态路由和 404 |
| `src/layouts/BaseLayout.astro`、`DetailLayout.astro` | 公共外壳、SEO、详情排版 |
| `src/components/site/` | Header、Footer、原生 details 移动菜单 |
| `src/components/views/`、`src/components/PageHeading.astro` | 首页、索引、个人简介、联系等页面视图 |
| `src/components/archive/ArchiveGraphic.astro` | 原创静态档案构图 |
| `src/styles/tokens.css`、`global.css` | 设计令牌、Tailwind 入口、响应式及打印样式 |
| `src/content.config.ts`、`src/content/` | 类型化 schema 与不发布的写作草稿 |
| `src/lib/routes.ts`、`content-policy.ts`、`content.ts` | 路由、发布和翻译规则 |
| `src/i18n/ui.ts` | 英中 UI 字典与键约束 |
| `src/data/profile.ts`、`templates.ts` | 待补充个人资料与显式模板提示 |
| `public/favicon.svg`、`robots.txt`、`.nojekyll` | 原创图标及静态托管辅助文件 |
| `tests/content.test.mjs` | 内容发布、路由与翻译规则测试 |
| `scripts/check-site.mjs` | 静态产物、链接、锚点与体积检查 |
| `README.md`、`AGENTS.md`、四份原规划文档 | 开发入口、实际约束与实施状态同步 |

原有 `test` 文件保留，未修改、移动或删除。未复制上游代码、字体、模型、音频或图片；未替用户选择整个仓库的开源许可证。

## 环境与版本

| 项目 | 本次使用版本 |
| --- | --- |
| Node.js / npm | 24.20.0 / 11.19.0 |
| Astro | 7.4.1 |
| TypeScript | 5.9.3 |
| Tailwind CSS / @tailwindcss/vite | 4.3.3 |
| @astrojs/sitemap | 3.7.4 |
| @astrojs/check | 0.9.11 |
| Prettier / prettier-plugin-astro | 3.9.10 / 1.1.1 |

TypeScript 按 Astro 检查器兼容范围选择，并未追求不兼容的最新主版本。支持 Node 22.22.0+；锁文件用于后续 `npm ci`。当前 Windows 会话通过临时 PATH 调用已安装的 Node，没有修改系统 PATH。

## 自动检查结果

| 命令 | 实际结果 |
| --- | --- |
| `npm run check` | 23 个文件，0 errors、0 warnings、0 hints |
| `npm test` | 7 项通过，0 失败 |
| `npm run build` | 成功，输出 21 个静态页面 |
| `npm run check:site` | 21 个 HTML、557 个内部链接 / 锚点通过 |
| `npm run format:check` | 全部实现文件符合 Prettier 格式 |

单元测试覆盖三个发布条件的所有组合、英文 / 中文 URL、非法 slug、缺失译文回退、已发布译文选择、重复 / 保留路径、跨语言身份不一致和过期译文。

产物检查包括页面语言、单一 H1、正文锚点、canonical、重复 ID、站内路径与锚点、草稿隔离、模板 noindex、sitemap 和静态体积。当前没有独立 ESLint 配置；代码检查使用 Astro / TypeScript strict 和 Prettier，不能将其表述为通过了 ESLint。

构建产物 gzip 测量：外部 JS **0 B**，每页内联 JS 最大 **194 B**，全部 CSS **6,948 B**，最大 HTML **2,330 B**。HTML 数字包含内联脚本，统计口径不同，不应把这些数字简单相加称为浏览器实际传输量。未包含 HTTP 头与服务端压缩策略，也不是线上 Core Web Vitals 测量。

## 浏览器复核

使用 Windows Edge、本地生产预览 `http://127.0.0.1:4321/`：

- 查看英文 / 中文首页、科研列表和详情模板。
- 复核 1440 × 900 桌面、390 × 844 手机视口、320 × 740 窄屏布局。
- 320px 中文详情页测得 document scrollWidth 为 305px（浏览器占用滚动条宽度），没有水平溢出。
- 移动菜单可开合，Escape 关闭并将焦点还给菜单开关；菜单中的科研链接可导航。
- 英中切换抵达对应模板；目录与正文顺序在小屏一致。
- 重新构建后刷新页面，确认最终样式生效；完成后恢复临时视口设置。

日志中曾出现一条 `Could not establish connection. Receiving end does not exist.` 连接消息，未定位来源，页面导航与菜单验证正常；不声称控制台完全无错误。本站脚本仅处理菜单，未加入扩展通信或第三方客户端 API。

尚未执行真机 iOS / Android、Firefox / Safari、屏幕阅读器、200% 浏览器缩放、完整 WCAG 审计及线上 LCP / CLS / INP 测量；现有回流检查不能替代这些验证。无 JavaScript 基础结构采用原生链接与 details，但本轮没有另开禁用 JavaScript 的浏览器环境进行实测。

## 本地预览

```sh
npm ci
npm run dev
```

默认打开 `http://127.0.0.1:4321/` 或 `/zh/`。安装依赖后无需每次重复 `npm ci`。

生产构建预览：

```sh
npm run build
npm run preview
```

Windows 若命令不在 PATH：

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm.cmd run dev
```

使用 `Ctrl+C` 停止服务。更多路由、内容写作和检查说明见 [README.md](../README.md)。

## 后续工作

1. 补充并核验姓名、经历、研究兴趣、项目、论文、联系方式与 CV；按发布条件接入真实内容。
2. 有真实图表 / 图片后，完善资源许可记录、尺寸、替代文字与图片优化。
3. 按新授权开展原创 Three.js 首页增强，同时保留当前完整静态阅读路径。
4. 补齐上述跨浏览器、真机、缩放、读屏和性能验证。
5. 获得发布授权后配置 GitHub Pages Actions 与仓库 Pages 设置，再验收线上域名。

当前仅准备 GitHub Pages 所需静态产物配置；没有提交、推送、修改远程仓库或部署。
