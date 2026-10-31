import { Link } from 'react-router';

export function NotFoundPage() {
  return <div className="page-frame reading-page"><h1 tabIndex={-1}>Jejak ini belum ada.</h1><p className="lead">Halaman yang kamu cari tidak ditemukan.</p><Link to="/" className="button button--primary">Kembali ke beranda <span aria-hidden="true">↗</span></Link></div>;
}
