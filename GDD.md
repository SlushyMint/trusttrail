# TrustTrail — Game Design Document

**Version:** 1.0 (Codex handoff)  
**Date:** 29 October 2026  
**Status:** Product direction approved; detailed mechanics proposed for Phase 0 review  
**Competition:** MIT-WEEK 2026 — *The Trust Trap: Navigating Digital Deception*

## 1. Vision and scope

**Title:** TrustTrail  
**Tagline:** Think Before You Trust.  
**Genre:** Hybrid narrative investigation / educational simulation  
**Platform:** Responsive web application, desktop-first  
**Language:** Bahasa Indonesia  
**Audience:** Indonesian students, internship seekers and fresh graduates  
**Target session:** 12–18 minutes (design target, to validate)

The player helps Ari, a fictional fresh graduate, navigate a suspicious recruitment journey. Players inspect simulated emails, chats and a recruitment portal; gather evidence; choose actions; observe consequences; and learn prevention and recovery practices.

### Design pillars
1. **Recognize:** Examine evidence and identify red flags without pretending to establish certainty.
2. **Learn:** Make meaningful decisions and receive specific explanatory feedback.
3. **Act:** Practice verification, protective steps, recovery and reporting.
4. **Evidence over appearances:** A polished interface or HTTPS does not prove legitimacy; a typo does not automatically prove fraud.
5. **Safe by design:** No real credentials, OTPs, identity documents or malicious links.

### Locked decisions
- Hybrid narrative + digital investigation format.
- 2D Editorial / Illustrated art direction.
- Balanced difficulty with realistic ambiguity.
- Job-recruitment scam focus and three interconnected chapters.
- No mandatory login; game useful without sensitive personal information.
- A fully functional vertical slice before expanding the story.

### Proposed decisions pending Product Owner review
- Ari as protagonist and NovaTech as fictional company.
- Three chapter titles, exact dialogue, four evidence clues per chapter.
- Four-competency scoring and precise weights.
- Recovery learning for every player (incident recovery for risky paths, hypothetical recovery for safe paths).
- React/TypeScript/Vite stack and specific libraries.

## 2. Official competition requirements

The official case, *The Trust Trap: Navigating Digital Deception*, calls for a deployed web app that helps Indonesian youth recognize digital deception, practice safer decisions or take action when something seems wrong. Recognize, Learn and Act are suggested approaches, **not three mandatory separate features**. Depth and effectiveness are preferred to feature count. At least one primary feature must respond meaningfully to user input.

Security/privacy boundaries: do not require sensitive information; use fictional safe examples; be transparent about limitations; do not imply certain scam detection; disclose third-party transmission if any.

From the uploaded MIT-WEEK technical guide:
- Submission deadline: **10 November 2026, 23:59 WITA**.
- Public GitHub repository with README and technical documentation; working live deployment; demo video **maximum five minutes**.
- Preliminary weights: Functionality 35%; Case Relevance 25%; UI/UX 20%; Code/Maintainability 10%; Documentation 10%.
- Finalists: live presentation/demo and Q&A; prepare to explain design and technical choices.

## 3. Core gameplay loop

**Receive → Investigate → Decide → Consequence → Reflect → Continue**

1. Receive a message or recruitment claim through narrative context.
2. Investigate simulated artifacts: click or keyboard-activate evidence hotspots.
3. Journal records inspected evidence with context and relevance.
4. Decide among actions with different safety implications.
5. See narrative consequences, including risks or safer outcomes.
6. Read brief, specific feedback and recommended next action.
7. Continue the story, with state carrying forward where meaningful.

**Branch-and-rejoin:** choices create distinctive consequence scenes and persistent flags, but reconnect to a shared narrative spine. Avoid exponential branching.

## 4. Player experience and screens

