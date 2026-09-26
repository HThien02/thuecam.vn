import React from 'react';
import type { Metadata } from 'next';
import { constructMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export const metadata: Metadata = constructMetadata({
  title: 'Chính Sách Bảo Mật Thông Tin Khách Hàng | THUECAM',
  description:
    'Cam kết bảo mật dữ liệu cá nhân, thông tin liên hệ và hình ảnh lưu trữ trên thẻ nhớ thiết bị của khách hàng tại THUECAM.',
  canonicalPath: '/chinh-sach-bao-mat',
});

export default function ChinhSachBaoMatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ name: 'Chính sách bảo mật', url: '/chinh-sach-bao-mat' }]} />

      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black">
          Chính Sách Bảo Mật Dữ Liệu & Thông Tin
        </h1>
      </div>

      <div className="prose prose-invert max-w-none text-slate-600 text-sm leading-relaxed space-y-6">
        <h2 className="text-lg font-bold text-black">1. Cam kết định dạng (format) thẻ nhớ an toàn</h2>
        <p>
          - Ngay khi khách hàng bàn giao hoàn trả máy và thẻ nhớ, kỹ thuật viên THUECAM sẽ nhắc nhở quý khách sao chép dữ liệu video/ảnh về máy tính cá nhân hoặc điện thoại.<br />
          - Sau đó, thẻ nhớ sẽ được tiến hành <strong>Format toàn diện</strong> tại chỗ trước sự chứng kiến của khách hàng để bảo đảm 100% hình ảnh riêng tư không bị lưu trữ lại.
        </p>

        <h2 className="text-lg font-bold text-black">2. Bảo vệ thông tin cá nhân</h2>
        <p>
          - Mọi thông tin họ tên, số điện thoại, địa chỉ và CCCD của khách hàng chỉ được sử dụng cho mục đích lập hợp đồng thuê thiết bị và đối soát bảo hành.<br />
          - Cam kết không chia sẻ, bán hoặc cung cấp cho bất kỳ bên thứ ba nào vì mục đích quảng cáo rác.
        </p>
      </div>
    </div>
  );
}
