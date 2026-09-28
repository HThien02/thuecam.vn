import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/security/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import type { ConsignmentApplication, ConsignmentPartner, ConsignmentUnit } from '@/lib/consignment';
import ConsignmentManagerClient from './ConsignmentManagerClient';

export const metadata: Metadata = { title: 'Ký Gửi Cho Thuê | THUECAM Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

async function loadData() {
  const supabase = createAdminClient();
  const [applications, partners, units] = await Promise.all([
    supabase.from('consignment_applications').select('*').order('created_at', { ascending: false }).limit(500),
    supabase.from('consignment_partners').select('*').order('created_at', { ascending: false }),
    supabase.from('camera_units').select('id, serial_number, label, status, owner_partner_id, camera_series(name)').order('serial_number'),
  ]);

  const missingSchema = Boolean(applications.error || partners.error || units.error);
  const unitRows: ConsignmentUnit[] = (units.data ?? []).map((unit) => {
    const series = unit.camera_series as { name?: string } | { name?: string }[] | null;
    const seriesName = Array.isArray(series) ? series[0]?.name : series?.name;
    return {
      id: unit.id,
      serial_number: unit.serial_number,
      label: unit.label,
      status: unit.status,
      owner_partner_id: unit.owner_partner_id,
      series_name: seriesName ?? '',
    };
  });

  return {
    missingSchema,
    applications: (applications.data ?? []) as ConsignmentApplication[],
    partners: (partners.data ?? []) as ConsignmentPartner[],
    units: unitRows,
  };
}

export default async function AdminConsignmentsPage() {
  if (!(await getAdminSession())) redirect('/admin/login?from=/admin/consignments');
  const data = await loadData();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-cyan-500">THUECAM CONSIGNMENT</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Ký Gửi Cho Thuê</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Duyệt đơn đăng ký ký gửi từ trang /ky-gui, cấp tài khoản đối tác và gán máy để đối tác theo dõi lịch thuê tại /doi-tac.
        </p>
      </div>
      {data.missingSchema ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
          Chưa tìm thấy bảng ký gửi. Hãy chạy file <code className="font-mono font-bold">supabase/migrations/08_consignment.sql</code> trong Supabase SQL Editor rồi tải lại trang.
        </div>
      ) : (
        <ConsignmentManagerClient applications={data.applications} partners={data.partners} units={data.units} />
      )}
    </div>
  );
}
