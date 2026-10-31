import { Link } from 'react-router';
import { Notice } from '../components/ui/Notice';
import { useGame } from '../app/game-context';
import { scenario } from '../content/scenario';
import { chapterFacts } from '../engine/reducer';
import { recoveryDone, recoverySteps, reportReady } from '../engine/recovery';

export function ReportPage() {
  const { game } = useGame();
  const ready = reportReady(game);
  const recovery = recoverySteps(game);
  return <div className="page-frame reading-page"><h1 tabIndex={-1}>Catatan refleksi</h1><p className="lead">{ready ? 'Trust Report · Perjalanan Ari lengkap' : 'Lihat kembali langkah yang kamu ambil.'}</p>
    {ready ? <><p>Undangan, kedekatan, lalu verifikasi akun: tiga lapisan dari satu rangkaian. Ari menyusun bukti dan rencana penanganan sebelum mengakhiri kontak.</p>
      {scenario.chapters.map(chapter => { const facts = chapterFacts(game, chapter); return <section className="tt-report-chapter" key={chapter.id} aria-label={`Laporan Bab ${chapter.id.slice(1)}`}><h2>Bab {chapter.id.slice(1)} · {chapter.title}</h2><p><strong>Pilihan tercatat:</strong> {facts.option?.label}</p><dl><dt>Bukti sebelum memilih</dt><dd>{facts.awareness} / {chapter.evidence.length}</dd><dt>Langkah verifikasi</dt><dd>{facts.verification} / 2</dd><dt>Kriteria perlindungan</dt><dd>{facts.safety} / 2</dd></dl><p>{facts.option?.feedback.why}</p>{facts.lateEvidence.length ? <p>Bukti setelah pilihan: {facts.lateEvidence.map(clue => clue.id).join(', ')}. Tidak dihitung sebagai pengetahuan sebelum memilih.</p> : null}<details><summary>Buka bukti yang tercatat</summary>{chapter.evidence.filter(clue => game.discoveries[clue.id]).map(clue => <p key={clue.id}><strong>{clue.id} · {clue.title}</strong><br />{clue.detail}</p>)}</details></section>; })}
      <section className="tt-report-chapter"><h2>Pemulihan sesuai paparan</h2><p>{recovery.filter(step => recoveryDone(game, step.id)).length} / {recovery.length} tindakan latihan selesai. Tidak ada bonus skor untuk mengulang tindakan.</p><ol>{recovery.map(step => <li key={step.id}>{step.receipt}</li>)}</ol><p>{game.flags.simulatedAccountRisk ? 'Akses email berisiko dalam simulasi; latihan pengamanan akun dilakukan.' : 'Tidak ada kode dibagikan; membuka portal saja bukan bukti pengambilalihan akun.'} {game.flags.simulatedDataExposure ? 'Paparan identitas dari Bab 2 tetap memerlukan bantuan resmi dan pemantauan.' : 'Tidak ada paparan dokumen identitas dalam cerita.'}</p></section>
      <p>Angka di atas merangkum peristiwa permainan: bukti yang diketahui sebelum memilih, sumber yang diperiksa serta dibandingkan, dan kriteria tindakan pada setiap pilihan. Angka ini bukan nilai kemampuan, sertifikasi, atau perkiraan keamanan tawaran di dunia nyata.</p></> : <Notice title="Perjalanan belum lengkap"><p>Selesaikan tiga bab, misi pemulihan, dan refleksi akhir untuk membuka Trust Report. Progres bab sebelumnya tetap tersimpan di ruang misi.</p></Notice>}
    <div className="paper-note"><h2>Ruang untuk belajar</h2><p>Gunakan jalur independen, batasi data yang dibagikan, dan sesuaikan pemulihan dengan paparan yang benar-benar terjadi. Seluruh tindakan pemulihan di sini adalah latihan; tidak ada laporan atau pesan nyata dikirim.</p><Link to="/play" className="button button--secondary">Kembali ke ruang misi →</Link></div></div>;
}
