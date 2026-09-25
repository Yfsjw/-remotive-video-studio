#!/usr/bin/env python3
import argparse, json, os, subprocess

def run(cmd): subprocess.run(cmd,check=True)

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--video",required=True)
    ap.add_argument("--plan",required=True)
    ap.add_argument("--out",required=True)
    a=ap.parse_args()
    plan=json.load(open(a.plan,encoding="utf-8"))
    os.makedirs(a.out,exist_ok=True)
    manifest=[]
    for clip in plan.get("clips",[]):
        d=os.path.join(a.out,clip["id"]); os.makedirs(d,exist_ok=True)
        start=float(clip["start"]); end=float(clip["end"])
        duration=max(1.0,end-start)
        times=[start,start+duration*.5,max(start,end-1.0)]
        frames=[]
        for i,t in enumerate(times):
            p=os.path.join(d,f"frame_{i+1:02d}.jpg")
            run(["ffmpeg","-y","-ss",f"{t:.3f}","-i",a.video,"-frames:v","1","-q:v","3",p])
            frames.append(p)
        manifest.append({"id":clip["id"],"frames":frames})
    json.dump({"version":1,"assets":manifest},open(os.path.join(a.out,"manifest.json"),"w",encoding="utf-8"),indent=2)

if __name__=="__main__": main()
