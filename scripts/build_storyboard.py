#!/usr/bin/env python3
import argparse, json, os

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--plan",required=True)
    ap.add_argument("--srt",required=True)
    ap.add_argument("--out",required=True)
    a=ap.parse_args()
    plan=json.load(open(a.plan,encoding="utf-8"))
    raw=open(a.srt,encoding="utf-8-sig").read().replace("\r","")
    storyboard=[]
    for clip in plan.get("clips",[]):
        storyboard.append({
            "id":clip["id"],
            "title":clip.get("title",""),
            "start":float(clip["start"]),
            "end":float(clip["end"]),
            "source_chapter":clip.get("source_chapter",""),
            "beats":[
                {
                    "role":"source",
                    "visual":"Use the original source footage as primary evidence.",
                    "reason":"Preserves factual visual context instead of substituting generic AI graphics."
                },
                {
                    "role":"caption",
                    "visual":"Burn in transcript-aligned captions with short readable lines.",
                    "reason":"Makes the Short understandable when muted."
                },
                {
                    "role":"motion",
                    "visual":"Use restrained punch-in/reframe transitions at idea boundaries.",
                    "reason":"Adds pacing without decorative filler."
                }
            ]
        })
    os.makedirs(os.path.dirname(a.out) or ".",exist_ok=True)
    json.dump({"version":1,"strategy":"source-first","clips":storyboard},open(a.out,"w",encoding="utf-8"),indent=2)

if __name__=="__main__":
    main()
