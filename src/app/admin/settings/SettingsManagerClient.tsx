'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import type { SiteSettings } from '@/lib/data/admin-types';
import { saveAdminRecord } from '@/lib/data/admin-api';
import { Save, CheckCircle2, MapPin, Phone, Gift, Loader2, Share2, Camera, Upload } from 'lucide-react';

function getWhatsappPhone(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';

  try {
    const url = new URL(trimmed);
    if (url.hostname === 'wa.me') return url.pathname.replace(/\D/g, '');
    if (url.hostname.endsWith('whatsapp.com')) {
      return (url.searchParams.get('phone') ?? '').replace(/\D/g, '');
    }
    return '';
  } catch {
    return trimmed.replace(/\D/g, '');
  }
}

export default function SettingsManagerClient({
  initialSettings,
  initialLogoUrl,
}: {
  initialSettings: SiteSettings;
  initialLogoUrl: string | null;
}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [logoPreviewAvailable, setLogoPreviewAvailable] = useState(Boolean(initialLogoUrl));
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('file', logoFile);
      const response = await fetch('/api/admin/site-logo', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
        signal: AbortSignal.timeout(60_000),
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || typeof result?.url !== 'string') {
        throw new Error(result?.error ?? 'Không thể tải logo lên.');
      }

      setLogoUrl(result.url);
      setLogoPreviewAvailable(true);
      setLogoFile(null);
      if (logoInputRef.current) logoInputRef.current.value = '';
      showToast('Đã cập nhật logo website thành công!');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể tải logo lên.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveAdminRecord('site_settings', {
        id: 'global',
        site_name: settings.siteName,
        pickup_address: settings.pickupAddress,
        hotline: settings.hotline,
        zalo: settings.zalo,
        email: settings.email,
        open_hours: settings.openHours,
        promo_banner: settings.promoBanner,
        deposit_policy: settings.depositPolicy,
        contact_manager_name: settings.contactManagerName,
        facebook_url: settings.facebookUrl,
        instagram_url: settings.instagramUrl,
        whatsapp_url: getWhatsappPhone(settings.whatsappUrl),
      }, 'update');
      showToast('Đã lưu cấu hình website thành công!');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể lưu cấu hình.');
    } finally {
      setIsSaving(false);
    }
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
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4" aria-labelledby="site-logo-heading">
          <div>
            <h2 id="site-logo-heading" className="flex items-center gap-2 text-sm font-black text-black">
              <Camera className="size-4 text-sky-400" /> Logo website
            </h2>
            <p className="mt-1 text-xs text-slate-500">Tải logo mới lên để thay biểu tượng trên thanh đầu trang. Ảnh PNG, JPG, WebP hoặc AVIF, tối đa 4 MB.</p>
          </div>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 min-w-48 items-center justify-center rounded-xl border border-slate-700 bg-white px-4 py-2">
              {logoUrl && logoPreviewAvailable ? (
                <Image
                  src={logoUrl}
                  alt="Logo website THUECAM"
                  width={240}
                  height={80}
                  unoptimized
                  className="max-h-16 w-auto max-w-56 object-contain"
                  onError={() => setLogoPreviewAvailable(false)}
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-700">
                  <Camera className="size-7 text-sky-600" aria-hidden="true" />
                  <span className="font-black">THUECAM.VN</span>
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col items-start gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-200 transition hover:border-sky-500 hover:text-white focus-within:ring-2 focus-within:ring-sky-500">
                <Upload className="size-4" aria-hidden="true" />
                {logoFile ? 'Chọn ảnh khác' : 'Chọn file logo'}
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="sr-only"
                  onChange={(event) => setLogoFile(event.currentTarget.files?.[0] ?? null)}
                />
              </label>
              <p className="text-xs text-slate-400" aria-live="polite">
                {logoFile ? `${logoFile.name} · ${(logoFile.size / (1024 * 1024)).toFixed(2)} MB` : 'Logo sẽ hiển thị thay biểu tượng máy ảnh mặc định.'}
              </p>
              <button
                type="button"
                onClick={() => void handleLogoUpload()}
                disabled={!logoFile || isUploadingLogo}
                aria-busy={isUploadingLogo}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-black text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUploadingLogo ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Upload className="size-4" aria-hidden="true" />}
                {isUploadingLogo ? 'Đang tải logo…' : 'Tải logo lên'}
              </button>
            </div>
          </div>
        </section>

        {/* Physical Showroom & Pickup Address */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-black text-black flex items-center gap-2">
            <MapPin className="size-4 text-sky-400" />
            Địa Điểm Bàn Giao & Nhận Máy Chính Thức
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">
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
          <h2 className="text-sm font-black text-black flex items-center gap-2">
            <Phone className="size-4 text-emerald-400" />
            Hotline & Kênh Liên Hệ
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">Số điện thoại Hotline: *</label>
              <input
                required
                value={settings.hotline}
                onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Số Zalo CSKH: *</label>
              <input
                required
                value={settings.zalo}
                onChange={(e) => setSettings({ ...settings, zalo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white font-bold outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Email liên hệ: *</label>
              <input
                required
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-600 mb-1">Thời gian làm việc: *</label>
              <input
                required
                value={settings.openHours}
                onChange={(e) => setSettings({ ...settings, openHours: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 flex flex-col gap-4" aria-labelledby="manager-contact-heading">
          <h2 id="manager-contact-heading" className="flex items-center gap-2 text-sm font-black text-black">
            <Share2 className="size-4 text-sky-400" /> Người quản lý & liên kết liên hệ
          </h2>
          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
            <label className="flex flex-col gap-1 font-bold text-slate-600">
              Tên người quản lý
              <input value={settings.contactManagerName} onChange={(event) => setSettings({ ...settings, contactManagerName: event.target.value })} placeholder="Quản lý THUECAM" className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-sky-500" />
            </label>
            <label className="flex flex-col gap-1 font-bold text-slate-600">
              Facebook URL
              <input type="url" value={settings.facebookUrl} onChange={(event) => setSettings({ ...settings, facebookUrl: event.target.value })} placeholder="https://facebook.com/..." className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-sky-500" />
            </label>
            <label className="flex flex-col gap-1 font-bold text-slate-600">
              Instagram URL
              <input type="url" value={settings.instagramUrl} onChange={(event) => setSettings({ ...settings, instagramUrl: event.target.value })} placeholder="https://instagram.com/..." className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-sky-500" />
            </label>
            <label className="flex flex-col gap-1 font-bold text-slate-600">
              Số điện thoại WhatsApp
              <input type="tel" inputMode="tel" autoComplete="tel" value={getWhatsappPhone(settings.whatsappUrl)} onChange={(event) => setSettings({ ...settings, whatsappUrl: event.target.value })} placeholder="+84 932 501 411" className="rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-white outline-none focus:border-sky-500" />
            </label>
          </div>
          <p className="text-[11px] text-slate-500">Nhập số WhatsApp kèm mã quốc gia (ví dụ +84), không cần nhập URL. Hotline và Zalo được chỉnh ở mục Hotline & Kênh Liên Hệ phía trên.</p>
        </section>

        {/* Promo Ribbon & Policies */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <h2 className="text-sm font-black text-black flex items-center gap-2">
            <Gift className="size-4 text-amber-400" />
            Nội Dung Banner Khuyến Mãi & Quy Định Cọc
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-600 mb-1">
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
              <label className="block font-bold text-slate-600 mb-1">
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
            disabled={isSaving}
            aria-busy={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black px-6 py-3 text-xs shadow-lg transition disabled:cursor-wait disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <Save className="size-4" />}
            {isSaving ? 'Đang lưu cấu hình…' : 'Lưu Tất Cả Cấu Hình'}
          </button>
        </div>
      </form>
    </div>
  );
}
