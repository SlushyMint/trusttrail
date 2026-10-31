import { describe, expect, it } from 'vitest';
import { chapterOne } from '../../src/content/chapters/c1';
import { chapterTwo } from '../../src/content/chapters/c2';
import { scenario } from '../../src/content/scenario';
import { chapterFacts, conversationStep, initialGame, reduceGame } from '../../src/engine/reducer';
import type { GameEvent, GameState } from '../../src/engine/types';
import { validateScenario } from '../../src/engine/validate';
import { decodeSave, encodeSave } from '../../src/lib/persistence';

function chapterOneCheckpoint() {
  let game = reduceGame(initialGame(), { type: 'run.started' });
  const send = (event: GameEvent) => { game = reduceGame(game, event); };
  send({ type: 'story.begun' });
  chapterOne.intro.forEach((_, lineIndex) => send({ type: 'line.advanced', nodeId: 'C1-intro', lineIndex }));
  send({ type: 'evidence.inspected', evidenceId: 'C1-E01' });
  send({ type: 'decision.opened', decisionId: 'D1' });
  send({ type: 'choice.committed', decisionId: 'D1', optionId: 'follow-link' });
  send({ type: 'outcome.continued', nodeId: 'D1-follow-link-outcome' });
  send({ type: 'debrief.continued', nodeId: 'D1-follow-link-debrief' });
  return game;
}
function investigate() {
  let game = reduceGame(chapterOneCheckpoint(), { type: 'chapter.continued', chapterId: 'C1' });
  chapterTwo.intro.forEach((_, lineIndex) => { game = reduceGame(game, { type: 'line.advanced', nodeId: 'C2-intro', lineIndex }); });
  return game;
}
function chat(game: GameState) {
  for (let stepIndex = 0; stepIndex < 3; stepIndex++) game = reduceGame(game, { type: 'conversation.advanced', conversationId: 'C2-CHAT', stepIndex });
  return game;
}
function choose(game: GameState, optionId: string) {
  return reduceGame(reduceGame(game, { type: 'decision.opened', decisionId: 'D2' }), { type: 'choice.committed', decisionId: 'D2', optionId });
}
const inspect: GameEvent = { type: 'reference.inspected', sourceId: 'C2-SOURCE', inspectionId: 'C2-DIRECTORY' };
const compare: GameEvent = { type: 'source.compared', sourceId: 'C2-SOURCE' };

