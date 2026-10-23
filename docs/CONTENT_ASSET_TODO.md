# 图片维护与剩余素材

更新：2026-10-23，发布准备版。本文件替代此前行号指南；旧 Phase 3.2 报告是历史记录。

## 已接入图片

- A1：`public/media/research/black-porgy-sex-reversal/Fig 5.png`、`Fig 6.png`、`Fig 9.png`，位于第三份「代表性图表」。
- A2：`public/media/research/fish-t2t-genome/Fig 1.png`、`Fig 2.png`，位于第三份「代表性图表」。
- A3：现有正式论文图 2、3、7 保留。
- A4：`public/media/research/tilapia-eccdna/Fig 1.png`、`Fig 2.png`、`Fig 3.png`，位于第三份「代表性图表」，目前是白色图片占位。
- T1：`public/media/software/llm-rnaseq-platform/Fig1.png` 放在第一份项目概览；已有工作区与合成数据结果截图放在第三份。
- T2：保留真实首页、阵列截图，并更新阅读器和窄屏截图。

图片下方统一简写为「应用内截图」「已发表科研图片」「概念与流程示意」，占位图片例外标为「图片占位」。论文图片标签可点击访问正式 DOI；许可和详细出处仍保存在 Credits、THIRD_PARTY_NOTICES.md 和来源登记。

## 罗非鱼三张图片怎样替换

1. 将新 PNG 覆盖上述 `Fig 1.png`、`Fig 2.png`、`Fig 3.png`，保留大小写和空格。
2. 运行 `npm.cmd run build`。构建会读取 PNG 的实际尺寸，**仅换图片不需要修改 width / height 或 Three.js 源码**。
3. 对新图的描述也需要更新时，在下表 A4 的两份文件内搜索 `"id": "figure-1"`（另外两张为 figure-2 / figure-3），修改 `title`、`alt` 和来源信息。两种语言的 id / src 保持一致。
4. 现在的 `kind: "placeholder"` 不宣称科研成果。只是替换文件时仍保留这个标签；正式结果公开后，要同时确认来源、图注和研究状态，再把类型调整为 `research-result`。当前 outline 规则会阻止未确认结果被误当成已发表成果。

## 内容编辑入口

以下为当前 `figures` 数组起始行；日后编辑移动行号时搜索 `"figures"` 即可。

| 项目 | 内容目录 | en.md 行 | zh.md 行 |
| --- | --- | --- | --- |
| A1 | `src/content/research/black-porgy-sex-reversal/` | 54 | 55 |
| A2 | `src/content/research/fish-t2t-genome/` | 53 | 54 |
| A3 | `src/content/research/fish-dnmt-family/` | 50 | 51 |
| A4 | `src/content/research/tilapia-eccdna/` | 45 | 44 |
| T1 | `src/content/software/llm-rnaseq-platform/` | 87 | 88 |
| T2 | `src/content/software/bioinformatics-archive/` | 83 | 84 |

例如 A4 保持同名文件替换时，现有配置的核心关系为：

```json
{
  "id": "figure-1",
  "src": "/media/research/tilapia-eccdna/Fig 1.png",
  "title": "图 1",
  "alt": "图片占位：图 1",
  "kind": "placeholder",
  "placement": "figures"
}
```

这只是现有对象的节选；不要用它覆盖完整对象中的 source、permission、width、height 等字段。src 不包含 `public` 或盘符。PNG 路径允许当前文件名中的空格与大小写，并有构建产物的大小写校验。

新增图使用完整对象，可参考 A1 的 figure-5 或 T1 的 assistant。科研图 kind=research-result，技术截图 kind=screenshot，流程示意 kind=diagram；第一份 placement=overview，科研流程 placement=analysis，技术架构 placement=architecture，第三份 placement=figures。

## 仍可补充的个人资料

邮箱、CV、求职简历、教育背景和 Scholar 仍未提供；正式页面隐藏空字段，展示已有 GitHub 链接，不创建假信息。未来填写 `src/data/profile.ts` 的相应字段即可。未知科研公开资料继续保持 A4 当前范围。

## 验证与上传

```powershell
npm.cmd run check
npm.cmd test
npm.cmd run build
npm.cmd run check:site
npm.cmd run check:release
npm.cmd run format:check
```

完整上传命令与 GitHub 网页设置见 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)，本次结果见 [PRE_RELEASE_REPORT.md](PRE_RELEASE_REPORT.md)。
