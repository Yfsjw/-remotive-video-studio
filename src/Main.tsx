import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

type SceneId = 'hook' | 'research' | 'understand' | 'build';
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const ease=(v:number)=>Easing.out(Easing.cubic)(clamp(v));
const scenes:Array<{id:SceneId;start:number;end:number;accent:string}>=
[{id:'hook',start:0,end:165,accent:'#A78BFA'},{id:'research',start:165,end:443,accent:'#4ADE80'},{id:'understand',start:443,end:638,accent:'#38BDF8'},{id:'build',start:638,end:900,accent:'#FBBF24'}];

const Glass=({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties})=><div style={{background:'linear-gradient(145deg,rgba(255,255,255,.105),rgba(255,255,255,.035))',border:'1px solid rgba(255,255,255,.13)',boxShadow:'0 28px 90px rgba(0,0,0,.42),inset 0 1px 0 rgba(255,255,255,.08)',backdropFilter:'blur(18px)',...style}}>{children}</div>;
const Dot=({color='#fff',size=10}:{color?:string;size?:number})=><span style={{display:'block',width:size,height:size,borderRadius:size/2,background:color,boxShadow:`0 0 18px ${color}88`}}/>;

const Phone=({frame,scale=1,children}:{frame:number;scale?:number;children:React.ReactNode})=>{
 const tilt=Math.sin(frame/42)*1.6;
 return <div style={{width:430,height:860,transform:`scale(${scale}) rotate(${tilt}deg)`,transformOrigin:'center center',borderRadius:56,padding:10,background:'linear-gradient(145deg,#2B2D33,#090A0D 55%,#30323A)',boxShadow:'0 50px 120px rgba(0,0,0,.65),0 0 0 1px rgba(255,255,255,.12)'}}>
   <div style={{position:'relative',width:'100%',height:'100%',borderRadius:47,overflow:'hidden',background:'#101217'}}>
    <div style={{position:'absolute',top:18,left:'50%',transform:'translateX(-50%)',width:112,height:24,borderRadius:16,background:'#050506',zIndex:5}}/>
    {children}
   </div>
 </div>;
};

const ChatBubble=({children,mine=false,width=320}:{children:React.ReactNode;mine?:boolean;width?:number})=><div style={{alignSelf:mine?'flex-end':'flex-start',maxWidth:width,padding:'18px 20px',borderRadius:24,background:mine?'linear-gradient(135deg,#6D4AFF,#8B5CF6)':'rgba(255,255,255,.075)',border:'1px solid rgba(255,255,255,.1)',fontSize:19,lineHeight:1.32,boxShadow:mine?'0 12px 32px rgba(109,74,255,.24)':'none'}}>{children}</div>;

const Background=({frame,accent}:{frame:number;accent:string})=><AbsoluteFill style={{background:`radial-gradient(circle at 82% 18%,${accent}20,transparent 30%),radial-gradient(circle at 10% 86%,rgba(56,189,248,.10),transparent 28%),#08090C`}}>
 <div style={{position:'absolute',width:760,height:760,borderRadius:'50%',right:-390+Math.sin(frame/70)*22,top:-350,background:accent,opacity:.075,filter:'blur(90px)'}}/>
 <div style={{position:'absolute',inset:0,opacity:.028,backgroundImage:'linear-gradient(90deg,rgba(255,255,255,.8) 1px,transparent 1px),linear-gradient(rgba(255,255,255,.8) 1px,transparent 1px)',backgroundSize:'120px 120px',transform:`translate3d(${Math.sin(frame/110)*10}px,${Math.cos(frame/130)*10}px,0)`}}/>
</AbsoluteFill>;

const SceneLabel=({number,label,opacity,accent}:{number:string;label:string;opacity:number;accent:string})=><div style={{position:'absolute',left:64,top:72,display:'flex',alignItems:'center',gap:18,opacity,zIndex:20}}>
 <div style={{width:52,height:52,borderRadius:18,display:'flex',alignItems:'center',justifyContent:'center',background:`${accent}18`,border:`1px solid ${accent}55`,color:accent,fontSize:18,fontWeight:900}}>{number}</div>
 <div style={{fontSize:17,letterSpacing:4,fontWeight:800,opacity:.5}}>{label}</div>
