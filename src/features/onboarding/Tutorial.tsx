import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { stages, type Stage } from './tutorial';
import './tutorial.css';
const copy: Record<Stage, [string, string]> = {
  welcome: ['Selamat datang di TrustTrail OS.', 'Di sini, kamu akan memeriksa pesan, membandingkan informasi, dan mengumpulkan bukti sebelum mengambil keputusan.'],
  mail: ['Mulai dari Mail.', 'Periksa siapa pengirimnya, apa yang diminta, dan apakah pesannya layak dipercaya.'],
  browser: ['Jangan hanya percaya satu sumber.', 'Gunakan Browser untuk mencari informasi pembanding sebelum mengambil keputusan.'],
  journal: ['Bukti membantumu mengambil keputusan.', 'Buka Case Files untuk melihat temuan dan perkembangan investigasimu.'],
  ready: ['Peralatanmu sudah siap.', 'Sekarang, periksa setiap petunjuk sebelum mengambil keputusan.'],
};
export function Tutorial({ stage, mobileMenu, onStart, onDismiss }: { stage: Stage; mobileMenu: boolean; onStart: () => void; onDismiss: (complete: boolean) => void }) {
  const reduced = useReducedMotion();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (stage === 'welcome' || stage === 'ready') heading.current?.focus({ preventScroll: true }); }, [stage]);
  return <motion.aside className="tt-tutorial" aria-label="Tutorial investigasi" initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduced ? 0 : .16 }}>
    <div role="status" aria-live="polite" aria-atomic="true"><p className="tt-tutorial-progress">Investigasi pertamamu · {stages.indexOf(stage) + 1} dari 5</p><h2 ref={heading} tabIndex={-1}>{copy[stage][0]}</h2><p>{copy[stage][1]}</p>{!['welcome', 'ready'].includes(stage) ? <p className="tt-tutorial-cue">{mobileMenu ? 'Pilih aplikasinya di menu ini.' : 'Buka aplikasi melalui kontrol yang ditandai. Jika belum terlihat, buka Aplikasi.'}</p> : null}</div>
    <div className="tt-tutorial-actions">{stage === 'welcome' ? <button className="px-button" onClick={onStart}>Mulai Tutorial</button> : stage === 'ready' ? <button className="px-button" onClick={() => onDismiss(true)}>Mulai Investigasi</button> : null}<button className="px-text-button" onClick={() => onDismiss(false)}>Lewati tutorial</button></div>
  </motion.aside>;
}
