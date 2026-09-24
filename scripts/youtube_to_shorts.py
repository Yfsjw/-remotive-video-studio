#!/usr/bin/env python3
import argparse
import os
import re
import subprocess
from dataclasses import dataclass

@dataclass
class Cue:
    start: float
    end: float
    text: str

TIME = re.compile(r"(\d\d):(\d\d):(\d\d),(\d\d\d)")

def ts(s: str) -> float:
    m = TIME.match(s.strip())
    if not m:
        raise ValueError(s)
    h, mi, sec, ms = map(int, m.groups())
    return h * 3600 + mi * 60 + sec + ms / 1000

def parse_srt(path: str):
    raw = open(path, encoding="utf-8-sig").read().replace("\r", "")
    cues = []
    for block in re.split(r"\n\s*\n", raw):
        lines = [x.strip() for x in block.split("\n") if x.strip()]
        if len(lines) < 3 or "-->" not in lines[1]:
            continue
        a, b = [x.strip() for x in lines[1].split("-->")]
        text = re.sub(r"<[^>]+>", "", " ".join(lines[2:]))
        if text:
            cues.append(Cue(ts(a), ts(b), text))
    return cues

def score(text: str, duration: float, index: int) -> float:
    t = text.lower()
    hooks = [
        "the problem", "the biggest", "most people", "nobody", "you need",
        "here's", "here is", "the reason", "why", "how", "what if",
        "important", "mistake", "secret", "truth", "instead", "but"
    ]
    value = sum(2.0 for h in hooks if h in t)
    value += min(len(t.split()) / 45.0, 2.0)
    value += 1.0 if "?" in text else 0
    value -= 1.5 if len(t.split()) < 12 else 0
    value -= 1.0 if duration < 22 else 0
    return value

def ass_time(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = seconds % 60
    return f"{h}:{m:02d}:{s:05.2f}"

def make_ass(cues, start, end, path):
    lines = [
        "[Script Info]",
        "ScriptType: v4.00+",
        "PlayResX: 1080",
        "PlayResY: 1920",
        "",
        "[V4+ Styles]",
        "Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding",
        "Style: Caption,Arial,72,&H00FFFFFF,&H00FFFFFF,&H00101010,&H80000000,1,0,0,0,100,100,0,0,1,5,2,2,70,70,260,1",
        "",
        "[Events]",
        "Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text",
    ]
    for c in cues:
        a, b = max(c.start, start), min(c.end, end)
        if b <= a:
            continue
        text = c.text.replace("{", "\{").replace("}", "\}")
        # Keep captions readable: split long lines at a natural word boundary.
        words = text.split()
        if len(words) > 9:
            mid = len(words) // 2
            text = " ".join(words[:mid]) + "\\N" + " ".join(words[mid:])
        lines.append(f"Dialogue: 0,{ass_time(a-start)},{ass_time(b-start)},Caption,,0,0,0,,{text}")
    open(path, "w", encoding="utf-8").write("\n".join(lines) + "\n")

def run(cmd):
    subprocess.run(cmd, check=True)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--video", required=True)
    ap.add_argument("--srt", required=True)
    ap.add_argument("--count", type=int, default=4)
    ap.add_argument("--out", required=True)
    args = ap.parse_args()
    os.makedirs(args.out, exist_ok=True)

    cues = parse_srt(args.srt)
    if not cues:
        raise SystemExit("No transcript cues found")

    # Build candidate windows around sentence/cue boundaries.
    candidates = []
    for i in range(len(cues)):
        start = cues[i].start
        end = start
        text = []
        for j in range(i, min(len(cues), i + 14)):
            end = cues[j].end
            text.append(cues[j].text)
            dur = end - start
            if 28 <= dur <= 58:
                joined = " ".join(text)
                candidates.append((score(joined, dur, i), start, end, joined))
            if dur > 58:
                break

    candidates.sort(reverse=True)
    selected = []
    for cand in candidates:
        _, start, end, _ = cand
        # Avoid near-duplicate Shorts.
        if all(end <= s + 12 or start >= e - 12 for _, s, e, _ in selected):
            selected.append(cand)
        if len(selected) >= args.count:
            break

    if not selected:
        # Fallback: contiguous transcript windows.
        total_start = cues[0].start
        total_end = cues[-1].end
        span = min(45.0, max(25.0, total_end - total_start))
        for k in range(args.count):
            s = total_start + k * span
            if s >= total_end:
                break
            selected.append((0, s, min(s + span, total_end), ""))

    selected.sort(key=lambda x: x[1])

    for n, (_, start, end, _) in enumerate(selected, 1):
        ass = os.path.join(args.out, f"short_{n:02d}.ass")
        mp4 = os.path.join(args.out, f"short_{n:02d}.mp4")
        make_ass(cues, start, end, ass)

        # Center crop to 9:16 while preserving the source height, then scale.
        vf = (
            "scale=1080:-2:force_original_aspect_ratio=increase,"
            "crop=1080:1920:(in_w-1080)/2:(in_h-1920)/2,"
            "setsar=1,"
            f"subtitles={ass}"
        )
        run([
            "ffmpeg", "-y", "-ss", f"{start:.3f}", "-i", args.video,
            "-t", f"{end-start:.3f}", "-vf", vf,
            "-c:v", "libx264", "-preset", "veryfast", "-crf", "21",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
            "-movflags", "+faststart", mp4
        ])
        os.remove(ass)

if __name__ == "__main__":
    main()
