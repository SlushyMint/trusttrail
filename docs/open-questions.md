# Open decisions, source conflicts and approval record

Updated: 29 October 2026. Full production development through M1–M4 is authorized. The separate phase/vertical-slice approval workflow is superseded by [production milestones](production-milestones.md). Approximately six focused hours/day; no Git operations. Public deployment/submission still require explicit approval. Older per-phase approval requirements below are historical.

## Sources and confirmed facts

- [GDD v1.0](../GDD.md) supplied during Phase 0 and read in full: product direction approved, detailed mechanics proposed.
- [Production Blueprint v1.1](../TrustTrail_Production_Blueprint_v1.1.md) read: pre-production, not approved for coding.
- Master prompt: Phase 0 docs only; no dependencies, global changes, app implementation or deployment resources.
- Subsequent review amendments retain the architecture direction and adopt scoring baseline v1, meaningful verification, authored safe-path continuity, shared recovery, neutral Indonesian feedback and minimal accessible editorial visuals. They explicitly withhold Phase 1 authorization and require separate publication/deployment approval.
- User confirmed **one person, maximum 6 focused hours/day through 9 November**. Prior human focused-hour usage today and public repository ownership remain unknown.
- The original official eight-page MIT-WEEK technical guide and original official case source are **not present**. GDD notes prior receipt by the Product Owner; that does not make those files available to engineering. A public search located a candidate guide shortlink in a third-party directory, but the tool could not open it; official rules remain unverified.
- Phase 1 now includes source/configuration and a local Git repository. The [capability audit](capability-audit.md) is the historical Phase 0 snapshot; current installation/check results belong in the Phase 1 validation record.

Use explicit user steering first; the review supersedes older proposals where listed below. Other unapproved details in GDD/blueprint remain proposals. Source GDD/blueprint are preserved; this approval record and linked planning amendments carry the changes.

## Adopted review decisions (not implementation authorization)

| Decision | Recorded baseline / linked contract |
|---|---|
| Architecture | Retain React + TypeScript + Vite, typed reducer + Context, typed scenario definitions and static hosting; other library/version details remain foundation work |
| Persistence | Minimal game-specific local event log, decoder and reducer replay; no generic event-sourcing framework, cloud synchronization or migration framework |
| Scoring — Q07 closed | Adopt four competencies, fixed 11/6/6/3 denominators, option mappings and equal competency average as baseline v1. Independent golden traces/calculations are in [schema](scenario-data-schema.md); future tests must not generate their oracle with the production scorer |
| Verification | Choosing Verify or opening a source panel earns zero. Explicit domain/contact/listing-detail inspection is one criterion; explicit comparison after it completes the source's two criteria. Full source credit requires both; no mount/focus/scroll credit |
| Safe narrative continuity | Author C1→C2, C2→C3 and C3→recovery bridges preserving careful choices. Indonesian bridge drafts are in [state model](gameplay-state-machine.md); final copy still needs content review |
| Recovery — Q08 structure closed | One shared three-checkpoint sequence for everyone: containment, appropriate official remediation, preserve/report. Incident/preventive framing and context-appropriate guidance; exact options/copy remain content tasks |
| Feedback — Q10 closed | Use neutral descriptive Indonesian statements tied to actual actions; supersede earlier achievement labels and threshold rules |
| Visual direction | Retain 2D Editorial / Illustrated, accessible contrast and minimal reusable assets; exact tokens, names and license-selected files remain detail work |
| Git/publication boundary | Product Owner now manages all Git operations independently; no agent Git operations. Preserve ignore rules. Public remote creation/publication and all deployments remain separately controlled |
| Authority and missing sources | Subsequent explicit authorization permits Phase 1 only; official competition documents remain unverified; publication/deployment still require separate approval |

No new rubric/structure approval is required for Q07/Q08/Q10 unless the adopted baseline changes. Calibration proposals must be recorded as explicit amendments, not silently substituted.

## Decisions to approve before Phase 1 or dependent work

