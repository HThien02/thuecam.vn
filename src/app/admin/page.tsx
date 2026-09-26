import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/security/admin-auth';
import { getAdminRows } from '@/lib/data/admin-server';
import type { Product, Category, Article, Review } from '@/types';
import {
  Camera,
  Layers,
  Activity,
  FileEdit,
  Star,
  Plus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Sparkles,
} from 'lucide-react';

export const metadata = {
  title: 'Trung Tâm Điều Hành & Quản Trị Hệ Thống | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const [products, categories, articles, reviews] = await Promise.all([
    getAdminRows<Product>('products'),
    getAdminRows<Category>('categories'),
    getAdminRows<Article>('articles'),
    getAdminRows<Review>('reviews'),
  ]);

  const pendingReviews = reviews.filter((r) => r.status === 'PENDING');
  const activeProducts = products.filter((p) => p.status === 'ACTIVE');

  const stats = [
    {
      label: 'Tổng thiết bị trong kho',
      value: products.length,
      sub: `${activeProducts.length} máy sẵn sàng cho thuê`,
      href: '/admin/products',
      icon: Camera,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10 border-sky-500/20',
    },
    {
      label: 'Danh mục bảng giá',
      value: categories.length,
      sub: 'Phân loại thiết bị theo nhu cầu',
      href: '/admin/categories',
      icon: Layers,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
    },
    {
      label: 'Đơn thuê & Lịch máy',
      value: 'Hoạt động',
      sub: 'Theo dõi máy trống & đặt trước',
      href: '/admin/bookings',
      icon: Activity,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      label: 'Bài viết CMS & SEO',
      value: articles.length,
      sub: 'Blog, Cẩm nang & So sánh',
      href: '/admin/content',
      icon: FileEdit,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      label: 'Đánh giá chờ duyệt',
      value: pendingReviews.length,
      sub: `${reviews.length - pendingReviews.length} đã được duyệt hiển thị`,
      href: '/admin/reviews',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    },
    {
      label: 'Điểm hẹn nhận máy',
      value: 'ETown',
      sub: 'Tân Bình, TP.HCM (Kho chính)',
      href: '/admin/settings',
      icon: MapPin,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  const modules = [
    {
      name: 'Quản Lý Thiết Bị & Giá Thuê',
      records: `${products.length} sản phẩm`,
      status: 'Hoạt động',
      desc: 'CRUD đầy đủ thông số máy, giá theo ngày, giảm giá 3 ngày, 7 ngày, tiền cọc.',
      href: '/admin/products',
      btnText: 'Mở Bảng Thiết Bị',
    },
    {
      name: 'Quản Lý Danh Mục Bảng Giá',
      records: `${categories.length} danh mục`,
      status: 'Hoạt động',
      desc: 'CRUD các danh mục máy ảnh, action cam, pocket, flycam và thứ tự hiển thị.',
      href: '/admin/categories',
      btnText: 'Mở Bảng Danh Mục',
    },
    {
      name: 'Quản Lý Đơn Thuê & Lịch Máy',
      records: 'Đang đồng bộ',
      status: 'Hoạt động',
      desc: 'Quản lý đơn thuê khách gửi, cập nhật trạng thái đơn và khóa ngày máy bận.',
      href: '/admin/bookings',
      btnText: 'Mở Bảng Đơn Thuê',
    },
    {
      name: 'Nội Dung CMS & Bài Viết SEO',
      records: `${articles.length} bài viết`,
      status: 'Hoạt động',
      desc: 'Quản lý bài viết blog, cẩm nang du lịch, bài so sánh và cluster pillar.',
      href: '/admin/content',
      btnText: 'Mở Bảng Nội Dung',
    },
    {
      name: 'Kiểm Duyệt Đánh Giá Khách Hàng',
      records: `${reviews.length} đánh giá (${pendingReviews.length} chờ)`,
      status: pendingReviews.length > 0 ? 'Cần duyệt' : 'Đã duyệt hết',
      desc: 'Duyệt review của khách để hiển thị sao uy tín và Google Schema JSON-LD.',
      href: '/admin/reviews',
      btnText: 'Mở Bảng Đánh Giá',
    },
    {
      name: 'Cài Đặt Website & Địa Điểm ETown',
      records: 'Cấu hình chung',
      status: 'Đã thiết lập',
      desc: 'Thay đổi địa điểm nhận máy ETown Tân Bình, hotline, banner ưu đãi, chính sách cọc.',
      href: '/admin/settings',
      btnText: 'Mở Bảng Cài Đặt',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1 text-xs font-black uppercase text-sky-400 border border-sky-500/20">
            <Sparkles className="size-3.5" /> THUECAM Executive Control Center
          </div>
          <h1 className="mt-2 text-2xl sm:text-3xl font-black text-black">
            Dashboard Quản Lý & Vận Hành
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Trung tâm quản lý chặt chẽ: CRUD thiết bị, bảng giá, đơn thuê, bài viết và địa điểm nhận máy ETown Tân Bình.
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-4 py-2.5 text-xs shadow-md transition"
          >
            <Plus className="size-4" /> Thêm Thiết Bị
          </Link>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 text-xs shadow-md transition"
          >
            <Activity className="size-4" /> Đơn Thuê & Lịch
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`rounded-2xl border p-4 transition-all hover:-translate-y-1 hover:border-sky-500/50 ${item.bgColor}`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`size-5 ${item.color}`} />
                <ArrowRight className="size-3.5 text-slate-500 group-hover:text-white" />
              </div>
              <p className="mt-3 text-2xl font-black text-white">{item.value}</p>
              <p className="mt-1 text-xs font-bold text-slate-200 line-clamp-1">{item.label}</p>
              <p className="mt-0.5 text-[10px] text-slate-400 line-clamp-1">{item.sub}</p>
            </Link>
          );
        })}
      </div>

      {/* Central Management Modules Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 p-5 bg-slate-950/60">
          <div>
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <Layers className="size-4 text-sky-400" />
              Danh Sách Phân Hệ Quản Trị CRUD
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Tất cả các chức năng và nội dung hiển thị trên website đều có thể thêm, sửa, xóa trực tiếp
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Phân hệ quản trị</th>
                <th className="px-5 py-3.5">Dữ liệu hiện tại</th>
                <th className="px-5 py-3.5">Mô tả chức năng</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {modules.map((m) => (
                <tr key={m.name} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-4 font-black text-white text-sm">
                    {m.name}
                  </td>
                  <td className="px-5 py-4 font-bold text-sky-400">
                    {m.records}
                  </td>
                  <td className="px-5 py-4 text-slate-400 max-w-sm">
                    {m.desc}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black text-emerald-400 border border-emerald-500/20">
                      {m.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={m.href}
                      className="inline-flex items-center gap-1 font-bold text-sky-400 hover:text-sky-300 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
                    >
                      {m.btnText} <ArrowRight className="size-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
