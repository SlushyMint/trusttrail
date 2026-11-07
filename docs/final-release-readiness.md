# Final release readiness

Hosting follow-up: [Vercel Preview preflight](vercel-preflight.md) adds
CLI-upload exclusions for private files and the unused concept image. Ordinary
unfiltered local builds still copy that reference; publication rights remain
unresolved.

Review date: **7 November 2026, Asia/Jakarta**. Candidate: **0.1.0, Phase 6
SFX-only**.

**Disposition: locally validated candidate for Product Owner review; public
release and submission remain blocked by owner actions below.** No gameplay,
scoring, source, dependency pins, or deployment configuration changed. No Git
operations, deployment, or submission were performed.

## Scope and source of truth

Reviewed the previous README, GDD, production blueprint,
architecture/state/schema documentation, all three authored chapter modules,
reducer/recovery/recommendation contracts, persistence, report, onboarding, OS
shells, audio service and motifs, package scripts, test journeys, Vite preview
middleware, Vercel configuration, asset credits, and retained security/test
evidence.

The [final SFX-only report](phase-6-audio-security-report.md) supersedes the
earlier ambient-audio report. Its `phase-6-sfx-evidence/` logs support 137
unit/integration passes and 152 browser passes on 6 November. Historical
ambient-audio counts and measurements are not presented as current behavior.
Current source defines seven short motifs, no background soundtrack, separate
audio preferences, accepted-event gameplay persistence, and action-derived
report facts.

The supplied eight-page competition guide was read locally again with
`pdftotext`. This review did not copy its contents, identity/payment material,
or original PDF into a new public artifact. The owner must review the original
root PDF and existing rule summaries before making the repository public. The
separate briefing case and later organizer amendments remain unverified.

## Engineering checks

Runtime: Node **26.13.0**, npm **11.20.0**; declared npm target **11.6.3**.
Fedora Chromium `/usr/bin/chromium-browser`; desktop and Pixel 7 emulation.
Tests run against a production build, not the Vite development server.

| Check                       | Result and evidence                                                                                                                                                                |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript                  | PASS, `npm run check`; [log](final-release-evidence/check.log)                                                                                                                     |
| ESLint                      | PASS with zero warnings; same engineering log                                                                                                                                      |
| Unit/integration            | PASS, **137/137**, 14 files; same engineering log                                                                                                                                  |
| Production build            | PASS; same engineering log. Entry JS 556.83 kB, Vite gzip estimate 173.19 kB. Existing >500 kB warning retained                                                                    |
| Browser regression          | **PASS, 152/152**, 76 desktop + 76 mobile, 6.5 minutes, no failures/skips/retries; [log](final-release-evidence/browser.log)                                                       |
| Clean installation          | PASS, `npm ci` against copied package/lock/config in `/tmp/trusttrail-release-install`; [log](final-release-evidence/clean-install.log). Project dependencies untouched            |
| Production dependency audit | PASS, **0 findings**; [registry result](final-release-evidence/npm-audit-production.json)                                                                                          |
| Full dependency audit       | **7 moderate, 0 high, 0 critical**; [registry result](final-release-evidence/npm-audit.json). Expected audit exit code 1, not a clean dependency tree                              |
| Release security script     | PASS, no matched secret patterns, exposed configuration/source maps, missing integrity metadata, or non-registry lock sources; [result](final-release-evidence/security-scan.json) |
| Judge walkthrough           | PASS, opening, tutorial, evidence, C1–C3, source comparison, recovery, report, desktop/mobile shell transition; [observations](final-release-evidence/judge-journey.json)          |

Clean install used current npm 11.20.0 and the existing exact lockfile. The
declared npm 11.6.3 install remains supported by retained
[runtime evidence](node-26-compatibility.md); it was not freshly repeated under
that npm version. Installation warns that ESLint 9 is no longer supported
upstream. No upgrade or `npm audit fix` was applied.

An offline audit returned an empty advisory set and is **not** accepted as
vulnerability evidence. Online attempts initially failed with sandbox DNS
restrictions; authorized retries against the official registry succeeded. The
fresh seven development entries still trace to one minimatch advisory,
GHSA-g3hv-75wg-m249, through TypeScript-ESLint tooling. No game input becomes a
build glob. Preserve the distinction between moderate development exposure and
zero reported production findings.

## Judge journey and screenshots

An adapted existing Playwright journey ran against a separate production preview
on port 4174 while the unchanged regression suite owned port 4173. It used
actual clicks and choices, not injected progress or fabricated report values.
The new journey runner is
[retained for reproduction](../output/playwright/judge-journey.mjs);
browser-only captures and intermediate output are under `output/playwright/` for
owner review, not automatically selected for publication.

Sequence exercised:

1. Homepage → new investigation → opening narrative → first invitation.
2. Tutorial: Mail → Browser → Case Files → completion; return to Mail.
3. Resize the same session from Lacak OS to 390px Saku and back.
4. Inspect the sender; choose to ignore Chapter 1's invitation and continue
   through reflection.
5. Advance Mira's conversation; choose simulated identity disclosure in
   Chapter 2.
