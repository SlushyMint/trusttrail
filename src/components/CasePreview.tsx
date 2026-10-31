import { useState } from 'react';
import { StoryArtwork } from './StoryArtwork';

export function CasePreview() {
  const [open, setOpen] = useState(false);
  return <section className={`case-preview${open ? ' case-preview--open' : ''}`} aria-label="Pratinjau berkas Ari">
    <div className="case-preview__heading"><span>Berkas Ari</span><span>Undangan pertama</span></div>
    <div className="case-preview__art"><StoryArtwork kind="dossier" priority alt="Map berisi surat undangan, amplop, dan potongan arsip di meja investigasi, diterangi cahaya senja." /></div>
    <div className="case-preview__cover">
      <p>Sebuah pesan.<br /><strong>Banyak pertanyaan.</strong></p>
      <button type="button" className="case-preview__toggle" aria-expanded={open} aria-controls="case-preview-inside" onClick={() => setOpen(!open)}>{open ? 'Tutup pratinjau' : 'Intip berkas'} <span aria-hidden="true">{open ? '−' : '↗'}</span></button>
    </div>
    <div id="case-preview-inside" className="case-preview__inside" hidden={!open}>
      <p className="case-preview__subject">Satu undangan baru.</p><p>Pengirimnya mengaku sebagai perekrut. Ari belum yakin pernah melamar.</p>
      <p className="case-preview__question">Apa yang akan kamu periksa lebih dulu?</p>
    </div>
  </section>;
}
