import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router';
import { useGame } from '../app/game-context';
import { ProgressControls, StartGameButton, SaveNotice } from '../features/gameplay/ProgressControls';
import { PixelIcon } from '../features/os/PixelIcon';
import './homepage.css';

export function HomePage() {
  const { game } = useGame();
  const reduced = useReducedMotion();
  const rise = { initial: reduced ? false as const : { y: 10 }, whileInView: { y: 0 }, viewport: { once: true, amount: .2 }, transition: { duration: reduced ? 0 : .28, ease: [.22, 1, .36, 1] as const } };
  const heading = { ...rise, initial: reduced ? false as const : { x: -8 }, whileInView: { x: 0 } };
  return <div className="portal">
    <a className="portal-skip" href="#portal-main">Lewati ke konten</a>
    <header className="portal-header portal-wrap">
      <Link className="portal-brand" to="/" aria-label="TrustTrail, beranda"><PixelIcon kind="signal" />TrustTrail</Link>
      <nav aria-label="Navigasi beranda"><a href="#intel">Intelijen</a><a href="#latihan">Coba periksa</a><a href="#berkas">Berkas kasus</a></nav>
      <Link className="portal-guide" to="/guide">Panduan & privasi</Link>
    </header>
    <main id="portal-main" tabIndex={-1}>
      <section className="portal-hero portal-wrap" aria-labelledby="portal-title">
        <div className="portal-hero-copy">
          <motion.h1 {...heading} id="portal-title" tabIndex={-1} data-os-focus>Undangan kerja.<br />Atau perangkap?</motion.h1>
          <motion.p {...rise} className="portal-intro"><strong>Game investigasi keamanan digital.</strong> Ari mendapat undangan rekrutmen yang tak ia ingat pernah lamar. Bantu ia memeriksa jejaknya sebelum percaya.</motion.p>
          <motion.div {...rise} whileTap={reduced ? undefined : { scale: .98 }} className="portal-start"><StartGameButton /></motion.div>
          <motion.p {...rise} className="portal-experience">Main langsung di browser. Tanpa akun.<br />Bab 1–2 siap dimainkan · Progres tersimpan lokal.</motion.p>
          <a className="portal-text-link" href="#latihan">Coba satu pemeriksaan dulu</a>
          {game.history.length > 0 ? <details className="portal-progress"><summary>Kelola progres tersimpan</summary><ProgressControls /></details> : null}
          <SaveNotice />
        </div>
        <motion.figure initial={reduced ? false : { y: 12, scale: .985 }} animate={{ y: 0, scale: 1 }} whileHover={reduced ? undefined : { y: -3 }} transition={{ duration: reduced ? 0 : .32, ease: [.22, 1, .36, 1] }} className="portal-game-preview" data-ui>
          <div className="portal-window-bar"><PixelIcon kind="signal" /><span>TrustTrail OS</span><span>Bab 1</span></div>
          <img src="/preview/chapter-one.jpg" width="1440" height="960" fetchPriority="high" alt="Antarmuka Bab 1: desktop Lacak OS dengan undangan rekrutmen di Mail dan jurnal Case Files di sampingnya." />
          <figcaption><span>Di dalam permainan</span><span>Periksa pesan. Bandingkan sumber. Tentukan langkah.</span></figcaption>
        </motion.figure>
      </section>
      <div className="portal-tools portal-wrap" aria-label="Alat investigasi di Bab 1">
        {([['mail', 'Mail', 'Baca di antara baris.'], ['browser', 'Browser', 'Cari sumber pembanding.'], ['journal', 'Case Files', 'Simpan jejak yang kamu temukan.']] as const).map(([image, label, caption], index) => <motion.figure {...rise} transition={{ duration: reduced ? 0 : .24, delay: reduced ? 0 : index * .05 }} key={image}><img src={`/preview/${image}.png`} width="420" height="220" loading="lazy" alt={`Cuplikan aplikasi ${label} dari Bab 1`} /><figcaption><strong>{label}</strong><span>{caption}</span></figcaption></motion.figure>)}
      </div>
      <section id="intel" className="portal-intel" aria-labelledby="intel-title"><div className="portal-wrap">
        <div className="portal-section-intro"><motion.h2 {...heading} id="intel-title">Kasusnya fiksi.<br />Risikonya nyata.</motion.h2><motion.p {...rise}>Pesan yang meyakinkan bisa menjadi awal penipuan. Tiga catatan dari sumber resmi Indonesia menunjukkan mengapa kebiasaan memeriksa itu penting.</motion.p></div>
        <div className="portal-statistics">
          <article><p className="portal-stat-number">74.243</p><h3>laporan diterima IASC</h3><p>Laporan penipuan transaksi keuangan yang diterima Indonesia Anti-Scam Centre sejak awal beroperasi hingga 23 Maret 2025.</p><p className="portal-stat-period">Periode: 22 Nov 2024–23 Mar 2025</p><details><summary>Sumber & definisi IASC</summary><p>OJK / Satgas PASTI, siaran pers 28 Maret 2025, “Waspada Penipuan Website Mengatasnamakan Indonesia Anti-Scam Centre (IASC)”. Jumlah laporan, bukan korban unik atau seluruh penipuan di Indonesia.</p><a href="https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Waspada-Penipuan-Website-Mengatasnamakan-Indonesia-Anti-Scam-Centre-IASC.aspx">Baca siaran pers OJK</a></details></article>
          <article><p className="portal-stat-number">7.908</p><h3>konten loker fiktif diturunkan</h3><p>Konten iklan lowongan kerja luar negeri fiktif yang diturunkan Tim Patroli Siber Kemkomdigi bersama BP2MI.</p><p className="portal-stat-period">Periode: Jan–Agu 2026</p><details><summary>Sumber & definisi loker</summary><p>Kemkomdigi, siaran pers 7 September 2026, “Lindungi Pencari Kerja, Kemkomdigi dan BP2MI Turunkan 7.908 Iklan Loker Luar Negeri Fiktif”. Angka konten yang diturunkan, bukan korban atau lowongan unik.</p><a href="https://www.komdigi.go.id/berita/siaran-pers/detail/lindungi-pencari-kerja-kemkomdigi-dan-bp2mi-turunkan-7908-iklan-loker-luar-negeri-fiktif">Baca siaran pers Kemkomdigi</a></details></article>
          <article><p className="portal-stat-number">36,3<span>%</span></p><h3>belum mengenali tanda phishing</h3><p>Responden survei IMDI yang menyatakan tidak mengetahui sama sekali tanda-tanda phishing.</p><p className="portal-stat-period">Periode laporan: IMDI 2025</p><details><summary>Sumber & definisi survei</summary><p>BPSDM Komdigi, Indeks Masyarakat Digital Indonesia 2025, Bab 4, Gambar 4.8 “Pemahaman Terhadap Ancaman Keamanan Digital”. Jawaban responden, bukan hasil tes deteksi phishing atau persentase korban.</p><a href="https://bpsdm.komdigi.go.id/downloads/19/20251003065319-Indeks-Masyarakat-Digital-Indonesia-IMDI-2025-E-book.pdf">Baca laporan IMDI 2025 (PDF, 38 MB)</a></details></article>
        </div><p className="portal-source-note">Cuplikan historis dengan periode berbeda; ketiga angka ini tidak dijumlahkan dan bukan data waktu nyata.</p>
      </div></section>
      <section id="latihan" className="portal-practice portal-wrap" aria-labelledby="practice-title">
        <div className="portal-section-intro"><motion.h2 {...heading} id="practice-title">Terlihat resmi.<br />Coba periksa.</motion.h2><motion.p {...rise}>Rasakan cara bermain lewat email fiktif ini. Temukan satu detail di balik pengirimnya, tanpa membocorkan kasus Ari.</motion.p></div>
        <EmailInspection />
      </section>
      <section id="berkas" className="portal-cases portal-wrap" aria-labelledby="cases-title">
        <div className="portal-section-intro"><motion.h2 {...heading} id="cases-title">Satu jejak.<br />Tiga bab.</motion.h2><motion.p {...rise}>Ikuti perjalanan rekrutmen Ari. Setiap pesan membawa pertanyaan baru tentang siapa yang layak dipercaya.</motion.p></div>
        <ol className="portal-case-list">
          <li><div><p>Bab 1 · Tersedia</p><h3>Undangan tanpa lamaran</h3></div><p>Sebuah tawaran tiba di kotak masuk. Periksa undangannya sebelum menentukan langkah Ari.</p><Link to="/play" aria-label="Buka Bab 1: Undangan tanpa lamaran">Buka berkas <span aria-hidden="true">↗</span></Link></li>
          <li><div><p>Bab 2 · Tersedia</p><h3>Perekrut yang ramah</h3></div><p>Percakapan menjadi semakin personal. Seberapa jauh sebuah perkenalan bisa dipercaya?</p><Link to="/play" aria-label="Lanjut perjalanan menuju Bab 2: Perekrut yang ramah">Lanjut perjalanan <span aria-hidden="true">↗</span></Link></li>
          <li><div><p>Bab 3 · Akan datang</p><h3>Verifikasi terakhir</h3></div><p>Perjalanan mendekati akhir. Sebuah portal membuka pertanyaan baru tentang batas kepercayaan.</p><span className="portal-case-status">Belum tersedia</span></li>
        </ol>
      </section>
      <section className="portal-safety" aria-labelledby="safety-title"><div className="portal-wrap portal-safety-inner"><div><PixelIcon kind="signal" /><p>Ruang latihan yang aman</p><motion.h2 {...heading} id="safety-title">Bukti dulu.<br />Percaya kemudian.</motion.h2></div><div><p>Semua tokoh, perusahaan, pesan, dan alamat dalam game adalah fiktif. TrustTrail tidak meminta kata sandi asli, OTP, atau dokumen identitas.</p><p>Tanpa akun. Progres permainan disimpan di browser ini. Kamu bisa mengelolanya dari menu di dalam game.</p><motion.div {...rise} whileTap={reduced ? undefined : { scale: .98 }} className="portal-start"><StartGameButton /></motion.div><Link className="portal-text-link" to="/guide">Cara bermain & privasi</Link></div></div></section>
    </main>
    <footer className="portal-footer portal-wrap"><Link className="portal-brand" to="/"><PixelIcon kind="signal" />TrustTrail</Link><p>Game investigasi digital · MIT-WEEK 2026</p><a href="#portal-title">Kembali ke awal</a></footer>
  </div>;
}

