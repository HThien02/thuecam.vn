import React from 'react';
import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { ShieldCheck, MapPin, Award, Users, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'Giới Thiệu Về THUECAM | Nền Tảng Cho Thuê Thiết Bị Quay Phim Uy Tín',
  description:
    'Tìm hiểu về THUECAM - đơn vị tiên phong cung cấp giải pháp cho thuê máy ảnh, action cam, flycam và thiết bị sáng tạo nội dung hàng đầu tại TP.HCM & Hà Nội.',
  canonicalPath: '/gioi-thieu',
});

export default function GioiThieuPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <Breadcrumbs items={[{ name: 'Giới thiệu', url: '/gioi-thieu' }]} />

      <div className="border-b border-white/10 pb-6 space-y-3">
        <span className="badge-verified">Về Chúng Tôi</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
          THUECAM - Đồng Hành Cùng Mọi Chuyến Đi & Thước Phim Sáng Tạo
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Được thành lập với mục tiêu mang lại giải pháp tiếp cận các thiết bị công nghệ quay phim mới nhất với chi phí tối ưu nhất cho người Việt.
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
        <h2 className="text-xl font-bold text-black">1. Sứ mệnh của THUECAM</h2>
        <p>
          Trong kỷ nguyên bùng nổ của nội dung số (TikTok, YouTube, Reels), mỗi chuyến du lịch hay dự án sáng tạo đều xứng đáng có những thước phim sắc nét chuẩn điện ảnh. Thay vì phải đầu tư hàng chục triệu đồng để mua máy rồi để tủ, khách hàng của THUECAM có thể trải nghiệm các thiết bị công nghệ đỉnh cao (DJI Pocket 4, GoPro 13, Insta360 X4, Sony FX3) chỉ từ 100.000đ/ngày.
        </p>

        <h2 className="text-xl font-bold text-black">2. Cam kết chất lượng thiết bị</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose my-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-sm">100% Thiết Bị Chính Hãng</h3>
            <p className="text-xs text-slate-400">
              Nhập khẩu chính ngạch từ DJI, Sony, GoPro, Insta360 với đầy đủ linh kiện chuẩn zin.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Quy Trình Kiểm Tra 5 Bước</h3>
            <p className="text-xs text-slate-400">
              Kiểm tra cảm biến, chống rung gimbal, dung lượng pin, mic lọc âm và cập nhật firmware trước khi bàn giao.
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-black">3. Hệ thống Showroom thực tế</h2>
        <p>
          Chúng tôi có văn phòng và showroom hoạt động thực tế tại trung tâm 2 thành phố lớn:
        </p>
        <ul>
          <li><strong>TP. Hồ Chí Minh:</strong> 123 Nguyễn Thị Minh Khai, P. Bến Thành, Quận 1 (Hotline: 0901.234.567)</li>
          <li><strong>Hà Nội:</strong> 45 Phố Giảng Võ, P. Cát Linh, Quận Đống Đa (Hotline: 0902.345.678)</li>
        </ul>
      </div>
    </div>
  );
}
