# TrustTrail · production dual-OS integration

29 October 2026. **Both representative designs are approved. Lacak OS and Saku are integrated into the production M1 application.** No further design approval is required for this completed integration.

## Delivered behavior

- Desktop: the approved pixel wallpaper, original shortcuts, taskbar, focused app windows and functional minimize/restore/maximize/close controls. The welcome surface is a system entry rather than a dismissible app.
- Compact/expanded viewports: the original Saku home, status bar, native fullscreen applications, app header/back navigation, notification banners, Home and modal app switching. Desktop window controls and taskbar are not rendered in Saku.
- Shared Mail, Browser, Messages, Files and Case Files content. Messages truthfully remains empty in Chapter 1; it does not imply Chapter 2 has shipped. Files shows only the story lines the player has reached.
- Production briefing, narrative, investigation, decision, independent verification, distinct outcomes, reflection and the M1 handoff. Guide, report checkpoint and not-found routes now use the same OS visual system.
- Existing validated local saves, corruption notices, failed-storage fallback, cross-tab conflict recovery and explicit restart/reset confirmations. Storage status is real; the production entry has no review-only “not saved” label.

## Architecture and invariants

`src/main.tsx` retains **one `GameProvider` above the entire application**. `OperatingSystem` reads its state and dispatches through the existing action Context; it has no reducer, scoring implementation or storage adapter of its own. `GameProvider.tsx`, the reducer, engine types/validation, scenario content, content/rubric versions and persistence adapter are unchanged.

Shared app content and original SVG icons were promoted from the approved prototype into `src/features/os`. Archived review entries re-export/use those modules through their in-memory review adapters. Production does not import a review reducer, seed an investigation, auto-start a run or use a second dataset/save key.

The app hosts keep the same React identity and keys when the layout changes. Their device chrome changes around them. This preserves expanded sender details and an uncommitted radio selection in addition to canonical evidence, flags, source records and committed choices. A restarted/restored run gates all clue detail by actual reducer discoveries, preventing previously expanded details from appearing before a fresh inspection.

Only accepted provider actions write the existing `trusttrail:save:v1` event log. App opening, window operations, focus, Home, back/forward navigation, viewport changes and reading the OS entry never create gameplay events or award evidence/verification/safety credit. The four baseline fact dimensions retain their existing calculation rules; no final-game score is fabricated at the M1 checkpoint.

Presentation navigation uses React Router, with `/play?app=mail&view=read`, `view=inbox`, `message=campus`, `app=browser`, `app=cases`, `app=files` and `app=messages`. Browser Back/Forward and in-game Back traverse those routes without undoing gameplay. With no known internal history, in-game Back returns Home instead of guessing at an external destination. No history trap is installed. Reload reconstructs the authoritative game from the existing validated save.

## Layout constraints

The approved constraints are unchanged: desktop requires **width ≥1120px and height ≥700px**. At the lower width, 122px left lane + 662px Mail + 14px gap + 300px Case Files + 22px right allowance = 1120px. Below either constraint, Saku uses fullscreen apps. Saku expands its home grid/gutters at 640px; at 720px its fullscreen Mail can retain a 220px inbox beside the reading pane. **768px deliberately uses expanded Saku.** Touch controls remain 44–48px rather than shrinking desktop chrome.

## Validation

| Check | Result |
|---|---|
| TypeScript / ESLint | Passed |
| Unit and rendered integration suite | **38 / 38 passed** |
| Production browser suite | **40 / 40 passed**, desktop/mobile Chromium |
| Production build | Passed; local build only |
| Required widths | 360, 390, 768, 1440px tested; existing 320px reflow check retained |
| Additional boundaries | 1119/1120px width and 699/700px height tested |
| Viewport continuity | Expanded clue, uncommitted decision, persisted event log and pending verification preserved |
| Save/replay safety | Corrupt saves, quota failures, conflicts, reloads, replacement/reset confirmations and unrelated storage retained |
| Input | Keyboard-only complete chapter, mobile taps, Escape/focus return and visible focus tested |
| Assets/network | Failed/delayed wallpaper remains usable and stable; no external runtime requests or sensitive-input forms |
| TasteSkill source app lint | 0 failures; intentional OS labels, chapter numbers and bevel/shadow warnings documented |
| Built home inspector, all required widths | 0 failures / 0 warnings |
| Built play inspector, all required widths | 0 failures; one intentional desktop window-space warning |
| Built guide inspector, all required widths | 0 failures; two intentional desktop window/available-wallpaper-space warnings |

