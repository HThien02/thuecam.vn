'use client';

import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  Lock,
  Save,
  Search,
  Filter,
} from 'lucide-react';
import { saveAdminRecord, deleteAdminRecord } from '@/lib/data/admin-api';
import type { BookingRecord, BlockedDate } from '@/lib/data/admin-types';

export { type BookingRecord } from '@/lib/data/admin-types';

export default function BookingManagerClient({
  initialBookings,
  initialBlockedDates,
}: {
  initialBookings: BookingRecord[];
  initialBlockedDates: BlockedDate[];
}) {
  const [bookings, setBookings] = useState<BookingRecord[]>(initialBookings);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingRecord | null>(null);

  // Form states
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCccd, setCustomerCccd] = useState('');
  const [customerLookup, setCustomerLookup] = useState<{ state: 'idle' | 'checking' | 'new' | 'existing' | 'error'; message?: string; history?: Array<{ booking_code: string; product_name: string; start_date: string; end_date: string; status: string }> }>({ state: 'idle' });
  const [isSaving, setIsSaving] = useState(false);
  const [productName, setProductName] = useState('DJI Pocket 4 Creator Combo');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalPrice, setTotalPrice] = useState<number>(450000);
  const [depositAmount, setDepositAmount] = useState<number>(3000000);
  const [pickupMethod, setPickupMethod] = useState('ETown Tân Bình');
  const [pickupTime, setPickupTime] = useState('09:00');
  const [status, setStatus] = useState<BookingRecord['status']>('CONFIRMED');
  const [notes, setNotes] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Blocked dates list for calendar
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>(initialBlockedDates);
  const [blockDateInput, setBlockDateInput] = useState('');
  const [blockReasonInput, setBlockReasonInput] = useState('Bảo trì thiết bị');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleOpenCreate = () => {
    setEditingBooking(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerCccd('');
    setCustomerLookup({ state: 'idle' });
    setProductName('DJI Pocket 4 Creator Combo');
    setStartDate(new Date().toISOString().split('T')[0]);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    setEndDate(tomorrow.toISOString().split('T')[0]);
    setTotalPrice(450000);
    setDepositAmount(3000000);
    setPickupMethod('ETown Tân Bình');
    setPickupTime('09:00');
    setStatus('CONFIRMED');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: BookingRecord) => {
    setEditingBooking(b);
    setCustomerName(b.customer_name);
    setCustomerPhone(b.customer_phone);
    setCustomerCccd(b.customer_cccd ?? '');
    setCustomerLookup({ state: 'idle' });
    setProductName(b.product_name);
    setStartDate(b.start_date);
    setEndDate(b.end_date);
    setTotalPrice(b.total_price);
    setDepositAmount(b.deposit_amount || 2000000);
    setPickupMethod(b.pickup_method);
    setPickupTime(b.pickup_time?.slice(0, 5) ?? '09:00');
    setStatus(b.status);
    setNotes(b.notes || '');
    setIsModalOpen(true);
  };

  const handleLookupCustomer = async () => {
    const identity = customerCccd.trim();
    if (!identity) {
      setCustomerLookup({ state: 'idle' });
      return;
    }
    if (!/^(\d{9}|\d{12})$/.test(identity)) {
      setCustomerLookup({ state: 'error', message: 'CCCD/CMND phải gồm 9 hoặc 12 chữ số.' });
      return;
    }

    setCustomerLookup({ state: 'checking' });
    try {
      const response = await fetch(`/api/admin/customers/lookup?${new URLSearchParams({ cccd: identity })}`, { credentials: 'same-origin', cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Không thể tra cứu khách hàng.');
      if (result.exists) {
        setCustomerLookup({ state: 'existing', history: result.history ?? [], message: `Khách hàng cũ · ${result.bookingCount} lượt thuê đã lưu.` });
        if (!customerName.trim() && result.customer?.name) setCustomerName(result.customer.name);
        if (!customerPhone.trim() && result.customer?.phone) setCustomerPhone(result.customer.phone);
      } else {
        setCustomerLookup({ state: 'new', message: 'Đây là khách hàng mới.' });
      }
    } catch (error) {
      setCustomerLookup({ state: 'error', message: error instanceof Error ? error.message : 'Không thể tra cứu khách hàng.' });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^(\d{9}|\d{12})$/.test(customerCccd.trim())) {
      showToast('Vui lòng nhập CCCD/CMND gồm 9 hoặc 12 chữ số.');
      return;
    }
    setIsSaving(true);
    const daysCount = Math.max(
      1,
      Math.round(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
      ) + 1
    );
    const bookingCode = editingBooking?.id ?? `TC${Math.floor(100000 + Math.random() * 900000)}`;
    const delivery = editingBooking
      ? editingBooking.pickup_method !== 'ETown Tân Bình'
      : pickupMethod.toLocaleLowerCase('vi').startsWith('giao');

    try {
      const saved = await saveAdminRecord<Record<string, unknown>>(
        'bookings',
        {
          ...(editingBooking?.database_id ? { id: editingBooking.database_id } : {}),
          booking_code: bookingCode,
          customer_name: customerName.trim(),
          customer_phone: customerPhone.trim(),
          customer_email: editingBooking?.customer_email ?? null,
          customer_cccd: customerCccd.trim(),
          product_id: editingBooking?.product_id ?? null,
          product_name: productName.trim(),
          start_date: startDate,
          end_date: endDate,
          pickup_time: pickupTime,
          total_days: daysCount,
          daily_price: editingBooking?.daily_price ?? Math.round(Number(totalPrice) / daysCount),
          total_price: Number(totalPrice),
          deposit_amount: Number(depositAmount),
          pickup_method: delivery ? 'DELIVERY' : 'STORE',
          delivery_address: delivery ? pickupMethod : null,
          note: notes.trim() || null,
          status,
        },
        editingBooking ? 'update' : 'create',
      );
      const bookingData: BookingRecord = {
        id: String(saved.booking_code),
        database_id: String(saved.id),
        customer_name: String(saved.customer_name),
        customer_phone: String(saved.customer_phone),
        customer_email: typeof saved.customer_email === 'string' ? saved.customer_email : undefined,
        customer_cccd: typeof saved.customer_cccd === 'string' ? saved.customer_cccd : undefined,
        product_id: typeof saved.product_id === 'string' ? saved.product_id : undefined,
        product_name: String(saved.product_name),
        start_date: String(saved.start_date),
        end_date: String(saved.end_date),
        pickup_time: typeof saved.pickup_time === 'string' ? saved.pickup_time : pickupTime,
        total_days: Number(saved.total_days),
        daily_price: Number(saved.daily_price),
        total_price: Number(saved.total_price),
        selected_addons: editingBooking?.selected_addons ?? [],
        deposit_amount: Number(saved.deposit_amount),
        pickup_method: saved.pickup_method === 'DELIVERY'
          ? String(saved.delivery_address ?? 'Giao tận nơi')
          : 'ETown Tân Bình',
        status: status,
        notes: typeof saved.note === 'string' ? saved.note : undefined,
        created_at: String(saved.created_at),
      };
      setBookings((current) => editingBooking
        ? current.map((booking) => booking.id === editingBooking.id ? bookingData : booking)
        : [bookingData, ...current]);
      setIsModalOpen(false);
      showToast(editingBooking ? `Đã cập nhật đơn ${bookingData.id}` : `Đã tạo đơn ${bookingData.id}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể lưu đơn thuê.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Bạn có chắc muốn xóa đơn thuê ${id}?`)) return;
    try {
      await deleteAdminRecord('bookings', id);
      setBookings((current) => current.filter((booking) => booking.id !== id));
      showToast(`Đã xóa đơn ${id}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể xóa đơn thuê.');
    }
  };

  const handleChangeStatus = async (id: string, newStatus: BookingRecord['status']) => {
    const booking = bookings.find((item) => item.id === id);
    if (!booking) return;
    try {
      await saveAdminRecord('bookings', {
        id: booking.database_id,
        booking_code: booking.id,
        status: newStatus,
      }, 'update');
      setBookings((current) => current.map((item) => item.id === id ? { ...item, status: newStatus } : item));
      showToast(`Đơn ${id} chuyển sang: ${newStatus}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể cập nhật trạng thái đơn.');
    }
  };

  // Block a date
  const handleAddBlockedDate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDateInput) return;
    try {
      const saved = await saveAdminRecord<BlockedDate>('blocked_dates', {
        date: blockDateInput,
        reason: blockReasonInput.trim(),
      });
      setBlockedDates((current) => [...current.filter((item) => item.date !== saved.date), saved]);
      setBlockDateInput('');
      showToast(`Đã khóa ngày ${saved.date} trên lịch máy trống`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể khóa ngày này.');
    }
  };

  const handleRemoveBlockedDate = async (dateStr: string) => {
    try {
      await deleteAdminRecord('blocked_dates', dateStr);
      setBlockedDates((current) => current.filter((item) => item.date !== dateStr));
      showToast(`Đã mở lại ngày ${dateStr}`);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Không thể mở lại ngày này.');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const matchSearch =
      b.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customer_phone.includes(searchTerm) ||
      (b.customer_cccd ?? '').includes(searchTerm) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl bg-emerald-500 text-slate-950 font-black px-5 py-3 shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="size-5" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="size-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm mã, tên, SĐT hoặc CCCD..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-64"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-600">
            <Filter className="size-3.5 text-sky-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900 text-white">Tất cả trạng thái ({bookings.length})</option>
              <option value="PENDING" className="bg-slate-900 text-white">Chờ duyệt (PENDING)</option>
              <option value="CONFIRMED" className="bg-slate-900 text-white">Đã xác nhận (CONFIRMED)</option>
              <option value="RENTING" className="bg-slate-900 text-white">Đang cho thuê (RENTING)</option>
              <option value="COMPLETED" className="bg-slate-900 text-white">Đã hoàn tất (COMPLETED)</option>
              <option value="CANCELLED" className="bg-slate-900 text-white">Đã hủy (CANCELLED)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 text-xs font-black shadow-md transition"
        >
          <Plus className="size-4" /> Tạo Đơn Thuê Mới
        </button>
      </div>

      {/* Bookings Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Mã đơn</th>
                <th className="px-4 py-3.5">Khách hàng</th>
                <th className="px-4 py-3.5">Thiết bị</th>
                <th className="px-4 py-3.5">Lịch thuê (Nhận - Trả)</th>
                <th className="px-4 py-3.5">Tổng tiền</th>
                <th className="px-4 py-3.5">Điểm nhận</th>
                <th className="px-4 py-3.5">Trạng thái</th>
                <th className="px-4 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-600">
              {filteredBookings.map((b) => {
                let badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
                if (b.status === 'CONFIRMED') badgeClass = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
                if (b.status === 'RENTING') badgeClass = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
                if (b.status === 'COMPLETED') badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
                if (b.status === 'CANCELLED') badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';

                return (
                  <tr key={b.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-4 py-3 font-mono font-black text-white">{b.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-white">{b.customer_name}</p>
                      <p className="text-[11px] text-sky-400">{b.customer_phone}</p>
                      {b.customer_email && <p className="text-[11px] text-slate-400">{b.customer_email}</p>}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-200">
                      <p>{b.product_name}</p>
                      {b.selected_addons?.length ? (
                        <ul className="mt-1.5 space-y-1 text-[10px] font-medium text-slate-400">
                          {b.selected_addons.map((addon) => (
                            <li key={addon.id} className="flex justify-between gap-3">
                              <span>{addon.name} · 1 lần thuê</span>
                              <span className="shrink-0">{Number(addon.price_per_rental ?? addon.total_price ?? 0).toLocaleString('vi-VN')}đ</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-white">{b.start_date}</span>
                      <span className="text-slate-500 mx-1">→</span>
                      <span className="font-bold text-white">{b.end_date}</span>
                      <span className="block text-[10px] text-slate-400 font-bold">
                        ({b.total_days} ngày) · nhận lúc {b.pickup_time?.slice(0, 5) ?? '—'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-black text-sky-400">
                      {b.total_price.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                      {b.pickup_method}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={b.status}
                        onChange={(e) => handleChangeStatus(b.id, e.target.value as BookingRecord['status'])}
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black border outline-none cursor-pointer ${badgeClass} bg-slate-900`}
                      >
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="CONFIRMED">Đã xác nhận</option>
                        <option value="RENTING">Đang thuê</option>
                        <option value="COMPLETED">Đã hoàn tất</option>
                        <option value="CANCELLED">Đã hủy</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
                          title="Sửa"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Xóa"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Blocked Dates Management Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Lock className="size-4 text-amber-400" />
              Khóa Lịch Máy Trống / Đánh Dấu Ngày Bận Cho Thuê Ngoại Tuyến
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Các ngày được khóa tại đây sẽ tự động hiển thị trạng thái <strong>Đã kín lịch</strong> trên bảng lịch của người dùng.
            </p>
          </div>
        </div>

        <form onSubmit={handleAddBlockedDate} className="flex flex-wrap items-center gap-3 text-xs">
          <input
            required
            type="date"
            value={blockDateInput}
            onChange={(e) => setBlockDateInput(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400"
          />
          <input
            type="text"
            placeholder="Lý do khóa (VD: Đoàn làm phim bao máy, Bảo trì...)"
            value={blockReasonInput}
            onChange={(e) => setBlockReasonInput(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-amber-400 w-72"
          />
          <button
            type="submit"
            className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2"
          >
            Khóa ngày này
          </button>
        </form>

        {blockedDates.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {blockedDates.map((b) => (
              <span
                key={b.date}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs text-amber-300"
              >
                <strong>{b.date}</strong>: {b.reason}
                <button
                  type="button"
                  onClick={() => handleRemoveBlockedDate(b.date)}
                  className="ml-1 text-slate-400 hover:text-rose-400"
                  title="Mở lại ngày này"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Modal CRUD Edit / Create Booking */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 text-slate-200 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Calendar className="size-4 text-emerald-400" />
                {editingBooking ? `Chỉnh Sửa Đơn Thuê ${editingBooking.id}` : 'Tạo Đơn Thuê Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Tên khách hàng: *</label>
                  <input
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Số điện thoại / Zalo: *</label>
                  <input
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="09xx xxx xxx"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="booking-customer-cccd" className="block font-bold text-slate-600 mb-1">CCCD/CMND khách hàng: *</label>
                <input
                  id="booking-customer-cccd"
                  required
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={12}
                  value={customerCccd}
                  onChange={(event) => {
                    setCustomerCccd(event.target.value.replace(/\D/g, '').slice(0, 12));
                    setCustomerLookup({ state: 'idle' });
                  }}
                  onBlur={handleLookupCustomer}
                  aria-describedby="customer-identity-status"
                  placeholder="Nhập 9 hoặc 12 chữ số, tra cứu khi rời ô"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
                <p id="customer-identity-status" role={customerLookup.state === 'error' ? 'alert' : 'status'} aria-live="polite" className={`mt-1 text-[11px] font-semibold ${customerLookup.state === 'error' ? 'text-rose-400' : customerLookup.state === 'existing' ? 'text-sky-300' : customerLookup.state === 'new' ? 'text-emerald-300' : 'text-slate-400'}`}>
                  {customerLookup.state === 'checking' ? 'Đang tra cứu lịch sử khách hàng…' : customerLookup.message ?? (customerCccd ? 'Rời ô để kiểm tra khách hàng và lịch thuê cũ.' : 'Nhập CCCD để tra cứu và lưu lịch sử thuê theo khách hàng.')}
                </p>
                {customerLookup.state === 'existing' && customerLookup.history?.length ? (
                  <ul className="mt-2 flex flex-col gap-1 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-[11px] text-slate-600" aria-label="Lịch sử thuê gần đây">
                    {customerLookup.history.map((item) => (
                      <li key={item.booking_code} className="flex flex-wrap items-center justify-between gap-2">
                        <span><strong className="text-white">{item.product_name}</strong> · {item.start_date}–{item.end_date}</span>
                        <span className="font-mono text-sky-300">{item.booking_code}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Thiết bị thuê: *</label>
                <input
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Ngày nhận máy: *</label>
                  <input
                    required
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Ngày trả máy: *</label>
                  <input
                    required
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="booking-pickup-time" className="block font-bold text-slate-600 mb-1">Giờ nhận máy:</label>
                  <input
                    id="booking-pickup-time"
                    type="time"
                    required
                    value={pickupTime}
                    onChange={(event) => setPickupTime(event.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Tổng tiền thuê (VNĐ): *</label>
                  <input
                    type="number"
                    required
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sky-400 font-black"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Tiền cọc (VNĐ):</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-amber-400 font-black"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Điểm nhận máy / Địa chỉ:</label>
                <input
                  value={pickupMethod}
                  onChange={(e) => setPickupMethod(e.target.value)}
                  placeholder="ETown Tân Bình hoặc địa chỉ giao"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Trạng thái đơn:</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as BookingRecord['status'])}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 font-bold"
                  >
                    <option value="PENDING">Chờ duyệt (PENDING)</option>
                    <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
                    <option value="RENTING">Đang thuê (RENTING)</option>
                    <option value="COMPLETED">Đã hoàn tất (COMPLETED)</option>
                    <option value="CANCELLED">Đã hủy (CANCELLED)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-600 mb-1">Ghi chú:</label>
                  <input
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Lưu ý khách hàng..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-600 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  aria-busy={isSaving}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-5 py-2.5 text-xs shadow-lg transition disabled:cursor-wait disabled:opacity-60"
                >
                  {isSaving ? <Clock className="size-4 inline mr-1 animate-spin" aria-hidden="true" /> : <Save className="size-4 inline mr-1" />}
                  {isSaving ? 'Đang lưu đơn…' : editingBooking ? 'Lưu Thay Đổi' : 'Tạo Đơn Thuê'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
