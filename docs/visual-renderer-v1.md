# Visual Renderer v1

This branch converts the accepted Visual Planner storyboard into a real 9:16 MP4 test.

## Architecture

Narration -> storyboard -> asset acquisition -> shot renderer -> Remotion -> MP4.

The renderer is intentionally separate from the planner. It does not turn every shot into text, circles, arrows, or generic cards.

## Real asset layer

scripts/resolve-planner-assets.mjs queries Wikimedia Commons at render time, downloads real image assets, embeds them locally, and writes public/planner-assets/manifest.json with source and license metadata when available.

The Commons API exposes image URLs and metadata through read-only search/imageinfo calls. License metadata still needs human verification before commercial publication.

## Current 30-second test

The eight storyboard shots use:

- real laptop imagery for the opening;
- a real image inside a browser-style research scene;
- a real research/computer image for the evidence scene;
- generated interface states only where the concept is an interface;
- semantic transitions through state changes;
- one synchronized US-English narration track.

## Gate

A successful GitHub Action only proves that the pipeline can acquire assets and render an MP4. The next gate is visual inspection of the actual artifact. If the result still reads as a slide deck, the next change must target asset selection/composition, not add more generic animation.
