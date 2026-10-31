# Visual direction — interactive case dossier

29 October 2026. Bounded presentation upgrade of the playable M1 build. The approved GDD, UX structure, Inter / Space Grotesk typography, Paper / Ink / Slate / Teal / Amber palette and two-column homepage remain the foundation.

The visual idea is Ari's investigation dossier. The cover introduces an unresolved invitation; opening it reveals a question rather than an answer. Its keyboard-operable disclosure is local presentation state and never creates a gameplay event. The headline and primary Start/Continue action retain their existing behavior. A connected chapter thread introduces the three-part story, accurately marking Chapters 2–3 as in development.

Three matching editorial illustrations use cut-paper/gouache textures, slate desks, ivory stationery, amber window light and restrained teal. They establish place and mood without encoding clues. Recruitment messages, source claims, journal entries and choices remain accessible HTML. The workspace scene reappears between the homepage dossier and the first narrative scene, joining them through the same light and materials.

The game uses distinct surfaces: a dark Slate narrative spread, a white email artifact inside its neutral frame, a paper-folder journal, paired claim/reference sheets for verification, and an Amber-accented decision document. Discovered evidence receives a visible, politely announced receipt; examined controls change both text and appearance. No hotspot depends on hover, color, animation or image pixels.

`design-taste-frontend` informed the single framed work surface, connected chapter composition, shared edges and screenshot correction loop. The existing M1 `framed-sheet` direction (seed 765297425) was retained. Its generic app palette was subordinated to the approved brand. `web-design-guidelines` informed native disclosure controls, focus contrast, explicit image dimensions, touch targets and reduced motion. `vercel-react-best-practices` informed deriving phase labels during render, keeping preview/error state local, and avoiding effects, animation libraries and unnecessary memoization.

Motion is short transform/opacity feedback, with no automatic scene advancement. Reduced motion removes it. Responsive art has explicit dimensions and two WebP sizes per illustration; supporting imagery loads lazily. If downloads fail, original SVG/CSS fallbacks preserve the narrative and actions.

Reuse these surfaces and artwork in M2; add only chapter-specific artifacts. This pass introduces no scoring changes, dependencies, new gameplay states or deployment work. See [validation and remaining work](visual-upgrade-validation.md), [artwork provenance](visual-artwork-prompts.md) and [before/after comparison](visual-review/index.html).
