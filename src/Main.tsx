import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const clamp = (n:number) => Math.max(0, Math.min(1, n));
const ease = (n:number) => Easing.out(Easing.cubic)(clamp(n));
const reveal = (frame:number, a:number, b:number) => ease((frame-a)/(b-a));

type Scene = {start:number; end:number; number:string; kicker:string; title:string; body:string; accent:string};

const scenes:Scene[] = [
  {start:0,end:165,number:'00',kicker:'MOST PEOPLE DON’T KNOW',title:'3 things ChatGPT can do',body:'The third one can save you hours.',accent:'#8B5CF6'},
  {start:165,end:443,number:'01',kicker:'RESEARCH',title:'Turn a messy question into a plan.',body:'Compare options, spot gaps, and structure the next move.',accent:'#22C55E'},
  {start:443,end:638,number:'02',kicker:'UNDERSTAND',title:'Explain anything at your level.',body:'Turn difficult ideas into clear examples you can actually use.',accent:'#38BDF8'},
  {start:638,end:900,number:'03',kicker:'BUILD',title:'Turn an idea into a working draft.',body:'Code, scripts, checklists, workflows — start with the outcome.',accent:'#F59E0B'},
];

const Background = ({accent,frame}:{accent:string;frame:number}) => (
  <>
    <AbsoluteFill style={{background:'#07080B'}} />
    <div style={{position:'absolute',inset:0,background:`radial-gradient(circle at 72% 35%, ${accent}20, transparent 32%), radial-gradient(circle at 18% 85%, #38BDF812, transparent 30%)`}} />
    <svg width="1080" height="1920" style={{position:'absolute',inset:0,opacity:.22}}>
      <defs><pattern id="grid" width="72" height="72" patternUnits="userSpaceOnUse"><path d="M72 0H0V72" fill="none" stroke="white" strokeOpacity=".11" /></pattern></defs>
      <rect width="1080" height="1920" fill="url(#grid)" transform={`translate(${Math.sin(frame/90)*10} ${(frame%180)/2})`} />
    </svg>
    <div style={{position:'absolute',width:700,height:700,borderRadius:'50%',right:-390,top:280,background:accent,opacity:.055,filter:'blur(90px)',transform:`scale(${1+Math.sin(frame/35)*.04})`}} />
  </>
);

const Pill = ({x,y,text,accent,progress}:{x:number;y:number;text:string;accent:string;progress:number}) => (
  <g transform={`translate(${x} ${y})`} opacity={progress}>
    <rect width={text.length*12+46} height="48" rx="24" fill="#FFFFFF" fillOpacity=".055" stroke={accent} strokeOpacity=".5" />
    <circle cx="22" cy="24" r="5" fill={accent} />
    <text x="38" y="30" fill="white" fillOpacity=".78" fontSize="17" fontWeight="700" letterSpacing="1">{text}</text>
  </g>
);

const ResearchVisual = ({frame,accent}:{frame:number;accent:string}) => {
  const p=reveal(frame,180,250);
  const sweep=reveal(frame,220,315);
  const scan=220+Math.sin(frame/18)*8;
  return <svg width="470" height="650" viewBox="0 0 470 650" style={{position:'absolute',right:28,top:350,overflow:'visible'}}>
    <g transform={`translate(30 ${(1-p)*35})`}>
      <circle cx="210" cy="150" r="112" fill={accent} fillOpacity=".07" stroke={accent} strokeOpacity=".5" strokeWidth="2"/>
      <circle cx="210" cy="150" r="72" fill="none" stroke="white" strokeOpacity=".12" strokeWidth="1"/>
      <path d={`M292 232 L366 306`} stroke="white" strokeOpacity=".65" strokeWidth="13" strokeLinecap="round"/>
      <circle cx="210" cy="150" r={35+Math.sin(frame/12)*4} fill={accent} fillOpacity=".18" stroke={accent} strokeWidth="3"/>
      <text x="210" y="157" textAnchor="middle" fill="white" fontSize="22" fontWeight="800">QUESTION</text>
      <path d="M210 38V15M210 285V262M98 150H75M345 150H322" stroke={accent} strokeWidth="2" strokeOpacity=".65"/>
    </g>
    <g transform={`translate(0 ${(1-sweep)*22})`} opacity={sweep}>
      <path d="M45 350 C150 305 310 305 425 350" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="8 10"/>
      <Pill x={28} y={375} text="OPTIONS" accent={accent} progress={sweep}/>
      <Pill x={145} y={440} text="EVIDENCE" accent={accent} progress={clamp(sweep*1.15-.08)}/>
      <Pill x={270} y={505} text="GAPS" accent={accent} progress={clamp(sweep*1.25-.18)}/>
      <path d={`M50 585 Q235 ${scan} 420 585`} fill="none" stroke={accent} strokeWidth="2" opacity=".65"/>
      <circle cx="235" cy="585" r="9" fill={accent} />
      <text x="235" y="625" textAnchor="middle" fill="white" fillOpacity=".55" fontSize="15" letterSpacing="3">NEXT MOVE</text>
    </g>
  </svg>;
};

