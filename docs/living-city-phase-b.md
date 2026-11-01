# Living city artwork and PixiJS integration — Phase B

Implemented locally on 31 October 2026. Phase B is ready for Product Owner review; Phase C interactive-homepage work has not begun. Homepage layout, typography, copy, start/resume actions, navigation, OS preview, game engine, chapters, report, scoring, and persistence implementations were preserved. No Git or deployment actions were performed.

## Generated artwork and provenance

The master reference exists at **`public/assets/city-layer-concept.png`**, without the extra `living-city` directory named in the request. It was inspected and supplied to the built-in **`image_gen.imagegen`** tool as art-direction guidance. Five independent generation calls produced original full-artboard layers; the reference's four panels were not cropped into assets. The shared direction is midnight navy, subdued teal, warm amber windows, rooftop-level perspective, crisp pixel detail, and quiet upper/left areas for semantic hero content. No labels, logos, signs, UI, text, or watermarks are present in the delivered artwork.

All five source images are **1672 × 941 pixels**. Source PNGs remain in the generated-image library and workspace `.cache/living-city-source/`. Production assets live in **`public/assets/living-city/`**. The [complete prompts and actual source output paths](living-city-phase-b/generation-prompts.json) and [machine-readable inventory](living-city-phase-b/asset-inventory.json) are retained.

| Production file | Dimensions | Alpha | Encoded bytes | Purpose |
| --- | --- | --- | ---: | --- |
| `sky-far.webp` | 1672 × 941 | Opaque | 121,190 | Clouds, sparse stars, muted moon |
| `city-back.webp` | 1672 × 941 | Yes | 190,830 | Distant towers, bridge and atmospheric depth |
| `city-mid.webp` | 1672 × 941 | Yes | 221,298 | Warm-lit offices and apartments |
| `city-front.webp` | 1672 × 941 | Yes | 102,534 | Near parapets, vents and maintenance structure |
| `office-props.webp` | 1672 × 941 | Yes | 86,958 | Rooftop cabinet, service light, cables and leaves |
| `city-mid-lights.webp` | 1672 × 941 | Yes | 45,836 | Technical emission mask derived from existing lit pixels |
| `city-static.webp` | 1672 × 941 | Opaque | 126,186 | Deterministic still composite of the five generated layers |

The five generated PNGs total **4,365,155 bytes**; their WebP versions total **722,810 bytes**, an **83.4%** transfer-size reduction without resampling. The mask and static fallback bring the complete new artwork set to **894,832 bytes**. Chromium's native WebP encoder used quality 0.90 for layers, 0.95 for the light mask, and 0.88 for the still composite. WebP is lossy in RGB; alpha counts are preserved. The original generated PNGs remain available for later re-encoding. `scripts/prepare-city-assets.mjs` reproduces encoding, the technical light mask, and the still composite from those sources. It performs no reference cropping or new creative image synthesis.

[Decoded WebP alpha checks](living-city-phase-b/asset-validation.json) confirm an opaque sky/still, transparent regions covering more than half of each composited texture, and no visible opaque sky or checkerboard matte. A few upper-quarter pixels retain alpha **1/255** from the generator; none there exceed that value. The light mask contains **28,892 pixels**, with **zero mask pixels outside the midground building silhouette**. The art reaches both horizontal edges but is not an exactly repeating tile; bounded cover cropping is used rather than infinite horizontal tiling.

## Scene architecture

The existing `LivingCityScene` wrapper, one async-initialized PixiJS v8 application, three depth containers, private ticker, visibility/reduced-motion handling, pointer isolation, and responsive quality ceilings remain. No dependencies were added.

`loadCityTextures.ts` fetches the five layers and emission mask in parallel, decodes owned `ImageBitmap` resources, checks native dimensions, and creates explicitly owned `ImageSource` / `Texture` instances with nearest sampling and mipmaps disabled. Bitmaps are decoded with premultiplied alpha and marked as already premultiplied on their Pixi sources, preserving transparent compositing. It deliberately avoids shared Pixi Assets cache entries: an old scene can cancel/dispose its sources without invalidating a replacement scene. Renderer initialization overlaps image loading. Both operations settle before failure/abort cleanup, preventing late async resources from escaping ownership. Browsers without `createImageBitmap` retain the static visual.

