import { useGame } from '../../app/game-context';
import { scenario } from '../../content/scenario';

export function EvidenceJournal() {
  const { game } = useGame();
  const discovered = scenario.chapters.flatMap(chapter => chapter.evidence.filter(clue => game.discoveries[clue.id]).map(clue => ({ clue, choice: game.choices[chapter.decision.id] })));
  return <div className="evidence-journal">
    <div className="journal-file-label"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 7V4h7l2 3h9v13H3zM3 10h18" /></svg><span>Arsip temuan Ari</span></div>
    <p className="journal-count">{discovered.length} bukti ditemukan</p>
    {discovered.length === 0 ? <div className="journal-empty"><h3>Belum ada bukti</h3><p>Buka detail yang ingin kamu periksa. Hanya informasi yang benar-benar kamu telusuri akan masuk ke jurnal.</p><p className="muted">Tidak perlu menemukan semuanya untuk mengambil keputusan.</p></div> : <ol className="journal-entries">
      {discovered.map(({ clue, choice }) => <li key={clue.id}>
        <p className="evidence-id">{clue.id}{choice && !choice.evidenceAtCommit.includes(clue.id) ? ' · Setelah pilihan' : ''}</p>
        <h3>{clue.title}</h3><p>{clue.explanation}</p><p className="journal-caution">{clue.caution}</p>
      </li>)}
    </ol>}
  </div>;
}
