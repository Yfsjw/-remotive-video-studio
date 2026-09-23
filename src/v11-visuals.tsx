import React from 'react';
import {Easing} from 'remotion';

export const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export const ease=(n:number)=>Easing.out(Easing.cubic)(clamp(n));
export const reveal=(f:number,a:number,b:number)=>ease((f-a)/(b-a));

type Props={frame:number; accent:string; progress:number};

const Glow=({id,color}:{id:string;color:string})=>(
  <defs>
    <linearGradient id={id+"g"} x1="0" y1="0" x2="1" y2="1">
      <stop stopColor={color} stopOpacity=".95"/><stop offset="1" stopColor="#fff" stopOpacity=".18"/>
    </linearGradient>
    <radialGradient id={id+"r"}><stop stopColor={color} stopOpacity=".35"/><stop offset="1" stopColor={color} stopOpacity="0"/></radialGradient>
    <filter id={id+"b"}><feGaussianBlur stdDeviation="22"/></filter>
  </defs>
);

const Speckle=({frame,accent}:{frame:number;accent:string})=>(
  <g opacity=".28">
    {[...Array(18)].map((_,i)=>{
      const x=40+((i*137)%520), y=45+((i*83)%650);
      const s=1.5+(i%3);
      return <circle key={i} cx={x} cy={y} r={s} fill={accent} opacity={.18+(i%4)*.08}
        transform={`translate(${Math.sin(frame/55+i)*5} ${Math.cos(frame/61+i)*4})`}/>;
    })}
  </g>
);

const Orb=({x,y,r,accent,p}:{x:number;y:number;r:number;accent:string;p:number})=>(
  <g opacity={p}>
    <circle cx={x} cy={y} r={r*2.1} fill={accent} opacity=".06"/>
    <circle cx={x} cy={y} r={r} fill="#0b1018" stroke={accent} strokeWidth="2"/>
    <circle cx={x-r*.28} cy={y-r*.2} r={r*.24} fill="#fff" opacity=".12"/>
    <circle cx={x} cy={y} r={r*.56} fill={accent} opacity=".09"/>
  </g>
);

export const IntroAsset=({frame,accent,progress}:Props)=>{
  const a=reveal(frame,8,52), b=reveal(frame,28,78), c=reveal(frame,62,125);
  const spin=frame*.55;
  return <svg width="620" height="820" viewBox="0 0 620 820" style={{position:'absolute',right:-5,top:220,overflow:'visible'}}>
    <Glow id="intro" color={accent}/>
    <ellipse cx="320" cy="430" rx="280" ry="280" fill="url(#intror)" filter="url(#introb)"/>
    <Speckle frame={frame} accent={accent}/>
    <g transform={`translate(310 385) rotate(${spin})`} opacity={a}>
      <ellipse rx="235" ry="95" fill="none" stroke={accent} strokeWidth="2" strokeDasharray="10 14" opacity=".5"/>
      <ellipse rx="235" ry="95" fill="none" stroke="#fff" strokeOpacity=".14" transform="rotate(60)"/>
      <circle cx="235" cy="0" r="9" fill={accent}/>
      <circle cx="-235" cy="0" r="6" fill="#fff" opacity=".5"/>
    </g>
    <g opacity={b} transform={`translate(310 385) scale(${.82+.18*b})`}>
      <circle r="105" fill={`url(#introg)`} opacity=".22"/>
      <circle r="78" fill="#0b1119" stroke={accent} strokeWidth="3"/>
      <path d="M-34 12 C-12 -44 20 -42 38 -5 C54 28 22 55 -2 29 C-23 8 -53 29 -34 58" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" opacity=".9"/>
      <circle cx="-25" cy="-30" r="8" fill={accent}/><circle cx="35" cy="24" r="6" fill={accent} opacity=".65"/>
    </g>
    <g opacity={c}>
      <path d="M310 500 C240 545 165 560 95 625" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="7 10"/>
      <path d="M310 500 C380 545 455 560 525 625" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="7 10"/>
      <Orb x={90} y={655} r={42} accent={accent} p={c}/><Orb x={530} y={655} r={42} accent={accent} p={c}/>
      <text x="90" y="661" textAnchor="middle" fill="white" fontSize="13" fontWeight="900">RESEARCH</text>
      <text x="530" y="661" textAnchor="middle" fill="white" fontSize="13" fontWeight="900">BUILD</text>
    </g>
  </svg>;
};

