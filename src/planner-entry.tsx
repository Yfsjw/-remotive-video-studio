import React from "react";
import {Composition} from "remotion";
import {VisualPlannerComposition} from "./VisualPlannerComposition";
import {exampleStoryboard} from "./planner/example-storyboard";

export const RemotionRoot: React.FC = () => (
  <Composition id="VisualPlanner" component={VisualPlannerComposition}
    durationInFrames={exampleStoryboard.totalDurationSeconds * exampleStoryboard.fps}
    fps={exampleStoryboard.fps} width={exampleStoryboard.width} height={exampleStoryboard.height}
    defaultProps={{storyboard: exampleStoryboard}} />
);
