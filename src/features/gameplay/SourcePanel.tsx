import { useGame, useGameActions } from '../../app/game-context';
import { Button } from '../../components/ui/Button';
import type { Chapter } from '../../engine/types';

export function SourcePanel({ chapter, resolution = false }: { chapter: Chapter; resolution?: boolean }) {
  const { game } = useGame();
  const { send } = useGameActions();
  const source = chapter.source;
  const record = game.references[source.id];
  const compared = record?.comparedAt !== undefined;
  return <section className="source-panel" aria-labelledby="source-title">
    <div className="artifact-chrome"><span>Direktori perusahaan</span><span>Simulasi</span></div>
    <div className="source-panel__body">
      <p className="section-label">Sumber terpisah dari undangan</p><h2 id="source-title">Catatan karier NovaTech</h2>
      <p className="source-provenance">{source.provenance}</p>
      <p className="inert-address" translate="no">{source.address}</p>
      <p>{resolution ? 'Pilihanmu sudah tercatat. Lengkapi pemeriksaan detail dan perbandingan sebelum melihat akibatnya.' : 'Membuka direktori saja belum memeriksa klaim. Lihat detail catatan yang tersedia.'}</p>
      <Button variant="secondary" aria-expanded={Boolean(record)} aria-controls="source-detail" onClick={() => send({ type: 'reference.inspected', sourceId: source.id, inspectionId: source.inspectionId })}>{record ? 'Catatan lowongan sudah diperiksa' : source.actionLabel}</Button>
      {record ? <div id="source-detail" className="comparison-workbench">
        <div><h3>Klaim undangan</h3><p>{source.claim}</p></div>
        <div><h3>Catatan dari sumber terpisah</h3><p>{source.reference}</p></div>
        {!compared ? <><p className="comparison-question">Bandingkan domain dan tahapan pada kedua catatan. Apakah undangannya sudah didukung sumber ini?</p><Button onClick={() => send({ type: 'source.compared', sourceId: source.id })}>Catat perbandingan</Button></> : <div className="comparison-result"><h3>Perbandingan tercatat</h3><p>{source.comparison}</p></div>}
      </div> : null}
    </div>
  </section>;
}
