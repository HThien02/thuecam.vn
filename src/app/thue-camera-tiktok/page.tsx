import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import CuratedLandingTemplate from '@/components/seo/CuratedLandingTemplate';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê Camera Quay TikTok, Reels Dọc 4K Chuẩn Màu | THUECAM',
  description:
    'Dịch vụ cho thuê camera quay video ngắn TikTok, Shorts 9:16 sắc nét: DJI Pocket 4, Pocket 3, flycam Mini 4 Pro quay dọc nguyên bản, giá từ 180K/ngày.',
  canonicalPath: '/thue-camera-tiktok',
});

export default async function ThueCameraTiktokPage() {
  const products = await getProducts();
  const tiktokProducts = products.filter((p) =>
    ['prod-dji-pocket-4-creator', 'prod-dji-pocket-3-creator', 'prod-dji-mini-4-pro', 'prod-dji-mic-2'].includes(p.id)
  );

  const faq = [
    {
      question: 'Quay video dọc có bị crop giảm độ phân giải không?',
      answer:
        'Hoàn toàn không. Cả DJI Pocket 4 và DJI Mini 4 Pro đều hỗ trợ xoay cơ học cảm biến sang khung hình dọc 9:16 giữ nguyên độ phân giải 4K HDR.',
    },
  ];

  const relatedLinks = [
    { title: 'Thuê camera quay Vlog bỏ túi', href: '/thue-camera-vlog' },
    { title: 'Thuê micro thu âm DJI Mic 2', href: '/thue-micro' },
    { title: 'Pillar: Cẩm nang camera du lịch', href: '/thue-camera-du-lich' },
  ];

  return (
    <CuratedLandingTemplate
      slug="thue-camera-tiktok"
      badge="Xu Hướng Video Ngắn 9:16"
      h1="Thuê Camera Quay Video TikTok & Reels Chuẩn Đẹp"
      intro="Tạo ra những video triệu view với hình ảnh sắc nét, tông màu da trắng hồng nịnh mắt và âm thanh thu âm không lẫn tạp âm môi trường."
      products={tiktokProducts}
      faq={faq}
      relatedLinks={relatedLinks}
    />
  );
}
