# TrustTrail capability audit

Audit date: 29 October 2026. Scope: Phase 0, read-only discovery plus planning documents. No installation, app scaffolding, Git initialization, account changes, asset generation or deployment was performed.

Historical snapshot: the statement above describes Phase 0. Subsequent Product Owner authorization permits Phase 1 foundation only; local source/Git and cached verification tools now exist. Refer to [Phase 1 validation](phase-1-validation.md) for current package, browser and permission findings. No public remote/deployment is authorized.

## Evidence and status vocabulary

- **Verified working:** a harmless operation succeeded in this session.
- **Exposed:** a callable tool is advertised; its underlying service was not exercised.
- **Installed:** a file/executable exists; this does not establish authentication or operational readiness.
- **Unavailable here:** a probe failed or no relevant callable tool is exposed.
- **Unverified:** requires an application, credentials, network access or a later authorized setup step.

Inspected workspace: `C:/Users/Shumin/Desktop/trusttrail`. Initial contents: `TrustTrail_Production_Blueprint_v1.1.md`; subsequently supplied and read: `GDD.md`. No package manifest, lockfile, source tree, node_modules or Git repository exists. The GDD approves product direction and explicitly leaves detailed mechanics for review. The official eight-page competition guide mentioned by the GDD is absent; its contents have not been independently verified. Public search surfaced a third-party directory pointing to a candidate guide shortlink, but opening it failed; no official requirements were adopted from that directory.

Discovery evidence: session tool registry; resource discovery (returned resources from `codex_apps`, no resource templates); only MCP section names from user configuration, without reading out endpoints, headers or secrets; executable lookup/version checks; filesystem skill inventory; read-only GitHub identity call; CUA surface inventory. Configuration is not evidence that a server is connected. This is a session-scoped inventory, not a claim to discover every service on the computer.

## MCP and hosted capability matrix

Names below preserve registry/config distinctions: `next_devtools` is the tool namespace for configured `next-devtools`. A plugin skill is not itself an MCP connection.

| Server / surface | Status and verified evidence | Capabilities and TrustTrail relevance | Lifecycle | Restrictions / prerequisites |
|---|---|---|---|---|
| `context7` | **Verified working**: 3 library resolutions and 3 documentation queries succeeded | Current React, Vite, Vercel docs; required first choice for library questions | 0–6 | Resolve library ID first; concept-specific queries; tool limits apply. No confidential content in queries |
| `next-devtools` / `next_devtools` | **Exposed**, 4 tools; no project runtime tested | Next server discovery/runtime inspection; browser setup guidance | 1–5 if applicable | Next runtime tools require a running compatible Next app. Proposed Vite app does not need them. `browser_eval` only points to agent-browser; it is not a working browser driver |
| `node_repl` | **Exposed**, 3 tools | Persistent JavaScript, file/data utilities, possible browser or native integration | 0–6 | Runtime/package imports unprobed; do not assume Playwright is installed because this tool exists |
| `codex_apps` — GitHub | **Verified working**: identity read returned authenticated login `SlushyMint`; 89 GitHub tools exposed | Read repositories/PRs/CI; later authorized repository operations | 1–6 | No TrustTrail remote exists locally; team-leader ownership and write permissions unverified. No messages, pushes or repository creation in Phase 0 |
| `codex_apps` — Sites | **Exposed**, 25 tools | Alternative hosting, versions, deployment status | 6, only if selected | Not selected by default. Vercel plan remains preferred; no Sites resources created or account access tested |
| `codex_apps` — document control | **Exposed**, 3 tools | Connected Office/document sessions | Optional submission work | No live session probed; Markdown docs need no document connector |
| `codex_apps` — Google Calendar | **Exposed**, 15 tools | Scheduling | Not required | No calendar data read; no event creation authorized |
| `codex_apps` — plugin management | **Exposed**, 6 tools | Discover/manage integrations | Only if a demonstrated gap emerges | No permissions or installation changes needed now |
| `codex_apps` — web search | **Exposed**, 1 tool | Official reference research | 0–6 | Prefer Context7 for library docs; ordinary `web` tool used for primary-source corroboration |
| `codex_apps` — Pets / safety / hotline | **Exposed**, 11 / 5 / 1 tools | No engineering requirement for TrustTrail | None | Unprobed; unrelated services excluded from project work |
| `data` | **Exposed**, 1 form elicitation tool | Structured questions | Usually none | No analytical dataset or dashboard requirement; gameplay scoring is application logic |
| `codex_tui` | **Exposed**, 12 tools | Task/worktree management | Optional 1–6 | No Git repo yet; no new tasks/worktrees needed for solo planning |
| `Roblox_Studio` | **Exposed**, 28 tools | Roblox editing/testing | None | Web application does not use Roblox; Studio connection untested |
| `figma` | **Configured only**; no Figma tools exposed | Potential design handoff and inspection | Optional 1, 5 | Installed Figma skills do not prove a connection. Recheck exposure before planning tool-dependent work |
| `supabase` | **Configured only**; no Supabase tools exposed | Backend/database/auth | None for MVP | No backend requirement; do not provision it just because a config entry exists |
| `mcp__cua_repl` | **Partly verified**: native app inventory succeeded; browser inventory returned `The browser access host is unavailable` | Native inspection/screenshot fallback; browser review if host becomes available | 1–6 | No browser surfaces currently connected. Native inventory is not proof of browser DOM control or E2E readiness |
| Built-in `image_gen` | **Exposed**, not exercised | Cohesive editorial illustrations | Optional 1–5 | Read imagegen skill; no assets requested/generated in Phase 0; no runtime AI API required |
| Built-in `web` | **Verified working** via official docs | Reference retrieval and checks | 0–6 | No authority to change accounts or publish; competition guide still missing |
| Built-in terminal / patch / image viewer | Terminal and patch **verified working**; image viewer **exposed** | Read/write docs, later code/builds, screenshot review | 0–6 | Workspace write boundary; image viewer requires an existing file |

