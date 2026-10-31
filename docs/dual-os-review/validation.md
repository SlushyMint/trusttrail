# Adaptive dual-OS · design review validation

**Current status:** both representative designs were approved by the Product Owner. Production integration is complete; see [production validation](../dual-os-integration/validation.md).

The original review record below is retained as design history.


29 October 2026. **Ready for joint Product Owner review. Full production dual-OS integration has not begun.**

## Screens and exact state

- [Desktop Mail, 1440 × 960](desktop-mail.png)
- [Saku Mail, 390 × 844](mobile-mail.png)
- [Saku home, same progress](mobile-home.png)
- [Saku Case Files, same progress](mobile-case-files.png)
- [Desktop verification](desktop-verification.png) / [Saku verification](mobile-verification.png)
- [Expanded Saku Case Files, 768px](tablet-case-files.png)
- [360px home](mobile-360-home.png) / [360px Mail](mobile-360-mail.png)
- [Design system, breakpoints, navigation contract and architecture boundary](design-spec.md)

The main desktop and mobile screenshots come from **one running session resized without a page reload**. Both have `C1-E01` discovered, no committed choice and no inspected source. Reopening the already discovered sender to expose the detail in the new shell is idempotent. [The check manifest](checks.json) records their matching discovered-evidence IDs. Home and Case Files are alternate views of that same progress. The verification images intentionally show a later, equally matched state: three hotspot clues and the source inspected, before source comparison.

The images are captures of interactive React screens. Wallpaper is the approved original decorative asset. No game interface, clue text or controls are baked into an image. No new generated artwork, external assets or dependencies were required.

## Results

| Verification | Result |
|---|---|
| TypeScript / ESLint | Pass |
| Existing unit / integration tests | 37 / 37 pass |
| Existing production desktop / mobile browser tests | 32 / 32 pass |
| Default production build | Pass; production entry retained |
| Separate review build | Pass; adds only `dual-os.html` to the explicit review build |
| New dual-OS review browser checks | 13 / 13 pass |
| Required widths | 360, 390, 768 and 1440px tested with all clues, source verification, decision, outcome and reflection |
| Touch emulation | 360px sender inspection, notification, app switch and Case Files detail tested using tap |
| Live viewport changes | Sender discovery and a pending verification survive desktop → compact → expanded → desktop transitions |
| Source semantics | Opening Browser earns nothing; inspect is required before compare; late source evidence never earns retroactive awareness |
| Navigation | Browser Back/Forward and in-game Back traverse app/inbox/detail routes; evidence remains recorded |
| App switcher | Native modal dialog, visible Close, Escape and explicit focus return tested |
| Overflow | No horizontal document overflow at required widths or breakpoint boundaries |
| Save isolation | No application calls to Storage get/set/remove/clear during review interactions; an existing-save sentinel remains unchanged |
| Runtime | No normal-flow page errors or external runtime requests |
| Asset failure | Mail and sender inspection remain usable when wallpaper fails |
| TasteSkill source app lint | 0 failures; OS metadata, real chapter numbering and pixel shadow warnings documented |
| TasteSkill built-preview inspector, all required widths | 0 failures; short system-label density warning retained |

Checks are in `scripts/validate-dual-os-review.mjs` and their machine-readable output is [checks.json](checks.json). The existing test files, scenario data, reducer, scoring and persistence adapter have not been edited.

## Visual / accessibility review

Inspected real-browser screenshots for desktop, compact Saku, expanded Saku and verification. The desktop retains the approved asymmetrical Mail/Case Files composition. Mobile has its own home, status bar, full-bleed applications and system navigation; no desktop frame or window controls are rendered. The 768px layout uses expanded Saku with native app headers, a five-icon home and a two-pane Mail view when reading space permits.

Long-form Saku email and source text is 15px, evidence explanations are 14px, and metadata is at least 11px. Primary touch controls are 48px. Notification banners reserve layout space and never overlay content. Source and invitation excerpts are separately labelled and stack inside Browser’s vertical scroll area. No zoom, hover, drag or swipe is required. Persistent Home and app switching remain outside the scrollable document.

The flow checks caught a focus-return issue after Escape from the app switcher. It now explicitly restores focus to its trigger; desktop app navigation focuses the foreground window title. Strictly native browser-history navigation is used within this isolated entry and no history trapping is installed. Read-only DOM/app details can collapse on shell remount; canonical gameplay state remains in the stable parent reducer.

Self-review: design 8, usability 8, creativity 8, content 8 (weighted 8.0/10). The remaining inspector warning concerns 11–12px OS labels, not long reading content. The only inspector exceptions are `button-fx` / `heavy-shadow` for intentional pixel bevels and floating desktop windows. Original home-screen app icons are OS objects, not SaaS metric cards. No gradient/glass/glow/glitch effects are introduced.

This is Chromium desktop/mobile and touch emulation, not physical-device or screen-reader certification. Production persistence/error handling is covered by the retained M1 tests; persistence is intentionally not connected to the new design prototype. Approval of this prototype does not claim production dual-OS integration is complete.

## Scope / schedule / approval source

The Product Owner’s prior desktop approval is recorded. Their new instruction — “Do not begin full dual-OS implementation until the Product Owner approves both representative designs” — is the source of the current gate. The shared-content reuse here is limited to a representative review prototype so both flows can be demonstrated. Connecting the chosen shells to the production provider/persistence adapter, remaining screens and release behavior awaits that approval. No separate mobile dataset, mobile save or scoring logic exists.

Core Chapter 2–3 work remains targeted for 2–4 November. This bounded design review uses visual-refinement capacity; no milestone slip is identified. Full dual-OS integration is additional scope to estimate against the chapter schedule after approval. No Git operation or deployment was performed.

## Reproduce locally

```powershell
npm run check
npm run test:smoke
node scripts/review-art-direction.mjs
# In a second terminal:
node scripts/validate-dual-os-review.mjs
# Refresh a running review server after edits:
node scripts/review-art-direction.mjs --build-only
```

Open `http://127.0.0.1:4384/dual-os.html` at 360, 390, 768 and 1440px. Resize the same tab after discovering evidence to verify continuity. The original approved desktop proposal remains at `/art-direction.html`.

TasteSkill output is in `.taste-skill/dual-os/final`; current Web Interface Guidelines were applied from the skill’s upstream source. The design draw is `data-terminal`, seed 1053547236, with approved palette/type retained and no redraw.
