import type { Metadata } from 'next';
import { getAdminRows } from '@/lib/data/admin-server';
import VoucherManagerClient from './VoucherManagerClient';

export const metadata: Metadata = {
  title: 'Quản Lý Voucher & Khuyến Mãi | THUECAM Admin',
  robots: { index: false, follow: false },
};

type Voucher = {
  id: string;
  code: string;
  discount_type: 'PERCENT' | 'FIXED';
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  starts_at: string;
  expires_at: string | null;
  is_active: boolean;
};

export default async function AdminVouchersPage() {
  const vouchers = await getAdminRows<Voucher>('vouchers');
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-amber-400">PROMOTIONS & CUSTOMER OFFERS</p>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">Voucher & Khuyến Mãi</h1>
        <p className="mt-1 max-w-2xl text-xs text-slate-400 sm:text-sm">
          Tạo mã giảm giá theo phần trăm hoặc số tiền, giới hạn lượt dùng và lịch hiệu lực. Mỗi đơn chỉ áp dụng một voucher.
        </p>
      </div>
      <VoucherManagerClient initialVouchers={vouchers} />
    </div>
  );
}
