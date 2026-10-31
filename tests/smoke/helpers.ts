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
  if (await page.locator('.trusttrail-os').getAttribute('data-os') === 'desktop') await page.getByRole('button', { name: `Tampilkan ${name}`, exact: true }).click();
  else {
    await page.getByRole('button', { name: 'Ganti aplikasi', exact: true }).click();
    await page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: new RegExp(`^${name}`) }).click();
  }
}
export async function openMail(page: Page) {
  await openGameApp(page, 'Mail');
  const invitation = page.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ });
  if (await invitation.isVisible()) await invitation.click();
}
