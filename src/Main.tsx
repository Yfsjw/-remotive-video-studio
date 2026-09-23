import React from 'react';
import {AbsoluteFill,Audio,staticFile,useCurrentFrame,useVideoConfig,interpolate,Easing} from 'remotion';
import {ResearchIllustration,ExplainIllustration,BuildIllustration,reveal} from './visual-engine';

type Scene={start:number;end:number;number:string;kicker:string;title:string;body:string;accent:string};
const scenes:Scene[]=[
 {start:0,end:165,number:'00',kicker:'THREE USEFUL CAPABILITIES',title:'ChatGPT is more than a chatbot.',body:'It can move from a question to research, understanding, and a usable result.',accent:'#8B5CF6'},
 {start:165,end:443,number:'01',kicker:'RESEARCH',title:'Start with the question. End with a plan.',body:'Give it a goal and constraints. Compare evidence, expose gaps, then turn the findings into a next move.',accent:'#22C55E'},
 {start:443,end:638,number:'02',kicker:'UNDERSTAND',title:'Make difficult ideas concrete.',body:'Move from abstraction to analogy to a simple example — then connect the idea back to something you can use.',accent:'#38BDF8'},
 {start:638,end:900,number:'03',kicker:'BUILD',title:'Turn the outcome into an artifact.',body:'A rough result can become code, a script, a checklist, or a first draft. Start from the output.',accent:'#F59E0B'}
];

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>Easing.out(Easing.cubic)(clamp(n));

const Background=({frame,accent}:{frame:number;accent:string})=>(
 <AbsoluteFill style={{background:'#06070A'}}>
  <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 78% 28%,${accent}26,transparent 30%),radial-gradient(circle at 15% 88%,#38BDF812,transparent 34%)`}}/>
  <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity:.13}}>
   <defs><pattern id="g" width="96" height="96" patternUnits="userSpaceOnUse"><path d="M96 0H0V96" fill="none" stroke="white" strokeOpacity=".16"/></pattern></defs>
   <rect width="1080" height="1920" fill="url(#g)" transform={`translate(${Math.sin(frame/110)*18} ${(frame%240)/3})`}/>
  </svg>
  <div style={{position:'absolute',width:620,height:620,borderRadius:'50%',right:-360,top:230,background:accent,opacity:.06,filter:'blur(100px)',transform:`scale(${1+Math.sin(frame/40)*.06})`}}/>
 </AbsoluteFill>
);

const WordTitle=({text,frame,delay,size}:{text:string;frame:number;delay:number;size:number})=>(
 <div style={{display:'flex',flexWrap:'wrap',gap:'0 14px',fontSize:size,lineHeight:.98,fontWeight:900,letterSpacing:-3}}>
  {text.split(' ').map((w,i)=>{const p=ease((frame-delay-i*2)/10);return <span key={i} style={{display:'inline-block',opacity:p,transform:`translateY(${(1-p)*26}px) scale(${.96+.04*p})`}}>{w}</span>})}
 </div>
);

