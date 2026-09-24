import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import type {Shot, Storyboard} from "./planner/schema";
import {exampleStoryboard} from "./planner/example-storyboard";

const BG = "#070a10", TEXT = "#f4f7fb", MUTED = "#9ba8b7", ACCENT = "#7dd3fc";
const imageFor = (id: string) => {
  const m: Record<string,string> = {laptop:"planner-assets/laptop.svg",browser:"planner-assets/browser.svg",page:"planner-assets/page.svg"};
  return m[id] ? staticFile(m[id]) : null;
};
const Glass: React.FC<React.PropsWithChildren<{style?: React.CSSProperties}>> = ({children,style}) =>
  <div style={{background:"rgba(16,21,31,.84)",border:"1px solid rgba(255,255,255,.10)",boxShadow:"0 24px 80px rgba(0,0,0,.38)",borderRadius:28,backdropFilter:"blur(18px)",...style}}>{children}</div>;

const RealImage: React.FC<{id:string}> = ({id}) => {
  const src=imageFor(id), frame=useCurrentFrame();
  if(!src) return null;
  const scale=interpolate(frame,[0,120],[1.04,1.075],{extrapolateRight:"clamp"});
  return <Img src={src} style={{width:"100%",height:"100%",objectFit:"cover",transform:"scale("+scale+")"}}/>;
};