</div>;

const HookScene=({frame,opacity}:{frame:number;opacity:number})=>{
 const p=ease((frame-8)/22), phoneP=ease((frame-24)/34), zoom=interpolate(ease((frame-105)/55),[0,1],[1,1.055]);
 return <div style={{position:'absolute',inset:0,opacity}}>
  <div style={{position:'absolute',left:64,top:270,width:470,transform:`translate3d(0,${(1-p)*34}px,0)`}}>
   <div style={{fontSize:22,letterSpacing:5,fontWeight:800,opacity:.46,marginBottom:24}}>MOST PEOPLE DON'T KNOW</div>
   <div style={{fontSize:76,lineHeight:.96,letterSpacing:-3.5,fontWeight:950}}>3 things<br/>ChatGPT<br/><span style={{color:'#A78BFA'}}>can do.</span></div>
   <div style={{marginTop:28,fontSize:26,lineHeight:1.3,color:'rgba(255,255,255,.62)'}}>The third one can save you hours.</div>
  </div>
  <div style={{position:'absolute',left:570,top:350,opacity:phoneP,transform:`translate3d(${(1-phoneP)*100}px,0,0) scale(${zoom}) rotate(-7deg)`}}>
   <Phone frame={frame} scale={.88}><div style={{height:'100%',background:'linear-gradient(180deg,#17191F,#0D0E12)',padding:'76px 24px 24px'}}>
    <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24}}><div style={{width:34,height:34,borderRadius:12,background:'linear-gradient(135deg,#8B5CF6,#4F46E5)'}}/><div><div style={{fontWeight:800,fontSize:18}}>ChatGPT</div><div style={{fontSize:12,opacity:.4}}>new conversation</div></div></div>
    <div style={{display:'flex',flexDirection:'column',gap:18}}><ChatBubble mine width={280}>What can you help me do?</ChatBubble><ChatBubble width={330}>Research, explain, build — and turn the result into something you can use.</ChatBubble>
     <div style={{marginTop:18,padding:18,borderRadius:22,background:'rgba(167,139,250,.10)',border:'1px solid rgba(167,139,250,.25)'}}><div style={{fontSize:13,letterSpacing:2.5,color:'#A78BFA',fontWeight:800}}>3 USE CASES</div><div style={{marginTop:12,fontSize:18,lineHeight:1.5}}>Research → Understand → Build</div></div>
    </div>
   </div></Phone>
  </div>
 </div>;
};

