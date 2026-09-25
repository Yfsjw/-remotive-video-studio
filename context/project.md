# Project Context

Remotive Video Studio is a real video production pipeline, not a UI prototype.

Target:
1. Accept a source video.
2. Obtain reliable transcript/timestamps.
3. Select self-contained high-value moments.
4. Build a visual treatment appropriate to the spoken idea.
5. Render 1080x1920 MP4.
6. Run media QC and expose the artifact.

Current source-processing engine:
- FFmpeg
- whisper.cpp
- Python editorial selection
- Remotion visual engine

Current constraint:
- Automatic YouTube acquisition is not considered reliable in GitHub Actions without an external authenticated/session-based source. Do not silently re-enable it.
