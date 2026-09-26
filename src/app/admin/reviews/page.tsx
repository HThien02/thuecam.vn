import React from 'react';
import type { Metadata } from 'next';
import { getAdminRows } from '@/lib/data/admin-server';
import type { Product, Review } from '@/types';
import ReviewModerationClient from './ReviewModerationClient';

export const metadata: Metadata = {
  title: 'Duyệt Đánh Giá Khách Hàng | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default async function AdminReviewsPage() {
  const [reviews, products] = await Promise.all([
    getAdminRows<Review>('reviews'),
    getAdminRows<Product>('products'),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
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
