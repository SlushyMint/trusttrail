# Gameplay state and transitions

**31 October 2026 implementation update:** Chapters 1–2 are playable. The existing reducer now accepts guarded `chapter.continued` and `conversation.advanced` events. Each debrief closes at its chapter checkpoint; explicit continuation preserves shipped C1 saves. `Chapter.conversation` supplies profile and exchange content; Case Files retains prior-chapter evidence and action counts. Save schema/content/rubric versions remain compatible. Chapter 3, recovery, and the final report remain planned. See [Chapter 2 validation and current contracts](chapter-two-validation.md). Earlier planning sections below are retained as historical context.


Status: approved gameplay baseline retained under full production authorization, 29 October 2026. M1 implements briefing → C1 narrative → investigation → decision → verification if needed → outcome → debrief → chapterComplete checkpoint. This is not final-game completion; C2/C3/recovery extend the existing spine at M2. Older per-phase gates are superseded by [milestones](production-milestones.md).

## State layers

1. **Route:** `/`, `/play`, `/report`, `/guide`, or not-found. A route is not a gameplay transition.
2. **Durable game state:** current phase/cursor and accepted domain-event history, from which decisions, clues, flags and progress are derived.
3. **Transient presentation state:** active panel, journal drawer, selected-but-unsubmitted option, expanded text, focus/scroll. These do not score and are not durable.
4. **Persistence status:** loading, ready, memory-only, invalid/incompatible save notice or another-tab conflict. A storage error must not lock gameplay.

## Main graph

```text
menu -> briefing -> narrative C1 -> investigation C1 -> decision D1
  D1 -> [verification resolution if needed] -> consequence -> debrief
     -> narrative C2 -> investigation C2 -> decision D2
  D2 -> [verification resolution if needed] -> consequence -> debrief
     -> narrative C3 -> investigation C3 -> decision D3
  D3 -> [verification resolution if needed] -> consequence -> debrief
     -> recovery intro (incident OR preventive context)
     -> D4-1 -> consequence/debrief -> D4-2 -> consequence/debrief
     -> D4-3 -> consequence/debrief -> completion -> report
```

Journal is an overlay/panel within play. Guide is available at any time and does not modify the durable cursor. Exit to menu preserves progress. No animation, timer, hover event or route transition commits a choice.

## Transition contract

| Current phase | Intent / accepted event | Guard | Result and durable change |
|---|---|---|---|
| No run / menu | START_RUN | User chooses Start; existing save requires explicit replace confirmation | New event history, briefing; remove prior run only after confirmation |
| Briefing | BEGIN_STORY | Safety notice/controls presented; no personal data | Chapter 1 opening line |
| Narrative | ADVANCE_LINE | Expected scene/line matches current cursor | Next line, or authored transition to investigation |
| Investigation / recovery resource panel | INSPECT_EVIDENCE | Evidence belongs to currently available artifact; recovery panels permit only the recovery-resource clue; explicit inspect activation | Unique discovery record; detail explanation/journal unlocked |
| Investigation / verification | Open source panel (transient UI action) | Independently sourced panel available | Show panel; no domain event or Verification credit |
| Investigation / verification | INSPECT_REFERENCE | Player explicitly inspects the authored domain/contact/listing detail, not just its panel; correct source and inspection target | Record meaningful source inspection once; first Verification criterion |
| Investigation / verification | COMPARE_SOURCE | Meaningful reference inspection recorded; claim/reference available; explicit compare action before answer reveal | Record comparison once; second Verification criterion; unlock associated comparison evidence |
| Investigation | OPEN_DECISION | Chapter task has been introduced | Decision shown; no minimum evidence quota |
| Decision | RETURN_TO_INVESTIGATION | No committed selection yet | Reopen workspace; journal remains intact |
| Decision | COMMIT_CHOICE | Current decision, legal option and authored preconditions; not already selected | Freeze choice and its pre-decision evidence snapshot; apply bounded authored effects |
| Choice with verification resolution | Begin resolution (derived from option) | Verification option chosen; comparison not yet performed | Verification phase opens independent-source task |
| Verification | COMPARE_SOURCE | Required meaningful inspection first completed; comparison explicitly activated | Complete resolution; proceed to authored consequence |
| Choice without pending work | Resolution complete (derived) | Option requires no outstanding task | Consequence scene; distinctive narrative variant |
| Consequence | CONTINUE_OUTCOME | Required consequence content presented | Debrief with option-specific explanation/safer action; freeze verification opportunity before its answer is revealed |
| Debrief | CONTINUE_STORY | Last required debrief line reached | Next chapter opening, next recovery checkpoint, or completion |
| After C3 debrief | ENTER_RECOVERY | D1–D3 resolved | Derive incident/preventive context, enter shared sequence |
| Recovery decision | COMMIT_CHOICE | Current checkpoint and legal option, once only | Store first attempt, contextual consequence and debrief; advance only after feedback |
| Final debrief | FINISH_RUN | D1–D3 and all three recovery checkpoints resolved | Completed state; report becomes available |
| Any active/completed run | RESTART / RESET | User confirms replacement/deletion | Clear owned save keys and in-memory history; restart to briefing or reset to menu according to chosen control |