const ExplainVisual = ({frame,accent}:{frame:number;accent:string}) => {
  const p=reveal(frame,455,525);
  const q=reveal(frame,495,565);
  const orb=1+Math.sin(frame/18)*.035;
  return <svg width="470" height="650" viewBox="0 0 470 650" style={{position:'absolute',right:28,top:340,overflow:'visible'}}>
    <g transform={`translate(235 170) scale(${.86+.14*p})`}>
      <circle r="118" fill={accent} fillOpacity=".06" stroke={accent} strokeWidth="2" strokeOpacity=".7"/>
      <circle r={76*orb} fill="none" stroke="white" strokeOpacity=".12"/>
      <circle r="31" fill={accent} fillOpacity=".22"/>
      <text y="8" textAnchor="middle" fill="white" fontSize="19" fontWeight="900">IDEA</text>
      <g stroke={accent} strokeWidth="2" strokeOpacity=".7">
        <path d="M0 -76 L0 -150"/><path d="M66 38 L125 72"/><path d="M-66 38 L-125 72"/>
      </g>
    </g>
    <g opacity={q}>
      <rect x="45" y="330" width="380" height="84" rx="22" fill="#fff" fillOpacity=".045" stroke="#fff" strokeOpacity=".12"/>
      <text x="70" y="363" fill={accent} fontSize="14" fontWeight="800" letterSpacing="3">ABSTRACT</text>
      <text x="70" y="393" fill="white" fillOpacity=".75" fontSize="19">A difficult idea</text>
      <path d="M235 414V450" stroke={accent} strokeWidth="2" strokeDasharray="5 7"/>
      <rect x="45" y="468" width="380" height="118" rx="22" fill={accent} fillOpacity=".075" stroke={accent} strokeOpacity=".4"/>
      <text x="70" y="502" fill={accent} fontSize="14" fontWeight="800" letterSpacing="3">YOUR LEVEL</text>
      <text x="70" y="536" fill="white" fontSize="21" fontWeight="700">example → analogy → use</text>
      <path d="M92 559H378" stroke="white" strokeOpacity=".18"/>
      <circle cx="92" cy="559" r="5" fill={accent}/><circle cx="235" cy="559" r="5" fill={accent}/><circle cx="378" cy="559" r="5" fill={accent}/>
    </g>
  </svg>;
};

const BuildVisual = ({frame,accent}:{frame:number;accent:string}) => {
  const p=reveal(frame,650,720);
  const build=reveal(frame,700,820);
  const blocks=['IDEA','SCRIPT','LOGIC','DRAFT'];
  return <svg width="500" height="690" viewBox="0 0 500 690" style={{position:'absolute',right:8,top:330,overflow:'visible'}}>
    <g opacity={p} transform={`translate(0 ${(1-p)*30})`}>
      <rect x="35" y="30" width="430" height="560" rx="30" fill="#0B0D11" stroke="white" strokeOpacity=".12"/>
      <text x="65" y="75" fill="white" fillOpacity=".35" fontSize="14" fontWeight="800" letterSpacing="3">FROM OUTCOME TO OUTPUT</text>
      {blocks.map((b,i)=>{
        const yy=115+i*105;
        const bp=clamp(build*1.2-i*.2);
        return <g key={b} opacity={bp} transform={`translate(${(1-bp)*28} 0)`}>
          <rect x="65" y={yy} width="370" height="72" rx="18" fill={i===3?accent:'#FFFFFF'} fillOpacity={i===3?.13:.045} stroke={i===3?accent:'#FFFFFF'} strokeOpacity={i===3?.7:.12}/>
          <circle cx="92" cy={yy+36} r="13" fill={i===3?accent:'#fff'} fillOpacity={i===3?1:.18}/>
          <text x="120" y={yy+43} fill="white" fillOpacity={i===3?.95:.72} fontSize="19" fontWeight="800">{b}</text>
          {i<3 && <path d={`M250 ${yy+72}V${yy+105}`} stroke={accent} strokeWidth="2" strokeDasharray="5 7"/>}
        </g>
      })}
      <text x="250" y="635" textAnchor="middle" fill="white" fillOpacity=".38" fontSize="15" letterSpacing="3">THINK IN TRANSFORMATIONS</text>
    </g>
  </svg>;
};

