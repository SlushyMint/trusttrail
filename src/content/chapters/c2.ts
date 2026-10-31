import type { Chapter } from '../../engine/types';
import { chapterOne } from './c1';

export const chapterTwo = {
  id: 'C2',
  title: 'Perekrut yang ramah',
  subtitle: 'Bab 2 · Saat kepercayaan terasa personal',
  objective: 'Kenali orang di balik pesan. Periksa klaimnya sebelum menentukan informasi yang boleh dibagikan Ari.',
  intro: [
    { id: 'C2-L01', speaker: 'Narator', text: 'Malam mulai turun. Apa pun keputusan tentang email tadi, catatannya tetap tersimpan. Kini seseorang menghubungi Ari langsung lewat Messages.' },
    { id: 'C2-L02', speaker: 'Ari', text: 'Dia tahu aku tertarik pada desain produk. Mungkin ini orang yang bisa menjelaskan undangan tadi.' },
    { id: 'C2-L03', speaker: 'Narator', text: 'Namanya Mira. Ia tidak langsung meminta apa pun. Ia menawarkan bantuan menyiapkan wawancara dan mengakui bahwa proses mencari kerja bisa melelahkan.' },
  ],
  conversation: {
    id: 'C2-CHAT',
    profile: {
      name: 'Mira Pranesti', role: 'Talent Partner · NovaTech', handle: '@mira.novatalent', evidenceId: 'C2-E01',
      bio: 'Membantu talenta muda menemukan tim produk yang tepat. Partner rekrutmen NovaTech sejak 2023.',
      history: 'Profil dibuat 6 minggu lalu. Riwayat sebelumnya: Community Associate · Lentara Studio. Belum ada keterangan perpindahan atau penugasan sebagai partner NovaTech.',
    },
    opening: 'Halo Ari, aku Mira, partner talent NovaTech. Aku melihat portofolio desain produkmu di pameran alumni. Studi kasus layanan perpustakaanmu menarik! Kalau email tadi terasa mendadak, aku bisa bantu jelaskan. Mencari posisi pertama memang melelahkan.',
    exchanges: [
      { id: 'C2-M01', reply: 'Boleh jelaskan peran dan prosesnya?', response: 'Tentu. Tim produk sedang mencari intern untuk riset pengguna. Kita bisa bahas studi kasusmu dulu, tidak perlu pengalaman kerja. Aku menangani kandidat lewat partner eksternal, jadi profilku mungkin masih menyebut Lentara Studio.' },
      { id: 'C2-M02', reply: 'Bisakah prosesnya lewat kanal perusahaan?', response: 'Bisa nanti. Untuk penjadwalan awal, pindah dulu ke akun pribadiku @mira.fasttrack di SapaRuang. Antrean tim pusat sedang penuh; kalau malam ini kita bereskan, aku bisa bantu sisihkan slot. Jangan tunggu balasan kontak pusat dulu, ya.', evidenceId: 'C2-E02' },
      { id: 'C2-M03', reply: 'Apa yang dibutuhkan untuk penjadwalan?', response: 'Cukup foto kartu identitas dan alamat rumah lengkap untuk berkas kandidat. Belum ada wawancara, tetapi ini supaya administrasi lebih cepat. Penugasanku belum muncul di direktori karena internal; konfirmasi ke aku saja. Setelah itu kukirim portal kandidat.', evidenceId: 'C2-E03' },
    ],
  },
  // Existing mail records stay authored in C1; the active artifact in this chapter is Messages.
  email: chapterOne.email,
  decoy: chapterOne.decoy,
  evidence: [
    { id: 'C2-E01', chapterId: 'C2', title: 'Riwayat profil belum mendukung peran', actionLabel: 'Periksa riwayat profil', discovery: 'hotspot',
      detail: 'Mira mengaku menjadi partner NovaTech sejak 2023. Akun baru dibuat 6 minggu lalu dan riwayat yang terlihat hanya menyebut Lentara Studio.',
      explanation: 'Klaim di bio dan riwayat yang tersedia belum saling mendukung. Pengetahuan tentang portofolio publik tidak membuktikan kewenangan merekrut.',
      caution: 'Akun baru atau pekerjaan sebelumnya tidak membuktikan penipuan. Partner eksternal bisa sah; periksa penugasannya lewat sumber terpisah.' },
    { id: 'C2-E02', chapterId: 'C2', title: 'Bantuan bersyarat pindah kanal', actionLabel: 'Periksa perpindahan kanal', discovery: 'hotspot',
      detail: 'Mira meminta pindah ke akun pribadi @mira.fasttrack di SapaRuang untuk menyisihkan slot malam ini, sambil menyarankan agar Ari tidak menunggu kontak pusat.',
      explanation: 'Bantuan yang terasa personal dapat membuat permintaan pengecualian terasa wajar. Memindahkan proses dari kanal perusahaan sekaligus menghambat konfirmasi mengurangi kesempatan memeriksa.',
      caution: 'Percakapan informal tidak selalu berbahaya. Yang perlu diuji adalah kewenangan, alasan pindah, dan tekanan untuk melewati pemeriksaan.' },
    { id: 'C2-E03', chapterId: 'C2', title: 'Data identitas sebelum wawancara', actionLabel: 'Periksa permintaan data', discovery: 'hotspot',
      detail: 'Foto kartu identitas dan alamat rumah lengkap diminta untuk penjadwalan awal. Mira juga meminta agar klaim penugasannya cukup dikonfirmasi kepadanya sendiri.',
      explanation: 'Tujuan penjadwalan belum menjelaskan kebutuhan dokumen identitas atau alamat lengkap. Pengirim yang mengonfirmasi klaimnya sendiri bukan verifikasi independen.',
      caution: 'Dokumen dapat diperlukan pada tahap administrasi yang sah. Pastikan tahap, tujuan, penerima, dan saluran penyimpanannya sebelum membagikan.' },
    { id: 'C2-E04', chapterId: 'C2', title: 'Penugasan dan kebutuhan data belum cocok', actionLabel: 'Bandingkan direktori perekrut', discovery: 'source-comparison',
      detail: 'Direktori perusahaan belum mengonfirmasi Mira atau Lentara sebagai partner program ini. Pedoman penjadwalan hanya meminta preferensi waktu melalui portal resmi, tanpa foto identitas atau alamat rumah.',
      explanation: 'Pembanding ini tidak mendukung kewenangan dan kebutuhan data yang diklaim. Tahan dokumen dan gunakan kontak dari direktori untuk konfirmasi, bukan akun yang diberikan Mira.',
      caution: 'Direktori dapat terlambat diperbarui. Status belum terkonfirmasi bukan vonis; tetap batasi data sampai ada konfirmasi melalui kanal yang ditemukan sendiri.' },
  ],
  source: {
    id: 'C2-SOURCE', inspectionId: 'C2-DIRECTORY', actionLabel: 'Periksa direktori perekrut',
    provenance: 'Dibuka dari direktori perusahaan tersimpan di Browser TrustTrail, terpisah dari profil dan akun yang diberikan Mira. Ini catatan fiktif dalam simulasi.',
    address: 'novatech.example/karier/tim',
    claim: 'Mira mengaku partner NovaTech sejak 2023, meminta pindah ke SapaRuang, lalu meminta foto identitas dan alamat rumah sebelum wawancara. Klaim penugasannya hanya bisa dikonfirmasi kepadanya.',
    reference: 'Catatan program: koordinator Nara Wisesa, kontak karier@novatech.example. Mira Pranesti dan Lentara Studio belum terkonfirmasi sebagai partner program. Penjadwalan melalui novatech.example/karier hanya memerlukan pilihan waktu. Dokumen identitas baru diproses setelah penawaran resmi melalui kanal administrasi yang terverifikasi. Daftar partner dapat diperbarui; konfirmasikan penugasan melalui kontak karier ini.',
    comparison: 'Kewenangan Mira belum didukung direktori, dan kebutuhan datanya berbeda dari pedoman penjadwalan. Tahan dokumen. Konfirmasikan penugasan ke karier@novatech.example yang ditemukan di direktori ini.',
    evidenceId: 'C2-E04',
  },
  decision: {
    id: 'D2', prompt: 'Mira menawarkan slot dan meminta foto identitas serta alamat rumah. Bagaimana Ari menanggapi?',
    options: [
      { id: 'share-data', label: 'Ikuti Mira dan bagikan berkas simulasi', description: 'Ari pindah ke akun pribadi dan membagikan paket identitas fiktif. Tidak ada isian atau unggahan sungguhan.', effects: ['simulatedDataExposure'], safetyCriteriaMet: [],
        outcome: { title: 'Bantuan berubah menjadi paparan.', text: 'Dalam cerita, Ari membagikan paket identitas fiktif melalui akun pribadi Mira. Mira kemudian mengirim portal kandidat. Kewenangan penerima belum terverifikasi; Ari tidak bisa memastikan bagaimana salinan data itu akan digunakan.', reflection: 'Tidak ada data pemain yang dikirim. Paparan dalam cerita tidak membuktikan pencurian identitas atau pengambilalihan akun.' },
        feedback: { happened: 'Simulasi mencatat paparan dokumen Ari kepada pihak yang belum terverifikasi. Semua berkas hanya bagian cerita; tidak ada unggahan, pengiriman, atau perpindahan aplikasi sungguhan.', why: 'Perhatian personal dan janji membantu bisa membuat permintaan data terasa masuk akal. Kenal portofolio tidak sama dengan berwenang menerima identitas.', next: 'Hentikan pengiriman lanjutan. Simpan catatan percakapan, konfirmasikan lewat kanal resmi yang ditemukan sendiri, dan minta penjelasan penanganan atau penghapusan data melalui pihak yang terverifikasi.', limitation: 'Paparan tidak otomatis berarti penyalahgunaan sudah terjadi. Tindakan pemulihan bergantung pada jenis data yang benar-benar dibagikan.' } },
      { id: 'decline', label: 'Tolak permintaan dan akhiri percakapan', description: 'Ari tidak pindah kanal dan tidak membagikan dokumen. Klaim perekrut tetap belum terkonfirmasi.', effects: ['protectedData'], safetyCriteriaMet: ['D2-withhold-data', 'D2-stop-unofficial-channel'],
        outcome: { title: 'Batas yang tetap terjaga.', text: 'Ari menolak mengirim dokumen dan mengakhiri percakapan. Mira membalas singkat bahwa slot tidak bisa ditahan. Tidak ada data yang dibagikan; klaim penugasannya tetap belum terkonfirmasi.', reflection: 'Kamu boleh menolak permintaan data tanpa lebih dulu membuktikan niat buruk seseorang.' },
        feedback: { happened: 'Ari menjaga dokumen dan tidak meneruskan proses melalui akun pribadi. Keputusan ini menghentikan paparan dalam percakapan.', why: 'Batas data dapat ditetapkan berdasarkan kebutuhan yang belum jelas. Rasa sungkan kepada orang yang ramah tidak mewajibkan kita menyerahkan dokumen.', next: 'Jika ingin menelusuri peluangnya, mulai dari direktori atau kontak perusahaan yang ditemukan secara mandiri.', limitation: 'Menolak permintaan bukan verifikasi identitas. Hanya detail dan perbandingan sumber yang benar-benar diperiksa mendapat catatan verifikasi.' } },
      { id: 'verify-recruiter', label: 'Tahan data dan verifikasi penugasan', description: 'Ari menunda permintaan lalu membandingkan identitas dan kebutuhan data dengan direktori perusahaan di Browser.', effects: ['protectedData'], safetyCriteriaMet: ['D2-withhold-data', 'D2-stop-unofficial-channel'], resolution: { sourceId: 'C2-SOURCE' },
        outcome: { title: 'Keramahan mendapat pembanding.', text: 'Ari memeriksa direktori dan membandingkan klaim Mira. Penugasannya belum terkonfirmasi, dan dokumen yang diminta tidak diperlukan untuk penjadwalan. Ari menahan data dan mencatat kontak perusahaan untuk konfirmasi lebih lanjut.', reflection: 'Sikap ramah tetap bisa dihargai sambil memeriksa kewenangan dan membatasi data.' },
        feedback: { happened: 'Ari menahan dokumen, memeriksa sumber terpisah, dan membandingkan klaimnya. Tidak ada data dibagikan atau pesan sungguhan dikirim ke perusahaan.', why: 'Verifikasi yang berguna menguji kewenangan dan tujuan permintaan. Memilih kata “verifikasi” saja belum cukup; pemeriksaannya perlu dilakukan.', next: 'Konfirmasikan penugasan melalui kontak dari direktori. Bagikan hanya data yang diperlukan pada tahap yang tepat dan melalui kanal yang terverifikasi.', limitation: 'Tidak muncul di direktori bukan bukti tunggal penipuan. Catatan bisa tertinggal; keputusan menahan data tetap masuk akal sampai klaim terkonfirmasi.' } },
    ],
  },
  bridge: {
    cautious: 'Ari tetap memegang dokumennya. Sebuah pesan lanjutan menawarkan portal kandidat sebagai jalan lain. Pada Bab 3, tampilan profesional akan kembali menguji kepercayaan Ari.',
    exposed: 'Dokumen fiktif Ari sudah dibagikan, tetapi Ari masih bisa menghentikan paparan berikutnya. Portal kandidat kini menunggu. Pada Bab 3, Ari perlu memeriksa apa yang diminta halaman itu.',
  },
} as const satisfies Chapter;