| ID / deadline | Decision / exact missing information | Recommended proposal | Consequence if unresolved |
|---|---|---|---|
| Q01 Closed for production | M1–M4 implementation is explicitly authorized; no repeated vertical-slice approval | Report milestone results and proceed within scope | Public deployment/submission remain separately controlled |
| Q02 Capacity confirmed; forecast pending | Six-hour daily maximum through 9 Nov; how much of today's allowance is already used? | Track actual human hours; 66 future-day hours + today's remaining 0–6; remaining estimate in roadmap | Historical 78–102 hours is not guaranteed; agree presentation/scope reductions if forecast exceeds capacity |
| Q03 Before publication/resource setup | Is `SlushyMint` the team leader/approved repository owner? Who owns Vercel access and final submission? | Leader-owned public GitHub repo, static Vercel; approve concrete repo/project details later | No repo/resource creation or public push inferred from connector identity |
| Q04 Before rules-dependent finalization | Supply original technical guide/case document or official source URL | Verify deadline, eligibility/team size, public repo ownership, AI/assets disclosures and submission method against original | Architecture can remain provisional; official-rule compliance cannot be independently signed off |
| Q05 Within authorized Phase 1 design work | Exact token/font selection and asset licenses/provenance | Editorial direction/minimal reuse/accessibility already retained; verify proposed contrast pairs, self-host licensed fonts or use system fallback | Does not reopen art direction or block local setup; final assets cannot be selected/licensed by assumption |
| Q06 Before Phase 2 content | Confirm Ari, Naya, company naming, chapter titles and exact C1 copy | Preserve drafts as working names, explicit fiction; approve distinct fictional brand before content freeze | Names remain proposals; do not invent proof of uniqueness or real-company affiliation |
| Q09 C1 slice gate, target 2 Nov | Freeze MVP scope and review duration/difficulty after actual play | Three concise chapters, one core decision each + recovery, proposed evidence map; defer export/achievements/extra branches | Do not expand story/content scope without recalculating solo schedule |
| Q11 Before Phase 4 guide release | Approved real-world reporting resources/official destinations and reviewer for Indonesian recovery guidance? | Verify current official sources shortly before release; no invented contacts; situational/non-exhaustive checklist | Guide can use general safe steps, but external contacts cannot be finalized |
| Q12 Before Phase 5 compatibility sign-off | Required minimum browsers/devices, and access to real phone/fresh playtesters? | Modern Chromium plus Firefox/WebKit critical smoke where available; one real phone; keyboard/screen reader; 2–3 fresh players if possible | Publish only verified coverage; do not claim every mobile/browser tested |
| Q13 Before any preview/public deployment | Permission for the specific GitHub/Vercel creation/publication step once locally reviewable? | Early preview after C1, final release 9 Nov 18:00 WITA; no custom domain | Phase 0 has no deployment authority; account details/permissions still unverified |

**Current runtime adaptation is approved for Phase 1 only:** the Product Owner superseded Option A with Node **26.13.0 / npm 11.6.3**, preserving the existing project and all direct pins. Compatibility findings and the proposed declaration-only changes were reported before applying them. `.nvmrc`, bounded Node engines and `packageManager` now match that selection. The official temporary npm runner resolves the session's global npm 11.20.0 mismatch without a global change. Router is installed; typecheck, lint, seven component tests and build have passed. See [compatibility evidence](node-26-compatibility.md) and [current validation](phase-1-validation.md) for clean-install/browser results. Git is exclusively the Product Owner's responsibility. Official rules, final content/assets, real-device coverage, hosting ownership and publication approval remain pending. Full production authorization now permits M1–M4; see the milestone plan.

## Specification conflicts and adopted resolutions

| Conflict | Resolution / authority | Remaining approval |
|---|---|---|
| Blueprint conditional D4 vs recovery for everyone | Review adopts one shared three-checkpoint sequence, incident/preventive framing | Exact context-specific wording/options only |
| Blueprint evidence IDs `C1-E1` vs GDD `C1-E01` | Use GDD padded IDs; no existing save compatibility to preserve | Freeze IDs with content |
| Master prompt S01–S08 vs blueprint S09 guide | Keep S01–S08 and add `/guide` as S09; no extra core route | None beyond proposed UI approval |
| GDD weights/mechanics proposed; review now adopts baseline | Use v1 rubric and shared recovery; names/exact copy remain draft | Q06 and chapter content review |
| Inspection should matter vs no forced clue completion | Evidence changes journal/score/feedback; decisions remain available without all clues | Implement/test adopted rubric, not renewed baseline approval |
| Indiscriminate rejection earns less overall vs blocking can be safe | Adopt full safety credit for blocking/avoiding disclosure where appropriate; Verification requires meaningful source actions | Future changes need explicit rubric revision |
| Recovery checklist is C3-E04 but awareness assesses investigation | Adopt C3-E04 as recovery resource excluded from awareness denominator | No open scoring decision |
| Four clues per chapter vs C3 independent portal verification | Retain official-source reference task without a thirteenth clue; author actual comparison | C3 source content review |
| Repeated clue review vs meaningful score | Adopt unique discovery, pre-decision awareness snapshot and explicit late-discovery attribution | No score farming; golden controls required |
| Panel opening mistaken for source inspection | Transient opening earns zero; explicit authored detail inspection and subsequent comparison are separate | Exact source details/content must be reviewed |
| Prior achievement tiers vs neutral learning feedback | Review supersedes tiers with factual Indonesian behavior descriptions | Final report copy review only |
| Skills propose navy ban/image and motion floors vs TrustTrail palette/short gameplay | Follow product/accessibility/scope, document exceptions; app workflow has no motion floor | Design approval only; no extra permission inferred from heuristic |
| Deadline WITA vs local Asia/Jakarta | Use 10 Nov 23:59 WITA = 22:59 WIB = 15:59 UTC; internal release previous day | Verify original guide |
| Local-only progress vs hosting/network privacy | No gameplay API/analytics; static hosting still receives ordinary request metadata; self-host assets | Confirm actual hosting settings at release |

