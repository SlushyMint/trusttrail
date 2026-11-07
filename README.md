# TrustTrail

**Think Before You Trust.** An Indonesian narrative investigation game about digital recruitment deception.

**Phase 6 SFX-only candidate (6 November 2026):** application package **0.1.0** includes seven original short sound effects, accessible master mute and SFX volume, and the existing staged security headers. [Audio/security report and current verification](docs/phase-6-audio-security-report.md). Audio preferences migrate safely from the earlier version without changing gameplay saves or scoring. **No Git operation, deployment or submission is authorized. Stop for Product Owner review.**

[Phase 5C release instructions and submission checklist](docs/phase-5c-release-readiness.md), [4:40 demo storyboard/script](docs/mit-week-demo-video-plan.md), and [official guide requirements](docs/mit-week-requirements.md) remain the owner release references. Public links are unverified. Earlier phase reports are historical evidence; content/rubric/save versions remain separate contracts.

The approved homepage Phase B.1 remains in place. Its [review gallery](docs/phase-b1-review/index.html), [implementation record](docs/living-city-phase-b1.md), [Phase B artwork](docs/living-city-phase-b.md), and [Phase A foundation](docs/living-city-phase-a.md) are historical milestone evidence.

## Current status

**Chapters 1–3 and the recovery mission are fully playable.** Investigate the recruitment email, Mira's conversation, and a fictional verification portal. Compare the portal's domain and account-code requirement with established company information, make a consequential decision, and complete recovery actions appropriate to Ari's actual exposure. All three final choices lead through recovery and reflection to an event-backed Trust Report. See [Chapter 3 implementation and validation](docs/chapter-three-validation.md).

The typed reducer, event-based scoring, and versioned local save are extended additively. Completed Chapter 1–2 saves resume at their original checkpoints with explicit chapter continuation. Earlier choices, evidence, flags, verification, and action counts remain available in Case Files. Recovery is required for every final choice and does not add arbitrary score bonuses. The Trust Report summarizes actual actions and existing chapter fractions; it does not invent an overall ability score.

Current verification is recorded once in the dated table below. Older milestone counts describe earlier application states. Lacak OS desktop, Saku mobile, gameplay scoring and the versioned save format retain their established behavior. No real personal information, uploads, external recruiter messages, or live deceptive destinations are used.

Run `npm run dev` at `http://127.0.0.1:5173/`, or build and preview at `http://127.0.0.1:4173/`. Desktop windows require width >=1120px and height >=700px; smaller/shorter viewports use Saku. Resizing preserves both authoritative progress and app interaction state. The [dual-OS specification](docs/dual-os-review/design-spec.md) remains the visual reference. Archived design-review entries are excluded from the production build.

**The Product Owner handles Git manually. No commits, branch operations, pushes, deployment, or submission are part of this delivery.**

## Requirements and setup

- Target **Node 26.13.0 / npm 11.6.3**. `.nvmrc` records the target; `engines.node` permits `>=26.13.0 <27.0.0`. `packageManager` is `npm@11.6.3`; it does not switch the installed npm executable. Keep `engine-strict=true`.
- Access to the official registry `https://registry.npmjs.org/`, or a complete approved cache.
- Chrome by default for Playwright; use `PLAYWRIGHT_CHANNEL=msedge` for installed Edge, or `PLAYWRIGHT_EXECUTABLE_PATH=/absolute/path/to/chromium` for an installed compatible Chromium. This phase uses Fedora Chromium 156.0.8078.73 at `/usr/bin/chromium-browser`; current results are in the dated table below. Older engine/timing evidence remains historical. The suite owns its preview server on port 4173 and runs one worker; stop other servers on that port first.

From the project directory in a trusted terminal with ordinary registry access:

```sh
npm ci
npm run check
npm run dev
```

The included `package-lock.json` was updated with npm 11.20.0 for Phase 5B and clean-installed with the declared npm 11.6.3 target using the official registry. Use `npm ci` for a clean reproducible install after stopping any running development/preview server, which can lock native modules on Windows. The Product Owner handles all Git operations independently. All direct dependency versions, including Vite 8.3.5, remain exact pins in [package.json](package.json). Do not change registry mirrors, disable TLS or bypass engine/peer checks.

The session's installed npm is **11.20.0**, used for checks and the consistent lockfile update. The clean `npm ci` was also verified using npm **11.6.3** without changing global npm. Verify `node --version`, `npm --version` and `Get-Command node,npm -All` in PowerShell. To match the declared npm 11.6.3 target, see the [temporary-runner commands](docs/node-26-compatibility.md#runtime-selection-and-installation).

Development uses `http://127.0.0.1:5173`. Production preview, after a successful build:

```sh
npm run build
npm run test:smoke
npm run preview
```

Preview is local only. Root [vercel.json](vercel.json) prepares Vite build/output, filtered SPA fallback and staged response security headers. Preview mirrors the headers and missing-static-file exclusions for local regression. Strict script CSP remains report-only because of verified Pixi shader compatibility. The owner must authorize deployment and verify actual public headers, routing, HTTPS and caching using the [release checklist](docs/phase-5c-release-readiness.md). No hosting resource was created. Public website/repository/video links and the official submission-form URL have not been supplied or verified.

## Current validation: 6 November 2026

