import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Clock3, MapPin, Sparkles } from 'lucide-react';
import { getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Thuê camera theo ngày | THUECAM',
  description: 'Xem toàn bộ thiết bị và giá thuê theo ngày tại THUECAM.',
  canonicalPath: '/thue-theo-ngay',
});

const formatPrice = (price: number) => `${Math.round(price / 1000).toLocaleString('vi-VN')}K`;

export default async function HourlyRentalPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-[#f0f7ff] text-slate-900">
      <section className="border-b border-[#bae6fd] bg-[#f8fbff]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-[#0284c7]"><Clock3 className="size-3.5" /> Thuê theo ngày</span>
          <h1 className="mt-5  text-4xl font-black tracking-tight sm:text-6xl">Máy ngon đã có, chỉ thiếu người quay</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">Chọn thiết bị phù hợp cho buổi quay ngắn, review sản phẩm, TikTok hoặc sự kiện. Giá minh bạch, nhận máy gọn gàng.</p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm font-black"><span className="rounded-full bg-white px-4 py-2 shadow-sm">Chỉ từ 120.000đ / ngày</span><span className="rounded-full bg-white px-4 py-2 shadow-sm"><MapPin className="mr-1 inline size-4 text-[#0284c7]" />ETown, Tân Bình, TP HCM</span></div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.16em] text-[#0284c7]">Bảng giá theo giờ</p><h2 className="mt-2 text-3xl font-black">Chọn máy bạn cần</h2></div><span className="hidden text-sm text-slate-500 sm:block">{products.length} thiết bị</span></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article key={product.id} className="overflow-hidden rounded-[2rem] border border-[#bae6fd] bg-white shadow-[0_16px_35px_-26px_rgba(31,41,55,.5)] transition hover:-translate-y-1 hover:shadow-xl">
              <div className="relative bg-[#f0f9ff] p-4">
                <span className="absolute left-6 top-6 rounded-full bg-[#e0f2fe] px-3 py-1 text-xs font-black text-[#0369a1]">
                  Có thể thuê
                </span>

                <img
                  src={product.primary_image}
                  alt={product.name}
                  className="h-56 w-full rounded-[1.5rem] object-contain"
                />
              </div>
              <div className="flex flex-col gap-4 p-5"><div><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{product.category?.name ?? 'Thiết bị quay'}</p><h3 className="mt-1 text-lg font-black">{product.name}</h3></div><div className="flex items-end justify-between gap-3"><div><p className="text-xs text-slate-500">Giá 6 tiếng từ</p><p className="text-2xl font-black text-[#0284c7]">{formatPrice(Math.max(200000, product.rental_price_per_day * 0.75))}<span className="text-sm">/6h</span></p></div><Link href={`/dat-thue?product=${product.slug}&duration=hourly`} className="inline-flex items-center gap-1 rounded-full bg-[#0284c7] px-4 py-2.5 text-xs font-black text-white shadow-[0_10px_20px_-12px_#0284c7] hover:bg-[#0369a1]">{product.status === 'ACTIVE' && product.inventory_count > 0 ? 'Đặt thuê ngay' : 'Xem lịch'} <ArrowRight className="size-3.5" /></Link></div></div>
            </article>
          ))}
        </div>

      </section>
    </main>
  );
}