The original 33 pure game/save/control tests are unchanged. The four original rendered integration cases preserve their assertions while navigating the approved apps instead of dossier tabs. One regression case now covers restart after an expanded sender clue. The previous 32 browser cases retain branch, evidence, scoring, save, privacy, focus, keyboard and asset-resilience coverage with OS-specific selectors. Four new browser cases run in both projects, adding eight cases for state continuity, pending verification/reload, history and window/breakpoint behavior.

The old journal-modal focus check now exercises the actual app-menu modal; Case Files is a native application. The old dossier-image checks now exercise delayed/failed pixel wallpaper and keyboard app browsing. The original Tabs/Drawer control unit tests remain intact. No scoring/persistence assertion was removed to accommodate the new visuals.

Browser validation caught duplicate verification headings behind the foreground Browser and guide navigation focusing window chrome first. Both were fixed and the complete suite rerun successfully. The clue restart regression independently verifies that the same mounted app cannot leak an old expanded sender into a new run.

## Screenshots and visual review

- [Desktop home](desktop-home.png)
- [Desktop investigation](desktop-gameplay.png)
- [Saku home](mobile-home.png)
- [Saku investigation](mobile-gameplay.png)
- [Saku Case Files](mobile-case-files.png)
- [Expanded Saku Case Files](tablet-case-files.png)

The two investigation images are from the same saved seven-event run resized in one tab: run start, story start, four intro lines and one sender inspection. Opening Home/Case Files and resizing did not append events. The production label correctly changes from “Progres lokal” before a run to “Tersimpan di browser ini” after a successful save.

Visual QA retained the approved navy/steel, teal investigation/focus and amber unverified states, self-hosted Silkscreen system labels, readable Inter email/body text, original pixel icons and wallpaper. No character portraits, image-based controls, gradients, glow/glass, Matrix code, fake hacking, sounds or continuous motion were added. Reduced-motion preferences disable all production transitions/animations. Notification banners reserve space in Saku instead of covering the document or primary controls.

TasteSkill output is in `.taste-skill/production-os-home`, `production-os-play` and `production-os-guide`. The intentional `button-fx` and `heavy-shadow` exceptions retain approved hard pixel bevels and actual floating desktop windows. The play inspector's 44px blank-space warning is the retained usable window envelope during a short briefing, not a blank dashboard card. The guide uses a readable document width inside an OS window, leaving its surrounding desktop wallpaper exposed by design; its two spacing warnings describe that envelope. Inactive static utility documents are unmounted so their hidden headings do not pollute document inspection, while game apps remain mounted to preserve UI state. Self-critique: design 8, usability 8, creativity 8, content 8 (8.0 weighted). This remains Chromium emulation, not physical-device/screen-reader certification.

## Scope, assets and schedule

No new runtime dependencies, dependency-pin changes, scenario dataset, save key, migration, backend, network call, Git operation or deployment. The original wallpaper is reused from `public/pixel/relay-coast.png`; its exact generation prompt is archived in [the asset manifest](../pixel-desktop-review/assets.json). Original icon source now lives in `src/features/os/PixelIcon.tsx`, with the old path re-exporting it. The favicon uses the same original stepped signal mark. Inter and Silkscreen remain local with their existing OFL license files. Earlier illustrated assets remain historical; production no longer renders the visual-novel illustrations.

This integration occupies the M1 presentation/refinement scope. **Core Chapters 2–3 and recovery remain M2 work targeted for 2–4 November; no target slip is identified.** They are not claimed as delivered here. Full story/recovery/report work remains tracked by the existing milestone plan.

## Run

```powershell
npm run dev
# http://127.0.0.1:5173/
npm run check
npm run test:smoke
npm run preview
# http://127.0.0.1:4173/ after build
```

`/art-direction.html` and `/dual-os.html` remain optional archived design previews in the explicit review build. Use the default production entry to assess real saving and gameplay. Approval was supplied by the Product Owner's “Yes!” following the paired representative screenshots.
