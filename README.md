# BIOINFORMATICS ARCHIVE

面向博士申请与生物信息学 / AI 研发求职的个人作品集。Phase 3.1 在 Phase 3 内容之上实现两个 Three.js 文件夹、项目 × 栏目档案阵列与内容阅读器。四个科研提纲、两个技术案例及英中静态详情保持原有内容来源。

- 学术总览：/academic/；技术总览：/technical/；中文前缀 /zh/。
- 研究详情继续使用 /research/<slug>/，软件详情使用 /projects/<slug>/。旧总览及模板 URL 保留。
- 科研内容当前是主题提纲，结果、论文和本人贡献待确认，不能视为已发表成果。T1 保留上游 Phase 7.8 NOT READY 状态。
- [实施报告](docs/PHASE3_CONTENT_REPORT.md) · [资料清单](docs/CONTENT_TODO.md) · [来源核查](docs/PHASE3_SOURCES.md)。
- [Phase 3.1 分层交互报告](docs/PHASE3_1_ARCHIVE_REFACTOR_REPORT.md)：文件清单、状态机与验证边界。
- [2026-10-22 视觉与阅读优化报告](docs/ARCHIVE_POLISH_REPORT.md)：统一卡匣、连续镜头、侧边阅读与跨作品集导航。
- [导航、暖光与波浪报告](docs/NAVIGATION_SIMPLIFICATION_REPORT.md)：3D / 简洁双段切换、Logo 下方统一返回、透明摘要与底部导航、滚轮及悬停提示，以及上游 MIT 波形的接入与验证。

首页单击选择文件夹，双击 / Enter / OPEN FOLDER 进入作品集。左右切换项目，上下切换四份内容档案，Enter / OPEN DOCUMENT 阅读，Esc 逐层返回。触屏支持两次点击和明确按钮；右上角 Contact 汇集个人信息入口。轻量模式、无 WebGL 和无 JavaScript 均保留静态内容链接。

首页与第二级统一使用原创金属卡匣，包含圆角边轨、螺钉、层叠内页及半透明盖。文件夹开启后连续进入全屏密集阵列；左右在四个学术项目与两个技术项目间连续循环，上下保留各项目的栏目位置。打开档案时模型抽取到左侧、正文在右侧展开，项目名称优先于栏目名。3D 首页隐藏重复文字目录，轻量模式保留真实链接。实际效果见 [桌面阅读截图](docs/qa/archive-polish/reader-desktop.jpg)；手机真机与最终美术验收仍待完成。

可分享阅读状态示例：`/#archive/academic/black-porgy-sex-reversal/overview/read`；中文加 `/zh/`。阅读器始终提供对应静态页面链接；刷新、浏览器前进后退及语言切换保留可解析的档案位置。

站点配置为 `https://azure179.github.io`，静态输出到 `dist/`，没有 `base` 子路径。本阶段没有部署工作流，也没有推送或发布。

## 本地运行

需要 Node.js **22.22.0+**；本次验证环境为 Node **24.20.0** / npm **11.19.0**，`.nvmrc` 记录了 Node 版本。

```sh
npm ci
npm run dev
```

浏览器打开终端打印的地址，默认：

- 英文：<http://127.0.0.1:4321/>
- 中文：<http://127.0.0.1:4321/zh/>
- 科研详情模板：<http://127.0.0.1:4321/research/template/>
- 软件详情模板：<http://127.0.0.1:4321/projects/template/>

Windows 当前会话若找不到 `node` / `npm`，但已经安装在 `C:\Program Files\nodejs`，可以临时补充 PATH，并使用 `npm.cmd` 避免 PowerShell 脚本执行策略的影响：

```powershell
$env:Path = "C:\Program Files\nodejs;" + $env:Path
npm.cmd run dev
```

不会修改系统 PATH。按 `Ctrl+C` 停止开发服务器。

## 检查与生产预览

```sh
npm run check
npm test
npm run build
npm run check:site
npm run format:check
npm run preview
```

| 命令 | 用途 |
| --- | --- |
| `check` | Astro / TypeScript strict 检查 |
| `test` | 内容发布门槛、路由、翻译回退与身份一致性测试 |
| `build` | 预生成所有静态 HTML、CSS 和 sitemap |
| `check:site` | 检查构建产物的内部链接、锚点、语言、草稿隔离、模板 noindex 和体积 |
| `format:check` | Prettier 检查 Astro / TS / CSS / 脚本格式 |
| `format` | 格式化实现文件 |
| `preview` | 本地预览 `dist/`；修改源码后需要重新 build |

