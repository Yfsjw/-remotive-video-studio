import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';

const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const ease=(n:number)=>Easing.out(Easing.cubic)(clamp(n));
const inOut=(n:number)=>Easing.inOut(Easing.quad)(clamp(n));
const reveal=(frame:number,a:number,b:number)=>ease((frame-a)/(b-a));
const sceneProgress=(frame:number,start:number,end:number)=>clamp((frame-start)/(end-start));

type SceneProps={frame:number; start:number; end:number};

const Photo=({src,frame,start,end,focus='center',dark=0.24}:{src:string;frame:number;start:number;end:number;focus?:string;dark?:number})=>{
  const p=reveal(frame,start,start+24);
  const q=sceneProgress(frame,start,end);
  const scale=interpolate(q,[0,1],[1.04,1.13]);
  const x=interpolate(q,[0,1],[-1.2,1.2]);
  return <AbsoluteFill style={{opacity:p}}>
    <Img src={staticFile(src)} style={{
      position:'absolute',inset:'-4%',width:'108%',height:'108%',objectFit:'cover',
      objectPosition:focus,transform:`scale(${scale}) translate(${x}%,0)`,
      filter:'saturate(.96) contrast(1.06)',
    }}/>
    <AbsoluteFill style={{background:`linear-gradient(180deg,rgba(4,6,10,.76) 0%,rgba(4,6,10,${dark}) 38%,rgba(4,6,10,.82) 100%)`}}/>
  </AbsoluteFill>;
};

const Label=({children,progress=1}:{children:React.ReactNode;progress?:number})=>
  <div style={{
    opacity:progress,transform:`translateY(${(1-progress)*14}px)`,
    fontSize:15,fontWeight:900,letterSpacing:3,textTransform:'uppercase',
  }}>{children}</div>;

const SceneOne=({frame,start,end}:SceneProps)=>{
  const p=reveal(frame,start,start+30);
  const q=sceneProgress(frame,start,end);
  const typed=Math.round(interpolate(q,[.12,.55],[0,34],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));
  const query='how does AI answer a question?';
  const shown=query.slice(0,Math.min(typed,query.length));
  const card=reveal(frame,start+45,start+78);
  const push=interpolate(q,[0,1],[0,18]);
  return <AbsoluteFill>
    <Photo src="assets/story-laptop.jpg" frame={frame} start={start} end={end} focus="45% 48%" dark={.18}/>
    <div style={{position:'absolute',left:70,right:70,top:150,opacity:p}}>
      <Label progress={p}>01 / THE INPUT</Label>
      <div style={{marginTop:18,fontSize:66,lineHeight:.96,fontWeight:900,maxWidth:850,letterSpacing:-2}}>It starts with a question.</div>
    </div>
    <div style={{
      position:'absolute',left:72,right:72,top:610,height:104,borderRadius:26,
      background:'rgba(8,11,18,.84)',border:'1px solid rgba(255,255,255,.22)',
      boxShadow:'0 24px 70px rgba(0,0,0,.34)',backdropFilter:'blur(14px)',
      display:'flex',alignItems:'center',padding:'0 30px',transform:`translateY(${(1-card)*30}px) scale(${1+(1-card)*.025})`,opacity:card,
    }}>
      <div style={{width:18,height:18,borderRadius:9,background:'#67E8F9',marginRight:22,boxShadow:'0 0 24px rgba(103,232,249,.7)'}}/>
      <div style={{fontSize:29,fontWeight:650,color:'rgba(255,255,255,.94)',fontFamily:'Arial,Helvetica,sans-serif'}}>{shown}<span style={{opacity:.7}}>|</span></div>
    </div>
    <div style={{
      position:'absolute',left:74,bottom:280,maxWidth:820,opacity:reveal(frame,start+95,start+125),
      transform:`translateX(${(1-reveal(frame,start+95,start+125))*-35}px)`,
      fontSize:28,lineHeight:1.22,fontWeight:600,
    }}>The visual job is to make the invisible process visible.</div>
    <div style={{position:'absolute',right:70,bottom:150,fontSize:15,letterSpacing:2.5,fontWeight:900,opacity:.65}}>ASK → PROCESS → ANSWER</div>
    <div style={{position:'absolute',inset:0,pointerEvents:'none',transform:`translateY(${push}px)`}}/>
  </AbsoluteFill>;
};

const Line=({x,y,w,delay,progress}:{x:number;y:number;w:number;delay:number;progress:number})=>{
  const p=ease((progress-delay)/.35);
  return <div style={{
    position:'absolute',left:`${x}%`,top:`${y}%`,width:`${w}%`,height:3,
    transformOrigin:'left center',transform:`scaleX(${p}) rotate(-8deg)`,
    background:'linear-gradient(90deg,rgba(103,232,249,0),rgba(103,232,249,.95),rgba(255,255,255,.85))',
    boxShadow:'0 0 16px rgba(103,232,249,.6)',borderRadius:3,
  }}/>;
};

