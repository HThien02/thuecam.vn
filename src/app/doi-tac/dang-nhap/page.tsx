import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getPartnerSession } from '@/lib/security/partner-session';
import PartnerLoginForm from '@/components/consignment/PartnerLoginForm';

export const metadata: Metadata = { title: 'Đăng nhập đối tác ký gửi | THUECAM', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function PartnerLoginPage() {
  if (await getPartnerSession()) redirect('/doi-tac');

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-16">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-extrabold text-slate-900">Đăng nhập đối tác ký gửi</h1>
        <p className="text-sm text-slate-600">Dùng email và mật khẩu THUECAM đã cấp để theo dõi lịch thuê máy của bạn.</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <PartnerLoginForm />
      </div>
      <p className="text-center text-sm text-slate-600">
        Chưa có tài khoản?{' '}
        <Link href="/ky-gui" className="font-bold text-sky-700 hover:underline">Đăng ký ký gửi</Link>
      </p>
    </div>
  );
}
