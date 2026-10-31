import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode, type RefObject } from 'react';
import { motion, useDragControls, useMotionValue, useReducedMotion } from 'motion/react';
import { PixelIcon, type PixelKind } from './PixelIcon';

export type WindowSlot = 'left' | 'right' | undefined;

type Props = {
  id: string; icon: PixelKind; title: string; desktop: boolean; hidden: boolean;
  active: boolean; maximized: boolean; layer: number; resetVersion: number;
  slot: WindowSlot; workspace: RefObject<HTMLElement | null>;
  onPlace: (slot: WindowSlot) => void; onFocus: () => void;
  onClose: () => void; onMinimize: () => void; onMaximize: () => void;
  children: ReactNode;
};

/** Presentation only: no game context, events, scoring, or storage. */
export function AppFrame({ id, icon, title, desktop, hidden, active, maximized, layer, resetVersion, slot, workspace, onPlace, onFocus, onClose, onMinimize, onMaximize, children }: Props) {
  const frame = useRef<HTMLElement>(null);
  const options = useRef<HTMLDetailsElement>(null);
  const x = useMotionValue(0), y = useMotionValue(0);
  const dragControls = useDragControls();
  const reduced = useReducedMotion();
  const gesture = useRef<{ x: number; y: number; dragging: boolean } | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const movable = desktop && !hidden && !maximized;

  function constrain() {
    const element = frame.current, area = workspace.current;
    if (!element || !area) return;
    const rect = element.getBoundingClientRect(), bounds = area.getBoundingClientRect();
    // Motion values can be ahead of the painted frame during rapid key repeats.
    // Recover the untransformed origin rather than clamping a stale visual rect.
    const transform = getComputedStyle(element).transform;
    const matrix = new DOMMatrixReadOnly(transform === 'none' ? undefined : transform);
    const originX = rect.left - matrix.m41, originY = rect.top - matrix.m42;
    const minX = bounds.left - originX, minY = bounds.top - originY;
    x.set(Math.min(Math.max(x.get(), minX), Math.max(minX, bounds.right - rect.width - originX)));
    y.set(Math.min(Math.max(y.get(), minY), Math.max(minY, bounds.bottom - rect.height - originY)));
  }

  function cancelGesture() {
    const origin = gesture.current;
    if (!origin) return;
    dragControls.cancel();
    x.set(origin.x); y.set(origin.y);
    gesture.current = null;
    frame.current?.removeAttribute('data-dragging');
    setAnnouncement(`Pemindahan ${title} dibatalkan.`);
  }
  const cancelFromEffect = useEffectEvent(cancelGesture);

  useLayoutEffect(() => {
    dragControls.cancel();
    gesture.current = null;
    frame.current?.removeAttribute('data-dragging');
    x.set(0); y.set(0);
  }, [slot, resetVersion, dragControls, x, y]);

  const fit = useEffectEvent(() => { cancelGesture(); constrain(); });
  useEffect(() => {
    if (!movable) return;
    let raf = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => fit());
    });
    if (workspace.current) observer.observe(workspace.current);
    if (frame.current) observer.observe(frame.current);
    return () => { observer.disconnect(); cancelAnimationFrame(raf); };
  }, [movable, workspace]);

  useEffect(() => {
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (gesture.current) { event.preventDefault(); cancelFromEffect(); }
      if (options.current?.open) {
        event.preventDefault(); options.current.open = false;
        options.current.querySelector('summary')?.focus();
      }
    }
    function onOutside(event: globalThis.PointerEvent) {
      if (options.current?.open && event.target instanceof Node && !options.current.contains(event.target)) options.current.open = false;
    }
    function onBlur() { cancelFromEffect(); }
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onOutside);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onOutside);
      window.removeEventListener('blur', onBlur);
      cancelFromEffect();
    };
  }, [movable]);

  function startDrag(event: PointerEvent<HTMLElement>) {
    if (!movable || !event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('button, summary, details, a, input')) return;
    options.current?.removeAttribute('open');
    gesture.current = { x: x.get(), y: y.get(), dragging: false };
    dragControls.start(event);
  }

  function moveByKey(event: KeyboardEvent<HTMLElement>) {
    if (!movable || event.altKey || event.ctrlKey || event.metaKey) return;
    const steps: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const step = steps[event.key];
    if (event.key === 'Home') { event.preventDefault(); place(undefined); return; }
    if (!step) return;
    event.preventDefault();
    const distance = event.shiftKey ? 64 : 16;
    moveWindow(step[0] * distance, step[1] * distance);
  }

  function moveWindow(dx: number, dy: number) {
    if (!movable) return;
    x.set(x.get() + dx); y.set(y.get() + dy); constrain();
    setAnnouncement(`${title} dipindahkan.`);
  }

  function positionOptions() {
    const details = options.current, area = workspace.current;
    const panel = details?.querySelector<HTMLElement>('.os-window-position-panel');
    if (!details?.open || !panel || !area) return;
    const rect = details.getBoundingClientRect(), bounds = area.getBoundingClientRect();
    const below = bounds.bottom - rect.bottom - 8, above = rect.top - bounds.top - 8;
    const flip = below < Math.min(panel.scrollHeight, 360) && above > below;
    panel.dataset.side = flip ? 'above' : 'below';
    panel.style.maxHeight = `${Math.floor(Math.max(100, flip ? above : below))}px`;
  }

  function place(next: WindowSlot) {
    dragControls.cancel(); gesture.current = null; frame.current?.removeAttribute('data-dragging');
    x.set(0); y.set(0); onPlace(next);
    if (options.current) {
      options.current.open = false;
      options.current.querySelector('summary')?.focus();
    }
    setAnnouncement(`${title}: ${next === 'left' ? 'sisi kiri' : next === 'right' ? 'sisi kanan' : 'posisi awal'}.`);
  }

  return <motion.section ref={frame} id={`os-app-${id}`}
    className={desktop ? `px-window px-window-${id} ${active ? 'is-foreground' : ''} ${maximized ? 'is-maximized' : ''}` : `saku-app saku-app-${id}`}
    data-slot={desktop ? slot : undefined} hidden={hidden} data-active={active} aria-label={title}
    style={{ x: desktop && !maximized ? x : 0, y: desktop && !maximized ? y : 0, zIndex: desktop ? layer : undefined }}
    initial={false} animate={{ opacity: hidden ? 0 : 1 }} transition={{ duration: reduced ? 0 : .14 }}
    drag={movable} dragControls={dragControls} dragListener={false} dragConstraints={workspace} dragElastic={0} dragMomentum={false}
    onDragStart={() => { if (gesture.current) gesture.current.dragging = true; frame.current?.setAttribute('data-dragging', 'true'); }}
    onDragEnd={() => { gesture.current = null; frame.current?.removeAttribute('data-dragging'); constrain(); setAnnouncement(`${title} dipindahkan.`); }}
    onPointerCancel={() => cancelGesture()} onFocusCapture={onFocus} onPointerDownCapture={onFocus}>
    {desktop ? <header className="px-titlebar os-draggable-titlebar" onPointerDown={startDrag} onPointerUp={() => { if (gesture.current && !gesture.current.dragging) gesture.current = null; }} onDoubleClick={event => { if (!(event.target as HTMLElement).closest('button, summary, details')) onMaximize(); }}>
      <PixelIcon kind={icon} /><h2 tabIndex={-1} data-window-heading>{title}</h2>
      <details ref={options} className="os-window-position" onToggle={positionOptions}>
        <summary aria-label={`Atur posisi ${title}`} aria-describedby={`window-help-${id}`} onKeyDown={moveByKey} title="Atur posisi atau gunakan tombol panah"><span aria-hidden="true">↔</span></summary>
        <motion.div className="os-window-position-panel" initial={reduced ? false : { y: -4 }} whileInView={{ y: 0 }} transition={{ duration: reduced ? 0 : .12 }}>
          <p id={`window-help-${id}`}>Seret bilah judul. Pada tombol ↔, gunakan panah untuk memindahkan, Shift untuk langkah besar, atau Home untuk posisi awal.</p>
          <div className="os-window-nudge" aria-label="Geser tanpa menyeret"><button type="button" onClick={() => moveWindow(-32, 0)} aria-label={`Geser ${title} ke kiri`}>← Kiri</button><button type="button" onClick={() => moveWindow(32, 0)} aria-label={`Geser ${title} ke kanan`}>Kanan →</button><button type="button" onClick={() => moveWindow(0, -32)} aria-label={`Geser ${title} ke atas`}>↑ Atas</button><button type="button" onClick={() => moveWindow(0, 32)} aria-label={`Geser ${title} ke bawah`}>Bawah ↓</button></div>
          <button type="button" onClick={() => place('left')}>Sisi kiri</button><button type="button" onClick={() => place('right')}>Sisi kanan</button><button type="button" onClick={() => place(undefined)}>Posisi awal</button>
        </motion.div>
      </details>
      <div className="px-window-controls"><button aria-label={`Minimalkan ${title}`} onClick={onMinimize}><span aria-hidden="true">_</span></button><button aria-label={`${maximized ? 'Pulihkan' : 'Maksimalkan'} ${title}`} onClick={onMaximize}><span aria-hidden="true">□</span></button><button aria-label={`Tutup ${title}`} onClick={onClose}><span aria-hidden="true">×</span></button></div>
    </header> : <h2 className="px-live">{title}</h2>}
    <div className={desktop ? 'px-window-content' : 'os-mobile-content'}>{children}</div>
    {desktop ? <p className="px-live" role="status" aria-live="polite">{announcement}</p> : null}
  </motion.section>;
}
