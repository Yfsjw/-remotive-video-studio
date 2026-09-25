# Quality Standard

A render is NOT accepted merely because FFmpeg exits 0.

## Technical gates
- file exists and is non-zero
- duration is within the requested range
- 1080x1920
- 30 fps unless explicitly overridden
- H.264 video + AAC audio
- no broken timestamps

## Editorial gates
- clip starts near a meaningful sentence boundary
- clip has a clear premise and payoff
- no accidental mid-word cuts
- captions follow the spoken content

## Visual gates
- visuals correspond to the current narration
- no repeated placeholder asset pretending to be B-roll
- composition remains readable on a phone
- motion supports attention rather than decorating empty space

## Evidence rule
Record the exact command/run/artifact used for acceptance.