构建后可将 `dist/` 用于 GitHub Pages Actions artifact；当前仅准备静态配置，后续获得发布授权再配置 workflow 和 Pages Source。

## 信息架构

| 页面 | 英文 | 中文 |
| --- | --- | --- |
| 首页 | `/` | `/zh/` |
| 学术作品集 | `/academic/` | `/zh/academic/` |
| 技术作品集 | `/technical/` | `/zh/technical/` |
| 关于 | `/about/` | `/zh/about/` |
| 科研 | `/research/` | `/zh/research/` |
| 论文 | `/publications/` | `/zh/publications/` |
| 软件项目 | `/projects/` | `/zh/projects/` |
| 联系 | `/contact/` | `/zh/contact/` |
| 简历 | `/cv/` | `/zh/cv/` |
| 来源与致谢 | `/credits/` | `/zh/credits/` |

科研、软件和论文详情根据可发布内容自动生成。`/research/template/`、`/projects/template/` 及中文对应路径用于查看排版，明确标记为占位模板，设置 `noindex`，不进入 sitemap、不计作真实成果。

## 编辑内容

- `src/data/profile.ts`：真实姓名、简介、邮箱与 CV 路径；目前均未填写，前端显示显式占位内容。
- `src/content/research/`：科研 Markdown。
- `src/content/software/`：软件 Markdown，公开 URL 为 `/projects/<slug>/`。
- `src/content/publications/`：论文 Markdown。
- `src/content.config.ts`：实际字段、默认值与 Zod 校验。
- `src/lib/content-policy.ts`：公开条件、翻译配对与身份校验。
- `src/i18n/ui.ts`：有相同键约束的英中 UI 文案。
- `src/data/templates.ts`：详情模板的写作提示，不是项目数据。

每个集合有一个 `starter/en.md` 草稿，包含写作结构。这些文件没有个人事实，`draft: true`、`verified: false`、`visibility: private`，不会出现在站点产物中。`private` 是发布筛选标记，**不能让公开 Git 仓库中的源文件变得私密**；不要把真实保密材料放入仓库。

添加真实条目：

1. 复制对应 starter 到 `<真实项目键>/en.md`，设置唯一的 `translationKey`、`archiveId` 和 `slug`。
2. 替换所有占位文案，删除 `DRAFT_ONLY_SENTINEL`，填写真实内容和可公开证据。科研 / 软件填写角色、状态和贡献；论文填写正式题名、作者与真实状态。
3. 填写 `updatedAt`、`verifiedAt` 和 `evidenceRefs`。证据字段只记录可公开依据或确认记录的标识，不放私人材料。
4. 事实与权限核验完成后，设置 `draft: false`、`verified: true`、`visibility: public`。三项必须同时满足才生成页面。
5. 中文使用同一 `translationKey`、`archiveId`、`slug`，`locale: zh`；`sourceRevision` 必须等于英文 `revision`。更新英文时递增 revision，及时更新翻译。
6. 运行全部适用检查并本地预览。没有中文翻译时，中文列表标注“英文内容”并链接真实英文页。

Phase 3 的统一详情使用 frontmatter 中的 study / caseStudy 字段；布局与内容分离，具体契约见 `src/lib/portfolio-schema.ts` 和 [CONTENT_PLAN.md](docs/CONTENT_PLAN.md)。旧 Markdown 详情仍可渲染。研究提纲明确使用 outline，只验证用户提供的主题范围，不能填写结果与贡献；软件源码核查使用 source-review，不等同于个人独立贡献。

论文通过 study.publicationIds 引用集中维护的 translationKey，未公开或不存在的引用会阻止构建。figures 维护本地图片路径、真实尺寸、标题、替代文本、来源及许可；原创示意与真实截图分别标识。不要为了填满页面编造结果、学位、论文或作者信息。

## 实现结构

```text
src/pages/index.astro           英文首页（独立脚本入口）
src/pages/zh/index.astro        中文首页（独立脚本入口）
src/pages/[...path].astro       枚举其他双语页面与真实内容详情
src/pages/404.astro             双语 404
src/layouts/                   基础布局与详情布局
src/components/site/           导航、原生 details 手机菜单、页脚
src/components/views/          首页、分类、关于与信息页
src/components/archive/        档案终端、等效 DOM 控制与二维替代
src/components/portfolio/      双作品集总览、统一详情与可放大图库
src/scene/                     按需 Three.js 场景、控制器、运动与资源释放
src/data/archive.ts            双语终端文案
src/lib/archive-manifest.ts    公开集合 → 两级档案导航与静态栏目映射
src/lib/archive-model.ts       层级状态机、双轴循环、列记忆、URL 解析
src/scene/reader.ts            按需读取静态详情正文，保留证据说明与图像
src/styles/                    Tailwind 4 入口、设计令牌、排版与响应式
src/content/                   构建时 Markdown 集合
tests/                         Node 单元测试
scripts/check-site.mjs          静态产物检查
```

