import { useEffect, useReducer, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { currentChapter, reduceGame } from '../engine/reducer';
import type { GameState } from '../engine/types';
import { BrowserApp, DesktopWindow, FilesApp, initialReview, JournalApp, MailApp, type AppId, type Send, type Toast } from '../pixel-desktop/PixelDesktop';
import { PixelIcon, type PixelKind } from '../pixel-desktop/PixelIcon';

// Review-only: the production entry, provider and persistence adapter are untouched.
const catalog: { id: AppId; label: string; subtitle: string; route: string }[] = [
  { id: 'mail', label: 'Mail', subtitle: 'Kotak masuk Ari', route: 'mail' },
  { id: 'browser', label: 'Browser', subtitle: 'Sumber terpisah', route: 'browser' },
  { id: 'messages', label: 'Messages', subtitle: 'Percakapan', route: 'messages' },
  { id: 'files', label: 'Files', subtitle: 'Berkas lokal', route: 'files' },
  { id: 'journal', label: 'Case Files', subtitle: 'Catatan bukti', route: 'cases' },
];
const layoutQuery = '(min-width: 1120px) and (min-height: 700px)';
function subscribeLayout(callback: () => void) {
  const query = window.matchMedia(layoutQuery);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
function subscribeRoute(callback: () => void) {
  const changed = () => {
    callback();
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>('.dual-desktop .px-window.is-foreground [data-window-heading], .saku-os [data-review-focus]') ?? document.querySelector<HTMLElement>('[data-review-focus]');
      target?.focus();
    });
  };
  window.addEventListener('popstate', changed);
  window.addEventListener('dual-review-route', changed);
  return () => { window.removeEventListener('popstate', changed); window.removeEventListener('dual-review-route', changed); };
}
const getRoute = () => window.location.hash.slice(1);
const getLayout = () => window.matchMedia(layoutQuery).matches;
const reviewReducer = (game: GameState, event: Parameters<Send>[0]) => reduceGame(game, event);

