import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import CuratedLandingTemplate from '@/components/seo/CuratedLandingTemplate';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê Camera Toàn Quốc Giá Rẻ | Máy Ảnh, Pocket, Action Cam | THUECAM',
  description:
    'Dịch vụ cho thuê camera chuyên nghiệp: máy ảnh mirrorless, camera bỏ túi, action cam, gimbal, flycam. Thủ tục nhanh chóng, giá thuê từ 100K/ngày.',
  canonicalPath: '/thue-camera',
});

export default async function ThueCameraPage() {
  const products = await getProducts();

  const faq = [
    {
      question: 'Thời gian thuê tối thiểu tại THUECAM là bao lâu?',
      answer:
        'Thời gian thuê tối thiểu là 1 ngày (24 tiếng tính từ lúc bạn nhận máy). THUECAM áp dụng chính sách giảm giá lũy tiến từ ngày thứ 3 trở đi.',
    },
    {
      question: 'Tôi có thể thuê máy ở TP.HCM và trả máy tại Hà Nội không?',
      answer:
        'Hoàn toàn được! THUECAM hỗ trợ nhận máy và trả máy linh hoạt tại 2 showroom chính ở Quận 1 (TP.HCM) và Đống Đa (Hà Nội).',
    },
  ];

  const relatedLinks = [
    { title: 'Thuê camera du lịch gọn nhẹ', href: '/thue-camera-du-lich' },
    { title: 'Thuê camera quay Vlog bỏ túi', href: '/thue-camera-vlog' },
    { title: 'Thuê camera quay TikTok dọc', href: '/thue-camera-tiktok' },
    { title: 'Chi nhánh Showroom TP.HCM', href: '/dia-diem/tphcm' },
    { title: 'Chi nhánh Showroom Hà Nội', href: '/dia-diem/ha-noi' },
  ];

  return (
    <CuratedLandingTemplate
      slug="thue-camera"
      badge="Dịch Vụ Cho Thuê Uy Tín"
      h1="Dịch Vụ Cho Thuê Camera & Thiết Bị Quay Phim Toàn Diện"
      intro="THUECAM cung cấp giải pháp cho thuê camera chính hãng từ các thương hiệu hàng đầu DJI, Sony, GoPro, Insta360. Sẵn máy phục vụ cá nhân, doanh nghiệp và các đoàn quay sự kiện."
      products={products.slice(0, 6)}
      faq={faq}
      relatedLinks={relatedLinks}
    />
  );
}
