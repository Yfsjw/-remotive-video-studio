export type VisualStrategy =
  | 'demonstration'
  | 'transformation'
  | 'comparison'
  | 'reveal'
  | 'process'
  | 'spatial_explanation'
  | 'simulation'
  | 'metaphor'
  | 'evidence'
  | 'hero_visual';

export type VisualType =
  | 'REAL_VIDEO'
  | 'REAL_IMAGE'
  | 'SCREEN_RECORDING'
  | 'UI_GENERATED'
  | 'AI_VIDEO'
  | 'AI_IMAGE'
  | 'SVG'
  | 'LOTTIE'
  | 'DIAGRAM'
  | 'CHART'
  | 'MANIM'
  | 'TEXT_ONLY'
  | 'HYBRID';

export type AssetSource =
  | 'existing'
  | 'stock'
  | 'screenshot'
  | 'generated_ui'
  | 'ai_image'
  | 'ai_video'
  | 'svg'
  | 'lottie'
  | 'manim'
  | 'text';

export type ShotPurpose =
  | 'hook'
  | 'establish'
  | 'explain'
  | 'demonstrate'
  | 'compare'
  | 'prove'
  | 'transition'
  | 'payoff'
  | 'close';

export interface AssetRequirement {
  id: string;
  type: VisualType;
  source: AssetSource;
  query?: string;
  required: boolean;
  orientation?: 'portrait' | 'landscape' | 'square';
  minDurationSeconds?: number;
  continuityKey?: string;
  notes?: string;
}

export interface CameraPlan {
  type:
    | 'static'
    | 'push_in'
    | 'pull_out'
    | 'pan'
    | 'tilt'
    | 'orbit'
    | 'follow'
    | 'macro_reveal';
  intensity: number;
  focalPoint?: { x: number; y: number };
}

export interface MotionEvent {
  id: string;
  trigger: string;
  target: string;
  action:
    | 'appear'
    | 'disappear'
    | 'move'
    | 'scale'
    | 'transform'
    | 'highlight'
    | 'focus'
    | 'reveal'
    | 'replace';
  purpose: string;
  startOffsetSeconds: number;
  durationSeconds: number;
}

export interface TypographyPlan {
  enabled: boolean;
  text?: string;
  role?: 'label' | 'emphasis' | 'stat' | 'title' | 'caption';
  maxWords?: number;
}

export interface TransitionPlan {
  in:
    | 'cut'
    | 'match_cut'
    | 'fade'
    | 'content_follow'
    | 'camera_move'
    | 'morph';
  out:
    | 'cut'
    | 'match_cut'
    | 'fade'
    | 'content_follow'
    | 'camera_move'
    | 'morph';
}

export interface ContinuityPlan {
  characters: string[];
  locations: string[];
  objects: string[];
  styleKey: string;
  previousState?: string;
  nextState?: string;
}

export interface Shot {
  id: string;
  startSeconds: number;
  durationSeconds: number;
  narration: string;
  purpose: ShotPurpose;
  visualStrategy: VisualStrategy;
  visualType: VisualType;
  assets: AssetRequirement[];
  camera: CameraPlan;
  motion: MotionEvent[];
  typography: TypographyPlan;
  transition: TransitionPlan;
  continuity: ContinuityPlan;
  notes?: string;
}

export interface Storyboard {
  version: 'visual-planner-v1';
  format: '9:16';
  width: 1080;
  height: 1920;
  fps: 30;
  title: string;
  totalDurationSeconds: number;
  narrationLanguage: string;
  shots: Shot[];
}

export interface ValidationIssue {
  severity: 'error' | 'warning';
  code:
    | 'NO_SHOTS'
    | 'TIMELINE_GAP'
    | 'TIMELINE_OVERLAP'
    | 'LONG_TEXT_ONLY'
    | 'REPEATED_STRATEGY'
    | 'MISSING_ASSET'
    | 'MISSING_PURPOSE'
    | 'MISSING_CONTINUITY';
  shotIds: string[];
  message: string;
}

export function validateStoryboard(storyboard: Storyboard): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (storyboard.shots.length === 0) {
    issues.push({
      severity: 'error',
      code: 'NO_SHOTS',
      shotIds: [],
      message: 'Storyboard contains no shots.',
    });
    return issues;
  }

  const sorted = [...storyboard.shots].sort(
    (a, b) => a.startSeconds - b.startSeconds,
  );

  for (let i = 0; i < sorted.length; i++) {
    const shot = sorted[i];
    const end = shot.startSeconds + shot.durationSeconds;

    if (shot.durationSeconds <= 0) {
      issues.push({
        severity: 'error',
        code: 'TIMELINE_GAP',
        shotIds: [shot.id],
        message: 'Shot duration must be greater than zero.',
      });
    }

    if (!shot.purpose) {
      issues.push({
        severity: 'error',
        code: 'MISSING_PURPOSE',
        shotIds: [shot.id],
        message: 'Every shot needs an explicit pedagogical purpose.',
      });
    }

    if (shot.assets.length === 0 && shot.visualType !== 'TEXT_ONLY') {
      issues.push({
        severity: 'error',
        code: 'MISSING_ASSET',
        shotIds: [shot.id],
        message: 'Non-text visual shots must declare at least one asset requirement.',
      });
    }

    if (!shot.continuity.styleKey) {
      issues.push({
        severity: 'warning',
        code: 'MISSING_CONTINUITY',
        shotIds: [shot.id],
        message: 'Shot has no continuity style key.',
      });
    }

    if (shot.visualType === 'TEXT_ONLY' && shot.durationSeconds > 2.5) {
      issues.push({
        severity: 'warning',
        code: 'LONG_TEXT_ONLY',
        shotIds: [shot.id],
        message: 'Text-only shots longer than 2.5 seconds should be justified.',
      });
    }

    if (i > 0) {
      const previous = sorted[i - 1];
      const previousEnd = previous.startSeconds + previous.durationSeconds;
      const delta = shot.startSeconds - previousEnd;

      if (delta > 0.08) {
        issues.push({
          severity: 'warning',
          code: 'TIMELINE_GAP',
          shotIds: [previous.id, shot.id],
          message: `Timeline gap of ${delta.toFixed(2)}s between shots.`,
        });
      }

      if (delta < -0.01) {
        issues.push({
          severity: 'error',
          code: 'TIMELINE_OVERLAP',
          shotIds: [previous.id, shot.id],
          message: `Timeline overlap of ${Math.abs(delta).toFixed(2)}s between shots.`,
        });
      }
    }

    if (end > storyboard.totalDurationSeconds + 0.01) {
      issues.push({
        severity: 'error',
        code: 'TIMELINE_OVERLAP',
        shotIds: [shot.id],
        message: 'Shot extends beyond storyboard duration.',
      });
    }
  }

  for (let i = 0; i <= sorted.length - 3; i++) {
    const window = sorted.slice(i, i + 3);
    if (
      window.every(
        (shot) =>
          shot.visualStrategy === window[0].visualStrategy &&
          shot.visualType === window[0].visualType,
      )
    ) {
      issues.push({
        severity: 'warning',
        code: 'REPEATED_STRATEGY',
        shotIds: window.map((shot) => shot.id),
        message: 'Three consecutive shots use the same visual strategy and type.',
      });
    }
  }

  return issues;
}
