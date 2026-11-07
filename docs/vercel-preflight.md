# Vercel Preview deployment preflight

7 November 2026, Asia/Jakarta. TrustTrail **0.1.0**, Phase 6 SFX-only.

**Local preflight passes with publication safeguards added. Preview deployment
remains pending owner authorization and target-project confirmation.** No Git
operations, deployment, project linking/creation/deletion, or cloud-setting
changes were performed.

## Account and project status

Vercel CLI **65.12.1** is installed. Read-only `vercel whoami`,
`vercel project ls`, and `vercel teams ls` succeeded after retrying outside
sandbox DNS restrictions:

- Authenticated account: `slushymint`.
- Available/active scope: `slushymints-projects`, Hobby plan.
- No TrustTrail project appeared in that scope's project list.
- No local `.vercel/project.json` exists. No TrustTrail cloud configuration
  could be inspected because there is no identified project.

No Vercel MCP tools were exposed by this session's tool catalog; the
authenticated official CLI provided the read-only checks. No MCP setup, account
connection, environment download, or credential-file read was attempted.

`vercel deploy --dry --json` was attempted only in its documented non-uploading
inspection mode. It refused to continue because the directory is unlinked:
[diagnostic](vercel-preflight-evidence/vercel-dry.log). No project was linked to
bypass this limitation. The CLI's full upload manifest and project-specific
overrides remain unverified.

## Local preparation

Added [.vercelignore](../.vercelignore) to exclude local Vercel/Git/account
metadata, credential directories and common credential formats, environment
files, dependencies/build output, temporary browser/test/cache artifacts, all
`docs/` evidence, PDFs, planning materials, and the uncleared concept reference.
Tests and source remain included because the build's TypeScript configuration
includes them. Font licenses under `public/fonts/` remain included.

Extended [.gitignore](../.gitignore) for `.vercel/`, `.aws/`, `.codex/`,
`output/`, and `.vitest/`. This edits an exclusion file; it performs no Git
operation. These rules do not remove previously tracked files, change history,
or certify the eventual public repository. `.vercelignore` governs the intended
**CLI source upload**; only the configured build output is intended to be
served. Repository publication remains a separate owner review.

A local projection applied `.vercelignore` using the already-installed `ignore`
package. It selected **201 files** and passed 14 exclusion probes:
[projection](vercel-preflight-evidence/upload-projection.json). This is
explicitly not the official Vercel manifest. A temporary copy of those inputs
built successfully using a symlink to the existing installed dependencies; no
new dependency was installed.
[Filtered output inspection](vercel-preflight-evidence/filtered-build.json).

## Uncleared concept image

`public/assets/city-layer-concept.png` is **not referenced by runtime source,
CSS, tests, or build scripts**. Search results identify historical/provenance
references in:

- `docs/living-city-phase-b/generation-prompts.json`
- `docs/living-city-phase-b.md`
- `docs/living-city-assets.md`
- `docs/asset-credits.md`
- `docs/phase-5c-evidence/dist-http-inventory.json`
- The final release-readiness documentation

Those records establish that it was user-supplied generation guidance, not a
cropped runtime texture. They do not establish its publication rights or clear
the generated artwork's rights on the owner's behalf.

**Recommendation:** remove the unused reference from `public/`, retaining a
private copy outside publication inputs if needed. This preflight preserves the
original file rather than deleting/moving it; `.vercelignore` excludes it from
the proposed CLI upload now. In the filtered build it is absent from both
`public/` and `dist/`, and its HTTP path returns **404**. All three bundled
font-license notices survive.

**Important boundary:** an ordinary build from the unchanged full working
directory still copies this image into local `dist`. Do not manually upload that
`dist`, publish the full `public/` tree, or use an alternative deployment path
that bypasses the exclusions. The owner must either approve its removal from
`public/` or verify the actual filtered Vercel upload before deployment.
Excluding this file does not resolve all project licensing/publication
decisions.

## Hosting configuration

| Setting           | Finding                                                                                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework         | `vite` in `vercel.json`; Vite 8.3.5 in the locked manifest                                                                                                   |
| Node              | `>=26.13.0 <27.0.0`; `.nvmrc` 26.13.0. Vercel supports 26.x and selects current minor/patch versions; actual remote patch is not locally verified            |
| Install           | `npm ci`; exact lockfile retained; `engine-strict=true` retained                                                                                             |
| npm               | Declared target 11.6.3; local executable 11.20.0. `packageManager` alone does not prove Vercel will execute npm 11.6.3; inspect the first remote install log |
| Build             | `npm run build` = TypeScript check followed by Vite build                                                                                                    |
| Output            | `dist`; no server/database/functions required by gameplay                                                                                                    |
| Root/base         | Repository root and origin-root hosting assumed; no subpath configuration                                                                                    |
| SPA               | `/play`, `/guide`, `/report`, and recognized query-based app navigation; unknown application paths use the client not-found view                             |
| Static exclusions | Rewrite excludes `assets/`, `fonts/`, `pixel/`, `artwork/`, and dotted paths, preserving missing-static-file 404s                                            |

