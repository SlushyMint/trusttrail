# Living city — asset contract

## Current Phase B delivery

The five generated layers are now implemented in [`sceneAssets.ts`](../src/features/living-city/sceneAssets.ts). Every layer is **1672 × 941 px**, preserving the generator's native pixel dimensions without resampling or stretching. Four layers have real alpha; `sky-far` is opaque. A sixth texture isolates existing lit pixels for subtle animation, and `city-static.webp` is the still composite used for loading, reduced motion, and failures. See the [Phase B inventory, architecture, tests and limitations](living-city-phase-b.md), [exact file sizes](living-city-phase-b/asset-inventory.json), and [decoded alpha checks](living-city-phase-b/asset-validation.json).

The logical scene is **1608 × 877**, inset **32px** from each edge of the native artboard. Each sprite is positioned at `(-32, -32)` without independent width/height stretching. Cover scaling remains centered horizontally and bottom aligned. Layer movement depths are **3 / 5 / 8 / 14 / 18 logical pixels**. Nearest texture sampling, pixel rounding, and the bleed keep movement restrained and avoid exposed texture edges. The layers reach both horizontal edges; they are not advertised as mathematically seamless repeating tiles, and the scene does not tile or scroll indefinitely.

The reference was found at `public/assets/city-layer-concept.png`, rather than the requested extra `living-city` subdirectory. It was used as generation guidance only. No reference panel is a runtime texture or cropped production asset. [Built-in image generation prompts and source outputs](living-city-phase-b/generation-prompts.json) record provenance.

## Historical Phase A proposal

The following records the earlier proposed dimensions and placeholder state. The native-size contract above supersedes its dimensions and null asset paths.

Phase A uses original programmatic rectangles only. No ImageGen request, artwork download, invented image path, or asset network request was made. The executable specification is [`CITY_ASSETS`](../src/features/living-city/sceneAssets.ts); all five `src` values deliberately remain `null`.

| ID | Container | Delivery size | Alpha | Placement |
| --- | --- | --- | --- | --- |
| `sky-far` | background | 1664 × 964 px | Opaque | Center, full bleed |
| `city-back` | background | 1664 × 964 px | Transparent | Bottom center |
| `city-mid` | midground | 1664 × 964 px | Transparent | Bottom center |
| `city-front` | foreground | 1664 × 964 px | Transparent | Bottom center |
| `office-props` | foreground | 1664 × 964 px | Transparent | Bottom center; sparse props at edges |

Every layer uses the same full artboard, coordinate origin, horizon, street baseline, and pixel grid. The central **1600 × 900** composition occupies `(32, 32)` through `(1632, 932)` in the exported **1664 × 964** image. The extra 32 pixels on each side provide parallax overscan. Keep transparent padding in the alpha layers; do not trim exports independently. Phase B should place each full-size sprite at `(-32, -32)` in the logical composition, so all layers register exactly. Export lossless PNG with straight alpha and sRGB color; lossless WebP conversion may follow visual approval. No spritesheet or animation frames are required for these five initial layers.

The runtime covers the existing hero using `max(hostWidth / 1600, hostHeight / 900)`. It centers horizontally and aligns the bottom of the composition with the bottom of the hero. Tall mobile heroes crop heavily into the center of the scene. The dimensions describe source pixels, not CSS pixels or device pixels. Use nearest-neighbor texture sampling and renderer pixel rounding when the sprites are introduced. Integer scaling cannot always cover every responsive hero without altering its established layout; minor uneven pixel sizes at fractional scales are accepted for Phase A.

Use the existing navy, steel, teal, and amber palette. Leave the upper and left regions quiet so HTML copy remains legible. Keep important environmental forms within the central mobile crop; edge props may crop away. Do not bake any text, buttons, OS controls, logos, clue/evidence details, or page navigation into the images. The approved existing OS screenshot remains HTML content above the scene.

`sky-far` should provide continuous navy sky; `city-back` the distant skyline; `city-mid` office blocks and restrained window light; `city-front` near rooftops/street; and `office-props` sparse foreground details. Sky pixels must be transparent in all layers after the first. Lighting should be isolated inside the relevant silhouettes, without light-colored matte fringes. The Phase A placeholder uses bounded layer depths of **3 / 8 / 14 logical pixels**, with additional horizontal drift up to **12%** of each depth and vertical movement up to **40%**. The 32px bleed exceeds the greatest combined displacement.

These dimensions and placement rules are technical proposals for Product Owner review before Phase B artwork production. Phase B still needs approved artwork, provenance, texture loading/unloading with explicit ownership, and renewed contrast/crop/performance checks. Phase A does not preload or attempt to render this future manifest.
