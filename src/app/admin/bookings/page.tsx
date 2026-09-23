import React from 'react';
import type { Metadata } from 'next';
import BookingManagerClient from './BookingManagerClient';

export const metadata: Metadata = {
  title: 'Quản Lý Đơn Thuê & Lịch Máy | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default function AdminBookingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-emerald-400">
          THUECAM OPERATIONS & DISPATCH
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white">
          Quản Lý Đơn Thuê & Lịch Trình Thiết Bị
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Theo dõi trạng thái đơn hàng của khách, duyệt đơn, tạo đơn thuê tại quầy ETown Tân Bình và khóa lịch bảo trì/đặt trước.
        </p>
      </div>

      <BookingManagerClient />
    </div>
  );
}