Node 26.13.0; npm 11.20.0 against the existing installed tree. Fedora Chromium with desktop/Pixel 7 emulation uses the local production preview. Clean installation evidence remains historical. The SFX cleanup's fresh pre-change engineering check passed 132 tests/build; the earlier candidate's 150 browser passes are historical. Current results and [limits](docs/phase-6-audio-security-report.md) follow.

| Script | Purpose | Current result |
|---|---|---|
| `npm run typecheck` | Strict TypeScript validation, including configs/tests | Passed on Node 26.13.0 |
| `npm run lint` | ESLint, zero warnings | Passed on authored source/config/tests |
| `npm run test:unit` | Engine/content/save/SFX tests and rendered control/gameplay integration | 137 passed, 0 failed in 14 files |
| `npm run test:watch` | Interactive component test runner | Configured, not separately exercised |
| `npm run build` | Typecheck then Vite production build | Passed on Node 26.13.0 |
| `npm run test:smoke` | C1–C3, recovery/report, tutorial, SFX, storage/security, routes, keyboard, responsive and visual resilience | 152 passed, 0 failed, 76 desktop + 76 mobile, 6.7 minutes; no skips or retries |
| `npm run check` | Typecheck, lint, unit and build gates | Passed: typecheck, lint, 137 tests and build |

Existing route/readiness waits and the scoped 60-second repeated-GC diagnostic remain; default test and expectation deadlines are unchanged. Phase 6 retains all original assertions and gameplay/scoring/save contracts. Registry audits report zero production findings and seven moderate development-only entries sharing one minimatch advisory; the report assesses exposure and the retained dependency pins.

Test expectations are behavior-based: keyboard activation, disabled controls, tab selection/relationships, hidden panel controls, drawer focus restoration and intentional live announcements. jsdom's dialog shim is limited to unit tests; native focus containment/Escape still require the browser suite.

## Structure

```text
src/app/             shell, routing, GameProvider and split state/action Context
src/engine/          pure reducer, typed contracts, content validation and derived facts
src/content/         scenario registry and authored Chapters 1–3
src/lib/             bounded save decoder, replay and storage operations
src/features/gameplay/ email/source investigation, journal, choices, consequences/reflection
src/features/audio/  one native-audio owner, original synthesis, isolated preferences and controls
src/components/ui/   Button, Tabs, native-dialog Drawer, Notice
src/pages/           menu, mission, report guard, instructions/privacy and not-found
src/styles/          semantic tokens, Tailwind import, responsive/reduced-motion styles
public/              local licensed fonts, generated WebP artwork and original favicon
tests/unit/          engine, content, persistence and original shared controls
tests/integration/   rendered evidence/verification/reset/storage workflows
tests/smoke/         browser journeys, keyboard, responsive and multi-tab checks
docs/                approved contracts, milestones, provenance and actual verification
```

Tailwind v4 uses the official PostCSS integration because that plugin was available in the existing npm cache; the Vite-specific plugin was not. This retains Tailwind and Vite. CSS `@theme inline` maps semantic color/font variables; no runtime styling library is added. [Official integration](https://tailwindcss.com/docs/installation/using-postcss)

## Accessibility, visuals and privacy

Indonesian language, semantic controls, skip link, visible focus, scene/route focus management, keyboard tabs/radios, native modal dialog, reduced motion and forced-color styles are included. Keyboard-only C1/C2 journeys, C3 keyboard comparisons, and reflow at 320px are covered in Chrome. Real-device, second-engine and screen-reader testing remain release work; no WCAG conformance claim is made.

The approved pixel desktop and Saku shells use original pixel SVG icons, a locally generated coastal wallpaper and accessible React application content. Inter and Silkscreen are self-hosted with usable fallbacks. Earlier editorial illustrations remain archived and are not rendered by production. No runtime font CDN requests, third-party images, analytics or APIs are needed. See [production assets and validation](docs/dual-os-integration/validation.md) and [asset/font provenance](docs/asset-credits.md).

This version has no credential, OTP, upload or payment inputs. Simulated domains are inert `.example` text. Progress stores only a bounded, versioned accepted-event log under `trusttrail:save:v1`; scores, flags and cursor derive by replay. Invalid saves are preserved until confirmed replacement/reset. Storage failure permits memory-only play; multi-tab conflicts pause writes until reload or confirmed replacement. Use one active tab. Local-only gameplay does not eliminate ordinary hosting request logs once deployed. The game offers no real-world scam-detection guarantee.

## Local repository hygiene

`.gitignore` excludes dependencies, builds, caches, secrets and test artifacts. `.gitattributes` normalizes text files. Session-provided instructions remain binding. Original GDD/blueprint and all original source/test files are retained.

**Git is managed independently by the Product Owner.** The agent must not stage, commit, branch, merge or push, and must not perform Git operations. None were performed for this delivery.

Development proceeds within the approved milestones without repeated vertical-slice approval. Public deployment and competition submission require explicit Product Owner approval.

## Planning and capacity

[Milestones](docs/production-milestones.md) govern current execution: approximately six focused hours/day, internal completion Nov 9, deadline Nov 10 23:59 WITA. The [implementation plan](docs/implementation-plan.md) retains historical capacity estimates; [open decisions](docs/open-questions.md) separates authorized development from remaining source/content/release questions. The [architecture](docs/architecture.md) and [testing strategy](docs/testing-strategy.md) retain approved contracts. ESLint 9's engine-compatible but upstream-EOL status remains a maintenance risk in the runtime audit.
