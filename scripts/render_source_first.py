#!/usr/bin/env python3
import argparse, json, os, subprocess

def run(cmd):
    subprocess.run(cmd, check=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--srt", required=True)
    ap.add_argument("--plan", required=True)
    ap.add_argument("--out", required=True)
    ap.add_argument("--count", type=int, default=5)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)

    import youtube_to_shorts as y
    cues = y.parse_srt(a.srt)
    plan = json.load(open(a.plan, encoding="utf-8"))
    clips = plan.get("clips", [])[:max(0, a.count)]
    if not clips:
        raise SystemExit("No clips selected")

    for n, clip in enumerate(clips, 1):
        start = float(clip["start"])
        end = float(clip["end"])
        if end <= start:
            continue
        ass = os.path.join(a.out, f"_short_{n:02d}.ass")
        mp4 = os.path.join(a.out, f"short_{n:02d}.mp4")
        y.make_ass(cues, start, end, ass)
        fg = "scale=1080:-2:force_original_aspect_ratio=decrease"
        bg = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:2"
        fc = (
            f"[0:v]{bg}[bg];"
            f"[0:v]{fg}[fg];"
            "[bg]format=yuv420p[bg2];"
            "[bg2][fg]overlay=(W-w)/2:(H-h)/2[composed];"
            f"[composed]subtitles={ass}:fontsdir=/usr/share/fonts/truetype/dejavu[vfinal]"
        )
        run([
            "ffmpeg", "-y", "-ss", f"{start:.3f}", "-i", a.video,
            "-t", f"{end-start:.3f}", "-filter_complex", fc,
            "-map", "[vfinal]", "-map", "0:a:0?",
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "20",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
            "-movflags", "+faststart", mp4
        ])
        os.remove(ass)

if __name__ == "__main__":
    main()
