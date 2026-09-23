import React from 'react';
import {interpolate, Easing} from 'remotion';

export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const ease=(n:number)=>Easing.out(Easing.cubic)(clamp(n));
export const reveal=(f:number,a:number,b:number)=>ease((f-a)/(b-a));
export const slide=(f:number,a:number,b:number,d:number)=>interpolate(reveal(f,a,b),[0,1],[d,0]);

type VProps={frame:number; accent:string; progress:number};

const Glass=({children,x,y,w,h,accent}:{children:React.ReactNode;x:number;y:number;w:number;h:number;accent:string})=>(
  <g transform={`translate(${x} ${y})`}>
    <rect width={w} height={h} rx="28" fill="#0d1016" stroke="white" strokeOpacity=".12"/>
    <rect x="1" y="1" width={w-2} height={h-2} rx="27" fill="url(#glass)" opacity=".5"/>
    <circle cx="24" cy="24" r="5" fill={accent}/><circle cx="42" cy="24" r="5" fill="#fff" opacity=".16"/><circle cx="60" cy="24" r="5" fill="#fff" opacity=".08"/>
    {children}
  </g>
);

export const Definitions=()=>(
  <defs>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity=".08"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></linearGradient>
    <linearGradient id="screen" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#18212b"/><stop offset="1" stopColor="#0b0e13"/></linearGradient>
    <filter id="shadow"><feGaussianBlur stdDeviation="18"/></filter>
  </defs>
);

export const ResearchIllustration=({frame,accent,progress}:VProps)=>{
  const browser=reveal(frame,185,220), search=reveal(frame,215,270), cards=reveal(frame,255,345);
  return <svg width="600" height="760" viewBox="0 0 600 760" style={{position:'absolute',right:8,top:270,overflow:'visible'}}>
    <Definitions/>
    <ellipse cx="330" cy="690" rx="250" ry="32" fill={accent} opacity=".10" filter="url(#shadow)"/>
    <g opacity={browser} transform={`translate(0 ${(1-browser)*40}) rotate(-2 320 360)`}>
      <Glass x={30} y={30} w={520} h={420} accent={accent}>
        <rect x="24" y="58" width="472" height="54" rx="14" fill="#05070a" stroke="white" strokeOpacity=".08"/>
        <circle cx="52" cy="85" r="8" fill={accent}/><text x="75" y="91" fill="white" opacity=".48" fontSize="15">research / question</text>
        <rect x="38" y="138" width="438" height="72" rx="16" fill={accent} opacity=".10"/>
        <text x="58" y="168" fill="white" fontSize="17" fontWeight="800">WHAT SHOULD I CHOOSE?</text>
        <text x="58" y="192" fill="white" opacity=".42" fontSize="14">goal + constraints + evidence</text>
        <g opacity={search}>
          <rect x="38" y="230" width="130" height="150" rx="16" fill="#fff" opacity=".04"/>
          <rect x="185" y="230" width="130" height="150" rx="16" fill="#fff" opacity=".04"/>
          <rect x="332" y="230" width="144" height="150" rx="16" fill="#fff" opacity=".04"/>
          {[0,1,2].map(i=><g key={i}><rect x={52+i*147} y="248" width={90+(i===2?12:0)} height="8" rx="4" fill={accent} opacity=".7"/><rect x={52+i*147} y="270" width={72+(i*8)} height="6" rx="3" fill="#fff" opacity=".18"/><rect x={52+i*147} y="286" width={54+(i*14)} height="6" rx="3" fill="#fff" opacity=".10"/><circle cx={74+i*147} cy="342" r="14" fill={accent} opacity=".18"/><path d={`M68+i*147 342 l5 5 10 -12`} stroke={accent} strokeWidth="2" fill="none"/></g>)}
        </g>
      </Glass>
    </g>
    <g opacity={cards} transform={`translate(45 ${(1-cards)*30})`}>
      <path d="M250 450 C250 505 190 520 150 548" stroke={accent} strokeWidth="3" fill="none" strokeDasharray="8 10"/>
      <path d="M390 450 C390 505 430 520 465 548" stroke={accent} strokeWidth="3" fill="none" strokeDasharray="8 10"/>
      <rect x="50" y="540" width="190" height="115" rx="22" fill="#111722" stroke={accent} strokeOpacity=".5"/>
      <text x="70" y="575" fill={accent} fontSize="13" fontWeight="900" letterSpacing="2">EVIDENCE</text>
      <text x="70" y="606" fill="white" fontSize="17" fontWeight="700">sources</text><text x="70" y="630" fill="white" opacity=".38" fontSize="13">facts / tradeoffs</text>
      <rect x="300" y="540" width="190" height="115" rx="22" fill="#111722" stroke={accent} strokeOpacity=".5"/>
      <text x="320" y="575" fill={accent} fontSize="13" fontWeight="900" letterSpacing="2">PLAN</text>
      <text x="320" y="606" fill="white" fontSize="17" fontWeight="700">next move</text><text x="320" y="630" fill="white" opacity=".38" fontSize="13">ordered / actionable</text>
      <circle cx="270" cy="500" r="38" fill={accent} opacity=".15" stroke={accent} strokeWidth="2"/>
      <text x="270" y="507" textAnchor="middle" fill="white" fontSize="15" fontWeight="900">AI</text>
    </g>
  </svg>;
};

