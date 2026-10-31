# Bounded visual upgrade — validation

29 October 2026. The existing M1 project remains the application. No Git operation, dependency change, public deployment or competition submission was performed. Chapter 2–3 implementation was not included in this visual pass.

## Delivered

An interactive homepage dossier, a connected chapter introduction, three matching generated illustrations, a narrative room scene, a more tangible email artifact, a folder-style Evidence Journal, visible discovery receipts and differentiated verification/decision surfaces. The existing headline, CTA behavior, approved fonts and palette are retained. [Art direction](visual-art-direction.md) records the actual design decisions and skill application; [artwork briefs](visual-artwork-prompts.md) and [asset credits](asset-credits.md) record provenance.

## Verification results

Checks ran with Node **26.13.0** and the existing temporary official **npm 11.6.3** runner. Global npm was not changed. Engine checks remained enabled.

| Gate | Result |
|---|---|
| Strict TypeScript | Passed |
| ESLint, zero warnings | Passed |
| Unit/component/integration tests | **37 passed**, all existing tests retained |
| Production build | Passed; 118 modules; JS 314.45 kB / 98.09 kB gzip; CSS 40.39 kB / 9.16 kB gzip |
| Desktop/mobile browser suite | **32 passed** in installed Chrome 156.0.8078.73; desktop and Pixel 7 emulation |
| Responsive screenshot journeys | **33 checks**: 11 screens at each of 360, 768 and 1440px; no horizontal overflow, console/page errors or external requests |
| Protected-file integrity | **18 files unchanged**, verified by SHA-256 against the pre-pass snapshot |
| Screenshot viewer | All **33 before/after selections** load; 66 screenshot files exist |
| Selected text/surface contrast pairs | Eight pairs meet 4.5:1; lowest measured pair 6.07:1 |

The protected set includes the package manifest/lockfile, state provider/context, engine contracts/reducer/validation, scenario and Chapter 1 content, persistence implementation and all preexisting tests/helpers. See [integrity evidence](visual-review/integrity.json) and [contrast/viewer checks](visual-review/verification.json). Scores, outcomes, accepted-event semantics and save schema remain unchanged. New tests were added in `tests/smoke/visual-dossier.spec.ts`; no existing test was rewritten or skipped.

The eight added browser cases cover keyboard disclosure without save mutation, reserved artwork space during delayed downloads, usable game scenes when artwork fails, and touch/keyboard discovery under reduced motion without duplicate evidence events. The original suite still covers all three Chapter 1 choices, continued verification, persistence/reload, corrupt and blocked saves, multiple tabs, keyboard-only completion, modal focus and responsive investigation/source screens. These are browser checks, not a claim of full accessibility conformance or a performance benchmark.

## Screenshot review and corrections

[Open the local before/after viewer](visual-review/index.html). Capture metadata is retained for [before](visual-review/before/results.json) and [after](visual-review/after/results.json). Both local fonts loaded at every width. The final after-captures wait for eager artwork and short reveal transitions. Full-page modal screenshots also include underlying page context below the 1000px viewport; that region is not visible below a modal during ordinary play.

Reviewed homepage, narrative, email, discovered evidence, journal, source and decision screenshots across the required widths. Corrected the mobile hero's excess spacing, reduced the mobile email subject size while preserving its full text, and prevented an unfocused skip link from appearing in scrolled full-page captures. The skip link remains visible on keyboard focus. Discovery/journal text was rechecked after the animation settled.

TasteSkill's final homepage and email-workspace inspections each report **0 FAIL / 2 WARN**. Retained warnings are documented choices: approved Paper background; the explicitly preserved homepage headline; independent email/journal panes with content-driven heights. Source-style lint reports 0 failures and 17 label warnings; the sentence-case labels identify chapter/state/artifact context, a permitted app convention. They are not decorative marketing kickers. No suppression flag was added.

Web Interface Guidelines review of the changed implementation:

```text
src/components/CasePreview.tsx: ✓ pass — native button, named region, expanded/controls relationship, no hidden active controls
src/components/StoryArtwork.tsx: ✓ pass — alt policy, dimensions, responsive sources, loading priority and fallbacks
src/pages/HomePage.tsx: ✓ pass — retained heading order, real navigation, accurate chapter availability
src/pages/PlayPage.tsx: ✓ pass — derived phase label, visible polite discovery announcement
src/features/gameplay/ChapterViews.tsx: ✓ pass — existing labeled controls/focus behavior retained
src/features/gameplay/Investigation.tsx: ✓ pass — evidence remains behind explicit actions; art carries no controls
src/features/gameplay/EvidenceJournal.tsx: ✓ pass — discovered entries only; decorative icon hidden
src/styles/dossier.css: ✓ pass — visible focus, touch targets, reflow, reduced-motion and forced-colors treatment
```

Review source: [current Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Phase/preview state stays within the approved local game model; no routing or save-format dependency was introduced.

## Remaining work

No blocking visual defect was observed at the three requested widths. Real-device touch, a second browser engine, high-zoom assisted reading and screen-reader testing remain release checks. The small asset set deliberately reuses Ari's room across the four introduction lines; later chapters can reuse the same material/light treatment without commissioning another art batch now. The long email remains scrollable on phones so evidence is readable in full.

Continue M2 gameplay work using the existing event model and these visual surfaces. Chapter-specific chat/portal layouts and recovery screens still need their own screenshots and accessibility checks. Final scoring/report work remains M3, and release/demo preparation remains M4.
