import React from 'react';
import type { Metadata } from 'next';
import { getAdminRows } from '@/lib/data/admin-server';
import type { Category } from '@/types';
import CategoryManagerClient from './CategoryManagerClient';

export const metadata: Metadata = {
  title: 'Quản Lý Danh Mục Thiết Bị | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminRows<Category>('categories');

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-indigo-400">
          THUECAM TAXONOMY CONTROL
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white">
          Quản Lý Danh Mục Bảng Giá
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Phân loại sản phẩm thành các nhóm thiết bị để hiển thị trên bảng giá, bộ lọc danh mục và trang catalog.
        </p>
      </div>

      <CategoryManagerClient initialCategories={categories} />
    </div>
  );
}
