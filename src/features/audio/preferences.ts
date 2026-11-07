export const AUDIO_KEY = 'trusttrail:audio:v2';
export const LEGACY_AUDIO_KEY = 'trusttrail:audio:v1';
export type AudioPreferences = { version: 2; muted: boolean; volume: number };
export const DEFAULT_AUDIO: AudioPreferences = { version: 2, muted: false, volume: 0.35 };

export function decodeAudio(raw: string | null): AudioPreferences {
  if (!raw || raw.length > 512) return { ...DEFAULT_AUDIO };
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return { ...DEFAULT_AUDIO };
    const item = value as Record<string, unknown>;
    const legacy = item.version === 1;
    // Only this obsolete field is ignored. It never influences playback or migrated output.
    const fields = legacy ? ['version', 'muted', 'volume', 'sfx', 'music'] : ['version', 'muted', 'volume', 'music'];
    if ((legacy || item.version === 2) && (!legacy || typeof item.sfx === 'boolean') && Object.keys(item).every(key => fields.includes(key)) && typeof item.muted === 'boolean' && typeof item.volume === 'number' && Number.isFinite(item.volume) && item.volume >= 0 && item.volume <= 1) {
      return { version: 2, muted: item.muted || legacy && item.sfx === false, volume: item.volume };
    }
  } catch { /* An optional, untrusted preference never blocks the investigation. */ }
  return { ...DEFAULT_AUDIO };
}

export function readAudio(): AudioPreferences {
  try { return decodeAudio(localStorage.getItem(AUDIO_KEY) ?? localStorage.getItem(LEGACY_AUDIO_KEY)); } catch { return { ...DEFAULT_AUDIO }; }
}
export function storeAudio(preferences: AudioPreferences): boolean {
  try { localStorage.setItem(AUDIO_KEY, JSON.stringify(preferences)); return true; } catch { return false; }
}
