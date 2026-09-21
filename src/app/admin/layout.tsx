import React from 'react';
import Link from 'next/link';
import {
  Sliders,
  Activity,
  FileEdit,
  CornerDownRight,
  Star,
  ExternalLink,
  Camera,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0c1220] border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Admin brand */}
          <Link href="/admin/seo" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-slate-950 font-bold">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white block">THUECAM ADMIN</span>
              <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-wider block">
                SEO & Content Center
              </span>
            </div>
          </Link>

          {/* Nav Items */}
          <nav className="space-y-1 text-xs font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-2.5 rounded-xl bg-sky-500/10 px-3 py-2.5 text-sky-300 transition-colors hover:bg-sky-500/20"
            >
              <Camera className="h-4 w-4 text-sky-400" />
              <span>Dashboard tổng quan</span>
            </Link>

            <Link
              href="/admin/seo"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Quản Trị SEO & SERP</span>
            </Link>

            <Link
              href="/admin/seo/health"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Sức Khỏe SEO (Audit)</span>
            </Link>

            <Link
              href="/admin/content"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <FileEdit className="w-4 h-4 text-blue-400" />
              <span>Quản Lý Nội Dung CMS</span>
            </Link>

            <Link
              href="/admin/redirects"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <CornerDownRight className="w-4 h-4 text-amber-400" />
              <span>Điều Hướng 301 Redirects</span>
            </Link>

            <Link
              href="/admin/reviews"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              <span>Duyệt Đánh Giá Khách</span>
            </Link>
          </nav>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-slate-800 space-y-3 text-xs">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-slate-400 hover:text-cyan-400 transition-colors p-2 rounded-lg bg-slate-900"
          >
            <span>Xem Website Công Khai</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Chế độ an toàn SEO đang bật</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
