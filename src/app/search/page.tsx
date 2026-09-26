import React from 'react';
import type { Metadata } from 'next';
import { getProducts, getCategories, getBrands } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import SearchFilterClient from './SearchFilterClient';

// Crucial: NOINDEX, FOLLOW as specified in the architecture instructions
export const metadata: Metadata = constructMetadata({
  title: 'Tìm Kiếm Thiết Bị Theo Lịch Trình & Bộ Lọc | THUECAM',
  description: 'Công cụ tìm kiếm kiểm tra lịch trống máy ảnh, flycam, action cam, micro theo ngày và mức giá.',
  canonicalPath: '/thiet-bi',
  noindex: true, // STRICTLY NOINDEX TO PREVENT URL BLOAT
});

export default async function SearchPage() {
  const products = await getProducts();
  const categories = await getCategories();
  const brands = await getBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ name: 'Tìm kiếm thiết bị', url: '/search' }]} />

      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
          Tìm Kiếm & Lọc Thiết Bị Theo Nhu Cầu
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Lọc máy theo thương hiệu, mức giá thuê hoặc tìm nhanh tên sản phẩm.
        </p>
      </div>

      {/* Client Filter Interface */}
      <SearchFilterClient
        initialProducts={products}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
