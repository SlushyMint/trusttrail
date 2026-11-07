import { StrictMode } from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { GameProvider } from '../../src/app/GameProvider';
import { useGame, useGameActions } from '../../src/app/game-context';
import { AudioService } from '../../src/features/audio/AudioService';
import { AudioServiceContext } from '../../src/features/audio/audio-context';
import { initialGame, reduceGame } from '../../src/engine/reducer';
import { encodeSave, SAVE_KEY } from '../../src/lib/persistence';

beforeEach(() => { localStorage.clear(); });
function Harness() {
  const { game } = useGame(); const { send, reloadLatest, startNew } = useGameActions();
  return <><output>{game.history.length}</output><button onClick={() => send({ type: 'evidence.inspected', evidenceId: 'C1-E01' })}>Inspect</button><button onClick={reloadLatest}>Restore</button><button onClick={() => startNew(true)}>New run</button></>;
}
function fixture() {
  let game = reduceGame(reduceGame(initialGame(), { type: 'run.started' }), { type: 'story.begun' });
  for (let lineIndex = 0; lineIndex < 4; lineIndex++) game = reduceGame(game, { type: 'line.advanced', nodeId: 'C1-intro', lineIndex });
  localStorage.setItem(SAVE_KEY, encodeSave(game, 1)); return game;
}
it('plays once for a genuine discovery, never for re-render, duplicate dispatch, refresh or explicit restoration', async () => {
  fixture(); const audio = new AudioService(); const cue = vi.spyOn(audio, 'cue').mockImplementation(() => {});
  const tree = <StrictMode><AudioServiceContext value={audio}><GameProvider><Harness /></GameProvider></AudioServiceContext></StrictMode>;
  const view = render(tree); expect(cue).not.toHaveBeenCalled();
  await userEvent.click(screen.getByText('Inspect')); expect(cue.mock.calls).toEqual([['evidence']]);
  await userEvent.click(screen.getByText('Inspect')); view.rerender(tree); expect(cue).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByText('Restore')); expect(cue).toHaveBeenCalledTimes(1);
  view.unmount(); render(tree); expect(cue).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByText('New run')); expect(cue.mock.calls.at(-1)).toEqual(['startup']); audio.dispose();
});
it('cannot make gameplay depend on an unavailable audio engine', async () => {
  const game = fixture(); const audio = new AudioService(); vi.stubGlobal('AudioContext', undefined);
  render(<AudioServiceContext value={audio}><GameProvider><Harness /></GameProvider></AudioServiceContext>);
  await userEvent.click(screen.getByText('Inspect')); await act(async () => {});
  expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).events).toHaveLength(game.history.length + 1);
  expect(audio.getSnapshot().status).toBe('unsupported'); audio.dispose(); vi.unstubAllGlobals();
});
