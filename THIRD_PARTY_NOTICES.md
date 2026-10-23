# Third-party notices

## Three.js

- Version: 0.186.1, pinned in `package-lock.json`.
- Source: <https://github.com/mrdoob/three.js>
- Copyright © 2010-2026 three.js authors.
- License: MIT; the complete license is distributed at [`public/licenses/three-MIT.txt`](public/licenses/three-MIT.txt) and `/licenses/three-MIT.txt` in the built site.
- Use: bundled into the home-only, dynamically loaded archive scene. No third-party models, textures, fonts or audio are included.
- The 2026-10-22 model polish also uses Three.js `RoundedBoxGeometry`, `RoomEnvironment` and `PMREMGenerator`. Lighting is generated locally from procedural geometry; no external HDR map is distributed.

## Reference design

RhineLabUI informed the interface and interaction design at commit `12cc5e4013acb9408f753ff71de6b8492299b7c8`. Phase 3.1 adapts the MIT-licensed loop arithmetic, spacing and selection-shoulder formula in `src/archive-loop.ts` / `src/motion.ts` into `src/scene/matrix-layout.ts`. The long-lens framing in `src/scene.ts` / `src/viewport-layout.ts` informs the adapted camera calculation in `src/scene/MatrixField.ts`.

- Copyright (c) 2026 LBEILC.
- The 2026-10-22 motion update adapts `idleWave`, `baselineSelectionWave` and their smoothing/bell equations from `src/motion.ts` into `src/scene/archive-waves.ts`. The pulse distance (row/lane ratio 2.2), six-pulse bound, 3.2-second expiry, idle delay/gain and ±0.6 clamp follow `src/scene.ts`. Integration uses our instanced matrix, local paused clock and reduced-motion lifecycle; no upstream playfield, audio or game logic is included. Visible matrix breathing intentionally keeps rendering; hidden/offscreen/contact states pause it, and a settled reader/home stops rendering.
- Complete MIT license: [`public/licenses/RhineLabUI-MIT.txt`](public/licenses/RhineLabUI-MIT.txt), distributed at `/licenses/RhineLabUI-MIT.txt`.
- Changes: arbitrary project and section counts, a bounded instance pool with a separately rendered selected cassette, demand rendering, local state machine and Astro content readers; no opening cinematic, audio, physics or postprocessing from upstream.
- Procedural cassette/folder geometry, label textures, portfolio content and integration are independently implemented. No upstream GLB, game symbols, images, sounds, fonts or branded internal models are included. Reference screenshots stay outside the repository and are not shipped as assets.

See [`docs/DESIGN_SPEC.md`](docs/DESIGN_SPEC.md) for visual research and asset boundaries. Prior phase reports describing no code reuse are historical snapshots; this notice records the current Phase 3.1 implementation.

Astro, Tailwind CSS, TypeScript and build dependencies retain their own package licenses. This notice does not choose a license for the portfolio owner's original content.

## Published scientific figures — Phase 3.2

`public/media/research/fish-dnmt-family/figure-2.jpg`, `figure-3.jpg` and `figure-7.jpg` reproduce Figures 2, 3 and 7 from Guo, Duan, Chen et al., *Genome-Wide Identification of DNA Methyltransferases (Dnmts) in Fish and Its Potential Roles During Sex Change in Blackhead Seabream*, Biomolecules 15(6), 896 (2025), DOI [10.3390/biom15060896](https://doi.org/10.3390/biom15060896).

Copyright © 2025 the authors. Distributed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/). Images were obtained from the official PMC image CDN and are reproduced unchanged. Bilingual explanatory captions are supplied separately; original figure labels are retained. Original URLs and evidence are registered in `docs/CONTENT_SOURCE_REGISTER.md`.

For release preparation on 23 October 2026, the site owner supplied Aquaculture Figures 5, 6 and 9 and Scientific Data genome panels as PNG files and instructed their inclusion. Files are preserved as supplied under `public/media/research/black-porgy-sex-reversal/` and `fish-t2t-genome/`; publisher DOI links and credits remain available. Scientific Data's published license is CC BY-NC-ND 4.0. Owner-provided files do not grant visitors an additional or unrestricted reuse license. These additions supersede the earlier Phase 3.2 record that these figures were not included.

The three `tilapia-eccdna/Fig 1.png` through `Fig 3.png` files are owner-supplied blank image placeholders, not published scientific figures. They carry an explicit placeholder label. Portfolio workflow diagrams are independently drawn from the documented methods.

The original T1 JPG captures use synthetic inputs and were created without paid LLM calls. The additional `llm-rnaseq-platform/Fig1.png` is an application screenshot supplied by the owner, showing assistant interactions; its underlying analysis was not rerun in this release-preparation session. T2 captures show this local portfolio. Image captions are compact; detailed provenance is retained in content metadata, this notice, Credits and `docs/CONTENT_SOURCE_REGISTER.md`.
