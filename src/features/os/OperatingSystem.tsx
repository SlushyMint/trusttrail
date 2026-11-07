import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useGame, useGameActions } from '../../app/game-context';
import { Drawer } from '../../components/ui/Drawer';
import { currentChapter } from '../../engine/reducer';
import { HomePage } from '../../pages/HomePage';
import { PlayPage } from '../../pages/PlayPage';
import { GuidePage } from '../../pages/GuidePage';
import { ReportPage } from '../../pages/ReportPage';
import { NotFoundPage } from '../../pages/NotFoundPage';
import { ProgressControls, SaveNotice, StartGameButton } from '../gameplay/ProgressControls';
import { BrowserApp, JournalApp, JournalArchive, MailApp } from './SharedApps';
import { MessagesApp } from './MessagesApp';
import { FinalRequest, PortalApp } from './PortalApp';
import { chapterTwo } from '../../content/chapters/c2';
import { applications, OsContext, type AppId, type Toast } from './model';
import { PixelIcon, type PixelKind } from './PixelIcon';
import { DesktopSystemBar, DesktopTaskbar, MobileStatusBar, MobileSystemNavigation } from './Shells';
import { useDesktopLayout } from './useDesktopLayout';
import { AppFrame, type WindowSlot } from './AppFrame';
import './window-management.css';
import { Tutorial } from '../onboarding/Tutorial';
import { advanceTutorial, readTutorial, storeTutorial, tutorialEligible, stages, type TutorialState, type Stage } from '../onboarding/tutorial';
import { useAudioService } from '../audio/audio-context';

type Surface = AppId | 'home' | 'guide' | 'report' | 'missing';
const surfaces: { id: Surface; title: string; icon: PixelKind }[] = [
  ...applications.map(app => ({ id: app.id, title: app.label, icon: app.id })),
  { id: 'home', title: 'TrustTrail', icon: 'signal' },
  { id: 'guide', title: 'Panduan', icon: 'files' },
  { id: 'report', title: 'Catatan refleksi', icon: 'journal' },
  { id: 'missing', title: 'Sistem', icon: 'warning' },
];

