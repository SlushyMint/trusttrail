import { useEffect, useReducer, useRef, useState } from 'react';
import { chapterFacts, currentChapter, debriefNode, initialGame, outcomeNode, reduceGame } from '../engine/reducer';
import type { Chapter, Evidence, GameEvent, GameState } from '../engine/types';
import { PixelIcon } from './PixelIcon';

const apps = [
  { id: 'mail', label: 'Mail', subtitle: 'Kotak masuk' },
  { id: 'browser', label: 'Browser', subtitle: 'Sumber terpisah' },
  { id: 'messages', label: 'Messages', subtitle: 'Percakapan' },
  { id: 'files', label: 'Files', subtitle: 'Berkas kasus' },
  { id: 'journal', label: 'Evidence Journal', subtitle: 'Catatan bukti' },
] as const;
import type { AppId, Send, Toast } from '../features/os/model';
export type { AppId, Send, Toast } from '../features/os/model';
import { DesktopWindow } from '../features/os/DesktopWindow';
export { DesktopWindow } from '../features/os/DesktopWindow';
import { MailApp as SharedMailApp, JournalApp, BrowserApp, FilesApp } from '../features/os/SharedApps';
export { JournalApp, BrowserApp, FilesApp } from '../features/os/SharedApps';
const reviewReducer = (state: GameState, event: GameEvent) => reduceGame(state, event);

export function initialReview() {
  let game = reduceGame(initialGame(), { type: 'run.started' });
  game = reduceGame(game, { type: 'story.begun' });
  const chapter = currentChapter(game);
  for (let i = 0; i < chapter.intro.length; i++) game = reduceGame(game, { type: 'line.advanced', nodeId: `${chapter.id}-intro`, lineIndex: i });
  return game;
}

