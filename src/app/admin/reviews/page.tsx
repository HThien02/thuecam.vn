import React from 'react';
import type { Metadata } from 'next';
import { getAllReviewsForAdmin, getProducts } from '@/lib/data';
import ReviewModerationClient from './ReviewModerationClient';

export const metadata: Metadata = {
  title: 'Duyệt Đánh Giá Khách Hàng | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default async function AdminReviewsPage() {
  const reviews = await getAllReviewsForAdmin();
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Kiểm Duyệt Đánh Giá Khách Hàng (Customer Reviews Moderation)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Chỉ các đánh giá thật đã được duyệt (APPROVED) mới được hiển thị công khai và đưa vào Schema AggregateRating.
        </p>
      </div>

      <ReviewModerationClient initialReviews={reviews} products={products} />
    </div>
  );
}
