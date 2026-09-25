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

def piped_instances():
    try:
        req=urllib.request.Request(
            "https://raw.githubusercontent.com/TeamPiped/documentation/main/content/docs/public-instances/index.md",
            headers={"User-Agent":UA})
        with urllib.request.urlopen(req, timeout=30) as r:
            text=r.read().decode("utf-8","replace")
        urls=re.findall(r"https://(?:pipedapi|api-piped|piped-api|watchapi|ytapi|piapi|pdapi|pa)\\.[A-Za-z0-9.-]+", text)
        return list(dict.fromkeys(urls))
    except Exception as e:
        print(f"Piped instance discovery failed: {e}", file=sys.stderr)
        return []

def piped_media(video_id_value, out):
    for base in piped_instances():
        try:
            endpoint=base.rstrip("/") + "/streams/" + video_id_value
            req=urllib.request.Request(endpoint, headers={"User-Agent":UA})
            with urllib.request.urlopen(req, timeout=30) as r:
                data=json.loads(r.read())
            candidates=[]
            for s in data.get("videoStreams") or []:
                if s.get("url") and s.get("videoOnly") is False and str(s.get("format","")).upper()=="MP4":
                    candidates.append(s)
            candidates.sort(key=lambda s:int(s.get("width") or 0), reverse=True)
            for s in candidates:
                with tempfile.NamedTemporaryFile(delete=False,suffix=".mp4") as t:
                    tmp=t.name
                r=curl_download(s["url"],tmp)
                p=probe(tmp) if r.returncode==0 else None
                if p:
                    os.replace(tmp,out)
                    return {"instance":base,"stream":s,"probe":p}
                Path(tmp).unlink(missing_ok=True)
        except Exception as e:
            print(f"Piped candidate failed {base}: {e}", file=sys.stderr)
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
    ap.add_argument("--url", required=True, help="URL identifying the video (normally YouTube)")
    ap.add_argument("--source-url", default="", help="Optional independent direct media URL")
    ap.add_argument("--media-out", required=True)
    ap.add_argument("--transcript-out", required=True)
    ap.add_argument("--report", required=True)
    a=ap.parse_args()

    vid=video_id(a.url)
    if not vid:
        raise SystemExit("Could not identify a YouTube video ID from --url")

    report={"input_url":a.url,"video_id":vid,"media":None,"transcript":None,"attempts":[]}

    # 1) Independent direct media source, if supplied.
    direct_source=a.source_url.strip()
    if direct_source:
        with tempfile.NamedTemporaryFile(delete=False,suffix=".mp4") as t:
            tmp=t.name
        r=curl_download(direct_source,tmp)
        p=probe(tmp) if r.returncode==0 else None
        if p:
            os.replace(tmp,a.media_out)
            report["media"]={"method":"direct-source-url","source_url":direct_source,"probe":p}
        else:
            Path(tmp).unlink(missing_ok=True)
            report["attempts"].append({"method":"direct-source-url","url":direct_source,"verified":False})

    # 2) Transcript is independent from media acquisition.
    report["transcript"]=transcript(vid,a.transcript_out)

    # 3) Dynamically discover current Piped instances and validate real media.
    if not report["media"]:
        result=piped_media(vid,a.media_out)
        if result:
            report["media"]=dict(result,method="piped")

    # 4) Optional Cobalt-compatible media gateways.
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
