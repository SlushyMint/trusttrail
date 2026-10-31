# TrustTrail — Production Blueprint v1.1
Date: 29 October 2026
Status: Pre-production specification; not yet approved for coding.

## Locked product decisions
- Hybrid narrative investigation game for students, internship seekers, and fresh graduates.
- Art: 2D Editorial / Illustrated; difficulty: balanced.
- Indonesian-language story; three chapters; fictional companies and reserved `.example` domains.
- Core loop: Receive → Investigate → Decide → Consequence → Reflect; Recognize / Learn / Act.
- Desktop-first, mobile responsive; no required login, no real credentials, no real phishing destinations.
- Deadline: 10 Nov 2026 23:59 WITA; prioritize a working live deployment.

## 1. Screen-by-screen UX specification
| ID | Route/state | Key UI | User action | Acceptance criterion |
|---|---|---|---|---|
| S01 | `/` Landing | Branding, Start, Continue (conditional), How to Play, simulation disclaimer | Start / resume | Start enters briefing; Continue only if valid saved progress |
| S02 | `/play` briefing | Ari introduction, safety notice, controls | Begin | No personal data required |
| S03 | `/play` narrative | Illustrated scene, speaker, concise dialogue, next/backlog | Continue | Dialogue advances deterministically, keyboard operable |
| S04 | `/play` investigation | Simulated inbox/chat/browser, inspectable hotspots, task prompt | Inspect clues | Inspected clue is recorded once, hotspots have accessible names |
| S05 | `/play` journal | Collected evidence, explanation, inspection status | Review clues | Journal reflects actual inspected clues, does not expose unearned answers |
| S06 | `/play` decision | 2–3 meaningful actions, optional review evidence | Choose | Selection changes scenario state and feedback |
| S07 | `/play` consequence | Outcome, risk explanation, safer next step | Continue | Every option has authored feedback; no dead ends |
| S08 | `/report` report | Four competency scores, missed evidence, next-step guidance, replay | Review/restart | Calculated from saved choices, not hardcoded |
| S09 | `/guide` recovery guide | Incident-response checklists | Explore | Available without game completion; no false assurance |

Desktop: persistent app shell; left simulated app switcher, central active artifact, right evidence journal, bottom narrative prompt. Mobile: one active panel at a time with tab controls and journal drawer. Do not reproduce functional login forms or accept real OTP, passwords, or identity uploads.

## 2. Narrative design
Protagonist: Ari, a fresh graduate seeking their first job. Company: NovaTech, fictional. Antagonist: a recruiter impersonator; identity not immediately revealed. Story arc is one continuous recruitment journey with branch-and-rejoin outcomes.

### Chapter 1: An Opportunity Too Good?
Opening Ari: “Sudah 43 lamaran. Belum ada yang berhasil. Semoga hari ini ada kabar bagus.”
Email: “Selamat! Kamu terpilih mengikuti tahap akhir rekrutmen NovaTech Internship Program.”
Ari: “Serius? Tapi... aku bahkan nggak ingat kapan daftar ke sini.”
Goal: examine invitation and independently verify company contact. Evidence: suspicious sender-domain mismatch, artificial deadline, destination mismatch, simulated official careers listing. Balanced decoy: a legitimate but imperfectly worded message should not be automatically called fraudulent.

### Chapter 2: The Friendly Recruiter
Recruiter: “Halo Ari! Saya Naya dari tim rekrutmen. Saya lihat kamu aktif di organisasi kampus. Profilmu cocok untuk program kami.”
Recruiter: “Untuk mempercepat proses, boleh kirim foto KTP dan data rekening melalui chat ini?”
Ari: “Dia tahu kegiatanku. Berarti benar dari perusahaan itu, ya?”
Goal: check impersonation, public-profile personalization, unsafe personal-data request, and independent verification.

### Chapter 3: The Final Verification
Recruiter: “Tinggal satu langkah lagi, Ari. Masuk ke portal kandidat untuk aktivasi akun.”
Ari: “Tampilannya mirip website perusahaan. Ada logo, HTTPS, bahkan testimoni.”
Recruiter: “Kalau sudah menerima OTP, kirim ke saya supaya prosesnya selesai.”
Ari: “Aku sudah sejauh ini. Masa harus berhenti sekarang?”
Goal: distinguish polished appearance from legitimacy; never disclose OTP; respond safely to possible exposure. Recovery path if earlier risky action occurred.

## 3. Evidence map (proposed authorable data)
| ID | Chapter | Artifact/hotspot | Meaning | Caution |
|---|---|---|---|---|
| C1-E1 | 1 | Email sender address | Domain differs from independently sourced official domain | A mismatch is a warning, not definitive proof |
| C1-E2 | 1 | 30-minute deadline | Pressure to bypass verification | Urgency alone not proof |
| C1-E3 | 1 | Simulated link preview | Destination differs from claimed recruitment site | Never navigate to real malicious destinations |
| C1-E4 | 1 | Official careers listing | Independent channel cannot confirm invitation | Lack of listing alone not conclusive; use official contact |
| C2-E1 | 2 | Recruiter profile | Display name/photo are easy to impersonate | No real personal data |
| C2-E2 | 2 | Personalization | Recruiter knows publicly visible activity | Knowledge is not identity proof |
| C2-E3 | 2 | Request for ID/bank info | Sensitive-data disclosure via unverified chat | Do not ask player to upload any data |
| C2-E4 | 2 | Official HR contact | Confirms or contradicts recruitment claims | Entirely fictional in-app channel |
| C3-E1 | 3 | Portal design and HTTPS badge | Visual polish/HTTPS do not prove legitimacy | Explain HTTPS only secures connection |
| C3-E2 | 3 | OTP request | One-time codes should not be shared with recruiter | Do not generate or accept real OTP |
| C3-E3 | 3 | Administration fee | Upfront payment is a major warning sign | No payment links |
| C3-E4 | 3 | Recovery guide | Change password via legitimate service, revoke sessions, enable MFA, contact provider, report | Situational and non-exhaustive |

