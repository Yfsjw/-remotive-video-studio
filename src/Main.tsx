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

type Scene = {
  start: number;
  end: number;
  number: string;
  kicker: string;
  title: string;
  body: string;
  accent: string;
};

const scenes: Scene[] = [
  {
    start: 0,
    end: 165,
    number: '00',
    kicker: 'MOST PEOPLE DON’T KNOW',
    title: '3 things ChatGPT can do',
    body: 'The third one can save you hours.',
    accent: '#8B5CF6',
  },
  {
    start: 165,
    end: 443,
    number: '01',
    kicker: 'RESEARCH',
    title: 'Turn a messy question into a plan.',
    body: 'Compare options, spot gaps, and structure the next move.',
    accent: '#22C55E',
  },
  {
    start: 443,
    end: 638,
    number: '02',
    kicker: 'UNDERSTAND',
    title: 'Explain anything at your level.',
    body: 'Turn difficult ideas into clear examples you can actually use.',
    accent: '#38BDF8',
  },
  {
    start: 638,
    end: 900,
    number: '03',
    kicker: 'BUILD',
    title: 'Turn an idea into a working draft.',
    body: 'Code, scripts, checklists, workflows — start with the outcome.',
    accent: '#F59E0B',
  },
];

const words = (text: string) => text.split(' ');
const clamp = (value: number) => Math.max(0, Math.min(1, value));

const Background = ({accent, frame}: {accent: string; frame: number}) => {
  const driftX = Math.sin(frame / 38) * 18;
  const driftY = Math.cos(frame / 51) * 14;
  const pulse = 0.86 + Math.sin(frame / 24) * 0.1;

  return (
    <>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 78% 10%, rgba(139,92,246,0.22), transparent 28%), radial-gradient(circle at 14% 82%, rgba(56,189,248,0.12), transparent 31%), #07070A',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 980,
          height: 980,
          borderRadius: '50%',
          right: -470 + driftX,
          top: -470 + driftY,
          background: accent,
          opacity: 0.09 * pulse,
          filter: 'blur(75px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: -40,
          opacity: 0.065,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          transform: `translate3d(${Math.sin(frame / 90) * 12}px, ${(frame % 180) / 2}px, 0)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -140 + Math.sin(frame / 57) * 24,
          bottom: 180 + Math.cos(frame / 43) * 20,
          width: 280,
          height: 280,
          borderRadius: '50%',
          border: `1px solid ${accent}33`,
          boxShadow: `0 0 100px ${accent}18`,
          transform: `scale(${0.92 + Math.sin(frame / 31) * 0.04})`,
        }}
      />
    </>
  );
};

const KineticWords = ({
  text,
  frame,
  delay = 0,
  size,
}: {
  text: string;
  frame: number;
  delay?: number;
  size: number;
}) => {
  const list = words(text);
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0 18px',
        maxWidth: 940,
        fontSize: size,
        lineHeight: 1.0,
        fontWeight: 900,
        letterSpacing: -2.5,
      }}
    >
      {list.map((word, i) => {
        const p = clamp((frame - delay - i * 3) / 10);
        const y = interpolate(p, [0, 1], [30, 0], {easing: Easing.out(Easing.cubic)});
        const scale = interpolate(p, [0, 1], [0.96, 1]);
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translate3d(0,${y}px,0) scale(${scale})`,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};

