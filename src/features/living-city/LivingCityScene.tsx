import { useEffect, useRef } from 'react';
import type { MotionValue } from 'motion/react';
import { CITY_STATIC } from './sceneAssets';
import type { CityScene } from './sceneTypes';
import './living-city.css';

/** Decorative only: all content and controls remain in the surrounding HTML. */
export function LivingCityScene({ paused = false, scrollProgress }: { paused?: boolean; scrollProgress?: MotionValue<number> }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const pauseRef = useRef(paused);
  const reconcileRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    pauseRef.current = paused;
    reconcileRef.current?.();
  }, [paused]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (typeof window.matchMedia !== 'function') {
      host.dataset.cityStatus = 'fallback';
      return;
    }
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let visible = !('IntersectionObserver' in window);
    let pending = false;
    let failed = false;
    let controller: AbortController | undefined;
    let scene: CityScene | undefined;

    function fail() {
      if (disposed) return;
      failed = true;
      scene?.destroy();
      scene = undefined;
      host!.dataset.cityStatus = 'fallback';
    }

    function reconcile() {
      if (disposed) return;
      if (motion.matches) {
        controller?.abort();
        scene?.destroy();
        scene = undefined;
        host!.dataset.cityStatus = 'reduced-motion';
        return;
      }
      const active = visible && !document.hidden && !pauseRef.current;
      scene?.setActive(active);
      if (failed || scene || pending || !active) return;
      pending = true;
      const attempt = new AbortController();
      controller = attempt;
      host!.dataset.cityStatus = 'loading';
      // The entire renderer (including PixiJS) stays outside the entry chunk.
      void import('./createCityScene').then(async ({ createCityScene }) => {
        if (disposed || attempt.signal.aborted) return;
        const created = await createCityScene({ host: host!, signal: attempt.signal, onError: fail, readScroll: () => scrollProgress?.get() ?? 0 });
        if (!created) return;
        if (disposed || attempt.signal.aborted) { created.destroy(); return; }
        scene = created;
        host!.dataset.cityStatus = 'ready';
      }).catch(() => {
        if (!attempt.signal.aborted) fail();
      }).finally(() => {
        pending = false;
        // A motion preference change during init waits for disposal before retrying.
        reconcile();
      });
    }

    reconcileRef.current = reconcile;
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      reconcile();
    }) : undefined;
    observer?.observe(host);
    motion.addEventListener('change', reconcile);
    document.addEventListener('visibilitychange', reconcile);
    reconcile();
    return () => {
      disposed = true;
      reconcileRef.current = undefined;
      controller?.abort();
      observer?.disconnect();
      motion.removeEventListener('change', reconcile);
      document.removeEventListener('visibilitychange', reconcile);
      scene?.destroy();
    };
  }, [scrollProgress]);

  return <div ref={hostRef} className="living-city" aria-hidden="true" data-city-status="static">
    <picture className="living-city-fallback">
      <source media="(max-width: 767px)" srcSet={CITY_STATIC.replace('.webp', '-compact.webp')} />
      <img src={CITY_STATIC} width="1672" height="941" alt="" fetchPriority="high" />
    </picture>
  </div>;
}
