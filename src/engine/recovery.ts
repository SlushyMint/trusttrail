import type { GameState } from './types';

export type RecoveryStep = { id: string; title: string; context: string; actions: readonly { id: string; label: string; feedback: string }[]; correctActionId: string; receipt: string };

/** The recovery plan follows actual exposure, including choices from earlier chapters. */
export function recoverySteps(game: GameState): RecoveryStep[] {
  const steps: RecoveryStep[] = [
    { id: 'stop', title: 'Putuskan interaksi', context: 'Mira menawarkan bantuan jika Ari mengirim kode berikutnya. Apa respons yang membatasi risiko?', correctActionId: 'stop-contact',
      actions: [{ id: 'stop-contact', label: 'Hentikan balasan dan permintaan baru', feedback: 'Ari berhenti merespons. Simpan jejak sebelum memblokir atau melaporkan akun.' }, { id: 'ask-mira', label: 'Minta Mira memulihkan akun', feedback: 'Pihak yang meminta kode tidak dapat menjadi sumber pemulihan tepercaya. Hentikan kontak dan gunakan layanan resmi.' }], receipt: 'Interaksi dihentikan; tidak ada kode atau dokumen tambahan dibagikan.' },
    { id: 'preserve', title: 'Simpan jejak yang relevan', context: 'Pilih bukti yang membantu perusahaan dan platform menelusuri laporan tanpa menyebarkan data pribadi.', correctActionId: 'save-trail',
      actions: [{ id: 'delete-all', label: 'Hapus semua pesan agar aman', feedback: 'Menghapus semua pesan dapat menghilangkan konteks laporan. Simpan bukti secara privat terlebih dahulu.' }, { id: 'save-trail', label: 'Simpan alamat, profil, pesan, dan waktu secara privat', feedback: 'Simpan salinan pesan, URL, akun, serta waktu. Jangan unggah kode, identitas, atau data sensitif ke ruang publik.' }], receipt: 'Email, percakapan, URL, dan konteks waktu masuk ke berkas laporan privat.' },
    { id: 'contact', title: 'Pilih jalur konfirmasi', context: 'Mira menawarkan bantuan langsung. Direktori terpisah mencatat karier@novatech.example. Ke mana Ari mengonfirmasi penyalahgunaan nama?', correctActionId: 'official-contact',
      actions: [{ id: 'official-contact', label: 'Gunakan karier@novatech.example dari direktori', feedback: 'Alamat diambil dari sumber terpisah. Dalam cerita, perusahaan mengonfirmasi bahwa portal tidak berwenang.' }, { id: 'portal-help', label: 'Gunakan bantuan partner pada portal', feedback: 'Bantuan di portal yang sama tetap dikendalikan pihak tersebut. Ambil kontak dari sumber independen.' }], receipt: 'Penyalahgunaan nama dikonfirmasi melalui kontak perusahaan dari direktori terpisah.' },
  ];
  if (game.flags.simulatedAccountRisk) steps.push({ id: 'account', title: 'Amankan email Ari', context: 'Kode pemulihan sudah dibagikan dalam simulasi. Ada risiko sesi asing pada Lacak Mail.', correctActionId: 'secure-account',
    actions: [{ id: 'wait-code', label: 'Tunggu kode kedaluwarsa saja', feedback: 'Kode kedaluwarsa tidak otomatis mencabut sesi yang sudah terbentuk. Gunakan pemulihan resmi dan periksa akses akun.' }, { id: 'secure-account', label: 'Pulihkan lewat aplikasi resmi dan cabut sesi asing', feedback: 'Melalui aplikasi resmi: pulihkan akses bila terkunci, ganti kata sandi, keluar dari sesi asing, periksa alamat pemulihan serta aturan penerusan, dan aktifkan MFA. Ganti juga kata sandi yang digunakan ulang.' }], receipt: 'Latihan pengamanan akun selesai: jalur resmi, sesi asing, kata sandi, pemulihan, penerusan, dan MFA diperiksa.' });
  if (game.flags.simulatedDataExposure) steps.push({ id: 'identity', title: 'Tangani data dari Bab 2', context: 'Ari sudah membagikan foto identitas dan alamat rumah kepada Mira dalam simulasi. Menutup portal tidak menariknya kembali.', correctActionId: 'identity-help',
    actions: [{ id: 'identity-help', label: 'Hubungi penerbit identitas lewat kanal resmi dan pantau penyalahgunaan', feedback: 'Ikuti prosedur penerbit identitas atau lembaga terkait di wilayahmu. Pantau akun dan pesan mencurigakan; laporkan penyalahgunaan yang ditemukan. Mengganti kata sandi saja tidak memulihkan dokumen yang terpapar.' }, { id: 'public-id', label: 'Unggah identitas ke publik untuk memperingatkan orang', feedback: 'Unggahan publik menambah paparan. Simpan bukti secara privat dan cari bantuan lembaga resmi.' }], receipt: 'Latihan penanganan paparan identitas selesai; bantuan resmi dan pemantauan dipilih.' });
  steps.push({ id: 'report', title: 'Laporkan sesuai kejadian', context: 'Tidak ada uang yang dikirim dalam cerita. Pilih tindakan yang sesuai bukti dan paparan Ari.', correctActionId: 'report-relevant',
    actions: [{ id: 'pay-recovery', label: 'Bayar jasa pemulihan yang menghubungi Ari', feedback: 'Jangan membayar pihak tak terverifikasi yang menjanjikan pemulihan. Itu dapat menjadi penipuan lanjutan.' }, { id: 'report-relevant', label: 'Laporkan akun dan portal melalui kanal resmi platform', feedback: 'Gunakan fitur laporan platform serta kanal penipuan resmi di wilayahmu bila relevan. Sertakan bukti privat seperlunya. Jika uang terlanjur dikirim pada insiden nyata, segera hubungi bank atau layanan pembayaran resmi dan tanyakan kemungkinan pembatalan; hasilnya tidak dijamin.' }], receipt: 'Laporan simulasi disusun untuk platform dan pihak terkait. Tidak ada laporan atau pesan nyata yang dikirim.' });
  return steps;
}

export function recoveryDone(game: GameState, stepId: string) {
  return game.history.some(event => event.type === 'recovery.acted' && event.stepId === stepId);
}

export function reportReady(game: GameState) {
  return game.position.kind === 'chapterComplete' && game.position.chapterId === 'C3'
    && game.history.some(event => event.type === 'recovery.completed' && event.chapterId === 'C3');
}
