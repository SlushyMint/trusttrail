# TrustTrail Phase 6: final SFX-only audio and security

6 November 2026, Asia/Jakarta. Candidate package 0.1.0. Status: **locally validated; awaiting Product Owner review**. No Git operations, deployment, new dependencies, gameplay/scoring changes, or gameplay-save migration.

This report supersedes the [original Phase 6 implementation report](phase-6-original-audio-security-report.md). The Product Owner requested removal of background audio. The final implementation has only seven short sound effects, master mute and SFX volume. The original `phase-6-evidence/` artifacts remain historical measurements; current evidence is in `phase-6-sfx-evidence/`.

## Scope and preparation

Reviewed the existing audio service, preferences, controls, provider, action mapping, browser/unit/integration tests, Guide, credits, README, architecture, Vercel policies and security fixtures. Applied the existing during-implementation antislop preference, existing-brand frontend component workflow, browser testing and frontend security guidance. No applicable AGENTS.md was found. New UI remains within the established Lacak/Saku controls; homepage layout and navigation are unchanged.

Fresh pre-cleanup `npm run check`: TypeScript, zero-warning ESLint, **132 unit/integration tests** and production build passed. [Baseline log](phase-6-sfx-evidence/baseline-check.log). The preceding complete **150-case** browser run belongs to the earlier candidate; it is not counted as this cleanup's regression result.

The former dedicated synthesis module, lazy import, continuous oscillator graph, playback consent/resume state, music settings/actions, credits and active documentation references were removed. Music-specific tests and measurement logic were replaced by SFX-only coverage. No audio file, player or streaming dependency remains.

## Audio design and preserved trigger inventory

Digital noir remains the tonal direction: quiet sine motifs, soft attacks, open fifths/suspended tones and short decays. No alarm bed or choice-verdict sound was added. All critical feedback remains available as visible text, evidence receipts, progress and consequence explanations.

[score.ts](../src/features/audio/score.ts) is byte-identical to the preceding candidate. [GameProvider](../src/app/GameProvider.tsx) and [OperatingSystem](../src/features/os/OperatingSystem.tsx) are also unchanged.

| SFX | Actual trigger | Approximate duration |
|---|---|---|
| OS startup | Explicit new run / accepted `run.started` | 0.54s |
| Application | Explicit opening/switching to another or hidden application; compare-window action | 0.12s |
| Incoming message | Accepted C2 transition into investigation or accepted conversation advancement | 0.34s |
| Evidence discovery | Newly accepted `evidence.inspected` | 0.29s |
| Verification | Accepted detail inspection, claim match or source comparison | 0.43s |
| Chapter complete | Accepted C1/C2 debrief continuation to its checkpoint | 0.77s |
| Final investigation complete | Accepted C3 final debrief continuation after recovery | 1.27s |

Rejected/duplicate domain actions do not call the audio service. Restoration, refresh, component mounting/re-render and Trust Report navigation cannot trigger discovery/completion sounds. A source comparison receives one verification cue even when it also records evidence. The retained 90ms burst gate, domain-feedback precedence and 12-voice cap bound overlapping effects. Stale activation responses are discarded after visibility/mute/preference changes or a delay exceeding 500ms.

## Ownership, controls and lifecycle

One root [AudioProvider](../src/features/audio/AudioProvider.tsx) owns one [AudioService](../src/features/audio/AudioService.ts). AudioContext allocation remains lazy, inside an explicit action. There is no soundtrack module, lazy audio import, long-running graph, Audio element, audio scheduler or audio framework.

The existing sound glyph provides direct master mute in desktop/Saku/homepage chrome. **Suara** opens the established native Drawer with only:

- **Bisukan semua suara**, a labeled native checkbox matching the direct mute button's pressed state.
- **Volume efek suara (SFX)**, a labeled native range with the current percentage, keyboard arrows, visible focus and 5% steps.

Defaults are unmuted SFX at **35%** volume. Opening controls or editing/restoring preferences does not allocate audio or play a sample. After an autoplay rejection, **Coba audio** is an explicit, bounded application-cue retry that cannot change gameplay. Unsupported APIs and blocked storage retain silent operation and readable status. The audio dialog retains Escape/close, focus restoration and isolation from the tutorial's Escape handler.

Each SFX voice schedules its own short stop; its oscillator/envelope disconnect on completion. The final voice suspends the context. Mute, zero volume, document hiding and pagehide stop/disconnect voices, silence the master and suspend the context. Returning to visibility, unmuting and changing volume **do not resume it automatically**. Only a new explicit SFX action resumes the existing context; discarded sounds never replay. Provider cleanup removes listeners, disconnects owned nodes and closes the context.

