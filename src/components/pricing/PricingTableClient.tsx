'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category, Product } from '@/types';
import { ArrowRight, Check, CircleHelp, Sparkles, Calendar, Layers } from 'lucide-react';
import BookingModal from '../booking/BookingModal';

interface PricingTableClientProps {
  categories: Category[];
  products: Product[];
}

const formatPrice = (price: number) => `${Math.round(price / 1000)}K`;

export default function PricingTableClient({ categories, products }: PricingTableClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]?.slug || '');
  const [selectedProductForBooking, setSelectedProductForBooking] = useState<Product | null>(null);

  const activeProducts = products.filter((p) => p.status === 'ACTIVE');

  // Smooth scroll handler with offset for fixed header
  const scrollToCategory = (slug: string) => {
    setActiveCategory(slug);
    const element = document.getElementById(`category-${slug}`);
    if (element) {
      const headerOffset = 110;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (const cat of categories) {
        const el = document.getElementById(`category-${cat.slug}`);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveCategory(cat.slug);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [categories]);

  return (
    <>
      {/* Mobile Sticky Horizontal Category Selector */}
      <div className="lg:hidden sticky top-[72px] z-30 -mx-4 px-4 py-2.5 bg-white/95 backdrop-blur-md border-y border-sky-100 shadow-sm overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-black uppercase text-sky-800 shrink-0 flex items-center gap-1">
          <Layers className="size-3.5 text-[#0284c7]" /> Danh mục:
        </span>
        {categories.map((category) => {
          const count = activeProducts.filter((p) => p.category_id === category.id).length;
          if (count === 0) return null;
          const isActive = activeCategory === category.slug;
          return (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.slug)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-black transition-all ${
                isActive
                  ? 'bg-[#0284c7] text-white shadow-sm'
                  : 'bg-sky-50 text-slate-700 hover:bg-sky-100 hover:text-[#0284c7]'
              }`}
            >
              {category.name} ({count})
            </button>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* Left Sticky Category Menu */}
        <aside className="hidden lg:block h-fit rounded-[32px] border-2 border-sky-100 bg-white p-5 shadow-cute sticky top-28">
          <div className="flex items-center gap-2 px-2 pb-3 border-b border-sky-100">
            <Layers className="size-4 text-[#0284c7]" />
            <p className="text-xs font-black uppercase tracking-wider text-slate-800">
              Danh mục bảng giá
            </p>
          </div>
          <nav className="mt-3 flex flex-col gap-1.5">
            {categories.map((category) => {
              const count = activeProducts.filter((p) => p.category_id === category.id).length;
              if (count === 0) return null;
              const isActive = activeCategory === category.slug;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => scrollToCategory(category.slug)}
                  className={`w-full text-left rounded-2xl px-3.5 py-2.5 text-sm font-black transition-all flex items-center justify-between group ${
                    isActive
                      ? 'bg-[#0284c7] text-white shadow-md translate-x-1'
                      : 'bg-sky-50/60 text-slate-700 hover:bg-sky-100 hover:text-[#0284c7]'
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-white text-slate-500 group-hover:text-[#0284c7]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl bg-[#e0f2fe] p-3.5 text-xs leading-5 text-[#0369a1] border border-sky-200">
            <CircleHelp className="mb-1 size-4 text-[#0284c7]" />
            <strong className="block font-black text-slate-900">Cần tư vấn thiết bị?</strong>
            Nhận máy trực tiếp tại <strong>ETown Tân Bình</strong> hoặc ship tận tay trong 30 phút.
          </div>
        </aside>

        {/* Right Content Sections */}
        <div className="space-y-10">
          {categories.map((category) => {
            const categoryProducts = activeProducts.filter((product) => product.category_id === category.id);
            if (categoryProducts.length === 0) return null;

            return (
              <section
                key={category.id}
                id={`category-${category.slug}`}
                className="scroll-mt-28"
              >
                <div className="mb-3.5 flex items-end justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-0.5 text-[11px] font-black uppercase text-[#0284c7]">
                      <Sparkles className="size-3" /> Bảng giá dòng máy
                    </span>
                    <h2 className="mt-1 text-2xl font-black text-slate-900">{category.name}</h2>
                  </div>
                  <Link
                    href={`/danh-muc/${category.slug}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0284c7] hover:underline"
                  >
                    Xem chi tiết danh mục <ArrowRight className="size-3.5" />
                  </Link>
                </div>

                <div className="overflow-hidden rounded-[28px] border-2 border-sky-100 bg-white shadow-cute">
                  {/* Table Header */}
                  <div className="hidden grid-cols-[minmax(240px,1.6fr)_110px_repeat(3,95px)_120px] gap-3 bg-gradient-to-r from-sky-100/80 to-blue-50/60 px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-slate-700 md:grid border-b border-sky-100">
                    <span>Thiết bị</span>
                    <span>Giá theo ngày</span>
                    <span>1 ngày</span>
                    <span>3 ngày (-10%)</span>
                    <span>7+ ngày (-20%)</span>
                    <span className="text-right">Đặt thuê</span>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-sky-100">
                    {categoryProducts.map((product) => (
                      <div
                        key={product.id}
                        className="grid gap-3 p-4 transition-colors hover:bg-sky-50/50 md:grid-cols-[minmax(240px,1.6fr)_110px_repeat(3,95px)_120px] md:items-center md:px-5"
                      >
                        {/* Device Info */}
                        <div className="flex min-w-0 items-center gap-3">
                          <img
                            src={product.primary_image}
                            alt={product.name}
                            className="size-14 shrink-0 rounded-2xl border border-sky-100 bg-sky-50 object-cover"
                          />
                          <div className="min-w-0">
                            <Link
                              href={`/thiet-bi/${product.slug}`}
                              className="block truncate text-sm font-black text-slate-900 hover:text-[#0284c7]"
                            >
                              {product.name}
                            </Link>
                            <span className="text-xs text-slate-500 font-medium">
                              {product.inventory_count > 0 ? 'Tặng kèm thẻ nhớ + pin đầy' : 'Tạm hết máy · Kín lịch thuê'}
                            </span>
                          </div>
                        </div>

                        {/* Price badge */}
                        <div>
                          <span className="md:hidden text-xs text-slate-500 font-bold mr-1">Đơn giá:</span>
                          <span className="text-base font-black text-[#0284c7]">
                            {formatPrice(product.rental_price_per_day)}
                            <span className="text-[11px] font-bold text-slate-500">/ngày</span>
                          </span>
                        </div>

                        {/* Day breakdown */}
                        <div className="hidden text-sm font-bold text-slate-700 md:block">
                          {product.rental_price_per_day.toLocaleString('vi-VN')}đ
                        </div>
                        <div className="hidden text-sm font-bold text-slate-700 md:block">
                          {Math.round(product.rental_price_per_day * 0.9).toLocaleString('vi-VN')}đ
                        </div>
                        <div className="hidden text-sm font-bold text-emerald-600 md:block">
                          {Math.round(product.rental_price_per_day * 0.8).toLocaleString('vi-VN')}đ
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0 border-t md:border-0 border-sky-50">
                          <button
                            type="button"
                            onClick={() => setSelectedProductForBooking(product)}
                            disabled={product.inventory_count <= 0}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#0284c7] px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-[#0369a1] transition hover:scale-105 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none disabled:hover:scale-100"
                          >
                            <Calendar className="size-3" /> {product.inventory_count > 0 ? 'Thuê máy' : 'Kín lịch'}
                          </button>
                          <Link
                            href={`/thiet-bi/${product.slug}`}
                            className="text-xs font-bold text-slate-500 hover:text-[#0284c7] underline"
                          >
                            Chi tiết
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          })}

          {/* Guarantee Footer */}
          <div className="grid gap-4 rounded-[28px] border-2 border-sky-200 bg-sky-50/70 p-6 sm:grid-cols-3">
            {[
              'Giá minh bạch trọn gói, đã gồm phụ kiện',
              'Nhận máy tại ETown Tân Bình hoặc ship 30p',
              'H�� trợ test máy và hướng dẫn 1-1 miễn phí',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                <Check className="size-5 rounded-full bg-emerald-100 p-1 text-emerald-600 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal on Pricing Page */}
      {selectedProductForBooking && (
        <BookingModal
          product={selectedProductForBooking}
          isOpen={true}
          onClose={() => setSelectedProductForBooking(null)}
        />
      )}
    </>
  );
}
