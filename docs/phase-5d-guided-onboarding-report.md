# Phase 5D — Guided interactive onboarding

Date: 4 November 2026. Status: implemented locally; awaiting Product Owner review. No Git operations, deployment, submission, dependency additions, gameplay migration, or telemetry.

## Existing onboarding audit

Preparation covered the Phase 5A audit, Phase 5B remediation, Phase 5C release report, GDD, architecture, gameplay state machine, persistence implementation, OS shell, shared applications, Guide, opening narrative, and test helpers. No applicable AGENTS.md was found. Applied design-taste-frontend (component work within the established art direction), web-design-guidelines, and Playwright skills. No React best-practice skill was available; React correctness was checked through source review, strict typecheck, hooks linting, and behavior tests. Web guidelines were retrieved from their upstream source during this work.

The existing entry is Start → briefing → four narrative lines → investigation. It automatically selects Mail. That selection does not mean the player knows how to launch an app and must not count as a tutorial action. Existing evidence buttons, Case Files hints, source-comparison instructions, save notices, and the public Panduan remain the investigation guidance. The new layer teaches navigation only.

Desktop requires both 1120px width and 700px height. Its shortcuts and taskbar open draggable, overlapping windows; Case Files initially accompanies Mail. Smaller layouts use Saku, whose application switcher is a native modal drawer. Chapter 2 centers Messages; Chapter 3 centers Browser. Automatic onboarding is therefore limited to Chapter 1 investigation. Replay is offered from Panduan once the run has reached an investigation-capable phase, including later chapters.

Pre-change `npm run check`: typecheck, zero-warning ESLint, **94 unit/integration tests**, and production build passed. A clean pre-change browser baseline was not obtained: sandbox binding initially failed, then an incorrect `/usr/bin/chromium` executable caused launch failures. The installed Fedora executable is `/usr/bin/chromium-browser`. The historical 106 browser passes are not presented as a fresh baseline measurement.

## Final flow and instructional copy

| Stage | Copy | Advancement |
|---|---|---|
| Welcome | “Selamat datang di TrustTrail OS.” / “Di sini, kamu akan memeriksa pesan, membandingkan informasi, dan mengumpulkan bukti sebelum mengambil keputusan.” | Mulai Tutorial |
| Mail | “Mulai dari Mail.” / “Periksa siapa pengirimnya, apa yang diminta, dan apakah pesannya layak dipercaya.” | Real Mail opening |
| Browser | “Jangan hanya percaya satu sumber.” / “Gunakan Browser untuk mencari informasi pembanding sebelum mengambil keputusan.” | Real Browser navigation |
| Case Files | “Bukti membantumu mengambil keputusan.” / “Buka Case Files untuk melihat temuan dan perkembangan investigasimu.” | Real Case Files opening |
| Ready | “Peralatanmu sudah siap.” / “Sekarang, periksa setiap petunjuk sebelum mengambil keputusan.” | Mulai Investigasi |

Every panel includes “Lewati tutorial” and textual progress “Investigasi pertamamu · N dari 5”. App stages say “Buka aplikasi melalui kontrol yang ditandai. Jika belum terlihat, buka Aplikasi.” Inside the menu this becomes “Pilih aplikasinya di menu ini.” Panduan offers “Ulangi tutorial”. No app stage has a Next button. Unexpected app selections leave the current stage intact; repeated openings cannot skip stages.

## Desktop and Saku behavior

The panel occupies normal shell space above the workspace. It never covers a launch control, creates an input-catching scrim, moves a window explicitly, or synthesizes a click. Desktop uses a compact horizontal panel and amber outlines on real shortcuts. Existing taskbar and in-app app links also count when they invoke the normal app-opening handler. Ordinary app opening retains its existing window behavior.

Saku highlights Aplikasi first, then highlights the relevant real menu entry. While the modal application drawer is open, the same instruction panel renders inside it, so instructions and Skip remain accessible in the browser's top layer. It returns to the shell after selection. The drawer remains scrollable on small screens; no extra tutorial navigation stage is introduced.

The highlight implementation is intentionally intrinsic CSS: semantic app IDs choose a `data-tutorial-target` attribute on the rendered control. Its outline follows layout, scrolling, mounting, and resize automatically. There are no stored coordinates, DOM polling, mutation observers, or animation-frame layout measurements. An absent control produces no floating orphan spotlight. The instruction and Skip remain available, and a later menu mount provides the actual target. A browser test removes the highlighted controls and verifies safe dismissal.

## Implementation architecture and files

