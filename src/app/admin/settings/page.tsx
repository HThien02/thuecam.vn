import React from 'react';
import type { Metadata } from 'next';
import SettingsManagerClient from './SettingsManagerClient';

export const metadata: Metadata = {
  title: 'Cài Đặt Website & Địa Điểm | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-cyan-400">
          THUECAM CONFIGURATION CONTROL
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white">
          Cài Đặt Website & Địa Điểm Nhận Máy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Cập nhật điểm hẹn nhận máy (ETown Tân Bình), số hotline, giờ làm việc, thanh banner khuyến mãi và chính sách cọc.
        </p>
      </div>

      <SettingsManagerClient />
    </div>
  );
}