Commands may synthesize accepted events only after guard evaluation. Never accept arbitrary event payloads from DOM/storage as authority. Repeated discovery/compare is a no-op; repeated committed choice, stale double-click, future decision ID, unavailable evidence or wrong line is rejected without new effects/score. Return a predictable result and useful UI status; do not crash or silently advance.

## Branch-and-rejoin behavior

| Node | Authored option class | Outcome / flag proposal | Rejoin |
|---|---|---|---|
| D1 | Follow simulated link | Internal risky preview; `openedSuspiciousLink`; no claim of compromise | Chapter 2 opening |
| D1 | Ignore | No link exposure; missed independent-verification opportunity | Same opening with brief variant |
| D1 | Verify | In-app independent careers source comparison; completed C1 verification record | Chapter 2 |
| D2 | Share fictional documents | `simulatedDataExposure`; text-only fictional sharing | Chapter 3 |
| D2 | Block | Avoid immediate disclosure; claim unresolved unless previously verified | Chapter 3 |
| D2 | Withhold and verify | `protectedData`; source comparison can confirm recruiter discrepancy | Chapter 3 |
| D3 | Share fictional code | `simulatedAccountRisk`; no real code collection | Recovery |
| D3 | Continue without sharing | OTP withheld but portal remains unverified; residual interaction explained | Recovery |
| D3 | Stop and verify | `stoppedPortalFlow`; independent-source task reused | Recovery |

Flags are derived from choices/actual task completions, not independently writable save fields. The GDD's broad `verifiedRecruitment` concept is represented by chapter-specific verification records, not one global boolean that verifies every later recruiter/portal. Required safe-path bridge drafts below explain each later encounter; review final wording against the actual prior choices and complete the mixed/risky counterparts. Do not force safe players into an unexplained risky act to advance.

### Required safe-path bridges — authored draft for content review

These bridge drafts implement the approved continuity requirement; exact character/company naming and final copy remain subject to content review. They add no risky action and set no exposure flag.

| Handoff / guard | Indonesian bridge draft | Continuity invariant |
|---|---|---|
| C1→C2 after Verify or Ignore | Ari: “Undangan itu belum cukup untuk dipercaya. Kalau ada pesan lanjutan, aku periksa dulu lewat kanal resmi.” Narrator: “Pesan baru masuk dari seseorang yang mengaku sebagai perekrut. Ari belum membuka tautan atau mengirim data.” | Receiving a new message is passive; C1 caution remains true. Inspecting the in-game chat does not follow its links |
| C2→C3 after Block or Withhold-and-verify | Ari: “Aku belum mengirim dokumen. Klaim tentang portal ini bisa kuperiksa tanpa masuk atau menyerahkan kode.” Narrator: “Ari meninjau contoh tampilan portal yang disertakan dalam materi investigasi.” | Portal is an inert artifact in the investigation workspace. A blocked recruiter is not silently unblocked; Ari never logs in to reach C3 |
| C3→recovery with no risk flags | Narrator: “Ari belum membagikan data atau kode dalam simulasi ini. Untuk latihan berikutnya, bayangkan seorang teman terlanjur mengikuti permintaan serupa dan meminta bantuan.” Ari: “Langkah apa yang perlu dilakukan sesuai kejadian yang dialaminya?” | Enter preventive hypothetical context; do not invent an incident or claim the player selected Stop if they continued without disclosing a code |

Each bridge also needs a corresponding mixed/risky variant that accurately reflects prior actions; no unconditional line may assert that data was withheld after fictional disclosure. Bridge text is an acceptance dependency for its chapter, not optional polish. Exercise all safe combinations and prove no bridge dispatches an exposure action.

No exponentially growing branches: option-specific consequence, small later dialogue variants, shared next scene. Conditions use a small typed predicate vocabulary. Test every allowed condition combination. Keep a fallback variant for every conditional line; resolve ordered matches deterministically.

## Evidence availability, meaningful interaction and scoring timing

Discovery requires explicit keyboard/touch/pointer activation of a concrete artifact detail: expand sender, inspect destination, open request details, inspect HTTPS claim, or compare sources. Merely mounting a screen, switching a tab, scrolling past text or hovering does not discover evidence. Keyboard focus may name the control but must not announce an unearned explanation.

