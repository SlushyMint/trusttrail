import { describe, expect, it } from 'vitest';
import { initialGame, reduceGame } from '../../src/engine/reducer';
import { decodeSave, encodeSave, MAX_SAVE_BYTES, readSave, removeSave, SAVE_KEY, writeSave, type StoragePort } from '../../src/lib/persistence';

const game = reduceGame(initialGame(), { type: 'run.started' });
const raw = encodeSave(game, 1);
function memoryStorage(initial: string | null = null): StoragePort {
  let value = initial;
  return { getItem: () => value, setItem: (_key, next) => { value = next; }, removeItem: () => { value = null; } };
}

describe('bounded save validation and storage', () => {
  it('replays only the accepted event log, without persisting derived flags or scores', () => {
    expect(decodeSave(raw)).toMatchObject({ kind: 'ready', game, revision: 1 });
    expect(Object.keys(JSON.parse(raw))).toEqual(['schemaVersion', 'contentVersion', 'rubricVersion', 'revision', 'events']);
    expect(decodeSave(null).kind).toBe('empty');
  });

  it.each([
    'bad json', '[]', 'x'.repeat(MAX_SAVE_BYTES + 1),
    JSON.stringify({ ...JSON.parse(raw), scores: { safety: 100 } }),
    raw.replace('"revision":1', '"revision":-1'),
    raw.replace('"run.started"', '"__proto__"'),
    raw.replace('"run.started"', '"story.begun"'),
    JSON.stringify({ ...JSON.parse(raw), events: [{ type: 'run.started' }, { type: 'run.started' }] }),
    JSON.stringify({ ...JSON.parse(raw), events: [{ type: 'run.started', injected: true }] }),
    JSON.stringify({ ...JSON.parse(raw), events: [] }),
    JSON.stringify({ ...JSON.parse(raw), events: Array.from({ length: 1001 }, () => ({ type: 'run.started' })) }),
  ])('rejects corrupt, oversized, duplicate or impossible histories (%#)', value => {
    expect(decodeSave(value).kind).toBe('invalid');
  });

  it('distinguishes incompatible content and leaves the original storage intact on read', () => {
    const old = raw.replace('trusttrail-1', 'old-content');
    const storage = memoryStorage(old);
    expect(readSave(storage).kind).toBe('incompatible');
    expect(storage.getItem(SAVE_KEY)).toBe(old);
  });

  it('does not overwrite another tab and verifies writes/removal', () => {
    const storage = memoryStorage(raw);
    expect(writeSave(storage, null, 'new')).toBe('conflict');
    expect(storage.getItem(SAVE_KEY)).toBe(raw);
    expect(writeSave(storage, raw, 'new')).toBe('saved');
    removeSave(storage);
    expect(storage.getItem(SAVE_KEY)).toBeNull();
  });

  it('handles blocked storage without requiring permission to play', () => {
    const blocked: StoragePort = { getItem: () => { throw new Error('blocked'); }, setItem: () => { throw new Error('full'); }, removeItem: () => { throw new Error('blocked'); } };
    expect(readSave(blocked).kind).toBe('unavailable');
    expect(() => removeSave(blocked)).toThrow();
    expect(reduceGame(game, { type: 'story.begun' }).position.kind).toBe('narrative');
  });

  it('restores exact narrative, investigation, committed resolution, outcome, debrief and checkpoint cursors', () => {
    let state = reduceGame(game, { type: 'story.begun' });
    const check = () => expect(decodeSave(encodeSave(state, state.history.length)).game).toEqual(state);
    check();
    for (let lineIndex = 0; lineIndex < 4; lineIndex++) state = reduceGame(state, { type: 'line.advanced', nodeId: 'C1-intro', lineIndex });
    check();
    state = reduceGame(state, { type: 'decision.opened', decisionId: 'D1' });
    state = reduceGame(state, { type: 'choice.committed', decisionId: 'D1', optionId: 'verify' });
    check();
    state = reduceGame(state, { type: 'reference.inspected', sourceId: 'C1-SOURCE', inspectionId: 'C1-LISTING' });
    check();
    state = reduceGame(state, { type: 'source.compared', sourceId: 'C1-SOURCE' });
    check();
    state = reduceGame(state, { type: 'outcome.continued', nodeId: 'D1-verify-outcome' });
    check();
    state = reduceGame(state, { type: 'debrief.continued', nodeId: 'D1-verify-debrief' });
    check();
  });
});