| File | Responsibility |
|---|---|
| `src/features/onboarding/tutorial.ts` | Bounded preference decoding, guarded pure app transition, eligibility |
| `src/features/onboarding/Tutorial.tsx` | Shared Indonesian instructions, live announcement, native actions, Motion entrance |
| `src/features/onboarding/tutorial.css` | Brand-matched panel, intrinsic target outline, desktop compact layout, constrained Mail grid repair |
| `src/features/os/OperatingSystem.tsx` | Tutorial UI state, actual app-opening hook, conditional presentation, menu placement, replay and dismissal |
| `src/features/os/Shells.tsx` | Saku application-switch target |
| `src/pages/GuidePage.tsx` | Replay control within existing guide |
| `tests/unit/tutorial.test.ts` | Seven preference/state/eligibility/storage invariants |
| `tests/integration/tutorial.test.tsx` | Six rendered navigation, skip and gameplay-save isolation cases |
| `tests/smoke/window-management.spec.ts` | Wait for the committed desktop shell before unchanged window bounds assertions after reflow |
| `tests/smoke/onboarding.spec.ts` | Nine browser scenarios per project, including five widths |
| `docs/phase-5d-evidence/` | Stage screenshots, responsive captures, menu captures, design probe and internal recording |
| This report | Audit, implementation, validation and review handoff |

The engine, chapter content, reducer contract, gameplay provider, score calculations, and v1 persistence module were not edited. Opening apps remains presentation navigation. Tutorial actions cannot send domain events. Save-byte equality is asserted through full tutorial completion and replay after evidence collection; existing reducer/report regression tests cover derived scores.

## State and persistence

One isolated versioned key, `trusttrail:onboarding:v1`, stores one of `welcome`, `mail`, `browser`, `journal`, `ready`, `completed`, or `skipped`. Unknown values fall back to welcome. Reads and writes tolerate blocked storage. State stays usable in memory when storage fails; no personal information is stored.

An interrupted Chapter 1 tutorial resumes its saved stage after refresh. Initial automatic Mail selection and restored URLs never advance it. Skip and completion suppress automatic reappearance across refresh and gameplay restarts in that browser. Replay resets only the tutorial preference, opens the existing current-chapter app, and preserves all evidence and decisions. While replay is active it can teach the three tools in later chapters without restarting them.

Leaving the eligible phase hides guidance without affecting gameplay. Later-chapter replay activation itself is in memory; refreshing a later-chapter replay defers the saved tutorial stage until another explicit replay or eligible Chapter 1 visit. This deliberately avoids automatically interrupting returning later-chapter players. Unavailable storage cannot guarantee once-per-browser behavior across reloads. Clearing site storage resets the preference.

## Accessibility and performance decisions

Native buttons support Tab, Enter and Space; actions are at least 44px tall. A named complementary region contains a polite atomic status announcement, readable heading, instructions and textual progress. Welcome and ready headings receive programmatic focus without scrolling; app steps leave normal OS interaction available. Completion/Skip restore focus to the menu close control if a modal menu remains open, otherwise the current desktop task control or Saku switcher, falling back to main content. Escape dismisses guidance; existing dialog cancellation remains intact.

The tutorial is not an aria-modal dialog and does not inert the working OS. When the existing modal menu opens, instructions move inside that dialog instead of remaining inaccessible behind it. Normal shell route focus and drawer focus restoration are preserved. Focus outlines remain visible. Progress and cues do not rely only on color. The outline does not hide or disable the actual control.

Motion uses only a short opacity/5px entrance. Reduced motion removes the entrance and uses a static final state, reinforced by CSS. No continuous flashing, new canvas, dependency, animation timer, or scroll-triggered React updates were added. The retained palette and pixel heading face are explicit existing-brand exceptions to the design skill's generic neutral app palette preferences; no new design direction was drawn for this component.

## Validation results

Commands: `npm run check`; `PLAYWRIGHT_EXECUTABLE_PATH=/usr/bin/chromium-browser npm run test:smoke`; focused browser invocations select `onboarding.spec.ts` and `window-management.spec.ts`. Final commands and evidence are recorded below. No existing assertions were weakened, no existing case skipped, and no timeout extended.

| Check | Result |
|---|---|
| TypeScript | PASS |
| ESLint `--max-warnings=0` | PASS |
| Unit/integration | **107 passed, 11 files, zero failures** |
| Production build | PASS; existing large-chunk advisory remains |
| Final focused onboarding run | **18 passed, zero failures**; `onboarding-browser.log` |
| Initial focused onboarding run | **14 passed** before adding the final keyboard/missing-target scenario |
| Window regression after synchronization correction | **6 passed**, all original bounds assertions retained |
| Blocked-storage fix confirmation | **2 passed**, desktop and mobile |
| Final full browser suite | **124 passed, zero failures, 10.0 minutes**, Chromium desktop + mobile; `browser-regression.log` |

Coverage includes eligibility, first-time initialization, bounded preference values, interrupted refresh, real action advancement, duplicate/out-of-order navigation, skipping every persisted stage, replay, unavailable storage, missing mounted targets, gameplay-save immutability, reduced motion, keyboard opening and focus restoration. Browser regression includes safe/unsafe Chapter 1–3 branches, recovery variants, personalized report, refresh/resume/restart, window behavior, homepage, renderer lifecycle, and no-overlay gameplay interaction.