const IntroVisual=({frame,accent}:{frame:number;accent:string})=>{
 const p=reveal(frame,12,55), q=reveal(frame,45,100), r=reveal(frame,75,135);
 return <svg width="580" height="760" viewBox="0 0 580 760" style={{position:'absolute',right:0,top:285,overflow:'visible'}}>
  <defs><linearGradient id="i1" x1="0" y1="0" x2="1" y2="1"><stop stopColor={accent} stopOpacity=".9"/><stop offset="1" stopColor="#fff" stopOpacity=".25"/></linearGradient></defs>
  <g opacity={p} transform={`translate(0 ${(1-p)*35})`}>
   <rect x="45" y="70" width="480" height="300" rx="34" fill="#0d1118" stroke="white" strokeOpacity=".12"/>
   <rect x="75" y="105" width="420" height="70" rx="18" fill={accent} opacity=".11"/>
   <circle cx="105" cy="140" r="18" fill={accent} opacity=".8"/><text x="140" y="147" fill="white" fontSize="19" fontWeight="800">QUESTION</text>
   <path d="M95 225 H470" stroke="white" opacity=".12"/><path d="M95 255 H390" stroke="white" opacity=".08"/><path d="M95 285 H445" stroke="white" opacity=".08"/>
  </g>
  <g opacity={q} transform={`translate(0 ${(1-q)*25})`}>
   <path d="M290 385 V455" stroke={accent} strokeWidth="3" strokeDasharray="8 9"/>
   <circle cx="290" cy="455" r="48" fill={accent} opacity=".14" stroke={accent} strokeWidth="2"/><text x="290" y="462" textAnchor="middle" fill="white" fontSize="16" fontWeight="900">THINK</text>
  </g>
  <g opacity={r}>
   <path d="M290 505 C200 540 140 565 105 615" stroke={accent} strokeWidth="3" fill="none"/>
   <path d="M290 505 C380 540 440 565 475 615" stroke={accent} strokeWidth="3" fill="none"/>
   <rect x="30" y="610" width="180" height="78" rx="20" fill="#0d131c" stroke={accent} strokeOpacity=".45"/><text x="120" y="657" textAnchor="middle" fill="white" fontSize="16" fontWeight="800">RESEARCH</text>
   <rect x="370" y="610" width="180" height="78" rx="20" fill="#0d131c" stroke={accent} strokeOpacity=".45"/><text x="460" y="657" textAnchor="middle" fill="white" fontSize="16" fontWeight="800">BUILD</text>
  </g>
 </svg>;
};

export const Main:React.FC=()=>{
 const frame=useCurrentFrame(); const {fps}=useVideoConfig();
 const index=frame<165?0:frame<443?1:3===3&&frame<638?2:3; const s=scenes[index]; const local=frame-s.start;
 const enter=ease(local/18), exit=interpolate(frame,[s.end-16,s.end],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}), op=enter*exit;
 const accent=s.accent;
 return <AbsoluteFill style={{color:'#fff',fontFamily:'Arial,Helvetica,sans-serif',overflow:'hidden'}}>
  <Audio src={staticFile('voice.wav')} volume={.96}/><Background frame={frame} accent={accent}/>
  <div style={{position:'absolute',top:52,left:58,right:58,display:'flex',justifyContent:'space-between',alignItems:'center',opacity:.62}}>
   <div style={{fontSize:19,fontWeight:800,letterSpacing:4}}>REMOTIVE / VISUAL ENGINE</div>
   <div style={{fontSize:13,fontWeight:800,letterSpacing:3,opacity:.42}}>V10 / STORY MODE</div>
  </div>
  <div style={{position:'absolute',left:58,top:300,display:'flex',alignItems:'center',gap:16,opacity:op}}>
   <div style={{width:50,height:50,borderRadius:25,border:`2px solid ${accent}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 30px ${accent}44`}}><span style={{fontWeight:900,fontSize:15}}>{s.number}</span></div>
   <div style={{fontSize:14,fontWeight:800,letterSpacing:3,opacity:.48}}>{s.kicker}</div>
  </div>
  <div style={{position:'absolute',left:58,top:385,width:630,opacity:op,transform:`translateY(${(1-enter)*30}px)`}}>
   <WordTitle text={s.title} frame={frame} delay={s.start+5} size={index===0?65:59}/>
   <div style={{marginTop:28,fontSize:23,lineHeight:1.42,opacity:.58,maxWidth:610}}>{s.body}</div>
  </div>
  {index===0&&<IntroVisual frame={frame} accent={accent}/>}
  {index===1&&<ResearchIllustration frame={frame} accent={accent} progress={op}/>}
  {index===2&&<ExplainIllustration frame={frame} accent={accent} progress={op}/>}
  {index===3&&<BuildIllustration frame={frame} accent={accent} progress={op}/>}
  <div style={{position:'absolute',left:58,right:58,bottom:82,height:3,background:'#fff1',borderRadius:3}}><div style={{width:`${frame/899*100}%`,height:'100%',background:`linear-gradient(90deg,${accent},#fff)`,borderRadius:3}}/></div>
  <div style={{position:'absolute',left:58,bottom:108,fontSize:12,letterSpacing:3,opacity:.25}}>QUESTION → TRANSFORM → USE</div>
  <div style={{position:'absolute',right:58,bottom:108,fontSize:12,letterSpacing:3,opacity:.25}}>1080 × 1920</div>
 </AbsoluteFill>;
};
