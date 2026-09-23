'use client';

import { useMemo, useState } from 'react';
import { Product } from '@/types';
import { CalendarDays, CheckCircle2, Clock3, Send } from 'lucide-react';

const toDateKey = (date: Date) => date.toISOString().slice(0, 10);
const formatDate = (key: string) => new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(new Date(`${key}T12:00:00`));

export default function RentalRequestForm({ products, initialProduct }: { products: Product[]; initialProduct?: Product }) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(initialProduct?.slug ?? products[0]?.slug ?? '');
  const [duration, setDuration] = useState<'hourly' | 'daily'>('hourly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const product = products.find((item) => item.slug === selectedProduct) ?? initialProduct ?? products[0];
  const today = toDateKey(new Date());
  const availableDates = useMemo(() => Array.from({ length: 21 }, (_, index) => { const date = new Date(); date.setDate(date.getDate() + index); return toDateKey(date); }), []);
  const reservedDates = useMemo(() => availableDates.filter((_, index) => index === 4 || index === 11 || (index > 14 && index % 3 === 0)), [availableDates]);
  const isAvailable = (date: string) => !reservedDates.includes(date);
  const selectedRange = startDate && endDate ? availableDates.filter((date) => date >= startDate && date <= endDate) : [];
  const rangeAvailable = startDate && endDate ? selectedRange.length > 0 && selectedRange.every(isAvailable) : true;
  const estimatedDays = startDate && endDate ? Math.max(1, Math.ceil((new Date(`${endDate}T12:00:00`).getTime() - new Date(`${startDate}T12:00:00`).getTime()) / 86400000) + 1) : 1;

  if (submitted) return <div className="rounded-[2rem] bg-[#e3f4ff] p-10 text-center"><CheckCircle2 className="mx-auto size-12 text-[#1976b9]" /><h2 className="mt-4 text-2xl font-black">Đã nhận thông tin của bạn</h2><p className="mx-auto mt-2 max-w-lg text-slate-600">THUECAM sẽ liên hệ qua số điện thoại hoặc Zalo để xác nhận lịch, giá thuê và cách nhận máy.</p></div>;

  return <form onSubmit={(event) => { event.preventDefault(); if (!rangeAvailable) return; setSubmitted(true); }} className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(31,41,55,.55)] sm:p-8">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-bold">Họ và tên<input required className="mt-2 w-full rounded-2xl border-0 bg-[#f2f7fb] px-4 py-3 outline-none ring-[#55aee8] focus:ring-2" placeholder="Nguyễn Văn A" /></label>
      <label className="text-sm font-bold">Số điện thoại / Zalo<input required type="tel" className="mt-2 w-full rounded-2xl border-0 bg-[#f2f7fb] px-4 py-3 outline-none ring-[#55aee8] focus:ring-2" placeholder="09xx xxx xxx" /></label>
      <label className="text-sm font-bold">Email<input type="email" className="mt-2 w-full rounded-2xl border-0 bg-[#f2f7fb] px-4 py-3 outline-none ring-[#55aee8] focus:ring-2" placeholder="ban@example.com" /></label>
      <label className="text-sm font-bold">Thiết bị<select value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)} className="mt-2 w-full rounded-2xl border-0 bg-[#f2f7fb] px-4 py-3 outline-none ring-[#55aee8] focus:ring-2">{products.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>
      <div className="sm:col-span-2"><p className="text-sm font-bold">Bạn muốn thuê trong bao lâu?</p><div className="mt-2 flex flex-wrap gap-2"><button type="button" onClick={() => setDuration('hourly')} className={`rounded-full px-4 py-2 text-sm font-black ${duration === 'hourly' ? 'bg-[#1976b9] text-white' : 'bg-[#e3f4ff] text-[#1976b9]'}`}><Clock3 className="mr-1 inline size-4" />Theo giờ</button><button type="button" onClick={() => setDuration('daily')} className={`rounded-full px-4 py-2 text-sm font-black ${duration === 'daily' ? 'bg-[#1976b9] text-white' : 'bg-[#e3f4ff] text-[#1976b9]'}`}><CalendarDays className="mr-1 inline size-4" />Theo ngày</button></div></div>
      <div className="sm:col-span-2 rounded-3xl bg-[#f3f9fd] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm font-black">Lịch máy còn trống</p><div className="flex gap-3 text-xs font-semibold"><span className="text-emerald-600">● Còn máy</span><span className="text-slate-400">● Đã kín</span></div></div><div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-7">{availableDates.map((date) => <button key={date} type="button" disabled={!isAvailable(date)} onClick={() => !startDate || (startDate && endDate) ? (setStartDate(date), setEndDate('')) : setEndDate(date)} className={`rounded-xl px-2 py-2 text-xs font-bold ${!isAvailable(date) ? 'cursor-not-allowed bg-slate-200 text-slate-400 line-through' : date === startDate || date === endDate ? 'bg-[#1976b9] text-white' : 'bg-white text-slate-700 ring-1 ring-[#c8e5f7] hover:bg-[#e3f4ff]'}`}>{formatDate(date)}<span className="mt-1 block text-[10px] font-medium">{isAvailable(date) ? 'Còn' : 'Kín'}</span></button>)}</div><p className="mt-3 text-xs text-slate-500">Chọn ngày nhận trước, sau đó chọn ngày trả. Ngày kín được đánh dấu để bạn dễ đổi lịch.</p></div>
      <label className="text-sm font-bold">Ngày nhận<input required min={today} value={startDate} onChange={(event) => setStartDate(event.target.value)} type="date" className="mt-2 w-full rounded-2xl border-0 bg-[#f2f7fb] px-4 py-3 outline-none ring-[#55aee8] focus:ring-2" /></label>
      <label className="text-sm font-bold">Ngày trả<input required min={startDate || today} value={endDate} onChange={(event) => setEndDate(event.target.value)} type="date" className="mt-2 w-full rounded-2xl border-0 bg-[#f2f7fb] px-4 py-3 outline-none ring-[#55aee8] focus:ring-2" /></label>
      <label className="text-sm font-bold sm:col-span-2">Ghi chú<textarea className="mt-2 min-h-28 w-full rounded-2xl border-0 bg-[#f2f7fb] px-4 py-3 outline-none ring-[#55aee8] focus:ring-2" placeholder="Bạn cần thêm phụ kiện hoặc giao máy ở đâu?" /></label>
    </div>
    <div className={`mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4 ${rangeAvailable ? 'bg-[#e3f4ff]' : 'bg-rose-50'}`}><p className="text-sm text-slate-600">Thiết bị: <strong>{product?.name}</strong><br />{startDate && endDate ? <>Lịch đã chọn: <strong>{formatDate(startDate)} – {formatDate(endDate)} ({estimatedDays} ngày)</strong></> : <>Chọn ngày để xem lịch và giá thuê</>}</p><button type="submit" disabled={!rangeAvailable} className="inline-flex items-center gap-2 rounded-full bg-[#1976b9] px-6 py-3 font-black text-white shadow-lg shadow-blue-200 hover:bg-[#125e95] disabled:cursor-not-allowed disabled:bg-slate-300">{rangeAvailable ? 'Gửi yêu cầu thuê' : 'Vui lòng đổi ngày'} <Send className="size-4" /></button></div>
  </form>;
}