A valid intermediate full run exposed one new failure: blocked storage displays a save warning; together with the tutorial this constrained the Mail grid, allowing its status strip to intercept “Tentukan langkah”. Trace evidence identified the intercept. The fix bounds the Mail grid row and permits its inbox to scroll only while desktop guidance is visible. The desktop instruction layout was also compacted. The intermediate run was stopped after 26 passes, one failure and one interruption; 92 cases did not run. This is not a completed regression result. Its failure was fixed, then the affected tests and complete suite were rerun.

A subsequent complete run produced **121 passes and one failure**: the mobile-project window reflow case sampled workspace bounds before the responsive React commit and window bounds after it. Its settled screenshot showed valid bounds. The test now waits for `data-os="desktop"` after returning from Saku, then executes every original bounds assertion unchanged. No application window code changed and no timeout increased. This follows the same shell-synchronization convention already used by the app-navigation helper. Window cases and the complete suite were rerun after this correction.

Additional focus review found that Skip inside an open modal menu must restore focus inside that menu, not behind the modal. Dismissal now selects its close control first. A focused run then caught an intermittent Saku keyboard completion conflict between shell route-focus restoration and the informational tutorial stage; the shell now defers its route focus for welcome/ready so the tutorial heading retains ownership. The focused suite was rerun after both corrections. An otherwise passing partial regression rerun was intentionally interrupted to include these corrections; it is not counted as a final result.

## Visual review and QA artifacts

Every major desktop and Saku stage was opened and inspected, alongside final screenshots at 320, 360, 390, 768 and 1440px. The design skill's browser probe was executed inside actual investigation pages (not an uninitialized `/play` route), with results in [design-probe.json](phase-5d-evidence/design-probe.json). It measured zero horizontal overflow and no sampled low-contrast pairs at all five widths. These sampled checks are not WCAG certification. The component workflow preserved the established composition, so no direction/seed/redraw or new imagery was introduced. The full generic page inspector was not used as a sign-off gate for this small existing-brand component.

First visual round: small inherited Skip text and unnecessarily tall desktop panel. Final round: 14px Skip, compact desktop composition, readable Saku instructions, actual launch targets exposed, no overlapping tutorial overlay. Review rubric (subjective): clarity 8/10, brand fit 9/10, interaction accessibility 8/10. The remaining cost is reduced reading space while guidance is active, especially at 320px; Skip and app navigation remain visible. No representative first-time-user study or assistive-technology listening session was conducted.

| Stage | Desktop | Saku |
|---|---|---|
| Welcome | [Screenshot](phase-5d-evidence/desktop-welcome.png) | [Screenshot](phase-5d-evidence/mobile-welcome.png) |
| Mail | [Screenshot](phase-5d-evidence/desktop-mail.png) | [Screenshot](phase-5d-evidence/mobile-mail.png) |
| Browser | [Screenshot](phase-5d-evidence/desktop-browser.png) | [Screenshot](phase-5d-evidence/mobile-browser.png) |
| Case Files | [Screenshot](phase-5d-evidence/desktop-cases.png) | [Screenshot](phase-5d-evidence/mobile-cases.png) |
| Ready | [Screenshot](phase-5d-evidence/desktop-ready.png) | [Screenshot](phase-5d-evidence/mobile-ready.png) |

Additional: [Saku menu target](phase-5d-evidence/saku-menu-Browser.png), [320px](phase-5d-evidence/width-320.png), [360px](phase-5d-evidence/width-360.png), [390px](phase-5d-evidence/width-390.png), [768px](phase-5d-evidence/width-768.png), [1440px](phase-5d-evidence/width-1440.png). [Internal Saku walkthrough recording](phase-5d-evidence/saku-walkthrough.webm) (14 seconds, VP9, 390×900) is QA evidence only, not a competition submission video. It records the actual app menu selections and tutorial completion. Menu-target bounds are in [visual-measurements.json](phase-5d-evidence/visual-measurements.json).

## Risks, limitations and recommendation

Chromium on Fedora and emulated mobile viewports were exercised; Safari, Firefox, physical devices, screen readers and browser-UI height changes remain unverified. Very short screens can require scrolling the native application drawer. Later-chapter replay refresh behavior and unavailable-storage behavior are described above. No claim is made that navigation onboarding proves independent investigation skill or measured learning improvement.

All local automated release checks pass. Recommend local Product Owner acceptance review of the five stages, Skip, Panduan replay, and the 320px/desktop captures before release decisions. Existing Phase 5C external release/submission gates remain outside this phase. Stop at Phase 5D review; deployment and all Git/release decisions remain with the Product Owner.
