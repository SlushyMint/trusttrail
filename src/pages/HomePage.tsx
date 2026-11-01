import { useState } from 'react';
import { motion } from 'motion/react';
import { InvestigationMotion, investigationMotion, useInvestigationMotion, useInvestigationReveal, useInvestigationPanel } from './homepageMotion';
import { Link } from 'react-router';
import { useGame } from '../app/game-context';
import { ProgressControls, StartGameButton, SaveNotice } from '../features/gameplay/ProgressControls';
import { PixelIcon } from '../features/os/PixelIcon';
import { InvestigationOpening } from './InvestigationOpening';
import { ThreatIntelligence } from './ThreatIntelligence';
import './homepage.css';

export function HomePage() {
  return <InvestigationMotion><InvestigationHomepage /></InvestigationMotion>;
}

function InvestigationHomepage() {
  const { game } = useGame();
  const { reduced, compact } = useInvestigationMotion();
  const rise = useInvestigationReveal();
  const heading = useInvestigationReveal('heading');
  const dossier = useInvestigationReveal('content');
  return <div className="portal">
    <a className="portal-skip" href="#portal-main">Lewati ke konten</a>
    <header className="portal-header portal-wrap">
      <Link className="portal-brand" to="/" aria-label="TrustTrail, beranda"><PixelIcon kind="signal" />TrustTrail</Link>
      <nav aria-label="Navigasi beranda"><a href="#intel">Intelijen</a><a href="#latihan">Coba periksa</a><a href="#berkas">Berkas kasus</a></nav>
      <Link className="portal-guide" to="/guide">Panduan & privasi</Link>
    </header>
    <main id="portal-main" tabIndex={-1}>
      <InvestigationOpening>
        <div className="portal-hero-copy">
          <h1 id="portal-title" tabIndex={-1} data-os-focus>{['Undangan kerja.', 'Atau perangkap?'].map((line, index) => <span className="portal-title-line" key={line}><motion.span data-investigation-motion initial={reduced ? false : { y: compact ? 8 : 18 }} animate={{ y: 0 }} transition={{ duration: reduced ? 0 : compact ? investigationMotion.duration.mobile : investigationMotion.duration.scene, delay: reduced ? 0 : index * investigationMotion.stagger.line, ease: investigationMotion.ease.scene }}>{line}{index === 0 ? ' ' : null}</motion.span></span>)}</h1>
          <motion.p {...rise} className="portal-intro"><strong>Game investigasi keamanan digital.</strong> Ari mendapat undangan rekrutmen yang tak ia ingat pernah lamar. Bantu ia memeriksa jejaknya sebelum percaya.</motion.p>
          <div className="portal-start"><StartGameButton /></div>
          <motion.p {...rise} className="portal-experience">Main langsung di browser. Tanpa akun.<br />Tiga bab dan misi pemulihan siap dimainkan · Progres tersimpan lokal.</motion.p>
          <a className="portal-text-link" href="#latihan">Coba satu pemeriksaan dulu</a>
          {game.history.length > 0 ? <details className="portal-progress"><summary>Kelola progres tersimpan</summary><ProgressControls /></details> : null}
          <SaveNotice />
        </div>
      </InvestigationOpening>
      <ThreatIntelligence />
      <section id="latihan" className="portal-practice portal-wrap" aria-labelledby="practice-title">
        <div className="portal-section-intro"><motion.h2 {...heading} id="practice-title">Terlihat resmi.<br />Coba periksa.</motion.h2><motion.p {...rise}>Rasakan cara bermain lewat email fiktif ini. Temukan satu detail di balik pengirimnya, tanpa membocorkan kasus Ari.</motion.p></div>
        <EmailInspection />
      </section>
      <section id="berkas" className="portal-cases portal-wrap" aria-labelledby="cases-title">
        <div className="portal-section-intro"><motion.h2 {...heading} id="cases-title">Satu jejak.<br />Tiga bab.</motion.h2><motion.p {...rise}>Ikuti perjalanan rekrutmen Ari. Setiap pesan membawa pertanyaan baru tentang siapa yang layak dipercaya.</motion.p></div>
        <ol className="portal-case-list">
          <motion.li {...dossier}><div><p>Bab 1 · Tersedia</p><h3>Undangan tanpa lamaran</h3></div><p>Sebuah tawaran tiba di kotak masuk. Periksa undangannya sebelum menentukan langkah Ari.</p><Link to="/play" aria-label="Buka Bab 1: Undangan tanpa lamaran">Buka berkas <span aria-hidden="true">↗</span></Link></motion.li>
          <motion.li {...dossier} transition={{ ...dossier.transition, delay: reduced ? 0 : investigationMotion.stagger.item }}><div><p>Bab 2 · Tersedia</p><h3>Perekrut yang ramah</h3></div><p>Percakapan menjadi semakin personal. Seberapa jauh sebuah perkenalan bisa dipercaya?</p><Link to="/play" aria-label="Lanjut perjalanan menuju Bab 2: Perekrut yang ramah">Lanjut perjalanan <span aria-hidden="true">↗</span></Link></motion.li>
          <motion.li {...dossier} transition={{ ...dossier.transition, delay: reduced ? 0 : investigationMotion.stagger.item * 2 }}><div><p>Bab 3 · Portal kandidat</p><h3>Verifikasi terakhir</h3></div><p>Perjalanan mendekati akhir. Sebuah portal membuka pertanyaan baru tentang batas kepercayaan.</p><span className="portal-case-status">Siap dimainkan</span></motion.li>
        </ol>
      </section>
      <section className="portal-safety" aria-labelledby="safety-title"><div className="portal-wrap portal-safety-inner"><div><PixelIcon kind="signal" /><p>Ruang latihan yang aman</p><motion.h2 {...heading} id="safety-title">Bukti dulu.<br />Percaya kemudian.</motion.h2></div><div><motion.p {...rise}>Semua tokoh, perusahaan, pesan, dan alamat dalam game adalah fiktif. TrustTrail tidak meminta kata sandi asli, OTP, atau dokumen identitas.</motion.p><motion.p {...rise}>Tanpa akun. Progres permainan disimpan di browser ini. Kamu bisa mengelolanya dari menu di dalam game.</motion.p><div className="portal-start"><StartGameButton /></div><Link className="portal-text-link" to="/guide">Cara bermain & privasi</Link></div></div></section>
    </main>
    <footer className="portal-footer portal-wrap"><Link className="portal-brand" to="/"><PixelIcon kind="signal" />TrustTrail</Link><p>Game investigasi digital · MIT-WEEK 2026</p><a href="#portal-title">Kembali ke awal</a></footer>
  </div>;
}

