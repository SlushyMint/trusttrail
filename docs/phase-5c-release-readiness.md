# TrustTrail — Phase 5C release and submission readiness

Prepared **3 November 2026, Asia/Jakarta**. Candidate: application package **0.1.0**, existing v1 save/rubric contracts. Scope: production verification, Vercel configuration and owner-ready submission/video instructions. **No Git operations, public deployment, hosting-project creation, publication, form submission or video production was performed.**

## Local candidate decision

**Locally validated candidate ready for Product Owner review.** Clean installation, TypeScript, zero-warning ESLint, 94 unit/integration tests, production build and a single complete managed-Chromium run of **106 passed / 0 failed** are verified. Phase 5B counts are reproduced with the existing assertions plus two readiness fixes and one scoped measurement budget; an identical timing pass on the Fedora system executable was not reproduced. Public release/submission readiness remains conditional on the owner actions below; a local preview cannot establish public HTTPS, Vercel/CDN behavior, repository access, video access or successful submission.

Approved application source, gameplay, scoring, persistence, pixel design and cinematic animation are unchanged. The production entry is still `index-B9jkqZea.js`, matching the Phase 5B build. Changes in Phase 5C are the new root [vercel.json](../vercel.json), these release/video documents, current README/architecture pointers, and additional third-party provenance documentation. No dependency pins, lockfile, original browser assertions or animation settings were changed. Default test/expectation timeouts are retained; only the repeated-navigation/forced-GC diagnostic receives a scoped 60-second total budget, as justified below. Two test-only synchronization fixes were required to restore the release gate: wait for Browser inspection/comparison controls before checking visibility, and scope the homepage start action to the arriving `.portal` after route navigation.

## Verification results and retained evidence

Runtime: Node **26.13.0**, npm **11.20.0** for checks; clean installation uses the declared **npm 11.6.3** temporary runner. Production preview: `http://127.0.0.1:4173`, serving `dist` via the existing Playwright-managed preview process, not Vite's development server. Desktop and Pixel 7 mobile emulation use one browser worker.

| Check | Phase 5C result | Evidence |
|---|---|---|
| Clean `npm ci` | PASS; 278 packages installed with npm 11.6.3 | [installation log](phase-5c-evidence/clean-install.log) |
| TypeScript | PASS | [aggregate check](phase-5c-evidence/check.log) |
| ESLint | PASS; 0 errors, 0 warnings; configuration follow-up also passes | [aggregate](phase-5c-evidence/check.log), [follow-up](phase-5c-evidence/config-lint.log) |
| Unit/integration | **94 passed / 0 failed, 9 files** | [aggregate check](phase-5c-evidence/check.log) |
| Production build | PASS; unchanged >500 kB entry warning, 544.56 kB / 169.25 kB gzip | [build portion of aggregate](phase-5c-evidence/check.log) |
| Synchronization regressions | **12 passed / 0 failed** (three repetitions × two cases × two viewports) | [focused repetitions](phase-5c-evidence/synchronization.log) |
| Repeated-GC diagnostic | **2 passed / 0 failed**, original cycles/thresholds | [focused result](phase-5c-evidence/collection-focused.log), [type/lint follow-up](phase-5c-evidence/harness-check.log) |
| Complete managed-Chromium regression | **106 passed / 0 failed / 0 skipped, no retries; 53 desktop + 53 mobile, 8.3 minutes** | [final full run](phase-5c-evidence/browser-final.log) |
| System-Chromium diagnostic | **34 passed / 7 failed / 1 interrupted / 64 not run**, not a completed pass | [diagnostic](phase-5c-evidence/browser-system-diagnostic.log) |
| Production output availability | **48/48 files fetched successfully**; bytes match disk, no missing literal local asset references | [HTTP inventory](phase-5c-evidence/dist-http-inventory.json), [inspection](phase-5c-evidence/production-inspection.json) |
| Preview direct entry | `/`, `/play`, `/play?app=browser`, `/guide`, `/report`, `/missing` return entry HTML with HTTP 200; rendered route/reload behavior covered by browser suite | [inspection](phase-5c-evidence/production-inspection.json) |
| Vercel configuration | Used fields validate against official schema properties; local rewrite-policy cases checked. **Not a Vercel deployment test** | [validation scope/result](phase-5c-evidence/vercel-config-validation.json), [policy cases](phase-5c-evidence/production-inspection.json) |
| Normal preview console/network probe | **8/8 route + reload combinations pass**, desktop/mobile CTA works; 0 console errors, 0 page errors, 0 failed requests, 0 bad responses; 4 OpenGL performance warnings | [probe](phase-5c-evidence/console-preview-probe.json) |
| Optional Firefox/WebKit | Representative journeys **not executed**: patched engines absent; installed Firefox 159.0 failed Playwright launch | [availability record](phase-5c-evidence/optional-browser-availability.json) |

