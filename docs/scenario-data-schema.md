# Scenario data and scoring contract

**31 October 2026 implementation update:** Chapters 1–2 are playable. The existing reducer now accepts guarded `chapter.continued` and `conversation.advanced` events. Each debrief closes at its chapter checkpoint; explicit continuation preserves shipped C1 saves. `Chapter.conversation` supplies profile and exchange content; Case Files retains prior-chapter evidence and action counts. Save schema/content/rubric versions remain compatible. Chapter 3, recovery, and the final report remain planned. See [Chapter 2 validation and current contracts](chapter-two-validation.md). Earlier planning sections below are retained as historical context.


Status: adopted baseline v1, now authorized for implementation through production milestones. M1 implements C1-E01–E04/D1, accepted-event replay and the pre-commit awareness/meaningful verification cutoffs. Later chapters, recovery and full four-competency report remain M2/M3 work. Type snippets below are the approved design contract, not a claim all modules exist. Current authority: [production milestones](production-milestones.md).

## Authoring principles

Use bundled TS objects checked with `satisfies Scenario`. Baseline-v1 scoring uses the GDD IDs `C1-E01` through `C3-E04`, D1–D3 and shared recovery checkpoints `D4-1`–`D4-3`. Exact story copy/names remain pending; these identifiers and criterion mappings form the scoring baseline. Do not rename IDs after save compatibility freezes without a content-version change and explicit incompatible-save reset notice; there is no migration framework.

Keep engine semantics, authored content and display copy separate. No HTML strings, arbitrary URLs, eval-able expressions, functions inside content, per-chapter reducers or manually accumulated score totals. String ID aliases improve readability but **do not** prove referential integrity; the content validator must verify every reference.

## Core types

```ts
type ChapterId = 'C1' | 'C2' | 'C3';
type NodeId = string;
type ArtifactId = string;
type EvidenceId = string;
type DecisionId = string;
type OptionId = string;
type SourceId = string;
type ObjectiveId = string;
type Competency = 'awareness' | 'verification' | 'safety' | 'recovery';
type RiskFlag = 'openedSuspiciousLink' | 'simulatedDataExposure'
  | 'simulatedAccountRisk';
type StoryFlag = RiskFlag | 'protectedData' | 'stoppedPortalFlow';

type TextPart =
  | { kind: 'text'; value: string }
  | { kind: 'emphasis'; value: string }
  | { kind: 'domain'; value: string }; // inert display, never href/src
type Copy = readonly TextPart[];

type Condition =
  | { kind: 'always' }
  | { kind: 'flag'; flag: StoryFlag; is: boolean }
  | { kind: 'discovered'; evidenceId: EvidenceId }
  | { kind: 'choice'; decisionId: DecisionId; optionId: OptionId }
  | { kind: 'compared'; sourceId: SourceId }
  | { kind: 'all'; items: readonly Condition[] }
  | { kind: 'any'; items: readonly Condition[] };

type Transition = {
  defaultTo: NodeId;
  variants?: readonly { when: Condition; to: NodeId }[];
}; // first matching variant, otherwise default; deterministic order

type Line = {
  id: string;
  speaker: 'ari' | 'recruiter' | 'narrator';
  text: Copy;
  variants?: readonly { when: Condition; text: Copy }[];
}; // base text always available

type Chapter = {
  id: ChapterId;
  title: string;
  objective: string;
  entryNode: NodeId;
  coreDecisionId: DecisionId;
  artifactIds: readonly ArtifactId[];
  evidenceIds: readonly EvidenceId[];
  nextChapter?: ChapterId;
};

type Node =
  | { id: NodeId; kind: 'narrative'; lines: readonly Line[];
      illustrationId?: string; next: Transition }
  | { id: NodeId; kind: 'investigation'; chapterId: ChapterId;
      artifactIds: readonly ArtifactId[]; task: string; decisionNode: NodeId }
  | { id: NodeId; kind: 'decision'; decisionId: DecisionId }
  | { id: NodeId; kind: 'outcome'; lines: readonly Line[]; debriefNode: NodeId }
  | { id: NodeId; kind: 'debrief'; feedback: Feedback; next: Transition }
  | { id: NodeId; kind: 'recoveryIntro'; next: Transition }
  | { id: NodeId; kind: 'completion' };
```

No score predicates use transient drawer state, dwell time, pointer precision or elapsed speed. Bound condition depth (proposed maximum 5) to keep authored rules inspectable. Avoid general-purpose expression parsing.

## Artifacts, references and evidence

