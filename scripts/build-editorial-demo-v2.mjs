import {execFileSync} from "node:child_process";
import {mkdirSync, writeFileSync, existsSync, unlinkSync} from "node:fs";
import {join} from "node:path";

const ROOT=process.cwd();
const MEDIA=join(ROOT,"public/media");
mkdirSync(MEDIA,{recursive:true});

const assets=[
  {
    id:"microelectronics",
    title:"NASA Goddard — Microelectronics",
    url:"https://svs.gsfc.nasa.gov/vis/a010000/a014200/a014278/Microelectronics_YT.webm",
    page:"https://svs.gsfc.nasa.gov/14278",
    license:"NASA public-domain media; attribution to NASA's Goddard Space Flight Center",
    file:"nasa-microelectronics.mp4"
  },
  {
    id:"spaceback",
    title:"NASA Goddard SpaceBack — Computer Graphics",
    url:"https://svs.gsfc.nasa.gov/vis/a010000/a014200/a014278/SpaceBack_Shirah_YT.webm",
    page:"https://svs.gsfc.nasa.gov/14278",
    license:"NASA public-domain media; attribution to NASA's Goddard Space Flight Center",
    file:"nasa-spaceback.mp4"
  },
  {
    id:"dashboard",
    title:"NASA CAMP2Ex — Data Dashboard Visualization",
    url:"https://svs.gsfc.nasa.gov/vis/a010000/a014000/a014038/14038_Dashboard_VX-319370.webm",
    page:"https://svs.gsfc.nasa.gov/14038/",
    license:"NASA public-domain media; attribution to NASA's Goddard Space Flight Center",
    file:"nasa-dashboard.mp4"
  },
  {
    id:"webb",
    title:"NASA Goddard — Webb Instrument Overview",
    url:"https://svs.gsfc.nasa.gov/vis/a010000/a014100/a014136/WEBB_Instrument_Package.webm",
    page:"https://svs.gsfc.nasa.gov/14136",
    license:"NASA public-domain media; attribution to NASA's Goddard Space Flight Center",
    file:"nasa-webb-instruments.mp4"
  }
];

const beats=[
 {id:"hook",asset:"microelectronics",trim:1,caption:"The biggest upgrade in space computing wasn't always a bigger computer.",type:"hero"},
 {id:"small",asset:"microelectronics",trim:8,caption:"Sometimes, it was making the electronics smaller.",type:"detail"},
 {id:"processors",asset:"spaceback",trim:5,caption:"NASA Goddard developed microelectronics and miniaturized processors for spacecraft.",type:"process"},
 {id:"density",asset:"webb",trim:8,caption:"That meant more computing could fit into the same limited space.",type:"concept"},
 {id:"data",asset:"dashboard",trim:3,caption:"But raw computing power is only useful if humans can understand the data.",type:"reveal"},
 {id:"visualize",asset:"dashboard",trim:16,caption:"That's why NASA turns huge datasets into moving maps, simulations, and visual stories.",type:"data"},
 {id:"ending",asset:"spaceback",trim:18,caption:"The result isn't just more data. It's more information we can actually see.",type:"end"}
];

function download(url,target){
  if(existsSync(target)) unlinkSync(target);
  execFileSync("curl",["-L","--fail","--retry","3","--retry-delay","2","--connect-timeout","20","--max-time","120",url,"-o",target],{stdio:"inherit"});
}

function normalize(src,target){
  execFileSync("ffmpeg",["-y","-i",src,"-vf","scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30","-an","-c:v","libx264","-preset","veryfast","-pix_fmt","yuv420p",target],{stdio:"inherit"});
}

async function main(){
  const byId=new Map();
  for(const a of assets){
    const raw=join(MEDIA,a.file+".download");
    const out=join(MEDIA,a.file);
    download(a.url,raw);
    normalize(raw,out);
    unlinkSync(raw);
    const dur=Number(execFileSync("ffprobe",["-v","error","-show_entries","format=duration","-of","csv=p=0",out],{encoding:"utf8"}).trim());
    if(!Number.isFinite(dur)||dur<25) throw new Error("Asset too short: "+a.id+" "+dur);
    byId.set(a.id,{...a,duration:dur,src:"media/"+a.file});
  }

  const totalFrames=1350;
  const weights=beats.map(b=>Math.max(1,b.caption.split(/\s+/).length));
  const sum=weights.reduce((a,b)=>a+b,0);
  const durations=weights.map(w=>Math.max(120,Math.round(w/sum*totalFrames)));
  durations[durations.length-1]+=totalFrames-durations.reduce((a,b)=>a+b,0);

  let from=0;
  const shots=beats.map((b,i)=>{
    const a=byId.get(b.asset);
    const s={...b,from,duration:durations[i],src:a.src,trim:b.trim,assetTitle:a.title,assetUrl:a.url,sourcePage:a.page,license:a.license};
    from+=durations[i];
    return s;
  });

  writeFileSync(join(ROOT,"public/media-manifest.json"),JSON.stringify(
    assets.map(a=>({file:"media/"+a.file,title:a.title,url:a.url,sourcePage:a.page,license:a.license})),null,2));
  writeFileSync(join(ROOT,"src/generatedShots.ts"),"export const generatedShots = "+JSON.stringify(shots,null,2)+" as const;\n");
}
main().catch(e=>{console.error(e);process.exit(1)});
