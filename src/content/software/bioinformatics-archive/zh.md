---
{
  "translationKey": "bioinformatics-archive",
  "archiveId": "T2",
  "locale": "zh",
  "slug": "bioinformatics-archive",
  "title": "BIOINFORMATICS ARCHIVE — 交互式科研作品集",
  "summary": "以渐进增强的 3D 档案首页与静态双语内容页连接学术研究和技术项目。",
  "caseStudy":
    {
      "stage": "local-development",
      "overview":
        [
          "独立作品集在简历之外提供空间，说明研究问题、证据与工程决策。学术与技术两条主线兼顾博士申请，以及生物信息学、AI 和软件研发岗位。",
          "RhineLabUI 为立体档案与终端视觉提供启发。Phase 3.1 改编其 MIT 授权循环计算与长焦构图，并保留署名及完整许可证。文件夹、档案盒几何、标签和个人品牌独立生成，未引入受限游戏素材。",
        ],
      "solution":
        [
          "首页两个文件夹分别进入学术与技术阵列。横向为项目、纵向为栏目，使用密集竖立且连续循环的档案盒场景。共用阅读器加载已有静态详情栏目，Contact 整合个人简介与联系方式入口。",
          "真实 HTML 链接、轻量模式、减少动态效果支持、键盘操作、移动菜单及中英文路由提供替代阅读路径。科研与软件案例使用各自的内容结构。",
        ],
      "architecture":
        [
          "Astro 内容集合管理类型化科研、软件及论文记录。translationKey 与共享 slug 连接中英文，科研项目引用统一论文集合，避免重复维护引文。",
          "只有两个首页入口导入 ArchiveTerminal，其 bootstrap 动态加载 Three.js。静态内容路由不导入渲染引擎；场景共享几何、限制渲染分辨率并清理监听器、观察器与 GPU 资源。",
          "Astro 生成包含规范链接与 sitemap 的 dist/ 静态产物。GitHub Actions 在 main 更新后执行检查、构建与产物上传，由 Pages 部署任务发布。",
        ],
      "implementation":
        [
          "内容集合在构建时校验字段、双语版本与论文关联；静态路由为各项目提供独立访问地址。",
          "首页控制器独立管理选择状态，并处理延迟加载、轻量模式、WebGL 失败、页面隐藏暂停及资源释放。其他页面使用普通 HTML 导航。",
          "里程碑：Phase 1 建立双语静态路由；Phase 2 加入渐进增强 3D；Phase 3 区分学术和技术内容；Phase 3.1 建立共享分层档案；Phase 3.2 整合正式论文、原创图示与真实截图。",
        ],
      "workflow":
        [
          "类型化 Markdown 内容 + 双语 UI 字典",
          "发布门槛、翻译与论文引用校验",
          "Astro 生成静态路由与 HTML",
          "仅首页：按能力与偏好动态加载场景",
          "静态内容页：通过 HTML 链接阅读与导航",
          "GitHub Actions 检查与构建 → GitHub Pages 部署",
        ],
      "workflowSource": "根据当前 Phase 3 工作区的 src/content.config.ts、src/pages/[...path].astro 和 src/scene/bootstrap.ts 绘制的原创实现示意。",
      "validation":
        [
          "本地类型检查、内容与交互单元测试、静态构建及内部链接检查已通过。部署工作流在上传站点产物前执行同一套检查。",
        ],
      "galleryNote": "架构图依据本站实际实现绘制。若包含浏览器截图，均注明本地开发构建，不作为线上部署证明。",
    },
  "draft": false,
  "verified": true,
  "visibility": "public",
  "revision": "release-v1",
  "sourceRevision": "release-v1",
  "updatedAt": "2026-10-23",
  "verifiedAt": "2026-10-23",
  "evidenceRefs":
    [
      "https://github.com/Azure179/Azure179.github.io",
      "https://github.com/LBEILC/RhineLabUI/tree/12cc5e4013acb9408f753ff71de6b8492299b7c8",
    ],
  "tags": ["Static web", "3D interaction", "Bilingual"],
  "stack":
    [
      "Astro 7",
      "TypeScript",
      "Tailwind CSS 4",
      "Three.js",
      "GitHub Actions",
      "GitHub Pages（部署目标）",
    ],
  "projectStatus": "prototype",
  "links":
    [
      {
        "label": "GitHub repository",
        "url": "https://github.com/Azure179/Azure179.github.io",
      },
      {
        "label": "RhineLabUI · design reference",
        "url": "https://github.com/LBEILC/RhineLabUI/tree/12cc5e4013acb9408f753ff71de6b8492299b7c8",
      },
    ],
  "figures":
    [
      {
        "id": "bioinformatics-archive",
        "src": "/media/diagrams/bioinformatics-archive-zh.svg",
        "title": "网站架构",
        "alt": "静态内容与空间化入口。类型化双语内容 → Astro 静态构建 → 互补阅读路径 → 共享内容阅读器 → 本地验证 → 已配置的托管目标",
        "caption": "概念与流程示意",
        "source": "Current portfolio source and astro.config.mjs",
        "permission": "为本作品集原创绘制",
        "kind": "diagram",
        "placement": "architecture",
        "width": 1000,
        "height": 790,
      },
      {
        "id": "home-desktop",
        "src": "/media/software/bioinformatics-archive/home-desktop.jpg",
        "title": "双作品集文件夹",
        "alt": "双作品集文件夹",
        "caption": "程序化 3D 首页的真实桌面浏览器截图。",
        "source": "本地浏览器实拍 · 2026-10-23",
        "permission": "为本作品集拍摄",
        "kind": "screenshot",
        "width": 1912,
        "height": 863,
      },
      {
        "id": "matrix-desktop",
        "src": "/media/software/bioinformatics-archive/matrix-desktop.jpg",
        "title": "项目列与内容档案",
        "alt": "项目列与内容档案",
        "caption": "共享矩阵实拍，横向项目与纵向内容导航沿用现有场景。",
        "source": "本地浏览器实拍 · 2026-10-23",
        "permission": "为本作品集拍摄",
        "kind": "screenshot",
        "width": 1912,
        "height": 863,
      },
      {
        "id": "reader-desktop",
        "src": "/media/software/bioinformatics-archive/reader-desktop.jpg",
        "title": "聚焦的档案阅读器",
        "alt": "聚焦的档案阅读器",
        "caption": "选中 3D 档案旁的中文阅读器实拍；正文与图像来自同一静态页面。",
        "source": "本地浏览器实拍 · 2026-10-23",
        "permission": "为本作品集拍摄",
        "kind": "screenshot",
        "width": 1912,
        "height": 914,
      },
      {
        "id": "reading-mobile",
        "src": "/media/software/bioinformatics-archive/reading-mobile.jpg",
        "title": "窄屏内容阅读",
        "alt": "窄屏内容阅读",
        "caption": "真实窄屏浏览器视口；属于桌面响应式测试，不是实体手机实拍。",
        "source": "本地浏览器实拍 · 2026-10-23",
        "permission": "为本作品集拍摄",
        "kind": "screenshot",
        "width": 375,
        "height": 812,
      },
    ],
  "mediaSlots": [],
}
---
