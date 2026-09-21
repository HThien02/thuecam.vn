import Link from 'next/link';
import { getArticles, getCategories, getProducts, getAllReviewsForAdmin } from '@/lib/data';

export default async function AdminDashboardPage() {
  const [products, categories, articles, reviews] = await Promise.all([getProducts(), getCategories(), getArticles(), getAllReviewsForAdmin()]);
  const rows = [
    { label: 'Thiết bị', value: products.length, href: '/admin/content', tone: 'bg-sky-50 text-sky-700' },
    { label: 'Danh mục giá', value: categories.length, href: '/admin/content', tone: 'bg-amber-50 text-amber-700' },
    { label: 'Bài viết', value: articles.length, href: '/admin/content', tone: 'bg-indigo-50 text-indigo-700' },
    { label: 'Đánh giá chờ duyệt', value: reviews.filter((review) => review.status === 'PENDING').length, href: '/admin/reviews', tone: 'bg-rose-50 text-rose-700' },
  ];

  return <div className="space-y-8">
    <header><p className="text-xs font-black uppercase tracking-[0.18em] text-sky-500">THUECAM CONTROL CENTER</p><h1 className="mt-2 text-3xl font-black text-white">Dashboard quản lý</h1><p className="mt-2 max-w-2xl text-sm text-slate-400">Theo dõi nhanh thiết bị, bảng giá, bài viết và đánh giá. Các module quản trị được trình bày dưới dạng bảng để dễ kiểm tra và chỉnh sửa.</p></header>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{rows.map((row) => <Link key={row.label} href={row.href} className={`rounded-3xl border border-slate-800 p-5 transition hover:-translate-y-1 hover:border-sky-500/50 ${row.tone}`}><p className="text-xs font-bold opacity-75">{row.label}</p><p className="mt-3 text-3xl font-black">{row.value}</p><p className="mt-2 text-xs font-bold">Mở bảng quản lý →</p></Link>)}</section>
    <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/70"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5"><div><h2 className="font-black text-white">Tổng quan dữ liệu</h2><p className="mt-1 text-xs text-slate-400">Dữ liệu hiện tại trong catalog nội dung</p></div><Link href="/admin/content" className="rounded-full bg-sky-500 px-4 py-2 text-xs font-black text-slate-950">Quản lý nội dung</Link></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-950/60 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3">Module</th><th className="px-5 py-3">Số bản ghi</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3 text-right">Thao tác</th></tr></thead><tbody className="divide-y divide-slate-800 text-slate-300">{rows.map((row) => <tr key={row.label}><td className="px-5 py-4 font-bold text-white">{row.label}</td><td className="px-5 py-4">{row.value}</td><td className="px-5 py-4"><span className="rounded-full bg-emerald-400/10 px-2 py-1 text-xs font-bold text-emerald-300">Đang hoạt động</span></td><td className="px-5 py-4 text-right"><Link href={row.href} className="font-bold text-sky-400 hover:text-sky-300">Xem bảng</Link></td></tr>)}</tbody></table></div></section>
  </div>;
}
