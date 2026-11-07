import { createContext, useContext } from 'react';
import type { AudioService } from './AudioService';

export const AudioServiceContext = createContext<AudioService | null>(null);
export function useAudioService() { return useContext(AudioServiceContext); }
