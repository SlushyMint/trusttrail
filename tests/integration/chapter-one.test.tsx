import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { App } from '../../src/app/App';
import { GameProvider } from '../../src/app/GameProvider';
import { SAVE_KEY } from '../../src/lib/persistence';

function mount() {
  return render(<MemoryRouter initialEntries={['/play']}><GameProvider><App /></GameProvider></MemoryRouter>);
}
async function investigate() {
  const user = userEvent.setup();
  mount();
  await user.click(screen.getByRole('button', { name: /Mulai investigasi/ }));
  await user.click(screen.getByRole('button', { name: /Buka berkas pertama/ }));
  for (let i = 0; i < 3; i++) await user.click(screen.getByRole('button', { name: /Lanjut cerita/ }));
  await user.click(screen.getByRole('button', { name: /Periksa undangan/ }));
  return user;
}
async function openApp(user: ReturnType<typeof userEvent.setup>, label: string) {
  await user.click(screen.getByRole('button', { name: 'Ganti aplikasi' }));
  await user.click(within(screen.getByRole('dialog', { name: 'Menu TrustTrail' })).getByRole('button', { name: new RegExp(`^${label}`) }));
}
function savedEvents(): { type: string; evidenceId?: string }[] {
  return JSON.parse(localStorage.getItem(SAVE_KEY)!).events;
}
beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });

describe('Chapter 1 rendered experience', () => {
  it('does not expose a previously expanded sender after restarting the canonical run', async () => {
    const user = await investigate();
    await user.click(screen.getByRole('button', { name: /Periksa pengirim/ }));
    expect(screen.getByText('recruitment@novatech-talenta.example')).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Ganti aplikasi' }));
    await user.click(within(screen.getByRole('dialog', { name: 'Menu TrustTrail' })).getByRole('button', { name: 'Kelola progres' }));
    await user.click(screen.getByRole('button', { name: 'Mulai ulang' }));
    await user.click(screen.getByRole('button', { name: 'Ya, mulai ulang' }));
    await user.click(screen.getByRole('button', { name: /Buka berkas pertama/ }));
    for (let i = 0; i < 3; i++) await user.click(screen.getByRole('button', { name: /Lanjut cerita/ }));
    await user.click(screen.getByRole('button', { name: /Periksa undangan/ }));
    expect(screen.queryByText('recruitment@novatech-talenta.example')).toBeNull();
    expect(savedEvents().some(event => event.type === 'evidence.inspected')).toBe(false);
    await user.click(screen.getByRole('button', { name: /Periksa pengirim/ }));
    expect(screen.getByText('recruitment@novatech-talenta.example')).toBeTruthy();
  });

  it('does not reveal hidden clues or score panel opening, and records explicit inspection once', async () => {
    const user = await investigate();
    expect(screen.queryByText('Alamat di balik nama pengirim')).toBeNull();
    const before = localStorage.getItem(SAVE_KEY);
    await openApp(user, 'Browser');
    expect(localStorage.getItem(SAVE_KEY)).toBe(before);
    expect(screen.queryByRole('button', { name: 'Bandingkan dengan undangan' })).toBeNull();
    await openApp(user, 'Mail');
    await user.click(screen.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ }));
    await user.click(screen.getByRole('button', { name: /Periksa pengirim/ }));
    await user.click(screen.getByRole('button', { name: /Periksa pengirim/ }));
    expect(savedEvents().filter(event => event.type === 'evidence.inspected')).toEqual([{ type: 'evidence.inspected', evidenceId: 'C1-E01' }]);
    await openApp(user, 'Case Files');
    const journal = screen.getByRole('region', { name: 'Case Files' });
    expect(within(journal).getByRole('heading', { name: 'Alamat di balik nama pengirim' })).toBeTruthy();
    expect(within(journal).queryByText('Batas waktu yang menekan')).toBeNull();
  });

  it('commits Verify once, requires its source task and marks resolution evidence after-choice', async () => {
    const user = await investigate();
    await user.click(screen.getByRole('button', { name: /Tentukan langkah/ }));
    await user.click(screen.getByRole('radio', { name: /Tahan dulu, verifikasi/ }));
    expect(savedEvents().some(event => event.type === 'choice.committed')).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Jalankan pilihan' }));
    expect(screen.getByRole('heading', { name: 'Periksa sebelum menyimpulkan.' })).toBeTruthy();
    expect(savedEvents().filter(event => event.type === 'reference.inspected' || event.type === 'source.compared')).toHaveLength(0);
    await user.click(screen.getByRole('button', { name: 'Periksa catatan lowongan' }));
    await user.click(screen.getByRole('button', { name: 'Bandingkan dengan undangan' }));
    expect(screen.getByRole('heading', { name: 'Klaim bertemu pembanding.' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Lihat refleksi/ }));
    expect(screen.getByText('0 / 4')).toBeTruthy();
    expect(screen.getAllByText('2 / 2')).toHaveLength(2);
    await openApp(user, 'Case Files');
    expect(within(screen.getByRole('region', { name: 'Case Files' })).getByText(/C1-E04 · Setelah pilihan/)).toBeTruthy();
    expect(savedEvents().filter(event => event.type === 'choice.committed')).toHaveLength(1);
  });

  it('keeps corrupt data until confirmed replacement and resets only TrustTrail progress', async () => {
    localStorage.setItem(SAVE_KEY, '{corrupt');
    localStorage.setItem('other-app', 'keep');
    const user = userEvent.setup();
    mount();
    expect(screen.getByText(/Simpanan tidak dapat dibaca/)).toBeTruthy();
    expect(localStorage.getItem(SAVE_KEY)).toBe('{corrupt');
    await user.click(screen.getByRole('button', { name: 'Mulai ulang' }));
    await user.click(screen.getByRole('button', { name: 'Batal' }));
    expect(localStorage.getItem(SAVE_KEY)).toBe('{corrupt');
    await user.click(screen.getByRole('button', { name: 'Hapus progres' }));
    await user.click(screen.getByRole('button', { name: 'Ya, hapus progres' }));
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
    expect(localStorage.getItem('other-app')).toBe('keep');
  });

  it('continues the story when writes fail without claiming it was saved', async () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('QuotaExceeded'); });
    const user = userEvent.setup();
    mount();
    await user.click(screen.getByRole('button', { name: /Mulai investigasi/ }));
    expect(screen.getByText(/Penyimpanan browser tidak tersedia/)).toBeTruthy();
    await user.click(screen.getByRole('button', { name: /Buka berkas pertama/ }));
    expect(within(screen.getByRole('region', { name: 'Cerita Ari' })).getByText(/Tiga bulan setelah lulus/)).toBeTruthy();
    expect(localStorage.getItem(SAVE_KEY)).toBeNull();
  });
});