export const ResearchAsset=({frame,accent,progress}:Props)=>{
  const a=reveal(frame,175,215), b=reveal(frame,205,270), c=reveal(frame,250,335), d=reveal(frame,305,405);
  return <svg width="650" height="820" viewBox="0 0 650 820" style={{position:'absolute',right:-10,top:220,overflow:'visible'}}>
    <Glow id="research" color={accent}/>
    <ellipse cx="330" cy="700" rx="280" ry="48" fill="url(#researchr)" opacity=".5" filter="url(#researchb)"/>
    <g opacity={a} transform={`translate(0 ${(1-a)*35}) rotate(-3 330 360)`}>
      <path d="M55 120 Q330 70 595 120 L560 555 Q330 600 90 555 Z" fill="#111722" stroke="white" strokeOpacity=".15" strokeWidth="3"/>
      <path d="M70 155 Q330 115 575 155" stroke={accent} strokeWidth="3" opacity=".5"/>
      <g opacity={b}>
        <path d="M105 215 C165 185 225 250 285 220 S405 180 470 225 S535 250 555 215" fill="none" stroke="#fff" strokeOpacity=".22" strokeWidth="4"/>
        <path d="M105 275 C165 245 225 310 285 280 S405 240 470 285 S535 310 555 275" fill="none" stroke="#fff" strokeOpacity=".11" strokeWidth="4"/>
        <rect x="105" y="335" width="420" height="105" rx="20" fill={accent} opacity=".08"/>
        {[0,1,2,3].map(i=><rect key={i} x={130+i*92} y={365-(i%2)*14} width="58" height={16+(i%2)*28} rx="8" fill={accent} opacity={.42-.05*i}/>)}
      </g>
    </g>
    <g opacity={c} transform={`translate(${(1-c)*18} 0)`}>
      <circle cx="170" cy="470" r="90" fill="#0a0f16" stroke={accent} strokeWidth="3"/>
      <circle cx="170" cy="470" r="55" fill="none" stroke="white" strokeOpacity=".22" strokeWidth="12"/>
      <line x1="235" y1="535" x2="315" y2="615" stroke={accent} strokeWidth="18" strokeLinecap="round"/>
      <circle cx="170" cy="470" r="22" fill={accent} opacity=".35"/>
      <path d="M135 475 l24 20 45 -55" fill="none" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
    </g>
    <g opacity={d}>
      <path d="M330 555 C390 520 455 535 505 575" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="9 9"/>
      <path d="M505 575 l-18 -4 l9 16" fill="none" stroke={accent} strokeWidth="3"/>
      <g transform="translate(350 585)">
        <path d="M0 70 L70 0 L250 30 L180 105 Z" fill="#111923" stroke={accent} strokeOpacity=".55"/>
        <path d="M70 0 L70 68 L250 100 L250 30" fill="#0b1119" stroke="white" strokeOpacity=".1"/>
        <text x="112" y="54" fill="white" fontSize="15" fontWeight="900">NEXT MOVE</text>
        <text x="112" y="76" fill={accent} fontSize="11" fontWeight="800">evidence → decision</text>
      </g>
    </g>
  </svg>;
};

export const UnderstandAsset=({frame,accent,progress}:Props)=>{
  const a=reveal(frame,450,490), b=reveal(frame,485,545), c=reveal(frame,535,605), d=reveal(frame,590,630);
  const rot=frame*.18;
  return <svg width="650" height="820" viewBox="0 0 650 820" style={{position:'absolute',right:-5,top:215,overflow:'visible'}}>
    <Glow id="understand" color={accent}/>
    <ellipse cx="330" cy="680" rx="270" ry="55" fill="url(#understandr)" filter="url(#understandb)"/>
    <g opacity={a} transform={`translate(325 160) rotate(${rot})`}>
      {[0,1,2,3,4,5].map(i=>{
        const ang=i*Math.PI/3, x=Math.cos(ang)*120, y=Math.sin(ang)*120;
        return <g key={i}><circle cx={x} cy={y} r="38" fill="#0d131d" stroke={accent} strokeWidth="2"/><circle cx={x} cy={y} r="10" fill={accent} opacity=".55"/></g>;
      })}
      <circle r="72" fill="#0b1018" stroke="white" strokeOpacity=".2" strokeWidth="3"/>
      <path d="M-32 0 C-8 -48 34 -40 42 -8 C48 23 10 42 -17 21 C-35 7 -55 26 -37 49" fill="none" stroke="white" strokeWidth="7"/>
    </g>
    <g opacity={b}>
      <path d="M325 285 C240 330 175 345 120 405" fill="none" stroke={accent} strokeWidth="3"/>
      <path d="M325 285 C410 330 475 345 530 405" fill="none" stroke={accent} strokeWidth="3"/>
      <g transform={`translate(40 390) scale(${.9+.1*b})`}>
        <circle cx="85" cy="85" r="78" fill="#0b1118" stroke="white" strokeOpacity=".14"/>
        <rect x="35" y="100" width="100" height="16" rx="8" fill={accent} opacity=".65"/>
        <rect x="50" y="77" width="70" height="16" rx="8" fill="white" opacity=".18"/>
        <rect x="65" y="54" width="40" height="16" rx="8" fill="white" opacity=".28"/>
        <text x="85" y="150" textAnchor="middle" fill={accent} fontSize="12" fontWeight="900">ANALOGY</text>
      </g>
      <g transform={`translate(405 390) scale(${.9+.1*b})`}>
        <circle cx="85" cy="85" r="78" fill="#0b1118" stroke="white" strokeOpacity=".14"/>
        <rect x="35" y="50" width="100" height="70" rx="15" fill={accent} opacity=".12"/>
        <circle cx="62" cy="85" r="17" fill={accent}/><path d="M56 85 l6 6 12 -14" fill="none" stroke="#06100a" strokeWidth="3"/>
        <text x="85" y="150" textAnchor="middle" fill={accent} fontSize="12" fontWeight="900">EXAMPLE</text>
      </g>
    </g>
    <g opacity={c} transform={`translate(0 ${(1-c)*20})`}>
      <path d="M120 555 C220 505 425 505 530 555" fill="none" stroke={accent} strokeWidth="3" strokeDasharray="8 9"/>
      <g transform="translate(150 545)">
        <rect width="360" height="115" rx="28" fill="#0e151e" stroke={accent} strokeOpacity=".6"/>
        <circle cx="52" cy="57" r="25" fill={accent} opacity=".16" stroke={accent}/>
        <path d="M40 58 l9 9 18 -22" fill="none" stroke="white" strokeWidth="4"/>
        <text x="95" y="52" fill="white" fontSize="18" fontWeight="900">MAKE IT USABLE</text>
        <text x="95" y="76" fill={accent} fontSize="12" fontWeight="800">abstract → concrete → action</text>
      </g>
    </g>
    <g opacity={d}><circle cx="325" cy="715" r="9" fill={accent}/><circle cx="325" cy="715" r="28" fill="none" stroke={accent} strokeOpacity=".25"/></g>
  </svg>;
};

