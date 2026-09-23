import {Composition} from 'remotion';
import {Main} from './Main';

export const Root = () => (
  <Composition id="Main" component={Main} durationInFrames={900} fps={30} width={1080} height={1920} />
);
