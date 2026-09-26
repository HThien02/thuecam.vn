import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts, getCategories, getBrands } from '@/lib/data';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { constructMetadata } from '@/lib/seo/metadata';
import { Sparkles, Filter } from 'lucide-react';

export const metadata: Metadata = constructMetadata({
  title: 'Cho Thuê Camera, Action Cam & Thiết Bị Quay Phim Chính Hãng | THUECAM',
  description:
    'Danh sách tổng hợp các dòng camera cho thuê giá từ 100K/ngày: DJI Pocket 4, Pocket 3, GoPro 13, Insta360 X4, flycam Mini 4 Pro, micro DJI Mic 2. Kiểm tra lịch trống ngay.',
  canonicalPath: '/thiet-bi',
});

export default async function EquipmentCatalogPage() {
  const products = await getProducts();
  const rentableCount = products.filter((product) => product.status === 'ACTIVE' && product.inventory_count > 0).length;
  const categories = await getCategories();
  const brands = await getBrands();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ name: 'Thiết bị', url: '/thiet-bi' }]} />

      {/* Header & H1 */}
      <div className="border-b border-sky-100 pb-6 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Toàn bộ thiết bị · {rentableCount} đang sẵn sàng cho thuê</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
          Danh Sách Thiết Bị Cho Thuê Chính Hãng
        </h1>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Danh mục hiển thị đầy đủ thiết bị của shop, kể cả máy đang tạm ngưng hoặc bảo trì. Tình trạng thuê được ghi rõ trên từng sản phẩm; chỉ máy sẵn sàng mới nhận đặt thuê.
        </p>
      </div>

      {/* Category Pills Filter */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Filter className="w-3.5 h-3.5 text-sky-700" />
          <span>Lọc nhanh theo danh mục chuyên dụng:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/thiet-bi"
            className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] text-white font-bold text-xs shadow-cute"
          >
            Tất cả ({products.length})
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/danh-muc/${cat.slug}`}
              className="px-3.5 py-1.5 rounded-xl bg-sky-50 border border-sky-100 hover:border-sky-300 text-slate-700 hover:text-[#0284c7] text-xs font-medium transition-colors"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Brand Pills */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-sky-100">
        <span className="text-xs text-slate-500 mr-2">Thương hiệu:</span>
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/thuong-hieu/${brand.slug}`}
            className="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-sky-700 text-xs transition-colors"
          >
            {brand.name}
          </Link>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* SEO Internal Link Pillar Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 to-white border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="badge-rental mb-1">Cẩm nang chuyên sâu</span>
          <h3 className="text-base font-bold text-slate-900">Bạn đang chuẩn bị đi du lịch?</h3>
          <p className="text-xs text-slate-600 mt-1">
            Xem ngay bảng tư vấn chọn máy phù hợp cho từng chuyến đi biển, phượt xe máy hay vi vu dạo phố.
          </p>
        </div>
        <Link
          href="/thue-camera-du-lich"
          className="px-5 py-2.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shrink-0 transition-colors"
        >
          Khám Phá Cẩm Nang Du Lịch
        </Link>
      </div>
    </div>
  );
}
