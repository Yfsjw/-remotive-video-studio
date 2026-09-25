# Transcript Analysis Skill

## Goal
Convert speech into timestamped, searchable evidence for editorial selection.

## Procedure
1. Extract mono 16 kHz WAV.
2. Run whisper.cpp.
3. Preserve SRT and JSON outputs.
4. Validate that cues exist and timestamps are monotonic.
5. Produce a compact candidate map for editorial selection.

Never invent transcript text when the speech evidence is unavailable.
