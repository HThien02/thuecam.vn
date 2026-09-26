import React from 'react';
import type { Metadata } from 'next';
import { getAdminRows } from '@/lib/data/admin-server';
import type { Product, Category, Brand } from '@/types';
import ProductManagerClient from './ProductManagerClient';

export const metadata: Metadata = {
  title: 'Quản Lý Thiết Bị & Bảng Giá | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const [products, categories, brands] = await Promise.all([
    getAdminRows<Product>('products'),
    getAdminRows<Category>('categories'),
    getAdminRows<Brand>('brands'),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-sky-400">
          THUECAM CATALOG CONTROL
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-black">
          Quản Lý Thiết Bị & Bảng Giá Thuê
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Quản lý toàn bộ thông tin máy, giá thuê theo ngày, tiền cọc, hình ảnh và trạng thái hoạt động. Thao tác CRUD sẽ cập nhật ngay vào hệ thống đặt thuê.
        </p>
      </div>

      <ProductManagerClient
        initialProducts={products}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}
