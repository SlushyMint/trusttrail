# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> fresh homepage starts the real game and attributes all three statistics
- Location: tests/smoke/homepage.spec.ts:25:1

# Error details

```
Test timeout of 30000ms exceeded.
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
        - paragraph [ref=e60]: TRUSTTRAIL / Bab 1 · Sebuah kesempatan yang datang tiba-tiba
        - heading "Undangan tanpa lamaran" [level=1] [ref=e61]
        - paragraph [ref=e62]: Simulasi fiktif · Tanpa data pribadi
      - button "Kelola progres" [ref=e63] [cursor=pointer]
    - navigation "Tata letak jendela" [ref=e64]:
      - button "Rapikan jendela" [ref=e65] [cursor=pointer]
    - generic [ref=e66]:
      - region "Mail" [ref=e67]:
        - generic [ref=e68]:
          - heading "Mail" [level=2] [ref=e75]
          - group [ref=e76]:
            - generic "Atur posisi Mail" [ref=e77] [cursor=pointer]:
              - generic [aria-hidden] [ref=e78]: ↔
          - generic [ref=e79]:
            - button "Minimalkan Mail" [ref=e80] [cursor=pointer]:
              - generic [aria-hidden] [ref=e81]: _
            - button "Maksimalkan Mail" [ref=e82] [cursor=pointer]:
              - generic [aria-hidden] [ref=e83]: □
            - button "Tutup Mail" [ref=e84] [cursor=pointer]:
              - generic [aria-hidden] [ref=e85]: ×
        - region [ref=e88]:
          - generic [ref=e95]:
            - paragraph [ref=e96]: Berkas pertama · Kenali Ari
            - heading "Sebuah kesempatan. Atau sebuah jebakan?" [active] [level=2] [ref=e97]: Sebuah kesempatan.Atau sebuah jebakan?
            - paragraph [ref=e98]: Ari baru lulus. Undangan magang ini terdengar seperti jawaban atas puluhan lamaran.
            - paragraph [ref=e99]: Periksa pesan, catat jejak, lalu pilih langkah Ari. Tidak ada kewajiban menemukan semua bukti.
            - generic [ref=e100]:
              - heading "Ini ruang simulasi" [level=3] [ref=e101]
              - paragraph [ref=e102]: Semua tokoh dan alamat fiktif. Jangan masukkan kata sandi, OTP, atau dokumen. Tidak ada tenggat sungguhan.
            - paragraph [ref=e103]: Gunakan Tab dan Enter, atau sentuh detail berlabel “Periksa”.
            - button "Buka berkas pertama" [ref=e104] [cursor=pointer]:
              - text: Buka berkas pertama
              - generic [aria-hidden] [ref=e105]: ↗
        - status [ref=e106]
      - region "Case Files" [ref=e107]:
        - generic [ref=e108]:
          - heading "Case Files" [level=2] [ref=e115]
          - group [ref=e116]:
            - generic "Atur posisi Case Files" [ref=e117] [cursor=pointer]:
              - generic [aria-hidden] [ref=e118]: ↔
          - generic [ref=e119]:
            - button "Minimalkan Case Files" [ref=e120] [cursor=pointer]:
              - generic [aria-hidden] [ref=e121]: _
            - button "Maksimalkan Case Files" [ref=e122] [cursor=pointer]:
              - generic [aria-hidden] [ref=e123]: □
            - button "Tutup Case Files" [ref=e124] [cursor=pointer]:
              - generic [aria-hidden] [ref=e125]: ×
        - generic [ref=e128]:
          - generic [ref=e129]:
            - paragraph [ref=e130]: CATATAN INVESTIGASI
            - heading "Jejak yang kamu temukan." [level=3] [ref=e131]
            - generic [ref=e132]:
              - generic [ref=e133]: "00"
              - paragraph [ref=e134]: bukti diperiksaCatat, lalu pertimbangkan.
            - paragraph [ref=e140]: Kamu bebas memilih tanpa mengumpulkan semua bukti.
          - generic [ref=e142]:
            - paragraph [ref=e149]: Belum ada bukti dicatat.
            - generic [ref=e150]: Mulai dengan memeriksa pengirim di Mail.
          - generic [ref=e155]:
            - strong [ref=e156]: Undangan belum terverifikasi
            - paragraph [ref=e157]: Nama dan tampilan rapi belum membuktikan identitas pengirim.
            - button "Periksa sumber terpisah" [ref=e158] [cursor=pointer]:
              - text: Periksa sumber terpisah
              - generic [aria-hidden] [ref=e159]: ↗
          - generic [ref=e160]: Bukti dulu. Percaya kemudian.
        - status [ref=e164]
    - complementary "Notifikasi desktop":
      - status [ref=e165]
    - generic [ref=e169]: LACAK PERSONAL DESKTOP
  - contentinfo [ref=e170]:
    - button "LACAK" [ref=e171] [cursor=pointer]
    - navigation "Taskbar aplikasi" [ref=e175]:
      - button "Tampilkan Mail" [pressed] [ref=e176] [cursor=pointer]:
        - generic [ref=e183]: Mail
      - button "Tampilkan Browser" [ref=e185] [cursor=pointer]:
        - generic [ref=e191]: Browser
      - button "Tampilkan Messages" [ref=e193] [cursor=pointer]:
        - generic [ref=e199]: Messages
      - button "Tampilkan Files" [ref=e201] [cursor=pointer]:
        - generic [ref=e207]: Files
      - button "Tampilkan Case Files" [ref=e209] [cursor=pointer]:
        - generic [ref=e216]: Case Files
    - generic [ref=e218]:
      - generic [aria-hidden] [ref=e219]: ▂▄▆
      - generic [ref=e220]: Simulasi lokal
      - generic [ref=e222]: SORE HARI
```