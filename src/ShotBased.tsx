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
  const enter = interpolate(frame, [0, 7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exit = interpolate(frame, [shot.duration - 7, shot.duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(enter, exit);

  return (
    <AbsoluteFill
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        padding: "0 58px 170px",
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 930,
          padding: "16px 24px 18px",
          borderRadius: 18,
          background: "rgba(0,0,0,.62)",
          boxShadow: "0 10px 35px rgba(0,0,0,.28)",
          fontFamily: "Inter, Arial, sans-serif",
          fontSize: 46,
          lineHeight: 1.08,
          fontWeight: 800,
          letterSpacing: -1.1,
          textAlign: "center",
          textShadow: "0 2px 12px rgba(0,0,0,.65)",
        }}
      >
        {shot.caption}
      </div>
    </AbsoluteFill>
  );
};

const ShotLayer = ({ shot }: { shot: Shot }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const intro = interpolate(frame, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outro = interpolate(frame, [shot.duration - 5, shot.duration], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const zoom = 1.04 + (frame / Math.max(1, shot.duration)) * 0.07;

  return (
    <AbsoluteFill style={{ background: "#050505", opacity: Math.min(intro, outro) }}>
      <OffthreadVideo
        src={staticFile(shot.src)}
        trimBefore={Math.round(shot.trim * fps)}
        muted
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 50%",
          transform: `scale(${zoom})`,
        }}
        volume={0}
      />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg,rgba(0,0,0,.02) 0%,rgba(0,0,0,.04) 48%,rgba(0,0,0,.42) 100%)",
        }}
      />
      <Caption shot={shot} />
    </AbsoluteFill>
  );
};

export const ShotBased: React.FC = () => (
  <AbsoluteFill style={{ background: "#050505" }}>
    <Audio src={staticFile("voice-shot-test.wav")} volume={1} />
    {generatedShots.map((shot) => (
      <Sequence key={shot.id} from={shot.from} durationInFrames={shot.duration}>
        <ShotLayer shot={shot} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
