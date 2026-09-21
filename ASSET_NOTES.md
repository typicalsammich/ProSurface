# Court landscape asset

Generated with the built-in image-generation tool. The transparent alpha is preserved.

Saved project asset: `public/images/live-oak.png`

The court is a true Three.js scene with modeled court, hoops, nets, fence, benches, and lighting. Trees use photographic alpha foliage on camera-facing planes for realistic silhouettes and efficient mobile rendering; they are not scanned volumetric tree models.

## Final generation prompt

Use case: photorealistic-natural. Asset type: transparent foliage texture for a premium realtime 3D court landscape. Generate ONE mature Texas live oak tree, complete trunk and wide irregular crown, isolated on a genuinely transparent alpha background. Real photographic leaves, thousands of small green leaves with natural gaps, visible branching and textured brown-gray bark, asymmetrical natural silhouette. Full tree upright, trunk base at bottom center, all leaves inside frame, 5 percent transparent margin. Front elevation, straight-on, neutral diffused daylight with slightly warm highlights, realistic deep olive and forest-green leaves, no cartoon shapes, no spherical blobs. No ground, no grass, no cast shadow, no sky, no background, no text, no watermark. High detail architectural visualization cutout.

## Transparent brand asset

Saved asset: `public/images/logo-transparent.png`. Created with the built-in image-generation tool using the supplied `logo.jpg` as the edit target. The original remains included. The scene applies a white-ink shader treatment to the alpha logo for contrast against blue surfacing; the PNG itself retains the original blue/navy colors.

Final prompt:

Use case: background-extraction. Edit target: the attached ProSurface logo. Remove ONLY the white background and white interior negative space, making it genuinely transparent alpha. Preserve the exact blue icon shape, original navy PROSURFACE lettering and PERFORMANCE COURTS subtitle, proportions, letter spacing and spelling. No redesign, no added glow, no added shadow, no white rectangle. Crop extra outer whitespace to a modest transparent margin around the full logo. This will be a texture placed directly onto a blue 3D court. Text verbatim: PROSURFACE / PERFORMANCE COURTS. Output a transparent PNG.

The park's lawn and path textures are generated deterministically in code. Its daylight sky uses the Three.js Sky shader. Actual project photographs remain the user-supplied photos; the 3D park is a clearly labeled illustrative concept.