| ID | Route/state | Purpose | Required interaction |
|---|---|---|---|
| S01 | `/` landing | Identity, Start, Continue, How to Play, disclaimer | Start/resume/reset |
| S02 | `/play` briefing | Introduce Ari, objectives, safe simulation | Acknowledge/start |
| S03 | `/play` narrative | Illustrated story scene and dialogue | Advance dialogue |
| S04 | `/play` investigation | Simulated inbox, chat, browser artifacts | Inspect hotspots, switch artifacts |
| S05 | `/play` journal | Review discovered clues and explanations | Open clue, return to artifact |
| S06 | `/play` decision | Choose contextual action | Submit one option |
| S07 | `/play` consequence | Show story outcome and educational feedback | Continue |
| S08 | `/report` | Competency results, missed clues, safety advice | Replay, open guide |
| Guide | `/guide` | Protective/recovery checklists | Navigate guidance |

**Desktop layout:** top status/header; compact artifact navigation left; main evidence canvas center; evidence journal on right; dialogue/action footer.  
**Mobile layout:** single active panel with tab navigation; journal as accessible drawer; no hover-only controls.  
**Accessibility:** semantic buttons, visible focus, keyboard traversal, readable contrast, reduced motion, clear screen-reader labels and non-color-only feedback.

## 5. Narrative outline and dialogue draft

### Chapter 1 — An Opportunity Too Good?
**Objective:** Evaluate an unexpected internship invitation.  
**Opening:**
- Ari: “Sudah 43 lamaran. Belum ada yang berhasil. Semoga hari ini ada kabar bagus.”
- Email: “Selamat! Kamu terpilih mengikuti tahap akhir rekrutmen NovaTech Internship Program.”
- Ari: “Serius? Tapi... aku bahkan nggak ingat kapan daftar ke sini.”
- Prompt: “Periksa undangan ini sebelum Ari mengambil tindakan.”

**Artifact:** Simulated email with sender address, message body, urgency claim and fictional link. Include a separate simulated official careers listing for independent verification.  
**Learning:** Domain mismatch, urgency, link destination, independent verification.  
**Ambiguity:** A different legitimate-looking communication in the environment may be imperfectly written; teach that surface polish alone is not decisive.

### Chapter 2 — The Friendly Recruiter
**Objective:** Evaluate an impersonating recruiter and a request for personal documents.  
**Opening:**
- Ari: “Ada yang nge-chat. Katanya recruiter dari NovaTech.”
- Recruiter: “Halo Ari! Saya Naya dari tim rekrutmen. Saya lihat kamu aktif di organisasi kampus. Profilmu cocok untuk program kami.”
- Recruiter: “Untuk mempercepat proses, boleh kirim foto KTP dan data rekening melalui chat ini?”
- Ari: “Dia tahu kegiatanku. Berarti benar dari perusahaan itu, ya?”

**Artifact:** Simulated chat and recruiter profile; official contact verification panel.  
**Learning:** Impersonation, publicly available information, privacy, independent contact verification.  
**Safety:** Do not accept real KTP or bank account data; any 'share' choice uses a fictional narrative event, not a form.

### Chapter 3 — The Final Verification
**Objective:** Respond to a simulated portal requesting credentials, OTP or payment.  
**Opening:**
- Recruiter: “Tinggal satu langkah lagi, Ari. Masuk ke portal kandidat untuk aktivasi akun.”
- Ari: “Tampilannya mirip website perusahaan. Ada logo, HTTPS, bahkan testimoni.”
- Recruiter: “Kalau sudah menerima OTP, kirim ke saya supaya prosesnya selesai.”
- Ari: “Aku sudah sejauh ini. Masa harus berhenti sekarang?”

**Artifact:** Nonfunctional, in-app mock recruitment portal; no live outbound deceptive links.  
**Learning:** HTTPS and branding are insufficient, OTP secrecy, suspicious fees, recovery steps.  
**Safety:** Never present actual password or OTP fields that accept real user information.

## 6. Evidence map

