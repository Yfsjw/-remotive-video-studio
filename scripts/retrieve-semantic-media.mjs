import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MEDIA = join(ROOT, "public/media");
mkdirSync(MEDIA, { recursive: true });

const beats = [
  { id:"hook", queries:["computer laboratory technology","software developer computer","technology demonstration"], caption:"Most AI videos explain the idea. They rarely show it.", type:"human-action" },
  { id:"model", queries:["video editing timeline","nonlinear video editing","film editor editing"], caption:"The fix is simple: edit in shots, not slides.", type:"process" },
  { id:"narration", queries:["microphone studio recording","podcast recording studio","voice recording"], caption:"Start with the narration.", type:"human-action" },
  { id:"intent", queries:["computer screen","laptop screen software","programming computer"], caption:"Then ask: what should the viewer actually see?", type:"screen" },
  { id:"concrete", queries:["computer hardware close up","microchip electronics close up","keyboard typing hands"], caption:"Not a circle. Not a card. A real visual.", type:"close-up" },
  { id:"transition", queries:["technology laboratory","data center corridor","city technology"], caption:"A change of place can carry a transition.", type:"environment" },
  { id:"detail", queries:["server room data center","computer motherboard electronics","semiconductor laboratory"], caption:"A close-up can make the idea feel concrete.", type:"detail" },
  { id:"rhythm", queries:["film camera operator","video camera production","editing suite"], caption:"Then cut again before the image becomes wallpaper.", type:"production" },
  { id:"graphic", queries:["data visualization dashboard","scientific visualization","computer graphics screen"], caption:"Graphics still matter. But they explain what footage cannot.", type:"screen" },
  { id:"ending", queries:["computer network data center","technology laboratory","server room"], caption:"The timeline becomes a sequence of decisions.", type:"environment" }
];

const headers = { "User-Agent":"RemotiveVideoStudio/0.3", "Accept":"application/json" };

async function searchCommons(query, attempt = 1) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  for (const [k,v] of Object.entries({
    action:"query",
    format:"json",
    generator:"search",
    gsrnamespace:"6",
    gsrsearch:"filetype:video " + query,
    gsrlimit:"20",
    prop:"imageinfo",
    iiprop:"url|mime|size|mediatype|extmetadata"
  })) url.searchParams.set(k,v);

  try {
    const res = await fetch(url,{headers, signal:AbortSignal.timeout(20000)});
    if(!res.ok) {
      if((res.status === 429 || res.status >= 500) && attempt < 4) {
        const delay = Math.min(8000, 1000 * 2 ** (attempt - 1));
        console.log("RETRY SEARCH", query, "HTTP", res.status, "after", delay, "ms");
        await new Promise(r => setTimeout(r, delay));
        return searchCommons(query, attempt + 1);
      }
      throw new Error("Commons HTTP " + res.status + " for " + query);
    }
    const data = await res.json();
    return Object.values(data.query?.pages ?? {});
  } catch (error) {
    if(attempt < 4) {
      const delay = Math.min(8000, 1000 * 2 ** (attempt - 1));
      console.log("RETRY SEARCH", query, "error", error?.message || error, "after", delay, "ms");
      await new Promise(r => setTimeout(r, delay));
      return searchCommons(query, attempt + 1);
    }
    throw error;
  }
}

function titleOf(x) {
  return String(x.title || "").replace(/^File:/, "");
}

function usable(x,used) {
  const ii=x.imageinfo?.[0];
  const mime=String(ii?.mime||"").toLowerCase();
  const mediaType=String(ii?.mediatype||"").toUpperCase();
  const title=titleOf(x).toLowerCase();
  const videoExt=/\.(mp4|webm|ogv|ogg|mov|mkv)$/i.test(title);
  const bad = BAD_WORDS.some(w=>title.includes(w));
  return !!ii && !bad &&
    !!ii.url &&
    (mediaType === "VIDEO" || mime.startsWith("video/") || videoExt) &&
    Number(ii.size||0)>0 &&
    Number(ii.size||0)<=180_000_000 &&
    !used.has(titleOf(x));
}

const BAD_WORDS = ["suicide","death","war","military","football","soccer","porn","sex","religion","politician","election","protest","accident","crime","disaster","animal","bird","cat","dog"];
const GOOD_WORDS = ["computer","technology","software","programming","data","server","camera","video","editing","studio","laboratory","electronics","screen","digital","microchip","network","keyboard","recording"];

