import { useEffect, useRef, useState } from 'react';
import { useGame, useGameActions } from '../../app/game-context';
import { recoveryDone, recoverySteps } from '../../engine/recovery';
import { Button } from '../../components/ui/Button';

export function RecoveryView() {
  const { game } = useGame();
  const { send } = useGameActions();
  const [feedback, setFeedback] = useState('');
  const steps = recoverySteps(game);
  const completed = steps.filter(step => recoveryDone(game, step.id));
  const next = steps.find(step => !recoveryDone(game, step.id));
  const taskHeading = useRef<HTMLHeadingElement>(null);
  const nextId = next?.id;
  useEffect(() => { taskHeading.current?.focus(); }, [nextId]);
  return <section className="tt-recovery" aria-label="Misi pemulihan"><h2 data-scene-focus tabIndex={-1}>Ambil kembali kendali</h2><p>Kesempatan palsu ini berakhir. Sekarang bantu Ari membatasi dampaknya.</p>
    <p className="tt-recovery-context">{game.flags.simulatedAccountRisk ? 'Kode email dibagikan dalam simulasi; pengamanan akun diperlukan.' : 'Tidak ada kode dibagikan. Membuka portal saja tidak membuktikan akun diambil alih.'} {game.flags.simulatedDataExposure ? 'Identitas dari Bab 2 masih terpapar dan perlu ditangani.' : 'Tidak ada dokumen identitas dibagikan dalam cerita.'}</p>
    <p>Ini latihan dengan kesempatan mencoba lagi. Pilihan yang belum tepat tidak disimpan; umpan baliknya hilang saat halaman dimuat ulang. Catatan dan Trust Report hanya memuat tindakan yang diselesaikan, bukan ketepatan percobaan pertama. Baca alasan sebelum mencoba lagi.</p>
    <p aria-label="Progres pemulihan">{completed.length} / {steps.length} tindakan pemulihan selesai</p>
    {next ? <section className="tt-recovery-task" key={next.id}><h3 ref={taskHeading} tabIndex={-1}>{next.title}</h3><p>{next.context}</p><div className="tt-recovery-choices">{next.actions.map(action => <Button variant="secondary" key={action.id} onClick={() => {
      setFeedback(action.feedback);
      if (action.id === next.correctActionId) send({ type: 'recovery.acted', stepId: next.id, actionId: action.id });
    }}>{action.label}</Button>)}</div></section> : <div className="tt-comparison-result"><h3>Rencana pemulihan tersusun</h3><p>Semua tindakan adalah latihan. Tidak ada akun nyata diubah atau laporan nyata dikirim.</p><Button onClick={() => send({ type: 'recovery.completed', chapterId: 'C3' })}>Selesaikan misi pemulihan →</Button></div>}
    <p className="tt-recovery-feedback" role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
    <h3>Catatan tindakan</h3>{completed.length ? <ol className="tt-recovery-receipts">{completed.map(step => <li key={step.id}><strong>{step.title}</strong><p>{step.receipt}</p><details><summary>Alasan tindakan</summary><p>{step.actions.find(action => action.id === step.correctActionId)?.feedback}</p></details></li>)}</ol> : <p>Pilih tindakan yang sesuai. Jika belum tepat, baca umpan balik dan coba lagi.</p>}
  </section>;
}
