# Historical Phase 6 implementation report

**Superseded by the Product Owner's SFX-only decision on 6 November 2026.** This file preserves the original implementation and its actual test results. Its former soundtrack and controls are no longer part of the app. Current behavior, migration, security posture and verification are in [the final SFX-only Phase 6 report](phase-6-audio-security-report.md). The associated `phase-6-evidence/` files are historical measurements, not validation of the simplified candidate.

Work/verification: 5-6 November 2026, Asia/Jakarta. Candidate: package 0.1.0, unchanged gameplay/content/rubric/save contracts. Status: **locally validated; awaiting Product Owner review**. No Git operations, deployment, submission, account creation, dependency changes, backend, or database.

## 1. Scope, preparation and fresh baseline

Reviewed the Phase 5A audit, Phase 5B remediation, Phase 5C release preparation, Phase 5D tutorial report, architecture, gameplay state machine, scenario/save contracts, current reducer/provider, OS navigation, textual notifications, asset credits, release configuration, and existing tests. No applicable AGENTS.md was found in the project/parent instruction locations. Private credential directories and Git metadata were not read. The owner prohibition on Git operations was retained.

Applied installed antislop (owner selected **during implementation**), design-taste-frontend's existing-brand component workflow and browser probe, Playwright, React/general frontend security guidance, and Web Interface Guidelines. This is scoped OS-control work within the approved pixel design. No homepage composition, chapter, scoring, Pixi scene, or animation refactor was undertaken. The homepage header gains the same sound controls so returning there never hides mute while music plays.

No existing AudioContext, music player, SFX service, or audio assets existed. Notifications were text-only, using accepted game history for evidence receipts. The new service reuses those semantic actions without deriving sound from notification renders.

| Pre-change gate | Fresh result | Evidence |
|---|---|---|
| TypeScript, zero-warning ESLint, production build | PASS | [baseline-check.log](phase-6-evidence/baseline-check.log) |
| Unit/integration | **107 passed**, 11 files | Same log |
| Full browser baseline | **124 passed**, desktop + Pixel 7 emulation, 9.5 minutes | [baseline-browser.log](phase-6-evidence/baseline-browser.log) |

The browser baseline used the unchanged pre-phase production build. New unwired audio modules/tests were prepared while that run completed; application wiring, header changes and rebuilding followed its completion. Sandbox socket restrictions initially prevented preview startup; browser checks subsequently used authorized local execution. Node 26.13.0, npm 11.20.0, Fedora Chromium 156.0.8078.73 (`/usr/bin/chromium-browser`). No new installation was needed.

## 2. Audio design specification and SFX inventory

**Digital Noir Investigation:** short sine motifs with related open fifths/suspended tones, soft attacks and decaying envelopes. Startup establishes the tonal vocabulary; evidence and verification use related register/intervals. Completion broadens that vocabulary without a loud victory fanfare. There are no alarms, voices, prominent percussion, or option-selection verdict sounds. The same authored text, evidence counts, notifications and consequence feedback remain available with every audio setting disabled.

