# TrustTrail — Phase 5B remediation report

Date: 3 November 2026, Asia/Jakarta. Scope: targeted F01/F03/F04/F05/F06/F08 remediation following the full [Phase 5A audit](phase-5a-competition-readiness-audit.md) and its evidence. Phase 5A remains a historical record. **No Git operations, deployment, submission, scoring changes, persistence migration, new chapters, or homepage redesign. Stop at Phase 5B for Product Owner review.**

## Findings and changes

| Finding | Phase 5B disposition | Change and reason |
|---|---|---|
| F03 — broken lint gate | Resolved | Replaced ESLint 4.0.0 with 9.39.5, matching existing @eslint/js/flat config; replaced TypeScript-ESLint 8.14.0 with 8.72.1, whose peers include TypeScript 6.0.3 and ESLint 9. Consistent manifest/lock update, clean install and dependency-tree validation. All existing recommended JS/TS/React Hooks rules retained. Added browser/Node globals only for the three Phase 5A `.mjs` browser probes; no ignores or disabled rules added. |
| F04 — unreliable browser gate | Resolved in local Chromium: **106/106 passed** | Helpers wait for the responsive shell to match the media query before selecting desktop/Saku controls, and wait for mail navigation before reading inbox visibility, including the keyboard-only C1 journey. Runner owns a strict-port preview, accepts an explicit installed Chromium executable, and uses one worker to avoid concurrent software-rendering/CDP load. Trace video frames are disabled; DOM snapshots, sources and independent failure screenshots remain. Independent preview/archive selection checks are split into two tests with every original assertion retained and save checks in both; archive setup recreates the preceding Case Files preview state. This increases the suite from 104 to 106 cases across two projects. Return-to-top uses focus + Enter consistently with its keyboard journey. City-resize tests batch related geometry measurements, preserving the same overflow/CTA/canvas/focus assertions with fewer browser round trips. No timeout increases, forced clicks, retries, skipped tests or disabled assertions. |
| F05 — weak personalized practice plan | Resolved locally | Pure `reportRecommendations` derives 2–3 actionable items from actual decision snapshots, missed evidence, incomplete source inspection/comparison and unsafe decisions. Prioritizes code/account risk, identity disclosure, then unverified link use, followed by remaining investigation gaps. Each item explains why; missed checks and verification gaps are named. Fully investigated safe histories receive two maintenance actions grounded in their safe behavior. Existing report section styles retained. |
| F06 — ephemeral recovery errors | Resolved as an explicit practice/reporting limitation | Wrong answers intentionally remain component-local practice feedback; only accepted recovery actions persist. Recovery and report now disclose that wrong attempts/feedback disappear on reload and completion is not first-attempt accuracy. Existing immediate explanations and receipt reasons remain available. No attempt-based personalization is claimed or implemented; no critical event-model issue was demonstrated. |
| F01 — unavailable official rules | Guide gap resolved; briefing-case gap remains | Read all eight pages of the now supplied original PDF. [Requirements matrix](mit-week-requirements.md) traces eligibility, submission, judging, deadline, AI/license and final-stage rules to physical PDF pages. Separate official briefing case is still absent; the guide says it is delivered at briefing. |
| F08 — inconsistent documentation | Resolved for current local evidence | README has one dated verification table and identifies package version 0.1.0 separately from content/rubric/save versions. Removed contradictory current 76/72 and 86/98 claims, labeled older milestones historical, reconciled Node audit lint pins/current dependency count and documented actual browser/runtime prerequisites. |
| F02 — public submission package | Unresolved; owner action | Repository ownership/public access, live site, video and form receipt remain unverified. No release action was authorized or performed. |
| F07 — learning transfer | Unresolved validation gap | Fresh-player teach-back study remains owner work; no new exercise or learning-effect claim. |
| F09 — device/assistive coverage | Partially validated | Automated keyboard/reduced-motion/Chromium emulation pass; physical phone, screen-reader and second-engine journeys remain unverified. |
| F10 — payload/long tasks | Unresolved signal | Build chunk warning remains; representative profiling is deferred, without visual or loading redesign. |

### Browser diagnosis: infrastructure versus application

Phase 5A failure snapshots showed the responsive shell changing while the helper was selecting its controls. C1 additionally sampled inbox visibility before React's route update committed, leaving its reader hidden. These are test synchronization defects: settled-width navigation in the audit worked, and corrected helpers retain all original navigation/state assertions.

The first Phase 5B focused run reused an existing preview which disappeared: **0 passed / 12 failed**, all with connection-refused errors. This is infrastructure evidence, not twelve gameplay defects. Strict preview ownership prevents that accidental reuse and fails clearly if the port is occupied.

