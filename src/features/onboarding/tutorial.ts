import type { AppId } from '../os/model';
export const TUTORIAL_KEY = 'trusttrail:onboarding:v1';
export const stages = ['welcome', 'mail', 'browser', 'journal', 'ready'] as const;
export type Stage = typeof stages[number];
export type TutorialState = Stage | 'completed' | 'skipped';
export function readTutorial(): TutorialState {
  try { const value = localStorage.getItem(TUTORIAL_KEY); return [...stages, 'completed', 'skipped'].includes(value as Stage) ? value as TutorialState : 'welcome'; } catch { return 'welcome'; }
}
export function storeTutorial(state: TutorialState) { try { localStorage.setItem(TUTORIAL_KEY, state); } catch { /* Optional preference; gameplay stays available. */ } }
export function advanceTutorial(state: TutorialState, app: AppId): TutorialState {
  return state === app ? ({ mail: 'browser', browser: 'journal', journal: 'ready' } as const)[app as 'mail' | 'browser' | 'journal'] ?? state : state;
}
export function tutorialEligible(chapter: string, phase: string, playing: boolean) { return playing && chapter === 'C1' && phase === 'investigation'; }
