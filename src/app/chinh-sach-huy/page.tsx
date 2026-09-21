import React from 'react';
import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export const metadata: Metadata = constructMetadata({
  title: 'Chính Sách Hủy Đơn & Hoàn Tiền Thuê Máy | THUECAM',
  description:
    'Quy định hoàn tiền và đổi ngày thuê linh hoạt khi khách hàng thay đổi lịch trình chuyến đi tại THUECAM.',
  canonicalPath: '/chinh-sach-huy',
});

export default function ChinhSachHuyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ name: 'Chính sách hủy', url: '/chinh-sach-huy' }]} />

      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Chính Sách Hủy Đơn & Đổi Ngày Thuê Linh Hoạt
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Hỗ trợ khách hàng tối đa khi có thay đổi kế hoạch chuyến đi
        </p>
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-6">
        <h2 className="text-lg font-bold text-white">1. Hủy đơn trước 24 giờ nhận máy</h2>
        <p>
          - Khách hàng được hoàn lại <strong>100%</strong> số tiền đã thanh toán trước nếu thông báo hủy đơn trước ít nhất 24 giờ so với giờ nhận máy dự kiến.<br />
          - Tiền được chuyển khoản hoàn trả trong vòng 24 giờ làm việc.
        </p>

        <h2 className="text-lg font-bold text-white">2. Hủy đơn trong vòng 24 giờ trước giờ nhận</h2>
        <p>
          - Phí giữ lịch máy: 20% trên tổng giá trị đơn thuê (nhằm bù đắp chi phí giữ máy và từ chối các khách hàng khác).<br />
          - Khách hàng được bảo lưu 100% giá trị đơn để đổi sang thời gian thuê bất kỳ khác trong vòng 6 tháng.
        </p>

        <h2 className="text-lg font-bold text-white">3. Trả máy sớm hơn dự kiến</h2>
        <p>
          - Trường hợp khách hàng hoàn thành chuyến đi và trả máy sớm hơn hợp đồng, THUECAM sẽ tính lại tiền thuê theo đúng số ngày thực tế sử dụng và hoàn lại số tiền dư cho quý khách.
        </p>
      </div>
    </div>
  );
}