function EmailInspection() {
  const [inspected, setInspected] = useState(false);
  const reduced = useReducedMotion();
  return <div className="portal-demo">
    <article className="portal-mail" data-ui aria-label="Email latihan fiktif"><div className="portal-window-bar"><PixelIcon kind="mail" /><span>Mail / latihan terpisah</span><span aria-hidden="true">□</span></div><div className="portal-mail-content">
      <p className="portal-mail-subject">Undangan diskusi portofolio</p><p className="portal-sender"><strong>Tim Karier Lentera</strong><span>kepada: peserta latihan</span></p>
      <button type="button" className="portal-inspect" aria-expanded={inspected} aria-controls="practice-sender" onClick={() => setInspected(value => !value)}><PixelIcon kind="mail" />{inspected ? 'Tutup detail pengirim' : 'Periksa alamat pengirim'}</button>
      <motion.div id="practice-sender" className="portal-sender-detail" hidden={!inspected} initial={false} animate={{ opacity: inspected ? 1 : 0, y: inspected ? 0 : -4 }} transition={{ duration: reduced ? 0 : .14 }}><span>Alamat pengirim</span><code>undangan@lentera-acara.example</code><p>Nama tampilan belum membuktikan identitas. Cocokkan alamat lewat kanal resmi yang kamu cari secara terpisah.</p></motion.div>
      <p>Halo,</p><p>Kami mengundangmu ke diskusi portofolio Lentera. Detail acara tersedia di kanal resmi kami.</p><p>Salam,<br />Tim Karier Lentera</p><div className="portal-mail-foot">Simulasi fiktif. Semua alamat menggunakan .example.</div>
    </div></article>
    <motion.aside initial={false} animate={inspected && !reduced ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: reduced ? 0 : .18 }} className={`portal-notebook${inspected ? ' is-found' : ''}`} data-ui aria-label="Catatan latihan"><PixelIcon kind="journal" /><h3>Catatan pemeriksaan</h3>
      <div role="status" aria-live="polite" aria-atomic="true">{inspected ? <><p className="portal-feedback-title">Nama tampilan bukan identitas.</p><p>Pengirim memakai <code>lentera-acara.example</code>. Nama “Tim Karier Lentera” saja belum membuktikan siapa pengirimnya.</p><p>Langkah berikutnya: cari kanal resmi secara terpisah, lalu cocokkan alamatnya. Domain berbeda adalah alasan untuk memeriksa, bukan bukti pasti penipuan.</p></> : <><p>Apa yang ada di balik nama pengirim?</p><p>Buka detail alamat pada email. Satu pemeriksaan kecil bisa mengubah cara kamu membaca sebuah pesan.</p></>}</div>
      <span className="portal-demo-note">{inspected ? 'Satu petunjuk diperiksa.' : 'Belum ada detail diperiksa.'} Latihan ini tidak menyimpan progres atau skor.</span>
    </motion.aside>
  </div>;
}
