import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from './Button';

type DrawerProps = { open: boolean; onClose: () => void; title: string; children: ReactNode };

export function Drawer({ open, onClose, title, children }: DrawerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (!element || !open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (!element.open) element.showModal();
    closeButton.current?.focus();
    return () => {
      if (element.open) element.close();
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open]);

  return (
    <dialog ref={dialog} className="drawer" aria-labelledby={titleId}
      onCancel={event => { event.preventDefault(); onClose(); }}>
      <div className="drawer__header">
        <h2 id={titleId}>{title}</h2>
        <Button ref={closeButton} variant="quiet" onClick={onClose} aria-label={`Tutup ${title}`}>Tutup <span aria-hidden="true">×</span></Button>
      </div>
      <div className="drawer__body">{children}</div>
    </dialog>
  );
}
