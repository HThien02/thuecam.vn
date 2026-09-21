'use client';

import { useState } from 'react';
import { Product } from '@/types';
import { CalendarDays, CheckCircle2, Clock3, Send } from 'lucide-react';

export default function RentalRequestForm({ products, initialProduct }: { products: Product[]; initialProduct?: Product }) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(initialProduct?.slug ?? products[0]?.slug ?? '');
  const product = products.find((item) => item.slug === selectedProduct) ?? initialProduct ?? products[0];
  const [duration, setDuration] = useState<'hourly' | 'daily'>('hourly');

  if (submitted) return <div className="rounded-[2rem] bg-[#e4f8ed] p-10 text-center"><CheckCircle2 className="mx-auto size-12 text-[#168267]" /><h2 className="mt-4 text-2xl font-black">Đã nhận thông tin của bạn</h2><p className="mx-auto mt-2 max-w-lg text-slate-600">THUECAM sẽ liên hệ qua số điện thoại hoặc Zalo để xác nhận lịch, giá thuê và cách nhận máy.</p></div>;

  return <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }} className="rounded-[2rem] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(31,41,55,.55)] sm:p-8">
    <div className="grid gap-5 sm:grid-cols-2">
      <label className="text-sm font-bold">Họ và tên<input required className="mt-2 w-full rounded-2xl border-0 bg-[#f5f5f7] px-4 py-3 outline-none ring-[#ff6b9a] focus:ring-2" placeholder="Nguyễn Văn A" /></label>
      <label className="text-sm font-bold">Số điện thoại / Zalo<input required type="tel" className="mt-2 w-full rounded-2xl border-0 bg-[#f5f5f7] px-4 py-3 outline-none ring-[#ff6b9a] focus:ring-2" placeholder="09xx xxx xxx" /></label>
      <label className="text-sm font-bold">Email<input type="email" className="mt-2 w-full rounded-2xl border-0 bg-[#f5f5f7] px-4 py-3 outline-none ring-[#ff6b9a] focus:ring-2" placeholder="ban@example.com" /></label>
      <label className="text-sm font-bold">Thiết bị<select value={selectedProduct} onChange={(event) => setSelectedProduct(event.target.value)} className="mt-2 w-full rounded-2xl border-0 bg-[#f5f5f7] px-4 py-3 outline-none ring-[#ff6b9a] focus:ring-2">{products.map((item) => <option key={item.id} value={item.slug}>{item.name}</option>)}</select></label>
      <div className="sm:col-span-2"><p className="text-sm font-bold">Bạn muốn thuê trong bao lâu?</p><div className="mt-2 flex flex-wrap gap-2"><button type="button" onClick={() => setDuration('hourly')} className={`rounded-full px-4 py-2 text-sm font-black ${duration === 'hourly' ? 'bg-[#168267] text-white' : 'bg-[#e4f8ed] text-[#168267]'}`}><Clock3 className="mr-1 inline size-4" />Theo giờ</button><button type="button" onClick={() => setDuration('daily')} className={`rounded-full px-4 py-2 text-sm font-black ${duration === 'daily' ? 'bg-[#168267] text-white' : 'bg-[#e4f8ed] text-[#168267]'}`}><CalendarDays className="mr-1 inline size-4" />Theo ngày</button></div></div>
      <label className="text-sm font-bold">Ngày nhận<input required type="date" className="mt-2 w-full rounded-2xl border-0 bg-[#f5f5f7] px-4 py-3 outline-none ring-[#ff6b9a] focus:ring-2" /></label>
      <label className="text-sm font-bold">Ngày trả<input required type="date" className="mt-2 w-full rounded-2xl border-0 bg-[#f5f5f7] px-4 py-3 outline-none ring-[#ff6b9a] focus:ring-2" /></label>
      <label className="text-sm font-bold sm:col-span-2">Ghi chú<textarea className="mt-2 min-h-28 w-full rounded-2xl border-0 bg-[#f5f5f7] px-4 py-3 outline-none ring-[#ff6b9a] focus:ring-2" placeholder="Bạn cần thêm phụ kiện hoặc giao máy ở đâu?" /></label>
    </div>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#fff5d9] p-4"><p className="text-sm text-slate-600">Thiết bị: <strong>{product?.name}</strong><br />Giá tham khảo: <strong>{product?.rental_price_per_day.toLocaleString('vi-VN')}đ/ngày</strong></p><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#ff6b9a] px-6 py-3 font-black text-white shadow-lg shadow-pink-200 hover:bg-[#ed5688]">Gửi yêu cầu thuê <Send className="size-4" /></button></div>
  </form>;
}
