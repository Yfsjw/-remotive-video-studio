import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig,interpolate,Easing} from 'remotion';
import {IntroAsset,ResearchAsset,UnderstandAsset,BuildAsset} from './v11-visuals';

type Scene={start:number;end:number;number:string;kicker:string;title:string;body:string;accent:string};
const scenes:Scene[]=[
 {start:0,end:165,number:'00',kicker:'THREE USEFUL CAPABILITIES',title:'ChatGPT is more than a chatbot.',body:'Question → research → understanding → a usable result.',accent:'#8B5CF6'},
 {start:165,end:443,number:'01',kicker:'RESEARCH',title:'Start with the question. End with a plan.',body:'Goal, constraints, evidence, then a clear next move.',accent:'#22C55E'},
 {start:443,end:638,number:'02',kicker:'UNDERSTAND',title:'Make difficult ideas concrete.',body:'Abstract idea → analogy → example → action.',accent:'#38BDF8'},
 {start:638,end:900,number:'03',kicker:'BUILD',title:'Turn the outcome into an artifact.',body:'Code, script, checklist, or first draft.',accent:'#F59E0B'}
];

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>Easing.out(Easing.cubic)(clamp(n));

const Background=({frame,accent}:{frame:number;accent:string})=>(
 <AbsoluteFill style={{background:'#05070A'}}>
  <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 78% 35%,${accent}20,transparent 30%),radial-gradient(circle at 18% 80%,#38BDF810,transparent 38%)`}}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity:.11}}>
   <defs><pattern id="v11grid" width="120" height="120" patternUnits="userSpaceOnUse"><path d="M120 0H0V120" fill="none" stroke="white" strokeOpacity=".14"/></pattern></defs>
   <rect width="1080" height="1920" fill="url(#v11grid)" transform={`translate(${Math.sin(frame/120)*16} ${(frame%300)/4})`}/>
  </svg>
 </AbsoluteFill>
);

const WordTitle=({text,frame,delay,size}:{text:string;frame:number;delay:number;size:number})=>(
 <div style={{display:'flex',flexWrap:'wrap',gap:'0 12px',fontSize:size,lineHeight:.98,fontWeight:900,letterSpacing:-3}}>
  {text.split(' ').map((w,i)=>{const p=ease((frame-delay-i*2)/10);return <span key={i} style={{display:'inline-block',opacity:p,transform:`translateY(${(1-p)*24}px)`}}>{w}</span>})}
 </div>
);

export const Main:React.FC=()=>{
 const frame=useCurrentFrame(); const {fps}=useVideoConfig();
 const index=frame<165?0:frame<443?1:frame<638?2:3; const s=scenes[index];
 const local=frame-s.start;
 const enter=ease(local/18);
 const exit=interpolate(frame,[s.end-16,s.end],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const op=enter*exit;
 const accent=s.accent;

 return <AbsoluteFill style={{color:'#fff',fontFamily:'Arial,Helvetica,sans-serif',overflow:'hidden'}}>
  <Audio src={staticFile('voice.wav')} volume={.96}/>
  <Background frame={frame} accent={accent}/>

  <div style={{position:'absolute',top:48,left:58,right:58,display:'flex',justifyContent:'space-between',alignItems:'center',opacity:.58}}>
   <div style={{fontSize:18,fontWeight:800,letterSpacing:4}}>REMOTIVE / VISUAL ENGINE</div>
   <div style={{fontSize:12,fontWeight:800,letterSpacing:3,opacity:.45}}>V11 / ASSET STORY</div>
  </div>

  <div style={{position:'absolute',left:58,top:270,display:'flex',alignItems:'center',gap:14,opacity:op}}>
   <div style={{width:46,height:46,borderRadius:23,border:`2px solid ${accent}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 28px ${accent}44`}}>
    <span style={{fontWeight:900,fontSize:14}}>{s.number}</span>
   </div>
   <div style={{fontSize:13,fontWeight:800,letterSpacing:3,opacity:.5}}>{s.kicker}</div>
  </div>

  <div style={{position:'absolute',left:58,top:350,width:570,opacity:op,transform:`translateY(${(1-enter)*26}px)`}}>
   <WordTitle text={s.title} frame={frame} delay={s.start+5} size={index===0?60:55}/>
   <div style={{marginTop:22,fontSize:20,lineHeight:1.35,opacity:.5,maxWidth:500}}>{s.body}</div>
  </div>

  {index===0&&<IntroAsset frame={frame} accent={accent} progress={op}/>}
  {index===1&&<ResearchAsset frame={frame} accent={accent} progress={op}/>}
  {index===2&&<UnderstandAsset frame={frame} accent={accent} progress={op}/>}
  {index===3&&<BuildAsset frame={frame} accent={accent} progress={op}/>}

  <div style={{position:'absolute',left:58,right:58,bottom:82,height:3,background:'#fff1',borderRadius:3}}>
   <div style={{width:`${frame/899*100}%`,height:'100%',background:`linear-gradient(90deg,${accent},#fff)`,borderRadius:3}}/>
  </div>
  <div style={{position:'absolute',left:58,bottom:108,fontSize:11,letterSpacing:3,opacity:.24}}>STORY / VISUAL / VOICE</div>
  <div style={{position:'absolute',right:58,bottom:108,fontSize:11,letterSpacing:3,opacity:.24}}>1080 × 1920</div>
 </AbsoluteFill>;
};
