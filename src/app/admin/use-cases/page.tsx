import type { Metadata } from 'next';
import { getAdminRows } from '@/lib/data/admin-server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Product, UseCase } from '@/types';
import UseCaseManagerClient from './UseCaseManagerClient';

export const metadata: Metadata = { title: 'Quản Lý Nhu Cầu Thuê | THUECAM Admin', robots: { index: false, follow: false } };

async function getUseCaseProductLinks() {
  const { data, error } = await createAdminClient().from('product_use_cases').select('product_id, use_case_id');
  if (error) return {} as Record<string, string[]>;
  return (data ?? []).reduce<Record<string, string[]>>((links, row) => {
    (links[row.use_case_id] ??= []).push(row.product_id);
    return links;
  }, {});
}

export default async function AdminUseCasesPage() {
  const [useCases, products, links] = await Promise.all([
    getAdminRows<UseCase>('use_cases'),
    getAdminRows<Product>('products'),
    getUseCaseProductLinks(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-cyan-400">THUECAM USE CASE CONTROL</p>
        <h1 className="mt-1 text-2xl font-black text-black">Quản Lý Nhu Cầu Thuê</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Tạo các nhóm nhu cầu như Đi Du Lịch, Quay TikTok, Quay Vlog, gán thiết bị gợi ý, FAQ và nội dung SEO cho trang /nhu-cau.
        </p>
      </div>
      <UseCaseManagerClient initialUseCases={useCases} products={products} initialLinks={links} />
    </div>
  );
}
