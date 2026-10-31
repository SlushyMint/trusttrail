import { useState } from 'react';
import { Link } from 'react-router';
import { useGame, useGameActions } from '../../app/game-context';
import { PixelIcon } from '../os/PixelIcon';
import { Button } from '../../components/ui/Button';
import { chapterFacts, debriefNode, outcomeNode } from '../../engine/reducer';
import type { Chapter } from '../../engine/types';
import { SourcePanel } from './SourcePanel';
import { ProgressControls, StartGameButton } from './ProgressControls';

export function Briefing({ started }: { started: boolean }) {
  const { send } = useGameActions();
  return <section className="story-spread dossier-briefing" aria-labelledby="briefing-title">
    <div className="os-story-mark" aria-hidden="true"><PixelIcon kind="files" /></div>
    <div className="story-copy"><p className="section-label">Berkas pertama · Kenali Ari</p><h2 id="briefing-title" data-scene-focus tabIndex={-1}>Sebuah kesempatan.<br />Atau sebuah jebakan?</h2>
      <p className="lead">Ari baru lulus. Undangan magang ini terdengar seperti jawaban atas puluhan lamaran.</p><p>Periksa pesan, catat jejak, lalu pilih langkah Ari. Tidak ada kewajiban menemukan semua bukti.</p>
      <div className="safety-note"><h3>Ini ruang simulasi</h3><p>Semua tokoh dan alamat fiktif. Jangan masukkan kata sandi, OTP, atau dokumen. Tidak ada tenggat sungguhan.</p></div>
      <p className="muted">Gunakan Tab dan Enter, atau sentuh detail berlabel “Periksa”.</p>
      {started ? <Button onClick={() => send({ type: 'story.begun' })}>Buka berkas pertama <span aria-hidden="true">↗</span></Button> : <StartGameButton />}
    </div>
  </section>;
}

export function NarrativeView({ chapter, lineIndex }: { chapter: Chapter; lineIndex: number }) {
  const { send } = useGameActions();
  const line = chapter.intro[lineIndex]!;
  return <section className="story-spread narrative-spread" aria-label="Cerita Ari">
    <div className="os-story-mark" aria-hidden="true"><PixelIcon kind="files" /></div>
    <div className="story-copy"><p className="section-label">{chapter.subtitle}</p><h2>{chapter.title}</h2>
      <div className="narrative-line" data-scene-focus tabIndex={-1}><p className="speaker">{line.speaker}</p><p>{line.text}</p></div>
      <div className="story-pagination"><span>Catatan {lineIndex + 1} dari {chapter.intro.length}</span><Button onClick={() => send({ type: 'line.advanced', nodeId: `${chapter.id}-intro`, lineIndex })}>{lineIndex === chapter.intro.length - 1 ? 'Periksa undangan' : 'Lanjut cerita'} <span aria-hidden="true">→</span></Button></div>
    </div>
  </section>;
}

export function DecisionView({ chapter }: { chapter: Chapter }) {
  const { send } = useGameActions();
  const [selected, setSelected] = useState('');
  return <section className="decision-view" aria-labelledby="decision-title">
    <p className="section-label">Saatnya menentukan langkah</p><h2 id="decision-title" data-scene-focus tabIndex={-1}>Apa langkah Ari?</h2><p className="lead">{chapter.decision.prompt}</p>
    <fieldset className="decision-options"><legend>Pilih satu tindakan, lalu jalankan pilihanmu.</legend>
      {chapter.decision.options.map((option, index) => <label key={option.id} className={`decision-option${selected === option.id ? ' decision-option--selected' : ''}`}>
        <input type="radio" name={chapter.decision.id} value={option.id} checked={selected === option.id} onChange={() => setSelected(option.id)} />
        <span className="option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span><span><strong>{option.label}</strong><span className="option-description">{option.description}</span></span>
      </label>)}
    </fieldset>
    <div className="action-row"><Button disabled={!selected} onClick={() => send({ type: 'choice.committed', decisionId: chapter.decision.id, optionId: selected })}>Jalankan pilihan</Button><Button variant="secondary" onClick={() => send({ type: 'decision.closed', decisionId: chapter.decision.id })}>Periksa lagi</Button></div>
    <p className="muted decision-help">Pilihan baru dicatat setelah kamu menekan “Jalankan pilihan”. Setelah itu, kamu tetap bisa melanjutkan cerita apa pun akibatnya.</p>
  </section>;
}

