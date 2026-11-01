# PixiJS homepage foundation — Phase A

Implemented locally on 31 October 2026. This is the rendering foundation with temporary programmatic city shapes. Phase B artwork and the complete visual overhaul await Product Owner review. No Git operations, commits, branches, deployment, or game-engine changes were performed.

## Audit and integration decision

The production entry is `src/main.tsx`: React Strict Mode, BrowserRouter, Motion's reduced-motion configuration, one GameProvider, and the OS shell. `OperatingSystem` mounts HomePage only for `/`, while preserving the underlying OS session. The homepage already contains semantic copy, start/resume controls, guide and section links, an approved OS screenshot, an isolated email exercise, statistics, and chapter navigation. It uses local preview images and fonts, explicit image dimensions, responsive CSS, and short Motion transforms. The established navy/steel/teal palette and layout are retained.

Read README, architecture, asset provenance, existing homepage design/validation documents, the frontend design skill, React performance skill, and current PixiJS/React lifecycle documentation through Context7. The approved homepage direction remains **The page is the object**, seed **22990416**. No new direction was drawn: this brief explicitly limits work to integration and preservation of the existing layout. New photography, generated art, copy changes, and full-page animation changes would exceed Phase A.

Risks identified before editing:

- Strict Mode and route changes can finish async renderer initialization after cleanup. Imports and initialization must guard against stale results.
- A shared ticker or an extra requestAnimationFrame loop could keep rendering after navigation. The scene must own one private ticker.
- The persistent OS shell must not acquire another state owner or lose stored investigation/window state.
- The canvas must not capture mouse/touch input or duplicate accessible controls.
- Mobile hero proportions differ substantially from desktop, requiring cover cropping, overscan, and capped resolution.
- WebGL support, module downloads, context loss, and reduced motion require a usable static visual.
- Future textures must have an explicit artboard and ownership contract, without requesting missing files.

Runtime/dependencies checked: Node **26.13.0**, installed npm **11.20.0**, React/DOM **19.3.1**, Router **8.5.1**, Motion **14.8.0**, Vite **8.3.5**, TypeScript **6.0.3**, Tailwind **4.3.3**. The project's declared npm target remains 11.6.3 and strict engine checks remain enabled. Existing direct pins were preserved.

