import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import CuratedLandingTemplate from '@/components/seo/CuratedLandingTemplate';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê Gimbal Chống Rung DJI RS 4 Máy Ảnh Chính Hãng | THUECAM',
  description:
    'Cho thuê gimbal chống rung máy ảnh DJI RS 4 chịu tải 3kg, khóa trục tự động, cân máy mượt mà. Hỗ trợ cân gimbal miễn phí tại showroom, giá từ 160K/ngày.',
  canonicalPath: '/thue-gimbal',
});

export default async function ThueGimbalPage() {
  const products = await getProducts();
  const gimbalProducts = products.filter((p) => p.id === 'prod-dji-rs-4-gimbal');

  const faq = [
    {
      question: 'Tôi mang máy ảnh đến có được hỗ trợ cân gimbal không?',
      answer:
        'Kỹ thuật viên tại showroom THUECAM sẽ hỗ trợ cân gimbal và cài đặt motor chính xác cho combo máy và lens của bạn hoàn toàn miễn phí.',
    },
  ];

  const relatedLinks = [
    { title: 'Xem thông số gimbal DJI RS 4', href: '/thiet-bi/dji-rs-4-gimbal' },
    { title: 'Xem tất cả thiết bị cho thuê', href: '/thiet-bi' },
  ];

  return (
    <CuratedLandingTemplate
      slug="thue-gimbal"
      badge="Cú Máy Điện Ảnh Mượt Mà"
      h1="Thuê Gimbal Chống Rung Cơ Học 3 Trục Chuyên Nghiệp"
      intro="Ổn định hình ảnh tuyệt đối cho các cảnh quay chuyển động nhanh, chạy bộ hay tracking shot phức tạp với dòng gimbal DJI RS mới nhất."
      products={gimbalProducts}
      faq={faq}
      relatedLinks={relatedLinks}
    />
  );
}
