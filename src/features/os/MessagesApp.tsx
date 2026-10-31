import { useState, type ReactNode } from 'react';
import { conversationStep } from '../../engine/reducer';
import type { Chapter, GameState } from '../../engine/types';
import type { AppId, Send } from './model';
import { PixelIcon } from './PixelIcon';
import './messages.css';

export function MessagesApp({ chapter, game, send, openApp, flow }: { chapter: Chapter; game: GameState; send: Send; openApp: (id: AppId) => void; flow: ReactNode }) {
  const [profile, setProfile] = useState(false);
  const [detail, setDetail] = useState<string | null>(null);
  const conversation = chapter.conversation;
  if (!conversation) return <div className="px-empty-app"><PixelIcon kind="messages" /><h3>Belum ada percakapan.</h3><p>Jejak pertama ada di kotak masuk.</p><button className="px-button" onClick={() => openApp('mail')}>Buka Mail</button></div>;
  if (game.position.kind !== 'investigation') return flow;
  const step = conversationStep(game, chapter);
  const next = conversation.exchanges[step];
  const clue = chapter.evidence.find(item => item.id === detail);
  function inspect(evidenceId: string) {
    send({ type: 'evidence.inspected', evidenceId });
    setDetail(detail === evidenceId ? null : evidenceId);
  }
  function hotspot(evidenceId: string) {
    const evidence = chapter.evidence.find(item => item.id === evidenceId)!;
    return <div className="tt-chat-inspection"><button className="px-inline-inspect" aria-expanded={detail === evidenceId} aria-controls={`detail-${evidenceId}`} onClick={() => inspect(evidenceId)}><PixelIcon kind={game.discoveries[evidenceId] ? 'check' : 'signal'} />{evidence.actionLabel}</button>{detail === evidenceId && game.discoveries[evidenceId] ? <aside id={`detail-${evidenceId}`} className="px-inline-detail"><h4>{clue?.title}</h4><p>{clue?.detail}</p><p>{clue?.explanation}</p><p className="px-evidence-caution">{clue?.caution}</p></aside> : null}</div>;
  }
  return <section className="tt-messages" aria-label="Percakapan dengan Mira">
    <header className="tt-chat-header"><span className="tt-chat-avatar" aria-hidden="true">MP</span><div><h2 data-os-focus tabIndex={-1}>{conversation.profile.name}</h2><p>{conversation.profile.role}</p></div><button className="px-inspect-button" onClick={() => setProfile(!profile)} aria-expanded={profile} aria-controls="recruiter-profile">{profile ? 'Tutup profil' : 'Lihat profil'}</button></header>
    <p className="tt-chat-objective">{chapter.objective}</p><p className="px-live" role="status" aria-live="polite" aria-atomic="true">{step ? `Mira: ${conversation.exchanges[step - 1]!.response}` : `Pesan baru dari Mira: ${conversation.opening}`}</p>
    {profile ? <section className="tt-profile" id="recruiter-profile" aria-label="Profil Mira"><h3>Profil perekrut</h3><p translate="no">{conversation.profile.handle}</p><p>{conversation.profile.bio}</p><p>{conversation.profile.history}</p>{hotspot(conversation.profile.evidenceId)}<p className="px-app-footnote">Klaim profil ditulis pemilik akun. Semua identitas dan akun dalam cerita ini fiktif.</p></section> : null}
    <ol className="tt-chat-thread" aria-label="Riwayat percakapan">
      <li className="tt-chat-incoming"><span className="tt-chat-speaker">Mira · 18.42</span><p>{conversation.opening}</p></li>
      {conversation.exchanges.slice(0, step).map((exchange, index) => <li className="tt-chat-exchange" key={exchange.id}><div className="tt-chat-outgoing"><span className="tt-chat-speaker">Ari</span><p>{exchange.reply}</p></div><div className="tt-chat-incoming"><span className="tt-chat-speaker">Mira · 18.{43 + index}</span><p>{exchange.response}</p>{exchange.evidenceId ? hotspot(exchange.evidenceId) : <button className="px-text-button" onClick={() => setProfile(true)}>Lihat riwayat di profil</button>}</div></li>)}
    </ol>
    <footer className="tt-chat-composer"><p className="tt-chat-progress">{next ? `Percakapan ${step + 1} dari ${conversation.exchanges.length} · Pilih balasan Ari` : 'Percakapan tersimpan. Tentukan tanggapan Ari saat kamu siap.'}</p>{next ? <button className="px-button tt-chat-reply" onClick={() => send({ type: 'conversation.advanced', conversationId: conversation.id, stepIndex: step })}>{next.reply}<span aria-hidden="true"> ↗</span></button> : <button className="px-button px-primary" onClick={() => send({ type: 'decision.opened', decisionId: chapter.decision.id })}>Tentukan langkah <span aria-hidden="true">→</span></button>}<button className="px-text-button" onClick={() => openApp('browser')}><PixelIcon kind="browser" />Cari sumber terpisah</button><p className="px-app-footnote">Balasan adalah bagian cerita. Jangan masukkan data pribadi. Tidak ada pesan sungguhan dikirim.</p></footer>
  </section>;
}
