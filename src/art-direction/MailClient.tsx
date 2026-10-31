import { useId, useState } from 'react';
import { useGame, useGameActions } from '../app/game-context';
import type { Chapter, Evidence } from '../engine/types';

type Message = 'email' | 'campus';
type Detail = 'sender' | 'deadline' | 'link';
const iconPaths = {
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  inbox: 'M4 4h16l2 12v4H2v-4zM2 15h6l2 3h4l2-3h6',
  back: 'M20 12H4m7-7-7 7 7 7',
  left: 'm15 5-7 7 7 7',
  right: 'm9 5 7 7-7 7',
  down: 'm6 9 6 6 6-6',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m0 4v5l4 2',
  link: 'm9 15 6-6M8 17l-1 1a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m0 0 1-1a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
  check: 'm4 12 5 5L20 6',
} as const;
function Icon({ kind }: { kind: keyof typeof iconPaths }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d={iconPaths[kind]} /></svg>;
}

/** Familiar mail-reading grammar, with fictional local content and explicit investigation actions. */
export function MailClient({ chapter, message, onSelect }: { chapter: Chapter; message: Message; onSelect: (message: Message) => void }) {
  const { game } = useGame();
  const { send } = useGameActions();
  const [inbox, setInbox] = useState(false);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [campusContext, setCampusContext] = useState(false);
  const uid = useId();
  const email = message === 'email';
  const subject = email ? chapter.email.subject : chapter.decoy.subject;
  const sender = email ? chapter.email.sender : chapter.decoy.sender;
  const currentClue = detail === 'deadline' ? chapter.evidence[1]! : detail === 'link' ? chapter.evidence[2]! : undefined;
  const found = (clue: Evidence) => Boolean(game.discoveries[clue.id]);
  const senderOpen = detail === 'sender' && (!email || found(chapter.evidence[0]!));
  function inspect(next: Detail) {
    const clue = chapter.evidence[next === 'sender' ? 0 : next === 'deadline' ? 1 : 2]!;
    if (email) send({ type: 'evidence.inspected', evidenceId: clue.id });
    setDetail(detail === next ? null : next);
  }
  function choose(next: Message) { setInbox(false); setDetail(null); onSelect(next); }

  return <div className="mail-client">
    <div className="mail-appbar"><div className="mail-wordmark"><Icon kind="mail" /><span>Mail</span></div><p>Kotak surat Ari</p><span className="mail-account" aria-label="Profil Ari dalam cerita">A</span></div>
    <div className="mail-layout">
      <nav className="mail-rail" aria-label="Folder surat"><button type="button" className="mail-folder" aria-pressed={inbox} onClick={() => setInbox(true)}><Icon kind="inbox" /><span>Kotak masuk</span><strong>2</strong></button><p>Ari<br /><span>akun dalam cerita</span></p></nav>
      <div className="mail-content">
        <div className="mail-toolbar"><button type="button" className="mail-icon-button" onClick={() => setInbox(true)} aria-label="Kembali ke kotak masuk"><Icon kind="back" /></button><span>{inbox ? 'Kotak masuk' : 'Pesan diterima'}</span><span className="mail-position">{inbox ? '2 pesan' : `${email ? 1 : 2} dari 2`}</span>{!inbox ? <><button type="button" className="mail-icon-button" aria-label="Pesan sebelumnya" disabled={email} onClick={() => choose('email')}><Icon kind="left" /></button><button type="button" className="mail-icon-button" aria-label="Pesan berikutnya" disabled={!email} onClick={() => choose('campus')}><Icon kind="right" /></button></> : null}</div>
        {inbox ? <section className="mail-inbox" aria-labelledby={`${uid}-inbox`}><h2 id={`${uid}-inbox`}>Kotak masuk</h2><p>Dua pesan di kotak surat Ari.</p><button type="button" className="mail-inbox-row" onClick={() => choose('email')}><span className="mail-row-avatar" aria-hidden="true">N</span><span><strong>{chapter.email.sender}</strong><span>{chapter.email.subject}</span><small>{chapter.email.paragraphs[1]}</small></span><time dateTime="2026-10-29T16:42:00+08:00">16.42</time></button><button type="button" className="mail-inbox-row" onClick={() => choose('campus')}><span className="mail-row-avatar mail-row-avatar--campus" aria-hidden="true">K</span><span><strong>{chapter.decoy.sender}</strong><span>{chapter.decoy.subject}</span><small>{chapter.decoy.text}</small></span><time dateTime="2026-10-29T09:18:00+08:00">09.18</time></button></section> : <>
          <article className="mail-message" aria-labelledby={`${uid}-subject`}>
            <div className="mail-subject"><h2 id={`${uid}-subject`}>{subject}</h2><span>Kotak masuk</span></div>
            <div className="mail-sender"><span className={`mail-sender-avatar${email ? '' : ' mail-row-avatar--campus'}`} aria-hidden="true">{email ? 'N' : 'K'}</span><div className="mail-sender-name"><strong>{sender}</strong><button type="button" className="mail-recipients" aria-label={email ? 'Periksa pengirim: tampilkan detail pesan' : 'Tampilkan detail pesan kampus'} aria-expanded={senderOpen} aria-controls={`${uid}-metadata`} onClick={() => inspect('sender')}>kepada saya <Icon kind="down" /></button></div><time className="mail-received" dateTime={`2026-10-29T${email ? '16:42' : '09:18'}:00+08:00`}>{email ? '16.42' : '09.18'}<span>29 Okt</span></time></div>
            {senderOpen ? <dl className="mail-metadata" id={`${uid}-metadata`}><div><dt>dari:</dt><dd><strong>{sender}</strong><span translate="no">{email ? chapter.email.address : chapter.decoy.address}</span></dd></div><div><dt>kepada:</dt><dd>Ari <span translate="no">&lt;ari@surat.example&gt;</span></dd></div><div><dt>tanggal:</dt><dd>29 Oktober 2026, {email ? '16.42' : '09.18'}</dd></div><div><dt>subjek:</dt><dd>{subject}</dd></div></dl> : null}
            <div className="mail-letter">
              {email ? <>{chapter.email.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<p><button type="button" className="mail-candidate-link" aria-label={`Lihat tujuan tautan ${chapter.email.displayedLink}`} onClick={() => inspect('link')} aria-expanded={detail === 'link' && found(chapter.evidence[2]!)} aria-controls={`${uid}-finding`} translate="no">{chapter.email.displayedLink}</button></p><p className="mail-signature">Salam,<br />Tim Rekrutmen NovaTech</p></> : <p>{chapter.decoy.text}</p>}
            </div>
          </article>
          <aside className="mail-investigation" aria-label="Alat pemeriksaan Ari">
            <div className="mail-investigation__label"><span>Periksa bersama Ari</span><small>Detail diperiksa masuk ke jurnal.</small></div>
            {email ? <><div className="mail-investigation__actions"><button type="button" onClick={() => inspect('deadline')} aria-expanded={detail === 'deadline' && found(chapter.evidence[1]!)} aria-controls={`${uid}-finding`}><Icon kind={found(chapter.evidence[1]!) ? 'check' : 'clock'} /><span>Periksa batas waktu</span></button><button type="button" onClick={() => inspect('link')} aria-expanded={detail === 'link' && found(chapter.evidence[2]!)} aria-controls={`${uid}-finding`}><Icon kind={found(chapter.evidence[2]!) ? 'check' : 'link'} /><span>Periksa tujuan tautan</span></button></div>{currentClue && found(currentClue) ? <div className="mail-finding" id={`${uid}-finding`}><p className="mail-finding__owner">Catatan Ari</p><h3>{currentClue.title}</h3><p>{currentClue.detail}</p><p>{currentClue.caution}</p></div> : null}</> : <><button type="button" className="mail-context-button" aria-expanded={campusContext} aria-controls={`${uid}-campus-context`} onClick={() => setCampusContext(!campusContext)}>Periksa konteks pesan</button>{campusContext ? <div className="mail-finding" id={`${uid}-campus-context`}><p>{chapter.decoy.context}</p><p>Catatan konteks ini tidak menambah bukti atau poin.</p></div> : null}</>}
          </aside>
        </>}
      </div>
    </div>
  </div>;
}
