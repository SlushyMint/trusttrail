# Phase B.2 — Motion review

## A. Audit before implementation

The homepage is `HomePage → InvestigationOpening (LivingCityScene + OS preview + tool dock) → ThreatIntelligence → EmailInspection → dossiers → safety/CTA`. Motion 14.8 and PixiJS 8.22 were already installed. No dependency or package-lock change is needed.

The B.1 layout, Inter/Silkscreen typography, navy/teal palette, generated pixel city, real OS preview, source citations and email practice are retained. The subject inventory is Ari, the unsolicited NovaTech invitation, the recruitment trail, Mail, independent Browser sources, Case Files, the historical archive, three dossiers, local progress and recovery. The argument remains invitation → inspection tools → real-world context → practice → the playable case. On this page, Ari's incoming invitation becomes a trail from the city into the evidence archive and finally the player's decision. The live things are the OS preview, source-file selection and email inspection.

Existing direction: **The printed annual / editorial-report**, seed **1842996765**, palette and type retained; no new draw or redraw because this is a motion pass over an established composition. User requirements to preserve identity, layout and functionality take priority over skill suggestions to replace the layout or add GSAP/stock photography.

Before: heading slides of 8px/280ms, repeated 10px rises, unrelated 140–180ms panel changes. The city has pointer parallax, window activity and particles but no scroll input. CTA wrappers animate independently. The archive is visually detached from the opening. Existing city ownership is sound: dynamic import, static fallback, abortable texture loading, private ticker, capped DPR, intersection and document visibility pausing, full destruction on navigation or reduced motion.

The design inspector initially failed to connect in the sandbox; its retry outside the sandbox succeeded. Before results: one `icon-cards` failure (the functioning OS dock), five warnings (pictures, footage, paragraph measure, motion count and font-size variety). See `.taste-skill/phase-b2-before/`. The OS dock is a real product control rather than a decorative feature-card row and is kept under the user's preservation requirement. Additional stock images or video would dilute the pixel world, so none are added.

## Reference: observed versus inferred