No dedicated security-audit, accessibility-audit, Playwright, Vercel or filesystem MCP server is exposed under those names. Terminal, skills and later project-local test packages can cover the required work. No assumption of an installed Figma, Supabase or Vercel MCP connection is made.

## Installed skills and usage strategy

Filesystem enumeration found **115 SKILL.md files in 111 unique parent-folder names** across user skills and plugin cache roots. Cache presence is distinguished from the active skill catalog and from live tools. A compact physical inventory is appended below. Unrelated skills were inventoried, not all loaded as task instructions.

The four previously discussed names resolve to actual installed skills as follows. Relevant SKILL.md files were read; design app-screen guidance and React/general frontend security references were also inspected. No app or asset workflow was run.

| Exact active skill name | Purpose / invocation | TrustTrail phase | Constraints and conflicts |
|---|---|---|---|
| `design-taste-frontend` (tasteskill v2) | Art direction, source linting, browser measurements and screenshot critique when building/reviewing screens | 1, 2, 5 | Separate landing-page and app-screen workflows. Scripts exist (`draw.mjs`, `lint.mjs`, `inspect.mjs`), need Node 22+ and browser. Execution unverified. Its navy ban, page image/motion floors and sample-copy assumptions can conflict with this game: approved brief, accessibility and scope win; record exceptions. Do not generate extra prose/images merely to pass a marketing heuristic |
| `vercel-react-best-practices` | Apply when writing/reviewing React components; prioritize bundle cost, state subscriptions and versioned local storage | 1–5 | React guidance applies; Next/RSC/server rules do not imply choosing Next or installing SWR. Profile before memoization |
| `web-design-guidelines` | UI/accessibility audit of actual files; fetch fresh upstream guidelines for each review | 2, 5 | Skill verified and read. No UI exists to review in Phase 0, so no compliance finding claimed. Review file:line results alongside manual tests |
| `security-best-practices` | Explicit secure design / JS/TS frontend review; inspect React and general frontend references | 0–6 | Applied to planned trust boundaries; no implemented code to certify. Findings need evidence. No auth/backend rules should create unnecessary infrastructure |
| `context7-mcp` | Resolve and fetch current library docs | 0–6 | Applied now; no dependencies installed. Three key queries used for reducer, build and hosting choices; official docs supplement other choices |
| `imagegen` | New raster illustration or image edits via built-in tool | Optional 1, 3, 5 | SKILL.md read for capability planning; defer actual use. For final assets save selected outputs in project, maintain provenance. No API key needed for built-in mode; CLI fallback not selected |
| `computer-use:computer-use` | Windows app automation fallback | 1–6 if needed | SKILL.md read. Native sky path needs its own guidance/confirmation references before control. Available CUA tool has its own API; no mixed input stacks. Inventory was read-only |
| `figma:*` skills | Design/code translation, diagrams, component systems | Optional 1, 5 | Files present, tools absent; not required. Must read exact prerequisite skill before corresponding tool, if later exposed. Do not make Figma a critical dependency |
| `sites:sites` | Build/publish through Sites | Optional 6 alternative | Present; not invoked because this is a planning-only repository task. If selected later, read its workflow first. Do not accidentally deploy to both hosts |
| `anthropic-skills:canvas-design` | Static illustrated artwork | Optional asset work | Present; not required for engine or Markdown planning. Use only if a static deliverable is requested |
| `presentations:Presentations`, `anthropic-skills:pptx`, PDF/document skills | Optional competition presentation/export work | 6 | Present; not required for the mandatory video or Markdown docs. Read applicable skill if such files become deliverables |
| `supabase`, `supabase-postgres-best-practices` | Database/cloud work | None | Present, intentionally unused; would require reading before future database work |