export function VerificationView({ chapter }: { chapter: Chapter }) {
  return <div className="verification-view"><h2 data-scene-focus tabIndex={-1}>Periksa sebelum menyimpulkan.</h2><SourcePanel chapter={chapter} resolution /></div>;
}

export function OutcomeView({ chapter, optionId }: { chapter: Chapter; optionId: string }) {
  const { send } = useGameActions();
  const option = chapter.decision.options.find(item => item.id === optionId)!;
  return <section className="outcome-view" aria-labelledby="outcome-title"><p className="section-label">Akibat pilihanmu</p><h2 id="outcome-title" data-scene-focus tabIndex={-1}>{option.outcome.title}</h2>
    {option.id === 'follow-link' ? <div className="simulated-preview"><div className="artifact-chrome"><span>Pratinjau kandidat</span><span>Simulasi · Tidak ada pengiriman</span></div><div><p className="inert-address" translate="no">{chapter.email.destination}</p><p className="portal-wordmark">NovaTech</p><p>Selamat datang, kandidat.</p><p className="muted">Halaman dalam cerita belum terverifikasi. Tidak ada formulir masuk pada simulasi ini.</p></div></div> : null}
    <p className="lead">{option.outcome.text}</p><blockquote>{option.outcome.reflection}</blockquote><Button onClick={() => send({ type: 'outcome.continued', nodeId: outcomeNode(chapter.decision.id, optionId) })}>Lihat refleksi <span aria-hidden="true">→</span></Button>
  </section>;
}

export function DebriefView({ chapter, optionId }: { chapter: Chapter; optionId: string }) {
  const { game } = useGame();
  const { send } = useGameActions();
  const option = chapter.decision.options.find(item => item.id === optionId)!;
  const facts = chapterFacts(game, chapter);
  return <section className="debrief-view" aria-labelledby="debrief-title"><p className="section-label">Catatan refleksi · Bab 1</p><h2 id="debrief-title" data-scene-focus tabIndex={-1}>Ada alasan di balik setiap langkah.</h2>
    <div className="debrief-grid"><div><h3>Yang terjadi</h3><p>{option.feedback.happened}</p><h3>Mengapa ini berarti</h3><p>{option.feedback.why}</p></div><div className="next-action"><h3>Langkah yang bisa kamu bawa pulang</h3><p>{option.feedback.next}</p></div></div>
    <div className="chapter-facts" aria-label="Catatan tindakan Bab 1"><p><strong>{facts.awareness} / 4</strong><span>Bukti diperiksa sebelum memilih</span></p><p><strong>{facts.verification} / 2</strong><span>Langkah verifikasi dilakukan</span></p><p><strong>{facts.safety} / 2</strong><span>Kriteria perlindungan dipenuhi</span></p></div>
    {facts.lateEvidence.length ? <p className="muted">Ada {facts.lateEvidence.length} bukti yang ditemukan setelah pilihan. Bukti itu tetap ada di jurnal, tetapi tidak dihitung seolah sudah kamu ketahui sebelumnya.</p> : null}
    <p className="limitation">{option.feedback.limitation}</p><p className="muted">Ini catatan Bab 1. Nilai empat kompetensi dan nilai keseluruhan baru tersedia setelah tiga bab serta latihan pemulihan selesai.</p>
    <Button onClick={() => send({ type: 'debrief.continued', nodeId: debriefNode(chapter.decision.id, optionId) })}>Tutup berkas Bab 1 <span aria-hidden="true">→</span></Button>
  </section>;
}

export function ChapterComplete({ chapter }: { chapter: Chapter }) {
  const { game } = useGame();
  return <section className="chapter-complete" aria-labelledby="chapter-complete-title"><p className="section-label">Berkas pertama selesai</p><h2 id="chapter-complete-title" data-scene-focus tabIndex={-1}>Undangannya berhenti.<br />Jejaknya belum.</h2><p className="lead">{game.flags.openedSuspiciousLink ? chapter.bridge.exposed : chapter.bridge.cautious}</p>
    <div className="milestone-note"><h3>Bab 1 selesai</h3><p>Progres dan pilihanmu tetap tercatat. Bab 2–3 serta latihan pemulihan sedang dibangun pada milestone berikutnya. Laporan akhir belum tersedia di build M1 ini.</p></div>
    <div className="action-row"><Link className="button button--primary" to="/">Kembali ke beranda</Link><Link className="button button--secondary" to="/guide">Buka panduan</Link></div><ProgressControls />
  </section>;
}
