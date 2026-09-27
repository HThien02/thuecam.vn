import type { Metadata } from 'next';
import { getAdminRows } from '@/lib/data/admin-server';
import type { UseCase } from '@/types';
import UseCaseManagerClient from './UseCaseManagerClient';

export const metadata: Metadata = { title: 'Quản Lý Nhu Cầu Thuê | THUECAM Admin', robots: { index: false, follow: false } };

export default async function AdminUseCasesPage() {
  const useCases = await getAdminRows<UseCase>('use_cases');
  return <div className="space-y-6"><div><p className="text-xs font-black uppercase tracking-wider text-cyan-400">THUECAM USE CASE CONTROL</p><h1 className="mt-1 text-2xl font-black text-black">Quản Lý Nhu Cầu Thuê</h1><p className="mt-1 max-w-2xl text-sm text-slate-400">Tạo các nhóm nhu cầu như Đi Du Lịch, Quay TikTok, Quay Vlog và quản lý nội dung SEO.</p></div><UseCaseManagerClient initialUseCases={useCases} /></div>;
}
