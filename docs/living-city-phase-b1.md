# TrustTrail Phase B.1 — implementation and review

1 November 2026. Homepage presentation only. Ready for Product Owner review; no further phase, branch, commit, merge, push, or deployment was started. No dependencies were added. The game engine, chapter definitions, scoring, Trust Report and persistence implementation were not edited.

## Visual and UX result

The approved Phase B city now covers the full opening, including the hero and compact application dock, outside the 1440px content limit. The existing uniform, centered, bottom-aligned cover camera remains: native art is never stretched independently on either axis. Overscan protects bounded parallax. A neutral readability scrim and environmental top/bottom fade remove the rectangular edge and carry the city into a quiet intelligence archive. The final action returns to a low-contrast crop of the existing rooftop foreground. Reading sections retain a calm navy ground rather than repeating the whole city.

The original headline and primary game CTA remain immediately visible. A small incoming-message cue names Ari and NovaTech and explicitly identifies fictional story content. CASE 01 belongs to the preview window chrome. No mandatory animation, countdown, new evidence, outcome, or story twist was added.

## Interactions

- The old hero was a JPEG screenshot; its tool thumbnails were static. It is now a small React showcase. Mail shows the existing Chapter 1 invitation excerpt, Browser shows its independently sourced fictional directory, and Case Files explains the initially empty journal. No internal inert screenshot controls are presented as functional controls.
- The window selectors and equipment dock share local state. Dock selection brings the preview into view and moves keyboard focus to the corresponding application button. Enter, Space, click and touch work. Selected/hover/pressed/focus states are explicit, and content updates are announced politely. All three previews keep the same height at each tested width.
- The preview contains no engine dispatch or storage writes. Its game CTA uses the existing StartGameButton and preserves start/resume behavior. The separate Lentera email practice remains isolated from scoring and saves.
- Three selectable intelligence files replace the simultaneous statistic columns. Each preserves its exact figure, population/unit, reporting period, source and primary-source URL. Definitions remain visible; publication details are disclosed through a native details control. Each file explains its relevance to digital safety. The figures remain historical and are explicitly neither added nor compared as equivalent populations.
- A narrative bridge links “Periksa sebuah pesan” to the existing `#latihan` exercise. Existing chapter navigation, guide, local-progress controls, final CTA and footer links remain.

## Rendering and accessibility

One lazy Pixi application owns its private ticker, layers, textures, observers and listeners. The existing lifecycle remains; a pause prop reconciles ticker activity without recreating the scene. The environmental sky has a slow bounded drift. Three masked groups reuse the existing emission texture for independent window illumination, including one brief, low-amplitude distant dip per 41-second cycle. The existing small particle pool and pointer parallax remain. Masks, sprites and containers are created once; ticker updates use no React state.

Offscreen and hidden-document rendering stops. Reduced motion destroys the animated scene, displays the static picture, disables the pause control, removes travel in interface transitions, and avoids loading the decorative footer texture. A small `useSyncExternalStore` hook handles live preference changes for the homepage UI. During QA, relying on the installed Motion hook alone did not update the new control after an emulated live preference change; the browser subscription fixed that behavior. WebGL, module, texture and context-loss failures retain the static city and functional HTML controls.

Controls use native buttons with `aria-pressed` and named groups rather than incomplete ARIA tab behavior. They expose `aria-controls`, retain visible keyboard focus and have at least 44px height in all five viewport checks. Decorative art is aria-hidden and pointer-transparent. All tested headings use at most two lines. Token contrast calculations: reading text 13.56:1; secondary text on the lightest selected surface 5.22:1; teal on that surface 6.15:1; primary CTA 10.90:1. These are flat-surface token calculations, not an automated certification of every artwork pixel.

