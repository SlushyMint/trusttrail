import { useSyncExternalStore } from 'react';

export const DESKTOP_QUERY = '(min-width: 1120px) and (min-height: 700px)';
function subscribe(callback: () => void) {
  if (!window.matchMedia) return () => {};
  const query = window.matchMedia(DESKTOP_QUERY);
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
}
function snapshot() { return window.matchMedia?.(DESKTOP_QUERY).matches ?? false; }
export function useDesktopLayout() { return useSyncExternalStore(subscribe, snapshot, () => false); }
