import type { ReactNode } from 'react';
import type { AppId } from './model';
import { PixelIcon } from './PixelIcon';

export function DesktopWindow({ app, title, subtitle, hidden, active, maximized, onFocus, onMinimize, onClose, onMaximize, children }: { app: AppId; title: string; subtitle: string; hidden: boolean; active: boolean; maximized: boolean; onFocus: () => void; onMinimize: () => void; onClose: () => void; onMaximize: () => void; children: ReactNode }) {
  return <section id={`px-window-${app}`} hidden={hidden} className={`px-window px-window-${app}${active ? ' is-foreground' : ''}${maximized ? ' is-maximized' : ''}`} aria-labelledby={`px-title-${app}`} onFocusCapture={onFocus} onPointerDownCapture={onFocus}>
    <header className="px-titlebar"><PixelIcon kind={app} /><h2 id={`px-title-${app}`} tabIndex={-1} data-window-heading>{title}</h2><span className="px-window-subtitle">{subtitle}</span><div className="px-window-controls"><button type="button" onClick={onMinimize} aria-label={`Minimalkan ${title}`} title="Minimalkan"><span aria-hidden="true">_</span></button><button type="button" onClick={onMaximize} aria-label={`${maximized ? 'Pulihkan' : 'Maksimalkan'} ${title}`} title={maximized ? 'Pulihkan' : 'Maksimalkan'}><span aria-hidden="true">□</span></button><button type="button" onClick={onClose} aria-label={`Tutup ${title}`} title="Tutup"><span aria-hidden="true">×</span></button></div></header>
    <div className="px-window-content">{children}</div>
  </section>;
}

