#!/usr/bin/env python3
import json, os, re, subprocess, sys, urllib.request

source_url = os.environ.get("SOURCE_URL", "")
video_id = os.environ.get("VIDEO_ID", "")
out = "work/source/source.mp4"

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)

def download(url, path):
    return subprocess.run([
        "curl","-4","-L","--fail","--show-error","--retry","2",
        "--connect-timeout","20","--max-time","900",
        "-A","Mozilla/5.0",url,"-o",path
    ]).returncode == 0

if not video_id:
    m = re.search(r"(?:v=|youtu\.be/|youtube\.com/(?:shorts|embed)/)([A-Za-z0-9_-]{11})", source_url)
    if m:
        video_id = m.group(1)

if not video_id:
    raise SystemExit("Could not parse YouTube video ID")

os.makedirs("work/source", exist_ok=True)

piped = [
    "https://pipedapi.kavin.rocks",
    "https://pipedapi.leptons.xyz",
    "https://pipedapi.nosebs.ru",
    "https://api.piped.yt",
    "https://pipedapi.adminforge.de",
]

for base in piped:
    try:
        data = get_json(base.rstrip("/") + "/streams/" + video_id)
        vids = [x for x in data.get("videoStreams", []) if x.get("url")]
        auds = [x for x in data.get("audioStreams", []) if x.get("url")]
        if not vids or not auds:
            continue
        vids.sort(key=lambda x: (x.get("height") or 0, x.get("bitrate") or 0), reverse=True)
        auds.sort(key=lambda x: x.get("bitrate") or 0, reverse=True)
        v = next((x for x in vids if (x.get("height") or 9999) <= 720), vids[0])
        a = auds[0]
        print("Piped:", base, "video height:", v.get("height"))
        if download(v["url"], "work/source/video.part") and download(a["url"], "work/source/audio.part"):
            rc = subprocess.run([
                "ffmpeg","-y","-i","work/source/video.part","-i","work/source/audio.part",
                "-c","copy",out
            ]).returncode
            if rc == 0 and os.path.getsize(out) > 100000:
                print("Source downloaded successfully via Piped:", base)
                sys.exit(0)
    except Exception as e:
        print("Piped failed:", base, repr(e))

invidious = [
    "https://inv.nadeko.net",
    "https://invidious.nerdvpn.de",
    "https://yewtu.be",
]

for base in invidious:
    try:
        data = get_json(base.rstrip("/") + "/api/v1/videos/" + video_id)
        fmts = [x for x in data.get("adaptiveFormats", []) if x.get("url")]
        mux = [x for x in fmts if x.get("type","").startswith("video/mp4") and x.get("container") == "mp4"]
        if mux:
            mux.sort(key=lambda x: x.get("width") or 0, reverse=True)
            print("Invidious:", base)
            if download(mux[0]["url"], out) and os.path.getsize(out) > 100000:
                print("Source downloaded successfully via Invidious:", base)
                sys.exit(0)
    except Exception as e:
        print("Invidious failed:", base, repr(e))

raise SystemExit("All alternate source endpoints failed")