function score(x,query) {
  const ii=x.imageinfo?.[0];
  const title=titleOf(x).toLowerCase();
  const desc=String(ii?.extmetadata?.ImageDescription?.value||"").replace(/<[^>]+>/g," ").toLowerCase().slice(0,2000);
  const text=title+" "+desc;
  const q=query.toLowerCase().split(/\s+/).filter(t=>t.length>2);
  let n=q.reduce((sum,t)=>sum+(text.includes(t)?5:0),0);
  n+=GOOD_WORDS.reduce((sum,t)=>sum+(text.includes(t)?1:0),0);
  n-=BAD_WORDS.reduce((sum,t)=>sum+(text.includes(t)?10:0),0);
  return n;
}

function safeName(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,55);
}

function probeDuration(file) {
  try {
    return Number(execFileSync("ffprobe",[
      "-v","error","-show_entries","format=duration",
      "-of","default=noprint_wrappers=1:nokey=1",file
    ],{encoding:"utf8"}).trim());
  } catch {
    return 0;
  }
}

function downloadAndNormalize(url,target) {
  const tmp=target+".download";
  if(existsSync(tmp)) unlinkSync(tmp);
  execFileSync("curl",[
    "-L","--fail","--retry","3","--retry-delay","2","--retry-max-time","30",
    "--connect-timeout","20","--max-time","120",url,"-o",tmp
  ],{stdio:"inherit"});

  const sourceDuration=probeDuration(tmp);
  if(!Number.isFinite(sourceDuration) || sourceDuration < 14) {
    unlinkSync(tmp);
    return {ok:false,duration:sourceDuration};
  }

  execFileSync("ffmpeg",[
    "-y","-i",tmp,"-t","14",
    "-vf","scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30",
    "-an","-c:v","libx264","-preset","veryfast","-pix_fmt","yuv420p",target
  ],{stdio:"inherit"});

  unlinkSync(tmp);
  return {ok:true,duration:sourceDuration};
}

async function main() {
  const used=new Set(), selected=[];

  for(const beat of beats) {
    let chosen=null;

    for(const q of beat.queries) {
      const candidates=(await searchCommons(q))
        .filter(x=>usable(x,used))
        .map(x=>({x,score:score(x,q)}))
        .filter(v=>v.score >= 5)
        .sort((a,b)=>b.score-a.score)
        .map(v=>v.x);

      console.log("SEARCH",beat.id,q,"candidates",candidates.length);

      for(const item of candidates.slice(0,12)) {
        const ii=item.imageinfo[0];
        const filename=String(selected.length+1).padStart(2,"0")+"-"+safeName(titleOf(item))+".mp4";
        const target=join(MEDIA,filename);

        console.log("TRY",beat.id,"=>",titleOf(item));
        const result=downloadAndNormalize(ii.url,target);

        if(result.ok) {
          chosen={...beat,title:titleOf(item),url:ii.url,
            license:ii.extmetadata?.LicenseShortName?.value||"See Commons file page",
            sourcePage:"https://commons.wikimedia.org/wiki/"+encodeURIComponent(String(item.title).replace(/ /g,"_")),
            sourceDuration:result.duration,
            filename
          };
          break;
        }

        console.log("REJECT",titleOf(item),"duration",result.duration);
        if(existsSync(target)) unlinkSync(target);
      }

      if(chosen) break;
    }

    if(!chosen) {
      throw new Error("No distinct usable video >=14s for beat "+beat.id+" after all fallback queries");
    }

    used.add(chosen.title);
    selected.push(chosen);
    console.log("SELECTED",beat.id,"=>",chosen.title);
  }

  let from=0;
  const shots=[],manifest=[];

  const weights=selected.map(a=>Math.max(1,a.caption.split(/\s+/).length));
  const rawTotal=weights.reduce((a,b)=>a+b,0);
  const durations=weights.map(w=>Math.max(54,Math.round(w/rawTotal*900)));
  let correction=900-durations.reduce((a,b)=>a+b,0);
  durations[durations.length-1]+=correction;

  for(let i=0;i<selected.length;i++) {
    const a=selected[i], duration=durations[i];
    shots.push({
      ...a,
      from,
      duration,
      trim:0,
      src:"media/"+a.filename,
      assetTitle:a.title,
      assetUrl:a.url
    });
    manifest.push({
      file:"media/"+a.filename,
      title:a.title,
      sourcePage:a.sourcePage,
      license:a.license,
      sourceDuration:a.sourceDuration
    });
    from+=duration;
  }

  if(from!==900) throw new Error("Shot plan total "+from+" frames, expected 900");

  writeFileSync(join(ROOT,"public/media-manifest.json"),JSON.stringify(manifest,null,2));
  writeFileSync(join(ROOT,"src/generatedShots.ts"),
    "export const generatedShots = "+JSON.stringify(shots,null,2)+" as const;\n");
}

main().catch(e=>{console.error(e);process.exit(1)});
