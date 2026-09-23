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
    end: 180,
    number: '00',
    kicker: 'MOST PEOPLE DON’T KNOW',
    title: '3 things ChatGPT can do',
    body: 'that feel almost like magic.',
    accent: '#8B5CF6',
  },
  {
    start: 180,
    end: 420,
    number: '01',
    kicker: 'RESEARCH',
    title: 'Turn a messy question into a plan.',
    body: 'Compare options, find gaps, and structure the next steps.',
    accent: '#22C55E',
  },
  {
    start: 420,
    end: 660,
    number: '02',
    kicker: 'UNDERSTAND',
    title: 'Explain anything at your level.',
    body: 'Give it a difficult idea. Then ask it to explain that idea at your level.',
    accent: '#38BDF8',
  },
  {
    start: 660,
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
  const drift = Math.sin(frame / 42) * 2;
  const pulse = 0.85 + Math.sin(frame / 28) * 0.08;
  return (
    <>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 80% 12%, rgba(139,92,246,0.20), transparent 27%), radial-gradient(circle at 12% 82%, rgba(56,189,248,0.11), transparent 30%), #07070A',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          right: -420 + drift,
          top: -420,
          background: accent,
          opacity: 0.08 * pulse,
          filter: 'blur(70px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.07,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.16) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          transform: `translateY(${(frame % 144) / 2}px)`,
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
        const y = interpolate(p, [0, 1], [28, 0], {easing: Easing.out(Easing.cubic)});
        return (
          <span
            key={`${word}-${i}`}
            style={{
              display: 'inline-block',
              opacity: p,
              transform: `translateY(${y}px)`,
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
  const progress = interpolate(frame, [185, 245], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const rows = ['Question', 'Options', 'Gaps', 'Next steps'];
  return (
    <div style={{position: 'absolute', right: 64, top: 380, width: 360}}>
      <div style={{border: '1px solid rgba(255,255,255,.14)', borderRadius: 28, padding: 24, background: 'rgba(255,255,255,.045)', boxShadow: '0 24px 80px rgba(0,0,0,.35)'}}>
        <div style={{fontSize: 18, letterSpacing: 3, opacity: .45, marginBottom: 22}}>RESEARCH FLOW</div>
        {rows.map((row, i) => {
          const p = clamp(progress * 1.35 - i * .22);
          return (
            <div key={row} style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, opacity: .35 + p * .65}}>
              <div style={{width: 12, height: 12, borderRadius: 6, background: i === 0 ? '#22C55E' : 'rgba(255,255,255,.5)', boxShadow: i === 0 ? '0 0 22px rgba(34,197,94,.8)' : 'none'}} />
              <div style={{height: 10, flex: 1, borderRadius: 8, background: 'rgba(255,255,255,.09)', overflow: 'hidden'}}>
                <div style={{width: `${55 + i * 9}%`, height: '100%', transform: `scaleX(${p})`, transformOrigin: 'left', background: 'rgba(255,255,255,.72)'}} />
              </div>
              <div style={{fontSize: 16, width: 88, opacity: .75}}>{row}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ExplainVisual = ({frame}: {frame: number}) => {
  const r = interpolate(frame, [430, 500], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', right: 54, top: 390, width: 380, height: 420}}>
      <div style={{position: 'absolute', left: 95, top: 0, width: 210, height: 210, borderRadius: 105, border: '1px solid rgba(56,189,248,.35)', background: 'rgba(56,189,248,.07)', transform: `scale(${.92 + r * .08})`, boxShadow: '0 0 80px rgba(56,189,248,.12)'}} />
      <div style={{position: 'absolute', left: 125, top: 72, fontSize: 34, fontWeight: 900}}>IDEA</div>
      {['simple', 'clear', 'your level'].map((t, i) => {
        const p = clamp(r * 1.25 - i * .25);
        return <div key={t} style={{position: 'absolute', left: 10 + i * 55, top: 255 + i * 42, width: 300 - i * 60, padding: '15px 20px', borderRadius: 18, background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.11)', opacity: p, transform: `translateX(${(1-p)*35}px)`}}><span style={{opacity:.55, marginRight:10}}>0{i+1}</span>{t}</div>;
      })}
    </div>
  );
};

const BuildVisual = ({frame}: {frame: number}) => {
  const reveal = clamp((frame - 675) / 55);
  const lines = ['const idea = input;', 'plan(idea);', 'build(draft);', 'ship(result);'];
  return (
    <div style={{position: 'absolute', right: 46, top: 385, width: 410, borderRadius: 26, overflow: 'hidden', border: '1px solid rgba(255,255,255,.13)', background: '#0C0D10', boxShadow: '0 30px 90px rgba(0,0,0,.5)', opacity: reveal}}>
      <div style={{height: 54, display: 'flex', alignItems: 'center', gap: 9, padding: '0 20px', borderBottom: '1px solid rgba(255,255,255,.08)'}}>
        <i style={{width:10,height:10,borderRadius:5,background:'#F59E0B'}} />
        <i style={{width:10,height:10,borderRadius:5,background:'#38BDF8'}} />
        <i style={{width:10,height:10,borderRadius:5,background:'#22C55E'}} />
        <span style={{marginLeft:12,fontSize:15,opacity:.4}}>draft.ts</span>
      </div>
      <div style={{padding: 24, fontFamily: 'monospace', fontSize: 20, lineHeight: 1.8}}>
        {lines.map((line, i) => <div key={line} style={{opacity: clamp(reveal * 1.5 - i * .18), transform: `translateX(${(1-clamp(reveal * 1.5 - i * .18))*18}px)`}}><span style={{opacity:.25,marginRight:18}}>0{i+1}</span>{line}</div>)}
      </div>
    </div>
  );
};

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneIndex = frame < 180 ? 0 : frame < 420 ? 1 : frame < 660 ? 2 : 3;
  const scene = scenes[sceneIndex];
  const local = frame - scene.start;
  const enter = spring({frame: local, fps, config: {damping: 150, stiffness: 110, mass: .65}});
  const exit = interpolate(frame, [scene.end - 14, scene.end], [1, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const opacity = enter * exit;
  const progress = interpolate(frame, [0, 899], [0, 100], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const accent = scene.accent;

  return (
    <AbsoluteFill style={{background:'#07070A', color:'#fff', fontFamily:'Arial, Helvetica, sans-serif', overflow:'hidden'}}>
      <Audio src={staticFile('voice.wav')} volume={0.96} />
      <Background accent={accent} frame={frame} />

      <div style={{position:'absolute', top:74, left:64, right:64, display:'flex', justifyContent:'space-between', alignItems:'center', opacity:.82}}>
        <div style={{fontSize:22,fontWeight:800,letterSpacing:4}}>REMOTIVE / STUDIO</div>
        <div style={{fontSize:18,fontWeight:700,letterSpacing:3,opacity:.42}}>AI / 2026</div>
      </div>

      <div style={{position:'absolute', left:64, top:300, width:70, height:70, borderRadius:35, border:`2px solid ${accent}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 35px ${accent}55`, opacity}}>
        <span style={{fontSize:20,fontWeight:900}}>{scene.number}</span>
      </div>

      <div style={{position:'absolute', left:64, top:420, width:650, opacity, transform:`translateY(${interpolate(enter,[0,1],[42,0])}px)`}}>
        <div style={{fontSize:21,fontWeight:800,letterSpacing:5,opacity:.52,marginBottom:28}}>{scene.kicker}</div>
        <KineticWords text={scene.title} frame={frame} delay={scene.start + 5} size={sceneIndex === 0 ? 78 : 68} />
        <div style={{marginTop:34,maxWidth:620,fontSize:27,lineHeight:1.35,fontWeight:500,opacity:.64}}>{scene.body}</div>
        {sceneIndex === 0 && <div style={{marginTop:44,display:'flex',alignItems:'center',gap:14,fontSize:19,fontWeight:800,letterSpacing:3,opacity:.8}}><span style={{width:48,height:48,borderRadius:24,border:'1px solid rgba(255,255,255,.45)',display:'inline-flex',alignItems:'center',justifyContent:'center'}}>↓</span> WATCH TO THE END</div>}
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
