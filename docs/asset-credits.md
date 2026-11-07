# Asset and font provenance

## Phase 6 original audio

6 November 2026, final SFX-only revision. All seven UI motifs in `src/features/audio/score.ts` are original, AI-assisted compositions authored specifically for TrustTrail. Native Web Audio sine oscillators generate the short effects locally. No recording, sample pack, external composition, commercial soundtrack, streaming service, or audio-generation model output is used.

| Audio | Origin and distribution | Attribution |
|---|---|---|
| OS startup, application opening, incoming message, evidence discovery, verification, chapter completion, final investigation | Original numerical note/envelope definitions in project source, synthesized on explicit actions | No third-party license or upstream attribution applies |

These original effects follow the project's distribution terms; this phase does not assign a new license to the repository. The Product Owner controls the final project license and publication. No external audio rights are asserted. Preferences use `trusttrail:audio:v2`, with safe legacy preference decoding; gameplay saves retain their existing schema. See [the Phase 6 report](phase-6-audio-security-report.md) for triggers, architecture, measurements and validation limits. Earlier audio evidence is historical and does not describe the final candidate.

## Phase 5C third-party software inventory

3 November 2026. Significant production libraries: React 19.3.1, React DOM 19.3.1, React Router 8.5.1, Motion 14.8.0 and PixiJS 8.22.0 each declare **MIT** in their installed, locked package manifests. Build tooling includes Vite 8.3.5 and Tailwind CSS 4.3.3 (MIT) and TypeScript 6.0.3 (Apache-2.0). Testing uses Vitest 5.0.5 (MIT) and Playwright 1.64.1 (Apache-2.0). [All 25 direct package license declarations](phase-5c-evidence/direct-dependency-licenses.json) are retained as release evidence; preserve relevant upstream notices/license files when redistributing. This inventory is not a legal clearance of every transitive resource.

The supplied guide permits AI tools and licensed third-party resources, and requires documentation of significant usage (PDF p. 3 C3–C4). It specifies no separate AI declaration template. Existing generation records disclose AI-assisted artwork/code/copy; the owner must confirm originality, development timing, and rights to the supplied city-concept reference before public distribution. `public/` is copied to the release output, including the unused concept reference, so publication review must include that file as well as rendered artwork. The guide prohibits claiming others' work as one's own or using a completed pre-competition project as the main solution (p. 3 C10).

**Homepage Phase B.1 — 1 November 2026:** seven compact WebP exports are technical derivatives of the approved Phase B city art, uniformly reduced with nearest sampling. No new creative imagery was generated. Original PixelIcon SVGs are reused for Mail, Browser, Case Files and archive files; the footer reuses the existing foreground. [Compact inventory](phase-b1-review/compact-assets.json), [reproducible exporter](../scripts/prepare-city-compact.mjs), [implementation and validation](living-city-phase-b1.md).

**Living city homepage, Phase B — 31 October 2026:** five original layers generated with the built-in `image_gen.imagegen` tool using the user-provided `public/assets/city-layer-concept.png` solely as art direction. Final layers, a technical emission mask, and a deterministic static composite are encoded as WebP in `public/assets/living-city/`. No reference panels were cropped or used as runtime backgrounds. [Exact prompts/source outputs](living-city-phase-b/generation-prompts.json), [inventory and dimensions](living-city-phase-b/asset-inventory.json), and [integration/validation](living-city-phase-b.md) record the work. The fictional city contains no real brand claims, interface text, or gameplay evidence.

**Current production assets:** the approved dual-OS game uses the original coastal pixel wallpaper (`public/pixel/relay-coast.png`), original pixel icons in `src/features/os/PixelIcon.tsx`, the matching stepped-signal SVG favicon, Inter and Silkscreen. [Exact wallpaper prompt/provenance](pixel-desktop-review/assets.json), [Silkscreen OFL](../public/fonts/Silkscreen-OFL.txt), [production validation](dual-os-integration/validation.md). Earlier illustrated assets listed below are historical and are not rendered by the production entry.


29 October 2026. All assets are local. No third-party image, font or script request is needed while playing.

| Asset | Author/source | License/use |
|---|---|---|
| TrustTrail mark, case-folder illustration and favicon | Original project SVG/CSS, retained/derived from Phase 1 | Project-authored; no copied commercial UI branding |
| Ari at the desk | Original SVG in `src/components/AriScene.tsx`, authored for TrustTrail during M1 | Code-native editorial scene; fictional person; no real recruiter photo or external reference image |
| Case dossier, Ari's workspace and desk vignette | AI-generated for TrustTrail with the available built-in image-generation tool on 29 October 2026; optimized local WebP variants in `public/artwork/` | Fictional editorial illustrations; no reference photograph, real person, embedded interface text or evidence. See [generation brief and provenance](visual-artwork-prompts.md). The original SVG remains the workspace fallback. |
| Inter Latin WOFF2, variable weight | The Inter Project Authors; [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/inter), [upstream project](https://github.com/rsms/inter) | SIL Open Font License 1.1; full copyright/license redistributed in [Inter-OFL.txt](../public/fonts/Inter-OFL.txt) |
| Space Grotesk Latin WOFF2, weight 600 | The Space Grotesk Project Authors; [Google Fonts source](https://github.com/google/fonts/tree/main/ofl/spacegrotesk), [upstream project](https://github.com/floriankarsten/space-grotesk) | SIL Open Font License 1.1; full copyright/license in [SpaceGrotesk-OFL.txt](../public/fonts/SpaceGrotesk-OFL.txt) |

Font binaries were downloaded on this date from the official `fonts.gstatic.com` URLs provided by Google Fonts CSS for Inter 400/600/700 and Space Grotesk 600. The three Inter weight requests returned identical variable-font bytes, so one local file is retained (48,256 bytes), alongside Space Grotesk 600 (13,284 bytes). No font software was modified. CSS preloads these two files with `font-display: swap` and usable system fallbacks. Latin coverage includes Indonesian copy and punctuation; unsupported scripts fall back to the system font.

Source WOFF2 URLs are retained in ignored `.cache/m1-font-sources.json` for reproduction. All message text, names, domains and numerical counts remain real DOM text. The fictional NovaTech identity is not a claim of real-world name uniqueness. AI-assisted authored code/copy/art should be disclosed if the final verified competition rules require it. The initial M1 illustrations were code-native SVG; the subsequent bounded visual pass added the three generated raster illustrations listed above. No third-party stock-art license is asserted for generated artwork.
