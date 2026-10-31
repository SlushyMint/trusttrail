# Game-first proposal — validation and review boundary

29 October 2026. **Representative Chapter 1 prototype ready for Product Owner review. Game-wide adoption is pending.** No Git operation, dependency installation/change, deployment or competition submission was performed. The GDD, production blueprint and existing UX contract remain unchanged.

## Review the concrete result

- [Review package: representative screen, comparisons and asset board](game-first-review/index.html).
- [Visual specification and screen/component audit](game-first-art-direction.md).
- [Eight-illustration asset inventory](game-first-assets.md), [exact file manifest](game-first-artwork-manifest.json) and [actual generation prompts](game-first-artwork-prompts.json).

Run from the existing project root:

```powershell
node scripts/review-art-direction.mjs
```

Open **http://127.0.0.1:4384/art-direction.html**. The script makes an explicit local review build in `.cache/art-direction-build`, then serves it on loopback. It does not change `vite.config.ts`, the package scripts, `dist`, or default application routes. Stop the preview with Ctrl+C. For ordinary Vite development, `art-direction.html` is also available through the existing dev server.

The review starts midway through Chapter 1 with no evidence awarded. Menu → “Mulai pratinjau dari cerita” shows the authored introduction and expression change. Closing the email returns to room/artifact selection. The native journal, three existing choices, two-step independent verification, outcomes and reflection are functional. This entry uses the canonical reducer/content with an in-memory context and **does not access localStorage or the real save adapter**. Reloading restarts only the prototype. It is not a replacement persistence implementation.

## Results

Validated on **Node 26.13.0 / npm 11.6.3**, retaining strict engine checks and the existing dependency pins. Installed Chrome **156.0.8078.73** supplied desktop, tablet and Pixel 7 touch emulation.

| Gate | Result |
|---|---|
| Strict TypeScript and ESLint | Passed, including new prototype source/tests and review helper |
| Existing unit/component/integration tests | **37 passed**; no existing test edited or skipped |
| Existing application browser suite | **32 passed** |
| New review-entry browser suite | **15 passed** against Vite development; **15 passed** again against the minified review build |
| Default application production build | Passed; 118 modules; JS 314.45 kB / 98.09 kB gzip; CSS 40.59 kB / 9.20 kB gzip |
| Explicit two-entry review build | Passed; 131 modules; review-specific JS 15.03 kB / 4.78 kB gzip, in addition to shared application/runtime chunks |
| Required screenshot review | **18 captures**: six modes at each of 360, 768 and 1440px |
| TasteSkill browser inspector | **0 FAIL / 2 WARN**, minified prototype at 1440, 768, 390 and 360px |
| TasteSkill prototype source lint | **0 FAIL / 2 WARN** |

The new browser cases prove that focus/opening a source awards nothing, inspection is recorded once, the journal restores focus, a preexisting save string is untouched, source inspection and comparison remain separate, explicit choice commitment reaches the shared end, reduced motion preserves the story, artwork failure preserves actions, and touch/keyboard room return and a persistent HUD work at all three test widths. Browser result commands:

```powershell
npm run check
npm run test:smoke
node node_modules/@playwright/test/cli.js test --config tests/art-direction/playwright.config.ts
$env:TRUSTTRAIL_REVIEW_URL = 'http://127.0.0.1:4384'
node node_modules/@playwright/test/cli.js test --config tests/art-direction/playwright.config.ts
```

[Integrity evidence](game-first-review/integrity.json) compares the pre-task hashes of **60 existing files**: every existing source file, test and public asset, plus the approved GDD/blueprint/UX architecture, package manifest/lockfile, runtime files and app/build/browser configurations. All are byte-identical. README received a review-package link; new files contain the proposal, assets, prototype, opt-in helper and dedicated review tests. Tailwind's automatic content scan can add a few unused utility rules when new files appear; no existing application stylesheet or route was edited.

## Visual and accessibility review

The correction loop fixed a blurred phone environment by accounting for cover scaling and limiting the tall artifact view's background area. The HUD now remains reachable while a long email scrolls. Mobile decision/reflection screens use compact portrait context to preserve reading width. A text hamburger was replaced with the same outline-SVG treatment as the other controls. Screenshot capture resets document scroll before full-page shots so sticky HUDs do not appear halfway down a stitched image; journal images show the actual viewport-sized modal.

Final screenshots were inspected for hierarchy, typography, body measure, subject wrapping, full evidence/domain visibility, radio selection/focus, readable journal entries and scene atmosphere. [Capture metadata](game-first-review/capture-results.json) records reflow, console/page errors, outbound requests and loaded local fonts. [Additional verification](game-first-review/verification.json) records asset sizes, protected-file checks, screenshot-viewer selections and selected opaque text/surface contrast pairs. These are targeted checks, not a full WCAG conformance or performance claim.

The browser inspector's retained warnings reflect the approved Paper palette and a game stage using more saturated scenery/chrome than a conventional analytics app. Source warnings cover one actual floating artifact window's shadow and an existing chapter-context label. No suppression flags were used. The user-requested illustrated game direction takes precedence over the skill's dashboard color budget.

`design-taste-frontend` influenced the subject-specific room/portrait composition, one framed active artifact and screenshot correction loop. `web-design-guidelines` influenced native controls/dialogs, a stable polite discovery region, keyboard focus, touch targets, image dimensions/fallbacks and reduced motion. `vercel-react-best-practices` informed deriving mode/count/expression from canonical state, keeping presentation state local, and limiting effects to imperative focus. Current React/Playwright/Vite documentation was consulted through Context7.

Review against the [current Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md):

```text
art-direction.html: ✓ pass — language, viewport/zoom, document title, local font preload
src/art-direction/GameFirstReview.tsx: ✓ pass — real labeled controls, native journal, explicit events, image alt/dimensions/fallbacks, persistent polite region
src/art-direction/game-first.css: ✓ pass — light/dark focus contrast, readable artifact width, keyboard scroll, safe-area action padding, reduced motion and forced-colors treatment
docs/game-first-review/index.html: ✓ pass — labeled native selects, named scrollable image regions, local assets and meaningful screenshot descriptions
```

## Remaining review decisions and release work

Approve the original Ari identity/expression range, the room-led composition, HUD/dialogue/journal grammar and mobile adaptation, or identify changes before adoption. The optional recruitment lounge is a noncanonical mood study and must not imply a verified office. The day/evening/night variants propose continuity; they are not an enacted story/timeline change.

After approval, consolidate the review-only email markup with shared artifact rendering, connect the production shell to the existing provider, and apply the system to authored M2 chat/portal/recovery screens. The homepage, Chapters 2–3, final report and every consequence have not received a game-wide visual conversion in this task. Real-device, screen-reader, high-zoom and second-engine checks remain release work. No voice acting, sprite rigging, extra puzzles, new scoring rules or animation dependency is required.
