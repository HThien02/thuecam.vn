import React from 'react';
import type { Metadata } from 'next';
import { getAdminRow } from '@/lib/data/admin-server';
import SettingsManagerClient from './SettingsManagerClient';

export const metadata: Metadata = {
  title: 'Cài Đặt Website & Địa Điểm | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const row = await getAdminRow<{
    site_name: string;
    pickup_address: string;
    hotline: string;
    zalo: string;
    email: string;
    open_hours: string;
    promo_banner: string;
    deposit_policy: string;
    contact_manager_name: string;
    facebook_url: string;
    instagram_url: string;
    whatsapp_url: string;
  }>('site_settings', 'global');
  const initialSettings = {
    siteName: row?.site_name ?? 'THUECAM.VN',
    pickupAddress: row?.pickup_address ?? '',
    hotline: row?.hotline ?? '',
    zalo: row?.zalo ?? '',
    email: row?.email ?? '',
    openHours: row?.open_hours ?? '',
    promoBanner: row?.promo_banner ?? '',
    depositPolicy: row?.deposit_policy ?? '',
    contactManagerName: row?.contact_manager_name ?? '',
    facebookUrl: row?.facebook_url ?? '',
    instagramUrl: row?.instagram_url ?? '',
    whatsappUrl: row?.whatsapp_url ?? '',
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-cyan-400">
          THUECAM CONFIGURATION CONTROL
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-black">
          Cài Đặt Website & Địa Điểm Nhận Máy
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Cập nhật điểm hẹn nhận máy (ETown Tân Bình), số hotline, giờ làm việc, thanh banner khuyến mãi và chính sách cọc.
        </p>
      </div>

      <SettingsManagerClient initialSettings={initialSettings} />
    </div>
  );
}
