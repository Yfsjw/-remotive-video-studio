import React from 'react';
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from 'remotion';

type Shot = {
  src: string;
  from: number;
  duration: number;
  trim: number;
  caption: string;
  label?: string;
  cropX?: string;
  scale?: number;
};

const shots: Shot[] = [
  {src:'media/typing.mp4', from:0, duration:72, trim:0.2, caption:'Most AI videos explain the idea.\nThey rarely show it.', label:'THE PROBLEM', cropX:'50%', scale:1.08},
  {src:'media/coffee.mp4', from:72, duration:63, trim:1.0, caption:'The fix is simple: edit in shots, not slides.', label:'A DIFFERENT MODEL', cropX:'50%', scale:1.12},
  {src:'media/city.mp4', from:135, duration:72, trim:2.0, caption:'Start with the narration.', label:'01  NARRATION', cropX:'50%', scale:1.05},
  {src:'media/typing.mp4', from:207, duration:81, trim:2.5, caption:'Then ask: what should the viewer actually see?', label:'02  VISUAL INTENT', cropX:'42%', scale:1.12},
  {src:'media/typing.mp4', from:288, duration:72, trim:5.0, caption:'Not a circle.\nNot a card.\nA real visual.', label:'03  SHOT', cropX:'58%', scale:1.18},
  {src:'media/city.mp4', from:360, duration:72, trim:4.0, caption:'A change of place can carry a transition.', label:'CUT ON MEANING', cropX:'55%', scale:1.08},
  {src:'media/typing.mp4', from:432, duration:81, trim:7.0, caption:'A close-up can make the idea feel concrete.', label:'SHOW THE ACTION', cropX:'48%', scale:1.16},
  {src:'media/coffee.mp4', from:513, duration:63, trim:3.0, caption:'Then cut again before the image becomes wallpaper.', label:'KEEP IT MOVING', cropX:'50%', scale:1.15},
  {src:'media/typing.mp4', from:576, duration:81, trim:1.5, caption:'Graphics still matter.', label:'GRAPHICS = SUPPORT', cropX:'35%', scale:1.1},
  {src:'media/city.mp4', from:657, duration:72, trim:6.0, caption:'But they explain what footage cannot.', label:'NOT THE MAIN EVENT', cropX:'62%', scale:1.08},
  {src:'media/typing.mp4', from:729, duration:81, trim:8.0, caption:'The timeline becomes a sequence of decisions.', label:'SHOT → SHOT → SHOT', cropX:'52%', scale:1.14},
  {src:'media/typing.mp4', from:810, duration:90, trim:3.5, caption:'That is the experiment we are testing now.', label:'SHOT-BASED PROTOTYPE', cropX:'45%', scale:1.1},
];

const Caption = ({shot}:{shot:Shot}) => {
  const frame = useCurrentFrame();
  const fade = Math.min(
    interpolate(frame, [0, 5, shot.duration - 5, shot.duration], [0, 1, 1, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'}),
    1
  );
  return (
    <AbsoluteFill style={{justifyContent:'flex-end', padding:'0 64px 132px', opacity:fade}}>
      <div style={{fontFamily:'Inter,Arial,sans-serif', fontSize:18, fontWeight:800, letterSpacing:3, marginBottom:16, textShadow:'0 2px 16px #000'}}>
        {shot.label}
      </div>
      <div style={{maxWidth:900, fontFamily:'Inter,Arial,sans-serif', fontSize:46, lineHeight:1.08, fontWeight:800, letterSpacing:-1.2, whiteSpace:'pre-line', textShadow:'0 3px 24px #000, 0 1px 4px #000'}}>
        {shot.caption}
      </div>
    </AbsoluteFill>
  );
};

const ShotLayer = ({shot}:{shot:Shot}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = frame;
  const zoom = interpolate(local, [0, shot.duration], [1, shot.scale ?? 1.08,], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const intro = interpolate(local, [0, 5], [0,1], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const outro = interpolate(local, [shot.duration-5, shot.duration], [1,0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <AbsoluteFill style={{background:'#050505', opacity:Math.min(intro,outro)}}>
      <OffthreadVideo
        src={staticFile(shot.src)}
        trimBefore={Math.round(shot.trim * fps)}
        muted
        style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:shot.cropX ?? '50%',transform:\`scale(\${zoom})\`}}
        volume={0}
        playbackRate={1}

      />
      <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(0,0,0,.05) 0%,rgba(0,0,0,.08) 45%,rgba(0,0,0,.58) 100%)'}} />
      <Caption shot={shot} />
    </AbsoluteFill>
  );
};

export const ShotBased: React.FC = () => (
  <AbsoluteFill style={{background:'#050505'}}>
    <Audio src={staticFile('voice-shot-test.wav')} volume={1} />
    {shots.map((shot) => (
      <Sequence key={shot.from} from={shot.from} durationInFrames={shot.duration}>
        <ShotLayer shot={shot} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
