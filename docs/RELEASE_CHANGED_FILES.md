# 本轮修改文件清单

日期：2026-10-23。依据本轮开始前仓库外备份按字节比较；不是假定 Git 已有提交。用户新增的 9 张 PNG 在备份时已存在，本轮仅接入引用，文件字节未改。

## 修改

- `AGENTS.md`
- `README.md`
- `THIRD_PARTY_NOTICES.md`
- `docs/ARCHITECTURE.md`
- `docs/CONTENT_ASSET_TODO.md`
- `docs/CONTENT_PLAN.md`
- `docs/CONTENT_SOURCE_REGISTER.md`
- `package.json`
- `public/media/diagrams/bioinformatics-archive-zh.svg`
- `public/media/diagrams/bioinformatics-archive.svg`
- `public/media/diagrams/black-porgy-sex-reversal-concept-zh.svg`
- `public/media/diagrams/black-porgy-sex-reversal-concept.svg`
- `public/media/diagrams/black-porgy-sex-reversal-workflow-zh.svg`
- `public/media/diagrams/black-porgy-sex-reversal-workflow.svg`
- `public/media/diagrams/fish-dnmt-family-workflow-zh.svg`
- `public/media/diagrams/fish-dnmt-family-workflow.svg`
- `public/media/diagrams/fish-t2t-genome-concept-zh.svg`
- `public/media/diagrams/fish-t2t-genome-concept.svg`
- `public/media/diagrams/fish-t2t-genome-workflow-zh.svg`
- `public/media/diagrams/fish-t2t-genome-workflow.svg`
- `public/media/diagrams/llm-rnaseq-dag-zh.svg`
- `public/media/diagrams/llm-rnaseq-dag.svg`
- `public/media/diagrams/llm-rnaseq-platform-zh.svg`
- `public/media/diagrams/llm-rnaseq-platform.svg`
- `public/media/diagrams/tilapia-eccdna-concept-zh.svg`
- `public/media/diagrams/tilapia-eccdna-concept.svg`
- `public/media/diagrams/tilapia-eccdna-workflow-zh.svg`
- `public/media/diagrams/tilapia-eccdna-workflow.svg`
- `public/media/software/bioinformatics-archive/reader-desktop.jpg`
- `public/media/software/bioinformatics-archive/reading-mobile.jpg`
- `scripts/check-site.mjs`
- `src/components/portfolio/FigureGallery.astro`
- `src/components/portfolio/PortfolioOverview.astro`
- `src/components/portfolio/ResearchDetail.astro`
- `src/components/portfolio/TechnicalDetail.astro`
- `src/components/site/ContactPanel.astro`
- `src/components/views/InfoPage.astro`
- `src/components/views/ProfilePage.astro`
- `src/content.config.ts`
- `src/content/publications/black-porgy-methylomics/en.md`
- `src/content/publications/black-porgy-methylomics/zh.md`
- `src/content/research/black-porgy-sex-reversal/en.md`
- `src/content/research/black-porgy-sex-reversal/zh.md`
- `src/content/research/fish-dnmt-family/en.md`
- `src/content/research/fish-dnmt-family/zh.md`
- `src/content/research/fish-t2t-genome/en.md`
- `src/content/research/fish-t2t-genome/zh.md`
- `src/content/research/tilapia-eccdna/en.md`
- `src/content/research/tilapia-eccdna/zh.md`
- `src/content/software/bioinformatics-archive/en.md`
- `src/content/software/bioinformatics-archive/zh.md`
- `src/content/software/llm-rnaseq-platform/en.md`
- `src/content/software/llm-rnaseq-platform/zh.md`
- `src/data/archive.ts`
- `src/data/portfolio.ts`
- `src/i18n/ui.ts`
- `src/lib/archive-manifest.ts`
- `src/lib/portfolio-schema.ts`
- `src/pages/[...path].astro`
- `tests/content-assets.test.mjs`

## 新增

- `.github/workflows/deploy.yml`
- `docs/DEPLOYMENT_GUIDE.md`
- `docs/PRE_RELEASE_REPORT.md`
- `docs/RELEASE_CHANGED_FILES.md`
- `docs/qa/release/assets.json`
- `docs/qa/release/mobile-content.jpg`
- `docs/qa/release/reader-checks.json`
- `docs/qa/release/reader-png.jpg`
- `docs/qa/release/scene-preservation.json`
- `scripts/check-release.mjs`
- `src/lib/figure-dimensions.ts`

## Git 与保留项

- `package-lock.json` 内容未改，已加入 Git 索引，以便首次提交包含锁文件。
- `astro.config.mjs` 已满足目标 site / static / 无 base，未改。
- 13 个 `src/scene/` 文件未改；用户 `test` 文件保留。
- 未修改 T1 原仓库，未执行 commit、push 或远端部署。

- 验证摘要：`docs/qa/release/results.json`。
