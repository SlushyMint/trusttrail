# Homepage validation — 30 October 2026

Implemented locally and reviewed against the actual Chapter 1 UI. No Git operations, new dependencies, or deployment.

## Results

| Check | Result |
| --- | --- |
| TypeScript and production build | Pass (`npm run build`) |
| ESLint | Pass (`npm run lint`, zero warnings) |
| Unit / integration suite | 38 passed, including engine, persistence, controls and Chapter 1 |
| Chrome desktop / mobile browser suite | All 46 scenarios pass. The final run passed 44; two scenarios completed their app assertions but lost trace files because the concurrent Edge runner cleared the shared artifacts directory. Both passed isolated reruns with a separate output directory (2/2). The preceding complete suite also passed 46/46. |
| Edge desktop / mobile homepage suite | 6 passed |
| Design skill inspector | 0 failures, 1 warning at 1440×900, 768×1024, 390×844, with two documented allowances below |
| Design skill source lint | 0 failures; legitimate outlined inspection control warning retained |
| Requested widths | 360, 390, 768, 1440: no horizontal overflow; primary CTA above the fold; every main heading fits two lines |
| Keyboard / touch | Enter and Space toggle inspection; native disclosures work by keyboard; touch activates inspection; focus visible; skip link available |
| State isolation | Preview leaves all local storage unchanged in a fresh context and does not change an existing saved investigation |
| Chapter 1 regression | Completion, safer/risky branches, scoring, independent source comparison, resume, reload, conflict handling, reset confirmation and keyboard-only play covered |
| Motion | Reduced-motion check passes at all four widths; no forced or continuous animation |
| Accessibility measurements | Every visible control has a name and at least 44px height; images have alt text; live feedback has a polite status region |
| Privacy / loading | Zero automatic outbound requests; zero browser page errors; all four images and both fonts load |

Contrast ratios for the homepage's text/control token pairs: main text **15.51:1**, reading text **13.56:1**, secondary text **7.34:1**, window titles **8.75:1**, primary CTA **10.90:1**, inspection control **6.86:1**. These exceed WCAG AA's normal-text minimum. This is a targeted implementation audit, not a claim of full WCAG certification or testing with every screen reader.

The inspector's `still-page` allowance follows the brief's emphasis on purposeful feedback and the approved OS's still presentation. Its `eyebrow` allowance is a false positive: it misidentifies an attribution link inside a closed native disclosure as a kicker for the next section. All actual kicker labels were removed. Its single remaining warning asks for video; the real game interface and live inspection are more relevant than unrelated footage and avoid continuous decorative motion.

The skill's unknown-width height formula produces a 360×225 viewport. The requested 360px phone layout is therefore verified separately at 360×844 with the same browser tests, screenshots, font/image checks, target measurements and overflow checks as the other widths. No issue is hidden by changing the page for the inspector.

## Review artifacts

- [Desktop first screen](1440-fold.png) and [complete page](1440-full.png)
- [390px first screen](390-fold.png) and [complete page](390-full.png)
- [360px first screen](360-fold.png) and [complete page](360-full.png)
- [Tablet complete page](768-full.png)
- [Working inspection on mobile](390-interaction.png)
- [Actual Chapter 1 reference](chapter-one-reference.png)
- [Before desktop](before-desktop.png)
- [Machine-readable browser measurements](browser-results.json)
- [Verified statistics and primary-source links](statistics.md)
- [Design decisions and state boundaries](design-notes.md)
- [Visual critique](critique.md)

The final production preview is available locally at http://127.0.0.1:4173/. The development server is http://127.0.0.1:5173/.

## Practical limits

Tested in installed Chrome and Microsoft Edge, including mobile emulation and touch. Firefox, Safari, physical phones and dedicated screen-reader software were not tested. Source links were verified through official publications and indexed primary-source material as described in `statistics.md`; the full 38 MB IMDI report was not downloaded locally. The IASC number is explicitly a historical 2025 snapshot, not the latest total. Chapter 2 and 3 are teasers only, and no play duration is claimed.
