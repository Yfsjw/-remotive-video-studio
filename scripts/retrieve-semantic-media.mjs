import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync, existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const MEDIA = join(ROOT, "public/media");
mkdirSync(MEDIA, { recursive: true });

const beats = [
  { id:"hook", queries:["person laptop","office computer","technology"], caption:"Most AI videos explain the idea. They rarely show it.", type:"human-action" },
  { id:"model", queries:["video editing","film editing","computer"], caption:"The fix is simple: edit in shots, not slides.", type:"process" },
  { id:"narration", queries:["podcast microphone","person speaking","studio"], caption:"Start with the narration.", type:"human-action" },
  { id:"intent", queries:["programming computer","software screen","computer screen"], caption:"Then ask: what should the viewer actually see?", type:"screen" },
  { id:"concrete", queries:["keyboard hands","computer keyboard","typing"], caption:"Not a circle. Not a card. A real visual.", type:"close-up" },
  { id:"transition", queries:["city traffic","city street","urban"], caption:"A change of place can carry a transition.", type:"environment" },
  { id:"detail", queries:["server room","computer hardware","data center"], caption:"A close-up can make the idea feel concrete.", type:"detail" },
  { id:"rhythm", queries:["camera operator","filmmaking","video production"], caption:"Then cut again before the image becomes wallpaper.", type:"production" },
  { id:"graphic", queries:["data visualization","computer display","digital screen"], caption:"Graphics still matter. But they explain what footage cannot.", type:"screen" },
  { id:"ending", queries:["technology city","city night","computer network"], caption:"The timeline becomes a sequence of decisions.", type:"environment" }
];

const headers = { "User-Agent":"RemotiveVideoStudio/0.2", "Accept":"application/json" };

async function searchCommons(query) {
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  for (const [k,v] of Object.entries({
    action:"query", format:"json", generator:"search", gsrnamespace:"6",
    gsrsearch:query, gsrlimit:"50", prop:"imageinfo",
    iiprop:"url|mime|size|duration|extmetadata"
  })) url.searchParams.set(k,v);
  const res = await fetch(url,{headers});
  if(!res.ok) throw new Error("Commons HTTP "+res.status+" for "+query);
  const data=await res.json();
  return Object.values(data.query?.pages ?? {});
}

function titleOf(x){ return String(x.title||"").replace(/^File:/,""); }
function usable(x,used){
  const ii=x.imageinfo?.[0];
  const mime=String(ii?.mime||"").toLowerCase();
  return ii && mime.startsWith("video/") && ii.url &&
    Number(ii.size||0)>0 && Number(ii.size||0)<=180_000_000 &&
    Number(ii.duration||0)>=4 && !used.has(titleOf(x));
}
function score(x,query){
  const title=titleOf(x).toLowerCase();
  return query.toLowerCase().split(/\s+/).filter(t=>t.length>2)
    .reduce((n,t)=>n+(title.includes(t)?4:0),0);
}
function safeName(s){return s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,55)}

async function findAsset(queries,used){
  for(const q of queries){
    const candidates=await searchCommons(q);
    const item=candidates.filter(x=>usable(x,used)).sort((a,b)=>score(b,q)-score(a,q))[0];
    if(item) return item;
  }
  return null;
}

async function main(){
  const used=new Set(), selected=[];
  for(const beat of beats){
    const item=await findAsset(beat.queries,used);
    if(!item){ throw new Error("No distinct usable video for beat "+beat.id+" after fallback queries: "+beat.queries.join(", ")); }
    const ii=item.imageinfo[0];
    used.add(titleOf(item));
    selected.push({...beat,title:titleOf(item),url:ii.url,
      license:ii.extmetadata?.LicenseShortName?.value||"See Commons file page",
      sourcePage:"https://commons.wikimedia.org/wiki/"+encodeURIComponent(String(item.title).replace(/ /g,"_"))});
    console.log("SELECTED",beat.id,"=>",titleOf(item));
  }

  const durations=[78,84,78,84,78,90,84,90,102,132];
  let from=0; const shots=[],manifest=[];
  for(let i=0;i<beats.length;i++){
    const a=selected[i], duration=durations[i];
    const filename=String(i+1).padStart(2,"0")+"-"+safeName(a.title)+".mp4";
    const target=join(MEDIA,filename), tmp=target+".download";
    if(existsSync(target)) unlinkSync(target);
    execFileSync("curl",["-L","--fail","--retry","3","--connect-timeout","20","--max-time","120",a.url,"-o",tmp],{stdio:"inherit"});
    execFileSync("ffmpeg",["-y","-i",tmp,"-t","14","-vf","scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,fps=30","-an","-c:v","libx264","-preset","veryfast","-pix_fmt","yuv420p",target],{stdio:"inherit"});
    unlinkSync(tmp);
    shots.push({...a,from,duration,trim:0,src:"media/"+filename,assetTitle:a.title,assetUrl:a.url});
    manifest.push({file:"media/"+filename,title:a.title,sourcePage:a.sourcePage,license:a.license});
    from+=duration;
  }
  if(from!==900) throw new Error("Shot plan total "+from+" frames, expected 900");
  writeFileSync(join(ROOT,"public/media-manifest.json"),JSON.stringify(manifest,null,2));
  writeFileSync(join(ROOT,"src/generatedShots.ts"),"export const generatedShots = "+JSON.stringify(shots,null,2)+" as const;\n");
}
main().catch(e=>{console.error(e);process.exit(1)});
