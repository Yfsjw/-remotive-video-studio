import React from 'react';
import {AbsoluteFill,Audio,Easing,interpolate,spring,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';

const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>Easing.out(Easing.cubic)(clamp(v));
const scenes=[
 {start:0,end:165,kicker:'THE SHIFT',title:'AI should show the idea.',body:'Not another wall of text. A visual chain from question to result.',accent:'#A78BFA'},
 {start:165,end:443,kicker:'01 / RESEARCH',title:'Turn noise into evidence.',body:'The question becomes a map: options, signals, gaps, next move.',accent:'#4ADE80'},
 {start:443,end:638,kicker:'02 / UNDERSTAND',title:'Make the hard idea visible.',body:'Start with the concept. Then build the simplest mental model.',accent:'#38BDF8'},
 {start:638,end:900,kicker:'03 / BUILD',title:'From thought to artifact.',body:'The output is not the chat. It is the thing you can use.',accent:'#FBBF24'}
];

const Bg=({frame,color}:{frame:number;color:string})=><AbsoluteFill style={{background:'#07080B'}}>
 <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 78% 12%,${color}20,transparent 30%),radial-gradient(circle at 15% 85%,#38BDF815,transparent 28%)`}}/>
 <div style={{position:'absolute',inset:-50,opacity:.025,backgroundImage:'linear-gradient(90deg,#fff 1px,transparent 1px),linear-gradient(#fff 1px,transparent 1px)',backgroundSize:'120px 120px',transform:`translate(${Math.sin(frame/70)*12}px,${Math.cos(frame/90)*10}px)`}}/>
</AbsoluteFill>;

const Title=({frame,s,title,body,color}:{frame:number;s:any;title:string;body:string;color:string})=>{
 const p=ease((frame-s.start)/24);
 return <div style={{position:'absolute',left:64,top:230,width:500,opacity:p,transform:`translateY(${(1-p)*35}px)`}}>
  <div style={{fontSize:18,letterSpacing:4.5,fontWeight:900,color,marginBottom:20}}>{s.kicker}</div>
  <div style={{fontSize:s.start===0?76:66,lineHeight:1.01,fontWeight:950,letterSpacing:-3}}>{title}</div>
  <div style={{marginTop:26,fontSize:25,lineHeight:1.38,color:'rgba(255,255,255,.58)'}}>{body}</div>
 </div>;
};

const Research=({frame}:{frame:number})=>{
 const p=ease((frame-180)/45);
 const cards=[['OPTIONS','3 markets to test','#4ADE80'],['SIGNALS','12 useful clues','#38BDF8'],['GAPS','2 unknowns','#FBBF24'],['NEXT','Run the smallest test','#A78BFA']];
 return <div style={{position:'absolute',left:470,top:180,width:530,opacity:p,transform:`translateY(${(1-p)*55}px)`}}>
  <div style={{height:220,padding:25,borderRadius:32,border:'1px solid #ffffff20',background:'#ffffff09',transform:'rotate(-2deg)',boxShadow:'0 25px 70px #0007'}}>
   <div style={{fontSize:12,letterSpacing:3,color:'#4ADE80',fontWeight:900}}>RESEARCH DESK</div>
   <div style={{fontSize:25,fontWeight:850,marginTop:22}}>“What should I test first?”</div>
   <div style={{marginTop:28,height:10,borderRadius:8,background:'#ffffff0d'}}><div style={{width:`${45+p*55}%`,height:'100%',background:'#4ADE80',borderRadius:8}}/></div>
  </div>
  <div style={{marginTop:35,display:'grid',gap:14}}>
   {cards.map(([a,b,c],i)=><div key={a} style={{height:110,padding:20,borderRadius:24,border:`1px solid ${c}45`,background:`linear-gradient(145deg,${c}16,#ffffff06)`,transform:`translateX(${(1-p)*50-i*8}px) rotate(${i%2?-1:1}deg)`,opacity:clamp(p*1.3-i*.18)}}>
    <div style={{fontSize:11,letterSpacing:2.5,color:c,fontWeight:900}}>{a}</div><div style={{fontSize:21,fontWeight:850,marginTop:12}}>{b}</div>
   </div>)}
  </div>
 </div>;
};

const Explain=({frame}:{frame:number})=>{
 const p=ease((frame-455)/45), q=ease((frame-505)/55);
 const nodes=Array.from({length:8},(_,i)=>({x:70+i*43,y:90+Math.sin(i)*30}));
 return <div style={{position:'absolute',left:480,top:170,width:540,height:850,opacity:p,transform:`translateY(${(1-p)*45}px)`}}>
  <svg width="540" height="850" style={{position:'absolute',inset:0}}>
   <path d="M40 150 C150 30 250 280 360 130 S490 100 520 180" fill="none" stroke="#38BDF8" strokeWidth="7" opacity={.25+.7*q} strokeDasharray={`${650*q} 650`}/>
   {nodes.map((n,i)=><g key={i} opacity={q}><circle cx={n.x} cy={n.y} r={i%3===0?12:6} fill={i%3===0?'#38BDF8':'#A78BFA'}/>{i<7&&<line x1={n.x} y1={n.y} x2={nodes[i+1].x} y2={nodes[i+1].y} stroke="#ffffff25" strokeWidth="2"/>}</g>)}
  </svg>
  <div style={{position:'absolute',top:280,left:20,width:500,height:220,padding:25,borderRadius:32,border:'1px solid #38BDF855',background:'#38BDF80D',transform:`scale(${.94+.06*q})`}}>
   <div style={{fontSize:12,letterSpacing:2.5,color:'#38BDF8',fontWeight:900}}>HARD IDEA</div><div style={{fontSize:31,fontWeight:900,marginTop:24}}>Quantum mechanics</div><div style={{fontSize:14,opacity:.4,marginTop:15}}>many relationships • difficult language</div>
  </div>
  <div style={{position:'absolute',top:555,left:75,width:410,padding:25,borderRadius:28,border:'1px solid #4ADE8055',background:'#4ADE800D',opacity:q,transform:`translateY(${(1-q)*35}px)`}}>
   <div style={{fontSize:12,letterSpacing:2.5,color:'#4ADE80',fontWeight:900}}>YOUR LEVEL</div><div style={{fontSize:24,fontWeight:850,marginTop:15}}>One analogy → one mental model</div>
  </div>
 </div>;
};

const Build=({frame}:{frame:number})=>{
 const p=ease((frame-650)/45),q=ease((frame-705)/65),r=ease((frame-760)/60);
 const lines=['const idea = input;','plan(idea);','build(draft);','ship(result);'];
 return <div style={{position:'absolute',left:450,top:190,width:550,opacity:p}}>
  <div style={{height:210,padding:25,borderRadius:32,border:'1px solid #FBBF2445',background:'#FBBF2410',transform:'rotate(-2deg)'}}>
   <div style={{fontSize:12,letterSpacing:2.5,color:'#FBBF24',fontWeight:900}}>ROUGH OUTCOME</div><div style={{fontSize:27,fontWeight:900,marginTop:20}}>“Make this idea usable.”</div>
  </div>
  <div style={{position:'absolute',top:270,left:0,width:340,height:360,borderRadius:28,background:'#0C0D10',border:'1px solid #ffffff20',boxShadow:'0 30px 80px #0008',opacity:q,transform:`translateX(${(1-q)*-40}px)`}}>
   <div style={{height:48,borderBottom:'1px solid #ffffff10',padding:'0 18px',display:'flex',alignItems:'center',gap:7}}><i/><i/><i/><span style={{marginLeft:8,opacity:.35}}>draft.ts</span></div>
   <div style={{padding:22,fontFamily:'monospace',fontSize:16,lineHeight:2}}>{lines.map((x,i)=><div key={x} style={{opacity:clamp(q*1.4-i*.2),transform:`translateX(${(1-q)*15}px)`}}>{x}</div>)}</div>
  </div>
  <div style={{position:'absolute',top:340,left:245,width:305,height:390,padding:20,borderRadius:30,background:'linear-gradient(180deg,#171922,#090B0F)',border:'1px solid #ffffff25',boxShadow:'0 35px 90px #0009',opacity:r,transform:`translate(30px,${(1-r)*45}px) scale(${.9+.1*r})`}}>
   <div style={{height:130,borderRadius:18,background:'linear-gradient(135deg,#FBBF2455,#A78BFA25)'}}/><div style={{height:10,width:'78%',background:'#ffffff18',borderRadius:6,marginTop:22}}/><div style={{height:10,width:'55%',background:'#ffffff0d',borderRadius:6,marginTop:10}}/><div style={{marginTop:24,width:120,height:38,borderRadius:12,background:'#FBBF24',display:'grid',placeItems:'center',fontSize:12,fontWeight:950,color:'#17130A'}}>WORKING DRAFT</div>
  </div>
 </div>;
};

const Hook=({frame}:{frame:number})=>{
 const p=ease((frame-15)/35);
 return <div style={{position:'absolute',inset:0}}>
  <Title frame={frame} s={scenes[0]} title={scenes[0].title} body={scenes[0].body} color="#A78BFA"/>
  <div style={{position:'absolute',left:610,top:175,width:330,height:720,borderRadius:50,padding:9,background:'linear-gradient(145deg,#363840,#08090C)',boxShadow:'0 55px 120px #000b',opacity:p,transform:`translateX(${(1-p)*80}px) rotate(5deg)`}}>
   <div style={{height:'100%',borderRadius:42,background:'#101217',padding:'70px 22px'}}>
    <div style={{fontSize:12,letterSpacing:2,color:'#A78BFA',fontWeight:900}}>CHATGPT</div>
    <div style={{marginTop:28,padding:17,borderRadius:20,background:'#ffffff0d'}}>What can you actually help me do?</div>
    <div style={{marginTop:18,padding:17,borderRadius:20,background:'linear-gradient(135deg,#6045E8,#8B5CF6)'}}>Research. Explain. Build.</div>
    <div style={{marginTop:25,height:180,borderRadius:22,background:'linear-gradient(145deg,#A78BFA22,#38BDF811)',border:'1px solid #ffffff12',display:'grid',placeItems:'center',textAlign:'center',fontWeight:900,fontSize:21}}>QUESTION<br/>↓<br/>VISUAL MODEL<br/>↓<br/>RESULT</div>
   </div>
  </div>
 </div>;
};

export const Main:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const i=frame<165?0:frame<443?1:frame<638?2:3,s=scenes[i];
 const local=frame-s.start,enter=spring({frame:local,fps,config:{damping:150,stiffness:110,mass:.7}});
 const exit=interpolate(frame,[s.end-14,s.end],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const op=enter*exit;
 return <AbsoluteFill style={{background:'#07080B',color:'#fff',fontFamily:'Arial,Helvetica,sans-serif',overflow:'hidden'}}>
  <Audio src={staticFile('voice.wav')} volume={.96}/><Bg frame={frame} color={s.accent}/>
  <div style={{position:'absolute',left:64,right:64,top:62,display:'flex',justifyContent:'space-between',opacity:.5,fontSize:18,fontWeight:800,letterSpacing:4}}>REMOTIVE / STUDIO <span>VISUAL STORYTELLING</span></div>
  {i===0&&<Hook frame={frame}/>}
  {i>0&&<><Title frame={frame} s={s} title={s.title} body={s.body} color={s.accent}/>{i===1&&<Research frame={frame}/>} {i===2&&<Explain frame={frame}/>} {i===3&&<Build frame={frame}/>}</>}
  <div style={{position:'absolute',left:64,right:64,bottom:82,height:4,borderRadius:4,background:'#ffffff12'}}><div style={{width:`${frame/899*100}%`,height:'100%',borderRadius:4,background:`linear-gradient(90deg,${s.accent},#fff)`}}/></div>
  <div style={{position:'absolute',left:64,bottom:108,fontSize:13,letterSpacing:3,opacity:.3}}>QUESTION → MODEL → RESULT</div>
 </AbsoluteFill>;
};
