import React from 'react';
import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ContactFormClient from '@/components/contact/ContactFormClient';
import { MapPin, Phone, Mail, Clock, MessageSquare, ShieldCheck, Send } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'Liên Hệ & Địa Chỉ Showroom THUECAM Tại TP.HCM & Hà Nội',
  description:
    'Thông tin liên hệ, hotline hỗ trợ kỹ thuật 24/7 và địa chỉ showroom thực tế của THUECAM tại Quận 1 (TP.HCM) và Đống Đa (Hà Nội).',
  canonicalPath: '/lien-he',
});

export default function LienHePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ name: 'Liên hệ', url: '/lien-he' }]} />

      <div className="border-b border-white/10 pb-6 space-y-2">
        <span className="badge-verified">Hỗ Trợ Khách Hàng 24/7</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Liên Hệ Hệ Thống Cho Thuê Thiết Bị THUECAM
        </h1>
        <p className="text-sm text-slate-400">
          Hãy liên hệ với chúng tôi bất cứ khi nào bạn cần tư vấn chọn máy hoặc hỗ trợ kỹ thuật.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Showroom physical locations */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Chi Nhánh TP. Hồ Chí Minh
            </h2>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>Địa chỉ:</strong> ETown Cộng Hòa, 364 Cộng Hòa, Phường 13, Quận Tân Bình, TP.HCM</p>
              <p><strong>Hotline / Zalo:</strong> <span className="text-cyan-400 font-bold">0932.501.411</span></p>
              <p><strong>Email:</strong> hcm@thuecam.vn</p>
              <p><strong>Giờ mở cửa:</strong> 08:00 - 21:30 (Thứ 2 - Chủ Nhật)</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-cyan-400" />
              Chi Nhánh Hà Nội
            </h2>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong>Địa chỉ:</strong> 45 Phố Giảng Võ, Phường Cát Linh, Quận Đống Đa, Hà Nội</p>
              <p><strong>Hotline / Zalo:</strong> <span className="text-cyan-400 font-bold">0902.345.678</span></p>
              <p><strong>Email:</strong> hanoi@thuecam.vn</p>
              <p><strong>Giờ mở cửa:</strong> 08:00 - 21:30 (Thứ 2 - Chủ Nhật)</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>Showroom mở cửa đón khách test máy và nhận bàn giao trực tiếp tất cả các ngày trong tuần.</span>
          </div>
        </div>

        {/* Right: Quick contact / inquiry form */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-cyan-400" />
            Gửi Yêu Cầu Tư Vấn Thiết Bị
          </h2>
          <ContactFormClient />
        </div>
      </div>
    </div>
  );
}
