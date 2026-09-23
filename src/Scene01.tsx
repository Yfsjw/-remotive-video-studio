import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';

export const Scene01: React.FC = () => (
  <AbsoluteFill style={{backgroundColor:'#07070A'}}>
    <video src={staticFile('manim/scene01.mp4')} style={{width:'100%',height:'100%',objectFit:'cover'}} />
    <Audio src={staticFile('voice.wav')} volume={0.98} />
  </AbsoluteFill>
);