| Evidence ID | Chapter | Interactive artifact | Discovery | Lesson |
|---|---:|---|---|---|
| C1-E01 | 1 | Sender header | Inspect sender address | Claimed identity vs actual domain |
| C1-E02 | 1 | Email body | Inspect 30-minute deadline | Urgency and pressure tactics |
| C1-E03 | 1 | Link preview | Inspect simulated destination | Display text may differ from destination |
| C1-E04 | 1 | Official careers panel | Compare published vacancy | Independent verification |
| C2-E01 | 2 | Recruiter profile | Inspect avatar/name | Identity can be imitated |
| C2-E02 | 2 | Chat personalization | Inspect public details | Personal knowledge is not proof |
| C2-E03 | 2 | Document request | Inspect requested items | Limit sensitive data sharing |
| C2-E04 | 2 | Official contact panel | Compare recruiter contact | Verify through independently found channels |
| C3-E01 | 3 | Portal chrome | Inspect branding/HTTPS claim | Professional appearance ≠ safety |
| C3-E02 | 3 | OTP request | Inspect verification prompt | Never share authentication codes |
| C3-E03 | 3 | Fee request | Inspect payment demand | Recruitment-fee red flag |
| C3-E04 | 3 | Safety checklist | Review recovery actions | Act promptly and appropriately |

Evidence must be discoverable by mouse, touch and keyboard. Discovery is recorded exactly once. Evidence IDs must be stable for save-state and scoring.

## 7. Decision matrix

| ID | Situation | Option | Consequence | Educational response |
|---|---|---|---|---|
| D1 | Unexpected internship email | Follow simulated link | Encounter risky mock portal; flag `openedSuspiciousLink` | Pause and verify independently before acting |
| D1 | Unexpected internship email | Ignore immediately | No exposure, but missed verification opportunity | Avoiding a link is safe; independent verification can preserve genuine opportunities |
| D1 | Unexpected internship email | Verify official careers channel | Find discrepancy; flag `verifiedRecruitment` | Verification uses an independently trusted source |
| D2 | Recruiter requests documents | Share fictional documents | Flag `simulatedDataExposure`; recovery later | Do not share sensitive documents through unverified channels |
| D2 | Recruiter requests documents | Block without checking | Avoid immediate exposure; uncertain claim | Blocking may be reasonable, but evidence-based verification is more informative |
| D2 | Recruiter requests documents | Withhold and verify | Flag `protectedData` | Confirm identity via official independently sourced contact |
| D3 | Portal asks for OTP | Share fictional code | Flag `simulatedAccountRisk`; recovery later | OTPs are for your own authentication, not recruiters |
| D3 | Portal asks for OTP | Continue without sharing code | Avoid OTP disclosure but portal still unverified | One safe action does not establish site legitimacy |
| D3 | Portal asks for OTP | Stop and verify | Flag `stoppedPortalFlow` | Independently verify before proceeding |

**Important:** These are core decision nodes, not the entire dialogue script. Codex should propose a content schema and flag any missing transition or feedback text before implementation.

## 8. Recovery mission

All players should practice one recovery decision sequence. If risk flags exist, frame it as Ari responding to a simulated incident. Otherwise frame it as a hypothetical friend asking for help. Teach: stop interaction, secure affected accounts through official channels, change exposed credentials if relevant, revoke sessions, enable MFA, contact the relevant provider, preserve evidence, report through appropriate official channels, and warn others without reposting sensitive data. Avoid suggesting every step applies to every incident.

## 9. Scoring and report

**Proposed competencies:** Evidence Awareness; Verification; Decision Safety; Recovery Readiness.

**Rubric design requirements:**
- Deterministic, transparent and testable.
- Reward inspection of relevant evidence and contextually safer decisions.
- Give partial credit for defensible but incomplete choices.
- Penalize risky simulated choices without shame or game-over lockout.
- Normalize competency scores to 0–100 based on defined opportunities, not arbitrary points.
- Ensure missed evidence and actions influence the personalized report.
- Never equate game score with certainty about a real job offer.

**Report contents:** overall learning score, four competency dimensions, noteworthy decisions, missed clues, targeted next steps, recovery checklist and replay. Exact weights and thresholds remain for Phase 0 proposal and Product Owner approval.

## 10. Visual design system

**Art direction (locked):** 2D editorial/illustrated, modern indie detective game, restrained and readable. No glossy 3D, decorative gradients or generic SaaS dashboard look.