Journal shows only discovered evidence. It may show a neutral discovered-count indicator, but never a list of hidden clue titles/answers. Each clue has contextual interpretation, including imperfect legitimate-message decoy context. Evidence is a clue, not a binary scam verdict.

Freeze Evidence Awareness credit at its chapter's decision commit. Verification work may occur before commit or during the explicit verification resolution, but freezes before answer/debrief reveal. A clue discovered during resolution can appear as discovered-after-choice in the report without retroactive Evidence Awareness credit. Baseline v1 retains two criteria per source: meaningful inspection earns one point and explicit comparison earns the second. Opening a panel, selecting Verify, reading feedback or opening the public guide earns none. Meaningful inspection requires an explicit detail-level action; full Verification credit requires both inspection and comparison.

Once a chapter closes, prior artifacts are read-only history. New clue credit cannot be farmed in backlog. Full replay starts a new run. Guide/reference use is allowed assistance; these are gameplay scores, not a controlled assessment.

## Shared recovery sequence

All players encounter the same three objective checkpoints (D4-1 containment, D4-2 appropriate official remediation, D4-3 evidence/reporting). Context is derived once at entry:

- **Incident:** any relevant risky flag. Show exactly what was simulated, distinguish possible link exposure from actual fictional document/account exposure, and tailor applicable remediation.
- **Preventive:** no risky flag. A hypothetical friend presents the equivalent situation; explicit dummy incident facts make remediation assessable.

Shared renderer, decision structure, rubric opportunities and feedback fragments; only incident context and appropriate remedy text vary. No duplicate engine or separate denominator. First choices determine the report; corrective explanation is always offered without a game-over. `recovered` is true only if all appropriate incident recovery checkpoints succeed; it is not real-world remediation confirmation. Preventive mode records `recoveryPracticed` rather than pretending an incident happened.

No-op/contacting the unverified recruiter leads to explanatory consequences and the next learning step, not endless retries or a dead end. Credentials are changed only in narrative context and only where exposure warrants it. Preservation/reporting guidance must avoid reposting sensitive information.

## Persistence lifecycle

Canonical save: versioned, bounded **accepted event log** (no duplicate writable score/flags/cursor). On load: read once, size limit, JSON parse into unknown, validate shape/version/IDs and event order, replay through the same guards, then derive state. A semantically impossible history is invalid even if JSON shape is correct. No automatic trust in saved numeric scores.

Keep this game-specific and minimal: one local envelope, a decoder, reducer replay and reset/error handling. No generic event-sourcing system, cloud synchronization or migration framework. Opening a source panel is transient and does not inflate the log or score.

- Same schema/content/rubric version: restore exact dialogue or resolution phase, once only.
- Corrupt or incompatible save: explain that it cannot be continued; offer start/reset. Do not silently overwrite it on initial render. Use reset with notice; migrations and a migration framework are outside this baseline.
- Blocked/full storage: continue in memory with clear notice that refresh may lose progress; allow retry saving. Never require storage permission to play.
- Commit accepted durable actions immediately; avoid relying on unload or a long debounce. Preserve order and idempotence under React development effect replay. Reset clears state and owned keys; successful-reset message only after verifying deletion or disclosing failure.
- Local storage is browser/profile/origin-specific; preview and production origins do not share saves. No cross-device sync promise.
- Another tab changes the save: show a conflict notice and pause that tab's writes until player chooses reload latest or explicitly replace it. No background merge. There is no atomic multi-tab lock guarantee; document the one-active-tab expectation.

See [schema](scenario-data-schema.md) for save limits and [testing](testing-strategy.md) for fixtures.

## Route and completion behavior

| Entry | No valid run | Active run | Completed run |
|---|---|---|---|
| `/` | Start / guide | Continue + restart | View report + replay |
| `/play` | Briefing/new-run affordance | Exact restored state | Completion summary + report/replay; no duplicate finish event |
| `/report` | Explain no completed report; Start | Explain run incomplete; Continue | Derived report |
| `/guide` | Public guide | Public guide; return to exact cursor | Public guide + report link |
| Unknown route | In-app not-found + Home | Same; preserve run | Same |

Loading/restoration settles before Continue or a report is rendered. Back/forward cannot mutate a committed option; backlog is a read-only narrative aid. Unexpected renderer failure offers reload/resume/reset without dumping saved content into raw HTML.

## Invariants / proof obligations

Every reachable nonterminal state has a forward path; all three D1–D3 options resolve and rejoin; recovery always reachable; no option requires all clues; no duplicate awards; no future scene/evidence access; report only on completion; restart has no prior history; identical content/history yields identical scores; source verification requires actual action; every first-attempt choice retains authored feedback. These are release-blocking tests.
