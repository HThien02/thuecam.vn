import React from 'react';
import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export const metadata: Metadata = constructMetadata({
  title: 'Chính Sách & Quy Trình Thuê Thiết Bị Tại THUECAM',
  description:
    'Hướng dẫn chi tiết thủ tục, thời gian tính ngày thuê 24h, quyền lợi và nghĩa vụ của khách hàng khi thuê máy ảnh tại THUECAM.',
  canonicalPath: '/chinh-sach-thue',
});

export default function ChinhSachThuePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ name: 'Chính sách thuê', url: '/chinh-sach-thue' }]} />

      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black">
          Chính Sách & Quy Trình Thuê Thiết Bị
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Minh bạch - Rõ ràng - Bảo đảm tối đa quyền lợi khách hàng
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
        <h2 className="text-lg font-bold text-black">1. Quy định về thời gian tính tiền thuê</h2>
        <p>
          - Một ngày thuê được tính trọn vẹn <strong>24 giờ</strong> kể từ thời điểm khách hàng ký biên bản nhận bàn giao thiết bị.<br />
          - Ví dụ: Quý khách nhận máy lúc 10:00 sáng Thứ Sáu, thời gian hoàn trả máy là trước 10:00 sáng Thứ Bảy sẽ được tính đúng 1 ngày thuê.<br />
          - Thời gian quá giờ: Miễn phí trễ 30 phút. Từ phút thứ 31 đến 3 tiếng tính phụ thu 30% giá thuê ngày; trên 3 tiếng tính tròn 1 ngày thuê.
        </p>

        <h2 className="text-lg font-bold text-black">2. Bàn giao và kiểm thử thiết bị</h2>
        <p>
          - Khi nhận máy tại showroom hoặc qua dịch vụ giao nhận hỏa tốc, nhân viên kỹ thuật sẽ cùng khách hàng kiểm tra toàn diện: ngoại quan, thấu kính, màn hình cảm ứng, hoạt động của gimbal và chất lượng âm thanh.<br />
          - Biên bản bàn giao liệt kê đầy đủ số lượng phụ kiện (thẻ nhớ, pin, cáp sạc, ngàm chuyển đổi).
        </p>

        <h2 className="text-lg font-bold text-black">3. Trách nhiệm sử dụng thiết bị</h2>
        <p>
          - Khách hàng có trách nhiệm bảo quản thiết bị đúng hướng dẫn an toàn kỹ thuật.<br />
          - Tuyệt đối không tự ý tháo mở, sửa chữa hoặc can thiệp phần cứng thiết bị.<br />
          - Trong trường hợp xảy ra sự cố bất khả kháng (rơi vỡ, vô nước), khách hàng cần thông báo ngay cho hotline hỗ trợ 0901.234.567 để được hướng dẫn xử lý hạn chế tối đa rủi ro thiệt hại.
        </p>
      </div>
    </div>
  );
}