describe('Chapter 2 continuity, investigation and event scoring', () => {
  it('accepts a shipped v1 completed save unchanged, with an explicit guarded continuation', () => {
    const old = chapterOneCheckpoint();
    // Literal pre-C2 envelope: the existing schema/content/rubric remain compatible.
    const raw = JSON.stringify({ schemaVersion: 1, contentVersion: 'trusttrail-1', rubricVersion: 'v1', revision: 19, events: old.history });
    expect(decodeSave(raw)).toMatchObject({ kind: 'ready', game: old, revision: 19 });
    expect(old.position).toEqual({ kind: 'chapterComplete', chapterId: 'C1' });
    expect(reduceGame(old, { type: 'chapter.continued', chapterId: 'C2' })).toBe(old);
    const next = reduceGame(old, { type: 'chapter.continued', chapterId: 'C1' });
    expect(next.position).toEqual({ kind: 'narrative', chapterId: 'C2', lineIndex: 0 });
    expect(next.choices).toBe(old.choices);
    expect(next.discoveries).toBe(old.discoveries);
    expect(next.flags.openedSuspiciousLink).toBe(true);
    expect(reduceGame(next, { type: 'chapter.continued', chapterId: 'C1' })).toBe(next);
  });

  it('guards future messages and hotspots, stale replies, cross-chapter actions and premature decisions', () => {
    let game = investigate();
    for (const event of [
      { type: 'evidence.inspected', evidenceId: 'C2-E02' },
      { type: 'evidence.inspected', evidenceId: 'C2-E03' },
      { type: 'evidence.inspected', evidenceId: 'C2-E04' },
      { type: 'evidence.inspected', evidenceId: 'C1-E02' },
      { type: 'decision.opened', decisionId: 'D2' },
      { type: 'conversation.advanced', conversationId: 'C2-CHAT', stepIndex: 1 },
      { type: 'conversation.advanced', conversationId: 'wrong', stepIndex: 0 },
    ] satisfies GameEvent[]) expect(reduceGame(game, event)).toBe(game);
    game = reduceGame(game, { type: 'evidence.inspected', evidenceId: 'C2-E01' });
    expect(game.discoveries['C2-E01']).toBeDefined();
    const reply: GameEvent = { type: 'conversation.advanced', conversationId: 'C2-CHAT', stepIndex: 0 };
    game = reduceGame(game, reply);
    expect(reduceGame(game, reply)).toBe(game);
    expect(conversationStep(game, chapterTwo)).toBe(1);
    expect(chapterFacts(game, chapterTwo)).toMatchObject({ awareness: 0, verification: 0, safety: 0 });
  });

  it('counts explicit inspections once and preserves Chapter 1 facts and evidence at commit', () => {
    const previous = chapterOneCheckpoint();
    let game = chat(investigate());
    for (const evidenceId of ['C2-E01', 'C2-E02', 'C2-E03']) {
      game = reduceGame(game, { type: 'evidence.inspected', evidenceId });
      expect(reduceGame(game, { type: 'evidence.inspected', evidenceId })).toBe(game);
    }
    expect(reduceGame(game, compare)).toBe(game);
    game = reduceGame(reduceGame(game, inspect), compare);
    expect(reduceGame(game, inspect)).toBe(game);
    expect(reduceGame(game, compare)).toBe(game);
    game = choose(game, 'verify-recruiter');
    expect(game.position.kind).toBe('outcome');
    expect(chapterFacts(game, chapterTwo)).toMatchObject({ awareness: 4, verification: 2, safety: 2 });
    expect(chapterFacts(game, chapterOne)).toEqual(chapterFacts(previous, chapterOne));
    expect(game.choices.D1).toEqual(previous.choices.D1);
    expect(game.discoveries['C1-E01']).toEqual(previous.discoveries['C1-E01']);
  });

  it.each(['share-data', 'decline', 'verify-recruiter'])('finishes %s without an evidence quota and rejoins at the C3 lead-in', optionId => {
    let game = choose(chat(investigate()), optionId);
    const committed = game;
    expect(reduceGame(game, { type: 'choice.committed', decisionId: 'D2', optionId })).toBe(game);
    if (optionId === 'verify-recruiter') {
      expect(game.position.kind).toBe('verification');
      expect(reduceGame(game, compare)).toBe(game);
      game = reduceGame(reduceGame(game, inspect), compare);
      expect(chapterFacts(game, chapterTwo)).toMatchObject({ awareness: 0, verification: 2, lateEvidence: [{ id: 'C2-E04' }] });
    }
    expect(game.position.kind).toBe('outcome');
    expect(Boolean(game.flags.simulatedDataExposure)).toBe(optionId === 'share-data');
    expect(Boolean(game.flags.protectedData)).toBe(optionId !== 'share-data');
    expect(chapterFacts(game, chapterTwo).safety).toBe(optionId === 'share-data' ? 0 : 2);
    expect(game.choices.D2).toEqual(committed.choices.D2);
    game = reduceGame(game, { type: 'outcome.continued', nodeId: `D2-${optionId}-outcome` });
    game = reduceGame(game, { type: 'debrief.continued', nodeId: `D2-${optionId}-debrief` });
    expect(game.position).toEqual({ kind: 'chapterComplete', chapterId: 'C2' });
    expect(reduceGame(game, { type: 'chapter.continued', chapterId: 'C2' })).toBe(game);
    // Replay every prefix: narrative, replies, clues, decision, partial verification and branch ending.
    for (let length = 1; length <= game.history.length; length++) {
      const prefix = game.history.slice(0, length).reduce((state, event) => reduceGame(state, event), initialGame());
      expect(decodeSave(encodeSave(prefix, length))).toMatchObject({ kind: 'ready', game: prefix });
    }
  });

  it('validates conversation IDs and clue links and rejects impossible persisted replies', () => {
    expect(validateScenario(scenario)).toEqual([]);
    const broken = structuredClone(scenario);
    broken.chapters[1]!.conversation!.profile.evidenceId = 'C1-E01';
    expect(validateScenario(broken)).toContain('Broken conversation evidence: C2-CHAT');
    const game = investigate();
    const raw = JSON.parse(encodeSave(game, 1));
    for (const stepIndex of [-1, 0.5, 2]) {
      expect(decodeSave(JSON.stringify({ ...raw, events: [...game.history, { type: 'conversation.advanced', conversationId: 'C2-CHAT', stepIndex }] })).kind).toBe('invalid');
    }
  });
});
