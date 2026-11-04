import { beforeEach, expect, it, vi } from 'vitest';
import { advanceTutorial, readTutorial, storeTutorial, tutorialEligible, TUTORIAL_KEY } from '../../src/features/onboarding/tutorial';
beforeEach(() => localStorage.clear());
it('offers only Chapter 1 investigation on the play route', () => {
  expect(tutorialEligible('C1', 'investigation', true)).toBe(true);
  for (const args of [['C2', 'investigation', true], ['C1', 'narrative', true], ['C1', 'investigation', false]] as const) expect(tutorialEligible(args[0], args[1], args[2])).toBe(false);
});
it('initializes first-time and invalid preferences safely', () => { expect(readTutorial()).toBe('welcome'); localStorage.setItem(TUTORIAL_KEY, '{}'); expect(readTutorial()).toBe('welcome'); });
it('resumes each interrupted stage on refresh', () => { for (const stage of ['welcome', 'mail', 'browser', 'journal', 'ready'] as const) { storeTutorial(stage); expect(readTutorial()).toBe(stage); } });
it('advances only the expected real app action and ignores duplicates', () => {
  expect(advanceTutorial('welcome', 'mail')).toBe('welcome');
  expect(advanceTutorial('mail', 'browser')).toBe('mail');
  expect(advanceTutorial('mail', 'mail')).toBe('browser');
  expect(advanceTutorial('browser', 'mail')).toBe('browser');
  expect(advanceTutorial('browser', 'browser')).toBe('journal');
  expect(advanceTutorial('journal', 'journal')).toBe('ready');
  expect(advanceTutorial('ready', 'journal')).toBe('ready');
});
it('remembers skip and completion and supports replay', () => { for (const state of ['skipped', 'completed'] as const) { storeTutorial(state); expect(readTutorial()).toBe(state); expect(advanceTutorial(state, 'mail')).toBe(state); } storeTutorial('welcome'); expect(readTutorial()).toBe('welcome'); });
it('never changes gameplay storage', () => { localStorage.setItem('trusttrail:save:v1', 'unchanged'); storeTutorial('mail'); storeTutorial('completed'); expect(localStorage.getItem('trusttrail:save:v1')).toBe('unchanged'); });
it('tolerates unavailable storage', () => { vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw Error(); }); vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error(); }); expect(readTutorial()).toBe('welcome'); expect(() => storeTutorial('skipped')).not.toThrow(); vi.restoreAllMocks(); });