export const BuildAsset=({frame,accent,progress}:Props)=>{
  const a=reveal(frame,645,690), b=reveal(frame,680,755), c=reveal(frame,735,815);
  return <svg width="670" height="830" viewBox="0 0 670 830" style={{position:'absolute',right:-20,top:205,overflow:'visible'}}>
    <Glow id="build" color={accent}/>
    <ellipse cx="330" cy="720" rx="290" ry="55" fill="url(#buildr)" filter="url(#buildb)"/>
    <g opacity={a} transform={`translate(0 ${(1-a)*45})`}>
      <path d="M55 110 Q335 45 615 110 L585 470 Q335 535 85 470 Z" fill="#0f151e" stroke="white" strokeOpacity=".2" strokeWidth="3"/>
      <path d="M82 145 Q335 92 588 145 L562 430 Q335 480 108 430 Z" fill="#080d13"/>
      <g opacity={b}>
        {[0,1,2,3,4,5,6,7].map(i=><g key={i}>
          <rect x={115+(i%2)*24} y={180+i*27} width={48+(i%4)*16} height="7" rx="3" fill={accent} opacity=".5"/>
          <rect x={190+(i%3)*20} y={180+i*27} width={110-(i%3)*14} height="7" rx="3" fill="#fff" opacity=".18"/>
          <rect x={325-(i%2)*12} y={180+i*27} width={150+(i%3)*18} height="7" rx="3" fill="#fff" opacity=".08"/>
        </g>)}
      </g>
      <path d="M25 490 Q335 550 645 490 L600 530 Q335 585 70 530 Z" fill="#161d27" stroke="white" strokeOpacity=".14"/>
      <rect x="285" y="515" width="100" height="9" rx="5" fill="white" opacity=".1"/>
    </g>
    <g opacity={c} transform={`translate(0 ${(1-c)*35})`}>
      <path d="M335 560 V610" stroke={accent} strokeWidth="4" strokeDasharray="8 8"/>
      <circle cx="335" cy="590" r="8" fill={accent}/>
      <g transform="translate(105 610)">
        <rect width="460" height="125" rx="30" fill="#0d141d" stroke={accent} strokeWidth="2"/>
        <rect x="26" y="25" width="105" height="75" rx="16" fill={accent} opacity=".16"/>
        <circle cx="60" cy="62" r="17" fill={accent}/><path d="M53 62 l7 7 13 -16" fill="none" stroke="#06100a" strokeWidth="3"/>
        <rect x="160" y="32" width="245" height="12" rx="6" fill="white" opacity=".15"/>
        <rect x="160" y="57" width="190" height="9" rx="4" fill="white" opacity=".09"/>
        <rect x="160" y="79" width="140" height="9" rx="4" fill={accent} opacity=".5"/>
        <text x="26" y="112" fill={accent} fontSize="11" fontWeight="900" letterSpacing="2">SCRIPT / CODE / CHECKLIST / DRAFT</text>
      </g>
    </g>
  </svg>;
};
