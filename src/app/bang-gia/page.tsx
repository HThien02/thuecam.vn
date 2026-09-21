import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarCheck2, Check, CircleHelp, Sparkles } from 'lucide-react';
import { getCategories, getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = constructMetadata({
  title: 'Bảng giá thuê camera, máy ảnh & flycam | THUECAM',
  description:
    'Xem nhanh bảng giá thuê camera, máy ảnh, flycam, gimbal và micro theo ngày tại THUECAM.',
  canonicalPath: '/bang-gia',
});

const formatPrice = (price: number) => `${Math.round(price / 1000)}K`;

export default async function PricingPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  const activeProducts = products.filter((product) => product.status === 'ACTIVE');

  return (
    <main className="min-h-screen bg-[#fbfaf4] text-[#17352e]">
      <section className="border-b border-[#e5defc] bg-[#fffdf5]">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d6caff] bg-[#f2edff] px-3 py-1 text-xs font-bold text-[#6d55c7]">
              <Sparkles className="size-3.5" />
              BẢNG GIÁ THUECAM
            </span>
            <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-[#17352e] sm:text-5xl">
              Giá thuê rõ ràng, chọn máy thật dễ
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#527268]">
              Xem giá theo ngày của từng thiết bị. Thuê càng lâu càng tiết kiệm, phụ kiện cơ bản đã được chuẩn bị sẵn để bạn nhận máy và bắt đầu quay ngay.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/thiet-bi" className="inline-flex items-center gap-2 rounded-full bg-[#6d55c7] px-5 py-3 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(109,85,199,0.7)] transition-transform hover:-translate-y-0.5">
                Xem toàn bộ thiết bị <ArrowRight className="size-4" />
              </Link>
              <Link href="/search" className="inline-flex items-center gap-2 rounded-full border border-[#f0c47b] bg-white px-5 py-3 text-sm font-bold text-[#17352e] hover:bg-[#fff8e8]">
                <CalendarCheck2 className="size-4 text-[#f09b45]" /> Kiểm tra lịch trống
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <aside className="h-fit rounded-3xl border border-[#e5defc] bg-white p-4 shadow-[0_12px_35px_-24px_rgba(23,53,46,0.35)] lg:sticky lg:top-28">
          <p className="px-2 pb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#718981]">Danh mục</p>
          <nav className="flex flex-wrap gap-2 lg:flex-col">
            {categories.map((category) => (
              <Link key={category.id} href={`/danh-muc/${category.slug}`} className="rounded-2xl bg-[#fbfaf4] px-3 py-2 text-sm font-bold text-[#527268] transition-colors hover:bg-[#f2edff] hover:text-[#6d55c7]">
                {category.name}
              </Link>
            ))}
          </nav>
          <div className="mt-5 rounded-2xl bg-[#dff3eb] p-3 text-xs leading-5 text-[#438e72]">
            <CircleHelp className="mb-1 size-4" />
            Chưa biết chọn máy nào? Nhắn để được gợi ý theo nhu cầu.
          </div>
        </aside>

        <div className="space-y-8">
          {categories.map((category) => {
            const categoryProducts = activeProducts.filter((product) => product.category_id === category.id);
            if (categoryProducts.length === 0) return null;

            return (
              <section key={category.id} id={category.slug} className="scroll-mt-28">
                <div className="mb-3 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#f09b45]">Giá thuê theo danh mục</p>
                    <h2 className="mt-1 text-2xl font-black text-[#17352e]">{category.name}</h2>
                  </div>
                  <Link href={`/danh-muc/${category.slug}`} className="hidden items-center gap-1 text-xs font-bold text-[#6d55c7] hover:underline sm:flex">
                    Xem danh mục <ArrowRight className="size-3.5" />
                  </Link>
                </div>
                <div className="overflow-hidden rounded-3xl border border-[#e5defc] bg-white shadow-[0_14px_35px_-28px_rgba(23,53,46,0.5)]">
                  <div className="hidden grid-cols-[minmax(220px,1.5fr)_110px_repeat(3,90px)_90px] gap-3 bg-[#f2edff] px-5 py-3 text-[10px] font-black uppercase tracking-wide text-[#718981] md:grid">
                    <span>Thiết bị</span><span>Giá từ</span><span>1 ngày</span><span>3 ngày</span><span>7+ ngày</span><span>Chi tiết</span>
                  </div>
                  <div className="divide-y divide-[#eeeafa]">
                    {categoryProducts.map((product) => (
                      <div key={product.id} className="grid gap-3 px-4 py-4 transition-colors hover:bg-[#fffdf5] md:grid-cols-[minmax(220px,1.5fr)_110px_repeat(3,90px)_90px] md:items-center md:px-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <img src={product.primary_image} alt="" className="size-12 shrink-0 rounded-2xl border border-[#e5defc] bg-[#fbfaf4] object-cover" />
                          <div className="min-w-0">
                            <Link href={`/thiet-bi/${product.slug}`} className="block truncate text-sm font-black text-[#17352e] hover:text-[#6d55c7]">{product.name}</Link>
                            <span className="text-xs text-[#718981]">Đã gồm phụ kiện cơ bản</span>
                          </div>
                        </div>
                        <div className="text-sm font-black text-[#6d55c7]">{formatPrice(product.rental_price_per_day)}<span className="text-[10px]">/ngày</span></div>
                        <div className="hidden text-sm font-bold text-[#527268] md:block">{product.rental_price_per_day.toLocaleString('vi-VN')}đ</div>
                        <div className="hidden text-sm font-bold text-[#527268] md:block">{Math.round(product.rental_price_per_day * 0.9).toLocaleString('vi-VN')}đ</div>
                        <div className="hidden text-sm font-bold text-[#527268] md:block">{Math.round(product.rental_price_per_day * 0.8).toLocaleString('vi-VN')}đ</div>
                        <Link href={`/thiet-bi/${product.slug}`} className="inline-flex items-center gap-1 text-xs font-black text-[#f09b45] hover:underline">Xem giá <ArrowRight className="size-3" /></Link>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}

          <div className="grid gap-4 rounded-3xl border border-[#f0c47b] bg-[#fff8e8] p-5 sm:grid-cols-3">
            {['Giá hiển thị đã gồm VAT', 'Có phụ kiện cơ bản đi kèm', 'Hỗ trợ chọn máy miễn phí'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm font-bold text-[#527268]"><Check className="size-4 rounded-full bg-[#dff3eb] p-0.5 text-[#438e72]" />{item}</div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
