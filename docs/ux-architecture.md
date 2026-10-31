# UX and visual architecture

**Current presentation update (29 October 2026):** the approved Lacak OS desktop and Saku mobile system is integrated into production. See [production dual-OS architecture and validation](dual-os-integration/validation.md). `OperatingSystem` reads the existing provider, keeps game app instances stable across layout changes, and uses router URLs for presentation navigation. Earlier dossier/illustrated presentation notes below are historical; engine, event, scoring and persistence contracts remain authoritative.


Status: approved visual/UX direction retained under full production authorization. M1 now has playable Chapter 1, original SVG scene art, licensed self-hosted fonts, diegetic email/source/journal and responsive keyboard flows. Later chapter/report screens below remain planned. Historical Phase 1 blockers/approval gates are superseded by [production milestones](production-milestones.md).

## Visual concept and hierarchy

An illustrated case file frames Ari's recruitment trail. The artifact under examination is the dominant element; a restrained journal records what the player actually inspected. Editorial illustrations establish Ari's context at chapter openings; they do not carry essential evidence. Use flat surfaces and purposeful type, not a generic analytics dashboard or high-decoration cyberpunk interface.

Keep in-world recruitment artifacts distinct from TrustTrail's real controls. A persistent, concise simulation indicator and an inert illustrated address bar avoid confusing the portal with a real login page. Amber marks an inspectable detail, **not** a confirmed fraud indicator; label/status shape supports color. Do not pre-highlight only the correct answers. The benign imperfect-message decoy needs equally usable inspection.

## Proposed semantic tokens

| Role | Proposed value | Use |
|---|---|---|
| `color.ink` | Midnight `#111827` | Main text; primary control on Paper |
| `color.shell` | Slate `#1F3544` | Restrained shell/narrative context; Paper text |
| `color.paper` | `#F5F3EE` | Artifact/reading ground |
| `color.surface` | `#FFFFFF` | Raised reading surface only where distinction helps |
| `color.accent` | Teal `#28B5A4` | Selection/discovery feedback and limited accent areas; dark label |
| `color.attention` | Amber `#F0B35A` | Inspect affordances and contextual caution; dark label |
| `color.text.secondary` | Slate on Paper | Secondary text still readable; do not lower opacity blindly |
| `color.focus` | Midnight on light; Paper on dark | Visible outline with contrasting gap; never teal-only on Paper |
| `color.status.*` | Semantic ink + explicit text/icon | Final accessible pairs to verify in browser; red not needed as decoration |
| `font.heading` | Space Grotesk, system sans fallback | Headings/chapter title; licensed self-hosted font to be confirmed |
| `font.body` | Inter, system sans fallback | Controls, narrative, body; self-host if selected |
| Type steps | 14 / 16 / 20 / 24 / 32 px; landing display fluid 36–56 px | Body minimum 16 px; metadata 14 px; hierarchy scaled without shrinking evidence |
| Line height/measure | 1.5–1.65 body, 1.15–1.25 headings; 45–75 characters | Comfortable Indonesian reading |
| Spacing | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px | 4 px base, consistent gutters |
| Radius | 4 px controls, 8 px panels; artifact sheet may be square | Small fixed family, no inconsistent pills |
| Control target | >=44 × 44 CSS px preferred | Desktop and mobile actions; ensure minimum WCAG target rules |
| Depth | Flat surfaces; restrained shadow for floating drawer/menu | No glass, glow, gradient or shadow on every panel |
| Layers | base 0, sticky 10, popover 20, drawer/dialog 30 | Avoid uncontrolled z-index escalation |
| Motion | 120 ms feedback, 180–240 ms panel transition | Transform/opacity; reduced motion removes travel |

Calculated contrast using WCAG sRGB luminance formula in Phase 0 (opaque colors only): Midnight/Paper **16.00:1**; Slate/Paper **11.47:1**; Teal/Paper **2.30:1**; Amber/Paper **1.68:1**; Midnight/Teal **6.96:1**; Midnight/Amber **9.55:1**. Thus teal/amber text or sole control outline on Paper is unsuitable; use Midnight text and an adequate contrasting boundary/focus treatment. Actual font size, disabled/hover overlays and rendered states still need browser review. Target normal text >=4.5:1, large text >=3:1, meaningful UI/state contrast >=3:1. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Screen and route architecture

