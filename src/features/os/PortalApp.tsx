import { useState, type ReactNode } from 'react';
import type { Chapter, GameState, PortalComparison } from '../../engine/types';
import { claimMatched, portalOpened } from '../../engine/reducer';
import type { AppId, Send } from './model';
import './portal.css';

type Props = { chapter: Chapter; game: GameState; send: Send; openApp: (id: AppId) => void };

export function FinalRequest({ chapter, game, send, openApp }: Props) {
  const previous = game.choices.D2?.optionId;
  return <article className="tt-final-request">
    <h2 data-os-focus tabIndex={-1}>{chapter.email.subject}</h2><p><strong>{chapter.email.sender}</strong><br /><span translate="no">{chapter.email.address}</span></p>
    {chapter.email.paragraphs.map(text => <p key={text}>{text}</p>)}
    <aside className="tt-continuity" aria-label="Jejak keputusan sebelumnya"><h3>Catatan Ari</h3><p>{game.choices.D1?.optionId === 'follow-link' ? 'Aku sempat mengikuti tautan email. Membuka halaman saja belum berarti akun diambil alih.' : game.choices.D1?.optionId === 'verify' ? 'Aku membandingkan email dengan catatan lowongan resmi. Nama posisi yang benar tidak mengesahkan pengirim.' : 'Aku mengabaikan undangan email. Pesan lanjutan tetap datang; aku tidak pernah menyetujui proses ini.'}</p><p>{previous === 'share-data' ? 'Aku sudah membagikan identitas dan alamat dalam percakapan. Menolak kode sekarang tidak menarik kembali data itu.' : previous === 'verify-recruiter' ? 'Aku sudah memeriksa direktori perekrut. Penugasan Mira belum terkonfirmasi; portal ini perlu diperiksa lagi.' : 'Aku menolak permintaan data Mira. Ia tetap mengirim portal dan menyebut “tinggal aktivasi”.'}</p></aside>
    <p>Label tautan: <span translate="no">{chapter.email.displayedLink}</span></p><p className="tt-simulation-note">Portal dibuka di dalam permainan. Semua alamat fiktif dan tidak terhubung ke internet.</p>
    <button className="px-button px-primary" onClick={() => { send({ type: 'portal.opened', chapterId: chapter.id }); openApp('browser'); }}>{portalOpened(game, chapter) ? 'Kembali ke portal' : 'Buka portal simulasi'}</button>
  </article>;
}

function ClaimComparison({ item, game, send, enabled }: { item: PortalComparison; game: GameState; send: Send; enabled: boolean }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const matched = claimMatched(game, item.id);
  const inspected = Boolean(game.discoveries[item.evidenceId]);
  return <fieldset className="tt-claim-match" disabled={matched || !enabled || !inspected}>
    <legend>{item.label}</legend><p>{item.claim}</p>
    {!inspected ? <p>Periksa {item.evidenceId === 'C3-E01' ? 'alamat portal' : 'syarat verifikasi'} pada tab Portal terlebih dahulu.</p> : null}
    {item.answers.map(option => <label key={option.id}><input type="radio" name={item.id} value={option.id} checked={matched ? option.id === item.correctAnswerId : answer === option.id} onChange={() => { setAnswer(option.id); setFeedback(''); }} /><span>{option.text}</span></label>)}
    <button className="px-button" disabled={!answer || matched || !enabled || !inspected} onClick={() => {
      if (answer === item.correctAnswerId) { send({ type: 'claim.matched', comparisonId: item.id, answerId: answer }); setFeedback(''); }
      else setFeedback('Belum cocok. Baca kembali catatan resmi di atas, lalu pilih informasi yang tertulis di sana.');
    }}>{matched ? 'Klaim sudah dicocokkan' : `Cocokkan ${item.label.toLowerCase()}`}</button>
    <p role="status" aria-live="polite">{matched ? item.explanation : feedback}</p>
  </fieldset>;
}