export function DualOsReview() {
  // The ONLY authoritative game state. It remains mounted when the shell changes.
  const [game, send] = useReducer(reviewReducer, undefined, initialReview);
  const chapter = currentChapter(game);
  const desktop = useSyncExternalStore(subscribeLayout, getLayout);
  const rawRoute = useSyncExternalStore(subscribeRoute, getRoute);
  const validRoutes = ['home', 'mail', 'mail/read', 'browser', 'messages', 'files', 'cases'];
  const route = validRoutes.includes(rawRoute) ? rawRoute : desktop ? 'mail/read' : 'home';
  const active = route === 'home' ? null : route.startsWith('mail') ? 'mail' : catalog.find(app => app.route === route)?.id ?? null;
  const [opened, setOpened] = useState<AppId[]>(['mail', 'journal']);
  const [minimized, setMinimized] = useState<AppId[]>([]);
  const [maximized, setMaximized] = useState<AppId | null>(null);
  const [switcher, setSwitcher] = useState(false);
  const [toast, setToast] = useState<Toast | null>({ title: 'Undangan baru diterima', text: 'NovaTech Recruitment · 2 pesan di Mail' });
  const count = chapter.evidence.filter(clue => game.discoveries[clue.id]).length;

  useEffect(() => {
    if (!window.history.state?.dualReview) window.history.replaceState({ dualReview: true, depth: 0 }, '', `${window.location.pathname}${window.location.search}#${route}`);
  }, [route]);

  function navigate(next: string) {
    if (next === route) return;
    const depth = window.history.state?.dualReview ? window.history.state.depth : 0;
    window.history.pushState({ dualReview: true, depth: depth + 1 }, '', `#${next}`);
    window.dispatchEvent(new Event('dual-review-route'));
    setSwitcher(false);
  }
  function openApp(id: AppId) {
    setOpened(items => items.includes(id) ? items : [...items, id]);
    setMinimized(items => items.filter(item => item !== id));
    setMaximized(null);
    navigate(id === 'mail' && desktop ? 'mail/read' : catalog.find(app => app.id === id)!.route);
  }
  function goBack() {
    if (switcher) { setSwitcher(false); return; }
    if (window.history.state?.dualReview && window.history.state.depth > 0) window.history.back();
    else navigate('home');
  }
  function dismissSwitcher() {
    setSwitcher(false);
    requestAnimationFrame(() => document.getElementById('dual-switcher-trigger')?.focus());
  }
  function hideApp(id: AppId, close: boolean) {
    if (close) setOpened(items => items.filter(item => item !== id));
    else setMinimized(items => [...items, id]);
    setMaximized(null);
    if (active === id) {
      const next = opened.find(item => item !== id && !minimized.includes(item));
      navigate(next ? catalog.find(app => app.id === next)!.route : 'home');
    }
    requestAnimationFrame(() => document.getElementById(`dual-${close ? 'shortcut' : 'task'}-${id}`)?.focus());
  }
  function inspect(clue: Parameters<typeof MailApp>[0]['chapter']['evidence'][number]) {
    send({ type: 'evidence.inspected', evidenceId: clue.id });
    setToast({ title: game.discoveries[clue.id] ? 'Catatan bukti dibuka' : 'Bukti baru dicatat', text: clue.title });
  }
  function content(id: AppId) {
    if (id === 'mail') return <MailApp chapter={chapter} game={game} send={send} inspect={inspect} openApp={openApp} navigation={{ inbox: route === 'mail', onInbox: inbox => navigate(inbox ? 'mail' : 'mail/read') }} />;
    if (id === 'browser') return <BrowserApp chapter={chapter} game={game} send={send} notify={setToast} openApp={openApp} origin={desktop ? 'Desktop' : 'Saku'} />;
    if (id === 'files') return <FilesApp chapter={chapter} />;
    if (id === 'journal') return <div className="dual-case-files"><div className="dual-case-context"><span className="dual-case-stamp">01</span><div><p className="px-eyebrow">BERKAS AKTIF / BAB 1</p><h3>{chapter.title}</h3><span>{game.position.kind === 'investigation' ? 'Investigasi berlangsung' : 'Langkah Ari tercatat'}</span></div></div><JournalApp chapter={chapter} game={game} openApp={openApp} /></div>;
    return <div className="px-empty-app"><PixelIcon kind="messages" /><p className="px-eyebrow">PERCAKAPAN ARI</p><h3>Belum ada percakapan.</h3><p>Jejak pertama ada di kotak masuk.</p><button className="px-button" onClick={() => openApp('mail')}>Buka Mail <span aria-hidden="true">→</span></button><p className="px-app-footnote">Percakapan perekrut hadir di Bab 2. Belum tersedia pada build M1.</p></div>;
  }
  const notice = <Notice toast={toast} onDismiss={() => setToast(null)} />;
  const live = <div role="status" aria-live="polite" aria-atomic="true" className="px-live">{toast ? `${toast.title}. ${toast.text}` : ''}</div>;

  if (desktop) return <div className="dual-review dual-desktop px-desktop">
    <a className="px-skip" href="#dual-main">Lewati ke investigasi</a>{live}
    <header className="px-system-bar"><div className="px-game-brand" translate="no"><PixelIcon kind="signal" /><strong>TRUSTTRAIL</strong><span className="px-brand-separator">/</span><span>Lacak OS</span></div><span className="px-preview-label">Review desain · tidak disimpan</span><div className="px-session"><span className="px-status-dot" />Sesi Ari<span className="px-system-version">LOCAL / 01</span></div></header>
    <main id="dual-main" className="px-workspace" tabIndex={-1}>
      <nav className="px-shortcuts" aria-label="Aplikasi desktop">{catalog.map(app => <button key={app.id} id={`dual-shortcut-${app.id}`} className="px-shortcut" aria-label={`Buka ${app.label}`} onClick={() => openApp(app.id)}><PixelIcon kind={app.id} /><span>{app.label}</span>{app.id === 'mail' ? <span className="px-shortcut-count" aria-label="2 pesan">2</span> : null}</button>)}</nav>
      <div className="px-case-heading"><div><p className="px-eyebrow">BERKAS 01 <span>/</span> {game.position.kind === 'investigation' ? 'INVESTIGASI' : 'LANGKAH ARI'}</p><h1 data-review-focus tabIndex={-1}>{chapter.title}</h1><p>Periksa jejaknya. Tentukan langkah Ari.</p></div><div className="px-case-indicator" aria-label="Bab 1 dari 3"><span className="px-stage-current">01</span><span className="px-stage-line" /><span>02</span><span className="px-stage-line" /><span>03</span></div></div>
      <div className="px-window-layout">{catalog.map(app => <DesktopWindow key={app.id} app={app.id} title={app.label} subtitle={app.id === 'journal' ? `${count} catatan` : app.subtitle} hidden={active !== app.id && (!opened.includes(app.id) || minimized.includes(app.id))} active={active === app.id} maximized={maximized === app.id && active === app.id} onFocus={() => { if (active !== app.id) navigate(app.id === 'mail' ? 'mail/read' : app.route); }} onClose={() => hideApp(app.id, true)} onMinimize={() => hideApp(app.id, false)} onMaximize={() => setMaximized(maximized === app.id ? null : app.id)}>{content(app.id)}</DesktopWindow>)}</div>
      <aside className="px-notification-area" aria-label="Notifikasi desktop">{notice}</aside>
      <div className="px-wallpaper-credit" aria-hidden="true"><PixelIcon kind="signal" /><span>LACAK<br />PERSONAL DESKTOP</span></div>
    </main>
    <footer className="px-taskbar"><button id="dual-switcher-trigger" className="px-launcher" onClick={() => setSwitcher(!switcher)} aria-expanded={switcher} aria-controls="dual-switcher"><PixelIcon kind="signal" /><span>LACAK</span></button><nav className="px-running-apps" aria-label="Taskbar aplikasi">{catalog.map(app => <button key={app.id} id={`dual-task-${app.id}`} className={`px-task ${active === app.id ? 'is-active' : ''}`} aria-label={`Tampilkan ${app.label}`} onClick={() => openApp(app.id)}><PixelIcon kind={app.id} /><span>{app.label}</span><span className={`px-running-mark ${opened.includes(app.id) ? 'is-running' : ''}`} /></button>)}</nav><div className="px-system-tray"><span className="px-offline-icon" aria-hidden="true">▂▄▆</span><span>Simulasi lokal</span><span className="px-tray-divider" /><span className="px-clock">SORE HARI</span></div></footer>
    {switcher ? <AppSwitcher active={active} openApp={openApp} onClose={dismissSwitcher} /> : null}
  </div>;

  const app = catalog.find(item => item.id === active);
  return <MobileReviewShell title={app?.label ?? 'Lacak Saku'} active={active} goBack={goBack} home={() => { navigate('home'); setSwitcher(false); }} openSwitcher={() => setSwitcher(!switcher)} count={count} notice={notice} live={live}>
    {!active ? <div className="saku-home"><div className="saku-home-title"><p className="px-eyebrow">TRUSTTRAIL / PERSONAL DEVICE</p><h1 data-review-focus tabIndex={-1}>Lacak<span>Saku.</span></h1><p>Sore yang biasa.<br />Satu pesan yang tidak biasa.</p></div><button className="saku-case-link" onClick={() => openApp('journal')}><span className="saku-case-number">01</span><span><span>BERKAS AKTIF</span><strong>{chapter.title}</strong><span>{count} bukti dicatat · investigasi Ari</span></span><span aria-hidden="true">↗</span></button><nav className="saku-home-apps" aria-label="Aplikasi Saku">{catalog.map(item => <button key={item.id} className="saku-app-icon" onClick={() => openApp(item.id)} aria-label={`Buka ${item.label}`}><span className="saku-icon-art"><PixelIcon kind={item.id} />{item.id === 'mail' || item.id === 'journal' && count > 0 ? <span className="saku-badge" aria-label={item.id === 'mail' ? '2 pesan' : `${count} bukti`}>{item.id === 'mail' ? '2' : count}</span> : null}</span><span>{item.label}</span></button>)}</nav><div className="saku-home-footer"><PixelIcon kind="signal" /><span>BUKTI DULU.<br />PERCAYA KEMUDIAN.</span></div></div> : <div className={`saku-app saku-app-${active}`}><h2 className="px-live">{app?.label}</h2>{content(active)}</div>}
    {switcher ? <AppSwitcher active={active} openApp={openApp} onClose={dismissSwitcher} /> : null}
  </MobileReviewShell>;
}

