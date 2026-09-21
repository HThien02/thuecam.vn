import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import CuratedLandingTemplate from '@/components/seo/CuratedLandingTemplate';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê Flycam DJI Mini 4 Pro Combo 3 Pin Giá Rẻ | THUECAM',
  description:
    'Cho thuê flycam DJI Mini 4 Pro cảm biến vật cản đa hướng 360 độ, tay cầm màn hình RC 2, 3 pin bay 100 phút. An toàn, dễ bay, giá từ 280K/ngày.',
  canonicalPath: '/thue-flycam',
});

export default async function ThueFlycamPage() {
  const products = await getProducts();
  const flycamProducts = products.filter((p) => p.id === 'prod-dji-mini-4-pro');

  const faq = [
    {
      question: 'Chưa từng bay flycam bao giờ có thuê được không?',
      answer:
        'DJI Mini 4 Pro có tính năng cảm biến vật cản đa hướng và tự động quay về điểm xuất phát khi mất sóng hoặc pin yếu, rất an toàn cho người mới bắt đầu.',
    },
  ];

  const relatedLinks = [
    { title: 'Chi tiết flycam DJI Mini 4 Pro', href: '/thiet-bi/dji-mini-4-pro' },
    { title: 'Thuê camera du lịch (Pillar)', href: '/thue-camera-du-lich' },
  ];

  return (
    <CuratedLandingTemplate
      slug="thue-flycam"
      badge="Góc Quay Điện Ảnh Trên Cao"
      h1="Thuê Flycam DJI Mini 4 Pro Cảm Biến Đa Hướng An Toàn"
      intro="Thước phim phong cảnh kỳ vĩ từ trên cao với độ phân giải 4K 60fps HDR, hỗ trợ xoay dọc camera cho video TikTok."
      products={flycamProducts}
      faq={faq}
      relatedLinks={relatedLinks}
    />
  );
}
