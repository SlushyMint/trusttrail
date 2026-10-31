import { describe, expect, it } from 'vitest';
import { scenario } from '../../src/content/scenario';
import { chapterThree } from '../../src/content/chapters/c3';
import { chapterFacts, initialGame, reduceGame } from '../../src/engine/reducer';
import { recoverySteps, reportReady } from '../../src/engine/recovery';
import type { GameEvent, GameState } from '../../src/engine/types';
import { validateScenario } from '../../src/engine/validate';
import { decodeSave, encodeSave } from '../../src/lib/persistence';

function send(game: GameState, event: GameEvent) { return reduceGame(game, event); }
function previousChapters(c1 = 'ignore', c2 = 'decline') {
  let game = send(send(initialGame(), { type: 'run.started' }), { type: 'story.begun' });
  for (const chapter of scenario.chapters.slice(0, 2)) {
    chapter.intro.forEach((_, lineIndex) => { game = send(game, { type: 'line.advanced', nodeId: `${chapter.id}-intro`, lineIndex }); });
    chapter.conversation?.exchanges.forEach((_, stepIndex) => { game = send(game, { type: 'conversation.advanced', conversationId: chapter.conversation!.id, stepIndex }); });
    game = send(game, { type: 'evidence.inspected', evidenceId: `${chapter.id}-E01` });
    const optionId = chapter.id === 'C1' ? c1 : c2;
    game = send(send(game, { type: 'decision.opened', decisionId: chapter.decision.id }), { type: 'choice.committed', decisionId: chapter.decision.id, optionId });
    if (game.position.kind === 'verification') {
      game = send(game, { type: 'reference.inspected', sourceId: chapter.source.id, inspectionId: chapter.source.inspectionId });
      game = send(game, { type: 'source.compared', sourceId: chapter.source.id });
    }
    game = send(send(game, { type: 'outcome.continued', nodeId: `${chapter.decision.id}-${optionId}-outcome` }), { type: 'debrief.continued', nodeId: `${chapter.decision.id}-${optionId}-debrief` });
    if (chapter.id === 'C1') game = send(game, { type: 'chapter.continued', chapterId: 'C1' });
  }
  return game;
}
function investigate(game = previousChapters()) {
  game = send(game, { type: 'chapter.continued', chapterId: 'C2' });
  chapterThree.intro.forEach((_, lineIndex) => { game = send(game, { type: 'line.advanced', nodeId: 'C3-intro', lineIndex }); });
  return game;
}
const opened: GameEvent = { type: 'portal.opened', chapterId: 'C3' };
const source: GameEvent = { type: 'reference.inspected', sourceId: 'C3-SOURCE', inspectionId: 'C3-POLICY' };
const compare: GameEvent = { type: 'source.compared', sourceId: 'C3-SOURCE' };
function verify(game: GameState) {
  game = send(game, opened);
  for (const evidenceId of ['C3-E01', 'C3-E02', 'C3-E03']) game = send(game, { type: 'evidence.inspected', evidenceId });
  game = send(game, source);
  for (const item of chapterThree.portal.comparisons) game = send(game, { type: 'claim.matched', comparisonId: item.id, answerId: item.correctAnswerId });
  return send(game, compare);
}