const ResearchScene=({frame,opacity}:{frame:number;opacity:number})=>{
 const local=frame-165,enter=ease(local/30),prompt=ease((local-20)/28),board=ease((local-72)/38),resolve=ease((local-150)/80);
 return <div style={{position:'absolute',inset:0,opacity}}>
  <div style={{position:'absolute',left:64,top:210,width:370,opacity:enter,transform:`translate3d(0,${(1-enter)*30}px,0)`}}>
   <div style={{fontSize:22,letterSpacing:5,fontWeight:800,color:'#4ADE80',marginBottom:22}}>01 / RESEARCH</div>
   <div style={{fontSize:58,lineHeight:1.02,fontWeight:930,letterSpacing:-2.4}}>Turn a messy<br/>question into<br/><span style={{color:'#4ADE80'}}>a plan.</span></div>
   <div style={{marginTop:26,fontSize:24,lineHeight:1.35,color:'rgba(255,255,255,.58)'}}>Compare options. Spot gaps. Structure the next move.</div>
  </div>
  <div style={{position:'absolute',left:470,top:245,opacity:prompt,transform:`translate3d(${(1-prompt)*80}px,0,0) rotate(-3deg)`}}><Glass style={{width:470,borderRadius:30,padding:26}}>
   <div style={{fontSize:13,letterSpacing:2.5,opacity:.38,fontWeight:800}}>YOUR QUESTION</div>
   <div style={{marginTop:14,fontSize:23,lineHeight:1.35}}>“I want to start a small online business. What should I test first?”</div>
   <div style={{marginTop:22,display:'flex',alignItems:'center',gap:10}}><Dot color="#4ADE80" size={9}/><span style={{fontSize:14,opacity:.42}}>constraints detected</span></div>
  </Glass></div>
  <div style={{position:'absolute',left:395,top:540,opacity:board,transform:`translate3d(0,${(1-board)*70}px,0) scale(${.92+.08*board})`}}><Glass style={{width:600,borderRadius:34,padding:26}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><div style={{fontSize:14,letterSpacing:3,opacity:.4,fontWeight:800}}>RESEARCH BOARD</div><div style={{fontSize:13,color:'#4ADE80'}}>LIVE</div></div>
   <div style={{display:'grid',gridTemplateColumns:'1.15fr .85fr',gap:16,marginTop:22}}>{[['OPTIONS','3 markets to test','#4ADE80'],['EVIDENCE','12 useful signals','#38BDF8'],['GAPS','2 unknowns','#FBBF24'],['NEXT STEP','Run the smallest test','#A78BFA']].map(([a,b,c],i)=><div key={a} style={{padding:20,borderRadius:22,background:'rgba(255,255,255,.045)',border:'1px solid rgba(255,255,255,.08)',transform:`translateY(${Math.sin((local+i*11)/18)*3}px)`}}><div style={{fontSize:12,letterSpacing:2.2,color:c,fontWeight:900}}>{a}</div><div style={{marginTop:10,fontSize:18,fontWeight:750}}>{b}</div></div>)}</div>
   <div style={{marginTop:18,padding:16,borderRadius:18,background:'rgba(74,222,128,.08)',color:'rgba(255,255,255,.75)',fontSize:15}}>Question → evidence → decision</div>
  </Glass></div>
  <div style={{position:'absolute',right:42,bottom:155,opacity:resolve,transform:`translateY(${(1-resolve)*25}px)`}}><div style={{display:'flex',alignItems:'center',gap:14,padding:'14px 18px',borderRadius:20,background:'rgba(74,222,128,.11)',border:'1px solid rgba(74,222,128,.32)'}}><Dot color="#4ADE80" size={12}/><span style={{fontSize:17,fontWeight:800}}>clear next move</span></div></div>
 </div>;
};

const UnderstandScene=({frame,opacity}:{frame:number;opacity:number})=>{
 const local=frame-443,enter=ease(local/28),stack=ease((local-45)/55),phone=ease((local-100)/55);
 return <div style={{position:'absolute',inset:0,opacity}}>
  <div style={{position:'absolute',left:64,top:245,width:420,opacity:enter,transform:`translate3d(0,${(1-enter)*30}px,0)`}}>
   <div style={{fontSize:22,letterSpacing:5,fontWeight:800,color:'#38BDF8',marginBottom:22}}>02 / UNDERSTAND</div>
   <div style={{fontSize:57,lineHeight:1.03,fontWeight:930,letterSpacing:-2.3}}>Explain anything<br/>at <span style={{color:'#38BDF8'}}>my level.</span></div>
   <div style={{marginTop:26,fontSize:24,lineHeight:1.35,color:'rgba(255,255,255,.58)'}}>Hard idea in. Clear example out.</div>
  </div>
  <div style={{position:'absolute',left:490,top:235,width:530,height:720,opacity:stack,transform:`translate3d(0,${(1-stack)*45}px,0) rotate(-2deg)`}}>
   {[{y:220,x:75,w:390,h:250,label:'THE HARD IDEA',text:'Quantum mechanics',color:'#38BDF8',r:18},{y:300,x:38,w:430,h:250,label:'THE ANALOGY',text:'Think of it like a wave...',color:'#A78BFA',r:24},{y:390,x:5,w:475,h:250,label:'YOUR LEVEL',text:'Simple example → clear mental model',color:'#4ADE80',r:30}].map((c,i)=><div key={c.label} style={{position:'absolute',top:c.y,left:c.x,width:c.w,height:c.h,borderRadius:c.r,background:`linear-gradient(145deg,${c.color}18,rgba(255,255,255,.04))`,border:`1px solid ${c.color}42`,boxShadow:'0 24px 70px rgba(0,0,0,.35)',padding:26,transform:`rotate(${i===1?2:i===2?-1:0}deg)`}}>
    <div style={{fontSize:12,letterSpacing:2.4,color:c.color,fontWeight:900}}>{c.label}</div><div style={{marginTop:28,fontSize:i===2?23:31,fontWeight:900}}>{c.text}</div>
    <div style={{position:'absolute',left:26,right:26,bottom:25,height:7,borderRadius:4,background:'rgba(255,255,255,.08)'}}><div style={{height:'100%',width:`${62+i*12}%`,borderRadius:4,background:c.color,opacity:.7}}/></div>
   </div>)}
  </div>
  <div style={{position:'absolute',right:48,top:240,opacity:phone,transform:`translate3d(${(1-phone)*90}px,0,0) scale(.82)`}}><Phone frame={frame} scale={.7}><div style={{height:'100%',padding:'76px 24px',background:'linear-gradient(180deg,#0E141B,#091016)'}}>
   <div style={{fontSize:13,letterSpacing:2,color:'#38BDF8',fontWeight:800}}>EXPLAINED</div><div style={{fontSize:29,fontWeight:900,marginTop:18}}>A simple example</div>
   <div style={{marginTop:26,padding:18,borderRadius:20,background:'rgba(56,189,248,.08)',border:'1px solid rgba(56,189,248,.24)',fontSize:17,lineHeight:1.4}}>Start with what you already know. Then add one idea at a time.</div>
   <div style={{marginTop:22,display:'flex',gap:10,alignItems:'flex-end',height:150}}>{[45,80,112,142].map((h,i)=><div key={i} style={{flex:1,height:h,borderRadius:'12px 12px 4px 4px',background:`linear-gradient(180deg,#38BDF8,${i%2?'#4ADE80':'#8B5CF6'})`,opacity:.75}}/>)}</div>
   <div style={{marginTop:28,fontSize:14,opacity:.4}}>same concept • less jargon</div>
  </div></Phone></div>
 </div>;
};

const BuildScene=({frame,opacity}:{frame:number;opacity:number})=>{
 const local=frame-638,enter=ease(local/30),transform=ease((local-42)/65),result=ease((local-135)/75),pulse=1+Math.sin(local/13)*.012;
 return <div style={{position:'absolute',inset:0,opacity}}>
  <div style={{position:'absolute',left:64,top:210,width:380,opacity:enter,transform:`translate3d(0,${(1-enter)*28}px,0)`}}>
   <div style={{fontSize:22,letterSpacing:5,fontWeight:800,color:'#FBBF24',marginBottom:22}}>03 / BUILD</div>
   <div style={{fontSize:57,lineHeight:1.03,fontWeight:930,letterSpacing:-2.4}}>Turn an idea into<br/><span style={{color:'#FBBF24'}}>a working draft.</span></div>
   <div style={{marginTop:26,fontSize:24,lineHeight:1.35,color:'rgba(255,255,255,.58)'}}>Start with the outcome. The tool comes second.</div>
  </div>
  <div style={{position:'absolute',left:430,top:255,opacity:transform,transform:`translate3d(0,${(1-transform)*70}px,0) scale(${.92+.08*transform})`}}><Glass style={{width:570,borderRadius:34,padding:24}}>
   <div style={{display:'flex',alignItems:'center',gap:10,opacity:.45,fontSize:13,letterSpacing:2}}><Dot color="#FBBF24" size={8}/><span>ROUGH OUTCOME</span></div>
   <div style={{marginTop:16,fontSize:25,fontWeight:800}}>“I need a simple landing page for my new idea.”</div>
   <div style={{marginTop:22,height:1,background:'rgba(255,255,255,.08)'}}/>
   <div style={{marginTop:20,display:'flex',gap:12}}>{['structure','copy','layout'].map((x,i)=><div key={x} style={{flex:1,padding:'14px 12px',borderRadius:16,background:'rgba(255,255,255,.045)',fontSize:14,opacity:.7}}><span style={{color:'#FBBF24',fontWeight:900}}>0{i+1}</span><br/>{x}</div>)}</div>
  </Glass></div>
  <div style={{position:'absolute',left:410,top:590,opacity:result,transform:`translate3d(0,${(1-result)*80}px,0) scale(${pulse})`}}><div style={{display:'flex',gap:18,alignItems:'flex-start'}}>
   <Glass style={{width:300,borderRadius:26,overflow:'hidden'}}><div style={{height:46,padding:'0 16px',display:'flex',alignItems:'center',gap:7,borderBottom:'1px solid rgba(255,255,255,.08)'}}><Dot color="#EF4444" size={8}/><Dot color="#FBBF24" size={8}/><Dot color="#4ADE80" size={8}/><span style={{marginLeft:8,fontSize:12,opacity:.35}}>draft.tsx</span></div>
    <div style={{padding:20,fontFamily:'monospace',fontSize:14,lineHeight:1.9,opacity:.72}}><div><span style={{color:'#FBBF24'}}>const</span> idea = input;</div><div><span style={{color:'#A78BFA'}}>build</span>(idea);</div><div><span style={{color:'#38BDF8'}}>ship</span>(draft);</div><div style={{marginTop:12,width:'100%',height:5,borderRadius:3,background:'rgba(255,255,255,.08)'}}><div style={{width:'82%',height:'100%',background:'#FBBF24',borderRadius:3}}/></div></div>
   </Glass>
   <Glass style={{width:330,borderRadius:26,padding:18,background:'linear-gradient(145deg,rgba(251,191,36,.10),rgba(255,255,255,.035))'}}><div style={{height:24,width:150,borderRadius:7,background:'rgba(255,255,255,.10)'}}/><div style={{marginTop:18,height:90,borderRadius:18,background:'linear-gradient(135deg,rgba(251,191,36,.35),rgba(167,139,250,.18))',border:'1px solid rgba(255,255,255,.12)'}}/><div style={{marginTop:16,width:'72%',height:10,borderRadius:5,background:'rgba(255,255,255,.16)'}}/><div style={{marginTop:10,width:'54%',height:10,borderRadius:5,background:'rgba(255,255,255,.09)'}}/><div style={{marginTop:18,width:110,height:34,borderRadius:12,background:'#FBBF24',display:'flex',alignItems:'center',justifyContent:'center',color:'#17130A',fontWeight:900,fontSize:13}}>WORKING DRAFT</div></Glass>
  </div></div>
  <div style={{position:'absolute',right:56,bottom:125,opacity:result,fontSize:14,letterSpacing:2.5}}>IDEA → DRAFT → RESULT</div>
 </div>;
};

export const Main:React.FC=()=>{
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const sceneIndex=frame<165?0:frame<443?1:frame<638?2:3,scene=scenes[sceneIndex],local=frame-scene.start;
 const enter=spring({frame:local,fps,config:{damping:150,stiffness:110,mass:.7}});
 const exit=interpolate(frame,[scene.end-14,scene.end],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const opacity=enter*exit;
 return <AbsoluteFill style={{background:'#08090C',color:'#fff',fontFamily:'Arial,Helvetica,sans-serif',overflow:'hidden'}}>
  <Audio src={staticFile('voice.wav')} volume={.96}/><Background frame={frame} accent={scene.accent}/>
  <SceneLabel number={`0${sceneIndex}`} label={sceneIndex===0?'THE PROMISE':sceneIndex===1?'THE QUESTION BECOMES A PLAN':sceneIndex===2?'THE IDEA BECOMES CLEAR':'THE IDEA BECOMES REAL'} opacity={.75} accent={scene.accent}/>
  {scene.id==='hook'&&<HookScene frame={frame} opacity={opacity}/>}
  {scene.id==='research'&&<ResearchScene frame={frame} opacity={opacity}/>}
  {scene.id==='understand'&&<UnderstandScene frame={frame} opacity={opacity}/>}
  {scene.id==='build'&&<BuildScene frame={frame} opacity={opacity}/>}
  <div style={{position:'absolute',left:64,right:64,bottom:72,height:4,borderRadius:4,background:'rgba(255,255,255,.08)'}}><div style={{width:`${(frame/899)*100}%`,height:'100%',borderRadius:4,background:`linear-gradient(90deg,${scene.accent},rgba(255,255,255,.9))`}}/></div>
 </AbsoluteFill>;
};