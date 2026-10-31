# Production milestones and current authority

29 October 2026. The Product Owner authorizes full development of the existing React + TypeScript + Vite project. This replaces the earlier per-phase/vertical-slice approval workflow. Historical gates in the original GDD, blueprint and planning records do not require repeated implementation approval. Their product requirements, state machine, independent verification, baseline-v1 scoring and safe narrative continuity remain binding. No Git operations, public deployment or competition submission are authorized.

| Milestone | Target | Implementation scope |
|---|---|---|
| M1 | Oct 29–Nov 1 | Scenario reducer, playable Chapter 1, clue discovery/journal, two-step independent verification, decision/outcome/debrief, bounded persistence and responsive game presentation |
| M2 | Nov 2–4 | Recruiter chat, inert portal, chapters 2–3, coherent bridges and three shared recovery checkpoints |
| M3 | Nov 5–6 | Event-derived four-dimension report, personalized guidance, complete public safety guide, progressive visual/accessibility refinement |
| M4 | Nov 7–9 | Release-critical tests/fixes, deployment preparation, documentation and demo materials; publication/submission require explicit Product Owner approval |

The supplied deadline is **Nov 10, 23:59 WITA** (22:59 WIB); internal completion target **Nov 9**. Solo capacity remains approximately six focused hours/day. Milestone windows are targets, not unlimited same-day work; actual test failures and content progress inform forecasts.

## Reconciliation at production entry

Phase 1 provided routing, semantic tokens, shared controls, local-only pages and a validated Node 26.13.0/npm 11.6.3 toolchain. It had **no gameplay, persisted progress, scenario reducer, source verification, authored decisions or scoring**. M1 implements the actual first chapter. Dependencies retain exact pins. Full-story/recovery/report opportunities are not represented as complete in an M1 build.

M1 retains GDD IDs C1-E01–E04 and D1. Choosing Verify commits D1, then requires explicit detail inspection and comparison before the outcome; choosing it or opening a source alone awards no Verification credit. Awareness freezes at commit, so resolution-time discoveries appear after-choice in the journal. Every D1 option reaches distinct consequence, explanation and the same chapter handoff. No clue quota, timer, account or sensitive input is introduced.

At the available-content boundary the reducer enters `chapterComplete`, an explicit M1 checkpoint, **not final game completion**. No overall score or unassessed recovery score is invented. Adding C2/C3 to the ordered scenario extends the existing debrief transition to the next chapter. Existing save IDs/event semantics must stay stable or the content version must change with an incompatible-save notice.

## Design decisions

**Current production authority:** the Product Owner approved both Lacak OS and Saku representative designs and authorized full integration. That integration is now complete for M1, with 38 unit/integration tests and 40 production browser cases passing. [Validation and screenshots](dual-os-integration/validation.md). No further visual approval gate remains for this integration. M2 Chapters 2–3/recovery remain targeted for 2–4 November; no slip is identified. The following approval-gate notes are historical.


**Adaptive dual-OS update:** the Product Owner approved the pixel desktop direction and requested a distinct original Saku mobile OS around the same engine/content. Both representative screens must be approved before full dual-OS production integration. The [current design review](dual-os-review/design-spec.md) lives at `/dual-os.html`, separate from production. This visual gate does not block authorized core Chapter 2–3 work; the M2 target remains 2–4 November. The following single-screen gate notes are historical and superseded by this joint design gate.

**Current visual authority (29 October):** the Product Owner's final pixel cybersecurity desktop brief supersedes the illustrated visual-novel and earlier dossier/Mail directions below. [Lacak OS style guide](pixel-desktop-style-guide.md) defines the isolated first-screen candidate. Its screenshot requires Product Owner approval before remaining UI migration; this specific visual gate does not revoke authorization for core Chapter 2–3 work. M2 remains targeted for 2–4 November. The bounded review pass uses visual-refinement capacity; no milestone slip is currently identified. Report any forecast change before allocating M2 time to wider migration. Historical design notes below describe the production M1 presentation retained pending this approval.

TasteSkill's app draw selected **framed-sheet**, seed **765297425**, keeping TrustTrail's palette/type. The paper-tinted frame is its face; its signature element is an inert recruitment message whose inspected details become entries in Ari's journal. The investigation asks: “Does this invitation hold up against an independently found source?”

The interface uses a light artifact-navigation frame, white message sheet without shadow, quiet evidence rail and separate comparison surface. No KPI dashboard, decorative card grid, glass, gradient or icon library is added. Tablet/phone fold the journal into tabs/drawer and wrap complete addresses. Product-required 44px controls and editorial paper/slate roles override smaller app-study controls and generic navy/cream bans. New original SVG scene art sets Ari's context; evidence stays DOM text. Inter and Space Grotesk are now licensed, self-hosted and verified loaded, with usable system fallbacks; see [asset provenance](asset-credits.md).

Web Interface Guidelines drive native named controls/radios, explicit commits, confirmation before progress replacement/deletion, visible focus, long-domain wrapping, scene focus, reduced motion and live discovery/save notices. React guidance drives a pure reducer, separate state/action Context, lazy validated loading, derived facts instead of score state, stable actions and event-handler persistence with failure handling. No state-management, animation or UI dependency is added.

Authored Indonesian outcomes remain reviewable product copy. Ari/NovaTech remain working fictional names, without claims of real-world uniqueness. Official competition source documents, final asset/license review, real-device/screen-reader coverage and public hosting configuration remain release items.
