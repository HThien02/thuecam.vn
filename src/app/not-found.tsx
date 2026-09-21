import React from 'react';
import Link from 'next/link';
import { Camera, Home, Search, Compass, Phone } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
          <Camera className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-cyan-400 font-mono">404</span>
          <h1 className="text-2xl font-bold text-white">Không Tìm Thấy Trang Yêu Cầu</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Đường dẫn bạn truy cập có thể đã được cập nhật hoặc không còn tồn tại trên hệ thống THUECAM.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs">
          <span className="text-slate-400 font-semibold block">Bạn có thể thử các lối tắt sau:</span>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-cyan-400" />
              <span>Về Trang Chủ</span>
            </Link>

            <Link
              href="/thiet-bi"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Kho Thiết Bị</span>
            </Link>

            <Link
              href="/thue-camera-du-lich"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Camera Du Lịch</span>
            </Link>

            <Link
              href="/lien-he"
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Liên Hệ Hỗ Trợ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
