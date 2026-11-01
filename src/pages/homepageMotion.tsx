import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';
import { MotionConfig } from 'motion/react';
import { useMotionPreference } from './useMotionPreference';

/** Seconds for Motion; the matching CSS tokens live in homepage.css. */
export const investigationMotion = {
  duration: { press: .12, hover: .18, panel: .28, reveal: .52, scene: .72, mobile: .34 },
  ease: { out: [.22, 1, .36, 1], scene: [.16, 1, .3, 1] },
  spring: { type: 'spring', stiffness: 380, damping: 40, mass: .8 },
  stagger: { line: .085, item: .065 },
  travel: { heading: 18, content: 12, panel: 8, showcase: -22 },
} as const;

const compactQuery = '(max-width: 767px), (pointer: coarse)';
const compactSnapshot = () => typeof window !== 'undefined' && !!window.matchMedia?.(compactQuery).matches;
function subscribeCompact(notify: () => void) {
  const media = window.matchMedia?.(compactQuery);
  media?.addEventListener('change', notify);
  return () => media?.removeEventListener('change', notify);
}
const MotionContext = createContext({ reduced: false, compact: false });

/** A homepage-only boundary: gameplay motion and state are untouched. */
export function InvestigationMotion({ children }: { children: ReactNode }) {
  const reduced = useMotionPreference();
  const compact = useSyncExternalStore(subscribeCompact, compactSnapshot, () => true);
  return <MotionContext value={{ reduced, compact }}><MotionConfig reducedMotion={reduced ? 'always' : 'never'} transition={{ duration: investigationMotion.duration.panel, ease: investigationMotion.ease.out }}>{children}</MotionConfig></MotionContext>;
}

export const useInvestigationMotion = () => useContext(MotionContext);

/** Readable from the first frame, including fast scrolling and failed observers. */
export function useInvestigationReveal(kind: 'heading' | 'content' | 'panel' = 'content', order = 0) {
  const { reduced, compact } = useInvestigationMotion();
  const distance = investigationMotion.travel[kind] * (compact ? .5 : 1);
  return {
    'data-investigation-motion': '',
    initial: reduced ? false as const : { y: distance },
    whileInView: { y: 0 },
    // Also settle a keyboard-focused control before it can drift away from focus.
    whileFocus: { y: 0 },
    viewport: { once: true, amount: .12 },
    transition: {
      duration: reduced ? 0 : compact ? investigationMotion.duration.mobile : investigationMotion.duration.reveal,
      delay: reduced ? 0 : order * investigationMotion.stagger.item,
      ease: investigationMotion.ease.out,
    },
  };
}

/** Replace immediately, animate the arriving content; never queue an exit. */
export function useInvestigationPanel() {
  const { reduced, compact } = useInvestigationMotion();
  return {
    'data-investigation-motion': '',
    initial: reduced ? false as const : { opacity: .82, y: compact ? 3 : investigationMotion.travel.panel },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : investigationMotion.duration.panel, ease: investigationMotion.ease.out },
  };
}
