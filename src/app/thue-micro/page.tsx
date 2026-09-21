import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import CuratedLandingTemplate from '@/components/seo/CuratedLandingTemplate';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê Micro Cài Áo Không Dây DJI Mic 2 Lọc Ồn AI | THUECAM',
  description:
    'Dịch vụ cho thuê micro không dây DJI Mic 2 ghi âm 32-bit float, chống ồn AI, khoảng cách 250m. Tương thích iPhone, Android và máy ảnh, giá từ 120K/ngày.',
  canonicalPath: '/thue-micro',
});

export default async function ThueMicroPage() {
  const products = await getProducts();
  const micProducts = products.filter((p) => p.id === 'prod-dji-mic-2');

  const faq = [
    {
      question: 'Micro DJI Mic 2 có dùng được cho iPhone 15/16 cổng Type-C không?',
      answer:
        'Hoàn toàn tương thích! Bộ phụ kiện tại THUECAM có sẵn đầu cắm Type-C và Lightning chuẩn MFi, cắm là nhận ngay không cần cài app.',
    },
  ];

  const relatedLinks = [
    { title: 'Xem chi tiết micro DJI Mic 2', href: '/thiet-bi/dji-mic-2' },
    { title: 'Thuê camera quay vlog trọn bộ', href: '/thue-camera-vlog' },
    { title: 'Thuê camera quay TikTok', href: '/thue-camera-tiktok' },
  ];

  return (
    <CuratedLandingTemplate
      slug="thue-micro"
      badge="Âm Thanh Chuẩn Studio"
      h1="Thuê Micro Cài Áo Không Dây Khử Ồn Đỉnh Cao"
      intro="Nâng tầm chất lượng video với âm thanh rõ nét, ghi âm 32-bit float không bao giờ lo vỡ tiếng ngay cả khi tiếng hét lớn."
      products={micProducts}
      faq={faq}
      relatedLinks={relatedLinks}
    />
  );
}
