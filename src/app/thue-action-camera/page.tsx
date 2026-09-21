import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import CuratedLandingTemplate from '@/components/seo/CuratedLandingTemplate';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê Action Camera Chống Nước Đi Biển, Phượt | THUECAM',
  description:
    'Cho thuê action camera GoPro Hero 13 Black, Insta360 X4 chống nước 10m, chống rung HyperSmooth 6.0. Tặng kèm ngàm phượt, phao bơi, giá từ 150K/ngày.',
  canonicalPath: '/thue-action-camera',
});

export default async function ThueActionCameraPage() {
  const products = await getProducts();
  const actionProducts = products.filter((p) =>
    ['prod-gopro-hero-13-black', 'prod-insta360-x4'].includes(p.id)
  );

  const faq = [
    {
      question: 'GoPro Hero 13 có cần mua thêm hộp chống nước không?',
      answer:
        'Không cần, thân máy chống nước 10m nguyên khối. Khi thuê tại THUECAM bạn được tặng kèm phao tay cầm giúp máy không bị chìm khi rơi xuống biển.',
    },
  ];

  const relatedLinks = [
    { title: 'Thuê GoPro Hero 13 Black chi tiết', href: '/thiet-bi/gopro-hero-13-black' },
    { title: 'So sánh Insta360 X4 vs GoPro 13', href: '/so-sanh/insta360-x4-vs-gopro-13' },
    { title: 'Thuê camera du lịch (Pillar)', href: '/thue-camera-du-lich' },
  ];

  return (
    <CuratedLandingTemplate
      slug="thue-action-camera"
      badge="Thể Thao & Khám Phá Mạo Hiểm"
      h1="Thuê Action Camera Chống Nước Đi Biển & Phượt"
      intro="Ghi lại mọi khoảnh khắc ngoạn mục dưới biển sâu hay trên những cung đường đèo hiểm trở với độ bền bỉ và chống rung đỉnh cao."
      products={actionProducts}
      faq={faq}
      relatedLinks={relatedLinks}
    />
  );
}
