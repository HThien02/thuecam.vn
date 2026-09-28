import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Camera, CalendarClock, CircleDollarSign, Wallet } from 'lucide-react';
import { getPartnerSession } from '@/lib/security/partner-session';
import { createAdminClient } from '@/lib/supabase/admin';
import { BOOKING_STATUS_LABELS, formatDate, formatVnd } from '@/lib/consignment';
import PartnerLogoutButton from '@/components/consignment/PartnerLogoutButton';

export const metadata: Metadata = { title: 'Máy ký gửi của tôi | THUECAM', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

interface BookingRow {
  id: string;
  booking_code: string;
  product_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  daily_price: number;
  status: string;
}

const ACTIVE_STATUSES = new Set(['CONFIRMED', 'PAID', 'RENTING', 'ACTIVE']);
const DONE_STATUSES = new Set(['COMPLETED', 'RETURNED']);
const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-800 border-amber-200',
  CONFIRMED: 'bg-sky-50 text-sky-800 border-sky-200',
  PAID: 'bg-sky-50 text-sky-800 border-sky-200',
  RENTING: 'bg-violet-50 text-violet-800 border-violet-200',
  ACTIVE: 'bg-violet-50 text-violet-800 border-violet-200',
  RETURNED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  COMPLETED: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  CANCELLED: 'bg-slate-100 text-slate-600 border-slate-200',
};

async function loadPartnerData(userId: string) {
  const supabase = createAdminClient();
  const [{ data: partner }, { data: units }] = await Promise.all([
    supabase.from('consignment_partners').select('full_name, revenue_share_percent').eq('user_id', userId).maybeSingle(),
    supabase.from('camera_units').select('id, serial_number, label, status, camera_series(name)').eq('owner_partner_id', userId).order('serial_number'),
  ]);

  const unitIds = (units ?? []).map((unit) => unit.id);
  const { data: assignments } = unitIds.length
    ? await supabase
        .from('booking_camera_assignments')
        .select('unit_id, bookings(id, booking_code, product_name, start_date, end_date, total_days, daily_price, status)')
        .in('unit_id', unitIds)
    : { data: [] };

  const bookings = (assignments ?? [])
    .map((row) => {
      const booking = (Array.isArray(row.bookings) ? row.bookings[0] : row.bookings) as BookingRow | null;
      return booking ? { ...booking, unit_id: row.unit_id as string } : null;
    })
    .filter((row): row is BookingRow & { unit_id: string } => row !== null)
    .sort((a, b) => b.start_date.localeCompare(a.start_date));

  return { partner, units: units ?? [], bookings };
}

export default async function PartnerDashboardPage() {
  const session = await getPartnerSession();
  if (!session) redirect('/doi-tac/dang-nhap');

  const { partner, units, bookings } = await loadPartnerData(session.userId);
  const share = Number(partner?.revenue_share_percent ?? 0) / 100;
  const rentalValue = (b: BookingRow) => Number(b.daily_price) * Number(b.total_days);
  const today = new Date().toISOString().slice(0, 10);

  const renting = bookings.filter((b) => ACTIVE_STATUSES.has(b.status) && b.start_date <= today && b.end_date >= today);
  const upcoming = bookings.filter((b) => ['PENDING', ...ACTIVE_STATUSES].includes(b.status) && b.start_date > today);
  const earned = bookings.filter((b) => DONE_STATUSES.has(b.status)).reduce((sum, b) => sum + rentalValue(b) * share, 0);
  const expected = bookings.filter((b) => ACTIVE_STATUSES.has(b.status)).reduce((sum, b) => sum + rentalValue(b) * share, 0);
  const unitLabel = new Map(units.map((u) => [u.id, u.serial_number]));
  const busyUnitIds = new Set(renting.map((b) => b.unit_id));

  const stats = [
    { icon: Camera, label: 'Máy ký gửi', value: String(units.length) },
    { icon: CalendarClock, label: 'Đang cho thuê / sắp tới', value: `${renting.length} / ${upcoming.length}` },
    { icon: Wallet, label: 'Doanh thu đã hoàn tất', value: formatVnd(earned) },
    { icon: CircleDollarSign, label: 'Doanh thu dự kiến', value: formatVnd(expected) },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-sky-600">Tài khoản đối tác ký gửi</p>
          <h1 className="text-2xl font-extrabold text-slate-900">Xin chào, {partner?.full_name ?? session.email}</h1>
          <p className="text-sm text-slate-600">Tỷ lệ chia doanh thu của bạn: <strong>{Number(partner?.revenue_share_percent ?? 0)}%</strong> giá thuê (không tính cọc).</p>
        </div>
        <PartnerLogoutButton />
      </header>

      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <dt className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <stat.icon className="h-4 w-4 text-sky-600" />
              {stat.label}
            </dt>
            <dd className="mt-2 text-xl font-extrabold text-slate-900">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="units-heading" className="space-y-3">
        <h2 id="units-heading" className="text-lg font-bold text-slate-900">Máy của bạn</h2>
        {units.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">THUECAM chưa gán máy nào vào tài khoản của bạn. Vui lòng liên hệ quản trị viên.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((unit) => {
              const series = unit.camera_series as { name?: string } | { name?: string }[] | null;
              const name = (Array.isArray(series) ? series[0]?.name : series?.name) ?? 'Thiết bị';
              const isBusy = busyUnitIds.has(unit.id);
              const statusText = unit.status === 'MAINTENANCE' ? 'Bảo trì' : unit.status === 'RETIRED' ? 'Ngừng cho thuê' : isBusy ? 'Đang được thuê' : 'Sẵn sàng';
              return (
                <li key={unit.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div>
                    <p className="font-bold text-slate-900">{name}</p>
                    <p className="font-mono text-xs text-slate-500">{unit.serial_number}{unit.label ? ` · ${unit.label}` : ''}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold ${isBusy ? 'border-violet-200 bg-violet-50 text-violet-800' : unit.status === 'AVAILABLE' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>
                    {statusText}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="bookings-heading" className="space-y-3">
        <h2 id="bookings-heading" className="text-lg font-bold text-slate-900">Lịch sử & lịch thuê</h2>
        {bookings.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">Chưa có đơn thuê nào cho máy của bạn.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Mã đơn</th>
                  <th className="px-4 py-3">Máy</th>
                  <th className="px-4 py-3">Thời gian thuê</th>
                  <th className="px-4 py-3">Số ngày</th>
                  <th className="px-4 py-3">Giá thuê</th>
                  <th className="px-4 py-3">Phần của bạn</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">{booking.booking_code}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {booking.product_name}
                      <span className="block font-mono text-xs text-slate-500">{unitLabel.get(booking.unit_id)}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{formatDate(booking.start_date)} – {formatDate(booking.end_date)}</td>
                    <td className="px-4 py-3 text-slate-700">{booking.total_days}</td>
                    <td className="px-4 py-3 text-slate-700">{formatVnd(rentalValue(booking))}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{booking.status === 'CANCELLED' ? '—' : formatVnd(rentalValue(booking) * share)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLES[booking.status] ?? STATUS_STYLES.PENDING}`}>
                        {BOOKING_STATUS_LABELS[booking.status] ?? booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs text-slate-500">Thông tin khách thuê được bảo mật. Doanh thu hiển thị mang tính tham khảo, số liệu đối soát cuối cùng do THUECAM xác nhận.</p>
      </section>
    </div>
  );
}
