import { useCallback, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { initialGame, reduceGame } from '../engine/reducer';
import type { GameEvent, GameState } from '../engine/types';
import { encodeSave, readSave, removeSave, SAVE_KEY, writeSave, type LoadResult } from '../lib/persistence';
import { GameActionsContext, GameStateContext, type GameActions, type SaveStatus } from './game-context';
import { useAudioService } from '../features/audio/audio-context';
import { cueForAction } from '../features/audio/score';

type ViewAction = GameEvent | { type: 'session.restored'; game: GameState };
function viewReducer(game: GameState, action: ViewAction) {
  return action.type === 'session.restored' ? action.game : reduceGame(game, action);
}
const messages: Record<SaveStatus['kind'], string> = {
  empty: 'Progres akan disimpan hanya di browser ini. Tidak ada akun atau sinkronisasi antarperangkat.',
  saved: 'Tersimpan di browser ini.',
  invalid: 'Simpanan tidak dapat dibaca. Data lama belum ditimpa. Mulai ulang dengan konfirmasi untuk bermain kembali.',
  incompatible: 'Simpanan berasal dari versi cerita yang berbeda. Data lama belum ditimpa; mulai ulang untuk memakai cerita ini.',
  memory: 'Penyimpanan browser tidak tersedia. Kamu tetap bisa bermain; progres baru dapat hilang saat halaman dimuat ulang.',
  conflict: 'Progres berubah di tab lain. Penyimpanan tab ini dijeda. Muat progres terbaru atau pilih untuk menggantinya.',
  limit: 'Batas simpan lokal tercapai. Permainan tetap berjalan, tetapi progres berikutnya hanya ada di tab ini.',
};
function loadedStatus(load: LoadResult): SaveStatus {
  const kind = load.kind === 'ready' ? 'saved' : load.kind === 'unavailable' ? 'memory' : load.kind;
  return { kind, message: messages[kind], hasStoredSave: load.raw != null };
}

export function GameProvider({ children }: { children: ReactNode }) {
  const audio = useAudioService();
  const [loaded] = useState(() => readSave());
  const [game, dispatch] = useReducer(viewReducer, loaded.game);
  const [save, setSave] = useState(() => loadedStatus(loaded));
  // Synchronous cursor guards rapid successive commands; the reducer and durable log stay pure.
  const latest = useRef(loaded.game);
  const session = useRef({ raw: loaded.raw, revision: loaded.revision, paused: false });

  const status = useCallback((kind: SaveStatus['kind'], message = messages[kind]) => {
    setSave({ kind, message, hasStoredSave: session.current.raw != null });
  }, []);

  const persist = useCallback((next: GameState) => {
    if (session.current.paused) { status('conflict'); return; }
    try {
      const revision = session.current.revision + 1;
      const raw = encodeSave(next, revision);
      if (writeSave(window.localStorage, session.current.raw, raw) === 'conflict') {
        session.current.paused = true;
        status('conflict');
        return;
      }
      session.current.raw = raw;
      session.current.revision = revision;
      status('saved');
    } catch (error) { status(error instanceof Error && error.message === 'SAVE_LIMIT' ? 'limit' : 'memory'); }
  }, [status]);

  const restore = useCallback((next: GameState) => {
    latest.current = next;
    dispatch({ type: 'session.restored', game: next });
  }, []);

  const send = useCallback((event: GameEvent) => {
    const previous = latest.current;
    const next = reduceGame(previous, event);
    if (next === latest.current) return;
    latest.current = next;
    persist(next); // Save accepted actions now, rather than depending on unload or a debounce.
    dispatch(event);
    const cue = cueForAction(previous, next, event);
    if (cue) audio?.cue(cue);
  }, [persist, audio]);

  const startNew = useCallback((replaceStored = false) => {
    if (replaceStored) {
      try { session.current.raw = window.localStorage.getItem(SAVE_KEY); session.current.paused = false; }
      catch { status('memory'); }
    }
    const next = reduceGame(initialGame(), { type: 'run.started' });
    restore(next);
    persist(next);
    audio?.cue('startup');
  }, [persist, restore, status, audio]);

  const reloadLatest = useCallback(() => {
    const load = readSave();
    session.current = { raw: load.raw, revision: load.revision, paused: false };
    restore(load.game);
    setSave(loadedStatus(load));
  }, [restore]);

  const replaceOtherSave = useCallback(() => {
    try {
      session.current.raw = window.localStorage.getItem(SAVE_KEY);
      session.current.paused = false;
      persist(latest.current);
    } catch { status('memory'); }
  }, [persist, status]);

  const reset = useCallback(() => {
    try {
      removeSave(window.localStorage);
      session.current = { raw: null, revision: 0, paused: false };
      restore(initialGame());
      status('empty', 'Progres TrustTrail telah dihapus dari browser ini.');
    } catch {
      status('memory', 'Progres belum berhasil dihapus. Periksa izin penyimpanan browser lalu coba lagi; simpanan lama mungkin masih ada.');
    }
  }, [restore, status]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if ((event.key === SAVE_KEY || event.key === null) && event.newValue !== session.current.raw) {
        session.current.paused = true;
        status('conflict');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [status]);

  const hasUnsavedProgress = game.history.length > 0 && (save.kind === 'memory' || save.kind === 'limit' || save.kind === 'conflict');
  useEffect(() => {
    if (!hasUnsavedProgress) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedProgress]);

  const retrySave = useCallback(() => { if (latest.current.history.length) persist(latest.current); else reloadLatest(); }, [persist, reloadLatest]);
  const actions = useMemo<GameActions>(() => ({ send, startNew, reset, retrySave, reloadLatest, replaceOtherSave }), [send, startNew, reset, retrySave, reloadLatest, replaceOtherSave]);
  return <GameActionsContext value={actions}><GameStateContext value={{ game, save }}>{children}</GameStateContext></GameActionsContext>;
}