Source: [score.ts](../src/features/audio/score.ts#L1). Frequency/delay/duration tuples are original composition data; synthesis lives in [AudioService.ts](../src/features/audio/AudioService.ts#L8).

| Sound | Actual trigger | Approximate duration | Duplicate/restoration guard |
|---|---|---|---|
| OS startup | Explicit new run (`startNew` / accepted `run.started`) | 0.54s | No mount, Continue, refresh or save-load trigger |
| Open/switch application | Explicit `openApp` to another/hidden app; compare-window control | 0.12s | Selecting the same visible app is silent; short burst suppression |
| Incoming message | Accepted C2 narrative transition into investigation; accepted conversation advancement reveals Mira's next reply | 0.34s | Restored chat/history stays silent |
| Evidence discovered | Accepted `evidence.inspected` | 0.29s | Reducer rejects already recorded evidence before audio is called |
| Verification step completed | Accepted source-detail inspection, claim match, or source comparison | 0.43s | Rejected/repeated actions stay silent; source comparison uses one cue even when it also records evidence |
| Chapter completed | Accepted C1/C2 `debrief.continued` to chapter checkpoint | 0.77s | Restoration/reopening the checkpoint cannot trigger it |
| Final investigation completed | Accepted C3 `debrief.continued` after recovery to final checkpoint | 1.27s | Plays once at completion; navigating to/refreshing Trust Report is silent |

Audio dispatch follows the synchronous accepted-action cursor in [GameProvider.ts, line 61](../src/app/GameProvider.tsx#L61). The pure reducer, score calculations and v1 persistence decoder/encoder are unchanged. No audio callback can dispatch a gameplay action. Restoration uses its existing separate path. A 90ms per-motif gate and a 12-voice SFX cap bound bursts. Domain feedback takes precedence over a comparison's immediate app-focus sound. Stale feedback is discarded after mute/hide/preference changes or a delayed activation exceeding 500ms; it is never queued for later replay.

## 3. Optional soundtrack and provenance

**Night Signal** is an original, AI-assisted procedural composition authored for this phase. Four sine voices (D3, A3, C4, E4) carry 16/32-second amplitude breaths. The continuous synthesis graph repeats its slow modulation without restarting a file or crossing a buffer seam. It has no vocals, percussion, downloaded samples, borrowed melody, external audio model output, decoder or third-party streaming dependency.

[ambience.ts](../src/features/audio/ambience.ts#L1) is a lazy local module, **639 bytes** in the release output (365 bytes with Node gzip). Music is **OFF by default**, master volume defaults to **35%**, and the composition has a separate conservative internal level. A two-second entrance avoids an abrupt pad onset. Disabling music stops/disconnects its sources; re-enabling creates a fresh softly introduced composition. App switching leaves the existing composition running.

Origin/license: original project code/composition, no third-party audio license or attribution requirement. The repository's final distribution license remains the Product Owner's decision; this phase does not invent or change it. In-app credit identifies Night Signal as an original procedural TrustTrail composition. [Asset credits](asset-credits.md) record all seven SFX and the soundtrack. No external soundtrack clearance is claimed or needed for these original sounds.

## 4. Controls, accessibility and ownership

One [AudioProvider](../src/features/audio/AudioProvider.tsx#L1) owns one service across route, application and responsive-shell changes. Its constructor reads optional preferences but creates no AudioContext. Browser audio is allocated only during explicit audio/game/UI actions. There is no per-component player, Audio element, background scheduler, requestAnimationFrame audio loop, or framework addition.

[AudioControls](../src/features/audio/AudioControls.tsx#L1) provides:

- Direct system-bar mute with a stable accessible name and `aria-pressed`, available on desktop, Saku and the homepage.
- One-step access to the existing native Drawer, containing independent Music and SFX checkboxes, master mute, and a labeled keyboard-operable range input with visible percentage.
- A named polite audio status, explicit retry after autoplay rejection, unsupported-API fallback, and a memory-only preference notice after storage-write failure.
- Existing native modal focus containment, Escape/close and trigger-focus restoration. Escape inside audio settings does not skip the investigation tutorial behind it.

Settings are stored separately as `{version:1,music,sfx,muted,volume}` under `trusttrail:audio:v1`. Decoding accepts only the five expected fields, bounded booleans and finite volume in [0,1], with a 512-character input limit. Invalid/future/oversized values revert to defaults. Read/write failures remain usable in memory. `trusttrail:save:v1` and the onboarding key retain their contracts. Guide privacy copy now accurately describes the separate preferences.

Restoring Music On preserves the preference but **never autoplays after refresh**: the player explicitly presses **Putar musik**. Mute/volume edits cannot silently arm a restored music preference. Within an already authorized session, visibility/pagehide pauses the context and silences the master; returning resumes music only if it is still requested, armed, unmuted and nonzero. SFX from hidden tabs are dropped. Browser resume rejection is caught and exposes a retry; no timer retries or autoplay bypasses exist. Pausing retains phase, so returning to an active session does not create another soundtrack.

Music sources and short SFX nodes are disconnected when released; the last SFX suspends an otherwise idle context. Provider cleanup removes listeners, stops/disconnects sources and closes the owned context. A test caught SFX changes racing an in-flight music resume; activation now queues resume after the later suspension and prevents an older promise from clearing the current one. It remains one context, with one composition.

## 5. Threat model and trust boundaries

Assets at risk: playable availability, faithful local progress, privacy, safe educational navigation, build integrity and a truthful report. Attackers may send hostile URLs, frame the public page, alter their own localStorage, influence a dependency, or introduce malicious source/asset changes. Scope is a static public game, with no authentication, identity assertion, server session, database, upload, payment, email delivery or privileged API.

| Surface | Evidence and result |
|---|---|
| Client injection / React | Authored TS content uses React text; no authored `dangerouslySetInnerHTML`, HTML parser sink, eval, dynamic script insertion or HTML-bearing query renderer found. Controlled markup fixtures remain literal text. Pixi's dependency-internal shader generation is separately assessed below. |
| Query/navigation | OS app is selected through the fixed application list; view/message use exact recognized values. Markup, `javascript:`, protocol-relative URLs, prototype-like strings and redirect parameters cannot become navigation targets or HTML. |
| Save/preferences | Existing save decoder bounds UTF-8 size/events, requires exact envelope/event fields and replays every action through guards. Malformed, forged-derived-state and impossible histories preserve the old raw data and show a notice. Audio/tutorial preferences have separate bounded decoders. |
| Simulated phishing | `.example` addresses remain inert display text or internal buttons. No real destination opens and no credential/document entry is requested. |
| Real external links | Only three authored HTTPS research sources; one selected source renders at a time. Same-tab navigation is retained and explicit `noopener noreferrer` is added. There is no runtime user-controlled external URL. |
| Third-party transmission | Fonts, art, application code and optional synthesis module are local. Observed play/audio/QA journeys generated no unexpected outbound requests. No analytics, remote CSP collector, cloud save or streaming service added. A deliberate source-link click leaves the site, as before. |
| Identity/report trust | Progress remains editable local educational data, never authenticated identity, certification, a real-offer verdict or trustworthy security proof. A fabricated completed-state object cannot bypass the report guard. A user can still construct a *valid* event history; anti-cheat/authentication is neither claimed nor appropriate here. |
| Public assets/configuration | Source/public/dist and selected release files scanned without reading credentials or Git metadata. No source maps, environment/config secrets or private-key/token patterns found in the emitted output. All files intentionally placed in `public` remain public. |

## 6. Dependency and supply-chain assessment

Read-only `npm audit`, `npm audit --omit=dev`, `npm ls --all --json`, manifest/lock and package/source review completed. Initial sandbox registry DNS failures were retried with authorized network access. No `npm audit fix`, force flag, installation or pin/lock change was performed.

| Audit | Actual result |
|---|---|
| [All dependency audit](phase-6-evidence/npm-audit.json) | **7 moderate, 0 high, 0 critical** |
| [Production-only audit](phase-6-evidence/npm-audit-production.json) | **0 findings** |
| [Inventory](phase-6-evidence/dependency-inventory.json) | Existing five direct production libraries and twenty direct development libraries; exact pins retained |
| [Release scan / lock checks](phase-6-evidence/security-scan-final.json) | No secret-pattern/config exposure findings or non-registry package sources; all non-bundled registry packages have integrity metadata |

The seven moderate package entries share **one underlying advisory**, [GHSA-g3hv-75wg-m249 / CVE-2026-118764](https://github.com/advisories/GHSA-g3hv-75wg-m249): glob-part amplification in minimatch versions >=7.0.0 and <11.0.1, involving attacker-supplied patterns and optimizationLevel >=2. Installed affected minimatch **10.2.6** is reached through `typescript-eslint → typescript-estree`; the other entries propagate that dependency. ESLint's separate minimatch 3.1.5 is outside this advisory's range.

**Exposure assessment: development-only, low residual risk for this static release.** No minimatch or lint tool executes in the browser bundle, and gameplay input cannot become a build glob. Adversarial source/CI changes still require normal owner review. The suggested automatic remediation would downgrade TypeScript-ESLint to 8.36.0; that is not a justified compatibility/security fix for this TypeScript 6 project. A maintained compatible tooling update is future owner-reviewed work. A clean production audit is not a guarantee against undisclosed vulnerabilities.

Lock inspection found six optional `inBundle` entries under Tailwind's WASI package without individual integrity fields; they are covered by the parent tarball integrity, rather than independently downloaded unverified packages. The only manifest `hasInstallScript` entry is optional macOS-only fsevents. No arbitrary Git/HTTP dependency source, new install hook or audio library was introduced. No fresh `npm ci` was needed; Phase 5C's historical clean install is not presented as newly repeated evidence.

The [scan script](../scripts/audit-release-security.mjs#L1) reports file paths/rule names only, never matched values. It checks private-key, AWS/GitHub/OpenAI/Google/Slack credential patterns and long literal credential assignments. Its output explicitly states that a pattern scan cannot establish absence of every possible secret. Owner review of files selected for repository publication remains required; Git was intentionally not inspected.

## 7. Findings, ratings and confirmed changes

**No confirmed critical or high-impact vulnerability was reproduced in the reviewed application.** The following are actual gaps/constraints, with exposure distinguished from dependency severity or theoretical possibilities.

| ID | Rating / exposure | Finding and disposition |
|---|---|---|
| SEC-01 | Vendor moderate; development-only / low application exposure | minimatch amplification advisory above. Retained pins after exploitability/compatibility assessment; no public runtime path found. |
| SEC-02 | Low, defense-in-depth gap | Existing Vercel config lacked framing, MIME, referrer and capability policies. Added/tested compatible enforced headers. Local iframe fixture is blocked with `ERR_BLOCKED_BY_RESPONSE`. No credential-theft exploit is claimed. [vercel.json:7](../vercel.json#L7) |
| SEC-03 | Low, privacy hardening | Research links relied on browser/default navigation policy. Added explicit `noopener noreferrer`, alongside site `no-referrer`, without creating new windows. [ThreatIntelligence.tsx:60](../src/pages/ThreatIntelligence.tsx#L60) |
| SEC-04 | Informational CSP compatibility constraint | Strict script CSP would block Pixi shader generation. The strong script/resource policy remains **report-only**, with expected `script-src`/`eval` observations. No claim of enforced script-injection protection. |
| QA-01 | Local test fidelity; not a proven public-host vulnerability | Vite preview returned SPA HTML 200 for missing static assets. A preview-only middleware now mirrors the existing Vercel exclusion; missing JS/font/image tests require real 404s. No deployed rewrite behavior is inferred. [vite.config.ts](../vite.config.ts#L1) |

Existing bounded persistence, React escaping, fixed app routing and inert simulated URLs passed hostile-fixture checks, so no speculative rewrite was applied. Confirmed audio correctness fixes include cancellation of stale cues, shared music ownership, independent SFX/music activation during async resume, immediate silence on hidden/mute, and tutorial Escape isolation. These are resilience fixes, not security vulnerabilities.

## 8. HTTP policy and staged CSP

The exact release header values are applied by production preview during every browser regression. The public host still requires owner verification.

| Policy | Prepared behavior and local evidence |
|---|---|
| Enforced CSP | `base-uri 'none'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'none'`. No base/object/frame/form feature is required by the game. Actual framing fixture denied; no enforced violation during normal city/game/audio QA. |
| Report-only CSP | Default/script/font/media/connect limited to self; local image data/blob and workers self/blob permitted; inline styles allowed for React/Motion/Pixi styling. Strict scripts exclude unsafe-eval. Four expected eval reports observed while the actual city continued rendering. |
| X-Content-Type-Options | `nosniff`; returned on tested routes. |
| Referrer-Policy | `no-referrer`; prepared for all responses. |
| Permissions-Policy | Camera, microphone, geolocation, payment, USB and browsing topics disabled. Audio *output* needs none of these capture capabilities. |
| X-Frame-Options | `DENY`, paired with CSP frame-ancestors. |

Report-only is a deliberate stage, not a completed strict CSP rollout. No report endpoint or transmission of page/query information was introduced; violations are observed locally through browser tooling. Do not enforce the report-only script policy unchanged: dependency code generation would break. Eliminating that dependency requirement or accepting a documented eval allowance needs a separate measured decision. This phase deliberately avoids a Pixi refactor or broad `'unsafe-eval'` allowance. Nonces/hashes, Trusted Types, HSTS and cross-origin isolation were not added without an applicable runtime need.

Vercel/CDN matching, final HTTPS, injected hosting scripts, cache behavior, error-page headers and public MIME responses remain deployment checks. Local preview uses the same headers but does not execute Vercel's platform.

## 9. Performance and resource measurements

[Desktop measurement JSON](phase-6-evidence/audio-performance.json), [throttled mobile-emulation JSON](phase-6-evidence/mobile-audio-performance.json), [runner](../scripts/validate-audio-security.mjs#L1), [desktop log](phase-6-evidence/audio-qa.log), [mobile log](phase-6-evidence/mobile-audio-qa.log). Figures below are local laboratory observations, not field Web Vitals or physical-phone performance claims.

| Measurement | Result |
|---|---|
| Entry JS | Baseline 548.15 kB / 170.32 kB gzip estimate; final 558.56 kB / 173.65 kB Vite gzip estimate. About **10.41 kB raw / 3.33 kB gzip estimate** added, including controls/service and accurate guide copy. |
| CSS | 114.25 → 115.87 kB; Vite gzip estimate 22.40 → 22.71 kB. |
| Optional composition | 639-byte local lazy JS module; no audio-file transfer, decode, sample buffer, worker, worklet, framework or per-frame JS scheduler. |
| Initial homepage | **0 audio contexts, 0 soundtrack requests**; optional music is not initialized or fetched. |
| Active composition | One context; four tone + four modulation oscillators. One graph remains after twenty app switches. |
| Music off / repeated toggles | After ten off/on cycles and final Off: **0 connected sources**, one suspended reusable context; provider disposal separately verifies close/disconnection. |
| Suspend | Audio clock advanced **0 seconds** during the measured 300ms suspended interval. |
| Activation observation | About **60.5ms** from explicit control activation to the playing status in the recorded desktop run; includes automation and module initialization. |
| Renderer main-thread work | In separate 1.5-second idle windows: **0.712ms** with music off, **2.712ms** with music on. Native audio DSP is outside this measurement. |
| JS heap after forced GC | **7,099,712 → 7,958,380 bytes** across first music load, twenty app switches and ten music cycles. UI/module warm-up is included; this is not a sustained-leak test. |
| Mobile pressure probe | At 390×844, touch/DPR 2, reduced motion and **4× renderer CPU throttling**: activation ~208.4ms; separate 1.5s silent/music TaskDuration windows 4.492ms/1.358ms; forced-GC heap 3,479,824 → 4,299,780 bytes. Ten music cycles retained one context, ending suspended. These short idle windows are noisy; lower music-window time is not evidence of a speedup. |
| Gameplay isolation | Raw v1 save remained byte-identical across music, mute, volume and navigation measurements. |
| Waveform | 34-second offline render, 44.1 kHz: peak ~0.0400 at default volume, RMS ~0.0110, no clipping. Maximum adjacent-sample delta ~0.00138; at 32s ~0.000711. Continuous synthesis has no reset point at that boundary. |

Activation includes automation/module initialization, not hardware output latency. TaskDuration excludes native DSP/audio-process CPU, and short windows are noisy. Heap includes UI/module caches; one delta cannot prove or disprove a memory leak. The bounded node/context counts and disconnection checks are the relevant lifecycle evidence. The mobile pressure probe is browser emulation, not a physical-phone measurement. No long-session, mobile hardware, battery or whole-process audio CPU benchmark is claimed. The existing >500kB entry advisory remains; no broad optimization was justified by this phase's measurements.

## 10. Tests and regression outcomes

| Gate | Final result |
|---|---|
| TypeScript | PASS |
| ESLint `--max-warnings=0` | PASS |
| Unit/integration | **132 passed**, 14 files; [check-final.log](phase-6-evidence/check-final.log) |
| Production build | PASS; existing chunk-size advisory retained |
| Corrected focused browser cases | **4 passed**, desktop/mobile keyboard and responsive controls; [log](phase-6-evidence/focused-browser-corrections.log) |
| Actual local frame protection | **2 passed**; [log](phase-6-evidence/framing-browser.log) |
| Complete browser regression | **150 passed / 0 failed / 0 skipped / 0 retries**, 75 desktop + 75 mobile, 11.0 minutes; [browser-final.log](phase-6-evidence/browser-final.log) |
| Source/output secret-pattern + lock scan | PASS; [scan](phase-6-evidence/security-scan-final.json) |
| Lifecycle/performance/visual runner | PASS; artifacts linked above |

New unit/integration coverage: defaults and preference bounds, explicit activation, rejected autoplay/retry, independent SFX/music/mute/volume, pending-activation cancellation and suspend ordering, restored music consent, hidden-tab transitions, unsupported APIs/storage failures, bounded duplicate cues, node cleanup, genuine accepted discoveries and completion across C1-C3, silent decision selection, StrictMode re-render/restore/refresh, save isolation, and literal rendering of HTML-like source strings.

New browser coverage: real AudioContext instrumentation, one composition across app switching, duplicate evidence and refresh silence, keyboard mute/volume, preference restoration and explicit restart, controlled autoplay rejection, visibility fixtures and no restart after Off, unsupported audio/blocked storage, five-width focus/layout captures, malformed/forged saves/preferences, suspicious queries, inert simulated addresses, authored external-link attributes, no unexpected requests, headers/routes/missing assets, secret-pattern checks and actual framing rejection.

The full suite retains the original safe/unsafe C1-C3 journeys, four/six-action recovery, Trust Report personalization, save/resume/conflicts, desktop/Saku tutorial, keyboard, reduced motion, homepage, window and renderer lifecycle assertions. No original test was weakened, skipped, retried or given a longer timeout.

Diagnostic outcomes are not counted as clean passes: the first 24-case focused run was **8 passed / 16 failed** due to ambiguous status roles, a save-notice role mismatch and Vite missing-asset fallback. A second run was **20 passed / 4 failed** due to an ambiguous mute label and a focus-visible assertion made without keyboard modality. The selectors were corrected and the full keyboard Tab path is now exercised. Initial collection also required the Node JSON import attribute. An added async music/SFX test produced **131 passed / 1 failed** before the resume-order fix; the final 132-case engineering run includes that fix. The first measurement runner counted only ended events, which may be deferred in a suspended context; it now records the actual disconnection ownership boundary as well. These diagnostics remain in `phase-6-evidence/` and are not release results.

Reproduce with the installed dependencies/browser and no other preview on port 4173:

```sh
npm run check
PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium-browser npm run test:smoke
node scripts/audit-release-security.mjs
node scripts/validate-audio-security.mjs --mobile-only
```

The browser path is Fedora-specific; the normal test configuration also supports installed Chrome/Edge. The optional full visual measurement runner additionally uses the installed design skill's `probe.mjs`; `TRUSTTRAIL_DESIGN_PROBE` can specify its location. It owns/closes its preview and browser. Performance runs should be isolated from the regression suite. Registry audits need network access and return a nonzero exit when advisories are present; preserve the JSON rather than treating that exit as a broken application.

## 11. Visual/accessibility review and delivery gate

Reading this as OS settings for investigation players in the approved Lacak/Saku pixel language: **ENERGY 1 / RHYTHM 1 / MOTION 1** for the added component. The established navy palette, Inter body, Silkscreen heading, square controls and teal focus are retained brand decisions. No new raster art, stock icon library, glow, gradient, dashboard tile system or decorative animation was added. The sound glyph is functional inline SVG. The existing Drawer supplies the system frame.

Inspected real captures at [320](phase-6-evidence/audio-controls-320.png), [360](phase-6-evidence/audio-controls-360.png), [390](phase-6-evidence/audio-controls-390.png), [768](phase-6-evidence/audio-controls-768.png) and [1440](phase-6-evidence/audio-controls-1440.png). [Design probe](phase-6-evidence/audio-design-probe.json): zero horizontal overflow at every width; no sampled low-contrast pairs; new checkbox label hit areas and slider are at least 44px high. Keyboard tests verify the range outline and Escape focus return. Screenshots show readable wrapping at 320px and the established desktop drawer. These sampled checks are not WCAG certification or a screen-reader session. The generic whole-page taste score was not used to redesign the existing game.

Delivery gate applies to the added/edited controls, with inherited gameplay visuals outside this phase's redesign scope:

The [item-by-item gate](phase-6-evidence/design-delivery-gate.md) records each required rule and evidence. Its four-block result is summarized here.

- **PASS, hard gate:** native named buttons/checkboxes/range; keyboard Tab/Space/arrow/Escape paths; visible teal focus; no overflow in five widths; explicit silent/blocked/unsupported/storage-failure states; no invented statistics, testimonials, security certification, dead navigation or media claim. No new decorative motion or em-dash UI copy.
- **PASS, purpose:** existing OS palette/type/frame retained for continuity; teal signals interaction/focus, amber indicates mute; one sound glyph identifies mute. No new gradients/glass/glows/template imagery need justification.
- **PASS, liveliness:** declared restrained dials; the actual game remains the focal point, system controls stay compact, and the repeatable pixel frame/type carry TrustTrail's identity. No new landing layout was introduced.
- **PASS, craftsmanship:** every added control was exercised: Suara opens; close/Escape returns focus; Music/SFX/mute change their independent states; range changes volume by keyboard; Putar musik recovers blocked/restored playback; the direct mute stops output. The full existing journeys remain the behavioral regression gate.

## 12. Remaining risks and deployment recommendation

**Recommend accepting this local candidate for Product Owner review.** All engineering gates and one complete 150-case browser run pass. Public deployment is recommended only after owner acceptance and actual-host verification of the prepared headers/routing, with the existing rights/submission prerequisites resolved. No confirmed critical/high application exposure remains from this review. This is local evidence, not a security certification or a public deployment sign-off.

Residual limitations requiring owner awareness:

1. The development-only minimatch advisory remains. Strict script/resource CSP is report-only because of measured Pixi compatibility; current policies are defense in depth, not proof that future unsafe rendering would be safe.
2. Public Vercel response inspection, HTTPS/cache/error behavior, final submitted URLs, repository publication and official competition submission remain owner tasks. Inspect headers and missing-asset 404s on the actual host; do not copy preview results into a public checklist.
3. Audio/browser QA uses Fedora Chromium and emulated viewports. Safari, Firefox, physical phones, screen readers, headphone/speaker balancing, hardware audio interruption and long-session battery use remain unverified. Visibility behavior uses controlled document-visibility fixtures; physical background-tab/browser-policy behavior still merits owner listening/device review.
4. Audio ownership is per application tab. Existing guidance remains one active game tab; explicitly starting music in two tabs can yield two outputs. There is no cross-tab media arbitration or cross-device preference sync.
5. Existing unused assets copied from `public`, including the city concept reference, retain their prior provenance/publication review requirement. No new unlicensed audio was introduced; this phase does not clear pre-existing reference rights.
6. Original sound composition and measured waveform checks do not replace a human listening review for creative balance, comfort and device-specific volume. Owner should hear startup, a few discoveries, a chapter close and Night Signal during reading, then verify direct mute and refresh consent.

Recommended owner review: the seven motifs, optional ambience, one-step mute, 320px/desktop captures, original-audio credits and staged CSP tradeoff. Apply the existing Phase 5C public-release checklist only after owner authorization. Stop here for Product Owner review; no Git or deployment action is included.

## References

- [MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) and [autoplay guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay): explicit gestures and rejection handling.
- [MDN CSP reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src): dynamic evaluation and script policy restrictions.
- [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json): response header/rewrite configuration.
- [Upstream minimatch advisory](https://github.com/advisories/GHSA-g3hv-75wg-m249): affected range and amplification conditions. Exposure assessment above is specific to TrustTrail's inspected graph, not a vendor claim.
