# Master Video Workflow

## Goal
Orchestrate the complete source-to-Short pipeline.

## Sequence
1. Load project context, style, quality standard, and memory.
2. Acquire and verify source.
3. Generate transcript evidence.
4. Select clips using editorial plan or validated fallback.
5. Generate storyboard.
6. Resolve visual assets.
7. Reframe and caption.
8. Render.
9. Run quality control.
10. Publish/upload only after QC passes.

## Stop conditions
- source missing or unverified
- transcript missing/empty
- no valid clips
- required visual asset missing
- render failure
- QC failure

## Principle
A failed upstream stage stops the pipeline. Do not hide failure by producing a lower-quality fake output.
