# TrustTrail architecture recommendation

**31 October 2026 implementation update:** Chapters 1–2 are playable. The existing reducer now accepts guarded `chapter.continued` and `conversation.advanced` events. Each debrief closes at its chapter checkpoint; explicit continuation preserves shipped C1 saves. `Chapter.conversation` supplies profile and exchange content; Case Files retains prior-chapter evidence and action counts. Save schema/content/rubric versions remain compatible. Chapter 3, recovery, and the final report remain planned. See [Chapter 2 validation and current contracts](chapter-two-validation.md). Earlier planning sections below are retained as historical context.


**Current presentation update (29 October 2026):** the approved Lacak OS desktop and Saku mobile system is integrated into production. See [production dual-OS architecture and validation](dual-os-integration/validation.md). `OperatingSystem` reads the existing provider, keeps game app instances stable across layout changes, and uses router URLs for presentation navigation. Earlier dossier/illustrated presentation notes below are historical; engine, event, scoring and persistence contracts remain authoritative.


Status: full M1–M4 production development authorized, 29 October 2026. Existing React/TypeScript/Vite, reducer/Context and safety contracts are preserved. M1 is implemented; later modules below remain planned. Per-phase approval references below are historical; current authority/schedule: [production milestones](production-milestones.md). No Git operations or public deployment/submission.

## Authority, scope and assumptions

Read sources: [GDD v1.0](../GDD.md), [Production Blueprint v1.1](../TrustTrail_Production_Blueprint_v1.1.md), the Phase 0 master prompt and subsequent Product Manager review amendments supplied by the user. Retained direction: Indonesian narrative investigation, three connected chapters, editorial illustration, balanced difficulty, desktop-first responsive UX, safe fictional artifacts, no mandatory login, vertical slice first. React + TypeScript + Vite, typed reducer + Context, typed scenario definitions and static hosting are conditionally approved. Four-competency scoring is adopted as baseline v1; names and complete narrative/asset copy remain pending. User confirmed a **one-person team**; available hours and public-repository ownership are unconfirmed.

The review adopts one shared three-checkpoint recovery sequence for all players, with incident/preventive framing and context-appropriate remedies. Exact dialogue and option wording still need content review. GDD evidence IDs (`C1-E01` format) are retained instead of blueprint shorthand (`C1-E1`); no existing saves need migrating. The guide is treated as a ninth screen, S09, in addition to S01–S08. Achievement labels are superseded by neutral, descriptive Indonesian feedback.

The official guide itself is missing. Submission constraints are treated as supplied requirements, not independently authenticated rules. Request it before submission-dependent decisions are finalized; see [open questions](open-questions.md).

## Recommended stack and tradeoffs

