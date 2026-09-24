# Visual Assets v2

V1 proved that the renderer worked but also exposed the real bottleneck: the composition still treated real imagery as decorative backgrounds around generated cards.

V2 changes the visual layer instead of adding more generic motion.

## What changed

- Replaces the Commons-first, first-result asset lookup with Openverse anonymous image search.
- Searches multiple semantic queries for each shot role.
- Scores candidates using title/tags relevance, resolution, and penalties for logos, icons, clipart, diagrams, screenshots, posters, and banners.
- Fetches eight distinct real-photo assets instead of three generic images.
- Normalizes downloaded media to stable JPEG files with FFmpeg.
- Rebuilds the composition around photo montages, crops, depth, movement, and visual state changes.
- Removes the large glass-card UI treatment from the primary storytelling layer.
- Keeps text as captions and sparse emphasis instead of using text blocks as the main visual content.
- Uploads the fetched assets with the MP4 so the asset layer can be inspected independently.

## Why this matters

The previous renderer could only make the wrong asset selection look more polished. More easing, cards, and transitions could not solve that.

The new gate is:

1. asset relevance;
2. visual continuity;
3. meaningful spatial change;
4. only then motion polish.

Openverse provides openly licensed media and supports anonymous API requests, but individual licenses must still be verified before commercial publication.
