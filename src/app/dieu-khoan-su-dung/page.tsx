import React from 'react';
import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export const metadata: Metadata = constructMetadata({
  title: 'Điều Khoản Dịch Vụ Cho Thuê Thiết Bị | THUECAM',
  description:
    'Các điều khoản pháp lý và quy định hợp đồng cho thuê thiết bị quay chụp giữa khách hàng và THUECAM.',
  canonicalPath: '/dieu-khoan-su-dung',
});

export default function DieuKhoanSuDungPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ name: 'Điều khoản sử dụng', url: '/dieu-khoan-su-dung' }]} />

      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Điều Khoản Dịch Vụ & Sử Dụng Thiết Bị
        </h1>
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
        <p>
          Bằng việc tạo đơn đặt thuê và nhận thiết bị tại THUECAM, quý khách đồng ý tuân thủ các quy định được nêu rõ trong hợp đồng thuê và các điều khoản pháp luật hiện hành của Nước Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam.
        </p>

        <h2 className="text-lg font-bold text-white">1. Quyền sở hữu thiết bị</h2>
        <p>
          Mọi thiết bị (máy ảnh, camera, ống kính, gimbal, flycam, pin, sạc, thẻ nhớ) bàn giao cho khách hàng thuộc quyền sở hữu hợp pháp của THUECAM. Việc thuê máy chỉ chuyển giao quyền sử dụng tạm thời trong thời hạn hợp đồng. Mọi hành vi cầm cố, bán lại hoặc sang nhượng cho bên thứ ba đều vi phạm pháp luật và sẽ bị truy cứu trách nhiệm hình sự.
        </p>

        <h2 className="text-lg font-bold text-white">2. Bồi thường thiệt hại hư hỏng</h2>
        <p>
          Trường hợp thiết bị bị hư hại do lỗi người sử dụng (rơi vỡ, vô nước đối với dòng máy không chống nước, cháy nổ do dùng nguồn sạc không đạt chuẩn), chi phí bồi thường được căn cứ theo hóa đơn sửa chữa chính hãng từ trung tâm bảo hành của DJI, Sony, GoPro Việt Nam.
        </p>
      </div>
    </div>
  );
}
