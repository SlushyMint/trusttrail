import { createContext, useContext } from 'react';
import type { GameEvent, GameState } from '../engine/types';

export type SaveStatus = { kind: 'empty' | 'saved' | 'invalid' | 'incompatible' | 'memory' | 'conflict' | 'limit'; message: string; hasStoredSave: boolean };
export type GameActions = {
  send: (event: GameEvent) => void;
  startNew: (replaceStored?: boolean) => void;
  reset: () => void;
  retrySave: () => void;
  reloadLatest: () => void;
  replaceOtherSave: () => void;
};
export const GameStateContext = createContext<{ game: GameState; save: SaveStatus } | null>(null);
export const GameActionsContext = createContext<GameActions | null>(null);

export function useGame() {
  const state = useContext(GameStateContext);
  if (!state) throw new Error('GameProvider diperlukan.');
  return state;
}
export function useGameActions() {
  const actions = useContext(GameActionsContext);
  if (!actions) throw new Error('GameProvider diperlukan.');
  return actions;
}
