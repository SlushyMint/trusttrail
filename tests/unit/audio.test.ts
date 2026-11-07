import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AUDIO_KEY, LEGACY_AUDIO_KEY, DEFAULT_AUDIO, decodeAudio } from '../../src/features/audio/preferences';
import { AudioService } from '../../src/features/audio/AudioService';
import { initialGame, reduceGame } from '../../src/engine/reducer';
import { cueForAction } from '../../src/features/audio/score';
import { scenario } from '../../src/content/scenario';
import { recoverySteps } from '../../src/engine/recovery';
import type { GameEvent } from '../../src/engine/types';

function parameter() { return { value: 0, setValueAtTime: vi.fn(), setTargetAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn(), cancelScheduledValues: vi.fn() }; }
function node() { return { connect: vi.fn(), disconnect: vi.fn(), gain: parameter(), frequency: parameter(), start: vi.fn(), stop: vi.fn(), onended: null as (() => void) | null }; }
function fakeContext() {
  const oscillators: ReturnType<typeof node>[] = [];
  return { state: 'suspended', currentTime: 0, destination: node(), createGain: vi.fn(node), createOscillator: vi.fn(() => { const voice = node(); oscillators.push(voice); return voice; }), resume: vi.fn(async function (this: { state: string }) { this.state = 'running'; }), suspend: vi.fn(async function (this: { state: string }) { this.state = 'suspended'; }), close: vi.fn(async function (this: { state: string }) { this.state = 'closed'; }), oscillators };
}
// Drain the full resume/catch/finally chain, rather than assuming a microtask count.
const flush = async () => { await new Promise(resolve => setTimeout(resolve, 0)); };
beforeEach(() => { localStorage.clear(); });

describe('audio preference boundary', () => {
  it('defaults to restrained SFX volume and does not allocate browser audio on restore or control edits', () => {
    const factory = vi.fn(); vi.stubGlobal('AudioContext', factory);
    const audio = new AudioService();
    expect(audio.getSnapshot().preferences).toEqual(DEFAULT_AUDIO);
    audio.setVolume(0.3); audio.setMuted(true); audio.setMuted(false);
    expect(factory).not.toHaveBeenCalled(); audio.dispose();
    vi.unstubAllGlobals();
  });
  it.each(['{}', 'null', '[]', 'not-json', 'x'.repeat(513), JSON.stringify({ ...DEFAULT_AUDIO, version: 3 }), JSON.stringify({ ...DEFAULT_AUDIO, volume: -1 }), JSON.stringify({ ...DEFAULT_AUDIO, volume: 2 }), '{"version":2,"muted":false,"volume":1e400}', JSON.stringify({ ...DEFAULT_AUDIO, muted: 'false' }), JSON.stringify({ version: 1, sfx: 'true', muted: false, volume: 0.2 }), JSON.stringify({ ...DEFAULT_AUDIO, extra: '<img onerror=alert(1)>' })])('rejects malformed or unexpected preferences (%#)', raw => { expect(decodeAudio(raw)).toEqual(DEFAULT_AUDIO); });
  it.each([[true, false, false], [true, true, true], [false, false, true], [false, true, true]])('preserves effective mute from legacy sfx=%s muted=%s', (sfx, muted, expected) => {
    for (const music of [true, false, '<script>throw 1</script>', { unexpected: true }]) {
      expect(decodeAudio(JSON.stringify({ version: 1, sfx, muted, volume: 0.2, music }))).toEqual({ version: 2, muted: expected, volume: 0.2 });
    }
  });
  it('migrates on an explicit edit, prefers v2 next time, and leaves gameplay and legacy storage untouched', () => {
    const legacy = JSON.stringify({ version: 1, sfx: false, music: true, muted: false, volume: 0.2 });
    localStorage.setItem(LEGACY_AUDIO_KEY, legacy); localStorage.setItem('trusttrail:save:v1', 'untouched');
    const audio = new AudioService(); expect(audio.getSnapshot().preferences).toEqual({ version: 2, muted: true, volume: 0.2 });
    expect(localStorage.getItem(AUDIO_KEY)).toBeNull(); audio.setMuted(false);
    expect(JSON.parse(localStorage.getItem(AUDIO_KEY)!)).toEqual({ version: 2, muted: false, volume: 0.2 });
    expect(new AudioService().getSnapshot().preferences).toEqual({ version: 2, muted: false, volume: 0.2 });
    expect(localStorage.getItem(LEGACY_AUDIO_KEY)).toBe(legacy);
    expect(localStorage.getItem('trusttrail:save:v1')).toBe('untouched'); audio.dispose();
  });
});

