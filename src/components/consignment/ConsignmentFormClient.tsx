'use client';

import { useState } from 'react';
import { CheckCircle2, Send } from 'lucide-react';

const inputClass = 'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100';
const labelClass = 'block space-y-1.5 text-sm font-semibold text-slate-700';

export default function ConsignmentFormClient() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      const response = await fetch('/api/public/consignment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error ?? data.message ?? 'Không thể gửi đơn.');
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể gửi đơn.');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="flex flex-col items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        <p className="text-lg font-bold text-slate-900">Đã gửi đơn đăng ký ký gửi</p>
        <p className="max-w-sm text-sm text-slate-600">
          THUECAM sẽ liên hệ bạn trong vòng 24 giờ làm việc để kiểm tra thiết bị và thống nhất tỷ lệ chia doanh thu. Sau khi duyệt, bạn sẽ nhận tài khoản theo dõi đơn thuê.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Họ và tên *
          <input name="fullName" required minLength={2} maxLength={100} className={inputClass} placeholder="Nguyễn Văn A" />
        </label>
        <label className={labelClass}>
          Số điện thoại / Zalo *
          <input name="phone" required inputMode="tel" pattern="0[0-9\s.\-]{9,12}" className={inputClass} placeholder="0932501411" />
        </label>
        <label className={labelClass}>
          Email
          <input name="email" type="email" maxLength={200} className={inputClass} placeholder="ban@gmail.com" />
        </label>
        <label className={labelClass}>
          Khu vực
          <input name="city" maxLength={100} className={inputClass} placeholder="TP.HCM" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>
          Thiết bị muốn ký gửi *
          <input name="deviceName" required minLength={2} maxLength={150} className={inputClass} placeholder="DJI Osmo Pocket 3 Creator Combo" />
        </label>
        <label className={labelClass}>
          Hãng
          <input name="deviceBrand" maxLength={100} className={inputClass} placeholder="DJI, GoPro, Insta360..." />
        </label>
        <label className={labelClass}>
          Tình trạng
          <select name="deviceCondition" className={inputClass} defaultValue="Như mới">
            <option>Mới 100%</option>
            <option>Như mới</option>
            <option>Đã qua sử dụng tốt</option>
            <option>Có trầy xước nhẹ</option>
          </select>
        </label>
        <label className={labelClass}>
          Số lượng *
          <input name="quantity" type="number" required min={1} max={50} defaultValue={1} className={inputClass} />
        </label>
        <label className={labelClass}>
          Năm mua
          <input name="purchaseYear" type="number" min={2000} max={2100} className={inputClass} placeholder="2025" />
        </label>
      </div>

      <label className={labelClass}>
        Ghi chú thêm
        <textarea name="note" rows={3} maxLength={2000} className={inputClass} placeholder="Phụ kiện kèm theo, thời gian muốn ký gửi, mong muốn chia doanh thu..." />
      </label>

      {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</p>}

      <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-700 disabled:opacity-60">
        <Send className="h-4 w-4" />
        {submitting ? 'Đang gửi...' : 'Gửi đơn đăng ký ký gửi'}
      </button>
    </form>
  );
}
