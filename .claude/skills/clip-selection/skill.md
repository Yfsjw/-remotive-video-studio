# Clip Selection Skill

## Goal
Select self-contained Shorts from transcript evidence.

## Principles
- Prefer a complete idea over a random high-scoring sentence.
- Favor strong hooks, concrete demonstrations, useful frameworks, surprising contrasts, and actionable explanations.
- Avoid redundant clips.
- Respect sentence boundaries.
- Use data/clip_plan.json when an explicit editorial plan exists.
- Generic scoring is a fallback, not a substitute for editorial judgment.

## Output
A deterministic clip plan containing id, start, end, title, reason, and source chapter when known.
