# Lacak OS · first-screen validation

29 October 2026. Status: **ready for Product Owner screenshot approval; remaining UI migration has not started**.

## Review

- Built interactive preview: http://127.0.0.1:4384/art-direction.html
- [Desktop, 1440 × 960](desktop.png)
- [Desktop after sender inspection](desktop-evidence.png)
- [Independent Browser comparison](browser.png)
- [Tablet, 768 × 900](tablet.png)
- [Phone, 390 × 844](mobile.png) and [phone journal](mobile-journal.png)
- [Compact visual style guide](../pixel-desktop-style-guide.md) and [asset provenance / exact generation prompt](assets.json)

The screenshot shows working React controls and canonical Chapter 1 content, not an image of a proposed interface. Generated art is limited to the decorative wallpaper. Mail, Browser, Messages, Files, Evidence Journal, taskbar, shortcuts, notifications and controls are React components. Messages explicitly reports that Chapter 2 content is not yet available.

## Verification

| Check | Result |
|---|---|
| TypeScript and ESLint | Pass; no new dependencies or changed dependency pins |
| Existing unit/integration suite | 37 / 37 passed |
| Existing production desktop/mobile browser suite | 32 / 32 passed |
| Production M1 build | Passed; existing production entry retained |
| Isolated review production build | Passed; separate output in `.cache/art-direction-build` |
| New built-preview interaction checks | 13 / 13 passed; [machine-readable checks](checks.json) |
| TasteSkill app source lint | 0 failures; intentional system-label/bevel/case-number warnings documented |
| TasteSkill built-preview inspector at 1440 / 768 / 390px | 0 failures; system-label density warning only |
| Additional reflow checks | No horizontal overflow at 320 / 390 / 768 / 1440px |
| Existing player save sentinel | Unchanged across preview interactions; zero application storage writes |
| Network / runtime | No external runtime requests or page errors during normal review flow |

The additional browser checks cover keyboard sender inspection, idempotent clue counts, deadline and inert destination inspection, independent-source inspect/compare ordering, window minimize/restore/maximize/close/reopening and focus return, the benign campus counterexample, readable Files, honest Messages empty state, all three decision outcomes, zero-clue decisions, late evidence semantics, reflection and M1 handoff, mobile app switching, no horizontal overflow, a half-width/height layout equivalent for 200% zoom, wallpaper failure and Escape dismissal of the launcher.

This is automated Chromium emulation, not a real-device or screen-reader certification. The half-sized viewport is a layout check, not a claim of native browser-zoom testing. Audio is absent; no sound permission or fake toggle is introduced. There is no dragging mechanic: all app switching and window actions have native buttons and keyboard access.

## Render critique and iteration

Recorded the previous visual review before modifying the entry. Looked at desktop, tablet and phone screenshots after rendering. Corrected an intrinsic grid-row sizing issue that initially pushed the Mail action bar under the taskbar, removed initial focus stealing, increased email reading text to 14px, removed labels below 11px, restored source-resolution navigation to Mail, preserved mobile live announcements and fixed a 3px overflow at 320px.

The final frame has one dominant working document, a deliberately offset evidence window, an exposed wallpaper perimeter and a persistent taskbar. Title bars, pixel mark, five original shortcuts, stepped icon geometry and signal-colored feedback give the OS its own identity. Long-form text stays in Inter. A long email scrolls within Mail; its primary actions remain pinned inside the window. The journal is allowed to grow with real discoveries rather than showing fabricated clues in its empty state.

Self-critique using TasteSkill's rubric: design 8, usability 8, creativity 8, content 8; weighted score **8.0/10**. The remaining inspector warning is the proportion of 11–12px system labels. These are metadata, controls and short OS labels; substantive email/source/case text is 14px and expanded evidence explanations are 14px. The explicit `button-fx` and `heavy-shadow` exceptions preserve the user's requested hard pixel bevels and floating window shadows. There are no gradients, glows, glass, unreadable sub-11px labels or copied game assets.

## Scope and schedule

No edits to the production application entry, scenario data, reducer, scoring facts, persistence adapter or existing test files. Default production routes remain M1. The visual review intentionally reads/writes no production save and resets its in-memory state when refreshed.

The only launch/build script change adds `--build-only` so an already running local review server can refresh without a port conflict. No Git operation, deployment, publishing or external messaging was performed.

Core M2 (Chapters 2–3 and recovery) remains targeted for **2–4 November**. This bounded review occupies visual-refinement capacity; no milestone slip is currently identified. Remaining visual migration is explicitly waiting for the user's screenshot approval and must fit around core M2 work. Report any forecast change before expanding migration into that capacity.

## Reproduce

```powershell
npm run check
npm run test:smoke
node scripts/review-art-direction.mjs
# In a second terminal:
node scripts/validate-pixel-desktop.mjs
# Refresh assets if the local review server is already running:
node scripts/review-art-direction.mjs --build-only
```

TasteSkill output is in `.taste-skill/pixel-desktop/{before,final}`. The final inspector invocation uses app mode and only the two documented pixel-chrome exceptions:

```powershell
node C:/Users/Shumin/.agents/skills/design-taste-frontend/scripts/inspect.mjs http://127.0.0.1:4384/art-direction.html --app --out .taste-skill/pixel-desktop/final --allow button-fx,heavy-shadow
node C:/Users/Shumin/.agents/skills/design-taste-frontend/scripts/lint.mjs src/pixel-desktop --app
```

The Product Owner's current brief is the source of this single-screen approval gate. No additional approval is inferred from a skill or historical planning document.
