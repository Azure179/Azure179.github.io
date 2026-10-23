---
{
  "translationKey": "bioinformatics-archive",
  "archiveId": "T2",
  "locale": "en",
  "slug": "bioinformatics-archive",
  "title": "BIOINFORMATICS ARCHIVE — Interactive Research Portfolio",
  "summary": "An academic and technical portfolio with a progressively enhanced 3D archive and static bilingual content pages.",
  "caseStudy":
    {
      "stage": "local-development",
      "overview":
        [
          "An independent portfolio provides space for research questions, evidence and engineering decisions beyond a conventional CV. Academic and Technical portfolios serve both doctoral applications and bioinformatics / AI / software roles.",
          "RhineLabUI inspired the spatial archive and terminal aesthetic. Phase 3.1 adapts MIT-licensed loop calculations and long-lens framing with attribution and the full license. Folder and cassette geometry, label graphics and personal identity are independently generated; restricted game assets are excluded.",
        ],
      "solution":
        [
          "Two homepage folders open Academic and Technical project matrices. Projects run across columns and sections across rows in a dense, continuously looping cassette field. A shared reader loads existing static detail sections; Contact includes profile and contact links.",
          "Real HTML links, a light mode, reduced-motion handling, keyboard controls, a mobile menu and English/Chinese routes provide alternative reading paths. Research results and software case studies use different content structures.",
        ],
      "architecture":
        [
          "Astro content collections supply typed research, software and publication records. Translation keys and shared slugs connect languages. Research projects reference a centralized publication collection rather than repeating citation metadata.",
          "Only the two homepage entry files import ArchiveTerminal. Its bootstrap dynamically loads Three.js; static content routes never import the rendering engine. The scene shares geometry, caps render resolution and releases listeners, observers and GPU resources.",
          "Astro emits dist/ with canonical URLs and a sitemap. GitHub Actions checks, builds and uploads the site on main updates, then hands the artifact to the Pages deployment job.",
        ],
      "implementation":
        [
          "Content collections validate fields, translations and publication references at build time, with independent static routes for every project.",
          "The homepage controller manages selection independently of the scene. It handles deferred loading, light mode, WebGL failure, hidden-page pause and disposal. Other pages remain ordinary HTML navigation.",
          "Milestones: Phase 1 established static bilingual routes; Phase 2 added progressive 3D; Phase 3 split academic and technical evidence; Phase 3.1 introduced shared hierarchical archives; Phase 3.2 integrates verified publications, original diagrams and real captures.",
        ],
      "workflow":
        [
          "Typed Markdown content + bilingual UI dictionaries",
          "Validation of publication gates, translations and references",
          "Astro static route and HTML generation",
          "Homepage only: dynamic scene import after capability / preference checks",
          "Static content pages: read and navigate through HTML links",
          "GitHub Actions checks and build → GitHub Pages deployment",
        ],
      "workflowSource": "Original implementation diagram based on src/content.config.ts, src/pages/[...path].astro and src/scene/bootstrap.ts in this local Phase 3 working tree.",
      "validation":
        [
          "Local type checks, content and interaction unit tests, static build and internal-link validation pass. The deployment workflow runs these checks before uploading the site artifact.",
        ],
      "galleryNote": "The development diagram is drawn from this site's implementation. Actual browser captures, when included, show the local development build and are labelled accordingly; they are not evidence of a live deployment.",
    },
  "draft": false,
  "verified": true,
  "visibility": "public",
  "revision": "release-v1",
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
      "GitHub Pages (deployment target)",
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
        "src": "/media/diagrams/bioinformatics-archive.svg",
        "title": "Website architecture",
        "alt": "Typed bilingual content → Astro static build → Two complementary reading paths → Shared content reader → Local verification → Configured hosting target",
        "caption": "Concept & workflow",
        "source": "Current portfolio source and astro.config.mjs",
        "permission": "Original artwork created for this portfolio",
        "kind": "diagram",
        "placement": "architecture",
        "width": 1000,
        "height": 790,
      },
      {
        "id": "home-desktop",
        "src": "/media/software/bioinformatics-archive/home-desktop.jpg",
        "title": "Two portfolio folders",
        "alt": "Two portfolio folders",
        "caption": "Actual desktop browser capture of the procedural 3D homepage.",
        "source": "Local browser capture · 2026-10-23",
        "permission": "Created for this portfolio",
        "kind": "screenshot",
        "width": 1912,
        "height": 863,
      },
      {
        "id": "matrix-desktop",
        "src": "/media/software/bioinformatics-archive/matrix-desktop.jpg",
        "title": "Project columns and content sections",
        "alt": "Project columns and content sections",
        "caption": "Actual shared matrix; horizontal project navigation and vertical section navigation use the existing scene.",
        "source": "Local browser capture · 2026-10-23",
        "permission": "Created for this portfolio",
        "kind": "screenshot",
        "width": 1912,
        "height": 863,
      },
      {
        "id": "reader-desktop",
        "src": "/media/software/bioinformatics-archive/reader-desktop.jpg",
        "title": "Focused document reader",
        "alt": "Focused document reader",
        "caption": "Actual Chinese content reader beside the selected 3D cassette. The static page supplies the text and figures.",
        "source": "Local browser capture · 2026-10-23",
        "permission": "Created for this portfolio",
        "kind": "screenshot",
        "width": 1912,
        "height": 914,
      },
      {
        "id": "reading-mobile",
        "src": "/media/software/bioinformatics-archive/reading-mobile.jpg",
        "title": "Narrow-screen reading",
        "alt": "Narrow-screen reading",
        "caption": "Actual narrow browser viewport; this is responsive desktop testing, not a physical-phone capture.",
        "source": "Local browser capture · 2026-10-23",
        "permission": "Created for this portfolio",
        "kind": "screenshot",
        "width": 375,
        "height": 812,
      },
    ],
  "mediaSlots": [],
}
---
