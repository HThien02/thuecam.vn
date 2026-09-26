import React from 'react';
import Link from 'next/link';
import { Camera, MapPin, Phone, Mail, Clock, ShieldCheck, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <>
      <footer className="bg-gradient-to-b from-white to-[#f0f8ff] border-t border-sky-100/80 pt-16 pb-12 text-slate-600 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-sky-100">
            {/* Col 1: Brand & Verified Business */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-candy flex items-center justify-center shadow-cute">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xl font-black text-slate-900 tracking-tight block leading-none">
                    THUECAM<span className="text-[#0284c7]">.VN</span>
                  </span>
                  <span className="text-[11px] font-bold text-[#0284c7]">Thuê máy xịn - Chụp chill hết ý! 📸✨</span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-xs max-w-md">
                Hệ thống cho thuê máy ảnh du lịch, action cam, DJI Pocket 4, flycam và micro thu âm chính hãng chuẩn 99%. Luôn kèm thẻ nhớ tốc độ cao và hỗ trợ hướng dẫn 1-1 cực kỳ tận tâm.
              </p>

              <div className="space-y-2 pt-2 text-xs text-slate-700">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-slate-900">Điểm nhận máy TP.HCM:</strong> ETown, 364 Cộng Hòa, P. 13, Q. Tân Bình, TP.HCM
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Hotline / Zalo: <strong className="text-[#0284c7]">0932.501.411</strong> (08:00 - 22:00 hàng ngày)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Email: contact@thuecam.vn</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#0284c7] shrink-0" />
                  <span>Mở cửa: 08:00 - 22:00 (Cả Thứ 7, Chủ Nhật & Ngày Lễ)</span>
                </div>
              </div>
            </div>

            {/* Col 2: Curated SEO Pages */}
            <div className="space-y-3">
              <p className="font-extrabold text-slate-900 uppercase tracking-wider text-xs text-sky-800">
                Dịch Vụ Thuê Hot 🔥
              </p>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <Link href="/thue-camera" className="hover:text-[#0284c7] transition-colors">
                    Thuê Camera Toàn Quốc
                  </Link>
                </li>
                <li>
                  <Link href="/thue-camera-du-lich" className="hover:text-[#0284c7] transition-colors font-bold text-[#0284c7] flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Thuê Camera Du Lịch (Pillar)
                  </Link>
                </li>
                <li>
                  <Link href="/thue-camera-vlog" className="hover:text-[#0284c7] transition-colors">
                    Thuê Máy Quay Vlog
                  </Link>
                </li>
                <li>
                  <Link href="/thue-camera-tiktok" className="hover:text-[#0284c7] transition-colors">
                    Thuê Camera Quay TikTok
                  </Link>
                </li>
                <li>
                  <Link href="/thue-action-camera" className="hover:text-[#0284c7] transition-colors">
                    Thuê Action Cam Đi Biển
                  </Link>
                </li>
                <li>
                  <Link href="/thue-camera-360" className="hover:text-[#0284c7] transition-colors">
                    Thuê Camera 360 Độ 8K
                  </Link>
                </li>
                <li>
                  <Link href="/thue-flycam" className="hover:text-[#0284c7] transition-colors">
                    Thuê Flycam Chống Va Chạm
                  </Link>
                </li>
                <li>
                  <Link href="/thue-micro" className="hover:text-[#0284c7] transition-colors">
                    Thuê Micro Thu Âm Không Dây
                  </Link>
                </li>
                <li>
                  <Link href="/thue-gimbal" className="hover:text-[#0284c7] transition-colors">
                    Thuê Gimbal Chống Rung
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Danh mục & Thiết bị */}
            <div className="space-y-3">
              <p className="font-extrabold text-slate-900 uppercase tracking-wider text-xs text-sky-800">
                Thiết Bị Nổi Bật 📸
              </p>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <Link href="/thiet-bi/dji-pocket-4-creator" className="hover:text-[#0284c7] transition-colors">
                    DJI Pocket 4 Creator
                  </Link>
                </li>
                <li>
                  <Link href="/thiet-bi/dji-pocket-3-creator" className="hover:text-[#0284c7] transition-colors">
                    DJI Pocket 3 Creator
                  </Link>
                </li>
                <li>
                  <Link href="/thiet-bi/gopro-hero-13-black" className="hover:text-[#0284c7] transition-colors">
                    GoPro Hero 13 Black
                  </Link>
                </li>
                <li>
                  <Link href="/thiet-bi/insta360-x4" className="hover:text-[#0284c7] transition-colors">
                    Insta360 X4 8K
                  </Link>
                </li>
                <li>
                  <Link href="/thiet-bi/dji-mini-4-pro" className="hover:text-[#0284c7] transition-colors">
                    DJI Mini 4 Pro Flycam
                  </Link>
                </li>
                <li>
                  <Link href="/thiet-bi/dji-mic-2" className="hover:text-[#0284c7] transition-colors">
                    Micro DJI Mic 2
                  </Link>
                </li>
                <li>
                  <Link href="/thiet-bi/dji-rs-4-gimbal" className="hover:text-[#0284c7] transition-colors">
                    Gimbal DJI RS 4
                  </Link>
                </li>
                <li>
                  <Link href="/so-sanh/dji-pocket-4-vs-pocket-3" className="hover:text-[#0284c7] transition-colors text-[#0284c7] font-bold">
                    So Sánh Pocket 4 vs Pocket 3
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Trust & Policies */}
            <div className="space-y-3">
              <p className="font-extrabold text-slate-900 uppercase tracking-wider text-xs text-sky-800">
                Chính Sách An Tâm 🛡️
              </p>
              <ul className="space-y-2 text-xs font-medium">
                <li>
                  <Link href="/gioi-thieu" className="hover:text-[#0284c7] transition-colors">
                    Về Chúng Tôi (THUECAM)
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach-thue" className="hover:text-[#0284c7] transition-colors">
                    Quy Trình & Thủ Tục Thuê
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach-dat-coc" className="hover:text-[#0284c7] transition-colors">
                    Chính Sách Cọc Linh Hoạt (CCCD)
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach-huy" className="hover:text-[#0284c7] transition-colors">
                    Chính Sách Hủy Đơn & Hoàn Tiền
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach-bao-mat" className="hover:text-[#0284c7] transition-colors">
                    Chính Sách Bảo Mật Dữ Liệu
                  </Link>
                </li>
                <li>
                  <Link href="/dieu-khoan-su-dung" className="hover:text-[#0284c7] transition-colors">
                    Điều Khoản Sử Dụng Dịch Vụ
                  </Link>
                </li>
                <li>
                  <Link href="/lien-he" className="hover:text-[#0284c7] transition-colors">
                    Liên Hệ & Bản Đồ ETown
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>© {new Date().getFullYear()} THUECAM.VN - Dịch vụ cho thuê camera & thiết bị sáng tạo nội dung hàng đầu. Điểm hẹn ETown Tân Bình, TP.HCM.</span>
            </div>
            <div className="flex items-center gap-4 text-slate-500 font-medium">
              <span className="text-[#0284c7] font-bold">Canonical: https://thuecam.vn</span>

            </div>
          </div>
        </div>
      </footer>
      <Link href="/admin" aria-label="Khu vực quản trị" className="sr-only">Khu vực quản trị</Link>
    </>
  );
}
