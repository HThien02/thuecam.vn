import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarCheck2, Sparkles } from 'lucide-react';
import { getCategories, getProducts } from '@/lib/data';
import { constructMetadata } from '@/lib/seo/metadata';
import PricingTableClient from '@/components/pricing/PricingTableClient';

export const metadata: Metadata = constructMetadata({
  title: 'Bảng giá thuê camera, máy ảnh & flycam | THUECAM',
  description:
    'Xem nhanh bảng giá thuê camera, máy ảnh, flycam, gimbal và micro theo ngày tại THUECAM. Nhận máy tại ETown Tân Bình hoặc ship 30p.',
  canonicalPath: '/bang-gia',
});

export default async function PricingPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);

  return (
    <main className="min-h-screen bg-[#f0f7ff] text-[#0c2340]">
      {/* Hero Header Section */}
      <section className="border-b border-sky-100 bg-gradient-to-b from-white to-[#e0f2fe]/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-100 px-3.5 py-1 text-xs font-black text-[#0284c7]">
              <Sparkles className="size-3.5" />
              BẢNG GIÁ THUECAM 📸
            </span>
            <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
              Giá thuê rõ ràng, chọn máy thật dễ
            </h1>
            <p className="mt-4 text-base leading-8 text-[#334e68] font-medium">
              Xem giá theo ngày của từng thiết bị. Thuê càng lâu càng tiết kiệm, phụ kiện cơ bản (thẻ nhớ, pin sạc, túi đựng) đã được chuẩn bị sẵn để bạn nhận máy tại <strong>ETown Tân Bình</strong> và bắt đầu quay ngay!
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/dat-thue"
                className="inline-flex items-center gap-2 rounded-full bg-[#0284c7] px-6 py-3.5 text-sm font-black text-white shadow-cute hover:bg-[#0369a1] transition-transform hover:-translate-y-0.5"
              >
                <CalendarCheck2 className="size-4" /> Kiểm tra lịch máy trống
              </Link>
              <Link
                href="/thiet-bi"
                className="inline-flex items-center gap-2 rounded-full border-2 border-sky-200 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 hover:bg-sky-50 transition-colors"
              >
                Xem toàn bộ catalog <ArrowRight className="size-4 text-[#0284c7]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Pricing Section with Left Category Nav */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PricingTableClient categories={categories} products={products} />
      </section>
    </main>
  );
}