Reference: [Accenture homepage](https://www.accenture.com/), redirected to `/en`, viewed in headless Chrome at 1440 and 390px, including an emulated reduced-motion run. The first browser connector was unavailable. The sandboxed Playwright navigation returned `ERR_NETWORK_ACCESS_DENIED`; the approved network retry reached the page successfully. Source/content browsing also succeeded.

Directly observed in screenshots:

- The initial hero was black in the early samples, then resolved to a large two-line white heading with an animated particle field, smaller supporting copy and a compact arrow CTA. This is a sampled delayed reveal, not a precise load-duration measurement.
- Desktop places the hero message beside supporting content and follows it with four image-led research columns. Scrolling advances to further image-led cards on the same dark field.
- Mobile reflows the heading and supporting copy vertically and uses a compact menu. Its cookie dialog obscured a substantial part of the first screen in captured samples.
- The particle field changes across samples. A visible pause control accompanies it.
- No sticky position was found among the sampled header/section elements. This narrow query does **not** establish that the entire site has no sticky or pinned content.

Not established: exact entrance order, numerical easing/durations, whether particular reveals use scroll timelines, transforms or a third-party library, full-site pinning, pointer parallax, and effective reduced-motion suppression. The attempted desktop card hover was interrupted because the target was no longer stable/visible; it is not treated as verified behavior. Reduced-motion snapshots are evidence of the rendered composition, not proof of compliance. No source code or assets were copied.

Inference used as creative guidance: emphasize one dominant message, keep background movement quieter than text, make the scene handover cohesive, and provide immediate feedback. TrustTrail's implementation follows the user's fallback motion specification wherever direct reference behavior could not be established. Reference screenshots and access/hover limitations are in `reference/`.

## B. Motion architecture

- `homepageMotion.tsx`: one homepage-only context and `MotionConfig`; one reduced-motion and compact-device subscription, reusable content/heading/panel recipes, tokens for durations, easing, stagger, travel and a critically damped selection spring. Gameplay remains outside this boundary.
- CSS equivalents: press 120ms, hover 180ms, panel 280ms, content 520ms, scene 720ms. Cubic out `(0.22,1,0.36,1)` and scene out `(0.16,1,0.3,1)`. Item stagger 65ms; headline line stagger 85ms. Mobile reveal 340ms and half travel. Spring stiffness 380 / damping 40 / mass .8 for the shared OS selection marker.
- `InvestigationOpening` owns a single native `useScroll` target, mapped from `start start` to `end start`. Documented function-form `useTransform` subscriptions drive the bounded outputs. This avoids the installed Motion 14.8 native ViewTimeline cache retaining each per-mount target, verified by a heap trace and navigation soak. The OS showcase travels at most 22px and a flat readability shade reaches at most .32 opacity (.12 on compact devices). No scroll wrapper, wheel interception, artificial hold, sticky section or mandatory delay.
- The same MotionValue crosses the React/Pixi boundary through a reader callback. Pixi samples it in its existing private ticker, clamps it to `[0,1]`, and moves each art layer by its existing depth × at most .65 (compact .2). No scroll-driven React state or additional ticker/listener. Pointer vertical movement plus scroll stays below 32px overscan; textures remain uniformly scaled with round pixels.
- Desktop city cap is now 60 FPS, compact 30 FPS. DPR caps remain 1.5/1.25; compact assets, lazy import, offscreen/hidden pause, error fallback and cleanup are retained.
- Headlines settle line by line; OS panels replace immediately with a short readable arrival and a single transform-only selection marker driven by the spring token. It uses percentage travel over equal flex tracks, without layout projection or measurement. Archive files arrive in reading order, with horizontal travel on desktop and a small vertical offset on phones. Historical values reveal as a whole: no count-up, fabricated values, live feed or simulated monitoring. Dossiers arrive in order; only real links receive hover emphasis.
- All first-frame content remains readable. Primary/final CTAs have no entrance or completion dependency. Offscreen content never uses opacity zero. Focus does not wait for transitions. The email practice uses immediate disclosure and an arriving detail, plus a quieter notebook background change instead of a bounce.
- Reduced motion removes travel, parallax and delays, forces every marked element to its settled transform/opacity, removes decorative shade and canvas, and preserves native keyboard, touch and disclosure behavior. Preference changes work during a visit. The static city continues to carry the visual setting.

## C. Implementation scope

Production files: `src/pages/HomePage.tsx`, `InvestigationOpening.tsx`, `ThreatIntelligence.tsx`, `homepage.css`, new `homepageMotion.tsx`; `src/features/living-city/LivingCityScene.tsx`, `createCityScene.ts`, `sceneTypes.ts`, `sceneConfig.ts`.

Verification files: `tests/unit/living-city.test.tsx`, new `tests/smoke/homepage-b2.spec.ts`, new `scripts/review-homepage-b2.mjs`, new `scripts/audit-b2-reference.mjs`. Review artifacts stay under `docs/phase-b2-review/` and `.taste-skill/phase-b2-*`.

No changes to chapter content, engine, scoring, recovery, Trust Report, persistence, gameplay controls or routes. No authentication, backend, analytics, new assets or new dependencies. No Git operations and no deployment.

## D–E. Visual review and verification

Results and final critique are recorded below from the production review. Before and after screenshots use matching widths, viewports and interactions. Motion recordings were captured at 1440px and 390px.

Performance is measured on the production Vite preview in local headless Chrome without CPU/network throttling. Touch/mobile are emulated. rAF cadence is not physical screen presentation FPS; city WebGL draw sampling and retained-JS checks are separate. This cannot guarantee 60 FPS on mobile hardware or measure GPU/native memory.

### Visual evidence

| Width | Before | After | Reduced motion |
| --- | --- | --- | --- |
| 1440 | [First screen](before/1440-fold.png) · [Whole page](before/1440-full.png) | [First screen](after/1440-fold.png) · [Whole page](after/1440-full.png) | [Static](after/1440-reduced.png) |
| 768 | [First screen](before/768-fold.png) · [Whole page](before/768-full.png) | [First screen](after/768-fold.png) · [Whole page](after/768-full.png) | [Static](after/768-reduced.png) |
| 390 | [First screen](before/390-fold.png) · [Whole page](before/390-full.png) | [First screen](after/390-fold.png) · [Whole page](after/390-full.png) | [Static](after/390-reduced.png) |
| 360 | [First screen](before/360-fold.png) · [Whole page](before/360-full.png) | [First screen](after/360-fold.png) · [Whole page](after/360-full.png) | [Static](after/360-reduced.png) |

[Desktop motion recording](after/1440-motion.webm) · [Phone motion recording](after/390-motion.webm). The change is deliberately most apparent in movement; settled compositions remain close to B.1. OS, intelligence, practice, dossier and final-decision captures for every width are also in `before/` and `after/`. The skill's intermediate-scroll contact sheet is `.taste-skill/phase-b2-after/desktop-film-01.jpg`.

### Structured visual critique

ROUND 1 — before

Seen in one second: the unsolicited job invitation next to Ari's Mail window.

Idea (one sentence): Ari's incoming invitation becomes a trail through the city, inspection tools and evidence.

Live thing: OS selection, historical archive files and sender inspection.

Layout words by section: hero=split / tools=dock / evidence=archive / practice=mail-and-notebook / chapters=list / decision=split-city.

Scores: design 7.5 · usability 8.2 · creativity 7.6 · content 8.3 → overall 7.8.

Caps applied: none beyond keeping the established composition; the inspector's OS-dock finding is an explicitly retained functional interface, not a removed feature.

Top three problems, with evidence and fixes:

1. The city ends at a separate tool/archives rhythm (`before/1440-intel.png` and first-screen capture). Add one scroll mapping that couples depth and interface travel; taper atmosphere toward the archive.
2. The static hierarchy works, but the timeline lacks a dominant entry: the same tiny rise is reused for headings and copy (before screenshots plus code audit). Protect the headline's two-line arrival and keep its CTA still; give archive files a different directional entrance.
3. The source disclaimer spans too wide a line (`.taste-skill/phase-b2-before/desktop-page-01.jpg`). Constrain its measure while retaining every qualification.

ROUND 2 — final visual review

Seen in one second: invitation/question, with a clear start action and the readable Mail preview.

Idea (one sentence): the same invitation anchors the city-to-interface handover and the player's eventual decision.

Live thing: all three original interactive previews remain functional from keyboard and touch.

Layout words by section: hero=split / tools=dock / evidence=archive / practice=mail-and-notebook / chapters=list / decision=split-city.

Scores: design 7.8 · usability 8.5 · creativity 7.8 · content 8.3 → overall 8.1. These are internal critique scores, not an external jury result.

Caps applied: none. All eight inspector screenshots and the intermediate-scroll contact sheet were opened, in addition to direct desktop/phone state captures. No headline/CTA collisions, blank city edges or clipped reading were visible in the samples. Inspecting motion state and captured sequences does not establish quality on every physical device.

Top three remaining observations:

1. Phone archive panels are long (`after/390-intel.png`) because complete scopes/citations are retained and panel height is reserved to avoid jumps. This is an intentional readability/stability tradeoff; no content was cut.
2. The quiet terminal leaves more space than the city (`after/1440-intel.png`). This gives the historical data a readable pause, without adding pinned time or a fabricated live feed.
3. Font-size variety remains in the established pixel OS (`mobile-page-01.jpg`). A typography redesign would exceed this motion phase; controls and all section headings remain readable.

Design gates: source lint **0 FAIL / 0 WARN**. Final production inspector **0 FAIL / 4 WARN**, with `--allow icon-cards` solely for the existing working OS dock. Warnings defended: one real image/no footage is appropriate to the existing Pixi pixel-art identity; longest paragraph measure is reduced from about 188 to 95 estimated characters and retained for the historical context; 10 phone sizes belong to the existing interface hierarchy. Scripted moving-element count rises from 12 to 37, with no new content or decorative assets. No new photographs, clips, sample copy or credits were introduced.

### Browser measurements

`after/browser-results.json`: all four requested widths have CTA above fold, no horizontal overflow, stable local storage, zero console/page errors, zero broken responses and zero observed layout-shift value. OS frame heights remain 536px (desktop/tablet) and 617.44px (phones); archive frames remain 594px, 644px and 868.63px respectively through all three selections. These stable frames retain the B.1 dimensions.

During the final 2.2s scheduled native-scroll samples, rAF cadence was 141–165 callbacks/s in this Chrome environment, p95 interval 6.2–12.2ms, with no long tasks over 50ms in the sample. Other verification overlapped the initial desktop capture; this is a functional motion recording rather than an isolated benchmark. Before was about 165 callbacks/s. These figures describe callback cadence only and must not be advertised as visual FPS or a speedup. Reduced-motion samples contain no city canvas and the inspected headings/showcase are fully opaque with no transform. Isolated city draw measurements are recorded separately in `performance-final/measurements.json`.

### Review limitations

- Headless Chrome desktop and touch emulation; physical iOS/Android, Safari/Firefox and screen-reader software were not exercised. Semantics, live regions, accessible names, focus styles and keyboard activation were inspected/tested.
- Reference hover timing, exact easing and full reduced-motion behavior could not be reliably established; no claim of reproducing Accenture's implementation.
- Vite retains its nonfatal main-chunk warning: 541.38kB minified / 168.26kB gzip. Pixi remains dynamically loaded in separate chunks. Broad gameplay/route splitting is outside this phase.
- Performance samples are local and unthrottled; WebGL and GPU/native memory still depend on actual hardware and browser drivers.

### Memory verification and repair

The first longer soak found increasing detached nodes/listeners even though city canvases and tickers were destroyed. Heap inspection traced the opening element to the installed Motion package's native timeline cache (`framer-motion/dist/es/render/dom/scroll/utils/get-timeline.mjs`), a strong target-keyed Map with no removal path. Function-form transformations keep this scene on Motion's subscribed path without patching dependencies or private internals.

The final 42-cycle navigation soak (`performance-final/heap-soak.json`) holds **821 DOM nodes, 329 event listeners and one document at every checkpoint**. Forced-GC JS heap grows from 6.35MB cold to 9.24MB after 42 cycles, with only 0.23MB growth between cycles 30 and 42, consistent with runtime/cache warm-up rather than the previous retained page trees. Earlier diagnostic artifacts in `performance/` show the failure and are retained for inspection; they do not represent the final implementation. This is JS/DOM evidence, not a GPU-memory measurement.

Final isolated draw sample, Chrome 156.0.8078.76, three-second steady-state windows:

| Width | City draws/s | p95 draw interval | DPR cap | Layout shift | Offscreen / hidden / unmounted draws |
| --- | --- | --- | --- | --- | --- |
| 360 | 29.5 | 36.5ms | 1.25 | 0 | 0 / 0 / 0 |
| 390 | 29.5 | 36.7ms | 1.25 | 0 | 0 / 0 / 0 |
| 768, fine pointer | 58.3 | 18.4ms | 1.5 | 0 | 0 / 0 / 0 |
| 1440 | 58.2 | 18.5ms | 1.5 | 0 | 0 / 0 / 0 |

No >50ms long tasks occurred during those steady-state samples. Initialization took 145–467ms in this run and did include 62–199ms main-thread tasks (the first cold compact run recorded 199ms and 160ms tasks). Lazy renderer loading and the pre-rendered static image preserve the page/CTA while it initializes, but cold-start work remains a performance limitation. Hero bounds stayed stable; every run had one canvas maximum, no page errors and unchanged local progress. The actual draw-count probe and measurements are in `performance-final/measurements.json`; hardware/GPU presentation rates can differ.

### Documentation consulted

[Motion scroll](https://motion.dev/docs/react-use-scroll), [function transforms](https://motion.dev/docs/react-use-transform), [reduced motion](https://motion.dev/docs/react-accessibility), [PixiJS v8.22 lifecycle](https://github.com/pixijs/pixijs/blob/v8.22.0/src/app/__docs__/ticker-plugin.md), [React external subscriptions](https://react.dev/reference/react/useSyncExternalStore), [Playwright assertions](https://playwright.dev/docs/api/class-genericassertions), and [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Library documentation was fetched through Context7; installed Motion source was additionally inspected to diagnose the retention issue. Vercel React guidance informed MotionValue-based updates, scoped subscriptions and retained lazy renderer loading.

### Test results

| Check | Result |
| --- | --- |
| `npm run typecheck` | Pass on final code, including the new regression test |
| `npm run lint` | Pass, zero warnings, on final code |
| `npm run test:unit` | 8 files / 87 unit and integration tests passed |
| `npm run build` | Pass; nonfatal existing main-chunk size warning documented above |
| Full `npm run test:smoke -- --workers=1` | 102 cases executed: 101 initially passed; one new mobile assertion exposed a 0.00003px rounding difference, corrected with floating-point comparison; all four B.2 cases then passed |
| Final affected homepage + city Playwright run | 36/36 passed after the timeline-cache fix, desktop and mobile |
| Added DOM/listener retention regression | 2/2 passed, desktop and mobile, six repeated SPA visits each |
| Final visual source gate | 0 failures / 0 warnings |
| Final production visual inspector | 0 failures / 4 defended warnings; screenshots and scroll contact sheet visually reviewed |
| Production four-width smoke | All pass: CTA access, no overflow, fixed selection geometry, local progress unchanged, reduced motion, no console/page errors or broken responses |
| City lifecycle/performance + 42-cycle soak | Zero hidden/offscreen/unmounted draws; one canvas maximum; stable DOM/listener counts after the cache fix |

All **104 distinct browser cases** were validated across the full suite and focused final runs; this was not a single 104-case run. Existing chapter, scoring, recovery, report, local-save, corrupt-save, conflict, keyboard, route and refresh coverage all passed. The final production adjustments were confined to homepage presentation and resource cleanup.

Phase B.2 stops here for Product Owner review. No Git operations or deployment were performed.
