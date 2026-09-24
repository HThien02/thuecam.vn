import React from 'react';
import type { Metadata } from 'next';
import { getAdminRows } from '@/lib/data/admin-server';
import BookingManagerClient, { type BookingRecord } from './BookingManagerClient';
import type { BlockedDate } from '@/lib/data/admin-types';

export const metadata: Metadata = {
  title: 'Quản Lý Đơn Thuê & Lịch Máy | THUECAM Admin',
  robots: { index: false, follow: false },
};

export default async function AdminBookingsPage() {
  const [bookingRows, blockedDates] = await Promise.all([
    getAdminRows<Record<string, unknown>>('bookings'),
    getAdminRows<BlockedDate>('blocked_dates'),
  ]);
  const bookings: BookingRecord[] = bookingRows.map((row) => {
    const status = String(row.status);
    const mappedStatus: BookingRecord['status'] = status === 'PAID' ? 'CONFIRMED'
      : status === 'ACTIVE' ? 'RENTING'
      : status === 'RETURNED' ? 'COMPLETED'
      : status === 'CONFIRMED' || status === 'RENTING' || status === 'COMPLETED' || status === 'CANCELLED'
        ? status
        : 'PENDING';
    return {
      id: String(row.booking_code),
      database_id: String(row.id),
      customer_name: String(row.customer_name),
      customer_phone: String(row.customer_phone),
      customer_email: typeof row.customer_email === 'string' ? row.customer_email : undefined,
      product_id: typeof row.product_id === 'string' ? row.product_id : undefined,
      product_name: String(row.product_name),
      start_date: String(row.start_date),
      end_date: String(row.end_date),
      total_days: Number(row.total_days),
      daily_price: Number(row.daily_price),
      deposit_amount: Number(row.deposit_amount),
      total_price: Number(row.total_price),
      pickup_method: row.pickup_method === 'DELIVERY' ? String(row.delivery_address ?? 'Giao tận nơi') : 'ETown Tân Bình',
      status: mappedStatus,
      notes: typeof row.note === 'string' ? row.note : undefined,
      created_at: String(row.created_at),
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-emerald-400">
          THUECAM OPERATIONS & DISPATCH
        </p>
        <h1 className="mt-1 text-2xl sm:text-3xl font-black text-white">
          Quản Lý Đơn Thuê & Lịch Trình Thiết Bị
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Theo dõi trạng thái đơn hàng của khách, duyệt đơn, tạo đơn thuê tại quầy ETown Tân Bình và khóa lịch bảo trì/đặt trước.
        </p>
      </div>

      <BookingManagerClient initialBookings={bookings} initialBlockedDates={blockedDates} />
    </div>
  );
}
