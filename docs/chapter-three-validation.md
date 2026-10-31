# Chapter 3 — Final verification

Chapter 3 completes the recruitment investigation, from Mira's final request through a simulated account-code decision, a required recovery mission, and an event-backed Trust Report. All copy remains Indonesian, matching the shipped chapters.

## Story and interaction

- Mail references the original NovaTech invitation, the intern/user-research role, and Ari's library portfolio. Ari's notes adapt to each Chapter 1–2 decision. Messages and Case Files retain the earlier conversation, choices, and discovered evidence.
- Browser contains an inert recruitment portal on `karier.novatech.example.verify-candidate.example/ari`. Three labeled controls inspect domain/organization claims, HTTPS, and the deadline/account-code request. No hover, external navigation, editable code fields, documents, credentials, or payment forms are used.
- The independent source retains the established `novatech.example/karier`, `karier@novatech.example`, and coordinator Nara Wisesa. Players must inspect the relevant portal details and select the official address and procedure from actual comparison choices. Wrong matches explain how to retry and earn no events or credit. Both matches are required to record verification and open the consequential decision. HTTPS inspection is optional.
- All three choices have distinct outcomes: stop and independently confirm, share a predefined fictional code, or leave with evidence. No branch ends the game.
- Every branch completes stop/preserve/contact/report exercises. Sharing a code adds account recovery; Chapter 2 identity disclosure adds identity exposure handling. Wrong recovery actions explain the problem and remain retryable. Confirmed actions and their explanations remain reviewable after reload.
- The Trust Report unlocks only after recovery and final reflection. It shows existing chapter fractions and actual recovery actions. There are no invented overall ranks, bonuses, or predictions about real-world ability.

## State and compatibility

The typed scenario adds an optional portal/comparison contract. The reducer accepts `portal.opened`, `claim.matched`, `recovery.acted`, and `recovery.completed` with chapter, phase, prerequisite, answer, ordering, and duplication guards. Recovery is a mandatory position between C3 outcome and reflection. It derives its plan from accepted earlier choices.

The `trusttrail:save:v1` schema, `trusttrail-1` content version, and `v1` rubric remain compatible because the existing event meanings and checkpoints remain unchanged. New event types are additive. Old C1/C2 checkpoints stay in place until the player explicitly continues. Decoding still replays and rejects impossible or malformed traces. No migration rewrites or deletes existing saves. Replay/reset continue through the existing confirmation flow.

Awareness remains frozen at choice commitment. Claim matching cannot add verification beyond the existing inspected/compared pair. Recovery actions do not change chapter scores. Repeated evidence, comparison, recovery, or completion actions preserve state identity.

## Validation coverage

- Unit coverage traverses all **27 combinations** of C1, C2, and C3 decisions. Every accepted event prefix is encoded, decoded, and compared with deterministic replay, including partial comparisons and recovery.
- Tests cover old C2 saves, illegal transitions, premature decisions, wrong answers, duplicate events, report gating, exposure-specific recovery, score integrity, and authoring validation.
- Playwright runs real C1 → C2 → C3 → recovery → report journeys for safe, unsafe, and leave-portal choices. It checks archives, source comparison, mistakes, keyboard radio activation, reduced motion, mobile app switching, reloads, no external requests, and absence of credential/upload inputs.
- Existing C1/C2, storage failure/conflict, route, desktop dragging/placement, mobile fullscreen, homepage, and keyboard suites remain enabled. The two old endpoint/roadmap expectations now reflect C3 availability.
- `scripts/review-chapter-three.mjs` renders the production build at 1440, 768, and 390 pixels. `measurements.json` records no document/portal horizontal overflow, no portal buttons below 44px, no credential inputs, and portal headings within two lines. Browser tests additionally exercise 320px.

Typecheck, zero-warning ESLint, all **76 unit/integration tests**, and production build pass on Node 26.13.0 with the installed npm 11.20.0. The declared npm target remains 11.6.3; dependencies and lockfile were not changed. Vite emits a chunk-size advisory for the approximately 520 kB main bundle (161 kB gzip).

The final isolated Playwright run passed **72 / 72** desktop/mobile cases in 2.1 minutes, exit code 0:

```text
node node_modules/@playwright/test/cli.js test --workers=2 --output=test-results/chapter-three-final
72 passed (2.1m)
```

Earlier overlapping runs collided while writing trace files; they are superseded by this complete isolated run. No gameplay assertions were removed to resolve those artifact errors. Artifacts in this folder include portal, inspection, comparison, and recovery screenshots.

## Design and accessibility review

Applied `design-taste-frontend`, `web-design-guidelines`, and React best practices. Direction: **True-black flat**, seed **920851437**; no redraws. Existing pixel OS typography, wallpaper, draggable windows, and mobile shell remain intact. The portal itself uses flat neutral tone steps and readable Inter. NovaTech's candidate dossier and the paired claim/reference comparison give the screen its identity. No new artwork, remote assets, audio, or continuous animation were added.

Screen questions: “Who is requesting verification?”, “Does this portal belong to the company?”, “What differs from the official procedure?”, and “What should Ari do about this exposure?” Each has a visible next action. Screenshots were reviewed on desktop, tablet, and phone. The main finding is beside the evidence; no fabricated metrics or chart decoration are present. Counts derive from accepted events. Phone navigation uses the existing fullscreen app switcher, and evidence is reachable by click, touch, and keyboard. Recovery moves focus to the next task; feedback uses polite live regions.

Skill source lint reported no failures. Its two shadow warnings refer to `box-shadow: none`, which explicitly removes inherited pixel-button shadows. The bundled inspector CLI timed out at CDP `Page.enable`; this is not recorded as a successful inspector run. Playwright measurements and screenshots provide the completed browser review instead.

## Learning references and limits

Recovery copy follows the general practices described by the [FTC job-scam guidance](https://consumer.ftc.gov/articles/job-scams): avoid paying for a job, use independently found company contacts, and contact the payment provider promptly if money was sent. The story does not simulate a payment, so a bank-dispute exercise is not imposed on every player. Reporting channels and identity procedures depend on the player's jurisdiction; the game names the relevant institution/platform rather than inventing local contact details.

The code-sharing outcome is fictional. No real reports, messages, account changes, identity-service requests, or refunds are executed. Saves remain local to one browser. Automated browser coverage uses installed Chrome and mobile emulation; physical devices, other browser engines, and assistive-technology testing remain release checks. The Trust Report is a factual action summary, not a four-dimension certification or overall competence score.

No Git operations or deployment were performed.
