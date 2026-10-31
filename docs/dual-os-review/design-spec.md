# TrustTrail · Lacak OS + Saku

**Current status:** both representative designs were approved by the Product Owner. Production integration is complete; see [production validation](../dual-os-integration/validation.md).

The original review record below is retained as design history.


29 October 2026 · Representative-design review, before full dual-OS implementation.

The Product Owner approved the pixel desktop direction and requested a matching fictional smartphone OS. The desktop approval remains recorded. Both representative designs must now receive approval before full dual-OS integration or remaining production UI migration. This entry only prototypes the Chapter 1 investigation needed for screenshots and flow equivalence; production routes/provider/saves are unchanged.

## One game, two presentations

**Desktop:** Lacak OS keeps the approved coastal wallpaper, original pixel shortcuts, taskbar and steel app windows. Case Files is the player-facing name for the evidence application. The original Evidence Journal IDs and data remain intact.

**Compact / expanded:** Lacak **Saku** is an original fictional mobile OS. A pixel status bar, home screen, 3-column app grid, badges, notification banners, fullscreen app views, app back headers and always-available Home/app-switch controls replace desktop chrome. No desktop minimize/maximize/close buttons or taskbar are rendered in this shell. No Apple/Google assets or branding are used.

Shared question: does NovaTech’s invitation hold up against a separately found source? The paired Mail screenshots show the exact same Chapter 1 sender discovery, `C1-E01`, with no choice committed and no source inspection. Home and Case Files are additional views of that same state, not invented progress.

## Compact visual guide

| Element | Shared design | Saku treatment |
|---|---|---|
| Ground | Navy `#0b1423`, slate `#142231`, steel `#1a2a3a` | Fullscreen surfaces; no miniature windows |
| Identity | Original stepped signal mark, coastal pixel wallpaper | `LACAK / SAKU` status label and portrait crop of the same original art |
| Type | Self-hosted Silkscreen for short labels; Inter for reading | 15px letter/source text, 14px expanded evidence, 11px minimum metadata |
| Investigation | Teal `#78d8c3`, plus explicit labels/icons | 48px inspection buttons; actual discovered-evidence badge |
| Unverified state | Amber `#f0bf79`, reason stated in words | In-app warning and Case Files source status |
| Navigation | Semantic buttons and visible focus | Fullscreen app header, native history-backed Back, persistent Home, app switcher |
| Notifications | Polite live announcements with dismiss control | Reserved inline banner space; never covers the evidence or action bar |
| Motion | No continuous animation, glitches or sound | Reduced-motion behavior retained; no swipe-only controls |

No new assets or dependencies are needed. The existing generated wallpaper and original SVG icons are reused; their prompt and provenance remain in [the original asset manifest](../pixel-desktop-review/assets.json). No generated text is used inside artwork.

## Layout constraints and breakpoints

| Available CSS viewport | Presentation | Reason |
|---|---|---|
| Width ≥1120px **and** height ≥700px | Window-based Lacak OS | At the lower width, 122px left lane + 662px Mail + 14px gap + 300px Case Files + 22px right margin = 1120px. The Mail list and readable document can coexist with an evidence window. 700px leaves usable window space after case header and system bars. |
| Below either desktop constraint | Fullscreen Saku | A useful working surface is preferable to squeezed windows. Short landscape views scroll app content while retaining system navigation. |
| Saku width <640px | Compact home; one Mail region at a time | 3-column icons, full-width 48px inspection controls, single-column source comparisons. |
| Saku width ≥640px | Expanded Saku | 5-column home icons, roomier reading gutters, full-width native app header. |
| Saku width ≥720px | Expanded two-pane Mail inside one fullscreen application | 220px inbox + at least 500px document area. At 768px this remains Saku, with no taskbar or desktop window controls. |

The selection uses a browser media query subscription; the authoritative reducer is above both shells. Resizing does not dispatch start/reset events or create another game. View details such as an expanded clue may collapse when shell components remount, but discovered evidence, source checks, committed decisions, flags and event history remain in the one reducer state.

## Evidence and verification parity

1. Home → Mail → NovaTech invitation → **Periksa pengirim** records canonical `C1-E01`.
2. **Periksa batas waktu** records canonical `C1-E02`; no actual countdown is introduced.
3. The candidate-address button reveals its inert destination and records canonical `C1-E03`. No site is opened.
4. **Cari sumber terpisah** opens Browser via an independent directory route. App opening earns no verification.
5. **Periksa catatan lowongan** dispatches the existing source inspection. Only then can **Bandingkan dengan undangan** dispatch comparison and record `C1-E04`.
6. On narrow screens, clearly labelled source and invitation excerpts stack vertically in the scrollable Browser document. No horizontal comparison table or hover is needed.
7. Case Files reflects only actual discoveries, includes their caution text and records evidence found after a committed choice as late. The existing decision/outcome/reflection content is reused unchanged.

## Back, home and app switching

Presentation navigation is represented in the isolated review entry’s hash, including `#home`, `#mail` (inbox), `#mail/read`, `#browser` and `#cases`. Browser Back and the in-game Back button traverse the same internal navigation entries. Forward restores the presentation route. Returning to a prior app does not undo evidence or reverse a committed decision. On a directly opened app with no internal history, in-game Back returns Home; browser Back at the initial entry may leave the review normally. No history trap is installed.

Home is always available outside the modal app list. The native dialog app switcher has a visible 44px Close control, Escape dismissal and native focus return. Selecting an app closes it. All evidence actions are buttons or native details controls. The notification dismiss target and navigation controls are at least 44px; primary touch actions are 48px.

## Architecture boundary

This review reuses the existing `MailApp`, `BrowserApp`, `JournalApp`, `FilesApp`, `DesktopWindow` and canonical reducer/content. It does not introduce a mobile scenario, mobile save, duplicate score calculation or new storage key. The old `/art-direction.html` proposal remains reproducible. The only shared-review refinements expose existing content components and allow Mail inbox navigation and Browser origin labels to be controlled by the proposal.

After both screenshots are approved, implementation work will connect the approved shells to the existing production provider and persistence adapter, carry presentation navigation into production, migrate remaining screens, and validate all persistence/error/recovery cases there. **That integration is not authorized by desktop approval alone and has not begun.**

## Skills and schedule

Applied `design-taste-frontend` app workflow with the approved palette/type kept: `data-terminal`, seed 1053547236, no redraw. Its restrained selection lines and long-session readability remain. User requirements explicitly override neutral-black grounds, plain icons and no pixel bevels: this is a fictional OS game. Applied current `web-design-guidelines`, React performance guidance and current Context7 React documentation for a stable reducer parent and media-query subscription. System-only hard bevel/shadow exceptions are retained from the desktop review.

This is a bounded design/flow review in visual-refinement capacity. Core Chapters 2–3 remain M2 work targeted for 2–4 November; no milestone slip is identified at this point. Full dual-OS integration is additional scope whose estimate will be refined after design approval, and must not silently consume core chapter implementation time. No Git operations or deployment are performed.