Vite preview has middleware mirroring these boundaries and configured headers.
Vercel's actual edge routing, build runtime, npm selection, response headers,
HTTPS, cache behavior, and Deployment Protection cannot be certified before an
authorized deployment.

Official sources:
[Node version selection](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions),
[Node 26 availability](https://vercel.com/changelog/node-js-26-lts-is-now-generally-available-on-vercel),
[package managers](https://vercel.com/docs/package-managers),
[upload exclusions](https://vercel.com/docs/deployments/vercel-ignore),
[dry-run inspection](https://vercel.com/changelog/dry-run-deployments-with-vercel-cli).

## Actual local results

| Check                           | Result                                                                                                                                                                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run check`                 | **PASS:** TypeScript, zero-warning ESLint, **137 unit/integration tests**, production build; [log](vercel-preflight-evidence/check.log)                                                                                                   |
| Focused Playwright              | **24/24 passed**, desktop/mobile, 39.3s; security, foundation/routes, Chapter 3/recovery/report; [log](vercel-preflight-evidence/browser.log)                                                                                             |
| Existing release security scan  | **PASS:** no matched secret-pattern/config exposure, missing integrity metadata, or non-registry sources; [result](vercel-preflight-evidence/security-scan.json)                                                                          |
| Filtered-input production build | **PASS:** 47 output files, no concept/private-output matches, three font notices present; [inspection](vercel-preflight-evidence/filtered-build.json)                                                                                     |
| Filtered production HTTP        | **PASS:** home, `/play`, `/play?app=mail`, `/guide`, `/report` return 200 HTML; missing JS, concept image, `.vercel/project.json`, `.env`, and excluded documentation return 404; [results](vercel-preflight-evidence/filtered-http.json) |

The 24 browser tests are a focused rerun, not a new 152-case full-suite claim.
The earlier full **152/152** run and clean-install evidence remain in
[final release readiness](final-release-readiness.md). This preflight reused
installed dependencies; it did not repeat `npm ci` or fresh registry audits. The
retained same-day audit evidence reports zero production findings and seven
moderate development entries. The existing >500kB entry-bundle warning remains;
no performance score is claimed.

Headers retain enforced base/object/frame/ancestor/form restrictions, `nosniff`,
`no-referrer`, disabled sensitive capabilities, and `X-Frame-Options: DENY`. The
stricter self-origin resource/script CSP remains **report-only** because Pixi's
dynamic shader generation is incompatible with that stricter script policy.
Focused browser fixtures cover malicious query/save rendering, inert simulation
destinations, framing, and missing assets. No policy was weakened or promoted to
enforced. Pattern scans and local preview checks are bounded evidence, not
certification.

## Preview checklist and future owner command

Before authorizing the first Preview:

- [ ] Approve the account/scope and project name, including creation of a new
      `trusttrail` project if that is intended.
- [ ] Confirm removal of the concept reference from public build inputs or
      inspect the official filtered upload manifest; preserve font/dependency
      notices and resolve remaining distribution terms.
- [ ] Review `.vercelignore` and public repository contents separately.
      Organizer PDFs, credentials, and test evidence must not be published
      unintentionally.
- [ ] Once a target is authorized/linked, rerun `vercel deploy --dry --json` and
      inspect every included path. Linking itself is a later authorized action,
      not performed here.
- [ ] Confirm Node 26 availability in the selected project/build environment and
      acceptable npm version. No application secrets are expected; do not upload
      credential files to satisfy setup.
- [ ] Authorize **Preview only**. Existing test/build results apply to the
      current frozen source and reviewed exclusions.

If the owner authorizes **both project creation in the confirmed scope and
Preview deployment**, the exact non-interactive command from the repository root
is:

```sh
vercel deploy --environment=preview --scope=slushymints-projects --project=trusttrail --create-if-missing --yes
```

**Do not run this until authorized.** It can create a cloud project and
upload/build the filtered source. The scope is observed; `trusttrail` is a
proposed name requiring owner confirmation. The explicit preview environment
avoids a production deployment. It does not use `--prod`, `--prebuilt`,
`--temporary`, or `--verify`; the latter may create an automation-bypass secret
and is unnecessary here. Existing local `dist` is excluded and rebuilt remotely.

If the owner instead selects an existing project, replace `--project=trusttrail`
with the confirmed project ID/name and omit `--create-if-missing`. Do not deploy
to another project merely because it appears in the account list.

After an authorized Preview exists, inspect its install/build logs and actual
Node/npm versions, then verify routes and refresh, report gating, asset
MIME/404s, TLS/headers/CSP disposition, SFX, persistence, desktop/mobile
gameplay, and clean-profile access/Deployment Protection. Preview origin storage
is separate from localhost and from any future production origin. Capture those
results before considering any production release or judge-facing link.

**Stop: owner review required. No deployment has been executed.**
