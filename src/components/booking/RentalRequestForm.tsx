'use client';

import React, { useState } from 'react';
import { Product } from '@/types';
import { CheckCircle2, Clock3, CalendarDays, Send, MapPin, Truck } from 'lucide-react';
import AvailabilityCalendarTable from './AvailabilityCalendarTable';

export default function RentalRequestForm({
  products,
  initialProduct,
}: {
  products: Product[];
  initialProduct?: Product;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(
    initialProduct?.slug ?? products[0]?.slug ?? ''
  );
  const [duration, setDuration] = useState<'hourly' | 'daily'>('daily');
  const [pickupMethod, setPickupMethod] = useState<'STORE' | 'DELIVERY'>('STORE');

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(tomorrowStr);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  const product =
    products.find((item) => item.slug === selectedProduct) ??
    initialProduct ??
    products[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const code = `TC${Math.floor(100000 + Math.random() * 900000)}`;

    // Store in admin bookings table
    if (typeof window !== 'undefined') {
      try {
        const existing = localStorage.getItem('thuecam_bookings');
        const list = existing ? JSON.parse(existing) : [];
        list.unshift({
          id: code,
          customer_name: fullName,
          customer_phone: phone,
          customer_email: email,
          product_id: product?.id,
          product_name: product?.name,
          start_date: startDate,
          end_date: endDate,
          total_days: Math.max(
            1,
            Math.round(
              (new Date(endDate).getTime() - new Date(startDate).getTime()) /
                (1000 * 60 * 60 * 24)
            ) + 1
          ),
          total_price: (product?.rental_price_per_day || 150000) * 2,
          deposit_amount: product?.deposit_amount || 2000000,
          pickup_method:
            pickupMethod === 'STORE'
              ? 'ETown Tân Bình'
              : `Giao tận nơi: ${address}`,
          status: 'PENDING',
          notes: notes,
          created_at: new Date().toISOString(),
        });
        localStorage.setItem('thuecam_bookings', JSON.stringify(list));
      } catch {
        // ignore
      }
    }

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-[32px] border-2 border-sky-100 bg-white p-8 sm:p-12 text-center shadow-cute">
        <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="size-9" />
        </div>
        <h2 className="text-2xl font-black text-slate-900">
          Đã nhận yêu cầu thuê thiết bị! 🎉
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-slate-600 text-sm">
          THUECAM sẽ liên hệ qua SĐT/Zalo <strong>{phone}</strong> trong vòng 10 phút để xác nhận lịch máy và hướng dẫn bạn nhận máy tại <strong>ETown Tân Bình</strong> hoặc giao hỏa tốc.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="rounded-full bg-[#0284c7] px-6 py-2.5 text-xs font-black text-white hover:bg-[#0369a1]"
          >
            Gửi yêu cầu thuê khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[32px] border-2 border-sky-100 bg-white p-5 sm:p-8 shadow-cute space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Device select */}
        <label className="text-xs font-bold text-slate-700 sm:col-span-2">
          Chọn thiết bị bạn muốn thuê:
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-3 text-sm font-black text-slate-900 outline-none focus:border-[#0284c7]"
          >
            {products.map((item) => (
              <option key={item.id} value={item.slug}>
                {item.name} — {item.rental_price_per_day.toLocaleString('vi-VN')}đ/ngày
              </option>
            ))}
          </select>
        </label>

        {/* Schedule Calendar Table Section */}
        <div className="sm:col-span-2">
          <AvailabilityCalendarTable
            productId={product?.id}
            productName={product?.name}
            dailyPrice={product?.rental_price_per_day}
            depositAmount={product?.deposit_amount}
            startDate={startDate}
            endDate={endDate}
            onDateChange={(start, end) => {
              setStartDate(start);
              setEndDate(end);
            }}
          />
        </div>

        {/* Start / End Date pickers */}
        <label className="text-xs font-bold text-slate-700">
          Ngày nhận máy:
          <input
            required
            type="date"
            min={todayStr}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-[#0284c7]"
          />
        </label>

        <label className="text-xs font-bold text-slate-700">
          Ngày trả máy:
          <input
            required
            type="date"
            min={startDate || todayStr}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-[#0284c7]"
          />
        </label>

        {/* Customer Details */}
        <label className="text-xs font-bold text-slate-700">
          Họ và tên của bạn: *
          <input
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0284c7]"
            placeholder="Ví dụ: Nguyễn Văn A"
          />
        </label>

        <label className="text-xs font-bold text-slate-700">
          Số điện thoại / Zalo: *
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0284c7]"
            placeholder="09xx xxx xxx"
          />
        </label>

        <label className="text-xs font-bold text-slate-700">
          Email nhận phiếu thuê: *
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0284c7]"
            placeholder="ban@example.com"
          />
        </label>

        {/* Rental mode */}
        <div>
          <span className="block text-xs font-bold text-slate-700 mb-1.5">Hình thức thuê:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDuration('daily')}
              className={`flex-1 rounded-2xl py-2.5 text-xs font-black transition-all ${
                duration === 'daily'
                  ? 'bg-[#0284c7] text-white shadow-sm'
                  : 'bg-sky-50 text-slate-700 hover:bg-sky-100'
              }`}
            >
              <CalendarDays className="mr-1 inline size-3.5" /> Theo ngày (24h)
            </button>
            <button
              type="button"
              onClick={() => setDuration('hourly')}
              className={`flex-1 rounded-2xl py-2.5 text-xs font-black transition-all ${
                duration === 'hourly'
                  ? 'bg-[#0284c7] text-white shadow-sm'
                  : 'bg-sky-50 text-slate-700 hover:bg-sky-100'
              }`}
            >
              <Clock3 className="mr-1 inline size-3.5" /> Theo giờ (Trong ngày)
            </button>
          </div>
        </div>

        {/* Pickup Method */}
        <div className="sm:col-span-2">
          <span className="block text-xs font-bold text-slate-700 mb-1.5">
            Điểm nhận máy:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPickupMethod('STORE')}
              className={`rounded-2xl border p-3 text-left transition-all font-bold flex items-center gap-2.5 ${
                pickupMethod === 'STORE'
                  ? 'bg-sky-50 border-[#0284c7] text-[#0284c7]'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-sky-200'
              }`}
            >
              <MapPin className="size-4 shrink-0 text-[#0284c7]" />
              <div>
                <span className="block text-xs font-black">Nhận máy tại ETown Tân Bình</span>
                <span className="block text-[11px] text-slate-500 font-normal">Cộng Hòa, Tân Bình, TP HCM</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPickupMethod('DELIVERY')}
              className={`rounded-2xl border p-3 text-left transition-all font-bold flex items-center gap-2.5 ${
                pickupMethod === 'DELIVERY'
                  ? 'bg-sky-50 border-[#0284c7] text-[#0284c7]'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-sky-200'
              }`}
            >
              <Truck className="size-4 shrink-0 text-[#0284c7]" />
              <div>
                <span className="block text-xs font-black">Giao hỏa tốc 30 phút</span>
                <span className="block text-[11px] text-slate-500 font-normal">Ship tận tay nội thành TP.HCM</span>
              </div>
            </button>
          </div>
        </div>

        {pickupMethod === 'DELIVERY' && (
          <label className="text-xs font-bold text-slate-700 sm:col-span-2">
            Địa chỉ nhận máy: *
            <input
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1.5 w-full rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0284c7]"
              placeholder="Số nhà, tên đường, phường, quận..."
            />
          </label>
        )}

        <label className="text-xs font-bold text-slate-700 sm:col-span-2">
          Ghi chú thêm:
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1.5 min-h-20 w-full rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm font-medium outline-none focus:border-[#0284c7]"
            placeholder="Bạn cần thêm chân máy, kính lọc, pin phụ hoặc yêu cầu giờ giao máy cụ thể?"
          />
        </label>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-sky-100">
        <p className="text-xs text-slate-500">
          Sau khi gửi, THUECAM sẽ liên hệ xác nhận lịch và giữ máy cho bạn ngay.
        </p>

        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0284c7] hover:bg-[#0369a1] px-8 py-3.5 text-sm font-black text-white shadow-cute transition-all hover:scale-105"
        >
          <span>Gửi Yêu Cầu Thuê Ngay</span>
          <Send className="size-4" />
        </button>
      </div>
    </form>
  );
}