```ts
type Hotspot = {
  id: string;
  label: string;                 // action name, not the hidden explanation
  evidenceId: EvidenceId;
  when: Condition;
  interaction: 'expand-detail' | 'inspect-destination'
    | 'inspect-request' | 'inspect-claim' | 'review-checklist';
};
type ArtifactBase = {
  id: ArtifactId;
  title: string;
  hotspots: readonly Hotspot[];
};
type Artifact =
  | (ArtifactBase & { kind: 'email'; senderName: string;
      senderAddress: string; subject: string; body: Copy;
      links: readonly { label: string; displayedAddress: string;
        destinationLabel: string; opensArtifactId: ArtifactId }[] })
  | (ArtifactBase & { kind: 'chat'; profile: Copy;
      messages: readonly { id: string; speaker: 'ari' | 'recruiter';
        body: Copy }[] })
  | (ArtifactBase & { kind: 'portal'; addressLabel: string;
      sections: readonly { id: string; title: string; body: Copy }[] })
  | (ArtifactBase & { kind: 'official-source'; sourceId: SourceId;
      body: Copy });

type VerificationSource = {
  id: SourceId;
  chapterId: ChapterId;
  artifactId: ArtifactId;
  independentlySourcedExplanation: string;
  inspection: { id: string; actionLabel: string; detail: Copy };
  // explicit domain/contact/listing inspection, not panel opening
  claim: Copy;
  reference: Copy;
  compareActionLabel: string;
  comparisonFeedback: Copy;
  discoveryOnCompare?: EvidenceId;
  opportunityClosesAt: DecisionId; // before its debrief reveals the answer
};

type Evidence = {
  id: EvidenceId;
  chapterId: ChapterId;
  artifactId: ArtifactId;
  title: string;
  kind: 'warning' | 'context' | 'verification' | 'recovery-resource';
  explanation: Copy;
  caution: Copy;                  // avoid categorical fraud claims
  relatedDecisionIds: readonly DecisionId[];
  discovery: { kind: 'hotspot'; hotspotId: string }
    | { kind: 'source-comparison'; sourceId: SourceId };
  awarenessObjectiveId?: ObjectiveId;
};
```

Use different renderers for email, chat, portal and official reference; never load a real external site to render an artifact. All sender/site address labels must pass the `.example` content policy. Source reference panels are accessed from an independent in-game directory, not a recruiter-provided destination. Opening a panel is transient and earns zero credit. `INSPECT_REFERENCE` requires explicit inspection of the authored domain/contact/listing detail; `COMPARE_SOURCE` is a separate deliberate action showing the claim beside the reference. Panel mount, focus, scrolling or choosing Verify cannot emit either scored event. Comparison need not become an extra multiple-choice quiz.

EA counts 11 investigation clues: all four from C1, all four from C2 and C3-E01–E03. C3-E04 remains a discoverable recovery resource but is not an additional pre-decision awareness point. Three verification source tasks exist (one per core chapter); C3 reuses the official-contact pattern without inventing a thirteenth evidence item. Exact C3 official reference/comparison copy is missing and requires authoring.

## Decisions and consequences

```ts
type Feedback = {
  whatHappened: Copy;
  whyItMatters: Copy;
  saferNextAction: Copy;
  relevantEvidenceIds: readonly EvidenceId[];
  limitation: Copy;
};
type Effect = { kind: 'set-flag'; flag: StoryFlag; value: boolean };
type Resolution = { kind: 'compare-source'; sourceId: SourceId };

type Option = {
  id: OptionId;
  label: string;
  availableWhen: Condition;
  unavailableReason?: string;
  effects: readonly Effect[];
  resolution?: Resolution;
  outcomeNode: NodeId;
  relevantEvidenceIds: readonly EvidenceId[];
  safetyCriteriaMet: readonly ObjectiveId[];
  recoveryCriteriaMet: readonly ObjectiveId[];
};
type Decision = {
  id: DecisionId;
  chapterId: ChapterId | 'recovery';
  prompt: Copy;
  options: readonly Option[];     // validate 2–3 per decision
  reviewArtifactIds: readonly ArtifactId[];
};
```

Every option references a complete outcome/debrief pair, explicit effects and an authored continuation. Relevant evidence is an explanation relationship, not automatic discovery. No option is locked solely because the player has not collected enough clues. If a narrative precondition removes an option, show an intelligible reason and guarantee a remaining forward path.

Choosing Verify commits the option, then opens its resolution if the source comparison is incomplete. The player must perform it before its consequence/debrief. If already done, reuse its completed record. Closing a panel never pretends verification succeeded. No option rewrites a past choice to improve a score. The report may reveal missed evidence after completion, visibly separated from the player's investigation record.

## Runtime state, events and saves