export const ExplainIllustration=({frame,accent,progress}:VProps)=>{
  const p=reveal(frame,455,510), q=reveal(frame,500,570), r=reveal(frame,540,620);
  return <svg width="600" height="760" viewBox="0 0 600 760" style={{position:'absolute',right:8,top:265,overflow:'visible'}}>
    <Definitions/>
    <ellipse cx="300" cy="690" rx="240" ry="30" fill={accent} opacity=".10" filter="url(#shadow)"/>
    <g opacity={p} transform={`translate(0 ${(1-p)*35})`}>
      <circle cx="300" cy="150" r="96" fill={accent} opacity=".10" stroke={accent} strokeWidth="3"/>
      <circle cx="300" cy="150" r="54" fill="#101722" stroke="white" strokeOpacity=".18"/>
      <text x="300" y="143" textAnchor="middle" fill="white" fontSize="17" fontWeight="900">HARD IDEA</text>
      <text x="300" y="168" textAnchor="middle" fill={accent} fontSize="13" fontWeight="800">abstract</text>
    </g>
    <g opacity={q} transform={`translate(0 ${(1-q)*25})`}>
      <path d="M300 250 C220 300 170 320 135 365" fill="none" stroke={accent} strokeWidth="3"/>
      <path d="M300 250 C380 300 430 320 465 365" fill="none" stroke={accent} strokeWidth="3"/>
      <rect x="38" y="365" width="194" height="205" rx="26" fill="#0d1118" stroke="white" strokeOpacity=".12"/>
      <text x="62" y="405" fill={accent} fontSize="13" fontWeight="900" letterSpacing="2">ANALOGY</text>
      <g transform="translate(72 440)">
        <rect x="0" y="55" width="120" height="20" rx="10" fill={accent} opacity=".7"/>
        <rect x="16" y="30" width="88" height="20" rx="10" fill="#fff" opacity=".18"/>
        <rect x="32" y="5" width="56" height="20" rx="10" fill="#fff" opacity=".28"/>
      </g>
      <text x="62" y="545" fill="white" opacity=".42" fontSize="13">build from familiar</text>
      <rect x="368" y="365" width="194" height="205" rx="26" fill="#0d1118" stroke="white" strokeOpacity=".12"/>
      <text x="392" y="405" fill={accent} fontSize="13" fontWeight="900" letterSpacing="2">EXAMPLE</text>
      <g transform="translate(395 440)">
        <rect width="140" height="72" rx="16" fill={accent} opacity=".10"/>
        <circle cx="28" cy="36" r="16" fill={accent} opacity=".8"/><path d="M23 36 l5 5 9 -11" stroke="#07100a" strokeWidth="3" fill="none"/>
        <text x="55" y="32" fill="white" fontSize="14" fontWeight="700">simple case</text><text x="55" y="51" fill="white" opacity=".4" fontSize="12">see it work</text>
      </g>
    </g>
    <g opacity={r}>
      <rect x="118" y="610" width="364" height="70" rx="24" fill={accent} opacity=".12" stroke={accent} strokeOpacity=".45"/>
      <text x="300" y="653" textAnchor="middle" fill="white" fontSize="18" fontWeight="800">NOW YOU CAN USE IT</text>
    </g>
  </svg>;
};

export const BuildIllustration=({frame,accent,progress}:VProps)=>{
  const laptop=reveal(frame,650,705), code=reveal(frame,690,780), output=reveal(frame,755,840);
  return <svg width="620" height="780" viewBox="0 0 620 780" style={{position:'absolute',right:-5,top:245,overflow:'visible'}}>
    <Definitions/>
    <ellipse cx="315" cy="720" rx="260" ry="35" fill={accent} opacity=".12" filter="url(#shadow)"/>
    <g opacity={laptop} transform={`translate(0 ${(1-laptop)*45})`}>
      <rect x="55" y="55" width="510" height="340" rx="28" fill="#10151d" stroke="white" strokeOpacity=".18" strokeWidth="3"/>
      <rect x="80" y="82" width="460" height="285" rx="15" fill="url(#screen)"/>
      <circle cx="105" cy="108" r="6" fill={accent}/><text x="122" y="113" fill="white" opacity=".35" fontSize="12">workspace</text>
      <g opacity={code}>
        {[0,1,2,3,4,5,6].map(i=><g key={i}><rect x="105" y={145+i*27} width={45+(i%3)*25} height="7" rx="3" fill={accent} opacity={.45+.06*(i%2)}/><rect x={165+(i%2)*20} y={145+i*27} width={150-(i%3)*20} height="7" rx="3" fill="#fff" opacity=".16"/><rect x={335-(i%2)*15} y={145+i*27} width={75+(i%3)*18} height="7" rx="3" fill="#fff" opacity=".09"/></g>)}
      </g>
      <path d="M25 430 Q310 470 595 430 L565 455 Q310 485 55 455 Z" fill="#171d27" stroke="white" strokeOpacity=".12"/>
      <rect x="270" y="444" width="80" height="8" rx="4" fill="#fff" opacity=".10"/>
    </g>
    <g opacity={output} transform={`translate(0 ${(1-output)*35})`}>
      <rect x="125" y="505" width="370" height="150" rx="28" fill="#0e131b" stroke={accent} strokeOpacity=".55" strokeWidth="2"/>
      <text x="155" y="545" fill={accent} fontSize="13" fontWeight="900" letterSpacing="2">OUTPUT</text>
      <rect x="155" y="565" width="125" height="52" rx="12" fill={accent} opacity=".18"/>
      <rect x="295" y="565" width="165" height="12" rx="6" fill="#fff" opacity=".14"/>
      <rect x="295" y="590" width="125" height="9" rx="4" fill="#fff" opacity=".08"/>
      <circle cx="175" cy="591" r="10" fill={accent}/><path d="M170 591 l4 4 8 -9" stroke="#07100a" strokeWidth="2.5" fill="none"/>
    </g>
    <g opacity={reveal(frame,805,865)}>
      <path d="M310 475 V505" stroke={accent} strokeWidth="3" strokeDasharray="7 8"/>
      <circle cx="310" cy="475" r="8" fill={accent}/>
    </g>
  </svg>;
};
