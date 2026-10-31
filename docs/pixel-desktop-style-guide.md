# TrustTrail · Lacak OS

**Current status:** both Lacak OS and Saku designs are approved and integrated into production. See [production validation](dual-os-integration/validation.md).

The original review record below is retained as design history.


29 October 2026 · Final visual direction, first-screen approval candidate.

**Approval update:** the Product Owner approved this desktop direction. Their subsequent adaptive dual-OS decision adds a distinct Saku mobile OS and a new requirement to approve both representative designs before full integration. See [the current dual-OS design review](dual-os-review/design-spec.md). This document remains the approved desktop visual foundation; its former single-shell responsive treatment is superseded.

This supersedes the illustrated visual-novel, paper-dossier and modern Mail visual directions. Only the isolated `/art-direction.html` review entry adopts this direction until the Product Owner approves a screenshot. Production M1 remains unchanged.

## Concept

The desktop is Ari’s investigation space. A suspicious invitation becomes a readable Mail document; the player’s inspections become dated Evidence Journal records. The central question is: does the invitation hold up against a separately found source?

Original fictional identity: **Lacak OS**, a personal desktop with a stepped signal-path mark. TrustTrail is the game; Lacak OS is its operating system. The night coast and relay towers connect the desktop’s atmosphere to tracing signals. No character portraits.

## Compact system

| Role | Specification |
|---|---|
| Desktop | Deep navy `#0b1423`; original pixel coastal-night wallpaper |
| Windows | Steel `#1a2a3a`; raised chrome `#2c4255`; square corners |
| Reading surface | Dark slate `#142231`; opaque and free of scanlines |
| Primary text | Ice `#e3edf2` |
| Secondary text | Steel mist `#a9bac7`; maintain 4.5:1 contrast |
| Investigation / focus | Teal `#78d8c3`; label + icon, never color alone |
| Unverified / pressure | Amber `#f0bf79`; state the reason, no countdown |
| Headings / system labels | Self-hosted Silkscreen Regular, 12–24px; short labels only |
| Reading / controls | Self-hosted Inter, 14–16px, 1.6 line height; system monospace for addresses |
| Geometry | 4px spacing grid; 1px highlights, 2px outer window edges, hard 4px offset shadow |
| Controls | Square, inset/raised feedback, visible 2px teal keyboard focus; 44px touch targets |
| Motion / sound | No continuous motion, no glitch, no sound in this candidate |
| Responsive | Two working windows on desktop; one foreground app on tablet/phone; labelled taskbar switches apps |

At 1440px: 120px shortcut lane + 24px gap + 878px Mail + 18px gap + 350px Journal + 50px outer allowance = 1440px. Compact breakpoints recompose panes instead of shrinking text. Browser and other secondary apps open as foreground windows; maximize/minimize/close are real controls. App opening never counts as verification.

## First-screen content inventory

- Ari, an early-career graduate, investigates the existing Chapter 1 invitation.
- Canonical NovaTech sender, address, subject, email paragraphs, deadline claim and inert destination.
- Campus career-center message remains a benign counterexample; spelling alone proves nothing.
- Sender, deadline and destination inspection dispatch existing evidence events.
- Browser uses the independently found canonical company record, with distinct inspect and compare actions.
- Journal counts only reducer discoveries; an empty journal exposes no undiscovered clue answers.
- Case status follows reducer phase; evidence count is exploration, never a prerequisite or fabricated score.
- Messages honestly has no conversation in Chapter 1; it does not pretend Chapter 2 is implemented.
- Files exposes actual case briefing and campus context as readable React content.
- Notifications announce discoveries in a polite live region; no forced notification permission.
- Decision, verification, outcome and reflection remain driven by canonical events and content.
- The preview uses memory only and never reads, writes, deletes or replaces production saves.

## Reference study and skill application

[Hypnospace Outlaw](https://www.hypnospace.net/) informs the desktop as a lived-in fictional world. [Kingsway](https://store.steampowered.com/app/588950/Kingsway/) informs applications as game objects. [Papers, Please](https://papersplea.se/) informs comparison of readable documents and consequential decisions. [Hacknet](https://hacknet-os.com/) informs coherent system responses. These are interpreted principles; no layouts, assets, branding, hacking commands or mechanics are copied.

Applied `design-taste-frontend` app workflow: before capture, inventory, question, dealt `data-terminal` (seed 430676002), scoped tokens, real-browser inspection and screenshot critique. Its useful move is restrained teal selection lines and readable long-session content. Explicit brief overrides: navy/steel grounds, pixel labels and icons, OS title bands, square bevels, floating windows and desktop wallpaper. The app-study neutral-black, unboxed-icon and no-illustration defaults would contradict this game brief. No dashboard cards, KPIs, glows or gradients are introduced. Existing Inter retained; Silkscreen replaces the prior display font for this entry only. Hard, zero-blur offsets and inset highlights on floating windows and raised controls deliberately implement the requested pixel OS chrome; inspector exceptions are limited to `button-fx` and `heavy-shadow`. Tiny text is corrected, rather than exempted.

Applied `web-design-guidelines` from its current upstream rules: native controls, named icon buttons, keyboard access, skip link, visible focus, live updates, semantic regions, wrapping addresses, responsive zoom, no essential hover-only evidence, reduced motion, explicit dark color scheme and theme color. Also applied React performance guidance and fetched current React state/event documentation via Context7.

## Assets and provenance

- `public/pixel/relay-coast.png`: original decorative wallpaper generated with the built-in image generation tool on 29 October 2026; no text, logos or portraits. Final prompt and tool recorded in `pixel-desktop-review/assets.json`. All evidence, app chrome, controls and text are DOM/React.
- Pixel icons and Lacak OS signal-path mark: original code-native SVG in `src/pixel-desktop/PixelIcon.tsx`.
- Silkscreen Regular: Google Fonts upstream, SIL Open Font License, copied alongside the font in `public/fonts/Silkscreen-OFL.txt`. Inter retains existing self-hosted license.

## Approval and schedule

The user explicitly requires screenshot approval before migrating remaining UI. This candidate does not migrate production routes or change M1 gameplay, scoring, persistence, content or tests. Approval applies to this concrete screen and system.

M2 remains targeted for **2–4 November**: Chapters 2–3 and shared recovery checkpoints. This bounded visual spike uses part of current visual-refinement capacity; no milestone change is made or claimed. Remaining UI migration is deferred until approval and must fit around core M2 implementation. If migration would consume M2 capacity or change these dates, report the impact before expanding scope. The prototype’s empty Messages app is not Chapter 2 delivery.
