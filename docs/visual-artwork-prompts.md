# Generated artwork — brief and provenance

Generated on 29 October 2026 using the **built-in image-generation tool**, which was available in this environment. Three new images were generated without reference images. The tool did not expose a model/version identifier; none is claimed. No separate API/CLI image generator or new project dependency was used.

The prompt briefs below preserve the generation direction, normalized for reuse rather than presented as a verbatim tool transcript.

## Shared direction

Create cohesive 2D editorial illustrations for TrustTrail, an Indonesian narrative recruitment detective game. Use a restrained cut-paper/gouache treatment with subtle printed-paper grain, clear shapes and carefully composed objects. Slate-blue desk and shadows, warm ivory papers, amber late-afternoon window light, restrained teal details. Quiet, thoughtful investigation rather than horror or police imagery. Keep lighting, material treatment and palette consistent across the set. No readable text, letters, numbers, labels, logos, watermarks, interface controls, evidence annotations or QR codes. All important clues and interaction will be real HTML outside the illustration.

## 1. Hero investigation dossier

Portrait composition: a fictional recruitment case dossier on a slate desk. Layer warm ivory papers, an unmarked envelope, architectural/photo-like recruitment slips, a teal paper accent and a black binder clip. Subtle lines/shadows suggest connections without giving away evidence. Amber side light, tactile paper edges, a close editorial crop. An intriguing invitation to open a case; no rendered UI or written labels.

Source: `exec-651b3edd-c2cd-48a9-8a5b-624f242ec5e0.png`, 1122 × 1402.

## 2. Ari's investigation workspace

Landscape narrative environment in the same illustration world. Over-the-shoulder view of a fictional young Indonesian graduate with short black hair and a teal shirt at a desk near a window at sunset. A laptop with a blank screen, an envelope, a folder and a small plant establish Ari's ordinary room. Warm amber light crosses the slate desk and ivory papers. Calm uncertainty and room to think; no real person or identifying institution, no embedded message or evidence text.

Source: `exec-17e4788a-9800-4265-9ca2-4a1db529e16d.png`, 1536 × 1024.

## 3. Reusable investigation vignette

Wide still life in the same editorial treatment and light. An open, unmarked notebook, a phone viewed from its back, pen, envelope and amber folder rest on the slate desk, with restrained teal and ivory accents. No person, screen UI, writing or clue that needs to be read. A reusable atmosphere element for the linked chapter introduction and investigation navigation.

Source: `exec-e3551fed-5a41-4d64-a30e-b9d36c34a77a.png`, 1774 × 887.

## Delivered web assets

| File in `public/artwork/` | Dimensions | Bytes |
|---|---|---:|
| `case-dossier-480.webp` | 480 × 600 | 39,370 |
| `case-dossier-960.webp` | 960 × 1200 | 132,648 |
| `ari-workspace-600.webp` | 600 × 400 | 22,602 |
| `ari-workspace-1200.webp` | 1200 × 800 | 69,792 |
| `desk-vignette-480.webp` | 480 × 240 | 12,406 |
| `desk-vignette-960.webp` | 960 × 480 | 45,358 |

The six alternatives total **322,176 bytes**; a browser selects a suitable variant rather than downloading both sizes of every image. Existing FFmpeg encoded them with Lanczos scaling, `libwebp`, quality 82 and compression level 6. Original tool PNGs remain in the Codex generated-images directory; only the selected optimized variants are served by the application. Source hashes and output metadata are recorded in [the manifest](visual-artwork-manifest.json).

Descriptive Indonesian alt text accompanies dossier and narrative artwork. The supporting still life has empty alt text because surrounding text carries its meaning. No image carries an essential clue, control or consequence. The existing `AriScene.tsx` remains the narrative fallback; the dossier has a simple code-native paper fallback.
