# Motion and desktop window management

Implemented locally on 30 October 2026. This extends the approved homepage and Lacak OS visual system. It does not change the game engine, chapter content, scoring, progress format or persistence rules.

## What changed

**Motion 14.8.0** is the only new direct runtime dependency, pinned in `package.json` and the lockfile. The initial dependency inventory found no animation library; Motion was then explicitly requested by the Product Owner. The implementation imports from `motion/react` and uses current official documentation fetched through Context7.

Homepage motion is short and readable: headings move 8px into alignment, supporting content rises 10px, the actual game preview settles into place, and the tool screenshots arrive with a small stagger. Both start controls provide press feedback. Inspecting the practice email immediately reveals its address and gives the notebook a small confirmation movement. These do not change the page's composition, statistics, navigation or game actions. Content is readable from the first frame; there is no opacity-zero page reveal, loading curtain, looping decoration or number counter.

Desktop windows now support:

- Dragging from the title bar, excluding its controls. Motion values update position without a React state update on every pointer move. Momentum and elastic overshoot are disabled.
- Bringing the selected window to the front, while preserving the relative stacking order of other windows.
- Keeping the entire window within the workspace. Bounds are recalculated after desktop resizing, returning from mobile, restoring a window or changing its size through a placement command.
- Cancelling a drag with Escape, pointer cancellation or loss of browser focus.
- Preserving the moved position through minimize/reopen and maximize/restore. Double-clicking the title bar also toggles maximization.
- A **↔** position menu with four single-click nudge controls, left/right placement and a reset for that window. Arrow keys move 16px, Shift+Arrow moves 64px, and Home restores its initial position.
- **Mail & sumber berdampingan**, which arranges the email and independently found source in a 56:44 split. This opens the source application without recording a source inspection or comparison.
- **Rapikan jendela**, which restores the default presentation. Both workspace commands are also available in the Lacak menu, so recovery remains possible when a moved window covers the workspace controls.

In compact split layouts, the inbox list scrolls independently and the decision controls remain visible. This was checked explicitly at 1120×700 after a screenshot review found the original grid track could push the footer below the window.

Window arrangement is session-only UI state. It survives navigation within the mounted OS but returns to the default after a reload. Game progress continues to use its existing persistence. There is no manual resize handle; the placement commands change window size. On phones and tablets, the Saku single-application shell remains in use and desktop handles are absent.

## Accessibility and motion policy

`MotionConfig reducedMotion="user"` applies across the app. `useReducedMotion` additionally sets nonessential animation durations to zero. Direct user-controlled dragging and discrete placement still work with reduced motion. There is no inertial movement after release.

Native buttons and disclosures provide click and keyboard alternatives to dragging. Position menus keep their focus behavior, close with Escape/outside click, and flip or scroll within the available workspace height. Movement completion is announced once through a polite status region; every animation frame is not announced. Existing visible focus, modal focus handling, skip links, reading fonts and game feedback are retained.

## Validation

| Check | Result |
| --- | --- |
| TypeScript, ESLint and production build | Passed |
| Unit / integration suite | 38 passed |
| Complete Chrome desktop/mobile browser suite | 52 passed in the final run (`test-results/motion-complete`) |
| Edge homepage/window checks | 12 passed; the compact placement case also passed on the final build in both profiles (2/2) |
| Game correctness | Completion branches, scoring, source comparison, reload, save conflict handling, reset confirmation and keyboard-only completion passed |
| New window checks | Drag, constraints, cancellation, stacking, minimize/restore, maximize/restore, click nudges, repeated keyboard movement, reset, comparison and desktop/mobile resize passed |
| State isolation | Captured save unchanged after arrangement; the full regression suite also checks existing persistence semantics |
| Responsive review | 360, 390, 768, 1120 and 1440px; no observed horizontal overflow; no desktop handles in Saku |
| Runtime errors during artifact capture | None |
| Design inspector | 0 failures, 1 defended no-footage warning at 1440×900, 768×1024 and 390×844 |
| Motion measured by the inspector | 16 elements at each supported viewport; no still-page exemption |

The design inspector retains the previously documented `eyebrow` allowance because it misclassifies a required source link inside a native disclosure. No actual kicker labels were reintroduced. No looping video was added to the homepage: its real interface preview, entrances and live inspection provide the requested motion. The demo video below is a review artifact, not a background asset.

The image layout test now measures the untransformed layout dimensions. Measuring `getBoundingClientRect()` during the intentional scale entrance would mistake visual animation for an image layout shift. The keyboard completion test uses the exact Mail application name, distinguishing it from the new comparison command.

The final JavaScript bundle is about 471 kB / 148 kB gzip. Motion and the window layer add about 46 kB gzip compared with the prior homepage build. No second animation or drag library was added. The recording helper uses Playwright's FFmpeg tool binary; it is not shipped in the app.

## Review artifacts

- [Interaction recording](interaction-demo.webm)
- [Default desktop](desktop-default.png)
- [Dragged and focused window](desktop-arranged.png)
- [Email and source comparison](desktop-comparison.png)
- [Compact desktop comparison](compact-desktop-comparison.png)
- [Accessible position controls](position-controls.png)
- [Homepage desktop](homepage-desktop.png)
- [Homepage 360px](homepage-360.png), [390px](homepage-390.png), [768px](homepage-768.png)
- [Game 360px](game-360.png), [390px](game-390.png), [768px](game-768.png)
- [Email inspection feedback](email-feedback.png)
- [Machine-readable capture results](review-results.json)

`scripts/review-motion.mjs` recreates the screenshots and recording in isolated browser contexts without accessing a personal browser profile or save.

## Visual assessment

Applied `design-taste-frontend`, its app-screen and motion guidance, `web-design-guidelines`, and the relevant React performance guidance. The approved direction and brand were retained; this component/interaction upgrade did not deal or implement a new visual direction. The prior homepage direction remains **The page is the object**, seed **22990416**.

Reviewed all final inspector screenshots and the actual desktop, position-menu, comparison and Saku captures. The page's visual hierarchy, typography, margins and primary action remain consistent. The window controls fit the existing chrome; the comparison layout keeps both artifacts readable. The important repairs were keyboard-bound clamping, a non-drag pointer alternative, accessible layout recovery and the compact Mail footer.

Self-assessment, not an independent jury score: design 7.8, usability 8.5, creativity 7.5, content 8.5; weighted 8.0/10. The signature interaction is arranging the actual investigative artifacts, rather than decorative animation. No new stock art, generated images, sample proof or chapter content was introduced.

Tested in Chrome and Edge with mobile emulation. Physical phones, Firefox, Safari and dedicated screen-reader software were not tested. This is a targeted accessibility review, not a certification claim. No Git operations or deployment were performed.

Local production preview: http://127.0.0.1:4173/
