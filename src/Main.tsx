import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const intro = spring({
    frame,
    fps,
    config: {
      damping: 200,
      stiffness: 100,
      mass: 0.8,
    },
  });

  const outro = interpolate(frame, [120, 149], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(intro, [0, 1], [0.82, 1]);
  const y = interpolate(intro, [0, 1], [80, 0]);

  return (
    <AbsoluteFill
      style={{
        background: '#080808',
        color: 'white',
        fontFamily: 'Arial, Helvetica, sans-serif',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 90,
      }}
    >
      <div
        style={{
          transform: `translateY(${y}px) scale(${scale})`,
          opacity: intro * outro,
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            letterSpacing: 6,
            marginBottom: 36,
            opacity: 0.7,
          }}
        >
          REMOTIVE VIDEO STUDIO
        </div>

        <div
          style={{
            fontSize: 104,
            lineHeight: 1.02,
            fontWeight: 800,
          }}
        >
          Programmatic
          <br />
          Video
        </div>

        <div
          style={{
            marginTop: 44,
            fontSize: 38,
            lineHeight: 1.3,
            opacity: 0.72,
          }}
        >
          A real Remotion composition rendered to MP4.
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 90,
          left: 90,
          right: 90,
          height: 6,
          background: 'rgba(255,255,255,0.15)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${(frame / 149) * 100}%`,
            height: '100%',
            background: 'white',
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