| Screen | Structure and primary action | Required alternate states |
|---|---|---|
| S01 `/` Main Menu | TrustTrail/title, short premise, Start, conditional Continue, guide, disclaimer/local-save notice | New, valid active save, completed report, incompatible save, storage unavailable |
| S02 `/play` Briefing | Ari/context illustration, objective, controls, simulation notice; Begin | Restore in progress; no player information fields |
| S03 Narrative | Chapter title, illustration, speaker/dialogue; Continue; read-only backlog | Long text/reflow, missing optional image, reduced motion |
| S04 Investigation | Task, artifact selector, central email/chat/portal/source, accessible inspect actions, journal, Decide | Uninspected/inspected, source task, available artifacts, no discovered evidence |
| S05 Journal | Real discovered entries, contextual detail, return-to-artifact | Empty instruction; discovered-after-choice marked; no hidden answers |
| S06 Decision | Situation, 2–3 actions, Review evidence, explicit commit | Selected not submitted, legal/unavailable with reason, pending verification resolution, stale double-click handled |
| S07 Consequence/debrief | What happened, why, safer next action; Continue | Safe/risky variants, incident/preventive recovery, educational limitation |
| S08 `/report` | Baseline-v1 score/fractions, competencies, choice timeline, missed clues, <=3 recommendations, neutral descriptive Indonesian feedback, checklist, Replay | Incomplete/no report, legitimate zero scores, saved completion restored; no achievement tiers |
| S09 `/guide` | Situational protection/recovery guidance and verified reporting resources | Direct entry; return-to-game; official source date/limitations |

`/play` states are not eight separate URLs. Route transitions update document title and focus the new heading. Back to guide/menu never changes committed choices. Unknown URL presents a useful not-found view. Optional illustrations failing to load cannot break the task.

## Component hierarchy

```text
App
  GameProvider + PersistenceAdapter
  RouteBoundary / ErrorBoundary
    AppShell (navigation, simulation label, save status)
      HomePage
      PlayPage
        BriefingView / NarrativeView
        InvestigationWorkspace
          ChapterTask
          ArtifactNavigation
          ArtifactRenderer (Email / Chat / Portal / OfficialSource)
            EvidenceInspectControl / ReferenceComparison
          EvidenceJournal + EvidenceDetail
          NarrativePrompt / DecisionAction
        DecisionView -> VerificationResolution -> OutcomeView -> DebriefView
        RecoveryView (same decision/feedback primitives)
      ReportPage (fractions, choices, gaps, recommendations, checklist, replay)
      GuidePage
  Shared: Button, Tabs, Drawer/Dialog, Notice, StatusMessage, FocusHeading
```

Use semantic native controls. Avoid inaccessible clickable text containers and a universal UI library unless it saves demonstrated effort. A simple labeled in-flow detail panel is preferable to a popover if both work. A single shared Drawer/Dialog implements Escape, focus trapping and return focus; do not reimplement behavior in each feature.

## Responsive behavior

| Band | Workspace behavior |
|---|---|
| Wide desktop, provisional >=1200 px | Compact labeled artifact navigation (about 176 px), fluid artifact canvas, journal rail (about 288 px); bottom narrative prompt grows naturally |
| Tablet, provisional 768–1199 px | Navigation folds to top selector; main artifact fills space; journal becomes a drawer/tab; no squeezed three-column layout |
| Phone, <768 px | One active panel. Tabs such as Artefak / Catatan with explicit labels; artifact type selector within active panel. Journal can open as accessible full-height sheet. Decision is full-width; narrative remains reachable |

Breakpoints are content-driven proposals; adjust after measuring the vertical slice. Desktop grid example at 1440 px: outer margins 24×2 + nav 176 + gutters 24×2 + journal 288 + artifact 880 = 1440. If the artifact's minimum readable width is not met, fold the journal earlier. Do not impose fixed viewport height that clips large text or mobile browser chrome.

Check 360, 390, 768 and 1440 px plus 320 CSS px reflow/zoom. No horizontal page scroll; long domains wrap visibly without omitting their meaningful suffixes. A controlled artifact scroller is acceptable only if content remains keyboard/touch accessible. Persistent action areas must not cover evidence, focused controls or virtual/browser UI. Respect safe-area insets.

Tabs follow the [ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/): named tablist, selected state, associated panels, arrow/Home/End navigation, meaningful focus order; use manual activation if panel changes are expensive. Nonactive panels must not retain focusable hidden controls. Focus returns to the selected tab/inspect trigger when a drawer closes; source comparisons remain reachable without hover.

## Investigation interaction design

