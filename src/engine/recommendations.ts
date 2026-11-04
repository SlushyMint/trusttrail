import { scenario } from '../content/scenario';
import { chapterFacts } from './reducer';
import type { GameState } from './types';

/** Reflection only: reads durable facts without changing scores, events or saves. */
export function reportRecommendations(game: GameState) {
  const candidates = scenario.chapters.flatMap(chapter => {
    const choice = game.choices[chapter.decision.id];
    if (!choice) return [];
    const facts = chapterFacts(game, chapter);
    const missed = chapter.evidence.filter(clue => !choice.evidenceAtCommit.includes(clue.id));
    const unsafe = facts.safety < 2;
    if (!unsafe && !missed.length && facts.verification === 2) return [];
    const action = unsafe ? facts.option!.feedback.next
      : missed.length ? `${missed[0]!.actionLabel} sebelum menentukan pilihan berikutnya.`
      : `Buka Browser dan ${facts.verification === 0 ? chapter.source.actionLabel.toLowerCase() + ', lalu bandingkan' : 'bandingkan catatan yang sudah diperiksa'} dengan klaim pesan.`;
    const why = unsafe ? facts.option!.feedback.why
      : missed.length ? missed[0]!.explanation
      : 'Membuka atau membaca sumber saja belum menguji kecocokan klaim. Sumber yang ditemukan sendiri mengurangi ketergantungan pada pengirim.';
    return [{ id: chapter.id, title: `Bab ${chapter.id.slice(1)} · ${chapter.title}`, action, why,
      context: [
        missed.length ? `Belum diperiksa sebelum pilihan: ${missed.map(clue => clue.title).join('; ')}. Bukti yang dibuka belakangan tidak mengubah catatan saat memilih.` : '',
        facts.verification < 2 ? `Verifikasi ${facts.verification}/2: ${facts.verification === 0 ? 'periksa sumber terpisah, lalu bandingkan klaimnya' : 'lanjutkan dengan membandingkan klaim terhadap sumber yang telah diperiksa'}. ${chapter.source.comparison}` : '',
      ].filter(Boolean).join(' '),
      priority: unsafe ? chapter.id === 'C3' ? 0 : chapter.id === 'C2' ? 1 : 2 : facts.verification < 2 ? 3 : 4 }];
  }).sort((a, b) => a.priority - b.priority);
  // A fully investigated safe run still receives concrete maintenance practice.
  const reinforcement = [
    { id: 'maintain-data', title: 'Pertahankan batas data', action: 'Pada tawaran berikutnya, periksa tujuan, tahap, penerima, dan kanal sebelum membagikan identitas.', why: 'Dalam perjalanan ini kamu membatasi data. Kebiasaan itu tetap diperlukan meskipun perekrut mengenal portofoliomu.', context: '' },
    { id: 'maintain-code', title: 'Pertahankan batas kode akun', action: 'Gunakan pemulihan akun hanya melalui layanan resmi; jangan teruskan kode akun kepada perekrut.', why: 'Kamu tidak membagikan kode dalam perjalanan ini. Kode pemulihan memberi akses akun, bukan membuktikan kelayakan kandidat.', context: '' },
  ];
  if (!Object.keys(game.choices).length) return [];
  return [...candidates, ...reinforcement.filter(item => item.id === 'maintain-data' ? !game.flags.simulatedDataExposure && !candidates.some(candidate => candidate.id === 'C2') : !game.flags.simulatedAccountRisk && !candidates.some(candidate => candidate.id === 'C3'))].slice(0, Math.max(2, Math.min(3, candidates.length)));
}