6. Inspect the portal address, HTTPS indicator, and code requirement. Read the
   independent procedures, match the real company domain and recruitment
   requirement, then record the comparison.
7. Choose to share the fictional code; enter Recovery Mission. Exercise an
   incorrect recovery answer, then complete all six exposure-specific actions.
8. Open Trust Report. Reload and compare report text and raw saved event
   history: both unchanged. No uncaught page errors were recorded.

The mixed-risk report deliberately shows incomplete early evidence and unsafe
later choices. It demonstrates personalization rather than perfect-play
marketing. The full regression additionally covers safe paths, four-action
recovery, storage failure/conflict, keyboard controls, reduced motion, report
gating, SFX lifecycle, and narrow layouts. This walkthrough does not constitute
an exhaustive manual review of every control or a physical-device test.

Five reviewed production screenshots are linked relatively from the README:

| Image                                                                    | Capture size | Optimized bytes |
| ------------------------------------------------------------------------ | ------------ | --------------: |
| [Homepage](release-screenshots/homepage.webp)                            | 1440 × 900   |          64,356 |
| [Lacak OS investigation](release-screenshots/investigation-desktop.webp) | 1440 × 900   |          84,986 |
| [Verification](release-screenshots/verification.webp)                    | 1440 × 900   |          85,326 |
| [Trust Report](release-screenshots/trust-report.webp)                    | 1440 × 900   |          68,440 |
| [Saku mobile](release-screenshots/saku-mobile.webp)                      | 390 × 844    |          27,846 |

Total **330,954 bytes**, approximately **323 KiB**. ImageMagick converted
authentic PNG captures to WebP at quality 82 and stripped metadata; no content
was composited, retouched, or generated. Captures contain application UI without
browser chrome, debugging overlays, or runtime error screens. The verification
view includes its real evidence receipt. The report viewport shows its first
chapter; the complete report remains scrollable in the application.

## README and documentation validation

The README leads with the recruitment story, an actual homepage capture,
setup/playing links, and two compact groups of Shields.io badges. Palette: navy
`183044`, teal `176454`/`77D6C2`, amber `BF8B36`; consistent `flat-square`
style. React, TypeScript, and Vite use supported logo slugs; Playwright uses a
text badge without an unsupported logo claim. No GitHub Actions workflow was
found, so no dynamic CI badge was invented. Test counts explicitly identify the
retained **6 November snapshot**, even when an independent rerun is available.