The next focused run with two workers: **10 passed / 2 failed** (desktop repeated-homepage collection and mobile rapid selection/return-to-top). Repeating just the four homepage cases with one worker, before changing their assertions: **4 passed / 0 failed**. Desktop rapid selection consumed 29.7 seconds of the unchanged 30-second budget and repeated-navigation collection consumed 20.9 seconds. This supports resource-sensitive harness attribution, not a proven application leak or broken link. One worker is the reproducible default. The keyboard test now avoids racing an End scroll against click auto-scroll; all geometry, focus, save, selection and anchor checks remain.

The first complete post-content diagnostic run was **98 passed / 6 failed** ([log](phase-5b-evidence/browser-full-diagnostic.log), [failure contexts](phase-5b-evidence/diagnostic-contexts/)). Four failures were new report assertions expecting a sender check even though that journey had already inspected the sender; the actual recommendation correctly named the missed time-pressure check. One was the same inbox visibility race in the keyboard-only C1 test. The sixth was the mobile multi-width city test exhausting its 30-second budget during the last focus assertion: its preceding canvas/geometry/overflow checks passed. Trace calls showed cumulative round-trip costs across four widths. Related layout facts are now measured in one call; no assertion or timeout changed. These corrections are followed by focused and complete reruns below.

A subsequent run was stopped for further harness work: **35 passed / 1 failed / 1 interrupted / 67 not run** ([log](phase-5b-evidence/browser-screencast-diagnostic.log)). The long combined selection case exhausted its budget despite completing its assertions. Its trace recorded **327 screencast frames** ([timing/capture summary](phase-5b-evidence/screencast-cost.json)). Removing trace video alone yielded **4/4 focused passes**, but the combined selector case still took 27.4 seconds, leaving weak headroom. It was therefore split by independent UI responsibility rather than increasing its timeout. The city test now polls all related layout facts in one browser call per width, retaining actual focus activation/assertions separately. The final gate covers 106 cases; no old behavior assertion was removed.

The final complete run below is the release gate, rather than a union of separate passing cases. Application behavior changes are limited to report/recovery educational copy and derived recommendations; OS, renderer, navigation and scoring implementations are untouched.

## Validation evidence

Runtime: Node **26.13.0**, installed npm **11.20.0**, clean installation with the declared **npm 11.6.3** runner. Browser: Fedora **Chromium 156.0.8078.73**, desktop 1440×1000 and Pixel 7 emulation, with individual reflow cases at 320/360/390/768/1440 widths. Local production preview only.

| Gate | Exact result | Evidence |
|---|---|---|
| Dependency update | Successful; no force/engine/peer bypass | [install](phase-5b-evidence/install.log) |
| Clean `npm ci` with npm 11.6.3 | Successful, 278 packages installed | [clean install](phase-5b-evidence/clean-install.log) |
| Manifest/lock consistency | All 25 direct exact pins and root package version agree; lint dependency tree valid | [dependency tree](phase-5b-evidence/lint-dependency-tree.log) |
| First repaired engineering gate | TypeScript/lint/build passed; **87 passed / 0 failed**, 8 test files | [tooling regression](phase-5b-evidence/check-tooling.log) |
| Final `npm run check` after clean installation | PASS: TypeScript; ESLint **0 errors / 0 warnings**; **94 tests passed / 0 failed, 9 files**; production build | [final aggregate gate](phase-5b-evidence/check-final.log) |
| Post-correction focused browser regression | **10 passed / 0 failed** | [focused log](phase-5b-evidence/browser-content-focused.log) |
| Trace-capture focused diagnosis | **4 passed / 0 failed**; insufficient timing headroom led to test split | [log](phase-5b-evidence/browser-trace-focused.log) |
| Final harness focused regression | **6 passed / 0 failed**; each case under 15 seconds | [log](phase-5b-evidence/browser-gate-focused.log) |
| Full browser regression | **106 passed / 0 failed / 0 skipped, 0 retries, 6.7 minutes**; 53 desktop + 53 mobile in one complete run | [full-run log](phase-5b-evidence/browser-final.log) |
| Two-worker focused regression | **10 passed / 2 failed**; qualified diagnosis above | [focused log](phase-5b-evidence/browser-focused-2.log) |
| Isolated homepage diagnosis, one worker | **4 passed / 0 failed** | [isolated log](phase-5b-evidence/homepage-isolated.log) |

After the final test-harness corrections, [TypeScript and zero-warning ESLint](phase-5b-evidence/check-test-corrections.log) also passed. [Environment/guide fingerprint and direct-pin consistency](phase-5b-evidence/environment.json) are retained for reproducibility. Desktop and mobile recommendation screenshots in `phase-5b-evidence/focused-results/` were inspected: wrapping and the established report layout are preserved.

