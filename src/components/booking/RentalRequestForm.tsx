'use client';

import React, { useCallback, useState } from 'react';
import { Product } from '@/types';
import { CheckCircle2, Clock3, CalendarDays, Send, MapPin, Truck, AlertCircle } from 'lucide-react';
import AvailabilityCalendarTable from './AvailabilityCalendarTable';
import SafeButton from '@/components/common/SafeButton';
import {
  isValidVietnamPhone,
  isValidEmail,
  isValidName,
  PHONE_VALIDATION_ERROR,
  EMAIL_VALIDATION_ERROR,
  NAME_VALIDATION_ERROR,
} from '@/lib/security/validation';

export default function RentalRequestForm({
  products,
  initialProduct,
}: {
  products: Product[];
  initialProduct?: Product;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingCode, setBookingCode] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(
    initialProduct?.slug ?? products[0]?.slug ?? ''
  );
  const [duration, setDuration] = useState<'hourly' | 'daily'>('daily');
  const [pickupTime, setPickupTime] = useState('09:00');
  const [rangeAvailability, setRangeAvailability] = useState<boolean | null>(null);
  const updateRangeAvailability = useCallback((isAvailable: boolean | null) => setRangeAvailability(isAvailable), []);
  const pickupMethod: 'STORE' | 'DELIVERY' = pickupTime >= '08:00' && pickupTime <= '18:00' ? 'STORE' : 'DELIVERY';

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  const product =
    products.find((item) => item.slug === selectedProduct) ??
    initialProduct ??
    products[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!isValidName(fullName)) newErrors.fullName = NAME_VALIDATION_ERROR;
    if (!isValidVietnamPhone(phone)) newErrors.phone = PHONE_VALIDATION_ERROR;
    if (!isValidEmail(email)) newErrors.email = EMAIL_VALIDATION_ERROR;
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(pickupTime)) newErrors.pickupTime = 'Vui lòng chọn giờ nhận máy hợp lệ.';
    if (rangeAvailability !== true) newErrors.submit = rangeAvailability === false ? 'Lịch đã kín trong ngày bạn chọn. Vui lòng chọn thiết bị hoặc ngày khác.' : 'Đang kiểm tra lịch trống. Vui lòng chờ một chút rồi gửi lại.';
    if (pickupMethod === 'DELIVERY' && (!address || address.trim().length < 5)) {
      newErrors.address = 'Vui lòng nhập địa chỉ giao máy cụ thể (tối thiểu 5 ký tự).';
    }
    if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
      newErrors.endDate = 'Ngày trả máy không thể trước ngày nhận máy.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (!product) {
      setErrors({ submit: 'Vui lòng chọn thiết bị cần thuê.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          start_date: startDate,
          end_date: endDate,
          customer_name: fullName,
          customer_phone: phone,
          customer_email: email,
          pickup_method: pickupMethod,
          pickup_time: pickupTime,
          delivery_address: address,
          note: notes,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Không thể gửi yêu cầu thuê.');
      setBookingCode(result.booking_code);
      setSubmitted(true);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Không thể gửi yêu cầu thuê.' });
    } finally {
      setIsSubmitting(false);
    }
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
            THUECAM sẽ liên hệ qua SĐT/Zalo <strong>{phone}</strong> trong vòng 10 phút để xác nhận lịch máy. Giờ nhận {pickupTime} — {pickupMethod === 'STORE' ? 'nhận tại ETown Tân Bình' : 'giao hỏa tốc đến địa chỉ đã chọn'}.
          </p>
        <p className="mt-4 text-sm font-bold text-sky-800">Mã yêu cầu: {bookingCode}</p>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setBookingCode('');
            }}
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
                {item.name}{item.status !== 'ACTIVE' ? ' · Tạm ẩn, full lịch' : ''} — {item.rental_price_per_day.toLocaleString('vi-VN')}đ/ngày
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
            onRangeAvailabilityChange={updateRangeAvailability}
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

        <label className="text-xs font-bold text-slate-700">
          Giờ nhận máy: *
          <input
            required
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            aria-describedby="pickup-time-guidance"
            className="mt-1.5 w-full rounded-2xl border border-sky-200 bg-sky-50/50 px-4 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-[#0284c7]"
          />
          <span id="pickup-time-guidance" className="mt-1 block text-[11px] font-medium text-slate-500">
            08:00–18:00 nhận tại ETown; ngoài khung giờ sẽ tự chuyển sang giao hỏa tốc.
          </span>
        </label>

        {/* Customer Details */}
        <label className="text-xs font-bold text-slate-700">
          Họ và tên của bạn: *
          <input
            required
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
            }}
            className={`mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm font-medium outline-none transition ${
              errors.fullName
                ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                : 'border-sky-200 bg-sky-50/50 focus:border-[#0284c7]'
            }`}
            placeholder="Ví dụ: Nguyễn Văn A"
          />
          {errors.fullName && (
            <span className="mt-1 text-[11px] text-rose-500 font-bold block">
              {errors.fullName}
            </span>
          )}
        </label>

        <label className="text-xs font-bold text-slate-700">
          Số điện thoại / Zalo (Bắt đầu từ 0, đủ 10 số): *
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
            }}
            className={`mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm font-medium outline-none transition ${
              errors.phone
                ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                : 'border-sky-200 bg-sky-50/50 focus:border-[#0284c7]'
            }`}
            placeholder="09xx xxx xxx"
          />
          {errors.phone && (
            <span className="mt-1 text-[11px] text-rose-500 font-bold block">
              {errors.phone}
            </span>
          )}
        </label>

        <label className="text-xs font-bold text-slate-700">
          Email nhận phiếu thuê: *
          <input
            required
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            className={`mt-1.5 w-full rounded-2xl border px-4 py-2.5 text-sm font-medium outline-none transition ${
              errors.email
                ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500'
                : 'border-sky-200 bg-sky-50/50 focus:border-[#0284c7]'
            }`}
            placeholder="ban@example.com"
          />
          {errors.email && (
            <span className="mt-1 text-[11px] text-rose-500 font-bold block">
              {errors.email}
            </span>
          )}
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

        <div className="sm:col-span-2 rounded-2xl border border-sky-200 bg-sky-50/70 p-4 text-xs text-slate-700" role="status" aria-live="polite">
          {pickupMethod === 'STORE' ? (
            <span className="flex items-center gap-2 font-bold"><MapPin className="size-4 text-sky-700" /> Nhận máy tại ETown Tân Bình lúc {pickupTime}.</span>
          ) : (
            <span className="flex items-center gap-2 font-bold"><Truck className="size-4 text-sky-700" /> Ngoài giờ hành chính — THUECAM sẽ giao hỏa tốc lúc {pickupTime}.</span>
          )}
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

      {rangeAvailability === false && <p role="alert" className="text-sm font-semibold text-rose-600 sm:text-right">Khoảng ngày đang chọn đã kín lịch. Hãy chọn ngày khác.</p>}
      {errors.submit && <p role="alert" className="text-sm font-semibold text-rose-600">{errors.submit}</p>}
      <SafeButton
        type="submit"
        disabled={isSubmitting || !product || rangeAvailability !== true}
        isLoading={isSubmitting}
        loadingText="Đang gửi yêu cầu..."
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0284c7] hover:bg-[#0369a1] px-8 py-3.5 text-sm font-black text-white shadow-cute transition-all hover:scale-105"
        >
          <span>Gửi Yêu Cầu Thuê Ngay</span>
          <Send className="size-4" />
        </SafeButton>
      </div>
    </form>
  );
}
