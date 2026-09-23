'use client';

import React, { useState, useEffect } from 'react';
import {
  SiteSettings,
  getStoredSettings,
  saveStoredSettings,
} from '@/lib/data/admin-store';
import { Save, CheckCircle2, Sliders, MapPin, Phone, Clock, Gift, ShieldAlert } from 'lucide-react';

export default function SettingsManagerClient() {
  const [settings, setSettings] = useState<SiteSettings>(getStoredSettings());
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    setSettings(getStoredSettings());
    const handleDataChanged = () => setSettings(getStoredSettings());
    window.addEventListener('thuecam_data_changed', handleDataChanged);
    return () => window.removeEventListener('thuecam_data_changed', handleDataChanged);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    showToast('Đã lưu cấu hình website thành công!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-500 text-slate-950 font-black px-5 py-3 shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="size-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Physical Showroom & Pickup Address */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <MapPin className="size-4 text-sky-400" />
            Địa Điểm Bàn Giao & Nhận Máy Chính Thức
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Địa chỉ Showroom / Điểm hẹn nhận máy TP.HCM: *
              </label>
              <input
                required
                value={settings.pickupAddress}
                onChange={(e) =>
                  setSettings({ ...settings, pickupAddress: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold outline-none focus:border-sky-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Địa điểm chuẩn: <strong>ETown, 364 Cộng Hòa, Phường 13, Quận Tân Bình, TP.HCM</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Hotlines & Support */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <Phone className="size-4 text-emerald-400" />
            Hotline & Kênh Liên Hệ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Số điện thoại Hotline: *</label>
              <input
                required
                value={settings.hotline}
                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Số Zalo CSKH: *</label>
              <input
                required
                value={settings.zalo}
                onChange={(e) => setSettings({ ...settings, zalo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Email liên hệ: *</label>
              <input
                required
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Thời gian làm việc: *</label>
              <input
                required
                value={settings.openHours}
                onChange={(e) => setSettings({ ...settings, openHours: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Promo Ribbon & Policies */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-black text-white flex items-center gap-2">
            <Gift className="size-4 text-amber-400" />
            Nội Dung Banner Khuyến Mãi & Quy Định Cọc
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Dòng chữ thông báo trên thanh Header (Promo Banner):
              </label>
              <input
                value={settings.promoBanner}
                onChange={(e) =>
                  setSettings({ ...settings, promoBanner: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Chính sách cọc tóm tắt hiển thị trong booking form:
              </label>
              <textarea
                rows={2}
                value={settings.depositPolicy}
                onChange={(e) =>
                  setSettings({ ...settings, depositPolicy: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-6 py-3 text-xs shadow-lg transition"
          >
            <Save className="size-4" /> Lưu Tất Cả Cấu Hình
          </button>
        </div>
      </form>
    </div>
  );
}
