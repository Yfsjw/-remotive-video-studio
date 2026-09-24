import React from "react";
import {AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import type {Shot, Storyboard} from "./planner/schema";
import {exampleStoryboard} from "./planner/example-storyboard";

const BG = "#05070b";
const TEXT = "#f5f7fa";
const MUTED = "rgba(245,247,250,.68)";
const ACCENT = "#7dd3fc";

// Asset contract: resolve-planner-assets.mjs writes every resolved asset as planner-assets/<id>.jpg.\n// Keep the renderer on that concrete file contract; never reference extensionless asset IDs.\nconst asset = (id:string) => staticFile("planner-assets/" + id + ".jpg");

const Photo: React.FC<{
  id:string;
  startScale?:number;
  endScale?:number;
  x?:number;
  y?:number;
  opacity?:number;
}> = ({id,startScale=1.04,endScale=1.12,x=0,y=0,opacity=1}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame,[0,120],[startScale,endScale],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const driftX = interpolate(frame,[0,120],[x,x + 18],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const driftY = interpolate(frame,[0,120],[y,y - 12],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <Img src={asset(id)} style={{
    position:"absolute", inset:-70, width:"calc(100% + 140px)", height:"calc(100% + 140px)",
    objectFit:"cover", transform:"translate(" + driftX + "px," + driftY + "px) scale(" + scale + ")",
    opacity
  }}/>;
};

const Caption: React.FC<{children:React.ReactNode}> = ({children}) => (
  <div style={{
    position:"absolute",left:0,right:0,bottom:0,padding:"180px 58px 76px",
    background:"linear-gradient(transparent,rgba(0,0,0,.88) 72%)",
    color:TEXT,fontFamily:"Arial,sans-serif"
  }}>
    <div style={{maxWidth:900,fontSize:25,lineHeight:1.25,textShadow:"0 3px 18px rgba(0,0,0,.8)"}}>{children}</div>
  </div>
);

const Tag: React.FC<{children:React.ReactNode}> = ({children}) => (
  <div style={{position:"absolute",left:56,top:76,color:TEXT,fontSize:18,fontWeight:800,letterSpacing:3,textTransform:"uppercase",textShadow:"0 2px 14px #000"}}>{children}</div>
);

const PhotoFrame: React.FC<{id:string; left:number; top:number; width:number; height:number; rotate?:number; z?:number; opacity?:number}> = ({
  id,left,top,width,height,rotate=0,z=1,opacity=1
}) => {
  const frame=useCurrentFrame();
  const y=interpolate(frame,[0,24],[55,0],{extrapolateRight:"clamp"});
  const s=interpolate(frame,[0,24],[.94,1],{extrapolateRight:"clamp"});
  return <div style={{
    position:"absolute",left,top,width,height,zIndex:z,overflow:"hidden",borderRadius:28,
    transform:"translateY(" + y + "px) rotate(" + rotate + "deg) scale(" + s + ")",
    boxShadow:"0 26px 70px rgba(0,0,0,.48)",opacity,
    border:"1px solid rgba(255,255,255,.14)"
  }}><Photo id={id} startScale={1.02} endScale={1.10}/></div>;
};

const ShotView: React.FC<{shot:Shot}> = ({shot}) => {
  const frame=useCurrentFrame();

  if(shot.id==="shot-01") return <>
    <AbsoluteFill><Photo id="hero-person-laptop" startScale={1.02} endScale={1.10}/></AbsoluteFill>
    <AbsoluteFill style={{background:"linear-gradient(120deg,rgba(0,0,0,.12),rgba(0,0,0,.56))"}}/>
    <Tag>THE AGENT LOOP</Tag>
    <div style={{position:"absolute",left:58,right:58,top:290,color:TEXT,fontSize:68,fontWeight:900,lineHeight:1.0,textShadow:"0 5px 30px rgba(0,0,0,.8)"}}>It can<br/>look things up.</div>
    <div style={{position:"absolute",left:58,top:520,width:130,height:6,background:ACCENT,borderRadius:10}}/>
  </>;

  if(shot.id==="shot-02") return <>
    <AbsoluteFill style={{background:BG}}/>
    <PhotoFrame id="hero-person-laptop" left={70} top={270} width={610} height={820} rotate={-2} z={1}/>
    <PhotoFrame id="hands-keyboard" left={400} top={680} width={610} height={760} rotate={2} z={2}/>
    <div style={{position:"absolute",left:70,right:70,top:120,color:TEXT,fontSize:44,fontWeight:900}}>Goal → search task</div>
    <div style={{position:"absolute",left:70,right:70,top:160,color:MUTED,fontSize:21}}>The visual state changes from intention to an executable step.</div>
    <div style={{position:"absolute",left:90,top:1510,color:ACCENT,fontSize:22,fontWeight:800,letterSpacing:2}}>TURNING INTENT INTO ACTION</div>
    <Caption>{shot.narration}</Caption>
  </>;

  if(shot.id==="shot-03") return <>
    <AbsoluteFill><Photo id="web-search" startScale={1.01} endScale={1.07}/></AbsoluteFill>
    <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.64))"}}/>
    <Tag>REAL WEB SEARCH</Tag>
    <div style={{position:"absolute",left:70,right:70,top:250,color:TEXT,fontSize:60,fontWeight:900,lineHeight:1.0,textShadow:"0 4px 26px #000"}}>Open.<br/>Search.<br/>Inspect.</div>
    <div style={{position:"absolute",left:70,right:70,top:620,height:5,background:ACCENT,borderRadius:10,transformOrigin:"left",transform:"scaleX(" + interpolate(frame,[0,45],[.15,1],{extrapolateRight:"clamp"}) + ")"}}/>
    <Caption>{shot.narration}</Caption>
  </>;

  if(shot.id==="shot-04") return <>
    <AbsoluteFill style={{background:BG}}/>
    <PhotoFrame id="research-paper" left={44} top={170} width={992} height={1010} rotate={-1} z={1}/>
    <PhotoFrame id="data-analysis" left={310} top={1010} width={690} height={610} rotate={2} z={2}/>
    <div style={{position:"absolute",left:90,top:1270,width:5,height:180,background:ACCENT,zIndex:4}}/>
    <div style={{position:"absolute",left:120,top:1290,zIndex:4,color:TEXT,fontSize:38,fontWeight:900}}>Select what matters.</div>
    <div style={{position:"absolute",left:120,top:1350,zIndex:4,color:MUTED,fontSize:21}}>Evidence becomes a smaller, useful context.</div>
    <Caption>{shot.narration}</Caption>
  </>;

  if(shot.id==="shot-05") return <>
    <AbsoluteFill style={{background:BG}}/>
    <PhotoFrame id="research-paper" left={-20} top={210} width={720} height={700} rotate={-4} z={1}/>
    <PhotoFrame id="data-analysis" left={420} top={500} width={680} height={700} rotate={3} z={2}/>
    <PhotoFrame id="ai-computer" left={90} top={950} width={900} height={720} rotate={-1} z={3}/>
    <div style={{position:"absolute",left:64,top:100,zIndex:5,color:TEXT,fontSize:42,fontWeight:900}}>Evidence → context → answer</div>
    <div style={{position:"absolute",left:64,top:155,zIndex:5,color:MUTED,fontSize:21}}>The important change is visible, not merely described.</div>
    <Caption>{shot.narration}</Caption>
  </>;

  if(shot.id==="shot-06") return <>
    <AbsoluteFill style={{background:BG}}/>
    <PhotoFrame id="ai-computer" left={40} top={260} width={500} height={1040} rotate={-2} z={1}/>
    <PhotoFrame id="robot-human-computer" left={540} top={260} width={500} height={1040} rotate={2} z={2}/>
    <div style={{position:"absolute",left:70,top:145,zIndex:5,color:TEXT,fontSize:50,fontWeight:900}}>Answer vs. act</div>
    <div style={{position:"absolute",left:90,top:1340,zIndex:5,color:MUTED,fontSize:22}}>A model produces an answer. An agent changes the state of the world.</div>
    <div style={{position:"absolute",left:420,top:710,zIndex:6,width:240,height:8,background:ACCENT,borderRadius:20,boxShadow:"0 0 30px rgba(125,211,252,.5)"}}/>
    <Caption>{shot.narration}</Caption>
  </>;

  if(shot.id==="shot-07") return <>
    <AbsoluteFill><Photo id="robot-human-computer" startScale={1.01} endScale={1.09}/></AbsoluteFill>
    <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(0,0,0,.16),rgba(0,0,0,.72))"}}/>
    <Tag>THE MISSING LINK</Tag>
    <div style={{position:"absolute",left:65,right:65,top:420,color:TEXT,fontSize:66,fontWeight:900,lineHeight:1.0,textShadow:"0 4px 30px #000"}}>Knowledge<br/><span style={{color:ACCENT}}>becomes</span><br/>action.</div>
    <div style={{position:"absolute",left:65,top:760,width:260,height:5,background:ACCENT,borderRadius:10}}/>
    <Caption>{shot.narration}</Caption>
  </>;

  return <>
    <AbsoluteFill><Photo id="technology-workspace" startScale={1.01} endScale={1.06}/></AbsoluteFill>
    <AbsoluteFill style={{background:"rgba(0,0,0,.34)"}}/>
    <div style={{position:"absolute",left:0,right:0,top:690,textAlign:"center",color:TEXT,textShadow:"0 4px 25px #000"}}>
      <div style={{fontSize:23,color:ACCENT,fontWeight:800,letterSpacing:5}}>CORE IDEA</div>
      <div style={{fontSize:78,fontWeight:950,marginTop:22}}>AI + TOOLS</div>
    </div>
    <Caption>{shot.narration}</Caption>
  </>;
};

export const VisualPlannerComposition: React.FC<{storyboard?:Storyboard}> = ({storyboard=exampleStoryboard}) => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const shot=storyboard.shots.find(s=>frame>=Math.round(s.startSeconds*fps)&&frame<Math.round((s.startSeconds+s.durationSeconds)*fps))||storyboard.shots[storyboard.shots.length-1];
  const start=Math.round(shot.startSeconds*fps);
  return <AbsoluteFill style={{background:BG,overflow:"hidden"}}>
    <Sequence from={start} durationInFrames={Math.round(shot.durationSeconds*fps)}>
      <ShotView shot={shot}/>
    </Sequence>
    <Audio src={staticFile("voice.wav")} volume={1}/>
  </AbsoluteFill>;
};