const KineticTitle = ({text,frame,delay,size}:{text:string;frame:number;delay:number;size:number}) => (
  <div style={{display:'flex',flexWrap:'wrap',gap:'0 16px',fontSize:size,lineHeight:.98,fontWeight:900,letterSpacing:-2.8}}>
    {text.split(' ').map((word,i)=>{
      const p=reveal(frame,delay+i*3,delay+i*3+11);
      return <span key={word+i} style={{opacity:p,display:'inline-block',transform:`translate3d(0,${(1-p)*28}px,0) scale(${.96+.04*p})`}}>{word}</span>;
    })}
  </div>
);

export const Main:React.FC = () => {
  const frame=useCurrentFrame();
  const {fps}=useVideoConfig();
  const index=frame<165?0:frame<443?1:frame<638?2:3;
  const scene=scenes[index];
  const local=frame-scene.start;
  const enter=spring({frame:local,fps,config:{damping:150,stiffness:105,mass:.65}});
  const exit=interpolate(frame,[scene.end-14,scene.end],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  const opacity=enter*exit;
  const accent=scene.accent;
  const progress=frame/899*100;
  return <AbsoluteFill style={{background:'#07080B',color:'#fff',fontFamily:'Arial,Helvetica,sans-serif',overflow:'hidden'}}>
    <Audio src={staticFile('voice.wav')} volume={.96}/>
    <Background accent={accent} frame={frame}/>
    <div style={{position:'absolute',top:58,left:62,right:62,display:'flex',justifyContent:'space-between',alignItems:'center',opacity:.75}}>
      <div style={{fontSize:21,fontWeight:800,letterSpacing:4}}>REMOTIVE / VISUAL ENGINE</div>
      <div style={{fontSize:15,fontWeight:700,letterSpacing:3,opacity:.4}}>V9 PROTOTYPE</div>
    </div>
    <div style={{position:'absolute',left:62,top:295,width:54,height:54,borderRadius:27,border:`2px solid ${accent}`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 32px ${accent}55`,opacity}}>
      <span style={{fontSize:17,fontWeight:900}}>{scene.number}</span>
    </div>
    <div style={{position:'absolute',left:62,top:385,width:630,opacity,transform:`translateY(${(1-enter)*35}px)`}}>
      <div style={{fontSize:18,fontWeight:800,letterSpacing:4,opacity:.5,marginBottom:25}}>{scene.kicker}</div>
      <KineticTitle text={scene.title} frame={frame} delay={scene.start+7} size={index===0?76:63}/>
      <div style={{marginTop:30,maxWidth:610,fontSize:25,lineHeight:1.38,fontWeight:500,opacity:.62}}>{scene.body}</div>
      {index===0 && <div style={{marginTop:38,display:'flex',alignItems:'center',gap:13,fontSize:16,fontWeight:800,letterSpacing:3,opacity:.7}}>
        <span style={{width:44,height:44,borderRadius:22,border:'1px solid #ffffff66',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>↓</span>WATCH THE TRANSFORMATION
      </div>}
    </div>
    {index===1&&<ResearchVisual frame={frame} accent={accent}/>}
    {index===2&&<ExplainVisual frame={frame} accent={accent}/>}
    {index===3&&<BuildVisual frame={frame} accent={accent}/>}
    <div style={{position:'absolute',left:62,right:62,bottom:88,height:4,borderRadius:3,background:'#ffffff14'}}>
      <div style={{width:`${progress}%`,height:'100%',borderRadius:3,background:`linear-gradient(90deg,${accent},#fff)`}}/>
    </div>
    <div style={{position:'absolute',left:62,bottom:116,fontSize:13,letterSpacing:3,opacity:.28}}>IDEA → VISUAL → UNDERSTANDING</div>
    <div style={{position:'absolute',right:62,bottom:116,fontSize:13,letterSpacing:3,opacity:.28}}>30 SEC / 1080×1920</div>
  </AbsoluteFill>;
};