Evidence journal unlocks only inspected items. Some evidence is contextual rather than a red flag; every clue gets explanatory copy. Decisions should remain possible without inspecting every clue, but inspection improves educational feedback.

## 4. Branching decision matrix
| Decision | Options | Immediate consequence | State flag | Competency |
|---|---|---|---|---|
| D1: Invitation | Click simulated link / ignore entirely / independently verify | Simulated risky preview / missed opportunity / source comparison | `linkRisk`, `verifiedRecruiter` | Verification, decision safety |
| D2: Chat request | Share fictional data / block immediately / withhold and verify | Exposure narrative / possible premature conclusion / verified status | `dataRisk`, `verifiedRecruiter` | Evidence, decision safety |
| D3: Portal and OTP | Share simulated code / proceed without sharing / stop and verify | Account-risk narrative / continued uncertainty / safe verification | `otpRisk` | Decision safety |
| D4: Recovery (if risk flags) | Do nothing / contact unverified recruiter / secure account using official channel | Risk persists / worsens / guided containment | `recovered` | Recovery readiness |

All paths rejoin the next chapter. Narrative variants depend on flags, not a combinatorial tree. Three ending labels: Careful Investigator (consistent verification), Learning Guardian (some mistakes but recovered), Needs More Practice (unaddressed risky decisions). These are educational game labels, not a real-world security guarantee.

## 5. Scoring rules (provisional, to calibrate with tests)
Four dimensions: Evidence Awareness, Verification, Decision Safety, Recovery Readiness. Score each dimension from authored decision/evidence points, normalize to 0–100 by its available maximum; mark Recovery Readiness 'not assessed' if no recovery branch is encountered, or offer everyone a recovery mini-scenario to ensure comparable reports. Do not reward indiscriminate rejection as strongly as reasoned independent verification. Keep an event log of choices and inspected clues. No AI required.

## 6. Technical design
Stack: Vite, React, TypeScript, Tailwind CSS, React Router, Zustand (or Context if simpler), Vitest, Playwright, Vercel. Data-driven chapter definitions with typed evidence, decisions, branches, outcomes, and feedback. localStorage stores only pseudonymous game progress and can be cleared; validate save schema version and support restart. Avoid remote analytics by default. Use `.example` domains; all fake browsers are inert in-app mockups.

Suggested modules: `app/`, `components/narrative/`, `components/investigation/`, `components/decisions/`, `features/gameplay/`, `features/evidence/`, `features/scoring/`, `features/reports/`, `content/chapters/`, `lib/`, `types/`, `styles/`.

## 7. Codex implementation phases and acceptance gates
**Phase 0 — Architecture and specification audit (29–30 Oct):** Read GDD and official rules; identify ambiguity; propose types/state graph and assets inventory. Output architecture note, backlog, risks, acceptance test plan. Do not code until approved.
**Phase 1 — Design system + app shell (30–31 Oct):** Tokens, typography, desktop/mobile shell, routing, accessible components, placeholder illustrated scenes. Gate: responsive navigation and no console errors.
**Phase 2 — Vertical slice Chapter 1 (31 Oct–2 Nov):** Typed scenario engine, email simulation, evidence journal, D1, consequence and save/resume. Gate: complete chapter from landing to feedback; choices change outcomes; unit tests pass.
**Phase 3 — Chapters 2 and 3 (3–5 Nov):** Chat and fake portal simulations, D2/D3, conditional recovery D4, narrative variants. Gate: all routes and choices traversable, no dead ends.
**Phase 4 — Report and Act guide (5–6 Nov):** Deterministic competency scores, missed evidence, recovery checklist, restart. Gate: different playthroughs produce different reports and sensible recommendations.
**Phase 5 — Polish and QA (7–8 Nov):** Responsive, accessibility, motion reduced mode, browser compatibility, Playwright E2E, asset/license review. Gate: fresh user completes entire game in live-like environment.
**Phase 6 — Deployment and submission (9–10 Nov):** Public GitHub, README, technical notes, deployed URL, smoke tests, max 5-min video, submission buffer. Gate: public URL works, no 404 on refresh, no sensitive input, verified final links.

## 8. Test matrix
- Fresh user completes each decision path.
- Choosing risky vs safe option changes consequences and report.
- Journal only contains inspected evidence; repeated inspection doesn't double count.
- Refresh/resume/restart work; corrupted save falls back gracefully.
- Keyboard focus, screen-reader labels, reduced motion, mobile widths 360px and 768px.
- No real password/OTP upload; no outbound phishing URLs; no API transmission.
- Direct `/play`, `/report`, `/guide` navigation behaves predictably.
- Deployed production URL is checked independently of local development.

## 9. Competition constraints
Official rules permit AI tools, require a web app, public GitHub repository owned by team leader, README and technical documentation, live deployment, and a demo video no longer than five minutes. Preliminary judging: functionality 35%, case fit 25%, UI/UX 20%, code 10%, documentation 10%. Team size max four. No pre-existing completed project may be submitted as the main solution. Case brief emphasizes realistic safe simulations, transparent limitations, no sensitive information required, and working user-dependent feedback.

## 10. Open approvals before engineering
1. Final character/company naming and whether NovaTech is sufficiently distinctive.
2. Whether the game always includes recovery mini-scenario or only conditionally.
3. Final visual assets: custom illustrations vs licensed assets, with source/license ledger.
4. Confirm actual team size and Codex repository ownership workflow.
5. Freeze minimum feature scope after Chapter 1 vertical slice.
