import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import CuratedLandingTemplate from '@/components/seo/CuratedLandingTemplate';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê Camera Quay Vlog Bỏ Túi, Chống Rung Đẹp | THUECAM',
  description:
    'Cho thuê combo camera quay vlog chuyên nghiệp: DJI Pocket 4, Pocket 3 Creator, Sony. Âm thanh trong trẻo, lấy nét khuôn mặt thần tốc, giá từ 180K/ngày.',
  canonicalPath: '/thue-camera-vlog',
});

export default async function ThueCameraVlogPage() {
  const products = await getProducts();
  const vlogProducts = products.filter((p) =>
    ['prod-dji-pocket-4-creator', 'prod-dji-pocket-3-creator', 'prod-dji-mic-2'].includes(p.id)
  );

  const faq = [
    {
      question: 'Quay vlog một mình thì máy nào tự động bám mặt tốt nhất?',
      answer:
        'DJI Pocket 4 tích hợp tính năng ActiveTrack thông minh, tự động xoay gimbal giữ bạn luôn ở trung tâm khung hình khi di chuyển.',
    },
    {
      question: 'Âm thanh khi quay vlog ngoài phố đông đúc có bị ồn không?',
      answer:
        'Bộ Creator Combo đi kèm micro không dây DJI Mic có tính năng chống ồn AI thông minh, lọc sạch tiếng còi xe và tạp âm xung quanh.',
    },
  ];

  const relatedLinks = [
    { title: 'So sánh DJI Pocket 4 vs Pocket 3 cho Vlog', href: '/so-sanh/dji-pocket-4-vs-pocket-3' },
    { title: 'Hướng dẫn cài đặt DJI Pocket 4 quay vlog', href: '/huong-dan/dji-pocket-4-quay-du-lich' },
    { title: 'Thuê camera du lịch (Pillar)', href: '/thue-camera-du-lich' },
    { title: 'Thuê micro cài áo lọc ồn', href: '/thue-micro' },
  ];

  return (
    <CuratedLandingTemplate
      slug="thue-camera-vlog"
      badge="Dành Cho Vlogger & Creator"
      h1="Thuê Camera Quay Vlog Chuyên Nghiệp & Nhỏ Gọn"
      intro="Trọn bộ máy quay vlog bỏ túi hoàn hảo với khả năng xoay ngang/dọc, lấy nét khuôn mặt theo thời gian thực và micro không dây cao cấp bắt giọng nói trong trẻo."
      products={vlogProducts}
      faq={faq}
      relatedLinks={relatedLinks}
    />
  );
}