describe('single browser audio owner', () => {
  function setup() { const context = fakeContext(); const factory = vi.fn(function () { return context; }); vi.stubGlobal('AudioContext', factory); const audio = new AudioService(); return { context, factory, audio }; }
  it('reuses one context for different SFX and closes/disconnects every owned resource', async () => {
    const { audio, context, factory } = setup();
    audio.cue('startup'); await flush(); audio.cue('evidence'); await flush();
    expect(factory).toHaveBeenCalledOnce(); expect(context.oscillators).toHaveLength(5);
    audio.dispose();
    expect(context.oscillators.every(voice => voice.disconnect.mock.calls.length === 1)).toBe(true);
    expect(context.createGain.mock.results.every(result => result.value.disconnect.mock.calls.length === 1)).toBe(true);
    expect(context.close).toHaveBeenCalledOnce(); vi.unstubAllGlobals();
  });
  it('survives autoplay rejection and permits a new explicit retry without a second context', async () => {
    const { audio, context, factory } = setup(); context.resume.mockRejectedValueOnce(new Error('NotAllowedError'));
    audio.cue('application'); await flush(); expect(audio.getSnapshot().status).toBe('blocked');
    expect(context.oscillators).toHaveLength(0); audio.retry(); await flush();
    expect(factory).toHaveBeenCalledOnce(); expect(context.oscillators).toHaveLength(2); audio.dispose(); vi.unstubAllGlobals();
  });
  it('cancels pending activation when muted or hidden and never replays it later', async () => {
    const { audio, context } = setup(); let release!: () => void;
    context.resume.mockImplementationOnce(() => new Promise<void>(resolve => { release = () => { context.state = 'running'; resolve(); }; }));
    audio.cue('evidence'); audio.setMuted(true); release(); await flush();
    expect(context.oscillators).toHaveLength(0); audio.setMuted(false); await flush(); expect(context.oscillators).toHaveLength(0); audio.dispose(); vi.unstubAllGlobals();
  });
  it('bounds repeated feedback and releases short voices on completion', async () => {
    const { audio, context } = setup(); audio.cue('evidence'); audio.cue('evidence'); await flush();
    expect(context.oscillators).toHaveLength(2); context.oscillators.forEach(voice => voice.onended?.());
    expect(context.oscillators.every(voice => voice.disconnect.mock.calls.length === 1)).toBe(true);
    expect(context.suspend).toHaveBeenCalled(); audio.dispose(); vi.unstubAllGlobals();
  });
  it('silences active voices on mute/zero volume and never replays them after unmute', async () => {
    const { audio, context } = setup(); audio.cue('startup'); await flush(); expect(context.oscillators).toHaveLength(3);
    audio.setMuted(true); await flush(); expect(context.state).toBe('suspended');
    expect(context.oscillators.every(voice => voice.disconnect.mock.calls.length === 1)).toBe(true);
    audio.setMuted(false); await flush(); expect(context.state).toBe('suspended'); expect(context.oscillators).toHaveLength(3);
    audio.cue('evidence'); await flush(); expect(context.oscillators).toHaveLength(5);
    audio.setVolume(0); audio.cue('final'); await flush(); expect(context.state).toBe('suspended'); expect(context.oscillators).toHaveLength(5);
    audio.setVolume(0.2); await flush(); expect(context.oscillators).toHaveLength(5); expect(context.state).toBe('suspended');
    audio.cue('verification'); await flush(); expect(context.oscillators).toHaveLength(8); audio.dispose(); vi.unstubAllGlobals();
  });
  it('drops hidden-tab cues and resumes only for a new explicit action after visibility returns', async () => {
    const { audio, context } = setup(); audio.cue('startup'); await flush();
    audio.setHidden(true); audio.cue('evidence'); await flush(); expect(context.state).toBe('suspended');
    audio.setHidden(false); await flush(); expect(context.oscillators).toHaveLength(3); expect(context.state).toBe('suspended');
    audio.cue('verification'); await flush(); expect(context.oscillators).toHaveLength(6); expect(context.state).toBe('running'); audio.dispose(); vi.unstubAllGlobals();
  });
  it('falls back silently when storage/audio APIs are unavailable', async () => {
    vi.stubGlobal('AudioContext', undefined); const audio = new AudioService();
    audio.cue('evidence'); await flush(); expect(audio.getSnapshot().status).toBe('unsupported');
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('blocked'); }); audio.setMuted(true);
    expect(audio.getSnapshot()).toMatchObject({ persistent: false, preferences: { muted: true } }); audio.dispose(); vi.unstubAllGlobals();
  });
});

