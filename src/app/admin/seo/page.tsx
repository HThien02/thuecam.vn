import React from 'react';
import type { Metadata } from 'next';
import { getSeoSettings, getProducts } from '@/lib/data';
import SeoManagerClient from './SeoManagerClient';

export const metadata: Metadata = {
  title: 'Quản Trị SEO & Google SERP Preview | THUECAM Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminSeoPage() {
  const seoSettings = await getSeoSettings();
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Trung Tâm Quản Trị SEO & Google SERP Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Tối ưu thẻ Title, Meta Description, Canonical, OG Image và điều khiển chỉ mục tìm kiếm an toàn.
        </p>
      </div>

      <SeoManagerClient
        initialSettings={seoSettings}
        products={products}
      />
    </div>
  );
}
