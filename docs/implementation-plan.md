# Implementation roadmap

Status: the Product Owner has authorized full production, replacing the separate vertical-slice approval process with [M1–M4 milestones](production-milestones.md). The historical phase/hour planning below remains reference material; milestone dates and actual completion evidence govern ongoing execution. Approximately six focused hours/day, internal completion Nov 9, deadline Nov 10 23:59 WITA. No Git operations; public deployment/submission require explicit approval.

## Scope and schedule baseline

Source: [GDD](../GDD.md), [blueprint](../TrustTrail_Production_Blueprint_v1.1.md), master prompt. Preserve three short connected chapters, actual investigation, consequences, recovery for all, behavior-dependent report, guide, local saves, accessibility, public deployment/repository and <=5-minute video. These serve Functionality 35%, Relevance 25% and UI/UX 20%; code/documentation support reliability and judge Q&A.

Deadline supplied: **10 November 2026 23:59 WITA (UTC+8)** = **10 November 22:59 WIB (Asia/Jakarta, UTC+7)** = **15:59 UTC**. Official guide not independently available; confirm deadline and submission mechanism from original when supplied. Internal target: final public release and draft submission package **9 November by 18:00 WITA**; reserve 10 November for fixes/link checks/submission rather than feature development.

### Confirmed capacity and remaining work

Planning date is **29 October 2026**. There are **12 calendar dates** from 29 October through 9 November inclusive, but only **11 full future days** (30 October–9 November). At 6 focused hours/day, capacity is **66 hours plus today's unspent allowance (0–6 hours)**: an absolute ceiling of **72 hours**, not a promise. Earlier human focused time today is not logged, so do not assume today's full six hours remain. Review, debugging, writing, recording and submission preparation consume the same allowance. No additional development capacity on 10 November is confirmed.

The prior **78–102-hour total** included completed Phase 0 planning and a contingency allowance. It is a historical risk estimate, not the remaining workload or a guaranteed schedule. Excluding completed Phase 0, the original Phase 1–6 estimates sum to **63–81 hours**, plus **10–14 hours contingency = 73–95 hours** at Phase 1 entry. That exceeds the 72-hour absolute ceiling by **1–23 hours**, or the conservative 66-hour future-day ceiling by **7–29 hours**. Do not hide the difference by scheduling more than six hours in a day.

Once Phase 1 meets its gate, **Phases 2–6 alone remain 56–72 estimated hours**, plus 10–14 contingency (**66–86 hours**). If Phase 1 is incomplete, add its actual outstanding work; do not subtract its whole 7–9-hour estimate merely because files exist. The Phase 1 completion/validation record will state what ran, elapsed agent time and any unfinished deliverable. Agent wall time is not a substitute for the Product Owner's human focused-hour log.

**Current artifact-based status (Node 26 adaptation):** the Product Owner superseded Option A with Node **26.13.0/npm 11.6.3**. Existing React/TypeScript/Vite architecture and every direct dependency pin are retained. Router is installed; the complete npm-generated lockfile and clean install, aggregate typecheck/lint/unit/build, six browser smoke cases and additional 360/768/1440 responsive/keyboard checks passed. Application source is unchanged; all tests remain, with two browser assertions corrected. The foundation is ready for Product Owner review, with an existing favicon 404, ESLint 9 upstream EOL and Chrome-only/emulated-device coverage disclosed in [current validation](phase-1-validation.md). The earlier 2–4-hour environment-recovery forecast is superseded by completed technical checks; it is not a remaining-work estimate. After foundation review, Phases 2–6 retain the **66–86-hour historical estimate including contingency**, subject to re-estimation from actual throughput/content. This does not imply new capacity or authorize Phase 2. Git is exclusively the Product Owner's responsibility.

Schedule confidence is **at risk**. After Phase 1 review and again at the C1 slice gate, re-estimate from completed artifacts, remaining content and actual throughput. Preserve core mechanics and QA; simplify presentation, reuse art and shorten nonessential dialogue first. Any must-have cut or additional capacity needs explicit Product Owner agreement. Review wait time consumes calendar days even when it is not focused work.

| Phase | Date window (handoffs may share a day) | Focused hours | Primary gate |
|---|---|---:|---|
| 0 Discovery | Completed before Phase 1 authorization | Historical 5–7 estimate; not remaining work | Nine planning docs and review amendments recorded |
| 1 Foundation | Starts 29 Oct; review-dependent completion | Original 7–9; actual results/remaining work recorded separately | Shell/routes/build/typecheck responsive and operable |
| 2 C1 vertical slice | 31 Oct–2 Nov | 15–19 | All D1 outcomes + investigation/persistence tested |
| 3 Complete narrative | 3–5 Nov | 16–20 | C2/C3/recovery complete; no dead ends |
| 4 Report/guide | 5–6 Nov | 7–9 | Behavior-dependent fractions/recommendations + replay |
| 5 QA/polish | 7–8 Nov | 12–16 | Release-critical paths/a11y/security pass |
| 6 Deployment/submission | Engineering target 9 Nov; submission buffer 10 Nov | 6–8 estimate exceeds one day's 6-hour cap; prepare docs/video earlier | Separate publishing approval, public links, smoke evidence, docs and <=5-min video |

