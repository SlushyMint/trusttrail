import { scenario } from '../content/scenario';
import { initialGame, reduceGame } from '../engine/reducer';
import type { GameEvent, GameState } from '../engine/types';

export const SAVE_KEY = 'trusttrail:save:v1';
export const MAX_SAVE_BYTES = 128 * 1024;
export const MAX_EVENTS = 1000;

type SaveEnvelope = { schemaVersion: 1; contentVersion: string; rubricVersion: 'v1'; revision: number; events: readonly GameEvent[] };
export type LoadResult = { kind: 'empty' | 'ready' | 'invalid' | 'incompatible' | 'unavailable'; game: GameState; raw: string | null | undefined; revision: number };
export type StoragePort = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function exactKeys(value: Record<string, unknown>, keys: readonly string[]) {
  return Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
}

const eventFields: Record<GameEvent['type'], readonly string[]> = {
  'run.started': [], 'story.begun': [],
  'chapter.continued': ['chapterId'], 'conversation.advanced': ['conversationId', 'stepIndex'],
  'line.advanced': ['nodeId', 'lineIndex'], 'evidence.inspected': ['evidenceId'],
  'reference.inspected': ['sourceId', 'inspectionId'], 'source.compared': ['sourceId'],
  'decision.opened': ['decisionId'], 'decision.closed': ['decisionId'],
  'choice.committed': ['decisionId', 'optionId'], 'outcome.continued': ['nodeId'], 'debrief.continued': ['nodeId'],
};

function gameEvent(value: unknown): value is GameEvent {
  if (!record(value) || typeof value.type !== 'string' || !Object.hasOwn(eventFields, value.type)) return false;
  const fields = eventFields[value.type as GameEvent['type']];
  if (!exactKeys(value, ['type', ...fields])) return false;
  return fields.every(key => key === 'lineIndex' || key === 'stepIndex'
    ? Number.isSafeInteger(value[key]) && Number(value[key]) >= 0
    : typeof value[key] === 'string' && value[key].length > 0 && value[key].length <= 128);
}

export function decodeSave(raw: string | null): LoadResult {
  const result = (kind: LoadResult['kind'], game = initialGame(), revision = 0): LoadResult => ({ kind, game, raw, revision });
  if (raw === null) return result('empty');
  if (raw.length > MAX_SAVE_BYTES || new TextEncoder().encode(raw).length > MAX_SAVE_BYTES) return result('invalid');
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return result('invalid'); }
  if (!record(value) || !exactKeys(value, ['schemaVersion', 'contentVersion', 'rubricVersion', 'revision', 'events'])) return result('invalid');
  if (value.schemaVersion !== 1 || value.contentVersion !== scenario.contentVersion || value.rubricVersion !== scenario.rubricVersion) return result('incompatible');
  if (!Number.isSafeInteger(value.revision) || Number(value.revision) < 0 || !Array.isArray(value.events) || value.events.length === 0 || value.events.length > MAX_EVENTS) return result('invalid');
  let state = initialGame();
  for (const event of value.events) {
    if (!gameEvent(event)) return result('invalid');
    const next = reduceGame(state, event);
    if (next === state) return result('invalid'); // Valid JSON is not necessarily a possible playthrough.
    state = next;
  }
  return result('ready', state, Number(value.revision));
}

export function encodeSave(game: GameState, revision: number): string {
  if (game.history.length > MAX_EVENTS) throw new Error('SAVE_LIMIT');
  const envelope: SaveEnvelope = { schemaVersion: 1, contentVersion: scenario.contentVersion, rubricVersion: 'v1', revision, events: game.history };
  const raw = JSON.stringify(envelope);
  if (new TextEncoder().encode(raw).length > MAX_SAVE_BYTES) throw new Error('SAVE_LIMIT');
  return raw;
}

export function readSave(storage?: StoragePort): LoadResult {
  try { return decodeSave((storage ?? window.localStorage).getItem(SAVE_KEY)); }
  catch { return { kind: 'unavailable', game: initialGame(), raw: undefined, revision: 0 }; }
}

/** Compare before writing; a competing tab requires an explicit player choice. */
export function writeSave(storage: StoragePort, expectedRaw: string | null | undefined, nextRaw: string): 'saved' | 'conflict' {
  const current = storage.getItem(SAVE_KEY);
  if (current !== (expectedRaw ?? null)) return 'conflict';
  storage.setItem(SAVE_KEY, nextRaw);
  if (storage.getItem(SAVE_KEY) !== nextRaw) throw new Error('SAVE_FAILED');
  return 'saved';
}

export function removeSave(storage: StoragePort): void {
  storage.removeItem(SAVE_KEY);
  if (storage.getItem(SAVE_KEY) !== null) throw new Error('REMOVE_FAILED');
}