```ts
type Position =
  | { kind: 'briefing' }
  | { kind: 'narrative'; nodeId: NodeId; lineIndex: number }
  | { kind: 'investigation'; nodeId: NodeId }
  | { kind: 'decision'; decisionId: DecisionId }
  | { kind: 'verification'; decisionId: DecisionId; sourceId: SourceId }
  | { kind: 'outcome'; nodeId: NodeId; lineIndex: number }
  | { kind: 'debrief'; nodeId: NodeId }
  | { kind: 'recoveryIntro'; nodeId: NodeId }
  | { kind: 'completed' };

type GameEvent =
  | { type: 'run.started' }
  | { type: 'story.begun' }
  | { type: 'line.advanced'; nodeId: NodeId; lineIndex: number }
  | { type: 'evidence.inspected'; evidenceId: EvidenceId }
  | { type: 'reference.inspected'; sourceId: SourceId; inspectionId: string }
  | { type: 'source.compared'; sourceId: SourceId }
  | { type: 'decision.opened'; decisionId: DecisionId }
  | { type: 'decision.closed'; decisionId: DecisionId }
  | { type: 'choice.committed'; decisionId: DecisionId; optionId: OptionId }
  | { type: 'outcome.continued'; nodeId: NodeId }
  | { type: 'debrief.continued'; nodeId: NodeId }
  | { type: 'recovery.begun'; nodeId: NodeId };

type ChoiceRecord = {
  decisionId: DecisionId;
  optionId: OptionId;
  eventIndex: number;
  evidenceAtCommit: readonly EvidenceId[]; // derived from event prefix
};
type GameState = {
  position: Position;
  history: readonly GameEvent[];
  choices: Readonly<Record<DecisionId, ChoiceRecord>>;
  discoveries: Readonly<Record<EvidenceId, { eventIndex: number }>>;
  references: Readonly<Record<SourceId,
    { inspectedAt: number; comparedAt?: number }>>;
  flags: Readonly<Partial<Record<StoryFlag, boolean>>>;
  recoveryMode?: 'incident' | 'preventive';
};
type SaveEnvelope = {
  schemaVersion: 1;
  contentVersion: string;
  rubricVersion: 'v1';
  revision: number;               // change/conflict aid, not a security token
  events: readonly GameEvent[];
};
```

Only the envelope is persisted. GameState, evidence snapshots, recovery mode, flags, scores and recommendations are derived through replay; there is no duplicated writable truth. Initial empty engine accepts `run.started`; final debrief continuation derives completion, with no duplicate completion event needed. Sequence is array order, not wall-clock time; deterministic behavior requires no random IDs, player identifier or timestamp.

Use a small game-specific serializer/decoder and reducer replay only. No generic event-sourcing framework, projection/snapshot infrastructure, cloud synchronization or migration framework. Validate `inspectionId` against the source's single authored inspection target; opening a panel cannot be substituted for that action in a valid history.

Proposed decoder bounds: 128 KiB serialized input, 1,000 events, 128-character known identifier maximum, safe nonnegative revision integer, schema/content/rubric version exact match, allowed keys only. Validate IDs against content, event order and guards; reject impossible histories, duplicate choices, future evidence, prototype-style/unrecognized keys and foreign values. Bounds are operational limits, not educational scores. Content-authoring limits must ensure the intended full playthrough fits; test the longest path plus normal revisits. If excessive revisits exceed the durable limit, disclose memory-only continuation rather than blocking completion or writing an unrestorable save. No compression, encryption, export/import or generic migration framework for MVP.

## Adopted scoring rubric — baseline v1

The PM review adopts the proposed four-competency rubric, fixed denominators and equal competency weight as baseline v1. Each point represents an observable criterion. No hidden bonuses, timers, randomness, penalty multipliers or arbitrary chapter weighting. Risky choices meet fewer safety criteria; feedback remains supportive. Report numerators, denominators and why points were/weren't met. Adoption is a gameplay baseline, not psychometric validation or implementation authorization. Later calibration changes require an explicit rubric revision and regenerated golden expectations.

| Competency | Observable opportunities | Numerator / denominator |
|---|---|---|
| Evidence Awareness | Explicitly inspect each of the 11 investigation clues before its owning D1/D2/D3 commit | Unique eligible clues / 11 |
| Verification | For each chapter: explicitly inspect the relevant independently sourced domain/contact/listing detail (1), explicitly compare the claim to it (1), before answer reveal. Opening the panel or selecting Verify alone = 0 | Met criteria / 6 |
| Decision Safety | D1: avoids unverified link (1), pauses/stops the unsolicited recruitment flow (1). D2: withholds sensitive data (1), stops/pauses the unverified disclosure request (1). D3: withholds OTP (1), stops unverified portal flow (1) | Met criteria / 6 |
| Recovery Readiness | D4-1 stops unverified engagement; D4-2 chooses context-appropriate official remediation; D4-3 preserves evidence and reports without further disclosure | First-attempt criteria / 3 |

