import React from 'react';
import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export const metadata: Metadata = constructMetadata({
  title: 'Chính Sách Đặt Cọc & Giấy Tờ Thuê Máy | THUECAM',
  description:
    'Các hình thức đặt cọc linh hoạt tại THUECAM: giữ CCCD gắn chip chính chủ hoặc đặt cọc tiền mặt hoàn lại ngay khi trả máy.',
  canonicalPath: '/chinh-sach-dat-coc',
});

export default function ChinhSachDatCocPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ name: 'Chính sách đặt cọc', url: '/chinh-sach-dat-coc' }]} />

      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black">
          Chính Sách Đặt Cọc & Hồ Sơ Thuê Thiết Bị
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Lựa chọn phương thức thuận tiện nhất cho khách hàng
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
        <h2 className="text-lg font-bold text-black">1. Hình thức 1: Giữ Căn cước công dân (CCCD)</h2>
        <p>
          - Áp dụng cho khách hàng có CCCD gắn chip chính chủ còn hiệu lực.<br />
          - Khách hàng ký hợp đồng thuê máy và gửi lại bản gốc CCCD gắn chip tại quầy giao dịch.<br />
          - Với hình thức này, quý khách được miễn giảm từ 70% đến 100% tiền mặt đặt cọc tùy theo giá trị máy.
        </p>

        <h2 className="text-lg font-bold text-black">2. Hình thức 2: Đặt cọc tiền mặt hoặc chuyển khoản</h2>
        <p>
          - Dành cho khách hàng cần giữ lại giấy tờ tùy thân để đi máy bay hoặc làm thủ tục khách sạn.<br />
          - Số tiền đặt cọc tương đương mức được niêm yết rõ ràng trên trang chi tiết sản phẩm (ví dụ: DJI Pocket 4 cọc 3.000.000đ).<br />
          - <strong>Hoàn cọc tức thì:</strong> Tiền cọc được hoàn trả 100% bằng chuyển khoản ngân hàng ngay trong vòng 5 phút sau khi kỹ thuật viên kiểm tra máy khi hoàn trả.
        </p>
      </div>
    </div>
  );
}