`createCityScene.ts` replaces all block placeholders with the five native-size sprites. The 1672 × 941 artwork provides a **32px bleed** around a **1608 × 877 logical viewport**. Sprites begin at `(-32, -32)`, retain native aspect ratio, and share uniform cover scaling. The actual generated native dimensions supersede Phase A's proposed 1664 × 964 export size. Pointer movement is clamped and smoothed, with independent depths **3 / 5 / 8 / 14 / 18**; ambient drift adds at most 12% horizontally. The largest displacement stays inside the bleed.

The light mask moves exactly with the midground at depth 8. Slow, low-amplitude additive brightness changes affect existing warm/teal light pixels without fading building facades. A pool of **8 compact / 20 desktop** one-to-two-pixel particles drifts slowly with soft lifetime fades. Objects are allocated once; no per-frame React state, image allocation, or geometry rebuilding is used. There are no blur filters or additional animation loops.

Cleanup stops/destroys the private ticker, disconnects observers/listeners, aborts image requests during initialization, removes the canvas, destroys all six owned textures and image sources, explicitly closes their bitmaps, and releases Pixi's unused global pools. Bitmap decoding cannot itself be aborted, so a bitmap that arrives after cancellation is immediately closed. Particle sprites use shared `Texture.WHITE`, which is intentionally excluded from owned-image destruction. Texture ownership is explicit and idempotent. The initial HTMLImageElement loader was replaced after the longer browser check revealed retained detached image nodes; final measurement results below cover the replacement.

The loading/failure/reduced-motion visual is the **126 KB static composite** inside the existing absolute SVG viewport. Reduced motion loads this one artwork file and no animated layer textures or Pixi renderer. Pixelated sampling also applies to that fallback. The canvas and fallback remain aria-hidden and pointer-transparent. A neutral navy readability scrim protects the existing hero copy; it does not alter typography or layout. A failed static image still leaves the navy backing and all semantic controls usable.

## Files changed

- Updated the six existing `src/features/living-city/` files and added `loadCityTextures.ts`.
- Added seven optimized production WebP files under `public/assets/living-city/`.
- Updated the city unit/browser tests; added three unit cases for owned bitmap cleanup, late decode cancellation, and invalid-artboard cleanup, plus three browser scenarios for missing artwork, cancellation during image loading, and reduced-motion texture requests.
- Added `scripts/prepare-city-assets.mjs` and `scripts/validate-city-art.mjs`.
- Extended the existing screenshot/performance and memory validators with a selectable output directory, initialization cost, and artwork request sizes, preserving Phase A evidence.
- Added this report, prompt/provenance, inventory, alpha-validation data and review captures. Updated the asset contract, asset credits, and README's current status link.

No homepage component or page-layout rewrite was needed. Gameplay files and package dependencies were not changed.

## Validation and measurements

The final **`npm run check` passed** typecheck, lint with zero warnings, **85 unit/integration tests**, and production build. The final browser suite passed **92/92 cases** in Chrome desktop/mobile emulation, including the existing Chapter 1–3, recovery/report, save, keyboard, touch and OS-window cases. The final build's main chunk is **525.06 KB / 162.93 KB gzip**, retaining Vite's >500KB warning; the lazy city entry is **250.46 KB / 73.77 KB gzip**, plus renderer dependency chunks. Frontend-skill source lint reports **0 failures / 0 warnings**, with the neutral readability scrim explicitly documented using the skill's supported exception marker. Render QA used Playwright; no pass is claimed for the skill's separate CDP inspector, which had timed out during Phase A.

The production review used **Chrome 156.0.8078.76**, without network/CPU throttling, at DPR 3 for mobile emulation and DPR 2 for wider viewports. The scene retained its **1.25 DPR / 30fps compact cap** and **1.5 DPR / 45fps desktop cap**. Frame rates count WebGL frame-clear submissions, rather than display presentation or GPU completion.

| Viewport | Observed rendered fps | p95 frame interval | Time from renderer-module release to ready | Initialization long tasks | Layout shift / overflow |
| --- | ---: | ---: | ---: | --- | --- |
| 360 × 844 | 29.5 | 36.6 ms | 494.0 ms | 246, 122 ms | 0 / none |
| 390 × 844 | 29.5 | 36.6 ms | 229.3 ms | 63 ms | 0 / none |
| 768 × 1000 | 43.9 | 25.5 ms | 194.1 ms | 65 ms | 0 / none |
| 1440 × 1000 | 43.9 | 24.4 ms | 249.8 ms | 66 ms | 0 / none |

