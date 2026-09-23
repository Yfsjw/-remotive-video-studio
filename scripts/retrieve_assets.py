#!/usr/bin/env python3
import json, os, re, sys, urllib.parse, urllib.request

API = "https://commons.wikimedia.org/w/api.php"
OUT = "public/assets"
os.makedirs(OUT, exist_ok=True)

PLAN = [
    {"id":"scene01","queries":["data center servers technology","server room computers","data center"],"role":"technology_broll"},
    {"id":"scene02","queries":["person laptop computer research","person using laptop computer","laptop computer person"],"role":"research_broll"},
    {"id":"scene03","queries":["teacher explaining computer classroom","teacher explaining technology classroom","person teaching computer","computer classroom teacher"],"role":"explanation_broll"},
    {"id":"scene04","queries":["software developer programming computer","programmer coding computer","developer laptop programming"],"role":"building_broll"},
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

def choose_image(queries):
    last_error = None
    for query in queries:
        try:
            params = {
                "action":"query","format":"json","generator":"search","gsrsearch":query,
                "gsrnamespace":"6","gsrlimit":"20","prop":"imageinfo",
                "iiprop":"url|size|mime|extmetadata","iiurlwidth":"1600"
            }
            data = get_json(API + "?" + urllib.parse.urlencode(params))
            pages = list((data.get("query") or {}).get("pages", {}).values())
            candidates=[]
            qtokens=[t for t in re.findall(r"[a-z0-9]+", query.lower()) if len(t)>2]
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
                low=title.lower()
                penalty=sum(x in low for x in ["logo","icon","diagram","flag","map","screenshot","chart","symbol"])
                matches=sum(t in low for t in qtokens)
                aspect=min(w/h, h/w)
                score=matches*8 + (w*h)/1e7 + aspect*2 - penalty*5
                candidates.append((score,p,ii,query))
            if not candidates:
                last_error=RuntimeError("no validated Wikimedia image for: "+query)
                continue
            candidates.sort(key=lambda x:x[0], reverse=True)
            _, p, ii, matched_query=candidates[0]
            return {
                "title":p.get("title"),
                "source_url":ii.get("descriptionurl") or ii.get("url"),
                "download_url":ii.get("thumburl") or ii.get("url"),
                "width":ii.get("width"),"height":ii.get("height"),
                "mime":ii.get("mime"),
                "license":((ii.get("extmetadata") or {}).get("LicenseShortName") or {}).get("value"),
                "artist":((ii.get("extmetadata") or {}).get("Artist") or {}).get("value"),
                "matched_query":matched_query,
            }
        except Exception as e:
            last_error=e
            print(f"[asset] query failed, trying fallback: {query}: {e}")
    raise RuntimeError("no validated Wikimedia image after fallbacks: " + " | ".join(queries) + f" ({last_error})")

def main():
    manifest=[]
    for item in PLAN:
        meta=choose_image(item["queries"])
        ext=".jpg" if "jpeg" in (meta["mime"] or "") else ".png"
        path=os.path.join(OUT,item["id"]+ext)
        size=download(meta["download_url"],path)
        meta.update({k:v for k,v in item.items() if k != "queries"})
        meta["path"]=path
        meta["bytes"]=size
        manifest.append(meta)
        print(f"[asset] {item['id']} <- {meta['title']} ({meta['width']}x{meta['height']}, {meta['license']}; query={meta['matched_query']})")
    with open(os.path.join(OUT,"manifest.json"),"w",encoding="utf-8") as f:
        json.dump(manifest,f,ensure_ascii=False,indent=2)
    print("[asset] validated assets:",len(manifest))

if __name__=="__main__":
    main()