Each core decision offers two observable safety checks, for equal maximum contribution. Ignore/Block and verification paths can both earn full safety credit when they avoid exposure and stop or pause unverified engagement. Do not reduce safety credit for cautious rejection; its missing Verification actions already distinguish it from independent investigation. Criteria and option mappings below are baseline v1; final wording remains a content-review task.

### Safety outcome table

| Decision | Option | Safety points and reason |
|---|---|---|
| D1 | Follow link | 0/2, follows unverified destination |
| D1 | Ignore | 2/2, avoids exposure and stops unverified recruitment engagement |
| D1 | Verify | 2/2, pauses unverified engagement; complete required resolution, with source-work credit separately earned |
| D2 | Share fictional documents | 0/2, sensitive disclosure to unverified recipient |
| D2 | Block | 2/2, no sensitive disclosure; Verification may remain zero |
| D2 | Withhold and verify | 2/2, avoids disclosure and verifies through separate task |
| D3 | Share fictional OTP | 0/2, disclosed authentication factor |
| D3 | Continue without OTP | 1/2, code withheld but risky portal interaction continues |
| D3 | Stop and verify | 2/2, stops and completes required source task |

Verification scoring depends on the observable source actions, not the selected option. A meaningful detail-level inspection earns 1/2 for its source; only explicit comparison after that inspection completes 2/2. Reassuring choices, panel openings, focus/scroll and guide visits earn 0. A player who performed source actions during investigation keeps earned criteria even if later choosing a different action. Correlated competencies measure different behaviors; the report explains them separately and does not call their average a probability.

Formula: competency = `100 * earned / available`; overall = unrounded mean of the four competencies; round only for display (whole 0–100). During incomplete play, report is unavailable and missing opportunities are not silently removed from denominators. In final MVP, all recovery modes offer the same three objectives. If an objective cannot be assessed because content is incomplete, block release or explicitly show not-assessed and omit the overall score; do not fake a zero or renormalize invisibly.

### Golden fixtures v1 — independently calculated expectations

These are planning fixtures, not executed application tests. Derive the expected values below directly from authored actions and arithmetic, never by calling the production reducer/scorer to create its own oracle. Future automated fixtures must encode these traces with the final content IDs and assert fractions, percentages, context, choices and report facts. Full percentage precision is retained until display rounding.

| Run | EA | V | S | R | Displayed overall |
|---|---:|---:|---:|---:|---:|
| G-SAFE: all eligible clues in time, all comparisons, safest decisions, preventive recovery | 11/11 | 6/6 | 6/6 | 3/3 | 100 |
| G-RISKY: no investigation, risky D1–D3, then appropriate incident recovery | 0/11 | 0/6 | 0/6 | 3/3 | 25 |
| G-AVOIDANT: no investigation; ignore, block, continue-without-OTP; appropriate recovery | 0/11 | 0/6 | 5/6 | 3/3 | 46 |
| G-MIXED: explicit trace below | 5/11 | 3/6 | 4/6 | 2/3 | 57 |

**G-SAFE trace:** Before each owning decision, inspect C1-E01–E04, C2-E01–E04 and C3-E01–E03. C1/C2 source-comparison clues require completing their meaningful source inspections/comparisons before commit. Perform both source steps in all three chapters. Choose D1 Verify, D2 Withhold-and-verify, D3 Stop-and-verify. Choose appropriate D4-1/2/3 actions in preventive mode. C3-E04 may be reviewed but adds no EA point. Independent calculation: EA = 100×11/11 = 100; V = 100×6/6 = 100; S = 100×(2+2+2)/6 = 100; R = 100×3/3 = 100; overall = (100+100+100+100)/4 = **100**. No exposure flags; all three safe-path bridges must preserve that fact.

**G-RISKY trace:** Inspect no scored clues or source details and perform no comparison. Choose D1 Follow simulated link, D2 Share fictional documents, D3 Share fictional OTP. Resolve all three recovery checkpoints appropriately for those simulated exposures. Independent calculation: EA = 0; V = 0; S = 100×(0+0+0)/6 = 0; R = 100×3/3 = 100; overall = (0+0+0+100)/4 = **25**. Incident mode; the report must distinguish risky initial actions from appropriate later recovery rather than erasing either. Auxiliary check: the same initial trace with all recovery criteria unmet gives overall **0**.

