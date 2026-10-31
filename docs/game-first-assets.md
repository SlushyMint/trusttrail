# Game-first asset inventory — review set

29 October 2026. **Eight original illustrations, sixteen optimized WebP files, 1,239,338 bytes total.** All were created with the available built-in image-generation tool. No commercial reference image was supplied to generation. After the first Ari/room originals, subsequent calls used only those project-generated assets to maintain identity and lighting.

The files are in [src/art-direction/assets](../src/art-direction/assets/). They are imported only by the optional review entry or shown in the review package; the existing production game continues to use its current assets. Original tool PNGs remain in the Codex generated-images directory. No earlier asset was overwritten or removed.

| Asset | Small / large sizes | Role | Review status |
|---|---|---|---|
| Ari — curious | 480 × 720 / 800 × 1200 | Default investigation portrait | Used in prototype |
| Ari — uncertain | 480 × 720 / 800 × 1200 | Last introduction line, uncertainty without panic | Used in prototype |
| Ari — composed | 480 × 720 / 800 × 1200 | Decision/reflection pose; independent of selected answer | Used in prototype |
| Room — afternoon | 800 × 450 / 1600 × 900 | Chapter 1 investigation and dialogue stage | Used in prototype |
| Room — evening | 800 × 450 / 1600 × 900 | Proposed Chapter 2 lighting, same room and phone | Prepared; chapter adoption pending |
| Room — night | 800 × 450 / 1600 × 900 | Proposed Chapter 3 lighting, same room and blank laptop | Prepared; chapter adoption pending |
| Fictional recruitment lounge | 800 × 450 / 1600 × 900 | Optional environment study | Noncanonical; not evidence of a real company/office |
| Stationery cluster | 480 × 320 / 800 × 534 | Journal cover / reusable chapter handoff atmosphere | Small variant used in journal |

Naming: `ari-curious`, `ari-uncertain`, `ari-composed`, `room-afternoon`, `room-evening`, `room-night`, `recruitment-lounge`, `stationery`, each followed by `-WIDTH.webp`. [Manifest](game-first-artwork-manifest.json) records each exact path, byte size, dimensions and source SHA-256; [prompt set](game-first-artwork-prompts.json) preserves the actual prompts. Tool model/version was not exposed and is not claimed.

Existing FFmpeg encoded the assets with Lanczos resizing, `libwebp`, quality 82 and compression level 6. Character alpha was retained. The largest image is 169,160 bytes. Only the currently displayed expression and environment are requested for the scene; the journal illustration loads lazily. The room's responsive size hint accounts for its `object-fit: cover` height, preventing a small image from being enlarged across a tall tablet scene.

No generated image contains essential evidence, dialogue, a readable recruitment message or controls. Meaningful character portraits have Indonesian alt text; the scene and stationery are decorative because setting, speaker, artifact and clue information remain HTML. Flat-color room and silhouette fallbacks keep the investigation usable if images fail. No artwork implies whether a selected decision is correct.
