'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Camera, Search, Phone, Menu, X, Compass, Sparkles, Gift, Home, Tag, Clock3, Wrench } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/92 backdrop-blur-md border-b border-pink-100 shadow-sm transition-colors">
      {/* Top cute promo ribbon */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 py-2 px-4 text-xs font-bold text-white shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-white">
              <Gift className="w-3 h-3" />
              Ưu Đãi Bạn Mới
            </span>
            <span>Ưu đãi cộng dồn đến 40% | First bill -20% theo CCCD | Thứ 6 hằng tuần -10%</span>
          </div>

          <div className="flex items-center gap-4 text-white/95 text-xs">
            <span className="hidden sm:inline text-pink-100">🛵 Giao hỏa tốc 30 phút TP.HCM & Hà Nội</span>
            <span className="hidden sm:inline text-white/40">|</span>
            <a
              href="tel:0932501411"
              className="flex items-center gap-1 font-black hover:underline"
            >
              <Phone className="w-3 h-3" />
              0932.501.411 (Zalo)
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-candy flex items-center justify-center shadow-cute group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none">
                THUECAM<span className="text-[#FF3877]">.VN</span>
              </span>
              <span className="text-[11px] font-bold text-[#FF6584] block mt-1">
                Thuê máy xịn - Chụp chill hết ý! ✨
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden xl:flex items-center gap-4 text-sm font-bold text-slate-700">
            <Link href="/" className="flex items-center gap-1.5 hover:text-[#FF3877] transition-colors py-1">
              <Home className="size-4" />
              <span>Trang chủ</span>
            </Link>

            <Link href="/thiet-bi" className="hover:text-[#FF3877] transition-colors py-1">
              Kho Thiết Bị
            </Link>

            <Link href="/bang-gia" className="flex items-center gap-1.5 hover:text-[#FF3877] transition-colors py-1">
              <Tag className="size-4" />
              <span>Bảng giá</span>
            </Link>

            <Link href="/thue-theo-gio" className="flex items-center gap-1.5 hover:text-[#FF3877] transition-colors py-1">
              <Clock3 className="size-4" />
              <span>Theo giờ</span>
            </Link>

            <Link href="/cong-thuc-setup" className="flex items-center gap-1.5 hover:text-[#FF3877] transition-colors py-1">
              <Wrench className="size-4" />
              <span>Công thức setup</span>
            </Link>

            <Link href="/thue-camera-du-lich" className="flex items-center gap-1.5 text-[#FF3877] hover:text-[#e02462] transition-colors py-1">
              <Compass className="w-4 h-4" />
              <span>Camera Du Lịch</span>
            </Link>

            <Link href="/danh-muc/pocket-camera" className="hover:text-[#FF3877] transition-colors py-1">
              DJI Pocket
            </Link>

            <Link href="/danh-muc/action-camera" className="hover:text-[#FF3877] transition-colors py-1">
              Action Cam
            </Link>

            <Link href="/nhu-cau/quay-vlog" className="hover:text-[#FF3877] transition-colors py-1">
              Quay Vlog
            </Link>

            <Link href="/nhu-cau/quay-tiktok" className="hover:text-[#FF3877] transition-colors py-1">
              Quay TikTok
            </Link>

            <Link href="/blog" className="hover:text-[#FF3877] transition-colors py-1">
              Cẩm Nang & So Sánh
            </Link>

            <Link href="/dia-diem/tphcm" className="hover:text-[#FF3877] transition-colors py-1">
              Chi Nhánh
            </Link>
          </nav>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/search"
              className="px-3.5 py-2 rounded-full bg-pink-50 hover:bg-pink-100 text-[#FF3877] border border-pink-200/80 transition-all flex items-center gap-2 text-xs font-bold"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Tìm lịch trống</span>
            </Link>

            <Link
              href="/thue-camera-du-lich"
              className="px-5 py-2.5 rounded-full bg-gradient-candy hover:opacity-95 text-white font-extrabold text-xs shadow-cute hover:shadow-cute-lg transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Đặt Thuê Nhanh</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/search"
              className="p-2 rounded-xl bg-pink-50 text-[#FF3877]"
              aria-label="Tìm kiếm"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-pink-50 hover:text-[#FF3877] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-3 pb-6 border-t border-pink-100 bg-white shadow-xl space-y-2 text-sm font-bold text-slate-800">
          <Link
            href="/thiet-bi"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-50 hover:text-[#FF3877]"
          >
            <span>Tất Cả Thiết Bị Cho Thuê</span>
            <span className="text-xs text-[#FF3877] font-extrabold">Hot 🔥</span>
          </Link>
          <Link
            href="/thue-camera-du-lich"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 p-3 rounded-xl bg-pink-50/80 text-[#FF3877]"
          >
            <Compass className="w-4 h-4" />
            <span>Camera Du Lịch (Pillar)</span>
          </Link>
          <Link
            href="/danh-muc/pocket-camera"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-3 rounded-xl hover:bg-pink-50 hover:text-[#FF3877]"
          >
            DJI Pocket 4 / Pocket 3
          </Link>
          <Link
            href="/danh-muc/action-camera"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-3 rounded-xl hover:bg-pink-50 hover:text-[#FF3877]"
          >
            GoPro & Action Cam Đi Biển
          </Link>
          <Link
            href="/nhu-cau/quay-vlog"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-3 rounded-xl hover:bg-pink-50 hover:text-[#FF3877]"
          >
            Thiết Bị Quay Vlog Đời Sống
          </Link>
          <Link
            href="/nhu-cau/quay-tiktok"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-3 rounded-xl hover:bg-pink-50 hover:text-[#FF3877]"
          >
            Máy Quay TikTok & Reels Dọc
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-3 rounded-xl hover:bg-pink-50 hover:text-[#FF3877]"
          >
            Cẩm Nang & So Sánh Máy
          </Link>
          <Link
            href="/dia-diem/tphcm"
            onClick={() => setMobileMenuOpen(false)}
            className="block p-3 rounded-xl hover:bg-pink-50 hover:text-[#FF3877]"
          >
            Chi Nhánh Showroom
          </Link>

          <div className="pt-3 border-t border-pink-100 flex flex-col gap-2">
            <Link
              href="/thue-camera-du-lich"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-2xl bg-gradient-candy text-white text-center font-extrabold shadow-cute"
            >
              Đặt Thuê Online Nhận Máy Ngay
            </Link>
            <a
              href="tel:0932501411"
              className="w-full py-2.5 rounded-2xl bg-pink-50 text-[#FF3877] text-center font-bold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Gọi Hotline: 0901.234.567
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
