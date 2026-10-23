# GitHub Pages 发布操作

目标仓库：<https://github.com/Azure179/Azure179.github.io>。目标网址：<https://azure179.github.io>。

## 配置依据与流程

2026-10-23 核对 [Astro 官方 GitHub Pages 指南](https://docs.astro.build/en/guides/deploy/github/)；该用户站点仓库使用 `site: https://azure179.github.io`，不设置 base。指南当前使用 checkout v7 / deploy-pages v5；本站显式拆分 Node 安装、`npm ci`、检查、构建和上传，便于锁定依赖并在发布前执行已有测试，而非合并进一个默认构建步骤。

`.github/workflows/deploy.yml`：

1. `main` push 或 Actions 手动触发。
2. Ubuntu runner；`actions/checkout@v7`、`actions/setup-node@v7`；Node 读取 `.nvmrc`（24.20.0），npm 固定为 11.19.0。
3. `npm ci` 安装锁定依赖。
4. 类型、单元测试、格式检查 → Astro 静态构建 → 内部链接、发布资源检查。
5. 确认 lockfile 无变化，`actions/upload-pages-artifact@v5` 上传 `dist/`。
6. 独立 deploy job 使用 `actions/deploy-pages@v5` 部署至 `github-pages` 环境，仅此 job 获得 `pages: write` 与 `id-token: write`；build 只有 `contents: read`。
7. 并发组 `github-pages`，不在部署中途取消任务；手动从其他分支运行只构建，不部署。

无付费 API、PAT、自定义服务器或数据库配置；普通 Pages 发布使用 GitHub 自动提供的令牌。Three.js 为首页本地分块，几何和光照程序生成，无外部模型下载；字体使用系统栈。`public/` 原样复制进 dist，图片 URL 的空格由浏览器编码，并校验文件名大小写。

## GitHub 网页上需要完成的操作

1. 打开目标仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**，不要选择某个分支目录。保持默认 `azure179.github.io` 域名，不填写仓库子路径。
2. 在 **Settings → Actions → General** 确认仓库允许运行 GitHub 官方 Actions。如果仓库策略限制 Action，允许工作流中列出的 `actions/*`；不需要把默认 token 权限全局改成读写。
3. 首次 push 后查看 **Actions → Deploy BIOINFORMATICS ARCHIVE**，确认 build / deploy 都成功。若空仓库尚不能选择 Pages source，先上传，再完成第 1 步，并在 Actions 点击 **Re-run all jobs** 或 **Run workflow（main）**。
4. 默认 Pages 域名使用 HTTPS；Settings → Pages 若显示 Enforce HTTPS 则保持启用。
5. 若 `github-pages` 环境有分支限制或人工审批，允许 main，按仓库规则批准该次部署。

本轮未改远端设置、未提交或推送，因此不把配置文件存在当成部署成功。

## 首次上传命令（PowerShell）

当前本地分支是 main，origin 已设置正确，尚无本地提交。package-lock.json 已单独加入索引；其他工作尚未暂存。首先在仓库根目录核对：

```powershell
git status --short
git remote -v
git ls-remote --heads origin
```

本次初始远端查询没有返回分支。若此时出现远端已有分支或提交，先 fetch 并检查历史，不要 force push。下面命令适用于当前首次上传状态：

```powershell
npm.cmd run check
npm.cmd test
npm.cmd run format:check
npm.cmd run build
npm.cmd run check:site
npm.cmd run check:release

git add -- .github .gitignore .nvmrc .prettierignore .prettierrc.json AGENTS.md README.md THIRD_PARTY_NOTICES.md astro.config.mjs package.json package-lock.json tsconfig.json src public scripts tests docs
git diff --cached --stat
git diff --cached --check
git ls-files --error-unmatch package-lock.json
git commit -m "Prepare BIOINFORMATICS ARCHIVE for GitHub Pages"
git push -u origin main
```

请在检查命令全部成功后再执行提交与 push。这里显式列出上传目录，保留用户原有 `test` 文件，不将其加入提交；`.env`、node_modules、dist、.astro、日志受 .gitignore 排除。不需要另建 gh-pages 分支，也不要手动上传 dist。

如果 Git 提示尚未设置作者身份，请自行配置真实的 `user.name` 与 `user.email` 后重试 commit，不使用示例身份。若 HTTPS 身份验证或网络连接失败，完成 GitHub 登录 / 网络连接后重试普通 push，不更换远端或强推。

## 上线后验证

- 英文首页 `/`、中文 `/zh/`，两个文件夹及 3D / 简洁模式。
- 跨项目横向切换、四份档案纵向切换、进入 / 返回阅读器。
- A1 / A2 新 PNG、A3 论文图、T1 助手截图加载和图片放大。
- A4 三张占位路径；未来同名替换会通过 main push 自动重新构建。
- 直接打开中文详情页、刷新、语言切换、DOI 外链、Contact 中 GitHub。
- 手机与不支持 WebGL 的浏览器访问静态内容；控制台 / Network 无 404。

这些是首次部署后的核验项，本轮只完成本地生产产物验证。GitHub 状态与真实线上资源加载须以首次 Actions 运行及公开网址为准。
