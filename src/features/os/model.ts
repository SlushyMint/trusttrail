import { createContext, useContext } from 'react';
import type { GameEvent } from '../../engine/types';

export type AppId = 'mail' | 'browser' | 'messages' | 'files' | 'journal';
export type Send = (event: GameEvent) => void;
export type Toast = { title: string; text: string };
export const applications: { id: AppId; label: string; subtitle: string }[] = [
  { id: 'mail', label: 'Mail', subtitle: 'Kotak masuk Ari' },
  { id: 'browser', label: 'Browser', subtitle: 'Sumber terpisah' },
  { id: 'messages', label: 'Messages', subtitle: 'Percakapan' },
  { id: 'files', label: 'Files', subtitle: 'Berkas lokal' },
  { id: 'journal', label: 'Case Files', subtitle: 'Catatan bukti' },
];
export const OsContext = createContext<{ desktop: boolean; openApp: (id: AppId) => void } | null>(null);
export function useOs() { const context = useContext(OsContext); if (!context) throw new Error('OperatingSystem diperlukan.'); return context; }
