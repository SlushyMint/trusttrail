import { Notice } from '../components/ui/Notice';
import { Link } from 'react-router';

export function GuidePage({ onReplay, canReplay }: { onReplay?: () => void; canReplay?: boolean }) {
  return <div className="page-frame reading-page">
    <h1 tabIndex={-1}>Tentang simulasi</h1><p className="lead">Berlatih mengambil langkah yang lebih hati-hati.</p>
    <div className="paper-note">
      <h2>Ruang yang aman untuk belajar</h2>
      <p>Orang, organisasi, percakapan, dan alamat dalam cerita ini bersifat fiktif. Tidak ada tautan rekrutmen yang dibuka ke internet.</p>
      <p>TrustTrail tidak memerlukan akun, tidak memiliki formulir data pribadi, dan tidak mengirim progres ke layanan lain. Jangan masukkan kata sandi, OTP, dokumen identitas, atau data rekening.</p>
      <h2>Cara memeriksa jejak</h2>
      {onReplay && canReplay ? <button className="button button--secondary" onClick={onReplay}>Ulangi tutorial</button> : null}
      <ol className="guide-steps"><li>Buka detail berlabel “Periksa”. Informasi yang kamu telusuri akan masuk ke Jurnal bukti.</li><li>Cari catatan karier dari direktori independen. Periksa detailnya dan bandingkan dengan klaim pesan. Membuka panel saja belum melakukan verifikasi.</li><li>Pilih tindakan lalu tekan “Jalankan pilihan”. Baca akibat dan langkah berikutnya. Semua pilihan tetap memberi jalan untuk belajar.</li></ol>
      <h2>Progres milik browser ini</h2>
      <p>Urutan tindakan permainan disimpan di localStorage. Tahap tutorial dan preferensi suara disimpan terpisah dari progres. Kamu dapat melanjutkan setelah memuat ulang halaman atau menghapus progres dari menu. Tidak ada nama, alamat email pribadi, kata sandi, atau pengenal pemain yang disimpan.</p>
      <p>Efek suara singkat mengikuti tindakan investigasi. Gunakan Suara untuk mengatur volume efek, atau bisukan langsung melalui tombol di bilah sistem. Semua petunjuk tetap tersedia dalam teks. Memuat ulang halaman tidak memutar ulang efek.</p>
      <p>Gunakan satu tab aktif. Penyimpanan dapat diblokir atau dihapus browser. Progres tidak disinkronkan antarperangkat, profil, atau alamat situs. Jika penyimpanan gagal, permainan tetap berjalan dalam tab ini dengan pemberitahuan.</p>
      <Link className="button button--secondary" to="/play">Kembali ke perjalanan Ari</Link>
    </div>
    <Notice title="Latihan, bukan kepastian"><p>Satu ciri seperti salah ketik, HTTPS, atau tampilan rapi tidak menentukan kebenaran tawaran. Tiga bab melatih pemeriksaan undangan, identitas perekrut, dan portal. Misi pemulihan menyesuaikan tindakan dengan paparan Ari, lalu Trust Report merangkum jejak permainan.</p></Notice>
  </div>;
}