function EmailInspection() {
  const [inspected, setInspected] = useState(false);
  const panel = useInvestigationPanel();
  const mail = useInvestigationReveal('panel');
  const notebook = useInvestigationReveal('content', 1);
  return <div className="portal-demo">
    <motion.article {...mail} className="portal-mail" data-ui aria-label="Email latihan fiktif"><div className="portal-window-bar"><PixelIcon kind="mail" /><span>Mail / latihan terpisah</span><span aria-hidden="true">□</span></div><div className="portal-mail-content">
      <p className="portal-mail-subject">Undangan diskusi portofolio</p><p className="portal-sender"><strong>Tim Karier Lentera</strong><span>kepada: peserta latihan</span></p>
      <button type="button" className="portal-inspect" aria-expanded={inspected} aria-controls="practice-sender" onClick={() => setInspected(value => !value)}><PixelIcon kind="mail" />{inspected ? 'Tutup detail pengirim' : 'Periksa alamat pengirim'}</button>
      <div id="practice-sender" className="portal-sender-detail" hidden={!inspected}><motion.div key={String(inspected)} {...panel}><span>Alamat pengirim</span><code>undangan@lentera-acara.example</code><p>Nama tampilan belum membuktikan identitas. Cocokkan alamat lewat kanal resmi yang kamu cari secara terpisah.</p></motion.div></div>
      <p>Halo,</p><p>Kami mengundangmu ke diskusi portofolio Lentera. Detail acara tersedia di kanal resmi kami.</p><p>Salam,<br />Tim Karier Lentera</p><div className="portal-mail-foot">Simulasi fiktif. Semua alamat menggunakan .example.</div>
    </div></motion.article>
    <motion.aside {...notebook} className={`portal-notebook${inspected ? ' is-found' : ''}`} data-ui aria-label="Catatan latihan"><PixelIcon kind="journal" /><h3>Catatan pemeriksaan</h3>
      <div role="status" aria-live="polite" aria-atomic="true">{inspected ? <><p className="portal-feedback-title">Nama tampilan bukan identitas.</p><p>Pengirim memakai <code>lentera-acara.example</code>. Nama “Tim Karier Lentera” saja belum membuktikan siapa pengirimnya.</p><p>Langkah berikutnya: cari kanal resmi secara terpisah, lalu cocokkan alamatnya. Domain berbeda adalah alasan untuk memeriksa, bukan bukti pasti penipuan.</p></> : <><p>Apa yang ada di balik nama pengirim?</p><p>Buka detail alamat pada email. Satu pemeriksaan kecil bisa mengubah cara kamu membaca sebuah pesan.</p></>}</div>
      <span className="portal-demo-note">{inspected ? 'Satu petunjuk diperiksa.' : 'Belum ada detail diperiksa.'} Latihan ini tidak menyimpan progres atau skor.</span>
    </motion.aside>
  </div>;
}
