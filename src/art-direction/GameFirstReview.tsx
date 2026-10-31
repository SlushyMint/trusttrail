import { useEffect, useReducer, useRef, useState } from 'react';
import { GameActionsContext, GameStateContext, useGame, useGameActions, type GameActions } from '../app/game-context';
import { Button } from '../components/ui/Button';
import { Drawer } from '../components/ui/Drawer';
import { TrailMark } from '../components/TrailMark';
import { currentChapter, initialGame, reduceGame } from '../engine/reducer';
import type { GameEvent, GameState } from '../engine/types';
import { DecisionView, DebriefView, OutcomeView } from '../features/gameplay/ChapterViews';
import { EvidenceJournal } from '../features/gameplay/EvidenceJournal';
import { SourcePanel } from '../features/gameplay/SourcePanel';
import { MailClient } from './MailClient';
import roomSmall from './assets/room-afternoon-800.webp';
import roomLarge from './assets/room-afternoon-1600.webp';
import curiousSmall from './assets/ari-curious-480.webp';
import curiousLarge from './assets/ari-curious-800.webp';
import uncertainSmall from './assets/ari-uncertain-480.webp';
import uncertainLarge from './assets/ari-uncertain-800.webp';
import composedSmall from './assets/ari-composed-480.webp';
import composedLarge from './assets/ari-composed-800.webp';
import stationery from './assets/stationery-480.webp';

const noAction = () => {};
const expressions = {
  curious: [curiousSmall, curiousLarge, 'Ari menimbang undangan dengan rasa ingin tahu.'],
  uncertain: [uncertainSmall, uncertainLarge, 'Ari ragu dan mempertimbangkan informasi yang diterimanya.'],
  composed: [composedSmall, composedLarge, 'Ari bersikap tenang saat mempertimbangkan langkah berikutnya.'],
} as const;
type Artifact = 'email' | 'campus' | 'source';
const modes = {
  menu: 'Pembuka', briefing: 'Pembuka', narrative: 'Cerita', investigation: 'Investigasi',
  decision: 'Keputusan', verification: 'Verifikasi', outcome: 'Akibat pilihan', recovery: 'Pemulihan', debrief: 'Refleksi', chapterComplete: 'Bab selesai',
} as const;

/** Review-only entry: canonical reducer/content, deliberately no persistence adapter. */
function initialReview(): GameState {
  let game = reduceGame(initialGame(), { type: 'run.started' });
  game = reduceGame(game, { type: 'story.begun' });
  if (new URLSearchParams(window.location.search).get('scene') === 'story') return game;
  const chapter = currentChapter(game);
  for (let lineIndex = 0; lineIndex < chapter.intro.length; lineIndex++) {
    game = reduceGame(game, { type: 'line.advanced', nodeId: `${chapter.id}-intro`, lineIndex });
  }
  return game;
}

export function GameFirstReview() {
  const [game, send] = useReducer((state: GameState, event: GameEvent) => reduceGame(state, event), undefined, initialReview);
  const actions: GameActions = { send, startNew: noAction, reset: noAction, retrySave: noAction, reloadLatest: noAction, replaceOtherSave: noAction };
  return <GameActionsContext value={actions}><GameStateContext value={{ game, save: { kind: 'memory', message: 'Pratinjau visual · Progres tidak disimpan.', hasStoredSave: false } }}><ReviewStage /></GameStateContext></GameActionsContext>;
}

function Portrait({ expression }: { expression: keyof typeof expressions }) {
  const [failed, setFailed] = useState(false);
  const [small, large, alt] = expressions[expression];
  return <div className="gf-portrait">{failed ? <svg className="gf-portrait-fallback" viewBox="0 0 240 300" aria-hidden="true"><path d="M52 297v-60q0-66 68-66t68 66v60M77 107q0-63 43-63t43 63q0 59-43 59t-43-59" /></svg> : <img src={large} srcSet={`${small} 480w, ${large} 800w`} sizes="(max-width: 700px) 150px, (max-width: 1100px) 280px, 430px" width="800" height="1200" alt={alt} decoding="async" onError={() => setFailed(true)} />}</div>;
}