const SceneTwo=({frame,start,end}:SceneProps)=>{
  const p=reveal(frame,start,start+26);
  const q=sceneProgress(frame,start,end);
  const nodes=[['22%','49%'],['42%','43%'],['61%','50%'],['78%','44%']];
  return <AbsoluteFill>
    <Photo src="assets/story-servers.jpg" frame={frame} start={start} end={end} focus="center" dark={.10}/>
    <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(0,0,0,.65),transparent 60%)'}}/>
    <div style={{position:'absolute',left:70,top:150,opacity:p}}>
      <Label progress={p}>02 / THE HIDDEN SYSTEM</Label>
      <div style={{marginTop:18,fontSize:63,lineHeight:.96,fontWeight:900,maxWidth:800,letterSpacing:-2}}>The request moves through a system.</div>
    </div>
    <div style={{position:'absolute',left:0,right:0,top:0,bottom:0,opacity:.95}}>
      <Line x={16} y={53} w={22} delay={.05} progress={q}/>
      <Line x={36} y={48} w={22} delay={.22} progress={q}/>
      <Line x={56} y={54} w={22} delay={.39} progress={q}/>
      {nodes.map(([x,y],i)=><div key={i} style={{
        position:'absolute',left:x,top:y,width:20,height:20,borderRadius:10,
        background:i===0?'#67E8F9':'#fff',boxShadow:'0 0 28px rgba(103,232,249,.85)',
        transform:`scale(${ease((q-(i*.14))/.28)})`,opacity:ease((q-(i*.1))/.25),
      }}/>)}
    </div>
    <div style={{position:'absolute',left:72,right:72,bottom:230,display:'flex',gap:14,alignItems:'center'}}>
      {['REQUEST','ROUTE','COMPUTE','RESPONSE'].map((t,i)=>{
        const a=reveal(frame,start+48+i*20,start+72+i*20);
        return <div key={t} style={{
          opacity:a,transform:`translateY(${(1-a)*20}px)`,
          padding:'13px 17px',borderRadius:12,border:'1px solid rgba(255,255,255,.2)',
          background:'rgba(5,8,13,.62)',backdropFilter:'blur(10px)',
          fontSize:14,fontWeight:900,letterSpacing:1.8,
        }}>{t}</div>;
      })}
    </div>
    <div style={{position:'absolute',right:70,bottom:145,fontSize:23,fontWeight:800,opacity:.82}}>THOUSANDS OF MACHINES</div>
  </AbsoluteFill>;
};

const SceneThree=({frame,start,end}:SceneProps)=>{
  const p=reveal(frame,start,start+28);
  const q=sceneProgress(frame,start,end);
  const crop=interpolate(q,[0,1],[100,78]);
  const focusX=interpolate(q,[0,1],[50,60]);
  const card1=reveal(frame,start+36,start+64);
  const card2=reveal(frame,start+66,start+94);
  const card3=reveal(frame,start+96,start+124);
  return <AbsoluteFill>
    <Img src={staticFile('assets/story-teacher.jpg')} style={{
      position:'absolute',inset:'-5%',width:'110%',height:'110%',objectFit:'cover',
      objectPosition:`${focusX}% 48%`,transform:`scale(${1.02+(1-q)*.08})`,
      filter:'saturate(.9) contrast(1.04)',opacity:p,
    }}/>
    <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(3,5,9,.72),rgba(3,5,9,.10) 42%,rgba(3,5,9,.88))'}}/>
    <div style={{position:'absolute',left:70,top:150,opacity:p}}>
      <Label progress={p}>03 / MAKE IT UNDERSTANDABLE</Label>
      <div style={{marginTop:18,fontSize:60,lineHeight:.98,fontWeight:900,maxWidth:800,letterSpacing:-2}}>Information is not enough.</div>
    </div>
    <div style={{position:'absolute',left:72,bottom:300,fontSize:31,fontWeight:650,maxWidth:740,opacity:reveal(frame,start+28,start+55)}}>The viewer needs a path from the idea to the meaning.</div>
    <div style={{position:'absolute',right:62,top:600,width:360}}>
      {[
        ['01','EXAMPLE',card1],
        ['02','ANALOGY',card2],
        ['03','UNDERSTANDING',card3],
      ].map(([n,t,a])=><div key={String(n)} style={{
        opacity:Number(a),transform:`translateX(${(1-Number(a))*70}px)`,
        marginBottom:14,padding:'18px 20px',borderRadius:18,
        background:'rgba(6,9,14,.72)',border:'1px solid rgba(255,255,255,.22)',
        backdropFilter:'blur(12px)',display:'flex',alignItems:'center',gap:18,
      }}>
        <div style={{fontSize:15,fontWeight:900,letterSpacing:1.5,opacity:.55}}>{n}</div>
        <div style={{fontSize:20,fontWeight:900,letterSpacing:1}}>{t}</div>
      </div>)}
    </div>
    <div style={{position:'absolute',left:72,bottom:150,fontSize:15,letterSpacing:2.5,fontWeight:900,opacity:.6}}>SEE THE IDEA / FOLLOW THE IDEA</div>
    <div style={{position:'absolute',inset:0,pointerEvents:'none',clipPath:`inset(0 0 0 ${crop/100}%)`}}/>
  </AbsoluteFill>;
};

