# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: chapter-two.spec.ts >> reflows profile, chat and source at 320, 390, 768 and 1440 without losing conversation
- Location: tests/smoke/chapter-two.spec.ts:120:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Ganti aplikasi', exact: true })
    - locator resolved to <button id="os-menu-trigger" aria-haspopup="dialog" aria-label="Ganti aplikasi">…</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "Lewati ke konten" [ref=e4] [cursor=pointer]:
    - /url: "#os-main"
  - banner [ref=e5]:
    - link "TrustTrail, beranda" [ref=e6] [cursor=pointer]:
      - /url: /
      - strong [ref=e9]: TRUSTTRAIL
      - generic [ref=e10]: /
      - generic [ref=e11]: Lacak OS
    - generic [ref=e12]: Tersimpan di browser ini
    - navigation "Navigasi utama" [ref=e13]:
      - link "Panduan" [ref=e14] [cursor=pointer]:
        - /url: /guide
      - link "Catatan refleksi" [ref=e15] [cursor=pointer]:
        - /url: /report
    - generic [ref=e16]:
      - text: Sesi Ari
      - generic [ref=e18]: LOCAL / 01
  - main [ref=e19]:
    - navigation "Aplikasi desktop" [ref=e20]:
      - button "Buka Mail" [ref=e21] [cursor=pointer]:
        - generic [ref=e28]: Mail
      - button "Buka Browser" [ref=e29] [cursor=pointer]:
        - generic [ref=e35]: Browser
      - button "Buka Messages" [ref=e36] [cursor=pointer]:
        - generic [ref=e42]: Messages
      - button "Buka Files" [ref=e43] [cursor=pointer]:
        - generic [ref=e49]: Files
      - button "Buka Case Files" [ref=e50] [cursor=pointer]:
        - generic [ref=e57]: Case Files
    - generic [ref=e58]:
      - generic [ref=e59]:
        - paragraph [ref=e60]: TRUSTTRAIL / Bab 2 · Saat kepercayaan terasa personal
        - heading "Perekrut yang ramah" [level=1] [ref=e61]
        - paragraph [ref=e62]: Simulasi fiktif · Tanpa data pribadi
      - button "Kelola progres" [ref=e63] [cursor=pointer]
    - navigation "Tata letak jendela" [ref=e64]:
      - button "Messages & sumber berdampingan" [ref=e65] [cursor=pointer]
      - button "Rapikan jendela" [ref=e66] [cursor=pointer]
    - generic [ref=e67]:
      - region "Mail" [ref=e68]:
        - generic [ref=e69]:
          - heading "Mail" [level=2] [ref=e76]
          - group [ref=e77]:
            - generic "Atur posisi Mail" [ref=e78] [cursor=pointer]:
              - generic [aria-hidden] [ref=e79]: ↔
          - generic [ref=e80]:
            - button "Minimalkan Mail" [ref=e81] [cursor=pointer]:
              - generic [aria-hidden] [ref=e82]: _
            - button "Maksimalkan Mail" [ref=e83] [cursor=pointer]:
              - generic [aria-hidden] [ref=e84]: □
            - button "Tutup Mail" [ref=e85] [cursor=pointer]:
              - generic [aria-hidden] [ref=e86]: ×
        - generic [ref=e88]:
          - heading "Undangan tersimpan." [level=3] [ref=e95]
          - paragraph [ref=e96]: Keputusan dan bukti Bab 1 tetap ada di Case Files. Pesan lanjutan kini ada di Messages.
          - button "Buka Messages" [ref=e97] [cursor=pointer]
        - status [ref=e98]
      - region "Browser" [ref=e99]:
        - generic [ref=e100]:
          - heading "Browser" [active] [level=2] [ref=e106]
          - group [ref=e107]:
            - generic "Atur posisi Browser" [ref=e108] [cursor=pointer]:
              - generic [aria-hidden] [ref=e109]: ↔
          - generic [ref=e110]:
            - button "Minimalkan Browser" [ref=e111] [cursor=pointer]:
              - generic [aria-hidden] [ref=e112]: _
            - button "Maksimalkan Browser" [ref=e113] [cursor=pointer]:
              - generic [aria-hidden] [ref=e114]: □
            - button "Tutup Browser" [ref=e115] [cursor=pointer]:
              - generic [aria-hidden] [ref=e116]: ×
        - generic [ref=e118]:
          - generic [ref=e119]:
            - generic [aria-hidden] [ref=e120]: ◇
            - generic [ref=e121]: novatech.example/karier/tim
            - generic [ref=e122]: SIMULASI
          - generic [ref=e123]:
            - paragraph [ref=e124]: DIREKTORI PERUSAHAAN / SUMBER TERPISAH
            - heading "Direktori perekrut NovaTech" [level=3] [ref=e125]
            - paragraph [ref=e126]: Dibuka dari direktori perusahaan tersimpan di Browser TrustTrail, terpisah dari profil dan akun yang diberikan Mira. Ini catatan fiktif dalam simulasi.
            - generic [ref=e127]:
              - generic [ref=e128]: Desktop
              - generic [aria-hidden] [ref=e129]: →
              - generic [ref=e130]: Browser
              - generic [aria-hidden] [ref=e131]: →
              - strong [ref=e132]: Direktori perusahaan
            - button "Periksa direktori perekrut" [ref=e133] [cursor=pointer]
            - paragraph [ref=e134]: Buka detail catatan sebelum membandingkan. Membuka Browser saja belum dihitung sebagai verifikasi.
          - generic [ref=e135]:
            - generic [ref=e136]: Direktori dibuka secara terpisah
            - generic [ref=e137]: Tidak terhubung ke internet
        - status [ref=e138]
      - region "Messages" [ref=e139]:
        - generic [ref=e140]:
          - heading "Messages" [level=2] [ref=e146]
          - group [ref=e147]:
            - generic "Atur posisi Messages" [ref=e148] [cursor=pointer]:
              - generic [aria-hidden] [ref=e149]: ↔
          - generic [ref=e150]:
            - button "Minimalkan Messages" [ref=e151] [cursor=pointer]:
              - generic [aria-hidden] [ref=e152]: _
            - button "Maksimalkan Messages" [ref=e153] [cursor=pointer]:
              - generic [aria-hidden] [ref=e154]: □
            - button "Tutup Messages" [ref=e155] [cursor=pointer]:
              - generic [aria-hidden] [ref=e156]: ×
        - region "Percakapan dengan Mira" [ref=e158]:
          - generic [ref=e159]:
            - generic [aria-hidden] [ref=e160]: MP
            - generic [ref=e161]:
              - heading "Mira Pranesti" [level=2] [ref=e162]
              - paragraph [ref=e163]: Talent Partner · NovaTech
            - button "Tutup profil" [expanded] [ref=e164] [cursor=pointer]
          - paragraph [ref=e165]: Kenali orang di balik pesan. Periksa klaimnya sebelum menentukan informasi yang boleh dibagikan Ari.
          - status [ref=e166]: "Mira: Cukup foto kartu identitas dan alamat rumah lengkap untuk berkas kandidat. Belum ada wawancara, tetapi ini supaya administrasi lebih cepat. Penugasanku belum muncul di direktori karena internal; konfirmasi ke aku saja. Setelah itu kukirim portal kandidat."
          - region "Profil Mira" [ref=e167]:
            - heading "Profil perekrut" [level=3] [ref=e168]
            - paragraph [ref=e169]: "@mira.novatalent"
            - paragraph [ref=e170]: Membantu talenta muda menemukan tim produk yang tepat. Partner rekrutmen NovaTech sejak 2023.
            - paragraph [ref=e171]: "Profil dibuat 6 minggu lalu. Riwayat sebelumnya: Community Associate · Lentara Studio. Belum ada keterangan perpindahan atau penugasan sebagai partner NovaTech."
            - button "Periksa riwayat profil" [ref=e173] [cursor=pointer]
            - paragraph [ref=e176]: Klaim profil ditulis pemilik akun. Semua identitas dan akun dalam cerita ini fiktif.
          - list "Riwayat percakapan" [ref=e177]:
            - listitem [ref=e178]:
              - text: Mira · 18.42
              - paragraph [ref=e179]: Halo Ari, aku Mira, partner talent NovaTech. Aku melihat portofolio desain produkmu di pameran alumni. Studi kasus layanan perpustakaanmu menarik! Kalau email tadi terasa mendadak, aku bisa bantu jelaskan. Mencari posisi pertama memang melelahkan.
            - listitem [ref=e180]:
              - generic [ref=e181]:
                - text: Ari
                - paragraph [ref=e182]: Boleh jelaskan peran dan prosesnya?
              - generic [ref=e183]:
                - generic [ref=e184]: Mira · 18.43
                - paragraph [ref=e185]: Tentu. Tim produk sedang mencari intern untuk riset pengguna. Kita bisa bahas studi kasusmu dulu, tidak perlu pengalaman kerja. Aku menangani kandidat lewat partner eksternal, jadi profilku mungkin masih menyebut Lentara Studio.
                - button "Lihat riwayat di profil" [ref=e186] [cursor=pointer]
            - listitem [ref=e187]:
              - generic [ref=e188]:
                - text: Ari
                - paragraph [ref=e189]: Bisakah prosesnya lewat kanal perusahaan?
              - generic [ref=e190]:
                - generic [ref=e191]: Mira · 18.44
                - paragraph [ref=e192]: Bisa nanti. Untuk penjadwalan awal, pindah dulu ke akun pribadiku @mira.fasttrack di SapaRuang. Antrean tim pusat sedang penuh; kalau malam ini kita bereskan, aku bisa bantu sisihkan slot. Jangan tunggu balasan kontak pusat dulu, ya.
                - button "Periksa perpindahan kanal" [ref=e194] [cursor=pointer]
            - listitem [ref=e197]:
              - generic [ref=e198]:
                - text: Ari
                - paragraph [ref=e199]: Apa yang dibutuhkan untuk penjadwalan?
              - generic [ref=e200]:
                - generic [ref=e201]: Mira · 18.45
                - paragraph [ref=e202]: Cukup foto kartu identitas dan alamat rumah lengkap untuk berkas kandidat. Belum ada wawancara, tetapi ini supaya administrasi lebih cepat. Penugasanku belum muncul di direktori karena internal; konfirmasi ke aku saja. Setelah itu kukirim portal kandidat.
                - button "Periksa permintaan data" [ref=e204] [cursor=pointer]
          - generic [ref=e207]:
            - paragraph [ref=e208]: Percakapan tersimpan. Tentukan tanggapan Ari saat kamu siap.
            - button "Tentukan langkah" [ref=e209] [cursor=pointer]:
              - text: Tentukan langkah
              - generic [aria-hidden] [ref=e210]: →
            - button "Cari sumber terpisah" [ref=e211] [cursor=pointer]
            - paragraph [ref=e217]: Balasan adalah bagian cerita. Jangan masukkan data pribadi. Tidak ada pesan sungguhan dikirim.
        - status [ref=e218]
      - region "Case Files" [ref=e219]:
        - generic [ref=e220]:
          - heading "Case Files" [level=2] [ref=e227]
          - group [ref=e228]:
            - generic "Atur posisi Case Files" [ref=e229] [cursor=pointer]:
              - generic [aria-hidden] [ref=e230]: ↔
          - generic [ref=e231]:
            - button "Minimalkan Case Files" [ref=e232] [cursor=pointer]:
              - generic [aria-hidden] [ref=e233]: _
            - button "Maksimalkan Case Files" [ref=e234] [cursor=pointer]:
              - generic [aria-hidden] [ref=e235]: □
            - button "Tutup Case Files" [ref=e236] [cursor=pointer]:
              - generic [aria-hidden] [ref=e237]: ×
        - generic [ref=e239]:
          - generic [ref=e240]:
            - generic [ref=e241]:
              - paragraph [ref=e242]: CATATAN INVESTIGASI
              - heading "Jejak yang kamu temukan." [level=3] [ref=e243]
              - generic [ref=e244]:
                - generic [ref=e245]: "00"
                - paragraph [ref=e246]: bukti diperiksaCatat, lalu pertimbangkan.
              - paragraph [ref=e252]: Kamu bebas memilih tanpa mengumpulkan semua bukti.
            - generic [ref=e254]:
              - paragraph [ref=e261]: Belum ada bukti dicatat.
              - generic [ref=e262]: Mulai dengan memeriksa profil dan percakapan di Messages.
            - generic [ref=e267]:
              - strong [ref=e268]: Penugasan belum terverifikasi
              - paragraph [ref=e269]: Nama dan tampilan rapi belum membuktikan identitas pengirim.
              - button "Periksa sumber terpisah" [ref=e270] [cursor=pointer]:
                - text: Periksa sumber terpisah
                - generic [aria-hidden] [ref=e271]: ↗
            - generic [ref=e272]: Bukti dulu. Percaya kemudian.
          - region "Arsip Bab 1" [ref=e276]:
            - heading "Bab 1 · Undangan tanpa lamaran" [level=3] [ref=e277]
            - paragraph [ref=e278]: "Pilihan tercatat: Abaikan undangan ini"
            - paragraph [ref=e279]: "Bukti sebelum pilihan: 1 / 4 · Verifikasi: 0 / 2 · Perlindungan: 2 / 2"
            - group [ref=e280]:
              - generic "C1-E01 · Alamat di balik nama pengirim" [ref=e281] [cursor=pointer]
        - status [ref=e282]
    - complementary "Notifikasi desktop":
      - status [ref=e283]
    - generic [ref=e287]: LACAK PERSONAL DESKTOP
  - contentinfo [ref=e288]:
    - button "LACAK" [ref=e289] [cursor=pointer]
    - navigation "Taskbar aplikasi" [ref=e293]:
      - button "Tampilkan Mail" [ref=e294] [cursor=pointer]:
        - generic [ref=e301]: Mail
      - button "Tampilkan Browser" [pressed] [ref=e303] [cursor=pointer]:
        - generic [ref=e309]: Browser
      - button "Tampilkan Messages" [ref=e311] [cursor=pointer]:
        - generic [ref=e317]: Messages
      - button "Tampilkan Files" [ref=e319] [cursor=pointer]:
        - generic [ref=e325]: Files
      - button "Tampilkan Case Files" [ref=e327] [cursor=pointer]:
        - generic [ref=e334]: Case Files
    - generic [ref=e336]:
      - generic [aria-hidden] [ref=e337]: ▂▄▆
      - generic [ref=e338]: Simulasi lokal
      - generic [ref=e340]: SORE HARI