Badge syntax follows the
[Shields.io static-badge documentation](https://shields.io/badges/static-badge).
Each badge links to the relevant README section. These are external README
resources, separate from the local-only gameplay asset model.

Prettier from the existing temporary npm cache formats only the new/updated
Markdown. `markdownlint-cli2` checks both deliverables with all default
structural rules, except MD013 line length, which is disabled for GitHub tables
and long badge URLs. No project formatter/linter dependency was added. Relative
paths and anchors are checked by a local validator; new image files are decoded
and visually inspected. Final formatter, link, and diagram evidence is recorded
in the validation addendum below.

No Lychee or Lighthouse executable was available. Link checks use a local
path/anchor validator and HTTP requests instead. No Lighthouse, field Web
Vitals, real-device performance, battery, test-coverage, or accessibility
conformance score is asserted. The Vite size warning is a known delivery-cost
limitation; feature freeze remains intact.

## Hosting and security boundaries

`vercel.json` selects Vite, `npm ci`, `npm run build`, and `dist`. Its rewrite
sends application paths to `index.html` while excluding `/assets/`, `/fonts/`,
`/pixel/`, `/artwork/`, and dotted paths. This supports `/play`, `/guide`, and
`/report`; report access still requires completed game state. Deployment at the
origin root is assumed; a subpath deployment is not configured or verified.

Local production preview mirrors the staged headers and returns missing static
assets as 404 rather than HTML. Browser fixtures verify those boundaries,
anti-framing, hostile query/save rendering, and inert simulation destinations.
Enforced CSP restricts base/object/frame/ancestor/form behavior. The stricter
self-origin resource/script policy remains **report-only** because Pixi uses
dynamic shader generation; no enforced script-XSS guarantee is implied. No CSP
reporting collector is configured.

The source/public/dist pattern scan excludes private credential directories and
Git metadata by design. It is bounded evidence, not a proof that every
repository file is safe to publish. `dist` contains local public assets and
bundled code; no tested secret/config/source-map exposure was found.
`.gitignore` covers dependencies, builds, caches, `.env` files, and standard
test output, but does **not** explicitly exclude `.aws/`, `.codex/`, `.agents/`,
`output/`, or the organizer PDF. The private directories inspected were empty.
Without Git operations, index/history/publication contents cannot be verified.
The owner must select and review the public file set, including historical docs,
traces, and organizer materials.

## Unresolved blockers and manual owner actions

No release-blocking gameplay defect was demonstrated in the judge walkthrough.
Public release is **not signed off** until these real-world items are resolved:

1. **Asset publication rights.** Confirm permission for
   `public/assets/city-layer-concept.png`. It is unused visually but copied into
   `dist`; existing asset credits explicitly leave its provenance clearance
   open. Do not publish it without rights confirmation. Removing/changing
   release assets would require a separately reviewed build.
2. **Project distribution terms.** Decide the source/artwork license. No
   project-wide LICENSE is present. Preserve upstream dependency notices and the
   three bundled font OFL notices. MIT-WEEK is a competition name, not an
   MIT-license claim.
3. **Private publication review.** Confirm which original organizer materials
   may be public; review the root PDF, historical source excerpts, evidence
   artifacts, private directories, and any staged/history contents
   independently. This review publishes nothing and uses no Git commands.
4. **Public infrastructure.** Owner creates/authorizes deployment and verifies
   HTTPS, actual response headers/CSP disposition, caching, content types,
   deep-link refresh, missing assets, and clean-profile access on the public
   origin. No public URL was supplied or verified; README deliberately omits a
   demo link.
5. **Competition completeness.** Confirm leader-owned public repository, actual
   team identity, eligibility/registration/TM, official briefing-case fit,
   latest amendments, video access/duration, final submission form, and
   submission receipt. Local evidence cannot establish these.

Additional validation before release: physical mobile device, a second browser
engine, and a screen-reader session. No such passes are claimed. Resolve
performance concerns through real production measurements rather than inferred
scores.

## Submission checklist

The locally supplied guide requires a leader-owned public source repository with
README/technical documentation, accessible live deployment, and a demo video
with a brief team introduction and main-feature walkthrough lasting **no more
than five minutes**. It states **10 November 2026, 23:59 WITA**, equivalent to
**22:59 WIB / 15:59 UTC**. Reconfirm amendments privately with the organizer;
the guide does not supply the final submission-form URL.

- [x] Source-backed README, usage instructions, architecture diagrams, and
      credits prepared.
- [x] Production build, engineering checks, security scans, and authentic
      gameplay captures recorded.
- [ ] Product Owner approves final documentation and candidate.
- [ ] Confirm reference-image rights, distribution terms, font/dependency
      notices, and public file selection.
- [ ] Confirm actual solo developer/team identity and repository ownership;
      owner performs all Git work.
- [ ] Authorize deployment separately, then test public
      URLs/headers/routing/cache and add the verified demo link.
- [ ] Complete physical-device, second-engine, and screen-reader checks or
      record accepted limitations.
- [ ] Record/review the ≤5-minute video; verify repository, deployment, and
      video access without the owner's login.
- [ ] Confirm official briefing case, eligibility/administration, latest
      deadline, and final form.
- [ ] Owner submits before the confirmed deadline and retains the receipt.

Stop at Product Owner review. This report does not authorize publication,
deployment, or submission.

## Final validation addendum

- **Browser suite:** the complete independent run passed **152/152** on 7
  November; the log records one clean run, not combined results. The README
  intentionally keeps its explicitly dated 6 November snapshot badges.
- **Document structure:** Prettier check and markdownlint-cli2 pass on both
  deliverables. Only MD013 line length is disabled; heading, link text,
  fenced-code, table, and list rules remain enabled.
  [Formatter log](final-release-evidence/prettier.log),
  [Markdown lint log](final-release-evidence/markdownlint.log).
- **Relative links and anchors:** all 54 checked targets resolve, including
  screenshot paths and cross-document anchors.
  [Link results](final-release-evidence/document-links.json). No link to an
  invented live demo was added.
- **Diagrams:** both diagrams parse and render under Mermaid **12.3.0** using
  basic GitHub-compatible flowchart syntax, without external images, callbacks,
  custom HTML, or initialization directives. Mermaid was installed only under
  `/tmp/trusttrail-doc-tools`; project manifests and lockfile were not changed.
  [Parser/render results](final-release-evidence/mermaid.json). GitHub's
  deployed renderer/version itself was not accessed.
- **Local commands/HTTP:** `npm run dev` starts at port 5173; production preview
  starts at port 4174 for this isolated walkthrough. Home, `/play`, `/guide`,
  and `/report` return 200 HTML; a nonexistent JavaScript asset returns 404.
  Preview responses contain both the enforced baseline and report-only CSP.
  [HTTP results](final-release-evidence/local-http.json). Browser report-gating
  tests separately confirm that HTTP 200 does not unlock an incomplete run.
- **External badge delivery:** all seven Shields.io requests returned **403
  Forbidden** from this environment; an independent web-tool attempt also could
  not retrieve them. Syntax follows the official badge API, but live SVG
  delivery, supported-logo appearance, and final GitHub rendering remain
  **unverified owner checks**, not passing link results.
  [Request evidence](final-release-evidence/badge-http.json). Reopen the README
  from GitHub before publication approval and verify both compact rows, readable
  labels, images, links, and rendered diagrams.
- **Scoped documentation quality:** purpose and features are tied to source;
  screenshots retain the approved city/pixel identity; report numbers match the
  actual journey. No interface redesign or new application assets/features were
  introduced. Application-wide visual/accessibility certification is outside
  this documentation review.
