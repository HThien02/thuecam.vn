'use client';

import React, { useState } from 'react';
import { saveAdminRecord } from '@/lib/data/admin-api';
import { SeoSettings, Product } from '@/types';
import {
  Search,
  Smartphone,
  Monitor,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  Save,
  Globe,
  Share2,
  ExternalLink,
} from 'lucide-react';

interface Props {
  initialSettings: SeoSettings;
  products: Product[];
}

export default function SeoManagerClient({
  initialSettings,
  products,
}: Props) {
  const [selectedTarget, setSelectedTarget] = useState<string>('GLOBAL');
  const [serpViewMode, setSerpViewMode] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');

  // Working state
  const [seoTitle, setSeoTitle] = useState(initialSettings.site_title);
  const [seoDescription, setSeoDescription] = useState(initialSettings.site_description);
  const [canonicalUrl, setCanonicalUrl] = useState('https://thuecam.vn');
  const [ogImage, setOgImage] = useState(initialSettings.default_og_image);
  const [indexable, setIndexable] = useState(true);

  // Safety safeguard state for site-wide noindex
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [safetyConfirmationText, setSafetyConfirmationText] = useState('');
  const [globalNoindex, setGlobalNoindex] = useState(initialSettings.global_noindex_enabled);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Handle target switch (Global vs specific products)
  const handleSelectTarget = (target: string) => {
    setSelectedTarget(target);
    if (target === 'GLOBAL') {
      setSeoTitle(initialSettings.site_title);
      setSeoDescription(initialSettings.site_description);
      setCanonicalUrl('https://thuecam.vn');
      setOgImage(initialSettings.default_og_image);
      setIndexable(true);
    } else {
      const prod = products.find((p) => p.slug === target);
      if (prod) {
        setSeoTitle(prod.seo_title || `Thuê ${prod.name} Chính Hãng | Giá từ 200K/ngày | THUECAM`);
        setSeoDescription(
          prod.seo_description ||
            `Thuê ${prod.name} với giá từ 200.000đ/ngày. Kiểm tra lịch trống, đặt thuê online và thanh toán nhanh tại THUECAM.`
        );
        setCanonicalUrl(`https://thuecam.vn/thiet-bi/${prod.slug}`);
        setOgImage(prod.og_image || prod.primary_image);
        setIndexable(prod.indexable);
      }
    }
  };

  // Character calculations
  const titleLen = seoTitle.length;
  const descLen = seoDescription.length;

  const isTitleOptimal = titleLen >= 45 && titleLen <= 65;
  const isDescOptimal = descLen >= 140 && descLen <= 165;

  const handleToggleGlobalNoindex = () => {
    if (!globalNoindex) {
      // Trying to enable site-wide noindex -> REQUIRE STRICT CONFIRMATION
      setIsSafetyModalOpen(true);
    } else {
      // Re-enabling indexing is safe
      setGlobalNoindex(false);
    }
  };

  const handleConfirmNoindex = () => {
    if (safetyConfirmationText.trim().toUpperCase() === 'CHẶN CHỈ MỤC') {
      setGlobalNoindex(true);
      setIsSafetyModalOpen(false);
      setSafetyConfirmationText('');
    } else {
      alert('Vui lòng nhập đúng cụm từ "CHẶN CHỈ MỤC" để xác nhận.');
    }
  };

  const handleSave = async () => {
    setSaveError('');
    try {
      if (selectedTarget === 'GLOBAL') {
        await saveAdminRecord('seo_settings', {
          id: initialSettings.id,
          site_title: seoTitle.trim(),
          site_description: seoDescription.trim(),
          default_og_image: ogImage.trim(),
          global_noindex_enabled: globalNoindex,
        }, 'update');
      } else {
        const product = products.find((item) => item.slug === selectedTarget);
        if (!product) throw new Error('Không tìm thấy thiết bị cần cập nhật.');
        if (!canonicalUrl.startsWith('https://thuecam.vn/')) {
          throw new Error('Canonical URL cần dùng domain https://thuecam.vn.');
        }
        await saveAdminRecord('products', {
          id: product.id,
          seo_title: seoTitle.trim(),
          seo_description: seoDescription.trim(),
          canonical_url: canonicalUrl.trim(),
          og_image: ogImage.trim(),
          indexable,
        }, 'update');
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Không thể lưu thay đổi SEO.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Target Selector Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-300">Đang chỉnh sửa SEO cho:</span>
          <select
            value={selectedTarget}
            onChange={(e) => handleSelectTarget(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="GLOBAL">Toàn trang web (Global SEO Defaults)</option>
            <option disabled>─── Trang Chi Tiết Thiết Bị ───</option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                Thiết bị: {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {saveError && <span role="alert" className="text-xs text-rose-400">{saveError}</span>}
          {saveSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Đã lưu cấu hình SEO thành công!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <Save className="w-4 h-4" />
            <span>Lưu Thay Đổi SEO</span>
          </button>
        </div>
      </div>

      {/* Global Noindex Safeguard Warning Banner */}
      {selectedTarget === 'GLOBAL' && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-colors ${
            globalNoindex
              ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
              : 'bg-slate-900/40 border-slate-800 text-slate-300'
          }`}
        >
          <div className="flex items-center gap-3 text-xs">
            <ShieldAlert
              className={`w-5 h-5 ${globalNoindex ? 'text-rose-400' : 'text-emerald-400'}`}
            />
            <div>
              <span className="font-bold block">
                {globalNoindex
                  ? 'CẢNH BÁO: WEBSITE ĐANG Ở CHẾ ĐỘ NOINDEX TOÀN BỘ'
                  : 'Trạng thái chỉ mục toàn site: BÌNH THƯỜNG (Google được phép index)'}
              </span>
              <span className="text-[11px] text-slate-400">
                {globalNoindex
                  ? 'Tất cả các trang công khai đang bị chặn không cho Google index!'
                  : 'Hệ thống bảo vệ đang ngăn chặn thao tác vô tình tắt index toàn trang.'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleGlobalNoindex}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              globalNoindex
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {globalNoindex ? 'Bật Lại Index Toàn Site' : 'Tắt Index Toàn Site (Cần Xác Nhận)'}
          </button>
        </div>
      )}

      {/* Grid: Editor Left & SERP Simulator Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Fields with Character Counters */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-5">
            <h2 className="text-base font-bold text-white">Thẻ Thẩm Quyền Tìm Kiếm</h2>

            {/* SEO Title Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-300">SEO Title (Tiêu Đề Trang):</label>
                <span
                  className={`font-mono font-bold ${
                    isTitleOptimal ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {titleLen} / 60 ký tự ({isTitleOptimal ? 'Chuẩn SEO' : 'Nên trong khoảng 50-60'})
                </span>
              </div>
              <input
                type="text"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Meta Description Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label className="font-semibold text-slate-300">Meta Description (Mô Tả):</label>
                <span
                  className={`font-mono font-bold ${
                    isDescOptimal ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {descLen} / 160 ký tự ({isDescOptimal ? 'Chuẩn SEO' : 'Nên trong khoảng 150-160'})
                </span>
              </div>
              <textarea
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Canonical URL Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Canonical URL (Bắt buộc dùng domain https://thuecam.vn):
              </label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
              <span className="text-[11px] text-slate-500 block">
                Không được dùng localhost hoặc domain preview vercel.app làm canonical.
              </span>
            </div>

            {/* OG Image */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                OpenGraph Image URL (Chia sẻ Facebook & Zalo):
              </label>
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Indexable Toggle for specific page */}
            {selectedTarget !== 'GLOBAL' && (
              <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
                <div>
                  <span className="font-semibold text-white block">Trạng thái Google Index trang này:</span>
                  <span className="text-[11px] text-slate-400">
                    Bật để thêm trang vào sitemap.xml và cho phép bot tìm kiếm.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIndexable(!indexable)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    indexable
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {indexable ? 'INDEX, FOLLOW' : 'NOINDEX, FOLLOW'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Real-time Google SERP Simulator */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Mô Phỏng Google SERP Kết Quả Tìm Kiếm
                </h3>
              </div>

              {/* View Switcher: Desktop vs Mobile */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setSerpViewMode('DESKTOP')}
                  className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                    serpViewMode === 'DESKTOP'
                      ? 'bg-slate-800 text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Xem dạng máy tính Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSerpViewMode('MOBILE')}
                  className={`p-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                    serpViewMode === 'MOBILE'
                      ? 'bg-slate-800 text-cyan-400 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Xem dạng điện thoại Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mobile</span>
                </button>
              </div>
            </div>

            {/* Google Snippet Simulation Box */}
            <div
              className={`p-5 rounded-2xl bg-[#202124] text-[#bdc1c6] font-sans transition-all border border-slate-700 shadow-xl ${
                serpViewMode === 'MOBILE' ? 'max-w-sm mx-auto' : 'w-full'
              }`}
            >
              {/* URL & Breadcrumb snippet */}
              <div className="flex items-center gap-2 mb-1.5 text-xs text-[#dadce0]">
                <div className="w-5 h-5 rounded-full bg-[#303134] flex items-center justify-center text-[10px] font-bold text-cyan-400">
                  T
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-[12px] font-medium text-white">THUECAM.VN</span>
                  <span className="text-[11px] text-[#9aa0a6] truncate font-mono">
                    {canonicalUrl.replace('https://', '')}
                  </span>
                </div>
              </div>

              {/* Title Snippet */}
              <h4 className="text-[#8ab4f8] text-base sm:text-lg hover:underline cursor-pointer font-medium leading-snug break-words">
                {seoTitle || 'Tiêu đề trang chưa được thiết lập'}
              </h4>

              {/* Description Snippet */}
              <p className="text-[#bdc1c6] text-xs sm:text-sm mt-1.5 leading-relaxed line-clamp-3">
                {seoDescription || 'Mô tả meta description giúp khách hàng hiểu rõ nội dung khi tìm kiếm trên Google.'}
              </p>

              {/* Schema Badges Preview */}
              <div className="mt-3 pt-2 border-t border-[#3c4043] flex items-center gap-2 text-[11px] text-[#9aa0a6]">
                <span className="text-[#81c995]">★ 4.9 (28 đánh giá)</span>
                <span>•</span>
                <span>Giá từ 200.000đ/ngày</span>
                <span>•</span>
                <span>Còn máy sẵn</span>
              </div>
            </div>

            {/* Social Share Preview (Facebook / Zalo card) */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                Mô Phỏng Thẻ Chia Sẻ Mạng Xã Hội (OpenGraph):
              </span>
              <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 text-xs">
                {ogImage && (
                  <div className="relative aspect-[1.91/1] w-full bg-slate-900">
                    <img src={ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-3 space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block">
                    THUECAM.VN
                  </span>
                  <span className="font-bold text-white block truncate">{seoTitle}</span>
                  <span className="text-slate-400 block line-clamp-2">{seoDescription}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SAFETY CONFIRMATION MODAL (Prevents Accidental Site-Wide Noindex) */}
      {isSafetyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-rose-500/50 p-6 space-y-5 shadow-2xl text-slate-200">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-8 h-8 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white">Xác Nhận Chặn Chỉ Mục Toàn Bộ</h3>
                <span className="text-xs">Hành động này có tác động nghiêm trọng đến SEO</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Nếu bạn bật chế độ này, thẻ <code>noindex</code> sẽ được kích hoạt trên <strong>toàn bộ trang web</strong>. Google và các công cụ tìm kiếm sẽ gỡ bỏ website khỏi kết quả tìm kiếm!
            </p>

            <div className="space-y-2 text-xs">
              <label className="block text-slate-300 font-semibold">
                Để tiếp tục, vui lòng nhập chính xác cụm từ <span className="text-rose-400 font-bold">CHẶN CHỈ MỤC</span> vào ô bên dưới:
              </label>
              <input
                type="text"
                value={safetyConfirmationText}
                onChange={(e) => setSafetyConfirmationText(e.target.value)}
                placeholder="CHẶN CHỈ MỤC"
                className="w-full bg-slate-950 border border-rose-500/50 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-rose-400"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSafetyModalOpen(false);
                  setSafetyConfirmationText('');
                }}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Hủy Bỏ (Khuyên dùng)
              </button>
              <button
                type="button"
                onClick={handleConfirmNoindex}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg"
              >
                Xác Nhận Tắt Index
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
