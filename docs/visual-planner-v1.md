# Visual Planner v1

This branch introduces the planning layer before any new rendering engine work.

## Principle

The planner is a director/storyboard layer, not a renderer.

`Narration -> semantic intent -> visual strategy -> shot -> asset requirements -> renderer`

A shot must have a reason to exist. Motion is expressed as semantic events, not as a bag of generic effects.

## Shot contract

Every shot declares:

- timing
- narration
- pedagogical purpose
- visual strategy
- visual type
- required assets
- camera intent
- semantic motion events
- typography intent
- transition intent
- continuity state

## Visual strategies

- demonstration
- transformation
- comparison
- reveal
- process
- spatial explanation
- simulation
- metaphor
- evidence
- hero visual

## Asset policy

Prefer the representation that best explains the idea:

1. Existing project asset
2. Real/source footage
3. Screenshot/evidence
4. Generated UI
5. AI image
6. AI video
7. SVG/Lottie
8. Manim
9. Text-only

This is a planning priority, not a hard rule. A shot can override it when the concept requires a different representation.

## Renderer boundary

The planner must never emit Remotion JSX.

Remotion consumes storyboard data later.

That separation allows us to reject a bad visual plan before spending render time.

## Validation rules

The validator currently checks:

- empty storyboard
- invalid durations
- timeline gaps
- timeline overlaps
- shots without purpose
- non-text shots without assets
- missing continuity style
- long text-only shots
- three consecutive shots repeating the same visual strategy and type

## Current prototype

`src/planner/example-storyboard.ts` contains an 8-shot, 30-second 9:16 example for an AI-agent explainer.

It is deliberately more important that this storyboard is visually coherent than that it is renderable today.

## Next gate

Do not build a new renderer until this storyboard contract is reviewed and accepted.

The next implementation phase should:

1. connect narration analysis to this schema;
2. resolve assets from the declared requirements;
3. render the same storyboard through Remotion;
4. compare the output against the storyboard, not merely against a successful build.