- Sender: Periksa pengirim expands actual address; expansion records the deliberate inspection, then explanation becomes available.
- Link: Periksa tujuan reveals inert display/destination comparison. Following a simulated link uses an internal artifact control; inspection and following are distinct actions.
- Official source: opening the fictional directory/reference earns zero credit. Player explicitly inspects a relevant domain/contact/listing detail, then compares the claim to that source. These are separate meaningful actions with separate criteria; neither can fire on panel mount, focus, scroll or choosing Verify. Full source credit requires both.
- Chat: inspect profile, public-detail personalization and document request through labeled detail actions. No actual document picker.
- Portal: inspect the HTTPS/branding claim, OTP request and fee demand. No editable passwords/OTP/account/payment inputs, functional checkout or real redirect.
- Journal empty state explains how to inspect without listing answers. Discovery feedback uses a polite live region with the clue title; no long narration interruption.
- Decision commit is explicit; no auto-submit from focus. Feedback varies materially by option, then returns to the shared narrative spine.

Short interaction instructions help onboarding. Essential gameplay semantics and narrative must remain present when motion is disabled or artwork is missing.

## Animation and asset strategy

Motion communicates selection, discovery, panel transition or message arrival. No typewriter delay, mandatory countdown, parallax, autoplay, screen shake or animation-dependent progression. The fictional 30-minute urgency stays story content, not a real ticking performance penalty. Reduced-motion mode displays the same content immediately; never hide a clue behind animated travel. Motion library is deferred unless a concrete use warrants it.

No visual assets currently exist in the workspace. Proposed minimal set: one Ari character illustration with a small number of reusable expressions, one consistent recruitment-journey environment/scene treatment reused across three chapters, a small original TrustTrail mark, and one consistent icon set or native symbols. Final quantity and licenses are approvals, not Phase 0 production work. Render all evidence text, URLs and interface labels as real DOM text; do not bake them into images.

The review retains this minimal reusable-asset strategy and editorial direction. New illustrations per branch, achievement badges and decorative asset expansion are outside the baseline. Safe-path bridges use narrative copy and inert artifacts, preserving careful behavior without requiring extra art or a risky interaction. Report feedback names what the player did in Indonesian, rather than assigning a character/achievement label; see [rubric v1](scenario-data-schema.md).

Prefer custom/editorial illustrations or built-in image generation for approved raster story assets, with art bible, provenance and final workspace files. Keep all company/logo/person depictions fictional; NovaTech is a proposed in-world name, not a claim no real entity uses that name. Use no scraped real recruiter photos or copied commercial UI branding. Optimize final artwork, provide intrinsic dimensions and alt text where informative, and keep gameplay functional without it. Self-host font files only after license verification; system font fallback must remain usable. Maintain an asset/license ledger and disclose AI use if official rules require it.

## Accessibility acceptance

Target WCAG 2.2 AA behavior; do not claim formal conformance until tested. [W3C standard](https://www.w3.org/TR/WCAG22/)

- `lang="id"`; page landmarks, one clear h1, logical subheadings and reading order.
- All critical tasks complete using Tab, Shift+Tab, arrows where appropriate, Enter/Space and Escape; no keyboard traps outside intentional modal focus.
- Persistent visible focus, not obscured by footer/drawer; skip link and meaningful accessible names. Hover content has keyboard/touch equivalent.
- Text resize 200%, reflow at 320 CSS px/400% desktop zoom without losing tasks. Test long Indonesian content and address wrapping.
- Contrast as above; icon/text/status labels accompany color. A clue's safety interpretation is never encoded solely by hue.
- >=44 px preferred targets, with sufficient spacing; evidence is not a tiny pixel hunt. No drag-only, time-limit or fine-pointer-only action.
- Screen reader announcements for discovered clue/save failure; do not make whole chat or changing scene an assertive live region. Focus heading after scene change.
- Reduced motion, no flashing and no automatic audio; no sound needed for any clue.
- Error/retry/reset language explains consequences. Confirm reset only because it replaces saved game progress; ordinary clue discovery needs no confirmation.

Automated axe checks supplement manual keyboard and screen reader review; they cannot verify narrative clarity or absence of spoilers. See [test strategy](testing-strategy.md).

## Skill application and conflicts

TasteSkill's landing workflow fits S01, app-screen workflow fits investigation/report. Preserve the proposed product palette/type where approved. Its app-screen navy prohibition conflicts with TrustTrail's palette; aesthetic rules cannot override product approval. Its marketing floors for image counts and moving elements conflict with concise game onboarding, performance and reduced motion; do not expand scope to satisfy them. Record each intentional exception and assess screenshot quality directly. No visual-inspector pass is claimed during planning.

Vercel React performance guidance governs component/bundle work, Web Design Guidelines governs later actual-file review, and Security Best Practices governs inert simulations and safe storage/rendering. Accessibility and safe gameplay have priority over decorative composition. Figma is optional and currently has no exposed tools; do not make it a blocking handoff.
