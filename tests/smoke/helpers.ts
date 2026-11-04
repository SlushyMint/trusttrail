import { expect, type Page } from '@playwright/test';

export const saveKey = 'trusttrail:save:v1';
export async function enterChapterOne(page: Page) {
  await page.goto('/play');
  await page.getByRole('button', { name: /Mulai investigasi/ }).click();
  await page.getByRole('button', { name: /Buka berkas pertama/ }).click();
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /Lanjut cerita/ }).click();
  await page.getByRole('button', { name: /Periksa undangan/ }).click();
  await expect(page.getByRole('button', { name: /Periksa pengirim/ })).toBeVisible();
}
export async function readRun(page: Page): Promise<{ events: { type: string; optionId?: string; evidenceId?: string }[] }> {
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)!), saveKey);
}
export async function commitChoice(page: Page, option: RegExp) {
  await page.getByRole('button', { name: /Tentukan langkah/ }).click();
  await page.getByRole('radio', { name: option }).check();
  await page.getByRole('button', { name: 'Jalankan pilihan' }).click();
}

export async function openGameApp(page: Page, name: 'Mail' | 'Browser' | 'Case Files' | 'Files' | 'Messages') {
  // matchMedia updates before React commits the responsive shell. Wait for both.
  const desktop = await page.evaluate(() => matchMedia('(min-width: 1120px) and (min-height: 700px)').matches);
  await expect(page.locator('.trusttrail-os')).toHaveAttribute('data-os', desktop ? 'desktop' : 'saku');
  if (desktop) await page.getByRole('button', { name: `Tampilkan ${name}`, exact: true }).click();
  else {
    await page.getByRole('button', { name: 'Ganti aplikasi', exact: true }).click();
    await page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: new RegExp(`^${name}`) }).click();
  }
}
export async function openMail(page: Page) {
  await openGameApp(page, 'Mail');
  const invitation = page.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ });
  // The mail app initially opens its inbox on Saku; visibility can change after navigation.
  const reader = page.getByRole('button', { name: /Periksa pengirim/ });
  await expect(invitation.or(reader).first()).toBeVisible();
  if (await invitation.isVisible()) await invitation.click();
  await expect(reader).toBeVisible();
}
