import { describe, expect, it } from 'vitest';
import { chapterOne } from '../../src/content/chapters/c1';
import { scenario } from '../../src/content/scenario';
import { chapterFacts, debriefNode, initialGame, outcomeNode, reduceGame } from '../../src/engine/reducer';
import type { GameEvent, GameState } from '../../src/engine/types';
import { validateScenario } from '../../src/engine/validate';

function investigation() {
  let state = reduceGame(initialGame(), { type: 'run.started' });
  state = reduceGame(state, { type: 'story.begun' });
  for (let lineIndex = 0; lineIndex < 4; lineIndex++) state = reduceGame(state, { type: 'line.advanced', nodeId: 'C1-intro', lineIndex });
  return state;
}
const reference: GameEvent = { type: 'reference.inspected', sourceId: 'C1-SOURCE', inspectionId: 'C1-LISTING' };
const compare: GameEvent = { type: 'source.compared', sourceId: 'C1-SOURCE' };
function choose(state: GameState, optionId: string) {
  state = reduceGame(state, { type: 'decision.opened', decisionId: 'D1' });
  return reduceGame(state, { type: 'choice.committed', decisionId: 'D1', optionId });
}

describe('Chapter 1 scenario and engine', () => {
  it('has complete, safe content references and outcomes', () => {
    expect(validateScenario(scenario)).toEqual([]);
    const broken = structuredClone(scenario);
    const chapter = broken.chapters[0]!;
    chapter.source.evidenceId = 'missing';
    chapter.email.destination = 'real-site.com';
    expect(validateScenario(broken)).toEqual(expect.arrayContaining(['Broken source evidence: C1-SOURCE', 'Unsafe destination: real-site.com']));
  });

  it('guards stale narrative cursor, future clues and decisions without losing the forward path', () => {
    const start = reduceGame(initialGame(), { type: 'run.started' });
    expect(reduceGame(start, { type: 'evidence.inspected', evidenceId: 'C1-E01' })).toBe(start);
    expect(reduceGame(start, { type: 'choice.committed', decisionId: 'D1', optionId: 'ignore' })).toBe(start);
    let state = reduceGame(start, { type: 'story.begun' });
    const advance: GameEvent = { type: 'line.advanced', nodeId: 'C1-intro', lineIndex: 0 };
    state = reduceGame(state, advance);
    expect(reduceGame(state, advance)).toBe(state);
    const workspace = investigation();
    expect(reduceGame(workspace, { type: 'evidence.inspected', evidenceId: 'C2-E01' })).toBe(workspace);
    expect(reduceGame(workspace, { type: 'decision.opened', decisionId: 'D2' })).toBe(workspace);
  });

  it('unlocks one clue exactly once and refuses direct source-comparison discovery', () => {
    let state = investigation();
    expect(reduceGame(state, { type: 'evidence.inspected', evidenceId: 'C1-E04' })).toBe(state);
    state = reduceGame(state, { type: 'evidence.inspected', evidenceId: 'C1-E01' });
    expect(Object.keys(state.discoveries)).toEqual(['C1-E01']);
    expect(reduceGame(state, { type: 'evidence.inspected', evidenceId: 'C1-E01' })).toBe(state);
  });

  it('requires meaningful detail inspection before comparison and reuses completed work', () => {
    let state = investigation();
    expect(reduceGame(state, compare)).toBe(state);
    expect(reduceGame(state, { ...reference, inspectionId: 'wrong' })).toBe(state);
    state = reduceGame(state, reference);
    expect(chapterFacts(state, chapterOne).verification).toBe(1);
    expect(state.discoveries['C1-E04']).toBeUndefined();
    state = reduceGame(state, compare);
    expect(reduceGame(state, compare)).toBe(state);
    state = choose(state, 'verify');
    expect(state.position.kind).toBe('outcome');
    expect(chapterFacts(state, chapterOne)).toMatchObject({ awareness: 1, verification: 2, safety: 2 });
  });

  it('freezes awareness at commit while allowing verification work in resolution', () => {
    let state = choose(investigation(), 'verify');
    expect(state.position.kind).toBe('verification');
    expect(chapterFacts(state, chapterOne)).toMatchObject({ awareness: 0, verification: 0, safety: 2 });
    state = reduceGame(state, reference);
    state = reduceGame(state, compare);
    expect(chapterFacts(state, chapterOne)).toMatchObject({ awareness: 0, verification: 2, safety: 2, lateEvidence: [{ id: 'C1-E04' }] });
    expect(reduceGame(state, reference)).toBe(state);
    expect(reduceGame(state, { type: 'evidence.inspected', evidenceId: 'C1-E01' })).toBe(state);
  });

  it.each([['follow-link', 0, true], ['ignore', 2, false], ['verify', 2, false]] as const)('resolves %s without a clue quota or dead end', (optionId, safety, exposed) => {
    let state = choose(investigation(), optionId);
    const committed = state;
    expect(reduceGame(state, { type: 'choice.committed', decisionId: 'D1', optionId })).toBe(committed);
    if (optionId === 'verify') { state = reduceGame(state, reference); state = reduceGame(state, compare); }
    expect(state.position.kind).toBe('outcome');
    state = reduceGame(state, { type: 'outcome.continued', nodeId: outcomeNode('D1', optionId) });
    expect(state.position.kind).toBe('debrief');
    expect(chapterFacts(state, chapterOne).safety).toBe(safety);
    expect(Boolean(state.flags.openedSuspiciousLink)).toBe(exposed);
    state = reduceGame(state, { type: 'debrief.continued', nodeId: debriefNode('D1', optionId) });
    expect(state.position.kind).toBe('chapterComplete');
    expect(state.choices.D1?.optionId).toBe(optionId);
    expect(reduceGame(state, compare)).toBe(state);
  });

  it('matches independently calculated full C1 fractions and replay determinism', () => {
    let state = investigation();
    for (const evidenceId of ['C1-E01', 'C1-E02', 'C1-E03']) state = reduceGame(state, { type: 'evidence.inspected', evidenceId });
    state = reduceGame(reduceGame(state, reference), compare);
    state = choose(state, 'verify');
    expect(chapterFacts(state, chapterOne)).toMatchObject({ awareness: 4, verification: 2, safety: 2 });
    expect(state.history.reduce((game, event) => reduceGame(game, event), initialGame())).toEqual(state);
  });

  it('matches the C1 prefix of the approved mixed trace without inventing comparison credit', () => {
    let state = investigation();
    state = reduceGame(state, { type: 'evidence.inspected', evidenceId: 'C1-E01' });
    state = reduceGame(state, { type: 'evidence.inspected', evidenceId: 'C1-E02' });
    state = reduceGame(state, reference);
    state = choose(state, 'follow-link');
    expect(chapterFacts(state, chapterOne)).toMatchObject({ awareness: 2, verification: 1, safety: 0 });
    expect(state.discoveries['C1-E04']).toBeUndefined();
  });
});
