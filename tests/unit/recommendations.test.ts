import { describe, expect, it } from 'vitest';
import { scenario } from '../../src/content/scenario';
import { initialGame, reduceGame, chapterFacts } from '../../src/engine/reducer';
import { reportRecommendations } from '../../src/engine/recommendations';
import { recoverySteps, reportReady } from '../../src/engine/recovery';
import { decodeSave, encodeSave } from '../../src/lib/persistence';
import type { GameEvent } from '../../src/engine/types';

function journey({ unsafe = false, inspect = false, reference = 0, late = false } = {}) {
  let game = initialGame();
  const send = (event: GameEvent) => { game = reduceGame(game, event); };
  send({ type: 'run.started' }); send({ type: 'story.begun' });
  for (const chapter of scenario.chapters) {
    chapter.intro.forEach((_, lineIndex) => send({ type: 'line.advanced', nodeId: `${chapter.id}-intro`, lineIndex }));
    chapter.conversation?.exchanges.forEach((_, stepIndex) => send({ type: 'conversation.advanced', conversationId: chapter.conversation!.id, stepIndex }));
    if (chapter.portal) send({ type: 'portal.opened', chapterId: chapter.id });
    if (inspect || chapter.portal) chapter.evidence.filter(clue => clue.discovery === 'hotspot').forEach(clue => send({ type: 'evidence.inspected', evidenceId: clue.id }));
    if (reference || chapter.portal) send({ type: 'reference.inspected', sourceId: chapter.source.id, inspectionId: chapter.source.inspectionId });
    chapter.portal?.comparisons.forEach(item => send({ type: 'claim.matched', comparisonId: item.id, answerId: item.correctAnswerId }));
    if (reference === 2 || chapter.portal) send({ type: 'source.compared', sourceId: chapter.source.id });
    const optionId = chapter.id === 'C1' ? unsafe ? 'follow-link' : 'ignore' : chapter.id === 'C2' ? unsafe ? 'share-data' : 'decline' : unsafe ? 'share-code' : 'stop-verify';
    send({ type: 'decision.opened', decisionId: chapter.decision.id });
    send({ type: 'choice.committed', decisionId: chapter.decision.id, optionId });
    send({ type: 'outcome.continued', nodeId: `${chapter.decision.id}-${optionId}-outcome` });
    if (chapter.portal) {
      recoverySteps(game).forEach(step => send({ type: 'recovery.acted', stepId: step.id, actionId: step.correctActionId }));
      send({ type: 'recovery.completed', chapterId: chapter.id });
    }
    send({ type: 'debrief.continued', nodeId: `${chapter.decision.id}-${optionId}-debrief` });
    if (chapter.id !== 'C3') send({ type: 'chapter.continued', chapterId: chapter.id });
  }
  expect(reportReady(game)).toBe(true);
  if (late) game = { ...game, discoveries: { ...game.discoveries, 'C1-E01': { eventIndex: game.history.length } } };
  return game;
}

describe('personalized report practice', () => {
  it('prioritizes code, identity and unverified link decisions with reasons', () => {
    const items = reportRecommendations(journey({ unsafe: true }));
    expect(items.map(item => item.id)).toEqual(['C3', 'C2', 'C1']);
    expect(items[0]!.action).toContain('aplikasi resmi layanan email');
    expect(items[1]!.context).toContain('Riwayat profil');
    expect(items.every(item => item.action && item.why)).toBe(true);
  });
  it('names missed evidence and uninspected verification even after safe choices', () => {
    const items = reportRecommendations(journey());
    expect(items.map(item => item.id)).toEqual(['C1', 'C2']);
    expect(items[0]!.action).toContain('Periksa pengirim');
    expect(items[0]!.context).toContain('Verifikasi 0/2');
    expect(items[1]!.context).toContain('Data identitas sebelum wawancara');
  });
  it('distinguishes inspecting a source from comparing it', () => {
    const items = reportRecommendations(journey({ inspect: true, reference: 1 }));
    expect(items[0]!.context).toContain('Verifikasi 1/2');
    expect(items[0]!.context).toContain('sumber yang telah diperiksa');
  });
  it('uses the decision snapshot rather than crediting later evidence', () => {
    const items = reportRecommendations(journey({ late: true }));
    expect(items[0]!.context).toContain('Alamat di balik nama pengirim');
    expect(items[0]!.context).toContain('belakangan');
  });
  it('gives two maintenance actions for a fully investigated safe history', () => {
    const items = reportRecommendations(journey({ inspect: true, reference: 2 }));
    expect(items.map(item => item.id)).toEqual(['maintain-data', 'maintain-code']);
    expect(items.every(item => !item.context)).toBe(true);
  });
  it('preserves scores and serialized saves, and derives identical advice after replay', () => {
    const game = journey({ unsafe: true, inspect: true, reference: 2 });
    const before = encodeSave(game, 1);
    const facts = scenario.chapters.map(chapter => chapterFacts(game, chapter));
    const items = reportRecommendations(game);
    expect(encodeSave(game, 1)).toBe(before);
    expect(scenario.chapters.map(chapter => chapterFacts(game, chapter))).toEqual(facts);
    const restored = decodeSave(before);
    expect(restored.kind).toBe('ready');
    if (restored.kind === 'ready') expect(reportRecommendations(restored.game)).toEqual(items);
  });
  it('does not advise a player without recorded choices', () => {
    expect(reportRecommendations(initialGame())).toEqual([]);
  });
});
