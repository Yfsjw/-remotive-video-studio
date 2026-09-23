# Remotive Video Studio

A standalone Remotion project for generating real MP4 videos from React code.

## Current MVP

- Remotion 4
- 1080x1920 vertical composition
- 30 FPS
- 5-second test composition
- Animated intro/outro
- MP4 H.264 output
- GitHub Actions render workflow

## Local usage

Install dependencies:

```bash
npm install
```

Preview:

```bash
npm run start
```

Render MP4:

```bash
npm run render
```

Output:

```
out/main.mp4
```

## Architecture

```
src/index.tsx
  -> src/Root.tsx
      -> src/Main.tsx
          -> Remotion renderer
              -> MP4
```

This repository is intentionally independent from the existing short-form-video-studio project.
