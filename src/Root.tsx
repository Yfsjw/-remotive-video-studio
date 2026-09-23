import {Composition} from 'remotion';
import {Scene01} from './Scene01';

export const Root = () => (
  <Composition id="Scene01" component={Scene01} durationInFrames={150} fps={30} width={1080} height={1920} />
);