function ReviewStage() {
  const { game } = useGame();
  const { send } = useGameActions();
  const chapter = currentChapter(game);
  const position = game.position;
  const [artifact, setArtifact] = useState<Artifact | null>('email');
  const [drawer, setDrawer] = useState<'journal' | 'menu' | 'backlog' | null>(null);
  const [roomFailed, setRoomFailed] = useState(false);
  const stage = useRef<HTMLElement>(null);
  const roomTrigger = useRef<HTMLButtonElement>(null);
  const phaseKey = `${position.kind}${position.kind === 'narrative' ? position.lineIndex : ''}`;
  const previous = useRef(phaseKey);
  const previousArtifact = useRef(artifact);
  useEffect(() => {
    if (previous.current === phaseKey) return;
    previous.current = phaseKey;
    const focus = stage.current?.querySelector<HTMLElement>('.gf-mode-document [data-scene-focus], .gf-inspector .gf-reading') ?? stage.current?.querySelector<HTMLElement>('[data-scene-focus]');
    focus?.focus();
  }, [phaseKey]);
  useEffect(() => {
    if (previousArtifact.current !== artifact && artifact !== null) stage.current?.querySelector<HTMLElement>('.gf-reading')?.focus();
    previousArtifact.current = artifact;
  }, [artifact]);
  const count = chapter.evidence.filter(clue => game.discoveries[clue.id]).length;
  const last = game.history.at(-1);
  const found = last?.type === 'evidence.inspected' ? chapter.evidence.find(clue => clue.id === last.evidenceId) : last?.type === 'source.compared' ? chapter.evidence.find(clue => clue.id === chapter.source.evidenceId) : undefined;
  const line = position.kind === 'narrative' ? chapter.intro[position.lineIndex]! : null;
  const expression = position.kind === 'decision' || position.kind === 'debrief' ? 'composed' : line?.id === 'C1-L04' ? 'uncertain' : 'curious';
  const investigating = position.kind === 'investigation';
  const showingArtifact = investigating && artifact !== null;
  const seenLines = chapter.intro.slice(0, position.kind === 'narrative' ? position.lineIndex + 1 : undefined);

  return <div className="gf-root" data-mode={position.kind}>
    <a className="skip-link" href="#review-stage">Lewati ke permainan</a>
    <div className="gf-review-label"><span>Usulan arah visual · Bab 1</span><span>Pratinjau saja · Progres tidak disimpan</span><a href="/">Buka game saat ini <span aria-hidden="true">↗</span></a></div>
    <header className="gf-hud">
      <a className="gf-brand" href="/" aria-label="TrustTrail, buka game saat ini"><TrailMark /><span>TrustTrail<span>.</span></span></a>
      <div className="gf-case-title"><p>Bab 1 · {modes[position.kind]}</p><h1>{chapter.title}</h1></div>
      <p className="gf-simulation">Simulasi fiktif<br /><span>Tanpa data pribadi</span></p>
      <button className="gf-hud-action" onClick={() => setDrawer('journal')} aria-haspopup="dialog"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7V4h7l2 3h9v13H3zM3 10h18" /></svg><span>Jurnal <strong>{count}</strong></span></button>
      <button className="gf-hud-action gf-menu-button" onClick={() => setDrawer('menu')} aria-haspopup="dialog">Menu <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg></button>
    </header>
    <main id="review-stage" ref={stage} tabIndex={-1} className={`gf-stage${showingArtifact ? ' gf-stage--inspecting' : ''}${!investigating && !line ? ' gf-stage--document' : ''}${roomFailed ? ' gf-stage--fallback' : ''}`}>
      {!roomFailed ? <img className="gf-environment" src={roomLarge} srcSet={`${roomSmall} 800w, ${roomLarge} 1600w`} sizes="(max-width: 1100px) 1600px, 100vw" width="1600" height="900" alt="" fetchPriority="high" decoding="async" onError={() => setRoomFailed(true)} /> : null}
      <div className="gf-scene-meta"><p>Kamar Ari <span>· Sore</span></p><span>{investigating ? 'Telusuri pesan. Tentukan langkahmu.' : modes[position.kind]}</span></div>
      <aside className="gf-presence" aria-label={line?.speaker === 'Narator' ? 'Narasi' : 'Sudut pandang Ari'}>
        <Portrait expression={expression} />
        <div className="gf-dialogue" key={line?.id ?? position.kind}><p className="gf-dialogue__speaker">{line?.speaker ?? 'Ari'}</p><p className="gf-dialogue__text" data-scene-focus tabIndex={-1}>{line?.text ?? 'Kesempatannya menarik. Tapi aku ingin tahu siapa yang sebenarnya mengirim pesan ini.'}</p>
          {position.kind === 'narrative' ? <div className="gf-dialogue__advance"><span>{position.lineIndex + 1} / {chapter.intro.length}</span><Button onClick={() => send({ type: 'line.advanced', nodeId: `${chapter.id}-intro`, lineIndex: position.lineIndex })}>{position.lineIndex === chapter.intro.length - 1 ? 'Periksa undangan' : 'Lanjut cerita'} <span aria-hidden="true">→</span></Button></div> : <button className="gf-dialogue__backlog" onClick={() => setDrawer('backlog')}>Baca jejak cerita <span aria-hidden="true">↗</span></button>}
        </div>
      </aside>
      <div className="gf-workspace">
        {investigating ? <>
          {showingArtifact ? <section className="gf-inspector" aria-label="Artefak investigasi">
            <div className="gf-inspector__chrome"><span><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m4 6 8 7 8-7" /></svg>{artifact === 'email' ? 'Kotak masuk Ari' : artifact === 'source' ? 'Pencarian mandiri' : 'Arsip kampus'}</span><button onClick={() => { setArtifact(null); requestAnimationFrame(() => roomTrigger.current?.focus()); }}>Kembali ke kamar <span aria-hidden="true">×</span></button></div>
            <nav className="gf-artifact-nav" aria-label="Berkas investigasi"><button aria-pressed={artifact === 'email'} onClick={() => setArtifact('email')}>Undangan baru</button><button aria-pressed={artifact === 'campus'} onClick={() => setArtifact('campus')}>Arsip kampus</button><button aria-pressed={artifact === 'source'} onClick={() => setArtifact('source')}>Direktori independen</button></nav>
            <div className={`gf-reading${artifact !== 'source' ? ' gf-reading--mail' : ''}`} key={artifact} tabIndex={0} role="region" aria-label="Isi artefak, dapat digulir">
              {artifact === 'source' ? <SourcePanel chapter={chapter} /> : <MailClient chapter={chapter} message={artifact!} onSelect={setArtifact} />}
            </div>
            <div className="gf-inspector__foot"><p>Alamat fiktif · Tetap di dalam permainan</p><span>Gulir untuk memeriksa isi pesan <span aria-hidden="true">↓</span></span></div>
          </section> : <div className="gf-room-actions"><h2 data-scene-focus tabIndex={-1}>Ada pesan untuk Ari.</h2><p>Pilih berkas yang ingin kamu telusuri.</p><button ref={roomTrigger} className="gf-hotspot" onClick={() => setArtifact('email')}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v12H4zM1 20h22M8 16l-1 4m9-4 1 4" /></svg><span>Buka laptop<strong>Undangan baru</strong></span><span aria-hidden="true">↗</span></button><button className="gf-hotspot gf-hotspot--secondary" onClick={() => setArtifact('campus')}>Arsip kampus <span aria-hidden="true">↗</span></button><button className="gf-hotspot gf-hotspot--secondary" onClick={() => setArtifact('source')}>Direktori independen <span aria-hidden="true">↗</span></button></div>}
        </> : position.kind === 'narrative' ? <div className="gf-narrative-space" aria-hidden="true" /> : <div className="gf-mode-document" key={position.kind}>
          {position.kind === 'decision' ? <DecisionView chapter={chapter} /> : null}
          {position.kind === 'verification' ? <><h2 data-scene-focus tabIndex={-1}>Periksa sebelum menyimpulkan.</h2><SourcePanel chapter={chapter} resolution /></> : null}
          {position.kind === 'outcome' ? <OutcomeView chapter={chapter} optionId={position.optionId} /> : null}
          {position.kind === 'debrief' ? <DebriefView chapter={chapter} optionId={position.optionId} /> : null}
          {position.kind === 'chapterComplete' ? <section><p className="section-label">Berkas pertama selesai</p><h2 data-scene-focus tabIndex={-1}>Undangannya berhenti.<br />Jejaknya belum.</h2><p>{game.flags.openedSuspiciousLink ? chapter.bridge.exposed : chapter.bridge.cautious}</p><p>Bab 1 selesai. Bab 2–3 dan pemulihan belum menjadi bagian dari pratinjau ini.</p><a className="button button--primary" href="/art-direction.html?scene=story">Ulangi cerita pratinjau</a></section> : null}
        </div>}
      </div>
      <div className="gf-stage-bottom"><div className="gf-stage-note"><p className={found ? 'sr-only' : 'gf-objective'}>{chapter.objective}</p><p className={found ? 'gf-discovery' : 'sr-only'} role="status" aria-live="polite" aria-atomic="true">{found ? <><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 12 5 5L20 6" /></svg><span><strong>Bukti tercatat</strong>{found.title}</span></> : null}</p></div>{investigating ? <Button className="gf-decide" onClick={() => send({ type: 'decision.opened', decisionId: chapter.decision.id })}>Pertimbangkan langkah <span aria-hidden="true">→</span></Button> : <span className="gf-chapter-position">Berkas 1 dari 3</span>}</div>
    </main>
    <Drawer open={drawer === 'journal'} onClose={() => setDrawer(null)} title="Jurnal bukti"><div className="gf-journal-cover"><img src={stationery} alt="" width="480" height="320" loading="lazy" /><div><p>Berkas Ari · Bab 1</p><h3>{chapter.title}</h3><p>Yang sudah kamu periksa,<br />yang masih perlu dipastikan.</p></div></div><EvidenceJournal /></Drawer>
    <Drawer open={drawer === 'backlog'} onClose={() => setDrawer(null)} title="Jejak cerita"><ol className="backlog">{seenLines.map(item => <li key={item.id}><h3>{item.speaker}</h3><p>{item.text}</p></li>)}</ol></Drawer>
    <Drawer open={drawer === 'menu'} onClose={() => setDrawer(null)} title="Menu TrustTrail"><p>Pratinjau arah visual Bab 1. Interaksi memakai mesin permainan yang ada, tanpa membaca atau menulis simpananmu.</p><nav className="gf-menu-links" aria-label="Menu pratinjau"><a href="/art-direction.html?scene=story">Mulai pratinjau dari cerita</a><a href="/art-direction.html">Ulangi pratinjau investigasi</a><a href="/">Buka game saat ini</a><a href="/guide">Panduan & privasi</a></nav><p>Simulasi fiktif. Tidak ada kata sandi, OTP atau dokumen pribadi yang diminta.</p></Drawer>
  </div>;
}