The first aggregate invocation overlapped the still-running clean install and stopped at `tsc: command not found`. It was restarted after install completion; the subsequent full aggregate passed. [Ordering-error log](phase-5c-evidence/check-install-overlap.log) is retained and is not counted as an application failure.

### Browser reproducibility and coverage

The initial Fedora system-Chromium 156.0.8078.73 run was stopped after **34 passed / 7 failed / 1 interrupted / 64 not run**, at 7.6 minutes. Failures concerned homepage keyboard/file selections, scroll choreography, repeated navigation and a renderer-navigation case; traces show time-budget/actionability failures under high software-rendering CPU load. This was not a clean full run and cannot be merged with later passes. [Diagnostic log](phase-5c-evidence/browser-system-diagnostic.log) and contexts under `phase-5c-evidence/browser-results/` are retained. Resource sensitivity is an attribution supported by timings/process inspection, not proof that every failure is harmless or a reproduced user-facing defect.

The already installed Playwright Chromium executable is used for the follow-up without downloading a browser, weakening assertions, disabling animations or modifying the stable one-worker infrastructure. The later measurement-only timeout adjustment is described below. The six targeted managed-Chromium cases passed (**6 passed / 0 failed**, [log](phase-5c-evidence/bundled-focused.log)). The final complete result is **106 passed / 0 failed** in 8.3 minutes ([full log](phase-5c-evidence/browser-final.log)); it is independent of the earlier diagnostic runs. The installed executable is `/home/muhammadshumin/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome`, version Google Chrome for Testing **156.0.8078.4** (Chromium engine). A passing alternative Chromium run does not establish Firefox/Safari support or erase the system-browser timing risk.

The first complete managed-Chromium run finished **104 passed / 2 failed** in 7.5 minutes ([log](phase-5c-evidence/browser-bundled.log), contexts in `phase-5c-evidence/bundled-browser-results/`). The C1 resize case sampled an optional source-inspection control before navigation committed, skipped inspection, then expected the comparison. The OS browsing case resolved an existing start button before home navigation, then waited on that retained OS node after it became hidden. Snapshots showed the usable source control and homepage CTA respectively. These are two concrete test synchronization defects, repaired without changing application source or weakening assertions. Focused repetitions and a fresh complete gate follow; earlier passes are not combined into a synthetic full pass.

The two synchronization fixes passed three repetitions in each viewport: **12 passed / 0 failed** ([log](phase-5c-evidence/synchronization.log)). The next full run was stopped after **57 passed / 1 failed / 1 interrupted / 47 not run** ([log](phase-5c-evidence/browser-collection-diagnostic.log)). Its only completed failure was the six-cycle renderer/forced-GC diagnostic: [trace timings](phase-5c-evidence/collection-timing.json) show all six navigation/canvas checks completing, followed by expiration of the total 30-second budget before the final heap comparison. This measures cumulative retention across repeated lifecycles, not one user interaction. Only that test definition (desktop/mobile cases) now has a **60-second total budget**; six cycles, node/listener thresholds and default expectation deadlines are unchanged. This is a scoped, evidence-backed harness correction, not a blanket timeout increase or an application performance improvement. The scoped memory check passed in both viewports (**2 passed / 0 failed**, [log](phase-5c-evidence/collection-focused.log)); the final full candidate run passed **106/106** with all original retention assertions.

Coverage comes from actual existing suite assertions: homepage/start CTA; all chapter progression; safe and unsafe choices; four/six exposure-specific recovery actions; ephemeral wrong-feedback reload; report recommendation counts/content and score limits; local save/resume/restart/reset; invalid/blocked/conflicting storage; keyboard, menu focus/Escape, reduced motion; window/mobile navigation and reflow at 320/360/390/768/1440 widths; renderer failures/missing-layer fallback; page errors and outbound requests in representative journeys. Deliberately blocked asset requests in fallback tests are expected test conditions, not unexplained production failures. The [separate normal-route probe](phase-5c-evidence/console-preview-probe.json) used two fresh contexts, normal animation and the real homepage CTA, then direct entry/reload on `/play`, `/guide`, `/report` and `/missing`. All eight viewport/route combinations fit without horizontal overflow. It recorded 0 console errors, 0 page errors, 0 failed requests and 0 bad responses. Four desktop OpenGL `ReadPixels` performance warnings remain in the raw record; they are not silently filtered. This is bounded local coverage, not a claim about every public session.