Skill roots verified: `C:/Users/Shumin/.agents/skills`, `C:/Users/Shumin/.codex/skills`, `C:/Users/Shumin/.codex/plugins/cache`. The named four live under `.agents/skills/<name>/SKILL.md`; the system imagegen skill is under `.codex/skills/.system/imagegen/SKILL.md`.

## Development tools

| Capability | Observed status | Recommended usage / lifecycle |
|---|---|---|
| Windows PowerShell + filesystem | Working in workspace | All phases; native literal-path operations |
| ripgrep | `rg.exe` found; direct executable invocation works | Fast inventory/search, all phases |
| RTK | `RTK.md` read; wrapper rewrites attempted commands but `rtk` is not found | Use explicit executable paths as verified workaround; no global repair in Phase 0 |
| Node.js | **v22.13.1**, working | Meets documented Vite and Vitest minimums checked today; Phase 1 must still check chosen package engines/peer dependencies |
| npm | **10.9.2**, working; global package list empty | Use existing npm, project-local packages and lockfile after approval |
| pnpm / Yarn / Bun | Not found on PATH | Not needed; do not install alternative managers |
| Git | **2.47.1.windows.1**, working | No repository in workspace or parents; initialize only after approval |
| GitHub CLI | Executable found; even version/auth probes failed reading user config (`Access is denied`) | Treat CLI as unusable in current sandbox. Working connector is read-only fallback now; Git remote push rights unverified |
| TypeScript / ESLint / Vitest | No project packages; `tsc`/`vitest` not on PATH | Proposed local development tools, not available checks yet |
| Playwright / agent-browser | No project packages; commands not found on PATH | Approve Phase 1 setup; browser binaries/dependencies and actual launch need verification |
| Chrome / Edge | Executables found, versions **156.0.8078.73** / **156.0.4314.50** | Possible manual QA and inspection; existence does not establish automation connection |
| Browser CUA host | Probe failed, native app inventory succeeded | Recheck later; do not describe browser testing as ready |
| Visual review / regression | image viewer exposed; Taste scripts installed; no baselines or screenshots | Manual screenshots plus selected Playwright baselines in 2/5; not yet exercised |
| Accessibility | No axe/Lighthouse project package or test execution | Add `@axe-core/playwright` only with authorized test setup; manual keyboard/screen reader review remains necessary |
| Dependencies/security | npm executable exists; no dependency tree to audit; no scanner verified | Phase 1 lockfile review; Phase 5 npm audit and source review. Never auto-apply `audit fix --force` |
| Production build | No app, no manifest/scripts | Typecheck separately from Vite transpilation; verify production preview in 1–5 |
| Vercel deployment | No CLI found; no Vercel tool/account/project verified | Account and permissions check after approval; no resource created |
| Deployment smoke / CI | No URL, remote or workflow | Planned Phase 6, not executable now |
| Python | Not found by PATH probe | Not needed for this stack |
| Video recording | OBS appears in native app inventory | Candidate for Phase 6; recording/export readiness untested |