it('cues only newly accepted actions; duplicate actions and restored state produce no feedback', () => {
  let game = initialGame();
  const next = reduceGame(game, { type: 'run.started' }); expect(cueForAction(game, next, { type: 'run.started' })).toBe('startup');
  game = next; expect(cueForAction(game, reduceGame(game, { type: 'run.started' }), { type: 'run.started' })).toBeUndefined();
  for (const event of [{ type: 'story.begun' } as const, ...[0, 1, 2, 3].map(lineIndex => ({ type: 'line.advanced', nodeId: 'C1-intro', lineIndex } as const))]) game = reduceGame(game, event);
  const event = { type: 'evidence.inspected', evidenceId: 'C1-E01' } as const;
  const found = reduceGame(game, event); expect(cueForAction(game, found, event)).toBe('evidence'); expect(cueForAction(found, reduceGame(found, event), event)).toBeUndefined();
});

it('reinforces incoming messages, verification and chapter/final completion without cueing a decision option', () => {
  let game = initialGame();
  const cues: string[] = [];
  function send(event: GameEvent) {
    const next = reduceGame(game, event); expect(next).not.toBe(game);
    const cue = cueForAction(game, next, event); if (cue) cues.push(cue);
    if (event.type === 'choice.committed') expect(cue).toBeUndefined();
    game = next;
  }
  send({ type: 'run.started' }); send({ type: 'story.begun' });
  for (const chapter of scenario.chapters) {
    chapter.intro.forEach((_, lineIndex) => send({ type: 'line.advanced', nodeId: `${chapter.id}-intro`, lineIndex }));
    chapter.conversation?.exchanges.forEach((_, stepIndex) => send({ type: 'conversation.advanced', conversationId: chapter.conversation!.id, stepIndex }));
    if (chapter.portal) send({ type: 'portal.opened', chapterId: chapter.id });
    send({ type: 'reference.inspected', sourceId: chapter.source.id, inspectionId: chapter.source.inspectionId });
    for (const item of chapter.portal?.comparisons ?? []) {
      send({ type: 'evidence.inspected', evidenceId: item.evidenceId });
      send({ type: 'claim.matched', comparisonId: item.id, answerId: item.correctAnswerId });
    }
    send({ type: 'source.compared', sourceId: chapter.source.id });
    const optionId = chapter.id === 'C1' ? 'ignore' : chapter.id === 'C2' ? 'decline' : 'stop-verify';
    send({ type: 'decision.opened', decisionId: chapter.decision.id }); send({ type: 'choice.committed', decisionId: chapter.decision.id, optionId });
    send({ type: 'outcome.continued', nodeId: `${chapter.decision.id}-${optionId}-outcome` });
    if (chapter.portal) {
      for (const step of recoverySteps(game)) send({ type: 'recovery.acted', stepId: step.id, actionId: step.correctActionId });
      send({ type: 'recovery.completed', chapterId: chapter.id });
    }
    send({ type: 'debrief.continued', nodeId: `${chapter.decision.id}-${optionId}-debrief` });
    if (chapter.id !== 'C3') send({ type: 'chapter.continued', chapterId: chapter.id });
  }
  expect(cues.filter(cue => cue === 'chapter')).toHaveLength(2);
  expect(cues.filter(cue => cue === 'final')).toHaveLength(1);
  expect(cues).toEqual(expect.arrayContaining(['startup', 'message', 'evidence', 'verification']));
});