**G-MIXED trace:** Before D1 inspect C1-E01/E02 and meaningfully inspect the C1 official-source detail, but do not compare; then Follow simulated link. Before D2 inspect C2-E01/E02/E03, perform no C2 source work, then Block. Choose D3 Stop-and-verify with no C3 pre-commit clue inspection; in its resolution meaningfully inspect the C3 reference and explicitly compare it. Choose correct D4-1 containment, incorrect D4-2 (contact the unverified recruiter instead of an appropriate official source), correct D4-3 preservation/reporting. C1 source inspection without comparison does not unlock C1-E04; resolution-time discoveries do not count retroactively toward EA. Independent calculation: EA = 100×(2+3+0)/11 = 500/11 ≈ **45.454545%**; V = 100×(1+0+2)/6 = **50%**; S = 100×(0+2+2)/6 = 200/3 ≈ **66.666667%**; R = 100×(1+0+1)/3 = 200/3 ≈ **66.666667%**; overall = (500/11+50+200/3+200/3)/4 = 3775/66 ≈ **57.196970**, displayed **57**. Incident framing describes possible link exposure only; it must not invent document or OTP disclosure.

**G-AVOIDANT calculation:** EA = 0; V = 0; S = 100×(2+2+1)/6 = 250/3; R = 100; overall = 275/6 ≈ **45.833333**, displayed **46**. This distinguishes cautious rejection from performed verification without reducing safety credit for blocking.

**Credit-control fixtures:** source panel opened only → V 0/6; Verify selected before required source work → no V credit and resolution pending; wrong inspection target/compare-before-inspection → rejected; meaningful detail inspected once → V 1/6; explicit comparison after it → V 2/6; repetition → still 2/6. Neither panel opening nor post-debrief inspection changes a final score. The first two are not completed-report traces.

Opening a suspicious link is not equivalent to confirmed compromise. Scoring credits gameplay behavior, and incident feedback must preserve that distinction. The rubric may not penalize slow reading, use of keyboard/screen reader, mobile layout or reduced motion.

## Report and recommendation model

Derive report from content/rubric version + accepted history:

- Four fractions and percentages, overall average and clear limitation copy.
- D1–D3 and D4 checkpoint choices, consequences and evidence known at choice time.
- Missed-before-choice vs discovered-later vs never-inspected evidence; never imply a clue influenced an earlier choice.
- Recommendations based on unmet objectives, e.g. missing source comparison → independent verification; document disclosure → minimize data and contact relevant provider; OTP disclosure → official account recovery; missed containment → stop engaging.
- Order up to three priority recommendations by potential harm (account/data exposure, then incomplete recovery, then verification/evidence practice), using fixed tie order, not AI text. Always include a full situational checklist in the guide.
- A nonjudgmental replay affordance. Scores remain an educational simulation result, not proof of skill transfer or job-offer safety.

Use neutral, descriptive Indonesian feedback; the earlier blueprint achievement labels and their thresholds/rules are superseded and must not ship. Describe specific observed actions, for example: “Kamu membandingkan klaim dengan sumber resmi pada ketiga bab,” “Kamu membagikan kode dalam simulasi, lalu memilih langkah pemulihan yang sesuai,” or “Kamu menghentikan interaksi, tetapi belum membandingkan klaim dengan sumber resmi.” Select wording only when history supports every clause; final copy remains subject to review. No achievement tier, character judgment or score-threshold label is needed.

## Build-time content validation and authoring checklist

Validate unique IDs; existing references; chapter ordering; required defaults; line arrays nonempty; legal 2–3-option decisions; complete feedback/safer-action/limitation copy; all option outcomes rejoin; no unintended cycle or dead end; all recovery variants reachable; evidence belongs to actual hotspots; sources independent and reachable; criterion/opportunity IDs unique; each objective's attainable maximum; all chapter clues accessible before commit; both report outcomes differ for safe/risky fixtures; no actual credential/file/payment fields; domain labels restricted to reserved suffixes; internal artifact links only; string/condition/event limits.

Content validator is planned Phase 2 work after authorization. Compile-time TS validation alone cannot catch a broken graph or unsafe story claim. Product review must also check accuracy, causality, Indonesian tone, ambiguity and pacing. Safe-path bridge drafts now exist in the state model and require final content review; full dialogue, all option-specific outcomes, mixed/risky bridges, decoy copy, C3 source reference and context-specific recovery options remain authoring deliverables. Adopted rubric v1/shared recovery/neutral feedback are not reopened by those tasks; see [open questions](open-questions.md).