| Choice | Recommendation and rationale | Alternative / complexity and maintenance | Verification implications |
|---|---|---|---|
| Rendering | React + strict TypeScript | Vanilla TS saves runtime but increases coordination cost across eight screens; Next/SSR adds a server framework without an MVP server need | Typecheck content and reducer; component behavior tests |
| Tooling | Vite, npm, project-local packages and committed lockfile | Existing npm avoids another package manager. Do not use floating latest versions in CI | Vite transpiles TS without typechecking: explicit `tsc` gate required [Vite](https://vite.dev/guide/features#typescript) |
| Routes | React Router declarative client routing | Four routes warrant a maintained router; a custom History wrapper creates keyboard/back/deep-link maintenance. Framework/SSR mode unnecessary | Guard routes based on restored gameplay; test direct entry and refresh. [Router docs](https://reactrouter.com/start/declarative/installation) |
| Styling | Tailwind CSS with semantic CSS custom-property tokens and small component styles | Plain CSS modules acceptable if more familiar to solo developer. Utilities are not the design system; avoid dynamic class-string construction in content | Build CSS with the documented Vite integration; check actual production output. [Tailwind](https://tailwindcss.com/docs/installation/using-vite) |
| State | Pure typed reducer + separate state/dispatch Context providers | Zustand is viable for independent subscriptions but is unnecessary for this short, single-player flow. Reconsider only after measured re-render problems. Redux/XState add more concepts than needed | Pure transition tests without React; Context integration tests. [React reducer/context](https://react.dev/learn/scaling-up-with-reducer-and-context), [Zustand alternative](https://github.com/pmndrs/zustand) |
| State graph | Explicit finite set of states expressed as discriminated unions and guarded transitions | Formal FSM library deferred; adopt only if parallel/timed actors and complex cancellation emerge | Enumerate transitions; reject illegal and duplicate actions; see [state model](gameplay-state-machine.md) |
| Content | Typed TS objects authored with `satisfies`, stable IDs, constrained conditions/effects | Raw JSON loses compile-time authoring assistance; CMS/backend creates access/deployment work. No embedded executable conditions | Typecheck plus content graph/reference validator; runtime-save validation remains essential |
| Motion | CSS transitions initially; Motion optional only for a concrete transition that CSS cannot express cleanly | Motion is suitable but not required. Fewer moving parts suit deadline and reduced motion | No engine event waits on an animation; reduced-motion parity. [Motion reference](https://motion.dev/docs/react-use-reduced-motion) |
| Persistence | One versioned localStorage event log; bounded runtime validation and replay | IndexedDB unnecessary at this scale; server sync/accounts out of scope | Storage-blocked, corruption, incompatible version, refresh and reset tests. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) |
| Tests | Vitest for domain logic; Testing Library with a DOM environment for a few meaningful integration cases; Playwright E2E + axe checks | Avoid duplicate browser/component-testing frameworks. No blanket snapshot suite | Focus effort on invariants, complete paths and report calculations; see [testing](testing-strategy.md) |
| Hosting | Vercel static deployment from public GitHub repository | Other static hosts viable contingency; Sites available but not selected. No functions/database needed | Explicit SPA rewrites and production-route smoke tests [Vercel](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas) |

The Product Owner's current Phase 1 runtime strategy is **Node 26.13.0/npm 11.6.3**, superseding Option A's Node 22 target. Root `engines.node` is `>=26.13.0 <27.0.0`; `.nvmrc` records 26.13.0 and `packageManager` records npm@11.6.3. Every direct dependency pin is retained, including React/DOM 19.3.1, Router 8.5.1, Vite 8.3.5 and React plugin 6.1.2. Exact published engine/peer requirements accept this runtime and dependency combination; no framework or tooling major upgrade is needed. The existing React declarative-router architecture and PostCSS integration are unchanged. See the [complete dependency audit](node-26-compatibility.md) and [actual installation/validation evidence](phase-1-validation.md). Strict engine checks remain enabled; global npm 11.20.0 is not confused with the selected temporary npm 11.6.3 runner.

## Module ownership and data flow

| Module | Owns | Must not own |
|---|---|---|
| App shell | Routes, global navigation, boundaries, save-status UI | Scoring, content-specific conditionals |
| Narrative engine | Scene cursor, line sequencing, next transitions, branch/rejoin evaluation | Browser storage or React rendering |
| Investigation | Email/chat/portal/source renderers; actions against current artifacts | Network previews, automatic evidence awards on mount |
| Evidence | Discovery eligibility, unique records, journal selectors | Exposing uninspected explanations |
| Decision engine | Option availability, one selection, resolution work, consequence | Randomness, score increments in click handlers |
| Scoring | Objective rubric evaluation from validated history; report facts | Mutating state or trusting saved score totals |
| Recovery | Shared three-checkpoint sequence; incident/preventive context | Duplicated safe/risky content engines |
| Trust Report | Scores, cited behaviors, missed evidence, recommendations | Generic static results or real-offer safety predictions |
| Safety guide | Publicly accessible preventive and situational recovery guidance | Collecting reports or verifying real offers |
| Persistence adapter | Validation, serialization, replay, write failure handling | Inventing flags from arbitrary storage objects |
| Shared UI | Buttons, tabs, drawers, focus/notice/status behavior | Game-specific decisions |

Data flow:

```text
Bundled scenario + rubric -> validate graph at test/build time
Validated save events -> replay through pure reducer -> canonical GameState
UI intent -> validate against current state/content -> domain event -> reducer
reducer -> updated GameState -> selectors -> scene/artifact/journal/report
accepted events -> storage adapter -> versioned local save
storage error -> nonblocking save notice; game stays usable in memory
```

Keep state transition, view rendering and persistence separate. Derived values (scores, flags, unlocked content, missed evidence) are recalculated from accepted events. UI-only state (drawer visibility, active tab, focus target, scroll position) stays local and does not influence scores. Narration position is durable; browser Back moves among routes, not backward through committed decisions.

Persistence stays a small game-specific serializer/validator and reducer replay over one local save. No generic event-sourcing framework, event bus, snapshot/projection infrastructure, cloud synchronization or migration framework. An incompatible save gets a clear restart/reset notice. Simple other-tab change detection is sufficient; distributed coordination and conflict-merging machinery are out of scope.

## Proposed folder structure

This is a plan, not a scaffold to create during Phase 0.

```text
src/
  app/                  router, providers, route guards, boundaries
  pages/                Home, Play, Report, Guide, NotFound
  engine/               types, reducer, guards, graph validator, selectors
  features/
    narrative/          scene/dialogue views, backlog
    investigation/      email, chat, portal, official-source panels
    evidence/           journal and clue details
    decisions/          options, verification resolution, feedback
    recovery/           shared checkpoint views and variant context
    scoring/            rubric v1 evaluator, descriptive feedback/recommendations
    report/             report sections
    guide/              safety checklist content/view
  components/ui/        Button, Tabs, Drawer, Notice, FocusHeading
  content/
    scenario.ts         registry and content/rubric versions
    chapters/           c1, c2, c3 typed definitions
    recovery.ts         shared sequence and context variants
    rubric.ts           opportunities and evidence-based recommendations
  lib/persistence/      bounded save decoder, replay, storage adapter
  styles/               tokens, global styles, motion preferences
  assets/               licensed self-hosted fonts and final illustrations
tests/
  unit/                 engine, graph, rubric, persistence fixtures
  integration/          core workflows through rendered views
  e2e/                  full playthroughs, routes, storage, keyboard/mobile
docs/                   planning; later validation/credits/submission notes
public/                 favicon and static files only
```

Tests can be colocated where that is simpler; retain one discoverable convention. Reuse an artifact renderer by its typed `kind`, not by chapter-number switches. Avoid a universal schema-driven UI framework: only three simulation types are required.

## Gameplay and product analysis

Narrative is a shared spine with small outcome variants. Each chapter owns one core decision (D1–D3), its own evidence and brief debrief. Risk choices never terminate play. A **selected** verification action must lead to meaningful inspection of a specific official-source detail and explicit comparison with the claim. Opening a source panel, mounting it or choosing a reassuring option awards zero Verification credit. No investigation quota locks a decision; the player may continue with incomplete evidence. Preconditions exist for narrative context, not to force all clues to be collected.

Recovery always occurs after Chapter 3. Link opening alone is framed as possible exposure, not proof of compromise; credential-specific remediation is conditional on simulated account exposure. Preventive mode uses the same learning objectives with a hypothetical incident. Baseline-v1 scoring, neutral Indonesian feedback, independently calculated golden fixtures and evidence cutoffs are specified once in [scenario schema](scenario-data-schema.md).

Safe-path bridges are required authored content at C1→C2, C2→C3 and C3→recovery. Careful Ari may examine a new incoming claim as evidence while continuing to withhold documents/codes and avoid an unverified portal. The story must explain each encounter and preserve those choices; it cannot silently open a suspicious link or submit data to advance. Draft bridge copy and review criteria are in [state model](gameplay-state-machine.md).

The report derives four competency values, visible numerators/denominators, noteworthy choices, pre-decision evidence gaps and targeted next actions. It includes a situational checklist and replay. It is an account of **game actions**, never a scam detection result, psychological assessment or certification. No leaderboard, export/share, backend, telemetry or AI endpoint is needed.

## Security and privacy design

Trust boundaries: bundled authored scenario is reviewed content; storage, route/query strings and all runtime input are untrusted; hosting/dependency supply chain is external. Client scoring has no anti-cheat claim and no authoritative certification value.

- Simulated artifact addresses are `.example` strings, not `href`, image origins or fetch destinations. A preview button changes the internal artifact ID. Never render a live external page or iframe for a scam simulation. Reserved suffixes do not replace navigation controls. [IANA special-use registry](https://www.iana.org/assignments/special-use-domain-names)
- No editable credential/OTP/payment fields, document upload, contact form or player-name field. Risk choices create predefined narrative events; illustrative dummy values, if shown, are static and clearly fictional.
- Render plain strings/structured text through JSX. No `dangerouslySetInnerHTML`, raw HTML markdown, eval, dynamic Function or string-authored predicates. Save IDs resolve through fixed content registries; never spread arbitrary persisted objects into component props or URLs.
- Persist only version identifiers and bounded game events. No identifiers, text entries, secrets or browser fingerprint. Reset removes only TrustTrail-owned keys. Local storage is readable by same-origin scripts and can be cleared; disclose device/browser/origin limits. No claim of encryption or cloud backup.
- Self-host selected fonts/assets; no analytics, CDN script embeds, remote avatar/image loads or unnecessary APIs. Ordinary hosting requests/logs still exist; local-only gameplay does not mean the host receives no request metadata.
- Guide external links, if any, require an explicitly reviewed allowlist of official HTTPS destinations, visible destination/context and separate styling from simulated links. Verify Indonesian reporting links shortly before release; do not invent contact numbers.
- Plan host headers: CSP restricting scripts/assets to self, object-src none, base-uri self, frame-ancestors none, form-action none; no unsafe-eval. Consider runtime style needs separately (CSS transitions preferable). Add nosniff, Referrer-Policy and restrictive Permissions-Policy. Validate actual production responses rather than claiming security from config alone. Avoid premature HSTS/preload commitments.
- Lock dependencies, review install scripts and advisories, inspect staged files for secrets before first publication, audit dev as well as production dependencies. Audit reports are evidence, not complete security assurance. [npm audit](https://docs.npmjs.com/cli/v10/commands/npm-audit/), [OWASP XSS](https://owasp.org/www-community/attacks/xss/)

## Git, hosting and operational plan

Current Product Owner direction supersedes the earlier local-Git workflow: **the Product Owner manages all Git operations independently; the agent performs none.** Preserve source product docs and `.gitignore` exclusions for node_modules, build/test artifacts, `.env*` secrets and local tool profiles. The Product Owner handles review, staging, commits, branches and publication independently.

Confirm team leader owns the public remote; authenticated connector login alone does not establish that requirement. Local Git hygiene and `.gitignore` preparation belong in Phase 1 after implementation authorization. Creating a public remote, publishing/pushing to it, or creating/deploying hosting resources requires **separate explicit approval**; architecture approval or later Phase 1 approval alone grants none of those actions. GitHub CLI is currently blocked; connector read access works, Git-over-HTTPS/SSH push access is unverified.

After later deployment authorization, connect the repository to Vercel and deploy static `dist`. Configure SPA fallback so `/play`, `/report`, `/guide` and a client-side not-found view work on direct requests. Verify static asset paths/MIME types are not accidentally rewritten as HTML. Maintain working preview and stable production URL. Prefer one early preview after the vertical slice to uncover hosting/rewrites issues; final public submission deployment remains Phase 6. No production secrets are expected. Roll back by redeploying the last verified commit; avoid content-ID changes after save compatibility freezes.

## Architectural acceptance

Before content expansion: one real chapter traverses every option; repeated actions are idempotent; illegal events rejected; storage failures graceful; source verification is an actual comparison; chapter replay/resume works; keyboard/mobile investigation works. Before release: all paths, four scores, recovery, direct routes, public URL/repo and <=5-minute video verified. Full criteria are in [implementation plan](implementation-plan.md) and [testing strategy](testing-strategy.md).