Reproduce locally, with the preview port free:

```sh
npm exec --yes --package=npm@11.6.3 -- npm ci
npm run check
# Use your installed compatible Chromium executable; this is the exact local final-run path:
PLAYWRIGHT_EXECUTABLE_PATH=/home/muhammadshumin/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome npm run test:smoke
```

The absolute executable is machine-specific test tooling, not a frontend/deployment path. The Fedora system executable `/usr/bin/chromium-browser` had the diagnostic failures above; do not describe it as a clean Phase 5C full pass. Default Chrome or installed Edge remains supported by the existing configuration; no machine-specific executable was written into deployment configuration. No frontend environment variables are required.

### Output, URLs and sensitive data inspection

The Vite app uses `BrowserRouter`, one static `index.html`, generated hashed JS/CSS and a lazy Pixi city chunk. There is no SSR, backend, account service, API deployment or frontend secret requirement. Default Vite base `/` and authored root-relative asset URLs are correct for a Vercel project at its origin root; do not mount this candidate under an untested URL prefix.

All 48 emitted files (6,475,425 bytes total, including unused public assets) were fetched locally with byte equality and appropriate non-HTML asset responses. The inventory includes fonts, wallpaper, city layers/compact variants, lazy chunks, favicon and license files. Existing font preloads and lazy renderer loading are retained. A missing file on the eventual host still needs the post-deployment negative-path check below.

No authored source environment-variable reads, local filesystem asset destinations or localhost API URLs were found. Targeted output scans found no private-key, AWS-access-key, GitHub-token or OpenAI-token patterns and no source maps. Two bundled `http://localhost` literals were reviewed as React Router fallback URL bases, not authored asset/API destinations. This is a bounded output/source inspection, not proof against every possible secret pattern. The owner must review files chosen for public repository publication; `.env*`, credentials, local tool profiles and identity/payment evidence must remain private.

## Prepared Vercel configuration and owner deployment instructions

No existing deployment configuration was present. The missing SPA fallback was the host-specific release risk requiring configuration. [vercel.json](../vercel.json) now declares:

| Setting | Prepared value / reason |
|---|---|
| Framework preset | `vite`; retain the existing React declarative SPA |
| Install command | `npm ci`; use the committed lockfile with strict engines/peers |
| Build command | `npm run build`; runs TypeScript then Vite |
| Output directory | `dist`; publish compiled output, not source/workspace |
| Rewrite | Extensionless application routes → `/index.html`; excludes `assets/`, `fonts/`, `pixel/`, `artwork/` and paths containing a dot |
| Runtime | Keep project Node 26.x, respecting `>=26.13.0 <27`; actual hosted patch/npm must be recorded from build logs |
| App environment variables | None; no `VITE_*` URL/key setup, functions or database needed |
| Caching | No custom override. Retain conservative platform revalidation for stable-name HTML/art/fonts and verify actual public responses. Do not give unversioned files an immutable year-long browser cache |

The filtered rewrite preserves direct `/play`, `/guide`, `/report`, query strings, and extensionless client not-found routes. It avoids serving the SPA HTML as a successful missing `.js`, font or image response. Existing files take precedence over rewrites. Paths containing dots that do not correspond to files receive a host 404; the application has no such route contract. Configuration validation covered used fields only: the downloaded vendor schema contains unrelated mixed-dialect function definitions, so this is not a claim of whole-schema/platform execution validation.