const ResearchVisual = ({frame}: {frame: number}) => {
  const progress = interpolate(frame, [170, 235], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rows = ['Question', 'Options', 'Gaps', 'Next steps'];
  const lift = Math.sin((frame - 165) / 22) * 7;
  return (
    <div style={{position: 'absolute', right: 54, top: 360, width: 380, transform: `translate3d(0,${lift}px,0)`}}>
      <div style={{border: '1px solid rgba(255,255,255,.14)', borderRadius: 28, padding: 24, background: 'rgba(255,255,255,.05)', boxShadow: '0 24px 80px rgba(0,0,0,.4)'}}>
        <div style={{fontSize: 18, letterSpacing: 3, opacity: .45, marginBottom: 22}}>RESEARCH FLOW</div>
        {rows.map((row, i) => {
          const p = clamp(progress * 1.35 - i * .22);
          return (
            <div key={row} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, opacity: .35 + p * .65, transform: `translateX(${(1-p) * 18}px)`}}>
              <div style={{width: 12, height: 12, borderRadius: 6, background: i === 0 ? '#22C55E' : 'rgba(255,255,255,.5)', boxShadow: i === 0 ? '0 0 22px rgba(34,197,94,.8)' : 'none'}} />
              <div style={{height: 10, flex: 1, borderRadius: 8, background: 'rgba(255,255,255,.09)', overflow: 'hidden'}}>
                <div style={{width: `${55 + i * 9}%`, height: '100%', transform: `scaleX(${p})`, transformOrigin: 'left', background: 'rgba(255,255,255,.72)'}} />
              </div>
              <div style={{fontSize: 16, width: 88, opacity: .75}}>{row}</div>
            </div>
          );
        })}
        <div style={{marginTop: 8, fontSize: 14, letterSpacing: 2.5, opacity: .35}}>QUESTION → EVIDENCE → ACTION</div>
      </div>
    </div>
  );
};

