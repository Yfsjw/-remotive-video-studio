import React from 'react';
import {Composition} from 'remotion';
import {Main} from './Main';
import {ShotBased} from './ShotBased';

export const Root = () => (
  <>
    <Composition id="Main" component={Main} durationInFrames={1350} fps={30} width={1080} height={1920} />
    <Composition id="ShotBased" component={ShotBased} durationInFrames={1350} fps={30} width={1080} height={1920} />
  </>
);
