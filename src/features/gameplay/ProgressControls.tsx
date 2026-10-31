import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useGame, useGameActions } from '../../app/game-context';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';

export function ProgressControls({ onComplete }: { onComplete?: () => void } = {}) {
  const [action, setAction] = useState<'restart' | 'reset' | null>(null);
  const { startNew, reset } = useGameActions();
  const navigate = useNavigate();
  return <>
    <div className="progress-controls"><Button variant="quiet" onClick={() => setAction('restart')}>Mulai ulang</Button><Button variant="quiet" onClick={() => setAction('reset')}>Hapus progres</Button></div>
    <Drawer open={action !== null} onClose={() => setAction(null)} title={action === 'reset' ? 'Hapus progres TrustTrail?' : 'Mulai ulang perjalanan?'}>
      <p>Bukti, pilihan, dan posisi cerita yang tersimpan di browser ini akan diganti. Tindakan ini tidak dapat dibatalkan.</p>
      <div className="action-row"><Button onClick={() => { if (action === 'reset') reset(); else startNew(true); setAction(null); onComplete?.(); navigate(action === 'reset' ? '/' : '/play'); }}>{action === 'reset' ? 'Ya, hapus progres' : 'Ya, mulai ulang'}</Button><Button variant="secondary" onClick={() => setAction(null)}>Batal</Button></div>
    </Drawer>
  </>;
}

export function StartGameButton() {
  const { game, save } = useGame();
  const { startNew } = useGameActions();
  const navigate = useNavigate();
  if (game.history.length > 0) return <Link className="button button--primary" to="/play">Lanjutkan perjalanan <span aria-hidden="true">↗</span></Link>;
  if (save.hasStoredSave) return <ProgressControls />;
  return <Button onClick={() => { startNew(); navigate('/play'); }}>Mulai investigasi <span aria-hidden="true">↗</span></Button>;
}

export function SaveNotice() {
  const { save } = useGame();
  const { retrySave, reloadLatest, replaceOtherSave } = useGameActions();
  const [confirm, setConfirm] = useState(false);
  if (save.kind === 'saved' || save.kind === 'empty') return null;
  return <aside className="save-notice" role="status" aria-label="Status penyimpanan">
    <p>{save.message}</p>
    {save.kind === 'memory' ? <Button variant="secondary" onClick={retrySave}>Coba simpan lagi</Button> : null}
    {save.kind === 'conflict' ? <div className="action-row"><Button variant="secondary" onClick={reloadLatest}>Muat progres terbaru</Button><Button variant="quiet" onClick={() => setConfirm(true)}>Pakai progres tab ini</Button></div> : null}
    <Drawer open={confirm} onClose={() => setConfirm(false)} title="Ganti simpanan dari tab lain?">
      <p>Progres tersimpan akan diganti dengan perjalanan di tab ini. Tutup tab permainan lain agar tidak saling menimpa.</p>
      <Button onClick={() => { replaceOtherSave(); setConfirm(false); }}>Ya, ganti dengan progres tab ini</Button>
    </Drawer>
  </aside>;
}
