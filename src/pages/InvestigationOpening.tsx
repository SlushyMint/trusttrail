import { useRef, useState, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { investigationMotion, useInvestigationMotion, useInvestigationPanel, useInvestigationReveal } from './homepageMotion';
import { chapterOne } from '../content/chapters/c1';
import { LivingCityScene } from '../features/living-city/LivingCityScene';
import { PixelIcon } from '../features/os/PixelIcon';
import { StartGameButton } from '../features/gameplay/ProgressControls';

const tools = [
  { id: 'mail', name: 'Mail', purpose: 'Baca di antara baris.' },
  { id: 'browser', name: 'Browser', purpose: 'Cari sumber pembanding.' },
  { id: 'journal', name: 'Case Files', purpose: 'Simpan jejak yang kamu temukan.' },
] as const;
type Tool = typeof tools[number]['id'];

/** Presentation state only. No engine events, scoring, or storage writes. */
export function InvestigationOpening({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Tool>('mail');
  const [paused, setPaused] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const openingRef = useRef<HTMLDivElement>(null);
  const { reduced, compact } = useInvestigationMotion();
  const panel = useInvestigationPanel();
  const entrance = useInvestigationReveal('panel', 1);
  const incoming = useInvestigationReveal('content');
  const dock = useInvestigationReveal('panel');
  const { scrollYProgress } = useScroll({ target: openingRef, offset: ['start start', 'end start'] });
  // Function transforms keep this short-lived scene on Motion's subscribed path.
  // Motion 14.8's native ViewTimeline cache strongly retains per-mount targets.
  const camera = useTransform(() => Math.max(0, Math.min(1, scrollYProgress.get())) * (reduced || compact || paused ? 0 : investigationMotion.travel.showcase));
  const shade = useTransform(() => Math.max(0, Math.min(1, (scrollYProgress.get() - .25) / .75)) * (reduced || paused ? 0 : compact ? .12 : .32));
  const tool = tools.find(item => item.id === selected)!;
  function openFromDock(id: Tool) {
    setSelected(id);
    previewRef.current?.querySelector<HTMLButtonElement>(`button[data-tool="${id}"]`)?.focus({ preventScroll: true });
    previewRef.current?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' });
  }

  return <div ref={openingRef} className="portal-opening">
    <LivingCityScene paused={paused} scrollProgress={scrollYProgress} />
    <motion.div className="portal-city-shade" aria-hidden="true" style={{ opacity: shade }} />
    <section className="portal-hero portal-wrap" aria-labelledby="portal-title">
      {children}
      <motion.div className="portal-showcase" data-investigation-motion style={{ y: camera }}>
        <motion.div {...incoming} className="portal-incoming"><PixelIcon kind="mail" /><span><strong>Pesan masuk untuk Ari</strong><span>NovaTech Recruitment · cuplikan cerita fiktif</span></span><span aria-hidden="true">↙</span></motion.div>
        <motion.div {...entrance} ref={previewRef} className="portal-game-preview" data-ui role="region" aria-label="Pratinjau interaktif TrustTrail OS">
          <div className="portal-window-bar"><PixelIcon kind="signal" /><span>TrustTrail OS</span><span>CASE 01</span></div>
          <div className="portal-preview-tabs" role="group" aria-label="Aplikasi pratinjau">
            {tools.map(item => <button key={item.id} type="button" data-tool={item.id} aria-pressed={selected === item.id} aria-controls="os-preview-content" onClick={() => setSelected(item.id)}><PixelIcon kind={item.id} />{item.name}</button>)}
            <motion.span className="portal-selection" data-investigation-motion aria-hidden="true" initial={false} animate={{ x: `${tools.findIndex(item => item.id === selected) * 100}%` }} transition={reduced ? { duration: 0 } : investigationMotion.spring} />
          </div>
          <div id="os-preview-content" className="portal-preview-content" aria-live="polite" aria-atomic="true">
            <motion.div key={selected} {...panel}>
              <div className="portal-preview-app-name"><PixelIcon kind={selected} /><span>{tool.name}</span><span>Pratinjau</span></div>
              {selected === 'mail' ? <>
                <p className="portal-preview-meta">Kotak masuk Ari / NovaTech Recruitment</p>
                <h2 className="portal-preview-title">Undangan tahap akhir</h2>
                <p className="portal-preview-program">NovaTech Internship Program</p>
                <div className="portal-preview-message"><p>{chapterOne.email.paragraphs[0]}</p><p>{chapterOne.email.paragraphs[1]}</p></div>
                <p className="portal-preview-question">“Tapi… aku bahkan nggak ingat kapan daftar ke sini.” <span>— Ari</span></p>
              </> : selected === 'browser' ? <>
                <p className="portal-preview-address">{chapterOne.source.address}</p>
                <h2 className="portal-preview-title">Periksa sumbernya.</h2>
                <p>Sumber ini dibuka dari direktori perusahaan, bukan dari tautan dalam email.</p>
                <div className="portal-preview-document"><PixelIcon kind="browser" /><div><strong>Direktori perusahaan</strong><p>Domain perusahaan:<br />novatech.example</p></div></div>
                <p className="portal-preview-question">Apa yang perlu dicocokkan dengan undangan Ari?</p>
              </> : <>
                <p className="portal-preview-meta">Berkas Ari / Undangan tanpa lamaran</p>
                <h2 className="portal-preview-title">Jejak yang kamu temukan.</h2>
                <div className="portal-preview-empty"><PixelIcon kind="journal" /><div><strong>Belum ada bukti diperiksa.</strong><p>Di dalam game, hanya detail yang kamu periksa yang masuk ke Case Files.</p></div></div>
                <p className="portal-preview-question">Baca kembali catatanmu sebelum menentukan langkah.</p>
              </>}
            </motion.div>
          </div>
          <div className="portal-preview-footer"><span>Cuplikan fiktif · progres & skor terpisah</span><StartGameButton /></div>
        </motion.div>
      </motion.div>
    </section>
    <div className="portal-tools-area portal-wrap">
      <div className="portal-dock-caption"><span>Peralatan investigasimu</span><button type="button" className="portal-motion-toggle" aria-pressed={paused} onClick={() => setPaused(value => !value)} disabled={!!reduced}>{reduced ? 'Gerak dikurangi' : paused ? 'Lanjutkan gerak kota' : 'Jeda gerak kota'}<span aria-hidden="true">{paused || reduced ? ' ▷' : ' Ⅱ'}</span></button></div>
      <div className="portal-tools" role="group" aria-label="Pilih alat investigasi">
        {tools.map((item, index) => <motion.button {...dock} transition={{ ...dock.transition, delay: reduced ? 0 : index * investigationMotion.stagger.item }} key={item.id} type="button" aria-pressed={selected === item.id} aria-controls="os-preview-content" onClick={() => openFromDock(item.id)}><PixelIcon kind={item.id} /><span><strong>{item.name}</strong><span>{item.purpose}</span></span><span className="portal-tool-action">{selected === item.id ? 'Terbuka' : 'Buka'} <span aria-hidden="true">↗</span></span></motion.button>)}
      </div>
    </div>
  </div>;
}