Vercel's [Vite SPA guide](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas) establishes the need for a fallback; its [configuration reference](https://vercel.com/docs/project-configuration/vercel-json#rewrites) documents filesystem precedence and negative-lookahead matching. [Node 26 availability](https://vercel.com/changelog/node-js-26-lts-is-now-generally-available-on-vercel) and [supported versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) confirm major-version support. This does not verify the owner's project settings or precise hosted patch. [Cache-Control documentation](https://vercel.com/docs/caching/cache-control-headers) describes the default revalidation policy. Sources checked 3 November 2026; owner must confirm the actual deployment.

**Owner actions only, after approval:**

1. Review this candidate and remaining risks; manage version control and publish the approved source in the team leader's public repository. Include the root `vercel.json`, lockfile, README, technical docs and credits. The agent has performed no Git operation or remote verification.
2. In the owner's Vercel account, import that repository only when deployment is explicitly authorized. Select the repository root as project root, Vite preset, Node 26.x, install `npm ci`, build `npm run build`, output `dist`. Do not override the engine floor, add secrets, select the `dist` directory as project root, or use `npm run dev/preview` as a hosted start command.
3. Inspect install/build logs for actual Node/npm and peer/engine errors. Keep strict checks. If hosted Node is below 26.13.0 or a setting conflicts with the root config, stop and resolve rather than bypassing engines.
4. Ensure the submitted production URL is publicly accessible without a Vercel login/protection prompt. Wait for a successful deployment, then execute the public checklist below in a fresh signed-out session.
5. Record the exact source revision (owner-managed), deployment ID, URL, UTC/WITA/WIB timestamp, browsers/devices and results. Keep the previous verified deployment available for owner-controlled rollback. Saves are origin-scoped: preview/custom domains have separate progress; changing domains does not migrate saved games.
6. If a public blocker appears, do not submit that deployment. Owner may restore the last verified deployment through Vercel, rerun public checks and re-record links/results. Do not reset player saves or alter content/schema IDs to fix a hosting problem.

No deployment CLI, account connection or project mutation is needed to review this preparation.

## Submission checklist and missing briefing evidence

The [page-specific official requirement matrix](mit-week-requirements.md) remains authoritative. PDF page 1 is the cover. Initial judging weights (p. 6): Functionality 35%, Case fit 25%, UI/UX 20%, Code/maintenance 10%, Documentation 10%. The final rubric differs (p. 7); do not present an internal diagnostic as an official score.

| Required item | Local preparation | External owner status / evidence to fill |
|---|---|---|
| Public GitHub repo owned by team leader; complete source (pp. 3/5) | Source/docs/lockfile present; Git untouched | **Unchecked:** actual URL, ownership, signed-out access, approved revision |
| Public working website / HTTPS (pp. 3/5) | Build and Vercel config prepared | **Unchecked:** actual URL, successful build, TLS, fresh-session journeys and route reloads |
| README: main features, usage and running instructions (p. 5) | Present and reviewed; current checks and limitations linked | Owner confirms published README corresponds to deployed candidate and adds actual live/repo/video links |
| Technical documentation (pp. 3/5) | Architecture, engine/save/testing contracts, validation and release instructions present; historical plans labeled | Owner checks public links and final consistency |
| Third-party assets/software and licenses (p. 3 C4) | [Credits](asset-credits.md), font OFLs, generation records and [25 direct package declarations](phase-5c-evidence/direct-dependency-licenses.json) present | **Unchecked:** final redistribution notices, transitive/significant resource review, rights to supplied concept reference |
| AI/originality (p. 3 C3/C10) | AI tools allowed; generated asset/code/copy provenance documented; no special declaration template specified | Owner confirms development during competition period, originality, team contribution and any later organizer instructions |
| Video link ≤5 minutes, team introduction + main features (p. 3 C8, p. 5) | [4:40 storyboard and script](mit-week-demo-video-plan.md) prepared | **Not produced/verified:** record, export, measure duration, upload, check signed-out access |
| Official work-submission Google Form (pp. 4/5) | Required material list prepared | **URL not supplied:** obtain official form; registration form is not the submission form; owner submits and retains receipt |
| Deadline (p. 4 D) | **10 November 2026, 23:59 WITA = 22:59 WIB = 15:59 UTC** | Owner confirms amendments and submits all links before deadline |
| Registration/eligibility/TM (pp. 2–4) | Rules traced; no private participant records inspected | Owner confirms active-student eligibility, registration/payment, ≤4 members, TM attendance and required administration |

**Separate unresolved case evidence:** the original guide confirms the broad Guardians of the Digital Space theme but says the detailed case is delivered at briefing (pp. 2/5). It does not contain “The Trust Trap: Navigating Digital Deception.” The owner must supply/confirm the original briefing and any amendments before claiming exact case compliance. This is distinct from a missing guide, broken app or missing public deployment.

## Public verification checklist — owner executes after deployment

All boxes below are intentionally unchecked. Record pass/fail, URL/deployment ID, date/time with timezone and evidence; do not copy local results into this checklist.

- [ ] Open the final public URL from a fresh signed-out/private browser, preferably another network/device. No hosting login, access request, blank screen or redirect loop.
- [ ] Confirm valid HTTPS certificate and no mixed-content errors on the actual submitted hostname.
- [ ] Confirm homepage, city animation/pause, primary start CTA and OS interface. Check DevTools for page errors and unexpected failed JS/CSS/font/image requests.
- [ ] Directly paste and reload `/play`, `/guide` and `/report`, plus `/play?app=browser`; incomplete progress must keep the report guard, not unlock fabricated results. Test an extensionless unknown route for the app's not-found view.
- [ ] Inspect generated JS/CSS, wallpaper/city and fonts: HTTP 200 and correct non-HTML MIME types. Request `/assets/definitely-missing.js`, `/fonts/definitely-missing.woff2` and `/pixel/definitely-missing.png`: expect host 404, not HTTP-200 SPA HTML. Verify the prepared rewrite is actually active.
- [ ] Inspect HTML/route and asset caching after reload and after any redeploy; stable-name art/fonts and HTML must update correctly. Confirm no local-only destination, unnecessary API key, exposed secret or unexpected gameplay transmission.
- [ ] Complete a safe C1–C3 journey, four-action preventive recovery and personalized report in a dedicated profile. Refresh/resume; compare saved choices and report. Confirm no invented identity/account exposure.
- [ ] In a separate fresh profile or after the in-game confirmed restart, share simulated identity and then the fictional code; complete the six contextual recovery actions and inspect the actual report/advice. Never enter real identity/credentials. Wrong recovery feedback is temporary; successful actions persist.
- [ ] Check confirmed restart/reset and incomplete-save resume without overwriting unrelated browser data. Use one active game tab; verify conflict handling if checking a second tab.
- [ ] Check a narrow mobile viewport: Saku menu, app switching, chat/portal comparisons, recovery/report scrolling, no horizontal overflow. Test a physical phone and orientation when available; record real device versus emulation accurately.
- [ ] Complete a keyboard path: Tab/Shift+Tab, Enter/Space, radios, visible focus, menu focus/Escape restoration. Enable reduced motion and confirm the static city/readable controls and playable game. Arrange screen-reader and Firefox/Safari checks separately if available.
- [ ] Open the public leader-owned repository signed out. Verify approved source, README commands, architecture and asset/license/AI provenance links; keep private identity/payment/credential files out of publication.
- [ ] Open the video link signed out, play it through, confirm audio/readability and total duration **≤5:00**. Check it shows the actual submitted candidate and real team introduction.
- [ ] Obtain the official submission form, verify all actual repo/site/video links, confirm briefing/amendments and deadline/timezone. The owner enters and submits the form; the agent does not.
- [ ] Retain final submission receipt/confirmation with timestamp and a copy of submitted links. Recheck accessibility through judging; a verified hosting-provider outage has a limited fallback rule (p. 3 C7), not a blanket exemption for participant-side routing errors.

## Outstanding risks and approval boundary

- Public platform routing/headers/caching, HTTPS, deployment protection, repository ownership/access, video and form receipt are **unverified**; they remain release/submission gates until the owner completes the checklist.
- System-browser timing variability is retained as a reproducibility risk. No app code was changed to hide it; two observed test synchronization defects and the scoped repeated-GC budget were repaired transparently; final Chromium results must be read with the exact executable recorded.
- Firefox/WebKit/Safari, physical phone, screen-reader and representative new-player comprehension/retention remain unverified. Emulation/keyboard checks are not WCAG or learning-effect certification.
- The existing entry-size warning, four OpenGL performance warnings in the console probe, and unthrottled software-rendering behavior warrant representative device checks; no loading/animation redesign or performance improvement is claimed.
- Clean install still reports 11 moderate development-tool findings and ESLint 9 support deprecation. Phase 5B records the incompatible downgrade suggested by the audit; no force fix or unrelated upgrade was applied here. This is not dependency-security clearance.
- `public/` includes the supplied city-concept reference (1,999,410 bytes), even though the runtime uses generated layers instead. Owner must confirm publication rights/provenance for every public file and final notices; no original asset was removed or replaced.
- No changes to content IDs, scoring or saved event format were needed. Owner review of wording/provenance remains appropriate, but no new product capability is required by this preparation.

Stop after Phase 5C preparation. Approval of this document does not itself mean deployment or submission occurred. Public operations remain controlled by the Product Owner.

**Final preparation verdict:** local candidate and both required documents are ready for owner review. Approve public release only after the unchecked public/administrative gates are verified; this delivery stops at preparation.
