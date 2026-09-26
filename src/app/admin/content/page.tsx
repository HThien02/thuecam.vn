import React from 'react';
import type { Metadata } from 'next';
import { getAdminRows } from '@/lib/data/admin-server';
import type { Article } from '@/types';
import ContentManagerClient from './ContentManagerClient';

export const metadata: Metadata = {
  title: 'Quản Lý Nội Dung CMS | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default async function AdminContentPage() {
  const articles = await getAdminRows<Article>('articles');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
          Quản Lý Nội Dung CMS (Blog, Hướng Dẫn, So Sánh & Landing)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Hệ thống quản trị nội dung chuẩn SEO với trạng thái DRAFT, PUBLISHED, ARCHIVED và liên kết Topic Clusters.
        </p>
      </div>

      <ContentManagerClient initialArticles={articles} />
    </div>
  );
}
