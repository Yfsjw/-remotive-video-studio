#!/usr/bin/env python3
import json, os, re, sys, urllib.parse, urllib.request

API = "https://commons.wikimedia.org/w/api.php"
OUT = "public/assets"
os.makedirs(OUT, exist_ok=True)

PLAN = [
    {"id":"scene01","query":"data center servers technology","role":"technology_broll"},
    {"id":"scene02","query":"person laptop computer research","role":"research_broll"},
    {"id":"scene03","query":"teacher explaining computer concept classroom","role":"explanation_broll"},
    {"id":"scene04","query":"software developer programming computer","role":"building_broll"},
]

def get_json(url):
    req = urllib.request.Request(url, headers={"User-Agent":"RemotiveVisualAssetEngine/1.0"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return json.load(r)

def download(url, path):
    req = urllib.request.Request(url, headers={"User-Agent":"RemotiveVisualAssetEngine/1.0"})
    with urllib.request.urlopen(req, timeout=40) as r:
        data = r.read()
    if len(data) < 50000:
        raise ValueError("asset too small")
    with open(path, "wb") as f:
        f.write(data)
    return len(data)

def choose_image(query):
    params = {
        "action":"query","format":"json","generator":"search","gsrsearch":query,
        "gsrnamespace":"6","gsrlimit":"12","prop":"imageinfo",
        "iiprop":"url|size|mime|extmetadata","iiurlwidth":"1600"
    }
    data = get_json(API + "?" + urllib.parse.urlencode(params))
    pages = list((data.get("query") or {}).get("pages", {}).values())
    candidates=[]
    for p in pages:
        ii=(p.get("imageinfo") or [{}])[0]
        mime=ii.get("mime","")
        url=ii.get("thumburl") or ii.get("url")
        w=int(ii.get("width") or 0); h=int(ii.get("height") or 0)
        title=p.get("title","")
        if not url or not mime.startswith("image/") or mime in ("image/svg+xml","image/gif"):
            continue
        if w < 1000 or h < 600:
            continue
        # Prefer photographic-looking files and avoid obvious logos/icons.
        low=(title+" "+query).lower()
        penalty=sum(x in low for x in ["logo","icon","diagram","flag","map","screenshot"])
        score=(w*h)/1e6 - penalty*2
        candidates.append((score,p,ii))
    if not candidates:
        raise RuntimeError("no validated Wikimedia image for: "+query)
    candidates.sort(key=lambda x:x[0], reverse=True)
    _, p, ii=candidates[0]
    return {
        "title":p.get("title"),
        "source_url":ii.get("descriptionurl") or ii.get("url"),
        "download_url":ii.get("thumburl") or ii.get("url"),
        "width":ii.get("width"),"height":ii.get("height"),
        "mime":ii.get("mime"),
        "license":((ii.get("extmetadata") or {}).get("LicenseShortName") or {}).get("value"),
        "artist":((ii.get("extmetadata") or {}).get("Artist") or {}).get("value"),
    }

def main():
    manifest=[]
    for item in PLAN:
        meta=choose_image(item["query"])
        ext=".jpg" if "jpeg" in (meta["mime"] or "") else ".png"
        path=os.path.join(OUT,item["id"]+ext)
        size=download(meta["download_url"],path)
        meta.update(item)
        meta["path"]=path
        meta["bytes"]=size
        manifest.append(meta)
        print(f"[asset] {item['id']} <- {meta['title']} ({meta['width']}x{meta['height']}, {meta['license']})")
    with open(os.path.join(OUT,"manifest.json"),"w",encoding="utf-8") as f:
        json.dump(manifest,f,ensure_ascii=False,indent=2)
    print("[asset] validated assets:",len(manifest))

if __name__=="__main__":
    main()