const Browser: React.FC = () => <Glass style={{position:"absolute",left:65,right:65,top:330,height:1080,overflow:"hidden"}}>
  <div style={{height:74,display:"flex",alignItems:"center",gap:12,padding:"0 22px",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
    <i style={{width:14,height:14,borderRadius:99,background:"#ff6b6b"}}/><i style={{width:14,height:14,borderRadius:99,background:"#ffd166"}}/><i style={{width:14,height:14,borderRadius:99,background:"#55d187"}}/>
    <div style={{marginLeft:15,flex:1,height:42,borderRadius:12,background:"rgba(255,255,255,.06)",color:MUTED,padding:"10px 18px",fontSize:21}}>research query / evidence</div>
  </div>
  <div style={{padding:28,display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
    <div style={{height:480,borderRadius:20,overflow:"hidden"}}><RealImage id="browser"/></div>
    <div>{[1,2,3].map(n=><div key={n} style={{padding:"24px 0",borderBottom:"1px solid rgba(255,255,255,.08)"}}>
      <div style={{height:17,width:(86-n*8)+"%",background:"rgba(255,255,255,.85)",borderRadius:8}}/>
      <div style={{height:11,width:"92%",background:"rgba(255,255,255,.15)",borderRadius:8,marginTop:14}}/>
      <div style={{height:11,width:"68%",background:"rgba(255,255,255,.09)",borderRadius:8,marginTop:9}}/>
    </div>)}</div>
  </div>
</Glass>;

const ShotView: React.FC<{shot:Shot}> = ({shot}) => {
  const frame=useCurrentFrame(), e=spring({frame,fps:30,config:{damping:18,stiffness:120}});
  if(shot.id==="shot-01") return <>
    <AbsoluteFill style={{opacity:e}}><RealImage id="laptop"/></AbsoluteFill>
    <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(4,7,12,.10),rgba(4,7,12,.92))"}}/>
    <Glass style={{position:"absolute",left:55,right:55,top:260,padding:30}}>
      <div style={{fontSize:23,color:ACCENT,fontWeight:800,letterSpacing:3}}>THE AGENT LOOP</div>
      <div style={{fontSize:58,color:TEXT,fontWeight:900,lineHeight:1.05,marginTop:12}}>It can look<br/>things up.</div>
    </Glass>
  </>;
  if(shot.id==="shot-02") return <>
    <AbsoluteFill style={{background:"radial-gradient(circle at 55% 28%,#18354a,#0b1119 45%,#05070b)"}}/>
    <Glass style={{position:"absolute",left:60,right:60,top:290,padding:34,transform:"translateY("+interpolate(frame,[0,120],[30,0],{extrapolateRight:"clamp"})+"px)"}}>
      <div style={{fontSize:21,color:MUTED}}>GOAL</div><div style={{fontSize:48,color:TEXT,fontWeight:800,marginTop:12}}>Find the answer.</div>
      <div style={{height:2,background:"rgba(125,211,252,.35)",margin:"30px 0"}}/>
      <div style={{fontSize:21,color:MUTED}}>TASK</div><div style={{fontSize:42,color:ACCENT,fontWeight:900,marginTop:12}}>Search → inspect → verify</div>
    </Glass>
    <div style={{position:"absolute",left:130,right:130,top:1060,height:360,borderRadius:30,border:"1px solid rgba(125,211,252,.25)",background:"rgba(125,211,252,.07)",display:"flex",alignItems:"center",justifyContent:"center",color:TEXT,fontSize:38,fontWeight:900}}>TASK READY</div>
  </>;
  if(shot.id==="shot-03") return <>
    <AbsoluteFill style={{background:"#05080d"}}/><Browser/>
    <div style={{position:"absolute",left:65,top:145,color:TEXT,fontSize:48,fontWeight:900}}>Open the web.</div>
  </>;
  if(shot.id==="shot-04") return <>
    <AbsoluteFill><RealImage id="page"/></AbsoluteFill><AbsoluteFill style={{background:"linear-gradient(180deg,rgba(3,7,12,.20),rgba(3,7,12,.88))"}}/>
    <Glass style={{position:"absolute",left:65,right:65,top:410,padding:32}}>
      <div style={{fontSize:20,color:ACCENT,fontWeight:800,letterSpacing:2}}>RELEVANT EVIDENCE</div>
      <div style={{marginTop:22,fontSize:36,lineHeight:1.22,color:TEXT,fontWeight:800}}>The useful part gets<br/>pulled into context.</div>
      <div style={{marginTop:28,height:7,borderRadius:9,background:"linear-gradient(90deg,#7dd3fc 0%,#7dd3fc 62%,rgba(255,255,255,.12) 62%)"}}/>
    </Glass>
  </>;
  if(shot.id==="shot-05") return <>
    <AbsoluteFill style={{background:"radial-gradient(circle at 50% 30%,#183246,#080c12 58%,#05070a)"}}/>
    <Glass style={{position:"absolute",left:55,right:55,top:260,padding:30}}>
      <div style={{fontSize:20,color:MUTED}}>CONTEXT WINDOW</div>
      <div style={{marginTop:18,padding:24,borderRadius:18,background:"rgba(255,255,255,.05)",color:TEXT,fontSize:25}}>evidence → facts → constraints</div>
      <div style={{textAlign:"center",fontSize:42,color:ACCENT,fontWeight:900,margin:"24px 0"}}>↓</div>
      <div style={{fontSize:20,color:MUTED}}>ANSWER</div>
      <div style={{marginTop:18,padding:24,borderRadius:18,background:"rgba(125,211,252,.10)",color:TEXT,fontSize:32,fontWeight:800}}>More grounded. Less guessing.</div>
    </Glass>
  </>;
  if(shot.id==="shot-06") return <>
    <AbsoluteFill style={{background:"#06090f"}}/>
    <div style={{position:"absolute",left:55,right:55,top:350,display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
      {[
        ["MODEL","Answer from context","No external action"],
        ["AGENT","Search • inspect • act","Tools change the state"]
      ].map((x,i)=><Glass key={x[0]} style={{padding:28,borderColor:i===1?"rgba(125,211,252,.5)":"rgba(255,255,255,.1)"}}>
        <div style={{fontSize:20,color:i===1?ACCENT:MUTED,fontWeight:800,letterSpacing:2}}>{x[0]}</div>
        <div style={{fontSize:35,color:TEXT,fontWeight:900,marginTop:28,lineHeight:1.08}}>{x[1]}</div>
        <div style={{fontSize:21,color:MUTED,marginTop:22}}>{x[2]}</div>
      </Glass>)}
    </div>
    <div style={{position:"absolute",top:1110,left:0,right:0,textAlign:"center",fontSize:58,color:TEXT,fontWeight:900}}>ANSWER → ACT</div>
  </>;
  if(shot.id==="shot-07") return <>
    <AbsoluteFill style={{background:"radial-gradient(circle at 50% 40%,#17394c,#060a10 60%)"}}/>
    <div style={{position:"absolute",left:60,right:60,top:510,display:"flex",alignItems:"center",gap:18}}>
      <Glass style={{flex:1,padding:28,textAlign:"center"}}><div style={{fontSize:21,color:MUTED}}>KNOWLEDGE</div><div style={{fontSize:40,color:TEXT,fontWeight:900,marginTop:18}}>What it knows</div></Glass>
      <div style={{fontSize:54,color:ACCENT}}>→</div>
      <Glass style={{flex:1,padding:28,textAlign:"center"}}><div style={{fontSize:21,color:MUTED}}>ACTION</div><div style={{fontSize:40,color:TEXT,fontWeight:900,marginTop:18}}>What it does</div></Glass>
    </div>
  </>;
  return <><AbsoluteFill style={{background:"radial-gradient(circle at 50% 35%,#17394c,#06090e 60%)"}}/>
    <div style={{position:"absolute",left:0,right:0,top:680,textAlign:"center"}}><div style={{fontSize:25,color:ACCENT,fontWeight:800,letterSpacing:5}}>CORE IDEA</div><div style={{fontSize:78,color:TEXT,fontWeight:950,marginTop:24}}>AI + TOOLS</div></div>
  </>;
};

export const VisualPlannerComposition: React.FC<{storyboard?:Storyboard}> = ({storyboard=exampleStoryboard}) => {
  const frame=useCurrentFrame(), {fps}=useVideoConfig();
  const shot=storyboard.shots.find(s=>frame>=Math.round(s.startSeconds*fps)&&frame<Math.round((s.startSeconds+s.durationSeconds)*fps))||storyboard.shots[storyboard.shots.length-1];
  const start=Math.round(shot.startSeconds*fps);
  return <AbsoluteFill style={{background:BG,overflow:"hidden"}}>
    <Sequence from={start} durationInFrames={Math.round(shot.durationSeconds*fps)}>
      <ShotView shot={shot}/>
      <div style={{position:"absolute",left:55,right:55,bottom:70,display:"flex",alignItems:"flex-end",gap:16}}>
        <div style={{width:5,height:65,borderRadius:9,background:ACCENT}}/>
        <div style={{color:"rgba(255,255,255,.88)",fontFamily:"Arial,sans-serif",fontSize:24,lineHeight:1.25,maxWidth:900,textShadow:"0 3px 20px rgba(0,0,0,.55)"}}>{shot.narration}</div>
      </div>
    </Sequence>
    <Audio src={staticFile("voice.wav")} volume={1}/>
  </AbsoluteFill>;
};