The retained promise-order guard handles a resume queued around a suspension. Playback rejection is caught; no timer retries, autoplay bypass or hidden-tab cue queue exists.

## SFX-only preferences and legacy compatibility

[preferences.ts](../src/features/audio/preferences.ts) now writes exactly:

```json
{"version":2,"muted":false,"volume":0.35}
```

The current key is **`trusttrail:audio:v2`**. If absent, the decoder reads `trusttrail:audio:v1` without rewriting/removing it on mount. A legacy record maps to `muted = old.muted || !old.sfx` and retains its valid volume. This preserves users who disabled SFX separately, as well as users who used master mute. The obsolete `music` field is ignored regardless of its value and never appears in newly stored output. It cannot initialize playback.

A first explicit setting edit writes the canonical v2 record; subsequent loads prefer v2 over the legacy value. Legacy storage is retained untouched. The decoder limits input to 512 characters, rejects unsupported versions, unrecognized fields, malformed JSON and invalid required values, and accepts only finite volume in [0,1]. Current v2 records may also safely ignore the obsolete field. Invalid records fall back to bounded defaults. Storage failure keeps the preference usable in memory.

These are optional **audio** preferences. `trusttrail:save:v1`, accepted events, revisions, content/rubric contracts, scoring and the existing onboarding key are unchanged. Migration never reads/writes a gameplay save. Byte-equality tests cover controls, navigation, refresh, discovery/restoration and accepted-event behavior.

## Audio provenance and credits

All seven effects are original, AI-assisted numeric note/envelope definitions authored for TrustTrail and generated locally by native Web Audio. No samples, recordings, third-party compositions, external audio generator output or runtime service is used. There is no remaining background composition or audio asset to license.

These project-original effects have no third-party attribution obligation and follow the project's distribution terms. The Product Owner retains the final repository-license/publication decision. [Asset credits](asset-credits.md) now list only the seven effects. Historical audio assets/claims are not presented as part of the final candidate.

## Security threat model and preserved hardening

TrustTrail remains a static, local-first educational game. The realistic boundaries are untrusted URLs/localStorage, safe React rendering, inert phishing artifacts, dependency/build integrity, public assets, framing and unexpected network traffic. There is no account, authenticated identity, privileged server endpoint, database, upload, payment or real recruitment destination.

| Surface | Current evidence |
|---|---|
| React/DOM injection | Existing source uses React text, without authored unsafe HTML/eval sinks. Controlled HTML-like source strings render literally; hostile queries/saves cannot execute markup. |
| URL/navigation | App selection remains allowlisted; view/message values use exact recognized alternatives. Script/protocol-relative/prototype-like/redirect inputs cannot become navigation targets. |
| Save tampering | Existing bounded exact-shape decoder replays legal accepted events; malformed/impossible/forged state cannot unlock a report and is not silently overwritten. |
| Educational identity | A local event history is not identity, certification or proof that a real offer is safe. Users can construct a valid local history; no anti-cheat claim is made. |
| Simulated phishing | `.example` addresses remain text or internal actions. No credential/document collection, external phishing requests or unsafe popup behavior. |
| Real links | Fixed authored HTTPS research sources retain `noopener noreferrer` and same-tab navigation. |
| Privacy/resources | Code, fonts, art and effects are local. No telemetry, streaming, CSP collector or third-party audio requests added. |
| Secrets/assets | Source/public/output pattern scan reports rule/path metadata only; no secret values printed. No findings or exposed environment/config/source-map files. Private credential directories and Git metadata are excluded. |

[Protected-file hashes](phase-6-sfx-evidence/protected-files-check.log) confirm unchanged engine/scoring/persistence, all seven cue mappings, provider/OS trigger wiring, main entry, package manifest/lock, research-link safeguards, Vercel configuration, preview middleware and security browser tests.

| Header/policy | Retained behavior |
|---|---|
| Enforced CSP | `base-uri 'none'; object-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'none'` |
| Report-only CSP | Strict self-origin script/resource policy, with required local image/worker blob/data support and inline styles |
| MIME/referrer | `X-Content-Type-Options: nosniff`; `Referrer-Policy: no-referrer` |
| Capabilities | Camera, microphone, geolocation, payment, USB and browsing topics disabled |
| Framing | `X-Frame-Options: DENY`, paired with CSP frame-ancestors; local iframe fixture blocked |

The stricter script policy intentionally remains **report-only**: the unchanged Pixi shader code generates expected eval reports. This is a known compatibility constraint, not a newly introduced injection finding or enforced script-XSS guarantee. The compatible enforced policies remain active. Production preview mirrors those headers and the Vercel missing-static-file exclusion; actual public Vercel/CDN behavior still requires owner inspection. No header allowance was broadened for SFX.