No `npx` test/version probe was used: it could implicitly download a package. No package-registry install or global configuration change was made.

## Capability-to-lifecycle handoff

| Phase | Ready to use | Gaps to close only after approval |
|---|---|---|
| 0 discovery | Workspace/terminal, patch, Context7, official web references, installed skill files | Official competition guide and capacity hours remain unknown |
| 1 foundation | Node/npm/Git, React/design skills | Project-local dependencies, exact compatible versions, remote ownership, browser launch |
| 2 vertical slice | Engine architecture, content drafts, documentation tools | Vitest/DOM integration/Playwright execution; real visual evidence |
| 3 narrative | Typed content plan and security guidance | Approved complete copy and recovery variants |
| 4 report | Adopted deterministic scoring baseline v1 and independent golden expectations | Implement/test only after authorization; review final neutral Indonesian copy; later calibration requires explicit revision |
| 5 quality | Design/security/accessibility instructions | Actual app to inspect; dependency audit; keyboard/mobile/browser QA |
| 6 submission | Authenticated GitHub connector; public-doc research | Public repository ownership, hosting access, deployed URL, video export and final rules verification |

Recheck capability availability before use; tools can change between turns. Approval for Phase 1 does not imply permission to change global settings or create unrelated cloud resources.

## Physical skill inventory

The inventory below records installed file locations, including cached/non-active entries. Detailed applicability is in the table above.

Paths below are relative to C:/Users/Shumin/. Each row identifies an on-disk skill directory; cached files may not be active in this session.

