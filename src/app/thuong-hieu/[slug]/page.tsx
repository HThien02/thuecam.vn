import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBrandBySlug, getBrands, getProductsByBrand } from '@/lib/data';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { constructMetadata } from '@/lib/seo/metadata';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    return constructMetadata({
      title: 'Không Tìm Thấy Thương Hiệu | THUECAM',
      noindex: true,
    });
  }

  return constructMetadata({
    title: brand.seo_title || `Thuê Thiết Bị ${brand.name} Chính Hãng | THUECAM`,
    description: brand.seo_description || brand.description,
    canonicalPath: `/thuong-hieu/${brand.slug}`,
    noindex: !brand.indexable,
  });
}

export default async function BrandDetailPage({ params }: Props) {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);

  if (!brand) {
    notFound();
  }

  const products = await getProductsByBrand(brand.slug);
  const allBrands = await getBrands();

  const breadcrumbItems = [
    { name: 'Thiết bị', url: '/thiet-bi' },
    { name: brand.name, url: `/thuong-hieu/${brand.slug}` },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header & H1 */}
      <div className="border-b border-white/10 pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hệ sinh thái chính hãng</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
          Cho Thuê Thiết Bị {brand.name} Chính Hãng
        </h1>

        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          {brand.description}
        </p>

        {/* Other brands */}
        <div className="flex flex-wrap gap-2 pt-2">
          {allBrands.map((b) => (
            <Link
              key={b.id}
              href={`/thuong-hieu/${b.slug}`}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                b.slug === brand.slug
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {b.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Products list */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-black">
          Các Dòng Máy {brand.name} Sẵn Hàng Cho Thuê ({products.length} máy)
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 text-sm">
            Hiện tại các model thuộc thương hiệu {brand.name} đang được bổ sung vào kho. Vui lòng liên hệ hotline 0901.234.567 để đặt trước.
          </div>
        )}
      </div>
    </div>
  );
}