export function OperatingSystem() {
  const audio = useAudioService();
  const { game, save } = useGame();
  const { send } = useGameActions();
  const desktop = useDesktopLayout();
  const location = useLocation();
  const navigate = useNavigate();
  const chapter = currentChapter(game);
  const storyApp: AppId = chapter.portal ? 'browser' : chapter.conversation ? 'messages' : 'mail';
  const playing = location.pathname === '/play';
  const params = new URLSearchParams(location.search);
  const requested = params.get('app') === 'cases' ? 'journal' : params.get('app');
  const selected: Surface = playing
    ? applications.find(app => app.id === requested)?.id ?? (game.position.kind === 'verification' ? 'browser' : storyApp)
    : location.pathname === '/' ? 'home' : location.pathname === '/guide' ? 'guide' : location.pathname === '/report' ? 'report' : 'missing';
  const [opened, setOpened] = useState<AppId[]>(() => [...new Set<AppId>(['mail', 'journal', storyApp])]);
  const [hiddenApps, setHiddenApps] = useState<AppId[]>([]);
  const [maximized, setMaximized] = useState<Surface | null>(null);
  const [menu, setMenu] = useState(false);
  const [progress, setProgress] = useState(false);
  const [dismissed, setDismissed] = useState(-1);
  const [order, setOrder] = useState<string[]>(['journal', 'mail']);
  const [slots, setSlots] = useState<Record<string, WindowSlot>>({});
  const [layoutVersion, setLayoutVersion] = useState(0);
  const count = chapter.evidence.filter(clue => game.discoveries[clue.id]).length;
  const canInvestigate = ['investigation', 'verification', 'outcome', 'recovery', 'debrief', 'chapterComplete'].includes(game.position.kind);
  const canInspect = game.position.kind === 'investigation' || game.position.kind === 'verification';
  const label = surfaces.find(surface => surface.id === selected)!.title;
  const phaseKey = `${chapter.id}:${game.position.kind}${game.position.kind === 'narrative' ? `:${game.position.lineIndex}` : ''}`;
  const previousPhase = useRef(phaseKey);
  const firstFocus = useRef(true);
  const foreground = useRef<HTMLDivElement>(null);
  const workspace = useRef<HTMLElement>(null);
  const preserveFocus = useRef(false);
  const saved = save.kind === 'saved' ? 'Tersimpan di browser ini' : save.kind === 'empty' ? 'Progres lokal · Tanpa akun' : 'Periksa penyimpanan';
  const [windowPhase, setWindowPhase] = useState(phaseKey);
  // Register automatically selected story windows before rendering the new phase.
  // This keeps them reachable when keyboard focus moves to another open window.
  if (windowPhase !== phaseKey) {
    const app = game.position.kind === 'verification' ? 'browser' : storyApp;
    setWindowPhase(phaseKey);
    setOpened(items => items.includes(app) ? items : [...items, app]);
    setHiddenApps(items => items.includes(app) ? items.filter(id => id !== app) : items);
  }

  const [tutorial, setTutorial] = useState<TutorialState>(readTutorial);
  const [replaying, setReplaying] = useState(false);
  const tutorialVisible = playing && (replaying ? canInvestigate : tutorialEligible(chapter.id, game.position.kind, playing)) && stages.includes(tutorial as Stage);
  const tutorialTarget = tutorialVisible && ['mail', 'browser', 'journal'].includes(tutorial) ? tutorial : null;
  function updateTutorial(next: TutorialState) { setTutorial(next); storeTutorial(next); }
  function dismissTutorial(complete: boolean) {
    updateTutorial(complete ? 'completed' : 'skipped');
    setReplaying(false);
    requestAnimationFrame(() => (document.querySelector<HTMLElement>('.drawer[open] button') ?? document.getElementById(desktop ? `task-${selected}` : 'os-menu-trigger') ?? document.getElementById('os-main'))?.focus());
  }
  useEffect(() => {
    if (!tutorialVisible) return;
    storeTutorial(tutorial);
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setTutorial('skipped'); storeTutorial('skipped'); setReplaying(false); requestAnimationFrame(() => (document.querySelector<HTMLElement>('.drawer[open] button') ?? document.getElementById(desktop ? `task-${selected}` : 'os-menu-trigger') ?? document.getElementById('os-main'))?.focus()); } };
    document.addEventListener('keydown', escape);
    return () => document.removeEventListener('keydown', escape);
  }, [tutorialVisible, tutorial, desktop, selected]);
  const tutorialPanel = tutorialVisible ? <Tutorial stage={tutorial as Stage} mobileMenu={!desktop && menu} onStart={() => updateTutorial('mail')} onDismiss={dismissTutorial} /> : null;

  function pathFor(id: AppId, inbox = false) { return `/play?app=${id === 'journal' ? 'cases' : id}${id === 'mail' ? `&view=${inbox ? 'inbox' : 'read'}` : ''}`; }
  function go(to: string, replace = false) {
    if (`${location.pathname}${location.search}` !== to) navigate(to, { replace, state: { osDepth: (Number(location.state?.osDepth) || 0) + (replace ? 0 : 1) } });
    setMenu(false);
  }
  function openApp(id: AppId) {
    if (id !== selected || hiddenApps.includes(id)) audio?.cue('application');
    if (tutorialVisible) setTutorial(current => advanceTutorial(current, id));
    raise(id);
    setOpened(items => items.includes(id) ? items : [...items, id]);
    setHiddenApps(items => items.filter(item => item !== id));
    setMaximized(null);
    go(pathFor(id, id === 'mail' && !desktop && canInvestigate && game.position.kind === 'investigation'));
  }
  function raise(id: string) { setOrder(items => items.at(-1) === id ? items : [...items.filter(item => item !== id), id]); }
  function resetLayout() { setSlots({}); setMaximized(null); setLayoutVersion(version => version + 1); }
  function compareWindows() {
    audio?.cue('application');
    const artifactApp = chapter.portal ? 'mail' : storyApp;
    setOpened(items => [...new Set([...items, artifactApp, 'browser' as AppId])]);
    setHiddenApps(items => items.filter(id => id !== artifactApp && id !== 'browser'));
    setSlots(items => ({ ...items, [artifactApp]: 'left', browser: 'right' }));
    setMaximized(null); setLayoutVersion(version => version + 1);
    setOrder(items => [...items.filter(id => id !== artifactApp && id !== 'browser'), artifactApp, 'browser']);
    go(pathFor('browser'));
  }
  function back() { if (Number(location.state?.osDepth) > 0) navigate(-1); else navigate('/'); }
  function hide(id: Surface, close: boolean) {
    if (applications.some(app => app.id === id)) {
      if (close) setOpened(items => items.filter(item => item !== id));
      setHiddenApps(items => items.includes(id as AppId) ? items : [...items, id as AppId]);
    }
    setMaximized(null);
    if (selected === id) {
      const next = opened.find(item => item !== id && !hiddenApps.includes(item));
      go(playing && next ? pathFor(next) : '/');
    }
    requestAnimationFrame(() => document.getElementById(`${close ? 'shortcut' : 'task'}-${id}`)?.focus());
  }

  // A phase change can select a presentation, never dispatch a gameplay event.
  useEffect(() => {
    if (previousPhase.current === phaseKey) return;
    previousPhase.current = phaseKey;
    if (!playing) return;
    const app = game.position.kind === 'verification' ? 'browser' : storyApp;
    const next = `/play?app=${app}&view=read`;
    if (`${location.pathname}${location.search}` !== next) navigate(next, { replace: true, state: location.state });
  }, [phaseKey, playing, game.position.kind, storyApp, location.pathname, location.search, location.state, navigate]);

  useEffect(() => {
    document.title = location.pathname === '/' ? 'TrustTrail — Game investigasi keamanan digital' : `${playing ? chapter.title : label} — TrustTrail`;
    if (firstFocus.current) { firstFocus.current = false; return; }
    if (preserveFocus.current) { preserveFocus.current = false; return; }
    // Informational tutorial stages own their heading focus after app navigation.
    if (tutorialVisible && (tutorial === 'welcome' || tutorial === 'ready')) return;
    const frame = foreground.current?.querySelector<HTMLElement>('[data-active="true"]');
    const element = location.pathname === '/' ? document.querySelector<HTMLElement>('.portal h1') : frame?.querySelector<HTMLElement>('[data-scene-focus]') ?? frame?.querySelector<HTMLElement>('[data-os-focus], h1') ?? frame?.querySelector<HTMLElement>('[data-window-heading]') ?? document.querySelector<HTMLElement>('.os-route-title');
    if (element) element.focus();
  }, [location.key, location.pathname, phaseKey, playing, chapter.title, label, desktop, tutorialVisible, tutorial]);

  const last = game.history.at(-1);
  const found = last?.type === 'evidence.inspected' ? chapter.evidence.find(clue => clue.id === last.evidenceId) : last?.type === 'source.compared' ? chapter.evidence.find(clue => clue.id === chapter.source.evidenceId) : undefined;
  const toast: Toast | null = found ? { title: 'Bukti tercatat', text: found.title } : last?.type === 'reference.inspected' ? { title: 'Detail sumber diperiksa', text: 'Bandingkan catatan ini dengan klaim pesan.' } : null;
  const visibleToast = toast && dismissed !== game.history.length;
  const notice = <div className="os-feedback"><p className="px-live discovery-receipt" role="status" aria-live="polite" aria-atomic="true">{found ? `Bukti tercatat: ${found.title}.` : toast ? `${toast.title}. ${toast.text}` : ''}</p>{visibleToast ? <div className="px-notification"><PixelIcon kind="journal" /><div><strong>{toast.title}</strong><p>{toast.text}</p></div><button aria-label="Tutup notifikasi" onClick={() => setDismissed(game.history.length)}>×</button></div> : null}</div>;

  function content(id: Surface) {
    // Static utility documents have no editing state to preserve. Mount only the
    // selected one so inactive page headings/controls do not remain in the DOM.
    if (['home', 'guide', 'report', 'missing'].includes(id) && id !== selected) return null;
    if (id === 'home') return null;
    if (id === 'guide') return <GuidePage onReplay={() => { updateTutorial('welcome'); setReplaying(true); go(pathFor(storyApp)); }} canReplay={canInvestigate} />;
    if (id === 'report') return <ReportPage />;
    if (id === 'missing') return <NotFoundPage />;
    if (chapter.portal && id === 'mail') return canInvestigate ? <FinalRequest chapter={chapter} game={game} send={send} openApp={openApp} /> : <p className="tt-final-request">Instruksi terakhir tersedia setelah cerita pengantar.</p>;
    if (chapter.portal && id === 'browser') return <PortalApp key={chapter.id} chapter={chapter} game={game} send={send} openApp={openApp} flow={<PlayPage />} />;
    if (chapter.portal && id === 'messages') return <article className="tt-final-request"><h2 data-os-focus tabIndex={-1}>Percakapan Mira tersimpan</h2><p>Pilihan Bab 2: {chapterTwo.decision.options.find(option => option.id === game.choices.D2?.optionId)?.label}</p><p>{chapterTwo.conversation.opening}</p>{chapterTwo.conversation.exchanges.map(exchange => <div key={exchange.id}><p><strong>Ari:</strong> {exchange.reply}</p><p><strong>Mira:</strong> {exchange.response}</p></div>)}<button className="px-button" onClick={() => openApp('mail')}>Lihat instruksi di Mail</button><button className="px-button" onClick={() => openApp('browser')}>Kembali ke misi</button></article>;
    if (id === 'mail' && chapter.conversation) return <div className="px-empty-app"><PixelIcon kind="mail" /><h3>Undangan tersimpan.</h3><p>Keputusan dan bukti Bab 1 tetap ada di Case Files. Pesan lanjutan kini ada di Messages.</p><button className="px-button" onClick={() => openApp('messages')}>Buka Messages</button></div>;
    if (id === 'mail') return <MailApp chapter={chapter} game={game} send={send} inspect={clue => send({ type: 'evidence.inspected', evidenceId: clue.id })} openApp={openApp} flow={<PlayPage />} navigation={{ inbox: params.get('view') === 'inbox', onInbox: inbox => go(pathFor('mail', inbox)), message: params.get('message') === 'campus' ? 'campus' : 'email', onSelect: message => go(`${pathFor('mail')}&message=${message}`) }} />;
    if (id === 'journal') return <div className="dual-case-files"><div className="dual-case-context"><span className="dual-case-stamp">{chapter.id.slice(1).padStart(2, '0')}</span><div><p className="px-eyebrow">BERKAS AKTIF / {chapter.id}</p><h3>{chapter.title}</h3><span>{count} bukti ditemukan</span></div></div><JournalApp chapter={chapter} game={game} openApp={openApp} /><JournalArchive chapter={chapter} game={game} /></div>;
    if (id === 'files') {
      const lines = game.position.kind === 'menu' || game.position.kind === 'briefing' ? [] : chapter.intro.slice(0, game.position.kind === 'narrative' ? game.position.lineIndex + 1 : undefined);
      return <article className="os-files-document"><p className="px-eyebrow">BERKAS LOKAL / JEJAK CERITA</p><h2>Catatan Ari</h2>{lines.length ? lines.map(line => <p key={line.id}><strong>{line.speaker}:</strong> {line.text}</p>) : <p>Cerita yang sudah kamu baca akan tercatat di sini.</p>}<p className="px-app-footnote">Tidak ada dokumen pribadi yang diminta atau diunggah.</p></article>;
    }
    if (id === 'messages') return <MessagesApp key={chapter.id} chapter={chapter} game={game} send={send} openApp={openApp} flow={<PlayPage />} />;
    if (!canInvestigate) return <div className="px-empty-app"><PixelIcon kind="browser" /><h2>Buka berkas pertama.</h2><p>Direktori perusahaan tersedia saat investigasi dimulai.</p><StartGameButton /><Link className="button button--secondary" to="/play">Kembali ke cerita</Link></div>;
    return <>{game.position.kind === 'verification' ? <div className="os-verification-heading"><h2 data-scene-focus tabIndex={-1}>Periksa sebelum menyimpulkan.</h2><p>Pilihanmu sudah tercatat. Periksa detail, lalu bandingkan sumber.</p></div> : null}{!canInspect && !game.references[chapter.source.id] ? <p className="os-source-locked">Pemeriksaan baru dicatat saat investigasi atau langkah verifikasi. Pilihan yang sudah dijalankan tetap tercatat.</p> : null}<BrowserApp chapter={chapter} game={game} send={canInspect ? send : () => {}} notify={() => {}} openApp={openApp} origin={desktop ? 'Desktop' : 'Saku'} inspectionAllowed={canInspect} /></>;
  }
  const title = playing ? chapter.title : selected === 'home' ? 'Periksa jejaknya. Tentukan langkah Ari.' : label;
  return <OsContext value={{ desktop, openApp }}>{selected === 'home' ? <HomePage /> : null}<div hidden={selected === 'home'} className={`trusttrail-os dual-review ${desktop ? 'os-desktop dual-desktop px-desktop' : 'os-mobile saku-os saku-in-app'}`} data-os={desktop ? 'desktop' : 'saku'} data-phase={game.position.kind}>
    <a className="px-skip" href="#os-main">Lewati ke konten</a>
    {desktop ? <DesktopSystemBar saved={saved} /> : <MobileStatusBar saved={saved} />}
    <div className="os-save-area"><SaveNotice /></div>
    {!desktop && selected !== 'home' ? <header className="saku-app-header"><button className="saku-back" aria-label="Kembali" onClick={back}><span aria-hidden="true">←</span></button><div><p>{selected === 'mail' ? 'KOTAK SURAT ARI' : selected === 'journal' ? 'BERKAS INVESTIGASI' : 'LACAK SAKU'}</p>{playing ? <h1 className="os-route-title" tabIndex={-1}>{label}</h1> : <h2>{label}</h2>}</div><span className="saku-header-icon"><PixelIcon kind={surfaces.find(item => item.id === selected)!.icon} /></span></header> : null}
    {!desktop ? <aside className="saku-notification" aria-label="Notifikasi Saku">{notice}</aside> : null}
    {!menu ? tutorialPanel : null}
    <main ref={workspace} className={desktop ? 'px-workspace' : 'saku-main'} id="os-main" tabIndex={-1}>
      {desktop ? <><nav className="px-shortcuts" aria-label="Aplikasi desktop">{applications.map(app => <button key={app.id} data-tutorial-target={tutorialTarget === app.id} id={`shortcut-${app.id}`} className="px-shortcut" onClick={() => openApp(app.id)} aria-label={`Buka ${app.label}`}><PixelIcon kind={app.id} /><span>{app.label}</span></button>)}</nav><div className="px-case-heading"><div><p className="px-eyebrow">TRUSTTRAIL <span>/</span> {playing ? chapter.subtitle : 'PERSONAL DESKTOP'}</p>{playing ? <h1 className="os-route-title" tabIndex={-1}>{title}</h1> : <p className="os-desktop-title">{title}</p>}<p>Simulasi fiktif · Tanpa data pribadi</p></div><button className="px-text-button" onClick={() => setProgress(true)}>Kelola progres</button></div></> : null}
      {desktop ? <nav className="os-layout-controls" aria-label="Tata letak jendela">{playing && canInvestigate ? <button type="button" onClick={compareWindows}>{chapter.conversation ? 'Messages' : 'Mail'} & sumber berdampingan</button> : null}<button type="button" onClick={resetLayout}>Rapikan jendela</button></nav> : null}
      <div className={desktop ? 'px-window-layout os-app-hosts' : 'os-app-hosts'} ref={foreground}>{surfaces.map(surface => {
        const isApp = applications.some(app => app.id === surface.id);
        const active = selected === surface.id;
        const shown = active || desktop && playing && isApp && opened.includes(surface.id as AppId) && !hiddenApps.includes(surface.id as AppId);
        return <AppFrame key={surface.id} id={surface.id} icon={surface.icon} title={surface.title} desktop={desktop} active={active} hidden={!shown} maximized={maximized === surface.id} workspace={workspace} layer={active ? 30 : 5 + order.indexOf(surface.id)} slot={slots[surface.id]} resetVersion={layoutVersion} onPlace={slot => { setSlots(items => ({ ...items, [surface.id]: slot })); setMaximized(null); }} onFocus={() => { raise(surface.id); if (!active && isApp) { preserveFocus.current = true; go(pathFor(surface.id as AppId), true); } }} onClose={() => hide(surface.id, true)} onMinimize={() => hide(surface.id, false)} onMaximize={() => setMaximized(maximized === surface.id ? null : surface.id)}>{content(surface.id)}</AppFrame>;
      })}</div>
      {desktop ? <><aside className="px-notification-area" aria-label="Notifikasi desktop">{notice}</aside><div className="px-wallpaper-credit" aria-hidden="true"><PixelIcon kind="signal" /><span>LACAK<br />PERSONAL DESKTOP</span></div></> : null}
    </main>
    {desktop ? <DesktopTaskbar active={selected} opened={opened} openApp={openApp} menu={() => setMenu(true)} /> : <MobileSystemNavigation back={back} menu={() => setMenu(true)} count={count} tutorialActive={!!tutorialTarget} />}
    {menu ? <Drawer open={menu} title="Menu TrustTrail" onClose={() => setMenu(false)}>{tutorialPanel}<nav className="os-app-menu" aria-label="Aplikasi dan navigasi">{applications.map(app => <button data-tutorial-target={tutorialTarget === app.id} className="px-text-button" key={app.id} onClick={() => openApp(app.id)}><PixelIcon kind={app.id} /><span>{app.label}</span><span>{app.subtitle}</span></button>)}<Link to="/" onClick={() => setMenu(false)}>Beranda</Link><Link to="/play" onClick={() => setMenu(false)}>Ruang misi</Link><Link to="/guide" onClick={() => setMenu(false)}>Panduan</Link><Link to="/report" onClick={() => setMenu(false)}>Catatan refleksi</Link>{desktop ? <>{playing && canInvestigate ? <button className="px-text-button" onClick={compareWindows}>{chapter.conversation ? 'Messages' : 'Mail'} & sumber berdampingan</button> : null}<button className="px-text-button" onClick={() => { resetLayout(); setMenu(false); }}>Rapikan jendela</button></> : null}<button className="px-text-button" onClick={() => { setMenu(false); setProgress(true); }}>Kelola progres</button></nav></Drawer> : null}
    {progress ? <Drawer open={progress} title="Progres lokal" onClose={() => setProgress(false)}><p>{save.message}</p><ProgressControls onComplete={() => setProgress(false)} /></Drawer> : null}
  </div></OsContext>;
}

