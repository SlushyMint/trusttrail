import type { GameEvent, GameState } from '../../engine/types';

export type Cue = 'startup' | 'application' | 'message' | 'evidence' | 'verification' | 'chapter' | 'final';
type Note = readonly [frequency: number, delay: number, duration: number];

// Original TrustTrail motifs: related open fifths and suspended tones, never a choice verdict.
export const MOTIFS: Record<Cue, readonly Note[]> = {
  startup: [[196, 0, 0.2], [293.665, 0.1, 0.25], [392, 0.22, 0.3]],
  application: [[392, 0, 0.06], [523.251, 0.035, 0.07]],
  message: [[659.255, 0, 0.12], [587.33, 0.14, 0.18]],
  evidence: [[293.665, 0, 0.13], [440, 0.075, 0.2]],
  verification: [[293.665, 0, 0.18], [392, 0.08, 0.18], [440, 0.16, 0.25]],
  chapter: [[196, 0, 0.35], [293.665, 0.12, 0.38], [392, 0.25, 0.5]],
  final: [[146.832, 0, 0.6], [220, 0.15, 0.65], [293.665, 0.3, 0.65], [329.628, 0.45, 0.8]],
};

/** Called only for a newly accepted action, never from a render/restoration effect. */
export function cueForAction(previous: GameState, next: GameState, event: GameEvent): Cue | undefined {
  if (next === previous) return;
  if (event.type === 'run.started') return 'startup';
  if (event.type === 'debrief.continued' && next.position.kind === 'chapterComplete') return next.position.chapterId === 'C3' ? 'final' : 'chapter';
  if (event.type === 'reference.inspected' || event.type === 'source.compared' || event.type === 'claim.matched') return 'verification';
  if (event.type === 'evidence.inspected') return 'evidence';
  if (event.type === 'conversation.advanced' || event.type === 'line.advanced' && next.position.kind === 'investigation' && next.position.chapterId === 'C2') return 'message';
}