## Missing authoring work (not a request to invent requirements)

The GDD/blueprint are sufficient for architecture and a content backlog, not complete playable scripts. Before each dependent phase, author and approve:

1. Exact scene/line sequences and transitions through C1–C3; review the newly authored safe bridge drafts and complete mixed/risky counterparts without contradicting prior choices.
2. Full fictional email/chat/portal/official-source text, inert reserved addresses, legitimate imperfect-message decoy and careful explanations; no single cue proves fraud.
3. Every option's immediate outcome, debrief, limitation and continuation; actual independent-source comparison tasks, especially C3.
4. All three recovery checkpoint options/feedback and relevant remedies in incident/preventive mode; link-only framing must avoid claiming compromise.
5. Final neutral Indonesian report descriptions, objective-linked recommendations, local-save/simulation/reset copy and current guide sources. Achievement labels are not part of this baseline.
6. Art bible, minimum final asset list, font/icon licenses and provenance/disclosure wording.

Engineering can propose drafts during approved implementation, but these planning documents do not silently approve new narrative facts. PO/PM content review is a dependency even though the development team is one person.

## Phase 0 status and decision log

**Phase 0 amendments recorded; Phase 1 explicitly authorized and underway.** Daily capacity confirmed; schedule at risk under the cap. Official-rule validation, detailed content/assets and later publication approvals remain pending. Golden scoring fixtures remain planning expectations; no gameplay/scoring implementation is part of Phase 1.

| Date | Event | Authority / status |
|---|---|---|
| 29 Oct 2026 | User confirmed separate rules/GDD not initially available, then added `GDD.md` | GDD found/read; missing-GDD concern resolved |
| 29 Oct 2026 | User confirmed team is one person | Solo roadmap adopted; daily hours still unknown |
| 29 Oct 2026 | Phase 0 recommendations written | Proposals only; no Phase 1 authorization |
| 29 Oct 2026 | User supplied PM review amendments 1–10 | Architecture conditionally approved; rubric v1/shared recovery/neutral feedback adopted; planning edits authorized; Phase 1 and publication/deployment explicitly not authorized |
| 29 Oct 2026 | Product Owner confirmed <=6 focused hours/day through 9 Nov and authorized Phase 1 only | Foundation/source/dependency/local-Git work authorized; no Chapter 1 gameplay, public remote or deployment; Phase 2 requires review and approval |
| 29 Oct 2026 | Product Owner approved Option A dependency remediation | Retain React 19.3.1/Router 8.5.1; target Node 22.23.4 or compatible supported 22.x security release; explicit Vite 8.3.5; bounded engines/npm declaration; official-registry install, real lockfile and full validation. All Git operations reserved to Product Owner; no Phase 2 or deployment |

| 29 Oct 2026 | Product Owner superseded Node 22 Option A with Node 26.13.0/npm 11.6.3 | Audit all direct tools first and report proposed changes before edits; retain existing React/TypeScript/Vite project, app behavior, source and tests; use strict engine checks and minimum dependency changes; install/validate within Phase 1; no Git operations or Phase 2 |

| 29 Oct 2026 | Product Owner authorized full production with mandatory design standards | Implement M1 immediately and proceed through M1–M4 without per-file or vertical-slice approval; preserve the existing architecture, rubric and safe state machine; apply all three UI/UX skills; no Git, public deployment or submission |

Record subsequent approvals/amendments here with exact scope; the review changes the status of named baseline decisions only and does not retroactively authorize implementation or publication.
