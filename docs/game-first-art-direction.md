# Game-first visual direction — Product Owner review

Status: **proposal and representative prototype; game-wide adoption awaits Product Owner review.** 29 October 2026. This document supplements the existing GDD and UX architecture; it does not revise gameplay, scoring, story outcomes or save semantics.

## The visual idea

**Ari's room is the stage. Every message interrupts that room. Every discovery becomes a physical case note.**

The screen opens into a place and a character. A compact game HUD frames the scene; a readable artifact opens within it. Ari remains present as the player's point of view. The room returns when an artifact closes. The current website's page header, wide margins, document grid and footer give way to a scene, a mode and an action.

The existing Paper / Ink / Slate / Teal / Amber identity and local Inter / Space Grotesk fonts stay. Amber identifies an inspectable action, never a correct answer or proof of fraud. No game currency, badges, invented scores, new puzzles or real countdown are introduced.

## Reference study

| Reference | Observed presentation principle | Original TrustTrail application |
|---|---|---|
| [Tangle Tower](https://store.steampowered.com/app/359510/Tangle_Tower/) | Painted environments fill the stage; large expressive characters inhabit the foreground; dialogue has its own clear reading area. | An original Indonesian graduate's room with coherent day/evening/night light, plus a separate reusable Ari sprite. Use its separation of environment, character and readable dialogue. |
| [Ace Attorney Investigations](https://www.mobygames.com/game/45325/ace-attorney-investigations-miles-edgeworth/screenshots/iphone/944470/) | A large character portrait and stable dialogue box anchor the scene; organizer/save actions stay compact. | Ari's expression is visible beside the investigation; dialogue and case actions stay in predictable positions. The portrait is a character, not a small website avatar. |
| [The Case of the Golden Idol](https://www.gamekult.com/actualite/the-case-of-the-golden-idol-retour-emerveille-sur-les-lieux-du-crime-3050855640.html) | A scene invites inspection; collected information persists; exploration and reflection are visibly different modes. | Clear Room / Investigation / Decision compositions and a journal containing only inspected information. Retain the existing decision mechanic rather than introducing its word-completion puzzles. |

Steam screenshots and the Gamekult article image were inspected locally as references. The linked MobyGames page/caption was readable, but its image CDN timed out; an additional [public iOS screenshot](https://mwm.ai/fr/apps/ace-attorney-investigations/1227608370) was inspected for portrait/dialogue composition. Reference images remain in ignored review cache only. No commercial-game image, character, layout asset or text is included in the proposed game art or generation inputs.

## Current implementation audit

| Current component/screen | Keep | Presentation change proposed |
|---|---|---|
| Homepage dossier | Identity, premise, Start/Continue, privacy and save handling | Eventually become a title/menu scene with Ari's room as the dominant setting; no rollout in this review. |
| App shell | Routing, guide access, simulation/save status | In-game HUD instead of website navigation/footer. Menu opens real labeled navigation. |
| Narrative | Authored lines, explicit advance, focus and backlog | Environment fills the stage; portrait and dialogue occupy the foreground. |
| Investigation | Email/decoy/source, explicit inspect events | Select an artifact through labeled scene actions; open a legible inspector. Closing it returns to the room without changing progress. |
| Evidence Journal | Derived discoveries, explanation, caution, late-evidence marker | Case-file cover/index and individual notes with actual evidence identifiers; empty state never hints at undiscovered answers. |
| Decision/verification | Existing options, explicit commitment and two-step source task | A compositional change to a decision document with Ari in frame; no default selection or answer-colored portrait. |
| Consequence/debrief | Branch text, recorded facts and forward paths | Return to the same stage and character/dialogue grammar; chapter handoff becomes a short case-closing transition. |
| Engine/provider/persistence/tests | All contracts and behavior | No changes. Review prototype uses the existing reducer in memory and cannot read or write the player's save. |

## Visual system specification

### Character illustration

Original Ari: young Indonesian adult, warm brown skin, short wavy black hair with a recognizable forelock, deep teal rolled-sleeve overshirt and ivory T-shirt. Confident hand-inked contours, restrained gouache grain, simple two-step shading and a strong silhouette. Expressions: attentive curiosity, uncertainty and calm resolve. The face and clothing remain consistent; expression communicates narrative mood, never whether the player's choice is correct. No lip-sync or sprite-animation system is needed.

### Environment/background

One recognizable rented room, with window slats, neighborhood roofs, wooden desk, plant, books and blank-screen devices. Layered foreground/midground/background and warm light create depth without 3D. Chapter 1 uses afternoon light; Chapter 2 proposes the same room at early evening; Chapter 3 proposes night. Objects carry no readable evidence. A separate fictional recruitment lounge is an **optional mood study**, not a verified company office or a new canonical location. It must not be used to imply the invitation is legitimate.

### Game HUD

One compact top band: TrustTrail identity, chapter/current mode, concise simulation status, discovered-evidence count and Journal/Menu. Counts derive from accepted events. Future save status comes from the existing provider; the review entry honestly says progress is not saved. Guide/menu/backlog remain available without consuming artifact space. Controls have text labels and targets at least 44px; no decorative status pills or dashboard metrics.

### Dialogue presentation

An opaque Paper dialogue plate with Ink text sits in the foreground, linked visually to Ari's portrait and a clear speaker name. Body 18–22px on desktop and at least 16px on phones; 1.5–1.65 line-height. Whole lines appear immediately. One explicit advance action, a readable line position, and optional read-only backlog. A narrator uses the same plate with an honest speaker label. No typewriter wait, auto-advance or audio dependency.

### Investigation interactions

The room has clearly labeled native buttons for the laptop invitation, campus archive and independent directory. These select transient artifacts and grant no evidence. The open artifact becomes the dominant reading surface, not a miniature laptop-screen texture. Existing sender/deadline/destination buttons remain explicit and touchable; opening or focusing a panel earns nothing. Source inspection and comparison remain separate actions. Keyboard order follows HUD → artifact navigation → artifact → next action. Mouse, touch and keyboard reach the same content.

### Evidence Journal

A native modal case file contains a brief cover/count and actual discovered entries. A new discovery receives a short visible receipt and polite live announcement, then persists as a note. Titles, explanation and caution remain DOM text. No undiscovered clue silhouettes or prefilled answers. The interface shows late evidence using the existing choice record; colored paper is context, not truth classification. Closing restores focus to the opener.

### Decision scenes

The environment and Ari remain present while the artifact gives way to a focused decision plate. All authored options use real radios, full descriptions and one explicit commit button. Selection changes the radio/border only; no reassuring green/red prediction. Review evidence returns through existing guards. Verification, consequence and reflection remain reachable on every branch.

### Scene transitions and progression

Use 120–220ms opacity/translate feedback for artifact entry, mode changes and evidence collection. A chapter handoff can use a brief opaque title plate with explicit Continue, never an invented extra state or timer. No looping breathing, parallax, screen shake or automatic clue fly-to animations. Reduced motion renders the same final content immediately. Image failure leaves readable text, controls and a flat illustrated fallback. No evidence is baked into pixels.

### Mobile adaptation

At 360px the active artifact gets the full reading width. The room/portrait becomes a compact contextual stage above it; closing the artifact restores the full room view. The journal is a full-width native sheet. HUD labels wrap intentionally; no horizontal scrolling strip or portrait beside a 200px email. At 768px keep a useful scene margin only while the artifact remains readable. At 1440px the room, substantial portrait and open document share the stage. Natural vertical growth and safe-area padding take precedence over fixed screen heights.

## Asset plan and boundaries

Produce three matching Ari expression sprites, three chapter-lighting versions of the same room, one optional fictional recruitment-lounge study, and one reusable unmarked stationery still life. Export optimized local WebP alternatives with alpha for character sprites. No dialogue, important evidence, labels, controls or readable text in generated art. Preserve the current assets as the existing implementation's assets and fallback resources.

The representative prototype lives at `art-direction.html` inside this existing Vite project. It demonstrates one Chapter 1 investigation stage and its related dialogue, journal and decision modes using existing content/reducer/shared components. It is a review entry, not the production route. The approved game is unchanged. Asset inventory, screenshot review and test results accompany the concrete review package.

After Product Owner review: consolidate shared artifact presentation, adapt the production shell and scene renderer, then apply the same system to authored M2 chat/portal content. Do not start a second UI framework, add animation dependencies or commission branch-specific scenes. Adoption must pass the existing suite plus responsive/keyboard/image-failure checks before each milestone.
