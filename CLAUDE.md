# Remotive Video Studio — Agent OS

## Mission
Turn a source video into publishable vertical Shorts through a reproducible, testable pipeline.

## Operating rules
1. Treat the desired outcome as the unit of work: source -> evidence -> selected moments -> visual treatment -> render -> QC -> MP4.
2. Never claim a stage succeeded without direct evidence from the files, logs, media metadata, or rendered artifact.
3. Keep source acquisition separate from editing. A failed downloader must not contaminate the editor.
4. Prefer deterministic plans and explicit inputs over hidden heuristics.
5. When a correction is discovered, record it in memory.md and update the relevant skill.
6. Do not replace a real capability with mock data, fake buttons, placeholder timestamps, or invented assets.
7. Before changing the production path, inspect the current implementation and preserve working capabilities.
8. Every rendered MP4 must be checked with ffprobe for duration, dimensions, codecs, and non-zero size.
9. Visual quality is a first-class output: avoid generic cards, decorative circles, and repetitive template scenes when real source visuals or meaningful motion can be used.

## Pipeline
SOURCE -> TRANSCRIPT -> EDITORIAL SELECTION -> STORYBOARD -> VISUAL ASSETS -> REFRAaming -> CAPTIONS -> AUDIO -> RENDER -> QUALITY CONTROL

## Project memory
Read memory.md before substantial changes.

## Skills
Use the smallest relevant skill set. The master workflow coordinates them; individual skills must remain independently testable.
