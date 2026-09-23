import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type Scene = {
  start:number;
  end:number;
  number:string;
  kicker:string;
  title:string;
  body:string;
  accent:string;
  asset:string;
  label:string;
};

const scenes:Scene[] = [
  {start:0,end:165,number:'00',kicker:'MOST PEOPLE DON’T KNOW',title:'3 things ChatGPT can do',body:'The third one can save you hours.',accent:'#8B5CF6',asset:'assets/scene01.jpg',label:'AI / COMPUTING'},
  {start:165,end:443,number:'01',kicker:'RESEARCH',title:'Turn a messy question into a plan.',body:'Compare options, spot gaps, and structure the next move.',accent:'#22C55E',asset:'assets/scene02.jpg',label:'RESEARCH'},
  {start:443,end:638,number:'02',kicker:'UNDERSTAND',title:'Explain difficult ideas at your level.',body:'Examples and analogies turn abstraction into something usable.',accent:'#38BDF8',asset:'assets/scene03.jpg',label:'EXPLANATION'},
  {start:638,end:900,number:'03',kicker:'BUILD',title:'Turn an idea into a working draft.',body:'Code, scripts, checklists, workflows — start with the outcome.',accent:'#F59E0B',asset:'assets/scene04.jpg',label:'BUILD'},
];

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>Easing.out(Easing.cubic)(clamp(n));
const reveal=(frame:number,a:number,b:number)=>ease((frame-a)/(b-a));

const PhotoScene=({scene,frame}:{scene:Scene;frame:number})=>{
  const local=frame-scene.start;
  const p=reveal(local,0,28);
  const zoom=interpolate(local,[0,scene.end-scene.start],[1.02,1.14],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const x=interpolate(local,[0,scene.end-scene.start],[-1.5,1.5],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const y=interpolate(local,[0,scene.end-scene.start],[1,-1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const imageStyle:React.CSSProperties={
    position:'absolute',width:'100%',height:'100%',objectFit:'cover',
    transform:`scale(${zoom}) translate(${x}%,${y}%)`,
    transformOrigin:'center center',filter:'saturate(.9) contrast(1.04)',
    opacity:p,
  };
  return <AbsoluteFill>
    <Img src={staticFile(scene.asset)} style={imageStyle}/>
    <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(0,0,0,.68) 0%,rgba(0,0,0,.18) 35%,rgba(0,0,0,.72) 100%)'}}/>
    <div style={{position:'absolute',inset:0,background:`linear-gradient(90deg,${scene.accent}20,transparent 58%)`}}/>
    <div style={{position:'absolute',right:48,top:275,transform:`translateY(${(1-p)*25}px)`,opacity:p}}>
      <div style={{padding:'10px 16px',borderRadius:999,background:'rgba(0,0,0,.58)',border:'1px solid rgba(255,255,255,.24)',backdropFilter:'blur(8px)',fontSize:14,fontWeight:800,letterSpacing:2,color:'white'}}>
        {scene.label}
      </div>
    </div>
    <div style={{position:'absolute',left:58,right:58,bottom:230,opacity:p,transform:`translateY(${(1-p)*35}px)`}}>
      <div style={{fontSize:17,fontWeight:900,letterSpacing:4,color:scene.accent,marginBottom:20}}>{scene.kicker}</div>
      <div style={{fontSize:64,lineHeight:.98,fontWeight:900,letterSpacing:-2.6,maxWidth:890,textShadow:'0 4px 24px rgba(0,0,0,.35)'}}>
        {scene.title}
      </div>
      <div style={{marginTop:22,maxWidth:760,fontSize:25,lineHeight:1.35,fontWeight:500,color:'rgba(255,255,255,.78)'}}>{scene.body}</div>
    </div>
    <div style={{position:'absolute',left:58,bottom:155,width:64,height:64,borderRadius:32,border:`2px solid ${scene.accent}`,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,.35)',backdropFilter:'blur(8px)',boxShadow:`0 0 34px ${scene.accent}66`}}>
      <span style={{fontSize:17,fontWeight:900}}>{scene.number}</span>
    </div>
  </AbsoluteFill>;
};

export const Main:React.FC=()=>{
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const index=frame<165?0:frame<443?1:frame<638?2:3;
  const scene=scenes[index];
  const sceneFade=interpolate(frame,[scene.end-12,scene.end],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const overall=interpolate(frame,[0,899],[0,100],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  void fps;
  return <AbsoluteFill style={{background:'#07080B',color:'#fff',fontFamily:'Arial,Helvetica,sans-serif',overflow:'hidden'}}>
    <Audio src={staticFile('voice.wav')} volume={.96}/>
    <PhotoScene scene={scene} frame={frame}/>
    <div style={{position:'absolute',inset:0,opacity:1-sceneFade,background:'#07080B'}}/>
    <div style={{position:'absolute',top:54,left:58,right:58,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div style={{fontSize:20,fontWeight:900,letterSpacing:4,textShadow:'0 2px 12px #000'}}>REMOTIVE / VISUAL ENGINE</div>
      <div style={{fontSize:13,fontWeight:800,letterSpacing:3,opacity:.62}}>ASSET-DRIVEN PROTOTYPE</div>
    </div>
    <div style={{position:'absolute',left:58,right:58,bottom:74,height:4,borderRadius:4,background:'rgba(255,255,255,.24)'}}>
      <div style={{height:'100%',width:`${overall}%`,borderRadius:4,background:`linear-gradient(90deg,${scene.accent},#fff)`}}/>
    </div>
  </AbsoluteFill>;
};
