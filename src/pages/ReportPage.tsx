import { Link } from 'react-router';
import { Notice } from '../components/ui/Notice';
import { useGame } from '../app/game-context';

export function ReportPage() {
  const { game } = useGame();
  return <div className="page-frame reading-page"><h1 tabIndex={-1}>Catatan refleksi</h1><p className="lead">Lihat kembali langkah yang kamu ambil.</p><Notice title="Perjalanan belum lengkap"><p>{game.position.kind === 'chapterComplete' ? `Bab ${'chapterId' in game.position ? game.position.chapterId.slice(1) : '1'} sudah selesai. Refleksinya tersimpan di ruang misi.` : 'Selesaikan perjalanan Ari untuk membuka laporan akhir.'} Empat dimensi laporan memerlukan tiga bab dan latihan pemulihan. Bab 1–2 dapat dimainkan. Bab 3, pemulihan, dan Trust Report lengkap masih dalam pengembangan; nilai keseluruhan belum ditampilkan.</p></Notice><div className="paper-note"><h2>Ruang untuk belajar</h2><p>Laporan akan membahas tindakan dalam simulasi. Hasil permainan tidak membuktikan bahwa suatu tawaran kerja di dunia nyata aman.</p><Link to="/play" className="button button--secondary">Kembali ke ruang misi <span aria-hidden="true">↗</span></Link></div></div>;
}
