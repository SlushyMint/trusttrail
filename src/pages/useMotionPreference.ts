import { useSyncExternalStore } from 'react';

const query = '(prefers-reduced-motion: reduce)';
const snapshot = () => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches;
const serverSnapshot = () => false;
function subscribe(notify: () => void) {
  const media = window.matchMedia?.(query);
  media?.addEventListener('change', notify);
  return () => media?.removeEventListener('change', notify);
}

/** Subscribe to live changes as well as the initial browser preference. */
export function useMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}