Added only **`pixi.js@8.22.0`**, exactly pinned with a lockfile update; npm added 12 packages including transitive dependencies. The package declares no React peer dependency or restrictive Node engine. Direct integration avoids another reconciler/adapter for a decorative scene containing three containers and static procedural graphics. `@pixi/react` provides no demonstrated benefit here. The supported initialization is `new Application()` followed by `await app.init(...)`, with a WebGL-only preference, `autoStart: false`, and `sharedTicker: false`. [PixiJS Application documentation](https://github.com/pixijs/pixijs/blob/v8.22.0/skills/pixijs-application/SKILL.md), [React effect cleanup](https://react.dev/learn/synchronizing-with-effects).

## Ownership and lifecycle

`LivingCityScene.tsx` renders an always-available, decorative SVG fallback inside an absolutely positioned host. HomePage mounts that host as the first child of the existing hero. Both copy and the OS preview sit above it with explicit stacking. The host and canvas have `pointer-events: none`; the host is hidden from accessibility APIs, and the SVG cannot receive keyboard focus. HTML retains all copy and controls. The host occupies no layout space, so adding/removing the canvas cannot change hero dimensions.

The wrapper observes intersection, document visibility, and live reduced-motion changes. Only an intersecting hero in a visible document with motion enabled imports `createCityScene`. Initial reduced motion downloads no renderer module and displays the static fallback. Enabling reduced motion later aborts pending initialization and destroys any running scene. Turning it off can initialize again. Errors select the fallback without a retry loop.

`createCityScene.ts` owns the application, its private ticker, background/midground/foreground containers, procedural Graphics, a ResizeObserver, resize/media listeners, passive pointer listeners on the surrounding hero, and a context-loss listener. It has no game, storage, routing, or React dependency. Cover scaling is centered horizontally and bottom aligned. Pointer movement is normalized and clamped; coarse/touch input does not drive parallax. The private ticker smooths bounded movement and subtle window light without React re-renders. No independent animation loop or shared ticker is started.

Initialization starts with the ticker stopped. The canvas is appended only after successful initialization and an initial render. Aborted or stale work is destroyed after initialization resolves and never activates its ticker. Pending initialization settles before a replacement attempt starts within a mounted wrapper. Offscreen/hidden states stop the ticker; reappearance resumes it without accumulating hidden time. Resizes adjust resolution, frame-rate cap and cover scale; hidden scenes defer drawing until resumed.

Cleanup aborts the current attempt, disconnects all observers, removes DOM/media/visibility/pointer/context listeners, stops the private ticker, removes the canvas, and destroys children, graphics contexts, owned textures/sources and renderer resources. It also requests `releaseGlobalResources: true`, since this is the application's sole Pixi owner; revisit that global-pool policy if another independent Pixi application is introduced later. Cleanup is idempotent. Failure before Application initialization uses guarded stage/renderer cleanup because Application.destroy assumes initialized plugins. Context loss and caught rendering failures release the scene and expose the fallback.

Quality controls: hosts narrower than 768px or using a coarse pointer use a **1.25 DPR / 30fps cap**; other hosts use **1.5 DPR / 45fps cap**. Actual lower device DPR is respected. Antialiasing is off, pixels are rounded, no filters are used, and all placeholder shapes are constructed once. Frame caps are ceilings, not promised frame rates. Forced colors hide the decorative canvas visually; reduced motion uses the SVG and no renderer.

## Files

Created:

- `src/features/living-city/LivingCityScene.tsx` — React lifecycle, lazy import, fallback.
- `src/features/living-city/createCityScene.ts` — Pixi rendering and owned resources.
- `src/features/living-city/sceneConfig.ts` — logical dimensions, deterministic geometry, quality and crop policy.
- `src/features/living-city/sceneAssets.ts` — five future assets with null source paths.
- `src/features/living-city/sceneTypes.ts` — small renderer/manifest contracts.
- `src/features/living-city/living-city.css` — isolated decorative layer and fallback styling.
- `tests/unit/living-city.test.tsx` — six lifecycle/geometry/quality tests.
- `tests/smoke/living-city.spec.ts` — seven browser scenarios in each existing browser project.
- `scripts/validate-living-city.mjs` — reproducible screenshots, rendered frame samples, visibility/draw and retained-heap measurements.
- `scripts/validate-city-memory.mjs` — extended 42-cycle retained heap, DOM-node and event-listener check.
- This document, the [asset contract](living-city-assets.md), and [browser artifacts](living-city-review/measurements.json).

Modified: `src/pages/HomePage.tsx` (one import and one mount), `src/pages/homepage.css` (hero stacking only), `package.json`, `package-lock.json`, and README's Phase A link. Chapters, Trust Report, state, scoring, persistence, OS controls, and routing implementations were not edited.

## Validation

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed, also repeated by the production build |
| `npm run lint` | Passed with zero warnings |
| `npm run test:unit` | **82 passed**, including all 76 existing tests and six new lifecycle/quality tests |
| `npm run build` | Passed; Vite retains a warning for the **524.67 kB** main application chunk (**162.90 kB gzip**) |
| `npm run test:smoke` | **86 passed** in Chrome desktop/mobile projects; 72 existing and 14 new browser cases |
| Frontend skill source lint | **0 failures**, one existing outlined-control warning in homepage.css; the semantic email inspection control is retained |
| Frontend skill real-browser inspector | Could not complete: both Chrome and Edge runs timed out at CDP `Page.enable`. No inspector pass is claimed. Playwright supplied independent measurements and screenshots. |
| Fallbacks | Failed lazy module, unsupported WebGL, synthetic context loss, initial reduced motion, and live motion changes pass |
| Lifecycle | Strict Mode, async completion after navigation, repeated SPA navigation, and live resizing pass; maximum one mounted canvas |
| Content and input | Existing start/resume, guide, chapter journeys, preview inspection, keyboard, touch, local-save, and report tests pass |

The final production captures used **Chrome 156.0.8078.76**, at DPR 3 for mobile emulation and DPR 2 for wider viewports. The renderer honored its lower DPR caps:

| CSS viewport | Scene DPR | Observed rendered fps | Median / p95 frame interval | Layout shift | Overflow |
| --- | --- | --- | --- | --- | --- |
| 360 × 844 | 1.25 | 29.5 | 36.2 / 36.6 ms | 0 | None |
| 390 × 844 | 1.25 | 29.5 | 36.2 / 36.6 ms | 0 | None |
| 768 × 1000 | 1.5 | 43.8 | 24.2 / 24.4 ms | 0 | None |
| 1440 × 1000 | 1.5 | 43.8 | 24.2 / 24.4 ms | 0 | None |

All four samples had **zero long tasks during the three-second steady-state sample**, stable hero bounds before/after init, the primary CTA above the fold, unchanged saved data during preview inspection, **zero draws offscreen**, **zero draws during the simulated hidden-document signal**, **zero draws after unmount**, and no page errors. Measured cadence is specific to this headless browser/environment and must not be equated with physical-device smoothness. Initialization and shader compilation were excluded from the steady-state frame sample.

The separate [42-cycle memory check](living-city-review/heap-soak.json) kept retained counts exactly at **1 document, 821 DOM nodes, and 329 event listeners** after every forced-GC checkpoint on the guide route. No canvas or listener accumulation was observed. Retained JS heap grew from **6.20 MB** initially to **7.47 / 8.13 / 8.38 / 8.73 / 8.95 MB** after 6 / 12 / 18 / 30 / 42 cycles. Growth slowed but did not fully flatten, including after explicit global-pool release. The retained JS growth has not been attributed to a specific cause. These results support cleanup of DOM/listener/ticker resources, while further long-session JS/native/GPU profiling remains a limitation; this is not a claim of leak-free memory behavior.

To reproduce after a build with the local preview running:

```sh
npm run test:smoke
node scripts/validate-living-city.mjs
node scripts/validate-city-memory.mjs
```

The measurement script samples actual WebGL frame clears for three seconds after warm-up, counts long tasks during that interval, observes layout shifts, measures the hero before/after renderer initialization, checks offscreen draws, exercises mouse/touch inspection, and performs repeated SPA navigation with forced JavaScript garbage collection. It retains no canvas/context references in instrumentation. The hidden-document measurement simulates `document.hidden` plus its visibility event; the offscreen measurement uses real scrolling and IntersectionObserver. Heap values measure retained JavaScript only, including browser/library caches and route work; they do not measure GPU/native memory or establish a leak-free guarantee.

## Review artifacts and limitations

[1440px first screen](living-city-review/1440-fold.png) · [768px first screen](living-city-review/768-fold.png) · [390px first screen](living-city-review/390-fold.png) · [360px first screen](living-city-review/360-fold.png). Full-page captures are beside each first-screen image, with `-full.png` filenames.

The skyline is intentionally simple placeholder geometry; it does not represent approved Phase B city artwork. Mobile cover cropping puts much of that skyline behind the existing OS preview. Device emulation and a short local headless sample cannot establish physical-phone, battery, thermals, GPU-memory, Safari/Firefox, or long-session performance. The initial application chunk still triggers Vite's 500kB warning; this task does not refactor the persistent OS/game bundle. The Pixi entry is a separate **249.06 kB / 73.22 kB gzip** lazy chunk with additional renderer dependency chunks. Initial reduced motion requests no city renderer chunk. Approved assets will require a new load/texture cleanup path and renewed measurement.

Visual review: opened the final 360, 390, 768 and 1440 first-screen captures and full desktop/mobile pages. The original heading, introduction, start control, OS preview and lower sections remain visible. The low-contrast geometric skyline is subordinate to the content. The two material visual limits are the temporary block silhouettes and the heavy center crop on tall mobile heroes; both are explicit Phase B review topics. No additional layout or copy changes were made to compensate for temporary artwork.

Product Owner review is required before Phase B begins. Review the integration, fallback/motion behavior, scene boundaries, and proposed [asset artboard/crop contract](living-city-assets.md).