Current documentation was consulted through Context7 for PixiJS 8.22 lifecycle/rendering, React external browser subscriptions/effect cleanup, and Motion reduced motion/transitions. The installed frontend, React performance and Web Interface Guidelines skills were applied. The existing **The page is the object** direction, seed **22990416**, was retained, with no redraw. Original pixel art, numbered data files, terminal chrome and the requested atmospheric fade take precedence over conflicting generic page-style rules. [Visual critique](phase-b1-review/critique.md).

## Assets

The existing generated city composite, sky, and emission mask were visually inspected, together with Phase B captures and provenance. There was no missing creative asset, so ImageGen was not invoked again. Existing PixelIcon artwork provides the three equipment icons. All fonts, pixels and story material remain local.

Seven **836 × 471** compact WebP exports were added under `public/assets/living-city/`: `sky-far-compact.webp`, `city-back-compact.webp`, `city-mid-compact.webp`, `city-front-compact.webp`, `office-props-compact.webp`, `city-mid-lights-compact.webp`, and `city-static-compact.webp`. They are technical derivatives of the corresponding Phase B WebPs, exported at uniform 0.5 scale with nearest sampling; the odd native height leaves a half-pixel final bleed row. Pixi restores logical dimensions with one uniform scale. No imagery is distorted to fit the host.

The compact set is **287,334 encoded bytes**, versus **894,832 bytes** for the original set. The initial compact scene is chosen for narrow/coarse devices; picture media selection chooses the narrow fallback. A running scene resizes without reloading its textures. The footer reuses only the foreground. The local uncached preview measured a second foreground transfer for CSS versus the renderer fetch; actual encoded artwork requests totaled **319,738 bytes compact / 997,366 bytes desktop**. These network totals include that duplicate and are not a claim of perfect request deduplication. See the [per-file inventory](phase-b1-review/compact-assets.json), [original prompts/provenance](living-city-phase-b/generation-prompts.json), and [asset credits](asset-credits.md).

## Validation

Final production build: Node 26.13.0, installed npm 11.20.0, Chrome 156.0.8078.76. Declared package manager and dependency pins remain unchanged.

| Check | Final result |
| --- | --- |
| TypeScript | PASS — `npm run typecheck`, also run by build |
| ESLint | PASS — zero warnings |
| Unit/integration | PASS — **86/86**, including compact resource ownership |
| Production build | PASS — existing >500 kB main-chunk warning remains |
| Browser suite | PASS — **98/98** desktop/mobile cases; [log](phase-b1-review/smoke.log) |
| Responsive visual and interaction validator | PASS — **360, 390, 768, 1440, 1920px**; [results](phase-b1-review/browser-results.json) |
| Keyboard, touch, focus, sources | PASS — selectors, disclosure, mini inspection, start/resume and bridge exercised |
| Reduced motion / static fallbacks | PASS — initial and live preferences, failed modules/textures, context loss, unavailable WebGL |
| Game regression | PASS — Chapters 1–3, safe/risky journeys, recovery, report, refresh, corrupt/blocked saves, window controls and navigation |
| Storage isolation | PASS — preview, intelligence and practice interactions leave stored investigations unchanged |
| Console/assets/layout | PASS — no console/page errors, broken assets, missing control names, targets under 44px height, heading clipping or horizontal overflow in the five-width validator |
| Frontend skill source lint | PASS — 0 failures / 0 warnings; documented client-required exceptions |
| Frontend skill CDP inspector | UNAVAILABLE — before and after runs timed out at `Page.enable`; no inspector pass is claimed. Independent Playwright screenshots, measurements and critique were completed instead. |

The first regression run caught an obsolete test waiting for the removed JPEG and an unwanted reduced-motion footer-art request. The test now verifies live preview layout while city textures are delayed; the footer suppresses that texture under reduced motion. The final complete run passed after both fixes. Element-only screenshot capture also produced Chrome scroll/compositing artifacts; state evidence was recaptured as settled viewport screenshots and checked against ordinary viewport rendering.

## Measured performance and limits

