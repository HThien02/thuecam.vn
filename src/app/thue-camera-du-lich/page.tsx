import React from 'react';
import type { Metadata } from 'next';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import CuratedLandingTemplate from '@/components/seo/CuratedLandingTemplate';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê Camera Du Lịch Chính Hãng | Giá Chỉ Từ 150K/ngày | THUECAM',
  description:
    'Dịch vụ cho thuê camera du lịch bỏ túi, action cam đi biển, chống nước chính hãng giá tốt tại TP.HCM & Hà Nội. Đặt thuê online nhận máy ngay.',
  canonicalPath: '/thue-camera-du-lich',
  ogImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop',
});

export default async function PillarThueCameraDuLichPage() {
  const allProducts = await getProducts();
  const travelProducts = allProducts.filter((p) =>
    ['prod-dji-pocket-4-creator', 'prod-dji-pocket-3-creator', 'prod-gopro-hero-13-black', 'prod-insta360-x4', 'prod-dji-mini-4-pro'].includes(p.id)
  );

  const faq = [
    {
      question: 'Đi du lịch ngắn ngày (3-4 ngày) thì nên thuê máy nào dễ dùng nhất?',
      answer:
        'DJI Pocket 4 hoặc Pocket 3 là lựa chọn hàng đầu: thiết kế nhỏ như thanh kẹo, mở máy ghi hình trong 1 giây, gimbal chống rung mượt mà và mic không dây thu âm trong trẻo.',
    },
    {
      question: 'Nếu đi tắm biển, lặn ngắm san hô thì chọn máy nào an toàn?',
      answer:
        'Bạn nên thuê GoPro Hero 13 Black. Máy chống nước nguyên khối 10m không cần vỏ hộp bảo vệ, kèm phụ kiện phao nổi tay cầm an toàn tuyệt đối khi xuống biển.',
    },
    {
      question: 'Thuê máy đi du lịch có kèm phụ kiện sạc và thẻ nhớ không?',
      answer:
        'THUECAM trang bị đầy đủ thẻ nhớ SanDisk Extreme Pro 128GB tốc độ cao, pin dự phòng hoặc tay cầm pin sạc, cốc sạc nhanh và túi chống sốc đi kèm.',
    },
  ];

  const relatedLinks = [
    {
      title: '5 camera nhỏ gọn phù hợp để đi du lịch',
      href: '/blog/camera-phu-hop-di-du-lich',
    },
    {
      title: 'DJI Pocket 4 là gì? Có phù hợp để quay vlog không?',
      href: '/blog/dji-pocket-4-la-gi',
    },
    {
      title: 'DJI Pocket 4 vs Pocket 3: Nên thuê máy nào?',
      href: '/so-sanh/dji-pocket-4-vs-pocket-3',
    },
    {
      title: 'Hướng dẫn cài đặt DJI Pocket 4 quay du lịch sắc nét từ A-Z',
      href: '/huong-dan/dji-pocket-4-quay-du-lich',
    },
    {
      title: 'Thuê Action Camera đi biển và phượt xe máy',
      href: '/thue-action-camera',
    },
    {
      title: 'Thuê camera 360 độ góc nhìn không giới hạn',
      href: '/thue-camera-360',
    },
  ];

  return (
    <CuratedLandingTemplate
      slug="thue-camera-du-lich"
      badge="Pillar SEO Topic Hub"
      h1="Thuê Camera Du Lịch Gọn Nhẹ & Chống Rung Cực Tốt"
      intro="Tổng hợp các dòng camera bỏ túi, action cam đi biển, flycam du lịch từ DJI, GoPro, Insta360. Giải pháp tiết kiệm tới 90% chi phí so với mua mới, đầy đủ phụ kiện cho chuyến vi vu trọn vẹn."
      detailedContent={`## Kinh Nghiệm Thuê Camera Du Lịch Không Thể Bỏ Qua

### 1. Xác định địa hình chuyến đi
- **Khám phá thành phố, ẩm thực, check-in quán cafe:** Ưu tiên dòng [DJI Pocket 4 Creator](/thiet-bi/dji-pocket-4-creator) hoặc [DJI Pocket 3](/thiet-bi/dji-pocket-3-creator) vì góc quay vừa phải, tôn màu da tự nhiên và mic bắt giọng nói rất trong.
- **Leo núi, trekking, chèo SUP, tắm biển:** Chắc chắn là [GoPro Hero 13](/thiet-bi/gopro-hero-13-black) nhờ khả năng chống va đập và chống nước tuyệt đối.
- **Cung đường đèo, phượt xe máy:** [Insta360 X4](/thiet-bi/insta360-x4) gắn gậy tàng hình sẽ cho ra các góc quay như có flycam bay theo xe của bạn.`}
      products={travelProducts}
      faq={faq}
      relatedLinks={relatedLinks}
    />
  );
}