Seven new recommendation tests cover unsafe decisions and priority, missed evidence after safe decisions, inspected-but-uncompared sources, late discovery versus decision snapshot, fully investigated safe maintenance, save replay/score immutability, and no decisions. Fixture-development failures were corrected (wrong safe C3 option ID and an overly literal copy expectation); final aggregate results include all seven passing cases.

Existing safe/unsafe C1–C3 browser journeys now also assert report recommendation counts/content, educational reasons and no report overflow. Recovery assertions reload after an incorrect answer, require unchanged event history and empty temporary feedback, then finish four/six exposure-specific actions and the report. Existing branch, refresh/replay, blocked/corrupt/conflicting storage, reset, source verification, keyboard, reduced-motion, desktop window and mobile reflow assertions remain enabled.

Reproduce from the project root, after stopping other preview servers on port 4173:

```sh
npm exec --yes --package=npm@11.6.3 -- npm ci
npm run check
PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium-browser npm run test:smoke
```

The executable setting is environment-specific; installed Chrome is the default, and installed Edge can use `PLAYWRIGHT_CHANNEL=msedge`. The browser command builds no files: run the aggregate gate first. No browser/dependency installation is performed by the smoke command.

## Remaining risks and limits

- Scoring formulas, decision mappings, reducer and v1 persistence implementation are unchanged. Recommendations read facts only; tests verify score/save immutability and deterministic replay. Advice selection/copy is the primary application regression risk; owner should review its Indonesian wording.
- Recovery mistakes remain ephemeral by design. A future request for durable attempts or first-attempt analysis requires separate event/schema design and migration validation; Phase 5B makes no such claim.
- Production entry chunk is **544.56 kB / 169.25 kB gzip**, versus Phase 5A 541.38 / 168.26. The >500 kB build warning remains. No performance improvement or field-device speed claim is made (F10).
- npm audit reports **11 moderate findings**, in the development lint/tool dependency graph; **0 high / 0 critical**. [Raw registry response](phase-5b-evidence/dependency-audit.json) retained. Its suggested ESLint 4.0.0 / TypeScript-ESLint 8.14.0 remediation would restore the known incompatibility and was not applied. ESLint 9.39.5 emits an upstream-support deprecation notice. This is a restored functional gate, not dependency-security clearance; a maintained tooling upgrade is separate owner-reviewed work.
- Successful browser evidence establishes Chromium with emulated desktop/mobile input only. Physical phone, real screen-reader journey and a second-engine run remain unverified (F09). Keyboard and reduced-motion automation do not certify WCAG conformance.
- No new-player teach-back study establishes independent transfer or learning retention (F07). No extra transfer exercise was introduced.

## Submission blockers requiring Product Owner action

1. Provide original official briefing/case and confirm no organizer amendments; the supplied guide verifies broad theme and rubric, but does not contain the specific Trust Trap case.
2. Confirm registration, active-student eligibility, team membership/size, TM attendance, originality, development dates and third-party license/provenance completeness.
3. Manage all version control and provide the **public leader-owned GitHub repository** containing final source, README and technical documentation (guide pp. 3/5).
4. Separately deploy and verify public live access, HTTPS and host deep-link refresh on `/play`, `/guide`, `/report`; test a safe and unsafe journey from a fresh session. Local preview is not public-delivery evidence. Participant-side deployment errors affect Functionality; video/repository fallback is restricted to verifiable provider outage (p. 3).
5. Record/review the team introduction and main-feature demo video, **at most five minutes**, and verify access to its final link (pp. 3/5).
6. Obtain the actual official work-submission Google Form URL, assemble links and submit before **10 November 2026 23:59 WITA = 22:59 WIB = 15:59 UTC**; retain receipt (pp. 4/5). Registration form is not a substitute.
7. Review Phase 5B, arrange fresh-player, physical-mobile and screen-reader checks, and decide whether remaining validation/tool-maintenance risks are acceptable. If selected, prepare the 21 November final: 10-minute demo/presentation plus 10-minute Q&A, at least one representative (pp. 7/8).

## Phase 5C recommendation

**Recommend accepting Phase 5B for Product Owner review and proceeding to Phase 5C release verification only after that review.** Local engineering gates are green: TypeScript, zero-warning ESLint, 94 unit/integration tests, production build, clean installation and one complete 106-case browser run. There are **no remaining test failures in the final suite**. The additional two browser cases come from splitting the original combined preview/archive test, retaining its assertions.

This is not official submission sign-off. The briefing-case evidence and public submission package remain owner blockers (F01/F02); fresh-player, screen-reader/physical-device and performance/tool-maintenance limitations require owner disposition (F07/F09/F10). No Phase 5C work, deployment or submission has begun.
