import React from 'react';
import {AbsoluteFill, Audio, Video, staticFile} from 'remotion';

export const Scene01: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: '#07070A'}}>
    <Video
      src={staticFile('manim/scene01.mp4')}
      style={{width: '100%', height: '100%', objectFit: 'cover'}}
      muted
      volume={0}
      startFrom={0}
      endAt={150}
    />
    <Audio src={staticFile('voice.wav')} volume={0.98} />
  </AbsoluteFill>
);