The existing measurement script sampled actual WebGL clear submissions for three seconds after warm-up, using DPR 3 mobile emulation / DPR 2 wider viewports. Other local validation browsers were running; there was no explicit CPU/network throttle. These are headless local measurements, not physical-device FPS or GPU-completion measurements.

| Width | Submitted frames/sec | p95 frame interval | Renderer release → ready | Sample layout shift |
| --- | ---: | ---: | ---: | ---: |
| 360 | 29.5 | 37.0 ms | 346.7 ms | 0 |
| 390 | 29.5 | 36.8 ms | 378.6 ms | 0 |
| 768 | 43.7 | 24.4 ms | 404.8 ms | 0 |
| 1440 | 43.7 | 24.4 ms | 387.1 ms | 0 |

All four steady-state samples had no long tasks, stable hero bounds, and the CTA above the fold. Initialization did contain **58–157 ms long tasks**. All measured offscreen, simulated hidden-document, and post-unmount draw counts were zero; maximum mounted canvas count was one. The two UI selectors reserve stable panel heights at all five responsive widths. [Raw measurements](phase-b1-review/performance/measurements.json).

The main bundle is **530.88 kB / 164.16 kB gzip**, compared with the Phase B record of 525.06 / 162.93 kB. The lazy scene entry is **251.51 kB / 74.26 kB gzip**. This phase adds interaction code; it does not improve the entry bundle or eliminate Vite's warning. No Lighthouse score was measured.

The desktop 18-cycle check observed retained JS heap **7.09 → 8.18 → 8.82 → 9.03 MB** at initial / 6 / 12 / 18 navigation cycles after forced GC. No duplicate canvas or post-unmount rendering was observed, but retained heap did not fully flatten. This continues the prior phase's unresolved profiling limitation; no leak-free claim is made. Real-device GPU/native memory, Safari/Firefox, screen-reader software and timed user comprehension were not tested. External source destinations were preserved and their URLs/accessible links checked; this phase did not re-audit historical publications or download the 38 MB IMDI report.

## Files

Production modified:

- `src/pages/HomePage.tsx`, `src/pages/homepage.css`
- `src/features/living-city/LivingCityScene.tsx`, `createCityScene.ts`, `loadCityTextures.ts`, `living-city.css`

Production created:

- `src/pages/InvestigationOpening.tsx`, `ThreatIntelligence.tsx`, `useMotionPreference.ts`
- Seven `public/assets/living-city/*-compact.webp` files listed above

Validation created: `scripts/prepare-city-compact.mjs`, `scripts/validate-homepage-b1.mjs`, `tests/smoke/homepage-b1.spec.ts`. Validation adapted: `scripts/review-city-composition.mjs`, `tests/smoke/homepage.spec.ts`, `living-city.spec.ts`, `visual-dossier.spec.ts`, `tests/unit/city-textures.test.ts`.

Documentation: this report, `docs/phase-b1-review/` gallery/screenshots/critique/inventories/results/logs, `docs/asset-credits.md`, and README's homepage status.

Review entry: [before/after gallery](phase-b1-review/index.html), [desktop before](phase-b1-review/before/1440.png), [desktop after](phase-b1-review/after/1440-full.png), [mobile before](phase-b1-review/before/390.png), [mobile after](phase-b1-review/after/390-full.png). Baseline captures used the untouched Phase B page; after captures use the final production build. Stop here for Product Owner review.

To reproduce: run `npm run check`, then `npm run test:smoke -- --workers=2`. With `npm run preview` running separately on port 4173, run `node scripts/validate-homepage-b1.mjs`. `CITY_REVIEW_OUT=docs/phase-b1-review/performance` selects the output for `scripts/validate-living-city.mjs`; use `docs/phase-b1-review/composition` for `scripts/review-city-composition.mjs` to preserve earlier phase evidence. `scripts/prepare-city-compact.mjs` regenerates the compact exports from the existing approved WebPs.