Each three-second steady-state sample had **zero long tasks**, stable pre/post-initialization hero bounds, the primary CTA above the fold, **zero draws while offscreen**, **zero draws after unmount**, no duplicated canvas, unchanged saves during preview inspection, and no page errors. A simulated hidden-document event also produced zero draws; real offscreen checks used scrolling and IntersectionObserver. All seven artwork URLs resolved and transferred their expected encoded bytes. The master reference was not requested by the homepage.

Steady-state cadence is comparable to Phase A's local samples; this does not establish equivalent physical-device performance. Initialization includes renderer-module loading/compilation, image work, the first draw, and assertion polling overhead; the observed 63–246ms long tasks remain a material startup limitation. The static fallback is already present, but a long task can briefly delay input processing. No 60fps or universal smoothness claim is made.

The six native image textures have a calculated RGBA pixel footprint of approximately **37.8 MB** before mipmaps/driver overhead; mipmaps are disabled. This is a dimensional estimate, **not a measured GPU-memory value**. Physical low-memory phones may benefit from separately reviewed smaller texture variants. Headless Chrome's timings and emulated touch do not substitute for testing on such devices.

The [measurement JSON](living-city-phase-b/review/measurements.json) includes per-file transfer data and retained-JS-heap checkpoints. Across 18 desktop route cycles, retained JS heap rose from about **6.99 MB to 8.86 MB**, with growth slowing; no post-unmount drawing occurred. The final [42-cycle cleanup check](living-city-phase-b/review/heap-soak.json) kept **1 document, 821 DOM nodes, and 329 event listeners** constant at every checkpoint, fixing the detached-node accumulation seen with the initial HTML image loader. Retained JS heap rose from **6.16 MB** to **7.34 / 8.05 / 8.28 / 8.62 / 8.87 MB** after 6 / 12 / 18 / 30 / 42 cycles. Phase A also showed retained heap growth. The remaining growth has not been attributed; these counts and explicit bitmap closure do not establish a general leak-free guarantee or measure long-session native/GPU memory.

Reproduce after a successful build with preview at `http://127.0.0.1:4173`:

```powershell
npm.cmd run check
npm.cmd run test:smoke
node scripts/validate-city-art.mjs
$env:CITY_REVIEW_OUT = 'docs/living-city-phase-b/review'
node scripts/validate-living-city.mjs
node scripts/validate-city-memory.mjs
node scripts/review-city-composition.mjs
```

## Screenshots, visual review and limits

[1440px desktop](living-city-phase-b/review/1440-fold.png) · [768px tablet](living-city-phase-b/review/768-fold.png) · [390px mobile](living-city-phase-b/review/390-fold.png) · [360px mobile](living-city-phase-b/review/360-fold.png). Full-page captures use the corresponding `-full.png` filenames.

Opened and reviewed all four first-screen captures, full desktop/mobile pages, reduced-motion mobile capture, raw composed asset, and desktop captures at both pointer extremes. The city, vegetation and rooftop details are visible around the desktop OS preview, while the upper-left remains quiet and readable. No visible transparent-layer matte, internal layer seam, exposed moving texture edge, nonuniform texture stretching, horizontal canvas overflow, or broken artwork was found in these captures. Mobile retains the established tall stacked hero; its center crop shows mostly sky above the OS preview and hides much of the near architecture behind that preview. More prominent mobile architecture would require a separately reviewed composition change or alternate crop/artwork; the current layout was preserved as requested.

The approved homepage direction remains “The page is the object,” seed 22990416. The city is an environmental layer around that existing composition, with the real OS preview and email inspection still carrying the product. No new direction, invented proof/copy, or unrelated artwork was introduced. The only new gradient is a neutral navy text-readability scrim, the design skill's stated exception.

Remaining limits: initial renderer long tasks, continuing but slowing retained-JS-heap growth, exact repeating-tile compatibility not guaranteed, browser-specific WebP encoding, unmeasured physical-device/native/GPU behavior, and the existing >500KB main-chunk build warning. Safari/Firefox, physical phones, battery/thermal behavior and dedicated screen readers were not tested. The assets and scene require Product Owner visual review before Phase C begins.