function Notice({ toast, onDismiss }: { toast: Toast | null; onDismiss: () => void }) {
  if (!toast) return null;
  return <div className="px-notification"><PixelIcon kind={toast.title.includes('bukti') || toast.title.includes('Bukti') ? 'journal' : 'mail'} /><div><strong>{toast.title}</strong><p>{toast.text}</p></div><button aria-label="Tutup notifikasi" onClick={onDismiss}>×</button></div>;
}

function MobileReviewShell({ title, active, goBack, home, openSwitcher, count, notice, live, children }: { title: string; active: AppId | null; goBack: () => void; home: () => void; openSwitcher: () => void; count: number; notice: ReactNode; live: ReactNode; children: ReactNode }) {
  return <div className={`dual-review saku-os ${active ? 'saku-in-app' : ''}`}>
    <a className="px-skip" href="#saku-main">Lewati ke aplikasi</a>{live}
    <div className="saku-status-bar"><span translate="no"><PixelIcon kind="signal" />LACAK / SAKU</span><span><span className="px-status-dot" />LOKAL <span className="saku-status-signal" aria-hidden="true">▂▄▆</span></span></div>
    <div className="saku-review-note">REVIEW DESAIN <span>·</span> PROGRES TIDAK DISIMPAN</div>
    {active ? <header className="saku-app-header"><button className="saku-back" aria-label="Kembali" onClick={goBack}><span aria-hidden="true">←</span></button><div><p>{active === 'mail' ? 'KOTAK SURAT ARI' : active === 'journal' ? 'BERKAS INVESTIGASI' : 'LACAK SAKU'}</p><h1 tabIndex={-1} data-review-focus>{title}</h1></div><span className="saku-header-icon"><PixelIcon kind={active} /></span></header> : null}
    <aside className="saku-notification" aria-label="Notifikasi Saku">{notice}</aside>
    <main id="saku-main" tabIndex={-1} className="saku-main">{children}</main>
    <nav className="saku-system-navigation" aria-label="Navigasi Saku"><button onClick={goBack} aria-label="Kembali"><span aria-hidden="true">←</span><span>Kembali</span></button><button onClick={home} aria-label="Beranda Saku" className={!active ? 'is-current' : ''}><PixelIcon kind="signal" /><span>Beranda</span></button><button id="dual-switcher-trigger" onClick={openSwitcher} aria-label="Ganti aplikasi"><span className="saku-switch-symbol" aria-hidden="true">▤</span><span>Aplikasi{count ? ` · ${count} bukti` : ''}</span></button></nav>
  </div>;
}

function AppSwitcher({ active, openApp, onClose }: { active: AppId | null; openApp: (id: AppId) => void; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = dialog.current; element?.showModal(); return () => element?.close(); }, []);
  return <dialog ref={dialog} id="dual-switcher" className="dual-switcher" aria-label="Ganti aplikasi" onCancel={onClose}><header><h2>Aplikasi Ari</h2><button aria-label="Tutup daftar aplikasi" onClick={onClose}>×</button></header><nav aria-label="Pilihan aplikasi">{catalog.map(app => <button key={app.id} onClick={() => openApp(app.id)} aria-current={active === app.id ? 'page' : undefined}><PixelIcon kind={app.id as PixelKind} /><span><strong>{app.label}</strong><span>{app.subtitle}</span></span><span aria-hidden="true">{active === app.id ? '●' : '→'}</span></button>)}</nav></dialog>;
}
