import { useState } from 'react';
import { motion } from 'motion/react';
import { investigationMotion, useInvestigationMotion, useInvestigationPanel, useInvestigationReveal } from './homepageMotion';
import { PixelIcon } from '../features/os/PixelIcon';

const files = [
  {
    id: '01', label: 'IASC', value: '74.243', unit: 'laporan diterima IASC', // taste-skill-ignore: Data File numbering explicitly required by Phase B.1
    period: '22 November 2024–23 Maret 2025', source: 'OJK / Satgas PASTI',
    scope: 'Laporan penipuan transaksi keuangan yang diterima Indonesia Anti-Scam Centre sejak awal beroperasi hingga 23 Maret 2025. Jumlah laporan, bukan korban unik atau seluruh penipuan di Indonesia.',
    relevance: 'Sebuah permintaan transaksi layak diperiksa sebelum ditindaklanjuti. Luangkan waktu untuk mengecek identitas dan kanal yang digunakan.',
    citation: 'Siaran pers 28 Maret 2025, “Waspada Penipuan Website Mengatasnamakan Indonesia Anti-Scam Centre (IASC)”.',
    href: 'https://ojk.go.id/id/berita-dan-kegiatan/info-terkini/Pages/Waspada-Penipuan-Website-Mengatasnamakan-Indonesia-Anti-Scam-Centre-IASC.aspx',
    link: 'Baca siaran pers OJK',
  },
  {
    id: '02', label: 'Loker fiktif', value: '7.908', unit: 'konten loker fiktif diturunkan', // taste-skill-ignore: Data File numbering explicitly required by Phase B.1
    period: 'Januari–Agustus 2026', source: 'Kemkomdigi bersama BP2MI',
    scope: 'Konten iklan lowongan kerja luar negeri fiktif yang diturunkan Tim Patroli Siber Kemkomdigi bersama BP2MI. Angka konten yang diturunkan, bukan korban atau lowongan unik.',
    relevance: 'Tawaran kerja juga perlu sumber pembanding. Cari kanal perusahaan secara terpisah sebelum mengikuti arahan perekrut.',
    citation: 'Kemkomdigi, siaran pers 7 September 2026, “Lindungi Pencari Kerja, Kemkomdigi dan BP2MI Turunkan 7.908 Iklan Loker Luar Negeri Fiktif”.',
    href: 'https://www.komdigi.go.id/berita/siaran-pers/detail/lindungi-pencari-kerja-kemkomdigi-dan-bp2mi-turunkan-7908-iklan-loker-luar-negeri-fiktif',
    link: 'Baca siaran pers Kemkomdigi',
  },
  {
    id: '03', label: 'Tanda phishing', value: '36,3%', unit: 'belum mengenali tanda phishing', // taste-skill-ignore: Data File numbering explicitly required by Phase B.1
    period: 'Survei IMDI 2025', source: 'BPSDM Komdigi',
    scope: 'Responden survei IMDI 2025 yang menyatakan tidak mengetahui sama sekali tanda-tanda phishing. Jawaban responden, bukan hasil tes deteksi phishing atau persentase korban.',
    relevance: 'Mengenali tanda perlu latihan. Mulai dengan memeriksa alamat pengirim, tujuan tautan, dan klaim melalui sumber terpisah.',
    citation: 'Indeks Masyarakat Digital Indonesia 2025, Bab 4, Gambar 4.8 “Pemahaman Terhadap Ancaman Keamanan Digital”.',
    href: 'https://bpsdm.komdigi.go.id/downloads/19/20251003065319-Indeks-Masyarakat-Digital-Indonesia-IMDI-2025-E-book.pdf',
    link: 'Baca laporan IMDI 2025 (PDF, 38 MB)',
  },
] as const;

export function ThreatIntelligence() {
  const [selected, setSelected] = useState(0);
  const { reduced, compact } = useInvestigationMotion();
  const panel = useInvestigationPanel();
  const heading = useInvestigationReveal('heading');
  const content = useInvestigationReveal('content', 1);
  const terminal = useInvestigationReveal('panel');
  const fileEntrance = useInvestigationReveal('content');
  const file = files[selected]!;
  return <section id="intel" className="portal-intel" aria-labelledby="intel-title"><div className="portal-wrap">
    <div className="portal-archive-title"><PixelIcon kind="files" /><motion.h2 {...heading} id="intel-title">TrustTrail /<br />Threat Intelligence</motion.h2><motion.span {...content}>Arsip sumber publik<br />Tiga berkas historis</motion.span></div>
    <div className="portal-section-intro portal-intel-intro"><motion.p {...heading} className="portal-intel-statement">Kasusnya fiksi.<br />Risikonya nyata.</motion.p><motion.p {...content}>Pesan yang meyakinkan bisa menjadi awal penipuan. Buka catatan dari sumber resmi Indonesia untuk memahami mengapa kebiasaan memeriksa itu penting.</motion.p></div>
    <motion.div {...terminal} className="portal-intelligence" data-ui>
      <div className="portal-intel-files" role="group" aria-label="Pilih berkas intelijen">
        {files.map((item, index) => <motion.button {...fileEntrance} initial={reduced ? false : { x: compact ? 0 : -8, y: compact ? 4 : 0 }} whileInView={{ x: 0, y: 0 }} transition={{ ...fileEntrance.transition, delay: reduced ? 0 : index * investigationMotion.stagger.item }} type="button" key={item.id} aria-pressed={selected === index} aria-controls="intel-detail" onClick={() => setSelected(index)}><PixelIcon kind="files" /><span><span>Data File {item.id}</span><strong>{item.label}</strong></span><span aria-hidden="true">{selected === index ? '↳' : '+'}</span></motion.button>)}
      </div>
      <article id="intel-detail" className="portal-intel-detail" aria-label={`Data File ${file.id}: ${file.label}`} aria-live="polite" aria-atomic="true">
        <motion.div key={file.id} {...panel}>
          <p className="portal-intel-file-id">Data File {file.id} / {file.source}</p>
          <motion.p {...panel} transition={{ ...panel.transition, duration: reduced ? 0 : investigationMotion.duration.reveal }} className="portal-stat-number">{file.value}</motion.p><h3>{file.unit}</h3>
          <dl className="portal-intel-metadata"><div><dt>Periode</dt><dd>{file.period}</dd></div><div><dt>Sumber</dt><dd>{file.source}</dd></div></dl>
          <p className="portal-intel-scope">{file.scope}</p>
          <p className="portal-intel-relevance"><strong>Kenapa ini penting?</strong>{file.relevance}</p>
          <details className="portal-intel-citation"><summary>Dokumen sumber & konteks</summary><p>{file.citation}</p></details>
          <a className="portal-source-link" href={file.href}>{file.link}<span aria-hidden="true"> ↗</span></a>
        </motion.div>
      </article>
    </motion.div>
    <p className="portal-source-note">Cuplikan historis dengan periode dan cakupan berbeda. Ketiga angka ini tidak dijumlahkan, tidak dibandingkan sebagai populasi setara, dan bukan data waktu nyata.</p>
    <div className="portal-narrative-bridge"><motion.p {...content}>Ribuan laporan. Ribuan tawaran mencurigakan. Tetapi sebuah penipuan sering dimulai dari satu keputusan kecil.</motion.p><a href="#latihan">Periksa sebuah pesan <span aria-hidden="true">→</span></a></div>
  </div></section>;
}
