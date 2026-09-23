import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock3, MapPin, Sparkles } from 'lucide-react';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê camera theo giờ | THUECAM',
  description: 'Xem toàn bộ thiết bị và giá thuê theo giờ tại THUECAM.',
  canonicalPath: '/thue-theo-gio',
});

const formatPrice = (price: number) => `${Math.round(price / 1000).toLocaleString('vi-VN')}K`;

export default async function HourlyRentalPage() {
  const products = (await getProducts()).filter((product) => product.status === 'ACTIVE');

  return (
    <main className="min-h-screen bg-[#f3f9fd] text-[#142b45]">
      <section className="border-b border-[#cfe7f7] bg-[#eaf6ff]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#d9f4e9] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#168267]"><Clock3 className="size-3.5" /> Thuê theo giờ</span>
          <h1 className="mt-5 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">Thuê máy theo giờ, quay nhanh vẫn thật vui</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">Chọn thiết bị phù hợp cho buổi quay ngắn, review sản phẩm, TikTok hoặc sự kiện. Giá minh bạch, nhận máy gọn gàng.</p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm font-black"><span className="rounded-full bg-white px-4 py-2 shadow-sm">Từ 200.000đ / 6 tiếng</span><span className="rounded-full bg-white px-4 py-2 shadow-sm"><MapPin className="mr-1 inline size-4 text-[#ff6b9a]" />ETown, Tân Bình, TP HCM</span></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#ff6b9a]">Bảng giá theo giờ</p><h2 className="mt-2 text-3xl font-black">Chọn máy bạn cần</h2></div><span className="hidden text-sm text-slate-500 sm:block">{products.length} thiết bị đang sẵn sàng</span></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[2rem] border border-[#f3dce5] bg-white shadow-[0_16px_35px_-26px_rgba(31,41,55,.5)] transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative bg-[#f8f7f5] p-4"><span className="absolute left-6 top-6 rounded-full bg-[#d9f4e9] px-3 py-1 text-xs font-black text-[#168267]">Còn máy</span><img src={product.primary_image} alt={product.name} className="h-56 w-full rounded-[1.5rem] object-contain" /></div>
              <div className="flex flex-col gap-4 p-5"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{product.category?.name ?? 'Thiết bị quay'}</p><h3 className="mt-1 text-lg font-black">{product.name}</h3></div><div className="flex items-end justify-between gap-3"><div><p className="text-xs text-slate-500">Giá 6 tiếng từ</p><p className="text-2xl font-black text-[#168267]">{formatPrice(Math.max(200000, product.rental_price_per_day * 0.75))}<span className="text-sm">/6h</span></p></div><Link href={`/dat-thue?product=${product.slug}&duration=hourly`} className="inline-flex items-center gap-1 rounded-full bg-[#ff6b9a] px-4 py-2.5 text-xs font-black text-white shadow-[0_10px_20px_-12px_#ff6b9a] hover:bg-[#ed5688]">Đặt thuê ngay <ArrowRight className="size-3.5" /></Link></div></div>
            </article>
          ))}
        </div>
        <div className="mt-10 rounded-[2rem] bg-[#fff0c9] p-6 text-sm leading-7 text-slate-700"><Sparkles className="mb-2 size-5 text-[#e39a2d]" /><strong>Cách tính dễ hiểu:</strong> thuê đến 12 giờ tính 0,5 ngày; trên 12 đến 24 giờ tính 1 ngày. Shop sẽ xác nhận lịch và mức giá cuối qua tin nhắn.</div>
      </section>
    </main>
  );
}