export function PixelDesktop() {
  // Canonical reducer, deliberately isolated from production's persistence adapter.
  const [game, send] = useReducer(reviewReducer, undefined, initialReview);
  const chapter = currentChapter(game);
  const [launched, setLaunched] = useState<AppId[]>(['mail', 'journal']);
  const [minimized, setMinimized] = useState<AppId[]>([]);
  const [active, setActive] = useState<AppId>('mail');
  const [maximized, setMaximized] = useState<AppId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<Toast | null>({ title: 'Undangan baru diterima', text: 'NovaTech Recruitment mengirim pesan. Periksa sebelum membalas.' });
  const count = chapter.evidence.filter(clue => game.discoveries[clue.id]).length;
  const phases = { menu: 'Persiapan', briefing: 'Persiapan', narrative: 'Cerita', investigation: 'Investigasi', decision: 'Keputusan', verification: 'Verifikasi', outcome: 'Akibat pilihan', recovery: 'Pemulihan', debrief: 'Refleksi', chapterComplete: 'Bab 1 selesai' };

  function openApp(id: AppId) {
    setLaunched(items => items.includes(id) ? items : [...items, id]);
    setMinimized(items => items.filter(item => item !== id));
    setMaximized(current => current && current !== id ? null : current);
    setActive(id);
    setMenuOpen(false);
    requestAnimationFrame(() => document.getElementById(`px-title-${id}`)?.focus());
  }
  function hideApp(id: AppId, close = false) {
    if (close) setLaunched(items => items.filter(item => item !== id));
    else setMinimized(items => [...items, id]);
    const next = launched.find(item => item !== id && !minimized.includes(item));
    if (next) setActive(next);
    setMaximized(null);
    requestAnimationFrame(() => document.getElementById(close ? `shortcut-${id}` : `task-${id}`)?.focus());
  }
  function inspect(clue: Evidence) {
    send({ type: 'evidence.inspected', evidenceId: clue.id });
    setToast({ title: game.discoveries[clue.id] ? 'Catatan bukti dibuka' : 'Bukti baru dicatat', text: clue.title });
  }

  return <div className="px-desktop">
    <a className="px-skip" href="#px-main">Lewati ke investigasi</a>
    <header className="px-system-bar">
      <div className="px-game-brand" translate="no"><PixelIcon kind="signal" /><strong>TRUSTTRAIL</strong><span className="px-brand-separator">/</span><span>Lacak OS</span></div>
      <span className="px-preview-label">Pratinjau · tidak disimpan</span>
      <div className="px-session"><span className="px-status-dot" />Sesi Ari<span className="px-system-version">LOCAL / 01</span></div>
    </header>
    <main className="px-workspace" id="px-main" tabIndex={-1}>
      <nav className="px-shortcuts" aria-label="Aplikasi desktop">
        {apps.map(app => <button id={`shortcut-${app.id}`} key={app.id} type="button" className="px-shortcut" onClick={() => openApp(app.id)} aria-label={`Buka ${app.label}`}><PixelIcon kind={app.id} /><span>{app.label}</span>{app.id === 'mail' ? <span className="px-shortcut-count" aria-label="2 pesan">2</span> : null}</button>)}
      </nav>
      <div className="px-case-heading"><div><p className="px-eyebrow">BERKAS 01 <span>/</span> {phases[game.position.kind]}</p><h1>{chapter.title}</h1><p>Periksa jejaknya. Tentukan langkah Ari.</p></div><div className="px-case-indicator" aria-label={`Tahap saat ini: ${phases[game.position.kind]}`}><span className="px-stage-current">01</span><span className="px-stage-line" /><span>02</span><span className="px-stage-line" /><span>03</span></div></div>
      <div className="px-window-layout">
        {apps.map(app => <DesktopWindow key={app.id} app={app.id} title={app.label} subtitle={app.id === 'journal' ? `${count} catatan` : app.subtitle} hidden={!launched.includes(app.id) || minimized.includes(app.id)} active={active === app.id} maximized={maximized === app.id} onFocus={() => setActive(app.id)} onMinimize={() => hideApp(app.id)} onClose={() => hideApp(app.id, true)} onMaximize={() => { setMaximized(maximized === app.id ? null : app.id); setActive(app.id); }}>
          {app.id === 'mail' ? <MailApp chapter={chapter} game={game} send={send} inspect={inspect} openApp={openApp} /> : null}
          {app.id === 'journal' ? <JournalApp chapter={chapter} game={game} openApp={openApp} /> : null}
          {app.id === 'browser' ? <BrowserApp chapter={chapter} game={game} send={send} notify={setToast} openApp={openApp} /> : null}
          {app.id === 'messages' ? <div className="px-empty-app"><PixelIcon kind="messages" /><p className="px-eyebrow">PERCAKAPAN ARI</p><h3>Belum ada percakapan.</h3><p>Pada berkas ini, jejak pertama ada di kotak masuk.</p><button className="px-button" onClick={() => openApp('mail')}>Buka Mail <span aria-hidden="true">→</span></button><p className="px-app-footnote">Percakapan perekrut hadir di Bab 2. Konten tersebut belum tersedia pada build M1.</p></div> : null}
          {app.id === 'files' ? <FilesApp chapter={chapter} /> : null}
        </DesktopWindow>)}
      </div>
      <div className="px-wallpaper-credit" aria-hidden="true"><PixelIcon kind="signal" /><span>LACAK<br />PERSONAL DESKTOP</span></div>
      <aside className="px-notification-area" aria-label="Notifikasi desktop"><div className="px-live" role="status" aria-live="polite" aria-atomic="true">{toast ? `${toast.title}. ${toast.text}` : ''}</div>{toast ? <div className="px-notification"><PixelIcon kind={toast.title.includes('bukti') || toast.title.includes('Bukti') ? 'journal' : 'mail'} /><div><strong>{toast.title}</strong><p>{toast.text}</p></div><button type="button" aria-label="Tutup notifikasi" onClick={() => setToast(null)}>×</button></div> : null}</aside>
    </main>
    <footer className="px-taskbar">
      <div className="px-launcher-wrap"><button type="button" id="px-launcher-button" className="px-launcher" aria-expanded={menuOpen} aria-controls="px-launcher-menu" onClick={() => setMenuOpen(!menuOpen)}><PixelIcon kind="signal" /><span>LACAK</span></button>{menuOpen ? <nav id="px-launcher-menu" className="px-launcher-menu" aria-label="Peluncur aplikasi" onKeyDown={event => { if (event.key === 'Escape') { setMenuOpen(false); document.getElementById('px-launcher-button')?.focus(); } }}><p>Aplikasi Ari</p>{apps.map(app => <button key={app.id} onClick={() => openApp(app.id)}><PixelIcon kind={app.id} />{app.label}</button>)}<span>Pratinjau · memori sementara</span></nav> : null}</div>
      <nav className="px-running-apps" aria-label="Taskbar aplikasi">{apps.map(app => <button type="button" id={`task-${app.id}`} key={app.id} className={`px-task ${active === app.id && launched.includes(app.id) && !minimized.includes(app.id) ? 'is-active' : ''}`} aria-label={`Tampilkan ${app.label}`} aria-pressed={active === app.id && launched.includes(app.id) && !minimized.includes(app.id)} onClick={() => openApp(app.id)}><PixelIcon kind={app.id} /><span>{app.label}</span><span className={`px-running-mark ${launched.includes(app.id) ? 'is-running' : ''}`} /></button>)}</nav>
      <div className="px-system-tray"><span className="px-offline-icon" aria-hidden="true">▂▄▆</span><span>Simulasi lokal</span><span className="px-tray-divider" /><span className="px-clock">SORE HARI</span></div>
    </footer>
  </div>;
}


