import os
import re
import subprocess
import tempfile
from pathlib import Path
from urllib.parse import urlparse

from flask import Flask, Response, abort, jsonify, request, send_file

app = Flask(__name__)

ALLOWED_VIDEO_ID = "5p-sq8v3OXw"
VIDEO_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")


def chromium_path():
    candidates = [
        Path("/opt/render/.cache/ms-playwright").glob("chromium-*/chrome-linux/chrome"),
        Path("/opt/render/.cache/ms-playwright").glob("chromium-*/chrome-linux64/chrome"),
        Path("/opt/render/project/.cache/ms-playwright").glob("chromium-*/chrome-linux/chrome"),
        Path("/opt/render/project/.cache/ms-playwright").glob("chromium-*/chrome-linux64/chrome"),
        Path.home().glob(".cache/ms-playwright/chromium-*/chrome-linux/chrome"),
        Path.home().glob(".cache/ms-playwright/chromium-*/chrome-linux64/chrome"),
    ]
    for group in candidates:
        for p in group:
            if p.is_file():
                return str(p)
    return None


def validate_youtube_url(url):
    parsed = urlparse(url)
    host = parsed.netloc.lower().split(":")[0]
    if host not in {"youtube.com", "www.youtube.com", "youtu.be", "www.youtu.be", "m.youtube.com"}:
        raise ValueError("Only YouTube URLs are accepted.")

    video_id = None
    if host.endswith("youtu.be"):
        video_id = parsed.path.strip("/").split("/")[0]
    else:
        from urllib.parse import parse_qs
        video_id = parse_qs(parsed.query).get("v", [None])[0]

    if not video_id or not VIDEO_RE.match(video_id):
        raise ValueError("Invalid YouTube video URL.")

    if video_id != ALLOWED_VIDEO_ID:
        raise ValueError("This gateway is currently locked to the project test video.")

    return video_id


def download_video(url, output_dir):
    chrome = chromium_path()
    if not chrome:
        raise RuntimeError("Chromium executable was not found.")

    output = Path(output_dir) / "source.%(ext)s"
    cmd = [
        "yt-dlp",
        "--no-playlist",
        "--newline",
        "--format", "bv*[ext=mp4]+ba[ext=m4a]/b[ext=mp4]",
        "--merge-output-format", "mp4",
        "--extractor-args", f"youtubepot-wpc:browser_path={chrome}",
        "--output", str(output),
        url,
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=70 * 60)
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr or proc.stdout)[-12000:])

    mp4s = sorted(Path(output_dir).glob("source.mp4"))
    if not mp4s:
        raise RuntimeError("yt-dlp completed but no MP4 was produced.")
    return mp4s[0]


@app.get("/health")
def health():
    return jsonify({"ok": True, "chromium": bool(chromium_path()), "video_id": ALLOWED_VIDEO_ID})


@app.get("/download")
def download():
    url = request.args.get("url", "")
    try:
        validate_youtube_url(url)
    except ValueError as exc:
        abort(400, description=str(exc))

    temp_dir = tempfile.mkdtemp(prefix="ytgw-")
    try:
        path = download_video(url, temp_dir)
    except Exception as exc:
        return Response(str(exc), status=502, mimetype="text/plain")

    response = send_file(
        path,
        mimetype="video/mp4",
        as_attachment=False,
        download_name="source.mp4",
        conditional=True,
    )
    @response.call_on_close
    def cleanup():
        import shutil
        shutil.rmtree(temp_dir, ignore_errors=True)
    return response
