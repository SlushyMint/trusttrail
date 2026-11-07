import { Link } from 'react-router';
import { PixelIcon } from './PixelIcon';
import { applications, type AppId } from './model';
import { AudioControls } from '../audio/AudioControls';

export function DesktopSystemBar({ saved }: { saved: string }) {
  return <header className="px-system-bar"><Link to="/" className="px-game-brand" aria-label="TrustTrail, beranda" translate="no"><PixelIcon kind="signal" /><strong>TRUSTTRAIL</strong><span className="px-brand-separator">/</span><span>Lacak OS</span></Link><span className="px-preview-label">{saved}</span><nav className="os-utility-navigation" aria-label="Navigasi utama"><Link to="/guide">Panduan</Link><Link to="/report">Catatan refleksi</Link></nav><AudioControls /><div className="px-session"><span className="px-status-dot" />Sesi Ari<span className="px-system-version">LOCAL / 01</span></div></header>;
}
export function MobileStatusBar({ saved }: { saved: string }) {
  return <><div className="saku-status-bar"><Link to="/" aria-label="TrustTrail, beranda" translate="no"><PixelIcon kind="signal" />LACAK / SAKU</Link><AudioControls /><span><span className="px-status-dot" />LOKAL <span className="saku-status-signal" aria-hidden="true">▂▄▆</span></span></div><div className="saku-review-note">SIMULASI FIKTIF <span>·</span> {saved}</div></>;
}
export function DesktopTaskbar({ active, opened, openApp, menu }: { active: string; opened: AppId[]; openApp: (id: AppId) => void; menu: () => void }) {
  return <footer className="px-taskbar"><button id="os-menu-trigger" className="px-launcher" onClick={menu} aria-haspopup="dialog"><PixelIcon kind="signal" /><span>LACAK</span></button><nav className="px-running-apps" aria-label="Taskbar aplikasi">{applications.map(app => <button key={app.id} id={`task-${app.id}`} className={`px-task ${active === app.id ? 'is-active' : ''}`} aria-pressed={active === app.id} aria-label={`Tampilkan ${app.label}`} onClick={() => openApp(app.id)}><PixelIcon kind={app.id} /><span>{app.label}</span><span className={`px-running-mark ${opened.includes(app.id) ? 'is-running' : ''}`} /></button>)}</nav><div className="px-system-tray"><span className="px-offline-icon" aria-hidden="true">▂▄▆</span><span>Simulasi lokal</span><span className="px-tray-divider" /><span className="px-clock">SORE HARI</span></div></footer>;
}
export function MobileSystemNavigation({ back, menu, count, tutorialActive }: { tutorialActive?: boolean; back: () => void; menu: () => void; count: number }) {
  return <nav className="saku-system-navigation" aria-label="Navigasi Saku"><button onClick={back} aria-label="Kembali"><span aria-hidden="true">←</span><span>Kembali</span></button><Link to="/" aria-label="Beranda Saku"><PixelIcon kind="signal" /><span>Beranda</span></Link><button data-tutorial-target={tutorialActive} id="os-menu-trigger" onClick={menu} aria-label="Ganti aplikasi" aria-haspopup="dialog"><span className="saku-switch-symbol" aria-hidden="true">▤</span><span>Aplikasi{count ? ` · ${count} bukti` : ''}</span></button></nav>;
}
