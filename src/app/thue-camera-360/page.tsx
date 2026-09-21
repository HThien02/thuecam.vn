import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import CuratedLandingTemplate from '@/components/seo/CuratedLandingTemplate';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê Camera 360 Độ Insta360 X4 8K Không Góc Chết | THUECAM',
  description:
    'Dịch vụ thuê camera 360 Insta360 X4 quay phim 8K, gậy selfie tàng hình, góc nhìn flycam giả lập. Kèm 2 pin, thẻ tốc độ cao, giá từ 180K/ngày.',
  canonicalPath: '/thue-camera-360',
});

export default async function ThueCamera360Page() {
  const products = await getProducts();
  const c360Products = products.filter((p) => p.id === 'prod-insta360-x4');

  const faq = [
    {
      question: 'Gậy selfie tàng hình hoạt động như thế nào?',
      answer:
        'Nhờ thuật toán ghép hình hai thấu kính siêu rộng 180 độ đối xứng, gậy selfie nằm trọn trong điểm mù và biến mất hoàn toàn trong video thành phẩm.',
    },
  ];

  const relatedLinks = [
    { title: 'Xem chi tiết Insta360 X4 8K', href: '/thiet-bi/insta360-x4' },
    { title: 'Thuê camera du lịch (Pillar)', href: '/thue-camera-du-lich' },
    { title: 'Thuê Action Camera', href: '/thue-action-camera' },
  ];

  return (
    <CuratedLandingTemplate
      slug="thue-camera-360"
      badge="Góc Nhìn Không Giới Hạn"
      h1="Thuê Camera 360 Độ Quay Video 8K Đỉnh Cao"
      intro="Quay trước chọn góc sau - không bao giờ bỏ lỡ bất kỳ khoảnh khắc đắt giá nào với công nghệ ghi hình 360 độ thế hệ mới nhất."
      products={c360Products}
      faq={faq}
      relatedLinks={relatedLinks}
    />
  );
}