describe('Chapter 3 climax and recovery', () => {
  it('extends old v1 C2 saves without changing events, choices, discoveries or facts', () => {
    const old = previousChapters('follow-link', 'share-data');
    expect(decodeSave(encodeSave(old, 14))).toMatchObject({ kind: 'ready', game: old });
    expect(old.position).toEqual({ kind: 'chapterComplete', chapterId: 'C2' });
    expect(reportReady(old)).toBe(false);
    expect(send(old, { type: 'chapter.continued', chapterId: 'C1' })).toBe(old);
    const next = send(old, { type: 'chapter.continued', chapterId: 'C2' });
    expect(next.position).toEqual({ kind: 'narrative', chapterId: 'C3', lineIndex: 0 });
    expect(next.choices).toBe(old.choices);
    expect(next.discoveries).toBe(old.discoveries);
    expect(next.flags).toBe(old.flags);
    expect(send(next, { type: 'chapter.continued', chapterId: 'C2' })).toBe(next);
    scenario.chapters.slice(0, 2).forEach(chapter => expect(chapterFacts(next, chapter)).toEqual(chapterFacts(old, chapter)));
  });

  it('requires portal inspection and independent claim matching, rejecting wrong and repeated events', () => {
    let game = investigate();
    const premature: GameEvent[] = [{ type: 'evidence.inspected', evidenceId: 'C3-E01' }, { type: 'decision.opened', decisionId: 'D3' }, compare, { type: 'claim.matched', comparisonId: 'C3-DOMAIN', answerId: 'official' }];
    for (const event of premature) expect(send(game, event)).toBe(game);
    game = send(game, opened);
    expect(send(game, opened)).toBe(game);
    game = send(game, source);
    expect(send(game, { type: 'claim.matched', comparisonId: 'C3-DOMAIN', answerId: 'official' })).toBe(game);
    for (const evidenceId of ['C3-E01', 'C3-E02', 'C3-E03']) {
      const event: GameEvent = { type: 'evidence.inspected', evidenceId };
      game = send(game, event); expect(send(game, event)).toBe(game);
    }
    expect(send(game, { type: 'evidence.inspected', evidenceId: 'C3-E04' })).toBe(game);
    expect(send(game, { type: 'claim.matched', comparisonId: 'C3-DOMAIN', answerId: 'portal' })).toBe(game);
    for (const item of chapterThree.portal.comparisons) {
      expect(send(game, compare)).toBe(game);
      const event: GameEvent = { type: 'claim.matched', comparisonId: item.id, answerId: item.correctAnswerId };
      game = send(game, event); expect(send(game, event)).toBe(game);
    }
    game = send(game, compare);
    expect(send(game, source)).toBe(game); expect(send(game, compare)).toBe(game);
    expect(chapterFacts(game, chapterThree).verification).toBe(2);
    expect(send(game, { type: 'decision.opened', decisionId: 'D3' }).position.kind).toBe('decision');
  });

  const traces = ['follow-link', 'ignore', 'verify'].flatMap(c1 => ['share-data', 'decline', 'verify-recruiter'].flatMap(c2 => ['share-code', 'stop-verify', 'leave-portal'].map(c3 => [c1, c2, c3])));
  it.each(traces)('finishes all branches %s → %s → %s with recoverable consequences and deterministic resume', (c1, c2, c3) => {
    const previous = previousChapters(c1, c2);
    let game = verify(investigate(previous));
    game = send(send(game, { type: 'decision.opened', decisionId: 'D3' }), { type: 'choice.committed', decisionId: 'D3', optionId: c3 });
    expect(game.position.kind).toBe('outcome');
    const facts = chapterFacts(game, chapterThree);
    expect(facts).toMatchObject({ awareness: 4, verification: 2, safety: c3 === 'share-code' ? 0 : 2 });
    expect(Boolean(game.flags.simulatedAccountRisk)).toBe(c3 === 'share-code');
    expect(send(game, { type: 'choice.committed', decisionId: 'D3', optionId: c3 })).toBe(game);
    expect(send(game, { type: 'recovery.completed', chapterId: 'C3' })).toBe(game);
    game = send(game, { type: 'outcome.continued', nodeId: `D3-${c3}-outcome` });
    expect(game.position).toEqual({ kind: 'recovery', chapterId: 'C3' });
    expect(reportReady(game)).toBe(false);
    expect(send(game, { type: 'debrief.continued', nodeId: `D3-${c3}-debrief` })).toBe(game);
    const steps = recoverySteps(game);
    expect(steps.some(step => step.id === 'account')).toBe(c3 === 'share-code');
    expect(steps.some(step => step.id === 'identity')).toBe(c2 === 'share-data');
    expect(send(game, { type: 'recovery.acted', stepId: 'report', actionId: 'report-relevant' })).toBe(game);
    for (const step of steps) {
      expect(send(game, { type: 'recovery.completed', chapterId: 'C3' })).toBe(game);
      expect(send(game, { type: 'recovery.acted', stepId: step.id, actionId: 'wrong' })).toBe(game);
      const action: GameEvent = { type: 'recovery.acted', stepId: step.id, actionId: step.correctActionId };
      game = send(game, action); expect(send(game, action)).toBe(game);
      expect(chapterFacts(game, chapterThree)).toEqual(facts);
    }
    game = send(game, { type: 'recovery.completed', chapterId: 'C3' });
    expect(game.position.kind).toBe('debrief');
    expect(send(game, { type: 'recovery.completed', chapterId: 'C3' })).toBe(game);
    game = send(game, { type: 'debrief.continued', nodeId: `D3-${c3}-debrief` });
    expect(reportReady(game)).toBe(true);
    expect(game.position).toEqual({ kind: 'chapterComplete', chapterId: 'C3' });
    expect(send(game, { type: 'chapter.continued', chapterId: 'C3' })).toBe(game);
    expect(game.choices.D1).toEqual(previous.choices.D1); expect(game.choices.D2).toEqual(previous.choices.D2);
    // All intermediate positions, including partial comparisons and recovery, resume by replay.
    for (let length = 1; length <= game.history.length; length++) {
      const prefix = game.history.slice(0, length).reduce((state, event) => send(state, event), initialGame());
      expect(decodeSave(encodeSave(prefix, length))).toMatchObject({ kind: 'ready', game: prefix });
    }
  });

  it('validates comparisons and rejects impossible persisted actions', () => {
    expect(validateScenario(scenario)).toEqual([]);
    const broken = structuredClone(scenario);
    broken.chapters[2]!.portal!.comparisons[0]!.correctAnswerId = 'missing';
    expect(validateScenario(broken)).toContain('Broken comparison: C3-DOMAIN');
    const game = investigate();
    const raw = JSON.parse(encodeSave(game, 1));
    for (const event of [compare, { type: 'portal.opened', chapterId: 'C1' }, { type: 'recovery.completed', chapterId: 'C3' }, { type: 'recovery.acted', stepId: 'stop', actionId: 'stop-contact' }]) {
      expect(decodeSave(JSON.stringify({ ...raw, events: [...game.history, event] })).kind).toBe('invalid');
    }
  });

  it('requires relevant comparisons rather than a full evidence quota', () => {
    let game = send(investigate(), opened);
    for (const evidenceId of ['C3-E01', 'C3-E03']) game = send(game, { type: 'evidence.inspected', evidenceId });
    game = send(game, source);
    for (const item of chapterThree.portal.comparisons) game = send(game, { type: 'claim.matched', comparisonId: item.id, answerId: item.correctAnswerId });
    game = send(send(game, compare), { type: 'decision.opened', decisionId: 'D3' });
    game = send(game, { type: 'choice.committed', decisionId: 'D3', optionId: 'stop-verify' });
    expect(game.position.kind).toBe('outcome');
    expect(chapterFacts(game, chapterThree)).toMatchObject({ awareness: 3, verification: 2, safety: 2 });
    expect(game.discoveries['C3-E02']).toBeUndefined();
  });
});