**Proposed palette:** Midnight `#111827`; Slate `#1F3544`; Teal `#28B5A4`; Amber `#F0B35A`; Paper `#F5F3EE`.  
**Proposed typography:** Space Grotesk headings, Inter UI/body; use licensed/self-hosted or otherwise properly attributed assets.  
**Motion:** short purposeful transitions, clue discovery and message arrivals; reduced-motion equivalent.  
**Illustrations:** cohesive character/environment style, minimal distractions; exact asset generation pipeline to be verified in Phase 0.

Visual emphasis must guide investigation. Amber marks something worth examining, not proof of fraud. Never rely on color alone to communicate correctness.

## 11. Architecture guidance (proposal, not mandate)

Potential stack: React + TypeScript + Vite + Tailwind CSS; typed scenario data; lightweight reducer or Zustand; localStorage for anonymous progress; Vitest and Playwright; Vercel deployment. Codex must assess available tools/skills and justify alternatives.

Suggested modules: app shell, narrative engine, investigation renderer, evidence journal, decision engine, scoring, recovery, report, guide and shared UI. Separate authored scenario data from engine logic. Save-state must be versioned and resilient to invalid/old data.

## 12. Privacy, safety and transparency

- Do not collect real passwords, OTPs, KTP photos, bank details or unnecessary identifiers.
- Use `*.example` domains and internal simulated links; no actual phishing destinations.
- Explain that all organizations and interactions are fictional simulations.
- Do not make categorical scam-detection or safety claims.
- Store anonymous progress locally if needed; provide reset controls and clear disclosure.
- Do not send user content to third parties without clear notice and justification.
- Keep report share/export free of personal identifiers by default.

## 13. MVP scope and acceptance criteria

**Must-have:** landing/onboarding; three coherent playable chapters; interactive evidence hotspots; journal; meaningful decisions and consequences; contextual feedback; recovery learning; behavior-dependent Trust Report; guide; responsive UI; safe persistence; stable deployment; README and demo.

**Deferred:** leaderboard, user accounts, AI-generated scenarios, community reporting, multiplayer, expansive achievements, complex animation, additional chapters.

**Acceptance gates:**
1. A new player can finish the game end-to-end without errors or account creation.
2. At least two materially different decisions produce distinct consequences and report outcomes.
3. Every key decision has accurate explanatory feedback.
4. Every evidence hotspot is usable with keyboard and touch.
5. Risky decisions lead to learning/recovery rather than dead ends.
6. Refresh/resume/restart and direct routes behave predictably.
7. No sensitive data entry or real malicious link is required.
8. Public deployment and mobile experience pass smoke tests.

## 14. Delivery plan

- **Phase 0:** Capability audit, architecture, schema, state model, risk register, Git strategy and detailed plan. No app implementation.
- **Phase 1:** Scaffold, routing, tokens, responsive shell and reusable components.
- **Phase 2:** Chapter 1 vertical slice with all core mechanics and tests.
- **Phase 3:** Chapters 2–3 and recovery sequence.
- **Phase 4:** Trust Report and safety guide.
- **Phase 5:** QA, accessibility, security, performance and visual polish.
- **Phase 6:** Live deployment, documentation, GitHub submission and demo video.

**Critical path:** Chapter 1 vertical slice → reusable content engine → complete story → report → deployment verification.

## 15. Codex handoff instructions

1. Read this GDD and the official competition guide before finalizing architecture.
2. Distinguish **locked decisions**, **proposals**, and **unknowns**.
3. Conduct Phase 0 capability audit; verify MCP, skills and tools rather than assuming availability.
4. Produce architecture, schema, state machine, UX, testing, risk, implementation and Git strategy docs.
5. Do not begin implementation, install dependencies, change Git configuration, or push until approved.
6. Flag contradictions or missing narrative transitions in `docs/open-questions.md`.
7. Use clear acceptance criteria and prioritize working gameplay over feature count.

## 16. Source and version notes

- Official MIT-WEEK 2026 technical guide provided by Product Owner (8-page PDF).
- Official case-study text, *The Trust Trap: Navigating Digital Deception*, provided directly by Product Owner in chat.
- Product decisions and narrative drafts established during TrustTrail planning conversations on 29 October 2026.

This GDD is a product-design handoff, not proof that any functionality is already implemented. Updates require a version increment and Product Owner approval for locked decisions.