/** Archived review adapter; production uses SharedApps and the real provider. */
export function MailApp(props: Parameters<typeof SharedMailApp>[0]) {
  return <SharedMailApp {...props} flow={<CaseFlow chapter={props.chapter} game={props.game} send={props.send} openApp={props.openApp} />} />;
}

function CaseFlow({ chapter, game, send, openApp }: { chapter: Chapter; game: GameState; send: Send; openApp: (id: AppId) => void }) {
  const [selected, setSelected] = useState('');
  const position = game.position;
  const option = 'optionId' in position ? chapter.decision.options.find(item => item.id === position.optionId) : undefined;
  const facts = chapterFacts(game, chapter);
  const flow = useRef<HTMLDivElement>(null);
  useEffect(() => { flow.current?.querySelector<HTMLElement>('h3')?.focus(); }, [position.kind]);
  return <div className="px-case-flow" ref={flow}>
    <p className="px-eyebrow">BERKAS 01 / LANGKAH ARI</p>
    {position.kind === 'decision' ? <><h3 tabIndex={-1}>Apa langkah Ari?</h3><p>{chapter.decision.prompt}</p><fieldset><legend>Pilih satu tindakan, lalu jalankan pilihanmu.</legend>{chapter.decision.options.map(item => <label key={item.id} className={selected === item.id ? 'is-selected' : ''}><input type="radio" name="pixel-decision" value={item.id} checked={selected === item.id} onChange={() => setSelected(item.id)} /><span><strong>{item.label}</strong><span>{item.description}</span></span></label>)}</fieldset><div className="px-flow-actions"><button className="px-button px-primary" disabled={!selected} onClick={() => send({ type: 'choice.committed', decisionId: chapter.decision.id, optionId: selected })}>Jalankan pilihan</button><button className="px-text-button" onClick={() => send({ type: 'decision.closed', decisionId: chapter.decision.id })}>Periksa lagi</button></div><p className="px-app-footnote">Pilihan dicatat setelah “Jalankan pilihan”. Semua tindakan berlangsung dalam simulasi.</p></> : null}
    {position.kind === 'verification' ? <><h3 tabIndex={-1}>Periksa sebelum menyimpulkan.</h3><p>Keputusan untuk memverifikasi sudah dicatat. Periksa detail sumber terpisah, lalu bandingkan dengan undangan untuk menyelesaikan langkah ini.</p><button className="px-button px-primary" onClick={() => openApp('browser')}>Buka Browser <span aria-hidden="true">→</span></button></> : null}
    {position.kind === 'outcome' && option ? <><h3 tabIndex={-1}>{option.outcome.title}</h3><p>{option.outcome.text}</p><blockquote>{option.outcome.reflection}</blockquote>{option.id === 'follow-link' ? <div className="px-source-result"><p>Pratinjau kandidat · {chapter.email.destination}<br />Identitas belum diverifikasi. Tidak ada formulir atau data yang dikirim.</p></div> : null}<button className="px-button px-primary" onClick={() => send({ type: 'outcome.continued', nodeId: outcomeNode(chapter.decision.id, option.id) })}>Lihat refleksi <span aria-hidden="true">→</span></button></> : null}
    {position.kind === 'debrief' && option ? <><h3 tabIndex={-1}>Ada alasan di balik setiap langkah.</h3><h4>Yang terjadi</h4><p>{option.feedback.happened}</p><h4>Mengapa ini berarti</h4><p>{option.feedback.why}</p><h4>Langkah berikutnya</h4><p>{option.feedback.next}</p><dl className="px-facts"><div><dt>Bukti sebelum memilih</dt><dd>{facts.awareness} / {chapter.evidence.length}</dd></div><div><dt>Langkah verifikasi</dt><dd>{facts.verification} / 2</dd></div><div><dt>Kriteria perlindungan</dt><dd>{facts.safety} / 2</dd></div></dl>{facts.lateEvidence.length ? <p>{facts.lateEvidence.length} bukti ditemukan setelah pilihan dan tidak dihitung sebagai bukti sebelum memilih.</p> : null}<p className="px-app-footnote">{option.feedback.limitation}</p><button className="px-button px-primary" onClick={() => send({ type: 'debrief.continued', nodeId: debriefNode(chapter.decision.id, option.id) })}>Tutup berkas Bab 1</button></> : null}
    {position.kind === 'chapterComplete' ? <><h3 tabIndex={-1}>Undangannya berhenti. Jejaknya belum.</h3><p>{game.flags.openedSuspiciousLink ? chapter.bridge.exposed : chapter.bridge.cautious}</p><p>Bab 1 selesai. Bab 2–3 serta latihan pemulihan hadir pada milestone berikutnya. Laporan akhir belum tersedia pada build M1.</p><p className="px-source-result">Pratinjau ini memakai memori sementara. Progres permainan utama tidak berubah.</p><button className="px-button" onClick={() => openApp('journal')}>Buka Evidence Journal</button></> : null}
  </div>;
}
