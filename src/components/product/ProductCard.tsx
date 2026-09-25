import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Sparkles, ArrowRight } from 'lucide-react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function formatVND(amount: number) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group rounded-[28px] overflow-hidden card-hover flex flex-col bg-white border-2 border-sky-100 shadow-cute">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sky-50/60">
        <Image
          src={product.primary_image}
          alt={`${product.name} cho thuê tại THUECAM`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="badge-rental shadow-sm">
            <Sparkles className="w-3 h-3 text-[#0284c7]" />
            Cho Thuê
          </span>
          {product.brand && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 text-slate-700 backdrop-blur-md shadow-sm border border-sky-100">
              {product.brand.name}
            </span>
          )}
          {product.inventory_count <= 0 && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100/95 text-amber-900 backdrop-blur-md shadow-sm border border-amber-200">
              Full lịch thuê
            </span>
          )}
        </div>

        {/* Rating badge */}
        {product.rating && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-amber-500 text-xs font-bold shadow-sm border border-amber-100">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{product.rating}</span>
            {product.review_count && (
              <span className="text-slate-400 text-[10px]">({product.review_count})</span>
            )}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Category Tag */}
          {product.category && (
            <Link
              href={`/danh-muc/${product.category.slug}`}
              className="text-[11px] font-extrabold text-[#0284c7] hover:text-[#0369a1] uppercase tracking-wider block mb-1"
            >
              {product.category.name}
            </Link>
          )}

          {/* Product Title */}
          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#0284c7] transition-colors line-clamp-1">
            <Link href={`/thiet-bi/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Excerpt */}
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {product.excerpt}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-sky-100 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Giá thuê ngày:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-black text-[#0284c7]">
                {formatVND(product.rental_price_per_day)}
              </span>
              <span className="text-xs text-slate-500 font-bold">/ngày</span>
            </div>
          </div>

          <Link
            href={`/thiet-bi/${product.slug}`}
            className="px-4 py-2 rounded-full bg-sky-50 text-[#0284c7] group-hover:bg-gradient-candy group-hover:text-white text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-sm group-hover:shadow-cute"
            aria-label={product.inventory_count > 0 ? `Xem chi tiết và thuê ${product.name}` : `Xem chi tiết ${product.name}; hiện đang kín lịch`}
          >
            <span>{product.inventory_count > 0 ? 'Thuê Ngay' : 'Xem Chi Tiết'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
