# Screenshot critique notes

Self-review using TasteSkill's app-screen guidance and screenshot critique process, not an independent design rating. The approved brand, 2D illustration brief and preserved headline take precedence over generic marketing-page rules. Review was bounded to correction of visible problems rather than another design direction.

## ROUND 1

Seen in one second: a tactile recruitment dossier beside the existing TrustTrail headline.

Idea (one sentence): opening Ari's case leads from a fictional invitation into an investigation made of readable artifacts.

Live thing: the dossier disclosure asks what to inspect; genuine game evidence still requires explicit actions.

Layout words by section: hero=split dossier/title / introduction=editorial text / chapters=connected thread / gameplay=framed artifact / narrative=scene and dialogue.

Scores: design 7.4 · usability 7.6 · creativity 7.5 · content 8.0 → overall 6.0 after cap.

Caps applied: first inspection still had mobile spacing/headline failures; the passing-meter requirement caps the score at 6.0. App conventions permit contextual labels and document edges; the brief requires illustrations and the retained brand palette.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. Mobile homepage had too much space below its dossier (`360-home.jpg`): reduce hero bottom padding to 32px.
2. Mobile email subject occupied three oversized lines (`360-email.jpg`): use 20px/1.35 on phones, retaining all words and readable body copy.
3. Scrolled full-page source capture painted the offscreen skip link (`360-source.jpg`): clip only when unfocused, retaining its keyboard reveal and focus treatment.

## ROUND 2 — final

Seen in one second: the invitation dossier; in play, a readable email in a case workspace.

Idea (one sentence): Paper, Slate and amber light connect Ari's room, the untrusted artifact and the player's case notes.

Live thing: investigate explicit details, receive an evidence receipt, compare an independently opened source and make the existing consequential choice.

Layout words by section: hero=split / introduction=editorial text / chapters=thread / narrative=dark scene / investigation=artifact with journal / verification=paired documents / decision=choice document.

Scores: design 7.8 · usability 8.0 · creativity 7.7 · content 8.2 → overall 7.9.

Caps applied: none under the app-screen rubric and explicit user constraints. Final inspectors have zero failures. Palette/large-homepage-title warnings reflect the retained brand; the pane-height warning reflects independent working panes rather than equal peer cards.

Top three problems (most visible first), each with the screenshot it shows in and the fix:

1. No blocking alignment, overflow or obscured action observed in final required-width screenshots. Keep this as the bounded pass rather than changing the approved composition again.
2. Narrative illustration repeats between introduction lines (`768-narrative.jpg`): reuse it in M1; reserve any genuinely necessary scene variation for authored later-chapter work.
3. Full-page journal captures show underlying page below the viewport (`360-journal.jpg`): explain this capture limitation in the comparison viewer. The actual modal remains viewport-sized and retains native focus containment.

Final imagery, controls, journal text and subject were viewed after short transitions settled. The inspector uses a very short 225px default viewport at width 360; the separate 360 × 1000 browser captures and existing reflow tests are the primary mobile layout evidence.
