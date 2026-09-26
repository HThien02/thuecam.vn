import React from 'react';
import type { Metadata } from 'next';
import { getAdminRow, getAdminRows } from '@/lib/data/admin-server';
import type { Product, SeoSettings } from '@/types';
import SeoManagerClient from './SeoManagerClient';

export const metadata: Metadata = {
  title: 'Quản Trị SEO & Google SERP Preview | THUECAM Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminSeoPage() {
  const [seoSettings, products] = await Promise.all([
    getAdminRow<SeoSettings>('seo_settings', 'global-seo-settings'),
    getAdminRows<Product>('products'),
  ]);
  if (!seoSettings) throw new Error('SEO settings have not been seeded in Supabase.');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
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