| Parent folder | Relative SKILL.md location |
|---|---|
| context7-mcp | .agents/skills/context7-mcp/SKILL.md |
| design-taste-frontend | .agents/skills/design-taste-frontend/SKILL.md |
| find-skills | .agents/skills/find-skills/SKILL.md |
| grill-me | .agents/skills/grill-me/SKILL.md |
| grilling | .agents/skills/grilling/SKILL.md |
| security-best-practices | .agents/skills/security-best-practices/SKILL.md |
| supabase-postgres-best-practices | .agents/skills/supabase-postgres-best-practices/SKILL.md |
| supabase | .agents/skills/supabase/SKILL.md |
| vercel-react-best-practices | .agents/skills/vercel-react-best-practices/SKILL.md |
| web-design-guidelines | .agents/skills/web-design-guidelines/SKILL.md |
| canvas-design | .codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/canvas-design/SKILL.md |
| consolidate-memory | .codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/consolidate-memory/SKILL.md |
| docx | .codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/docx/SKILL.md |
| morning | .codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/morning/SKILL.md |
| pdf | .codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/pdf/SKILL.md |
| pptx | .codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/pptx/SKILL.md |
| schedule | .codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/schedule/SKILL.md |
| setup-cowork | .codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/setup-cowork/SKILL.md |
| skill-creator | .codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/skill-creator/SKILL.md |
| xlsx | .codex/plugins/cache/claude-cowork/anthropic-skills/1.0.0/skills/xlsx/SKILL.md |
| cowork-plugin-customizer | .codex/plugins/cache/claude-cowork/cowork-plugin-management/0.2.2/skills/cowork-plugin-customizer/SKILL.md |
| create-cowork-plugin | .codex/plugins/cache/claude-cowork/cowork-plugin-management/0.2.2/skills/create-cowork-plugin/SKILL.md |
| figma-code-connect | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-code-connect/SKILL.md |
| figma-create-new-file | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-create-new-file/SKILL.md |
| figma-design-to-code | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-design-to-code/SKILL.md |
| figma-generate-design | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-generate-design/SKILL.md |
| figma-generate-diagram | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-generate-diagram/SKILL.md |
| figma-generate-library | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-generate-library/SKILL.md |
| figma-implement-motion | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-implement-motion/SKILL.md |
| figma-swiftui | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-swiftui/SKILL.md |
| figma-use-figjam | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-use-figjam/SKILL.md |
| figma-use-motion | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-use-motion/SKILL.md |
| figma-use-slides | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-use-slides/SKILL.md |
| figma-use | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/figma-use/SKILL.md |
| generate-project-plan | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/generate-project-plan/SKILL.md |
| video-interaction-mapper | .codex/plugins/cache/claude-cowork/figma/2.2.81/skills/video-interaction-mapper/SKILL.md |
| generate-project-plan | .codex/plugins/cache/claude-cowork/figma/2.2.81/workflow-skills/generate-project-plan/SKILL.md |
| video-interaction-mapper | .codex/plugins/cache/claude-cowork/figma/2.2.81/workflow-skills/video-interaction-mapper/SKILL.md |
| audit-support | .codex/plugins/cache/claude-cowork/finance/1.3.0/skills/audit-support/SKILL.md |
| close-management | .codex/plugins/cache/claude-cowork/finance/1.3.0/skills/close-management/SKILL.md |
| financial-statements | .codex/plugins/cache/claude-cowork/finance/1.3.0/skills/financial-statements/SKILL.md |
| journal-entry-prep | .codex/plugins/cache/claude-cowork/finance/1.3.0/skills/journal-entry-prep/SKILL.md |
| journal-entry | .codex/plugins/cache/claude-cowork/finance/1.3.0/skills/journal-entry/SKILL.md |
| reconciliation | .codex/plugins/cache/claude-cowork/finance/1.3.0/skills/reconciliation/SKILL.md |
| sox-testing | .codex/plugins/cache/claude-cowork/finance/1.3.0/skills/sox-testing/SKILL.md |
| variance-analysis | .codex/plugins/cache/claude-cowork/finance/1.3.0/skills/variance-analysis/SKILL.md |
| brief | .codex/plugins/cache/claude-cowork/legal/1.3.0/skills/brief/SKILL.md |
| compliance-check | .codex/plugins/cache/claude-cowork/legal/1.3.0/skills/compliance-check/SKILL.md |
| legal-response | .codex/plugins/cache/claude-cowork/legal/1.3.0/skills/legal-response/SKILL.md |
| legal-risk-assessment | .codex/plugins/cache/claude-cowork/legal/1.3.0/skills/legal-risk-assessment/SKILL.md |
| meeting-briefing | .codex/plugins/cache/claude-cowork/legal/1.3.0/skills/meeting-briefing/SKILL.md |
| review-contract | .codex/plugins/cache/claude-cowork/legal/1.3.0/skills/review-contract/SKILL.md |
| signature-request | .codex/plugins/cache/claude-cowork/legal/1.3.0/skills/signature-request/SKILL.md |
| triage-nda | .codex/plugins/cache/claude-cowork/legal/1.3.0/skills/triage-nda/SKILL.md |
| vendor-check | .codex/plugins/cache/claude-cowork/legal/1.3.0/skills/vendor-check/SKILL.md |
| computer-use | .codex/plugins/cache/openai-bundled/computer-use/26.1023.50603/skills/computer-use/SKILL.md |
| visualize | .codex/plugins/cache/openai-bundled/visualize/1.0.57/skills/visualize/SKILL.md |
| analyze-data-quality | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/analyze-data-quality/SKILL.md |
| answers-follow-up | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/answers-follow-up/SKILL.md |
| build-dashboard | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/build-dashboard/SKILL.md |
| build-report | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/build-report/SKILL.md |
| convert-to-doc | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/convert-to-doc/SKILL.md |
| convert-to-slides | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/convert-to-slides/SKILL.md |
| customize-data-plugin | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/customize-data-plugin/SKILL.md |
| design-kpis | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/design-kpis/SKILL.md |
| index | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/index/SKILL.md |
| jupyter-notebooks | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/jupyter-notebooks/SKILL.md |
| kpi-reporting | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/kpi-reporting/SKILL.md |
| market-sizing | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/market-sizing/SKILL.md |
| metric-diagnostics | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/metric-diagnostics/SKILL.md |
| onboarding | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/onboarding/SKILL.md |
| product-business-analysis | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/product-business-analysis/SKILL.md |
| publish-artifact-to-sites | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/publish-artifact-to-sites/SKILL.md |
| report-to-pdf | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/report-to-pdf/SKILL.md |
| schedule-refresh-jobs | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/schedule-refresh-jobs/SKILL.md |
| share-artifact-summary | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/share-artifact-summary/SKILL.md |
| validate-data | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/validate-data/SKILL.md |
| visualize-data | .codex/plugins/cache/openai-curated-remote/data-analytics/1.1.0-exp-baseline/skills/visualize-data/SKILL.md |
| artifact-template-analytics-dashboard | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-analytics-dashboard/SKILL.md |
| artifact-template-business-review | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-business-review/SKILL.md |
| artifact-template-design-report | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-design-report/SKILL.md |
| artifact-template-experiment-analysis | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-experiment-analysis/SKILL.md |
| artifact-template-financial-budget | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-financial-budget/SKILL.md |
| artifact-template-investment-committee-memo | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-investment-committee-memo/SKILL.md |
| artifact-template-legal-memorandum | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-legal-memorandum/SKILL.md |
| artifact-template-market-trends-report | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-market-trends-report/SKILL.md |
| artifact-template-minimal-letterhead | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-minimal-letterhead/SKILL.md |
| artifact-template-operating-calendar | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-operating-calendar/SKILL.md |
| artifact-template-operating-review | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-operating-review/SKILL.md |
| artifact-template-project-kickoff | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-project-kickoff/SKILL.md |
| artifact-template-project-tracker | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-project-tracker/SKILL.md |
| artifact-template-sales-pipeline | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-sales-pipeline/SKILL.md |
| artifact-template-simple-dark-mode | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-simple-dark-mode/SKILL.md |
| artifact-template-simple-light-mode | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-simple-light-mode/SKILL.md |
| artifact-template-strategy-memorandum | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-strategy-memorandum/SKILL.md |
| artifact-template-system-design | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-system-design/SKILL.md |
| artifact-template-team-alignment | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-team-alignment/SKILL.md |
| artifact-template-three-statement-forecast | .codex/plugins/cache/openai-curated-remote/openai-templates/0.1.1/skills/artifact-template-three-statement-forecast/SKILL.md |
| plugin-management | .codex/plugins/cache/openai-curated-remote/plugin-management/0.1.0/skills/plugin-management/SKILL.md |
| sites-remix | .codex/plugins/cache/openai-curated-remote/sites/1.1.2/skills/sites-remix/SKILL.md |
| sites | .codex/plugins/cache/openai-curated-remote/sites/1.1.2/skills/sites/SKILL.md |
| create-pet | .codex/plugins/cache/openai-curated-remote/work-pets/0.1.6/skills/create-pet/SKILL.md |
| pets | .codex/plugins/cache/openai-curated-remote/work-pets/0.1.6/skills/pets/SKILL.md |
| update-pet | .codex/plugins/cache/openai-curated-remote/work-pets/0.1.6/skills/update-pet/SKILL.md |
| documents | .codex/plugins/cache/openai-primary-runtime/documents/26.1025.11240/skills/documents/SKILL.md |
| pdf | .codex/plugins/cache/openai-primary-runtime/pdf/26.1025.11240/skills/pdf/SKILL.md |
| presentations | .codex/plugins/cache/openai-primary-runtime/presentations/26.1025.11240/skills/presentations/SKILL.md |
| excel-live-control | .codex/plugins/cache/openai-primary-runtime/spreadsheets/26.1025.11240/skills/excel-live-control/SKILL.md |
| spreadsheets | .codex/plugins/cache/openai-primary-runtime/spreadsheets/26.1025.11240/skills/spreadsheets/SKILL.md |
| template-creator | .codex/plugins/cache/openai-primary-runtime/template-creator/26.1025.11240/skills/template-creator/SKILL.md |
| imagegen | .codex/skills/.system/imagegen/SKILL.md |
| openai-docs | .codex/skills/.system/openai-docs/SKILL.md |
| review-agent | .codex/skills/.system/review-agent/SKILL.md |
| skill-creator | .codex/skills/.system/skill-creator/SKILL.md |
| skill-installer | .codex/skills/.system/skill-installer/SKILL.md |