These windows are provisional dependency targets, not a capacity-loaded commitment. On each date the sum of all tasks must stay <=6 focused hours; shared date windows do not create extra capacity. Prepare README/video outline before 9 November so Phase 6 does not assume an eight-hour final day. Late review, missing dependencies or unresolved content trigger a new forecast rather than overtime by assumption.

## Phase 0 — Discovery and architecture

- **Objective:** establish a defensible foundation before coding.
- **Tasks:** inspect actual files/capabilities; read GDD/blueprint; separate locked/proposed/unknown decisions; fetch current docs; propose state/content/rubric/UX/security/test architecture, Git strategy, risk register and solo roadmap.
- **Dependencies:** product prompt and readable workspace. Official rules needed for independent rule validation; not required to write provisional architecture.
- **Deliverables:** the nine requested `docs/*.md` files, cross-linked; no source/dependency/deployment changes.
- **Acceptance:** audit distinguishes exposed/working/unavailable; recovery and scoring are concrete/testable; source conflicts and missing narrative copy documented; all phases have acceptance/effort/risks.
- **Tools/skills:** terminal/filesystem, Context7, official web sources, read-only GitHub, installed design/React/security skill instructions.
- **Risks:** official PDF absent; tool exposure mistaken for connectivity; proposed product details mistaken for approval.
- **Effort:** 5–7 hours.
- **Definition of Done:** documentation internally reviewed, files/links verified, status and approval dependencies reported. Stop before Phase 1; only explicit Product Owner approval can start it.

## Phase 1 — Foundation and design system

- **Objective:** one reliable static-app foundation and accessible responsive shell.
- **Tasks:** approved Node 26.13.0/npm 11.6.3 adaptation, exact engine/peer audit, official-registry installation, complete lockfile, clean `npm ci` and local technical checks are complete; review evidence and disclosed limitations. Preserve existing foundation files and ignore rules. Git is solely the Product Owner's responsibility. Use story placeholders only for structure, not fabricated final narrative. Obtain approved minimum asset direction/licensing plan; do not let art block shell.
- **Dependencies:** Phase 1/runtime adaptation authorized; Node 26 runtime and selected temporary npm 11.6.3 runner verified, approved official-registry access succeeded. Product Owner foundation review remains; Phase 2 is not authorized. Exact visual tokens/font licenses remain foundation review details. Preserve `.gitignore`; no agent Git operations, public remote or deployment.
- **Deliverables:** buildable app shell for four routes + not-found; shared UI; local toolchain/lockfile; setup README draft; initial validation scripts and browser-launch proof.
- **Acceptance:** clean install/build/typecheck/lint work; route Back/direct-entry behavior defined; keyboard navigation, drawer/tab focus and reduced-motion basics work at 360/768/1440; no console errors or sensitive-entry controls.
- **Tools/skills:** Context7, Vercel React, Taste appropriate workflow, security guidance; TypeScript/lint/build and Playwright launch smoke.
- **Risks:** dependency/peer mismatch; CUA host unavailable; GH CLI blocked. Use project-local runner/connector fallback, not unapproved global repair. Avoid backend and extra libraries.
- **Effort:** 7–9 hours.
- **Definition of Done:** reviewable shell, real validated lockfile, clean install and all required checks pass on approved runtime; versions/setup documented; navigation usable; no untested reliance on browser tooling. Deliver files/results to the Product Owner for independent Git handling. Stop for Phase 1 review and explicit Phase 2 approval.

## Phase 2 — Chapter 1 vertical slice