视觉使用暖白、浅灰、炭黑、少量橙金和档案索引。系统字体，无外部图片 / 字体请求、无后端。导航与正文不依赖 JavaScript，原生 `<details>` 菜单在无脚本时仍可开合。

Phase 3.1 为贴近参考站的密集阵列，改编了 RhineLabUI 的 MIT 循环计算、肩部起伏和长焦构图，并随站分发完整许可证；档案几何、标签与个人品牌独立生成，不导入其模型或游戏资产。Three.js 0.186.1 的 MIT 许可证同样随站分发，具体源文件、提交与改编范围见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。详细约束见 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)、[docs/DESIGN_SPEC.md](docs/DESIGN_SPEC.md) 和 [AGENTS.md](AGENTS.md)。

## 交互首页

- 桌面默认启用两个三维文件夹；单击选择，双击或 OPEN FOLDER 进入项目阵列，OPEN DOCUMENT 阅读对应栏目。
- 左右切换项目，上下切换栏目，各项目记住位置；Enter 打开，Escape 按阅读器 → 阵列 → 首页返回。静态链接可直接访问原有页面。
- `3D / 简洁模式` 切换场景与二维操作，保留普通链接；不再提供重复的 Skip Intro 入口。
- 窄屏、粗指针、减少动态效果和省流偏好默认不加载 Three.js；仍可主动启用。减少动态效果下，模型与镜头即时到位。
- 其他页面不加载场景或控制器。稳态停 RAF，离屏 / 隐藏暂停，离开页面释放 GPU 与监听器。

## 本地故障验证

完成 build 后运行：

```sh
node scripts/preview-qa.mjs
```

访问 `http://127.0.0.1:4323/?qa=normal`，点击 `Run lifecycle checks` 验证反复启停、静止停帧、隐藏恢复和上下文丢失。此服务器有意延迟 3D 模块 4 秒，用于故障验证，不用于测量真实加载性能。

`?qa=nogl` 模拟无 WebGL；`?qa=reduced` 模拟减少动态效果；`?qa=storage` 模拟不可用的 sessionStorage；`?qa=slow` 在加载中自动关闭并验证过时结果不创建场景；`?qa=nojs` 移除所有生产脚本，检查纯 HTML 基础路径。诊断只运行在本地，不进入 `dist/`。

`/responsive-qa/?width=390` 或 `width=320` 提供本地 iframe CSS 窄屏验证；这不等于手机真机测试。

当前实施范围、测量口径与验证限制见 [docs/PHASE3_1_ARCHIVE_REFACTOR_REPORT.md](docs/PHASE3_1_ARCHIVE_REFACTOR_REPORT.md)；早期记录见 [docs/PHASE_2_REPORT.md](docs/PHASE_2_REPORT.md)。


## Phase 3.2 内容维护

六个项目保留原有四份档案与稳定路由，真实论文集中在 `src/content/publications/`。原创概念图与流程图提供英文和 `-zh.svg` 中文版本；论文原图保留原始标注。

- [实施报告](docs/PHASE3_2_CONTENT_INTEGRATION_REPORT.md)
- [素材缺口与手动添加教程（文件、行号、示例）](docs/CONTENT_ASSET_TODO.md)
- [来源与图片许可登记](docs/CONTENT_SOURCE_REGISTER.md)

本次未修改 T1 原仓库，未调用付费 LLM，未 push 或部署。
# 发布准备（2026-10-23）

当前已接入用户提供的 PNG，精简双语访客文案并配置 main 分支的 GitHub Pages 自动构建部署。`site` 为 `https://azure179.github.io`，无 base 子路径。尚未执行首次提交、push 或部署；此前阶段中“不配置 workflow”的说明属于历史状态。

- [发布前检查报告](docs/PRE_RELEASE_REPORT.md)
- [GitHub 网页设置与最终上传命令](docs/DEPLOYMENT_GUIDE.md)
- [本轮修改文件清单](docs/RELEASE_CHANGED_FILES.md)
- [图片替换与当前源码位置](docs/CONTENT_ASSET_TODO.md)

新增 `npm.cmd run check:release`：在 build 后检查资源哈希、URL 大小写、简洁图注及锁文件跟踪状态。首次上传前 package-lock.json 已加入索引；最终源码暂存、commit 和 push 命令由用户执行。
