import React from 'react';
import {AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

const scenes = [
  {start: 0, end: 180, kicker: 'MOST PEOPLE DON’T KNOW', title: ['3 things', 'ChatGPT can do'], sub: 'that feel almost like magic.'},
  {start: 180, end: 420, kicker: '01  •  RESEARCH', title: ['Turn a messy', 'question into a plan.'], sub: 'Compare options, find gaps, and structure the next steps.'},
  {start: 420, end: 660, kicker: '02  •  UNDERSTAND', title: ['Explain anything', 'at your level.'], sub: 'Give it a difficult idea. Then ask: explain it like I’m 12.'},
  {start: 660, end: 900, kicker: '03  •  BUILD', title: ['Turn an idea', 'into a working draft.'], sub: 'Code, scripts, checklists, workflows — start with the outcome.'},
];

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sceneIndex = frame < 180 ? 0 : frame < 420 ? 1 : frame < 660 ? 2 : 3;
  const scene = scenes[sceneIndex];
  const local = frame - scene.start;
  const enter = spring({frame: local, fps, config: {damping: 180, stiffness: 120, mass: 0.7}});
  const exit = interpolate(frame, [scene.end - 18, scene.end], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(enter, exit);
  const translateY = interpolate(enter, [0, 1], [90, 0]);
  const scale = interpolate(enter, [0, 1], [0.92, 1]);
  const progress = interpolate(frame, [0, 899], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const sceneProgress = interpolate(local, [0, scene.end - scene.start], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const number = sceneIndex === 0 ? '00' : '0' + sceneIndex;

  return (
    <AbsoluteFill style={{background: '#050505', color: '#fff', fontFamily: 'Arial, Helvetica, sans-serif', overflow: 'hidden'}}>
      <Audio src={staticFile('voice.wav')} volume={0.95} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 78% 18%, rgba(255,255,255,0.12), transparent 28%), radial-gradient(circle at 15% 80%, rgba(120,120,120,0.08), transparent 30%)'}} />
      <div style={{position: 'absolute', top: 82, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity}}>
        <div style={{fontSize: 28, fontWeight: 800, letterSpacing: 4}}>AI / 2026</div>
        <div style={{fontSize: 24, fontWeight: 700, letterSpacing: 2, opacity: 0.55}}>{number}</div>
      </div>
      <div style={{position: 'absolute', top: '38%', left: 72, right: 72, transform: 'translateY(' + translateY + 'px) scale(' + scale + ')', transformOrigin: 'left center', opacity}}>
        <div style={{fontSize: 27, fontWeight: 800, letterSpacing: 5, marginBottom: 30, opacity: 0.58}}>{scene.kicker}</div>
        <div style={{fontSize: sceneIndex === 0 ? 92 : 76, lineHeight: 1.02, fontWeight: 900, letterSpacing: -2, maxWidth: 930}}>
          {scene.title.map((line) => <div key={line}>{line}</div>)}
        </div>
        <div style={{marginTop: 42, maxWidth: 820, fontSize: 34, lineHeight: 1.35, fontWeight: 500, opacity: 0.66}}>{scene.sub}</div>
        {sceneIndex === 0 && (
          <div style={{marginTop: 54, display: 'inline-flex', alignItems: 'center', gap: 18}}>
            <div style={{width: 68, height: 68, borderRadius: 34, border: '2px solid rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28}}>→</div>
            <div style={{fontSize: 25, fontWeight: 700, letterSpacing: 2}}>WATCH TO THE END</div>
          </div>
        )}
      </div>
      {sceneIndex > 0 && (
        <div style={{position: 'absolute', right: 72, top: '38%', width: 150, height: 150, borderRadius: 75, border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: opacity * 0.9}}>
          <div style={{fontSize: 62, fontWeight: 900, opacity: 0.18}}>{number}</div>
        </div>
      )}
      <div style={{position: 'absolute', bottom: 88, left: 72, right: 72, height: 4, background: 'rgba(255,255,255,0.12)'}}>
        <div style={{width: progress + '%', height: '100%', background: '#fff'}} />
      </div>
      <div style={{position: 'absolute', bottom: 116, left: 72, width: 190, height: 2, background: 'rgba(255,255,255,0.16)', overflow: 'hidden'}}>
        <div style={{width: sceneProgress + '%', height: '100%', background: 'rgba(255,255,255,0.72)'}} />
      </div>
      <div style={{position: 'absolute', bottom: 112, right: 72, fontSize: 20, letterSpacing: 2, opacity: 0.42}}>REMOTIVE VIDEO STUDIO</div>
    </AbsoluteFill>
  );
};