- **Objective:** prove the entire game loop with one real chapter before expanding.
- **Tasks:** implement typed content registry/validator and pure reducer; author/review C1 narrative/decoy/outcomes and required safe bridge to C2; email and independent-careers-source renderer; explicit evidence interactions; journal; D1 with 3 options and meaningful source-detail inspection followed by comparison; feedback/branch rejoin; minimal game-specific local save/replay/reset, with no event-sourcing/sync/migration framework; adopted v1 rubric evaluator and independent golden-fixture tests. Integrate minimal reusable illustration. Verify local production build; early preview only with separate deployment approval.
- **Dependencies:** Phase 1 gate; reviewed C1 copy/bridge; adopted baseline-v1 criteria; browser runner available or documented manual fallback. No renewed approval needed for the already adopted rubric unless it changes.
- **Deliverables:** landing -> briefing -> playable C1 -> debrief/next-chapter handoff; all D1 variants; working persistence; unit/integration and C1 browser tests; initial content/rubric version.
- **Acceptance:** choices produce distinct outcomes; no clue auto-discovery/double awards; panel opening/Verify choice alone earns zero Verification credit; meaningful inspection/comparison required; any evidence count can proceed; refresh/resume/reset work; malformed/blocked save graceful; keyboard/touch works; all D1 outcomes rejoin; safe bridge preserves the actual safe choice.
- **Tools/skills:** Vitest, Testing Library, Playwright, Context7, security and React guidance, Taste screenshot critique on production preview.
- **Risks:** engine/UI/content coupled; story loopholes on safe path; surprise save complexity; excessive art work. Keep first slice to four proposed C1 clues and one decision, not a generic game framework.
- **Effort:** 15–19 hours.
- **Definition of Done:** complete chapter tested, documented checks pass, Product Owner can play/review it. Freeze MVP boundaries and adjust remaining estimates before C2/C3 expansion.

## Phase 3 — Complete narrative experience

- **Objective:** three coherent chapters and shared recovery with meaningful consequences.
- **Tasks:** author/approve C2/C3 full copy and bridge variants; add chat/profile and inert portal renderers; reuse source comparison; D2/D3 effects/debriefs; shared D4-1/2/3 recovery sequence with incident/preventive contexts and applicable remedies; reuse engine instead of chapter-specific reducers. Validate the entire content graph, longest path and report inputs.
- **Dependencies:** Phase 2 proven reducer/save/evidence contract; approved source/contact/portal/fee/OTP/recovery content and stable IDs.
- **Deliverables:** full playthrough to completion; three simulation interfaces; all recovery variants; extended tests.
- **Acceptance:** all 9 core option outcomes traversable; all players receive recovery; link opening distinguished from compromise; no actual uploads/login/OTP/payment or external fake destination; safe path has coherent later encounters; every state has a forward path; persistence works during recovery.
- **Tools/skills:** Vitest graph/transition tests, representative Playwright paths, security guidance, React guidance; imagegen only for specifically approved needed assets.
- **Risks:** writing workload, combinatorial branches, rushed Indonesian feedback, conditional recovery inconsistency. Small conditional lines + common spine; one shared sequence and fixed rubric opportunities.
- **Effort:** 16–20 hours.
- **Definition of Done:** complete safe and risky runs, recovery and chapter continuity work; content validator and domain cases pass; no unfinished mandatory copy or placeholder outcomes.

## Phase 4 — Trust Report and safety guide

- **Objective:** make behavior visible and turn it into useful action guidance.
- **Tasks:** implement the adopted baseline-v1 rubric, fractions/rounding and recommendations without reopening agreed weights; report choice/evidence timing, missed clues and limitations with neutral descriptive Indonesian feedback; S09 public guide with situational checklist; verify official external reporting links; replay/reset and incomplete-report states. Use Phase 2 scorer contract and independent golden fixtures; no achievement labels.
- **Dependencies:** complete content/actions from Phase 3, reviewed neutral report copy, current authoritative safety sources/reporting destinations. Any later rubric recalibration requires an explicit revision.
- **Deliverables:** real report, four dimensions, personalized advice, guide, replay; golden fixtures and completion integration.
- **Acceptance:** safest/risky/mixed histories yield independently calculated distinct reports; late clues not attributed to earlier choices; recovery comparable in both modes; legitimate zero scores visible; no real-offer safety/competency-certification claims; guide usable before play.
- **Tools/skills:** Vitest independent fixtures; Playwright report/guide/replay; Context7 if library APIs involved; primary official safety sources; Taste app-screen review; accessibility guidance.
- **Risks:** arbitrary scoring, accidental duplication of credit, guide mistaken for exhaustive recovery. Use objective-level criterion ledger and explicit limits; avoid downloads/sharing scope.
- **Effort:** 7–9 hours.
- **Definition of Done:** report facts match history, recommendation predicates reviewed, guide sources checked, replay clean; no hardcoded placeholder result remains.

## Phase 5 — QA and polish

- **Objective:** release candidate that works on actual devices and explains the case accurately.
- **Tasks:** run planned automated suite; manual keyboard/screen reader/mobile/reflow; fresh-player timing and content review; fix focus/overflow/contrast; measure real asset/network/bundle costs; dependency/security/headers/navigation review; finalize credits; selected screenshot regression baselines. Freeze feature scope.
- **Dependencies:** feature-complete build; available test browser/device; approved final copy and artwork; preview if authorized.
- **Deliverables:** checked release candidate, reproducible test/build output, manual QA record, known-limitations list, optimized local assets.
- **Acceptance:** no blocker in completion, persistence, scoring, core accessibility or simulation safety; no unexpected outbound simulation requests; direct routes functional; reduced-motion parity; 12–18-minute target assessed without artificial wait; actual production-like build inspected.
- **Tools/skills:** Playwright/axe, Vitest, npm audit, browser developer tools; Web Design Guidelines (fresh rules), Security Best Practices, Vercel React, Taste screenshot loop (up to three rounds, documented exceptions).
- **Risks:** late discoveries consume buffer; flaky screenshots; browser package install unavailable. Keep failure artifacts, prioritize functional/accessibility blockers, record residual compatibility gaps honestly.
- **Effort:** 12–16 hours.
- **Definition of Done:** release-critical checks pass with evidence; unresolved risks accepted explicitly; no last-minute feature additions; docs updated to match behavior.

