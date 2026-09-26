'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sliders,
  Activity,
  FileEdit,
  CornerDownRight,
  Star,
  ExternalLink,
  Camera,
  ShieldCheck,
  LogOut,
  Layers,
  Settings,
  LayoutDashboard,
  TicketPercent,
} from 'lucide-react';
import SafeButton from '@/components/common/SafeButton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // If on login page, render bare layout without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const isNavActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    if (href === '/admin/seo') return pathname === '/admin/seo';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navClass = (href: string) => {
    const active = isNavActive(href);
      return `flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors text-[13px] font-semibold ${
      active
        ? 'bg-blue-50 text-blue-900 border-l-[3px] border-blue-700'
        : 'text-slate-600 hover:text-blue-800 hover:bg-slate-100'
    }`;
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      router.replace('/admin/login');
    }
  };

  return (
    <div className="admin-shell min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 md:sticky md:top-0 md:h-screen md:overflow-y-auto bg-white border-r border-slate-200 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Admin brand */}
          <Link href="/admin" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-800 font-black border border-blue-100 group-hover:bg-blue-100 transition-colors">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white block tracking-wide">
                THUECAM ADMIN
              </span>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                Session Bảo Mật
              </span>
            </div>
          </Link>

          {/* Navigation Items */}
          <nav className="space-y-1 text-xs font-medium">
            <Link href="/admin" className={navClass('/admin')}>
              <LayoutDashboard className="h-4 w-4 text-sky-400 shrink-0" />
              <span>Dashboard tổng quan</span>
            </Link>

            <div className="pt-3 pb-1 px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Quản trị vận hành
            </div>

            <Link href="/admin/products" className={navClass('/admin/products')}>
              <Camera className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Thiết Bị & Bảng Giá</span>
            </Link>

            <Link href="/admin/categories" className={navClass('/admin/categories')}>
              <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Danh Mục Thiết Bị</span>
            </Link>

            <Link href="/admin/bookings" className={navClass('/admin/bookings')}>
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Đơn Thuê & Lịch Máy</span>
            </Link>

            <Link href="/admin/vouchers" className={navClass('/admin/vouchers')}>
              <TicketPercent className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Voucher & Khuyến Mãi</span>
            </Link>

            <div className="pt-3 pb-1 px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Nội dung & Đánh giá
            </div>

            <Link href="/admin/content" className={navClass('/admin/content')}>
              <FileEdit className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Nội Dung CMS & Blog</span>
            </Link>

            <Link href="/admin/reviews" className={navClass('/admin/reviews')}>
              <Star className="w-4 h-4 text-yellow-400 shrink-0" />
              <span>Duyệt Đánh Giá Khách</span>
            </Link>

            <Link href="/admin/settings" className={navClass('/admin/settings')}>
              <Settings className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Cài Đặt & Địa Điểm ETown</span>
            </Link>

            <div className="pt-3 pb-1 px-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Kỹ thuật SEO
            </div>

            <Link href="/admin/seo" className={navClass('/admin/seo')}>
              <Sliders className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Quản Trị SEO & SERP</span>
            </Link>

            <Link href="/admin/seo/health" className={navClass('/admin/seo/health')}>
              <Activity className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Sức Khỏe SEO (Audit)</span>
            </Link>

            <Link href="/admin/redirects" className={navClass('/admin/redirects')}>
              <CornerDownRight className="w-4 h-4 text-amber-400 shrink-0" />
              <span>301 Redirects</span>
            </Link>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="pt-5 border-t border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HttpOnly Session</span>
            </span>
            <span className="text-slate-500">v2.0</span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-slate-600 hover:text-blue-800 transition-colors p-2.5 rounded-xl bg-slate-50 border border-slate-200"
          >
            <span className="font-bold">Xem Website Công Khai</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <SafeButton
            onClick={handleLogout}
            disabled={loggingOut}
            loadingText="Đang đăng xuất..."
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 p-2.5 font-semibold transition-colors text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Đăng Xuất Khỏi Admin</span>
          </SafeButton>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