const ExplainVisual = ({frame}: {frame: number}) => {
  const r = interpolate(frame, [455, 520], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const orbit = Math.sin((frame - 443) / 25) * 9;
  return (
    <div style={{position: 'absolute', right: 48, top: 360, width: 400, height: 450, transform: `translateY(${orbit}px)`}}>
      <div style={{position: 'absolute', left: 92, top: 0, width: 220, height: 220, borderRadius: 110, border: '1px solid rgba(56,189,248,.35)', background: 'rgba(56,189,248,.07)', transform: `scale(${.9 + r * .1}) rotate(${r * 8}deg)`, boxShadow: '0 0 90px rgba(56,189,248,.14)'}} />
      <div style={{position: 'absolute', left: 125, top: 78, fontSize: 34, fontWeight: 900}}>IDEA</div>
      {['simple', 'clear', 'your level'].map((t, i) => {
        const p = clamp(r * 1.25 - i * .25);
        return (
          <div key={t} style={{position: 'absolute', left: 10 + i * 55, top: 260 + i * 42, width: 300 - i * 60, padding: '15px 20px', borderRadius: 18, background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.11)', opacity: p, transform: `translate3d(${(1-p)*35}px,0,0) scale(${.97+p*.03})`}}>
            <span style={{opacity:.55, marginRight:10}}>0{i+1}</span>{t}
          </div>
        );
      })}
    </div>
  );
};

const BuildVisual = ({frame}: {frame: number}) => {
  const reveal = clamp((frame - 650) / 48);
  const lines = ['const idea = input;', 'plan(idea);', 'build(draft);', 'ship(result);'];
  const pulse = 0.96 + Math.sin((frame - 638) / 18) * 0.025;
  return (
    <div style={{position: 'absolute', right: 40, top: 350, width: 420, borderRadius: 26, overflow: 'hidden', border: '1px solid rgba(255,255,255,.13)', background: '#0C0D10', boxShadow: '0 30px 90px rgba(0,0,0,.5)', opacity: reveal, transform: `translate3d(0,${(1-reveal)*45}px,0) scale(${pulse})`}}>
      <div style={{height: 54, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,.08)'}}>
        <i style={{width:10,height:10,borderRadius:5,background:'#F59E0B'}} />
        <i style={{width:10,height:10,borderRadius:5,background:'#38BDF8'}} />
        <i style={{width:10,height:10,borderRadius:5,background:'#22C55E'}} />
        <span style={{marginLeft:12,fontSize:15,opacity:.4}}>draft.ts</span>
      </div>
      <div style={{padding: 24, fontFamily: 'monospace', fontSize: 20, lineHeight: 1.8}}>
        {lines.map((line, i) => {
          const p = clamp(reveal * 1.5 - i * .18);
          return <div key={line} style={{opacity:p, transform:`translateX(${(1-p)*18}px)`}}><span style={{opacity:.25,marginRight:18}}>0{i+1}</span>{line}</div>;
        })}
      </div>
      <div style={{height: 4, background: 'rgba(255,255,255,.07)'}}>
        <div style={{height:'100%', width:`${clamp((frame-690)/100)*100}%`, background:'#F59E0B'}} />
      </div>
    </div>
  );
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneIndex = frame < 165 ? 0 : frame < 443 ? 1 : frame < 638 ? 2 : 3;
  const scene = scenes[sceneIndex];
  const local = frame - scene.start;
  const enter = spring({frame: local, fps, config: {damping: 150, stiffness: 110, mass: .65}});
  const exit = interpolate(frame, [scene.end - 12, scene.end], [1, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const opacity = enter * exit;
  const scenePulse = 1 + Math.sin(local / 34) * 0.012;
  const progress = interpolate(frame, [0, 899], [0, 100], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const accent = scene.accent;

  return (
    <AbsoluteFill style={{background:'#07070A', color:'#fff', fontFamily:'Arial, Helvetica, sans-serif', overflow:'hidden'}}>
      <Audio src={staticFile('voice.wav')} volume={0.96} />
      <Background accent={accent} frame={frame} />

      <div style={{position:'absolute', top:66, left:64, right:64, display:'flex', justifyContent:'space-between', alignItems:'center', opacity:.82}}>
        <div style={{fontSize:22,fontWeight:800,letterSpacing:4}}>REMOTIVE / STUDIO</div>
        <div style={{fontSize:18,fontWeight:700,letterSpacing:3,opacity:.42}}>AI / 2026</div>
      </div>

      <div style={{position:'absolute', left:64, top:292, width:70, height:70, borderRadius:35, border:`2px solid ${accent}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 35px ${accent}55`, opacity, transform:`scale(${scenePulse})`}}>
        <span style={{fontSize:20,fontWeight:900}}>{scene.number}</span>
      </div>

      <div style={{position:'absolute', left:64, top:412, width:650, opacity, transform:`translate3d(0,${interpolate(enter,[0,1],[42,0])}px,0) scale(${scenePulse})`, transformOrigin:'left center'}}>
        <div style={{fontSize:21,fontWeight:800,letterSpacing:5,opacity:.52,marginBottom:28}}>{scene.kicker}</div>
        <KineticWords text={scene.title} frame={frame} delay={scene.start + 5} size={sceneIndex === 0 ? 78 : 66} />
        <div style={{marginTop:34,maxWidth:620,fontSize:27,lineHeight:1.35,fontWeight:500,opacity:.64}}>{scene.body}</div>
        {sceneIndex === 0 && <div style={{marginTop:42,display:'flex',alignItems:'center',gap:14,fontSize:19,fontWeight:800,letterSpacing:3,opacity:.8}}>
          <span style={{width:48,height:48,borderRadius:24,border:'1px solid rgba(255,255,255,.45)',display:'inline-flex',alignItems:'center',justifyContent:'center',transform:`translateY(${Math.sin(frame/12)*4}px)`}}>↓</span>
          WATCH TO THE END
        </div>}
      </div>

      {sceneIndex === 1 && <ResearchVisual frame={frame} />}
      {sceneIndex === 2 && <ExplainVisual frame={frame} />}
      {sceneIndex === 3 && <BuildVisual frame={frame} />}

      <div style={{position:'absolute',left:64,right:64,bottom:92,height:5,borderRadius:3,background:'rgba(255,255,255,.10)'}}>
        <div style={{width:`${progress}%`,height:'100%',borderRadius:3,background:`linear-gradient(90deg,${accent},#fff)`}} />
      </div>
      <div style={{position:'absolute',left:64,bottom:122,fontSize:15,letterSpacing:3,opacity:.32}}>3 IDEAS / 30 SEC</div>
      <div style={{position:'absolute',right:64,bottom:122,fontSize:15,letterSpacing:3,opacity:.32}}>KEEP WATCHING</div>
    </AbsoluteFill>
  );
};