## Dependency assessment and security checks

Fresh non-destructive `npm audit` and `npm audit --omit=dev` were run after authorized retries for sandbox DNS restrictions. No dependency, lockfile or install command changed; no audit fix or installation was performed.

| Check | Result |
|---|---|
| [All dependency audit](phase-6-sfx-evidence/npm-audit.json) | **7 moderate; 0 high; 0 critical** |
| [Production audit](phase-6-sfx-evidence/npm-audit-production.json) | **0 findings** |
| [Source/release/lock scan](phase-6-sfx-evidence/security-scan.json) | No secret-pattern/config exposure findings, non-registry sources or missing non-bundled integrity metadata |
| Security browser fixtures | All **12 desktop/mobile cases** passed in the focused run; included again in complete regression |

The seven development entries share one underlying advisory, [GHSA-g3hv-75wg-m249 / CVE-2026-118764](https://github.com/advisories/GHSA-g3hv-75wg-m249): minimatch 10.2.6 through TypeScript-ESLint can amplify attacker-supplied glob patterns with high optimization. It is not shipped/executed in the browser and no game input becomes a build glob. Vendor rating is moderate; reviewed public-application exposure remains low/development-only. The suggested TypeScript-ESLint downgrade was not applied. A future maintained compatible tooling update remains owner-reviewed work.

No new critical/high exposure was confirmed. The existing low-risk framing/MIME/referrer/capability hardening and explicit research-link safeguards remain in place. Dependency/secret scans are bounded evidence, not proof against unknown vulnerabilities or every possible secret format. Private repository-publication review remains with the owner.

## Verification and measured scope

| Gate | SFX-only result |
|---|---|
| TypeScript | PASS |
| ESLint, zero warnings | PASS |
| Unit/integration | **137 passed**, 14 files; [engineering log](phase-6-sfx-evidence/check-final.log) |
| Production build | PASS; existing >500kB entry advisory retained |
| Focused desktop/mobile SFX + security | **28 passed / 0 failed**, 25.7s; [focused log](phase-6-sfx-evidence/focused-browser.log) |
| Keyboard synchronization confirmation | **20 passed / 0 failed**, ten runs per viewport, 41.0s; [log](phase-6-sfx-evidence/onboarding-keyboard-confirmation.log) |
| Complete Playwright regression | **152 passed / 0 failed / 0 skipped / 0 retries**, 76 desktop + 76 mobile, 6.7 minutes; [final log](phase-6-sfx-evidence/browser-final.log) |
| Protected-file checks | PASS; [hash verification](phase-6-sfx-evidence/protected-files-check.log) |

The dedicated browser file is now [audio-sfx.spec.ts](../tests/smoke/audio-sfx.spec.ts). It replaces obsolete playback tests with actual SFX context reuse/idle suspension, one-checkbox controls, keyboard mute/volume, canonical preference persistence, legacy disabled-SFX conversion, rejection/retry without game mutation, hidden-tab drop/no replay, unsupported APIs/storage, five-width focus/Escape and absence of the retired bundle chunk/audio-file requests.

Unit/integration retains all semantic cue mapping and full C1-C3 completion checks, duplicate accepted-event prevention, StrictMode re-render/restore/refresh silence, gameplay-save isolation, node cleanup and silent fallback. New preference cases cover all legacy mute/SFX combinations, ignored obsolete field types, canonical v2 precedence and bounded malformed values. An early test-only flush helper assumed too few microtasks for the existing resume/catch/finally chain; four assertions failed. It now drains the whole pending chain before assertions. The final engineering result includes all cases passing; no gameplay assertions, timeout or reducer behavior was weakened.

The complete browser suite retains original safe/unsafe chapter journeys, four/six-action recovery, Trust Report personalization, tutorial desktop/mobile replay and dismissal, keyboard/reduced motion, saves/conflicts, routing, renderer and window regressions. Historical 132/150 counts are not merged with new results.

The first complete SFX-only run finished **151 passed / 1 failed, 9.2 minutes** ([log](phase-6-sfx-evidence/browser-first.log)). Its sole failure was the pre-existing mobile tutorial keyboard case. The trace shows the next launcher being focused immediately after Browser navigation; the subsequent Enter did not open its menu, and the final snapshot has focus on the Browser heading. The existing OS restores heading focus in a route effect, so that test's immediate next key could race the restoration. The [retained failure evidence](phase-6-sfx-evidence/onboarding-failure/error-context.md) is not counted as a clean pass.

The first partial correction yielded **9 passed / 1 failed** in repeated checks: readiness could still appear before final Case Files navigation committed, racing the completion-focus assertion ([diagnostic](phase-6-sfx-evidence/onboarding-keyboard-first-confirmation.log)). Adding that final route check yielded 20 repeated passes, but a second complete run still finished **151 passed / 1 failed, 6.6 minutes** ([log](phase-6-sfx-evidence/browser-second.log)): the intermediate-heading waits had been mobile-only, leaving the same next-key race on desktop. That failure is not a pass or an SFX failure.

The final test synchronizes **both layouts** after every keyboard app activation: expected URL, active application frame, and restored window/mobile-heading focus. It additionally waits for the documented welcome/ready tutorial heading focus and final Case Files route before completion. Menu selection is scoped to the named menu. **20 repetitions then passed** with those uniform checks. Every original keyboard action, missing-target scenario and assertion remains; additional assertions strengthen synchronization. No application focus/navigation logic, timeout, retry configuration or gameplay code changed. Engineering gates were refreshed and a fresh complete run passed **152/152** after the test-only correction. That single clean run, rather than a union of earlier passes, is the final browser result.

## Performance and visual review

The rebuilt release no longer emits the former dedicated audio chunk. Entry JS decreased **558.56 → 556.83 kB** (Vite gzip estimate **173.65 → 173.19 kB**); CSS decreased **115.87 → 115.81 kB**. The additional **639-byte** lazy synthesis module is removed entirely. No audio files are transferred or decoded.

The current [SFX measurement runner](../scripts/validate-sfx-security.mjs) replaces the obsolete measurement script. [Measured results](phase-6-sfx-evidence/sfx-performance.json) and [runner log](phase-6-sfx-evidence/sfx-qa.log):

| Observation | Actual result |
|---|---|
| Initial homepage | 0 audio contexts |
| Twenty application switches | One context; 0 connected sources after short effects end; state suspended |
| Idle clock | 0 seconds advancement during a 300ms observation |
| 390px / 4x renderer-CPU idle probe | 11.946ms main-thread TaskDuration over 1.5s; heap 8,122,716 → 8,130,412 bytes; no continuous audio sources |
| Save/network/runtime | Raw gameplay save unchanged; no unexpected outbound requests or page errors |
| CSP | Four expected report-only eval observations from unchanged Pixi; zero enforced-policy violations |

The CPU/heap interval is a short renderer-emulation observation, not a native DSP, physical-device, battery, sustained-leak or field Web Vitals measurement. No broad optimization is claimed or required by these results.

UI direction remains the approved pixel OS, with restrained ENERGY 1 / RHYTHM 1 / MOTION 1 for settings. This phase removes controls without changing page composition, typography, palette, icons or navigation. Direct mute, two native fields, visible focus, status, retry and dialog close were exercised. The current [item-by-item delivery gate](phase-6-sfx-evidence/design-delivery-gate.md) passes for the scoped component. [320px](phase-6-sfx-evidence/audio-controls-320.png), [360px](phase-6-sfx-evidence/audio-controls-360.png), [390px](phase-6-sfx-evidence/audio-controls-390.png), [768px](phase-6-sfx-evidence/audio-controls-768.png) and [1440px](phase-6-sfx-evidence/audio-controls-1440.png) captures were inspected. [Probe results](phase-6-sfx-evidence/audio-design-probe.json) show zero horizontal overflow, no sampled low-contrast pairs and 44px-high checkbox/range hit areas across all widths. These checks are not WCAG certification or a screen-reader session.

## Reproduction and release review

```sh
npm run check
PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium-browser npm run test:smoke
node scripts/audit-release-security.mjs
node scripts/validate-sfx-security.mjs
```

The executable is Fedora-specific; installed Chrome/Edge alternatives remain supported by the normal configuration. The optional visual runner requires the installed design skill's `probe.mjs`, or `TRUSTTRAIL_DESIGN_PROBE` pointing to it, and owns/closes its local preview and browser. Run it separately from the regression suite. Node/npm targets and exact dependencies remain unchanged.

**Recommend accepting the SFX-only candidate for Product Owner review.** All requested local engineering, complete browser, SFX control, save-invariant and security checks pass. Public deployment remains conditional on owner acceptance and actual-host inspection of headers, routing, HTTPS, MIME/cache behavior and existing competition/asset-rights prerequisites. Stop here for review; no Git/deployment action is included.

Residual limitations: Chromium/emulated viewports and controlled visibility/rejection fixtures do not establish Safari/Firefox, physical-phone, screen-reader or hardware-interruption behavior. Human listening for comfort and device volume remains appropriate. The existing development advisory, report-only script CSP, large entry chunk and prior public-asset rights review remain documented risks. All investigation feedback remains understandable with SFX muted.