## Phase 6 — Deployment and submission

- **Objective:** public, reproducible, judge-ready submission before internal cutoff.
- **Tasks:** Product Owner handles repository creation/publication and all Git operations independently. With separate hosting authorization connect the approved repository to Vercel; deploy frozen release; SPA rewrites/headers; signed-out public production smoke; README/setup/tests/architecture/scoring/privacy/license notes; <=5-minute demo recording/edit/upload and accessible link; verify official guide/submission requirements and links; record the Product Owner's known-good release reference. Prepare short technical Q&A notes.
- **Dependencies:** Phase 5 release candidate, account access/permissions and leader identity, official submission instructions, recording/export capability.
- **Deliverables:** public repo/live URL, release commit/deployment ID, technical docs/credits, accessible demo video <=5:00, final submission checklist/evidence.
- **Acceptance:** production visitor can complete game and refresh direct routes without login/404; repo readable signed-out and correct owner; documented commands reproduce build; video demonstrates core interaction, consequences/report and limits; all final URLs checked; submission completed by the human or explicitly authorized action.
- **Tools/skills:** Git/GitHub connector, Vercel UI/authorized workflow, browser smoke/Playwright, OBS if verified; document/presentation skills only if those formats are actually requested.
- **Risks:** public repo/hosting access denied, deployment auth wall, SPA routing, video export/link permissions, timezone confusion. Verify access earlier, release by 9 Nov 18:00 WITA, reserve 10 Nov; avoid custom domain/DNS work.
- **Effort:** 6–8 hours.
- **Definition of Done:** live deployment + public repo + docs + compliant accessible video validated together, final release links and commit recorded, submission handoff confirmed. Deployment alone is not submission completion.

## Critical path and dependency gates

```text
Phase 1 dependency recovery + foundation review + separate Phase 2/C1 content approval
 -> toolchain/shell
 -> C1 engine + evidence + deterministic choices + save/replay
 -> C2/C3 + shared recovery
 -> correct personalized report/guide
 -> release QA
 -> public deployment smoke + repository/docs/video + submission
```

External dependencies to resolve early: official npm access or a complete approved cache; Phase 1 validation/review and separate Phase 2 authorization; official guide; today's human focused-hour usage; repo/hosting ownership/access; reviewed content/bridges and asset provenance. Six-hour daily maximum, rubric v1 and shared recovery are adopted, not open choices. Preview deployment requires separate approval. Separate workstreams do not imply parallel headcount.

## Priority and controlled cuts

| Preserve (P0) | Simplify/postpone first (P1/P2) |
|---|---|
| Three concise connected chapters, evidence interaction/journal, meaningful decisions/feedback | Extra dialogue variants, extra evidence beyond agreed minimum, extra endings |
| All-player recovery, four transparent scores, behavior-driven report, guide | Animated score reveals, report export/download/sharing, achievements |
| Local save/restore/reset, direct routes, keyboard/touch/reduced motion | Complex saved-game migrations; prefer clear incompatible-save reset notice |
| Safe fictional links and dummy interactions, no registration | Backend, accounts, analytics, AI scenarios/APIs, leaderboard/community/multiplayer |
| Cohesive readable illustration direction, mobile usability | New custom art per scene, elaborate expressions, parallax, Motion dependency, sound |
| Public repo/deployment/docs/video and release checks | Figma library, custom domain, offline/PWA, multilingual UI |

Do not shorten QA to finish decorative art. At the 2 Nov slice gate, if >1 day behind or a full journey is not possible, shorten later chapter dialogue, reuse illustration composition, remove optional motion and reduce visual variants. Any cut to a GDD must-have needs Product Owner scope approval; record the decision and revise acceptance criteria. If target duration is missed, adjust authored density rather than adding mandatory waits.

## Review cadence and engineering evidence

Daily short status: working increment, unresolved product issue, actual hours spent vs forecast, next gate. Review Phase 2 before expanding. Keep scope/architecture/rubric changes in small dated notes or commits; no undocumented drift from these proposals. Git strategy is in [architecture](architecture.md); test gates in [testing](testing-strategy.md); risk owners/triggers in [risk register](risk-register.md).
