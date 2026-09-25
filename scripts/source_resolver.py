#!/usr/bin/env python3
import argparse, json, os, re, subprocess, sys, tempfile, urllib.parse, urllib.request
from pathlib import Path

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/131 Safari/537.36"

def video_id(url):
    p = urllib.parse.urlparse(url)
    if p.hostname in {"youtu.be", "www.youtu.be"}:
        return p.path.strip("/").split("/")[0]
    if p.hostname and p.hostname.endswith("youtube.com"):
        if p.path == "/watch":
            return urllib.parse.parse_qs(p.query).get("v", [""])[0]
        m = re.match(r"/(?:shorts|embed)/([^/?]+)", p.path)
        if m: return m.group(1)
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", url):
        return url
    return ""

def curl_download(url, out):
    cmd = ["curl","-4","-L","--fail","--show-error","--retry","3","--retry-delay","2",
           "--connect-timeout","20","--max-time","1800","-A",UA,url,"-o",out]
    return subprocess.run(cmd, text=True, capture_output=True)

def probe(path):
    r = subprocess.run(["ffprobe","-v","error","-show_entries",
                        "format=duration,size,format_name","-of","json",path],
                       text=True,capture_output=True)
    if r.returncode != 0: return None
    try:
        x=json.loads(r.stdout)["format"]
        if float(x.get("size",0)) <= 0 or float(x.get("duration",0)) <= 0: return None
        return x
    except Exception:
        return None

def transcript(video_id_value, out):
    endpoints = [
        f"https://youtube-transcript.ai/transcript/{video_id_value}.txt?lang=en",
    ]
    for url in endpoints:
        try:
            req=urllib.request.Request(url, headers={"User-Agent":UA})
            with urllib.request.urlopen(req, timeout=45) as r:
                body=r.read()
            if len(body) > 100:
                Path(out).write_bytes(body)
                return {"endpoint":url, "bytes":len(body)}
        except Exception as e:
            print(f"transcript candidate failed: {url}: {e}", file=sys.stderr)
    return None

def cobalt(url, endpoint, out):
    payload=json.dumps({"url":url,"videoQuality":"720","youtubeVideoCodec":"h264",
                        "downloadMode":"auto"}).encode()
    req=urllib.request.Request(endpoint, data=payload, method="POST",
                               headers={"Accept":"application/json","Content-Type":"application/json","User-Agent":UA})
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            data=json.loads(r.read())
        print("media resolver response:", json.dumps(data)[:3000])
        direct = data.get("url")
        if not direct and isinstance(data.get("picker"), list):
            for item in data["picker"]:
                if item.get("type")=="video" and item.get("url"):
                    direct=item["url"]; break
        if not direct:
            return None
        r=curl_download(direct, out)
        if r.returncode==0 and probe(out):
            return {"endpoint":endpoint,"download_url":direct,"probe":probe(out)}
    except Exception as e:
        print(f"cobalt candidate failed {endpoint}: {e}", file=sys.stderr)
    return None

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--url", required=True)
    ap.add_argument("--media-out", required=True)
    ap.add_argument("--transcript-out", required=True)
    ap.add_argument("--report", required=True)
    a=ap.parse_args()
    vid=video_id(a.url)
    if not vid:
        raise SystemExit("Could not identify a YouTube video ID")

    report={"input_url":a.url,"video_id":vid,"media":None,"transcript":None,"attempts":[]}

    # 1) If the input itself is a stable media URL, use it.
    if re.match(r"^https?://", a.url) and (".mp4" in a.url.lower() or os.getenv("TRY_DIRECT_SOURCE")=="1"):
        with tempfile.NamedTemporaryFile(delete=False,suffix=".mp4") as t:
            tmp=t.name
        r=curl_download(a.url,tmp)
        p=probe(tmp) if r.returncode==0 else None
        if p:
            os.replace(tmp,a.media_out)
            report["media"]={"method":"direct","probe":p}
        else:
            Path(tmp).unlink(missing_ok=True)

    # 2) Obtain transcript independently of media acquisition.
    report["transcript"]=transcript(vid,a.transcript_out)

    # 3) Optional media gateways. Never claim success unless ffprobe validates the file.
    endpoints=[x.strip() for x in os.getenv("MEDIA_RESOLVER_ENDPOINTS","").split(",") if x.strip()]
    if not report["media"] and endpoints:
        for ep in endpoints:
            report["attempts"].append(ep)
            result=cobalt(a.url,ep,a.media_out)
            if result:
                report["media"]=dict(result,method="cobalt-compatible")
                break

    Path(a.report).write_text(json.dumps(report,indent=2),encoding="utf-8")
    print(json.dumps(report,indent=2))
    if not report["media"]:
        print("No verified media source was found. Transcript acquisition may still have succeeded.", file=sys.stderr)
        return 3

if __name__=="__main__":
    main()
