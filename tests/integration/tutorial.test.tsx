import { beforeEach, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { App } from '../../src/app/App';
import { GameProvider } from '../../src/app/GameProvider';
import { TUTORIAL_KEY } from '../../src/features/onboarding/tutorial';
import { SAVE_KEY } from '../../src/lib/persistence';
beforeEach(() => { localStorage.clear(); vi.spyOn(window, 'scrollTo').mockImplementation(() => {}); });
async function start() {
  const user = userEvent.setup();
  render(<MemoryRouter initialEntries={['/play']}><GameProvider><App /></GameProvider></MemoryRouter>);
  await user.click(screen.getByRole('button', { name: /Mulai investigasi/ }));
  await user.click(screen.getByRole('button', { name: /Buka berkas pertama/ }));
  for (let i = 0; i < 3; i++) await user.click(screen.getByRole('button', { name: /Lanjut cerita/ }));
  await user.click(screen.getByRole('button', { name: /Periksa undangan/ }));
  return user;
}
it('waits for genuine navigation and leaves canonical gameplay unchanged through completion', async () => {
  const user = await start(); const before = localStorage.getItem(SAVE_KEY);
  await user.click(screen.getByRole('button', { name: 'Mulai Tutorial' }));
  expect(screen.getByText('Mulai dari Mail.')).toBeTruthy();
  for (const name of ['Browser', 'Mail', 'Mail', 'Browser', 'Case Files']) {
    await user.click(screen.getByRole('button', { name: 'Ganti aplikasi' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: new RegExp(`^${name}`) }));
  }
  expect(screen.getByText('Peralatanmu sudah siap.')).toBeTruthy();
  await user.click(screen.getByRole('button', { name: 'Mulai Investigasi' }));
  expect(localStorage.getItem(TUTORIAL_KEY)).toBe('completed');
  expect(localStorage.getItem(SAVE_KEY)).toBe(before);
});
for (const stage of ['welcome', 'mail', 'browser', 'journal', 'ready']) it(`skips resumed ${stage} even without a mounted app target`, async () => {
  localStorage.setItem(TUTORIAL_KEY, stage);
  const user = await start();
  const before = localStorage.getItem(SAVE_KEY);
  await user.click(screen.getByRole('button', { name: 'Lewati tutorial' }));
  expect(screen.queryByRole('complementary', { name: 'Tutorial investigasi' })).toBeNull();
  expect(localStorage.getItem(TUTORIAL_KEY)).toBe('skipped');
  expect(localStorage.getItem(SAVE_KEY)).toBe(before);
});