```

# Test source

```ts
  1  | import { expect, type Page } from '@playwright/test';
  2  | 
  3  | export const saveKey = 'trusttrail:save:v1';
  4  | export async function enterChapterOne(page: Page) {
  5  |   await page.goto('/play');
  6  |   await page.getByRole('button', { name: /Mulai investigasi/ }).click();
  7  |   await page.getByRole('button', { name: /Buka berkas pertama/ }).click();
  8  |   for (let i = 0; i < 3; i++) await page.getByRole('button', { name: /Lanjut cerita/ }).click();
  9  |   await page.getByRole('button', { name: /Periksa undangan/ }).click();
  10 |   await expect(page.getByRole('button', { name: /Periksa pengirim/ })).toBeVisible();
  11 | }
  12 | export async function readRun(page: Page): Promise<{ events: { type: string; optionId?: string; evidenceId?: string }[] }> {
  13 |   return page.evaluate(key => JSON.parse(localStorage.getItem(key)!), saveKey);
  14 | }
  15 | export async function commitChoice(page: Page, option: RegExp) {
  16 |   await page.getByRole('button', { name: /Tentukan langkah/ }).click();
  17 |   await page.getByRole('radio', { name: option }).check();
  18 |   await page.getByRole('button', { name: 'Jalankan pilihan' }).click();
  19 | }
  20 | 
  21 | export async function openGameApp(page: Page, name: 'Mail' | 'Browser' | 'Case Files' | 'Files' | 'Messages') {
  22 |   if (await page.locator('.trusttrail-os').getAttribute('data-os') === 'desktop') await page.getByRole('button', { name: `Tampilkan ${name}`, exact: true }).click();
  23 |   else {
> 24 |     await page.getByRole('button', { name: 'Ganti aplikasi', exact: true }).click();
     |                                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  25 |     await page.getByRole('dialog', { name: 'Menu TrustTrail' }).getByRole('button', { name: new RegExp(`^${name}`) }).click();
  26 |   }
  27 | }
  28 | export async function openMail(page: Page) {
  29 |   await openGameApp(page, 'Mail');
  30 |   const invitation = page.getByRole('button', { name: /NovaTech.*Undangan tahap akhir/ });
  31 |   if (await invitation.isVisible()) await invitation.click();
  32 | }
  33 | 
```