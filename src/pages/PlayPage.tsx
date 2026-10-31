import { useGame } from '../app/game-context';
import { currentChapter } from '../engine/reducer';
import { Briefing, ChapterComplete, DebriefView, DecisionView, NarrativeView, OutcomeView } from '../features/gameplay/ChapterViews';
import { useOs } from '../features/os/model';

/** Shared story/decision content; the OS never owns gameplay state. */
export function PlayPage() {
  const { game } = useGame();
  const { openApp } = useOs();
  const chapter = currentChapter(game);
  const position = game.position;
  return <div className="os-phase" data-phase={position.kind}>
    {position.kind === 'menu' || position.kind === 'briefing' ? <Briefing started={position.kind === 'briefing'} /> : null}
    {position.kind === 'narrative' ? <NarrativeView chapter={chapter} lineIndex={position.lineIndex} /> : null}
    {position.kind === 'decision' ? <DecisionView chapter={chapter} /> : null}
    {position.kind === 'verification' ? <section><h2 data-scene-focus tabIndex={-1}>Verifikasi melalui sumber terpisah.</h2><p>Keputusanmu sudah tercatat. Buka Browser, periksa detail sumber terpisah, lalu bandingkan dengan undangan.</p><button className="button button--primary" onClick={() => openApp('browser')}>Buka Browser</button></section> : null}
    {position.kind === 'outcome' ? <OutcomeView chapter={chapter} optionId={position.optionId} /> : null}
    {position.kind === 'debrief' ? <DebriefView chapter={chapter} optionId={position.optionId} /> : null}
    {position.kind === 'chapterComplete' ? <ChapterComplete chapter={chapter} /> : null}
  </div>;
}
