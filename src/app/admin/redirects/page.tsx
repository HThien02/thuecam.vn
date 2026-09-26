import React from 'react';
import type { Metadata } from 'next';
import { getAdminRows } from '@/lib/data/admin-server';
import type { RedirectRule } from '@/types';
import RedirectManagerClient from './RedirectManagerClient';

export const metadata: Metadata = {
  title: 'Quản Lý 301 Redirects | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default async function AdminRedirectsPage() {
  const redirects = await getAdminRows<RedirectRule>('redirects');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
          Quản Trị Điều Hướng 301 Redirects
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Bảo toàn sức mạnh SEO (Link Equity) khi đổi đường dẫn URL hoặc sáp nhập bài viết.
        </p>
      </div>

      <RedirectManagerClient initialRedirects={redirects} />
    </div>
  );
}
