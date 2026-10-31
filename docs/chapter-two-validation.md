# Chapter 2 — The Friendly Recruiter

Implemented and locally validated on 31 October 2026, Asia/Jakarta. Chapter 2 is a complete continuation of Chapter 1. Chapter 3, recovery, and the final Trust Report remain outside this delivery. No dependency changes, Git operations, deployment, or external messaging were performed.

## Playable flow

After closing Chapter 1, select **Lanjut ke Bab 2**. The existing Chapter 1 bridge reflects the player's earlier choice. Three short narrative entries introduce Mira Pranesti, a fictional talent partner who knows Ari's public portfolio. Messages opens with a helpful personal introduction.

The player can inspect Mira's profile and choose three authored replies at their own pace. Later replies introduce a move to a personal SapaRuang account, pressure to bypass the central contact, and a request for identity documents and a home address before an interview. No typing delay, real account link, document input, or upload exists.

Three inspectable hotspots explain identity history, channel switching, and data minimization. Each includes a limitation: a new account, informal conversation, or absent listing alone does not prove deception. Browser supplies an independently opened fictional company directory and scheduling policy. Detail inspection and comparison are separate actions; opening an app never awards credit.

The consequential D2 choices are:

| Choice | Distinct result | Safety criteria |
|---|---|---|
| Share the fictional packet | Records `simulatedDataExposure`; discusses uncertainty, stopping further disclosure, and appropriate follow-up | 0 / 2 |
| Decline and end the conversation | Records `protectedData`; preserves uncertainty about the identity claim | 2 / 2 |
| Hold data and verify the assignment | Records `protectedData`; requires actual directory inspection and comparison before its outcome | 2 / 2 |

All branches have outcome, reflection, factual action counts, and chapter completion. They rejoin at an exposure-sensitive lead-in to Chapter 3's candidate portal. No unavailable Chapter 3 action is presented as playable.

## Engine and save compatibility

- `Chapter.conversation` extends the existing typed scenario. Authored content remains in `src/content/chapters/c2.ts`; the reducer owns eligibility, choices, discoveries, flags, and progression.
- `chapter.continued` requires the matching completed chapter and an available successor. `debrief.continued` retains the shipped C1 checkpoint. Adding C2 therefore does not reinterpret a completed C1 save as already entering C2.
- `conversation.advanced` requires the active conversation and exact next reply index. Its accepted history determines the conversation cursor. Future/repeated replies and premature decisions are rejected. Message evidence is unavailable until the relevant message has appeared; there is no evidence quota.
- The existing `trusttrail:save:v1`, schema 1, `trusttrail-1` content version, and rubric v1 are retained because existing C1 IDs and event meanings are preserved. New event payloads receive the same bounded, exact-field validation and replay checks. No saved totals or migration framework were added.
- Existing C1 choices, flags, evidence, reference records, and pre-commit evidence snapshots remain intact. Case Files includes an expandable C1 archive with its original decision and derived action counts.
- Awareness remains frozen at commitment. Source comparison performed during verification is marked **Setelah pilihan** in the journal. Verification requires inspected details plus comparison; safety is derived from the committed choice. Repeated actions never add duplicate events or rewards.
- Automatically selected story windows are registered with the desktop shell so keyboard focus can move between Messages and Case Files without hiding Messages. Presentation state does not create game events.

## Validation

Runtime: Node 26.13.0 and the existing temporary npm 11.6.3 runner. Package pins and lockfile unchanged.

| Check | Result |
|---|---|
| `npm run typecheck` | Passed |
| `npm run lint` | Passed, zero warnings |
| `npm run test:unit` | 45 passed, including the original 38 unit/integration cases |
| `npm run build` | Passed |
| Full production Playwright suite | 66 passed in desktop Chrome and Pixel 7 emulation |
| New C2 browser cases | 14 passed: full investigation/continuity, both other branches, partial chat/verification resume, responsive reflow, keyboard play, and restart |
| C1 end-to-end regression | All existing safe/risky/verify paths, save conflicts/failures, keyboard, responsive, and OS tests passed |
| Save replay | Every prefix of every C2 branch round-trips, including incomplete conversation, decision, partial verification, outcome, debrief, and completion |
| Input/layout | Touch activation and keyboard traversal; 320, 390, 768, and 1440 CSS px; reduced motion |
| Simulation boundaries | Full C2 journey asserts no runtime page errors or outbound requests; branch outcomes have no personal-data inputs/forms/iframes |
| Taste source lint for Messages | 0 FAIL / 0 WARN |

The source tests assert invalid/stale/duplicate replies, early and cross-chapter clues, impossible saves, explicit continuation, preserved C1 facts, branch flags, no evidence quota, and no retroactive scoring. Browser tests exercise real controls and reloads rather than importing the reducer as the browser oracle.

## Visual review

The existing Lacak/Saku palette, Silkscreen/Inter fonts, pixel icons, window chrome, and responsive shell are reused. No new photographs, illustrations, remote assets, or licenses were introduced. The homepage's design is retained; only chapter availability and continuation copy changed.

Screenshots were reviewed for [desktop conversation](chapter-two-review/conversation-desktop.png), [mobile conversation](chapter-two-review/conversation-mobile.png), and profiles at [320px](chapter-two-review/profile-320.png), [390px](chapter-two-review/profile-390.png), [768px](chapter-two-review/profile-768.png), and [1440px](chapter-two-review/profile-1440.png). The conversation is the main surface, with incoming and outgoing messages distinguished by placement and surface tone. Explanations sit next to the inspected message. At narrow widths, the profile button spans a row and reply actions use the available width. Existing fixed OS navigation stays outside the scrollable content. Paragraph spacing in the profile was improved after screenshot review.

Design critique: the screen makes the current identity claim and the next reply clear; content shares consistent gutters; all counts derive from the same state; zero evidence stays visible as zero; controls retain touch targets and focus outlines. Long Indonesian text remains readable without horizontal page overflow. The desktop deliberately retains overlapping OS windows and visible wallpaper. No numerical design rating is claimed.

The bundled Taste browser inspector timed out at `Page.enable`; its rendered measurement gate is not claimed as passed. Production Playwright screenshots and browser layout/keyboard/touch checks provide the visual validation recorded here.

## Remaining limits

Chrome desktop and emulated mobile are covered; real handset, Firefox/WebKit, and assistive-technology read-throughs were not performed. The new replies have polite live announcements, semantic controls, and browser-tested keyboard access, but this is not a screen-reader audit. Chapter 3 and recovery are still upcoming; no final overall score is invented. Saves remain browser-local with the existing storage failure and competing-tab notices.
