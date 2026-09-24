import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { generatedShots } from "./generatedShots";

type Shot = (typeof generatedShots)[number];

const Caption = ({ shot }: { shot: Shot }) => {
  const frame = useCurrentFrame();
  const words = shot.caption.split(/\s+/);
  const totalWeight = words.reduce((n,w) => n + Math.max(1,w.replace(/[^a-zA-Z0-9]/g,"").length), 0);
  const wordFrames = words.map(w => Math.max(4, Math.round((Math.max(1,w.replace(/[^a-zA-Z0-9]/g,"").length) / totalWeight) * shot.duration)));
  const totalAssigned = wordFrames.reduce((a,b)=>a+b,0);
  wordFrames[wordFrames.length-1] += shot.duration-totalAssigned;

  const pageSize = 4;
  const pageIndex = Math.min(Math.floor(frame / Math.max(1, shot.duration / Math.ceil(words.length/pageSize))), Math.ceil(words.length/pageSize)-1);
  const startWord = pageIndex * pageSize;
  const pageWords = words.slice(startWord, startWord + pageSize);
  const pageStart = wordFrames.slice(0,startWord).reduce((a,b)=>a+b,0);
  const pageDuration = wordFrames.slice(startWord,startWord+pageSize).reduce((a,b)=>a+b,0);
  const local = frame - pageStart;
  const enter = interpolate(local,[0,5],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const exit = interpolate(local,[Math.max(0,pageDuration-5),pageDuration],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const opacity=Math.min(enter,exit);

  let cursor=0;
  const topCaption = shot.type === "data" || shot.type === "reveal" || shot.type === "concept";
  return (
    <AbsoluteFill style={{
      justifyContent:topCaption ? "flex-start" : "flex-end",
      alignItems:"center",
      padding:topCaption ? "190px 62px 0" : "0 62px 178px",
      opacity
    }}>
      <div style={{
        maxWidth:930,
        display:"flex",
        flexWrap:"wrap",
        justifyContent:"center",
        gap:"0 14px",
        fontFamily:"Inter,Arial,sans-serif",
        fontSize:52,
        lineHeight:1.02,
        fontWeight:900,
        letterSpacing:-1.8,
        textAlign:"center",
        textShadow:"0 3px 16px rgba(0,0,0,.9), 0 1px 3px rgba(0,0,0,.95)"
      }}>
        {pageWords.map((word,i)=>{
          const d=wordFrames[startWord+i];
          const active=frame>=cursor && frame<cursor+d;
          cursor+=d;
          return <span key={i} style={{opacity:active?1:.78,transform:active?"scale(1.04)":"scale(1)",display:"inline-block",color:active?"#FFFFFF":"#E8E8E8"}}>{word}</span>;
        })}
      </div>
    </AbsoluteFill>
  );
};

const ShotLayer = ({ shot }: { shot: Shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = interpolate(frame,[0,2],[0,1],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const outro = interpolate(frame,[shot.duration-4,shot.duration],[1,0],{extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const zoom = 1.025 + (frame / Math.max(1,shot.duration)) * 0.055;

  return (
    <AbsoluteFill style={{background:"#050505",opacity:Math.min(intro,outro)}}>
      <OffthreadVideo
        src={staticFile(shot.src)}
        trimBefore={Math.round(shot.trim * fps)}
        muted
        style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"50% 50%",transform:`scale(${zoom})`}}
        volume={0}
      />
      <AbsoluteFill style={{background:"linear-gradient(180deg,rgba(0,0,0,.02) 0%,rgba(0,0,0,.02) 52%,rgba(0,0,0,.58) 100%)"}} />
      <Caption shot={shot} />
    </AbsoluteFill>
  );
};

export const ShotBased: React.FC = () => (
  <AbsoluteFill style={{background:"#050505"}}>
    <Audio src={staticFile("voice-shot-test.wav")} volume={1} />
    <Audio src={staticFile("music-bed.wav")} volume={0.18} />
    {generatedShots.map((shot) => (
      <Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration}>
        <ShotLayer shot={shot} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
