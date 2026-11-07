import { useId, useState, useSyncExternalStore } from 'react';
import { Drawer } from '../../components/ui/Drawer';
import { useAudioService } from './audio-context';
import type { AudioService } from './AudioService';
import './audio.css';

export function AudioControls() {
  const audio = useAudioService();
  return audio ? <Controls audio={audio} /> : null;
}

function Controls({ audio }: { audio: AudioService }) {
  const { preferences: p, status, persistent } = useSyncExternalStore(audio.subscribe, audio.getSnapshot);
  const [open, setOpen] = useState(false);
  const volumeId = useId();
  const message = status === 'unsupported' ? 'Audio tidak tersedia di browser ini. Semua petunjuk tetap tersedia dalam teks.'
    : status === 'blocked' ? 'Browser belum mengizinkan audio. Coba lagi melalui tombol di bawah.'
    : p.muted || p.volume === 0 ? 'Semua suara dibisukan.'
    : 'Efek suara mengikuti tindakan investigasi.';
  return <div className="audio-controls" onKeyDown={event => { if (open && event.key === 'Escape') event.stopPropagation(); }}>
    <button type="button" aria-label="Bisukan semua suara" aria-pressed={p.muted} title={p.muted ? 'Aktifkan kembali suara' : 'Bisukan semua suara'} onClick={() => audio.setMuted(!p.muted)}>
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 7h3l4-4v12l-4-4H2Z" />{p.muted || p.volume === 0 ? <path d="m12 6 4 6m0-6-4 6" /> : <path d="M12 6c2 1 2 5 0 6m2-9c4 3 4 9 0 12" />}</svg>
    </button>
    <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog">Suara</button>
    {open ? <Drawer open title="Pengaturan suara" onClose={() => setOpen(false)}>
      <div className="audio-settings">
        <p>Efek singkat menemani tindakan investigasi. Semua petunjuk tetap dapat dibaca tanpa suara.</p>
        <label><input type="checkbox" checked={p.muted} onChange={event => audio.setMuted(event.target.checked)} />Bisukan semua suara</label>
        <label htmlFor={volumeId}>Volume efek suara (SFX) <output>{Math.round(p.volume * 100)}%</output></label>
        <input id={volumeId} name="audio-volume" type="range" min="0" max="100" step="5" value={Math.round(p.volume * 100)} onChange={event => audio.setVolume(Number(event.target.value) / 100)} />
        <p role="status" aria-label="Status audio" aria-live="polite">{message}</p>
        {status === 'blocked' && !p.muted && p.volume > 0 ? <button type="button" className="button button--secondary" onClick={audio.retry}>Coba audio</button> : null}
        {!persistent ? <p>Preferensi suara hanya berlaku di tab ini karena penyimpanan browser tidak tersedia.</p> : null}
      </div>
    </Drawer> : null}
  </div>;
}