export function PortalApp({ chapter, game, send, openApp, flow }: Props & { flow: ReactNode }) {
  const [tab, setTab] = useState<'portal' | 'official'>('portal');
  const [detail, setDetail] = useState('');
  const portal = chapter.portal!;
  const opened = portalOpened(game, chapter);
  const inspecting = game.position.kind === 'investigation';
  const reference = game.references[chapter.source.id];
  const compared = reference?.comparedAt !== undefined;
  const allMatched = portal.comparisons.every(item => claimMatched(game, item.id));
  if (!['investigation', 'verification'].includes(game.position.kind)) return flow;
  if (!opened) return <div className="tt-final-request"><h2 data-os-focus tabIndex={-1}>Instruksi terakhir menunggu</h2><p>Baca pesan lanjutan Mira di Mail sebelum membuka portal kandidat.</p><button className="px-button" onClick={() => openApp('mail')}>Baca instruksi di Mail</button></div>;
  function inspect(evidenceId: string) { send({ type: 'evidence.inspected', evidenceId }); setDetail(detail === evidenceId ? '' : evidenceId); }
  function hotspot(index: number) {
    const clue = chapter.evidence[index]!;
    return <div className="tt-portal-inspect"><button className="px-inspect-button" disabled={!inspecting} aria-expanded={detail === clue.id} aria-controls={`portal-${clue.id}`} onClick={() => inspect(clue.id)}>{clue.actionLabel}{game.discoveries[clue.id] ? ' · Tercatat' : ''}</button>{detail === clue.id ? <aside id={`portal-${clue.id}`} className="tt-inspection-detail"><h4>{clue.title}</h4><p>{clue.detail}</p><p>{clue.explanation}</p><p>{clue.caution}</p></aside> : null}</div>;
  }
  return <section className="tt-portal-browser" aria-label="Investigasi portal kandidat">
    <nav className="tt-browser-tabs" aria-label="Halaman Browser"><button aria-pressed={tab === 'portal'} onClick={() => setTab('portal')}>Portal kandidat</button><button aria-pressed={tab === 'official'} onClick={() => setTab('official')}>Direktori independen</button></nav>
    <div className="tt-browser-location"><span>{tab === 'portal' ? 'HTTPS' : 'Catatan lokal'}</span><span translate="no">{tab === 'portal' ? portal.address : chapter.source.address}</span></div>
    <p className="tt-mission-objective"><strong>Tujuan saat ini</strong> {compared ? 'Dua klaim sudah dibandingkan. Tentukan tindakan Ari.' : chapter.objective}</p>
    {tab === 'portal' ? <>
      <header className="tt-portal-header"><span className="tt-nova-mark" aria-hidden="true">N<span>↗</span></span><div><strong>NovaTech</strong><span>Talent Services · Candidate Center</span></div><span className="tt-portal-candidate">Ari / Intern riset pengguna</span></header>
      <div className="tt-portal-document"><h2 data-os-focus tabIndex={-1}>Aktivasi kandidat</h2><p>Portofolio ditinjau. Lengkapi verifikasi terakhir untuk membuka jadwal wawancara tim produk.</p>
        <section className="tt-portal-section"><h3>Portal partner NovaTech</h3><p>Dikelola NovaTech Talent Services, partner resmi untuk seleksi intern riset pengguna. Lanjutkan verifikasi untuk mengaktifkan status kandidat.</p>{hotspot(0)}</section>
        <section className="tt-portal-section"><h3>Koneksi terenkripsi</h3><p>HTTPS aktif. “Data kandidat terlindungi selama proses verifikasi.”</p>{hotspot(1)}</section>
        <section className="tt-portal-section tt-portal-demand"><h3>Verifikasi kepemilikan email</h3><p>Gunakan kode pemulihan Lacak Mail untuk aktivasi slot. Selesaikan sebelum pukul 21.00. Menghubungi tim pusat dapat membatalkan prioritas Anda.</p><div className="tt-fictional-code"><strong>Notifikasi untuk Ari</strong><p>Permintaan pemulihan akun Lacak Mail.<br />Jangan bagikan kode ini kepada siapa pun.</p><span>Kode fiktif disiapkan permainan · tidak ada kolom isian</span></div>{hotspot(2)}</section>
        <footer className="tt-portal-actions"><button className="px-button" onClick={() => setTab('official')}>Cari informasi resmi secara terpisah</button><button className="px-button" onClick={() => openApp('journal')}>Buka jejak Bab 1–2</button>{compared ? <button className="px-button px-primary" onClick={() => send({ type: 'decision.opened', decisionId: chapter.decision.id })}>Tentukan langkah Ari →</button> : <p>Cocokkan alamat dan prosedur pada direktori independen untuk membuka keputusan.</p>}</footer>
      </div></> : <div className="tt-official-source"><h2 data-os-focus tabIndex={-1}>Prosedur karier NovaTech</h2><p>{chapter.source.provenance}</p><button className="px-button" disabled={Boolean(reference)} onClick={() => send({ type: 'reference.inspected', sourceId: chapter.source.id, inspectionId: chapter.source.inspectionId })}>{reference ? 'Prosedur resmi sudah dibaca' : chapter.source.actionLabel}</button>
      {reference ? <><section className="tt-official-record"><h3>Catatan resmi</h3><p>{chapter.source.reference}</p></section><h3>Bandingkan dengan portal</h3><p>Pilih informasi yang benar-benar tertulis pada catatan resmi untuk setiap klaim.</p>{portal.comparisons.map(item => <ClaimComparison key={item.id} item={item} game={game} send={send} enabled={inspecting} />)}<button className="px-button" disabled={!allMatched || compared} onClick={() => send({ type: 'source.compared', sourceId: chapter.source.id })}>{compared ? 'Perbandingan dicatat' : 'Catat hasil perbandingan'}</button>{compared ? <div className="tt-comparison-result" role="status"><p>{chapter.source.comparison}</p><button className="px-button px-primary" onClick={() => send({ type: 'decision.opened', decisionId: chapter.decision.id })}>Tentukan langkah Ari →</button></div> : <p>Kedua klaim perlu dicocokkan sebelum hasil dapat dicatat.</p>}</> : <p>Buka prosedur dari sumber terpisah. Tab Browser saja belum merupakan verifikasi.</p>}
      <button className="px-text-button" onClick={() => setTab('portal')}>Kembali memeriksa portal</button></div>}
    <p className="tt-simulation-note">Simulasi fiktif · Tidak ada data, kode, atau pesan dikirim.</p>
  </section>;
}