const SceneFour=({frame,start,end}:SceneProps)=>{
  const p=reveal(frame,start,start+25);
  const q=sceneProgress(frame,start,end);
  const codeLines=[
    'const answer = await model.generate({',
    '  question, context, constraints',
    '});',
    '',
    'return explain(answer);',
  ];
  const active=Math.floor(interpolate(q,[.10,.72],[0,codeLines.length-1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}));
  const result=reveal(frame,start+88,start+120);
  return <AbsoluteFill>
    <Photo src="assets/story-code.jpg" frame={frame} start={start} end={end} focus="center" dark={.08}/>
    <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(2,5,8,.88),rgba(2,5,8,.28) 68%,rgba(2,5,8,.72))'}}/>
    <div style={{position:'absolute',left:70,top:145,opacity:p}}>
      <Label progress={p}>04 / MAKE THE RESULT VISIBLE</Label>
      <div style={{marginTop:18,fontSize:58,lineHeight:.98,fontWeight:900,maxWidth:850,letterSpacing:-2}}>Good visuals show the result.</div>
    </div>
    <div style={{
      position:'absolute',left:68,right:68,top:590,bottom:330,borderRadius:26,
      background:'rgba(3,7,12,.82)',border:'1px solid rgba(255,255,255,.2)',
      boxShadow:'0 30px 90px rgba(0,0,0,.4)',backdropFilter:'blur(16px)',
      padding:28,opacity:reveal(frame,start+28,start+55),
    }}>
      <div style={{display:'flex',gap:9,marginBottom:25}}>
        {[0,1,2].map(i=><div key={i} style={{width:10,height:10,borderRadius:5,background:'rgba(255,255,255,.35)'}}/>)}
      </div>
      <div style={{fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',fontSize:23,lineHeight:1.55}}>
        {codeLines.map((line,i)=><div key={i} style={{
          padding:'2px 12px',borderRadius:8,
          background:i===active?'rgba(103,232,249,.12)':'transparent',
          color:i===active?'#DFFBFF':'rgba(255,255,255,.78)',
        }}>{line || ' '}</div>)}
      </div>
    </div>
    <div style={{
      position:'absolute',right:80,bottom:210,width:420,padding:'22px 24px',borderRadius:20,
      background:'rgba(103,232,249,.12)',border:'1px solid rgba(103,232,249,.5)',
      boxShadow:'0 0 50px rgba(103,232,249,.18)',opacity:result,
      transform:`translateY(${(1-result)*35}px)`,
    }}>
      <div style={{fontSize:13,letterSpacing:2.4,fontWeight:900,opacity:.65}}>OUTPUT</div>
      <div style={{marginTop:8,fontSize:26,fontWeight:850}}>A clear answer the viewer can use.</div>
    </div>
    <div style={{position:'absolute',left:70,bottom:150,fontSize:15,letterSpacing:2.5,fontWeight:900,opacity:.6}}>THE STORY ENDS WITH A CHANGE IN STATE</div>
  </AbsoluteFill>;
};

export const Main:React.FC=()=>{
  const frame=useCurrentFrame();
  const scenes=[
    {start:0,end:180,render:(f:number)=><SceneOne frame={f} start={0} end={180}/>},
    {start:180,end:360,render:(f:number)=><SceneTwo frame={f} start={180} end={360}/>},
    {start:360,end:540,render:(f:number)=><SceneThree frame={f} start={360} end={540}/>},
    {start:540,end:720,render:(f:number)=><SceneFour frame={f} start={540} end={720}/>},
  ];
  const current=scenes.find(s=>frame>=s.start && frame<s.end) ?? scenes[3];
  const local=frame-current.start;
  const fadeIn=reveal(local,0,18);
  const fadeOut=interpolate(local,[current.end-current.start-18,current.end-current.start],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const progress=frame/719;
  return <AbsoluteFill style={{background:'#05070A',color:'#fff',fontFamily:'Arial,Helvetica,sans-serif',overflow:'hidden'}}>
    <Audio src={staticFile('voice.wav')} volume={.98}/>
    <AbsoluteFill style={{opacity:fadeIn*fadeOut}}>{current.render(frame)}</AbsoluteFill>
    <div style={{position:'absolute',left:58,right:58,top:52,display:'flex',justifyContent:'space-between',alignItems:'center',zIndex:10}}>
      <div style={{fontSize:18,fontWeight:900,letterSpacing:4,textShadow:'0 2px 12px #000'}}>VISUAL STORY PROTOTYPE</div>
      <div style={{fontSize:12,fontWeight:800,letterSpacing:2.5,opacity:.58}}>REAL ASSETS / AUTHORED MOTION</div>
    </div>
    <div style={{position:'absolute',left:58,right:58,bottom:62,height:3,borderRadius:3,background:'rgba(255,255,255,.2)',zIndex:10}}>
      <div style={{height:'100%',width:`${progress*100}%`,borderRadius:3,background:'linear-gradient(90deg,#67E8F9,#fff)'}}/>
    </div>
  </AbsoluteFill>;
};
