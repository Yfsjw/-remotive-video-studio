# Project Memory

## Confirmed facts
- Repository: Yfsjw/-remotive-video-studio
- Primary goal: YouTube URL -> source acquisition -> analysis -> important moments -> professional vertical Shorts -> real MP4.
- Remotion rendering to MP4 is proven operational in this repository.
- The current production YouTube workflow intentionally accepts a stable HTTP(S) MP4 source and rejects YouTube URLs because multiple automatic acquisition routes were empirically unreliable in GitHub Actions.
- The curated source video is Remy Gaskell's AI Agents course, video id 5p-sq8v3OXw.
- data/clip_plan.json contains eight editorially selected moments.

## Lessons
- Do not spend runs repeating yt-dlp/Cobalt/Piped/Invidious/Zolotube browser scraping after a route has failed with direct evidence.
- Source acquisition and media processing must remain decoupled.
- A visually working renderer is not enough; the source visuals must be relevant and varied.
- Code-only success is not media-quality success. Inspect the actual MP4.

## Change log
- 2026-09-24: Introduced Remy-style Agent OS structure on an isolated branch. No production branch replacement yet.
