import { useState } from 'react';
import { useGame, useGameActions } from '../../app/game-context';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import type { Chapter, Evidence } from '../../engine/types';
import { EvidenceJournal } from './EvidenceJournal';
import { SourcePanel } from './SourcePanel';
import { StoryArtwork } from '../../components/StoryArtwork';

function InspectDetail({ clue }: { clue: Evidence }) {
  const { game } = useGame();
  const { send } = useGameActions();
  const [open, setOpen] = useState(false);
  const found = Boolean(game.discoveries[clue.id]);
  const expanded = open && found;
  return <div className={`inspect-detail${found ? ' inspect-detail--found' : ''}`}>
    <button className="inspect-action" type="button" aria-expanded={expanded} aria-controls={`${clue.id}-detail`} onClick={() => { send({ type: 'evidence.inspected', evidenceId: clue.id }); setOpen(!expanded); }}>
      <span>{clue.actionLabel}</span><span className="inspect-action__status">{found ? 'Tercatat' : 'Periksa'} <span aria-hidden="true">{expanded ? '−' : '+'}</span></span>
    </button>
    {expanded ? <div id={`${clue.id}-detail`} className="inspected-detail"><p>{clue.detail}</p><p className="muted">{clue.caution}</p></div> : null}
  </div>;
}

function EmailArtifact({ chapter }: { chapter: Chapter }) {
  return <article className="email-artifact" aria-labelledby="email-subject">
    <div className="artifact-chrome"><span>Kotak masuk Ari</span><span>Pesan simulasi</span></div>
    <div className="email-artifact__body">
      <div className="email-correspondent"><span className="email-monogram" aria-hidden="true">N</span><p className="email-byline">Dari <strong>{chapter.email.sender}</strong><span>kepada Ari</span></p></div>
      <InspectDetail clue={chapter.evidence[0]!} />
      <h2 id="email-subject">{chapter.email.subject}</h2>
      {chapter.email.paragraphs.map((paragraph, index) => <div key={paragraph}><p>{paragraph}</p>{index === 2 ? <InspectDetail clue={chapter.evidence[1]!} /> : null}</div>)}
      <div className="email-link-preview"><p className="section-label">Halaman kandidat yang ditampilkan</p><p className="inert-address" translate="no">{chapter.email.displayedLink}</p><InspectDetail clue={chapter.evidence[2]!} /></div>
      <p className="email-signoff">Salam,<br />Tim Rekrutmen NovaTech</p>
    </div>
  </article>;
}

function CampusMessage({ chapter }: { chapter: Chapter }) {
  const [inspected, setInspected] = useState(false);
  return <article className="email-artifact" aria-labelledby="campus-subject">
    <div className="artifact-chrome"><span>Arsip pesan Ari</span><span>Pesan simulasi</span></div>
    <div className="email-artifact__body"><p className="email-byline">{chapter.decoy.sender}</p><p className="inert-address" translate="no">{chapter.decoy.address}</p><h2 id="campus-subject">{chapter.decoy.subject}</h2><p>{chapter.decoy.text}</p>
      <Button variant="secondary" aria-expanded={inspected} aria-controls="campus-context" onClick={() => setInspected(!inspected)}>Periksa konteks pesan</Button>
      {inspected ? <div id="campus-context" className="inspected-detail"><p>{chapter.decoy.context}</p><p className="muted">Catatan konteks ini tidak menambah bukti atau poin.</p></div> : null}
    </div>
  </article>;
}

export function Investigation({ chapter }: { chapter: Chapter }) {
  const { game } = useGame();
  const { send } = useGameActions();
  const [artifact, setArtifact] = useState<'email' | 'source' | 'campus'>('email');
  const count = chapter.evidence.filter(clue => game.discoveries[clue.id]).length;
  const artifacts = <div className="investigation-frame">
    <aside className="case-navigation" aria-label="Berkas investigasi">
      <p className="section-label">Berkas Ari</p>
      <button type="button" aria-pressed={artifact === 'email'} onClick={() => setArtifact('email')}><span>Undangan baru</span><small>NovaTech Recruitment</small></button>
      <button type="button" aria-pressed={artifact === 'campus'} onClick={() => setArtifact('campus')}><span>Arsip kampus</span><small>Klinik CV · Pesan pembanding</small></button>
      <p className="directory-label">Pencarian mandiri</p>
      <button type="button" aria-pressed={artifact === 'source'} onClick={() => setArtifact('source')}><span>Direktori independen</span><small>Catatan karier perusahaan</small></button>
      <p className="case-navigation__note">Alamat di semua berkas bersifat fiktif. Pemeriksaan tetap di dalam permainan.</p>
      <StoryArtwork kind="vignette" alt="" className="case-navigation__art" />
    </aside>
    <div className="artifact-sheet" key={artifact}>{artifact === 'email' ? <EmailArtifact chapter={chapter} /> : artifact === 'source' ? <SourcePanel chapter={chapter} /> : <CampusMessage chapter={chapter} />}</div>
  </div>;
  return <>
    <div className="investigation-task"><div><p className="section-label">Tugas investigasi</p><h2 className="investigation-objective" data-scene-focus tabIndex={-1}>{chapter.objective}</h2></div><div className="investigation-actions"><p className="clue-count">{count} / {chapter.evidence.length}<span> bukti ditemukan</span></p><Button id="decision-action" onClick={() => send({ type: 'decision.opened', decisionId: chapter.decision.id })}>Pertimbangkan langkah</Button></div></div>
    <div className="investigation-layout">
      <div className="investigation-main"><Tabs label="Panel investigasi" tabs={[
        { id: 'artifact', label: 'Artefak', content: artifacts },
        { id: 'notes', label: 'Catatan', content: <EvidenceJournal /> },
      ]} /></div>
      <aside className="journal-rail" aria-label="Jurnal bukti di samping artefak"><h2>Jurnal bukti</h2><EvidenceJournal /></aside>
    </div>
    <div className="decision-prompt"><p>“Kesempatannya menarik. Tapi aku ingin tahu siapa yang sebenarnya mengirim pesan ini.”<span>— Ari</span></p><a href="#decision-action" className="text-link">Kembali ke pilihan <span aria-hidden="true">↑</span></a></div>
  </>;
}
